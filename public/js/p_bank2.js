/* ===== 문제 사전: 기초 =====
   학습 지도에는 없는 추가 문제. (분야, 단계, 레벨)마다 3문제가 한 세트. 같은 개념을 다른 상황에서 한 번 더 쓴다. */

/* ---- C# 기본 1단계 ---- */
QB({id:'x48',cat:'csharp',stage:1,level:2,title:'위아래로 오가는 엘리베이터',
 story:'엘리베이터가 y=40과 y=230 사이를 계속 오르내려야 해요. 지금은 위로만 올라가서 화면을 벗어나요. 방향을 기억하는 변수와 if문으로 양 끝에서 방향을 뒤집어 주세요.',
 goals:['10초 동안 위쪽 끝(약 230)까지 갔다가 아래쪽 끝(약 40)으로 돌아온다','40~230 범위를 벗어나지 않는다'],
 limits:['이동량은 speed × Time.deltaTime 으로 계산한다','방향은 필드 변수에 저장한다','transform.position.y 에 직접 대입하면 컴파일 에러(CS1612)예요. 지역 변수로 복사해서 수정하세요'],
 api:'transform.position(Vector3), Time.deltaTime',
 starter:C`
public float speed = 80f;

void Update()
{
    Vector3 pos = transform.position;
    pos.y += speed * Time.deltaTime;
    transform.position = pos;
    // TODO: 방향 변수를 만들고, 양 끝(40, 230)에서 뒤집어 보세요.
}`,
 solution:C`
public float speed = 80f;
public float minY = 40f;
public float maxY = 230f;
float dir = 1f;

void Update()
{
    Vector3 pos = transform.position;
    pos.y += speed * dir * Time.deltaTime;
    if (pos.y >= maxY) { pos.y = maxY; dir = -1f; }
    else if (pos.y <= minY) { pos.y = minY; dir = 1f; }
    transform.position = pos;
}`,
 world:{start:{x:240,y:40}},runs:[{fps:60,seconds:10}],show:10,
 rules:[has('Time.deltaTime 사용',/Time\.deltaTime/,'프레임 시간을 곱해 이동해요.','이동량에 Time.deltaTime을 곱하세요.'),
  has('방향 변수',/\b(?:float|int)\s+\w*[dD]ir\w*\s*=/,'방향을 변수에 저장했어요.','방향을 기억할 변수(예: float dir = 1f;)를 클래스 필드로 만드세요.')],
 check:rs=>{const f=rs[0].frames.map(a=>a[2]);const mx=Math.max(...f),mn=Math.min(...f);const im=f.indexOf(mx);const after=Math.min(...f.slice(im));
  return {items:[
   it(mx>=225,'위쪽 끝 도달',`y 최대값이 ${mx.toFixed(0)}로 위쪽 끝(230)까지 갔어요.`,`y 최대값이 ${mx.toFixed(0)}예요. 위쪽 끝(약 230)까지 가지 못했어요.`),
   it(after<=50,'아래쪽으로 복귀',`위쪽 끝에서 방향을 바꿔 y=${after.toFixed(0)}까지 내려왔어요.`,'위쪽 끝에서 돌아오지 않았어요. 끝에 닿으면 방향 값을 -1로 바꿔야 해요.'),
   it(mn>=35&&mx<=235,'범위 유지',`y가 ${mn.toFixed(0)}~${mx.toFixed(0)} 범위 안에 있어요.`,`y가 ${mn.toFixed(0)}~${mx.toFixed(0)} 로 범위를 벗어났어요. 끝에 닿았을 때 위치도 경계값으로 되돌리세요.`)]}},
 hints:['지금 코드는 항상 +방향으로만 더합니다. 이동량에 곱할 "방향" 값이 필요해요 (위 1, 아래 -1).','방향 값은 Update 밖(클래스 필드)에 두어야 프레임이 지나도 기억돼요.','pos.y가 끝 값 이상/이하가 되면 방향의 부호를 뒤집고 pos.y를 경계값으로 되돌려 주세요.'],
 why:'움직임의 "상태"(지금 어느 쪽으로 가는가)는 변수에 저장하고 조건문으로 바꿔요. 축이 x에서 y로 바뀌어도 같은 구조예요.',
 concepts:[['상태 변수와 조건문','방향 같은 상태를 변수에 저장하고 if로 조건에 따라 값을 바꾼다.']]});

QB({id:'x49',cat:'csharp',stage:1,level:2,title:'끝에서 잠깐 멈췄다 돌아오는 순찰병',
 story:'순찰병이 x=100과 x=380 사이를 왕복해요. 그런데 끝에 닿자마자 휙 돌아서 부자연스러워요. 양 끝에 닿으면 1초 동안 멈췄다가 방향을 바꾸도록 만들어 주세요. 멈춰 있는 시간은 Time.deltaTime으로 줄여 가며 재요.',
 goals:['x=100~380 사이를 왕복한다','끝에 닿으면 약 1초 동안 멈춘 뒤 반대 방향으로 간다','범위를 벗어나지 않는다'],
 limits:['이동량은 speed × Time.deltaTime 으로 계산한다','방향과 남은 대기 시간은 필드 변수에 저장한다','멈춰 있는 동안에는 위치를 바꾸지 않는다'],
 api:'transform.position(Vector3), Time.deltaTime',
 starter:C`
public float speed = 120f;
public float waitTime = 1f;

void Update()
{
    Vector3 pos = transform.position;
    pos.x += speed * Time.deltaTime;
    transform.position = pos;
    // TODO: 방향·대기 변수를 만들고, 끝에서 1초 멈췄다가 돌아오게 해 보세요.
}`,
 solution:C`
public float speed = 120f;
public float waitTime = 1f;
public float minX = 100f;
public float maxX = 380f;
float dir = 1f;
float timer = 0f;

void Update()
{
    if (timer > 0f)
    {
        timer -= Time.deltaTime;
        return;
    }
    Vector3 pos = transform.position;
    pos.x += speed * dir * Time.deltaTime;
    if (pos.x >= maxX) { pos.x = maxX; dir = -1f; timer = waitTime; }
    else if (pos.x <= minX) { pos.x = minX; dir = 1f; timer = waitTime; }
    transform.position = pos;
}`,
 world:{start:{x:100,y:135}},runs:[{fps:60,seconds:12}],show:12,
 rules:[has('Time.deltaTime 사용',/Time\.deltaTime/,'프레임 시간을 곱하고 대기 시간도 줄여요.','이동량과 대기 시간 모두 Time.deltaTime을 써서 계산하세요.'),
  has('방향 변수',/\b(?:float|int)\s+\w*[dD]ir\w*\s*=/,'방향을 변수에 저장했어요.','방향을 기억할 변수(예: float dir = 1f;)를 클래스 필드로 만드세요.')],
 check:rs=>{const f=rs[0].frames.map(a=>a[1]);const mx=Math.max(...f),mn=Math.min(...f);
  let still=0,best=0;for(let i=1;i<f.length;i++){if(Math.abs(f[i]-f[i-1])<1e-6&&f[i]>370){still++;best=Math.max(best,still)}else still=0}
  const im=f.indexOf(mx);const after=Math.min(...f.slice(im));
  return {items:[
   it(mx>=375,'오른쪽 끝 도달',`x 최대값이 ${mx.toFixed(0)}로 오른쪽 끝까지 갔어요.`,`x 최대값이 ${mx.toFixed(0)}예요. 오른쪽 끝(약 380)까지 가야 해요.`),
   it(best>=45&&best<=90,'끝에서 약 1초 멈춤',`오른쪽 끝에서 ${best}프레임(약 ${(best/60).toFixed(1)}초) 멈췄어요.`,`오른쪽 끝에서 ${best}프레임 멈췄어요. 약 60프레임(1초) 멈춘 뒤 돌아와야 해요.`),
   it(after<=110,'왼쪽으로 복귀',`방향을 바꿔 x=${after.toFixed(0)}까지 돌아왔어요.`,'끝에서 돌아오지 않았어요. 끝에 닿으면 방향을 뒤집으세요.'),
   it(mn>=95&&mx<=385,'범위 유지',`x가 ${mn.toFixed(0)}~${mx.toFixed(0)} 범위 안에 있어요.`,`x가 ${mn.toFixed(0)}~${mx.toFixed(0)}로 범위를 벗어났어요.`)]}},
 hints:['방향 변수와, 남은 대기 시간을 담을 변수(timer)가 필요해요.','끝에 닿으면 timer를 waitTime으로 채워요.','Update 맨 위에서 timer가 0보다 크면 timer -= Time.deltaTime; 하고 return; 해서 움직이지 않게 해요.'],
 why:'"기다리기"는 남은 시간을 변수에 담고 프레임마다 Time.deltaTime만큼 줄이는 방식으로 만들어요. 상태(방향)에 상태(대기 중)를 하나 더 얹는 가장 기본적인 패턴이에요.',
 concepts:[['타이머 변수','남은 시간을 필드에 두고 Update에서 Time.deltaTime만큼 줄여 가며 시간을 잰다.']]});

QB({id:'x50',cat:'csharp',stage:1,level:2,title:'화면 끝으로 나가면 반대편에서 나타나기',
 story:'우주선이 오른쪽으로 계속 날아가요. 오른쪽 끝(x=420)을 넘으면 사라지지 말고 왼쪽 끝(x=60)에서 다시 나타나게 해 주세요. 이런 처리를 "화면 감싸기(wrap)"라고 해요.',
 goals:['오른쪽으로 계속 이동한다','x가 420을 넘으면 60으로 돌아간다','x는 60~420 범위를 벗어나지 않는다'],
 limits:['이동량은 speed × Time.deltaTime 으로 계산한다','transform.position.x 에 직접 대입하면 컴파일 에러(CS1612)예요. 지역 변수로 복사해서 수정하세요'],
 api:'transform.position(Vector3), Time.deltaTime',
 starter:C`
public float speed = 150f;

void Update()
{
    Vector3 pos = transform.position;
    pos.x += speed * Time.deltaTime;
    transform.position = pos;
    // TODO: 오른쪽 끝을 넘으면 왼쪽 끝으로 돌려 보내세요.
}`,
 solution:C`
public float speed = 150f;
public float minX = 60f;
public float maxX = 420f;

void Update()
{
    Vector3 pos = transform.position;
    pos.x += speed * Time.deltaTime;
    if (pos.x > maxX)
    {
        pos.x = minX;
    }
    transform.position = pos;
}`,
 world:{start:{x:60,y:135}},runs:[{fps:60,seconds:10}],show:10,
 rules:[has('Time.deltaTime 사용',/Time\.deltaTime/,'프레임 시간을 곱해 이동해요.','이동량에 Time.deltaTime을 곱하세요.')],
 check:rs=>{const f=rs[0].frames.map(a=>a[1]);const mx=Math.max(...f),mn=Math.min(...f);
  let wraps=0;for(let i=1;i<f.length;i++)if(f[i]<f[i-1]-100)wraps++;
  return {items:[
   it(mx>=400,'오른쪽 끝까지 이동',`x 최대값이 ${mx.toFixed(0)}예요.`,`x 최대값이 ${mx.toFixed(0)}예요. 오른쪽 끝(420) 근처까지 가야 해요.`),
   it(wraps>=2,'반대편에서 다시 나타남',`끝을 넘은 뒤 왼쪽에서 다시 나타나는 일이 ${wraps}번 있었어요.`,`끝을 넘은 뒤 왼쪽으로 돌아온 적이 ${wraps}번이에요. 420을 넘으면 x를 60으로 바꿔 주세요.`),
   it(mn>=55&&mx<=425,'범위 유지',`x가 ${mn.toFixed(0)}~${mx.toFixed(0)} 범위 안에 있어요.`,`x가 ${mn.toFixed(0)}~${mx.toFixed(0)}로 범위를 벗어났어요.`)]}},
 hints:['오른쪽 끝을 넘었는지 if (pos.x > maxX) 로 확인해요.','넘었다면 pos.x를 왼쪽 끝 값으로 바꿔요.','바꾼 pos를 transform.position에 다시 넣는 것을 잊지 마세요.'],
 why:'범위를 넘었을 때의 처리는 "되돌리기(왕복)"와 "반대편으로 보내기(감싸기)" 두 가지가 대표적이에요. 어떤 규칙인지에 따라 if 안의 한 줄만 달라져요.',
 concepts:[['화면 감싸기','경계를 넘으면 반대편 경계로 위치를 옮겨 다시 나타나게 하는 처리.']]});

