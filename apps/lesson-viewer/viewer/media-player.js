// Adapted from Osmo Media Setup: mount cleanup, visibility and user playback intent.
export function mediaPlayer(video, container, status) {
 const abort=new AbortController(), signal=abort.signal;
 const controls=document.createElement('div');controls.className='media-controls';
 controls.innerHTML='<button type="button" aria-label="Play video">Play</button><input type="range" min="0" max="100" value="0" step="0.01" aria-label="Seek video"><output>0:00 / 0:00</output><select aria-label="Playback speed"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select><button type="button" aria-label="Mute audio">Mute</button>';
 container.append(controls);video.controls=false;
 const [play,seek,time,speed,mute]=controls.children;
 const extra=document.createElement('div');extra.className='media-options';
 extra.innerHTML='<label>Volume <input aria-label="Audio volume" type="range" min="0" max="1" step="0.05" value="1"></label><button type="button">Fullscreen</button><button type="button">Browser controls</button>';
 extra.hidden=true;container.append(extra);
 const volume=extra.querySelector('input'),[fullscreen,native]=extra.querySelectorAll('button');
 let wanted=false,visible=true;
 const on=(target,event,fn)=>target.addEventListener(event,fn,{signal});
 const clock=n=>`${Math.floor((n||0)/60)}:${String(Math.floor((n||0)%60)).padStart(2,'0')}`;
 function sync(){speed.value=String(video.playbackRate);volume.value=String(video.volume);play.textContent=video.paused?'Play':'Pause';play.setAttribute('aria-label',`${video.paused?'Play':'Pause'} video`);seek.max=Number.isFinite(video.duration)?video.duration:0;seek.value=video.currentTime;time.textContent=`${clock(video.currentTime)} / ${clock(video.duration)}`;mute.textContent=video.muted?'Unmute':'Mute';mute.setAttribute('aria-label',`${video.muted?'Unmute':'Mute'} audio`)}
 async function resume(){if(!wanted||!visible||document.hidden)return;try{await video.play()}catch{wanted=false;status.textContent='Playback could not start. Press Play to try again.';sync()}}
 on(volume,'input',()=>{video.volume=Number(volume.value);video.muted=video.volume===0;sync()});
 on(fullscreen,'click',async()=>{try{await container.requestFullscreen()}catch{status.textContent='Fullscreen is unavailable in this host. Expand the lesson card instead.'}});
 on(native,'click',()=>{video.controls=!video.controls;native.textContent=video.controls?'Hide browser controls':'Browser controls'});
 on(play,'click',()=>{wanted=video.paused;if(wanted)resume();else video.pause()});
 on(seek,'input',()=>{video.currentTime=Number(seek.value);sync()});on(speed,'change',()=>{video.playbackRate=Number(speed.value)});on(mute,'click',()=>{video.muted=!video.muted;sync()});
 for(const event of ['play','pause','timeupdate','loadedmetadata','volumechange','ratechange'])on(video,event,sync);
 on(video,'loadedmetadata',()=>{if(video.currentTime===0)video.currentTime=Math.min(1,video.duration/2)});
 on(video,'ended',()=>{wanted=false;sync()});on(video,'waiting',()=>status.textContent='Buffering…');on(video,'playing',()=>status.textContent='');on(video,'error',()=>{wanted=false;status.textContent='Video could not load in this host.'});
 on(document,'visibilitychange',()=>{if(document.hidden)video.pause();else resume()});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else video.pause()});observer.observe(video);sync();
 return ()=>{wanted=false;abort.abort();observer.disconnect();video.pause();const src=video.src;video.removeAttribute('src');video.load();if(src.startsWith('blob:'))URL.revokeObjectURL(src);controls.remove();extra.remove()};
}
