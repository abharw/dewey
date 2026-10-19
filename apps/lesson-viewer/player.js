import interBytes from './viewer/fonts/InterVariable.woff2';
const font=new FontFace('Inter',interBytes,{weight:'100 900'});
font.load().then(face=>document.fonts.add(face)).catch(()=>{});
import {App} from '@modelcontextprotocol/ext-apps';
import {mountLesson} from './viewer/mount.js';
const app=new App({name:'Dewey lessons',version:'0.3.0'});
const root=document.querySelector('#lesson-root'),status=document.querySelector('#host-status'),share=document.querySelector('#share-lesson'),title=document.querySelector('#lesson-title');
let current,lesson,queue=Promise.resolve();
document.addEventListener('securitypolicyviolation',event=>{if(event.effectiveDirective==='media-src')status.textContent='Video blocked by host policy. Reconnect the dewey-lessons server to load its media permissions.'});
app.ontoolresult=result=>{queue=queue.then(async()=>{
 share.disabled=true;
 if(result.isError){status.textContent=result.content?.[0]?.text??'Lesson unavailable';return}
 if(typeof result._meta?.lessonHtml!=='string'){status.textContent='The host did not deliver the lesson artifact.';return}
 lesson?.dispose();lesson=null;current=result.structuredContent;title.textContent=current.title;status.textContent='Loading lesson…';
 const host=document.createElement('div');root.replaceChildren(host);
 try{lesson=await mountLesson(host,result._meta.lessonHtml,current);share.disabled=false;status.textContent=''}catch(error){status.textContent=`Could not open lesson: ${error.message}`}
 }).catch(error=>{status.textContent=error.message});return queue};
share.addEventListener('click',async()=>{share.disabled=true;try{await app.updateModelContext({content:[{type:'text',text:JSON.stringify({lesson:current?.id,...lesson.snapshot()})}]});status.textContent='Snapshot shared. Ask the assistant about your result.'}catch{status.textContent='This host could not receive the snapshot.'}finally{share.disabled=false}});
window.addEventListener('pagehide',()=>lesson?.dispose());
app.connect().catch(()=>status.textContent='Could not connect to this chat host.');
document.querySelector('#fullscreen-lesson').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{status.textContent='Fullscreen is unavailable here. Expand the lesson card instead.'}});
