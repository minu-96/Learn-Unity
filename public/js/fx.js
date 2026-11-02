/* ===== 연출: 효과음 · 축하 · 경험치/레벨 · 배지 · 코드 구문 색 =====
   효과음은 WebAudio로 즉석에서 합성한다(음원 파일 없음). 경험치와 배지는 저장하지 않고 풀이 기록에서 계산한다. */
const Fx=(()=>{
 const KEY='unity-lab-fx';
 let on=true,ctx=null;
 try{if(localStorage.getItem(KEY)==='off')on=false}catch(e){}
 const reduce=()=>{try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};

 /* ----- 소리 ----- */
 function ac(){
  if(ctx===false)return null;
  if(!ctx){try{ctx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){ctx=false;return null}}
  if(ctx.state==='suspended')ctx.resume().catch(()=>{});
  return ctx;
 }
 function tone(c,f,at,dur,type,vol){
  const o=c.createOscillator(),g=c.createGain();
  o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(0.0001,at);
  g.gain.exponentialRampToValueAtTime(vol,at+0.012);
  g.gain.exponentialRampToValueAtTime(0.0001,at+dur);
  o.connect(g);g.connect(c.destination);
  o.start(at);o.stop(at+dur+0.03);
 }
 /* [주파수, 시작(초), 길이(초), 파형, 음량] */
 const SFX={
  tap:[[620,0,.05,'triangle',.04]],
  back:[[440,0,.05,'triangle',.035]],
  run:[[392,0,.06,'sine',.05],[523,.06,.08,'sine',.05]],
  lock:[[196,0,.08,'square',.03],[165,.07,.12,'square',.03]],
  hint:[[520,0,.07,'sine',.06],[700,.07,.1,'sine',.05]],
  fail:[[233,0,.12,'sawtooth',.035],[175,.1,.22,'sawtooth',.035]],
  pass:[[523,0,.12,'triangle',.07],[659,.09,.12,'triangle',.07],[784,.18,.14,'triangle',.07],[1047,.28,.34,'triangle',.08]],
  xp:[[880,0,.06,'sine',.05],[1320,.05,.12,'sine',.04]],
  badge:[[784,0,.1,'triangle',.07],[988,.1,.1,'triangle',.07],[1319,.2,.3,'triangle',.08]],
  unlock:[[659,0,.08,'sine',.05],[880,.08,.08,'sine',.05],[1175,.16,.08,'sine',.05],[1568,.26,.3,'triangle',.06]],
  level:[[392,0,.1,'square',.04],[523,.1,.1,'square',.04],[659,.2,.1,'square',.04],[784,.3,.1,'square',.04],[1047,.4,.4,'triangle',.08]]
 };
 function sfx(name){
  if(!on)return;
  const c=ac();if(!c)return;
  const t0=c.currentTime+0.01;
  (SFX[name]||[]).forEach(([f,t,d,ty,v])=>tone(c,f,t0+t,d,ty,v));
 }
 const isOn=()=>on;
 function setOn(v){on=!!v;try{localStorage.setItem(KEY,on?'on':'off')}catch(e){}if(on)sfx('tap')}

 /* ----- 축하 효과(색종이) ----- */
 function confetti(n){
  if(reduce())return;
  const cv=document.createElement('canvas');
  cv.setAttribute('aria-hidden','true');
  cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60';
  const W=cv.width=window.innerWidth,H=cv.height=window.innerHeight;
  document.body.appendChild(cv);
  const g=cv.getContext('2d');
  const cols=['#0E7C86','#4A5FC1','#8A3FA0','#E0A526','#E2603B','#3FA46A'];
  const N=n||90,ps=[];
  for(let i=0;i<N;i++){
   const a=-Math.PI/2+(Math.random()-.5)*1.5,v=7+Math.random()*9;
   ps.push({x:W/2+(Math.random()-.5)*160,y:H*.62,vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:5+Math.random()*6,h:3+Math.random()*5,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cols[i%cols.length]});
  }
  const t0=performance.now();
  (function f(now){
   const t=now-t0;g.clearRect(0,0,W,H);
   ps.forEach(p=>{p.vy+=.32;p.vx*=.992;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
    g.save();g.globalAlpha=Math.max(0,1-t/1700);g.translate(p.x,p.y);g.rotate(p.r);g.fillStyle=p.c;g.fillRect(-p.w/2,-p.h/2,p.w,p.h);g.restore()});
   if(t<1700)requestAnimationFrame(f);else cv.remove();
  })(t0);
 }

 /* ----- 알림창(토스트) ----- */
 function toast(html,kind,ms){
  let box=document.getElementById('toasts');
  if(!box){box=document.createElement('div');box.id='toasts';box.setAttribute('role','status');box.setAttribute('aria-live','polite');document.body.appendChild(box)}
  const el=document.createElement('div');el.className='toast '+(kind||'');el.innerHTML=html;
  box.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('in'));
  setTimeout(()=>{el.classList.remove('in');setTimeout(()=>el.remove(),300)},ms||3200);
 }

 /* ----- 경험치 · 레벨 ----- */
 const TITLES=['새싹','견습','신입','주니어','정식','숙련','베테랑','고수','마스터','전설'];
 const XP_BASE={1:10,2:15,3:25};
 function xpOf(st){
  let x=0;
  for(const [id,r] of Object.entries(st.solved||{})){
   if(!r||!r.ok)continue;const p=byId(id);if(!p)continue;
   x+=(XP_BASE[p.level]||10)+(r.clean?5:0);
  }
  for(const v of Object.values(st.review||{}))x+=(v.reps||0)*3;
  x+=Object.keys(st.notes||{}).length*2;
  return x;
 }
 const lvOf=xp=>Math.floor(Math.sqrt(xp/30))+1;
 function levelInfo(st){
  const xp=xpOf(st),lv=lvOf(xp),lo=30*(lv-1)*(lv-1),hi=30*lv*lv;
  return {xp,lv,title:TITLES[Math.min(lv-1,TITLES.length-1)],lo,hi,pct:Math.round((xp-lo)/(hi-lo)*100),need:hi-xp};
 }

 /* ----- 배지 ----- */
 const nOk=st=>Object.entries(st.solved||{}).filter(([id,r])=>r&&r.ok&&!BANK.some(b=>b.id===id)).length;
 const bankSolved=st=>BANK.filter(b=>st.solved&&st.solved[b.id]&&st.solved[b.id].ok).length;
 const BADGES=[
  {id:'first',n:'첫 걸음',d:'첫 문제를 해결했어요',ok:st=>nOk(st)>=1},
  {id:'ten',n:'열 문제',d:'10문제를 해결했어요',ok:st=>nOk(st)>=10},
  {id:'half',n:'절반 돌파',d:`전체 ${Math.floor(PROBLEMS.length/2)}문제를 해결했어요`,ok:st=>nOk(st)>=Math.floor(PROBLEMS.length/2)},
  {id:'solo5',n:'혼자서도',d:'정답을 보지 않고 5문제를 풀었어요',ok:st=>Object.values(st.solved||{}).filter(r=>r&&r.ok&&r.clean).length>=5},
  {id:'str3',n:'3일 연속',d:'3일 연속으로 공부했어요',ok:st=>maxStreak(st)>=3},
  {id:'str7',n:'일주일 연속',d:'7일 연속으로 공부했어요',ok:st=>maxStreak(st)>=7},
  {id:'rev5',n:'복습의 힘',d:'복습 문제를 5번 풀었어요',ok:st=>Object.values(st.review||{}).reduce((a,v)=>a+(v.reps||0),0)>=5},
  {id:'note3',n:'기록하는 사람',d:'메모를 3개 남겼어요',ok:st=>Object.keys(st.notes||{}).length>=3},
  {id:'bank5',n:'사전 탐험가',d:'문제 사전에서 5문제를 해결했어요',ok:st=>bankSolved(st)>=5},
  {id:'t-intro',n:'입문 수료',d:'입문 구간 수료 기준을 채웠어요',ok:st=>tierPassed(st,'intro')},
  {id:'t-basic',n:'기초 수료',d:'기초 구간 수료 기준을 채웠어요',ok:st=>tierPassed(st,'basic')},
  {id:'t-app',n:'응용 수료',d:'응용 구간 수료 기준을 채웠어요',ok:st=>tierPassed(st,'app')},
  {id:'t-adv',n:'심화 수료',d:'심화 구간 수료 기준을 채웠어요',ok:st=>tierPassed(st,'adv')}
 ];
 function tierPassed(st,id){const s=summarize(PROBLEMS,st.solved||{},st.review||{});return !!(s.tier[id]&&s.tier[id].passed)}
 function maxStreak(st){
  const ks=Object.keys(st.act||{}).filter(k=>st.act[k]>0).sort();
  let best=0,cur=0,prev=null;
  for(const k of ks){const t=Date.parse(k+'T00:00:00');cur=(prev!==null&&Math.round((t-prev)/86400000)===1)?cur+1:1;best=Math.max(best,cur);prev=t}
  return best;
 }
 const earned=st=>BADGES.filter(b=>{try{return b.ok(st)}catch(e){return false}}).map(b=>b.id);

 /* 풀이 직전/직후를 비교해 보상을 보여 준다 */
 const snap=st=>({xp:xpOf(st),lv:lvOf(xpOf(st)),badges:earned(st)});
 function reward(before,st){
  const a=snap(st),gain=a.xp-before.xp;
  const out={gain,level:a.lv>before.lv?a.lv:0,badges:BADGES.filter(b=>a.badges.includes(b.id)&&!before.badges.includes(b.id))};
  sfx('pass');confetti(out.badges.length||out.level?150:80);
  if(gain>0)setTimeout(()=>{toast(`<b>+${gain} XP</b>`,'xp',2200);sfx('xp')},350);
  if(out.level)setTimeout(()=>{const li=levelInfo(st);toast(`<b>레벨 업!</b> Lv.${li.lv} ${li.title}`,'lv',3800);sfx('level')},900);
  out.badges.forEach((b,i)=>setTimeout(()=>{toast(`<b>배지 획득</b> ${esc(b.n)}<span>${esc(b.d)}</span>`,'bd',3800);sfx('badge')},(out.level?1800:900)+i*1400));
  return out;
 }

 /* ----- C# 구문 색 ----- */
 const KW=new Set('abstract as base bool break byte case catch char class const continue decimal default delegate do double else enum event false finally float for foreach if in int interface internal is long namespace new null object out override private protected public readonly ref return sealed short static string struct switch this throw true try uint ulong using var virtual void while yield get set value'.split(' '));
 const RE=/(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|(\$?"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)|(\b\d+(?:\.\d+)?f?\b)|(\[[A-Z]\w*(?:\([^)\n]*\))?\])|([A-Za-z_]\w*)/g;
 const X=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 function cshl(code){
  const src=String(code==null?'':code);let out='',pos=0,m;
  RE.lastIndex=0;
  while((m=RE.exec(src))){
   out+=X(src.slice(pos,m.index));pos=m.index+m[0].length;
   const t=m[0];
   if(m[1])out+=`<span class="hc">${X(t)}</span>`;
   else if(m[2])out+=`<span class="hs">${X(t)}</span>`;
   else if(m[3])out+=`<span class="hn">${X(t)}</span>`;
   else if(m[4])out+=`<span class="ha">${X(t)}</span>`;
   else if(KW.has(t))out+=`<span class="hk">${X(t)}</span>`;
   else if(src[pos]==='(')out+=`<span class="hf">${X(t)}</span>`;
   else if(/^[A-Z]/.test(t))out+=`<span class="ht">${X(t)}</span>`;
   else out+=X(t);
  }
  return out+X(src.slice(pos));
 }
 return {sfx,isOn,setOn,confetti,toast,levelInfo,xpOf,BADGES,earned,snap,reward,cshl,maxStreak};
})();
