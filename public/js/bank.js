/* ===== 문제 사전 =====
   학습 지도에는 없는 추가 문제 모음. (분야, 단계, 레벨)마다 3문제가 한 세트이고,
   학습 지도에서 같은 분야·단계·레벨의 문제를 하나만 풀어도 그 세트가 열린다.
   진도·수료 기준·진단에는 들어가지 않고, 경험치·복습·개념 사전에는 반영된다. */
const bankProblems=(cid,si,lv)=>BANK.filter(p=>p.cat===cid&&p.stage===si&&(!lv||p.level===lv)).sort((a,b)=>a.level-b.level);
const bankLevels=(cid,si)=>[1,2,3].filter(l=>bankProblems(cid,si,l).length);
/* 같은 분야·단계·레벨의 학습 지도 문제 하나라도 풀었으면 그 세트가 열린다 */
const bankSrc=(cid,si,lv)=>PROBLEMS.filter(p=>p.cat===cid&&p.stage===si&&p.level===lv);
const bankOpen=(cid,si,lv)=>bankSrc(cid,si,lv).some(p=>isSolved(p.id));
const bankStages=tid=>stagesOfTier(tid).filter(s=>bankLevels(s.cat.id,s.si).length);
const bankAllStages=()=>TIERS.flatMap(t=>bankStages(t.id));
const bankSets=()=>bankAllStages().flatMap(s=>bankLevels(s.cat.id,s.si).map(l=>({s,l})));
const bankSolvedN=()=>BANK.filter(p=>isSolved(p.id)).length;
const bankSetNew=(cid,si,lv)=>bankOpen(cid,si,lv)&&!bankProblems(cid,si,lv).some(p=>isSolved(p.id));
const bankNew=()=>bankSets().filter(x=>bankSetNew(x.s.cat.id,x.s.si,x.l)).length;
/* 학습 지도 문제를 풀어서 비슷한 문제 세트가 새로 열린 순간 알려 준다 */
function bankUnlockHook(p,wasOpen){
 if(p.bank||wasOpen)return;
 const n=bankProblems(p.cat,p.stage,p.level).length;if(!n)return;
 setTimeout(()=>{Fx.toast(`<b>비슷한 문제 ${n}개가 열렸어요</b> ${esc(p.title)}<span>문제 사전에서 풀어 볼 수 있어요</span>`,'bank',4200);Fx.sfx('unlock')},2600);
 const t=document.querySelector('#done .tools');
 if(t&&!document.getElementById('tobank')){
  const b=document.createElement('button');b.className='btn bankbtn';b.id='tobank';b.textContent=`비슷한 문제 ${n}개 풀어보기`;
  b.onclick=()=>{const q=bankProblems(p.cat,p.stage,p.level)[0];openProblem(q.id)};
  t.appendChild(b);
 }
 const tab=document.querySelector('nav.tabs [data-tab="bank"]');
 if(tab&&!tab.querySelector('.bnew')){const s=document.createElement('span');s.className='badge new bnew';s.textContent=String(bankNew());tab.appendChild(document.createTextNode(' '));tab.appendChild(s)}
 else if(tab){tab.querySelector('.bnew').textContent=String(bankNew())}
}

const dots=ps=>ps.map(p=>`<span class="dot ${isSolved(p.id)?'ok':(S.drafts[p.id]||(S.solved[p.id]&&S.solved[p.id].tries))?'wip':''}" title="${esc(LV[p.level])} · ${esc(p.title)}"></span>`).join('');

