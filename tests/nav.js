/* 뒤로가기 테스트: 메인 화면에서 뒤로가기를 한 번 누르면 머물며 안내, 한 번 더 누르면 나간다. 실행: node tests/nav.js */
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
 const ctx=await br.newContext({viewport:{width:1000,height:800}});
 await ctx.route(/firebase-config\.js$/,r=>r.fulfill({body:"window.FIREBASE_CONFIG={apiKey:'k',authDomain:'a',projectId:'p',appId:'x'};",contentType:'text/javascript'}));
 await ctx.route(/gstatic\.com\/firebasejs\/.*(auth|firestore)-compat/,r=>r.fulfill({body:'',contentType:'text/javascript'}));
 await ctx.route(/gstatic\.com\/firebasejs\/.*app-compat/,r=>r.fulfill({body:fs.readFileSync(path.join(__dirname,'fake-firebase.js')),contentType:'text/javascript'}));
 await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.fulfill({body:'',contentType:'text/css'}));
 const errs=[];
 const run=async(label,pg)=>{
  await pg.goBack();await pg.waitForTimeout(250);
  ok(pg.url().startsWith(base)&&!!(await pg.$('nav.tabs')),label+': 뒤로가기 한 번 → 사이트에 머묾');
  ok(!!(await pg.$('.navtoast')),label+': "한 번 더 누르면 나가요" 안내 표시');
  await pg.goBack();await pg.waitForTimeout(400);
  ok(!pg.url().startsWith(base),label+': 한 번 더 누르면 사이트에서 나감');
 };
 // A. 소개 → 로그인 → 메인
 let pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto(base+'/');await pg.waitForSelector('#start');await pg.click('#start');await pg.waitForSelector('#g');await pg.click('#g');await pg.waitForSelector('.hero');
 await run('로그인 직후',pg);
 // B. 이미 로그인된 상태로 처음 접속
 pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto(base+'/');await pg.waitForSelector('.hero');
 await run('재방문',pg);
 // C. 탭을 옮긴 뒤에는 안내 없이 이전 탭으로 (안내는 맨 처음 화면에서만)
 pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto(base+'/');await pg.waitForSelector('.hero');
 await pg.click('nav.tabs [data-tab="dict"]');await pg.goBack();await pg.waitForTimeout(200);
 ok((await pg.getAttribute('nav.tabs [data-tab="home"]','aria-selected'))==='true'&&!(await pg.$('.navtoast')),'탭 이동 후 뒤로가기: 안내 없이 이전 탭');
 ok(errs.length===0,'페이지 오류 없음'+(errs.length?' '+errs[0]:''));
 await br.close();srv.close();
 console.log(fails?'FAIL '+fails:'ALL PASS');process.exit(fails?1:0);
})();