/* ---- C# 기본 2단계 ---- */
/* ---- 컴포넌트 1단계 ---- */
QB({id:'x63',cat:'components',stage:1,level:1,title:'방어막이 있을 수도, 없을 수도 있는 적',
 story:'일부 적에게만 Shield 컴포넌트가 붙어 있어요. 방어막이 있으면 피해에서 block만큼 줄여서 받고, 없으면 피해를 그대로 받아야 해요. 지금 코드는 방어막이 없는 적이 피해를 입으면 NullReferenceException이 나요. 있을 수도 없을 수도 있는 컴포넌트는 TryGetComponent로 가져오고 null을 확인하세요.',
 goals:['Awake에서 TryGetComponent로 Shield를 가져와 shield에 저장한다 (없으면 null)','TakeDamage(dmg): 방어막이 있으면 dmg에서 block을 뺀 값(최소 0)만큼, 없으면 dmg 그대로 hp를 줄인다'],
 limits:['TakeDamage 안에서 GetComponent를 호출하지 않는다','방어막이 없는 오브젝트에서도 에러가 나면 안 된다'],
 api:'TryGetComponent<T>(out T), != null',
 starter:C`
using UnityEngine;

public class Mob : MonoBehaviour
{
    public int hp = 10;
    private Shield shield;

    void Awake()
    {
        shield = GetComponent<Shield>();
    }

    public void TakeDamage(int dmg)
    {
        dmg -= shield.block;
        if (dmg < 0) dmg = 0;
        hp -= dmg;
    }
}

public class Shield : MonoBehaviour
{
    public int block = 3;
}`,
 solution:C`
using UnityEngine;

public class Mob : MonoBehaviour
{
    public int hp = 10;
    private Shield shield;

    void Awake()
    {
        TryGetComponent<Shield>(out shield);
    }

    public void TakeDamage(int dmg)
    {
        if (shield != null)
        {
            dmg -= shield.block;
            if (dmg < 0) dmg = 0;
        }
        hp -= dmg;
    }
}

public class Shield : MonoBehaviour
{
    public int block = 3;
}`,
 rules:[
  inFn('Awake에서 TryGetComponent','Awake',/TryGetComponent\s*(?:<\s*Shield\s*>)?\s*\(\s*out\s+shield\b/,'Awake에서 TryGetComponent로 Shield를 찾아요.','Awake에서 TryGetComponent<Shield>(out shield); 로 가져오세요.'),
  notIn('TakeDamage에서 GetComponent 금지','TakeDamage',/GetComponent/,'TakeDamage에서 컴포넌트를 다시 찾지 않아요.','Awake에서 한 번만 가져오세요.'),
  inFn('null 확인','TakeDamage',/shield\s*!=\s*null|shield\s*==\s*null|!\s*shield\b|shield\s+is\s+(?:not\s+)?null/,'방어막이 없는 경우를 확인해요.','shield가 null일 수 있어요. 사용하기 전에 확인하세요.')
 ],
 test:(api,ok)=>{
  api.env.components.Shield={block:3};
  let e1=null;try{api.call('Awake');api.call('TakeDamage',5)}catch(e){e1=e}
  ok('방어막 있음',!e1&&api.get('hp')===8,'방어막이 있으면 5 − 3 = 2만 받아요 (hp 8).',e1?'방어막이 있는데도 에러가 나요.':`hp가 ${api.get('hp')} 입니다. 방어막이 3을 막아 2만 받으니 8이어야 해요.`);
  api.call('TakeDamage',1);
  ok('피해가 방어막보다 작음',api.get('hp')===8,'방어막보다 작은 피해는 0이에요.',`hp가 ${api.get('hp')} 입니다. 피해가 0보다 작아지지 않게 하세요.`);
  delete api.env.components.Shield;api.set('hp',10);
  let e2=null;try{api.call('Awake');api.call('TakeDamage',5)}catch(e){e2=e}
  ok('방어막 없음',!e2&&api.get('hp')===5,'방어막이 없으면 5를 그대로 받아요 (hp 5).',e2?'방어막이 없을 때 NullReferenceException이 나요. null 확인이 필요해요.':`hp가 ${api.get('hp')} 입니다. 방어막이 없으면 5를 그대로 받아 5여야 해요.`);
 },
 hints:['방어막이 없는 적에서 shield는 null이에요. 그 상태로 shield.block을 읽으면 에러가 나요.','TryGetComponent(out shield)는 컴포넌트가 있으면 true를 돌려주고, 없으면 shield를 null로 둬요.','TakeDamage에서는 if (shield != null)일 때만 block을 계산에 넣으세요.'],
 why:'"있을 수도 없을 수도 있는" 컴포넌트는 Awake에서 TryGetComponent로 한 번 가져오고, 쓸 때마다 null을 확인하는 것이 안전해요. 필수 컴포넌트는 GetComponent로, 선택 컴포넌트는 TryGetComponent로 구분해 쓰면 의도가 코드에 드러납니다.',
 concepts:[['TryGetComponent','컴포넌트가 있으면 true와 함께 값을 돌려주고 없으면 false. 선택적 컴포넌트에 적합하다.'],['null 확인','없을 수 있는 참조는 사용 전에 != null 로 확인한다.']]});

QB({id:'x64',cat:'components',stage:1,level:1,title:'자식 오브젝트의 Animator를 매 프레임 찾는 중',
 story:'캐릭터의 Animator는 루트가 아니라 자식 오브젝트(Visual)에 붙어 있어서 GetComponentInChildren으로 찾아야 해요. 지금은 Update에서 매 프레임 자식 계층을 뒤져 Animator를 찾고 있어요. 한 번만 찾아 두고 쓰도록 바꿔 주세요.',
 goals:['Animator를 담을 필드(anim)를 만든다','Awake에서 GetComponentInChildren으로 한 번만 가져온다','Update에서는 방향키 입력이 있으면 "Run"을 true, 없으면 false로 anim에 설정한다'],
 limits:['Update 안에서 GetComponent 계열을 호출하지 않는다','Update 안에서 Animator 지역 변수를 새로 만들지 않는다'],
 api:'GetComponentInChildren<T>(), Input.GetAxisRaw, anim.SetBool',
 starter:C`
using UnityEngine;

public class Hero : MonoBehaviour
{
    void Update()
    {
        // 매 프레임 자식 계층을 뒤져서 찾고 있어요
        Animator anim = GetComponentInChildren<Animator>();
        bool run = Mathf.Abs(Input.GetAxisRaw("Horizontal")) > 0.1f;
        anim.SetBool("Run", run);
    }
}`,
 solution:C`
using UnityEngine;

public class Hero : MonoBehaviour
{
    private Animator anim;

    void Awake()
    {
        anim = GetComponentInChildren<Animator>();
    }

    void Update()
    {
        bool run = Mathf.Abs(Input.GetAxisRaw("Horizontal")) > 0.1f;
        anim.SetBool("Run", run);
    }
}`,
 rules:[
  has('anim 필드',/\bAnimator\s+anim\s*;/,'Animator를 담을 anim 필드가 있어요.','private Animator anim; 필드를 클래스에 선언하세요.'),
  inFn('Awake에서 캐싱','Awake',/\banim\s*=\s*GetComponentInChildren\s*<\s*Animator\s*>\s*\(/,'Awake에서 자식 Animator를 한 번만 가져와요.','Awake에서 anim = GetComponentInChildren<Animator>(); 로 저장하세요.'),
  notIn('Update에서 GetComponent 금지','Update',/\bGetComponent\w*\b/,'Update에서 컴포넌트를 찾지 않아요.','Update에서는 필드 anim을 쓰세요.'),
  notIn('Update에서 지역 변수 금지','Update',/\bAnimator\s+\w+\s*=/,'Update에서 새 지역 변수를 만들지 않아요.','Update 안의 Animator anim = ... 은 필드를 가려요. 지우세요.')
 ],
 test:(api,ok)=>{
  const anim=api.mk.anim();api.env.components.Animator=anim;
  api.call('Awake');
  api.env.getCalls=0;
  let axis=1;api.env.Input.GetAxisRaw=()=>axis;
  for(let i=0;i<10;i++)api.call('Update');
  const n=api.env.getCalls;
  ok('찾는 횟수',n===0,'Update 10번 동안 컴포넌트를 한 번도 찾지 않았어요.',`Update 10번 동안 ${n}번 찾았어요. Awake에서 한 번만 찾으세요.`);
  const val=()=>{const l=anim.log.filter(x=>x[0]==='SetBool'&&x[1]==='Run');return l.length?l[l.length-1][2]:undefined};
  ok('입력 있음',val()===true,'입력이 있으면 Run이 true예요.','입력이 있는 동안 SetBool("Run", true)가 불려야 해요.');
  axis=0;api.call('Update');
  ok('입력 없음',val()===false,'입력이 없으면 Run이 false예요.','입력이 없으면 SetBool("Run", false)가 불려야 해요.');
 },
 hints:['Animator가 루트에 없으면 GetComponent로는 못 찾고, 자식까지 뒤지는 GetComponentInChildren을 써야 해요. 이 검색은 더 비싸요.','결과를 담을 필드를 만들고 Awake에서 한 번만 채우세요.','Update에서는 필드 anim을 그대로 쓰세요.'],
 why:'자식 계층까지 뒤지는 GetComponentInChildren은 GetComponent보다 비용이 커서 캐싱의 이득이 더 커요. 어디에 붙어 있는지에 따라 검색 함수가 달라진다는 점을 기억하세요.',
 concepts:[['GetComponentInChildren','자기 자신과 자식 오브젝트에서 컴포넌트를 찾는다. 계층을 순회하므로 반복 호출을 피한다.'],['컴포넌트 캐싱','한 번 찾은 컴포넌트를 필드에 저장해 재사용한다.']]});

QB({id:'x65',cat:'components',stage:1,level:1,title:'씬의 점수판을 매 프레임 찾고 있다',
 story:'생존 시간을 점수판(ScoreBoard)에 더하는 스크립트예요. 그런데 Update에서 매 프레임 FindObjectOfType으로 씬 전체를 뒤져 점수판을 찾고 있어요. 씬 전체 검색은 특히 비싼 작업이에요. 다른 오브젝트인 점수판은 Start에서 한 번만 찾아 두세요.',
 goals:['ScoreBoard를 담을 필드(board)를 만든다','Start에서 FindObjectOfType으로 한 번만 가져온다','Update에서는 board.seconds에 Time.deltaTime을 더한다'],
 limits:['Update 안에서 Find 계열을 호출하지 않는다','Awake가 아니라 Start에서 가져온다 (다른 오브젝트이므로)'],
 api:'FindObjectOfType<T>(), Time.deltaTime',
 starter:C`
using UnityEngine;

public class SurvivalTimer : MonoBehaviour
{
    void Update()
    {
        // 매 프레임 씬 전체를 뒤지고 있어요
        ScoreBoard board = FindObjectOfType<ScoreBoard>();
        board.seconds += Time.deltaTime;
    }
}

public class ScoreBoard : MonoBehaviour
{
    public float seconds;
}`,
 solution:C`
using UnityEngine;

public class SurvivalTimer : MonoBehaviour
{
    private ScoreBoard board;

    void Start()
    {
        board = FindObjectOfType<ScoreBoard>();
    }

    void Update()
    {
        board.seconds += Time.deltaTime;
    }
}

public class ScoreBoard : MonoBehaviour
{
    public float seconds;
}`,
 rules:[
  has('board 필드',/\bScoreBoard\s+board\s*;/,'ScoreBoard를 담을 board 필드가 있어요.','private ScoreBoard board; 필드를 SurvivalTimer에 선언하세요.'),
  inFn('Start에서 캐싱','Start',/\bboard\s*=\s*FindObjectOfType\s*<\s*ScoreBoard\s*>\s*\(/,'Start에서 점수판을 한 번만 찾아요.','Start에서 board = FindObjectOfType<ScoreBoard>(); 로 저장하세요.'),
  notIn('Update에서 Find 금지','Update',/\bFind\w*\s*[<(]/,'Update에서 씬을 뒤지지 않아요.','Update에서는 필드 board를 쓰세요.'),
  notIn('Update에서 지역 변수 금지','Update',/\bScoreBoard\s+\w+\s*=/,'Update에서 새 지역 변수를 만들지 않아요.','Update 안의 ScoreBoard board = ... 는 필드를 가려요. 지우세요.')
 ],
 test:(api,ok)=>{
  const sb={seconds:0};let reads=0;
  Object.defineProperty(api.env.components,'ScoreBoard',{get(){reads++;return sb},configurable:true,enumerable:true});
  api.env.Time.deltaTime=0.5;
  let err=null;
  try{api.call('Start');for(let i=0;i<10;i++)api.call('Update')}catch(e){err=e}
  ok('에러 없이 실행',!err,'에러 없이 실행돼요.','board가 비어 있어서 에러가 나요. Start에서 board에 저장하세요.');
  ok('검색 횟수',!err&&reads<=1,'점수판을 한 번만 찾았어요.',`10프레임 동안 ${reads}번 찾았어요. Start에서 한 번만 찾으세요.`);
  ok('시간 누적',!err&&Math.abs(sb.seconds-5)<1e-6,'10프레임 × 0.5초 = 5초가 쌓였어요.',`seconds가 ${sb.seconds} 입니다. 5여야 해요.`);
 },
 hints:['FindObjectOfType은 씬의 모든 오브젝트를 뒤져요. 컴포넌트 캐싱 중에서도 가장 비싼 편이에요.','결과를 담을 필드를 만들고, 한 번만 실행되는 메서드에서 채우세요.','점수판은 다른 오브젝트라서 Awake보다 Start가 안전해요.'],
 why:'씬 전체를 검색하는 Find 계열은 매 프레임 쓰면 성능이 크게 떨어져요. 한 번 찾아 필드에 저장하고, 다른 오브젝트에 접근하는 일이니 Start에서 하는 것이 정석입니다.',
 concepts:[['FindObjectOfType','씬 전체에서 해당 타입의 오브젝트를 찾는다. 비용이 크므로 반복 호출하지 않고 캐싱한다.'],['Awake와 Start의 차이','다른 오브젝트에 접근하는 초기화는 Start에서 한다.']]});

QB({id:'x66',cat:'components',stage:1,level:2,title:'부딪힌 상대가 아이템이 아닐 수도 있다',
 story:'플레이어가 트리거에 닿을 때마다 상대의 Pickup 컴포넌트를 꺼내 코인을 모아요. 그런데 벽이나 적처럼 Pickup이 없는 오브젝트에 닿으면 NullReferenceException이 나요. 상대는 매번 달라서 캐싱할 수 없으니, 꺼낼 때마다 있는지 확인해야 해요.',
 goals:['OnTriggerEnter2D에서 상대(other)의 Pickup을 가져온다','Pickup이 있으면 coins에 value를 더하고 Collect()를 호출한다','Pickup이 없는 오브젝트와 닿아도 에러 없이 무시한다'],
 limits:['상대의 컴포넌트는 Awake에서 캐싱할 수 없다 (닿을 때마다 달라진다)'],
 api:'other.TryGetComponent<T>(out T), other.GetComponent<T>()',
 starter:C`
using UnityEngine;

public class Collector : MonoBehaviour
{
    public int coins;

    void OnTriggerEnter2D(Collider2D other)
    {
        Pickup p = other.GetComponent<Pickup>();
        coins += p.value;
        p.Collect();
    }
}

public class Pickup : MonoBehaviour
{
    public int value = 1;
    public void Collect() { Destroy(gameObject); }
}`,
 solution:C`
using UnityEngine;

public class Collector : MonoBehaviour
{
    public int coins;

    void OnTriggerEnter2D(Collider2D other)
    {
        Pickup p = other.GetComponent<Pickup>();
        if (p == null) return;
        coins += p.value;
        p.Collect();
    }
}

public class Pickup : MonoBehaviour
{
    public int value = 1;
    public void Collect() { Destroy(gameObject); }
}`,
 rules:[
  inFn('상대에서 Pickup 가져오기','OnTriggerEnter2D',/other\s*\.\s*(?:GetComponent|TryGetComponent)\s*<\s*Pickup\s*>/,'닿은 상대에서 Pickup을 꺼내요.','other.GetComponent<Pickup>() 또는 other.TryGetComponent<Pickup>(…) 으로 꺼내세요.'),
  inFn('null 확인','OnTriggerEnter2D',/\bp\s*==\s*null|\bp\s*!=\s*null|!\s*p\b|TryGetComponent|\bp\s+is\s+(?:not\s+)?null/,'Pickup이 없는 경우를 확인해요.','Pickup이 없으면 건너뛰도록 null을 확인하세요.')
 ],
 test:(api,ok)=>{
  let collected=0;
  const item=api.mk.go('Coin',{Pickup:{value:5,Collect(){collected++}}});
  let e1=null;try{api.call('OnTriggerEnter2D',item)}catch(e){e1=e}
  ok('아이템 줍기',!e1&&api.get('coins')===5&&collected===1,'아이템에 닿으면 5코인을 얻고 Collect가 불려요.',e1?'아이템에 닿았는데 에러가 나요.':`coins=${api.get('coins')}, Collect ${collected}번. coins 5, Collect 1번이어야 해요.`);
  const wall=api.mk.go('Wall',{});
  let e2=null;try{api.call('OnTriggerEnter2D',wall)}catch(e){e2=e}
  ok('벽은 무시',!e2&&api.get('coins')===5,'Pickup이 없는 벽과 닿아도 에러 없이 무시해요.','Pickup이 없는 오브젝트에서 에러가 나요. null이면 return하세요.');
 },
 hints:['Pickup이 없는 오브젝트에서 GetComponent<Pickup>()은 null을 돌려줘요.','null인 p의 value를 읽으면 NullReferenceException이에요.','p가 null이면 바로 return해서 무시하세요.'],
 why:'충돌 상대처럼 매번 달라지는 대상의 컴포넌트는 캐싱할 수 없어요. 대신 "있을 수도 없을 수도 있다"는 전제로 null 확인을 해야 합니다. 캐싱할 수 있는 것(자기 컴포넌트)과 없는 것(상대 컴포넌트)을 구분하는 것이 중요해요.',
 concepts:[['충돌 상대의 컴포넌트','상대는 매번 달라 캐싱할 수 없으므로 닿을 때마다 가져오고 null을 확인한다.'],['TryGetComponent','컴포넌트가 있으면 true와 함께 값을 돌려주고 없으면 false.']]});

QB({id:'x67',cat:'components',stage:1,level:2,title:'효과음 스크립트에 AudioSource 보장하기',
 story:'SoundPlayer는 AudioSource가 있어야 소리를 낼 수 있어요. 그런데 AudioSource 없이 붙였다가 NullReferenceException이 났어요. AudioSource가 없으면 Unity가 자동으로 붙여 주게 하고, 같은 오브젝트에 SoundPlayer를 두 번 붙이는 것도 막아 주세요.',
 goals:['SoundPlayer를 붙이면 AudioSource가 자동으로 함께 붙게 한다','같은 오브젝트에 SoundPlayer를 두 번 붙일 수 없게 한다'],
 limits:['코드에서 AddComponent로 직접 붙이지 않는다 — 특성(Attribute)으로 해결한다'],
 starter:C`
using UnityEngine;

// TODO: 필요한 컴포넌트를 보장하고, 중복 부착을 막는 특성을 붙이세요
public class SoundPlayer : MonoBehaviour
{
    private AudioSource audioSrc;

    void Awake()
    {
        audioSrc = GetComponent<AudioSource>();
    }
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(AudioSource))]
[DisallowMultipleComponent]
public class SoundPlayer : MonoBehaviour
{
    private AudioSource audioSrc;

    void Awake()
    {
        audioSrc = GetComponent<AudioSource>();
    }
}`,
 rules:[
  fx('AudioSource 요구',c=>/\[RequireComponent\([^\]]*typeof\(\s*AudioSource\s*\)/.test(c),'AudioSource를 요구해요.','[RequireComponent(typeof(AudioSource))] 를 클래스 위에 붙이세요.'),
  has('중복 부착 방지',/\[DisallowMultipleComponent\]/,'같은 오브젝트에 두 번 붙일 수 없어요.','[DisallowMultipleComponent] 특성을 붙이면 같은 컴포넌트를 두 번 붙일 수 없어요.'),
  fx('특성이 클래스 바로 위',c=>/\]\s*(?:public\s+)?class\s+SoundPlayer/.test(c),'특성이 SoundPlayer 클래스에 붙어 있어요.','특성은 class 선언 바로 위에 적어야 그 클래스에 적용돼요.'),
  no('AddComponent 금지',/\bAddComponent\b/,'AddComponent 없이 특성으로 해결했어요.','이번에는 AddComponent 대신 특성(Attribute)으로 해결해 보세요.')
 ],
 hints:['"이 스크립트는 이 컴포넌트가 꼭 필요해"라고 선언하는 특성이 있어요.','typeof(AudioSource)를 인자로 넘겨요.','중복 부착을 막는 특성은 DisallowMultipleComponent 예요.'],
 why:'컴포넌트 의존성은 코드로 "선언"해 두는 편이 안전해요. 문서에 "AudioSource 필요"라고 적는 것보다, 특성이 자동으로 붙이고 지우지 못하게 막아 주는 쪽이 실수를 확실히 줄여요.',
 concepts:[['의존성 선언','스크립트가 필요한 컴포넌트를 특성으로 알려 자동 부착과 삭제 방지를 얻는다.']]});

QB({id:'x68',cat:'components',stage:1,level:2,title:'오브젝트의 모든 콜라이더를 한꺼번에 끄기',
 story:'유령 상태가 되면 이 오브젝트의 모든 Collider2D를 꺼야 해요. 발판 오브젝트에는 콜라이더가 여러 개 붙어 있는데, GetComponent는 첫 번째 하나만 돌려줘서 나머지는 계속 충돌해요. 같은 타입의 컴포넌트가 여러 개일 때는 GetComponents로 전부 가져와 반복하세요.',
 goals:['Ghost(): 이 오브젝트의 모든 Collider2D의 enabled를 false로 만든다','Solid(): 모든 Collider2D의 enabled를 true로 되돌린다'],
 limits:['GetComponent(단수)는 쓰지 않는다','Ghost와 Solid는 같은 방식으로 컴포넌트 목록을 가져온다'],
 api:'GetComponents<T>(), foreach, collider.enabled',
 starter:C`
using UnityEngine;

public class Platform : MonoBehaviour
{
    public void Ghost()
    {
        Collider2D col = GetComponent<Collider2D>();
        col.enabled = false;
    }

    public void Solid()
    {
        Collider2D col = GetComponent<Collider2D>();
        col.enabled = true;
    }
}`,
 solution:C`
using UnityEngine;

public class Platform : MonoBehaviour
{
    public void Ghost()
    {
        foreach (Collider2D col in GetComponents<Collider2D>())
        {
            col.enabled = false;
        }
    }

    public void Solid()
    {
        foreach (Collider2D col in GetComponents<Collider2D>())
        {
            col.enabled = true;
        }
    }
}`,
 rules:[
  inFn('Ghost에서 GetComponents','Ghost',/GetComponents\s*<\s*Collider2D\s*>\s*\(/,'Ghost에서 모든 콜라이더를 가져와요.','Ghost에서 GetComponents<Collider2D>() 로 전부 가져오세요.'),
  inFn('Solid에서 GetComponents','Solid',/GetComponents\s*<\s*Collider2D\s*>\s*\(/,'Solid에서도 모든 콜라이더를 가져와요.','Solid에서도 GetComponents<Collider2D>() 를 쓰세요.'),
  no('단수 GetComponent 금지',/\bGetComponent\s*<\s*Collider2D\s*>/,'단수 GetComponent를 쓰지 않아요.','GetComponent는 첫 번째 하나만 돌려줘요. GetComponents를 쓰세요.')
 ],
 test:(api,ok)=>{
  const c={enabled:true};api.env.components.Collider2D=c;
  let err=null;try{api.call('Ghost')}catch(e){err=e}
  ok('Ghost',!err&&c.enabled===false,'Ghost가 콜라이더를 껐어요.',err?'Ghost에서 에러가 나요.':'Ghost 뒤에 콜라이더의 enabled가 false여야 해요.');
  err=null;try{api.call('Solid')}catch(e){err=e}
  ok('Solid',!err&&c.enabled===true,'Solid가 콜라이더를 다시 켰어요.',err?'Solid에서 에러가 나요.':'Solid 뒤에 콜라이더의 enabled가 true여야 해요.');
 },
 hints:['같은 타입 컴포넌트가 여러 개면 GetComponent는 그중 하나만 돌려줘요.','GetComponents(복수형)는 배열을 돌려줘요.','foreach로 배열의 각 콜라이더를 순회하며 enabled를 바꾸세요.'],
 why:'콜라이더, 오디오 소스처럼 한 오브젝트에 여러 개 붙을 수 있는 컴포넌트는 GetComponents로 전부 가져와 순회해야 해요. 단수형 GetComponent는 첫 번째 하나만 다루므로 나머지가 빠집니다.',
 concepts:[['GetComponents','같은 타입의 컴포넌트를 모두 배열로 가져온다. 단수형은 첫 번째 하나만 돌려준다.'],['foreach 순회','배열의 각 원소에 같은 작업을 적용한다.']]});

QB({id:'x69',cat:'components',stage:1,level:3,title:'체력이 0이 되면 이동 컴포넌트만 멈추기',
 story:'Health와 Mover는 서로 독립된 컴포넌트예요. Health가 0이 되면 같은 오브젝트의 Mover를 멈춰야 해요(Mover.enabled = false). 그런데 포탑처럼 Mover가 없는 오브젝트도 있어요. Health는 Mover가 있다는 가정 없이, 있을 때만 멈추게 만들어 주세요.',
 goals:['Awake에서 같은 오브젝트의 Mover를 가져와 mover에 저장한다 (없으면 null)','hp가 0 이하가 되는 순간 mover가 있으면 mover.enabled를 false로 만든다','Mover가 없는 오브젝트에서도 에러가 나지 않는다'],
 limits:['Health는 Mover를 상속하지 않는다 (서로 독립된 컴포넌트)','TakeDamage 안에서 GetComponent를 호출하지 않는다'],
 api:'TryGetComponent<T>(out T), GetComponent<T>(), behaviour.enabled',
 starter:C`
using UnityEngine;

public class Health : MonoBehaviour
{
    public int hp = 3;
    private Mover mover;

    void Awake()
    {
    }

    public void TakeDamage(int dmg)
    {
        hp -= dmg;
        if (hp <= 0)
        {
            Debug.Log("죽음");
        }
    }
}

public class Mover : MonoBehaviour
{
    public float speed = 3f;
}`,
 solution:C`
using UnityEngine;

public class Health : MonoBehaviour
{
    public int hp = 3;
    private Mover mover;

    void Awake()
    {
        TryGetComponent<Mover>(out mover);
    }

    public void TakeDamage(int dmg)
    {
        hp -= dmg;
        if (hp <= 0 && mover != null)
        {
            mover.enabled = false;
        }
    }
}

public class Mover : MonoBehaviour
{
    public float speed = 3f;
}`,
 rules:[
  inFn('Awake에서 Mover 가져오기','Awake',/\bmover\s*=\s*GetComponent\s*<\s*Mover\s*>\s*\(|TryGetComponent\s*(?:<\s*Mover\s*>)?\s*\(\s*out\s+mover\b/,'Awake에서 Mover를 가져와요.','Awake에서 TryGetComponent<Mover>(out mover); 로 가져오세요.'),
  notIn('TakeDamage에서 GetComponent 금지','TakeDamage',/GetComponent/,'TakeDamage에서 다시 찾지 않아요.','Awake에서 한 번만 가져오세요.'),
  notInClass('Health는 Mover를 상속하지 않음','Health',/class\s+Health\s*:\s*Mover/,'Health가 Mover를 상속하지 않아요.','Health는 Mover와 독립된 컴포넌트여야 해요.'),
  inFn('null 확인','TakeDamage',/mover\s*!=\s*null|mover\s*==\s*null|!\s*mover\b|mover\s+is\s+(?:not\s+)?null|mover\?\./,'Mover가 없는 경우를 확인해요.','mover가 null일 수 있어요. 사용하기 전에 확인하세요.')
 ],
 test:(api,ok)=>{
  const mv={enabled:true};api.env.components.Mover=mv;
  let e1=null;try{api.call('Awake');api.call('TakeDamage',1)}catch(e){e1=e}
  ok('살아 있으면 계속 이동',!e1&&mv.enabled===true,'체력이 남아 있으면 Mover는 그대로예요.',e1?'에러가 나요.':'체력이 남아 있는데 Mover가 꺼졌어요.');
  try{api.call('TakeDamage',5)}catch(e){e1=e}
  ok('죽으면 이동 정지',!e1&&mv.enabled===false,'체력이 0 이하가 되자 Mover가 멈췄어요.',e1?'에러가 나요.':'hp가 0 이하가 되면 mover.enabled를 false로 바꾸세요.');
  delete api.env.components.Mover;api.set('hp',3);api.set('mover',null);
  let e2=null;try{api.call('Awake');api.call('TakeDamage',5)}catch(e){e2=e}
  ok('Mover 없는 오브젝트',!e2,'Mover가 없어도 에러 없이 동작해요.','Mover가 없는 오브젝트에서 에러가 나요. null을 확인하세요.');
 },
 hints:['컴포넌트들은 서로를 직접 상속하지 않고, 필요할 때 GetComponent로 찾아 협력해요.','Mover가 없는 오브젝트에서는 mover가 null이에요.','죽는 순간 mover가 있을 때만 enabled를 false로 바꾸세요.'],
 why:'조합 설계에서 컴포넌트끼리는 "상대가 있으면 협력하고, 없어도 동작한다"는 느슨한 관계가 좋아요. 필요한 상대를 한 번만 찾아 두고 null을 확인하면 어떤 조합에도 재사용할 수 있습니다.',
 concepts:[['컴포넌트 간 협력','독립된 컴포넌트가 GetComponent로 서로를 찾아 필요한 일만 요청한다. 없어도 동작하게 null을 확인한다.'],['has-a 설계','"무엇이다" 대신 "무엇을 가졌다"로 설계해 필요한 컴포넌트만 붙인다.']]});

QB({id:'x70',cat:'components',stage:1,level:3,title:'무기 종류 if문을 컴포넌트 교체로 바꾸기',
 story:'공격자가 무기 종류 문자열("sword", "bow")을 보고 if로 데미지를 정하고 있어요. 무기가 늘어날 때마다 Attacker를 고쳐야 하죠. 무기를 Weapon 컴포넌트로 분리하고, Attacker는 가진 Weapon의 damage만 읽도록 바꿔 주세요. 무기 교체는 Weapon을 갈아 끼우는 것으로 끝나야 해요.',
 goals:['Weapon 컴포넌트를 만든다 (damage 필드, 기본값 1)','Attacker는 Weapon을 담는 필드(weapon)를 가진다','Attack()은 weapon.damage를 반환한다','weapon이 비어 있으면 0을 반환한다'],
 limits:['Attacker 안에 무기 종류를 문자열로 비교하는 코드를 남기지 않는다'],
 api:'public 필드로 컴포넌트 참조, null 확인',
 starter:C`
using UnityEngine;

public class Attacker : MonoBehaviour
{
    public string type = "sword";

    public int Attack()
    {
        if (type == "sword") return 10;
        if (type == "bow") return 6;
        return 0;
    }
}`,
 solution:C`
using UnityEngine;

public class Attacker : MonoBehaviour
{
    public Weapon weapon;

    public int Attack()
    {
        if (weapon == null) return 0;
        return weapon.damage;
    }
}

public class Weapon : MonoBehaviour
{
    public int damage = 1;
}`,
 rules:[
  has('Weapon 클래스',/class\s+Weapon\s*:\s*MonoBehaviour/,'Weapon 컴포넌트를 만들었어요.','class Weapon : MonoBehaviour 를 만들고 damage 필드를 두세요.'),
  inClass('Weapon에 damage','Weapon',/\bint\s+damage\b/,'Weapon에 damage가 있어요.','Weapon에 public int damage = 1; 을 두세요.'),
  inClass('Attacker에 weapon 필드','Attacker',/\bWeapon\s+weapon\b/,'Attacker가 Weapon을 가졌어요.','Attacker에 public Weapon weapon; 필드를 두세요.'),
  notInClass('무기 문자열 비교 금지','Attacker',/==\s*"(?:sword|bow)"|"(?:sword|bow)"\s*==/,'무기 종류를 문자열로 비교하지 않아요.','무기별 if를 없애고 weapon.damage를 읽으세요.')
 ],
 test:(api,ok)=>{
  api.set('weapon',{damage:7});
  let r1,e1=null;try{r1=api.call('Attack')}catch(e){e1=e}
  ok('무기 데미지',!e1&&r1===7,'가진 무기의 damage(7)를 반환해요.',e1?'에러가 나요.':`Attack()이 ${r1} 입니다. weapon.damage인 7이어야 해요.`);
  api.set('weapon',{damage:20});
  ok('무기 교체',api.call('Attack')===20,'무기를 갈아 끼우면 데미지가 바뀌어요.','다른 Weapon으로 바꾸면 그 damage가 반환되어야 해요.');
  api.set('weapon',null);
  let r3,e3=null;try{r3=api.call('Attack')}catch(e){e3=e}
  ok('무기 없음',!e3&&r3===0,'무기가 없으면 0이에요.','weapon이 null일 때 에러가 나거나 0이 아니에요.');
 },
 hints:['무기마다 달라지는 값(damage)은 Attacker가 아니라 무기가 가지고 있어야 해요.','Attacker는 Weapon 필드 하나만 가지고, 그 값을 읽기만 하면 돼요.','무기가 비어 있을 때를 위해 null을 확인하세요.'],
 why:'종류별 if/문자열 분기는 새 종류가 생길 때마다 기존 코드를 고쳐야 해요. 달라지는 부분을 컴포넌트로 분리하고 "가진 것을 쓴다"로 바꾸면, 새 무기는 새 데이터만 추가하면 됩니다.',
 concepts:[['has-a 설계','달라지는 부분을 별도 컴포넌트로 분리해 가지게 하면 교체가 쉽다.'],['분기 제거','종류에 따른 if 대신 데이터를 가진 객체를 갈아 끼운다.']]});

QB({id:'x71',cat:'components',stage:1,level:3,title:'상속보다 조합: Actor 쪼개기',
 story:'상인, 슬라임, 용사가 모두 Actor를 상속하고 있어요. 그런데 상인은 싸우지 않는데도 hp와 TakeDamage를 물려받았고, 슬라임은 돈을 가질 필요가 없는데도 gold와 Earn을 물려받았어요. 기능별 컴포넌트로 나누어 필요한 것만 붙여서 조합해 주세요.',
 goals:['Actor 클래스를 없애고, 체력을 담당하는 Health(hp, TakeDamage)와 돈을 담당하는 Wallet(gold, Earn)으로 나눈다','Merchant는 Wallet만 필요로 한다 ([RequireComponent]로 선언)','Merchant에는 체력 관련 코드(hp, TakeDamage, Health)가 없다'],
 limits:['모든 클래스는 MonoBehaviour만 상속한다 (다른 클래스 상속 금지)','Health와 Wallet은 서로를 참조하지 않는다'],
 starter:C`
using UnityEngine;

// 모든 캐릭터가 Actor를 상속하는 구조입니다
public class Actor : MonoBehaviour
{
    public int hp = 10;
    public int gold = 0;

    public void TakeDamage(int dmg) { hp -= dmg; }
    public void Earn(int amount) { gold += amount; }
}

public class Merchant : Actor
{
    // 상인은 싸우지 않는데 hp와 TakeDamage를 물려받았습니다
}`,
 solution:C`
using UnityEngine;

public class Health : MonoBehaviour
{
    public int hp = 10;

    public void TakeDamage(int dmg) { hp -= dmg; }
}

public class Wallet : MonoBehaviour
{
    public int gold = 0;

    public void Earn(int amount) { gold += amount; }
}

[RequireComponent(typeof(Wallet))]
public class Merchant : MonoBehaviour
{
    // 체력 기능 없음: Wallet만 필요
}`,
 rules:[
  has('Health 컴포넌트',/\bclass\s+Health\s*:\s*MonoBehaviour\b/,'체력을 담당하는 Health 컴포넌트를 만들었어요.','class Health : MonoBehaviour 를 만드세요.'),
  inClass('Health 내용','Health',/\bhp\b[\s\S]*\bTakeDamage\s*\(|\bTakeDamage\s*\([\s\S]*\bhp\b/,'Health가 hp와 TakeDamage를 가지고 있어요.','Health에 hp 필드와 TakeDamage 메서드를 넣으세요.'),
  has('Wallet 컴포넌트',/\bclass\s+Wallet\s*:\s*MonoBehaviour\b/,'돈을 담당하는 Wallet 컴포넌트를 만들었어요.','class Wallet : MonoBehaviour 를 만드세요.'),
  inClass('Wallet 내용','Wallet',/\bgold\b[\s\S]*\bEarn\s*\(|\bEarn\s*\([\s\S]*\bgold\b/,'Wallet이 gold와 Earn을 가지고 있어요.','Wallet에 gold 필드와 Earn 메서드를 넣으세요.'),
  no('Actor 제거',/\bclass\s+Actor\b/,'Actor 클래스를 없앴어요.','Actor 클래스를 없애고 기능을 Health와 Wallet으로 나누세요.'),
  no('MonoBehaviour 외 상속 금지',/\bclass\s+\w+\s*:\s*(?!MonoBehaviour\b)\w+/,'모든 클래스가 MonoBehaviour만 상속해요.','다른 클래스를 상속하지 마세요. 필요한 기능은 컴포넌트를 함께 붙여서 조합합니다.'),
  has('Merchant는 Wallet 요구',/\[RequireComponent\(\s*typeof\(\s*Wallet\s*\)\s*\)\]\s*(?:public\s+)?class\s+Merchant\b/,'Merchant가 Wallet을 요구해요.','Merchant 위에 [RequireComponent(typeof(Wallet))] 를 붙여 돈이 필요하다고 선언하세요.'),
  notInClass('Merchant에 체력 없음','Merchant',/\b(?:hp|TakeDamage|Health)\b/,'Merchant에는 체력 관련 코드가 없어요.','Merchant는 싸우지 않으니 hp, TakeDamage, Health를 갖지 않아야 해요.'),
  notInClass('Health는 Wallet을 모름','Health',/\bWallet\b/,'Health가 Wallet을 참조하지 않아요.','Health와 Wallet은 서로 독립이어야 재사용하기 좋아요.'),
  notInClass('Wallet은 Health를 모름','Wallet',/\bHealth\b/,'Wallet이 Health를 참조하지 않아요.','Health와 Wallet은 서로 독립이어야 재사용하기 좋아요.')
 ],
 hints:['"무엇이다" 대신 "무엇을 가졌다"로 생각해 보세요. 상인은 돈만, 용사는 체력과 돈을 가졌어요.','체력 관련을 모은 클래스 하나, 돈 관련을 모은 클래스 하나를 MonoBehaviour로 만드세요.','Merchant에는 필요한 컴포넌트만 [RequireComponent]로 선언해요.'],
 why:'기능이 달라지는 지점이 늘 "누가 무엇을 갖는가"예요. 상속으로 묶으면 안 필요한 것까지 따라오지만, 조합하면 용사 = Health + Wallet, 슬라임 = Health, 상인 = Wallet처럼 필요한 만큼만 붙일 수 있어요.',
 concepts:[['has-a 설계','"무엇이다" 대신 "무엇을 가졌다"로 설계해 필요한 컴포넌트만 붙인다.']]});

/* ---- 디버그 1단계 ---- */
/* ---- 수학 1단계 ---- */
/* ---- 유니티 1단계 ---- */
QB({id:'x91',cat:'unity',stage:1,level:1,title:'프레임이 달라도 같은 속도로 위로 오르기',
 story:'엘리베이터가 초당 60 유닛의 속도로 위로 올라가야 해요. 지금 코드는 프레임마다 고정값(1)만큼 움직여서 30fps 기기와 144fps 기기에서 도착 시간이 크게 달라요. 어떤 기기에서도 3초 뒤 같은 높이에 도착하게 만들어 주세요.',
 goals:['30fps와 144fps 모두 3초 뒤 노란 목표 지점(y≈210)에 도착한다','속도는 speed 필드(초당 60)로 조절할 수 있다'],
 limits:['프레임당 이동량(1 같은 숫자)을 직접 쓰지 않는다','transform.position.y 에 직접 대입하지 않는다 (CS1612) — 지역 변수로 복사 후 다시 대입'],
 api:'transform.position(Vector3), Time.deltaTime',
 starter:C`
public float speed = 60f;

void Update()
{
    // 프레임마다 1씩 움직이는 중입니다. 초당 속도로 바꿔 보세요.
    Vector3 pos = transform.position;
    pos.y += 1f;
    transform.position = pos;
}`,
 solution:C`
public float speed = 60f;

void Update()
{
    Vector3 pos = transform.position;
    pos.y += speed * Time.deltaTime;
    transform.position = pos;
}`,
 world:{start:{x:150,y:30},goal:{x:150,y:210,r:10}},runs:[{fps:30,seconds:3},{fps:144,seconds:3}],show:3,
 rules:[has('Time.deltaTime 사용',/Time\.deltaTime/,'이동량에 Time.deltaTime을 곱했어요.','이동량에 Time.deltaTime(직전 프레임과의 시간 간격)을 곱해야 프레임레이트와 무관해져요.'),
  inFn('speed 필드 사용','Update',/\bspeed\b/,'speed 값을 사용해요.','하드코딩한 숫자 대신 speed 필드를 쓰세요.')],
 check:rs=>{const a=last(rs[0]),b=last(rs[1]);const same=Math.abs(a[2]-b[2])<4,hit=Math.abs(b[2]-210)<12;
  return {items:[
   it(same,'프레임레이트 무관',`30fps y=${a[2].toFixed(1)}, 144fps y=${b[2].toFixed(1)} 로 거의 같아요.`,`30fps y=${a[2].toFixed(1)}, 144fps y=${b[2].toFixed(1)} 로 달라요. 프레임당 이동량이 아니라 속도 × 프레임 시간(Time.deltaTime)으로 움직이세요.`),
   it(hit,'목표 도착',`3초 뒤 목표 높이(y≈210)에 도착했어요 (y=${b[2].toFixed(1)}).`,`3초 뒤 y=${b[2].toFixed(1)} 로 목표(210)에 도착하지 못했어요. 속도가 초당 60 유닛인지 확인하세요.`)]}},
 hints:['Update는 프레임마다 호출돼서 144fps와 30fps의 호출 횟수가 달라요.','Time.deltaTime은 직전 프레임에서 지금까지 걸린 시간(초)이에요.','이동량 = speed × Time.deltaTime 으로 만드세요.'],
 why:'초당 속도에 Time.deltaTime을 곱하면 "이번 프레임에 흐른 시간만큼" 움직이므로 프레임레이트와 관계없이 같은 거리를 가요.',
 concepts:[['Time.deltaTime','직전 프레임과 이번 프레임 사이의 시간(초). 속도 × deltaTime으로 이동하면 프레임레이트와 무관한 움직임이 된다.'],['프레임 독립 이동','프레임당 고정 이동량 대신 초당 속도 × 시간으로 움직인다.']]});

QB({id:'x92',cat:'unity',stage:1,level:1,title:'프레임이 달라도 같은 속도로 왼쪽으로',
 story:'자동차가 오른쪽 끝에서 출발해 초당 70 유닛으로 왼쪽으로 달려야 해요. 지금은 프레임마다 고정값(1.2)만큼 움직여서 기기 성능에 따라 속도가 달라져요. 3초 뒤 노란 목표 지점(x≈70)에 도착하도록 고쳐 주세요.',
 goals:['30fps와 144fps 모두 3초 뒤 노란 목표 지점(x≈70)에 도착한다','속도는 speed 필드(초당 70)로 조절할 수 있다'],
 limits:['프레임당 이동량(1.2 같은 숫자)을 직접 쓰지 않는다','transform.position.x 에 직접 대입하지 않는다 (CS1612)'],
 api:'transform.position(Vector3), Time.deltaTime',
 starter:C`
public float speed = 70f;

void Update()
{
    // 프레임마다 1.2씩 왼쪽으로 움직이는 중입니다.
    Vector3 pos = transform.position;
    pos.x -= 1.2f;
    transform.position = pos;
}`,
 solution:C`
public float speed = 70f;

void Update()
{
    Vector3 pos = transform.position;
    pos.x -= speed * Time.deltaTime;
    transform.position = pos;
}`,
 world:{start:{x:280,y:135},goal:{x:70,y:135,r:10}},runs:[{fps:30,seconds:3},{fps:144,seconds:3}],show:3,
 rules:[has('Time.deltaTime 사용',/Time\.deltaTime/,'이동량에 Time.deltaTime을 곱했어요.','이동량에 Time.deltaTime을 곱해야 프레임레이트와 무관해져요.'),
  inFn('speed 필드 사용','Update',/\bspeed\b/,'speed 값을 사용해요.','하드코딩한 숫자 대신 speed 필드를 쓰세요.')],
 check:rs=>{const a=last(rs[0]),b=last(rs[1]);const same=Math.abs(a[1]-b[1])<4,hit=Math.abs(b[1]-70)<12;
  return {items:[
   it(same,'프레임레이트 무관',`30fps x=${a[1].toFixed(1)}, 144fps x=${b[1].toFixed(1)} 로 거의 같아요.`,`30fps x=${a[1].toFixed(1)}, 144fps x=${b[1].toFixed(1)} 로 달라요. 속도 × Time.deltaTime으로 움직이세요.`),
   it(hit,'목표 도착',`3초 뒤 목표 지점(x≈70)에 도착했어요 (x=${b[1].toFixed(1)}).`,`3초 뒤 x=${b[1].toFixed(1)} 로 목표(70)에 도착하지 못했어요. 속도가 초당 70 유닛인지 확인하세요.`)]}},
 hints:['프레임마다 고정값을 빼면 프레임 수가 많은 기기가 더 빨리 가요.','Time.deltaTime은 직전 프레임이 걸린 시간(초)이에요.','pos.x -= speed * Time.deltaTime; 으로 바꾸세요.'],
 why:'방향이 반대여도 원리는 같아요. 부호는 방향을, speed × Time.deltaTime은 이번 프레임의 이동 거리를 정합니다.',
 concepts:[['Time.deltaTime','직전 프레임과 이번 프레임 사이의 시간(초).'],['프레임 독립 이동','프레임당 고정 이동량 대신 초당 속도 × 시간으로 움직인다.']]});

QB({id:'x93',cat:'unity',stage:1,level:1,title:'프레임이 달라도 같은 속도로 대각선 이동',
 story:'드론이 초당 x로 50, y로 50 유닛씩 대각선으로 날아가야 해요. 지금은 프레임마다 고정값(0.8)만큼 움직여서 기기마다 도착 시간이 달라요. 3초 뒤 노란 목표 지점(x≈190, y≈180)에 도착하도록 고쳐 주세요.',
 goals:['30fps와 144fps 모두 3초 뒤 노란 목표 지점(190, 180)에 도착한다','속도는 speed 필드(초당 50)로 조절할 수 있다'],
 limits:['프레임당 이동량(0.8 같은 숫자)을 직접 쓰지 않는다','transform.position.x 에 직접 대입하지 않는다 (CS1612)'],
 api:'transform.position(Vector3), Time.deltaTime',
 starter:C`
public float speed = 50f;

void Update()
{
    // 프레임마다 0.8씩 움직이는 중입니다.
    Vector3 pos = transform.position;
    pos.x += 0.8f;
    pos.y += 0.8f;
    transform.position = pos;
}`,
 solution:C`
public float speed = 50f;

void Update()
{
    Vector3 pos = transform.position;
    pos.x += speed * Time.deltaTime;
    pos.y += speed * Time.deltaTime;
    transform.position = pos;
}`,
 world:{start:{x:40,y:30},goal:{x:190,y:180,r:10}},runs:[{fps:30,seconds:3},{fps:144,seconds:3}],show:3,
 rules:[has('Time.deltaTime 사용',/Time\.deltaTime/,'이동량에 Time.deltaTime을 곱했어요.','이동량에 Time.deltaTime을 곱해야 프레임레이트와 무관해져요.'),
  inFn('speed 필드 사용','Update',/\bspeed\b/,'speed 값을 사용해요.','하드코딩한 숫자 대신 speed 필드를 쓰세요.')],
 check:rs=>{const a=last(rs[0]),b=last(rs[1]);const same=Math.abs(a[1]-b[1])<4&&Math.abs(a[2]-b[2])<4,hit=Math.abs(b[1]-190)<12&&Math.abs(b[2]-180)<12;
  return {items:[
   it(same,'프레임레이트 무관',`30fps (${a[1].toFixed(0)}, ${a[2].toFixed(0)}), 144fps (${b[1].toFixed(0)}, ${b[2].toFixed(0)}) 로 거의 같아요.`,`30fps (${a[1].toFixed(0)}, ${a[2].toFixed(0)}), 144fps (${b[1].toFixed(0)}, ${b[2].toFixed(0)}) 로 달라요. x와 y 모두 속도 × Time.deltaTime으로 움직이세요.`),
   it(hit,'목표 도착',`3초 뒤 목표 지점에 도착했어요 (${b[1].toFixed(0)}, ${b[2].toFixed(0)}).`,`3초 뒤 (${b[1].toFixed(0)}, ${b[2].toFixed(0)}) 로 목표(190, 180)에 도착하지 못했어요. 속도가 초당 50 유닛인지 확인하세요.`)]}},
 hints:['x와 y 모두 프레임당 고정값이라 둘 다 프레임레이트에 영향을 받아요.','두 축 모두에 Time.deltaTime을 곱해야 해요.','pos.x와 pos.y에 각각 speed * Time.deltaTime 을 더하세요.'],
 why:'축이 늘어도 원리는 같아요. 이동량에는 항상 "시간"이 들어가야 프레임레이트와 무관해집니다.',
 concepts:[['Time.deltaTime','직전 프레임과 이번 프레임 사이의 시간(초).'],['프레임 독립 이동','프레임당 고정 이동량 대신 초당 속도 × 시간으로 움직인다.']]});

QB({id:'x94',cat:'unity',stage:1,level:2,title:'적은 UIManager가 준비된 뒤에 등록하자',
 story:'Enemy.Awake에서 UIManager.Instance.AddEnemy(this)를 호출했더니 가끔 NullReferenceException이 나요. UIManager는 자기 Awake에서 Instance를 설정하는데, 서로 다른 오브젝트의 Awake 순서는 정해져 있지 않기 때문이에요.',
 goals:['자기 자신에게 붙은 컴포넌트(Animator)를 가져오는 일은 Awake에서 한다','다른 오브젝트(UIManager.Instance)에 접근하는 일은 Start에서 한다'],
 limits:['Awake와 OnEnable에서는 UIManager.Instance를 쓰지 않는다','AddEnemy(this) 호출은 정확히 그대로 유지한다'],
 starter:C`
using UnityEngine;

public class Enemy : MonoBehaviour
{
    private Animator anim;

    void Awake()
    {
        // 지금은 UIManager가 아직 준비되기 전일 수 있어서 NullReferenceException이 납니다
        UIManager.Instance.AddEnemy(this);
        anim = GetComponent<Animator>();
    }
}`,
 solution:C`
using UnityEngine;

public class Enemy : MonoBehaviour
{
    private Animator anim;

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    void Start()
    {
        UIManager.Instance.AddEnemy(this);
    }
}`,
 rules:[
  inFn('Awake에서 자기 컴포넌트 가져오기','Awake',/\banim\s*=\s*GetComponent\s*<\s*Animator\s*>\s*\(\s*\)|TryGetComponent\s*(?:<\s*Animator\s*>)?\s*\(\s*out\s+anim\b/,'자기 컴포넌트는 Awake에서 가져와요.','자기 자신의 컴포넌트(anim)는 Awake에서 가져오세요.'),
  notIn('Awake에서 Instance 금지','Awake',/\bUIManager\s*\.\s*Instance\b/,'Awake에서 다른 오브젝트에 접근하지 않아요.','Awake는 오브젝트마다 순서가 정해져 있지 않아요. 다른 오브젝트의 Instance는 Start에서 쓰세요.'),
  notIn('OnEnable에서 Instance 금지','OnEnable',/\bUIManager\s*\.\s*Instance\b/,'OnEnable에서도 접근하지 않아요.','OnEnable은 Awake 직후에 호출되므로 마찬가지로 안전하지 않아요.'),
  inFn('Start에서 등록','Start',/\bUIManager\s*\.\s*Instance\s*\.\s*AddEnemy\s*\(\s*this\s*\)\s*;/,'Start에서 UIManager에 등록해요.','Start 안에서 UIManager.Instance.AddEnemy(this); 를 호출하세요.')
 ],
 hints:['Unity는 모든 오브젝트의 Awake를 먼저 실행한 뒤 첫 Update 전에 Start를 실행해요.','Awake: 내 것 준비. Start: 남의 것 사용.','AddEnemy 호출을 Start로 옮기세요.'],
 why:'서로 다른 오브젝트 사이의 Awake 순서는 보장되지 않아요. 그래서 "자기 초기화는 Awake, 다른 오브젝트 접근은 Start"가 Unity의 기본 약속입니다.',
 concepts:[['Awake와 Start의 차이','Awake는 자기 초기화에, Start는 모든 Awake가 끝난 뒤 다른 오브젝트에 접근하는 초기화에 쓴다.']]});

QB({id:'x95',cat:'unity',stage:1,level:2,title:'HUD는 플레이어 이벤트를 Start에서 연결',
 story:'Hud.Awake에서 Player.Instance.OnHpChanged += Refresh; 로 이벤트를 연결했더니 씬을 시작할 때 가끔 NullReferenceException이 나요. Player가 자기 Awake에서 Instance를 설정하기 전에 Hud의 Awake가 먼저 실행될 수 있기 때문이에요.',
 goals:['자기 자신에게 붙은 컴포넌트(CanvasGroup)를 가져오는 일은 Awake에서 한다','다른 오브젝트(Player.Instance)의 이벤트를 연결하는 일은 Start에서 한다'],
 limits:['Awake와 OnEnable에서는 Player.Instance를 쓰지 않는다','이벤트 연결 코드는 그대로 유지한다'],
 starter:C`
using UnityEngine;

public class Hud : MonoBehaviour
{
    private CanvasGroup group;

    void Awake()
    {
        // 지금은 Player가 아직 준비되기 전일 수 있어서 NullReferenceException이 납니다
        Player.Instance.OnHpChanged += Refresh;
        group = GetComponent<CanvasGroup>();
    }

    void Refresh(int hp) { }
}`,
 solution:C`
using UnityEngine;

public class Hud : MonoBehaviour
{
    private CanvasGroup group;

    void Awake()
    {
        group = GetComponent<CanvasGroup>();
    }

    void Start()
    {
        Player.Instance.OnHpChanged += Refresh;
    }

    void Refresh(int hp) { }
}`,
 rules:[
  inFn('Awake에서 자기 컴포넌트 가져오기','Awake',/\bgroup\s*=\s*GetComponent\s*<\s*CanvasGroup\s*>\s*\(\s*\)|TryGetComponent\s*(?:<\s*CanvasGroup\s*>)?\s*\(\s*out\s+group\b/,'자기 컴포넌트는 Awake에서 가져와요.','자기 자신의 컴포넌트(group)는 Awake에서 가져오세요.'),
  notIn('Awake에서 Instance 금지','Awake',/\bPlayer\s*\.\s*Instance\b/,'Awake에서 다른 오브젝트에 접근하지 않아요.','다른 오브젝트의 Instance는 Start에서 쓰세요.'),
  notIn('OnEnable에서 Instance 금지','OnEnable',/\bPlayer\s*\.\s*Instance\b/,'OnEnable에서도 접근하지 않아요.','OnEnable은 Awake 직후에 호출되므로 마찬가지로 안전하지 않아요.'),
  inFn('Start에서 연결','Start',/\bPlayer\s*\.\s*Instance\s*\.\s*OnHpChanged\s*\+=\s*Refresh\s*;/,'Start에서 이벤트를 연결해요.','Start 안에서 Player.Instance.OnHpChanged += Refresh; 를 쓰세요.')
 ],
 hints:['Awake에서는 다른 오브젝트가 준비됐다고 믿을 수 없어요.','내 컴포넌트 가져오기는 Awake, 남의 이벤트 연결은 Start.','이벤트 연결 줄을 Start로 옮기세요.'],
 why:'이벤트 구독처럼 다른 오브젝트에 접근하는 일은 모든 Awake가 끝난 Start 이후가 안전해요.',
 concepts:[['Awake와 Start의 차이','Awake는 자기 초기화, Start는 다른 오브젝트에 접근하는 초기화에 쓴다.']]});

QB({id:'x96',cat:'unity',stage:1,level:2,title:'AudioManager는 Start에서 부르자',
 story:'Stage.Awake에서 AudioManager.Instance.PlayBgm(bgm)을 바로 부르면 가끔 NullReferenceException이 나요. AudioManager의 Awake가 아직 실행되지 않았을 수 있기 때문이에요.',
 goals:['자기 자신에게 붙은 컴포넌트(Animator)를 가져오는 일은 Awake에서 한다','다른 오브젝트(AudioManager.Instance)를 쓰는 일은 Start에서 한다'],
 limits:['Awake와 OnEnable에서는 AudioManager.Instance를 쓰지 않는다','PlayBgm(bgm) 호출은 그대로 유지한다'],
 starter:C`
using UnityEngine;

public class Stage : MonoBehaviour
{
    public AudioClip bgm;
    private Animator anim;

    void Awake()
    {
        // 지금은 AudioManager가 아직 준비되기 전일 수 있어서 NullReferenceException이 납니다
        AudioManager.Instance.PlayBgm(bgm);
        anim = GetComponent<Animator>();
    }
}`,
 solution:C`
using UnityEngine;

public class Stage : MonoBehaviour
{
    public AudioClip bgm;
    private Animator anim;

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    void Start()
    {
        AudioManager.Instance.PlayBgm(bgm);
    }
}`,
 rules:[
  inFn('Awake에서 자기 컴포넌트 가져오기','Awake',/\banim\s*=\s*GetComponent\s*<\s*Animator\s*>\s*\(\s*\)|TryGetComponent\s*(?:<\s*Animator\s*>)?\s*\(\s*out\s+anim\b/,'자기 컴포넌트는 Awake에서 가져와요.','자기 자신의 컴포넌트(anim)는 Awake에서 가져오세요.'),
  notIn('Awake에서 Instance 금지','Awake',/\bAudioManager\s*\.\s*Instance\b/,'Awake에서 다른 오브젝트에 접근하지 않아요.','다른 오브젝트의 Instance는 Start에서 쓰세요.'),
  notIn('OnEnable에서 Instance 금지','OnEnable',/\bAudioManager\s*\.\s*Instance\b/,'OnEnable에서도 접근하지 않아요.','OnEnable은 Awake 직후에 호출되므로 마찬가지로 안전하지 않아요.'),
  inFn('Start에서 재생','Start',/\bAudioManager\s*\.\s*Instance\s*\.\s*PlayBgm\s*\(\s*bgm\s*\)\s*;/,'Start에서 배경음을 재생해요.','Start 안에서 AudioManager.Instance.PlayBgm(bgm); 를 호출하세요.')
 ],
 hints:['AudioManager의 Awake가 먼저일 거라는 보장이 없어요.','내 것은 Awake, 남의 것은 Start.','PlayBgm 호출을 Start로 옮기세요.'],
 why:'싱글톤 매니저를 쓰는 코드는 Start 이후에 호출하는 것이 Unity에서 가장 흔한 안전 장치예요.',
 concepts:[['Awake와 Start의 차이','Awake는 자기 초기화, Start는 다른 오브젝트에 접근하는 초기화에 쓴다.']]});

QB({id:'x97',cat:'unity',stage:1,level:3,title:'슬로모션에도 쿨다운 바는 실제 속도로',
 story:'슬로모션 스킬을 쓰면 Time.timeScale이 0.3으로 내려가요. 그런데 스킬 쿨다운 UI가 같이 느려져서 답답해요. 쿨다운은 실제 시간으로 3초에 걸쳐 줄어야 해요.',
 goals:['Update(): cooldown 을 Time.unscaledDeltaTime 만큼 줄인다','cooldown 은 0 아래로 내려가지 않는다','SlowMo(): timeScale 을 0.3으로 낮춘다 (이미 구현되어 있어요)'],
 limits:['Time.deltaTime 은 timeScale 영향을 받으므로 쓰지 않는다'],
 api:'Time.timeScale, Time.deltaTime, Time.unscaledDeltaTime, Mathf.Max',
 starter:C`
public float cooldown = 3f;

public void SlowMo()
{
    Time.timeScale = 0.3f;
}

void Update()
{
    cooldown -= Time.deltaTime;
    cooldown = Mathf.Max(cooldown, 0f);
}`,
 solution:C`
public float cooldown = 3f;

public void SlowMo()
{
    Time.timeScale = 0.3f;
}

void Update()
{
    cooldown -= Time.unscaledDeltaTime;
    cooldown = Mathf.Max(cooldown, 0f);
}`,
 rules:[
  inFn('unscaledDeltaTime 사용','Update',/Time\.unscaledDeltaTime/,'timeScale의 영향을 받지 않는 시간을 써요.','UI 연출에는 Time.unscaledDeltaTime을 쓰세요.'),
  notIn('Update에서 deltaTime 금지','Update',/Time\.deltaTime/,'timeScale 영향을 받는 deltaTime을 쓰지 않았어요.','Time.deltaTime은 슬로모션에서 작아져요. Update에서 쓰지 마세요.')
 ],
 test:(api,ok)=>{
  const T=api.env.Time;
  T.deltaTime=0.025;T.unscaledDeltaTime=0.125;
  api.call('SlowMo');
  ok('SlowMo',T.timeScale===0.3,'SlowMo가 timeScale을 0.3으로 낮춰요.','SlowMo 후 Time.timeScale이 0.3이어야 해요.');
  for(let i=0;i<8;i++)api.call('Update');
  const c=api.get('cooldown');
  ok('실제 시간으로 감소',Math.abs(c-2)<1e-6,'슬로모션 중에도 쿨다운이 실제 시간(1초)만큼 줄었어요.',`쿨다운이 ${c.toFixed(2)} 입니다. 실제 1초가 지났으니 2여야 해요. deltaTime은 슬로모션에서 작아져요.`);
  for(let i=0;i<40;i++)api.call('Update');
  ok('0 아래 금지',api.get('cooldown')===0,'쿨다운이 0 아래로 내려가지 않아요.','쿨다운은 0에서 멈춰야 해요. Mathf.Max로 제한하세요.');
 },
 hints:['timeScale이 줄면 Time.deltaTime도 같이 줄어요.','Time.unscaledDeltaTime은 timeScale과 상관없이 실제로 흐른 시간이에요.','cooldown -= Time.unscaledDeltaTime; 으로 바꾸세요.'],
 why:'게임 속 시간(timeScale 영향)과 실제 시간은 구분해서 써야 해요. 게임 로직은 deltaTime, UI 연출과 쿨다운 표시는 unscaledDeltaTime입니다.',
 concepts:[['Time.timeScale','게임 시간의 배속. 0이면 deltaTime 기반 로직이 모두 멈춘다.'],['Time.unscaledDeltaTime','timeScale의 영향을 받지 않는 프레임 간격.']]});

QB({id:'x98',cat:'unity',stage:1,level:3,title:'일시정지 메뉴가 위에서 내려오게',
 story:'일시정지하면 timeScale이 0이 되어 메뉴가 내려오는 슬라이드 연출도 멈춰요. 메뉴가 화면 밖에 걸린 채로 남아 있죠. 일시정지 중에도 메뉴가 초당 slideSpeed 속도로 내려와 0 위치에서 멈추도록 고쳐 주세요.',
 goals:['Pause(): 시간을 멈추고(timeScale 0) menuY 를 −300으로 초기화한다 (이미 구현되어 있어요)','Resume(): 시간을 정상 속도(1)로 되돌린다','Update(): 일시정지 중에도 menuY 가 slideSpeed 속도로 0까지 올라간다 (0을 넘지 않는다)'],
 limits:['Time.deltaTime 은 timeScale 이 0이면 0이 되므로 쓰지 않는다'],
 api:'Time.timeScale, Time.deltaTime, Time.unscaledDeltaTime, Mathf.Min',
 starter:C`
public float slideSpeed = 600f;
float menuY = 0f;

public void Pause()
{
    Time.timeScale = 0f;
    menuY = -300f;
}

public void Resume()
{
    // TODO
}

void Update()
{
    menuY += slideSpeed * Time.deltaTime;
    menuY = Mathf.Min(menuY, 0f);
}`,
 solution:C`
public float slideSpeed = 600f;
float menuY = 0f;

public void Pause()
{
    Time.timeScale = 0f;
    menuY = -300f;
}

public void Resume()
{
    Time.timeScale = 1f;
}

void Update()
{
    menuY += slideSpeed * Time.unscaledDeltaTime;
    menuY = Mathf.Min(menuY, 0f);
}`,
 rules:[
  inFn('Resume이 시간을 되돌림','Resume',/Time\.timeScale\s*=\s*1(?:\.0*)?f?\s*;/,'Resume에서 timeScale을 1로 되돌려요.','Resume에서 Time.timeScale = 1f; 로 시간을 다시 흐르게 하세요.'),
  inFn('unscaledDeltaTime 사용','Update',/Time\.unscaledDeltaTime/,'timeScale의 영향을 받지 않는 시간을 써요.','일시정지 중에도 흘러야 하는 UI 연출에는 Time.unscaledDeltaTime을 쓰세요.'),
  notIn('Update에서 deltaTime 금지','Update',/Time\.deltaTime/,'timeScale 영향을 받는 deltaTime을 쓰지 않았어요.','Time.deltaTime은 timeScale이 0이면 0이 돼요.')
 ],
 test:(api,ok)=>{
  const T=api.env.Time;
  T.deltaTime=0;T.unscaledDeltaTime=0.125;
  api.call('Pause');
  ok('Pause',T.timeScale===0&&api.get('menuY')===-300,'Pause가 시간을 멈추고 메뉴를 위에 둬요.','Pause 후 timeScale이 0, menuY가 −300이어야 해요.');
  for(let i=0;i<2;i++)api.call('Update');
  const y=api.get('menuY');
  ok('일시정지 중 슬라이드',Math.abs(y+150)<1e-6,'timeScale이 0이어도 0.25초 동안 메뉴가 150 내려왔어요.',`일시정지 중에 menuY가 ${y.toFixed(0)} 입니다. 600 × 0.25초 = 150 만큼 올라 −150이어야 해요.`);
  for(let i=0;i<20;i++)api.call('Update');
  ok('0 상한',api.get('menuY')===0,'menuY가 0에서 멈춰요.','menuY가 0을 넘었어요. Mathf.Min으로 제한하세요.');
  api.call('Resume');
  ok('Resume',T.timeScale===1,'Resume이 시간을 되돌려요.','Resume 후 Time.timeScale이 1이어야 해요.');
 },
 hints:['timeScale = 0 이면 Time.deltaTime도 0이에요.','Time.unscaledDeltaTime은 실제로 흐른 시간이에요.','Resume은 timeScale을 1로 되돌리는 한 줄이면 돼요.'],
 why:'일시정지 중에도 움직여야 하는 것은 메뉴, 페이드, 입력 처리 같은 UI예요. 이들은 unscaledDeltaTime으로 움직입니다.',
 concepts:[['Time.timeScale','게임 시간의 배속. 0이면 deltaTime 기반 로직이 모두 멈춘다.'],['Time.unscaledDeltaTime','timeScale의 영향을 받지 않는 프레임 간격.']]});

QB({id:'x99',cat:'unity',stage:1,level:3,title:'히트스톱: 멈췄다가 스스로 풀리기',
 story:'타격감을 위해 맞는 순간 시간을 0.5초 동안 멈추는 "히트스톱"을 만들어요. 그런데 타이머를 Time.deltaTime으로 줄였더니 시간이 멈춘 동안 타이머도 멈춰서 게임이 영영 풀리지 않아요.',
 goals:['HitStop(): timeScale 을 0으로 만들고 stopTimer 를 duration 으로 채운다 (이미 구현되어 있어요)','Update(): stopTimer 가 남아 있으면 실제 시간만큼 줄인다','stopTimer 가 0 이하가 되면 timeScale 을 1로 되돌린다'],
 limits:['Time.deltaTime 은 timeScale 이 0이면 0이 되므로 쓰지 않는다'],
 api:'Time.timeScale, Time.unscaledDeltaTime',
 starter:C`
public float duration = 0.5f;
float stopTimer = 0f;

public void HitStop()
{
    Time.timeScale = 0f;
    stopTimer = duration;
}

void Update()
{
    if (stopTimer > 0f)
    {
        stopTimer -= Time.deltaTime;
        if (stopTimer <= 0f)
        {
            Time.timeScale = 1f;
        }
    }
}`,
 solution:C`
public float duration = 0.5f;
float stopTimer = 0f;

public void HitStop()
{
    Time.timeScale = 0f;
    stopTimer = duration;
}

void Update()
{
    if (stopTimer > 0f)
    {
        stopTimer -= Time.unscaledDeltaTime;
        if (stopTimer <= 0f)
        {
            Time.timeScale = 1f;
        }
    }
}`,
 rules:[
  inFn('unscaledDeltaTime 사용','Update',/Time\.unscaledDeltaTime/,'timeScale의 영향을 받지 않는 시간으로 타이머를 줄여요.','히트스톱 타이머는 Time.unscaledDeltaTime으로 줄이세요.'),
  notIn('Update에서 deltaTime 금지','Update',/Time\.deltaTime/,'timeScale 영향을 받는 deltaTime을 쓰지 않았어요.','Time.deltaTime은 timeScale이 0이면 0이 돼요.'),
  inFn('timeScale 복구','Update',/Time\.timeScale\s*=\s*1(?:\.0*)?f?\s*;/,'타이머가 끝나면 시간을 되돌려요.','타이머가 끝나면 Time.timeScale = 1f; 로 되돌리세요.')
 ],
 test:(api,ok)=>{
  const T=api.env.Time;
  T.deltaTime=0;T.unscaledDeltaTime=0.125;
  api.call('HitStop');
  ok('시간 정지',T.timeScale===0,'맞는 순간 시간이 멈춰요.','HitStop 후 Time.timeScale이 0이어야 해요.');
  for(let i=0;i<3;i++)api.call('Update');
  ok('멈춘 동안 유지',T.timeScale===0,'0.375초 동안은 계속 멈춰 있어요.',`0.375초 만에 timeScale이 ${T.timeScale} 가 됐어요. 0.5초가 지나기 전에는 0이어야 해요.`);
  api.call('Update');
  ok('스스로 풀림',T.timeScale===1,'0.5초가 지나면 시간이 다시 흘러요.','0.5초가 지났는데도 timeScale이 0이에요. deltaTime 대신 unscaledDeltaTime으로 타이머를 줄이세요.');
 },
 hints:['timeScale이 0이면 Time.deltaTime도 0이라 타이머가 안 줄어요.','타이머처럼 "실제 시간"을 재야 하는 값은 unscaledDeltaTime으로 줄이세요.','deltaTime을 unscaledDeltaTime으로 바꾸면 돼요.'],
 why:'시간을 멈추는 코드는 "멈춘 시간을 재는 시계"를 따로 가져야 해요. 이 시계는 timeScale의 영향을 받지 않는 unscaledDeltaTime입니다.',
 concepts:[['Time.timeScale','게임 시간의 배속. 0이면 deltaTime 기반 로직이 모두 멈춘다.'],['Time.unscaledDeltaTime','timeScale의 영향을 받지 않는 프레임 간격.']]});

/* ---- 유니티 2단계 ---- */
QB({id:'x100',cat:'unity',stage:2,level:1,title:'웅크리기는 누를 때 한 번만 바뀌게',
 story:'C 키를 누르면 웅크리기가 켜지고 다시 누르면 꺼져야 해요. 지금은 GetKey를 써서 키를 누르고 있는 동안 매 프레임 뒤집혀서 상태가 깜빡거려요. 누른 프레임에 딱 한 번만 바뀌게 해 주세요.',
 goals:['C 키를 누른 프레임에만 crouching 을 반대로 뒤집는다 (true ↔ false)','누르고 있는 동안에는 상태가 바뀌지 않는다'],
 limits:['누른 순간은 Input.GetKeyDown 으로 구분한다'],
 api:'Input.GetKeyDown (KeyCode.C)',
 starter:C`
public bool crouching;

void Update()
{
    // GetKey는 누르고 있는 내내 true라서 매 프레임 뒤집혀요.
    if (Input.GetKey(KeyCode.C))
    {
        crouching = !crouching;
    }
}`,
 solution:C`
public bool crouching;

void Update()
{
    if (Input.GetKeyDown(KeyCode.C))
    {
        crouching = !crouching;
    }
}`,
 rules:[has('GetKeyDown 사용',/Input\.GetKeyDown\s*\(/,'누른 순간은 GetKeyDown으로 감지해요.','"누른 프레임 한 번"은 Input.GetKeyDown 으로 감지합니다.')],
 test:(api,ok)=>{
  const I=api.env.Input;
  const frames=[{d:1,h:1},{d:0,h:1},{d:0,h:1},{d:0,h:0}];
  let f=frames[0];
  I.GetKeyDown=k=>k==='C'&&!!f.d;I.GetKey=k=>k==='C'&&!!f.h;I.GetKeyUp=k=>false;
  for(f of frames)api.call('Update');
  ok('한 번 누르면 켜짐',api.get('crouching')===true,'3프레임 동안 눌러도 한 번만 바뀌어 켜졌어요.',`crouching이 ${api.get('crouching')} 입니다. 눌러서 한 번만 뒤집히면 true여야 해요.`);
  f={d:1,h:1};api.call('Update');
  ok('다시 누르면 꺼짐',api.get('crouching')===false,'다시 누르면 꺼져요.','한 번 더 누르면 false로 돌아와야 해요.');
 },
 hints:['GetKey는 누르고 있는 모든 프레임에서 true예요.','"누른 그 프레임"에만 true인 함수를 쓰세요.','if (Input.GetKeyDown(KeyCode.C)) 로 감싸세요.'],
 why:'토글처럼 "한 번 일어나는 일"에는 GetKeyDown을 써야 해요. GetKey는 누르고 있는 동안 계속 true라서 폭주합니다.',
 concepts:[['GetKeyDown / GetKey / GetKeyUp','누른 프레임, 누르는 동안, 뗀 프레임에서 각각 true가 되는 입력 함수. 한 번만 일어날 동작은 Down/Up을 쓴다.']]});

QB({id:'x101',cat:'unity',stage:2,level:1,title:'질주: 시작·지속·종료를 구분하기',
 story:'Shift를 누르면 질주가 시작되고(startCount 증가), 누르고 있는 동안 스태미나가 줄고, 떼면 종료돼요(stopCount 증가). 지금은 GetKey 하나만 써서 시작 횟수가 폭주하고 종료는 감지하지 못해요.',
 goals:['Shift를 누른 프레임에만 startCount를 1 올린다','Shift를 누르고 있는 동안 매 프레임 stamina에서 20 × Time.deltaTime 을 뺀다','Shift를 뗀 프레임에 stopCount를 1 올린다'],
 limits:['세 가지 입력을 각각 GetKeyDown, GetKey, GetKeyUp 으로 구분해서 쓴다'],
 api:'Input.GetKeyDown / GetKey / GetKeyUp (KeyCode.LeftShift), Time.deltaTime',
 starter:C`
public int startCount;
public int stopCount;
public float stamina = 100f;

void Update()
{
    // 지금은 GetKey만 써서 누르고 있는 내내 시작이 폭주하고, 뗄 때는 아무 일도 없습니다.
    if (Input.GetKey(KeyCode.LeftShift))
    {
        startCount++;
    }
}`,
 solution:C`
public int startCount;
public int stopCount;
public float stamina = 100f;

void Update()
{
    if (Input.GetKeyDown(KeyCode.LeftShift))
    {
        startCount++;
    }
    if (Input.GetKey(KeyCode.LeftShift))
    {
        stamina -= 20f * Time.deltaTime;
    }
    if (Input.GetKeyUp(KeyCode.LeftShift))
    {
        stopCount++;
    }
}`,
 rules:[
  has('GetKeyDown 사용',/Input\.GetKeyDown\s*\(/,'누른 순간은 GetKeyDown으로 감지해요.','"누른 프레임 한 번"은 Input.GetKeyDown 으로 감지합니다.'),
  has('GetKey 사용',/Input\.GetKey\s*\(/,'누르는 동안은 GetKey로 감지해요.','"누르고 있는 동안"은 Input.GetKey 로 감지합니다.'),
  has('GetKeyUp 사용',/Input\.GetKeyUp\s*\(/,'뗀 순간은 GetKeyUp으로 감지해요.','"뗀 프레임 한 번"은 Input.GetKeyUp 으로 감지합니다.')
 ],
 test:(api,ok)=>{
  const I=api.env.Input,T=api.env.Time;
  T.deltaTime=0.5;
  const frames=[{d:1,h:1,u:0},{d:0,h:1,u:0},{d:0,h:1,u:0},{d:0,h:0,u:1},{d:0,h:0,u:0}];
  let f=frames[0];
  I.GetKeyDown=k=>k==='LeftShift'&&!!f.d;I.GetKey=k=>k==='LeftShift'&&!!f.h;I.GetKeyUp=k=>k==='LeftShift'&&!!f.u;
  for(f of frames)api.call('Update');
  const s=api.get('startCount'),e=api.get('stopCount'),st=api.get('stamina');
  ok('시작은 한 번',s===1,'누르고 있는 3프레임 동안에도 시작은 1번만 일어났어요.',`startCount가 ${s} 입니다. 누른 순간(GetKeyDown)에만 1 올라야 해요.`);
  ok('지속 중 스태미나',Math.abs(st-70)<1e-6,'3프레임(1.5초) 동안 스태미나가 30 줄었어요.',`stamina가 ${st} 입니다. 100 − 20 × 0.5 × 3 = 70 이어야 해요.`);
  ok('종료 감지',e===1,'뗀 순간 stopCount가 1 올랐어요.',`stopCount가 ${e} 입니다. 키를 뗀 프레임(GetKeyUp)에 1 올라야 해요.`);
 },
 hints:['세 함수는 각각 "누른 프레임", "누르는 중 매 프레임", "뗀 프레임"에만 true가 돼요.','스태미나는 GetKey 블록에서 줄이고, 시작·종료 횟수는 Down/Up 블록에서 올리세요.','Update 안에 if를 세 개 나란히 쓰면 돼요.'],
 why:'입력의 "순간"과 "상태"를 구분하면 시작 효과, 지속 소모, 종료 정리를 깔끔하게 나눌 수 있어요.',
 concepts:[['GetKeyDown / GetKey / GetKeyUp','누른 프레임, 누르는 동안, 뗀 프레임에서 각각 true가 되는 입력 함수.']]});

QB({id:'x102',cat:'unity',stage:2,level:1,title:'활: 당기고, 모으고, 놓으면 발사',
 story:'F 키를 누르면 활시위를 걸고(nocked 증가), 누르고 있는 동안 힘이 모이며(power, 초당 2씩, 최대 1), 떼는 순간 모은 힘으로 발사돼요(shot에 기록, power는 0으로). 지금은 GetKey 하나만 써서 제대로 동작하지 않아요.',
 goals:['F 키를 누른 프레임에만 nocked를 1 올린다','F 키를 누르고 있는 동안 매 프레임 power에 2 × Time.deltaTime 을 더한다 (최대 1)','F 키를 뗀 프레임에 power 값을 shot에 저장하고 power를 0으로 되돌린다'],
 limits:['세 가지 입력을 각각 GetKeyDown, GetKey, GetKeyUp 으로 구분해서 쓴다'],
 api:'Input.GetKeyDown / GetKey / GetKeyUp (KeyCode.F), Time.deltaTime, Mathf.Min',
 starter:C`
public int nocked;
public float power;
public float shot;

void Update()
{
    // 지금은 GetKey만 써서 누르고 있는 내내 시위를 걸고, 놓을 때는 아무 일도 없습니다.
    if (Input.GetKey(KeyCode.F))
    {
        nocked++;
    }
}`,
 solution:C`
public int nocked;
public float power;
public float shot;

void Update()
{
    if (Input.GetKeyDown(KeyCode.F))
    {
        nocked++;
    }
    if (Input.GetKey(KeyCode.F))
    {
        power = Mathf.Min(power + 2f * Time.deltaTime, 1f);
    }
    if (Input.GetKeyUp(KeyCode.F))
    {
        shot = power;
        power = 0f;
    }
}`,
 rules:[
  has('GetKeyDown 사용',/Input\.GetKeyDown\s*\(/,'누른 순간은 GetKeyDown으로 감지해요.','"누른 프레임 한 번"은 Input.GetKeyDown 으로 감지합니다.'),
  has('GetKey 사용',/Input\.GetKey\s*\(/,'누르는 동안은 GetKey로 감지해요.','"누르고 있는 동안"은 Input.GetKey 로 감지합니다.'),
  has('GetKeyUp 사용',/Input\.GetKeyUp\s*\(/,'뗀 순간은 GetKeyUp으로 감지해요.','"뗀 프레임 한 번"은 Input.GetKeyUp 으로 감지합니다.')
 ],
 test:(api,ok)=>{
  const I=api.env.Input,T=api.env.Time;
  T.deltaTime=0.125;
  const frames=[{d:1,h:1,u:0},{d:0,h:1,u:0},{d:0,h:1,u:0},{d:0,h:0,u:1},{d:0,h:0,u:0}];
  let f=frames[0];
  I.GetKeyDown=k=>k==='F'&&!!f.d;I.GetKey=k=>k==='F'&&!!f.h;I.GetKeyUp=k=>k==='F'&&!!f.u;
  for(f of frames)api.call('Update');
  const n=api.get('nocked'),sh=api.get('shot'),p=api.get('power');
  ok('시위는 한 번',n===1,'누르고 있는 3프레임 동안에도 시위는 1번만 걸렸어요.',`nocked가 ${n} 입니다. 누른 순간(GetKeyDown)에만 1 올라야 해요.`);
  ok('모은 힘 발사',Math.abs(sh-0.75)<1e-6,'3프레임 동안 모은 힘 0.75가 shot에 저장됐어요.',`shot이 ${sh} 입니다. 3프레임 × 2 × 0.125 = 0.75 여야 해요.`);
  ok('힘 초기화',p===0,'발사 뒤 power가 0으로 돌아왔어요.',`power가 ${p} 입니다. 키를 뗀 뒤에는 0이어야 해요.`);
  f={d:0,h:1,u:0};for(let i=0;i<20;i++)api.call('Update');
  ok('최대 1',api.get('power')<=1,'power가 1을 넘지 않아요.','power가 1을 넘었어요. Mathf.Min으로 제한하세요.');
 },
 hints:['세 함수는 각각 "누른 프레임", "누르는 중 매 프레임", "뗀 프레임"에만 true가 돼요.','power는 GetKey 블록에서 누적하고, GetKeyUp 블록에서 shot으로 옮긴 뒤 0으로 만드세요.','최대값 1은 Mathf.Min으로 제한하세요.'],
 why:'차징 무기는 "시작·유지·해제" 세 입력이 모두 필요해요. GetKeyDown/GetKey/GetKeyUp은 그 세 순간에 딱 맞는 도구입니다.',
 concepts:[['GetKeyDown / GetKey / GetKeyUp','누른 프레임, 누르는 동안, 뗀 프레임에서 각각 true가 되는 입력 함수.'],['충전(차징) 입력','GetKey로 시간을 누적하고 GetKeyUp에서 결과를 확정한다.']]});

QB({id:'x103',cat:'unity',stage:2,level:2,title:'수직 입력은 Update, 속도는 FixedUpdate',
 story:'Rigidbody2D로 비행체를 위아래로 움직이는데, Update 안에서 입력도 읽고 속도도 바로 바꾸고 있어요. 입력은 Update에서 읽어 필드에 저장하고, 속도 적용은 FixedUpdate로 옮겨 주세요.',
 goals:['Update에서는 수직 입력을 읽어 moveY 필드에 저장만 한다','FixedUpdate에서는 저장된 moveY로 Rigidbody2D의 y 속도를 적용한다 (x속도는 유지)'],
 limits:['Update에서는 rb의 속도를 건드리지 않는다','FixedUpdate에서는 Input을 읽지 않는다'],
 api:'Input.GetAxisRaw("Vertical"), rb.velocity',
 starter:C`
using UnityEngine;

public class Flyer : MonoBehaviour
{
    public float speed = 4f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        // 입력과 물리가 한 곳에 섞여 있어요. 나눠 보세요.
        float y = Input.GetAxisRaw("Vertical");
        rb.velocity = new Vector2(rb.velocity.x, y * speed);
    }
}`,
 solution:C`
using UnityEngine;

public class Flyer : MonoBehaviour
{
    public float speed = 4f;
    private Rigidbody2D rb;
    private float moveY;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        moveY = Input.GetAxisRaw("Vertical");
    }

    void FixedUpdate()
    {
        rb.velocity = new Vector2(rb.velocity.x, moveY * speed);
    }
}`,
 rules:[
  inFn('Update에서 입력 읽기','Update',/Input\.GetAxis(?:Raw)?\s*\(/,'입력은 Update에서 읽어요.','Update 안에서 Input.GetAxisRaw("Vertical") 로 입력을 읽어 필드에 저장하세요.'),
  notIn('Update에서 물리 금지','Update',/\b(?:velocity|linearVelocity|AddForce|MovePosition)\b/,'Update에서 물리를 건드리지 않아요.','Update에서 rb의 속도를 바꾸면 물리 주기와 어긋나요. FixedUpdate로 옮기세요.'),
  inFn('FixedUpdate에서 속도 적용','FixedUpdate',/\b(?:velocity|linearVelocity|AddForce|MovePosition)\b/,'FixedUpdate에서 속도를 적용해요.','FixedUpdate 메서드를 만들어 rb의 속도를 적용하세요.'),
  notIn('FixedUpdate에서 입력 금지','FixedUpdate',/\bInput\s*\./,'FixedUpdate에서 입력을 읽지 않아요.','입력은 Update에서 읽으세요.')
 ],
 test:(api,ok)=>{
  const rb={velocity:{x:3,y:0},linearVelocity:{x:3,y:0}};
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.env.Input.GetAxisRaw=()=>1;
  api.call('Update');
  const vy=()=>Math.max(Math.abs(rb.velocity.y),Math.abs(rb.linearVelocity.y));
  ok('Update는 입력만',vy()===0,'Update는 입력만 읽고 속도는 건드리지 않아요.','Update를 호출했더니 속도가 바뀌었어요. 속도 적용은 FixedUpdate에서 하세요.');
  api.env.Input.GetAxisRaw=()=>0;
  api.call('FixedUpdate');
  const sp=api.get('speed');
  ok('FixedUpdate가 저장된 입력 적용',rb.velocity.y===sp||rb.linearVelocity.y===sp,'FixedUpdate가 저장된 입력으로 속도를 적용해요.',`FixedUpdate 후 속도 y가 ${rb.velocity.y} 입니다. Update에서 저장해 둔 입력을 써야 해요.`);
  ok('x 속도 유지',rb.velocity.x===3||rb.linearVelocity.x===3,'x 속도를 덮어쓰지 않아요.','x 속도가 바뀌었어요. new Vector2(rb.velocity.x, y * speed) 처럼 기존 x를 유지하세요.');
 },
 hints:['Update는 프레임마다, FixedUpdate는 고정된 물리 주기마다 호출돼요.','Update에서 읽은 입력을 FixedUpdate가 쓸 수 있도록 필드에 저장하세요.','x속도는 rb.velocity.x 를 그대로 넘겨 유지하세요.'],
 why:'입력은 프레임마다 확인해야 놓치지 않고, 물리는 고정 주기로 일관되게 적용해야 안정적이에요.',
 concepts:[['Update vs FixedUpdate','Update는 렌더 프레임마다, FixedUpdate는 일정한 물리 주기마다 호출된다. 입력은 Update, 물리 적용은 FixedUpdate에서 한다.']]});

QB({id:'x104',cat:'unity',stage:2,level:2,title:'점프 요청은 Update에서, 실행은 FixedUpdate에서',
 story:'스페이스를 누르면 점프해야 하는데, FixedUpdate 안에서 GetKeyDown을 읽었더니 점프가 가끔 씹혀요(FixedUpdate는 프레임마다 호출되지 않기 때문). Update에서는 "점프 요청" 플래그만 세우고, 실제 점프는 FixedUpdate에서 한 번 실행하게 고쳐 주세요.',
 goals:['Update에서는 스페이스를 누른 프레임에 jumpRequested 를 true로 만든다','FixedUpdate에서는 요청이 있으면 y 속도를 jumpPower로 만들고 요청을 false로 되돌린다 (x속도는 유지)'],
 limits:['Update에서는 rb의 속도를 건드리지 않는다','FixedUpdate에서는 Input을 읽지 않는다'],
 api:'Input.GetKeyDown(KeyCode.Space), rb.velocity',
 starter:C`
using UnityEngine;

public class Jumper : MonoBehaviour
{
    public float jumpPower = 10f;
    private Rigidbody2D rb;
    private bool jumpRequested;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void FixedUpdate()
    {
        // 입력을 FixedUpdate에서 읽으면 가끔 놓쳐요.
        if (Input.GetKeyDown(KeyCode.Space))
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpPower);
        }
    }
}`,
 solution:C`
using UnityEngine;

public class Jumper : MonoBehaviour
{
    public float jumpPower = 10f;
    private Rigidbody2D rb;
    private bool jumpRequested;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            jumpRequested = true;
        }
    }

    void FixedUpdate()
    {
        if (jumpRequested)
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpPower);
            jumpRequested = false;
        }
    }
}`,
 rules:[
  inFn('Update에서 입력 읽기','Update',/Input\.GetKeyDown\s*\(/,'입력은 Update에서 읽어요.','Update 안에서 Input.GetKeyDown(KeyCode.Space) 으로 입력을 읽으세요.'),
  notIn('Update에서 물리 금지','Update',/\b(?:velocity|linearVelocity|AddForce|MovePosition)\b/,'Update에서 물리를 건드리지 않아요.','Update에서는 요청 플래그만 세우고 속도는 FixedUpdate에서 바꾸세요.'),
  inFn('FixedUpdate에서 속도 적용','FixedUpdate',/\b(?:velocity|linearVelocity|AddForce)\b/,'FixedUpdate에서 점프를 적용해요.','FixedUpdate에서 rb의 y 속도를 jumpPower로 바꾸세요.'),
  notIn('FixedUpdate에서 입력 금지','FixedUpdate',/\bInput\s*\./,'FixedUpdate에서 입력을 읽지 않아요.','FixedUpdate는 프레임보다 덜 자주 호출될 수 있어 GetKeyDown을 놓쳐요.')
 ],
 test:(api,ok)=>{
  const rb={velocity:{x:2,y:0},linearVelocity:{x:2,y:0}};
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.env.Input.GetKeyDown=k=>k==='Space';
  api.call('Update');
  const vy=()=>Math.max(Math.abs(rb.velocity.y),Math.abs(rb.linearVelocity.y));
  ok('Update는 요청만',vy()===0,'Update는 점프를 요청만 하고 속도는 건드리지 않아요.','Update를 호출했더니 속도가 바뀌었어요. 속도 적용은 FixedUpdate에서 하세요.');
  api.env.Input.GetKeyDown=()=>false;
  api.call('FixedUpdate');
  const jp=api.get('jumpPower');
  ok('FixedUpdate가 점프 실행',rb.velocity.y===jp||rb.linearVelocity.y===jp,'FixedUpdate가 저장된 요청으로 점프해요.',`FixedUpdate 후 y 속도가 ${rb.velocity.y} 입니다. 요청이 있으면 jumpPower(10)가 되어야 해요.`);
  ok('x 속도 유지',rb.velocity.x===2||rb.linearVelocity.x===2,'x 속도를 덮어쓰지 않아요.','x 속도가 바뀌었어요. rb.velocity.x 를 그대로 유지하세요.');
  rb.velocity={x:2,y:0};rb.linearVelocity={x:2,y:0};
  api.call('FixedUpdate');
  ok('한 번만 점프',vy()===0,'요청은 한 번만 처리돼요.','요청을 처리한 뒤 jumpRequested를 false로 되돌려야 매 물리 틱마다 점프하지 않아요.');
 },
 hints:['FixedUpdate는 프레임보다 덜 자주 호출될 수 있어 GetKeyDown을 놓칠 수 있어요.','Update에서 "점프 요청" 플래그를 세우고, FixedUpdate에서 처리하세요.','처리한 뒤에는 플래그를 꺼야 한 번만 점프해요.'],
 why:'한 번만 일어나는 입력은 Update에서 요청으로 저장하고, 물리 적용은 FixedUpdate에서 처리한 뒤 요청을 지우는 패턴이 안전해요.',
 concepts:[['Update vs FixedUpdate','입력은 Update, 물리 적용은 FixedUpdate에서 한다.'],['입력 요청 플래그','Update에서 플래그를 세우고 FixedUpdate에서 소비한 뒤 지운다.']]});

QB({id:'x105',cat:'unity',stage:2,level:2,title:'힘으로 미는 이동도 FixedUpdate에서',
 story:'공이 좌우 입력에 따라 힘을 받아 굴러가요. 지금은 Update에서 입력을 읽자마자 AddForce를 부르고 있어서 프레임이 빠른 기기에서 힘이 더 많이 쌓여요. 입력은 Update에서 저장하고, 힘은 FixedUpdate에서 가하게 고쳐 주세요.',
 goals:['Update에서는 수평 입력을 읽어 moveX 필드에 저장만 한다','FixedUpdate에서는 저장된 moveX × force 만큼 x 방향으로 AddForce 한다'],
 limits:['Update에서는 rb에 힘을 가하지 않는다','FixedUpdate에서는 Input을 읽지 않는다'],
 api:'Input.GetAxisRaw("Horizontal"), rb.AddForce(Vector2)',
 starter:C`
using UnityEngine;

public class Ball : MonoBehaviour
{
    public float force = 20f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        // 입력과 물리가 한 곳에 섞여 있어요. 나눠 보세요.
        float x = Input.GetAxisRaw("Horizontal");
        rb.AddForce(new Vector2(x * force, 0f));
    }
}`,
 solution:C`
using UnityEngine;

public class Ball : MonoBehaviour
{
    public float force = 20f;
    private Rigidbody2D rb;
    private float moveX;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        moveX = Input.GetAxisRaw("Horizontal");
    }

    void FixedUpdate()
    {
        rb.AddForce(new Vector2(moveX * force, 0f));
    }
}`,
 rules:[
  inFn('Update에서 입력 읽기','Update',/Input\.GetAxis(?:Raw)?\s*\(/,'입력은 Update에서 읽어요.','Update 안에서 Input.GetAxisRaw("Horizontal") 로 입력을 읽어 필드에 저장하세요.'),
  notIn('Update에서 물리 금지','Update',/\b(?:velocity|linearVelocity|AddForce|MovePosition)\b/,'Update에서 물리를 건드리지 않아요.','Update에서 힘을 가하면 물리 주기와 어긋나요. FixedUpdate로 옮기세요.'),
  inFn('FixedUpdate에서 힘 적용','FixedUpdate',/\bAddForce\b/,'FixedUpdate에서 힘을 가해요.','FixedUpdate 메서드를 만들어 rb.AddForce 를 호출하세요.'),
  notIn('FixedUpdate에서 입력 금지','FixedUpdate',/\bInput\s*\./,'FixedUpdate에서 입력을 읽지 않아요.','입력은 Update에서 읽으세요.')
 ],
 test:(api,ok)=>{
  const rb=api.mk.rb();api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.env.Input.GetAxisRaw=()=>1;
  api.call('Update');
  ok('Update는 입력만',rb.forces.length===0,'Update는 입력만 읽고 힘은 가하지 않아요.','Update를 호출했더니 힘이 가해졌어요. 힘은 FixedUpdate에서 가하세요.');
  api.env.Input.GetAxisRaw=()=>0;
  api.call('FixedUpdate');
  ok('FixedUpdate가 저장된 입력 적용',rb.forces.length===1&&rb.forces[0][0].x===20,'FixedUpdate가 저장된 입력으로 힘(20)을 가해요.',`FixedUpdate 후 힘이 ${rb.forces.length}번, ${rb.forces[0]?rb.forces[0][0].x:'-'} 입니다. Update에서 저장한 입력 × force(20)를 한 번 가해야 해요.`);
 },
 hints:['Update는 프레임마다, FixedUpdate는 물리 주기마다 호출돼요.','Update에서 읽은 입력을 필드에 저장해 두세요.','FixedUpdate에서 rb.AddForce(new Vector2(moveX * force, 0f)) 를 호출하세요.'],
 why:'힘은 물리 틱마다 한 번씩 가해야 일정해요. Update에서 가하면 프레임이 많은 기기에서 더 큰 힘이 누적됩니다.',
 concepts:[['Update vs FixedUpdate','입력은 Update, 물리 적용은 FixedUpdate에서 한다.'],['Rigidbody2D.AddForce','물체에 힘을 가한다. 물리 주기(FixedUpdate)에서 부른다.']]});

QB({id:'x106',cat:'unity',stage:2,level:3,title:'수직 속도에도 deltaTime을 곱했더니',
 story:'FixedUpdate에서 Rigidbody2D를 위아래로 움직이는 두 방법을 쓰고 있어요. ApplyVelocity를 쓰면 느리고, ApplyStep을 쓰면 아예 움직이지 않아요. 두 메서드 모두 초당 speed 유닛으로 움직이게 고쳐 주세요.',
 goals:['ApplyVelocity(): rb.velocity 의 y를 dirY * speed 로 설정한다 (x는 유지)','ApplyStep(): rb.MovePosition으로 y를 dirY * speed * Time.fixedDeltaTime 만큼 옮긴 위치를 넘긴다 (x는 유지)'],
 limits:['ApplyVelocity 안에서는 Time.deltaTime 을 쓰지 않는다','ApplyStep 에서는 현재 위치(rb.position)에서 출발한다'],
 api:'rb.velocity, rb.position, rb.MovePosition(Vector2), Time.fixedDeltaTime',
 starter:C`
public float speed = 4f;
public float dirY = 1f;
private Rigidbody2D rb;

void Awake()
{
    rb = GetComponent<Rigidbody2D>();
}

void ApplyVelocity()
{
    rb.velocity = new Vector2(rb.velocity.x, dirY * speed * Time.deltaTime);
}

void ApplyStep()
{
    rb.MovePosition(new Vector2(rb.position.x, rb.position.y));
}`,
 solution:C`
public float speed = 4f;
public float dirY = 1f;
private Rigidbody2D rb;

void Awake()
{
    rb = GetComponent<Rigidbody2D>();
}

void ApplyVelocity()
{
    rb.velocity = new Vector2(rb.velocity.x, dirY * speed);
}

void ApplyStep()
{
    float step = dirY * speed * Time.fixedDeltaTime;
    rb.MovePosition(new Vector2(rb.position.x, rb.position.y + step));
}`,
 rules:[
  notIn('velocity에 deltaTime 금지','ApplyVelocity',/deltaTime/,'velocity에는 시간을 곱하지 않았어요.','velocity는 이미 초당 속도예요. 여기에 deltaTime을 또 곱하면 이동이 너무 느려져요.'),
  inFn('MovePosition에 시간 곱하기','ApplyStep',/(?:fixedDeltaTime|deltaTime)/,'MovePosition에는 시간을 곱해 한 스텝의 이동량을 만들어요.','MovePosition에 넘기는 건 위치예요. 속도 × 시간(Time.fixedDeltaTime)으로 이동량을 만드세요.')
 ],
 test:(api,ok)=>{
  const T=api.env.Time;T.deltaTime=0.02;T.fixedDeltaTime=0.02;
  const rb={velocity:{x:1,y:0},linearVelocity:{x:1,y:0},position:{x:6,y:5},MovePosition(p){this.moved=p}};
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.call('ApplyVelocity');
  const vy=rb.velocity.y,ly=rb.linearVelocity.y;
  ok('속도 적용',vy===4||ly===4,'y 속도가 4(초당 유닛)예요.',`y 속도가 ${vy} 입니다. dirY(1) × speed(4) = 4 여야 해요. deltaTime을 곱하면 0.08이 돼요.`);
  api.call('ApplyStep');
  const m=rb.moved;
  ok('MovePosition 호출',!!m,'MovePosition을 호출했어요.','ApplyStep 안에서 rb.MovePosition(...)을 호출하세요.');
  if(m){
   ok('한 스텝 이동량',Math.abs(m.y-5.08)<1e-6,'현재 위치에서 한 스텝(0.08유닛)만큼 옮겼어요.',`MovePosition y가 ${m.y} 입니다. 5 + 4 × 0.02 = 5.08 이어야 해요.`);
   ok('x 유지',m.x===6,'x 위치는 유지했어요.','x 위치가 바뀌었어요. rb.position.x 를 그대로 넘기세요.');
  }
 },
 hints:['넘기는 값이 "초당 속도"인지 "이번 스텝의 위치"인지에 따라 deltaTime을 곱할지가 달라요.','velocity는 이미 초당 속도라서 Rigidbody가 시간을 알아서 곱해 줘요.','MovePosition은 위치를 넘기므로 이동량(속도 × fixedDeltaTime)을 직접 더하세요.'],
 why:'값이 "속도"인지 "위치/이동량"인지 구분하면 deltaTime을 곱할지 말지가 정해져요. velocity에는 곱하지 않고, 직접 위치를 계산하는 MovePosition에는 곱합니다.',
 concepts:[['속도 vs 이동량','속도(초당 거리)는 엔진이 시간에 맞춰 적용하고, 이동량은 직접 속도 × 시간으로 계산해야 한다.'],['Time.fixedDeltaTime','물리 업데이트 간격(기본 0.02초).']]});

QB({id:'x107',cat:'unity',stage:2,level:3,title:'속도와 Translate, 곱할 곳 구분하기',
 story:'엘리베이터를 두 방식으로 움직여요. Rigidbody2D 속도로 움직이는 Lift()는 너무 느리고, transform.Translate로 움직이는 Slide()는 프레임이 빠를수록 휙휙 날아가요. 어디에 deltaTime을 곱해야 하는지 바로잡아 주세요.',
 goals:['Lift(): rb.velocity 의 y를 dirY * speed 로 설정한다 (x는 유지)','Slide(): transform.Translate 로 y를 dirY * speed * Time.deltaTime 만큼 이동한다'],
 limits:['Lift 안에서는 Time.deltaTime 을 쓰지 않는다','Slide 에서는 Time.deltaTime 을 곱한다'],
 api:'rb.velocity, transform.Translate(x, y, z), Time.deltaTime',
 starter:C`
public float speed = 3f;
public float dirY = 1f;
private Rigidbody2D rb;

void Awake()
{
    rb = GetComponent<Rigidbody2D>();
}

void Lift()
{
    rb.velocity = new Vector2(rb.velocity.x, dirY * speed * Time.deltaTime);
}

void Slide()
{
    transform.Translate(0f, dirY * speed, 0f);
}`,
 solution:C`
public float speed = 3f;
public float dirY = 1f;
private Rigidbody2D rb;

void Awake()
{
    rb = GetComponent<Rigidbody2D>();
}

void Lift()
{
    rb.velocity = new Vector2(rb.velocity.x, dirY * speed);
}

void Slide()
{
    transform.Translate(0f, dirY * speed * Time.deltaTime, 0f);
}`,
 rules:[
  notIn('velocity에 deltaTime 금지','Lift',/deltaTime/,'velocity에는 시간을 곱하지 않았어요.','velocity는 이미 초당 속도예요. deltaTime을 곱하지 마세요.'),
  inFn('Translate에 deltaTime 곱하기','Slide',/Time\.deltaTime/,'Translate에는 시간을 곱했어요.','Translate는 이동량을 받아요. speed × Time.deltaTime 으로 이동량을 만드세요.')
 ],
 test:(api,ok)=>{
  const T=api.env.Time;T.deltaTime=0.5;
  const rb=api.mk.rb();rb.velocity={x:1,y:0};api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.call('Lift');
  ok('속도 적용',rb.velocity.y===3,'y 속도가 3(초당 유닛)이고 x는 유지돼요.',`y 속도가 ${rb.velocity.y} 입니다. dirY(1) × speed(3) = 3 이어야 해요.`);
  const y0=api.transform.position.y;
  api.call('Slide');
  const dy=api.transform.position.y-y0;
  ok('이동량',Math.abs(dy-1.5)<1e-6,'한 프레임(0.5초)에 1.5유닛 이동했어요.',`y가 ${dy} 만큼 움직였어요. 3 × 0.5초 = 1.5 여야 해요.`);
 },
 hints:['velocity는 "초당 속도"라서 엔진이 시간을 곱해 줘요.','Translate는 "이번에 움직일 거리"를 받으므로 직접 시간을 곱해야 해요.','Lift에서는 deltaTime을 빼고, Slide에서는 추가하세요.'],
 why:'API마다 받는 값의 단위가 달라요. 속도를 받으면 곱하지 않고, 거리(이동량)를 받으면 시간을 곱합니다.',
 concepts:[['속도 vs 이동량','속도(초당 거리)는 엔진이 시간에 맞춰 적용하고, 이동량은 직접 속도 × 시간으로 계산해야 한다.'],['Time.deltaTime','직전 프레임과 이번 프레임 사이의 시간(초).']]});

QB({id:'x108',cat:'unity',stage:2,level:3,title:'AddForce와 MovePosition, 시간을 곱할 곳은?',
 story:'넉백(밀려남) 처리를 두 방법으로 만들었어요. Knock()은 AddForce로 한 번 세게 밀고, Drift()는 MovePosition으로 천천히 흘러가요. 그런데 Knock이 약하고 Drift는 아예 움직이지 않아요. 어디에 시간을 곱해야 하는지 바로잡아 주세요.',
 goals:['Knock(): rb.AddForce 로 x 방향에 dirX * force 를 가한다 (시간을 곱하지 않는다)','Drift(): rb.MovePosition으로 x를 dirX * drift * Time.fixedDeltaTime 만큼 옮긴 위치를 넘긴다 (y는 유지)'],
 limits:['Knock 안에서는 deltaTime 을 쓰지 않는다','Drift 에서는 현재 위치(rb.position)에서 출발한다'],
 api:'rb.AddForce(Vector2), rb.position, rb.MovePosition(Vector2), Time.fixedDeltaTime',
 starter:C`
public float force = 10f;
public float drift = 2f;
public float dirX = 1f;
private Rigidbody2D rb;

void Awake()
{
    rb = GetComponent<Rigidbody2D>();
}

void Knock()
{
    rb.AddForce(new Vector2(dirX * force * Time.fixedDeltaTime, 0f));
}

void Drift()
{
    rb.MovePosition(new Vector2(rb.position.x, rb.position.y));
}`,
 solution:C`
public float force = 10f;
public float drift = 2f;
public float dirX = 1f;
private Rigidbody2D rb;

void Awake()
{
    rb = GetComponent<Rigidbody2D>();
}

void Knock()
{
    rb.AddForce(new Vector2(dirX * force, 0f));
}

void Drift()
{
    float step = dirX * drift * Time.fixedDeltaTime;
    rb.MovePosition(new Vector2(rb.position.x + step, rb.position.y));
}`,
 rules:[
  notIn('AddForce에 시간 금지','Knock',/deltaTime/,'AddForce에는 시간을 곱하지 않았어요.','AddForce는 엔진이 물리 스텝에 맞춰 적용해요. 여기에 deltaTime을 곱하면 힘이 너무 약해져요.'),
  inFn('MovePosition에 시간 곱하기','Drift',/(?:fixedDeltaTime|deltaTime)/,'MovePosition에는 시간을 곱해 한 스텝의 이동량을 만들어요.','MovePosition에 넘기는 건 위치예요. 속도 × 시간(Time.fixedDeltaTime)으로 이동량을 만드세요.')
 ],
 test:(api,ok)=>{
  const T=api.env.Time;T.deltaTime=0.02;T.fixedDeltaTime=0.02;
  const rb={forces:[],velocity:{x:0,y:0},linearVelocity:{x:0,y:0},position:{x:3,y:8},AddForce(f){this.forces.push(f)},MovePosition(p){this.moved=p}};
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.call('Knock');
  const f=rb.forces[0];
  ok('힘 적용',!!f&&Math.abs(f.x-10)<1e-6,'x 방향으로 힘 10을 한 번 가해요.',`힘이 ${f?f.x:'없음'} 입니다. dirX(1) × force(10) = 10 이어야 해요. deltaTime을 곱하지 마세요.`);
  api.call('Drift');
  const m=rb.moved;
  ok('MovePosition 호출',!!m,'MovePosition을 호출했어요.','Drift 안에서 rb.MovePosition(...)을 호출하세요.');
  if(m){
   ok('한 스텝 이동량',Math.abs(m.x-3.04)<1e-6,'현재 위치에서 한 스텝(0.04유닛)만큼 옮겼어요.',`MovePosition x가 ${m.x} 입니다. 3 + 2 × 0.02 = 3.04 여야 해요.`);
   ok('y 유지',m.y===8,'y 위치는 유지했어요.','y 위치가 바뀌었어요. rb.position.y 를 그대로 넘기세요.');
  }
 },
 hints:['AddForce는 힘을 받아 엔진이 알아서 시간에 맞춰 적용해요.','MovePosition은 위치를 받으므로 이동량(속도 × 시간)을 직접 만들어야 해요.','Knock에서는 시간을 빼고, Drift에서는 현재 위치에 이동량을 더하세요.'],
 why:'엔진이 시간을 처리해 주는 API(velocity, AddForce)에는 시간을 곱하지 않고, 위치를 직접 계산해 넘기는 API(MovePosition, Translate)에는 곱합니다.',
 concepts:[['속도 vs 이동량','엔진이 시간을 곱해 주는 값(속도·힘)과 직접 곱해야 하는 값(이동량)을 구분한다.'],['Time.fixedDeltaTime','물리 업데이트 간격(기본 0.02초).']]});

QB({id:'x46',cat:'csharp',stage:1,level:1,title:'Inspector를 보기 좋게: Header·Range·Tooltip',
 story:'카메라 흔들림 설정을 기획자가 Inspector에서 조절해요. 그런데 숫자만 덩그러니 보이고, 강도에 터무니없는 값을 넣어서 화면이 깨지는 일이 잦아요. 강도는 0~1 슬라이더로 제한하고, 설명 글과 구분 제목을 붙여서 누가 봐도 알 수 있게 만들어 주세요.',
 goals:['"흔들림" 이라는 제목(Header)이 Inspector에 표시된다','intensity(float, 기본값 0.5)는 0 ~ 1 사이의 슬라이더로 조절한다','duration(float, 기본값 0.3)에는 "흔들리는 시간(초)" 라는 툴팁이 붙는다','두 값 모두 Inspector에서 수정할 수 있지만 public 은 아니다'],
 limits:['intensity와 duration 은 public으로 선언하지 않는다','Header, Range, Tooltip 속성을 사용한다'],
 starter:C`
using UnityEngine;

public class ShakeSettings : MonoBehaviour
{
    // TODO: intensity 선언 (0 ~ 1 슬라이더)

    // TODO: duration 선언 (툴팁)
}`,
 solution:C`
using UnityEngine;

public class ShakeSettings : MonoBehaviour
{
    [Header("흔들림")]
    [Range(0f, 1f)]
    [SerializeField] private float intensity = 0.5f;

    [Tooltip("흔들리는 시간(초)")]
    [SerializeField] private float duration = 0.3f;
}`,
 rules:[
  has('Header',/\[\s*Header\s*\(\s*"[^"]*"\s*\)\s*\]/,'Header 로 제목을 붙였어요.','[Header("흔들림")] 으로 Inspector에 구분 제목을 붙이세요.'),
  has('Range',/\[\s*Range\s*\(\s*0(?:\.0*)?f?\s*,\s*1(?:\.0*)?f?\s*\)\s*\]/,'Range(0, 1) 슬라이더를 붙였어요.','[Range(0f, 1f)] 를 intensity 위에 붙이세요.'),
  has('intensity 선언',/\[SerializeField\]\s*(?:private\s+)?float\s+intensity\s*=\s*0\.5f?\s*;/,'intensity를 [SerializeField] private float 로 선언했어요.','intensity는 [SerializeField] private float, 기본값 0.5f 로 선언하세요.'),
  has('Tooltip',/\[\s*Tooltip\s*\(\s*"[^"]*"\s*\)\s*\]/,'Tooltip 을 붙였어요.','[Tooltip("흔들리는 시간(초)")] 를 duration 위에 붙이세요.'),
  has('duration 선언',/\[SerializeField\]\s*(?:private\s+)?float\s+duration\s*=\s*0\.3f?\s*;/,'duration을 [SerializeField] private float 로 선언했어요.','duration은 [SerializeField] private float, 기본값 0.3f 로 선언하세요.'),
  no('public 금지',/\bpublic\s+float\s+(?:intensity|duration)\b/,'값을 public 으로 열지 않았어요.','public 대신 [SerializeField] private 을 쓰세요.')
 ],
 hints:['Inspector에 꾸밈을 더하는 것은 대괄호 [ ] 속성(Attribute)이에요.','[Header("제목")], [Range(최소, 최대)], [Tooltip("설명")] 을 변수 위에 붙여요.','Range 는 float/int 변수에 슬라이더를 만들고 값을 범위 안으로 제한해요.'],
 why:'속성은 코드 로직은 바꾸지 않고 Inspector 화면만 다듬어요. Range 로 잘못된 값을 막고, Header 와 Tooltip 으로 설명을 붙이면 기획자가 코드를 열어 보지 않고도 안전하게 조절할 수 있어요.',
 concepts:[['Inspector 속성(Attribute)','[Header], [Range], [Tooltip] 처럼 변수 위에 붙여 Inspector 표시와 입력 방식을 바꾸는 표시.'],['[SerializeField]','private 필드를 Inspector 에 보이게 한다.']]});

QB({id:'x47',cat:'csharp',stage:1,level:1,title:'체력은 메서드로만 바뀌게',
 story:'체력(Hp)을 다른 스크립트가 직접 바꾸다 보니 체력이 음수가 되거나 최대치를 넘는 버그가 생겼어요. Hp는 밖에서 읽기만 가능하게 하고, 피해와 회복은 메서드로만 처리하되 항상 0 ~ maxHp 범위를 지키게 해 주세요.',
 goals:['maxHp(int, 기본값 100)는 Inspector에서 수정할 수 있다','Hp(int)는 밖에서 읽기만 가능한 프로퍼티이다','Awake에서 Hp를 maxHp로 맞춘다','TakeDamage(n)은 Hp를 줄이되 0 아래로 내려가지 않는다','Heal(n)은 Hp를 늘리되 maxHp를 넘지 않는다'],
 limits:['maxHp는 public으로 선언하지 않는다','Hp를 바꾸는 코드는 이 클래스 안에만 둔다'],
 starter:C`
using UnityEngine;

public class Unit : MonoBehaviour
{
    // TODO: maxHp, Hp 선언

    void Awake()
    {
    }

    public void TakeDamage(int n)
    {
    }

    public void Heal(int n)
    {
    }
}`,
 solution:C`
using UnityEngine;

public class Unit : MonoBehaviour
{
    [SerializeField] private int maxHp = 100;
    public int Hp { get; private set; }

    void Awake()
    {
        Hp = maxHp;
    }

    public void TakeDamage(int n)
    {
        Hp -= n;
        if (Hp < 0) Hp = 0;
    }

    public void Heal(int n)
    {
        Hp += n;
        if (Hp > maxHp) Hp = maxHp;
    }
}`,
 rules:[
  has('maxHp 선언',/\[SerializeField\]\s*(?:private\s+)?int\s+maxHp\s*=\s*100\s*;/,'maxHp를 [SerializeField] int 로 선언했어요.','maxHp는 [SerializeField] private int, 기본값 100 으로 선언하세요.'),
  has('읽기 전용 Hp',/\bpublic\s+int\s+Hp\s*\{\s*get;\s*(?:private|protected)\s+set;\s*\}/,'Hp를 밖에서는 읽기만 되는 프로퍼티로 공개했어요.','public int Hp { get; private set; } 로 선언하세요.'),
  no('public 필드 금지',/\bpublic\s+int\s+(?:maxHp|hp)\b/,'체력 값을 public 필드로 열지 않았어요.','체력은 프로퍼티와 메서드로만 다루세요.')
 ],
 test:(api,ok)=>{
  api.call('Awake');
  ok('시작 체력',api.get('Hp')===100,'시작 체력은 maxHp(100)예요.',`Hp가 ${api.get('Hp')} 입니다. Awake에서 maxHp 로 맞추세요.`);
  api.call('TakeDamage',30);
  ok('피해',api.get('Hp')===70,'피해 30을 받아 70이 됐어요.',`Hp가 ${api.get('Hp')} 입니다. 70이어야 해요.`);
  api.call('TakeDamage',500);
  ok('0 아래 금지',api.get('Hp')===0,'체력은 0 아래로 내려가지 않아요.',`Hp가 ${api.get('Hp')} 입니다. 0 에서 멈춰야 해요.`);
  api.call('Heal',20);
  ok('회복',api.get('Hp')===20,'20 회복했어요.',`Hp가 ${api.get('Hp')} 입니다. 20이어야 해요.`);
  api.call('Heal',1000);
  ok('최대 초과 금지',api.get('Hp')===100,'체력은 maxHp 를 넘지 않아요.',`Hp가 ${api.get('Hp')} 입니다. 100 에서 멈춰야 해요.`);
 },
 hints:['밖에서 읽기만 되는 값은 { get; private set; } 프로퍼티예요.','범위 지키기는 값을 바꾼 직후 if 로 확인해서 되돌리면 돼요.','피해 후에는 0 보다 작은지, 회복 후에는 maxHp 보다 큰지 확인하세요.'],
 why:'값을 직접 열어 두면 아무 곳에서나 규칙을 어길 수 있어요. 값은 private 으로 감추고 규칙(범위)을 지키는 메서드로만 바꾸게 하면, 규칙이 한 곳에 모여 버그가 줄어요.',
 concepts:[['캡슐화','값을 숨기고 메서드를 통해서만 바꾸게 해 규칙(범위, 유효성)을 한 곳에서 지킨다.'],['private set 프로퍼티','밖에서는 읽기만, 안에서만 수정할 수 있는 값.']]});

QB({id:'x72',cat:'csharp',stage:1,level:1,title:'열쇠를 모으면 열리는 문 (내부 판단은 private)',
 story:'문은 열쇠를 충분히 모아야 열려요. 필요한 열쇠 수는 기획자가 Inspector에서 정하고, 열쇠가 충분한지 판단하는 내부 규칙은 밖에 보일 필요가 없어요. 밖에는 AddKey()와 TryOpen() 두 동작만 공개하고, 열렸는지(IsOpen)는 읽기만 가능하게 하세요.',
 goals:['requiredKeys(int, 기본값 2)를 Inspector에서 수정할 수 있다','AddKey()는 가진 열쇠 수를 1 늘린다 (열쇠 수 자체는 밖에 공개하지 않는다)','내부 메서드 HasEnoughKeys()는 열쇠가 requiredKeys 이상이면 true 이다 (private)','TryOpen()은 열쇠가 충분하면 문을 열고 true, 아니면 false 를 반환한다','IsOpen(bool)은 밖에서 읽기만 가능하다'],
 limits:['requiredKeys와 열쇠 수 필드는 public이 아니다','HasEnoughKeys 는 private 이다'],
 starter:C`
using UnityEngine;

public class Door : MonoBehaviour
{
    public int requiredKeys = 2;
    public int keys;
    public bool isOpen;

    public void AddKey()
    {
    }

    public bool TryOpen()
    {
        return false;
    }
}`,
 solution:C`
using UnityEngine;

public class Door : MonoBehaviour
{
    [SerializeField] private int requiredKeys = 2;
    private int keys;
    public bool IsOpen { get; private set; }

    public void AddKey()
    {
        keys++;
    }

    private bool HasEnoughKeys()
    {
        return keys >= requiredKeys;
    }

    public bool TryOpen()
    {
        if (!HasEnoughKeys()) return false;
        IsOpen = true;
        return true;
    }
}`,
 rules:[
  has('requiredKeys 선언',/\[SerializeField\]\s*(?:private\s+)?int\s+requiredKeys\s*=\s*2\s*;/,'requiredKeys를 [SerializeField] int 로 선언했어요.','requiredKeys는 [SerializeField] private int, 기본값 2 로 선언하세요.'),
  no('public 필드 금지',/\bpublic\s+(?:int|bool)\s+(?:requiredKeys|keys|isOpen)\b/,'내부 값을 public 으로 열지 않았어요.','requiredKeys, keys, isOpen 을 public 필드로 두지 마세요.'),
  has('private 판단 메서드',/\bprivate\s+bool\s+HasEnoughKeys\s*\(/,'HasEnoughKeys 는 private 이에요.','private bool HasEnoughKeys() 로 만드세요.'),
  has('읽기 전용 IsOpen',/\bpublic\s+bool\s+IsOpen\s*\{\s*get;\s*(?:private|protected)\s+set;\s*\}/,'IsOpen 은 밖에서 읽기만 돼요.','public bool IsOpen { get; private set; } 로 선언하세요.')
 ],
 test:(api,ok)=>{
  ok('열쇠가 모자람',api.call('TryOpen')===false&&api.get('IsOpen')===false,'열쇠가 없으면 열리지 않아요.','열쇠가 부족하면 false 를 반환하고 문은 닫혀 있어야 해요.');
  api.call('AddKey');
  ok('아직 부족',api.call('TryOpen')===false,'열쇠 1개로는 아직 안 열려요.','requiredKeys(2) 미만이면 false 예요.');
  api.call('AddKey');
  ok('열림',api.call('TryOpen')===true&&api.get('IsOpen')===true,'열쇠 2개를 모으면 열려요.','열쇠가 충분하면 true 를 반환하고 IsOpen 이 true 여야 해요.');
 },
 hints:['밖에 보일 필요 없는 값과 판단은 private 이에요.','밖에 공개하는 건 동작(AddKey, TryOpen)과 읽기 전용 상태(IsOpen)뿐이에요.','TryOpen 안에서 private 메서드 HasEnoughKeys 를 불러 쓰세요.'],
 why:'공개 범위를 "필요한 것만"으로 줄이면 사용법이 단순해지고, 내부 규칙을 바꿔도 다른 코드가 깨지지 않아요. 판단 로직은 private 메서드로 나눠 두면 읽기도 좋아요.',
 concepts:[['접근 제한자와 캡슐화','공개는 필요한 것만, 내부 판단과 상태는 private 으로 숨긴다.'],['private 메서드','클래스 안에서만 쓰는 도우미 메서드.']]});

QB({id:'x51',cat:'csharp',stage:1,level:3,title:'배율을 곱했더니 컴파일 오류가 난다',
 story:'데미지 배율(1.5배 등)을 곱하는 코드가 컴파일되지 않아요: CS0266 float 를 int 로 변환할 수 없습니다. 반올림해서 넣는 경우와 소수점을 버리는 경우를 각각 올바르게 바꿔 주세요.',
 goals:['CalcDamage(baseDmg, mult): baseDmg × mult 를 반올림한 정수를 반환한다 (10, 1.5 → 15 / 7, 1.2 → 8 / 9, 1.3 → 12)','CalcShield(dmg, reduce): dmg × (1 − reduce) 의 소수점을 버린 정수를 반환한다 (10, 0.25 → 7 / 9, 0.5 → 4)'],
 limits:['반올림은 Mathf.RoundToInt, 버림은 (int) 캐스팅을 사용한다'],
 api:'Mathf.RoundToInt(float), (int)값',
 starter:C`
int CalcDamage(int baseDmg, float mult)
{
    return baseDmg * mult;
}

int CalcShield(int dmg, float reduce)
{
    return dmg * (1f - reduce);
}`,
 solution:C`
int CalcDamage(int baseDmg, float mult)
{
    return Mathf.RoundToInt(baseDmg * mult);
}

int CalcShield(int dmg, float reduce)
{
    return (int)(dmg * (1f - reduce));
}`,
 rules:[],
 test:(api,ok)=>{
  const d=(a,b)=>api.call('CalcDamage',a,b),s=(a,b)=>api.call('CalcShield',a,b);
  ok('반올림',d(10,1.5)===15&&d(7,1.2)===8&&d(9,1.3)===12,'10×1.5=15, 7×1.2=8.4→8, 9×1.3=11.7→12 로 반올림해요.',`결과 ${d(10,1.5)}, ${d(7,1.2)}, ${d(9,1.3)} 입니다. 15, 8, 12 여야 해요.`);
  ok('버림',s(10,0.25)===7&&s(9,0.5)===4&&s(8,0)===8,'7.5→7, 4.5→4, 8→8 로 소수점을 버려요.',`결과 ${s(10,0.25)}, ${s(9,0.5)}, ${s(8,0)} 입니다. 7, 4, 8 이어야 해요.`);
 },
 hints:['int × float 의 결과는 float 라서 int 에 바로 담을 수 없어요.','float 를 int 로 바꾸는 방법은 두 가지: 반올림(Mathf.RoundToInt)과 소수점 버림((int) 캐스팅).','반올림이 필요한 곳과 버림이 필요한 곳을 문제에서 구분해 보세요.'],
 why:'계산에 소수가 끼면 결과도 소수가 돼요. 정수로 되돌릴 때 "반올림할지 버릴지"는 규칙으로 정해야 해요. 체력·데미지는 보통 반올림, 방어로 줄어드는 양은 버림처럼 의도를 코드에 드러내세요.',
 concepts:[['암시적 변환 오류(CS0266)','float 를 int 에 그대로 넣을 수 없다. 변환 방식을 직접 골라야 한다.'],['Mathf.RoundToInt vs (int)','RoundToInt 는 반올림, (int) 캐스팅은 소수점 버림.']]});

QB({id:'x52',cat:'csharp',stage:1,level:3,title:'평균 점수가 정수로만 나온다',
 story:'점수 배열의 평균을 구하는데 항상 정수로만 나와요. 점수가 1점, 2점이면 평균이 1.5인데 1로 표시돼요. 그리고 점수가 하나도 없을 때는 0으로 나누다가 문제가 생기죠. 두 가지를 모두 바로잡아 주세요.',
 goals:['Average(scores): 점수들의 평균을 소수점까지 계산해 float 로 반환한다 ([1, 2] → 1.5)','점수가 하나도 없으면 0을 반환한다'],
 limits:['합을 구한 뒤 float 로 변환해서 나눈다','반복문으로 합을 구한다'],
 starter:C`
float Average(int[] scores)
{
    int sum = 0;
    for (int i = 0; i < scores.Length; i++)
    {
        sum += scores[i];
    }
    return sum / scores.Length;
}`,
 solution:C`
float Average(int[] scores)
{
    if (scores.Length == 0) return 0f;
    int sum = 0;
    for (int i = 0; i < scores.Length; i++)
    {
        sum += scores[i];
    }
    return (float)sum / scores.Length;
}`,
 rules:[],
 test:(api,ok)=>{
  const a=x=>{try{return api.call('Average',x)}catch(e){return 'ERR'}};
  ok('소수점 평균',Math.abs(a([1,2])-1.5)<1e-6&&Math.abs(a([80,90,95])-88.3333)<1e-3,'평균을 소수점까지 계산해요.',`[1,2] → ${a([1,2])}, [80,90,95] → ${a([80,90,95])}. 1.5, 88.33 이어야 해요.`);
  ok('빈 배열',a([])===0,'점수가 없으면 0이에요.','점수가 없을 때 0을 반환하세요 (0으로 나누지 마세요).');
  ok('하나',a([7])===7,'점수 하나는 그대로예요.',`[7] → ${a([7])}. 7 이어야 해요.`);
 },
 hints:['int 를 int 로 나누면 소수점이 사라져요.','나누기 전에 한쪽을 float 로 바꾸세요: (float)sum / 개수.','개수가 0 이면 나누지 말고 먼저 0 을 반환하세요.'],
 why:'정수끼리의 나눗셈은 소수점을 버려요. 평균처럼 소수가 필요한 계산은 나누기 전에 float 로 바꾸고, 나누는 수가 0 인 경우를 먼저 걸러 내세요.',
 concepts:[['정수 나눗셈','int / int 는 소수점을 버린 몫만 남는다. 한쪽을 float 로 바꿔야 한다.'],['0으로 나누기 방지','나누는 수가 0 일 수 있으면 먼저 검사한다.']]});

QB({id:'x53',cat:'csharp',stage:1,level:3,title:'퍼센트가 계속 0이 나온다 (곱셈이 먼저)',
 story:'경험치 진행도를 정수 퍼센트로 보여 주려는데 계산 결과가 계속 0이에요. 50 / 200 × 100 을 코드로 쓰면 50 / 200 이 먼저 0이 되어 버려요. float 를 쓰지 않고 계산 순서만 바꿔서 해결해 주세요.',
 goals:['Percent(exp, need): exp / need 를 0 ~ 100 정수 퍼센트로 반환한다 (50, 200 → 25 / 1, 3 → 33)','need 가 0 이하이면 0을 반환한다','결과는 100을 넘지 않는다 (exp 가 need 보다 커도 100)'],
 limits:['float 나 Mathf 를 쓰지 않고 int 연산만으로 해결한다'],
 starter:C`
int Percent(int exp, int need)
{
    return exp / need * 100;
}`,
 solution:C`
int Percent(int exp, int need)
{
    if (need <= 0) return 0;
    int p = exp * 100 / need;
    if (p > 100) p = 100;
    return p;
}`,
 rules:[no('float 금지',/\bfloat\b|\bMathf\b|\bdouble\b/,'정수 연산만 사용했어요.','float, Mathf 없이 곱셈을 먼저 하는 방식으로 풀어 보세요.')],
 test:(api,ok)=>{
  const p=(a,b)=>{try{return api.call('Percent',a,b)}catch(e){return 'ERR'}};
  ok('일반 값',p(50,200)===25&&p(1,3)===33&&p(200,200)===100,'50/200=25, 1/3=33, 200/200=100 이에요.',`결과 ${p(50,200)}, ${p(1,3)}, ${p(200,200)} 입니다. 25, 33, 100 이어야 해요.`);
  ok('상한',p(500,200)===100,'100 을 넘지 않아요.',`500/200 → ${p(500,200)}. 100 이어야 해요.`);
  ok('0 나누기',p(5,0)===0&&p(5,-3)===0,'need 가 0 이하이면 0이에요.','need 가 0 이하일 때 에러 없이 0을 반환하세요.');
 },
 hints:['exp / need 는 둘 다 int 라서 소수점이 사라져 0이 돼요.','곱셈을 먼저 하면 값이 커져서 소수점을 버려도 오차가 작아요: exp * 100 / need.','need 가 0 이하일 때와 100 초과를 따로 처리하세요.'],
 why:'정수 연산은 계산 순서에 따라 결과가 크게 달라져요. 나눗셈은 가능한 한 마지막에 하세요. 그러면 float 없이도 정수 퍼센트를 정확하게 얻을 수 있어요.',
 concepts:[['정수 나눗셈과 계산 순서','나눗셈을 먼저 하면 소수점이 사라진다. 곱셈을 먼저 하고 나눗셈은 마지막에 한다.']]});

QB({id:'x54',cat:'csharp',stage:2,level:1,title:'중복을 걸러 낸 새 목록 만들기',
 story:'획득 아이템 번호 목록에 같은 번호가 여러 번 들어 있어요. 원래 목록은 그대로 두고, 처음 나온 번호만 순서대로 모은 새 List를 만들어 주세요.',
 goals:['Unique(src): src에서 같은 값을 한 번만 남긴 새 List<int> 를 반환한다 (처음 나온 순서 유지)','원래 목록 src 는 바뀌지 않는다','빈 목록이면 빈 새 목록을 반환한다'],
 limits:['새 List<int> 를 만들어 사용한다','Contains 로 이미 담았는지 확인한다'],
 api:'new List<int>(), list.Contains(x), list.Add(x), list.Count',
 starter:C`
using System.Collections.Generic;

List<int> Unique(List<int> src)
{
    return src;
}`,
 solution:C`
using System.Collections.Generic;

List<int> Unique(List<int> src)
{
    List<int> result = new List<int>();
    foreach (int n in src)
    {
        if (!result.Contains(n))
        {
            result.Add(n);
        }
    }
    return result;
}`,
 rules:[has('새 리스트 생성',/new\s+List\s*<\s*int\s*>\s*\(/,'새 List 를 만들었어요.','new List<int>() 로 결과를 담을 새 목록을 만드세요.'),has('Contains 사용',/\.Contains\s*\(/,'Contains 로 중복을 확인해요.','result.Contains(n) 으로 이미 담았는지 확인하세요.')],
 test:(api,ok)=>{
  const src=[3,1,3,2,1,3];const r=api.call('Unique',src);
  const arr=Array.from(r&&r.items?r.items:r);
  ok('중복 제거',arr.join()==='3,1,2','[3,1,3,2,1,3] → [3,1,2] (처음 나온 순서).',`결과 [${arr.join(', ')}] 입니다. [3, 1, 2] 여야 해요.`);
  ok('원본 유지',src.join()==='3,1,3,2,1,3','원래 목록은 그대로예요.','원래 목록이 바뀌었어요. 새 목록에 담아 반환하세요.');
  const e=api.call('Unique',[]);
  ok('빈 목록',Array.from(e&&e.items?e.items:e).length===0,'빈 목록은 빈 목록이에요.','빈 목록을 넣으면 빈 목록을 반환하세요.');
 },
 hints:['결과를 담을 새 List 가 필요해요.','목록을 처음부터 훑으면서, 결과에 아직 없는 값만 추가하세요.','결과에 있는지는 Contains 로 확인해요.'],
 why:'List 는 크기가 변하는 컬렉션이라 "새 목록을 만들어 걸러 담기"가 쉬워요. 원본을 건드리지 않고 새 결과를 만드는 방식은 부작용이 없어서 안전해요.',
 concepts:[['List.Contains','목록에 값이 들어 있는지 확인한다.'],['새 컬렉션에 걸러 담기','원본을 바꾸지 않고 조건에 맞는 값만 새 목록에 모은다.']]});

QB({id:'x55',cat:'csharp',stage:2,level:1,title:'점수 기록에서 최고점과 기준 이상 개수',
 story:'점수 기록을 List<int> 로 보관하고 있어요. 최고점과, 기준 점수 이상을 받은 횟수를 알려 주는 두 메서드를 만들어 주세요. 기록이 없을 때도 에러가 나면 안 돼요.',
 goals:['Best(scores): 가장 높은 점수를 반환한다 (기록이 없으면 0)','CountAtLeast(scores, line): line 이상인 점수의 개수를 반환한다'],
 limits:['List 의 Max 같은 메서드를 쓰지 않고 반복문으로 직접 구한다'],
 api:'list.Count, list[i], for / foreach',
 starter:C`
using System.Collections.Generic;

int Best(List<int> scores)
{
    return 0;
}

int CountAtLeast(List<int> scores, int line)
{
    return 0;
}`,
 solution:C`
using System.Collections.Generic;

int Best(List<int> scores)
{
    if (scores.Count == 0) return 0;
    int best = scores[0];
    for (int i = 1; i < scores.Count; i++)
    {
        if (scores[i] > best) best = scores[i];
    }
    return best;
}

int CountAtLeast(List<int> scores, int line)
{
    int n = 0;
    foreach (int s in scores)
    {
        if (s >= line) n++;
    }
    return n;
}`,
 rules:[no('Max 금지',/\.Max\s*\(/,'반복문으로 직접 구했어요.','Max 대신 반복문으로 가장 큰 값을 찾아 보세요.')],
 test:(api,ok)=>{
  const b=x=>{try{return api.call('Best',x)}catch(e){return 'ERR'}};
  ok('최고점',b([30,95,60])===95&&b([-5,-2,-9])===-2,'최고점을 찾아요 (음수만 있어도 맞아요).',`[30,95,60] → ${b([30,95,60])}, [−5,−2,−9] → ${b([-5,-2,-9])}. 95, −2 여야 해요.`);
  ok('빈 기록',b([])===0,'기록이 없으면 0이에요.','기록이 없을 때 0 을 반환하세요 (scores[0] 에 접근하지 마세요).');
  const c=api.call('CountAtLeast',[10,50,50,80],50);
  ok('기준 이상 개수',c===3,'50 이상은 3개예요.',`결과 ${c} 입니다. 50 이상은 3개여야 해요 (50 포함).`);
 },
 hints:['최댓값은 "지금까지 본 가장 큰 값"을 하나 기억하며 훑으면 구할 수 있어요.','시작값은 첫 번째 원소로 두면 음수 점수에서도 맞아요. 단, 빈 목록은 먼저 처리해야 해요.','개수는 조건이 참일 때마다 1 씩 올리세요.'],
 why:'목록을 훑으며 "최댓값 기억하기", "조건에 맞으면 세기"는 모든 컬렉션 처리의 기본 틀이에요. 시작값과 빈 목록 처리가 가장 흔한 실수 지점이에요.',
 concepts:[['컬렉션 훑기','for/foreach 로 모든 원소를 한 번씩 보며 값을 누적한다.'],['빈 컬렉션 처리','인덱스 0 에 접근하기 전에 Count 를 확인한다.']]});

QB({id:'x56',cat:'csharp',stage:2,level:1,title:'먼저 온 사람부터 처리하는 대기열',
 story:'상점 앞에 손님이 줄을 서요. 먼저 온 손님부터 처리해야 해요. List<string> 으로 대기열을 만들고, 줄 서기·처리하기·남은 인원 확인을 구현해 주세요.',
 goals:['Enter(name): 대기열 맨 뒤에 이름을 추가한다','Serve(): 맨 앞 사람의 이름을 반환하고 대기열에서 뺀다 (줄이 비었으면 "" 를 반환)','Waiting(): 줄 서 있는 사람 수를 반환한다'],
 limits:['대기열은 List<string> queue 로 관리한다'],
 api:'list.Add, list[0], list.RemoveAt(0), list.Count',
 starter:C`
using System.Collections.Generic;
using UnityEngine;

public class Shop : MonoBehaviour
{
    private List<string> queue = new List<string>();

    public void Enter(string name)
    {
    }

    public string Serve()
    {
        return "";
    }

    public int Waiting()
    {
        return 0;
    }
}`,
 solution:C`
using System.Collections.Generic;
using UnityEngine;

public class Shop : MonoBehaviour
{
    private List<string> queue = new List<string>();

    public void Enter(string name)
    {
        queue.Add(name);
    }

    public string Serve()
    {
        if (queue.Count == 0) return "";
        string first = queue[0];
        queue.RemoveAt(0);
        return first;
    }

    public int Waiting()
    {
        return queue.Count;
    }
}`,
 rules:[has('RemoveAt 사용',/\.RemoveAt\s*\(/,'RemoveAt 으로 맨 앞을 빼요.','Serve 에서 queue.RemoveAt(0) 으로 맨 앞 사람을 빼세요.')],
 test:(api,ok)=>{
  api.call('Enter','민수');api.call('Enter','지아');api.call('Enter','도윤');
  ok('줄 서기',api.call('Waiting')===3,'세 명이 줄을 섰어요.',`Waiting 이 ${api.call('Waiting')} 입니다. 3 이어야 해요.`);
  const a=api.call('Serve'),b=api.call('Serve');
  ok('먼저 온 순서',a==='민수'&&b==='지아','먼저 온 사람부터 처리해요.',`처리 순서 ${a}, ${b} 입니다. 민수, 지아 여야 해요.`);
  ok('남은 인원',api.call('Waiting')===1,'한 명이 남았어요.',`Waiting 이 ${api.call('Waiting')} 입니다. 1 이어야 해요.`);
  api.call('Serve');
  let r,err=null;try{r=api.call('Serve')}catch(e){err=e}
  ok('빈 줄',!err&&r==='','줄이 비었으면 ""예요.','줄이 비었을 때 에러 없이 "" 를 반환하세요.');
 },
 hints:['새로 온 사람은 맨 뒤(Add), 처리할 사람은 맨 앞(인덱스 0)이에요.','맨 앞 값을 먼저 변수에 저장한 뒤 RemoveAt(0) 으로 지우세요.','비어 있을 때 queue[0] 을 읽으면 에러가 나요. Count 를 먼저 확인하세요.'],
 why:'먼저 들어온 것을 먼저 꺼내는 구조를 큐(대기열)라고 해요. List 의 Add 와 RemoveAt(0) 으로 흉내 낼 수 있어요. 꺼내기 전에 비어 있는지 확인하는 습관이 중요해요.',
 concepts:[['List.RemoveAt','지정한 인덱스의 원소를 제거하고 뒤를 당긴다.'],['대기열(FIFO)','먼저 넣은 것을 먼저 꺼내는 구조.']]});

QB({id:'x57',cat:'csharp',stage:2,level:2,title:'목록을 훑으면서 새 항목을 추가하면?',
 story:'체력이 10 이하인 적마다 "분신"을 만들어 목록 끝에 추가하려 해요. 분신의 체력은 원래 체력의 2배예요. 그런데 foreach 로 훑는 도중에 같은 목록에 Add 를 하니 InvalidOperationException 이 나요. 안전하게 고쳐 주세요.',
 goals:['SpawnClones(hps): 원래 있던 값 중 10 이하인 값마다 그 값의 2배를 목록 끝에 추가한다','추가된 분신은 다시 검사하지 않는다 (무한히 늘어나면 안 돼요)','원래 값들의 순서는 그대로다'],
 limits:['foreach 안에서 같은 리스트를 수정하지 않는다','전달받은 리스트를 직접 수정한다 (반환형 void)'],
 starter:C`
using System.Collections.Generic;

void SpawnClones(List<int> hps)
{
    foreach (int hp in hps)
    {
        if (hp <= 10)
        {
            hps.Add(hp * 2);
        }
    }
}`,
 solution:C`
using System.Collections.Generic;

void SpawnClones(List<int> hps)
{
    int original = hps.Count;
    for (int i = 0; i < original; i++)
    {
        if (hps[i] <= 10)
        {
            hps.Add(hps[i] * 2);
        }
    }
}`,
 rules:[notInLoop('foreach 안에서 Add 금지',/\bforeach\b/,/\.Add\s*\(/,'foreach 안에서 수정하지 않았어요.','foreach 로 훑는 동안 같은 리스트를 수정하면 안 돼요. for 로 바꾸세요.')],
 test:(api,ok)=>{
  const l=[5,50,8];let err=null;try{api.call('SpawnClones',l)}catch(e){err=e}
  const a=Array.from(l.items?l.items:l);
  ok('분신 추가',!err&&a.join()==='5,50,8,10,16','[5,50,8] → [5,50,8,10,16].',err?'목록을 훑는 도중 수정해서 에러가 나요.':`결과 [${a.join(', ')}] 입니다. [5, 50, 8, 10, 16] 이어야 해요.`);
  const l2=[1];try{api.call('SpawnClones',l2)}catch(e){}
  const b=Array.from(l2.items?l2.items:l2);
  ok('분신은 다시 검사 안 함',b.join()==='1,2','분신(2)은 다시 분신을 만들지 않아요.',`[1] → [${b.join(', ')}]. [1, 2] 여야 해요 (추가된 값은 검사 대상이 아니에요).`);
 },
 hints:['foreach 는 훑는 도중 컬렉션이 바뀌면 에러를 내요.','인덱스를 쓰는 for 문은 훑는 도중 Add 를 해도 괜찮아요.','시작할 때의 개수(Count)를 변수에 저장해서 그 개수만큼만 훑으세요.'],
 why:'컬렉션을 훑는 동안 크기를 바꾸면 foreach 는 에러를 내요. 처음 개수를 기억해 두고 인덱스 for 로 훑으면 추가·삭제를 안전하게 섞을 수 있어요.',
 concepts:[['컬렉션 수정 중 순회','foreach 는 훑는 중 컬렉션을 바꾸면 InvalidOperationException 이 난다.'],['시작 개수 고정','Count 를 미리 저장해 새로 추가된 항목은 훑지 않게 한다.']]});

QB({id:'x58',cat:'csharp',stage:2,level:2,title:'foreach로는 값을 바꿀 수 없다',
 story:'모든 점수를 2배로 올리는 보너스 이벤트를 만들어요. foreach 로 훑으며 점수를 2배로 바꿨더니 컴파일 에러(CS1656: foreach 변수에는 대입할 수 없어요)가 나요. 목록 안의 값 자체를 바꾸도록 고쳐 주세요.',
 goals:['DoubleAll(scores): 목록의 모든 값을 2배로 바꾼다 (같은 목록을 직접 수정)','빈 목록이어도 에러가 나지 않는다'],
 limits:['foreach 의 반복 변수에 대입하지 않는다','반환형은 void 이다'],
 starter:C`
using System.Collections.Generic;

void DoubleAll(List<int> scores)
{
    foreach (int s in scores)
    {
        s = s * 2;
    }
}`,
 solution:C`
using System.Collections.Generic;

void DoubleAll(List<int> scores)
{
    for (int i = 0; i < scores.Count; i++)
    {
        scores[i] = scores[i] * 2;
    }
}`,
 rules:[],
 test:(api,ok)=>{
  const l=[1,5,10];let err=null;try{api.call('DoubleAll',l)}catch(e){err=e}
  const a=Array.from(l.items?l.items:l);
  ok('모두 2배',!err&&a.join()==='2,10,20','[1,5,10] → [2,10,20].',err?'에러가 나요.':`결과 [${a.join(', ')}] 입니다. [2, 10, 20] 이어야 해요.`);
  const e=[];let err2=null;try{api.call('DoubleAll',e)}catch(x){err2=x}
  ok('빈 목록',!err2,'빈 목록도 문제없어요.','빈 목록에서 에러가 나요.');
 },
 hints:['foreach 의 반복 변수는 "읽기 전용 복사본"이라 값을 바꿔도 목록에 반영되지 않고 컴파일도 안 돼요.','목록 안의 값을 바꾸려면 인덱스로 접근해야 해요: scores[i] = ...','for (int i = 0; i < scores.Count; i++) 형태를 쓰세요.'],
 why:'foreach 는 읽기에 편하지만 반복 변수는 복사본이에요. 값을 바꿀 때는 인덱스를 쓰는 for 를 사용해야 목록 안의 원본을 바꿀 수 있어요.',
 concepts:[['foreach 반복 변수','읽기 전용 복사본이라 대입할 수 없다(CS1656).'],['인덱스 접근','list[i] = 값 으로 목록 안의 원소를 직접 바꾼다.']]});

QB({id:'x59',cat:'csharp',stage:2,level:2,title:'이름 목록과 체력 목록을 같이 지우기',
 story:'적의 이름 목록(names)과 체력 목록(hps)이 같은 순서로 짝을 이루고 있어요. 체력이 0 이하인 적을 지우려는데, 한쪽만 지우거나 앞에서부터 지우면 짝이 어긋나요. 두 목록의 짝을 유지하며 지워 주세요.',
 goals:['RemoveDead(names, hps): hps 가 0 이하인 칸을 names 와 hps 양쪽에서 함께 제거한다','남은 칸의 짝(이름-체력)과 순서는 그대로다','연속으로 죽은 칸도 모두 지워진다'],
 limits:['뒤에서부터 인덱스로 훑으며 RemoveAt 을 사용한다','반환형은 void 이다'],
 starter:C`
using System.Collections.Generic;

void RemoveDead(List<string> names, List<int> hps)
{
    for (int i = 0; i < hps.Count; i++)
    {
        if (hps[i] <= 0)
        {
            hps.RemoveAt(i);
        }
    }
}`,
 solution:C`
using System.Collections.Generic;

void RemoveDead(List<string> names, List<int> hps)
{
    for (int i = hps.Count - 1; i >= 0; i--)
    {
        if (hps[i] <= 0)
        {
            names.RemoveAt(i);
            hps.RemoveAt(i);
        }
    }
}`,
 rules:[],
 test:(api,ok)=>{
  const n=['A','B','C','D','E'],h=[10,0,0,5,-1];let err=null;try{api.call('RemoveDead',n,h)}catch(e){err=e}
  const nn=Array.from(n.items?n.items:n),hh=Array.from(h.items?h.items:h);
  ok('짝 유지',!err&&nn.join()==='A,D'&&hh.join()==='10,5','[A,B,C,D,E]에서 죽은 B, C, E 를 양쪽에서 지워 A(10), D(5)만 남아요.',err?'에러가 나요.':`이름 [${nn.join(', ')}], 체력 [${hh.join(', ')}] 입니다. A, D / 10, 5 여야 해요.`);
 },
 hints:['앞에서부터 지우면 뒤 칸이 앞으로 당겨져 다음 칸을 건너뛰어요.','뒤에서부터 훑으면 지워도 아직 안 본 칸의 번호가 바뀌지 않아요.','같은 인덱스를 두 목록에서 함께 RemoveAt 하세요.'],
 why:'인덱스로 지우는 반복은 뒤에서부터 도는 것이 안전해요. 짝을 이루는 두 목록은 같은 인덱스를 같이 지워야 어긋나지 않아요.',
 concepts:[['뒤에서부터 순회','지우는 동안 아직 보지 않은 칸의 인덱스가 변하지 않게 뒤에서 앞으로 돈다.'],['병렬 컬렉션','같은 인덱스로 짝을 이루는 목록은 항상 함께 수정한다.']]});

QB({id:'x60',cat:'csharp',stage:2,level:3,title:'복사했는데 원본까지 바뀐다 (class 참조)',
 story:'버프를 받은 능력치를 미리 보여 주려고 Stats를 "복사"해서 공격력을 올렸더니, 원본 능력치까지 같이 올라가 버렸어요. class 는 대입해도 같은 객체를 가리키기 때문이에요. 원본은 그대로 두고 버프가 적용된 새 Stats 를 만들어 주세요.',
 goals:['BuffedCopy(): atk 가 10 올라간 새 Stats 를 반환한다','def 는 그대로 복사한다','원본 stats 는 바뀌지 않는다'],
 limits:['Stats 를 대입(=)만 해서 같은 객체를 돌려주지 않는다','새 Stats 객체를 만들어 값을 옮긴다'],
 starter:C`
using UnityEngine;

public class Hero : MonoBehaviour
{
    public Stats stats = new Stats();

    public Stats BuffedCopy()
    {
        Stats copy = stats;
        copy.atk += 10;
        return copy;
    }
}

public class Stats
{
    public int atk = 5;
    public int def = 3;
}`,
 solution:C`
using UnityEngine;

public class Hero : MonoBehaviour
{
    public Stats stats = new Stats();

    public Stats BuffedCopy()
    {
        Stats copy = new Stats();
        copy.atk = stats.atk + 10;
        copy.def = stats.def;
        return copy;
    }
}

public class Stats
{
    public int atk = 5;
    public int def = 3;
}`,
 rules:[inFn('새 객체 생성','BuffedCopy',/new\s+Stats\s*\(/,'새 Stats 를 만들었어요.','new Stats() 로 새 객체를 만들어 값을 옮기세요.')],
 test:(api,ok)=>{
  let r,err=null;try{r=api.call('BuffedCopy')}catch(e){err=e}
  const s=api.get('stats');
  ok('복사본 값',!err&&r&&r.atk===15&&r.def===3,'복사본은 atk 15, def 3 이에요.',err?'에러가 나요.':`복사본이 atk ${r&&r.atk}, def ${r&&r.def} 입니다. 15, 3 이어야 해요.`);
  ok('원본 유지',!err&&s.atk===5,'원본 atk 는 5 그대로예요.',`원본 atk 가 ${s.atk} 로 바뀌었어요. 같은 객체를 가리키지 말고 새 객체를 만드세요.`);
 },
 hints:['class 변수끼리 대입하면 값이 복사되는 게 아니라 같은 객체를 가리켜요.','복사본을 바꾸면 원본도 바뀌는 이유예요.','새 Stats 를 만들고 필드를 하나씩 옮기세요.'],
 why:'class 는 참조 형식이라 대입은 "같은 객체를 가리키기"예요. 독립된 복사본이 필요하면 새 객체를 만들어 값을 옮겨야 해요. 반대로 Vector3 같은 struct 는 대입이 값 복사라서 성질이 달라요.',
 concepts:[['참조 형식(class)','대입해도 같은 객체를 가리킨다. 복사본이 필요하면 새로 만들어 값을 옮긴다.'],['값 형식과 참조 형식','struct 는 대입이 값 복사, class 는 참조 복사.']]});

QB({id:'x61',cat:'csharp',stage:2,level:3,title:'List 안의 Vector2는 직접 못 바꾼다 (CS1612)',
 story:'경로 점들을 담은 List<Vector2> 를 오른쪽으로 dx 만큼 밀려고 했어요. points[i].x += dx 는 CS1612 오류가 나요. List 의 원소가 struct(Vector2)라서 꺼내면 복사본이 되기 때문이에요. 꺼내서 고친 뒤 다시 넣어 주세요.',
 goals:['ShiftAll(dx): 모든 점의 x 좌표를 dx 만큼 더한다 (y 는 그대로)','같은 List 를 직접 수정한다'],
 limits:['points[i].x 에 직접 대입하지 않는다 (CS1612)','꺼낸 값을 지역 변수에 복사해 수정한 뒤 points[i] 에 다시 대입한다'],
 starter:C`
using System.Collections.Generic;
using UnityEngine;

public class Path : MonoBehaviour
{
    public List<Vector2> points = new List<Vector2>();

    public void AddPoint(float x, float y)
    {
        points.Add(new Vector2(x, y));
    }

    public float PointX(int i)
    {
        return points[i].x;
    }

    public void ShiftAll(float dx)
    {
        for (int i = 0; i < points.Count; i++)
        {
            points[i].x += dx;
        }
    }
}`,
 solution:C`
using System.Collections.Generic;
using UnityEngine;

public class Path : MonoBehaviour
{
    public List<Vector2> points = new List<Vector2>();

    public void AddPoint(float x, float y)
    {
        points.Add(new Vector2(x, y));
    }

    public float PointX(int i)
    {
        return points[i].x;
    }

    public void ShiftAll(float dx)
    {
        for (int i = 0; i < points.Count; i++)
        {
            Vector2 p = points[i];
            p.x += dx;
            points[i] = p;
        }
    }
}`,
 rules:[],
 test:(api,ok)=>{
  api.call('AddPoint',1,10);api.call('AddPoint',4,20);
  let err=null;try{api.call('ShiftAll',3)}catch(e){err=e}
  ok('x 이동',!err&&api.call('PointX',0)===4&&api.call('PointX',1)===7,'x 가 3 씩 이동했어요 (1→4, 4→7).',err?'에러가 나요.':`x 가 ${api.call('PointX',0)}, ${api.call('PointX',1)} 입니다. 4, 7 이어야 해요.`);
  const p=api.get('points');const a=Array.from(p.items?p.items:p);
  ok('y 유지',a[0].y===10&&a[1].y===20,'y 좌표는 그대로예요.','y 좌표가 바뀌었어요.');
 },
 hints:['List 에서 꺼낸 Vector2 는 원본이 아니라 복사본이에요.','복사본의 x 를 바꿔도 List 안에는 반영되지 않아서 컴파일러가 막는 거예요.','지역 변수에 꺼내 → 수정 → points[i] 에 다시 대입하세요.'],
 why:'transform.position 과 같은 이유로, struct 는 꺼내면 복사본이에요. "꺼낸다 → 고친다 → 되돌려 넣는다" 3단계가 값 형식을 다루는 공통 방식이에요.',
 concepts:[['CS1612','struct 를 반환하는 곳(프로퍼티, List 인덱서)의 멤버에는 직접 대입할 수 없다.'],['꺼내 → 고쳐 → 다시 넣기','값 형식은 복사본을 수정한 뒤 원래 자리에 대입한다.']]});

QB({id:'x62',cat:'csharp',stage:2,level:3,title:'메서드에 넘긴 위치를 고쳤는데 그대로다',
 story:'위치를 받아 오른쪽으로 d 만큼 옮겨 주는 메서드를 만들었는데, 호출한 쪽의 위치가 전혀 바뀌지 않아요. Vector2 는 struct 라서 메서드에는 복사본이 전달되기 때문이에요. 옮겨진 위치를 반환하도록 고쳐 주세요.',
 goals:['MoveRight(p, d): p 의 x 를 d 만큼 더한 위치를 반환한다 (y 는 그대로)','매개변수로 받은 p 를 바꾸는 것만으로는 호출한 쪽에 반영되지 않는다'],
 limits:['반환형은 Vector2 이다'],
 starter:C`
void MoveRight(Vector2 p, float d)
{
    p.x += d;
}`,
 solution:C`
Vector2 MoveRight(Vector2 p, float d)
{
    p.x += d;
    return p;
}`,
 rules:[has('Vector2 반환',/\bVector2\s+MoveRight\s*\(/,'Vector2 를 반환해요.','반환형을 void 에서 Vector2 로 바꾸세요.'),has('return',/\breturn\s+\w+/,'return 으로 값을 돌려줘요.','p 를 return 하세요.')],
 test:(api,ok)=>{
  const orig={x:1,y:2};let r,err=null;try{r=api.call('MoveRight',orig,3)}catch(e){err=e}
  ok('옮겨진 위치',!err&&r&&r.x===4&&r.y===2,'(1, 2) 를 3 만큼 옮기면 (4, 2) 예요.',err?'에러가 나요.':`결과 (${r&&r.x}, ${r&&r.y}) 입니다. (4, 2) 여야 해요. 값을 반환하세요.`);
 },
 hints:['struct 를 매개변수로 넘기면 복사본이 전달돼요.','복사본을 고쳐도 호출한 쪽의 원본은 그대로예요.','고친 값을 return 해서 호출한 쪽이 받아 쓰게 하세요.'],
 why:'값 형식(Vector2, int 등)은 메서드에 넘길 때 복사돼요. 결과를 밖으로 전달하려면 반환값을 쓰는 것이 가장 단순한 방법이에요.',
 concepts:[['값 형식의 전달','struct 를 매개변수로 넘기면 복사본이 전달되어 원본은 바뀌지 않는다.'],['반환값으로 결과 전달','수정한 값을 return 해서 호출한 쪽이 받아 쓴다.']]});

QB({id:'x73',cat:'debug',stage:1,level:1,title:'NullReferenceException: 로그 목록을 만들지 않았다',
 story:'전투 기록을 남기는 Write() 를 처음 부르면 이런 에러가 나요:\nNullReferenceException: Object reference not set to an instance of an object\n  at Battle.Write (Battle.cs:8)\n8번째 줄은 log.Add(...) 예요. log 는 List<string> 으로 선언만 했을 뿐 실제 목록을 만든 적이 없어요.',
 goals:['log 를 실제 빈 목록으로 만든다','Write(text)는 목록에 문장을 추가한다','Count()는 기록된 문장 수를 반환한다'],
 limits:['Write 안에서 매번 새 목록을 만들지 않는다 (기록이 사라져요)'],
 api:'new List<string>(), list.Add, list.Count',
 starter:C`
using System.Collections.Generic;
using UnityEngine;

public class Battle : MonoBehaviour
{
    private List<string> log;

    public void Write(string text)
    {
        log.Add(text);
    }

    public int Count()
    {
        return log.Count;
    }
}`,
 solution:C`
using System.Collections.Generic;
using UnityEngine;

public class Battle : MonoBehaviour
{
    private List<string> log = new List<string>();

    public void Write(string text)
    {
        log.Add(text);
    }

    public int Count()
    {
        return log.Count;
    }
}`,
 rules:[no('Write 안에서 새로 만들기 금지',/\bWrite\s*\([^)]*\)\s*\{[^}]*new\s+List/,'Write 안에서 새로 만들지 않았어요.','목록은 필드를 선언할 때 한 번만 만드세요.')],
 test:(api,ok)=>{
  let err=null;try{api.call('Write','공격');api.call('Write','방어')}catch(e){err=e}
  ok('에러 없이 기록',!err,'NullReference 없이 기록돼요.','log 가 비어 있어서 에러가 나요. 목록을 new List<string>() 으로 만드세요.');
  ok('기록 누적',!err&&api.call('Count')===2,'두 문장이 쌓였어요.',`Count 가 ${err?'-':api.call('Count')} 입니다. 2 여야 해요.`);
 },
 hints:['List<string> log; 는 "목록을 담을 칸"만 만든 거예요. 칸은 비어 있어서(null) 쓰면 에러가 나요.','칸에 실제 목록을 넣어 줘야 해요: log = new List<string>();','필드 선언과 같은 줄에서 바로 만들면 가장 간단해요.'],
 why:'참조 형식 변수는 선언만으로는 null 이에요. 컬렉션은 반드시 new 로 만들어 칸에 넣어야 쓸 수 있어요. 필드 선언에서 바로 만들어 두는 것이 가장 안전해요.',
 concepts:[['NullReferenceException','값이 없는(null) 참조를 통해 멤버에 접근했을 때 발생한다.'],['컬렉션 초기화','List 같은 컬렉션은 선언만 하면 null 이다. new 로 만들어야 한다.']]});

QB({id:'x74',cat:'debug',stage:1,level:1,title:'NullReferenceException: 이름이 비어 있는 캐릭터',
 story:'캐릭터 이름 길이를 구하는 NameLength() 를 부르면 이런 에러가 나요:\nNullReferenceException: Object reference not set to an instance of an object\n  at Profile.NameLength (Profile.cs:6)\n이름을 아직 입력하지 않으면 playerName 은 null 이에요. 이름이 없을 때도 안전하게 동작하게 해 주세요.',
 goals:['NameLength(): 이름의 글자 수를 반환한다','이름이 null 이거나 빈 문자열이면 0을 반환한다'],
 limits:['string.IsNullOrEmpty 로 확인한다'],
 api:'string.IsNullOrEmpty(s), s.Length',
 starter:C`
using UnityEngine;

public class Profile : MonoBehaviour
{
    public string playerName;

    public int NameLength()
    {
        return playerName.Length;
    }
}`,
 solution:C`
using UnityEngine;

public class Profile : MonoBehaviour
{
    public string playerName;

    public int NameLength()
    {
        if (string.IsNullOrEmpty(playerName)) return 0;
        return playerName.Length;
    }
}`,
 rules:[inFn('IsNullOrEmpty 사용','NameLength',/string\s*\.\s*IsNullOrEmpty\s*\(\s*playerName\s*\)|playerName\s*==\s*null/,'이름이 비어 있는지 확인해요.','string.IsNullOrEmpty(playerName) 으로 확인하세요.')],
 test:(api,ok)=>{
  api.set('playerName','민우');
  ok('이름 있음',api.call('NameLength')===2,'"민우" 는 2글자예요.',`결과 ${api.call('NameLength')} 입니다. 2 여야 해요.`);
  api.set('playerName',null);let r,e=null;try{r=api.call('NameLength')}catch(x){e=x}
  ok('이름 null',!e&&r===0,'이름이 null 이어도 0을 반환해요.','이름이 null 일 때 에러가 나요. 먼저 확인하세요.');
  api.set('playerName','');
  ok('빈 이름',api.call('NameLength')===0,'빈 문자열은 0이에요.','빈 문자열은 0을 반환해야 해요.');
 },
 hints:['string 도 참조 형식이라 값을 넣지 않으면 null 이에요.','null 에 .Length 를 쓰면 NullReference 예요.','string.IsNullOrEmpty(s) 는 null 이나 "" 이면 true 를 줘요.'],
 why:'문자열도 null 일 수 있어요. Inspector 에서 비워 두거나 아직 입력받지 않은 경우를 위해 string.IsNullOrEmpty 로 한 번에 확인하는 습관을 들이세요.',
 concepts:[['NullReferenceException','null 인 참조의 멤버에 접근하면 발생한다.'],['string.IsNullOrEmpty','null 과 빈 문자열을 한 번에 검사한다.']]});

QB({id:'x75',cat:'debug',stage:1,level:1,title:'NullReferenceException: 구독자가 없는 이벤트',
 story:'적이 죽을 때 onDie 이벤트를 부르는데, 아무도 구독하지 않은 상태에서 Die() 를 부르면 에러가 나요:\nNullReferenceException: Object reference not set to an instance of an object\n  at Enemy.Die (Enemy.cs:9)\n구독자가 없는 델리게이트는 null 이에요. 안전하게 호출하도록 고쳐 주세요.',
 goals:['Die(): dead 를 true 로 만들고 onDie 이벤트를 호출한다','구독자가 없어도 에러가 나지 않는다'],
 limits:['onDie 를 호출하기 전에 null 인지 확인하거나 ?.Invoke() 를 사용한다'],
 api:'?.Invoke(), Action',
 starter:C`
using System;
using UnityEngine;

public class Enemy : MonoBehaviour
{
    public event Action onDie;
    public bool dead;

    public void Die()
    {
        dead = true;
        onDie();
    }
}`,
 solution:C`
using System;
using UnityEngine;

public class Enemy : MonoBehaviour
{
    public event Action onDie;
    public bool dead;

    public void Die()
    {
        dead = true;
        onDie?.Invoke();
    }
}`,
 rules:[inFn('안전한 호출','Die',/onDie\s*\?\.\s*Invoke\s*\(|onDie\s*!=\s*null|if\s*\(\s*onDie\s*\)/,'구독자가 없는 경우를 확인하고 호출해요.','onDie?.Invoke(); 로 호출하세요.')],
 test:(api,ok)=>{
  let e=null;try{api.call('Die')}catch(x){e=x}
  ok('구독자 없음',!e&&api.get('dead')===true,'구독자가 없어도 에러 없이 죽어요.','구독자가 없을 때 에러가 나요. null 이면 호출하지 마세요.');
 },
 hints:['이벤트(델리게이트)는 구독자가 하나도 없으면 null 이에요.','null 인 델리게이트를 호출하면 NullReference 예요.','onDie?.Invoke(); 는 null 이면 아무 일도 하지 않아요.'],
 why:'이벤트는 구독자가 없을 수 있으니 호출 전에 null 확인이 필요해요. ?.Invoke() 한 줄로 안전하게 처리할 수 있어서 거의 항상 이 형태를 써요.',
 concepts:[['NullReferenceException','null 인 참조를 호출하거나 멤버에 접근하면 발생한다.'],['?.Invoke()','델리게이트가 null 이면 호출하지 않고 넘어간다.']]});

QB({id:'x76',cat:'debug',stage:1,level:2,title:'파괴된 적이 남은 목록을 훑을 때',
 story:'경보가 울리면 목록의 모든 적에게 경계 상태를 알려요. 그런데 이미 파괴되어 비어 버린 적이 목록에 남아 있어서 이런 에러가 나요:\nMissingReferenceException: The object of type \'Enemy\' has been destroyed but you are still trying to access it.\n  at Alarm.Raise (Alarm.cs:9)\n비어 있는 칸은 건너뛰고, 살아 있는 적만 알려 주세요.',
 goals:['Raise(): 목록의 살아 있는 적마다 alert 를 true 로 만든다','파괴되어 비어 있는 칸은 건너뛴다','반환값은 알림을 받은 적의 수이다'],
 limits:['Unity에서는 파괴된 오브젝트가 == null 비교에서 true 가 된다'],
 starter:C`
using System.Collections.Generic;
using UnityEngine;

public class Alarm : MonoBehaviour
{
    public List<Enemy> enemies = new List<Enemy>();

    public int Raise()
    {
        int n = 0;
        foreach (Enemy e in enemies)
        {
            e.alert = true;
            n++;
        }
        return n;
    }
}

public class Enemy : MonoBehaviour
{
    public bool alert;
}`,
 solution:C`
using System.Collections.Generic;
using UnityEngine;

public class Alarm : MonoBehaviour
{
    public List<Enemy> enemies = new List<Enemy>();

    public int Raise()
    {
        int n = 0;
        foreach (Enemy e in enemies)
        {
            if (e == null) continue;
            e.alert = true;
            n++;
        }
        return n;
    }
}

public class Enemy : MonoBehaviour
{
    public bool alert;
}`,
 rules:[inFn('null 검사','Raise',/\be\s*==\s*null|\be\s*!=\s*null|!\s*e\b/,'비어 있는 칸을 건너뛰어요.','e == null 이면 continue 하세요.')],
 test:(api,ok)=>{
  const a={alert:false},b={alert:false};
  api.set('enemies',[a,null,b]);
  let r,e=null;try{r=api.call('Raise')}catch(x){e=x}
  ok('살아 있는 적만',!e&&a.alert===true&&b.alert===true&&r===2,'살아 있는 두 마리에게만 알렸어요.',e?'비어 있는 칸에서 에러가 나요.':`알림 수 ${r} 입니다. 2 여야 해요.`);
 },
 hints:['목록에는 파괴된 오브젝트의 빈 칸이 남아 있을 수 있어요.','빈 칸의 멤버를 쓰면 에러가 나요.','반복 안에서 e == null 이면 continue 로 건너뛰세요.'],
 why:'다른 곳에서 Destroy 한 오브젝트는 내 목록에 빈 칸으로 남아요. 목록을 훑을 때마다 null 확인을 하거나, 파괴될 때 목록에서 빼 주는 습관이 필요해요.',
 concepts:[['MissingReferenceException','파괴된 오브젝트를 계속 사용하면 발생한다.'],['continue','반복에서 이번 칸만 건너뛰고 다음으로 넘어간다.']]});

QB({id:'x77',cat:'debug',stage:1,level:2,title:'죽는 처리가 두 번 일어난다',
 story:'적이 한 프레임에 두 번 맞으면 Die() 가 두 번 호출되어 점수가 두 번 올라가고 Destroy 도 두 번 요청돼요. 이미 죽은 뒤의 호출은 무시되어야 해요.',
 goals:['Die(): 처음 호출되었을 때만 score 를 reward 만큼 올리고 Destroy(gameObject) 를 요청한다','이미 죽었다면 아무 일도 하지 않는다 (가드절)'],
 limits:['dead 플래그를 이용해 한 번만 실행한다'],
 starter:C`
using UnityEngine;

public class Enemy : MonoBehaviour
{
    public int reward = 100;
    public int score;
    private bool dead;

    public void Die()
    {
        dead = true;
        score += reward;
        Destroy(gameObject);
    }
}`,
 solution:C`
using UnityEngine;

public class Enemy : MonoBehaviour
{
    public int reward = 100;
    public int score;
    private bool dead;

    public void Die()
    {
        if (dead) return;
        dead = true;
        score += reward;
        Destroy(gameObject);
    }
}`,
 rules:[inFn('가드절','Die',/if\s*\(\s*dead\s*\)\s*return|if\s*\(\s*!\s*dead\s*\)|dead\s*==\s*true/,'이미 죽었으면 바로 돌아가요.','맨 앞에서 if (dead) return; 으로 중복 호출을 막으세요.')],
 test:(api,ok)=>{
  api.call('Die');api.call('Die');api.call('Die');
  ok('점수는 한 번',api.get('score')===100,'점수는 한 번만 올라요.',`score 가 ${api.get('score')} 입니다. 100 이어야 해요.`);
  ok('Destroy 는 한 번',api.env.destroyed.length===1,'Destroy 는 한 번만 요청돼요.',`Destroy 가 ${api.env.destroyed.length}번 요청됐어요. 1번이어야 해요.`);
 },
 hints:['같은 함수가 여러 번 불려도 한 번만 일하게 하려면 "이미 했는가" 표시가 필요해요.','dead 플래그를 확인해서 이미 죽었으면 바로 return 하세요.','플래그는 처리 시작 직후에 true 로 바꾸세요.'],
 why:'이벤트나 충돌은 같은 프레임에 여러 번 올 수 있어요. 한 번만 일어나야 하는 처리는 플래그와 가드절로 중복을 막으세요. 파괴 관련 오류의 흔한 원인이에요.',
 concepts:[['가드절(Guard Clause)','함수 맨 앞에서 조건을 검사해 일찍 return 하는 방식.'],['중복 호출 방지','플래그로 한 번만 실행되게 한다.']]});

QB({id:'x78',cat:'debug',stage:1,level:2,title:'쫓던 플레이어가 사라지면 다시 찾기',
 story:'적이 Player 를 쫓는 중에 플레이어가 죽어서 파괴되면 에러가 나요:\nMissingReferenceException: The object of type \'Player\' has been destroyed but you are still trying to access it.\n  at Chaser.Update (Chaser.cs:10)\n플레이어가 사라졌다면 씬에서 새 플레이어를 찾아보고, 그래도 없으면 가만히 있어야 해요.',
 goals:['player 가 비어 있으면 FindObjectOfType<Player>() 로 다시 찾는다','그래도 없으면 아무것도 하지 않고 돌아간다','있으면 player.x 쪽으로 x 방향으로 speed × Time.deltaTime 만큼 이동한다'],
 limits:['Unity에서는 파괴된 오브젝트가 == null 비교에서 true 가 된다'],
 starter:C`
using UnityEngine;

public class Chaser : MonoBehaviour
{
    public Player player;
    public float speed = 2f;

    void Update()
    {
        Vector3 pos = transform.position;
        float dir = player.x > pos.x ? 1f : -1f;
        pos.x += dir * speed * Time.deltaTime;
        transform.position = pos;
    }
}

public class Player : MonoBehaviour
{
    public float x;
}`,
 solution:C`
using UnityEngine;

public class Chaser : MonoBehaviour
{
    public Player player;
    public float speed = 2f;

    void Update()
    {
        if (player == null)
        {
            player = FindObjectOfType<Player>();
            if (player == null) return;
        }
        Vector3 pos = transform.position;
        float dir = player.x > pos.x ? 1f : -1f;
        pos.x += dir * speed * Time.deltaTime;
        transform.position = pos;
    }
}

public class Player : MonoBehaviour
{
    public float x;
}`,
 rules:[inFn('null 검사','Update',/player\s*==\s*null|!\s*player\b|player\s*!=\s*null/,'player 가 비었는지 확인해요.','Update 에서 player == null 인지 확인하세요.'),inFn('다시 찾기','Update',/FindObjectOfType\s*<\s*Player\s*>/,'비었으면 다시 찾아요.','player == null 이면 FindObjectOfType<Player>() 로 다시 찾으세요.')],
 test:(api,ok)=>{
  api.env.Time.deltaTime=0.5;api.transform.position={x:0,y:0};
  api.set('player',null);delete api.env.components.Player;
  let e=null;try{api.call('Update')}catch(x){e=x}
  ok('아무도 없음',!e&&api.transform.position.x===0,'플레이어가 없으면 가만히 있어요.','플레이어가 없을 때 에러가 나거나 움직여요. 다시 찾아도 없으면 return 하세요.');
  api.env.components.Player={x:10};
  let e2=null;try{api.call('Update')}catch(x){e2=x}
  ok('새로 찾아 쫓기',!e2&&Math.abs(api.transform.position.x-1)<1e-6,'새 플레이어를 찾아 쫓아가요 (2 × 0.5 = 1).',e2?'에러가 나요.':`위치 x 가 ${api.transform.position.x} 입니다. 1 이어야 해요.`);
 },
 hints:['파괴된 플레이어의 참조는 비어 있는 것처럼 취급돼요.','비었을 때는 다시 찾아서 채워 볼 수 있어요.','다시 찾아도 없으면 return 하고, 있으면 쫓아가세요.'],
 why:'참조가 사라질 수 있으면 "비었는지 확인 → 다시 찾기 → 그래도 없으면 쉬기"의 순서로 대응하세요. 단순히 건너뛰기보다 복구를 시도하면 게임이 더 안정적이에요.',
 concepts:[['MissingReferenceException','파괴된 오브젝트를 사용하면 발생한다. 사용 전 null 확인이 필요하다.'],['참조 복구','비어 있으면 다시 찾아 채우고, 못 찾으면 안전하게 멈춘다.']]});

QB({id:'x79',cat:'debug',stage:1,level:3,title:'IndexOutOfRangeException: 반복이 한 칸 더 간다',
 story:'점수 배열의 합을 구하는 Sum() 이 에러를 내요:\nIndexOutOfRangeException: Index was outside the bounds of the array.\n  at Report.Sum (Report.cs:8)\n반복 조건이 i <= scores.Length 라서 마지막에 존재하지 않는 칸을 읽어요. 고쳐 주세요.',
 goals:['Sum(scores): 배열의 모든 값을 더해 반환한다','빈 배열이면 0을 반환한다'],
 limits:['반복 조건에서 마지막 인덱스는 Length - 1 이다'],
 starter:C`
int Sum(int[] scores)
{
    int total = 0;
    for (int i = 0; i <= scores.Length; i++)
    {
        total += scores[i];
    }
    return total;
}`,
 solution:C`
int Sum(int[] scores)
{
    int total = 0;
    for (int i = 0; i < scores.Length; i++)
    {
        total += scores[i];
    }
    return total;
}`,
 rules:[],
 test:(api,ok)=>{
  let r,e=null;try{r=api.call('Sum',[10,20,30])}catch(x){e=x}
  ok('합계',!e&&r===60,'[10, 20, 30] 의 합은 60 이에요.',e?'마지막에 배열 범위를 벗어나요. <= 대신 < 를 쓰세요.':`결과 ${r} 입니다. 60 이어야 해요.`);
  let r2,e2=null;try{r2=api.call('Sum',[])}catch(x){e2=x}
  ok('빈 배열',!e2&&r2===0,'빈 배열은 0이에요.','빈 배열에서 에러가 나요.');
 },
 hints:['길이가 3인 배열의 인덱스는 0, 1, 2 예요. 3 은 범위 밖이에요.','반복 조건이 i <= scores.Length 면 i 가 3 일 때도 실행돼요.','i < scores.Length 로 바꾸세요.'],
 why:'인덱스는 0부터 시작하므로 마지막 인덱스는 Length - 1 이에요. 반복 조건의 < 와 <= 한 글자 차이로 생기는 "한 칸 초과(off-by-one)" 오류는 가장 흔한 버그 중 하나예요.',
 concepts:[['IndexOutOfRangeException','유효 범위(0 ~ Length−1)를 벗어난 인덱스 접근.'],['off-by-one 오류','반복 범위가 하나 많거나 적게 잡히는 흔한 실수.']]});

QB({id:'x80',cat:'debug',stage:1,level:3,title:'ArgumentOutOfRangeException: 빈 가방에서 꺼내기',
 story:'가방에서 마지막으로 넣은 아이템을 꺼내는 Pop() 이 가방이 비었을 때 에러를 내요:\nArgumentOutOfRangeException: Index was out of range.\n  at Bag.Pop (Bag.cs:9)\n비었을 때는 에러 없이 "없음" 표시로 빈 문자열을 돌려주세요.',
 goals:['Push(item): 가방 맨 뒤에 아이템을 넣는다','Pop(): 마지막 아이템을 반환하고 가방에서 뺀다','가방이 비어 있으면 에러 없이 "" 를 반환한다'],
 limits:['마지막 인덱스는 Count - 1 이다'],
 starter:C`
using System.Collections.Generic;
using UnityEngine;

public class Bag : MonoBehaviour
{
    private List<string> items = new List<string>();

    public void Push(string item)
    {
        items.Add(item);
    }

    public string Pop()
    {
        string last = items[items.Count - 1];
        items.RemoveAt(items.Count - 1);
        return last;
    }
}`,
 solution:C`
using System.Collections.Generic;
using UnityEngine;

public class Bag : MonoBehaviour
{
    private List<string> items = new List<string>();

    public void Push(string item)
    {
        items.Add(item);
    }

    public string Pop()
    {
        if (items.Count == 0) return "";
        string last = items[items.Count - 1];
        items.RemoveAt(items.Count - 1);
        return last;
    }
}`,
 rules:[],
 test:(api,ok)=>{
  api.call('Push','검');api.call('Push','방패');
  ok('마지막부터',api.call('Pop')==='방패'&&api.call('Pop')==='검','마지막에 넣은 것부터 꺼내요.','방패, 검 순서로 나와야 해요.');
  let r,e=null;try{r=api.call('Pop')}catch(x){e=x}
  ok('빈 가방',!e&&r==='','비었을 때 ""를 반환해요.',e?'빈 가방에서 에러가 나요. Count 가 0 이면 먼저 반환하세요.':`비었을 때 "${r}" 를 반환했어요. "" 여야 해요.`);
 },
 hints:['비어 있으면 Count - 1 은 −1 이라 유효하지 않은 인덱스예요.','꺼내기 전에 Count 가 0 인지 확인하세요.','0 이면 바로 "" 를 return 하세요.'],
 why:'List 의 인덱스 오류는 ArgumentOutOfRangeException 으로 나타나요. "꺼내기/읽기 전에 비었는지 확인"은 컬렉션을 다루는 가장 기본적인 방어예요.',
 concepts:[['ArgumentOutOfRangeException','List 에서 유효하지 않은 인덱스를 사용했을 때 발생한다.'],['경계 검사','접근 전에 Count 를 확인해 범위를 지킨다.']]});

QB({id:'x81',cat:'debug',stage:1,level:3,title:'격자 바깥 칸을 읽으려다',
 story:'타일 맵을 1차원 배열 grid 에 저장하고 있어요 (가로 width, 세로 height). GetTile(x, y) 로 칸을 읽는데, 맵 가장자리에서 이웃 칸을 조사하다 범위를 벗어나 에러가 나요:\nIndexOutOfRangeException\n  at Map.GetTile (Map.cs:8)\n범위 밖 좌표는 −1 을 반환하도록 고쳐 주세요.',
 goals:['GetTile(x, y): 좌표 (x, y) 의 값 grid[y * width + x] 를 반환한다','x 나 y 가 맵 범위 밖이면 −1 을 반환한다'],
 limits:['x 가 0 이상 width 미만, y 가 0 이상 height 미만일 때만 읽는다'],
 starter:C`
using UnityEngine;

public class Map : MonoBehaviour
{
    public int width = 3;
    public int height = 2;
    public int[] grid = new int[] { 1, 2, 3, 4, 5, 6 };

    public int GetTile(int x, int y)
    {
        return grid[y * width + x];
    }
}`,
 solution:C`
using UnityEngine;

public class Map : MonoBehaviour
{
    public int width = 3;
    public int height = 2;
    public int[] grid = new int[] { 1, 2, 3, 4, 5, 6 };

    public int GetTile(int x, int y)
    {
        if (x < 0 || x >= width || y < 0 || y >= height) return -1;
        return grid[y * width + x];
    }
}`,
 rules:[],
 test:(api,ok)=>{
  const t=(x,y)=>{try{return api.call('GetTile',x,y)}catch(e){return 'ERR'}};
  ok('범위 안',t(0,0)===1&&t(2,1)===6&&t(1,1)===5,'범위 안 칸은 값을 돌려줘요.',`(0,0)=${t(0,0)}, (2,1)=${t(2,1)}, (1,1)=${t(1,1)}. 1, 6, 5 여야 해요.`);
  ok('가로 밖',t(3,0)===-1&&t(-1,0)===-1,'가로 범위 밖은 −1 이에요.',`(3,0)=${t(3,0)}, (−1,0)=${t(-1,0)}. −1 이어야 해요. 가로 경계를 확인하세요.`);
  ok('세로 밖',t(0,2)===-1&&t(0,-1)===-1,'세로 범위 밖은 −1 이에요.',`(0,2)=${t(0,2)}, (0,−1)=${t(0,-1)}. −1 이어야 해요. 세로 경계를 확인하세요.`);
  ok('가로가 넘치는 함정',t(3,0)!==4,'(3,0) 이 다음 줄의 칸으로 잘못 읽히지 않아요.','x 가 width 이상일 때 다음 줄 값(4)이 읽혀요. x 범위도 따로 확인하세요.');
 },
 hints:['배열 전체 범위만 보면 부족해요. x 와 y 각각의 범위가 있어요.','x 가 width 이상이면 계산된 인덱스가 다음 줄의 칸을 가리켜 틀린 값을 읽어요.','네 가지 경우(x<0, x>=width, y<0, y>=height) 중 하나라도 맞으면 −1 을 반환하세요.'],
 why:'2차원을 1차원으로 펴서 저장할 때는 인덱스 계산이 맞아도 x, y 각각의 범위를 따로 검사해야 해요. 경계 검사는 격자·타일·보드 게임에서 항상 필요해요.',
 concepts:[['경계 검사','접근 전에 좌표가 범위 안인지 확인한다.'],['1차원으로 편 격자','인덱스 = y × width + x. x 가 width 를 넘으면 다음 줄로 넘어가 버린다.']]});

QB({id:'x82',cat:'math',stage:1,level:1,title:'사거리 안인가? (제곱 거리 비교)',
 story:'포탑은 사거리 안의 적만 공격해요. 두 점 사이의 거리를 구하려면 제곱근(Sqrt)이 필요한데, 매 프레임 수십 마리를 검사하면 부담이 돼요. 거리를 구하지 말고 "거리의 제곱"을 "사거리의 제곱"과 비교해 같은 결과를 얻어 주세요.',
 goals:['InRange(ax, ay, bx, by, range): 두 점 사이의 거리가 range 이하이면 true','제곱근(Mathf.Sqrt)을 쓰지 않는다','range 가 0 이면 같은 위치일 때만 true 이다'],
 limits:['거리² = dx² + dy² 를 range² 와 비교한다','Sqrt, Distance, magnitude 를 쓰지 않는다'],
 starter:C`
bool InRange(float ax, float ay, float bx, float by, float range)
{
    return false;
}`,
 solution:C`
bool InRange(float ax, float ay, float bx, float by, float range)
{
    float dx = bx - ax;
    float dy = by - ay;
    return dx * dx + dy * dy <= range * range;
}`,
 rules:[no('Sqrt 금지',/Sqrt|Distance|magnitude/,'제곱근 없이 판정해요.','Sqrt/Distance/magnitude 대신 제곱끼리 비교하세요.')],
 test:(api,ok)=>{
  const f=(a,b,c,d,r)=>api.call('InRange',a,b,c,d,r);
  ok('안쪽',f(0,0,3,4,6)===true,'거리 5 는 사거리 6 안이에요.','(0,0)-(3,4) 는 거리 5 라서 사거리 6 안이에요.');
  ok('바깥',f(0,0,3,4,4)===false,'거리 5 는 사거리 4 밖이에요.','거리 5 는 사거리 4 밖이에요.');
  ok('경계',f(0,0,3,4,5)===true,'거리가 딱 사거리와 같으면 안이에요.','경계(거리 = 사거리)는 true 여야 해요.');
  ok('음수 좌표',f(-2,-2,1,2,5)===true&&f(-2,-2,1,2,4.9)===false,'음수 좌표도 맞게 판정해요.','(−2,−2)-(1,2) 는 거리 5 예요.');
  ok('같은 위치',f(1,1,1,1,0)===true,'사거리 0 이어도 같은 위치는 true 예요.','같은 위치는 거리 0 이라 true 여야 해요.');
 },
 hints:['두 점의 거리는 √(dx² + dy²) 지만, 크기 비교만 필요하면 제곱근 없이도 돼요.','a ≤ b 이면 a² ≤ b² 예요 (둘 다 0 이상일 때).','dx² + dy² 와 range² 를 직접 비교하세요.'],
 why:'거리를 "비교"하기만 한다면 제곱 상태로 비교해도 결과가 같고 제곱근 계산을 아낄 수 있어요. 그래서 Unity 에도 sqrMagnitude 가 있어요. 수십~수백 개를 매 프레임 검사할 때 유용해요.',
 concepts:[['거리의 제곱 비교','크기만 비교한다면 제곱근 없이 제곱끼리 비교해도 같은 결과다.'],['벡터의 길이(크기)','√(x² + y²).']]});

QB({id:'x83',cat:'math',stage:1,level:1,title:'무리의 중심 위치 구하기',
 story:'병사 무리가 흩어져 있어요. 카메라가 무리 전체의 중심을 비추려면 모든 병사 위치의 평균을 구해야 해요. 병사의 x, y 좌표가 각각 배열로 주어졌을 때 중심 좌표를 구해 주세요.',
 goals:['Center(xs, ys): 모든 좌표의 평균 위치를 Vector2 로 반환한다','병사가 한 명도 없으면 (0, 0) 을 반환한다','xs 와 ys 의 길이는 같다'],
 limits:['반복문으로 합을 구한 뒤 개수로 나눈다','정수 나눗셈이 되지 않도록 float 로 계산한다'],
 api:'new Vector2(x, y), 배열.Length',
 starter:C`
Vector2 Center(float[] xs, float[] ys)
{
    return new Vector2(0f, 0f);
}`,
 solution:C`
Vector2 Center(float[] xs, float[] ys)
{
    if (xs.Length == 0) return new Vector2(0f, 0f);
    float sx = 0f;
    float sy = 0f;
    for (int i = 0; i < xs.Length; i++)
    {
        sx += xs[i];
        sy += ys[i];
    }
    return new Vector2(sx / xs.Length, sy / xs.Length);
}`,
 rules:[],
 test:(api,ok)=>{
  const c=(a,b)=>{try{const r=api.call('Center',a,b);return {x:r.x,y:r.y}}catch(e){return {x:'ERR',y:'ERR'}}};
  let r=c([0,4],[0,2]);
  ok('두 명',r.x===2&&r.y===1,'(0,0) 과 (4,2) 의 중심은 (2, 1) 이에요.',`결과 (${r.x}, ${r.y}) 입니다. (2, 1) 이어야 해요.`);
  r=c([1,2,6],[3,3,9]);
  ok('세 명',r.x===3&&r.y===5,'세 명의 평균은 (3, 5) 예요.',`결과 (${r.x}, ${r.y}) 입니다. (3, 5) 여야 해요.`);
  r=c([-3,3],[-1,-1]);
  ok('음수',r.x===0&&r.y===-1,'음수 좌표도 평균이 맞아요.',`결과 (${r.x}, ${r.y}) 입니다. (0, −1) 이어야 해요.`);
  r=c([],[]);
  ok('아무도 없음',r.x===0&&r.y===0,'아무도 없으면 (0, 0) 이에요.','병사가 없을 때 (0, 0) 을 반환하세요 (0 으로 나누지 마세요).');
 },
 hints:['평균은 합을 개수로 나눈 값이에요. x 와 y 를 따로 계산하세요.','반복문으로 xs 의 합과 ys 의 합을 각각 구하세요.','개수가 0 이면 나누기 전에 (0, 0) 을 반환하세요.'],
 why:'무리의 중심은 위치 벡터들의 평균이에요. 카메라 중앙 맞추기, 무리 AI, 폭발 중심 계산에서 자주 써요. 개수가 0 인 경우를 먼저 걸러 내는 것도 습관이 돼야 해요.',
 concepts:[['벡터의 평균','각 성분의 합을 개수로 나눈 값이 무리의 중심이다.'],['0으로 나누기 방지','개수가 0 일 수 있으면 먼저 검사한다.']]});

QB({id:'x84',cat:'math',stage:1,level:1,title:'목표 둘레를 빙글빙글 돌기 (수직 방향)',
 story:'적이 플레이어를 중심으로 옆으로 빙글빙글 도는 움직임을 만들어요. 플레이어를 향하는 방향 (dx, dy) 이 주어지면, 그 방향에 수직인 방향으로 speed 만큼 움직여야 해요. 2D 에서 (x, y) 에 수직인 벡터는 (−y, x) 예요.',
 goals:['Strafe(dx, dy, speed): (dx, dy) 에 수직인 방향의 길이 speed 인 속도를 반환한다 (반시계 방향, 즉 (−dy, dx) 쪽)','dx, dy 의 길이는 신경 쓰지 않고 결과 길이는 항상 speed 이다','(dx, dy) 가 (0, 0) 이면 (0, 0) 을 반환한다'],
 limits:['반환값은 new Vector2(x, y)'],
 api:'Mathf.Sqrt(x), new Vector2(x, y)',
 starter:C`
Vector2 Strafe(float dx, float dy, float speed)
{
    return new Vector2(dx * speed, dy * speed);
}`,
 solution:C`
Vector2 Strafe(float dx, float dy, float speed)
{
    float len = Mathf.Sqrt(dx * dx + dy * dy);
    if (len == 0f) return new Vector2(0f, 0f);
    return new Vector2(-dy / len * speed, dx / len * speed);
}`,
 rules:[],
 test:(api,ok)=>{
  const s=(a,b,c)=>{const r=api.call('Strafe',a,b,c);return {x:r.x,y:r.y,len:Math.hypot(r.x,r.y)}};
  let r=s(1,0,5);
  ok('오른쪽을 보면 위로',Math.abs(r.x)<1e-6&&Math.abs(r.y-5)<1e-6,'오른쪽 방향의 수직은 위쪽 (0, 5) 이에요.',`결과 (${r.x}, ${r.y}) 입니다. (0, 5) 여야 해요.`);
  r=s(0,2,3);
  ok('위를 보면 왼쪽으로',Math.abs(r.x+3)<1e-6&&Math.abs(r.y)<1e-6,'위쪽 방향의 수직은 왼쪽 (−3, 0) 이에요.',`결과 (${r.x}, ${r.y}) 입니다. (−3, 0) 이어야 해요. 길이도 speed 로 맞추세요.`);
  r=s(3,4,10);
  ok('길이는 speed',Math.abs(r.len-10)<1e-4&&Math.abs(r.x+8)<1e-4&&Math.abs(r.y-6)<1e-4,'(3,4) 의 수직은 (−8, 6) 방향, 길이 10 이에요.',`결과 (${r.x.toFixed(2)}, ${r.y.toFixed(2)}) 입니다. (−8, 6) 이어야 해요.`);
  r=s(0,0,5);
  ok('방향 없음',r.x===0&&r.y===0,'방향이 없으면 (0, 0) 이에요.','(0, 0) 입력에서 NaN 이 나와요.');
 },
 hints:['2D 에서 (x, y) 를 반시계로 90도 돌리면 (−y, x) 가 돼요.','수직 벡터의 길이는 원래 길이와 같아요. 길이를 speed 로 맞추려면 정규화가 필요해요.','길이가 0 이면 먼저 (0, 0) 을 반환하세요.'],
 why:'수직 벡터 (−y, x) 는 옆으로 돌기, 궤도 운동, 벽 따라가기 등에 자주 쓰여요. 방향만 필요하면 정규화한 뒤 원하는 크기를 곱하는 것이 기본 패턴이에요.',
 concepts:[['수직 벡터','2D 에서 (x, y) 에 수직인 벡터는 (−y, x) 또는 (y, −x).'],['정규화(Normalize)','길이 1 로 맞춘 뒤 원하는 크기를 곱한다.']]});

QB({id:'x85',cat:'math',stage:1,level:2,title:'등 뒤에 있나? (내적의 부호)',
 story:'암살 스킬은 적의 등 뒤에서만 발동돼요. 적이 바라보는 방향 (fx, fy)과 적에서 플레이어로 향하는 벡터 (tx, ty)의 내적이 0보다 작으면 플레이어는 적의 뒤쪽에 있는 거예요.',
 goals:['IsBehind(fx, fy, tx, ty): 대상이 바라보는 방향의 뒤쪽에 있으면 true','내적이 0보다 작으면 뒤쪽이다','옆 (내적 0)이나 앞쪽은 false'],
 limits:['각도를 구하는 Atan2나 Acos 는 쓰지 않고 내적으로 판정한다'],
 api:'내적 = fx × tx + fy × ty',
 starter:C`
bool IsBehind(float fx, float fy, float tx, float ty)
{
    return false;
}`,
 solution:C`
bool IsBehind(float fx, float fy, float tx, float ty)
{
    float dot = fx * tx + fy * ty;
    return dot < 0f;
}`,
 rules:[no('Atan2/Acos 금지',/Atan2|Acos/,'각도를 구하지 않고 내적으로 판정해요.','Atan2/Acos 대신 내적의 부호로 판정하세요.')],
 test:(api,ok)=>{
  const b=(tx,ty)=>api.call('IsBehind',1,0,tx,ty);
  ok('바로 뒤',b(-3,0)===true,'바로 뒤는 true예요.','바로 뒤(−3, 0)는 뒤쪽이에요.');
  ok('앞쪽',b(4,1)===false,'앞쪽은 false예요.','앞(4, 1)은 뒤쪽이 아니에요.');
  ok('비스듬한 뒤',b(-2,5)===true,'비스듬히 뒤에 있어도 true예요.','(−2, 5)는 x가 뒤쪽이라 뒤쪽 반평면이에요.');
  ok('정확히 옆',b(0,5)===false,'정확히 옆은 뒤가 아니에요.','내적이 0이면 뒤가 아니라 옆이에요.');
  ok('회전한 정면',api.call('IsBehind',0,1,0,-2)===true&&api.call('IsBehind',0,1,0,2)===false,'위를 보는 경우에도 맞게 판정해요.','정면이 (0, 1)이면 (0, −2)가 뒤쪽이에요.');
 },
 hints:['두 벡터의 내적은 성분 곱의 합이에요.','내적이 양수면 같은 쪽, 음수면 반대쪽, 0이면 직각이에요.','내적이 0보다 작을 때 true를 반환하세요.'],
 why:'내적의 부호만으로도 "앞/뒤" 판정이 돼요. 각도 계산 없이 곱셈과 덧셈뿐이라 빠르고, 백스탭·피격 방향·컬링 등에 널리 써요.',
 concepts:[['내적(Dot Product)','두 벡터 성분 곱의 합. 양수면 같은 쪽, 음수면 반대쪽, 0이면 수직.'],['앞/뒤 판정','정면 방향과 대상 벡터의 내적 부호로 앞뒤를 가른다.']]});

QB({id:'x86',cat:'math',stage:1,level:2,title:'벽에 튕기는 공 (반사 벡터)',
 story:'공이 벽에 부딪히면 튕겨 나가요. 공의 속도 v 와 벽의 법선(벽에서 수직으로 뻗는 단위 벡터) n 이 주어지면, 튕긴 뒤의 속도는 v − 2 (v · n) n 으로 구할 수 있어요. 내적(·)을 이용해 구현해 주세요.',
 goals:['Reflect(vx, vy, nx, ny): 속도 (vx, vy) 가 법선 (nx, ny) 인 벽에 부딪혀 튕긴 속도를 반환한다','법선은 길이 1 이라고 가정한다','벽과 나란히 움직이면(내적 0) 속도가 그대로이다'],
 limits:['반환값은 new Vector2(x, y)','Vector2.Reflect 같은 내장 함수를 쓰지 않는다'],
 api:'내적 = vx × nx + vy × ny',
 starter:C`
Vector2 Reflect(float vx, float vy, float nx, float ny)
{
    return new Vector2(vx, vy);
}`,
 solution:C`
Vector2 Reflect(float vx, float vy, float nx, float ny)
{
    float dot = vx * nx + vy * ny;
    return new Vector2(vx - 2f * dot * nx, vy - 2f * dot * ny);
}`,
 rules:[no('내장 Reflect 금지',/Vector2\s*\.\s*Reflect/,'직접 계산했어요.','Vector2.Reflect 대신 내적으로 직접 계산하세요.')],
 test:(api,ok)=>{
  const r=(a,b,c,d)=>{const v=api.call('Reflect',a,b,c,d);return {x:v.x,y:v.y}};
  let v=r(1,-1,0,1);
  ok('바닥에 튕김',Math.abs(v.x-1)<1e-6&&Math.abs(v.y-1)<1e-6,'(1, −1) 이 바닥(법선 (0, 1))에 부딪히면 (1, 1) 이 돼요.',`결과 (${v.x}, ${v.y}) 입니다. (1, 1) 이어야 해요.`);
  v=r(3,0,-1,0);
  ok('벽에 정면 충돌',Math.abs(v.x+3)<1e-6&&Math.abs(v.y)<1e-6,'정면으로 부딪히면 반대로 튕겨요 (−3, 0).',`결과 (${v.x}, ${v.y}) 입니다. (−3, 0) 이어야 해요.`);
  v=r(2,5,1,0);
  ok('나란히 움직임',Math.abs(v.x+2)<1e-6&&Math.abs(v.y-5)<1e-6,'법선 방향 성분만 뒤집혀요 (−2, 5).',`결과 (${v.x}, ${v.y}) 입니다. (−2, 5) 여야 해요.`);
  v=r(4,3,0,1);
  v=r(4,0,0,1);
  ok('벽과 평행',Math.abs(v.x-4)<1e-6&&Math.abs(v.y)<1e-6,'벽과 나란히 움직이면 그대로예요.',`결과 (${v.x}, ${v.y}) 입니다. (4, 0) 이어야 해요.`);
 },
 hints:['속도를 "벽에 수직인 성분"과 "벽과 나란한 성분"으로 나눠 생각해요. 수직 성분만 뒤집으면 튕김이에요.','v · n 은 속도 중 법선 방향 성분의 크기예요.','v − 2 (v · n) n 을 x, y 각각 계산하세요.'],
 why:'반사는 "법선 방향 성분을 뒤집기"예요. 내적으로 그 성분을 구해 두 번 빼 주면 뒤집혀요. 공 튀기기, 빛 반사, 총알 도탄에 그대로 쓰여요.',
 concepts:[['내적(Dot Product)','v · n 은 v 의 n 방향 성분 크기를 준다 (n 이 단위 벡터일 때).'],['반사 벡터','v − 2 (v · n) n. 법선 방향 성분만 뒤집는다.']]});

QB({id:'x87',cat:'math',stage:1,level:2,title:'목표 방향으로 얼마나 빠른가 (투영)',
 story:'미사일이 목표를 향해 날아가는데, 속도 벡터 (vx, vy)가 목표 방향 (dx, dy)으로 얼마나 기여하는지 알고 싶어요. 방향 벡터를 정규화한 뒤 속도와 내적하면 "그 방향 속도 성분"이 나옵니다. 목표에서 멀어지면 음수가 돼요.',
 goals:['ApproachSpeed(vx, vy, dx, dy): 속도 (vx, vy)의 (dx, dy) 방향 성분을 반환한다','(dx, dy)를 정규화한 뒤 내적한다','(dx, dy)가 (0, 0)이면 0을 반환한다'],
 limits:['각도를 구하는 Atan2나 Acos 는 쓰지 않고 내적으로 판정한다'],
 api:'Mathf.Sqrt',
 starter:C`
float ApproachSpeed(float vx, float vy, float dx, float dy)
{
    return 0f;
}`,
 solution:C`
float ApproachSpeed(float vx, float vy, float dx, float dy)
{
    float len = Mathf.Sqrt(dx * dx + dy * dy);
    if (len == 0f) return 0f;
    return (vx * dx + vy * dy) / len;
}`,
 rules:[no('Atan2/Acos 금지',/Atan2|Acos/,'각도를 구하지 않고 내적으로 구해요.','Atan2/Acos 대신 정규화한 내적을 쓰세요.')],
 test:(api,ok)=>{
  const a=(vx,vy,dx,dy)=>api.call('ApproachSpeed',vx,vy,dx,dy);
  ok('정면 접근',Math.abs(a(5,0,10,0)-5)<1e-4,'목표 쪽으로 곧장 가면 속도 그대로예요.',`(5,0)을 (10,0) 방향으로: ${a(5,0,10,0)}. 5여야 해요.`);
  ok('멀어짐',Math.abs(a(-3,0,10,0)+3)<1e-4,'멀어지면 음수예요.',`(−3,0)을 (10,0) 방향으로: ${a(-3,0,10,0)}. −3이어야 해요.`);
  ok('수직',Math.abs(a(0,4,10,0))<1e-4,'수직으로 가면 0이에요.',`(0,4)를 (10,0) 방향으로: ${a(0,4,10,0)}. 0이어야 해요.`);
  ok('비스듬',Math.abs(a(3,4,0,100)-4)<1e-4,'(3, 4)의 위쪽 성분은 4예요.',`(3,4)를 (0,100) 방향으로: ${a(3,4,0,100)}. 4여야 해요. 방향 벡터를 정규화하세요.`);
  ok('방향 없음',a(3,4,0,0)===0,'방향이 없으면 0이에요.','방향 벡터가 (0, 0)일 때 NaN이 나와요. 0을 반환하세요.');
 },
 hints:['"그 방향 성분"은 정규화한 방향 벡터와 속도 벡터의 내적이에요.','방향 벡터의 길이로 나눠야 거리에 상관없이 같은 값이 나와요.','길이가 0이면 나누기 전에 0을 반환하세요.'],
 why:'정규화한 방향과의 내적은 "그 방향으로 얼마나 가는가"를 알려 줘요. 접근 속도, 경사면 위 속도 성분, 그림자 길이 등 활용도가 넓습니다.',
 concepts:[['내적(Dot Product)','단위 벡터와 내적하면 그 방향 성분(투영)이 된다.'],['정규화(Normalize)','길이 1로 맞춘 방향 벡터. 길이 0은 먼저 처리한다.']]});

QB({id:'x88',cat:'math',stage:1,level:3,title:'각도와 방향 벡터 서로 바꾸기',
 story:'발사 각도(도)를 방향 벡터로 바꾸고, 반대로 방향 벡터에서 각도를 구하는 두 함수를 만들어요. 각도는 오른쪽이 0도, 반시계 방향으로 커지며, 구한 각도는 항상 0 이상 360 미만이어야 해요. Atan2 는 −180 ~ 180 으로 돌려주니 보정이 필요해요.',
 goals:['DirFromAngle(deg): 각도(도)의 방향 벡터 (cos, sin) 를 반환한다 (길이 1)','AngleOf(x, y): 벡터가 가리키는 각도(도)를 0 이상 360 미만으로 반환한다 (오른쪽 0, 위 90, 왼쪽 180, 아래 270)'],
 limits:['도 ↔ 라디안 변환은 Mathf.Deg2Rad, Mathf.Rad2Deg 를 사용한다','음수 각도는 360 을 더해 보정한다'],
 api:'Mathf.Cos, Mathf.Sin, Mathf.Atan2(y, x), Mathf.Deg2Rad, Mathf.Rad2Deg',
 starter:C`
Vector2 DirFromAngle(float deg)
{
    return new Vector2(Mathf.Cos(deg), Mathf.Sin(deg));
}

float AngleOf(float x, float y)
{
    return Mathf.Atan2(y, x);
}`,
 solution:C`
Vector2 DirFromAngle(float deg)
{
    float rad = deg * Mathf.Deg2Rad;
    return new Vector2(Mathf.Cos(rad), Mathf.Sin(rad));
}

float AngleOf(float x, float y)
{
    float deg = Mathf.Atan2(y, x) * Mathf.Rad2Deg;
    if (deg < 0f) deg += 360f;
    return deg;
}`,
 rules:[],
 test:(api,ok)=>{
  const d=a=>{const v=api.call('DirFromAngle',a);return {x:v.x,y:v.y}};
  let v=d(90);
  ok('위쪽',Math.abs(v.x)<1e-4&&Math.abs(v.y-1)<1e-4,'90도는 위쪽 (0, 1) 이에요.',`결과 (${v.x.toFixed(2)}, ${v.y.toFixed(2)}) 입니다. (0, 1) 이어야 해요. 도를 라디안으로 바꾸세요.`);
  v=d(180);
  ok('왼쪽',Math.abs(v.x+1)<1e-4&&Math.abs(v.y)<1e-4,'180도는 왼쪽 (−1, 0) 이에요.',`결과 (${v.x.toFixed(2)}, ${v.y.toFixed(2)}) 입니다. (−1, 0) 이어야 해요.`);
  const a=(x,y)=>api.call('AngleOf',x,y);
  ok('기본 방향',Math.abs(a(1,0))<1e-3&&Math.abs(a(0,1)-90)<1e-3&&Math.abs(a(-1,0)-180)<1e-3,'오른쪽 0, 위 90, 왼쪽 180 이에요.',`오른쪽 ${a(1,0)}, 위 ${a(0,1)}, 왼쪽 ${a(-1,0)}. 0, 90, 180 이어야 해요.`);
  ok('아래쪽은 270',Math.abs(a(0,-1)-270)<1e-3&&Math.abs(a(1,-1)-315)<1e-3,'아래쪽은 270, 오른쪽 아래는 315 예요.',`아래 ${a(0,-1)}, 오른쪽 아래 ${a(1,-1)}. 270, 315 여야 해요. 음수면 360 을 더하세요.`);
 },
 hints:['Mathf.Cos/Sin 은 라디안을 받아요. 도에 Mathf.Deg2Rad 를 곱해 주세요.','Mathf.Atan2(y, x) 는 라디안이고 범위가 −180 ~ 180 도예요. Rad2Deg 를 곱해 도로 바꾸세요.','결과가 음수면 360 을 더해 0 ~ 360 으로 맞추세요.'],
 why:'각도와 방향 벡터를 오가는 것은 조준, 발사, 회전의 기본이에요. 삼각함수는 라디안을 쓴다는 점과 Atan2 의 음수 범위를 보정하는 것이 가장 흔한 함정이에요.',
 concepts:[['각도 ↔ 방향 벡터','방향 = (cos θ, sin θ), 각도 = Atan2(y, x). 삼각함수는 라디안을 쓴다.'],['각도 범위 보정','Atan2 결과가 음수면 360 을 더해 0 ~ 360 으로 맞춘다.']]});

QB({id:'x89',cat:'math',stage:1,level:3,title:'부채꼴로 퍼지는 탄막 각도',
 story:'총알 count 발을 부채꼴로 쏴요. 전체 퍼지는 폭은 spread 도이고, 중앙은 0도예요. 3발에 폭 60도면 −30, 0, +30 도가 되죠. i 번째 총알(0부터)의 각도를 구하는 함수를 만들어 주세요. 총알이 한 발이면 0도예요.',
 goals:['FanAngle(i, count, spread): i 번째 총알의 각도를 반환한다 (중앙 0, 양 끝이 −spread/2, +spread/2)','총알이 1발이면 0 을 반환한다','각 총알 사이 간격은 일정하다'],
 limits:['0으로 나누지 않는다 (count 가 1 일 때)'],
 api:'(float) 형변환',
 starter:C`
float FanAngle(int i, int count, float spread)
{
    return i * spread;
}`,
 solution:C`
float FanAngle(int i, int count, float spread)
{
    if (count <= 1) return 0f;
    float step = spread / (count - 1);
    return -spread / 2f + step * i;
}`,
 rules:[],
 test:(api,ok)=>{
  const f=(i,c,s)=>{try{return api.call('FanAngle',i,c,s)}catch(e){return 'ERR'}};
  ok('3발',f(0,3,60)===-30&&f(1,3,60)===0&&f(2,3,60)===30,'3발 60도는 −30, 0, 30 이에요.',`결과 ${f(0,3,60)}, ${f(1,3,60)}, ${f(2,3,60)} 입니다. −30, 0, 30 이어야 해요.`);
  ok('5발',f(0,5,80)===-40&&f(1,5,80)===-20&&f(4,5,80)===40,'5발 80도는 −40, −20, 0, 20, 40 이에요.',`결과 ${f(0,5,80)}, ${f(1,5,80)}, ${f(4,5,80)} 입니다. −40, −20, 40 이어야 해요.`);
  ok('2발',f(0,2,30)===-15&&f(1,2,30)===15,'2발 30도는 −15, 15 예요.',`결과 ${f(0,2,30)}, ${f(1,2,30)} 입니다. −15, 15 여야 해요.`);
  ok('1발',f(0,1,60)===0,'한 발이면 정면 0도예요.','한 발일 때 0 을 반환하세요 (0으로 나누지 마세요).');
 },
 hints:['총알이 n 발이면 간격은 n − 1 개예요. 간격 = spread / (n − 1).','시작 각도는 −spread / 2 이고, i 번째는 시작에서 간격 × i 만큼 더해요.','count 가 1 이면 간격 계산에서 0으로 나누게 되니 먼저 처리하세요.'],
 why:'"n 개를 균등하게 배치"는 간격이 n−1 개라는 점이 핵심이에요. 탄막, 파티클 방사, UI 배치 등에서 자주 쓰는 계산이고, 경계값(1개일 때)을 먼저 처리하는 습관이 필요해요.',
 concepts:[['균등 분배','n 개를 양 끝 포함해 배치하면 간격은 (n − 1) 개이다.'],['경계값 처리','개수가 1 일 때처럼 나눗셈이 깨지는 경우를 먼저 처리한다.']]});

QB({id:'x90',cat:'math',stage:1,level:3,title:'원을 그리며 도는 위성',
 story:'위성이 중심 (cx, cy) 둘레를 반지름 r 로 돌아요. 매 프레임 각도를 speed(도/초) × dt 만큼 늘리되 0 ~ 360 도 안에 머물게 하고, 현재 각도에서 위성의 위치를 구해 주세요. 각도 0도는 중심의 오른쪽이고 반시계로 돌아요.',
 goals:['NextAngle(angle, speed, dt): angle 에 speed × dt 를 더하고 0 이상 360 미만으로 맞춰 반환한다','OrbitPos(cx, cy, r, angle): 중심 (cx, cy) 에서 반지름 r, 각도 angle(도) 에 있는 위치를 Vector2 로 반환한다'],
 limits:['각도를 360 안으로 맞출 때 Mathf.Repeat 를 사용한다','삼각함수에는 라디안을 넣는다 (Mathf.Deg2Rad)'],
 api:'Mathf.Repeat, Mathf.Cos, Mathf.Sin, Mathf.Deg2Rad',
 starter:C`
float NextAngle(float angle, float speed, float dt)
{
    return angle + speed * dt;
}

Vector2 OrbitPos(float cx, float cy, float r, float angle)
{
    return new Vector2(cx + r, cy);
}`,
 solution:C`
float NextAngle(float angle, float speed, float dt)
{
    return Mathf.Repeat(angle + speed * dt, 360f);
}

Vector2 OrbitPos(float cx, float cy, float r, float angle)
{
    float rad = angle * Mathf.Deg2Rad;
    return new Vector2(cx + r * Mathf.Cos(rad), cy + r * Mathf.Sin(rad));
}`,
 rules:[],
 test:(api,ok)=>{
  const n=(a,s,d)=>api.call('NextAngle',a,s,d);
  ok('각도 증가',Math.abs(n(10,90,0.5)-55)<1e-4,'10도에서 90도/초로 0.5초 돌면 55도예요.',`결과 ${n(10,90,0.5)} 입니다. 55 여야 해요.`);
  ok('360 넘기기',Math.abs(n(350,90,0.5)-35)<1e-4,'350도에서 45도 더하면 35도로 돌아와요.',`결과 ${n(350,90,0.5)} 입니다. 35 여야 해요. Mathf.Repeat 로 360 안에 맞추세요.`);
  const p=(cx,cy,r,a)=>{const v=api.call('OrbitPos',cx,cy,r,a);return {x:v.x,y:v.y}};
  let v=p(0,0,5,0);
  ok('0도는 오른쪽',Math.abs(v.x-5)<1e-4&&Math.abs(v.y)<1e-4,'0도는 오른쪽 (5, 0) 이에요.',`결과 (${v.x.toFixed(2)}, ${v.y.toFixed(2)}) 입니다. (5, 0) 이어야 해요.`);
  v=p(2,3,4,90);
  ok('90도는 위쪽',Math.abs(v.x-2)<1e-4&&Math.abs(v.y-7)<1e-4,'중심 (2, 3), 반지름 4, 90도는 (2, 7) 이에요.',`결과 (${v.x.toFixed(2)}, ${v.y.toFixed(2)}) 입니다. (2, 7) 이어야 해요.`);
  v=p(1,1,2,180);
  ok('180도는 왼쪽',Math.abs(v.x+1)<1e-4&&Math.abs(v.y-1)<1e-4,'180도는 (−1, 1) 이에요.',`결과 (${v.x.toFixed(2)}, ${v.y.toFixed(2)}) 입니다. (−1, 1) 이어야 해요.`);
 },
 hints:['각도는 360도마다 한 바퀴예요. 더한 뒤 0 ~ 360 안으로 접어 넣어야 해요.','Mathf.Repeat(값, 360) 은 값을 0 이상 360 미만으로 감싸 줘요.','원 위의 위치는 중심 + 반지름 × (cos θ, sin θ) 예요. θ 는 라디안이라 Deg2Rad 를 곱하세요.'],
 why:'각도 + 반지름으로 위치를 정하는 방식(극좌표)은 궤도, 레이더, 원형 메뉴 등에 쓰여요. 각도를 계속 더해도 값이 커지지 않도록 360 안으로 감싸는 것도 습관이 돼야 해요.',
 concepts:[['원 위의 위치','중심 + 반지름 × (cos θ, sin θ). θ 는 라디안이다.'],['각도의 순환성','각도를 더할 때는 Mathf.Repeat 로 0 ~ 360 안에 유지한다.']]});
