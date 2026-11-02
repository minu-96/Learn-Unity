/* ===== 문제 사전 =====
   학습 지도에는 없는 추가 문제 모음. 단계마다 3문제씩 있고, 그 단계의 학습 지도 문제를 하나 풀면 열린다.
   진도·수료 기준·진단에는 들어가지 않고, 경험치·복습·개념 사전에는 반영된다. */
const bankProblems=(cid,si)=>BANK.filter(p=>p.cat===cid&&p.stage===si).sort((a,b)=>a.level-b.level);
/* 그 단계의 학습 지도 문제를 하나라도 풀었으면 열린다 */
const bankOpen=(cid,si)=>PROBLEMS.some(p=>p.cat===cid&&p.stage===si&&isSolved(p.id));
const bankStages=tid=>stagesOfTier(tid).filter(s=>bankProblems(s.cat.id,s.si).length);
const bankAllStages=()=>TIERS.flatMap(t=>bankStages(t.id));
const bankSolvedN=()=>BANK.filter(p=>isSolved(p.id)).length;
/* 열렸는데 아직 하나도 안 푼 단계 수 (탭 배지) */
const bankNew=()=>bankAllStages().filter(s=>bankOpen(s.cat.id,s.si)&&!bankProblems(s.cat.id,s.si).some(p=>isSolved(p.id))).length;
/* 단계의 첫 문제를 풀어서 문제 사전이 열린 순간 알려 준다 */
function bankUnlockHook(p,wasOpen){
 if(p.bank||wasOpen)return;
 const n=bankProblems(p.cat,p.stage).length;if(!n)return;
 const st=CATS.find(c=>c.id===p.cat).stages[p.stage-1];
 setTimeout(()=>{Fx.toast(`<b>문제 사전이 열렸어요</b> ${esc(st.title)}<span>새 문제 ${n}개를 풀 수 있어요</span>`,'bank',4200);Fx.sfx('unlock')},2600);
 const t=document.querySelector('#done .tools');
 if(t&&!document.getElementById('tobank')){
  const b=document.createElement('button');b.className='btn bankbtn';b.id='tobank';b.textContent='문제 사전에서 같은 단계 더 풀기';
  b.onclick=()=>{V.pid=null;V.mode=null;V.tab='bank';V.bankStage={cat:p.cat,stage:p.stage};render();window.scrollTo(0,0)};
  t.appendChild(b);
 }
 const tab=document.querySelector('nav.tabs [data-tab="bank"]');
 if(tab&&!tab.querySelector('.bnew')){const s=document.createElement('span');s.className='badge new bnew';s.textContent=String(bankNew());tab.appendChild(document.createTextNode(' '));tab.appendChild(s)}
 else if(tab){tab.querySelector('.bnew').textContent=String(bankNew())}
}

const dots=ps=>ps.map(p=>`<span class="dot ${isSolved(p.id)?'ok':(S.drafts[p.id]||(S.solved[p.id]&&S.solved[p.id].tries))?'wip':''}" title="${esc(LV[p.level])} · ${esc(p.title)}"></span>`).join('');

function renderBank(){
 const all=bankAllStages(),open=all.filter(s=>bankOpen(s.cat.id,s.si)),total=BANK.length;
 const avail=open.reduce((a,s)=>a+bankProblems(s.cat.id,s.si).length,0),done=bankSolvedN();
 const tier=V.bankTier||'all';
 const card=(s)=>{
  const ps=bankProblems(s.cat.id,s.si),isOpen=bankOpen(s.cat.id,s.si),n=ps.filter(p=>isSolved(p.id)).length;
  const tid=TIER_OF[s.key];
  if(!isOpen)return `<div class="bcard lock tier-${tid}"><span class="sc-top"><span class="sc-cat">${esc(s.cat.name)}</span><span class="badge ai">잠김</span></span><b>${esc(s.st.title)}</b><span class="note">학습 지도에서 이 단계 문제를 1개 풀면 열려요.</span><button class="btn ghost sm" data-gostage="${s.key}">이 단계로 가기</button></div>`;
  const fresh=n===0;
  return `<button class="bcard tier-${tid} ${fresh?'fresh':''}" data-bs="${s.key}"><span class="sc-top"><span class="sc-cat">${esc(s.cat.name)}</span>${fresh?'<span class="badge new">NEW</span>':''}${n===ps.length?'<span class="badge done">완료</span>':''}</span><b>${esc(s.st.title)}</b><span class="dots">${dots(ps)}</span>${meterHTML(n,ps.length,'t-'+tid)}<span class="note">${n} / ${ps.length} 해결</span></button>`;
 };
 const tabs=[{id:'all',name:'전체'}].concat(TIERS.filter(t=>bankStages(t.id).length)).map(t=>`<button class="chipbtn" data-bt="${t.id}" aria-pressed="${tier===t.id}">${t.name}</button>`).join('');
 const sections=TIERS.filter(t=>(tier==='all'||tier===t.id)&&bankStages(t.id).length).map(t=>`<section class="bsec"><div class="row sec-r"><h3 class="sec-h tier-${t.id}" style="color:var(--tc)">${t.name}</h3><span class="note">${esc(t.desc)}</span></div><div class="bgrid">${bankStages(t.id).map(card).join('')}</div></section>`).join('');
 $('#main').innerHTML=`<div class="bank">
  <section class="bhero"><div><span class="kick">문제 사전</span><h2>풀어 본 단계의 새 문제</h2><p>학습 지도에는 없는 문제를 단계마다 3개씩 모아 뒀어요. 학습 지도에서 그 단계 문제를 하나 풀면 열려요. 진도와 수료 기준에는 들어가지 않고, 경험치와 복습, 개념 사전에는 반영돼요.</p></div>
   <div class="bstat"><div><b>${open.length} / ${all.length}</b><span>열린 단계</span></div><div><b>${done} / ${avail}</b><span>푼 문제</span></div></div></section>
  <div class="chiprow" role="group" aria-label="단계 거르기">${tabs}</div>
  ${sections||'<div class="msg info">아직 문제 사전이 없어요.</div>'}
  <p class="note">문제 사전은 단계를 하나씩 늘려 가는 중이에요. 지금은 입문 단계부터 열려 있어요.</p>
 </div>`;
 $('#main').querySelectorAll('[data-bt]').forEach(b=>b.onclick=()=>{V.bankTier=b.dataset.bt;Fx.sfx('tap');renderBank()});
 $('#main').querySelectorAll('[data-bs]').forEach(b=>b.onclick=()=>{const [c,s]=b.dataset.bs.split(':');V.bankStage={cat:c,stage:+s};Fx.sfx('tap');render();window.scrollTo(0,0)});
 $('#main').querySelectorAll('[data-gostage]').forEach(b=>b.onclick=()=>{const [c,s]=b.dataset.gostage.split(':');V.tab='learn';V.stage={cat:c,stage:+s};render();window.scrollTo(0,0)});
}

