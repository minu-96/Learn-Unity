/* ===== UI ===== */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function md(t){
 let h=esc(t);
 h=h.replace(/```[a-zA-Z#]*\n?([\s\S]*?)```/g,(m,c)=>'<pre>'+c.replace(/\n$/,'')+'</pre>');
 h=h.replace(/`([^`\n]+)`/g,'<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>');
 return h;
}
const VER=3;
const DAY=86400000;
const BOX_DAYS=[1,3,7,16,35];
let S={v:VER,solved:{},dict:{},custom:[],drafts:{},review:{},practice:{},act:{},notes:{}};
let V={tab:'home',cat:'csharp',pid:null,mode:null,tier:null,stage:null},liveTimer=0;
let P=null; /* 현재 문제 화면의 임시 상태 */
let me=null,guest=false,sample=null,saveTimer=0,saving=false,dirty=false,raf=0,aiCtl=null,draftTimer=0;
const LS='unity-training-lab-v3';
const OLD_LS='unity-training-lab';

/* ---------- 상태 저장 ---------- */
function sanitizeCustom(a){
 return (Array.isArray(a)?a:[]).filter(p=>p&&p.starter&&p.solution&&Array.isArray(p.rules)&&p.cat&&p.stage&&p.level).map(p=>Object.assign({goals:[],limits:[],hints:[],concepts:[]},p,{ai:true}));
}
function normalize(d){
 d=d||{};
 /* 예전 객관식 버전의 진행도는 문제가 달라져서 이어받지 않고, 개념 사전만 가져온다 */
 const fresh=d.v===VER;
 return {v:VER,solved:fresh?(d.solved||{}):{},dict:d.dict||{},custom:fresh?sanitizeCustom(d.custom):[],drafts:fresh?(d.drafts||{}):{},review:fresh?(d.review||{}):{},practice:d.practice||{},act:d.act||{},notes:d.notes||{}};
}
const lsKey=()=>me?LS+'-'+me.uid:LS;
function loadLocal(){
 try{
  const r=localStorage.getItem(lsKey());
  if(r){S=normalize(JSON.parse(r));return}
  const o=!me&&localStorage.getItem(OLD_LS);
  if(o){S=normalize(JSON.parse(o))}
 }catch(e){}
}
function trimState(){
 Object.keys(S.drafts).filter(k=>S.solved[k]&&S.solved[k].ok).forEach(k=>delete S.drafts[k]);
 Object.keys(S.drafts).sort((a,b)=>(S.drafts[b].at||0)-(S.drafts[a].at||0)).slice(30).forEach(k=>delete S.drafts[k]);
 S.custom=S.custom.slice(0,24);
}
function persist(){
 trimState();
 try{localStorage.setItem(lsKey(),JSON.stringify(S))}catch(e){}
 dirty=true;clearTimeout(saveTimer);saveTimer=setTimeout(flush,4000);
}
/* 문제별 상태 요약: [0 시도 중 / 1 자력 / 2 정답 참고 / 3 AI 판정, 채점 횟수] - 운영진 화면의 '막히는 문제' 집계용 */
function probMap(){
 const o={};
 for(const p of PROBLEMS){const r=S.solved[p.id];if(!r||!(r.tries||r.ok))continue;o[p.id]=[r.ok?(r.via==='auto'?(r.clean?1:2):3):0,r.tries||0]}
 return o;
}
function setSync(t){const e=$('#sync');if(e)e.textContent=t}
async function flush(){
 if(!me||saving||!dirty)return;
 saving=true;dirty=false;
 try{
  await Store.save({v:VER,solved:S.solved,dict:S.dict,review:S.review,practice:S.practice,act:S.act,notes:S.notes},{custom:S.custom,drafts:S.drafts},summarize(PROBLEMS,S.solved,S.review),probMap());
  setSync('저장됨');
 }catch(e){dirty=true;setSync('저장 실패 · 다시 시도 중');clearTimeout(saveTimer);saveTimer=setTimeout(flush,15000)}
 saving=false;if(dirty&&!saveTimer)saveTimer=setTimeout(flush,4000);
}
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(saveTimer);flush()}});
const allProblems=()=>PROBLEMS.concat(S.custom);
const byId=id=>allProblems().find(p=>p.id===id);
const isSolved=id=>!!(S.solved[id]&&S.solved[id].ok);
const solvedKind=id=>{const r=S.solved[id];if(!r||!r.ok)return null;if(r.via==='auto'&&r.clean)return 'self';if(r.via==='auto')return 'peek';return 'ai'};

function addConcepts(p){
 (p.concepts||[]).forEach(c=>{if(c&&c.term&&!S.dict[c.term])S.dict[c.term]={def:c.def,cat:p.cat,from:p.title,at:Date.now()}});
}
function schedule(p,pass,firstTry){
 if(p.ai)return;
 const now=Date.now(),rv=S.review[p.id];
 if(V.mode==='review'&&rv){
  rv.box=pass&&firstTry?Math.min(BOX_DAYS.length-1,(rv.box||0)+1):0;
  rv.due=now+BOX_DAYS[rv.box]*DAY;rv.last=now;rv.reps=(rv.reps||0)+1;if(pass)bumpAct();return;
 }
 if(!rv&&pass){
  const r=S.solved[p.id]||{};
  const box=(r.via==='auto'&&r.clean&&(r.hint||0)<=1)?1:0;
  S.review[p.id]={box,due:now+BOX_DAYS[box]*DAY,last:now,reps:0};
 }
}
function record(p,ok,extra){
 const r=S.solved[p.id]||{ok:false,tries:0};
 r.tries=(r.tries||0)+1;
 if(ok&&!r.ok)bumpAct();
 if(ok){
  const via=extra&&extra.via||'auto';
  if(via==='auto'){const clean=!(P&&P.peeked)&&(V.mode==='review'||!r.peek);r.via='auto';r.clean=!!(r.clean||clean)}
  else if(!r.ok){r.via='ai';r.clean=false}
  r.ok=true;r.at=r.at||Date.now();
  addConcepts(p);
 }
 S.solved[p.id]=r;
 persist();updateTotal();
}

/* ---------- 실행기: 인터프리터라서 eval/워커 없이 메인 스레드에서 돈다 ---------- */
function run(o){
 return new Promise(res=>setTimeout(()=>{
  try{res(engine(o))}
  catch(e){const err={name:e&&e.name||'Error',message:e&&e.message||String(e),line:e&&e.line};res(o.kind==='unit'?{kind:'unit',results:[],logs:[],error:err}:{kind:'sim',frames:[],logs:[],error:err,fps:o.fps})}
 },16));
}

/* ---------- 공통 렌더 ---------- */
const dueList=()=>Object.entries(S.review).filter(([id,r])=>r.due<=Date.now()&&byId(id)).sort((a,b)=>a[1].due-b[1].due).map(([id])=>id);
function updateTotal(){
 const rb=$('#revcount');if(rb){const d=dueList().length;rb.textContent=d?String(d):'';rb.hidden=!d}
}
function render(){
 cancelAnimationFrame(raf);if(aiCtl){aiCtl.abort();aiCtl=null}
 const tabs=[['home','오늘'],['learn','학습'],['review','복습'],['dict','개념 사전'],['me','내 기록']].concat(me&&me.admin?[['admin','운영']]:[]);
 $('#app').innerHTML=`
 <header class="top"><div class="brand"><b>유니티 훈련소</b></div>
 <nav class="tabs" role="tablist" aria-label="메뉴">${tabs.map(([k,l])=>`<button role="tab" data-tab="${k}" aria-selected="${V.tab===k}">${l}${k==='review'?' <span class="badge new" id="revcount" hidden></span>':''}</button>`).join('')}</nav>${whoHTML()}</header>
 <main id="main"></main>`;
 document.querySelectorAll('nav.tabs button').forEach(b=>b.onclick=()=>gotoTab(b.dataset.tab));
 updateTotal();
 if(V.pid)renderProblem(byId(V.pid));
 else if(V.tab==='dict')renderDict();
 else if(V.tab==='review')renderReview();
 else if(V.tab==='me')renderMe();
 else if(V.tab==='admin'&&me&&me.admin)renderAdmin();
 else if(V.tab==='learn')V.stage?renderStage():renderLearn();
 else renderHome();
 const lo=$('#logout');if(lo)lo.onclick=()=>Store.signOut();
 const li=$('#login');if(li)li.onclick=()=>{guest=false;S=normalize({});renderLogin()};
}
function whoHTML(){
 if(me)return `<div class="who"><span>${esc(me.name)}${me.admin?' · 운영진':''}</span><span class="note" id="sync"></span><button class="btn ghost sm" id="logout">로그아웃</button></div>`;
 if(Store.configured)return `<div class="who"><span class="note">게스트 · 이 브라우저에만 저장</span><button class="btn ghost sm" id="login">로그인</button></div>`;
 return `<div class="who"><span class="note">이 브라우저에만 저장돼요</span></div>`;
}
const openProblem=(id,mode)=>{const p=byId(id);V.pid=id;V.mode=mode||null;if(p&&mode==='review')V.tab='review';else if(p){V.tab='learn';V.stage={cat:p.cat,stage:p.stage}}render();window.scrollTo(0,0)};

/* ---------- 훈련 목록 ---------- */
function stageInfo(p){
 const c=CATS.find(x=>x.id===p.cat),st=c&&c.stages[p.stage-1];
 return `단계 ${p.stage}${st?' · '+st.title:''} · ${LV[p.level]}`;
}
function statusBadge(id){
 const k=solvedKind(id),r=S.solved[id];
 if(k==='self')return '<span class="badge done">해결</span>';
 if(k==='peek')return '<span class="badge done">해결</span><span class="badge ai">정답 참고</span>';
 if(k==='ai')return '<span class="badge done">AI 판정 통과</span>';
 if(r&&r.tries)return `<span class="badge ai">시도 ${r.tries}</span>`;
 if(S.drafts[id])return '<span class="badge ai">작성 중</span>';
 return '';
}
function aiErr(e){
 const c=e&&e.code;
 return {not_granted:'AI 사용이 허용되지 않았어요.',rate_limited:'요청이 많아요. 잠시 뒤에 다시 시도해 주세요.',invalid_json:'AI 응답 형식이 맞지 않았어요. 한 번 더 눌러 주세요.',session_expired:'다시 로그인이 필요해요.',sampling_disabled:'이 계정에서는 AI를 쓸 수 없어요.'}[c]||'AI 응답에 실패했어요. 다시 시도해 주세요.';
}

/* ---------- 복습 ---------- */
function renderReview(){
 const now=Date.now();
 const due=dueList();
 const later=Object.entries(S.review).filter(([id,r])=>r.due>now&&byId(id)).sort((a,b)=>a[1].due-b[1].due);
 const days=t=>{const d=Math.ceil((t-now)/DAY);return d<=1?'내일':d+'일 뒤'};
 const lvl=b=>['새로 익힘','익숙해지는 중','기억함','탄탄함','오래 기억함'][b||0];
 const row=(id,r,isDue)=>{const p=byId(id),c=CATS.find(x=>x.id===p.cat);
  return `<div class="dict-item"><h3>${esc(p.title)} <span class="badge">${c?c.name:''}</span><span class="badge ai">${lvl(r.box)}</span></h3>
   <div class="row"><span class="meta">${isDue?'지금 복습할 차례예요':'다음 복습: '+days(r.due)}${r.reps?` · 복습 ${r.reps}회`:''}</span><span style="flex:1"></span>
   ${isDue?`<button class="btn sm" data-rv="${id}">처음부터 다시 풀기</button>`:''}${sample?`<button class="btn ghost sm" data-var="${id}">AI 변형 문제</button>`:''}</div></div>`};
 $('#main').innerHTML=`<div style="display:flex;flex-direction:column;gap:16px">
  <div class="card"><div><b>간격 반복 복습</b><div class="note">해결한 문제는 잊어버릴 즈음 다시 돌아와요. 복습할 때는 내 예전 코드 없이 시작 코드부터 다시 풀어요. 첫 시도에 통과하면 다음 복습까지 간격이 길어지고, 막히면 다시 짧아져요. 정답을 보거나 AI 판정으로 통과한 문제는 더 빨리 돌아와요.</div></div><div class="note" id="genmsg" role="status"></div></div>
  ${due.length?`<div class="row sec-r"><h2 class="sec-h">지금 복습할 문제 ${due.length}개</h2><span style="flex:1"></span><button class="btn" id="revstart">복습 시작</button></div>${due.slice(0,12).map(id=>row(id,S.review[id],true)).join('')}${due.length>12?`<div class="note">나머지 ${due.length-12}개는 위 문제를 끝내면 이어서 나와요. 하루에 10개 안팎이 적당해요.</div>`:''}`:'<div class="empty">지금 복습할 문제가 없어요.<br>문제를 해결하면 며칠 뒤 이곳에 다시 나타나요.</div>'}
  ${later.length?`<details class="theory"><summary>예정된 복습 ${later.length}개</summary><div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">${later.map(([id,r])=>row(id,r,false)).join('')}</div></details>`:''}
 </div>`;
 document.querySelectorAll('[data-rv]').forEach(b=>b.onclick=()=>openProblem(b.dataset.rv,'review'));
 const rs=$('#revstart');if(rs)rs.onclick=()=>openProblem(dueList()[0],'review');
 document.querySelectorAll('[data-var]').forEach(b=>b.onclick=()=>{const p=byId(b.dataset.var);genSlot(b,p)});
 updateTotal();
}

/* ---------- AI 문제 생성 (코드 작성형) ---------- */
function buildCustom(d,cat,st,lv){
 if(!d||!d.starter||!d.solution||!Array.isArray(d.rules)||!d.rules.length)throw new Error('필드 누락');
 const KINDS={has:1,no:1,in:1,nin:1};
 const rules=d.rules.slice(0,6).map(r=>{
  if(!KINDS[r.k])throw new Error('규칙 종류');
  new RegExp(String(r.re),String(r.fl||'').replace(/[gy]/g,''));
  if((r.k==='in'||r.k==='nin')&&!r.fn)throw new Error('fn 누락');
  return {k:r.k,fn:r.fn?String(r.fn):undefined,label:String(r.label||'조건'),re:String(r.re),fl:String(r.fl||'').replace(/[gy]/g,''),ok:String(r.ok||'조건을 만족해요.'),fail:String(r.fail||'조건을 만족하지 못했어요.')};
 });
 const arr=x=>(Array.isArray(x)?x:[]).map(String).filter(Boolean);
 const p={ai:true,id:'ai-'+Date.now(),cat:cat.id,stage:st,level:lv,title:String(d.title||'AI 문제').slice(0,40),story:String(d.story||''),goals:arr(d.goals).slice(0,6),limits:arr(d.limits).slice(0,5),api:d.api?String(d.api):'',
  starter:String(d.starter),solution:String(d.solution),rules,hints:arr(d.hints).slice(0,4),why:String(d.why||''),concepts:(Array.isArray(d.concepts)?d.concepts:[]).slice(0,3).map(c=>({term:String(c.term),def:String(c.def)}))};
 if(!p.story||p.goals.length<1||p.hints.length<2)throw new Error('내용 부족');
 try{CS.parse(p.solution)}catch(e){throw new Error('정답 코드 문법 오류: '+(e.message||''))}
 const sol=gradeStatic(p,p.solution);
 if(sol.some(i=>!i.ok))throw new Error('정답 코드가 자기 규칙을 통과하지 못함: '+sol.filter(i=>!i.ok).map(i=>i.label).join(','));
 const stt=gradeStatic(p,p.starter);
 if(!stt.some(i=>!i.ok))throw new Error('시작 코드가 이미 통과함');
 return p;
}
async function genSlot(btn,seed){
 const st=seed?seed.stage:+btn.dataset.s,lv=seed?seed.level:+btn.dataset.l,cat=CATS.find(c=>c.id===(seed?seed.cat:V.cat)),sd=cat.stages[st-1],msg=$('#genmsg');
 const btns=document.querySelectorAll('.gen,[data-var]');btns.forEach(b=>b.disabled=true);
 const terms=Object.keys(S.dict).slice(-8).join(', ')||'(없음)';
 const exist=allProblems().filter(p=>p.cat===cat.id&&p.stage===st).map(p=>p.title).join(' / ')||'(없음)';
 const seedText=seed?`\n이 문제는 아래 기존 문제의 "변형"이다. 같은 개념과 같은 함정을 다루되, 게임 상황·변수 이름·숫자·구조를 바꿔서 기존 답을 그대로 베껴서는 풀 수 없게 만든다.\n[기존 문제] ${seed.title}\n${seed.story}\n목표: ${seed.goals.join(' / ')}\n`:'';
 const base=`Unity/C# 게임 개발 학습용 "코드 작성 문제" 1개를 만든다. 객관식이 아니라 학생이 직접 코드를 작성하는 문제다.
