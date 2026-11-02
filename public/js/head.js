const PROBLEMS=[];
/* 문제 사전: 학습 지도에는 없는 추가 문제. 단계마다 3문제씩 두고, 그 단계 문제를 하나 풀면 열린다. 진도·수료 기준에는 들어가지 않는다 */
const BANK=[];
const prep=p=>{p.concepts=(p.concepts||[]).map(([term,def])=>({term,def}));p.rules=p.rules||[];p.goals=p.goals||[];p.limits=p.limits||[];return p};
const Q=p=>{PROBLEMS.push(prep(p))};
const QB=p=>{p.bank=true;BANK.push(prep(p))};
const it=(ok,label,pass,fail)=>({ok:!!ok,label,msg:ok?pass:fail});
