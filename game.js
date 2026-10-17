export const CAST={
 kai:{name:'Kai',role:'Pathfinder',color:'#317ac0',hp:110,mp:24,attack:22,skill:'Gust Slash',cost:5,description:'Strike for 28 and open the target to the next attack.',second:{name:'Rally',cost:5,description:'Restore 15 HP and boost an ally’s next offensive action by 25%.'}},
 rocco:{name:'Rocco',role:'Protector',color:'#dc7045',hp:154,mp:20,attack:24,skill:'Shield Crash',cost:5,description:'Deal 27 damage and cancel a charging attack.',second:{name:'Cover',cost:4,description:'Take hits aimed at one ally until Rocco’s next action.'}},
 mira:{name:'Mira',role:'Elementalist',color:'#249d9a',hp:94,mp:36,attack:17,skill:'Spark',cost:6,description:'Deal 38 lightning damage. Sailfins are weak to lightning.',second:{name:'Wind Spiral',cost:8,description:'Strike every enemy for 20 wind damage before timing bonuses.'}},
 hana:{name:'Hana',role:'Healer',color:'#6a9c65',hp:108,mp:32,attack:16,skill:'Bloom',cost:6,description:'Restore 48 HP to a selected ally. No timing required.',second:{name:'Sheltering Petals',cost:8,description:'Reduce damage from the next enemy attack by 30% for the whole crew.'}}
};
export const OBJECTIVES={intro:'Help with the festival. Speak to Aunt Nessa.',chase:'Meet Rocco at the east gate.',trail:'Follow the sailfins along the coastal trail.',workshop:'Find the researcher at the old workshop.',beacon:'Climb to the beacon and recover the lens.',return:'Take the coastal shortcut back to Bluebell Bay.',departure:'Meet Hana in the square, then visit the boat.',complete:'Opening chapter complete. The horizon is waiting.'};
export const DIALOGUES={
 intro:[['Nessa','There you are, Kai! The lens needs a polish before tonight’s festival.'],['Kai','Every year we shine it toward the sea. Has anyone ever seen anything shine back?'],['Nessa','Bring me an answer after you bring me a cleaning cloth.'],['Kai','Wait. My compass… it’s pointing at the lens.'],['Narrator','A pair of sailfins leaps from the crates. The lens flashes—and disappears under a turquoise tail.'],['Kai','That was not part of the festival rehearsal!']],
 rocco:[['Rocco','A stolen treasure, a mountain trail, and an audience. Finally, a proper adventure!'],['Kai','It’s a festival decoration.'],['Rocco','Then we shall rescue it with exceptional dignity.'],['Narrator','Rocco joins the crew. His Shield Crash can interrupt charging enemies.']],
 mira:[['Mira','Please tell me you didn’t follow the glowing lens up here without a theory.'],['Kai','We had a direction.'],['Rocco','And exceptional dignity.'],['Mira','That lens belongs to the beacon. These drawings show routes nobody has sailed in centuries.'],['Narrator','Mira joins the crew. Spark exploits the sailfins’ lightning weakness. The workshop rest stop restores everyone’s HP and MP.']],
 boss:[['Rocco','There! The lens is on that enormous shell.'],['Mira','Along with three spoons, a door knocker, and someone’s weather vane.'],['Kai','Let’s try asking nicely.'],['Narrator','The shellback huffs and plants itself across the path. Watch for its charging stance.']],
 beacon:[['Mira','The lens fits. Kai—hold your compass near the rim.'],['Narrator','Sunlight threads through the glass. A trail of golden points stretches across the sea.'],['Kai','There’s an island out there. Why isn’t it on any chart?'],['Rocco','Then we’ll need a bigger chart!'],['Mira','Or a boat. Preferably before you attempt to swim.']],
 hana:[['Hana','Those flowers in the beacon’s light… I know them from an old botanical journal.'],['Kai','You think they grow on the island?'],['Hana','I’ve spent years helping other people make their journeys. I’d like to make this one.'],['Rocco','Then we’ll make room. And label the medicine separately from the snacks.'],['Narrator','Hana joins the crew. Bloom heals an ally through hand-cast magic; she carries no staff.']],
 departure:[['Nessa','The town has patched the sail and filled the pantry. Try to bring the boat home occasionally.'],['Kai','We’ll bring stories, too.'],['Narrator','A magnificent expedition ship glides past the harbor mouth.'],['Rival captain','Keep that little boat afloat. I’d hate to reach the horizon without someone to race.'],['Mira','A charming stranger. I already want to beat him there.'],['Narrator','The crew sets out toward the first lost route. End of the opening chapter.']],
 treasure:[['Kai','Someone left a little travel kit at the lookout.'],['Narrator','You found two healing herbs and 15 coins.']],
 return:[['Kai','That path goes straight down to the bay.'],['Mira','A shortcut. I approve of discoveries that save walking.']]
};
export function createState(){return {version:1,mode:'explore',stage:'intro',area:'harbor',party:['kai'],stats:Object.fromEntries(Object.entries(CAST).map(([id,c])=>[id,{hp:c.hp,mp:c.mp,level:1,xp:0}])),herbs:4,coins:0,crew:0,flags:{},battle:null,dialogue:null,log:['A festival morning in Bluebell Bay.'],position:{x:39,y:64},notice:''}}
export function clone(s){return structuredClone(s)}
function say(s,key,after){s.mode='dialogue';s.dialogue={key,index:0,after};return s}
export function dialogueLine(s){return s.dialogue?DIALOGUES[s.dialogue.key][s.dialogue.index]:null}
export function advanceDialogue(input){const s=clone(input);if(s.mode!=='dialogue')return s;if(++s.dialogue.index<DIALOGUES[s.dialogue.key].length)return s;const after=s.dialogue.after;s.dialogue=null;s.mode='explore';switch(after){case'chase':s.stage='chase';break;case'recruitRocco':s.party.push('rocco');s.stage='trail';break;case'recruitMira':s.party.push('mira');s.stage='beacon';restore(s);break;case'boss':return startBattle(s,'boss');case'beacon':s.stage='return';s.flags.beacon=true;restore(s);break;case'home':s.area='harbor';s.stage='departure';s.position={x:42,y:63};break;case'recruitHana':s.party.push('hana');s.flags.hana=true;restore(s);break;case'finish':s.stage='complete';s.mode='complete';break;}return s}
function restore(s){for(const id of s.party){s.stats[id].hp=CAST[id].hp;s.stats[id].mp=CAST[id].mp}}
export function hotspots(s){if(s.mode!=='explore')return [];const list=[];const add=(id,label,x,y,kind='story')=>list.push({id,label,x,y,kind});if(s.area==='harbor'){if(s.stage==='intro')add('intro','Nessa · Festival',43,42);if(s.stage==='chase')add('rocco','Rocco · East gate',78,29);if(s.stage==='trail')add('leave','Coastal trail →',82,23,'exit');if(s.stage==='departure'){if(!s.flags.hana)add('hana','Hana · Herb stall',29,47);else add('departure','Our boat · Set sail',82,74,'exit')}}if(s.area==='trail'){if(!s.flags.treasure)add('treasure','Lookout · Treasure',29,28,'treasure');if(!s.flags.trail1)add('trail1','Sailfins · First encounter',55,51,'battle');else add('workshop','Old workshop →',82,27,'exit')}if(s.area==='workshop'){if(!s.party.includes('mira'))add('mira','Mira · Investigate',49,39);else add('toBeacon','Beacon steps →',83,28,'exit')}if(s.area==='beacon'){if(!s.flags.boss)add('boss','Prism Shellback',73,44,'battle');else if(!s.flags.beacon)add('activate','Activate the beacon',62,33);else add('return','Shortcut to the harbor →',84,70,'exit')}return list}
export function interact(input,id){const s=clone(input);if(!hotspots(s).some(h=>h.id===id))return s;s.notice='';switch(id){case'intro':return say(s,'intro','chase');case'rocco':return say(s,'rocco','recruitRocco');case'leave':s.area='trail';s.position={x:20,y:70};break;case'treasure':s.flags.treasure=true;s.herbs+=2;s.coins+=15;return say(s,'treasure');case'trail1':return startBattle(s,'trail1');case'workshop':s.area='workshop';s.stage='workshop';s.position={x:23,y:71};break;case'mira':return say(s,'mira','recruitMira');case'toBeacon':s.area='beacon';s.position={x:25,y:70};break;case'boss':return say(s,'boss','boss');case'activate':return say(s,'beacon','beacon');case'return':return say(s,'return','home');case'hana':return say(s,'hana','recruitHana');case'departure':return say(s,'departure','finish')}return s}
const enemy=(id,name,hp,attack,type,intent)=>({id,name,hp,maxHp:hp,attack,type,intent,open:false});
export function startBattle(input,kind='practice'){const s=clone(input);if(kind==='practice'){s.party=['kai','rocco','mira','hana'];restore(s)}const enemies=kind==='boss'?[enemy('shell','Prism Shellback',196,25,'shell','charge'),enemy('fin1','Sailfin',48,12,'fin','attack')]:kind==='practice'?[enemy('fin1','Sailfin',55,12,'fin','attack'),enemy('sprout','Puffsprout',70,14,'sprout','gust'),enemy('shell','Shellback',140,23,'shell','charge')]:[enemy('fin1','Sailfin',48,12,'fin','attack'),enemy('fin2','Sailfin',48,12,'fin','attack')];const order=[];s.party.forEach((id,i)=>{order.push(id);if(enemies[i])order.push(enemies[i].id)});enemies.slice(s.party.length).forEach(e=>order.push(e.id));s.mode='battle';s.battle={kind,enemies,order,turn:0,round:1,guard:[],events:['Choose a target, then an action.'],result:null};s.log.push(kind==='boss'?'The Prism Shellback blocks the beacon.':'The crew enters battle.');return s}
export function actor(s){return s.battle?.order[s.battle.turn]}
export function isHeroTurn(s){return s.mode==='battle'&&!!CAST[actor(s)]&&!s.battle.result}
function alive(s,id){return CAST[id]?s.stats[id].hp>0:s.battle.enemies.some(e=>e.id===id&&e.hp>0)}
function event(s,t){s.battle.events.push(t);s.battle.events=s.battle.events.slice(-5)}
function finishOrNext(s){if(s.battle.enemies.every(e=>e.hp<=0)){s.battle.result='victory';event(s,'Victory! The crew catches its breath.');return}if(s.party.every(id=>s.stats[id].hp<=0)){s.battle.result='defeat';event(s,'The crew retreats. Retry with full health.');return}let tries=0;do{s.battle.turn++;if(s.battle.turn>=s.battle.order.length){s.battle.turn=0;s.battle.round++}}while(!alive(s,actor(s))&&++tries<20)}
function battleEffects(s){s.battle.power??={};s.battle.cover??={};s.battle.ward??=false}
export function heroAction(input,action,targetId,timing=1){
 const s=clone(input);if(!isHeroTurn(s))return s;
 const id=actor(s),c=CAST[id],st=s.stats[id],b=s.battle;
 const target=b.enemies.find(e=>e.id===targetId&&e.hp>0)||b.enemies.find(e=>e.hp>0);
 if(!['attack','skill','skill2','guard','item','combo'].includes(action))return s;
 const cost=action==='skill'?c.cost:action==='skill2'?c.second.cost:0;
 if(st.mp<cost){s.notice='Not enough MP. Attack, guard, or use an herb.';return s}
 if(action==='item'&&s.herbs<=0){s.notice='No herbs left.';return s}
 if(action==='combo'&&(s.crew<3||!s.party.includes('kai')||!s.party.includes('rocco')||s.stats.kai.hp<=0||s.stats.rocco.hp<=0||!['kai','rocco'].includes(id))){s.notice='Breakwater Strike needs 3 Crew and a turn for Kai or Rocco. Both must be standing.';return s}
 const ally=s.party.includes(targetId)?targetId:id;
 if(action==='skill2'&&['kai','rocco'].includes(id)&&(s.stats[ally].hp<=0||(id==='rocco'&&ally===id))){s.notice=id==='rocco'?'Choose another standing ally to protect.':'Choose a standing ally to rally.';return s}
 battleEffects(s);s.notice='';b.guard=b.guard.filter(h=>h!==id);
 for(const [protectedId,protector] of Object.entries(b.cover))if(protector===id)delete b.cover[protectedId];
 st.mp-=cost;
 if(action==='guard'){b.guard.push(id);event(s,`${c.name} guards until their next action.`)}
 else if(action==='item'){s.herbs--;s.stats[ally].hp=Math.min(CAST[ally].hp,s.stats[ally].hp+50);event(s,`${c.name} restores 50 HP to ${CAST[ally].name}.`)}
 else if(action==='skill'&&id==='hana'){s.stats[ally].hp=Math.min(CAST[ally].hp,s.stats[ally].hp+48);s.crew=Math.min(5,s.crew+1);event(s,`Hana casts Bloom on ${CAST[ally].name}.`)}
 else if(action==='skill2'&&id==='kai'){b.power[ally]=true;s.stats[ally].hp=Math.min(CAST[ally].hp,s.stats[ally].hp+15);s.crew=Math.min(5,s.crew+1);event(s,`Kai uses Rally on ${CAST[ally].name}: 15 HP and a stronger next attack.`)}
 else if(action==='skill2'&&id==='rocco'){b.cover[ally]='rocco';s.crew=Math.min(5,s.crew+1);event(s,`Rocco uses Cover on ${CAST[ally].name} until his next action.`)}
 else if(action==='skill2'&&id==='hana'){b.ward=true;s.crew=Math.min(5,s.crew+1);event(s,'Hana casts Sheltering Petals: the next enemy attack deals 30% less damage.')}
 else{
  let base=c.attack,label='attacks';
  if(action==='skill'){base=id==='kai'?28:id==='rocco'?27:38;label=`uses ${c.skill}`;if(id==='mira'&&target.type==='fin')base=Math.round(base*1.4);if(id==='rocco'&&['charge','rush'].includes(target.intent)){target.intent='stagger';event(s,'Charge interrupted!')}}
  if(action==='skill2'){base=20;label='uses Wind Spiral'}
  if(action==='combo'){s.crew-=3;base=66;label='unleashes Breakwater Strike with the crew'}
  const targets=action==='skill2'&&id==='mira'?b.enemies.filter(e=>e.hp>0):[target];
  const power=b.power[id]?1.25:1;delete b.power[id];
  for(const foe of targets){let damage=base*power;if(foe.open){damage*=1.25;foe.open=false}damage=Math.round(damage*Math.max(1,Math.min(1.25,timing)));foe.hp=Math.max(0,foe.hp-damage);if(action==='skill'&&id==='kai'&&foe.hp>0)foe.open=true;event(s,`${c.name} ${label}: ${damage} damage to ${foe.name}${foe.hp===0?' — defeated':''}.`)}
  if(action!=='combo')s.crew=Math.min(5,s.crew+1);
 }
 finishOrNext(s);return s;
}
export function enemyAction(input){
 const s=clone(input);if(s.mode!=='battle'||s.battle.result||CAST[actor(s)])return s;
 battleEffects(s);const b=s.battle,e=b.enemies.find(x=>x.id===actor(s));if(!e)return s;
 const heroes=s.party.filter(id=>s.stats[id].hp>0),target=heroes[(b.round+e.id.length)%heroes.length];
 if(e.intent==='stagger'){event(s,`${e.name} is staggered and misses its action.`);e.intent='attack'}
 else if(e.intent==='charge'){event(s,`${e.name} winds up. Interrupt or guard before its next turn!`);e.intent='rush'}
 else{
  const targets=e.type==='sprout'?heroes:[target],ward=b.ward?.7:1;
  for(const intended of targets){let h=intended;const protector=b.cover[intended];if(protector&&s.stats[protector].hp>0){h=protector;event(s,`${CAST[h].name} covers ${CAST[intended].name}!`)}const dmg=Math.round(e.attack*(e.intent==='rush'?1.8:1)*(b.guard.includes(h)?.4:1)*ward);s.stats[h].hp=Math.max(0,s.stats[h].hp-dmg);event(s,`${e.name} ${e.intent==='rush'?'charges':'hits'} ${CAST[h].name} for ${dmg}.`);if(b.guard.includes(h))s.crew=Math.min(5,s.crew+1)}
  b.ward=false;e.intent=e.type==='shell'?'charge':e.type==='sprout'?'gust':'attack';
 }
 finishOrNext(s);return s;
}
export function endBattle(input){const s=clone(input);if(!s.battle?.result)return s;if(s.battle.result==='defeat'){const k=s.battle.kind;restore(s);return startBattle(s,k)}const k=s.battle.kind;if(k==='practice'){s.mode='complete';s.stage='complete';s.battle=null;return s}s.flags[k]=true;s.coins+=k==='boss'?60:25;for(const id of s.party){s.stats[id].xp+=k==='boss'?40:20;s.stats[id].level=s.stats[id].xp>=20?2:1}s.mode='explore';s.battle=null;s.notice=k==='boss'?'The lens is recovered. Activate the beacon.':'The trail is clear. The workshop is ahead.';if(k==='boss')s.crew=Math.min(5,s.crew+1);return s}
// Validate the entire resumable state before any UI or battle code can use it.
export function validSave(s){
 const record=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
 const whole=(v,max=1000000)=>Number.isInteger(v)&&v>=0&&v<=max;
 const strings=v=>Array.isArray(v)&&v.length<=1000&&v.every(x=>typeof x==='string'&&x.length<=2000);
 const unique=v=>Array.isArray(v)&&new Set(v).size===v.length;
 if(!record(s)||s.version!==1||!Object.hasOwn(OBJECTIVES,s.stage)||!['harbor','trail','workshop','beacon'].includes(s.area)||!['explore','dialogue','battle','complete'].includes(s.mode))return false;
 if(!unique(s.party)||!s.party.length||s.party.length>4||!s.party.includes('kai')||!s.party.every(id=>Object.hasOwn(CAST,id)))return false;
 if(!record(s.stats)||!Object.entries(CAST).every(([id,c])=>record(s.stats[id])&&whole(s.stats[id].hp,c.hp)&&whole(s.stats[id].mp,c.mp)&&whole(s.stats[id].xp)&&whole(s.stats[id].level,99)&&s.stats[id].level>=1))return false;
 if(!whole(s.herbs)||!whole(s.coins)||!whole(s.crew,5)||!record(s.flags)||!Object.values(s.flags).every(v=>typeof v==='boolean')||!strings(s.log)||typeof s.notice!=='string')return false;
 if(!record(s.position)||!['x','y'].every(k=>Number.isFinite(s.position[k])&&s.position[k]>=0&&s.position[k]<=100))return false;
 if(s.mode==='dialogue'){
  const d=s.dialogue,afters={intro:'chase',rocco:'recruitRocco',mira:'recruitMira',boss:'boss',beacon:'beacon',hana:'recruitHana',departure:'finish',return:'home'};
  if(!record(d)||!Object.hasOwn(DIALOGUES,d.key)||!whole(d.index,DIALOGUES[d.key].length-1)||d.after!==afters[d.key])return false;
 }else if(s.dialogue!=null)return false;
 if(s.mode!=='battle')return s.battle==null;
 const b=s.battle;
 if(!record(b)||!['trail1','boss','practice'].includes(b.kind)||!Array.isArray(b.enemies)||!b.enemies.length||b.enemies.length>3||!unique(b.enemies.map(e=>e?.id)))return false;
 if(!b.enemies.every(e=>record(e)&&['fin1','fin2','sprout','shell'].includes(e.id)&&!Object.hasOwn(CAST,e.id)&&typeof e.name==='string'&&e.name.length<100&&['fin','sprout','shell'].includes(e.type)&&whole(e.maxHp,1000)&&e.maxHp>0&&whole(e.hp,e.maxHp)&&whole(e.attack,100)&&['attack','charge','rush','stagger','gust'].includes(e.intent)&&typeof e.open==='boolean'))return false;
 const ids=[...s.party,...b.enemies.map(e=>e.id)];
 if(!unique(b.order)||b.order.length!==ids.length||!ids.every(id=>b.order.includes(id))||!whole(b.turn,b.order.length-1)||!whole(b.round)||b.round<1||!strings(b.events)||!unique(b.guard)||!b.guard.every(id=>s.party.includes(id))||![null,'victory','defeat'].includes(b.result))return false;
 if(b.power!==undefined&&(!record(b.power)||!Object.entries(b.power).every(([id,v])=>s.party.includes(id)&&v===true)))return false;
 if(b.cover!==undefined&&(!record(b.cover)||!Object.entries(b.cover).every(([id,v])=>s.party.includes(id)&&v==='rocco'&&id!=='rocco'&&s.party.includes(v))))return false;
 if(b.ward!==undefined&&typeof b.ward!=='boolean')return false;
 const heroesAlive=s.party.some(id=>s.stats[id].hp>0),enemiesAlive=b.enemies.some(e=>e.hp>0);
 return b.result==='victory'?!enemiesAlive&&heroesAlive:b.result==='defeat'?!heroesAlive:heroesAlive&&enemiesAlive&&(s.party.includes(b.order[b.turn])?s.stats[b.order[b.turn]].hp>0:b.enemies.some(e=>e.id===b.order[b.turn]&&e.hp>0));
}
