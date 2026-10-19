import React,{useId} from 'react';
import {defineRegistry,useBoundProp} from '@json-render/react';
import {catalog} from './catalog.js';
function Field({label,children}){const id=useId();return <label className="jr-field" htmlFor={id}><span>{label}</span>{children(id)}</label>}
function Input({props,bindings,emit,type}){const [value,set]=useBoundProp(props.value,bindings?.value);return <Field label={props.label}>{id=><input id={id} type={type} value={value??''} min={props.min} max={props.max} step={props.step??'any'} placeholder={props.placeholder} onChange={e=>{set(type==='number'&&e.target.value!==''?Number(e.target.value):e.target.value);emit('change')}}/>}</Field>}
export const {registry}=defineRegistry(catalog,{components:{
 Stack:({children})=><div className="jr-stack">{children}</div>,
 Section:({props,children})=><section className="jr-section">{props.title&&<h3>{props.title}</h3>}{children}</section>,
 ActionRow:({children})=><div className="jr-actions">{children}</div>,
 Metrics:({children})=><dl className="jr-metrics">{children}</dl>,
 Metric:({props})=><div><dt>{props.label}</dt><dd>{props.value}{props.suffix&&<small> {props.suffix}</small>}</dd></div>,
 Text:({props})=><p className={`jr-text ${props.tone??'body'}`}>{props.text}</p>,
 Equation:({props})=><div className="jr-equation">{props.text}</div>,
 Status:({props})=><div role="status" className="jr-status" hidden={!props.text}>{props.text}</div>,
 Progress:({props})=><label className="jr-progress">{props.label}<progress value={props.value} max={props.max}/></label>,
 NumberField:p=><Input {...p} type="number"/>,TextField:p=><Input {...p} type="text"/>,
 SelectField:({props,bindings,emit})=>{const [value,set]=useBoundProp(props.value,bindings?.value);return <Field label={props.label}>{id=><select id={id} value={value} onChange={e=>{set(e.target.value);emit('change')}}>{props.options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>}</Field>},
 SliderField:({props,bindings,emit})=>{const [value,set]=useBoundProp(props.value,bindings?.value);return <Field label={props.label}>{id=><div className="jr-slider"><output htmlFor={id}>{value}</output><input id={id} type="range" value={value} min={props.min} max={props.max} step={props.step} onChange={e=>{set(Number(e.target.value));emit('change')}}/></div>}</Field>},
 SwitchField:({props,bindings,emit})=>{const [checked,set]=useBoundProp(props.checked,bindings?.checked);return <Field label={props.label}>{id=><input id={id} type="checkbox" role="switch" checked={checked} onChange={e=>{set(e.target.checked);emit('change')}}/>}</Field>},
 Button:({props,emit})=><button type="button" className={`jr-button ${props.variant??'secondary'}`} disabled={props.disabled} onClick={()=>emit('press')}>{props.label}</button>,
 Separator:()=> <hr className="jr-separator"/>
},actions:{invoke:async()=>{throw new Error('A lesson action handler is required')}}});
