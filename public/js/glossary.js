/* ===== 용어 풀이 =====
   문제 설명 안의 용어를 누르면 짧게 뜻을 보여 준다. 문제의 답이 되는 내용은 넣지 않고 "그게 무엇인지"만 설명한다. */
const GLOSSARY=[
 {re:/Rigidbody2D|Rigidbody/,t:'Rigidbody',d:'오브젝트에 물리(중력, 힘, 충돌 반응)를 적용하는 컴포넌트예요. 2D용은 Rigidbody2D예요.'},
 {re:/Collider2D|Collider/,t:'Collider',d:'오브젝트의 충돌 범위를 정하는 컴포넌트예요. 박스, 원, 캡슐 같은 모양이 있어요.'},
 {re:/Trigger|트리거/,t:'Trigger',d:'Collider의 Is Trigger를 켜면 물리적으로 막지 않고 "들어왔다/나갔다"만 알려 주는 영역이 돼요.'},
 {re:/deltaTime/,t:'deltaTime',d:'직전 프레임부터 지금 프레임까지 걸린 시간(초)이에요. 프레임이 달라도 같은 속도로 움직이게 할 때 곱해요.'},
 {re:/timeScale/,t:'Time.timeScale',d:'게임 시간의 흐름 배율이에요. 1이 정상, 0이면 멈춰요.'},
 {re:/FixedUpdate/,t:'FixedUpdate',d:'물리 계산 주기(기본 0.02초)마다 호출되는 이벤트 함수예요. 프레임과는 따로 돌아요.'},
 {re:/LateUpdate/,t:'LateUpdate',d:'모든 Update가 끝난 뒤에 호출되는 이벤트 함수예요.'},
 {re:/\bAwake\b/,t:'Awake',d:'오브젝트가 만들어질 때 가장 먼저 한 번 호출되는 이벤트 함수예요.'},
 {re:/OnEnable/,t:'OnEnable',d:'오브젝트나 컴포넌트가 활성화될 때마다 호출되는 이벤트 함수예요.'},
 {re:/코루틴|Coroutine/,t:'코루틴',d:'실행을 중간에 멈췄다가 다음 프레임이나 몇 초 뒤에 이어서 하는 함수예요. IEnumerator로 만들어요.'},
 {re:/WaitForSeconds/,t:'WaitForSeconds',d:'코루틴에서 지정한 시간(초) 동안 기다리게 하는 객체예요. timeScale의 영향을 받아요.'},
 {re:/GetComponent/,t:'GetComponent',d:'같은 게임 오브젝트에 붙은 다른 컴포넌트를 찾아 돌려주는 함수예요.'},
 {re:/Raycast|레이캐스트/,t:'Raycast',d:'한 점에서 한 방향으로 보이지 않는 선을 쏴서, 무엇에 먼저 닿는지 검사하는 기능이에요.'},
 {re:/LayerMask/,t:'LayerMask',d:'어떤 레이어(분류)를 검사 대상에 포함할지 고르는 값이에요.'},
 {re:/Vector3|Vector2/,t:'Vector',d:'위치나 방향을 나타내는 숫자 묶음이에요. Vector2는 (x, y), Vector3는 (x, y, z)예요.'},
 {re:/normalized|정규화/,t:'normalized',d:'방향은 그대로 두고 길이만 1로 맞춘 벡터예요.'},
 {re:/magnitude/,t:'magnitude',d:'벡터의 길이예요. 두 점 사이 거리를 구할 때도 써요.'},
 {re:/Lerp/,t:'Lerp',d:'두 값 사이를 비율(0~1)로 섞어서 중간 값을 구하는 함수예요. 0이면 앞 값, 1이면 뒤 값이에요.'},
 {re:/MoveTowards/,t:'MoveTowards',d:'현재 값에서 목표 값 쪽으로 정해진 크기만큼만 이동한 값을 돌려줘요.'},
 {re:/Quaternion/,t:'Quaternion',d:'회전을 나타내는 값이에요. 각도를 직접 다루기보다 Quaternion.Euler 같은 함수로 만들어요.'},
 {re:/Transform/,t:'Transform',d:'모든 게임 오브젝트가 가진 위치, 회전, 크기 정보예요.'},
 {re:/Instantiate/,t:'Instantiate',d:'프리팹이나 오브젝트를 복제해서 새로 만드는 함수예요.'},
 {re:/Destroy/,t:'Destroy',d:'오브젝트나 컴포넌트를 제거하는 함수예요. 실제 제거는 현재 프레임이 끝날 때 이뤄져요.'},
 {re:/프리팹|prefab/i,t:'프리팹',d:'게임 오브젝트를 에셋으로 저장해 두고 여러 번 복제해 쓰는 설계도예요.'},
 {re:/ScriptableObject/,t:'ScriptableObject',d:'씬의 오브젝트에 붙지 않고 에셋 파일로 저장되는 데이터 컨테이너예요.'},
 {re:/Animator/,t:'Animator',d:'애니메이션 클립을 상태 머신으로 관리하고 재생하는 컴포넌트예요.'},
 {re:/ParticleSystem|파티클/,t:'ParticleSystem',d:'연기, 불꽃, 폭발 같은 작은 입자 효과를 만드는 컴포넌트예요. 여러 모듈로 나뉘어 있어요.'},
 {re:/Inspector|인스펙터/,t:'Inspector',d:'에디터에서 선택한 오브젝트의 컴포넌트와 값을 보고 고치는 창이에요.'},
 {re:/MonoBehaviour/,t:'MonoBehaviour',d:'게임 오브젝트에 붙일 수 있는 스크립트의 기본 클래스예요. Start, Update 같은 이벤트 함수를 쓸 수 있어요.'},
 {re:/CanvasGroup/,t:'CanvasGroup',d:'UI 묶음의 투명도와 클릭 가능 여부를 한꺼번에 조절하는 컴포넌트예요.'},
 {re:/SpriteRenderer/,t:'SpriteRenderer',d:'2D 이미지(스프라이트)를 화면에 그리는 컴포넌트예요.'},
 {re:/AudioSource/,t:'AudioSource',d:'소리를 재생하는 컴포넌트예요.'},
 {re:/\bGC\b|가비지 ?컬렉션|가비지/,t:'GC',d:'쓰지 않는 메모리를 자동으로 치우는 작업이에요. 할당이 많이 쌓이면 치우는 동안 게임이 잠깐 끊겨요.'},
 {re:/Profiler|프로파일러/,t:'Profiler',d:'어디에서 시간이 걸리는지 재 주는 Unity의 성능 측정 도구예요.'},
 {re:/드로우 ?콜|draw ?call/i,t:'드로우콜',d:'CPU가 GPU에 "이걸 그려라"라고 보내는 요청 한 번이에요. 많을수록 부담이 커요.'},
 {re:/MaterialPropertyBlock/,t:'MaterialPropertyBlock',d:'머티리얼을 복제하지 않고 오브젝트마다 값(색 등)만 따로 덮어쓰는 도구예요.'},
 {re:/Cinemachine/,t:'Cinemachine',d:'카메라 추적과 전환을 코드 없이 설정하게 해 주는 Unity 패키지예요.'},
 {re:/NullReferenceException|NullReference/,t:'NullReferenceException',d:'값이 비어 있는(null) 변수의 멤버를 쓰려고 할 때 나는 오류예요.'},
 {re:/enum|열거형/,t:'enum',d:'정해진 이름들 중 하나만 값으로 가질 수 있는 타입이에요. 예: Idle, Run, Jump.'},
 {re:/delegate|델리게이트/,t:'델리게이트',d:'메서드를 변수처럼 담아서 나중에 호출할 수 있게 하는 타입이에요.'},
 {re:/struct|구조체/,t:'struct',d:'값 형식의 타입이에요. 변수에 넣거나 넘길 때 값이 통째로 복사돼요. Vector3가 대표적이에요.'},
 {re:/LINQ/,t:'LINQ',d:'컬렉션을 Where, Select처럼 선언적으로 다루게 해 주는 C# 기능이에요. 편하지만 메모리를 할당할 수 있어요.'},
 {re:/Time\.unscaledDeltaTime|unscaledDeltaTime/,t:'unscaledDeltaTime',d:'timeScale의 영향을 받지 않는 프레임 간격이에요. 일시정지 중에도 흘러요.'}
];