function renderBank(){
 const sets=bankSets(),open=sets.filter(x=>bankOpen(x.s.cat.id,x.s.si,x.l)),total=BANK.length;
 const avail=open.reduce((a,x)=>a+bankProblems(x.s.cat.id,x.s.si,x.l).length,0),done=bankSolvedN();
 const tier=V.bankTier||'all';
 const chip=(s,l)=>{
  const c=s.cat.id,i=s.si,o=bankOpen(c,i,l),ps=bankProblems(c,i,l),n=ps.filter(p=>isSolved(p.id)).length;
  const st=!o?'lock':n===ps.length?'done':bankSetNew(c,i,l)?'fresh':'';
  return `<span class="lvset ${st}" title="${o?'':'학습 지도에서 같은 레벨 문제를 하나 풀면 열려요'}"><span class="lv lv${l}">${esc(LV[l])}</span><span class="lvs">${o?(st==='fresh'?'NEW':n+'/'+ps.length):'잠김'}</span></span>`;
 };
 const card=(s)=>{
  const ls=bankLevels(s.cat.id,s.si),tid=TIER_OF[s.key];
  const anyOpen=ls.some(l=>bankOpen(s.cat.id,s.si,l)),fresh=ls.some(l=>bankSetNew(s.cat.id,s.si,l));
  const ps=ls.flatMap(l=>bankProblems(s.cat.id,s.si,l)),n=ps.filter(p=>isSolved(p.id)).length;
  return `<button class="bcard tier-${tid} ${anyOpen?'':'lock'} ${fresh?'fresh':''}" data-bs="${s.key}"><span class="sc-top"><span class="sc-cat">${esc(s.cat.name)}</span>${fresh?'<span class="badge new">NEW</span>':''}${!anyOpen?'<span class="badge ai">잠김</span>':''}${anyOpen&&n===ps.length?'<span class="badge done">완료</span>':''}</span><b>${esc(s.st.title)}</b><span class="lvsets">${ls.map(l=>chip(s,l)).join('')}</span>${meterHTML(n,ps.length,'t-'+tid)}<span class="note">${n} / ${ps.length} 해결</span></button>`;
 };
 const tabs=[{id:'all',name:'전체'}].concat(TIERS.filter(t=>bankStages(t.id).length)).map(t=>`<button class="chipbtn" data-bt="${t.id}" aria-pressed="${tier===t.id}">${t.name}</button>`).join('');
 const sections=TIERS.filter(t=>(tier==='all'||tier===t.id)&&bankStages(t.id).length).map(t=>`<section class="bsec"><div class="row sec-r"><h3 class="sec-h tier-${t.id}" style="color:var(--tc)">${t.name}</h3><span class="note">${esc(t.desc)}</span></div><div class="bgrid">${bankStages(t.id).map(card).join('')}</div></section>`).join('');
 $('#main').innerHTML=`<div class="bank">
  <section class="bhero"><div><span class="kick">문제 사전</span><h2>푼 문제와 비슷한 새 문제</h2><p>학습 지도에서 문제를 하나만 풀어도, 같은 단계·같은 레벨의 비슷한 문제 3개가 열려요. 진도와 수료 기준에는 들어가지 않고, 경험치와 복습, 개념 사전에는 반영돼요.</p></div>
   <div class="bstat"><div><b>${open.length} / ${sets.length}</b><span>열린 세트</span></div><div><b>${done} / ${avail}</b><span>푼 문제</span></div></div></section>
  <div class="chiprow" role="group" aria-label="단계 거르기">${tabs}</div>
  ${sections||'<div class="msg info">아직 문제 사전이 없어요.</div>'}
  <p class="note">문제 사전은 단계를 하나씩 늘려 가는 중이에요. 지금은 입문 단계부터 열려 있어요.</p>
 </div>`;
 $('#main').querySelectorAll('[data-bt]').forEach(b=>b.onclick=()=>{V.bankTier=b.dataset.bt;renderBank()});
 $('#main').querySelectorAll('[data-bs]').forEach(b=>b.onclick=()=>{const [c,s]=b.dataset.bs.split(':');V.bankStage={cat:c,stage:+s};render();window.scrollTo(0,0)});
}

