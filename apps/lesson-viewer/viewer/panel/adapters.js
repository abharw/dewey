import {createStateStore} from '@json-render/react';
const adapters={
 'token-bucket':(root,state)=>{
  const store=createStateStore({inputs:{burstSize:'25'},tokens:'20.00',accepted:0,rejected:0,result:'',mode:'Demo running',demoLabel:'Stop demo',pauseLabel:'Pause'});
  const click=id=>root.querySelector(`#${id}`).click();
  const actions={sendOne:()=>click('single'),sendBurst:()=>{const input=root.querySelector('#burst-size');input.value=store.get('/inputs/burstSize');click('burst')},reset:()=>click('reset'),togglePause:()=>click('pause'),toggleDemo:()=>click('demo'),setBurst:()=>{const input=root.querySelector('#burst-size');input.value=store.get('/inputs/burstSize');input.dispatchEvent(new Event('change'))},tryBurst:()=>{click('reset');store.set('/inputs/burstSize','25');root.querySelector('#burst-size').value='25';click('burst')}};
  function refresh(){const s=state.tokenBucket.snapshot();const values={tokens:s.tokens.toFixed(2),accepted:s.accepted,rejected:s.rejected,result:root.querySelector('#status').textContent,mode:s.demo?'Demo running':'Manual experiment',demoLabel:s.demo?'Stop demo':'Run demo',pauseLabel:s.paused?'Resume':'Pause'};for(const [key,value]of Object.entries(values))if(store.get('/'+key)!==value)store.set('/'+key,value);const burst=root.querySelector('#burst-size').value;if(store.get('/inputs/burstSize')!==burst)store.set('/inputs/burstSize',burst)}
  refresh();const timer=setInterval(refresh,100);return{store,actions,refresh,dispose:()=>clearInterval(timer)};
 },
 derivative:(root,state)=>{
  const video=root.querySelector('video'),store=createStateStore({inputs:{answer:'',speed:'1',volume:1},playLabel:'Play',muteLabel:'Mute',feedback:''});
  const actions={togglePlayback:()=>root.querySelector('.media-controls button').click(),restart:()=>{video.currentTime=0},setSpeed:()=>{video.playbackRate=Number(store.get('/inputs/speed'))},setVolume:()=>{video.volume=Number(store.get('/inputs/volume'));video.muted=video.volume===0},toggleMute:()=>{video.muted=!video.muted},toggleNative:()=>{video.controls=!video.controls},checkAnswer:()=>{const value=store.get('/inputs/answer');if(value===''||!Number.isFinite(Number(value))){store.set('/feedback','Enter a number first.');return}root.querySelector('#answer').value=value;root.querySelector('#prediction').dispatchEvent(new Event('submit',{cancelable:true}));store.set('/feedback',root.querySelector('#feedback').textContent)}};
  function refresh(){store.set('/playLabel',video.paused?'Play':'Pause');store.set('/muteLabel',video.muted?'Unmute':'Mute');store.set('/inputs/speed',String(video.playbackRate));store.set('/inputs/volume',video.volume)}
  const abort=new AbortController();for(const event of ['play','pause','volumechange','ratechange'])video.addEventListener(event,refresh,{signal:abort.signal});refresh();return{store,actions,refresh,dispose:()=>abort.abort()};
 }
};
export function createPanelAdapter(id,root,state){const create=adapters[id];if(!create)throw new Error(`No panel adapter registered for ${id}`);return create(root,state)}
export const actionNames={ 'token-bucket':['sendOne','sendBurst','reset','togglePause','toggleDemo','setBurst','tryBurst'],derivative:['togglePlayback','restart','setSpeed','setVolume','toggleMute','toggleNative','checkAnswer']};
