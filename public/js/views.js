/* ===== 로그인 · 내 기록 · 운영진 화면 ===== (ui.js의 전역 S, $, esc, byId 등을 호출 시점에 사용한다) */
const DAYMS=86400000;
function ago(ms){
 if(!ms)return '기록 없음';
 const d=Math.floor((Date.now()-ms)/DAYMS);
 if(d<=0){const h=Math.floor((Date.now()-ms)/3600000);return h<=0?'방금':h+'시간 전'}
 return d+'일 전';
}
const pct=(a,b)=>b?Math.round(a/b*100):0;
const meter=(a,b,cls)=>`<span class="meter ${cls||''}" role="img" aria-label="${a} / ${b}"><i style="width:${pct(a,b)}%"></i></span>`;

/* ---------- 로그인 ---------- */
function renderLogin(msg){
 window.wantAdmin=false;
 $('#app').innerHTML=`<div class="login"><h1>유니티 훈련소</h1>
  <p class="sub">Unity 개발 스터디용 코드 작성 연습장. 상황을 읽고 코드를 직접 작성하면 조건별로 채점해 줘요.</p>
  <div class="card" style="gap:12px"><button class="btn" id="g" style="padding:12px">Google 계정으로 시작하기</button>
  <div class="note">로그인하면 이름·이메일·진행 현황(해결한 문제 수 등)이 운영진에게 보여요. 작성 중인 코드는 운영진도 볼 수 없어요.</div>
  <div class="msg no" id="lerr" ${msg?'':'hidden'}>${esc(msg||'')}</div></div>
  <div class="row" style="justify-content:center;gap:16px"><button class="btn ghost sm" id="guest">로그인 없이 둘러보기</button><a class="note" href="#admin" id="toadmin">운영진 로그인</a></div>
  <div class="note" style="text-align:center">로그인 없이 쓰면 기록이 이 브라우저에만 저장되고 운영진에게 진행 현황이 보이지 않아요.</div></div>`;
 $('#g').onclick=async()=>{
  $('#g').disabled=true;
  try{await Store.signInGoogle()}
  catch(e){$('#g').disabled=false;const m=e&&e.code==='auth/popup-closed-by-user'?'로그인 창이 닫혔어요. 다시 시도해 주세요.':e&&e.code==='auth/popup-blocked'?'브라우저가 팝업을 막았어요. 이 사이트의 팝업을 허용해 주세요.':'로그인에 실패했어요. ('+((e&&e.code)||'오류')+')';$('#lerr').hidden=false;$('#lerr').textContent=m}
 };
 $('#guest').onclick=()=>{guest=true;boot()};
 $('#toadmin').onclick=()=>setTimeout(()=>renderAdminLogin(),0);
}
function renderAdminLogin(msg){
 window.wantAdmin=true;
 $('#app').innerHTML=`<div class="login"><h1>운영진 로그인</h1><p class="sub">운영진 아이디와 비밀번호로 접속해요.</p>
  <form class="card" id="af" style="gap:10px"><label class="lbl">아이디<input type="text" id="aid" autocomplete="username" autocapitalize="off" required></label>
  <label class="lbl">비밀번호<input type="password" id="apw" autocomplete="current-password" required></label>
  <button class="btn" id="ago" type="submit">접속</button><div class="msg no" id="aerr" ${msg?'':'hidden'}>${esc(msg||'')}</div></form>
  <div class="row" style="justify-content:center"><a class="note" href="#" id="back">부원 로그인으로 돌아가기</a></div></div>`;
 $('#back').onclick=e=>{e.preventDefault();history.replaceState(null,'',location.pathname);renderLogin()};
 $('#af').onsubmit=async e=>{
  e.preventDefault();$('#ago').disabled=true;
  try{await Store.signInAdmin($('#aid').value,$('#apw').value)}
  catch(err){$('#ago').disabled=false;$('#aerr').hidden=false;$('#aerr').textContent='아이디 또는 비밀번호를 확인해 주세요.'}
 };
}

