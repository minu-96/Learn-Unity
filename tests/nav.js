/* 뒤로가기·로그인 흐름 테스트. 실행: node tests/nav.js
   기록 구조: [소개] → [메인] → [학습] → [단계] → [문제]. 뒤로가기는 거꾸로 한 칸씩, 소개에서 한 번 더 누르면 사이트를 나간다. */
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
let fails=0;const ok=(c,m)=>{console.log(c?'✓':'✗',m);if(!c)fails++};
(async()=>{
 await new Promise(r=>srv.listen(0,r));
 const base='http://127.0.0.1:'+srv.address().port;
 const br=await chromium.launch();
 const mk=async()=>{
  const ctx=await br.newContext({viewport:{width:1000,height:800}});
  await ctx.route(/firebase-config\.js$/,r=>r.fulfill({body:"window.FIREBASE_CONFIG={apiKey:'k',authDomain:'a',projectId:'p',appId:'x'};",contentType:'text/javascript'}));
  await ctx.route(/gstatic\.com\/firebasejs\/.*(auth|firestore)-compat/,r=>r.fulfill({body:'',contentType:'text/javascript'}));
  await ctx.route(/gstatic\.com\/firebasejs\/.*app-compat/,r=>r.fulfill({body:fs.readFileSync(path.join(__dirname,'fake-firebase.js')),contentType:'text/javascript'}));
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.fulfill({body:'',contentType:'text/css'}));
  return ctx;
 };
 const errs=[];
 const where=pg=>pg.evaluate(()=>{
  if(document.querySelector('.land'))return 'land';
  if(document.querySelector('#g'))return 'login';
  const tab=document.querySelector('nav.tabs [aria-selected="true"]');const t=tab&&tab.dataset.tab;
  const back=document.querySelector('#back');
  if(document.querySelector('#run,#check,#submit,textarea,.editor')&&back)return 'problem';
  if(t==='learn')return back?'stage':'learn';
  return t||'?';
 });
 const back=async pg=>{await pg.goBack();await pg.waitForTimeout(250)};

 /* A. 소개 → 로그인 → 메인 → 학습 → 단계 → 문제, 그리고 거꾸로 */
 let ctx=await mk();let pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto(base+'/');await pg.waitForSelector('#start');
 await pg.click('#start');await pg.waitForSelector('#g');
 await back(pg);ok(await where(pg)==='land','로그인 화면에서 뒤로가기 → 소개');
 await pg.goForward();await pg.waitForSelector('#g');ok(true,'앞으로가기 → 로그인 화면');
 ok(await pg.isChecked('#keep'),'로그인 유지: 기본으로 켜져 있음');
 await pg.click('#g');await pg.waitForSelector('.hero');
 ok(await pg.evaluate(()=>window.__persist)==='local','로그인 유지 켬 → 로그인이 남는 방식(LOCAL)');
 await pg.click('nav.tabs [data-tab="learn"]');await pg.waitForSelector('.sc');
 await pg.click('.sc');await pg.waitForSelector('#back');
 await pg.evaluate(()=>{const b=document.querySelector('#main button.pcard,#main [data-open],#main [data-p],#main .prow,#main .pc');if(b)b.click()});
 await pg.waitForTimeout(300);
 ok(await where(pg)==='problem','문제 화면까지 들어옴');
 await back(pg);ok(await where(pg)==='stage','뒤로가기 1: 문제 → 단계 화면');
 await back(pg);ok(await where(pg)==='learn','뒤로가기 2: 단계 → 학습 지도');
 await back(pg);ok(await where(pg)==='home','뒤로가기 3: 학습 → 메인');
 await back(pg);ok(await where(pg)==='land'&&pg.url().startsWith(base),'뒤로가기 4: 메인 → 소개');
 /* B. 로그인 상태에서 소개의 시작하기 → 로그인 화면 없이 바로 메인 */
 await pg.click('#start');await pg.waitForSelector('.hero',{timeout:3000}).catch(()=>{});
 ok(await where(pg)==='home'&&!(await pg.$('#g')),'로그인 중 소개에서 시작하기 → 로그인 화면 없이 메인');
 await back(pg);ok(await where(pg)==='land','다시 뒤로가기 → 소개');
 await pg.goBack();await pg.waitForTimeout(400);
 ok(!pg.url().startsWith(base),'소개에서 한 번 더 → 사이트에서 나감');
 /* C. 이미 로그인된 채로 처음 접속 */
 pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto(base+'/');await pg.waitForSelector('.hero');
 await back(pg);ok(await where(pg)==='land','재방문: 메인에서 뒤로가기 → 소개');
 await pg.goBack();await pg.waitForTimeout(400);ok(!pg.url().startsWith(base),'재방문: 소개에서 한 번 더 → 나감');
 /* D. 로그아웃하면 소개, 그다음 시작하기는 로그인 화면 */
 pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto(base+'/');await pg.waitForSelector('#logout');await pg.click('#logout');await pg.waitForSelector('.land');
 ok(await where(pg)==='land','로그아웃 → 소개 화면');
 await pg.click('#start');await pg.waitForSelector('#g');ok(true,'로그아웃 뒤 시작하기 → 로그인 화면');
 await pg.close();await ctx.close();
 /* E. 로그인 유지를 끄면 이 창에서만 유지 */
 ctx=await mk();pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto(base+'/');await pg.click('#start');await pg.waitForSelector('#g');await pg.uncheck('#keep');await pg.click('#g');await pg.waitForSelector('.hero');
 ok(await pg.evaluate(()=>window.__persist)==='session','로그인 유지 끔 → 이 창에서만 유지(SESSION)');
 /* F. 로그인 전 소개에서 뒤로가기 → 나감 */
 const c2=await mk();const p2=await c2.newPage();await p2.goto(base+'/');await p2.waitForSelector('#start');await p2.goBack();await p2.waitForTimeout(300);
 ok(!p2.url().startsWith(base),'로그인 전 소개에서 뒤로가기 → 나감');
 ok(errs.length===0,'페이지 오류 없음'+(errs.length?' '+errs[0]:''));
 await br.close();srv.close();
 console.log(fails?'FAIL '+fails:'ALL PASS');process.exit(fails?1:0);
})();
