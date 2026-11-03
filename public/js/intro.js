/* ===== 코딩이란? (입문 맨 앞 안내) =====
   코드를 쓰기 전에 "코딩이 무엇인지"를 비유와 가벼운 체험으로 알려 준다. 진도·수료 기준에는 들어가지 않는다. */
const IN={i:0,seen:{}};
const introDone=()=>!!S.intro;
function introHomeCard(){
 if(introDone())return '';
 return `<div class="act introcard"><div class="act-t"><span class="kick">처음이신가요?</span><b>코딩이 뭔지부터, 5분만</b><span class="note">코드를 쓰기 전에 알아 두면 좋은 이야기예요. 건너뛰어도 돼요.</span></div><button class="btn" data-go="intro">시작하기</button></div>`;
}
const STEPS=['물을 끓인다','면과 스프를 넣는다','3분 기다린다','그릇에 담는다'];
const INTRO=[
 {kick:'1 / 5 · 순서',title:'코딩은 "순서를 적은 설명서"예요',
  lead:'라면을 끓이는 일도 순서가 있어요. 순서가 틀리면 결과가 달라지죠. 맞는 순서대로 눌러 보세요.',
  html:()=>`<div class="inord"><ol class="slots" id="slots">${STEPS.map((_,i)=>`<li class="slot" data-i="${i}"><b>${i+1}</b><span></span></li>`).join('')}</ol><div class="cards" id="cards">${[2,0,3,1].map(i=>`<button class="icard" data-i="${i}">${STEPS[i]}</button>`).join('')}</div><div class="fb" id="fb" role="status">무엇부터 해야 할까요?</div></div>`,
  after:`<p>컴퓨터도 똑같아요. 코드는 <b>위에서 아래로, 한 줄씩, 적힌 순서대로</b> 실행돼요. 순서를 바꾸면 결과도 바뀌고, 쓰지 않은 일은 하지 않아요.</p>`,
  bind(root,mark){
   let next=0,wrong=0;const fb=root.querySelector('#fb');
   root.querySelectorAll('.icard').forEach(c=>c.onclick=()=>{
    const i=+c.dataset.i;
    if(i===next){const s=root.querySelector(`.slot[data-i="${next}"]`);s.classList.add('on');s.querySelector('span').textContent=STEPS[i];c.hidden=true;next++;wrong=0;Fx.sfx('xp');
     if(next===STEPS.length){fb.textContent='완성! 순서가 맞아야 라면이 완성돼요.';fb.className='fb ok';Fx.sfx('pass');mark()}else fb.textContent='좋아요. 그다음은요?'}
    else{wrong++;c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');Fx.sfx('fail');fb.className='fb no';fb.textContent=wrong>1?`힌트: 지금 단계는 "${STEPS[next].slice(0,2)}…"로 시작해요.`:'아직이에요. 앞에서 한 일 다음에 올 일을 생각해 보세요.'}
   });
  }},
 {kick:'2 / 5 · 정확함',title:'컴퓨터는 눈치가 없어요',
  lead:'사람은 "대충 알아서"가 통하지만 컴퓨터는 적은 그대로만 읽어요. 아래 중에서 컴퓨터가 알아듣는 것은 어느 쪽일까요?',
  html:()=>`<div class="inerr"><div class="opts" id="opts">${[
   ['Debug.Log("안녕");',1],['debug.log("안녕");',0],['Debug.Log("안녕")',0],['Debug.Log(안녕);',0]].map(([t,ok],i)=>`<button class="iopt" data-ok="${ok}" data-i="${i}"><code>${t.replace(/</g,'&lt;')}</code></button>`).join('')}</div><div class="console" id="con" role="status" aria-live="polite"><span class="dim">콘솔 (결과가 여기에 나와요)</span></div></div>`,
  after:`<p>글자 하나, 기호 하나만 달라도 컴퓨터는 못 알아들어요. 그래서 <b>오류가 나는 건 정상</b>이에요. 오류 메시지는 "여기가 이상해요"라고 알려 주는 힌트예요. 읽는 법은 입문 문제에서 천천히 연습해요.</p>`,
  bind(root,mark){
   const MSG=['','대소문자까지 똑같이 써야 해요. 이름은 "Debug"예요.','문장이 끝나면 세미콜론(;)으로 끝났다고 알려 줘야 해요.','글자는 큰따옴표(" ")로 감싸야 해요. 그렇지 않으면 이름으로 읽어요.'];
   const con=root.querySelector('#con');
   root.querySelectorAll('.iopt').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.ok==='1',i=+b.dataset.i;
    if(ok){b.classList.add('ok');con.innerHTML='<span class="out">안녕</span>';Fx.sfx('pass');mark()}
    else{b.classList.add('no');con.innerHTML=`<span class="err">오류</span> ${MSG[i]}`;Fx.sfx('fail')}
   });
  }},
 {kick:'3 / 5 · 값',title:'게임은 "값"으로 이루어져 있어요',
  lead:'게임 화면의 체력, 점수, 위치는 모두 값이에요. 코드는 이 값에 이름을 붙이고, 읽고, 바꿔요. 이름 붙은 값을 변수라고 불러요. 화면의 항목을 눌러 보세요.',
  html:()=>`<div class="invals"><div class="scene" aria-label="게임 화면 예시"><button class="spot" data-k="name"><span class="k">이름</span><b>용사</b></button><button class="spot" data-k="hp"><span class="k">체력</span><span class="bar"><i id="hpbar" style="width:100%"></i></span><b id="hpn">100</b></button><button class="spot" data-k="score"><span class="k">점수</span><b>0</b></button><button class="spot" data-k="x"><span class="k">위치</span><b>2.5</b></button></div><pre class="mini" id="vcode" aria-live="polite"><span class="dim">// 눌러 본 값이 여기에 코드로 나타나요</span></pre><div class="row"><button class="btn ghost sm" id="hit" disabled>체력 -10 (코드로 바꿔 보기)</button></div></div>`,
  after:`<p>"값에 이름을 붙인 것"이 변수예요. 코드가 <code>hp</code>의 값을 바꾸면 화면도 바뀌어요. 게임을 만든다는 건 결국 이런 값을 읽고 바꾸는 규칙을 적는 일이에요.</p>`,
  bind(root,mark){
   const L={name:'string name = "용사";   // 글자',hp:'int hp = 100;          // 정수',score:'int score = 0;        // 정수',x:'float x = 2.5f;       // 소수'};
   const seen=new Set();let hp=100;const pre=root.querySelector('#vcode');
   const draw=()=>{pre.textContent=[...seen].map(k=>L[k]).join('\n')+(hp<100?`\nhp = hp - 10;   // 지금 hp는 ${hp}`:'')};
   root.querySelectorAll('.spot').forEach(b=>b.onclick=()=>{seen.add(b.dataset.k);b.classList.add('seen');Fx.sfx('tap');draw();
    if(seen.has('hp'))root.querySelector('#hit').disabled=false;
    if(seen.size===4)mark()});
   root.querySelector('#hit').onclick=()=>{hp=Math.max(0,hp-10);root.querySelector('#hpbar').style.width=hp+'%';root.querySelector('#hpn').textContent=hp;Fx.sfx(hp?'tap':'fail');draw()};
  }},
 {kick:'4 / 5 · 판단과 반복',title:'게임은 판단하고, 반복해요',
  lead:'"체력이 0이면 게임 오버", "적이 올 때마다 공격". 이런 규칙이 조건문과 반복문이에요. 직접 움직여 보세요.',
  html:()=>`<div class="inlogic"><div class="box"><b>판단</b><label class="sl">체력 <input type="range" id="hp" min="0" max="100" value="60" aria-label="체력"> <output id="hpv">60</output></label><pre class="mini">if (hp &lt;= 0)\n{\n    게임 오버\n}\nelse\n{\n    계속 진행\n}</pre><div class="state" id="st" role="status">계속 진행</div></div><div class="box"><b>반복</b><pre class="mini">for (int i = 0; i &lt; 3; i++)\n{\n    공격();\n}</pre><button class="btn" id="atk">실행</button><ul class="alog" id="alog" aria-live="polite"></ul></div></div>`,
  after:`<p><b>조건문</b>은 상황에 따라 갈림길을 고르고, <b>반복문</b>은 같은 일을 여러 번 해요. 변수와 합치면 대부분의 게임 규칙을 만들 수 있어요.</p>`,
  bind(root,mark){
   const f={a:0,b:0},ck=()=>{if(f.a&&f.b)mark()};
   const hp=root.querySelector('#hp'),st=root.querySelector('#st');
   hp.oninput=()=>{const v=+hp.value;root.querySelector('#hpv').textContent=v;const over=v<=0;st.textContent=over?'게임 오버':'계속 진행';st.classList.toggle('over',over);if(over){Fx.sfx('fail');f.a=1;ck()}};
   const lg=root.querySelector('#alog');
   root.querySelector('#atk').onclick=e=>{const b=e.currentTarget;b.disabled=true;lg.innerHTML='';
    [0,1,2].forEach(i=>setTimeout(()=>{if(!lg.isConnected)return;lg.insertAdjacentHTML('beforeend',`<li>공격! <span class="dim">(i = ${i})</span></li>`);Fx.sfx('tap');if(i===2){b.disabled=false;f.b=1;ck()}},i*320));};
  }},
 {kick:'5 / 5 · 도구',title:'내가 쓰는 도구 지도',
  lead:'앞으로 쓸 말과 도구는 이렇게 이어져 있어요. 눌러서 읽어 보세요.',
  html:()=>`<div class="inmap"><div class="chain">${[['cs','C#','내가 쓰는 말'],['un','유니티','게임 만드는 도구'],['ob','오브젝트','캐릭터·적·아이템'],['sc','게임 화면','플레이어가 보는 것']].map(([k,t,s],i)=>`${i?'<span class="arrow" aria-hidden="true">→</span>':''}<button class="node" data-k="${k}"><b>${t}</b><span class="note">${s}</span></button>`).join('')}</div><div class="fb" id="mapfb" role="status">각 칸을 눌러 보세요.</div></div>`,
  after:`<p>이 앱에서는 유니티를 설치하지 않아도 C# 코드를 쓰고 바로 채점해 볼 수 있어요. 유니티 안에서의 모습은 각 단계의 "Unity에서 직접 해보기"에서 확인해요.</p>`,
  bind(root,mark){
   const T={cs:'C#은 컴퓨터에게 일을 시키는 "말"이에요. 우리가 연습할 것이 바로 이 말이에요.',un:'유니티는 게임을 만드는 프로그램이에요. 화면, 소리, 물리를 대신 처리해 줘요.',ob:'유니티 안의 모든 것(캐릭터, 적, 아이템)은 오브젝트예요. 코드를 오브젝트에 붙이면 그 오브젝트가 코드대로 움직여요.',sc:'코드가 값을 바꾸면 그 결과가 게임 화면으로 나타나요. 체력이 줄면 체력 바가 줄어들죠.'};
   const seen=new Set(),fb=root.querySelector('#mapfb');
   root.querySelectorAll('.node').forEach(n=>n.onclick=()=>{fb.textContent=T[n.dataset.k];n.classList.add('seen');seen.add(n.dataset.k);Fx.sfx('tap');if(seen.size===4)mark()});
  }}
];

