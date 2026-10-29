/* ===== 오늘(홈) · 학습 지도 · 단계 화면 =====
   ui.js의 전역(S, V, $, esc, byId, isSolved, openProblem, persist ...)을 호출 시점에 사용한다. */
const TIER_IDX={intro:0,basic:1,adv:2};
const catIdx=id=>CATS.findIndex(c=>c.id===id);
const MIN_BY_LV={1:5,2:8,3:12};
const DAILY_GOAL=3;

/* ---------- 학습 순서와 추천 ---------- */
let _path=null;
const pathList=()=>_path||(_path=PROBLEMS.slice().sort((a,b)=>TIER_IDX[tierOf(a)]-TIER_IDX[tierOf(b)]||catIdx(a.cat)-catIdx(b.cat)||a.stage-b.stage||a.level-b.level));
const nextUnsolved=()=>pathList().find(p=>!isSolved(p.id))||null;
const inProgressList=()=>Object.entries(S.drafts).filter(([id])=>byId(id)&&!isSolved(id)).sort((a,b)=>(b[1].at||0)-(a[1].at||0)).map(([id])=>byId(id));
const stageProblems=(cid,si)=>allProblems().filter(p=>p.cat===cid&&p.stage===si).sort((a,b)=>a.level-b.level);
function stagesOfTier(tid){
 const out=[];
 CATS.forEach(c=>c.stages.forEach((st,i)=>{if(TIER_OF[c.id+':'+(i+1)]===tid)out.push({cat:c,si:i+1,st,key:c.id+':'+(i+1)})}));
 return out;
}