function renderBankStage(){
 const {cat:cid,stage:si}=V.bankStage,cat=CATS.find(c=>c.id===cid),st=cat.stages[si-1],key=cid+':'+si,tid=TIER_OF[key];
 const ls=bankLevels(cid,si);
 if(!ls.length){V.bankStage=null;return renderBank()}
 const all=ls.flatMap(l=>bankProblems(cid,si,l)),n=all.filter(p=>isSolved(p.id)).length;
 const row=p=>`<button class="prow ${isSolved(p.id)?'done':''}" data-p="${p.id}"><span class="lv lv${p.level}">${esc(LV[p.level])}</span><span class="pt2">${esc(p.title)}</span><span class="pmeta">${statusBadge(p.id)}<span class="note">약 ${MIN_BY_LV[p.level]||8}분</span></span></button>`;
 const set=l=>{
  const ps=bankProblems(cid,si,l),o=bankOpen(cid,si,l),m=ps.filter(p=>isSolved(p.id)).length;
  if(!o){
   const src=bankSrc(cid,si,l);
   return `<div class="bset lock"><div class="row"><span class="lv lv${l}">${esc(LV[l])}</span><span class="badge ai">잠김</span><span class="note">비슷한 문제 ${ps.length}개</span></div>
    <p class="note">학습 지도에서 ${src.length?'<b>'+src.map(p=>esc(p.title)).join('</b> 또는 <b>')+'</b> 중 하나를':'같은 레벨 문제를'} 풀면 열려요.</p>
    <button class="btn ghost sm" data-gopr="${src.length?src[0].id:''}">학습 지도에서 풀러 가기</button></div>`;
  }
  const src=bankSrc(cid,si,l).find(p=>isSolved(p.id));
  return `<div class="bset ${m===0?'fresh':''}"><div class="row"><span class="lv lv${l}">${esc(LV[l])}</span>${m===0?'<span class="badge new">NEW</span>':''}<span class="note">${m} / ${ps.length} 해결${src?' · "'+esc(src.title)+'"와 비슷해요':''}</span></div><div class="prows">${ps.map(row).join('')}</div></div>`;
 };
 $('#main').innerHTML=`<div class="stagepage bank">
  <div class="crumbs"><button class="btn ghost sm" id="back">← 문제 사전</button><span class="note"><b class="bankmk">문제 사전</b> › ${esc(tierName(tid))} › ${esc(cat.name)}</span></div>
  <section class="card tier-${tid}"><div class="row"><span class="badge bank">문제 사전</span><span class="note">${n} / ${all.length} 해결</span></div><h2 class="pt">${esc(st.title)}</h2>
   <p class="note">레벨마다 3문제가 한 세트예요. 학습 지도에서 같은 레벨 문제를 하나만 풀면 그 세트가 열려요.</p>${meterHTML(n,all.length,'t-'+tid)}
   ${ls.map(set).join('')}
   <div class="tools"><button class="btn ghost" id="bgolearn">학습 지도에서 개념 보기</button></div>
  </section></div>`;
 $('#back').onclick=()=>{V.bankStage=null;render();window.scrollTo(0,0)};
 $('#main').querySelectorAll('.prow').forEach(b=>b.onclick=()=>openProblem(b.dataset.p));
 $('#main').querySelectorAll('[data-gopr]').forEach(b=>b.onclick=()=>{V.tab='learn';V.stage={cat:cid,stage:si};render();window.scrollTo(0,0)});
 const bg=$('#bgolearn');if(bg)bg.onclick=()=>{V.tab='learn';V.stage={cat:cid,stage:si};V.bankStage=null;render();window.scrollTo(0,0)};
}

/* 오늘 화면에 보여 줄 카드 */
function bankHomeCard(){
 const open=bankSets().filter(x=>bankOpen(x.s.cat.id,x.s.si,x.l));
 if(!open.length)return '';
 const left=open.reduce((a,x)=>a+bankProblems(x.s.cat.id,x.s.si,x.l).filter(p=>!isSolved(p.id)).length,0);
 if(!left)return '';
 const fresh=open.find(x=>bankSetNew(x.s.cat.id,x.s.si,x.l));
 return `<div class="act bankcard"><div class="act-t"><span class="kick">문제 사전${bankNew()?' · NEW':''}</span><b>${fresh?esc(fresh.s.st.title)+' '+esc(LV[fresh.l])+'의 비슷한 문제 3개':'풀 수 있는 비슷한 문제 '+left+'개'}</b><span class="note">풀어 본 문제와 같은 단계·레벨이에요. 진도에는 들어가지 않아요.</span></div><button class="btn bankbtn" data-go="bank">문제 사전 열기</button></div>`;
}