function renderIntro(){
 const n=INTRO.length,last=IN.i>=n,sl=INTRO[IN.i];
 const dots=INTRO.map((_,i)=>`<span class="idot ${i===IN.i?'cur':''} ${IN.seen[i]?'ok':''}" aria-hidden="true"></span>`).join('');
 if(last){
  S.intro=S.intro||{at:Date.now()};persist();
  $('#main').innerHTML=`<div class="intro"><section class="card introend"><span class="kick">준비 끝</span><h2 class="pt">이제 코드를 써 볼 차례예요</h2><p>코딩은 <b>순서대로, 정확하게, 값을 다루는 일</b>이에요. 처음엔 오류가 나는 게 정상이에요. 천천히 하나씩 해 봐요.</p><div class="tools"><button class="btn" id="istart">입문 첫 문제 시작</button><button class="btn ghost" id="istage">입문 단계 보기</button><button class="btn ghost" id="iagain">처음부터 다시 보기</button></div></section></div>`;
  Fx.sfx('unlock');
  $('#istart').onclick=()=>{const p=PROBLEMS.find(x=>x.cat==='start'&&!isSolved(x.id))||PROBLEMS.find(x=>x.cat==='start');IN.i=0;openProblem(p.id)};
  $('#istage').onclick=()=>{IN.i=0;V.tier='intro';gotoTab('learn')};
  $('#iagain').onclick=()=>{IN.i=0;IN.seen={};renderIntro()};
  return;
 }
 $('#main').innerHTML=`<div class="intro"><div class="crumbs"><button class="btn ghost sm" id="iback">← 나가기</button><span class="idots" role="img" aria-label="${IN.i+1} / ${n} 단계">${dots}</span></div>
  <section class="card inslide"><span class="kick">${sl.kick}</span><h2 class="pt">${sl.title}</h2><p class="lead">${sl.lead}</p>${sl.html()}<div class="inafter ${IN.seen[IN.i]?'show':''}" id="iafter">${sl.after}</div>
  <div class="tools"><button class="btn ghost" id="iprev" ${IN.i?'':'disabled'}>이전</button><span style="flex:1"></span><button class="btn" id="inext">${IN.i===n-1?'마치기':'다음'}</button></div></section></div>`;
 const root=$('#main');
 sl.bind(root,()=>{IN.seen[IN.i]=1;const a=$('#iafter');if(a)a.classList.add('show');const d=root.querySelectorAll('.idot')[IN.i];if(d)d.classList.add('ok')});
 $('#iback').onclick=()=>{IN.i=0;gotoTab('home')};
 $('#iprev').onclick=()=>{if(IN.i){IN.i--;renderIntro();window.scrollTo(0,0)}};
 $('#inext').onclick=()=>{IN.i++;renderIntro();window.scrollTo(0,0)};
}
