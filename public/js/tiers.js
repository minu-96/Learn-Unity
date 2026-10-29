/* ===== 학습 단계(입문·기초·심화) =====
   분야(cat)의 단계(stage)를 3개 학습 구간으로 묶는다. 키는 'cat:stage'.
   구간별 진행률·자력 해결률은 이 매핑으로 계산한다. */
const TIERS=[
 {id:'intro',name:'입문',desc:'C# 문법과 Unity의 기본 구조'},
 {id:'basic',name:'기초',desc:'컴포넌트·물리·애니메이션 등 개별 기능 다루기'},
 {id:'adv',name:'심화',desc:'연출·설계·최적화·디버깅처럼 기능을 엮는 종합 과제'}
];
const TIER_OF={
 'csharp:1':'intro','csharp:2':'intro','unity:1':'intro','unity:2':'intro','components:1':'intro','math:1':'intro','debug:1':'intro',
 'csharp:3':'basic','unity:3':'basic','components:2':'basic','physics:1':'basic','physics:2':'basic','animation:1':'basic','animation:2':'basic','particle:1':'basic','particle:2':'basic','math:2':'basic',
 'particle:3':'adv','juice:1':'adv','juice:2':'adv','juice:3':'adv','direction:1':'adv','direction:2':'adv','direction:3':'adv','design:1':'adv','design:2':'adv','design:3':'adv','debug:2':'adv','optimization:1':'adv','optimization:2':'adv'
};
const tierOf=p=>TIER_OF[p.cat+':'+p.stage]||'basic';
/* 수료 기준: 구간 문제의 80% 이상을 풀고, 푼 문제 중 60% 이상이 정답을 보지 않은 자력 해결 */
const PASS_SOLVED=0.8,PASS_SELF=0.6;

/* 진행 요약. solved는 {문제id:{ok,via,clean,tries,at}} 형태의 기록, problems는 기본 문제 배열 */
function summarize(problems,solved,review){
 const out={total:0,solved:0,self:0,peek:0,ai:0,tries:0,tier:{},cat:{},last:0};
 for(const t of TIERS)out.tier[t.id]={total:0,solved:0,self:0,peek:0,ai:0,passed:false};
 for(const p of problems){
  const t=out.tier[tierOf(p)],c=out.cat[p.cat]||(out.cat[p.cat]={total:0,solved:0,self:0});
  out.total++;t.total++;c.total++;
  const r=solved[p.id];if(!r)continue;
  out.tries+=r.tries||0;
  if(r.at&&r.at>out.last)out.last=r.at;
  if(!r.ok)continue;
  out.solved++;t.solved++;c.solved++;
  if(r.via==='auto'&&r.clean){out.self++;t.self++;c.self++}
  else if(r.via==='auto'){out.peek++;t.peek++}
  else{out.ai++;t.ai++}
 }
 for(const t of TIERS){const x=out.tier[t.id];x.passed=x.total>0&&x.solved/x.total>=PASS_SOLVED&&x.solved>0&&x.self/x.solved>=PASS_SELF}
 /* 복습 유지율: 복습을 한 번이라도 한 문제 중 현재 박스가 1 이상인 비율 */
 const rv=Object.values(review||{}).filter(r=>r.reps>0);
 out.retain=rv.length?Math.round(rv.filter(r=>r.box>=1).length/rv.length*100):null;
 out.reviewed=rv.length;
 return out;
}
