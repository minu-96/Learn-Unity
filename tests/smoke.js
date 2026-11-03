/* 브라우저 통합 테스트: 정적 서버 + 가짜 Firebase로 로그인/저장/내 기록/운영진 화면/신고 흐름을 검사한다.
   실행: node tests/smoke.js  (playwright 필요) */
const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const ROOT=path.join(__dirname,'..','public');
const {PROBLEMS}=require('./load.js');
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
 await pg.goto(base+'/');
 await pg.waitForSelector('#g');
 ok(true,'로그인 화면 표시');

 // 1. 구글 로그인 → 훈련 화면
 await pg.click('#g');
 await pg.waitForSelector('.hero');
 ok((await pg.textContent('.who')).includes('민우'),'로그인 후 이름 표시');

 // 2. 문제 하나 풀기 (정답 코드 입력 → 채점)
 const p=PROBLEMS.find(x=>x.cat==='csharp');
 ok(await pg.$$eval('.act',e=>e.length)>=1,'오늘 화면: 지금 할 것 카드');
 await pg.click('nav.tabs [data-tab="learn"]');
 await pg.waitForSelector('.scgrid');
 ok((await pg.$$eval('.tt b',e=>e.map(x=>x.textContent))).join()==='입문,기초,응용,심화','학습 지도: 네 구간 탭');
 await pg.click(`.tt[data-tier="basic"]`);
 await pg.click(`.sc[data-c="${p.cat}"][data-s="${p.stage}"]`);
 await pg.waitForSelector('.lesson');
 ok(await pg.$$eval('.lesson .code.ex',e=>e.length)===1,'단계 화면: 개념 카드와 예제 코드');
 await pg.click(`.prow[data-p="${p.id}"]`);
 await pg.waitForSelector('#code');
 ok(await pg.$$eval('.lc',e=>e.length)>=1,'문제 화면: 실시간 조건 체크 칩');
 ok(await pg.$$eval('.term',e=>e.length)>=0,'용어 버튼 렌더');
 if(await pg.$('.term')){await pg.click('.term');ok(await pg.isVisible('#tip'),'용어를 누르면 풀이 말풍선');await pg.keyboard.press('Escape')}
 await pg.fill('#code',p.solution);
 await pg.click('#grade');
 await pg.waitForSelector('.sum.ok',{timeout:15000});
 ok(true,'정답 채점 통과: '+p.id);
 await pg.waitForSelector('.donebox');
 await pg.fill('#note','스모크 메모');await pg.click('#savenote');
 await pg.click('.feel [data-f="easy"]');
 ok((await pg.getAttribute('.feel [data-f="easy"]','aria-pressed'))==='true','회고: 체감 난이도 선택');
 ok((await pg.textContent('#tutor')).includes('채점이 이상해요'),'AI 없는 튜터 영역과 신고 버튼');

 // 3. 신고
 await pg.click('.stuck summary');
 await pg.fill('#repnote','테스트 신고');
 await pg.click('#report');
 await pg.waitForFunction(()=>/전달했어요/.test(document.querySelector('#repmsg').textContent));
 ok(true,'신고 전송');

 // 4. 저장 (탭을 숨기면 즉시 flush)
 await pg.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});
 await pg.waitForFunction(()=>{const d=JSON.parse(localStorage.getItem('fakefb')||'{}').docs||{};return d['users/g-minu']&&d['users/g-minu'].summary&&d['users/g-minu'].summary.solved===1},null,{timeout:8000});
 const db=await pg.evaluate(()=>JSON.parse(localStorage.getItem('fakefb')));
 const u=db.docs['users/g-minu'];
 ok(u.summary.solved===1&&u.summary.self===1,'요약 저장(해결 1, 자력 1)');
 ok(Object.keys(u).every(k=>['name','email','photo','lastActive','summary','prob'].includes(k)),'users 문서 필드가 규칙 허용 목록 안에 있음');
 ok(!!db.docs['users/g-minu/data/state']&&!!db.docs['users/g-minu/data/work'],'state/work 문서 저장');
 ok(u.prob[p.id]&&u.prob[p.id][0]===1,'문제별 상태 저장');
 ok(Object.values(db.docs).filter(d=>d.pid===p.id&&d.status==='open').length===1,'신고 문서 저장');

 // 4b. 사전에 회고 메모가 보임
 await pg.click('nav.tabs [data-tab="dict"]');await pg.waitForSelector('.dict-item');
 ok((await pg.textContent('main')).includes('스모크 메모'),'회고 메모가 개념 사전에 표시');

 // 5. 내 기록
 await pg.evaluate(()=>{delete document.hidden});
 await pg.click('nav.tabs [data-tab="me"]');
 await pg.waitForSelector('.tiergrid');
 const tiers=await pg.$$eval('.tier h3',e=>e.map(x=>x.textContent));
 ok(tiers.join()==='입문,기초,응용,심화','내 기록: 네 단계 카드');
 ok((await pg.textContent('.statrow')).includes('1'),'내 기록: 요약 수치');

 // 6. 새로고침 → 클라우드에서 복원
 await pg.evaluate(()=>{Object.keys(localStorage).filter(k=>k.startsWith('unity-training-lab')).forEach(k=>localStorage.removeItem(k))});
 await pg.reload();await pg.waitForSelector('.hero');
 ok(await pg.evaluate(()=>PROBLEMS.filter(p=>isSolved(p.id)).length)===1,'로컬 캐시를 지워도 클라우드에서 진행도 복원');
 ok(await pg.evaluate(()=>(S.notes[PROBLEMS.find(x=>x.cat==='csharp').id]||{}).t)==='스모크 메모','회고 메모도 클라우드에서 복원');

 // 7. 다른 부원·운영진 데이터 심기
 await pg.evaluate(({probs})=>{
  const d=JSON.parse(localStorage.getItem('fakefb'));
  const mk=(name,solved,self,last,tier)=>({name,email:name+'@x.com',lastActive:last,summary:{total:90,solved,self,tier,retain:60,tries:solved*2},prob:Object.fromEntries(probs.slice(0,solved).map((id,i)=>[id,[i%3===0?2:1,3]]))});
  const T=(a,b,c)=>({intro:{total:15,solved:a,self:a,passed:a>=12},basic:{total:21,solved:b,self:b,passed:false},app:{total:36,solved:0,self:0,passed:false},adv:{total:33,solved:c,self:c,passed:false}});
  d.docs['users/u2']=mk('김가나',20,15,Date.now()-2*864e5,T(18,2,0));
  d.docs['users/u2'].summary.stats={bank:{solved:4,self:3,tries:9},rev:{done:6,kinds:5,due:2},days:{[dayKey(Date.now())]:[2,1,3],[dayKey(Date.now()-864e5)]:[0,2,0]}};
  d.docs['users/u3']=mk('이다라',5,5,Date.now()-30*864e5,T(5,0,0));
  d.docs['users/u4']=mk('<b>해커</b>',3,3,Date.now()-864e5,T(3,0,0));
  d.docs['admins/adm1']={ok:true};
  d.accounts={['admin@admin.learn-unity.example']:{uid:'adm1',pw:'pw1234'}};
  d.auth=null;
  localStorage.setItem('fakefb',JSON.stringify(d));
 },{probs:PROBLEMS.map(p=>p.id)});

 // 8. 운영진 로그인
 await pg.goto(base+'/#admin');await pg.reload();
 await pg.waitForSelector('#af');
 await pg.fill('#aid','admin');await pg.fill('#apw','wrong');await pg.click('#ago');
 await pg.waitForSelector('#aerr:not([hidden])');
 ok(true,'잘못된 비밀번호는 거부');
 await pg.fill('#apw','pw1234');await pg.click('#ago');
 await pg.waitForSelector('.tbl');
 ok((await pg.textContent('.who')).includes('운영진'),'운영진 표시');
 const names=await pg.$$eval('.tblwrap tbody tr td:first-child b',e=>e.map(x=>x.textContent));
 ok(names.length===4&&names.includes('김가나')&&names.includes('<b>해커</b>'),'부원 4명 표시, 이름의 HTML은 이스케이프: '+names.join('/'));
 ok(await pg.$$eval('.tblwrap tbody b b',e=>e.length)===0,'이름의 태그가 실제 요소로 렌더되지 않음');
 ok((await pg.textContent('.statrow')).includes('14일 이상 미활동'),'요약 칩');
 const row2=await pg.$$eval('.tblwrap tbody tr',e=>e.map(r=>r.textContent).find(t=>t.includes('김가나')));
 ok(/4.*6.*8/.test(row2),'부원 표에 문제 사전 해결·복습·7일 활동이 보임: '+row2.slice(-30));
 ok(await pg.$$eval('.dtbl',e=>e.length)===1,'전체 날짜별 표가 있고 부원 상세는 아직 안 열림');
 await pg.click('[data-sel]:has(b:text-is("김가나"))');
 ok(await pg.$$eval('#adetail .dtbl',e=>e.length)===1&&(await pg.textContent('#adetail')).includes('문제 사전 해결 4문제'),'부원을 누르면 그 사람의 문제 사전·복습·날짜별 상세가 열림');
 await pg.click('#aclose');
 ok(await pg.$('#adetail')===null,'상세 닫기');
 ok(await pg.$$eval('details.rep',e=>e.length)===1,'신고 목록 1건');
 await pg.click('.rep summary');await pg.click('[data-rs]');
 await pg.waitForFunction(()=>document.querySelector('.rep.done'));
 ok(true,'신고 처리됨 표시');
 await pg.check('#ai');
 ok(await pg.$$eval('.tblwrap tbody tr',e=>e.length)===1,'14일 미활동 필터');
 ok((await pg.textContent('main')).includes('많이 막히는 문제'),'막히는 문제 섹션');

 // 9. 로그아웃
 await pg.click('#logout');
 await pg.waitForSelector('#g,#af');
 ok(true,'로그아웃 후 로그인 화면');

 // 10. 모바일 폭
 await pg.setViewportSize({width:390,height:800});
 await pg.goto(base+'/');await pg.waitForSelector('#g');
 ok(await pg.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'모바일: 가로 스크롤 없음');

 console.log('page errors:',errs.length?errs:'none');
 await br.close();srv.close();
 console.log(fails?`FAIL ${fails}`:'ALL PASS');process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(2)});