카테고리: ${cat.name}(${cat.desc})
단계 ${st}: ${sd.title} (이론 범위: ${sd.theory})
레벨: ${LV[lv]} (Lv.1은 개념을 알면 바로 쓸 수 있는 기본, Lv.2는 상황에 적용하는 응용, Lv.3은 실무에서 겪는 함정이 있는 도전. Lv.3은 원인을 상황 설명에 직접 쓰지 말고 증상만 보여 준다)${seedText}
이미 있는 문제 제목(겹치지 않게): ${exist}
학생이 최근 접한 개념: ${terms} (관련될 때만 반영)
조건:
- story: 구체적인 게임 상황 2~4문장. goals: 학생 코드가 만족해야 할 구체적 조건 2~4개. limits: 제한 사항 1~3개(없으면 빈 배열).
- starter: 학생에게 줄 시작 코드(TODO 주석 포함, 그대로는 조건을 만족하지 못해야 함). solution: 모범 코드. 둘 다 짧게(30줄 이내), 확실히 컴파일되는 Unity C#.
- rules: 코드를 정규식으로 검사하는 규칙 2~5개. 검사 대상은 주석을 제거하고 문자열 내용을 비운 코드다. 종류 k: "has"(코드 어디든 패턴이 있어야 함), "no"(패턴이 없어야 함), "in"(메서드 fn 본문 안에 패턴이 있어야 함), "nin"(메서드 fn 본문 안에 패턴이 없어야 함). 정답 코드는 모든 규칙을 통과하고 시작 코드는 최소 하나를 실패해야 한다. 변수 이름이나 코드 모양이 달라도 올바른 풀이는 통과하도록 패턴은 핵심 API/키워드 위주로 느슨하게(공백은 \\s* 로). re는 JSON 문자열이므로 역슬래시를 두 번 쓴다.
- hints: 점점 구체적인 힌트 3개(정답을 통째로 주지 않음). why: 핵심 원리 2~3문장. concepts: 1~3개.
- 확실하지 않은 Unity 동작은 소재로 쓰지 않는다.
JSON 객체 하나만 답한다: {"title":"25자 이내","story":"","goals":[""],"limits":[""],"api":"쓸 만한 API 한 줄","starter":"","solution":"","rules":[{"k":"in","fn":"메서드명","label":"조건 이름","re":"패턴","fl":"","ok":"통과 메시지","fail":"실패 시 어떻게 고치면 되는지"}],"hints":["","",""],"why":"","concepts":[{"term":"","def":""}]}`;
 let lastErr='',p=null;
 for(let k=0;k<3&&!p;k++){
  if(msg)msg.textContent=k?`다시 만드는 중입니다... (${k+1}/3)`:(seed?'변형 문제를 만드는 중입니다...':'문제를 만드는 중입니다...');
  try{
   const d=await sample.json(base+(lastErr?`\n\n이전 시도의 문제점: ${lastErr}. 이를 고쳐서 다시 만든다.`:''),{cache:false});
   p=buildCustom(d,cat,st,lv);
  }catch(e){
   if(e&&e.code&&e.code!=='invalid_json'){if(msg)msg.textContent=aiErr(e);btns.forEach(b=>b.disabled=false);return}
   lastErr=(e&&e.message)||'형식 오류';
  }
 }
 if(!p){if(msg)msg.textContent='검증을 통과하는 문제를 만들지 못했어요. 한 번 더 눌러 주세요.';btns.forEach(b=>b.disabled=false);return}
 if(seed)p.seed=seed.id;
 S.custom.unshift(p);persist();openProblem(p.id);
}

/* ---------- 문제 화면 ---------- */
const li=a=>a.map(x=>`<li>${esc(x)}</li>`).join('');
function conceptChips(p){return (p.concepts&&p.concepts.length)?`<div class="chips"><span class="note">개념 사전에 추가됨</span>${p.concepts.map(c=>`<span class="chip">${esc(c.term)}</span>`).join('')}</div>`:''}
function nextProblem(p){
 const list=PROBLEMS.filter(x=>x.cat===p.cat).sort((a,b)=>a.stage-b.stage||a.level-b.level);
 const i=list.findIndex(x=>x.id===p.id);
 const after=list.slice(i+1).concat(list.slice(0,Math.max(0,i)));
 return after.find(x=>!isSolved(x.id))||null;
}
/* ---------- 조건 체크(입력하는 동안 바로 갱신되는 정적 검사) ---------- */
function liveItems(p,code){
 try{
  const items=gradeStatic(Object.assign({},p,{starter:'\u0000'}),code).filter(i=>!i.base);
  const same=clean(code).replace(/\s+/g,'')===clean(p.starter).replace(/\s+/g,'');
  return same?items.map(i=>Object.assign({},i,{ok:false})):items;  /* 시작 코드 그대로면 아무것도 충족하지 않은 것으로 본다 */
 }catch(e){return []}
}
function paintLive(){
 const el=$('#live');if(!el||!P)return;
 const p=P.p,items=liveItems(p,$('#code').value),met=items.filter(i=>i.ok).length;
 const runs=!!(p.test||p.check||p.world);
 el.innerHTML=`<div class="live-h"><b>조건 체크</b><span class="note">${items.length?`${met} / ${items.length} 충족`:'채점하면 코드를 실행해서 확인해요'}</span></div>
  <ul class="chipsl">${items.map(i=>{const bad=!i.ok&&/^컴파일/.test(i.label);return `<li class="lc ${i.ok?'ok':bad?'bad':''}"><span aria-hidden="true">${i.ok?'✓':bad?'!':'○'}</span>${esc(i.label)}</li>`}).join('')}${runs?'<li class="lc run"><span aria-hidden="true">▶</span>동작 검사는 채점할 때 실행돼요</li>':''}</ul>`;
}

function renderProblem(p){
 if(!p){V.pid=null;return render()}
 const review=V.mode==='review';
 const d=review?null:S.drafts[p.id];
 P={p,tries:0,hint:0,peeked:false,last:null,code:d?d.code:p.starter,firstFail:false};
 const sim=!!p.world,seen=new Set();
 const cat=CATS.find(c=>c.id===p.cat),stt=cat.stages[p.stage-1],tid=tierOf(p);
 const sibs=stageProblems(p.cat,p.stage),si=sibs.findIndex(x=>x.id===p.id);
 const T=t=>linkTerms(t,seen);
 const editor=`<div class="tools top-tools"><button class="btn" id="grade">채점하기</button><button class="btn ghost sm" id="reset">처음 코드로</button><button class="btn ghost sm" id="sol">정답 보기</button><span class="note">Ctrl/⌘ + Enter로도 채점해요</span></div>
  <div class="edwrap"><pre class="gut" id="gut" aria-hidden="true"></pre><textarea class="ed" id="code" spellcheck="false" autocapitalize="off" autocomplete="off" wrap="off" aria-label="코드 편집기"></textarea></div>
  <div class="live" id="live" aria-live="polite"></div>`;
 $('#main').innerHTML=`<div class="pscreen">
  <div class="crumbs"><button class="btn ghost sm" id="back">← ${review?'복습 목록':'단계 화면'}</button><span class="note">${esc(tierName(tid))} › ${esc(cat.name)} › ${esc(stt.title)} · ${esc(LV[p.level])}</span><span style="flex:1"></span>
   ${!review&&sibs.length>1?`<span class="pnav"><button class="btn ghost sm" id="prevp" aria-label="이전 문제" ${si<=0?'disabled':''}>◀</button><span class="note">${si+1} / ${sibs.length}</span><button class="btn ghost sm" id="nextp" aria-label="다음 문제" ${si>=sibs.length-1?'disabled':''}>▶</button></span>`:''}</div>
  <div class="pgrid">
   <section class="pleft card">
    <div class="row">${review?'<span class="badge new">복습</span>':''}${sim?'<span class="badge sim">시뮬레이션</span>':'<span class="badge">코드 작성</span>'}${p.ai?'<span class="badge ai">AI 생성</span>':''}${review?'':statusBadge(p.id)}<span class="note">약 ${MIN_BY_LV[p.level]||8}분</span></div>
    <h2 class="pt">${esc(p.title)}</h2>
    ${review?'<div class="msg info">복습이에요. 예전에 쓴 코드 없이 시작 코드부터 다시 풀어 보세요. 첫 채점에 통과하면 다음 복습 간격이 길어져요.</div>':''}
    <div class="story">${T(p.story)}</div>
    <div class="spec1"><h4>목표 · 모두 만족해야 통과</h4><ul>${p.goals.map(g=>`<li>${T(g)}</li>`).join('')}</ul></div>
    ${p.limits.length?`<div class="spec1"><h4>제한</h4><ul>${p.limits.map(g=>`<li>${T(g)}</li>`).join('')}</ul></div>`:''}
    ${p.api?`<div class="apiline">쓸 만한 API · <code>${esc(p.api)}</code></div>`:''}
    <div class="hintbox"><button class="btn ghost sm" id="hintbtn">힌트 보기 (0/${p.hints.length})</button><div class="hints" id="hints"></div></div>
    <details class="stuck"><summary>막혔을 때</summary><div class="tutor" id="tutor"></div></details>
   </section>
   <section class="pright">
    <div class="card edcard">${editor}</div>
    ${sim?`<div class="card simcard"><canvas class="cv" id="cv" width="960" height="540"></canvas><pre class="console" id="logs">채점하면 실행 모습과 Debug.Log 출력이 여기에 표시됩니다.</pre></div>`:''}
    <div class="result" id="result" role="status" aria-live="polite"></div>
    <div id="done"></div>
    <div id="solbox"></div>
   </section>
  </div></div>`;
 $('#back').onclick=()=>{V.pid=null;V.mode=null;render();window.scrollTo(0,0)};
 const goSib=k=>{const q=sibs[si+k];if(q)openProblem(q.id)};
 const pv=$('#prevp'),nv=$('#nextp');if(pv)pv.onclick=()=>goSib(-1);if(nv)nv.onclick=()=>goSib(1);
 setupEditor(p);paintLive();
 if(sim){const w=p.world;drawSim($('#cv'),w,[[0,w.start.x,w.start.y,w.target?w.target.cx+w.target.r:0,w.target?w.target.cy:0]],0)}
 $('#grade').onclick=()=>grade(p);
 $('#hintbtn').onclick=()=>showHint(p);
 $('#reset').onclick=()=>{const ta=$('#code');ta.value=p.starter;ta.dispatchEvent(new Event('input'))};
 $('#sol').onclick=()=>showSolution(p);
 if(isSolved(p.id)&&!review)showDone(p,false);
 bindTutor(p);
 bindTerms($('#main'));
}
function setupEditor(p){
 const ta=$('#code'),gut=$('#gut');
 ta.value=P.code;
 const fit=()=>{const n=ta.value.split('\n').length;gut.textContent=Array.from({length:n},(_,i)=>i+1).join('\n');gut.scrollTop=ta.scrollTop};
 const h=Math.max(240,Math.min(560,P.code.split('\n').length*20.8+36));
 ta.style.height=h+'px';gut.style.height=h+'px';
 fit();
 try{new ResizeObserver(()=>{gut.style.height=ta.clientHeight+'px'}).observe(ta)}catch(e){}
 ta.addEventListener('scroll',()=>{gut.scrollTop=ta.scrollTop});
 ta.addEventListener('input',()=>{
  fit();P.code=ta.value;markLine(null);clearTimeout(liveTimer);liveTimer=setTimeout(paintLive,180);
  if(V.mode==='review')return;
  clearTimeout(draftTimer);
  draftTimer=setTimeout(()=>{
   if(isSolved(p.id))return;
   if(ta.value===p.starter)delete S.drafts[p.id];else S.drafts[p.id]={code:ta.value.slice(0,8000),at:Date.now()};
   persist();
  },700);
 });
 const ins=t=>{ta.focus();let ok=false;try{ok=document.execCommand&&document.execCommand('insertText',false,t)}catch(e){}if(!ok){ta.setRangeText(t,ta.selectionStart,ta.selectionEnd,'end');ta.dispatchEvent(new Event('input'))}};
 ta.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();grade(p);return}
  if(e.isComposing)return;
  const s=ta.selectionStart,v=ta.value;
  if(e.key==='Tab'&&!e.shiftKey){e.preventDefault();ins('    ');return}
  if(e.key==='Tab'&&e.shiftKey){
   e.preventDefault();
   const ls=v.lastIndexOf('\n',s-1)+1,m=v.slice(ls).match(/^ {1,4}/);
   if(m){ta.setRangeText('',ls,ls+m[0].length,'preserve');ta.selectionStart=ta.selectionEnd=Math.max(ls,s-m[0].length);ta.dispatchEvent(new Event('input'))}
   return;
  }
  if(e.key==='Enter'&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&s===ta.selectionEnd){
   const ls=v.lastIndexOf('\n',s-1)+1,line=v.slice(ls,s),ind=line.match(/^\s*/)[0];
   const open=/\{\s*$/.test(line),extra=open?'    ':'';
   e.preventDefault();
   if(open&&v[s]==='}'){ins('\n'+ind+extra+'\n'+ind);ta.selectionStart=ta.selectionEnd=s+1+ind.length+extra.length}
   else ins('\n'+ind+extra);
   return;
  }
  if(e.key==='}'&&s===ta.selectionEnd){
   const ls=v.lastIndexOf('\n',s-1)+1,line=v.slice(ls,s);
   if(/^ {4,}$/.test(line)){e.preventDefault();ta.setRangeText('}',s-4,s,'end');ta.dispatchEvent(new Event('input'))}
  }
 });
}
/* 에러가 난 줄을 줄 번호 칸에 표시하고 그 줄로 이동 */
function markLine(line){
 const gut=$('#gut'),ta=$('#code');if(!gut||!ta)return;
 const n=ta.value.split('\n').length;
 if(!line){gut.innerHTML=Array.from({length:n},(_,i)=>i+1).join('\n');gut.scrollTop=ta.scrollTop;return}
 gut.innerHTML=Array.from({length:n},(_,i)=>i+1===line?`<b class="errln">${i+1}</b>`:String(i+1)).join('\n');
 gut.scrollTop=ta.scrollTop;
}
function gotoLine(line){
 const ta=$('#code');if(!ta||!line)return;
 const lines=ta.value.split('\n');let pos=0;for(let i=0;i<line-1&&i<lines.length;i++)pos+=lines[i].length+1;
 ta.focus();ta.setSelectionRange(pos,pos+(lines[line-1]||'').length);
 ta.scrollTop=Math.max(0,(line-4)*20.8);markLine(line);
}

/* ----- 시뮬레이션 그리기 ----- */
function drawSim(cv,level,frames,i){
 const ctx=cv.getContext('2d'),W=cv.width,H=cv.height,k=W/480;
 ctx.fillStyle='#0F1A21';ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='#1C2B35';ctx.lineWidth=1;
 for(let x=0;x<=480;x+=40){ctx.beginPath();ctx.moveTo(x*k,0);ctx.lineTo(x*k,H);ctx.stroke()}
 for(let y=0;y<=270;y+=45){ctx.beginPath();ctx.moveTo(0,y*k);ctx.lineTo(W,y*k);ctx.stroke()}
 const Y=y=>H-y*k;
 if(level.goal){ctx.strokeStyle='#F0B94A';ctx.lineWidth=2*k;ctx.beginPath();ctx.arc(level.goal.x*k,Y(level.goal.y),level.goal.r*k,0,7);ctx.stroke()}
 const f=frames[Math.min(i,frames.length-1)];
 if(f){
  ctx.strokeStyle='rgba(76,194,204,.35)';ctx.lineWidth=1.5*k;ctx.beginPath();
  const st=Math.max(1,Math.floor(i/300));
  for(let j=0;j<=i;j+=st){const q=frames[j];if(j===0)ctx.moveTo(q[1]*k,Y(q[2]));else ctx.lineTo(q[1]*k,Y(q[2]))}
  ctx.stroke();
  if(level.target){ctx.fillStyle='#F08A5F';ctx.beginPath();ctx.arc(f[3]*k,Y(f[4]),7*k,0,7);ctx.fill()}
  ctx.fillStyle='#4CC2CC';ctx.fillRect(f[1]*k-8*k,Y(f[2])-8*k,16*k,16*k);
  ctx.fillStyle='#9FB4C0';ctx.font=`${11*k}px monospace`;ctx.fillText(`t=${f[0].toFixed(2)}s  x=${f[1].toFixed(0)} y=${f[2].toFixed(0)}`,8*k,16*k);
 }
}
function playSim(cv,level,res){
 cancelAnimationFrame(raf);
 const f=res.frames;if(!f||!f.length){return}
 const t0=performance.now();
 const step=()=>{const t=(performance.now()-t0)/1000,i=Math.min(f.length-1,Math.floor(t*res.fps));drawSim(cv,level,f,i);if(i<f.length-1)raf=requestAnimationFrame(step)};
 raf=requestAnimationFrame(step);
}

/* ----- 채점 ----- */
function resultHTML(p,out){
 const items=out.items,n=items.filter(i=>i.ok).length,tot=items.length;
 const lineOf=m=>{const x=/^(\d+)번째 줄/.exec(m||'');return x?+x[1]:null};
 const row=i=>{const ln=i.ok?null:lineOf(i.msg);return `<li class="it ${i.ok?'ok':'no'}"><span class="mk" aria-hidden="true">${i.ok?'✓':'✗'}</span><div class="tx2"><b>${esc(i.label)} <span class="note" style="display:inline">${i.ok?'충족':'미충족'}</span></b><span>${esc(i.msg||'')}</span>${ln?`<button class="btn ghost sm goline" data-line="${ln}">${ln}번째 줄로 이동</button>`:''}</div></li>`};
 const req=items.filter(i=>i.sec!=='test'),tst=items.filter(i=>i.sec==='test');
 const head=out.pass?`<div class="sum ok">통과! 모든 조건(${tot}개)을 만족했어요.</div>`:`<div class="sum no">${tot}개 조건 중 ${n}개를 만족했어요. 미충족 항목을 고쳐서 다시 채점해 보세요.</div>`;
 const tool=!out.pass&&out.toolLimit&&!sample?`<div class="msg info">이 연습장의 C# 실행기는 Unity의 일부만 흉내 내요. 코드가 실제 Unity에서 맞다고 확신하면 아래 '채점이 이상해요'로 운영진에게 알려 주세요.</div>`:!out.pass&&out.toolLimit&&sample?`<div class="msg info">이 연습장의 C# 실행기는 Unity의 일부만 흉내 내요. 실제 Unity에서는 맞는 코드라고 생각되면 AI 판정으로 확인받을 수 있어요. <button class="btn ghost sm" id="inlineJudge">AI 판정 받기</button></div>`:'';
 const body=(req.length?`<div class="res-sec"><h4>요구사항 · 컴파일 검사</h4><ul class="items">${req.map(row).join('')}</ul></div>`:'')+(tst.length?`<div class="res-sec"><h4>동작 검사 (코드를 실제로 실행)</h4><ul class="items">${tst.map(row).join('')}</ul></div>`:'');
 return head+tool+(out.pass?`<details class="resdet"><summary>조건별 결과 보기</summary>${body}</details>`:body);
}
async function grade(p){
 const btn=$('#grade');if(!btn||btn.disabled)return;
 btn.disabled=true;btn.textContent='채점 중...';
 const code=$('#code').value;
 let out;
 try{out=await gradeAll(p,code,run)}catch(e){out={items:[{sec:'req',ok:false,label:'채점 오류',msg:'채점 중 문제가 생겼어요: '+(e&&e.message)}],pass:false,logs:[]}}
 if(!$('#grade')||P.p!==p)return;
 btn.disabled=false;btn.textContent='다시 채점';
 const passed=out.pass;
 const firstTry=P.tries===0&&!P.firstFail;
 if(!passed&&P.tries===0)P.firstFail=true;
 P.last=out;P.tries++;
 $('#result').innerHTML=resultHTML(p,out);
 document.querySelectorAll('.goline').forEach(b=>b.onclick=()=>gotoLine(+b.dataset.line));
 const ij=$('#inlineJudge');if(ij)ij.onclick=()=>aiJudge(p);
 const firstLine=(out.items.find(i=>!i.ok&&/^\d+번째 줄/.test(i.msg||''))||{}).msg;
 markLine(firstLine?+/^(\d+)/.exec(firstLine)[1]:null);
 if(p.world&&out.show){playSim($('#cv'),p.world,out.show)}
 const lg=$('#logs');if(lg&&p.world)lg.textContent=(out.logs&&out.logs.length)?out.logs.join('\n'):'(Debug.Log 출력 없음)';
 const was=isSolved(p.id);
 record(p,passed,passed?{via:'auto'}:null);
 if(passed){schedule(p,true,firstTry);if(!was)delete S.drafts[p.id];persist()}
 else if(V.mode==='review'&&P.tries===1){/* 복습 첫 시도 실패는 통과 시 상자를 0으로 */}
 if(passed)showDone(p,!was||V.mode==='review');
 $('#result').scrollIntoView({block:'nearest',behavior:'smooth'});
}
function showDone(p,fresh){
 const review=V.mode==='review';
 const sibs=stageProblems(p.cat,p.stage),i=sibs.findIndex(x=>x.id===p.id);
 const nx=review?null:(sibs.slice(i+1).find(x=>!isSolved(x.id))||nextUnsolved());
 const rv=S.review[p.id],nextDue=rv?Math.max(1,Math.round((rv.due-Date.now())/DAY)):null;
 const kind=solvedKind(p.id),r=S.solved[p.id]||{};
 const note=review?(P.firstFail?'복습 통과! 처음에 막혔으니 곧 다시 복습할게요.':`복습 통과! 다음 복습은 ${nextDue}일 뒤예요.`):(kind==='peek'?'정답을 본 뒤 해결했어요. 며칠 뒤 복습에서 스스로 다시 풀어 보세요.':kind==='ai'?'AI 판정으로 통과했어요. 복습에서 자동 채점으로도 통과해 보세요.':'');
 const mine=$('#code')?$('#code').value:'';
 const saved=(S.notes[p.id]||{}).t||'';
 const feel=r.feel||'';
 const fb=(k,l)=>`<button class="btn ghost sm" data-f="${k}" aria-pressed="${feel===k}">${l}</button>`;
 $('#done').innerHTML=`<div class="donebox"><div class="verdict ok">${fresh?'해결했어요!':'이미 해결한 문제예요.'}</div>${note?`<div class="note">${esc(note)}</div>`:''}
  <div class="cmp"><div><h4>내 코드</h4><pre class="code cmpcode">${esc(mine)}</pre></div><div><h4>모범 코드</h4><pre class="code cmpcode">${esc(p.solution)}</pre></div></div>
  <div class="note">같은 결과를 내는 코드는 여러 가지일 수 있어요. 다른 부분이 있다면 왜 다른지 생각해 보세요.</div>
  <div class="exp">${esc(p.why)}</div>${conceptChips(p)}
  ${review?'':`<div class="reflect"><label for="note">새로 알게 된 점을 한 줄로 남겨 보세요 <span class="note">개념 사전에 내 메모로 저장돼요</span></label><div class="ask"><input id="note" type="text" maxlength="120" value="${esc(saved)}" placeholder="예: Update에서는 deltaTime을 곱해야 한다"><button class="btn ghost" id="savenote">저장</button></div><span class="note" id="notemsg" role="status"></span></div>
  <div class="feel"><span class="note">풀어 보니 어땠나요?</span>${fb('easy','쉬웠어요')}${fb('ok','보통이에요')}${fb('hard','어려웠어요')}</div>`}
  <div class="tools">${nx?`<button class="btn" id="next">다음 문제 · ${esc(nx.title)}</button>`:''}${review&&dueList().length?'<button class="btn" id="nextrev">다음 복습</button>':''}<button class="btn ghost" id="tolist">${review?'복습 목록으로':'단계 화면으로'}</button></div></div>`;
 const n=$('#next');if(n)n.onclick=()=>openProblem(nx.id);
 const nr=$('#nextrev');if(nr)nr.onclick=()=>openProblem(dueList()[0],'review');
 $('#tolist').onclick=()=>{V.pid=null;V.mode=null;render();window.scrollTo(0,0)};
 const sv=$('#savenote');
 if(sv){
  const save=()=>{const t=$('#note').value.trim().slice(0,120);if(t)S.notes[p.id]={t,at:Date.now()};else delete S.notes[p.id];persist();$('#notemsg').textContent=t?'저장했어요. 개념 사전에서 볼 수 있어요.':'메모를 지웠어요.'};
  sv.onclick=save;$('#note').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();save()}});
 }
 document.querySelectorAll('.feel [data-f]').forEach(b=>b.onclick=()=>{
  const rr=S.solved[p.id];if(!rr)return;rr.feel=b.dataset.f;
  const v=S.review[p.id];if(v&&!v.reps){v.box=rr.feel==='hard'?0:rr.feel==='easy'?Math.max(v.box,2):v.box;v.due=Date.now()+BOX_DAYS[v.box]*DAY}
  persist();document.querySelectorAll('.feel [data-f]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 });
 if(fresh)$('#done').scrollIntoView({block:'nearest',behavior:'smooth'});
}
function showHint(p){
 if(P.hint>=p.hints.length)return;
 P.hint++;
 const b=$('#hintbtn');b.textContent=`힌트 (${P.hint}/${p.hints.length})`;if(P.hint>=p.hints.length)b.disabled=true;
 $('#hints').innerHTML=p.hints.slice(0,P.hint).map((h,i)=>`<div class="hint"><b>힌트 ${i+1}</b>${esc(h)}</div>`).join('');
 if(V.mode!=='review'){const r=S.solved[p.id]||{ok:false,tries:0};r.hint=Math.max(r.hint||0,P.hint);S.solved[p.id]=r;persist()}
}
let solTimer=0;
function showSolution(p){
 const b=$('#sol');
 if(!P.tries&&!(isSolved(p.id)&&V.mode!=='review')){
  $('#solbox').innerHTML='<div class="msg info">먼저 한 번 채점해 보세요. 어디가 막혔는지 결과를 본 뒤에 정답을 보면 훨씬 많이 배워요.</div>';return;
 }
 if(!P.peeked&&!(isSolved(p.id)&&V.mode!=='review')&&b.dataset.armed!=='1'){
  b.dataset.armed='1';b.textContent='정말 볼까요? 한 번 더';
  clearTimeout(solTimer);solTimer=setTimeout(()=>{if($('#sol')){$('#sol').dataset.armed='';$('#sol').textContent='정답 보기'}},4000);return;
 }
 P.peeked=true;b.dataset.armed='';b.textContent='정답 보기';
 if(!isSolved(p.id)){const r=S.solved[p.id]||{ok:false,tries:0};r.peek=true;S.solved[p.id]=r;persist()}
 if(V.mode==='review')P.firstFail=true;
 $('#solbox').innerHTML=`<div class="aibox"><h4>모범 코드</h4><pre class="code" style="padding:10px 14px">${esc(p.solution)}</pre><div class="note">내 코드와 비교해 보고, 왜 이렇게 쓰는지 아래 AI 튜터에게 물어보세요. 정답을 보고 푼 문제는 복습에서 스스로 다시 풀어 보게 돼요.</div>${p.why?`<div class="exp">${esc(p.why)}</div>`:''}</div>`;
}

/* ---------- AI 튜터 / 리뷰 / 판정 ---------- */
const RULES='너는 Unity/C# 게임 개발을 가르치는 튜터다. 학생은 대학교에서 게임을 만드는 입문~중급자다. 한국어로 짧고 구체적으로 답한다. 학생은 직접 코드를 작성하는 문제를 풀고 있고, 자동 채점기는 정규식 규칙과 Unity를 흉내 낸 간이 C# 실행기로 검사한다(실제 Unity와 다를 수 있다). 학생이 아직 통과하지 못했다면 완성 코드를 통째로 알려주지 말고, 어디가 왜 틀렸는지 짚고 다음에 시도할 방향을 단계적 힌트나 되묻는 질문으로 알려준다. 학생이 통과했거나 정답을 확인했다면 코드 개선점, 다른 접근법, 실무 팁을 자유롭게 설명해도 된다. 코드 예시는 Unity C#으로 짧게 보여준다.';
function ctxOf(p){
 const ta=$('#code'),code=ta?ta.value:p.starter,r=P&&P.last;
 return `[문제] ${p.title}\n[상황] ${p.story}\n[목표]\n- ${p.goals.join('\n- ')}\n[제한]\n- ${p.limits.join('\n- ')||'(없음)'}\n[학생의 현재 코드]\n${code}\n`+
  (r?`[자동 채점 결과]\n${r.items.map(i=>(i.ok?'✓ ':'✗ ')+i.label+': '+i.msg).join('\n')}\n`:'[아직 채점하지 않았다]\n')+
  (isSolved(p.id)&&V.mode!=='review'?'학생은 이미 통과했다.':(P&&P.peeked)?'학생은 정답 코드를 확인했다.':'학생은 아직 통과하지 못했다.');
}
function bindTutor(p){
 const box=$('#tutor');if(!box)return;
 if(!sample){
  const can=!!me;
  box.innerHTML=`<h3>막혔을 때</h3><ol class="note" style="margin:0;padding-left:20px"><li>채점 결과의 ✗ 항목과 '○번째 줄' 안내를 먼저 확인해요.</li><li>힌트를 한 단계씩 열어 보세요. 정답 보기는 마지막에 써요.</li><li>채점이 틀린 것 같으면 아래 버튼으로 운영진에게 알려 주세요.</li></ol>
  ${can?`<div class="ask"><input type="text" id="repnote" placeholder="어떤 점이 이상한지 한 줄 (선택)" maxlength="200" aria-label="신고 내용"><button class="btn ghost" id="report">채점이 이상해요</button></div><div class="note" id="repmsg" role="status">신고하면 지금 작성한 코드와 채점 결과가 운영진에게 전달돼요.</div>`:'<div class="note">로그인하면 채점 오류를 운영진에게 신고할 수 있어요.</div>'}`;
  if(can)$('#report').onclick=async()=>{
   const b=$('#report'),r=P&&P.last;b.disabled=true;
   try{
    await Store.report({pid:p.id,title:p.title,note:($('#repnote').value||'').slice(0,200),code:($('#code').value||'').slice(0,6000),fails:r?r.items.filter(i=>!i.ok).slice(0,6).map(i=>i.label+': '+i.msg):[]});
    $('#repmsg').textContent='운영진에게 전달했어요. 확인 후 채점을 고칠게요.';
   }catch(e){b.disabled=false;$('#repmsg').textContent='전달하지 못했어요. 잠시 뒤 다시 시도해 주세요.'}
  };
  return}
 const quick=[['내 코드 리뷰','내 현재 코드를 리뷰해 주세요. 잘한 점과, 목표/제한에 비춰 문제가 되는 점을 짚되 완성 코드는 주지 마세요. 통과했다면 개선점 위주로 알려주세요.'],['막혔어요','정답은 말하지 말고, 지금 코드에서 가장 먼저 고쳐야 할 부분이 어디인지 방향만 알려주세요.'],['에러 설명','채점 결과에 나온 에러나 실패 메시지가 무슨 뜻인지, 실제 Unity에서는 어떻게 보이는지 쉽게 설명해 주세요. 고친 코드는 주지 마세요.']];
 box.innerHTML=`<h3>AI 튜터</h3><div class="tools">${quick.map((q,i)=>`<button class="btn ghost sm" data-q="${i}">${q[0]}</button>`).join('')}<button class="btn ghost sm" id="aijudge">AI 판정 받기</button><button class="btn ghost sm" id="stop" hidden>멈추기</button></div>
  <div class="note">자동 채점이 틀린 것 같을 때는 "AI 판정"으로 내 코드를 목표 기준으로 다시 평가받을 수 있어요. 통과로 판정되면 "AI 판정 통과"로 기록되고, 복습에서 다시 확인하게 돼요.</div>
  <div id="judgebox"></div><div class="ai-out" id="aiout"></div><div class="ask"><input type="text" id="ask" placeholder="이 문제에서 궁금한 점을 물어보세요" aria-label="튜터에게 질문"><button class="btn" id="send">질문</button></div>`;
 const hist=[];
 const ask=async q=>{
  if(!q.trim())return;
  const out=$('#aiout'),qe=document.createElement('div');qe.className='ai-q';qe.textContent=q;out.append(qe);
  const ae=document.createElement('div');ae.className='ai-a';ae.textContent='생각하는 중...';out.append(ae);
  $('#send').disabled=true;$('#stop').hidden=false;
  aiCtl=new AbortController();
  const turns=[{role:'user',content:RULES+'\n\n'+ctxOf(p)},...hist.slice(-6),{role:'user',content:q}];
  try{
   const r=await sample(turns,{cache:false,signal:aiCtl.signal,modelTier:'default',onText:({text})=>{ae.innerHTML=md(text)}});
   hist.push({role:'user',content:q},{role:'assistant',content:r.text});
   if(hist[0].role!=='user')hist.shift();
  }catch(e){
   if(e&&e.text)ae.innerHTML=md(e.text);else ae.textContent=e&&e.code==='cancelled'?'(멈췄어요)':aiErr(e);
  }
  const s=$('#send');if(s){s.disabled=false;$('#stop').hidden=true}aiCtl=null;
 };
 box.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>ask(quick[+b.dataset.q][1]));
 $('#send').onclick=()=>{const i=$('#ask'),v=i.value;i.value='';ask(v)};
 $('#ask').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();$('#send').click()}});
 $('#stop').onclick=()=>aiCtl&&aiCtl.abort();
 $('#aijudge').onclick=()=>aiJudge(p);
}
async function aiJudge(p){
 const btn=$('#aijudge'),box=$('#judgebox');
 if(!sample||!btn)return;
 btn.disabled=true;btn.textContent='판정 중...';
 const ij=$('#inlineJudge');if(ij){ij.disabled=true;ij.textContent='판정 중...'}
 box.scrollIntoView({block:'nearest',behavior:'smooth'});
 const code=$('#code').value,r=P.last;
 const prompt=`너는 Unity/C# 코드를 채점하는 엄격하지만 공정한 채점관이다. 학생이 작성한 코드가 아래 문제의 목표를 모두 만족하고 제한을 어기지 않았는지, Unity에서 컴파일되고 의도대로 동작할지 판정한다.
- 목표와 제한 기준으로만 판단한다. 변수 이름, 코드 스타일 같은 사소한 차이는 감점하지 않는다. 모범 코드와 다른 올바른 풀이도 통과시킨다.
- 컴파일 에러(예: transform.position.x 직접 대입, float에 double 리터럴 대입), 목표 누락, 제한 위반, 논리 오류가 있으면 통과가 아니다. 확실하지 않으면 통과시키지 않는다.
- 자동 채점기는 Unity를 흉내 낸 간이 실행기라 실제 Unity와 다를 수 있다. 자동 채점 결과는 참고만 하고, 실제 Unity 기준으로 판단한다.
- 각 목표/제한을 하나의 항목으로 평가하고, 틀린 항목은 어떻게 고치면 되는지 완성 코드 없이 알려준다.

[문제] ${p.title}
[상황] ${p.story}
[목표]
- ${p.goals.join('\n- ')}
[제한]
- ${p.limits.join('\n- ')||'(없음)'}
[모범 코드(참고용)]
${p.solution}
[학생 코드]
${code}
${r?`[자동 채점기 결과(참고, 틀릴 수 있음)]\n${r.items.map(i=>(i.ok?'✓ ':'✗ ')+i.label+': '+i.msg).join('\n')}`:''}

JSON 객체 하나만 답한다: {"pass":true 또는 false,"summary":"한두 문장 총평","items":[{"label":"항목 이름","ok":true 또는 false,"msg":"설명 한 문장"}]}`;
 try{
  const d=await sample.json(prompt,{cache:false,modelTier:'default'});
  if(!d||typeof d.pass!=='boolean'||!Array.isArray(d.items))throw {code:'invalid_json'};
  const items=d.items.slice(0,10).map(i=>({ok:!!i.ok,label:String(i.label||''),msg:String(i.msg||'')}));
  const pass=d.pass&&items.every(i=>i.ok);
  box.innerHTML=`<div class="aibox"><h4>AI 판정</h4><div class="sum ${pass?'ok':'no'}">${pass?'통과로 판정했어요.':'아직 통과로 보기 어려워요.'} ${esc(d.summary||'')}</div><ul class="items">${items.map(i=>`<li class="it ${i.ok?'ok':'no'}"><span class="mk" aria-hidden="true">${i.ok?'✓':'✗'}</span><div class="tx2"><b>${esc(i.label)}</b><span>${esc(i.msg)}</span></div></li>`).join('')}</ul><div class="note">AI 판정은 자동 채점보다 느슨할 수 있어요. 동작이 의심되면 직접 확인해 보세요.</div></div>`;
  if(P.p===p){
   const was=isSolved(p.id);
   record(p,pass,pass?{via:'ai'}:null);
   if(pass){if(V.mode==='review')schedule(p,true,false);else schedule(p,true,false);delete S.drafts[p.id];persist();showDone(p,!was)}
  }
 }catch(e){box.innerHTML=`<div class="msg no">${esc(aiErr(e))}</div>`}
 if($('#aijudge')){$('#aijudge').disabled=false;$('#aijudge').textContent='AI 판정 받기'}
 if($('#inlineJudge')){$('#inlineJudge').disabled=false;$('#inlineJudge').textContent='AI 판정 받기'}
}

