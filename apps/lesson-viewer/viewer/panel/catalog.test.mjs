import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePanel} from './catalog.js';
import {panels} from '../../panels/index.js';
import {actionNames} from './adapters.js';
const example=()=>({version:1,tabs:[{id:'controls',label:'Controls',spec:{root:'root',elements:{root:{type:'Stack',props:{},children:['field','progress','switch','action']},field:{type:'TextField',children:[],props:{label:'Name',value:{$bindState:'/inputs/name'}}},progress:{type:'Progress',children:[],props:{label:'Progress',value:{$state:'/progress'},max:100}},switch:{type:'SwitchField',children:[],props:{label:'Show labels',checked:{$bindState:'/inputs/labels'}}},action:{type:'Button',children:[],props:{label:'Apply'},on:{press:{action:'invoke',params:{name:'apply'}}}}}}}]});
test('both migrated lessons satisfy catalog and runtime contracts',()=>{for(const [id,panel]of Object.entries(panels))assert.doesNotThrow(()=>validatePanel(panel,actionNames[id]));});
test('unrelated lesson can compose text, progress and switch primitives',()=>assert.doesNotThrow(()=>validatePanel(example(),['apply'])));
for(const [name,mutate]of Object.entries({
 'unknown component':p=>p.tabs[0].spec.elements.field.type='CustomHTML',
 'arbitrary styling':p=>p.tabs[0].spec.elements.field.props.style='color:red',
 'read-only state write':p=>p.tabs[0].spec.elements.field.props.value={$bindState:'/progress'},
 'unsupported expression':p=>p.tabs[0].spec.elements.field.props.value={$eval:'alert(1)'},
 'unknown action':p=>p.tabs[0].spec.elements.action.on.press.params.name='deleteEverything',
 'duplicate tabs':p=>p.tabs.push(p.tabs[0]),
 'cycle':p=>p.tabs[0].spec.elements.root.children.push('root'),
 'unreachable node':p=>p.tabs[0].spec.elements.orphan={type:'Text',children:[],props:{text:'Lost'}},
 'arbitrary element metadata':p=>p.tabs[0].spec.elements.field.className='giant'
}))test(`rejects ${name}`,()=>{const p=example();mutate(p);assert.throws(()=>validatePanel(p,['apply']));});
