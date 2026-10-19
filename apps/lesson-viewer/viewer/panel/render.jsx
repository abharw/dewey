import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {JSONUIProvider,Renderer} from '@json-render/react';
import {registry} from './registry.jsx';
import {validatePanel} from './catalog.js';
export function mountPanel(root,trigger,spec,adapter){
 validatePanel(spec,Object.keys(adapter.actions));
 const floating=root.querySelector('.floating');floating.innerHTML='';
 const reactRoot=createRoot(floating),abort=new AbortController();
 function close(){floating.classList.add('collapsed');floating.inert=true;trigger.setAttribute('aria-expanded','false');trigger.focus()}
 function Panel(){const [active,setActive]=useState(spec.tabs[0].id);return <JSONUIProvider registry={registry} store={adapter.store} handlers={{invoke:async({name,args})=>{const action=adapter.actions[name];if(!action)throw new Error(`Unknown lesson action ${name}`);try{await action(args??{});adapter.refresh?.()}catch(e){adapter.store.set('/feedback',e.message)}}}}><div className="panel-heading"><div className="panel-tabs" role="tablist" aria-label="Explore lesson">{spec.tabs.map((tab,index)=><button key={tab.id} id={`tab-${tab.id}`} role="tab" aria-selected={active===tab.id} aria-controls={`view-${tab.id}`} tabIndex={active===tab.id?0:-1} onClick={()=>setActive(tab.id)} onKeyDown={e=>{let next;if(e.key==='ArrowRight')next=(index+1)%spec.tabs.length;if(e.key==='ArrowLeft')next=(index+spec.tabs.length-1)%spec.tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=spec.tabs.length-1;if(next!==undefined){e.preventDefault();setActive(spec.tabs[next].id);root.querySelector(`#tab-${spec.tabs[next].id}`).focus()}}}>{tab.label}</button>)}</div><button className="collapse" aria-label="Close Explore panel" onClick={close}>×</button></div><div className="panel-body jr-panel">{spec.tabs.map(tab=><div key={tab.id} id={`view-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`} hidden={active!==tab.id}><Renderer spec={tab.spec} registry={registry}/></div>)}</div></JSONUIProvider>}
 reactRoot.render(<Panel/>);trigger.disabled=false;trigger.setAttribute('aria-expanded','false');
 trigger.addEventListener('click',()=>{if(!floating.classList.contains('collapsed'))return close();floating.classList.remove('collapsed');floating.inert=false;trigger.setAttribute('aria-expanded','true');requestAnimationFrame(()=>root.querySelector('[role=tab][aria-selected=true]')?.focus())},{signal:abort.signal});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!floating.classList.contains('collapsed'))close()},{signal:abort.signal});
 return ()=>{abort.abort();reactRoot.unmount();adapter.dispose?.();trigger.disabled=true;trigger.setAttribute('aria-expanded','false')};
}