/* text 안에서 처음 나오는 용어에만 버튼을 달아 돌려준다(HTML). seen은 같은 화면에서 이미 단 용어를 기억한다. */
function linkTerms(text,seen){
 const raw=String(text==null?'':text),hits=[];
 GLOSSARY.forEach((g,i)=>{
  if(seen.has(i))return;
  const m=g.re.exec(raw);
  if(m)hits.push({i,s:m.index,e:m.index+m[0].length});
 });
 hits.sort((a,b)=>a.s-b.s||b.e-a.e);
 let out='',pos=0;
 for(const h of hits){
  if(h.s<pos)continue;
  out+=esc(raw.slice(pos,h.s))+`<button type="button" class="term" data-g="${h.i}">${esc(raw.slice(h.s,h.e))}</button>`;
  pos=h.e;seen.add(h.i);
 }
 return out+esc(raw.slice(pos));
}

/* 용어 풀이 말풍선: 버튼을 누르면 가까이에 뜨고, 바깥을 누르거나 Esc·스크롤하면 닫힌다. 전역 리스너는 한 번만 단다. */
let tipEl=null,tipCur=null;
function closeTip(){if(tipEl)tipEl.hidden=true;tipCur=null}
function bindTerms(root){
 if(!tipEl||!document.body.contains(tipEl)){
  tipEl=document.createElement('div');tipEl.id='tip';tipEl.setAttribute('role','tooltip');tipEl.hidden=true;document.body.appendChild(tipEl);
 }
 if(!window.__tipInit){
  window.__tipInit=true;
  document.addEventListener('click',e=>{if(tipEl&&!tipEl.hidden&&!e.target.closest('.term'))closeTip()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeTip()});
  window.addEventListener('scroll',closeTip,{passive:true});
 }
 closeTip();
 root.querySelectorAll('.term').forEach(b=>{
  b.onclick=e=>{
   e.stopPropagation();
   if(tipCur===b){closeTip();return}
   const g=GLOSSARY[+b.dataset.g];
   tipEl.innerHTML=`<b>${esc(g.t)}</b><span>${esc(g.d)}</span>`;
   tipEl.hidden=false;tipCur=b;
   const r=b.getBoundingClientRect(),w=Math.min(300,window.innerWidth-24);
   tipEl.style.width=w+'px';
   const x=Math.max(12,Math.min(window.innerWidth-w-12,r.left)),y=r.bottom+8;
   tipEl.style.left=x+'px';tipEl.style.top=y+'px';
   const h=tipEl.offsetHeight;if(y+h>window.innerHeight-8)tipEl.style.top=Math.max(8,r.top-h-8)+'px';
  };
 });
}
