/* "코딩이란?" 안내 통합 테스트. 실행: node tests/intro.js */
const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const ROOT=path.join(__dirname,'..','public');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const srv=http.createServer((q,r)=>{let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/index.html';const f=path.join(ROOT,u);if(!f.startsWith(ROOT)||!fs.existsSync(f)){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
let fails=0;const ok=(c,m)=>{console.log(c?'✓':'✗',m);if(!c)fails++};
(async()=>{
 await new Promise(r=>srv.listen(0,r));
 const base='http://127.0.0.1:'+srv.address().port;
 const br=await chromium.launch(),ctx=await br.newContext({viewport:{width:1100,height:900}});
 await ctx.route(/gstatic\.com\/firebasejs\/.*(auth|firestore)-compat/,r=>r.fulfill({body:'',contentType:'text/javascript'}));
 await ctx.route(/gstatic\.com\/firebasejs\/.*app-compat/,r=>r.fulfill({body:fs.readFileSync(path.join(__dirname,'fake-firebase.js')),contentType:'text/javascript'}));
 await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.fulfill({body:'',contentType:'text/css'}));
 await ctx.route(/firebase-config\.js$/,r=>r.fulfill({body:"window.FIREBASE_CONFIG={apiKey:'k',authDomain:'a',projectId:'p',appId:'x'};",contentType:'text/javascript'}));
 const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(String(e)));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await pg.goto(base+'/');await pg.waitForSelector('#g');await pg.click('#g');await pg.waitForSelector('.hero');
 ok(await pg.$('.introcard')!==null,'처음이면 홈에 "코딩이란?" 카드');
 await pg.click('.introcard [data-go="intro"]');await pg.waitForSelector('.inslide');
 // 1 순서
 ok(!(await pg.isVisible('#iafter')),'풀기 전에는 설명이 숨겨져 있음');
 await pg.click('.icard[data-i="2"]');ok(await pg.$$eval('.slot.on',e=>e.length)===0,'틀린 순서는 놓이지 않음');
 for(const i of [0,1,2,3])await pg.click(`.icard[data-i="${i}"]`);
 ok(await pg.$$eval('.slot.on',e=>e.length)===4,'맞는 순서로 4칸이 채워짐');
 ok(await pg.isVisible('#iafter'),'완성하면 설명이 나타남');
 await pg.click('#inext');await pg.waitForSelector('.iopt');
 // 2 정확함
 await pg.click('.iopt[data-i="1"]');ok(/오류/.test(await pg.textContent('#con')),'틀린 코드는 오류가 보임');
 await pg.click('.iopt[data-i="0"]');ok(/안녕/.test(await pg.textContent('#con'))&&await pg.isVisible('#iafter'),'맞는 코드는 결과가 보임');
 await pg.click('#inext');await pg.waitForSelector('.spot');
 // 3 값
 ok(await pg.$eval('#hit',e=>e.disabled),'체력을 보기 전에는 버튼이 잠겨 있음');
 for(const k of ['name','hp','score','x'])await pg.click(`.spot[data-k="${k}"]`);
 await pg.click('#hit');ok(await pg.textContent('#hpn')==='90'&&/hp = hp - 10/.test(await pg.textContent('#vcode')),'체력이 코드대로 줄어듦');
 ok(await pg.isVisible('#iafter'),'4개를 모두 보면 설명');
 await pg.click('#inext');await pg.waitForSelector('#hp');
 // 4 판단·반복
 await pg.$eval('#hp',e=>{e.value=0;e.dispatchEvent(new Event('input'))});ok(/게임 오버/.test(await pg.textContent('#st')),'체력 0이면 게임 오버');
 await pg.click('#atk');await pg.waitForFunction(()=>document.querySelectorAll('#alog li').length===3);
 ok(await pg.isVisible('#iafter'),'판단과 반복을 모두 해 보면 설명');
 await pg.click('#inext');await pg.waitForSelector('.node');
 // 5 지도
 for(const k of ['cs','un','ob','sc'])await pg.click(`.node[data-k="${k}"]`);
 ok(await pg.isVisible('#iafter'),'지도 4칸을 모두 보면 설명');
 await pg.click('#inext');await pg.waitForSelector('.introend');
 ok(await pg.evaluate(()=>!!S.intro),'끝까지 보면 완료가 저장됨');
 await pg.click('#istart');await pg.waitForSelector('#code');
 ok(await pg.evaluate(()=>byId(V.pid).cat==='start'),'입문 첫 문제로 이어짐');
 await pg.click('nav.tabs [data-tab="home"]');await pg.waitForSelector('.hero');
 ok(await pg.$('.introcard')===null,'본 뒤에는 홈 카드가 사라짐');
 await pg.click('nav.tabs [data-tab="learn"]');await pg.waitForSelector('.scgrid');await pg.click('.tt[data-tier="intro"]');
 ok(await pg.$('#tointro')!==null,'학습 > 입문에서 다시 볼 수 있음');
 await pg.setViewportSize({width:390,height:844});await pg.click('#tointro');await pg.waitForSelector('.inslide');
 ok(await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)<=0,'모바일: 가로 스크롤 없음');
 ok(errs.length===0,'페이지 오류 없음'+(errs.length?': '+errs[0]:''));
 await br.close();srv.close();console.log(fails?'FAIL '+fails:'ALL PASS');process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