/* ---------- 개념 사전 ---------- */
function renderDict(){
 const keys=Object.keys(S.dict).sort((a,b)=>(S.dict[b].at||0)-(S.dict[a].at||0));
 $('#main').innerHTML=`<div style="display:flex;flex-direction:column;gap:16px">
  <div class="card"><div><b>모르는 개념 정리하기</b><div class="note">문제를 해결하면 그 문제의 개념이 자동으로 쌓입니다. 따로 궁금한 개념은 직접 물어서 사전에 추가하세요.</div></div>
  <div class="ask"><input type="text" id="term" placeholder="${sample?'예: 델리게이트, Raycast, Coroutine':'개념 이름 (예: Raycast)'}" aria-label="개념 이름"><button class="btn" id="addterm">${sample?'AI로 정리':'추가'}</button></div>${sample?'':'<textarea id="termdef" rows="2" placeholder="내 말로 정리한 설명" aria-label="개념 설명" style="width:100%;font:inherit;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink)"></textarea>'}<div class="note" id="dmsg"></div></div>
  ${keys.length?`<input type="text" id="filter" placeholder="사전 검색" aria-label="사전 검색"><div id="dlist" style="display:flex;flex-direction:column;gap:8px"></div>`:'<div class="empty">아직 정리된 개념이 없어요.<br>문제를 하나 해결하면 해당 개념이 자동으로 이곳에 쌓입니다.</div>'}</div>`;
 const noteMap={};
 Object.entries(S.notes).forEach(([pid,n])=>{const q=byId(pid);if(q&&n&&n.t)(q.concepts||[]).forEach(c=>{(noteMap[c.term]=noteMap[c.term]||[]).push({t:n.t,from:q.title})})});
 const fill=()=>{
  const q=(($('#filter')||{}).value||'').toLowerCase();
  $('#dlist').innerHTML=keys.filter(k=>!q||k.toLowerCase().includes(q)||(S.dict[k].def||'').toLowerCase().includes(q)).map(k=>{const d=S.dict[k],cat=CATS.find(c=>c.id===d.cat);
   return `<div class="dict-item"><h3>${esc(k)}${cat?`<span class="badge">${cat.name}</span>`:''}</h3><p>${esc(d.def||'')}</p>${d.ex?`<pre class="code" style="padding:8px 12px">${esc(d.ex)}</pre>`:''}${d.pit?`<p class="note">주의: ${esc(d.pit)}</p>`:''}${(noteMap[k]||[]).map(n=>`<p class="mynote"><b>내 메모</b> ${esc(n.t)} <span class="note">${esc(n.from)}</span></p>`).join('')}
   <div class="row"><span class="meta">${d.from?'출처: '+esc(d.from):''}</span><span style="flex:1"></span>${sample&&!d.ex?`<button class="btn ghost sm" data-more="${esc(k)}">AI로 자세히</button>`:''}<button class="btn ghost sm" data-del="${esc(k)}">삭제</button></div></div>`}).join('')||'<div class="note">검색 결과가 없어요.</div>';
  document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{delete S.dict[b.dataset.del];persist();render()});
  document.querySelectorAll('[data-more]').forEach(b=>b.onclick=()=>explain(b.dataset.more,b));
 };
 if(keys.length){fill();$('#filter').oninput=fill}
 const add=()=>{
  const t=$('#term').value.trim();if(!t)return;
  if(sample){explain(t,$('#addterm'));return}
  const d=($('#termdef').value||'').trim();
  if(!d){$('#dmsg').textContent='설명을 한 줄이라도 적어 주세요. 내 말로 정리하면 오래 기억돼요.';return}
  S.dict[t.slice(0,60)]={def:d.slice(0,400),at:Date.now(),from:'직접 정리'};persist();render();
 };
 $('#addterm').onclick=add;$('#term').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing)add()});
}
async function explain(term,btn){
 if(!sample)return;
 const old=btn.textContent;btn.disabled=true;btn.textContent='정리 중...';
 try{
  const d=await sample.json(`Unity/C# 게임 개발을 배우는 대학생을 위해 개념 "${term}"을 정리한다. JSON 객체 하나만 답한다: {"term":"개념 이름","def":"쉬운 2문장 설명","ex":"짧은 Unity C# 예시 코드 5줄 이내","pit":"흔한 실수 한 문장"}`,{cache:false,modelTier:'quick'});
  const key=String(d.term||term).slice(0,60);
  const prev=S.dict[key]||S.dict[term]||{};
  S.dict[key]={def:String(d.def||prev.def||''),ex:String(d.ex||''),pit:String(d.pit||''),cat:prev.cat,from:prev.from,at:prev.at||Date.now()};
  persist();render();
 }catch(e){btn.disabled=false;btn.textContent=old;const m=$('#dmsg');if(m)m.textContent=aiErr(e)}
}

