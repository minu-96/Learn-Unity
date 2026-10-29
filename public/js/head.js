const PROBLEMS=[];
const Q=p=>{p.concepts=(p.concepts||[]).map(([term,def])=>({term,def}));p.rules=p.rules||[];p.goals=p.goals||[];p.limits=p.limits||[];PROBLEMS.push(p)};
const it=(ok,label,pass,fail)=>({ok:!!ok,label,msg:ok?pass:fail});
