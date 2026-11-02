const {PROBLEMS:P0,BANK,gradeAll,engine}=require('./load.js');
const PROBLEMS=P0.concat(BANK);
const run=o=>Promise.resolve(engine(o));
const M={
 'K&R 중괄호':s=>s.replace(/\)\s*\n\s*\{/g,') {'),
 'private 생략':s=>s.replace(/\bprivate\s+(?!set\b)/g,''),
 '한 줄 if 중괄호':s=>s.replace(/(\bif\s*\((?:[^()]|\([^()]*\))*\))\s*(return[^;]*;|[\w.]+\s*(?:=|\+=|-=)[^;{}]*;|[\w.]+\([^;{}]*\);)/g,'$1 { $2 }'),
 'this. 붙이기':s=>s.replace(/(^|[^.\w])transform\./g,'$1this.transform.'),
 '탭 들여쓰기':s=>s.replace(/^( {4})+/gm,m=>'\t'.repeat(m.length/4)),
};
(async()=>{
 let bad=0;
 for(const [name,f] of Object.entries(M)){
  for(const p of PROBLEMS){
   const code=f(p.solution);if(code===p.solution)continue;
   const g=await gradeAll(p,code,run);
   if(!g.pass){bad++;console.log('✗',name,p.id,g.items.filter(i=>!i.ok).map(i=>i.label+': '+i.msg).join(' | ').slice(0,300))}
  }
 }
 console.log('mutation bad',bad);
})();