/* ---------- 시작 ---------- */
function mergeState(r){
 /* 다른 기기에서 쓴 기록과 합친다: 해결한 쪽을 우선하고, 채점 횟수는 큰 쪽을 쓴다 */
 const o=normalize(r),L=S;
 for(const [id,x] of Object.entries(o.solved)){const y=L.solved[id];
  if(!y)L.solved[id]=x;
  else{const w=(x.ok&&!y.ok)?x:(y.ok&&!x.ok)?y:(x.clean&&!y.clean)?x:y;L.solved[id]=Object.assign({},w,{tries:Math.max(x.tries||0,y.tries||0),clean:!!(x.clean||y.clean)&&w.via==='auto'})}}
 for(const [k,x] of Object.entries(o.dict))if(!L.dict[k])L.dict[k]=x;
 for(const [k,x] of Object.entries(o.review)){const y=L.review[k];if(!y||(x.last||0)>(y.last||0))L.review[k]=x}
 for(const [k,x] of Object.entries(o.practice)){const y=L.practice[k]||[];L.practice[k]=x.map((v,i)=>!!(v||y[i]))}
 for(const [k,x] of Object.entries(o.act))L.act[k]=Math.max(L.act[k]||0,x);
 for(const [k,x] of Object.entries(o.notes)){const y=L.notes[k];if(!y||(x.at||0)>(y.at||0))L.notes[k]=x}
}
async function boot(){
 S=normalize({});loadLocal();
 render();
 if(me){
  try{
   const cloud=await Store.load();
   if(cloud){
    if(cloud.state)mergeState(cloud.state);
    if(cloud.work){const w=cloud.work;if(!S.custom.length)S.custom=sanitizeCustom(w.custom);S.drafts=Object.assign({},w.drafts,S.drafts)}
   }
   setSync('저장됨');
  }catch(e){setSync('불러오기 실패 · 이 기기 기록만 표시')}
  persist();
 }
 if((location.hash==='#admin'||window.wantAdmin)&&me&&me.admin)V.tab='admin';
 if(!V.pid){render()}else{bindTutor(byId(V.pid))}
 updateTotal();
}
async function init(){
 try{me=await Store.init()}catch(e){me=null}
 Store.onChange(u=>{
  if(u){me=u;if(window.wantAdmin&&!u.admin){Store.signOut();renderAdminLogin('이 계정은 운영진이 아니에요. 운영진 아이디로 접속해 주세요.');return}boot()}
  else if(me){me=null;guest=false;window.wantAdmin=false;S=normalize({});V={tab:'home',cat:'csharp',pid:null,mode:null,tier:null,stage:null};P=null;renderLogin()}
 });
 const wantAdmin=location.hash==='#admin';
 if(Store.configured&&!me){wantAdmin?renderAdminLogin():renderLogin();return}
 if(wantAdmin&&me&&!me.admin){renderAdminLogin('이 계정은 운영진이 아니에요. 로그아웃 후 운영진 계정으로 접속해 주세요.');return}
 await boot();
}
init();
