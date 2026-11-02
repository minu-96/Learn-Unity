const fs=require('fs');
const only=process.argv[2];
const dir=require('path').join(__dirname,'..','public','js');
const files=['cs.js','core.js','cats.js','tiers.js','head.js',...fs.readdirSync(dir).filter(f=>/^p_.*\.js$/.test(f)).sort()];
const src=files.map(f=>fs.readFileSync(dir+'/'+f,'utf8')).join('\n')+`
(async()=>{
 const run=o=>Promise.resolve(engine(o));
 let bad=0;const ids=new Set();
 const fail=(p,m)=>{console.log('✗',p.id,m);bad++};
 for(const p of PROBLEMS.concat(BANK)){
  if(${JSON.stringify(only||'')}&&!p.id.startsWith(${JSON.stringify(only||'')}))continue;
  if(ids.has(p.id))fail(p,'dup id');ids.add(p.id);
  const c=CATS.find(c=>c.id===p.cat);
  if(!c){fail(p,'bad cat');continue}
  if(!(p.stage>=1&&p.stage<=c.stages.length))fail(p,'bad stage');
  if(![1,2,3].includes(p.level))fail(p,'bad level');
  for(const k of ['title','story','starter','solution','why'])if(!p[k])fail(p,'missing '+k);
  if(!(p.goals.length>=1))fail(p,'no goals');
  if(!(p.hints&&p.hints.length>=2))fail(p,'hints<2');
  if(!p.concepts.length)fail(p,'no concepts');
  if(!(p.rules.length||p.test||p.check))fail(p,'no grading');
  try{
   const sg=await gradeAll(p,p.starter,run);
   if(sg.pass)fail(p,'starter passes!');
   const g=await gradeAll(p,p.solution,run);
   if(!g.pass||g.skipped)fail(p,'solution fails: '+g.items.filter(i=>!i.ok).map(i=>i.label+' → '+i.msg).join(' | ')+(g.skipped?' (skipped)':''));
   for(const [k,a] of (p.alts||[]).entries()){const ga=await gradeAll(p,a,run);if(!ga.pass)fail(p,'alt'+k+' fails: '+ga.items.filter(i=>!i.ok).map(i=>i.label+' → '+i.msg).join(' | '))}
   for(const [k,b] of (p.bads||[]).entries()){const gb=await gradeAll(p,b.code,run);const hit=gb.items.filter(i=>!i.ok).some(i=>(i.label+i.msg).includes(b.hit));if(gb.pass||!hit)fail(p,'bad'+k+' should fail on "'+b.hit+'" but: '+(gb.pass?'PASSED':gb.items.filter(i=>!i.ok).map(i=>i.label).join(',')))}
  }catch(e){fail(p,'exception '+e.stack)}
 }
 if(!${JSON.stringify(only||'')}){
  for(const c of CATS){const row=c.stages.map((s,i)=>[1,2,3].map(l=>PROBLEMS.filter(p=>p.cat===c.id&&p.stage===i+1&&p.level===l).length).join(''));console.log(c.id.padEnd(13),row.join(' | '))}
 }
 if(!${JSON.stringify(only||'')}){
  const st=new Set(BANK.map(p=>p.cat+':'+p.stage));
  for(const k of st){const [c,s]=k.split(':');const ls=BANK.filter(p=>p.cat===c&&p.stage===+s).map(p=>p.level).sort().join('');if(ls!=='123'){console.log('✗ bank',k,'레벨 구성',ls);bad++}}
  const ts=new Set(PROBLEMS.map(p=>p.title));for(const p of BANK)if(ts.has(p.title)){console.log('✗ bank',p.id,'학습 지도와 제목이 같음');bad++}
  console.log('BANK',BANK.length,'문제 /',st.size,'단계');
 }
 console.log('TOTAL',PROBLEMS.length,'bad',bad);
})();
`;
eval(src);
