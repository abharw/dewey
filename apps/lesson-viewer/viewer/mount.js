import {createStateStore} from '@json-render/react';
import styles from './lesson.css';
import {mountPanel} from './panel/render.jsx';
import {createPanelAdapter} from './panel/adapters.js';
import {panels} from '../panels/index.js';
import {mediaPlayer} from './media-player.js';

// The shadow boundary isolates lesson CSS. It is not a security sandbox: artifacts
// are trusted local code. The document facade scopes the original Anatomy runtime.
export async function mountLesson(host, html, info) {
 const root=host.attachShadow({mode:'open'}), parsed=new DOMParser().parseFromString(html,'text/html');
 const sources=[...parsed.querySelectorAll('script')];sources.forEach(s=>s.remove());
 const workspace=document.createElement('div');workspace.className='workspace';
 workspace.innerHTML='<aside id="explore-panel" class="floating collapsed" role="dialog" aria-label="Explore lesson" inert><div class="panel-heading"><div class="panel-tabs" role="tablist" aria-label="Explore lesson"></div><button class="collapse" aria-label="Close Explore panel">×</button></div><div class="panel-body"></div></aside><div class="canvas"></div>';
 root.append(workspace);const panel=document.createElement('div'),canvas=root.querySelector('.canvas');panel.className='legacy-controls';panel.hidden=true;root.append(panel);
 const state={teachingPanel:Object.freeze({createStateStore})},abort=new AbortController(),frames=new Set(),observers=new Set(),cleanups=[];
 const doc=new Proxy(document,{get(target,key){if(key==='querySelector'||key==='querySelectorAll')return root[key].bind(root);if(key==='activeElement')return root.activeElement;if(key==='addEventListener')return (name,fn,options={})=>target.addEventListener(name,fn,{...(typeof options==='boolean'?{capture:options}:options),signal:abort.signal});const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value}});
 const scopedWindow=new Proxy(window,{get(target,key){return key in state?state[key]:Reflect.get(target,key,target)},set(target,key,value){state[key]=value;return true}});
 const runtime={document:doc,window:scopedWindow,requestAnimationFrame(fn){const id=requestAnimationFrame(t=>{frames.delete(id);fn(t)});frames.add(id);return id},cancelAnimationFrame(id){frames.delete(id);cancelAnimationFrame(id)},IntersectionObserver:class extends IntersectionObserver{constructor(...args){super(...args);observers.add(this)}},matchMedia(query){const media=matchMedia(query);return new Proxy(media,{get(target,key){if(key==='addEventListener')return (name,fn)=>target.addEventListener(name,fn,{signal:abort.signal});const v=Reflect.get(target,key,target);return typeof v==='function'?v.bind(target):v}})}};
 const originalStyles=[...parsed.head.querySelectorAll('style')];
 if(info.kind==='interactive'&&parsed.querySelector('.iso-figure')){
  // Keep Anatomy palette, SVG and live controls. Replace only the page furniture.
  canvas.classList.add('iso');canvas.dataset.theme=parsed.body.dataset.theme??'light';
  root.prepend(originalStyles[0].cloneNode(true));
  canvas.append(parsed.querySelector('.iso-figure'));
  panel.append(parsed.querySelector('.experiment'));
 }else if(info.kind==='video'){
  const main=parsed.querySelector('main'),video=main.querySelector('video');canvas.append(video,main.querySelector('#media-status'));
  const explanation=[...main.children].find(el=>el.tagName==='P'&&el.textContent.includes('silent animation'));
  if(explanation){explanation.className='video-explanation';main.querySelector('details').append(explanation);}
  panel.append(main.querySelector('details'),main.querySelector('section'));
 }else {
  // Arbitrary SVG, canvas, WebGL or HTML can share the same shell.
  const controls=parsed.querySelector('[data-lesson-panel]');if(controls)panel.append(controls);
  const content=parsed.querySelector('[data-lesson-canvas]');
  canvas.append(...(content?[content]:[...parsed.body.childNodes]));
  root.prepend(...originalStyles.map(s=>s.cloneNode(true)));
 }
 const css=document.createElement('style');css.textContent=styles;root.append(css);
 const key=`lesson_${crypto.randomUUID().replaceAll('-','')}`;window[key]=runtime;
 function dispose(){abort.abort();frames.forEach(cancelAnimationFrame);observers.forEach(o=>o.disconnect());cleanups.forEach(fn=>fn());state.teachingLesson?.dispose?.();delete window[key];host.remove()}
 try{
  for(const source of sources){
   if(source.src)throw new Error('Lesson scripts must be bundled inline');
   const script=document.createElement('script');script.type='module';
   const ready=`${key}_ready`;
   script.textContent=`const {document,window,requestAnimationFrame,cancelAnimationFrame,IntersectionObserver,matchMedia}=globalThis[${JSON.stringify(key)}];\ntry {\n${source.textContent}\n globalThis.dispatchEvent(new CustomEvent(${JSON.stringify(ready)}));\n}catch(error){globalThis.dispatchEvent(new CustomEvent(${JSON.stringify(ready)},{detail:error.message}));}`;
   await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{window.removeEventListener(ready,done);reject(new Error('Lesson initialization timed out'))},10000);function done(e){clearTimeout(timer);e.detail?reject(new Error(e.detail)):resolve()}window.addEventListener(ready,done,{once:true});root.append(script)});
  }
  if(info.kind==='video')cleanups.push(mediaPlayer(root.querySelector('video'),canvas,root.querySelector('#media-status')));
  const adapter=state.teachingLesson?.panelRuntime??createPanelAdapter(info.id,root,state);
  const panelSpec=state.teachingLesson?.panelSpec??panels[info.id];
  cleanups.unshift(mountPanel(root,document.querySelector('#explore-lesson'),panelSpec,adapter));
  return {snapshot:()=>state.teachingLesson?.snapshot?.()??{},dispose};
 }catch(error){dispose();throw error}
}
