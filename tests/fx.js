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

 // 운영진: 주차 과제 만들기
 await pg.evaluate(()=>{const d=JSON.parse(localStorage.getItem('fakefb')||'{"docs":{},"auth":null,"seq":0}');d.docs['admins/adm1']={ok:true};d.accounts={'admin@admin.learn-unity.example':{uid:'adm1',pw:'pw1234'}};localStorage.setItem('fakefb',JSON.stringify(d))});
 await pg.click('#toadmin');await pg.waitForSelector('#aid');
 await pg.fill('#aid','admin');await pg.fill('#apw','pw1234');await pg.click('#ago');
 await pg.waitForSelector('.statrow');
 ok(await pg.$('#wksave')!==null,'운영진 화면: 주차 과제 폼');
 await pg.click('.wkform').catch(()=>{});
 await pg.evaluate(()=>document.querySelector('details > summary.note').click());
 await pg.fill('#wkt','1주차 과제');await pg.fill('#wkn','정답은 마지막에');
 await pg.check('[data-wk="csharp:1"]');
 await pg.click('#wksave');
 await pg.waitForFunction(()=>/1주차 과제/.test(document.querySelector('main').textContent));
 ok(true,'주차 과제 저장 후 표시');
 const wkDoc=await pg.evaluate(()=>JSON.parse(localStorage.getItem('fakefb')).docs['config/weekly']);
 ok(wkDoc&&wkDoc.stages.join()==='csharp:1','config/weekly 문서에 단계 저장');
 await pg.click('#logout');await pg.waitForSelector('#g');

 // 부원: 홈 카드, 레벨 칩, 소리 토글
 await pg.click('#g');await pg.waitForSelector('.hero');
 ok(await pg.$('.act.wk')!==null,'부원 홈: 이번 주 과제 카드');
 ok(/Lv\.1/.test(await pg.textContent('#lvchip')),'헤더 레벨 칩 Lv.1');
 ok(await pg.$('#diagstart')!==null,'처음 접속: 진단 카드');
 const snd0=await pg.getAttribute('#snd','aria-pressed');
 await pg.click('#snd');
 ok((await pg.getAttribute('#snd','aria-pressed'))!==snd0,'효과음 토글');
 await pg.click('#snd');

 // 진단: 첫 문제 풀고, 나머지는 모르겠어요
 await pg.click('#diagstart');await pg.waitForSelector('#code');
 ok(await pg.$('.diagbar')!==null,'진단 안내 막대');
 const sol1=await pg.evaluate(()=>byId(V.pid).solution);
 await pg.fill('#code',sol1);await pg.click('#grade');
 await pg.waitForSelector('.sum.ok',{timeout:15000});
 ok(await pg.$('#diagnext')!==null,'진단 중 통과: 진단 이어가기 버튼');
 ok(await pg.$$eval('.toast',e=>e.length)>=0,'알림창 컨테이너');
 await pg.waitForSelector('.toast.xp',{timeout:3000});
 ok(true,'경험치 알림창');
 await pg.waitForSelector('.toast.bd',{timeout:4000});
 ok(/첫 걸음/.test(await pg.textContent('#toasts')),'첫 걸음 배지 알림');
 await pg.click('#diagnext');await pg.waitForSelector('#diagskip');
 await pg.click('#diagskip');await pg.waitForSelector('#diagskip');
 await pg.click('#diagskip');await pg.waitForSelector('#diagskip');
 await pg.click('#diagskip');
 await pg.waitForSelector('.diagcard.res');
 ok(/기초부터/.test(await pg.textContent('.diagcard.res')),'진단 결과: 입문 통과·기초 미통과 → 기초부터 추천');
 const rec=await pg.evaluate(()=>nextUnsolved()&&tierOf(nextUnsolved()));
 ok(rec==='basic','추천 문제가 기초 구간으로 이동');
 await pg.click('#diagok');
 ok(await pg.$('.diagcard')===null,'진단 결과 확인 후 카드 사라짐');

 // 주차 과제 진행 + 구문 색
 ok(/\d+ \/ \d+ 해결/.test(await pg.textContent('.act.wk')),'과제 진행률 표시');
 await pg.click('.act.wk .btn');await pg.waitForSelector('#code');
 ok(await pg.$$eval('#hlpre .hk, #hlpre .ht, #hlpre .hf',e=>e.length)>0,'편집기 구문 색 적용');
 const same=await pg.evaluate(()=>document.getElementById('hlpre').textContent.replace(/\n $/,'')===document.getElementById('code').value);
 ok(same,'구문 색 겹침 글자가 입력과 같음');
 await pg.fill('#code','int x = 5; // 메모\nstring s = "a<b>";');
 ok(await pg.$eval('#hlpre',e=>e.innerHTML.includes('&lt;b&gt;')),'구문 색 HTML 이스케이프');

 // 내 기록: 배지·레벨
 await pg.click('nav.tabs [data-tab="me"]');await pg.waitForSelector('.badges');
 ok(await pg.$$eval('.bdg',e=>e.length)===12,'내 기록: 배지 12개');
 ok(await pg.$$eval('.bdg:not(.lock)',e=>e.length)>=1,'획득한 배지 표시');

 // 진단 저장 → 새로고침 유지
 await pg.goto(base+'/');await pg.waitForSelector('.hero');
 ok(await pg.evaluate(()=>S.diag&&S.diag.rec==='basic'),'진단 결과 저장 유지');
 const cloud=await pg.evaluate(()=>JSON.parse(localStorage.getItem('fakefb')).docs['users/g-minu/data/state']);
 ok(cloud&&JSON.parse(cloud.json).diag!==undefined,'진단 결과가 서버 상태에 포함');

 // 운영진에서 과제 현황 열 확인
 await pg.click('#logout');await pg.waitForSelector('#g');
 await pg.click('#toadmin');await pg.waitForSelector('#aid');
 await pg.fill('#aid','admin');await pg.fill('#apw','pw1234');await pg.click('#ago');
 await pg.waitForSelector('.statrow');
 ok((await pg.$$eval('.tbl th',e=>e.map(x=>x.textContent))).includes('과제'),'운영진 표: 과제 열');
 ok(await pg.$('#aw')!==null,'운영진: 과제 미완료만 필터');

 // 3구간 시절 진단 결과를 4구간으로 옮기기
 const mg=await pg.evaluate(()=>[migDiag({at:1,res:[true,false,false],rec:'basic'}),migDiag({at:1,res:[false,false,false],rec:'intro'}),migDiag({at:1,res:[true,true,true],rec:'adv'}),migDiag({at:1,res:[true,true,false,false],rec:'app',v4:1})]);
 ok(mg[0].rec==='app'&&mg[0].res.join()==='true,true,false,false','옛 진단(기초 추천) → 응용 추천으로 이동');
 ok(mg[1].rec==='intro'&&mg[2].rec==='adv'&&mg[2].res.length===4,'옛 진단 입문·심화 추천 유지');
 ok(mg[3].rec==='app'&&mg[3].res.length===4,'이미 새 형식이면 그대로');

 // 모바일 가로 스크롤
 await pg.setViewportSize({width:390,height:844});
 await pg.click('#logout');await pg.waitForSelector('#g');await pg.click('#g');await pg.waitForSelector('.hero');
 ok(await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)<=0,'모바일 홈: 가로 스크롤 없음');
 await pg.click('.act.wk .btn');await pg.waitForSelector('#code');
 ok(await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)<=0,'모바일 문제: 가로 스크롤 없음');

 ok(errs.length===0,'페이지 오류 없음'+(errs.length?': '+errs.slice(0,3).join(' | '):''));
 await br.close();srv.close();
 console.log(fails?'FAIL '+fails:'ALL PASS');process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