/* ---------- 학습 기록(연속 일수) ---------- */
const dayKey=(t)=>{const d=new Date(t==null?Date.now():t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function bumpAct(){const k=dayKey();S.act[k]=(S.act[k]||0)+1}
const todayCount=()=>S.act[dayKey()]||0;
function streak(){let n=0,t=Date.now();if(!S.act[dayKey(t)])t-=DAY;while(S.act[dayKey(t)]){n++;t-=DAY}return n}
function lastWeek(){
 const out=[],names=['일','월','화','수','목','금','토'];
 for(let i=6;i>=0;i--){const t=Date.now()-i*DAY;out.push({n:S.act[dayKey(t)]||0,d:names[new Date(t).getDay()],today:i===0})}
 return out;
}

/* ---------- 공용 조각 ---------- */
const tierName=id=>(TIERS.find(t=>t.id===id)||{}).name||'';
const meterHTML=(a,b,cls)=>`<span class="meter ${cls||''}" role="img" aria-label="${a} / ${b}"><i style="width:${b?Math.round(a/b*100):0}%"></i></span>`;
function tierNeed(x){
 if(x.passed)return '수료 기준을 모두 채웠어요.';
 const need=Math.max(0,Math.ceil(x.total*PASS_SOLVED)-x.solved),selfRate=x.solved?x.self/x.solved:0;
 return [need?`${need}문제 더 풀기`:'',x.solved&&selfRate<PASS_SELF?'정답 보지 않고 풀기':'',!x.solved?'첫 문제부터 시작해 보세요':''].filter(Boolean).join(' · ');
}
function hl(code){
 return esc(code).split('\n').map(l=>{const i=l.indexOf('//');return i<0?l:l.slice(0,i)+'<span class="cm">'+l.slice(i)+'</span>'}).join('\n');
}
function levelDot(p){
 const k=solvedKind(p.id);
 return `<span class="dot ${k?'ok':(S.drafts[p.id]||(S.solved[p.id]&&S.solved[p.id].tries))?'wip':''}" title="${esc(LV[p.level])} · ${esc(p.title)}"></span>`;
}
function bindPractice(root){
 root.querySelectorAll('.chk input').forEach(x=>x.onchange=()=>{
  const k=x.dataset.k,arr=S.practice[k]||[];arr[+x.dataset.i]=x.checked;S.practice[k]=arr;persist();
  const sm=x.closest('details').querySelector('summary .note');if(sm)sm.textContent=`${arr.filter(Boolean).length} / ${PRACTICE[k].checks.length}`;
 });
}

/* ---------- 오늘 ---------- */
function renderHome(){
 const sm=summarize(PROBLEMS,S.solved,S.review);
 const due=dueList(),nx=nextUnsolved(),wip=inProgressList()[0]||null;
 const today=todayCount(),st=streak(),week=lastWeek();
 const C=2*Math.PI*34,off=C*(1-Math.min(1,today/DAILY_GOAL));
 const hello=me&&me.name?`${esc(me.name)} 님, 안녕하세요`:'안녕하세요';
 const lead=today>=DAILY_GOAL?'오늘 목표를 채웠어요. 더 해도 좋고, 여기서 마무리해도 좋아요.':today>0?`오늘 ${today}개 했어요. ${DAILY_GOAL-today}개만 더 하면 목표예요.`:'하루 3개, 15분이면 충분해요. 아래에서 하나만 골라 시작해 보세요.';
 const act=(cls,kick,title,meta,label,go)=>`<div class="act ${cls}"><div class="act-t"><span class="kick">${kick}</span><b>${esc(title)}</b><span class="note">${meta}</span></div><button class="btn" data-go="${go}">${label}</button></div>`;
 const acts=[];
 if(due.length)acts.push(act('rev','복습',`복습할 문제 ${due.length}개`,`약 ${Math.max(3,Math.min(due.length,6)*3)}분 · 잊기 전에 한 번 더 풀면 오래 남아요`,'복습 시작','review'));
 if(wip&&(!nx||wip.id!==nx.id))acts.push(act('wip','이어서 하기',wip.title,esc(stageLabel(wip)),'이어서 쓰기','open:'+wip.id));
 if(nx)acts.push(act('next','다음 문제',nx.title,`${esc(stageLabel(nx))} · 약 ${MIN_BY_LV[nx.level]||8}분`,wip&&wip.id===nx.id?'이어서 쓰기':'시작하기','open:'+nx.id));
 if(!nx)acts.push(`<div class="act next"><div class="act-t"><span class="kick">완주</span><b>준비된 문제를 모두 풀었어요</b><span class="note">복습으로 기억을 단단히 하고, 각 단계의 "Unity에서 직접 해보기"를 해 보세요.</span></div><button class="btn" data-go="learn">학습 지도 보기</button></div>`);
 const road=TIERS.map(t=>{
  const x=sm.tier[t.id];
  return `<button class="road tier-${t.id}" data-tier="${t.id}"><span class="row"><b>${t.name}</b>${x.passed?'<span class="badge done">수료</span>':''}</span><span class="note">${esc(t.desc)}</span>${meterHTML(x.solved,x.total,'t-'+t.id)}<span class="road-n">${x.solved} / ${x.total}</span></button>`;
 }).join('');
 const recent=Object.entries(S.dict).sort((a,b)=>(b[1].at||0)-(a[1].at||0)).slice(0,6).map(([k])=>`<span class="chip">${esc(k)}</span>`).join('');
 $('#main').innerHTML=`<div class="home">
  <section class="hero">
   <div class="hero-t"><span class="kick">오늘의 학습</span><h2>${hello}</h2><p>${lead}</p>
    <div class="week" aria-label="최근 7일 학습량">${week.map(w=>`<span class="wd ${w.today?'now':''}"><i style="height:${Math.min(32,4+w.n*9)}px" class="${w.n?'on':''}"></i><em>${w.d}</em></span>`).join('')}</div></div>
   <div class="hero-r"><svg viewBox="0 0 80 80" width="96" height="96" role="img" aria-label="오늘 ${today} / ${DAILY_GOAL}"><circle cx="40" cy="40" r="34" fill="none" stroke="var(--line)" stroke-width="7"/><circle cx="40" cy="40" r="34" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 40 40)"/><text x="40" y="45" text-anchor="middle" font-size="20" font-weight="700" fill="var(--ink)" font-family="var(--font-mono)">${Math.min(today,99)}/${DAILY_GOAL}</text></svg>
    <span class="note">${st?`연속 ${st}일`:'오늘 시작해 보세요'}</span></div>
  </section>
  <section class="acts" aria-label="지금 할 것">${acts.join('')}</section>
  <section><div class="row sec-r"><h3 class="sec-h">학습 지도</h3><span style="flex:1"></span><button class="btn ghost sm" data-go="learn">전체 보기</button></div><div class="roads">${road}</div></section>
  ${recent?`<section><div class="row sec-r"><h3 class="sec-h">최근 정리된 개념</h3><span style="flex:1"></span><button class="btn ghost sm" data-go="dict">사전 열기</button></div><div class="chips">${recent}</div></section>`:''}
 </div>`;
 $('#main').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{
  const g=b.dataset.go;
  if(g==='review'){const id=dueList()[0];if(id)openProblem(id,'review');return}
  if(g.startsWith('open:')){openProblem(g.slice(5));return}
  gotoTab(g);
 });
 $('#main').querySelectorAll('[data-tier]').forEach(b=>b.onclick=()=>{V.tier=b.dataset.tier;gotoTab('learn')});
}
function stageLabel(p){
 const c=CATS.find(x=>x.id===p.cat),st=c&&c.stages[p.stage-1];
 return `${c?c.name:''} · ${st?st.title:''} · ${LV[p.level]}`;
}
function gotoTab(t){V.tab=t;V.pid=null;V.mode=null;V.stage=null;render();window.scrollTo(0,0)}

/* ---------- 학습 지도 ---------- */
function renderLearn(){
 const sm=summarize(PROBLEMS,S.solved,S.review),nx=nextUnsolved();
 const nxKey=nx?nx.cat+':'+nx.stage:'';
 if(!V.tier)V.tier=nx?tierOf(nx):'intro';
 const tabs=TIERS.map(t=>{const x=sm.tier[t.id];
  return `<button class="tt tier-${t.id}" role="tab" data-tier="${t.id}" aria-selected="${V.tier===t.id}"><span class="row"><b>${t.name}</b>${x.passed?'<span class="badge done">수료</span>':''}</span>${meterHTML(x.solved,x.total,'t-'+t.id)}<span class="note">${x.solved} / ${x.total}</span></button>`}).join('');
 const t=TIERS.find(x=>x.id===V.tier),x=sm.tier[V.tier];
 const cards=stagesOfTier(V.tier).map(s=>{
  const ps=stageProblems(s.cat.id,s.si),n=ps.filter(p=>isSolved(p.id)).length,rec=s.key===nxKey;
  return `<button class="sc ${rec?'rec':''}" data-c="${s.cat.id}" data-s="${s.si}"><span class="sc-top"><span class="sc-cat">${esc(s.cat.name)}</span>${rec?'<span class="badge new">추천</span>':''}${n===ps.length&&ps.length?'<span class="badge done">완료</span>':''}</span><b class="sc-title">${esc(s.st.title)}</b><span class="dots">${ps.map(levelDot).join('')}</span>${meterHTML(n,ps.length,'t-'+V.tier)}<span class="note">${n} / ${ps.length} 해결</span></button>`;
 }).join('');
 $('#main').innerHTML=`<div class="learn">
  <div class="tt-row" role="tablist" aria-label="학습 구간">${tabs}</div>
  <div class="tier-head tier-${V.tier}"><div><h2>${t.name}</h2><p>${esc(t.desc)}</p></div><div class="tier-need"><span class="note">수료까지</span><b>${esc(tierNeed(x))}</b></div></div>
  <div class="scgrid">${cards}</div>
  <div class="note">순서대로 하지 않아도 돼요. "추천" 표시는 지금 풀 차례인 단계예요. 수료 기준은 구간 문제의 ${PASS_SOLVED*100}% 해결, 푼 문제의 ${PASS_SELF*100}% 이상은 정답을 보지 않고 풀기예요.</div>
 </div>`;
 $('#main').querySelectorAll('[data-tier]').forEach(b=>b.onclick=()=>{V.tier=b.dataset.tier;renderLearn()});
 $('#main').querySelectorAll('.sc').forEach(b=>b.onclick=()=>{V.stage={cat:b.dataset.c,stage:+b.dataset.s};render();window.scrollTo(0,0)});
}

/* ---------- 단계 화면: 개념 카드 → 문제 → 실습 ---------- */
function renderStage(){
 const {cat:cid,stage:si}=V.stage,cat=CATS.find(c=>c.id===cid),st=cat.stages[si-1],key=cid+':'+si,tid=TIER_OF[key]||'basic';
 const ps=stageProblems(cid,si),n=ps.filter(p=>isSolved(p.id)).length,ls=LESSONS[key];
 const nx=nextUnsolved(),first=ps.find(p=>!isSolved(p.id));
 const row=p=>{
  const k=solvedKind(p.id),r=S.solved[p.id];
  return `<button class="prow ${k?'done':''}" data-p="${p.id}"><span class="lv lv${p.level}">${esc(LV[p.level])}</span><span class="pt2">${esc(p.title)}</span><span class="pmeta">${p.world?'<span class="badge sim">시뮬레이션</span>':''}${p.ai?'<span class="badge ai">AI 생성</span>':''}${statusBadge(p.id)}<span class="note">약 ${MIN_BY_LV[p.level]||8}분</span></span></button>`;
 };
 const pr=typeof PRACTICE!=='undefined'&&PRACTICE[key],done=S.practice[key]||[];
 const lesson=ls?`<details class="lesson" ${n===0?'open':''}><summary><span class="step">개념</span><b>핵심만 읽고 시작해요</b><span class="note">2분</span></summary>
   <p class="theory-p">${esc(st.theory)}</p>
   <ul class="points">${ls.points.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
   <div class="ex-h">예제 <span class="note">읽기만 하는 예시예요. 문제 정답과는 달라요.</span></div>
   <pre class="code ex">${hl(ls.code)}</pre>
   <div class="watch"><b>자주 하는 실수</b><span>${esc(ls.watch)}</span></div></details>`:`<details class="lesson" open><summary><span class="step">개념</span><b>이론 요약</b></summary><p class="theory-p">${esc(st.theory)}</p></details>`;
 const prac=pr?`<details class="lesson practice"><summary><span class="step">실습</span><b>Unity에서 직접 해보기</b><span class="note">${done.filter(Boolean).length} / ${pr.checks.length}</span></summary><p class="theory-p">${esc(pr.task)}</p><div class="checks">${pr.checks.map((c,i)=>`<label class="chk"><input type="checkbox" data-k="${key}" data-i="${i}" ${done[i]?'checked':''}> <span>${esc(c)}</span></label>`).join('')}</div></details>`:'';
 const sib=stagesOfTier(tid),idx=sib.findIndex(s=>s.key===key),nxt=sib[idx+1],prv=sib[idx-1];
 $('#main').innerHTML=`<div class="stagepage">
  <div class="crumbs"><button class="btn ghost sm" id="back">← 학습 지도</button><span class="note">${esc(tierName(tid))} › ${esc(cat.name)}</span></div>
  <header class="stage-h tier-${tid}"><div><span class="kick">${esc(cat.name)} · 단계 ${si}</span><h2>${esc(st.title)}</h2></div><div class="stage-p"><b>${n} / ${ps.length}</b><span class="note">해결</span>${meterHTML(n,ps.length,'t-'+tid)}</div></header>
  ${lesson}
  <section class="plist"><div class="row sec-r"><span class="step">문제</span><h3 class="sec-h">직접 코드를 작성해요</h3>${first?`<span style="flex:1"></span><button class="btn" id="startnext">${n?'이어서 풀기':'첫 문제 시작'}</button>`:''}</div><div class="prows">${ps.map(row).join('')||'<div class="note">아직 문제가 없어요.</div>'}</div><div class="note" id="genmsg" role="status"></div></section>
  ${prac}
  <div class="stage-nav">${prv?`<button class="btn ghost" data-sn="${prv.cat.id}:${prv.si}">← ${esc(prv.st.title)}</button>`:'<span></span>'}${nxt?`<button class="btn ghost" data-sn="${nxt.cat.id}:${nxt.si}">${esc(nxt.st.title)} →</button>`:'<span></span>'}</div>
 </div>`;
 $('#back').onclick=()=>{V.stage=null;render();window.scrollTo(0,0)};
 $('#main').querySelectorAll('.prow').forEach(b=>b.onclick=()=>openProblem(b.dataset.p));
 const sn=$('#startnext');if(sn)sn.onclick=()=>openProblem(first.id);
 $('#main').querySelectorAll('[data-sn]').forEach(b=>b.onclick=()=>{const [c,s]=b.dataset.sn.split(':');V.stage={cat:c,stage:+s};render();window.scrollTo(0,0)});
 bindPractice($('#main'));
}