/* ---------- 내 기록 ---------- */
function statsHTML(sl){
 const sb=summarize(BANK,S.solved,S.review),sa=summarize(PROBLEMS.concat(BANK),S.solved,S.review);
 const rb=Object.fromEntries(Object.entries(S.review||{}).filter(([k])=>byId(k)&&byId(k).bank));
 const rl=Object.fromEntries(Object.entries(S.review||{}).filter(([k])=>!(byId(k)&&byId(k).bank)));
 const rt=x=>x==null?'-':x+'%';
 const lr=summarize(PROBLEMS,S.solved,rl).retain,br=summarize(BANK,S.solved,rb).retain;
 const bar=(a,b)=>{const t=(a+b)||1;return `<div class="splitbar" role="img" aria-label="학습 ${a}문제, 문제 사전 ${b}문제"><i class="sl" style="width:${a/t*100}%"></i><i class="sb" style="width:${b/t*100}%"></i></div>`};
 const st=(v,l,c)=>`<div class="stat ${c||''}"><b>${v}</b><span>${l}</span></div>`;
 return `<div class="statsys">
  <section class="sgroup all"><div class="row"><h3>종합</h3><span class="note">학습 + 문제 사전</span></div>
   <div class="statrow big">${st(sa.solved+'<small> / '+sa.total+'</small>','해결')}${st(sa.self,'정답 안 보고 해결')}${st(sa.tries,'채점 횟수')}${st(rt(sa.retain),'복습 유지율')}</div>
   ${bar(sl.solved,sb.solved)}<div class="legend"><span><i class="sl"></i>학습 ${sl.solved}</span><span><i class="sb"></i>문제 사전 ${sb.solved}</span></div></section>
  <div class="sgroup2">
   <section class="sgroup learn"><div class="row"><h3>학습</h3><span class="note">학습 지도 ${sl.total}문제</span></div>
    <div class="statrow mid">${st(sl.solved+'<small> / '+sl.total+'</small>','해결')}${st(sl.self,'정답 안 보고')}${st(sl.tries,'채점')}${st(rt(lr),'복습 유지')}</div></section>
   <section class="sgroup bank"><div class="row"><h3>문제 사전</h3><span class="note">비슷한 문제 ${sb.total}개</span></div>
    <div class="statrow sm">${st(sb.solved+'<small> / '+sb.total+'</small>','해결')}${st(sb.self,'정답 안 보고')}${st(sb.tries,'채점')}${st(rt(br),'복습 유지')}</div></section>
  </div></div>`;
}
function bankLogHTML(){
 const sets=bankSets(),open=sets.filter(x=>bankOpen(x.s.cat.id,x.s.si,x.l)).length;
 const rows=bankAllStages().map(s=>{
  const ps=bankProblems(s.cat.id,s.si),n=ps.filter(p=>isSolved(p.id)),self=n.filter(p=>{const r=S.solved[p.id];return r.via==='auto'&&r.clean}).length;
  return `<tr><td>${esc(s.cat.name)} · ${esc(s.st.title)}</td><td>${meter(n.length,ps.length)}</td><td class="num">${n.length} / ${ps.length}</td><td class="num">${self}</td></tr>`}).join('');
 return `<div class="card" id="banklog" style="gap:6px"><div class="row"><b>문제 사전 현황</b><span class="badge bank">문제 사전</span><span class="note">열린 세트 ${open} / ${sets.length}</span></div>
  <table class="tbl"><thead><tr><th>단계</th><th></th><th>해결</th><th>자력</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function renderMe(){
 const sm=summarize(PROBLEMS,S.solved,S.review);
 const cards=TIERS.map(t=>{
  const x=sm.tier[t.id],needSolve=Math.max(0,Math.ceil(x.total*PASS_SOLVED)-x.solved);
  const selfRate=x.solved?pct(x.self,x.solved):0;
  const state=x.passed?'<span class="badge done">수료</span>':`<span class="badge ai">진행 중</span>`;
  const todo=x.passed?'수료 기준을 모두 채웠어요.':[needSolve?`${needSolve}문제 더 해결`:'',x.solved&&selfRate<PASS_SELF*100?'정답을 보지 않고 푼 비율 올리기':'',!x.solved?'첫 문제부터 시작해 보세요':''].filter(Boolean).join(' · ');
  return `<section class="tier"><div class="row"><h3>${t.name}</h3>${state}</div><p class="note">${t.desc}</p>
   ${meter(x.solved,x.total)}<div class="row"><b>${x.solved} / ${x.total}</b><span class="note">해결</span><span style="flex:1"></span><span class="note">자력 ${selfRate}%</span></div>
   <div class="note">${todo}</div></section>`}).join('');
 const cats=CATS.map(c=>{const x=sm.cat[c.id]||{total:0,solved:0,self:0};
  return `<tr><td>${c.name}</td><td>${meter(x.solved,x.total)}</td><td class="num">${x.solved} / ${x.total}</td><td class="num">${x.self}</td></tr>`}).join('');
 const redo=PROBLEMS.concat(BANK).map(p=>({p,r:S.solved[p.id]})).filter(o=>o.r&&((!o.r.ok&&(o.r.tries||0)>=2)||(o.r.ok&&o.r.via==='auto'&&!o.r.clean)||(o.r.ok&&o.r.via==='ai'))).sort((a,b)=>(b.r.tries||0)-(a.r.tries||0)).slice(0,6);
 $('#main').innerHTML=`<div style="display:flex;flex-direction:column;gap:20px">
  ${statsHTML(sm)}
  <div class="card" style="gap:10px"><div class="row"><b>레벨</b><span class="note">풀이·복습·메모로 경험치가 쌓여요</span></div>${(()=>{const li=Fx.levelInfo(S);return `<div class="lvstrip"><span class="big">Lv.${li.lv}</span><span class="tt2">${li.title}</span><span class="lvbar"><i style="width:${li.pct}%"></i></span><span class="note">${li.xp} XP · 다음 레벨까지 ${li.need}</span></div>`})()}<b>배지 ${Fx.earned(S).length} / ${Fx.BADGES.length}</b>${badgesHTML(Fx.BADGES)}</div>
  <div class="tiergrid">${cards}</div>
  <div class="note">수료 기준: 구간 문제의 ${PASS_SOLVED*100}% 이상을 해결하고, 푼 문제 중 ${PASS_SELF*100}% 이상은 정답을 보지 않고 풀기. 복습 유지율은 복습한 문제 중 기억이 이어지고 있는 비율이에요.</div>
  <div class="card" style="gap:6px"><b>분야별 현황</b><table class="tbl"><thead><tr><th>분야</th><th></th><th>해결</th><th>자력</th></tr></thead><tbody>${cats}</tbody></table></div>
  ${bankLogHTML()}
  ${redo.length?`<div class="card" style="gap:6px"><b>다시 보면 좋은 문제</b><div class="note">여러 번 막혔거나 정답을 참고해서 푼 문제예요.</div>${redo.map(o=>`<button class="pc" data-p="${o.p.id}"><span class="t">${esc(o.p.title)}</span><span class="note">${esc(CATS.find(c=>c.id===o.p.cat).name)} · 시도 ${o.r.tries||0}</span></button>`).join('')}</div>`:''}</div>`;
 document.querySelectorAll('#main .pc').forEach(b=>b.onclick=()=>openProblem(b.dataset.p));
}

/* ---------- 운영진 ---------- */
let AD={users:[],reports:[],q:'',sort:'last',idle:false,wkLeft:false,sel:null};
function csvCell(v){v=String(v==null?'':v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}
function adminCsv(rows){
 const head=['이름','이메일','마지막 접속','해결','자력','입문 해결','기초 해결','응용 해결','심화 해결','문제 사전 해결','복습 횟수','최근 7일 활동','복습 유지율','이번 주 과제'];
 const lines=[head].concat(rows.map(u=>{const s=u.summary||{tier:{},solved:0,self:0};const t=s.tier||{};
  return [u.name,u.email,u.lastActive?new Date(u.lastActive).toLocaleString('ko-KR'):'',s.solved||0,s.self||0,(t.intro||{}).solved||0,(t.basic||{}).solved||0,(t.app||{}).solved||0,(t.adv||{}).solved||0,s.stats?s.stats.bank.solved:'',s.stats?s.stats.rev.done:'',s.stats?adminWeek(s.stats.days):'',s.retain==null?'':s.retain,WK&&wkProblems(WK).length?wkDone(u)+'/'+wkProblems(WK).length:'']}));
 const blob=new Blob(['﻿'+lines.map(r=>r.map(csvCell).join(',')).join('\n')],{type:'text/csv;charset=utf-8'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='learn-unity-progress.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);
}
async function renderAdmin(){
 $('#main').innerHTML='<div class="note">불러오는 중…</div>';
 try{const [u,r]=await Promise.all([Store.listUsers(),Store.listReports(),loadWeekly()]);AD.users=u;AD.reports=r}
 catch(e){$('#main').innerHTML=`<div class="msg no">운영 데이터를 불러오지 못했어요. 운영진 권한(admins 문서)이 등록됐는지 확인해 주세요. (${esc((e&&e.code)||'오류')})</div>`;return}
 drawAdmin();
}
/* 부원이 이번 주 과제 문제를 몇 개 풀었는지: users 문서의 prob(문제별 상태)로 계산 */
function wkDone(u){return wkProblems(WK).filter(p=>{const v=(u.prob||{})[p.id];return v&&v[0]>0}).length}
function wkAdminHTML(rows){
 const ps=wkProblems(WK),tot=ps.length,all=AD.users;
 const cur=WK&&tot?`<div class="row"><b>${esc(WK.title||'이번 주 과제')}</b><span class="note">${WK.due?'마감 '+new Date(WK.due).toLocaleDateString('ko-KR'):'마감 없음'} · 문제 ${tot}개 · 완료 ${all.filter(u=>wkDone(u)>=tot).length} / ${all.length}명</span></div>`:'<div class="note">지정된 과제가 없어요. 아래에서 단계를 골라 이번 주 과제를 만들 수 있어요.</div>';
 const have=new Set((WK&&WK.stages)||[]);
 const groups=TIERS.map(t=>`<fieldset><legend>${esc(t.name)}</legend><div class="stg">${stagesOfTier(t.id).map(s=>`<label class="chk"><input type="checkbox" data-wk="${s.key}" ${have.has(s.key)?'checked':''}> <span>${esc(s.cat.name)} · ${esc(s.st.title)}</span></label>`).join('')}</div></fieldset>`).join('');
 const due=WK&&WK.due?dayKey(WK.due):'';
 return `<div class="card" style="gap:10px"><b>주차 과제</b>${cur}
  <details><summary class="note" style="cursor:pointer">과제 만들기 · 바꾸기</summary><div class="wkform" style="margin-top:10px">
   <label class="lbl">제목<input type="text" id="wkt" maxlength="60" value="${esc((WK&&WK.title)||'')}" placeholder="예: 3주차 · 변수와 이벤트 함수"></label>
   <label class="lbl">안내(선택)<input type="text" id="wkn" maxlength="200" value="${esc((WK&&WK.note)||'')}" placeholder="예: 정답은 마지막에만 보세요"></label>
   <label class="lbl">마감일(선택)<input type="date" id="wkd" value="${due}"></label>
   ${groups}
   <div class="row"><button class="btn" id="wksave">과제 저장</button><button class="btn ghost" id="wkclear">과제 내리기</button><span class="note" id="wkmsg" role="status"></span></div></div></details></div>`;
}
/* 부원별 활동 통계(summary.stats): 날짜별 [학습, 문제 사전, 복습] */
const DAYNAMES=['일','월','화','수','목','금','토'];
const adminWeek=days=>[...Array(7)].reduce((a,_,i)=>a+((days||{})[dayKey(Date.now()-i*DAY)]||[0,0,0]).reduce((x,y)=>x+y,0),0);
function adminDaysHTML(st,n){
 if(!st)return '<div class="note">아직 활동 통계가 없어요. 부원이 다시 접속하면 채워져요.</div>';
 n=n||14;
 const rows=[...Array(n)].map((_,i)=>{const t=Date.now()-i*DAY,x=st.days[dayKey(t)]||[0,0,0],sum=x[0]+x[1]+x[2];
  return `<tr class="${sum?'':'zero'}"><td>${dayKey(t).slice(5).replace('-','/')} (${DAYNAMES[new Date(t).getDay()]})</td><td class="num">${x[0]||'-'}</td><td class="num">${x[1]||'-'}</td><td class="num">${x[2]||'-'}</td><td class="num"><b>${sum||'-'}</b></td></tr>`}).join('');
 const b=st.bank,r=st.rev;
 return `<div class="note" style="margin-top:4px">문제 사전 해결 ${b.solved}문제(자력 ${b.self}, 채점 ${b.tries}회) · 복습 ${r.done}회(${r.kinds}문제), 지금 복습할 문제 ${r.due}개</div>
  <table class="tbl dtbl"><thead><tr><th>최근 ${n}일</th><th class="num">학습</th><th class="num">사전</th><th class="num">복습</th><th class="num">합계</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function adminClubDays(us){
 const sum={};let any=false;
 us.forEach(u=>{const st=u.summary&&u.summary.stats;if(!st)return;any=true;Object.entries(st.days).forEach(([k,v])=>{const o=sum[k]||(sum[k]={a:0,v:[0,0,0]});o.a++;v.forEach((x,i)=>o.v[i]+=x)})});
 if(!any)return '';
 const rows=[...Array(14)].map((_,i)=>{const t=Date.now()-i*DAY,o=sum[dayKey(t)]||{a:0,v:[0,0,0]};
  return `<tr class="${o.a?'':'zero'}"><td>${dayKey(t).slice(5).replace('-','/')} (${DAYNAMES[new Date(t).getDay()]})</td><td class="num">${o.a||'-'}</td><td class="num">${o.v[0]||'-'}</td><td class="num">${o.v[1]||'-'}</td><td class="num">${o.v[2]||'-'}</td></tr>`}).join('');
 return `<div class="card" style="gap:8px"><b>날짜별 전체 활동</b><div class="note">부원 모두의 최근 14일 합계예요. 활동한 인원 · 새로 해결한 학습·문제 사전 · 복습 횟수.</div>
  <div style="overflow-x:auto"><table class="tbl dtbl"><thead><tr><th>날짜</th><th class="num">활동 인원</th><th class="num">학습</th><th class="num">사전</th><th class="num">복습</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function adminDetailHTML(){
 const u=AD.sel&&AD.users.find(x=>x.uid===AD.sel);if(!u)return '';
 const s=u.summary||{},st=s.stats||null;
 return `<div class="card" id="adetail" style="gap:8px"><div class="row"><b>${esc(u.name||'(이름 없음)')}</b><span class="note">${esc(u.email||'')} · ${ago(u.lastActive)}</span><span style="flex:1"></span><button class="btn ghost sm" id="aclose">닫기</button></div>
  <div class="note">학습 ${s.solved||0}문제 해결(자력 ${s.self||0}) · 복습 유지율 ${s.retain==null?'-':s.retain+'%'}</div>${adminDaysHTML(st)}</div>`;
}
function drawAdmin(){
 const now=Date.now(),us=AD.users,tot=PROBLEMS.length;
 const empty=summarize(PROBLEMS,{},{});
 const sm=u=>u.summary||empty;
 const active7=us.filter(u=>u.lastActive&&now-u.lastActive<7*DAYMS).length;
 const idle14=us.filter(u=>!u.lastActive||now-u.lastActive>=14*DAYMS).length;
 const pass=TIERS.map(t=>({t,n:us.filter(u=>((sm(u).tier||{})[t.id]||{}).passed).length}));
 let rows=us.filter(u=>!AD.q||((u.name||'')+(u.email||'')).toLowerCase().includes(AD.q.toLowerCase())).filter(u=>!AD.idle||!u.lastActive||now-u.lastActive>=14*DAYMS).filter(u=>!AD.wkLeft||!(WK&&wkProblems(WK).length)||wkDone(u)<wkProblems(WK).length);
 const key={last:u=>-(u.lastActive||0),solved:u=>-(sm(u).solved||0),name:u=>(u.name||'')};
 rows.sort((a,b)=>{const x=key[AD.sort](a),y=key[AD.sort](b);return x<y?-1:x>y?1:0});
 const tcell=(s,id)=>{const x=(s.tier||{})[id]||{total:0,solved:0,passed:false};return `<td>${meter(x.solved,x.total,x.passed?'good':'')}<span class="note">${x.solved}/${x.total}${x.passed?' 수료':''}</span></td>`};
 const body=rows.map(u=>{const s=sm(u),idle=!u.lastActive||now-u.lastActive>=14*DAYMS;
  const stt=s.stats||null,w7=stt?adminWeek(stt.days):0;
  return `<tr><td><button class="linkbtn" data-sel="${esc(u.uid||'')}"><b>${esc(u.name||'(이름 없음)')}</b></button><div class="note">${esc(u.email||'')}</div></td><td class="${idle?'warnc':''}">${ago(u.lastActive)}</td>${tcell(s,'intro')}${tcell(s,'basic')}${tcell(s,'app')}${tcell(s,'adv')}${WK&&wkProblems(WK).length?(()=>{const n=wkDone(u),t=wkProblems(WK).length;return `<td>${meter(n,t,n>=t?'good':'')}<span class="note">${n}/${t}</span></td>`})():''}<td class="num">${stt?stt.bank.solved:'-'}</td><td class="num">${stt?stt.rev.done:'-'}</td><td class="num">${stt?w7:'-'}</td><td class="num">${s.solved?pct(s.self,s.solved)+'%':'-'}</td><td class="num">${s.retain==null?'-':s.retain+'%'}</td></tr>`}).join('')||'<tr><td colspan="11" class="note">조건에 맞는 부원이 없어요.</td></tr>';
 /* 문제별 집계: prob = {문제id:[상태코드(0시도중 1자력 2참고 3AI), 채점횟수]} */
 const agg={};
 us.forEach(u=>Object.entries(u.prob||{}).forEach(([id,v])=>{const a=agg[id]||(agg[id]={n:0,ok:0,peek:0,tries:0});a.n++;a.tries+=v[1]||0;if(v[0]>0)a.ok++;if(v[0]===2||v[0]===3)a.peek++}));
 const hard=Object.entries(agg).filter(([id,a])=>a.n>=2&&byId(id)).map(([id,a])=>({id,a,score:(a.n-a.ok)+a.peek*0.7+a.tries/a.n*0.2})).sort((x,y)=>y.score-x.score).slice(0,8);
 const hardHtml=hard.length?`<table class="tbl"><thead><tr><th>문제</th><th class="num">시도 인원</th><th class="num">해결률</th><th class="num">정답 참고</th><th class="num">평균 채점</th></tr></thead><tbody>${hard.map(h=>`<tr><td>${esc(byId(h.id).title)}<div class="note">${esc(CATS.find(c=>c.id===byId(h.id).cat).name)} · 단계 ${byId(h.id).stage} · ${LV[byId(h.id).level]}</div></td><td class="num">${h.a.n}</td><td class="num">${pct(h.a.ok,h.a.n)}%</td><td class="num">${h.a.peek}</td><td class="num">${(h.a.tries/h.a.n).toFixed(1)}</td></tr>`).join('')}</tbody></table>`:'<div class="note">2명 이상이 시도한 문제가 생기면 여기에 표시돼요.</div>';
 const rep=AD.reports.map(r=>`<details class="rep ${r.status==='done'?'done':''}"><summary><b>${esc(r.title||r.pid)}</b> <span class="note">${esc(r.name||'')} · ${ago(r.at)} · ${r.status==='done'?'처리됨':'미처리'}</span></summary>
  ${r.note?`<p>${esc(r.note)}</p>`:''}<div class="note">${(r.fails||[]).map(esc).join('<br>')}</div><pre class="code" style="padding:8px 12px;max-height:240px;overflow:auto">${esc(r.code||'')}</pre>
  <button class="btn ghost sm" data-rs="${esc(r.id)}" data-to="${r.status==='done'?'open':'done'}">${r.status==='done'?'다시 열기':'처리됨으로 표시'}</button></details>`).join('')||'<div class="note">접수된 신고가 없어요.</div>';
 $('#main').innerHTML=`<div style="display:flex;flex-direction:column;gap:20px">
  <div class="statrow"><div class="stat"><b>${us.length}</b><span>가입 부원</span></div><div class="stat"><b>${active7}</b><span>최근 7일 활동</span></div><div class="stat"><b>${idle14}</b><span>14일 이상 미활동</span></div>${pass.map(p=>`<div class="stat"><b>${p.n}</b><span>${p.t.name} 수료</span></div>`).join('')}</div>
  ${wkAdminHTML(rows)}
  ${adminDetailHTML()}
  ${adminClubDays(us)}
  <div class="card" style="gap:10px"><div class="row"><b>부원 현황</b><span style="flex:1"></span><input type="text" id="aq" placeholder="이름·이메일 검색" value="${esc(AD.q)}" style="max-width:200px"><select id="as" aria-label="정렬"><option value="last" ${AD.sort==='last'?'selected':''}>최근 접속순</option><option value="solved" ${AD.sort==='solved'?'selected':''}>해결 많은 순</option><option value="name" ${AD.sort==='name'?'selected':''}>이름순</option></select><label class="chk"><input type="checkbox" id="ai" ${AD.idle?'checked':''}> 14일 미활동만</label>${WK&&wkProblems(WK).length?`<label class="chk"><input type="checkbox" id="aw" ${AD.wkLeft?'checked':''}> 과제 미완료만</label>`:''}<button class="btn ghost sm" id="acsv">CSV</button></div>
  <div class="tblwrap"><table class="tbl"><thead><tr><th>부원</th><th>마지막 접속</th><th>입문</th><th>기초</th><th>응용</th><th>심화</th>${WK&&wkProblems(WK).length?'<th>과제</th>':''}<th class="num">사전</th><th class="num">복습</th><th class="num">7일</th><th class="num">자력</th><th class="num">유지율</th></tr></thead><tbody>${body}</tbody></table></div>
  <div class="note">자력은 해결한 문제 중 정답을 보지 않고 푼 비율, 유지율은 복습한 문제 중 기억이 이어지는 비율이에요. 수료는 구간 문제의 ${PASS_SOLVED*100}% 해결 + 자력 ${PASS_SELF*100}% 이상.</div></div>
  <div class="card" style="gap:8px"><b>많이 막히는 문제</b>${hardHtml}</div>
  <div class="card" style="gap:8px"><b>채점 오류 신고</b>${rep}</div></div>`;
 $('#aq').oninput=e=>{AD.q=e.target.value;const p=e.target.selectionStart;drawAdmin();const i=$('#aq');i.focus();i.setSelectionRange(p,p)};
 $('#as').onchange=e=>{AD.sort=e.target.value;drawAdmin()};
 $('#ai').onchange=e=>{AD.idle=e.target.checked;drawAdmin()};
 $('#acsv').onclick=()=>adminCsv(rows);
 document.querySelectorAll('[data-sel]').forEach(b=>b.onclick=()=>{AD.sel=b.dataset.sel;drawAdmin();const d=$('#adetail');if(d)d.scrollIntoView({block:'nearest'})});
 const ac=$('#aclose');if(ac)ac.onclick=()=>{AD.sel=null;drawAdmin()};
 const aw=$('#aw');if(aw)aw.onchange=e=>{AD.wkLeft=e.target.checked;drawAdmin()};
 const ws=$('#wksave');
 if(ws){
  const msg=t=>{$('#wkmsg').textContent=t};
  ws.onclick=async()=>{
   const stages=[...document.querySelectorAll('[data-wk]:checked')].map(x=>x.dataset.wk);
   if(!stages.length){msg('단계를 하나 이상 골라 주세요.');return}
   const d=$('#wkd').value,o={title:$('#wkt').value.trim().slice(0,60)||'이번 주 과제',note:$('#wkn').value.trim().slice(0,200),stages,due:d?new Date(d+'T23:59:59').getTime():0,at:Date.now()};
   ws.disabled=true;
   try{await Store.setWeekly(o);WK=o;drawAdmin()}catch(e){ws.disabled=false;msg('저장하지 못했어요. 운영진 권한과 규칙 배포를 확인해 주세요.')}
  };
  $('#wkclear').onclick=async()=>{try{await Store.setWeekly({title:'',note:'',stages:[],due:0,at:Date.now()});WK=null;drawAdmin()}catch(e){msg('저장하지 못했어요.')}};
 }
 document.querySelectorAll('[data-rs]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await Store.setReportStatus(b.dataset.rs,b.dataset.to);const r=AD.reports.find(x=>x.id===b.dataset.rs);if(r)r.status=b.dataset.to;drawAdmin()}catch(e){b.disabled=false}});
}
