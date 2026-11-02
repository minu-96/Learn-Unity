/* 연출·진단·주차 과제 통합 테스트 (가짜 Firebase). 실행: node tests/fx.js */
const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const ROOT=path.join(__dirname,'..','public');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const srv=http.createServer((q,r)=>{
 let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/index.html';
 const f=path.join(ROOT,u);
 if(!f.startsWith(ROOT)||!fs.existsSync(f)){r.writeHead(404);r.end();return}
 r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f));
});
let fails=0;
const ok=(c,m)=>{console.log(c?'✓':'✗',m);if(!c)fails++};
(async()=>{
 await new Promise(r=>srv.listen(0,r));
 const base='http://127.0.0.1:'+srv.address().port;
 const br=await chromium.launch();
 const ctx=await br.newContext({viewport:{width:1100,height:900}});
 const errs=[];
 await ctx.route(/gstatic\.com\/firebasejs\/.*(auth|firestore)-compat/,r=>r.fulfill({body:'',contentType:'text/javascript'}));
 await ctx.route(/gstatic\.com\/firebasejs\/.*app-compat/,r=>r.fulfill({body:fs.readFileSync(path.join(__dirname,'fake-firebase.js')),contentType:'text/javascript'}));
 await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.fulfill({body:'',contentType:'text/css'}));
 await ctx.route(/firebase-config\.js$/,r=>r.fulfill({body:"window.FIREBASE_CONFIG={apiKey:'k',authDomain:'a',projectId:'p',appId:'x'};window.ADMIN_EMAIL_DOMAIN='admin.learn-unity.example';",contentType:'text/javascript'}));
 const pg=await ctx.newPage();
 pg.on('pageerror',e=>errs.push(String(e)));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});

 await pg.goto(base+'/');await pg.waitForSelector('#g');
 await pg.click('#g');await pg.waitForSelector('.hero');
 const solve=async()=>{const sol=await pg.evaluate(()=>byId(V.pid).solution);await pg.fill('#code',sol);await pg.click('#grade');await pg.waitForSelector('.sum.ok',{timeout:15000})};

 // 처음에는 모두 잠겨 있다
 ok(await pg.$('nav.tabs [data-tab="bank"]')!==null,'문제 사전 탭이 있음');
 ok(await pg.$('.bankcard')===null,'아직 열린 단계가 없으면 홈 카드가 없음');
 await pg.click('nav.tabs [data-tab="bank"]');await pg.waitForSelector('.bhero');
 ok(await pg.$$eval('.bcard',e=>e.length)===5,'입문 5단계 카드가 보임');
 ok(await pg.$$eval('.bcard.lock',e=>e.length)===5,'처음에는 5개 모두 잠김');
 ok(/0 \/ 15/.test(await pg.textContent('.bstat')),'열린 세트 0 / 15');
 ok(await pg.$$eval('.lvset.lock',e=>e.length)===15,'레벨 세트 15개가 모두 잠김');

 // 학습 지도 문제를 하나 풀면 열린다
 await pg.click('nav.tabs [data-tab="learn"]');await pg.waitForSelector('.scgrid');
 await pg.click('.sc[data-c="start"][data-s="1"]');await pg.waitForSelector('.lesson');
 await pg.click('.prow >> nth=0');await pg.waitForSelector('#code');
 await solve();
 await pg.waitForSelector('.toast.bank',{timeout:6000});
 ok(/비슷한 문제 3개가 열렸어요/.test(await pg.textContent('#toasts')),'열림 알림창');
 ok(/비슷한 문제 3개 풀어보기/.test(await pg.textContent('#tobank')),'풀이 직후 비슷한 문제 버튼');
 ok(/1/.test(await pg.textContent('nav.tabs [data-tab="bank"] .bnew')),'탭에 NEW 개수');

 // 문제 사전에서 풀기
 await pg.click('#tobank');await pg.waitForSelector('#code');
 ok(await pg.evaluate(()=>{const p=byId(V.pid);return p.bank&&p.cat==='start'&&p.stage===1&&p.level===1}),'버튼이 같은 단계·같은 레벨의 사전 문제를 열어 줌');
 ok(/문제 사전/.test(await pg.textContent('.crumbs')),'문제 화면에 문제 사전 표시');
 ok(await pg.$('.badge.bank')!==null,'문제 사전 배지');
 const bid=await pg.evaluate(()=>V.pid);
 ok(/^x/.test(bid),'문제 사전 문제 id');
 const xp0=await pg.evaluate(()=>Fx.xpOf(S));
 await solve();
 ok(await pg.evaluate(()=>Fx.xpOf(S))>xp0,'문제 사전 문제도 경험치가 쌓임');
 await pg.waitForSelector('.toast.xp',{timeout:3000});
 ok(await pg.$('#next')!==null,'다음 문제 버튼(같은 단계 안)');
 ok(await pg.evaluate(()=>{const n=nextUnsolved();return !n||!n.bank}),'학습 지도 추천에는 문제 사전 문제가 섞이지 않음');
 const sm=await pg.evaluate(()=>{const s=summarize(PROBLEMS,S.solved,S.review);return [s.solved,s.total,s.tier.intro.total,s.tier.intro.solved]});
 ok(sm[0]===1&&sm[1]===105&&sm[2]===15&&sm[3]===1,'진도와 수료 기준에는 문제 사전이 들어가지 않음');
 await pg.click('#tolist');await pg.waitForSelector('.stagepage.bank');
 ok(await pg.$$eval('.stagepage.bank .bset:not(.lock) .prow',e=>e.length)===3,'열린 세트는 3문제');
 ok(await pg.$$eval('.stagepage.bank .bset.lock',e=>e.length)===2,'나머지 두 레벨은 잠김');
 ok(/1 \/ 9/.test(await pg.textContent('.stagepage.bank .card')),'단계 화면에 1 / 9 해결');
 await pg.click('#back');await pg.waitForSelector('.bhero');
 ok(await pg.$$eval('.bcard.lock',e=>e.length)===4,'나머지 4단계는 잠긴 채로');
 ok(/1 \/ 15/.test(await pg.textContent('.bstat')),'열린 세트 1 / 15');
 await pg.click('[data-bt="intro"]');
 ok(await pg.$$eval('.bsec',e=>e.length)===1,'단계 거르기');


 // 같은 레벨의 학습 지도 문제만 해당 세트를 연다 (Lv.2는 아직 잠김)
 ok(await pg.evaluate(()=>bankOpen('start',1,1)&&!bankOpen('start',1,2)&&!bankOpen('start',1,3)),'Lv.1만 열리고 Lv.2·3은 잠김');
 ok(await pg.evaluate(()=>bankProblems('start',1,1).every(p=>p.level===1)&&bankProblems('start',1,1).length===3),'세트 하나는 같은 레벨 3문제');
 await pg.evaluate(()=>{const p=PROBLEMS.find(x=>x.cat==='start'&&x.stage===1&&x.level===2);S.solved[p.id]={ok:true,tries:1};});
 ok(await pg.evaluate(()=>bankOpen('start',1,2)),'Lv.2 학습 지도 문제를 하나 풀면 Lv.2 세트가 열림');
 await pg.evaluate(()=>{const p=PROBLEMS.find(x=>x.cat==='start'&&x.stage===1&&x.level===2);delete S.solved[p.id];});

 // 홈 카드, 복습, 저장 유지
 await pg.click('nav.tabs [data-tab="home"]');await pg.waitForSelector('.hero');
 ok(await pg.$('.bankcard')!==null,'홈에 문제 사전 카드');
 ok(await pg.evaluate(id=>!!S.review[id],bid),'푼 문제 사전 문제가 복습 대상에 들어감');
 await pg.goto(base+'/');await pg.waitForSelector('.hero');
 ok(await pg.evaluate(id=>isSolved(id),bid),'새로고침 뒤에도 풀이 기록 유지');
 const cloud=await pg.evaluate(()=>JSON.parse(JSON.parse(localStorage.getItem('fakefb')).docs['users/g-minu/data/state'].json).solved);
 ok(Object.keys(cloud).some(k=>/^x/.test(k)),'문제 사전 풀이가 서버 상태에 저장');
 await pg.click('nav.tabs [data-tab="bank"]');await pg.waitForSelector('.bhero');
 ok(await pg.$$eval('.bcard:not(.lock)',e=>e.length)===1,'새로고침 뒤에도 열린 단계 유지');

 // 배지 / 모바일
 ok(await pg.evaluate(()=>Fx.BADGES.some(b=>b.id==='bank5')),'사전 탐험가 배지 정의');
 await pg.setViewportSize({width:390,height:844});
 await pg.click('nav.tabs [data-tab="bank"]');await pg.waitForSelector('.bhero');
 ok(await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)<=0,'모바일 문제 사전: 가로 스크롤 없음');
 await pg.click('.bcard:not(.lock)');await pg.waitForSelector('.stagepage.bank');
 ok(await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)<=0,'모바일 문제 사전 단계: 가로 스크롤 없음');

 ok(errs.length===0,'페이지 오류 없음'+(errs.length?': '+errs.slice(0,3).join(' | '):''));
 await br.close();srv.close();
 console.log(fails?'FAIL '+fails:'ALL PASS');process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
