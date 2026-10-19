import { readFile } from 'node:fs/promises';
import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { registerAppTool, registerAppResource, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import { z } from 'zod';
import { createHash } from 'node:crypto';
const server = new McpServer({ name: 'dewey-lessons', version: '0.2.0' });
const revision=createHash('sha256').update(await readFile(new URL('./dist/player.html',import.meta.url))).digest('hex').slice(0,12);
const uri = `ui://dewey-lessons/lesson-player-${revision}.html`;
const catalog = async () => JSON.parse(await readFile(new URL('./lessons.json', import.meta.url), 'utf8'));
server.registerTool('list_lessons', { description: 'List the locally prepared lessons.', inputSchema: z.object({}), annotations: { readOnlyHint: true, openWorldHint: false } }, async () => ({ content: [{ type: 'text', text: JSON.stringify((await catalog()).map(({file,...lesson})=>lesson)) }] }));
registerAppTool(server, 'show_lesson', {
  title: 'Open lesson',
  description: 'Show a prepared interactive or video lesson in chat. Use list_lessons to find IDs. This presents existing artifacts; it does not generate or render new lessons.',
  inputSchema: z.object({ lesson_id: z.string() }),
  annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  _meta: { ui: { resourceUri: uri } },
}, async ({lesson_id}) => {
  const lesson = (await catalog()).find(item=>item.id===lesson_id);
  if (!lesson) return { isError: true, content: [{ type:'text', text:'Unknown lesson. Call list_lessons for available IDs.' }] };
  if (!/^[a-z0-9-]+\.html$/.test(lesson.file)) throw new Error('Invalid catalog artifact filename');
  try {
    const html = await readFile(new URL(`./dist/${lesson.file}`, import.meta.url), 'utf8');
    const {file,...info}=lesson;
    return { content:[{type:'text',text:`${lesson.title}: ${lesson.summary}`}], structuredContent:info, _meta:{lessonHtml:html} };
  } catch (error) {
    if(error.code!=='ENOENT') throw error;
    return {isError:true,content:[{type:'text',text:'This lesson has not been built. Run its documented build command before opening it.'}]};
  }
});
registerAppResource(server,'lesson-player',uri,{mimeType:RESOURCE_MIME_TYPE},async()=>({contents:[{uri,mimeType:RESOURCE_MIME_TYPE,_meta:{ui:{csp:{resourceDomains:['blob:']}}},text:await readFile(new URL('./dist/player.html',import.meta.url),'utf8')}]}));
await server.connect(new StdioServerTransport());
