import {defineCatalog} from '@json-render/core';
import {schema} from '@json-render/react/schema';
import {z} from 'zod';
const text=z.string(), optional=text.optional();
const component=(props,description,slots)=>({props:z.object(props).strict(),description,...(slots?{slots:['default']}:{})});
export const catalog=defineCatalog(schema,{
 components:{
  Stack:component({},'Vertical related content. Shared spacing; never add blank spacers.',true),
  Section:component({title:optional},'A semantic group. Omit title when context is obvious.',true),
  ActionRow:component({},'Related actions on one wrapping row. At most one primary action.',true),
  Metrics:component({},'One to three related measurements, equal columns.',true),
  Metric:component({label:text,value:z.union([text,z.number()]),suffix:optional},'One measurement with a quiet label.'),
  Text:component({text:text,tone:z.enum(['body','muted']).optional()},'Short explanation. Do not repeat visible measurements.'),
  Equation:component({text:text},'A mathematical expression rendered as text; no HTML.'),
  Status:component({text:text},'Live result beside the action that caused it. Empty text is hidden.'),
  Progress:component({label:text,value:z.number(),max:z.number().positive()},'Determinate progress with an accessible label.'),
  NumberField:component({label:text,value:z.union([z.number(),text]),min:z.number().optional(),max:z.number().optional(),step:z.number().optional(),placeholder:optional},'Labeled numeric input. Bind value to an /inputs path.'),
  TextField:component({label:text,value:text,placeholder:optional},'Labeled single-line text input. Bind value to an /inputs path.'),
  SelectField:component({label:text,value:text,options:z.array(z.object({label:text,value:text}).strict()).min(1)},'Labeled selector. Bind value to an /inputs path.'),
  SliderField:component({label:text,value:z.number(),min:z.number(),max:z.number(),step:z.number().positive()},'Continuous parameter with value readout. Bind value to an /inputs path.'),
  SwitchField:component({label:text,checked:z.boolean()},'Boolean setting. Bind checked to an /inputs path.'),
  Button:component({label:text,variant:z.enum(['primary','secondary','ghost']).optional(),disabled:z.boolean().optional()},'Named runtime action. Use on.press → invoke; parameters come from bound state.'),
  Separator:component({},'Separate distinct groups; not every row.')
 },
 actions:{invoke:{params:z.object({name:text,args:z.record(text,z.unknown()).optional()}).strict(),description:'Invoke a named action declared by this lesson runtime. No code or DOM selectors.'}}
});
export const panelSchema=z.object({version:z.literal(1),tabs:z.array(z.object({id:z.string().regex(/^[a-z][a-z-]*$/),label:z.string().min(1).max(20),spec:z.unknown()}).strict()).min(1).max(3)}).strict();
export function validatePanel(input,allowedActions){
 const panel=panelSchema.parse(input);const ids=new Set();
 for(const tab of panel.tabs){
  if(ids.has(tab.id))throw new Error('Duplicate tab id');ids.add(tab.id);
  const result=catalog.validate(tab.spec);if(!result.success)throw new Error(`Invalid ${tab.id}: ${JSON.stringify(result.error)}`);
  const seen=new Set();
  function visit(id){
   if(seen.has(id))throw new Error("Panel tree contains duplicate reference or cycle");seen.add(id);
   const node=tab.spec.elements[id];
   if(!node||typeof node!=='object'||!catalog.data.components[node.type])throw new Error('Unknown panel component');
   const shape=catalog.data.components[node.type].props.shape;
   for(const key of Object.keys(node.props))if(!(key in shape))throw new Error(`Unsupported prop: ${key}`);
   for(const [key,rule] of Object.entries(shape)){
    const value=node.props[key];
    const dynamic=value&&typeof value==='object'&&('$state' in value||'$bindState' in value);
    if(dynamic){
     const entries=Object.entries(value);
     if(entries.length!==1||typeof entries[0][1]!=='string'||!/^\/(?!.*(?:__proto__|constructor|prototype))(?:[a-zA-Z0-9_-]+\/?)+$/.test(entries[0][1]))throw new Error('Invalid state binding');
    }else if(!rule.safeParse(value).success)throw new Error(`Invalid prop: ${node.type}.${key}`);
   }
   for(const key of Object.keys(node))if(!['type','props','children','on'].includes(key))throw new Error(`Unsupported element key: ${key}`);
   function expressions(value){if(!value||typeof value!=='object')return;for(const [key,v] of Object.entries(value)){if(key.startsWith('$')&&!['$state','$bindState'].includes(key))throw new Error(`Unsupported expression ${key}`);if(key==='$bindState'&&!String(v).startsWith('/inputs/'))throw new Error('Only /inputs can be written');expressions(v)}}
   expressions(node.props);
   for(const [event,binding] of Object.entries(node.on??{})){
    if(!['press','change'].includes(event)||binding.action!=='invoke'||!allowedActions.includes(binding.params?.name))throw new Error(`Unknown action in ${tab.id}`);
    expressions(binding.params);
   }
   node.children?.forEach(visit);
  }
  visit(tab.spec.root);
  if(seen.size!==Object.keys(tab.spec.elements).length)throw new Error("Unreachable panel elements");
 }
 return panel;
}
