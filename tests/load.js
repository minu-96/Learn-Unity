const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..','public','js');
const files=['cs.js','core.js','cats.js','tiers.js','head.js',...fs.readdirSync(dir).filter(f=>/^p_.*\.js$/.test(f)).sort()];
const src=files.map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n')+'\nmodule.exports={PROBLEMS,BANK,gradeAll,gradeStatic,engine,CS,CATS,mapErr,TIERS,TIER_OF,tierOf,summarize};';
const m=new module.constructor();m._compile(src,path.join(dir,'bundle.js'));
module.exports=m.exports;