function renderBankStage(){
 const {cat:cid,stage:si}=V.bankStage,cat=CATS.find(c=>c.id===cid),st=cat.stages[si-1],key=cid+':'+si,tid=TIER_OF[key];
 const ps=bankProblems(cid,si);
 if(!bankOpen(cid,si)||!ps.length){V.bankStage=null;return renderBank()}
 const n=ps.filter(p=>isSolved(p.id)).length,first=ps.find(p=>!isSolved(p.id));
 const row=p=>`<button class="prow ${isSolved(p.id)?'done':''}" data-p="${p.id}"><span class="lv lv${p.level}">${esc(LV[p.level])}</span><span class="pt2">${esc(p.title)}</span><span class="pmeta">${statusBadge(p.id)}<span class="note">약 ${MIN_BY_LV[p.level]||8}분</span></span></button>`;
 $('#main').innerHTML=`<div class="stagepage bank">
  <div class="crumbs"><button class="btn ghost sm" id="back">← 문제 사전</button><span class="note"><b class="bankmk">문제 사전</b> › ${esc(tierName(tid))} › ${esc(cat.name)}</span></div>
  <section class="card tier-${tid}"><div class="row"><span class="badge bank">문제 사전</span><span class="note">${n} / ${ps.length} 해결</span></div><h2 class="pt">${esc(st.title)}</h2>
   <p class="note">학습 지도에 있는 문제와 겹치지 않는 새 문제예요. 같은 개념을 다른 상황에서 한 번 더 써 봐요.</p>${meterHTML(n,ps.length,'t-'+tid)}
   <div class="prows">${ps.map(row).join('')}</div>
   ${first?`<div class="tools"><button class="btn" id="bstart">${n?'이어서 풀기':'시작하기'}</button><button class="btn ghost" id="bgolearn">학습 지도에서 개념 보기</button></div>`:'<div class="msg ok">이 단계의 문제 사전을 모두 풀었어요.</div>'}
  </section></div>`;
 $('#back').onclick=()=>{V.bankStage=null;render();window.scrollTo(0,0)};
 $('#main').querySelectorAll('.prow').forEach(b=>b.onclick=()=>openProblem(b.dataset.p));
 const bs=$('#bstart');if(bs)bs.onclick=()=>openProblem(first.id);
 const bg=$('#bgolearn');if(bg)bg.onclick=()=>{V.tab='learn';V.stage={cat:cid,stage:si};V.bankStage=null;render();window.scrollTo(0,0)};
}

/* 오늘 화면에 보여 줄 카드 */
function bankHomeCard(){
 const open=bankAllStages().filter(s=>bankOpen(s.cat.id,s.si)),fresh=open.find(s=>!bankProblems(s.cat.id,s.si).some(p=>isSolved(p.id)));
 if(!open.length)return '';
 const left=open.reduce((a,s)=>a+bankProblems(s.cat.id,s.si).filter(p=>!isSolved(p.id)).length,0);
 if(!left)return '';
 return `<div class="act bankcard"><div class="act-t"><span class="kick">문제 사전${bankNew()?' · NEW':''}</span><b>${fresh?esc(fresh.st.title)+' 단계의 새 문제 3개':'풀 수 있는 새 문제 '+left+'개'}</b><span class="note">학습 지도에 없는 문제예요. 진도에는 들어가지 않아요.</span></div><button class="btn bankbtn" data-go="bank">문제 사전 열기</button></div>`;
}
