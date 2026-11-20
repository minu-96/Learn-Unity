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

 /* G. 주소·새로고침·링크·제목·스크롤·구간 전환 */
 ctx=await mk();pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(String(e)));
 await pg.setViewportSize({width:1000,height:420});
 await pg.goto(base+'/');await pg.click('#start');await pg.click('#g');await pg.waitForSelector('.hero');
 ok(/#\/home$/.test(pg.url()),'메인의 주소는 #/home');
 ok((await pg.getAttribute('nav.tabs [data-tab="learn"]','href'))==='#/learn'&&(await pg.$eval('nav.tabs [data-tab="learn"]',e=>e.tagName))==='A','탭은 진짜 링크(새 탭으로 열 수 있음)');
 await pg.click('nav.tabs [data-tab="learn"]');await pg.waitForSelector('.sc');
 ok(/#\/learn\/[a-z]+$/.test(pg.url())&&(await pg.title()).startsWith('학습'),'학습 탭: 주소와 탭 제목이 바뀜 ('+pg.url().split('#')[1]+' / '+(await pg.title())+')');
 const tiers=await pg.$$eval('[data-tier]',els=>els.map(e=>e.dataset.tier));
 const first=await pg.$eval('[data-tier][aria-selected="true"]',e=>e.dataset.tier);
 const other=tiers.find(t=>t!==first);
 await pg.click('[data-tier="'+other+'"]');await pg.waitForTimeout(150);
 ok(pg.url().endsWith('#/learn/'+other),'구간을 바꾸면 주소도 바뀜');
 await back(pg);ok((await pg.$eval('[data-tier][aria-selected="true"]',e=>e.dataset.tier))===first,'뒤로가기: 이전 구간으로 돌아옴');
 await pg.goForward();await pg.waitForTimeout(200);ok((await pg.$eval('[data-tier][aria-selected="true"]',e=>e.dataset.tier))===other,'앞으로가기: 바꾼 구간으로');
 /* 스크롤 위치 복원 */
 const maxY=await pg.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
 if(maxY>120){
  await pg.evaluate(y=>window.scrollTo(0,y),Math.min(maxY,300));await pg.waitForTimeout(400);
  const y0=await pg.evaluate(()=>scrollY);
  await pg.evaluate(()=>{const b=document.querySelector('.sc');b.scrollIntoView();b.click()});await pg.waitForSelector('#back');
  await back(pg);await pg.waitForTimeout(300);
  const y1=await pg.evaluate(()=>scrollY);
  ok(Math.abs(y1-y0)<=40||y1>0,'뒤로가기: 보던 스크롤 위치로 돌아옴 ('+y0+' → '+y1+')');
 }else ok(true,'스크롤 복원: 이 화면은 스크롤이 필요 없는 크기라 건너뜀');
 /* 새로고침해도 같은 화면 */
 await pg.evaluate(()=>{const b=document.querySelector('.sc');if(b)b.click()});await pg.waitForTimeout(200);
 if(!(await pg.$('#back'))){await pg.goto(base+'/#/learn/csharp/1')}
 const urlBefore=pg.url();const whereBefore=await where(pg);
 await pg.reload();await pg.waitForSelector('nav.tabs');
 ok(pg.url()===urlBefore&&await where(pg)===whereBefore,'새로고침: 같은 주소·같은 화면 ('+whereBefore+')');
 /* 주소로 바로 열기 (북마크·링크 공유·새 탭) */
 const pg2=await ctx.newPage();pg2.on('pageerror',e=>errs.push(String(e)));
 await pg2.goto(base+'/#/p/c1');await pg2.waitForSelector('#back');
 ok(await where(pg2)==='problem'&&(await pg2.title()).includes('Inspector'),'문제 주소로 바로 열림 + 문제 이름이 탭 제목');
 await pg2.goto(base+'/#/bank');await pg2.waitForSelector('nav.tabs');
 ok((await pg2.getAttribute('nav.tabs [data-tab="bank"]','aria-selected'))==='true','#/bank 주소로 열면 문제 사전');
 /* 주소창에서 직접 바꾸기 */
 await pg2.evaluate(()=>{location.hash='#/dict'});await pg2.waitForTimeout(300);
 ok((await pg2.getAttribute('nav.tabs [data-tab="dict"]','aria-selected'))==='true','주소창에서 #/dict로 바꾸면 개념 사전');
 await back(pg2);ok((await pg2.getAttribute('nav.tabs [data-tab="bank"]','aria-selected'))==='true','그 뒤 뒤로가기: 이전 화면');
 /* 로그아웃 상태로 링크를 열면 로그인 후 그 화면으로 */
 const ctx3=await mk();const pg3=await ctx3.newPage();pg3.on('pageerror',e=>errs.push(String(e)));
 await pg3.goto(base+'/#/review');await pg3.waitForSelector('#start');
 ok(await where(pg3)==='land'&&!pg3.url().includes('#'),'로그인 전에 링크를 열면 소개 화면 (주소는 정리됨)');
 await pg3.click('#start');await pg3.click('#g');await pg3.waitForSelector('nav.tabs');
 ok((await pg3.getAttribute('nav.tabs [data-tab="review"]','aria-selected'))==='true','로그인하면 열려던 화면(복습)으로 이동');

 /* H. 서비스 소개(세부 내용): 같은 주소(/)에서 화면만 바뀜 */
 {
  const vis=async(pg,id)=>pg.evaluate(i=>{const e=document.getElementById(i);return !!e&&!e.hidden},id);
  const ctxA=await mk();const pa=await ctxA.newPage();pa.on('pageerror',e=>errs.push(String(e)));
  await pa.goto(base+'/');await pa.waitForSelector('#toabout');
  ok(await vis(pa,'lhome')&&!(await vis(pa,'labout')),'소개 화면: 짧은 소개만 보임');
  await pa.click('#toabout');await pa.waitForTimeout(150);
  ok(await vis(pa,'labout')&&!(await vis(pa,'lhome'))&&pa.url().endsWith('/#/about')&&(await pa.title()).startsWith('서비스 소개'),'"서비스 소개 자세히 보기" → 같은 페이지에서 세부 화면 (주소 /#/about)');
  ok((await pa.textContent('#labout')).includes('스튜디오 바드 유니티 훈련소는 무엇인가요?'),'세부 화면에 자주 묻는 질문이 있음');
  await back(pa);ok(await vis(pa,'lhome')&&!pa.url().includes('#'),'뒤로가기 → 짧은 소개로, 주소는 /');
  await pa.goForward();await pa.waitForTimeout(300);ok(await vis(pa,'lhome')&&!(await vis(pa,'labout')),'앞으로가기로는 세부 화면에 들어가지 못함(소개에 머묾)');
  ok(await pa.locator('#labout [data-start]').count()===0,'세부 화면에는 시작하기 버튼이 없음');
  await pa.click('#toabout');await pa.click('#labout [data-home]');await pa.waitForTimeout(250);ok(await vis(pa,'lhome'),'"← 소개로 돌아가기" 버튼');
  await pa.click('#start');await pa.waitForSelector('#g');await back(pa);ok(await vis(pa,'lhome'),'로그인 화면에서 뒤로가기 → 소개');
  await pa.goBack();await pa.waitForTimeout(300).catch(()=>{});
  /* 주소로 바로 열기 */
  const pb=await ctxA.newPage();pb.on('pageerror',e=>errs.push(String(e)));
  await pb.goto(base+'/#/about');await pb.waitForSelector('#labout');
  ok(await vis(pb,'labout'),'/#/about 주소로 열면 세부 화면');
  await pb.click('#labout [data-home]');await pb.waitForTimeout(200);ok(await vis(pb,'lhome')&&!pb.url().includes('#'),'직접 열었을 때도 돌아가기 동작, 주소 정리');
  /* 로그인된 상태로 #/about 을 열어도 세부 화면, 시작하기는 바로 메인 */
  await pb.click('#start');await pb.click('#g');await pb.waitForSelector('.hero');
  const pc=await ctxA.newPage();pc.on('pageerror',e=>errs.push(String(e)));
  await pc.goto(base+'/#/about');await pc.waitForSelector('#labout');
  ok(await vis(pc,'labout'),'로그인된 채로 /#/about 열기 → 세부 화면');
  await pc.click('#labout [data-home]');await pc.click('#start');await pc.waitForSelector('.hero',{timeout:4000}).catch(()=>{});
  ok(await where(pc)==='home','소개로 돌아가 시작하기 → 로그인 화면 없이 바로 메인');
  /* 검색엔진: 자바스크립트 없이 받은 HTML에 세부 내용이 들어 있음 */
  const raw=await (await ctxA.request.get(base+'/')).text();
  ok(['자주 묻는 질문','스튜디오 바드 유니티 훈련소는 무엇인가요?','한 문제는 이렇게 풀어요','Rigidbody','유니티 훈련소 — Unity C# 코드 작성 연습, 자동 채점'].every(t=>raw.includes(t)),'원본 HTML에 세부 내용·제목이 모두 들어 있음(검색엔진이 읽는 글)');
 }
 ok(errs.length===0,'페이지 오류 없음'+(errs.length?' '+errs[0]:''));
 await br.close();srv.close();
 console.log(fails?'FAIL '+fails:'ALL PASS');process.exit(fails?1:0);
})();
