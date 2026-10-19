import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {Client} from '@modelcontextprotocol/client';
import {StdioClientTransport} from '@modelcontextprotocol/client/stdio';
import {transform} from 'esbuild';
const client=new Client({name:'lesson-test',version:'1.0.0'});
try {
 await client.connect(new StdioClientTransport({command:process.execPath,args:[fileURLToPath(new URL('./server.mjs',import.meta.url))]}));
 const {tools}=await client.listTools();
 assert.deepEqual(tools.map(t=>t.name).sort(),['list_lessons','show_lesson']);
 const catalog=await client.callTool({name:'list_lessons',arguments:{}});
 assert.equal(JSON.parse(catalog.content[0].text).length,2);
 const resource=await client.readResource({uri:tools.find(t=>t.name==='show_lesson')._meta.ui.resourceUri});
 assert.equal(resource.contents[0].mimeType,'text/html;profile=mcp-app');
 assert.deepEqual(resource.contents[0]._meta.ui.csp.resourceDomains,['blob:']);
 await mkdir(new URL('./work/',import.meta.url),{recursive:true});
 for(const id of ['token-bucket','derivative']) {
  const result=await client.callTool({name:'show_lesson',arguments:{lesson_id:id}});
  assert.ok(!result.isError);assert.equal(result.structuredContent.id,id);
  assert.ok(result._meta.lessonHtml.includes('window.teachingLesson'));
  if(id==='token-bucket') {
   const original=await readFile(new URL('./lessons/token-bucket.html',import.meta.url),'utf8');
   const drawing=html=>html.match(/<g id="mechanism">[\s\S]*?<\/svg>/)[0];
   assert.equal(drawing(result._meta.lessonHtml),drawing(original),'preserve original SVG geometry');
   for(const control of ['single','burst','reset','pause','demo','burst-size','announcement'])assert.ok(result._meta.lessonHtml.includes(`id="${control}"`));
  }
  if(id==='derivative')assert.ok(result._meta.lessonHtml.includes('data:video/mp4;base64,'));
  for(const html of [result._meta.lessonHtml,resource.contents[0].text])for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))await transform(m[1],{loader:'js'});
  await writeFile(new URL(`./work/${id}.json`,import.meta.url),JSON.stringify(result));
 }
 assert.equal((await client.callTool({name:'show_lesson',arguments:{lesson_id:'../../secrets'}})).isError,true);
 console.log('PASS: discovery, both lessons, viewer resource, script syntax, invalid ID rejection');
}finally{await client.close();}
