import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ios=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(ios);
const output=path.join(ios,'Web');
fs.mkdirSync(output,{recursive:true});
const modules=['game.js','sound.js','save-store.js','navigation.js','crew-trail.js','sprite-bounds.js','render.js','app.js'];
const js=modules.map(name=>fs.readFileSync(path.join(root,name),'utf8').replace(/^import .*?;\r?\n/gm,'').replace(/^export /gm,'')).join('\n');
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>`<style>${css}\n.topbar,.play-toolbar,.small-note{display:none}body{padding:0}#play{padding:0}</style>`);
const nativeControls=`
if(readCheckpoint(browserStorage(),SLOT))load();
const nativeMenu=document.createElement('div');
nativeMenu.className='actions';
for(const [label,target] of [['Resume chapter','load'],['Crew practice','practice'],['New chapter','new-game']]){
 const button=document.createElement('button');
 button.textContent=label;
 button.onclick=()=>document.getElementById(target).click();
 nativeMenu.appendChild(button);
}
document.querySelector('#pause-overlay .result-card').appendChild(nativeMenu);
graphicsReady.then(()=>setGameFocus(true));
`;
html=html.replace('<script type="module" src="app.js"></script>',()=>`<script>${js}\n${nativeControls}</script>`);
fs.writeFileSync(path.join(output,'index.html'),html);
const assets=new Set([...js.matchAll(/\.\/([\w.-]+\.png)/g),...css.matchAll(/\.\/([\w.-]+\.png)/g)].map(match=>match[1]));
for(const asset of assets) fs.copyFileSync(path.join(root,asset),path.join(output,asset));
console.log(`Bundled game with ${assets.size} runtime images.`);
