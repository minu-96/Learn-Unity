/* ===== 문제 사전: 기초 =====
   학습 지도에는 없는 추가 문제. (분야, 단계, 레벨)마다 3문제가 한 세트. 같은 개념을 다른 상황에서 한 번 더 쓴다. */

/* ---- C# 기본 1단계 ---- */
QB({id:'x46',cat:'csharp',stage:1,level:1,title:'적의 능력치는 Inspector에서, 생존 여부는 읽기만',
 story:'기획자가 Inspector에서 적의 이동 속도와 공격력을 조절하고 싶어 해요. 그런데 다른 스크립트가 적의 생존 여부(IsAlive)를 마음대로 바꾸는 바람에 죽은 적이 되살아났어요. 능력치는 에디터에서 조절하되, 생존 여부는 이 클래스 안에서만 바꾸도록 만들어 주세요.',
 goals:['moveSpeed(float, 기본값 3)와 attackPower(int, 기본값 10)를 Inspector에서 수정할 수 있게 선언한다','IsAlive(bool)는 밖에서 읽기만 가능한 프로퍼티로 만든다','Awake에서 IsAlive를 true로 초기화한다'],
 limits:['moveSpeed와 attackPower는 public으로 선언하지 않는다','IsAlive는 Inspector에 나타나지 않아야 한다'],
 starter:C`
using UnityEngine;

public class Enemy : MonoBehaviour
{
    // TODO: moveSpeed, attackPower 선언

    // TODO: IsAlive 선언 (밖에서는 읽기만 가능)

    void Awake()
    {
        // TODO: 생존 상태로 초기화
    }
}`,
 solution:C`
using UnityEngine;

public class Enemy : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 3f;
    [SerializeField] private int attackPower = 10;
    public bool IsAlive { get; private set; }

    void Awake()
    {
        IsAlive = true;
    }
}`,
 rules:[
  has('moveSpeed 선언',/\[SerializeField\]\s*(?:private\s+)?float\s+moveSpeed\s*=\s*3(?:\.0*)?f?\s*;/,'moveSpeed를 [SerializeField] private float로 선언했어요.','moveSpeed는 [SerializeField]를 붙인 float 필드로 만들고 기본값을 3f로 두세요.'),
  has('attackPower 선언',/\[SerializeField\]\s*(?:private\s+)?int\s+attackPower\s*=\s*10\s*;/,'attackPower를 [SerializeField] int로 선언했어요.','attackPower는 [SerializeField]를 붙인 int 필드로 만들고 기본값을 10으로 두세요.'),
  no('public 필드 금지',/\bpublic\s+(?:float|int)\s+(?:moveSpeed|attackPower)\b/,'능력치를 public으로 열어 두지 않았어요.','public 필드는 모든 클래스가 값을 바꿀 수 있어요. [SerializeField] private을 쓰세요.'),
  has('읽기 전용 IsAlive',/\bpublic\s+bool\s+IsAlive\s*(?:\{\s*get;\s*(?:private|protected)\s+set;\s*\}|=>\s*\w+\s*;)/,'IsAlive를 밖에서는 읽기만 되는 프로퍼티로 공개했어요.','public bool IsAlive { get; private set; } 처럼 set을 private으로 막으세요.'),
  no('IsAlive 직접 공개 금지',/\bpublic\s+bool\s+isAlive\s*[;=]/,'생존 여부 필드를 직접 공개하지 않았어요.','public bool isAlive; 는 밖에서 덮어쓸 수 있어요. 프로퍼티로 바꾸세요.'),
  inFn('Awake에서 초기화','Awake',/\bIsAlive\s*=\s*true\s*;/,'Awake에서 IsAlive를 true로 맞췄어요.','Awake 안에서 IsAlive = true; 로 초기화하세요.')
 ],
 hints:['Inspector에는 보이지만 외부는 접근 못 하게 하는 조합은 [SerializeField] + private이에요.','밖에서 읽기만 가능하게 하려면 { get; private set; } 프로퍼티를 써요.','프로퍼티 이름은 관례상 대문자로 시작해요.'],
 why:'값마다 "누가 바꿀 수 있는가"를 정하는 것이 캡슐화예요. 기획자가 조절할 값은 [SerializeField], 코드로만 바꿔야 하는 상태는 private set 프로퍼티로 나누면 버그가 줄어요.',
 concepts:[['접근 제한자와 캡슐화','public/private으로 공개 범위를 정해 다른 클래스가 내부 값을 마음대로 바꾸지 못하게 한다.']]});

QB({id:'x47',cat:'csharp',stage:1,level:1,title:'상자는 한 번만 열리게',
 story:'보물 상자의 골드량은 Inspector에서 조절하고 싶고, 열렸는지 여부(Opened)는 다른 스크립트가 읽기만 하도록 하고 싶어요. 상자를 여는 Open 메서드는 열렸다는 표시를 남겨야 해요.',
 goals:['goldAmount(int, 기본값 50)를 Inspector에서 수정할 수 있게 선언한다','Opened(bool)는 밖에서 읽기만 가능한 프로퍼티로 만든다','Open()은 Opened를 true로 만든다'],
 limits:['goldAmount는 public으로 선언하지 않는다','Opened를 바꾸는 곳은 이 클래스 안에서만이다'],
 starter:C`
using UnityEngine;

public class Chest : MonoBehaviour
{
    // TODO: goldAmount 선언

    // TODO: Opened 선언 (밖에서는 읽기만 가능)

    public void Open()
    {
        // TODO: 열렸다고 표시
    }
}`,
 solution:C`
using UnityEngine;

public class Chest : MonoBehaviour
{
    [SerializeField] private int goldAmount = 50;
    public bool Opened { get; private set; }

    public void Open()
    {
        Opened = true;
    }
}`,
 rules:[
  has('goldAmount 선언',/\[SerializeField\]\s*(?:private\s+)?int\s+goldAmount\s*=\s*50\s*;/,'goldAmount를 [SerializeField] int로 선언했어요.','goldAmount는 [SerializeField]를 붙인 int 필드로 만들고 기본값을 50으로 두세요.'),
  no('public 필드 금지',/\bpublic\s+int\s+goldAmount\b/,'goldAmount를 public으로 열어 두지 않았어요.','public 필드는 모든 클래스가 값을 바꿀 수 있어요. [SerializeField] private을 쓰세요.'),
  has('읽기 전용 Opened',/\bpublic\s+bool\s+Opened\s*(?:\{\s*get;\s*(?:private|protected)\s+set;\s*\}|=>\s*\w+\s*;)/,'Opened를 읽기만 되는 프로퍼티로 공개했어요.','public bool Opened { get; private set; } 처럼 set을 private으로 막으세요.'),
  inFn('Open에서 표시','Open',/\bOpened\s*=\s*true\s*;/,'Open에서 Opened를 true로 바꿨어요.','Open 안에서 Opened = true; 를 쓰세요.')
 ],
 hints:['값은 Inspector에서, 상태는 읽기 전용 프로퍼티로 나누어요.','{ get; private set; } 프로퍼티는 클래스 안에서만 값을 바꿔요.','Open 메서드는 public이어야 다른 스크립트가 부를 수 있어요.'],
 why:'상태를 바꾸는 방법을 메서드로만 열어 두면, "열기" 같은 동작의 규칙을 한 곳에서 지킬 수 있어요. 밖에서는 읽기만 하고 바꾸는 건 Open()을 거치게 하는 구조예요.',
 concepts:[['읽기 전용 프로퍼티','get은 public, set은 private으로 두어 밖에서는 읽기만 하게 한다.']]});

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

QB({id:'x51',cat:'csharp',stage:1,level:3,title:'경험치바가 항상 0이거나 가득 차 있다',
 story:'경험치 바가 이상해요. 경험치가 30/120인데 0%로 보이고, 다 모았을 때만 100%가 돼요. 콘솔에 에러는 없어요. 경험치 비율과 퍼센트를 올바르게 계산하는 두 메서드를 완성해 주세요.',
 goals:['ExpRatio(exp, need): 0~1 사이의 float 비율을 반환한다 (30, 120 → 0.25)','ExpPercent(exp, need): 비율을 0~100 정수로 반올림해 반환한다 (1, 3 → 33)','need가 0 이하이면 0을 반환한다 (0으로 나누기 방지)','exp가 음수이거나 need를 넘어도 결과는 0~1 범위를 지킨다'],
 limits:['정수끼리 바로 나누지 않는다 (int / int 는 소수점을 버려요)','ExpPercent는 ExpRatio를 재사용한다'],
 starter:C`
float ExpRatio(int exp, int need)
{
    return exp / need;   // 30 / 120 을 계산하면?
}

int ExpPercent(int exp, int need)
{
    // TODO: ExpRatio를 이용해 0~100 정수로 (반올림)
    return 0;
}`,
 solution:C`
float ExpRatio(int exp, int need)
{
    if (need <= 0) return 0f;
    return Mathf.Clamp01((float)exp / need);
}

int ExpPercent(int exp, int need)
{
    return Mathf.RoundToInt(ExpRatio(exp, need) * 100f);
}`,
 rules:[inFn('ExpRatio 재사용','ExpPercent',/\bExpRatio\s*\(/,'ExpPercent가 ExpRatio를 재사용해요.','비율 계산을 복사하지 말고 ExpRatio(exp, need)를 호출하세요.')],
 test:(api,ok)=>{
  const r=(a,b)=>api.call('ExpRatio',a,b);
  ok('ExpRatio(30, 120)',Math.abs(r(30,120)-0.25)<1e-6,'30/120 = 0.25 를 반환했어요.',`ExpRatio(30, 120)이 ${r(30,120)} 입니다. 0.25여야 해요. 정수 나눗셈 때문일 수 있어요.`);
  ok('경계',r(120,120)===1&&r(0,120)===0,'가득 찬 경험치는 1, 0은 0이에요.','ExpRatio(120, 120)은 1, ExpRatio(0, 120)은 0이어야 해요.');
  ok('범위 제한',r(500,120)===1&&r(-5,120)===0,'범위를 벗어나는 exp도 0~1로 제한돼요.','ExpRatio(500, 120)은 1, ExpRatio(-5, 120)은 0이어야 해요. 클램프가 필요해요.');
  ok('need가 0',r(10,0)===0,'need가 0이어도 0을 반환해요.','ExpRatio(10, 0)은 0이어야 해요.');
  const p=(a,b)=>api.call('ExpPercent',a,b);
  ok('반올림',p(1,3)===33&&p(2,3)===67&&p(120,120)===100,'1/3→33, 2/3→67, 가득→100 이에요.',`ExpPercent(1,3)=${p(1,3)}, (2,3)=${p(2,3)}, (120,120)=${p(120,120)}. 각각 33, 67, 100이어야 해요.`);
 },
 hints:['exp와 need는 둘 다 int예요. int / int 는 소수점이 버려져요.','나누기 전에 한쪽을 (float)로 바꾸면 소수점이 살아나요.','결과를 Mathf.Clamp01로 감싸면 0~1 범위를 지켜요. 퍼센트는 Mathf.RoundToInt(비율 * 100f)로 구해요.'],
 why:'비율·퍼센트 계산에서는 정수 나눗셈, 0으로 나누기, 범위 초과 세 가지를 항상 함께 확인해요. 체력바든 경험치바든 같은 함정이에요.',
 concepts:[['정수 나눗셈','int / int 는 소수점 이하를 버린다. 비율 계산 전에 float으로 변환한다.']]});

QB({id:'x52',cat:'csharp',stage:1,level:3,title:'명중률이 항상 0%로 나온다',
 story:'사격 연습장의 결과 화면에서 12발 중 9발을 맞혔는데 명중률이 0%로 나와요. 정확도를 올바르게 계산하는 두 메서드를 완성해 주세요. 쏜 적이 없으면 명중률은 0이에요.',
 goals:['Accuracy(hits, shots): 0~1 사이의 float 비율을 반환한다 (9, 12 → 0.75)','AccuracyText(hits, shots): 퍼센트 정수를 "75%" 형태의 글자로 반환한다','shots가 0 이하이면 Accuracy는 0이다','맞힌 수가 쏜 수보다 커도 결과는 0~1 범위를 지킨다'],
 limits:['정수끼리 바로 나누지 않는다','AccuracyText는 Accuracy를 재사용한다'],
 starter:C`
float Accuracy(int hits, int shots)
{
    return hits / shots;   // 9 / 12 를 계산하면?
}

string AccuracyText(int hits, int shots)
{
    // TODO: Accuracy를 이용해 "75%" 형태로
    return "";
}`,
 solution:C`
float Accuracy(int hits, int shots)
{
    if (shots <= 0) return 0f;
    return Mathf.Clamp01((float)hits / shots);
}

string AccuracyText(int hits, int shots)
{
    int percent = Mathf.RoundToInt(Accuracy(hits, shots) * 100f);
    return percent + "%";
}`,
 rules:[inFn('Accuracy 재사용','AccuracyText',/\bAccuracy\s*\(/,'AccuracyText가 Accuracy를 재사용해요.','비율 계산을 복사하지 말고 Accuracy(hits, shots)를 호출하세요.')],
 test:(api,ok)=>{
  const a=(h,s)=>api.call('Accuracy',h,s);
  ok('Accuracy(9, 12)',Math.abs(a(9,12)-0.75)<1e-6,'9/12 = 0.75 를 반환했어요.',`Accuracy(9, 12)가 ${a(9,12)} 입니다. 0.75여야 해요. 정수 나눗셈 때문일 수 있어요.`);
  ok('경계',a(12,12)===1&&a(0,12)===0,'전부 맞히면 1, 못 맞히면 0이에요.','Accuracy(12, 12)는 1, Accuracy(0, 12)는 0이어야 해요.');
  ok('shots가 0',a(0,0)===0&&a(3,0)===0,'쏜 적이 없으면 0이에요.','shots가 0이면 Accuracy는 0이어야 해요.');
  ok('범위 제한',a(20,12)===1,'맞힌 수가 많아도 1로 제한돼요.','Accuracy(20, 12)는 1이어야 해요. 클램프가 필요해요.');
  const t=(h,s)=>api.call('AccuracyText',h,s);
  ok('글자',t(9,12)==='75%'&&t(1,3)==='33%'&&t(0,0)==='0%','75%, 33%, 0% 형태로 나와요.',`AccuracyText(9,12)="${t(9,12)}", (1,3)="${t(1,3)}", (0,0)="${t(0,0)}". 각각 "75%", "33%", "0%"여야 해요.`);
 },
 hints:['hits와 shots는 둘 다 int라 나눗셈에서 소수점이 버려져요.','한쪽을 (float)로 바꾼 뒤 나누고 Mathf.Clamp01로 감싸요.','글자는 정수 + "%" 로 이어 붙이면 돼요. 정수는 Mathf.RoundToInt로 만들어요.'],
 why:'같은 비율 계산이라도 결과를 숫자(0~1)로 쓸지 글자("75%")로 쓸지에 따라 표현만 달라져요. 계산은 한 메서드에 두고 표현 메서드가 재사용하는 구조가 깔끔해요.',
 concepts:[['계산과 표현 분리','비율은 한 메서드에서 계산하고, 글자로 바꾸는 메서드가 그것을 재사용한다.']]});

QB({id:'x53',cat:'csharp',stage:1,level:3,title:'쿨다운 표시가 이상하다',
 story:'스킬 쿨다운 UI에서 남은 시간이 1500ms/3000ms일 때 채움 비율이 0으로 나오고, 남은 초 표시도 1.5초가 아닌 1로 보여요. 쿨다운 채움 비율과 남은 초를 올바르게 계산해 주세요. 남은 초는 올림해서 정수로 보여 줘요(1500ms → 2초).',
 goals:['CooldownFill(remainMs, totalMs): 남은 비율(0~1 float)을 반환한다 (1500, 3000 → 0.5)','CooldownSeconds(remainMs): 남은 시간을 초 단위로 올림한 정수를 반환한다 (1500 → 2, 1000 → 1, 0 → 0)','totalMs가 0 이하이면 CooldownFill은 0이다','remainMs가 음수이거나 totalMs를 넘어도 CooldownFill은 0~1 범위를 지킨다'],
 limits:['정수끼리 바로 나누지 않는다 (int / int 는 소수점을 버려요)','초 계산에는 Mathf.CeilToInt를 쓴다'],
 starter:C`
float CooldownFill(int remainMs, int totalMs)
{
    return remainMs / totalMs;   // 1500 / 3000 을 계산하면?
}

int CooldownSeconds(int remainMs)
{
    // TODO: 남은 초를 올림해서 돌려주세요.
    return 0;
}`,
 solution:C`
float CooldownFill(int remainMs, int totalMs)
{
    if (totalMs <= 0) return 0f;
    return Mathf.Clamp01((float)remainMs / totalMs);
}

int CooldownSeconds(int remainMs)
{
    if (remainMs <= 0) return 0;
    return Mathf.CeilToInt(remainMs / 1000f);
}`,
 rules:[],
 test:(api,ok)=>{
  const f=(a,b)=>api.call('CooldownFill',a,b);
  ok('CooldownFill(1500, 3000)',Math.abs(f(1500,3000)-0.5)<1e-6,'1500/3000 = 0.5 를 반환했어요.',`CooldownFill(1500, 3000)이 ${f(1500,3000)} 입니다. 0.5여야 해요. 정수 나눗셈 때문일 수 있어요.`);
  ok('경계',f(3000,3000)===1&&f(0,3000)===0,'꽉 찬 쿨다운은 1, 끝났으면 0이에요.','CooldownFill(3000, 3000)은 1, CooldownFill(0, 3000)은 0이어야 해요.');
  ok('범위·0',f(4000,3000)===1&&f(-10,3000)===0&&f(100,0)===0,'범위를 벗어나거나 totalMs가 0이어도 안전해요.','CooldownFill(4000, 3000)은 1, (-10, 3000)은 0, (100, 0)은 0이어야 해요.');
  const s=a=>api.call('CooldownSeconds',a);
  ok('올림',s(1500)===2&&s(1000)===1&&s(1)===1&&s(0)===0,'1500→2, 1000→1, 1→1, 0→0 이에요.',`CooldownSeconds(1500)=${s(1500)}, (1000)=${s(1000)}, (1)=${s(1)}, (0)=${s(0)}. 각각 2, 1, 1, 0이어야 해요. 1000으로 나눌 때 float로 나눈 뒤 올림하세요.`);
 },
 hints:['int / int 는 소수점이 버려져요. 한쪽을 (float)로 바꿔요.','초 계산은 remainMs / 1000f 처럼 float로 나눈 뒤 Mathf.CeilToInt로 올림해요.','남은 시간이 0 이하이면 0을 돌려줘요.'],
 why:'같은 "나누기"라도 소수점을 버릴지(정수 나눗셈), 올릴지(올림), 반올림할지에 따라 UI에 보이는 숫자가 달라요. 쿨다운은 남은 시간을 올림해 보여 줘야 0초가 되기 전까지 1초로 보여요.',
 concepts:[['올림(Mathf.CeilToInt)','소수점이 조금이라도 남으면 다음 정수로 올린다. 남은 시간 표시에 자주 쓴다.']]});

/* ---- C# 기본 2단계 ---- */
QB({id:'x54',cat:'csharp',stage:2,level:1,title:'List로 퀘스트 목록 만들기',
 story:'퀘스트 목록을 만들고 있어요. 한 번에 받을 수 있는 퀘스트 수는 Inspector에서 조절할 수 있어야 하고, 같은 퀘스트를 두 번 받을 수는 없어요. 크기가 변하는 컬렉션인 List<string>으로 완성해 주세요.',
 goals:['AddQuest(name): 목록이 가득 찼거나 같은 이름이 이미 있으면 false, 아니면 추가하고 true','CompleteQuest(name): 있으면 제거하고 true, 없으면 false','QuestCount(): 지금 받은 퀘스트 수를 반환한다'],
 limits:['목록은 List<string> quests 로 관리한다 (배열 금지)','최대 개수는 maxQuests 필드를 사용하고 3 같은 숫자를 직접 쓰지 않는다'],
 starter:C`
using System.Collections.Generic;
using UnityEngine;

public class QuestLog : MonoBehaviour
{
    public int maxQuests = 3;
    private List<string> quests = new List<string>();

    bool AddQuest(string name)
    {
        // TODO: 가득 찼거나 중복이면 false, 아니면 추가하고 true
        return false;
    }

    bool CompleteQuest(string name)
    {
        // TODO
        return false;
    }

    int QuestCount()
    {
        // TODO
        return 0;
    }
}`,
 solution:C`
using System.Collections.Generic;
using UnityEngine;

public class QuestLog : MonoBehaviour
{
    public int maxQuests = 3;
    private List<string> quests = new List<string>();

    bool AddQuest(string name)
    {
        if (quests.Count >= maxQuests) return false;
        if (quests.Contains(name)) return false;
        quests.Add(name);
        return true;
    }

    bool CompleteQuest(string name)
    {
        return quests.Remove(name);
    }

    int QuestCount()
    {
        return quests.Count;
    }
}`,
 rules:[has('List 사용',/\bList\s*<\s*string\s*>\s+quests\b/,'List<string>으로 목록을 관리해요.','List<string> quests 로 목록을 관리하세요.'),
  inFn('maxQuests 사용','AddQuest',/\bmaxQuests\b/,'maxQuests로 크기를 제한해요.','AddQuest 안에서 maxQuests 필드로 가득 찼는지 확인하세요.')],
 test:(api,ok)=>{
  api.set('maxQuests',2);
  const a=api.call('AddQuest','늑대 사냥'),b=api.call('AddQuest','약초 모으기'),c=api.call('AddQuest','배달');
  ok('추가와 가득 참',a===true&&b===true&&c===false,'2개까지만 받을 수 있어요.',`maxQuests=2 일 때 ${a}, ${b}, ${c} 입니다. true, true, false 여야 해요.`);
  ok('중복 방지',api.call('AddQuest','늑대 사냥')===false,'같은 퀘스트는 거절해요.','이미 있는 퀘스트를 다시 받으면 false여야 해요.');
  ok('QuestCount',api.call('QuestCount')===2,'퀘스트 수가 2예요.',`QuestCount()가 ${api.call('QuestCount')} 입니다. 2여야 해요.`);
  ok('완료',api.call('CompleteQuest','늑대 사냥')===true&&api.call('CompleteQuest','없는 퀘스트')===false&&api.call('QuestCount')===1,'있는 것은 true, 없는 것은 false로 완료해요.','CompleteQuest는 있으면 지우고 true, 없으면 false여야 해요.');
  api.set('maxQuests',3);
  ok('크기 변경 반영',api.call('AddQuest','배달')===true&&api.call('AddQuest','순찰')===true&&api.call('AddQuest','수집')===false,'maxQuests를 바꾸면 크기도 바뀌어요.','maxQuests를 3으로 바꾸면 총 3개까지 받을 수 있어요. 숫자를 직접 쓰지 말고 필드를 쓰세요.');
 },
 hints:['List는 Add, Remove, Contains, Count로 다뤄요.','가득 찼는지는 quests.Count >= maxQuests 로 확인해요.','Remove는 지웠으면 true, 없으면 false를 돌려줘요. 그 값을 그대로 돌려주면 돼요.'],
 why:'배열은 크기가 고정이지만 List는 늘고 줄어요. 개수가 변하는 목록(퀘스트, 가방, 친구)에는 List가 기본이고, 최대 개수는 하드코딩하지 말고 필드로 빼 두면 기획자가 조절할 수 있어요.',
 concepts:[['List<T>','크기가 변하는 컬렉션. Add, Remove, Contains, Count 등을 제공한다.']]});

QB({id:'x55',cat:'csharp',stage:2,level:1,title:'점수 기록 List',
 story:'게임이 끝날 때마다 점수를 기록하고, 최고 점수와 평균을 보여 주려고 해요. List<int>로 점수 기록을 완성해 주세요. 기록이 하나도 없으면 최고 점수와 평균은 0이에요.',
 goals:['AddScore(s): 점수를 기록에 추가한다','BestScore(): 가장 높은 점수를 반환한다 (기록이 없으면 0)','AverageScore(): 평균을 float으로 반환한다 (기록이 없으면 0)'],
 limits:['기록은 List<int> scores 로 관리한다','평균은 소수점까지 나와야 한다 (int / int 주의)'],
 starter:C`
using System.Collections.Generic;
using UnityEngine;

public class Records : MonoBehaviour
{
    private List<int> scores = new List<int>();

    void AddScore(int s)
    {
        // TODO
    }

    int BestScore()
    {
        // TODO
        return 0;
    }

    float AverageScore()
    {
        // TODO
        return 0f;
    }
}`,
 solution:C`
using System.Collections.Generic;
using UnityEngine;

public class Records : MonoBehaviour
{
    private List<int> scores = new List<int>();

    void AddScore(int s)
    {
        scores.Add(s);
    }

    int BestScore()
    {
        if (scores.Count == 0) return 0;
        int best = scores[0];
        foreach (int s in scores)
        {
            if (s > best) best = s;
        }
        return best;
    }

    float AverageScore()
    {
        if (scores.Count == 0) return 0f;
        int sum = 0;
        foreach (int s in scores) sum += s;
        return (float)sum / scores.Count;
    }
}`,
 rules:[has('List 사용',/\bList\s*<\s*int\s*>\s+scores\b/,'List<int>로 기록을 관리해요.','List<int> scores 로 기록을 관리하세요.')],
 test:(api,ok)=>{
  ok('빈 기록',api.call('BestScore')===0&&api.call('AverageScore')===0,'기록이 없으면 0이에요.','기록이 없을 때 BestScore와 AverageScore는 0이어야 해요.');
  [40,90,20].forEach(s=>api.call('AddScore',s));
  ok('BestScore',api.call('BestScore')===90,'최고 점수가 90이에요.',`BestScore()가 ${api.call('BestScore')} 입니다. 90이어야 해요.`);
  const av=api.call('AverageScore');
  ok('평균',Math.abs(av-50)<1e-6,'(40+90+20)/3 = 50 이에요.',`AverageScore()가 ${av} 입니다. 50이어야 해요.`);
  api.call('AddScore',1);
  const av2=api.call('AverageScore');
  ok('소수점 평균',Math.abs(av2-37.75)<1e-6,'151/4 = 37.75 처럼 소수점까지 나와요.',`AverageScore()가 ${av2} 입니다. 37.75여야 해요. 정수 나눗셈은 소수점을 버려요.`);
  const lo=api.call('BestScore');
  ok('음수 점수',(()=>{api.call('AddScore',-5);return api.call('BestScore')===90})(),'음수가 섞여도 최고 점수는 그대로예요.','음수 점수가 들어와도 BestScore는 90이어야 해요. 0으로 시작하지 말고 첫 값으로 시작하세요.');
 },
 hints:['점수는 scores.Add(s)로 쌓아요.','최고 점수는 첫 값을 기준으로 두고, 더 큰 값이 나오면 바꿔요.','평균은 합계를 float으로 바꿔서 scores.Count로 나눠요.'],
 why:'리스트를 한 번 훑으면서 최대·합계 같은 값을 구하는 것은 가장 흔한 패턴이에요. 빈 리스트와 음수 같은 가장자리 경우를 함께 생각하는 습관이 중요해요.',
 concepts:[['컬렉션 훑기','foreach로 목록을 한 번 돌며 최댓값이나 합계를 구한다.']]});

QB({id:'x56',cat:'csharp',stage:2,level:1,title:'파티 초대 목록',
 story:'파티 초대 목록을 만들어요. 한 번에 초대할 수 있는 최대 인원은 Inspector에서 조절하고, 같은 사람을 두 번 초대할 수는 없어요. List<string>으로 완성해 주세요.',
 goals:['Invite(name): 가득 찼거나 이미 초대한 이름이면 false, 아니면 추가하고 true','Uninvite(name): 있으면 제거하고 true, 없으면 false','IsInvited(name): 초대 목록에 있으면 true'],
 limits:['목록은 List<string> guests 로 관리한다 (배열 금지)','최대 인원은 maxGuests 필드를 사용한다'],
 starter:C`
using System.Collections.Generic;
using UnityEngine;

public class Party : MonoBehaviour
{
    public int maxGuests = 4;
    private List<string> guests = new List<string>();

    bool Invite(string name)
    {
        // TODO
        return false;
    }

    bool Uninvite(string name)
    {
        // TODO
        return false;
    }

    bool IsInvited(string name)
    {
        // TODO
        return false;
    }
}`,
 solution:C`
using System.Collections.Generic;
using UnityEngine;

public class Party : MonoBehaviour
{
    public int maxGuests = 4;
    private List<string> guests = new List<string>();

    bool Invite(string name)
    {
        if (guests.Count >= maxGuests) return false;
        if (guests.Contains(name)) return false;
        guests.Add(name);
        return true;
    }

    bool Uninvite(string name)
    {
        return guests.Remove(name);
    }

    bool IsInvited(string name)
    {
        return guests.Contains(name);
    }
}`,
 rules:[has('List 사용',/\bList\s*<\s*string\s*>\s+guests\b/,'List<string>으로 목록을 관리해요.','List<string> guests 로 목록을 관리하세요.'),
  inFn('maxGuests 사용','Invite',/\bmaxGuests\b/,'maxGuests로 인원을 제한해요.','Invite 안에서 maxGuests 필드로 가득 찼는지 확인하세요.')],
 test:(api,ok)=>{
  api.set('maxGuests',2);
  const a=api.call('Invite','민수'),b=api.call('Invite','지연'),c=api.call('Invite','철수');
  ok('초대와 가득 참',a===true&&b===true&&c===false,'2명까지만 초대돼요.',`maxGuests=2 일 때 ${a}, ${b}, ${c} 입니다. true, true, false 여야 해요.`);
  ok('중복 방지',api.call('Invite','민수')===false,'같은 사람은 거절해요.','이미 초대한 사람을 다시 초대하면 false여야 해요.');
  ok('IsInvited',api.call('IsInvited','지연')===true&&api.call('IsInvited','철수')===false,'초대 여부를 알려 줘요.','IsInvited는 목록에 있으면 true, 없으면 false여야 해요.');
  ok('취소',api.call('Uninvite','민수')===true&&api.call('Uninvite','민수')===false&&api.call('IsInvited','민수')===false,'취소하면 목록에서 사라지고, 없는 사람은 false예요.','Uninvite는 있으면 지우고 true, 없으면 false여야 해요.');
  ok('자리 생김',api.call('Invite','철수')===true,'자리가 나면 다시 초대할 수 있어요.','한 명을 취소하면 새로 초대할 수 있어야 해요.');
 },
 hints:['Contains는 목록에 있는지 true/false로 알려 줘요.','Remove는 지웠으면 true, 없으면 false를 돌려줘요.','가득 찼는지는 guests.Count >= maxGuests 예요.'],
 why:'Contains로 "이미 있는가"를 확인하고 Count로 "자리가 있는가"를 확인하는 조합은 가방, 친구 목록, 파티 등 목록을 다루는 거의 모든 곳에서 반복돼요.',
 concepts:[['Contains와 Remove','목록에 있는지 확인하고, 있으면 제거한다. Remove는 지웠는지를 bool로 돌려준다.']]});

QB({id:'x57',cat:'csharp',stage:2,level:2,title:'시간이 다 된 버프 지우기',
 story:'버프들의 남은 시간(초) 목록에서 끝난 버프(0 이하)를 지우는 코드를 짰는데, "Collection was modified" 예외로 멈춰요. foreach로 도는 중에 같은 목록을 수정했기 때문이에요. 안전하게 지우도록 고쳐 주세요.',
 goals:['RemoveExpired(timers): 남은 시간이 0 이하인 값을 모두 같은 리스트에서 제거한다 (남은 값의 순서는 유지)','CountActive(timers): 남은 시간이 0보다 큰 값의 개수를 반환한다'],
 limits:['foreach 안에서 같은 리스트를 수정하지 않는다','새 리스트를 반환하지 않고 전달받은 리스트를 직접 수정한다 (반환형은 void)','연속으로 끝난 값(0, 0, 0)도 빠짐없이 지워져야 한다'],
 starter:C`
using System.Collections.Generic;

void RemoveExpired(List<float> timers)
{
    foreach (float t in timers)
    {
        if (t <= 0f)
        {
            timers.Remove(t);   // 순회 중 수정: InvalidOperationException
        }
    }
}

int CountActive(List<float> timers)
{
    // TODO
    return 0;
}`,
 solution:C`
using System.Collections.Generic;

void RemoveExpired(List<float> timers)
{
    timers.RemoveAll(t => t <= 0f);
}

int CountActive(List<float> timers)
{
    int n = 0;
    foreach (float t in timers)
    {
        if (t > 0f) n++;
    }
    return n;
}`,
 alts:[C`
using System.Collections.Generic;

void RemoveExpired(List<float> timers)
{
    for (int i = timers.Count - 1; i >= 0; i--)
    {
        if (timers[i] <= 0f) timers.RemoveAt(i);
    }
}

int CountActive(List<float> timers)
{
    int n = 0;
    for (int i = 0; i < timers.Count; i++)
    {
        if (timers[i] > 0f) n++;
    }
    return n;
}`],
 rules:[
  notInLoop('foreach 안에서 수정 금지','foreach',/\.(?:Remove|RemoveAt|RemoveAll|Add|Insert|Clear)\s*\(/,'foreach 안에서 리스트를 수정하지 않았어요.','foreach로 도는 컬렉션을 반복문 안에서 수정하면 예외가 나요. RemoveAll이나 뒤에서부터 도는 for를 쓰세요.'),
  inFn('RemoveExpired가 제거함','RemoveExpired',/RemoveAll\s*\(|RemoveAt\s*\(|\.Remove\s*\(/,'RemoveExpired가 리스트에서 값을 제거해요.','RemoveExpired 안에서 리스트의 값을 직접 제거하세요.')
 ],
 test:(api,ok)=>{
  const l=[0,5,0,0,7,-1];
  api.call('RemoveExpired',l);
  ok('연속된 값까지 제거',JSON.stringify(l)==='[5,7]','끝난 값만 지워지고 [5, 7] 이 남았어요.',`RemoveExpired 후 리스트가 [${l.join(', ')}] 입니다. [5, 7] 이어야 해요. 앞에서부터 도는 for문에서 RemoveAt하면 다음 값을 건너뛰어요.`);
  const l2=[3,4];api.call('RemoveExpired',l2);
  ok('남은 값 보존',JSON.stringify(l2)==='[3,4]','모두 남아 있으면 그대로예요.','아직 시간이 남은 값이 지워졌어요.');
  const e=[];api.call('RemoveExpired',e);
  ok('빈 리스트',e.length===0,'빈 리스트도 안전해요.','빈 리스트에서도 문제없이 동작해야 해요.');
  ok('CountActive',api.call('CountActive',[0,5,0,2,9])===3,'남은 시간이 있는 버프 수를 셌어요.',`CountActive([0,5,0,2,9]) 는 3이어야 해요 (현재 ${api.call('CountActive',[0,5,0,2,9])}).`);
 },
 hints:['foreach는 순회하는 동안 컬렉션이 바뀌면 예외를 던져요.','조건에 맞는 요소를 한 번에 지우는 List.RemoveAll(조건)이 있어요.','for로 지운다면 뒤에서부터 돌아야 인덱스가 밀리지 않아요.'],
 why:'foreach로 도는 컬렉션을 수정하면 열거자가 상태를 잃어요. 지울 때는 RemoveAll로 조건을 넘기거나 뒤에서부터 도는 for를 쓰세요. 대상이 적에서 버프로 바뀌어도 같은 함정이에요.',
 concepts:[['List.RemoveAll','조건에 맞는 요소를 한 번에 제거하는 List 메서드.']]});

QB({id:'x58',cat:'csharp',stage:2,level:2,title:'빈 이름 칸 지우기',
 story:'랭킹 이름 목록에 빈 글자("")가 섞여 있어요. 빈 이름을 지우는 코드를 foreach로 짰더니 "Collection was modified" 예외가 나요. 안전하게 지우도록 고쳐 주세요.',
 goals:['RemoveEmpty(names): 빈 글자("")인 값을 모두 같은 리스트에서 제거한다 (남은 값의 순서는 유지)','CountNames(names): 빈 글자가 아닌 값의 개수를 반환한다'],
 limits:['foreach 안에서 같은 리스트를 수정하지 않는다','새 리스트를 반환하지 않고 전달받은 리스트를 직접 수정한다 (반환형은 void)','연속으로 빈 값("", "")도 빠짐없이 지워져야 한다'],
 starter:C`
using System.Collections.Generic;

void RemoveEmpty(List<string> names)
{
    foreach (string n in names)
    {
        if (n == "")
        {
            names.Remove(n);   // 순회 중 수정: InvalidOperationException
        }
    }
}

int CountNames(List<string> names)
{
    // TODO
    return 0;
}`,
 solution:C`
using System.Collections.Generic;

void RemoveEmpty(List<string> names)
{
    names.RemoveAll(n => n == "");
}

int CountNames(List<string> names)
{
    int c = 0;
    foreach (string n in names)
    {
        if (n != "") c++;
    }
    return c;
}`,
 alts:[C`
using System.Collections.Generic;

void RemoveEmpty(List<string> names)
{
    for (int i = names.Count - 1; i >= 0; i--)
    {
        if (names[i] == "") names.RemoveAt(i);
    }
}

int CountNames(List<string> names)
{
    return names.Count - names.FindAll(n => n == "").Count;
}`],
 rules:[
  notInLoop('foreach 안에서 수정 금지','foreach',/\.(?:Remove|RemoveAt|RemoveAll|Add|Insert|Clear)\s*\(/,'foreach 안에서 리스트를 수정하지 않았어요.','foreach로 도는 컬렉션을 반복문 안에서 수정하면 예외가 나요. RemoveAll이나 뒤에서부터 도는 for를 쓰세요.'),
  inFn('RemoveEmpty가 제거함','RemoveEmpty',/RemoveAll\s*\(|RemoveAt\s*\(|\.Remove\s*\(/,'RemoveEmpty가 리스트에서 값을 제거해요.','RemoveEmpty 안에서 리스트의 값을 직접 제거하세요.')
 ],
 test:(api,ok)=>{
  const l=['민수','','','지연','','철수'];
  api.call('RemoveEmpty',l);
  ok('연속된 빈 값까지 제거',JSON.stringify(l)==='["민수","지연","철수"]','빈 값만 지워지고 이름 3개가 남았어요.',`RemoveEmpty 후 리스트가 ${JSON.stringify(l)} 입니다. ["민수","지연","철수"] 이어야 해요. 앞에서부터 도는 for문에서 RemoveAt하면 다음 값을 건너뛰어요.`);
  const l2=['a','b'];api.call('RemoveEmpty',l2);
  ok('이름 보존',JSON.stringify(l2)==='["a","b"]','모두 이름이면 그대로예요.','이름이 있는 값이 지워졌어요.');
  const e=[];api.call('RemoveEmpty',e);
  ok('빈 리스트',e.length===0,'빈 리스트도 안전해요.','빈 리스트에서도 문제없이 동작해야 해요.');
  ok('CountNames',api.call('CountNames',['','가','','나','다'])===3,'이름이 있는 값의 수를 셌어요.',`CountNames(["","가","","나","다"]) 는 3이어야 해요 (현재 ${api.call('CountNames',['','가','','나','다'])}).`);
 },
 hints:['foreach는 순회하는 동안 컬렉션이 바뀌면 예외를 던져요.','RemoveAll(조건)으로 한 번에 지울 수 있어요.','for로 지운다면 뒤에서부터 돌아야 인덱스가 밀리지 않아요.'],
 why:'리스트를 정리하는 일(빈 값 제거, 끝난 것 제거, 죽은 것 제거)은 모두 같은 구조예요. 조건만 바뀌고, 순회 중 수정 금지라는 규칙은 그대로예요.',
 concepts:[['순회 중 수정 금지','foreach로 도는 컬렉션은 반복문 안에서 바꾸지 않는다.']]});

QB({id:'x59',cat:'csharp',stage:2,level:2,title:'멀어진 적 지우기',
 story:'추적 중인 적들과의 거리 목록에서 너무 멀어진 적(limit 초과)을 지우려고 해요. 지금 코드는 foreach 안에서 Remove를 불러 예외가 나요. 안전하게 지우도록 고쳐 주세요.',
 goals:['RemoveFar(dists, limit): limit보다 큰 거리를 모두 같은 리스트에서 제거한다 (남은 값의 순서는 유지)','CountNear(dists, limit): limit 이하인 거리의 개수를 반환한다'],
 limits:['foreach 안에서 같은 리스트를 수정하지 않는다','새 리스트를 반환하지 않고 전달받은 리스트를 직접 수정한다 (반환형은 void)','limit과 정확히 같은 거리는 남긴다'],
 starter:C`
using System.Collections.Generic;

void RemoveFar(List<float> dists, float limit)
{
    foreach (float d in dists)
    {
        if (d > limit)
        {
            dists.Remove(d);   // 순회 중 수정: InvalidOperationException
        }
    }
}

int CountNear(List<float> dists, float limit)
{
    // TODO
    return 0;
}`,
 solution:C`
using System.Collections.Generic;

void RemoveFar(List<float> dists, float limit)
{
    dists.RemoveAll(d => d > limit);
}

int CountNear(List<float> dists, float limit)
{
    int n = 0;
    foreach (float d in dists)
    {
        if (d <= limit) n++;
    }
    return n;
}`,
 alts:[C`
using System.Collections.Generic;

void RemoveFar(List<float> dists, float limit)
{
    for (int i = dists.Count - 1; i >= 0; i--)
    {
        if (dists[i] > limit) dists.RemoveAt(i);
    }
}

int CountNear(List<float> dists, float limit)
{
    int n = 0;
    for (int i = 0; i < dists.Count; i++)
    {
        if (dists[i] <= limit) n++;
    }
    return n;
}`],
 rules:[
  notInLoop('foreach 안에서 수정 금지','foreach',/\.(?:Remove|RemoveAt|RemoveAll|Add|Insert|Clear)\s*\(/,'foreach 안에서 리스트를 수정하지 않았어요.','foreach로 도는 컬렉션을 반복문 안에서 수정하면 예외가 나요. RemoveAll이나 뒤에서부터 도는 for를 쓰세요.'),
  inFn('RemoveFar가 제거함','RemoveFar',/RemoveAll\s*\(|RemoveAt\s*\(|\.Remove\s*\(/,'RemoveFar가 리스트에서 값을 제거해요.','RemoveFar 안에서 리스트의 값을 직접 제거하세요.')
 ],
 test:(api,ok)=>{
  const l=[2,9,10,3,12,12,4];
  api.call('RemoveFar',l,5);
  ok('연속된 값까지 제거',JSON.stringify(l)==='[2,3,4]','멀리 있는 값만 지워지고 [2, 3, 4] 가 남았어요.',`RemoveFar 후 리스트가 [${l.join(', ')}] 입니다. [2, 3, 4] 여야 해요. 앞에서부터 도는 for문에서 RemoveAt하면 다음 값을 건너뛰어요.`);
  const l2=[5,5];api.call('RemoveFar',l2,5);
  ok('경계 값 보존',JSON.stringify(l2)==='[5,5]','limit과 같은 거리는 남아요.','limit과 같은 값은 지우면 안 돼요. > 를 쓰세요.');
  const e=[];api.call('RemoveFar',e,5);
  ok('빈 리스트',e.length===0,'빈 리스트도 안전해요.','빈 리스트에서도 문제없이 동작해야 해요.');
  ok('CountNear',api.call('CountNear',[1,6,5,9,2],5)===3,'limit 이하인 거리의 수를 셌어요.',`CountNear([1,6,5,9,2], 5) 는 3이어야 해요 (현재 ${api.call('CountNear',[1,6,5,9,2],5)}).`);
 },
 hints:['foreach는 순회하는 동안 컬렉션이 바뀌면 예외를 던져요.','RemoveAll(조건)으로 한 번에 지울 수 있어요.','경계 값(limit과 같음)을 남길지 지울지 > 와 >= 로 정해요.'],
 why:'기준 값이 바뀌어도(체력 0, 시간 0, 거리 limit) 리스트에서 조건에 맞는 것만 지우는 구조는 같아요. 경계 값이 어느 쪽에 들어가는지만 항상 확인하세요.',
 concepts:[['조건부 제거','RemoveAll에 조건을 넘기면 한 번에 안전하게 지울 수 있다.']]});

QB({id:'x60',cat:'csharp',stage:2,level:3,title:'y만 따라가는 카메라 (CS1612)',
 story:'세로 스크롤 카메라가 플레이어의 높이(y)만 따라가고 가로 위치(x)는 그대로여야 해요. 그런데 아래 코드는 컴파일조차 되지 않아요:\nerror CS1612: Cannot modify the return value of \'Transform.position\' because it is not a variable.\ntransform.position은 값이 복사되어 나오는 구조체라서 y만 바로 바꿀 수 없어요. 올바르게 고쳐 주세요.',
 goals:['LateUpdate에서 target.position.y 를 카메라 transform.position.y 에 반영한다','x와 z는 기존 값을 유지한다'],
 limits:['transform.position.y 에 직접 대입하지 않는다','Vector3 값을 지역 변수에 복사해 수정하거나, 새 Vector3를 만들어 대입한다'],
 starter:C`
public Transform target;

void LateUpdate()
{
    // error CS1612
    transform.position.y = target.position.y;
}`,
 solution:C`
public Transform target;

void LateUpdate()
{
    Vector3 pos = transform.position;
    pos.y = target.position.y;
    transform.position = pos;
}`,
 alts:[C`
public Transform target;

void LateUpdate()
{
    transform.position = new Vector3(transform.position.x, target.position.y, transform.position.z);
}`],
 rules:[inFn('position을 다시 대입','LateUpdate',/\btransform\.position\s*=(?!=)/,'수정한 값을 transform.position에 다시 대입했어요.','transform.position은 복사본이에요. 수정한 Vector3를 transform.position = pos; 로 다시 대입해야 해요.')],
 test:(api,ok)=>{
  api.transform.position={x:7,y:0,z:-10};
  api.set('target',{position:{x:99,y:42}});
  api.call('LateUpdate');
  const p=api.transform.position;
  ok('y 따라가기',p.y===42,'카메라 y가 target.y(42)를 따라가요.',`카메라 y가 ${p.y} 입니다. target의 y(42)가 되어야 해요.`);
  ok('x 유지',p.x===7,'x는 그대로예요.',`카메라 x가 ${p.x}로 바뀌었어요. x는 원래 값(7)을 유지해야 해요.`);
  ok('z 유지',p.z===-10,'z는 그대로예요.',`카메라 z가 ${p.z}로 바뀌었어요. z는 원래 값(-10)을 유지해야 해요.`);
 },
 hints:['Vector3는 구조체라 transform.position은 복사본을 줘요. 복사본의 y를 바꿔도 원본은 그대로예요.','Vector3 pos = transform.position; 으로 복사한 뒤 pos.y를 바꿔요.','바꾼 pos를 transform.position = pos; 로 되돌려 넣어요.'],
 why:'transform.position은 값을 복사해서 돌려주기 때문에 한 축만 바로 바꿀 수 없어요. 복사 → 수정 → 다시 대입의 세 걸음은 x, y, z 어느 축이든 같아요.',
 concepts:[['CS1612와 구조체 복사','Vector3는 구조체라 transform.position은 복사본이다. 지역 변수에 복사해 고친 뒤 다시 대입한다.']]});

QB({id:'x61',cat:'csharp',stage:2,level:3,title:'땅에 붙이기 (CS1612)',
 story:'캐릭터가 점프 후에 땅(y=0)보다 아래로 내려가는 버그가 있어요. LateUpdate에서 y가 0보다 작으면 0으로 맞추고 싶은데, 아래 코드는 컴파일조차 되지 않아요:\nerror CS1612: Cannot modify the return value of \'Transform.position\' because it is not a variable.\n올바르게 고쳐 주세요.',
 goals:['LateUpdate에서 y가 0보다 작으면 y를 0으로 맞춘다','y가 0 이상이면 위치를 바꾸지 않는다','x와 z는 기존 값을 유지한다'],
 limits:['transform.position.y 에 직접 대입하지 않는다','Vector3 값을 지역 변수에 복사해 수정하거나, 새 Vector3를 만들어 대입한다'],
 starter:C`
void LateUpdate()
{
    if (transform.position.y < 0f)
    {
        // error CS1612
        transform.position.y = 0f;
    }
}`,
 solution:C`
void LateUpdate()
{
    Vector3 pos = transform.position;
    if (pos.y < 0f)
    {
        pos.y = 0f;
        transform.position = pos;
    }
}`,
 alts:[C`
void LateUpdate()
{
    Vector3 pos = transform.position;
    pos.y = Mathf.Max(pos.y, 0f);
    transform.position = pos;
}`],
 rules:[inFn('position을 다시 대입','LateUpdate',/\btransform\.position\s*=(?!=)/,'수정한 값을 transform.position에 다시 대입했어요.','수정한 Vector3를 transform.position = pos; 로 다시 대입해야 해요.')],
 test:(api,ok)=>{
  api.transform.position={x:3,y:-2,z:5};
  api.call('LateUpdate');
  let p=api.transform.position;
  ok('땅 아래는 0으로',p.y===0,'땅 아래로 내려가면 y가 0이 돼요.',`y가 ${p.y} 입니다. 0보다 작으면 0이어야 해요.`);
  ok('x, z 유지',p.x===3&&p.z===5,'x와 z는 그대로예요.',`x=${p.x}, z=${p.z} 입니다. x는 3, z는 5를 유지해야 해요.`);
  api.transform.position={x:1,y:4,z:2};
  api.call('LateUpdate');
  p=api.transform.position;
  ok('공중은 그대로',p.y===4,'공중에서는 y가 바뀌지 않아요.',`y가 ${p.y}로 바뀌었어요. 0 이상이면 그대로 둬야 해요.`);
 },
 hints:['Vector3는 구조체라 transform.position의 y를 바로 못 바꿔요.','Vector3 pos = transform.position; 으로 복사한 뒤 pos.y를 바꿔요.','바꾼 pos를 transform.position = pos; 로 다시 넣어요.'],
 why:'값을 읽어서 조건에 따라 한 축만 바꾸는 일은 경계 처리(바닥, 천장, 벽)에서 늘 나와요. 복사 → 수정 → 다시 대입 순서를 손에 익혀 두세요.',
 concepts:[['복사 후 수정','구조체는 복사본을 고쳐서 다시 대입해야 원본에 반영된다.']]});

QB({id:'x62',cat:'csharp',stage:2,level:3,title:'좌우 반전 (CS1612)',
 story:'캐릭터가 왼쪽으로 갈 때 이미지를 뒤집으려고 localScale의 x를 -1로 바꾸고 싶은데, 아래 코드는 컴파일조차 되지 않아요:\nerror CS1612: Cannot modify the return value of \'Transform.localScale\' because it is not a variable.\nlocalScale도 값이 복사되어 나오는 구조체예요. 올바르게 고쳐 주세요.',
 goals:['Flip(dir): dir이 0보다 작으면 localScale.x를 -1로, 아니면 1로 만든다','y와 z 스케일은 기존 값을 유지한다'],
 limits:['transform.localScale.x 에 직접 대입하지 않는다','Vector3 값을 지역 변수에 복사해 수정하거나, 새 Vector3를 만들어 대입한다'],
 starter:C`
void Flip(float dir)
{
    // error CS1612
    transform.localScale.x = dir < 0f ? -1f : 1f;
}`,
 solution:C`
void Flip(float dir)
{
    Vector3 s = transform.localScale;
    s.x = dir < 0f ? -1f : 1f;
    transform.localScale = s;
}`,
 alts:[C`
void Flip(float dir)
{
    transform.localScale = new Vector3(dir < 0f ? -1f : 1f, transform.localScale.y, transform.localScale.z);
}`],
 rules:[inFn('localScale을 다시 대입','Flip',/\btransform\.localScale\s*=(?!=)/,'수정한 값을 transform.localScale에 다시 대입했어요.','수정한 Vector3를 transform.localScale = s; 로 다시 대입해야 해요.')],
 test:(api,ok)=>{
  api.transform.localScale={x:1,y:2,z:3};
  api.call('Flip',-1);
  let s=api.transform.localScale;
  ok('왼쪽이면 -1',s.x===-1,'왼쪽을 보면 x 스케일이 -1이에요.',`x 스케일이 ${s.x} 입니다. -1이어야 해요.`);
  ok('y, z 유지',s.y===2&&s.z===3,'y와 z 스케일은 그대로예요.',`y=${s.y}, z=${s.z} 입니다. 각각 2, 3을 유지해야 해요.`);
  api.call('Flip',1);
  s=api.transform.localScale;
  ok('오른쪽이면 1',s.x===1,'오른쪽을 보면 x 스케일이 1이에요.',`x 스케일이 ${s.x} 입니다. 1이어야 해요.`);
 },
 hints:['localScale도 transform.position처럼 구조체 복사본을 줘요.','Vector3 s = transform.localScale; 로 복사한 뒤 s.x를 바꿔요.','바꾼 s를 transform.localScale = s; 로 다시 넣어요.'],
 why:'CS1612는 position만의 문제가 아니라 Vector3를 돌려주는 모든 프로퍼티(localScale, eulerAngles 등)에서 나와요. 같은 해결 순서(복사, 수정, 대입)로 해결해요.',
 concepts:[['Vector3 프로퍼티','position, localScale, eulerAngles는 모두 복사본을 돌려준다. 고치려면 복사 후 다시 대입한다.']]});

/* ---- 컴포넌트 1단계 ---- */
QB({id:'x63',cat:'components',stage:1,level:1,title:'Update마다 GetComponent를 부르는 이동',
 story:'D 키를 누르는 동안 오른쪽으로 달리는 스크립트예요. 그런데 Update에서 매 프레임 GetComponent<Rigidbody2D>()로 컴포넌트를 찾고 있어요. 컴포넌트 검색은 가벼운 작업이 아니라서 이런 호출이 쌓이면 성능이 떨어져요. 한 번만 찾아서 재사용하도록 바꿔 주세요.',
 goals:['Rigidbody2D를 가리키는 필드(rb)를 만든다','Awake에서 GetComponent로 한 번만 가져와 rb에 저장한다','Update에서는 GetComponent를 호출하지 않고 rb를 사용한다','기능은 그대로: D 키를 누르는 동안 x 속도가 moveSpeed가 된다'],
 limits:['Update 안에서 GetComponent 호출 금지','Update 안에서 Rigidbody2D 지역 변수를 새로 만들지 않는다'],
 api:'GetComponent<T>(), Input.GetKey, rb.velocity',
 starter:C`
using UnityEngine;

public class Runner : MonoBehaviour
{
    public float moveSpeed = 5f;

    void Update()
    {
        // 매 프레임 컴포넌트를 새로 찾고 있어요
        Rigidbody2D rb = GetComponent<Rigidbody2D>();
        if (Input.GetKey(KeyCode.D))
        {
            rb.velocity = new Vector2(moveSpeed, rb.velocity.y);
        }
    }
}`,
 solution:C`
using UnityEngine;

public class Runner : MonoBehaviour
{
    public float moveSpeed = 5f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        if (Input.GetKey(KeyCode.D))
        {
            rb.velocity = new Vector2(moveSpeed, rb.velocity.y);
        }
    }
}`,
 rules:[
  has('rb 필드',/\bRigidbody2D\s+rb\s*;/,'Rigidbody2D를 담을 rb 필드가 있어요.','Rigidbody2D를 담아 둘 필드(private Rigidbody2D rb;)를 클래스에 선언하세요.'),
  inFn('Awake에서 캐싱','Awake',/\brb\s*=\s*GetComponent\s*<\s*Rigidbody2D\s*>\s*\(\s*\)|TryGetComponent\s*(?:<\s*Rigidbody2D\s*>)?\s*\(\s*out\s+rb\b/,'Awake에서 한 번만 가져와 rb에 저장해요.','Awake에서 rb = GetComponent<Rigidbody2D>(); 로 한 번만 가져와 저장하세요.'),
  notIn('Update에서 GetComponent 금지','Update',/\bGetComponent\b/,'Update에서 GetComponent를 부르지 않아요.','Update에서는 GetComponent를 호출하지 마세요. 필드 rb를 쓰면 됩니다.'),
  notIn('Update에서 지역 변수 금지','Update',/\bRigidbody2D\s+\w+\s*=/,'Update에서 새 지역 변수를 만들지 않아요.','Update 안에서 Rigidbody2D rb = ... 를 쓰면 필드를 가려서 캐싱한 의미가 없어요.')
 ],
 test:(api,ok)=>{
  const rb=api.mk.rb();
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.env.getCalls=0;
  api.env.Input.GetKey=k=>k==='D';
  for(let i=0;i<10;i++)api.call('Update');
  const n=api.env.getCalls;
  ok('GetComponent 호출 횟수',n===0,'Update 10번 동안 GetComponent를 한 번도 호출하지 않았어요.',`Update 10번 동안 GetComponent를 ${n}번 호출했어요. 캐싱한 필드를 쓰세요.`);
  ok('이동 동작 유지',rb.velocity.x===5,'D 키를 누르면 x 속도가 moveSpeed가 돼요.','D 키를 누르는 동안 x속도가 moveSpeed(5)가 되어야 해요.');
 },
 hints:['GetComponent는 오브젝트의 컴포넌트 목록을 뒤져서 찾아요. 매 프레임 하면 같은 일을 반복해요.','결과를 담아 둘 필드를 만들고, 오브젝트가 만들어질 때 한 번만 채워 넣어요.','Awake는 오브젝트가 만들어질 때 한 번 호출돼요.'],
 why:'자주 쓰는 컴포넌트 참조는 Awake(또는 Start)에서 한 번 가져와 필드에 저장하는 것이 기본 습관이에요. 점프든 이동이든 같은 구조예요.',
 concepts:[['컴포넌트 캐싱','GetComponent의 결과를 필드에 저장해 재사용한다.']]});

QB({id:'x64',cat:'components',stage:1,level:1,title:'매 프레임 GetComponent로 낙하 속도 제한',
 story:'낙하 속도를 제한하는 스크립트예요. 아래로 떨어지는 속도가 maxFall(12)보다 빨라지면 maxFall로 고정해요. 그런데 Update에서 매 프레임 GetComponent<Rigidbody2D>()를 부르고 있어요. 한 번만 찾아서 재사용하도록 바꿔 주세요.',
 goals:['Rigidbody2D를 가리키는 필드(rb)를 만든다','Awake에서 GetComponent로 한 번만 가져와 rb에 저장한다','Update에서는 GetComponent를 호출하지 않고 rb를 사용한다','기능은 그대로: 아래로 떨어지는 속도가 -maxFall보다 빠르면 -maxFall로 고정한다'],
 limits:['Update 안에서 GetComponent 호출 금지','Update 안에서 Rigidbody2D 지역 변수를 새로 만들지 않는다'],
 api:'GetComponent<T>(), rb.velocity',
 starter:C`
using UnityEngine;

public class FallLimiter : MonoBehaviour
{
    public float maxFall = 12f;

    void Update()
    {
        // 매 프레임 컴포넌트를 새로 찾고 있어요
        Rigidbody2D rb = GetComponent<Rigidbody2D>();
        if (rb.velocity.y < -maxFall)
        {
            rb.velocity = new Vector2(rb.velocity.x, -maxFall);
        }
    }
}`,
 solution:C`
using UnityEngine;

public class FallLimiter : MonoBehaviour
{
    public float maxFall = 12f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        if (rb.velocity.y < -maxFall)
        {
            rb.velocity = new Vector2(rb.velocity.x, -maxFall);
        }
    }
}`,
 rules:[
  has('rb 필드',/\bRigidbody2D\s+rb\s*;/,'Rigidbody2D를 담을 rb 필드가 있어요.','Rigidbody2D를 담아 둘 필드(private Rigidbody2D rb;)를 클래스에 선언하세요.'),
  inFn('Awake에서 캐싱','Awake',/\brb\s*=\s*GetComponent\s*<\s*Rigidbody2D\s*>\s*\(\s*\)|TryGetComponent\s*(?:<\s*Rigidbody2D\s*>)?\s*\(\s*out\s+rb\b/,'Awake에서 한 번만 가져와 rb에 저장해요.','Awake에서 rb = GetComponent<Rigidbody2D>(); 로 한 번만 가져와 저장하세요.'),
  notIn('Update에서 GetComponent 금지','Update',/\bGetComponent\b/,'Update에서 GetComponent를 부르지 않아요.','Update에서는 GetComponent를 호출하지 마세요. 필드 rb를 쓰면 됩니다.'),
  notIn('Update에서 지역 변수 금지','Update',/\bRigidbody2D\s+\w+\s*=/,'Update에서 새 지역 변수를 만들지 않아요.','Update 안에서 Rigidbody2D rb = ... 를 쓰면 필드를 가려서 캐싱한 의미가 없어요.')
 ],
 test:(api,ok)=>{
  const rb=api.mk.rb();
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.env.getCalls=0;
  rb.velocity={x:3,y:-20};
  for(let i=0;i<10;i++)api.call('Update');
  const n=api.env.getCalls;
  ok('GetComponent 호출 횟수',n===0,'Update 10번 동안 GetComponent를 한 번도 호출하지 않았어요.',`Update 10번 동안 GetComponent를 ${n}번 호출했어요. 캐싱한 필드를 쓰세요.`);
  ok('낙하 속도 제한',rb.velocity.y===-12&&rb.velocity.x===3,'낙하 속도가 -12로 제한되고 x 속도는 유지돼요.',`속도가 (${rb.velocity.x}, ${rb.velocity.y}) 입니다. (3, -12)여야 해요.`);
  rb.velocity={x:0,y:-5};api.call('Update');
  ok('느리면 그대로',rb.velocity.y===-5,'제한보다 느리면 건드리지 않아요.','속도가 -12보다 느릴 때는 그대로 두어야 해요.');
 },
 hints:['GetComponent는 매 프레임 부르면 같은 일을 반복해요.','결과를 담아 둘 필드를 만들고 Awake에서 한 번만 채워요.','Update에서는 필드 rb를 그대로 써요.'],
 why:'캐싱은 어떤 동작이든 같은 구조예요. "Awake에서 한 번 찾고 Update에서 쓴다"를 손에 익혀 두면 성능 문제를 미리 피할 수 있어요.',
 concepts:[['컴포넌트 캐싱','GetComponent의 결과를 필드에 저장해 재사용한다. 보통 Awake에서 한 번만 가져온다.']]});

QB({id:'x65',cat:'components',stage:1,level:1,title:'Animator를 한 번만 찾기',
 story:'캐릭터가 오른쪽 키(D)를 누르는 동안 Animator의 "Run" 값을 켜고, 떼면 끄려고 해요. 그런데 Update에서 매 프레임 GetComponent<Animator>()를 부르고 있어요. 한 번만 찾아서 재사용하도록 바꿔 주세요.',
 goals:['Animator를 가리키는 필드(anim)를 만든다','Awake에서 GetComponent로 한 번만 가져와 anim에 저장한다','Update에서는 GetComponent를 호출하지 않고 anim을 사용한다','기능은 그대로: D 키를 누르는 동안 SetBool("Run", true), 아니면 false'],
 limits:['Update 안에서 GetComponent 호출 금지','Update 안에서 Animator 지역 변수를 새로 만들지 않는다'],
 api:'GetComponent<T>(), Animator.SetBool, Input.GetKey',
 starter:C`
using UnityEngine;

public class RunAnim : MonoBehaviour
{
    void Update()
    {
        // 매 프레임 컴포넌트를 새로 찾고 있어요
        Animator anim = GetComponent<Animator>();
        anim.SetBool("Run", Input.GetKey(KeyCode.D));
    }
}`,
 solution:C`
using UnityEngine;

public class RunAnim : MonoBehaviour
{
    private Animator anim;

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    void Update()
    {
        anim.SetBool("Run", Input.GetKey(KeyCode.D));
    }
}`,
 rules:[
  has('anim 필드',/\bAnimator\s+anim\s*;/,'Animator를 담을 anim 필드가 있어요.','Animator를 담아 둘 필드(private Animator anim;)를 클래스에 선언하세요.'),
  inFn('Awake에서 캐싱','Awake',/\banim\s*=\s*GetComponent\s*<\s*Animator\s*>\s*\(\s*\)|TryGetComponent\s*(?:<\s*Animator\s*>)?\s*\(\s*out\s+anim\b/,'Awake에서 한 번만 가져와 anim에 저장해요.','Awake에서 anim = GetComponent<Animator>(); 로 한 번만 가져와 저장하세요.'),
  notIn('Update에서 GetComponent 금지','Update',/\bGetComponent\b/,'Update에서 GetComponent를 부르지 않아요.','Update에서는 GetComponent를 호출하지 마세요. 필드 anim을 쓰면 됩니다.'),
  notIn('Update에서 지역 변수 금지','Update',/\bAnimator\s+\w+\s*=/,'Update에서 새 지역 변수를 만들지 않아요.','Update 안에서 Animator anim = ... 를 쓰면 필드를 가려서 캐싱한 의미가 없어요.')
 ],
 test:(api,ok)=>{
  const anim=api.mk.anim();
  api.env.components.Animator=anim;
  api.call('Awake');
  api.env.getCalls=0;
  let held=true;api.env.Input.GetKey=k=>k==='D'&&held;
  for(let i=0;i<10;i++)api.call('Update');
  const n=api.env.getCalls;
  ok('GetComponent 호출 횟수',n===0,'Update 10번 동안 GetComponent를 한 번도 호출하지 않았어요.',`Update 10번 동안 GetComponent를 ${n}번 호출했어요. 캐싱한 필드를 쓰세요.`);
  const val=()=>{const l=anim.log.filter(x=>x[0]==='SetBool'&&x[1]==='Run');return l.length?l[l.length-1][2]:undefined};
  ok('누르면 켜짐',val()===true,'D 키를 누르면 Run이 true예요.','D 키를 누르는 동안 SetBool("Run", true)가 불려야 해요.');
  held=false;api.call('Update');
  ok('떼면 꺼짐',val()===false,'D 키를 떼면 Run이 false예요.','D 키를 떼면 SetBool("Run", false)가 불려야 해요.');
 },
 hints:['GetComponent는 매 프레임 부르면 같은 일을 반복해요.','결과를 담아 둘 필드를 만들고 Awake에서 한 번만 채워요.','Update에서는 필드 anim을 그대로 써요.'],
 why:'Animator, Rigidbody, Collider, AudioSource 등 자주 쓰는 컴포넌트는 모두 같은 방식으로 캐싱해요. 대상만 바뀔 뿐 구조는 같아요.',
 concepts:[['컴포넌트 캐싱','자주 쓰는 컴포넌트 참조를 필드에 저장해 재사용한다.']]});

QB({id:'x66',cat:'components',stage:1,level:2,title:'점프 스크립트에 필요한 컴포넌트 보장하기',
 story:'Jumper는 Rigidbody2D와 BoxCollider2D가 있어야 동작해요. 그런데 동료가 이 스크립트만 빈 오브젝트에 붙였다가 NullReferenceException을 만났어요. 필요한 컴포넌트가 없으면 Unity가 자동으로 붙여 주게 하고, 실수로 스크립트를 두 번 붙이는 일도 막아 주세요.',
 goals:['Jumper를 붙이면 Rigidbody2D와 BoxCollider2D가 자동으로 함께 붙게 한다','같은 오브젝트에 Jumper를 두 번 붙일 수 없게 한다'],
 limits:['코드에서 AddComponent로 직접 붙이지 않는다 — 특성(Attribute)으로 해결한다'],
 starter:C`
using UnityEngine;

// TODO: 필요한 컴포넌트를 보장하고, 중복 부착을 막는 특성을 붙이세요
public class Jumper : MonoBehaviour
{
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(Rigidbody2D), typeof(BoxCollider2D))]
[DisallowMultipleComponent]
public class Jumper : MonoBehaviour
{
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }
}`,
 alts:[C`
using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
[RequireComponent(typeof(BoxCollider2D))]
[DisallowMultipleComponent]
public class Jumper : MonoBehaviour
{
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }
}`],
 rules:[
  fx('Rigidbody2D 요구',c=>/\[RequireComponent\([^\]]*typeof\(\s*Rigidbody2D\s*\)/.test(c),'Rigidbody2D를 요구해요.','[RequireComponent(typeof(Rigidbody2D))] 를 클래스 위에 붙이세요.'),
  fx('BoxCollider2D 요구',c=>/\[RequireComponent\([^\]]*typeof\(\s*BoxCollider2D\s*\)/.test(c),'BoxCollider2D도 요구해요.','BoxCollider2D도 RequireComponent에 포함하세요. 하나의 특성에 typeof를 쉼표로 이어도 되고 특성을 두 번 써도 돼요.'),
  has('중복 부착 방지',/\[DisallowMultipleComponent\]/,'같은 오브젝트에 두 번 붙일 수 없어요.','[DisallowMultipleComponent] 특성을 붙이면 같은 컴포넌트를 두 번 붙일 수 없어요.'),
  fx('특성이 클래스 바로 위',c=>/\]\s*(?:public\s+)?class\s+Jumper/.test(c),'특성이 Jumper 클래스에 붙어 있어요.','특성은 class 선언 바로 위에 적어야 그 클래스에 적용돼요.'),
  no('AddComponent 금지',/\bAddComponent\b/,'AddComponent 없이 특성으로 해결했어요.','이번에는 AddComponent 대신 특성(Attribute)으로 해결해 보세요.')
 ],
 hints:['Unity에는 "이 스크립트는 이 컴포넌트가 꼭 필요해"라고 선언하는 특성이 있어요. 이름에 Require가 들어갑니다.','typeof(컴포넌트 이름)을 인자로 넘겨요.','중복 부착을 막는 특성은 DisallowMultipleComponent 예요.'],
 why:'[RequireComponent]는 의존하는 컴포넌트를 선언해 두면 부착 시 자동으로 붙여 주고, 필요한 컴포넌트를 지우려는 것도 막아 줘요. 빠뜨려서 생기는 NullReferenceException을 에디터 단계에서 차단해요.',
 concepts:[['[RequireComponent]','스크립트가 의존하는 컴포넌트를 선언한다. 붙일 때 자동으로 함께 붙고 의존 컴포넌트는 지울 수 없다.']]});

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

QB({id:'x68',cat:'components',stage:1,level:2,title:'적에게 필요한 컴포넌트를 모두 보장하기',
 story:'Enemy는 Health와 Mover 컴포넌트가 함께 있어야 동작해요. 동료가 Enemy만 붙였다가 NullReferenceException을 만났어요. Enemy를 붙이면 Health와 Mover가 자동으로 함께 붙게 하고, Enemy를 두 번 붙이는 일도 막아 주세요.',
 goals:['Enemy를 붙이면 Health와 Mover가 자동으로 함께 붙게 한다','같은 오브젝트에 Enemy를 두 번 붙일 수 없게 한다'],
 limits:['코드에서 AddComponent로 직접 붙이지 않는다 — 특성(Attribute)으로 해결한다','Health와 Mover 클래스는 고치지 않는다'],
 starter:C`
using UnityEngine;

public class Health : MonoBehaviour
{
    public int hp = 10;
}

public class Mover : MonoBehaviour
{
    public float speed = 2f;
}

// TODO: 필요한 컴포넌트를 보장하고, 중복 부착을 막는 특성을 붙이세요
public class Enemy : MonoBehaviour
{
    void Start()
    {
        Health h = GetComponent<Health>();
        Mover m = GetComponent<Mover>();
        Debug.Log(h.hp + " " + m.speed);
    }
}`,
 solution:C`
using UnityEngine;

public class Health : MonoBehaviour
{
    public int hp = 10;
}

public class Mover : MonoBehaviour
{
    public float speed = 2f;
}

[RequireComponent(typeof(Health), typeof(Mover))]
[DisallowMultipleComponent]
public class Enemy : MonoBehaviour
{
    void Start()
    {
        Health h = GetComponent<Health>();
        Mover m = GetComponent<Mover>();
        Debug.Log(h.hp + " " + m.speed);
    }
}`,
 alts:[C`
using UnityEngine;

public class Health : MonoBehaviour
{
    public int hp = 10;
}

public class Mover : MonoBehaviour
{
    public float speed = 2f;
}

[RequireComponent(typeof(Health))]
[RequireComponent(typeof(Mover))]
[DisallowMultipleComponent]
public class Enemy : MonoBehaviour
{
    void Start()
    {
        Health h = GetComponent<Health>();
        Mover m = GetComponent<Mover>();
        Debug.Log(h.hp + " " + m.speed);
    }
}`],
 rules:[
  fx('Health 요구',c=>/\[RequireComponent\([^\]]*typeof\(\s*Health\s*\)/.test(c),'Health를 요구해요.','[RequireComponent(typeof(Health))] 를 Enemy 위에 붙이세요.'),
  fx('Mover 요구',c=>/\[RequireComponent\([^\]]*typeof\(\s*Mover\s*\)/.test(c),'Mover도 요구해요.','Mover도 RequireComponent에 포함하세요. 하나의 특성에 typeof를 쉼표로 이어도 되고 특성을 두 번 써도 돼요.'),
  has('중복 부착 방지',/\[DisallowMultipleComponent\]/,'같은 오브젝트에 두 번 붙일 수 없어요.','[DisallowMultipleComponent] 특성을 붙이면 같은 컴포넌트를 두 번 붙일 수 없어요.'),
  fx('특성이 Enemy 바로 위',c=>/\]\s*(?:public\s+)?class\s+Enemy/.test(c),'특성이 Enemy 클래스에 붙어 있어요.','특성은 class 선언 바로 위에 적어야 그 클래스에 적용돼요.'),
  no('AddComponent 금지',/\bAddComponent\b/,'AddComponent 없이 특성으로 해결했어요.','이번에는 AddComponent 대신 특성(Attribute)으로 해결해 보세요.')
 ],
 hints:['필요한 컴포넌트를 선언하는 특성은 RequireComponent예요.','내 스크립트(Health, Mover)도 typeof로 넘길 수 있어요.','중복 부착을 막는 특성은 DisallowMultipleComponent 예요.'],
 why:'RequireComponent는 유니티 기본 컴포넌트뿐 아니라 내가 만든 스크립트에도 똑같이 써요. 조합으로 만든 오브젝트에서 필요한 조각이 빠지는 실수를 에디터 단계에서 막아 줘요.',
 concepts:[['직접 만든 컴포넌트 요구','RequireComponent에는 Rigidbody 같은 기본 컴포넌트뿐 아니라 내가 만든 MonoBehaviour도 넘길 수 있다.']]});

QB({id:'x69',cat:'components',stage:1,level:3,title:'상속보다 조합: Unit 쪼개기',
 story:'전사, 포탑, 벽이 모두 Unit을 상속하고 있어요. 그런데 벽은 공격하지 않는데도 power와 Attack을 물려받았고, 포탑은 체력이 필요 없는 경우도 생길 예정이에요. 상속 하나에 모든 기능을 담는 대신 기능별 컴포넌트로 나누고, 필요한 것만 붙여서 조합해 주세요.',
 goals:['Unit 클래스를 없애고, 체력을 담당하는 Health(hp, TakeDamage)와 공격을 담당하는 Attacker(power, Attack)로 나눈다','Wall은 Health만 필요로 한다 ([RequireComponent]로 선언)','Wall에는 공격 관련 코드(power, Attack, Attacker)가 없다'],
 limits:['모든 클래스는 MonoBehaviour만 상속한다 (다른 클래스 상속 금지)','Health와 Attacker는 서로를 참조하지 않는다'],
 starter:C`
using UnityEngine;

// 모든 유닛이 Unit을 상속하는 구조입니다
public class Unit : MonoBehaviour
{
    public int hp = 20;
    public int power = 3;

    public void TakeDamage(int dmg) { hp -= dmg; }
    public void Attack(Unit target) { target.TakeDamage(power); }
}

public class Wall : Unit
{
    // 벽은 공격하지 않는데 Attack과 power를 물려받았습니다
}`,
 solution:C`
using UnityEngine;

public class Health : MonoBehaviour
{
    public int hp = 20;

    public void TakeDamage(int dmg) { hp -= dmg; }
}

public class Attacker : MonoBehaviour
{
    public int power = 3;

    public void Attack(Health target) { target.TakeDamage(power); }
}

[RequireComponent(typeof(Health))]
public class Wall : MonoBehaviour
{
    // 공격 기능 없음: Health만 필요
}`,
 alts:[C`
using UnityEngine;

public class Health : MonoBehaviour
{
    public int hp = 20;

    public void TakeDamage(int dmg) { hp -= dmg; }
}

public class Attacker : MonoBehaviour
{
    public int power = 3;

    public void Attack(GameObject target) { }
}

[RequireComponent(typeof(Health))]
public class Wall : MonoBehaviour
{
}`],
 rules:[
  has('Health 컴포넌트',/\bclass\s+Health\s*:\s*MonoBehaviour\b/,'체력을 담당하는 Health 컴포넌트를 만들었어요.','class Health : MonoBehaviour 를 만드세요.'),
  inClass('Health 내용','Health',/\bhp\b[\s\S]*\bTakeDamage\s*\(|\bTakeDamage\s*\([\s\S]*\bhp\b/,'Health가 hp와 TakeDamage를 가지고 있어요.','Health에 hp 필드와 TakeDamage 메서드를 넣으세요.'),
  has('Attacker 컴포넌트',/\bclass\s+Attacker\s*:\s*MonoBehaviour\b/,'공격을 담당하는 Attacker 컴포넌트를 만들었어요.','class Attacker : MonoBehaviour 를 만드세요.'),
  inClass('Attacker 내용','Attacker',/\bpower\b[\s\S]*\bAttack\s*\(|\bAttack\s*\([\s\S]*\bpower\b/,'Attacker가 power와 Attack을 가지고 있어요.','Attacker에 power 필드와 Attack 메서드를 넣으세요.'),
  no('Unit 제거',/\bclass\s+Unit\b/,'Unit 클래스를 없앴어요.','Unit 클래스를 없애고 기능을 Health와 Attacker로 나누세요.'),
  no('MonoBehaviour 외 상속 금지',/\bclass\s+\w+\s*:\s*(?!MonoBehaviour\b)\w+/,'모든 클래스가 MonoBehaviour만 상속해요.','다른 클래스를 상속하지 마세요. 필요한 기능은 컴포넌트를 함께 붙여서 조합합니다.'),
  has('Wall은 Health 요구',/\[RequireComponent\(\s*typeof\(\s*Health\s*\)\s*\)\]\s*(?:public\s+)?class\s+Wall\b/,'Wall이 Health를 요구해요.','Wall 위에 [RequireComponent(typeof(Health))] 를 붙여 체력이 필요하다고 선언하세요.'),
  notInClass('Wall에 공격 없음','Wall',/\b(?:power|Attack|Attacker)\b/,'Wall에는 공격 관련 코드가 없어요.','Wall은 공격하지 않으니 power, Attack, Attacker를 갖지 않아야 해요.'),
  notInClass('Health는 Attacker를 모름','Health',/\bAttacker\b/,'Health가 Attacker를 참조하지 않아요.','Health와 Attacker는 서로 독립이어야 재사용하기 좋아요.'),
  notInClass('Attacker는 Health 클래스를 상속·보유하지 않음','Attacker',/\bclass\s+Attacker\s*:\s*Health\b/,'Attacker가 Health를 상속하지 않아요.','Attacker는 MonoBehaviour만 상속하세요.')
 ],
 hints:['"무엇이다(is-a)" 대신 "무엇을 가졌다(has-a)"로 생각해 보세요. 벽은 체력을 가졌고, 전사는 체력과 공격을 가졌어요.','체력 관련 필드·메서드를 모은 클래스 하나, 공격 관련을 모은 클래스 하나를 MonoBehaviour로 만드세요.','Wall에는 필요한 컴포넌트만 [RequireComponent]로 선언해요.'],
 why:'깊은 상속은 "물려받고 싶지 않은 것까지 물려받는" 문제와 "새 조합이 필요할 때마다 계층이 꼬이는" 문제가 생겨요. 기능별로 쪼갠 컴포넌트는 필요한 것만 골라 붙이며 재사용할 수 있어요.',
 concepts:[['컴포넌트 조합(Composition)','기능을 작은 컴포넌트로 나누어 필요한 것만 붙여 쓰는 설계. 깊은 상속 계층보다 유연하다.']]});

QB({id:'x70',cat:'components',stage:1,level:3,title:'상속보다 조합: Interactable 쪼개기',
 story:'문, 창문, 금고가 모두 Interactable을 상속하고 있어요. 그런데 창문은 잠그는 기능이 필요 없는데도 locked와 Lock을 물려받았고, 곧 잠기기만 하고 열리지 않는 사물함이 추가될 예정이에요. 기능별 컴포넌트로 나누어 필요한 것만 붙여서 조합해 주세요.',
 goals:['Interactable 클래스를 없애고, 여닫기를 담당하는 Openable(isOpen, Open)과 잠금을 담당하는 Lockable(locked, Lock)으로 나눈다','Window는 Openable만 필요로 한다 ([RequireComponent]로 선언)','Window에는 잠금 관련 코드(locked, Lock, Lockable)가 없다'],
 limits:['모든 클래스는 MonoBehaviour만 상속한다 (다른 클래스 상속 금지)','Openable과 Lockable은 서로를 참조하지 않는다'],
 starter:C`
using UnityEngine;

// 모든 사물이 Interactable을 상속하는 구조입니다
public class Interactable : MonoBehaviour
{
    public bool isOpen = false;
    public bool locked = false;

    public void Open() { isOpen = true; }
    public void Lock() { locked = true; }
}

public class Window : Interactable
{
    // 창문은 잠그지 않는데 Lock과 locked를 물려받았습니다
}`,
 solution:C`
using UnityEngine;

public class Openable : MonoBehaviour
{
    public bool isOpen = false;

    public void Open() { isOpen = true; }
}

public class Lockable : MonoBehaviour
{
    public bool locked = false;

    public void Lock() { locked = true; }
}

[RequireComponent(typeof(Openable))]
public class Window : MonoBehaviour
{
    // 잠금 기능 없음: Openable만 필요
}`,
 rules:[
  has('Openable 컴포넌트',/\bclass\s+Openable\s*:\s*MonoBehaviour\b/,'여닫기를 담당하는 Openable 컴포넌트를 만들었어요.','class Openable : MonoBehaviour 를 만드세요.'),
  inClass('Openable 내용','Openable',/\bisOpen\b[\s\S]*\bOpen\s*\(|\bOpen\s*\([\s\S]*\bisOpen\b/,'Openable이 isOpen과 Open을 가지고 있어요.','Openable에 isOpen 필드와 Open 메서드를 넣으세요.'),
  has('Lockable 컴포넌트',/\bclass\s+Lockable\s*:\s*MonoBehaviour\b/,'잠금을 담당하는 Lockable 컴포넌트를 만들었어요.','class Lockable : MonoBehaviour 를 만드세요.'),
  inClass('Lockable 내용','Lockable',/\blocked\b[\s\S]*\bLock\s*\(|\bLock\s*\([\s\S]*\blocked\b/,'Lockable이 locked와 Lock을 가지고 있어요.','Lockable에 locked 필드와 Lock 메서드를 넣으세요.'),
  no('Interactable 제거',/\bclass\s+Interactable\b/,'Interactable 클래스를 없앴어요.','Interactable 클래스를 없애고 기능을 Openable과 Lockable로 나누세요.'),
  no('MonoBehaviour 외 상속 금지',/\bclass\s+\w+\s*:\s*(?!MonoBehaviour\b)\w+/,'모든 클래스가 MonoBehaviour만 상속해요.','다른 클래스를 상속하지 마세요. 필요한 기능은 컴포넌트를 함께 붙여서 조합합니다.'),
  has('Window는 Openable 요구',/\[RequireComponent\(\s*typeof\(\s*Openable\s*\)\s*\)\]\s*(?:public\s+)?class\s+Window\b/,'Window가 Openable을 요구해요.','Window 위에 [RequireComponent(typeof(Openable))] 를 붙여 여닫기가 필요하다고 선언하세요.'),
  notInClass('Window에 잠금 없음','Window',/\b(?:locked|Lock|Lockable)\b/,'Window에는 잠금 관련 코드가 없어요.','Window는 잠그지 않으니 locked, Lock, Lockable을 갖지 않아야 해요.'),
  notInClass('Openable은 Lockable을 모름','Openable',/\bLockable\b/,'Openable이 Lockable을 참조하지 않아요.','Openable과 Lockable은 서로 독립이어야 재사용하기 좋아요.'),
  notInClass('Lockable은 Openable을 모름','Lockable',/\bOpenable\b/,'Lockable이 Openable을 참조하지 않아요.','Openable과 Lockable은 서로 독립이어야 재사용하기 좋아요.')
 ],
 hints:['"무엇이다" 대신 "무엇을 가졌다"로 생각해 보세요. 창문은 여닫기만, 금고는 여닫기와 잠금을 가졌어요.','여닫기 관련을 모은 클래스 하나, 잠금 관련을 모은 클래스 하나를 MonoBehaviour로 만드세요.','Window에는 필요한 컴포넌트만 [RequireComponent]로 선언해요.'],
 why:'기능이 둘 이상 섞인 부모 클래스는 "일부만 필요한 자식"을 만들 때마다 불편해져요. 기능별 컴포넌트로 나눠 두면 사물함처럼 새로운 조합도 코드 수정 없이 붙여서 만들 수 있어요.',
 concepts:[['단일 책임','클래스 하나는 한 가지 역할만 맡게 한다. 여닫기와 잠금은 별개의 역할이다.']]});

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

QB({id:'x72',cat:'csharp',stage:1,level:1,title:'체크포인트는 도달 여부를 읽기만',
 story:'체크포인트의 부활 대기 시간은 기획자가 Inspector에서 조절하고 싶어요. 도달했는지(Reached)는 UI 스크립트가 읽기만 해야 하고, 도달 처리는 Reach 메서드에서만 이뤄져야 해요.',
 goals:['respawnDelay(float, 기본값 2)를 Inspector에서 수정할 수 있게 선언한다','Reached(bool)는 밖에서 읽기만 가능한 프로퍼티로 만든다','Reach()는 Reached를 true로 만든다'],
 limits:['respawnDelay는 public으로 선언하지 않는다','Reached를 바꾸는 곳은 이 클래스 안에서만이다'],
 starter:C`
using UnityEngine;

public class Checkpoint : MonoBehaviour
{
    // TODO: respawnDelay 선언

    // TODO: Reached 선언 (밖에서는 읽기만 가능)

    public void Reach()
    {
        // TODO: 도달 처리
    }
}`,
 solution:C`
using UnityEngine;

public class Checkpoint : MonoBehaviour
{
    [SerializeField] private float respawnDelay = 2f;
    public bool Reached { get; private set; }

    public void Reach()
    {
        Reached = true;
    }
}`,
 rules:[
  has('respawnDelay 선언',/\[SerializeField\]\s*(?:private\s+)?float\s+respawnDelay\s*=\s*2(?:\.0*)?f?\s*;/,'respawnDelay를 [SerializeField] private float로 선언했어요.','respawnDelay는 [SerializeField]를 붙인 float 필드로 만들고 기본값을 2f로 두세요.'),
  no('public 필드 금지',/\bpublic\s+float\s+respawnDelay\b/,'대기 시간을 public으로 열어 두지 않았어요.','public 필드는 모든 클래스가 값을 바꿀 수 있어요. [SerializeField] private을 쓰세요.'),
  has('읽기 전용 Reached',/\bpublic\s+bool\s+Reached\s*(?:\{\s*get;\s*(?:private|protected)\s+set;\s*\}|=>\s*\w+\s*;)/,'Reached를 밖에서는 읽기만 되는 프로퍼티로 공개했어요.','public bool Reached { get; private set; } 처럼 set을 private으로 막으세요.'),
  no('Reached 직접 공개 금지',/\bpublic\s+bool\s+reached\s*[;=]/,'도달 여부 필드를 직접 공개하지 않았어요.','public bool reached; 는 밖에서 덮어쓸 수 있어요. 프로퍼티로 바꾸세요.'),
  inFn('Reach에서 true','Reach',/\bReached\s*=\s*true\s*;/,'Reach에서 Reached를 true로 바꿨어요.','Reach() 안에서 Reached = true; 를 실행하세요.')
 ],
 hints:['Inspector에는 보이지만 외부는 접근 못 하게 하는 조합은 [SerializeField] + private이에요.','밖에서 읽기만 가능하게 하려면 { get; private set; } 프로퍼티를 써요.','Reach 안에서는 private set 이어도 값을 바꿀 수 있어요.'],
 why:'조절할 값은 [SerializeField], 코드로만 바꿀 상태는 private set 프로퍼티로 나누는 것이 캡슐화의 기본이에요.',
 concepts:[['접근 제한자와 캡슐화','public/private으로 공개 범위를 정해 다른 클래스가 내부 값을 마음대로 바꾸지 못하게 한다.']]});

/* ---- 디버그 1단계 ---- */
QB({id:'x73',cat:'debug',stage:1,level:1,title:'NullReferenceException: anim이 비어 있다',
 story:'피격 시 Hurt()를 부르면 콘솔에 NullReferenceException이 떠요.\n  at Mob.Hurt (Mob.cs:10)\n10번째 줄은 anim.SetTrigger("Hurt") 예요. anim 필드는 선언만 했을 뿐 값을 넣은 적이 없습니다.',
 goals:['Awake에서 Animator 컴포넌트를 가져와 anim에 저장한다','Hurt()는 anim.SetTrigger("Hurt")를 한 번 부른다'],
 limits:['Hurt 안에서 GetComponent를 호출하지 않는다 (Awake에서 한 번만)'],
 api:'GetComponent<Animator>(), anim.SetTrigger',
 starter:C`
using UnityEngine;

public class Mob : MonoBehaviour
{
    private Animator anim;

    void Awake()
    {
    }

    public void Hurt()
    {
        anim.SetTrigger("Hurt");
    }
}`,
 solution:C`
using UnityEngine;

public class Mob : MonoBehaviour
{
    private Animator anim;

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    public void Hurt()
    {
        anim.SetTrigger("Hurt");
    }
}`,
 rules:[
  inFn('Awake에서 캐싱','Awake',/\banim\s*=\s*GetComponent\s*<\s*Animator\s*>\s*\(\s*\)|TryGetComponent\s*(?:<\s*Animator\s*>)?\s*\(\s*out\s+anim\b/,'Awake에서 anim을 가져와요.','Awake에서 anim = GetComponent<Animator>(); 로 채워 주세요.'),
  notIn('Hurt에서 GetComponent 금지','Hurt',/GetComponent/,'Hurt에서 GetComponent를 호출하지 않아요.','매번 GetComponent를 부르지 말고 Awake에서 한 번만 가져오세요.')
 ],
 test:(api,ok)=>{
  const anim=api.mk.anim();api.env.components.Animator=anim;
  let err=null;
  try{api.call('Awake');api.call('Hurt')}catch(e){err=e}
  ok('에러 없이 실행',!err,'NullReference 없이 실행돼요.','anim이 비어 있어서 에러가 나요. Awake에서 anim에 컴포넌트를 넣어 주세요.');
  ok('트리거 실행',anim.log.filter(x=>x[0]==='SetTrigger'&&x[1]==='Hurt').length===1,'Hurt 트리거를 한 번 켰어요.','Hurt()가 anim.SetTrigger("Hurt")를 한 번 불러야 해요.');
 },
 hints:['스택 트레이스의 줄에서 점(.) 앞의 변수가 비어 있다는 뜻이에요.','anim은 선언만 되어 있고 어디서도 값이 채워지지 않았어요.','Awake에서 GetComponent<Animator>()의 결과를 anim에 넣으세요.'],
 why:'NullReference는 "점 앞의 변수가 비어 있다"는 신호예요. 그 변수가 어디서 채워져야 했는지 찾으면 대부분 해결됩니다. 컴포넌트는 Awake에서 한 번 가져와 캐싱하세요.',
 concepts:[['NullReferenceException','값이 없는(null) 참조를 통해 멤버에 접근했을 때 발생한다. 스택 트레이스의 줄에서 점 앞의 변수를 의심한다.']]});

QB({id:'x74',cat:'debug',stage:1,level:1,title:'NullReferenceException: 점프에서 rb가 비어 있다',
 story:'점프 키를 누르면 이런 에러가 나고 캐릭터가 뛰지 않아요.\nNullReferenceException: Object reference not set to an instance of an object\n  at Hopper.Jump (Hopper.cs:11)\n11번째 줄은 rb.velocity = ... 예요. rb에는 아직 아무것도 들어 있지 않아요.',
 goals:['Awake에서 Rigidbody2D를 가져와 rb에 저장한다','Jump()는 x 속도는 그대로 두고 y 속도만 jumpSpeed(8)로 바꾼다'],
 limits:['Jump 안에서 GetComponent를 호출하지 않는다'],
 api:'rb.velocity, new Vector2(x, y)',
 starter:C`
using UnityEngine;

public class Hopper : MonoBehaviour
{
    private Rigidbody2D rb;
    public float jumpSpeed = 8f;

    void Awake()
    {
    }

    public void Jump()
    {
        rb.velocity = new Vector2(rb.velocity.x, jumpSpeed);
    }
}`,
 solution:C`
using UnityEngine;

public class Hopper : MonoBehaviour
{
    private Rigidbody2D rb;
    public float jumpSpeed = 8f;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    public void Jump()
    {
        rb.velocity = new Vector2(rb.velocity.x, jumpSpeed);
    }
}`,
 rules:[
  inFn('Awake에서 캐싱','Awake',/\brb\s*=\s*GetComponent\s*<\s*Rigidbody2D\s*>\s*\(\s*\)|TryGetComponent\s*(?:<\s*Rigidbody2D\s*>)?\s*\(\s*out\s+rb\b/,'Awake에서 rb를 가져와요.','Awake에서 rb = GetComponent<Rigidbody2D>(); 로 채워 주세요.'),
  notIn('Jump에서 GetComponent 금지','Jump',/GetComponent/,'Jump에서 GetComponent를 호출하지 않아요.','Awake에서 한 번만 가져오세요.')
 ],
 test:(api,ok)=>{
  const rb=api.mk.rb();rb.velocity={x:3,y:0};api.env.components.Rigidbody2D=rb;
  let err=null;
  try{api.call('Awake');api.call('Jump')}catch(e){err=e}
  ok('에러 없이 실행',!err,'NullReference 없이 실행돼요.','rb가 비어 있어서 에러가 나요. Awake에서 rb에 컴포넌트를 넣어 주세요.');
  ok('점프 속도',!err&&rb.velocity.y===8&&rb.velocity.x===3,'x 속도는 유지하고 y 속도만 8이 됐어요.','x는 그대로(3), y만 8이 되어야 해요.');
 },
 hints:['에러 줄의 점 앞 변수 rb가 비어 있어요.','rb에 값을 넣는 곳이 없어요. 어디서 채울지 생각해 보세요.','Awake에서 rb = GetComponent<Rigidbody2D>(); 를 추가하세요.'],
 why:'같은 NullReference라도 원인은 늘 "채워지지 않은 변수"예요. 선언과 대입은 다른 일이라는 점을 기억하세요.',
 concepts:[['필드 초기화 시점','private 필드는 선언만으로 채워지지 않는다. Awake/Start에서 GetComponent로 채워야 한다.']]});

QB({id:'x75',cat:'debug',stage:1,level:1,title:'NullReferenceException: 정지시키려는데 rb가 없다',
 story:'Freeze()를 부르면 NullReferenceException이 떠요.\n  at Trap.Freeze (Trap.cs:10)\n10번째 줄은 rb.velocity = Vector2.zero 예요. 이번에는 Start가 아닌 Awake에서 채워야 다른 스크립트가 일찍 불러도 안전해요.',
 goals:['Awake에서 Rigidbody2D를 가져와 rb에 저장한다','Freeze()는 속도를 Vector2.zero로 만든다'],
 limits:['Freeze 안에서 GetComponent를 호출하지 않는다'],
 api:'rb.velocity, Vector2.zero',
 starter:C`
using UnityEngine;

public class Trap : MonoBehaviour
{
    private Rigidbody2D rb;

    void Awake()
    {
    }

    public void Freeze()
    {
        rb.velocity = Vector2.zero;
    }
}`,
 solution:C`
using UnityEngine;

public class Trap : MonoBehaviour
{
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    public void Freeze()
    {
        rb.velocity = Vector2.zero;
    }
}`,
 rules:[
  inFn('Awake에서 캐싱','Awake',/\brb\s*=\s*GetComponent\s*<\s*Rigidbody2D\s*>\s*\(\s*\)|TryGetComponent\s*(?:<\s*Rigidbody2D\s*>)?\s*\(\s*out\s+rb\b/,'Awake에서 rb를 가져와요.','Awake에서 rb = GetComponent<Rigidbody2D>(); 로 채워 주세요.'),
  notIn('Freeze에서 GetComponent 금지','Freeze',/GetComponent/,'Freeze에서 GetComponent를 호출하지 않아요.','Awake에서 한 번만 가져오세요.')
 ],
 test:(api,ok)=>{
  const rb=api.mk.rb();rb.velocity={x:4,y:-2};api.env.components.Rigidbody2D=rb;
  let err=null;
  try{api.call('Awake');api.call('Freeze')}catch(e){err=e}
  ok('에러 없이 실행',!err,'NullReference 없이 실행돼요.','rb가 비어 있어서 에러가 나요. Awake에서 rb에 컴포넌트를 넣어 주세요.');
  ok('정지',!err&&rb.velocity.x===0&&rb.velocity.y===0,'속도가 (0, 0)이 됐어요.','Freeze()는 속도를 Vector2.zero로 만들어야 해요.');
 },
 hints:['에러 줄의 점 앞 변수가 비어 있다는 뜻이에요.','rb에 컴포넌트를 담는 줄이 어디에도 없어요.','Awake에서 GetComponent<Rigidbody2D>()를 rb에 넣으세요.'],
 why:'NullReference를 만나면 "점 앞 변수 → 어디서 채워야 하나" 순서로 추적하세요. 컴포넌트는 Awake에서 캐싱하는 것이 정석이에요.',
 concepts:[['NullReferenceException','값이 없는(null) 참조를 통해 멤버에 접근했을 때 발생한다.']]});

QB({id:'x76',cat:'debug',stage:1,level:2,title:'MissingReferenceException: 파괴된 목표를 위로 쫓는다',
 story:'비행 적이 아이템을 y축으로 쫓다가, 아이템이 Destroy되면 에러가 쏟아져요.\nMissingReferenceException: The object of type \'Transform\' has been destroyed but you are still trying to access it.\n  at Drone.Update (Drone.cs:10)\n목표가 사라졌는지 확인하세요.',
 goals:['target이 null이면 아무것도 하지 않고 반환한다','target이 있으면 y 방향으로 speed × Time.deltaTime 만큼 target 쪽으로 이동한다 (target.y가 더 크면 +, 더 작으면 −)'],
 limits:['Destroy된 오브젝트는 == null 비교로 true가 된다'],
 api:'transform.position, Time.deltaTime',
 starter:C`
using UnityEngine;

public class Drone : MonoBehaviour
{
    public Transform target;
    public float speed = 2f;

    void Update()
    {
        Vector3 pos = transform.position;
        float dir = target.position.y > pos.y ? 1f : -1f;
        pos.y += dir * speed * Time.deltaTime;
        transform.position = pos;
    }
}`,
 solution:C`
using UnityEngine;

public class Drone : MonoBehaviour
{
    public Transform target;
    public float speed = 2f;

    void Update()
    {
        if (target == null) return;
        Vector3 pos = transform.position;
        float dir = target.position.y > pos.y ? 1f : -1f;
        pos.y += dir * speed * Time.deltaTime;
        transform.position = pos;
    }
}`,
 rules:[inFn('null 검사','Update',/target\s*==\s*null|!\s*target\b|target\s*!=\s*null|target\s+is\s+(?:not\s+)?null/,'target이 없으면 건너뛰어요.','Update 맨 앞에서 if (target == null) return; 으로 사라진 목표를 처리하세요.')],
 test:(api,ok)=>{
  api.env.Time.deltaTime=0.5;api.transform.position={x:0,y:0};
  api.set('target',{position:{x:0,y:10}});
  api.call('Update');
  ok('목표 쫓기',Math.abs(api.transform.position.y-1)<1e-6,'목표가 있으면 위로 쫓아가요 (speed 2 × 0.5초 = 1).',`위치 y가 ${api.transform.position.y} 입니다. 1이어야 해요.`);
  api.set('target',null);
  let err=null;try{api.call('Update')}catch(e){err=e}
  ok('목표 소멸',!err&&Math.abs(api.transform.position.y-1)<1e-6,'목표가 사라지면 에러 없이 멈춰요.','목표가 null일 때 에러가 나거나 계속 움직여요.');
 },
 hints:['"파괴된 오브젝트에 접근했다"가 핵심이에요.','Unity는 Destroy된 오브젝트를 null과 같게 취급해요.','Update 맨 앞에서 target이 없으면 return 하세요.'],
 why:'참조하던 오브젝트가 사라질 수 있다면 사용 전에 null 가드가 필요해요. 가드절로 위험한 경우를 먼저 걸러 내면 나머지 코드가 단순해집니다.',
 concepts:[['MissingReferenceException','Destroy된 오브젝트의 참조를 계속 사용하면 발생한다. 사용 전 == null 검사로 막는다.'],['가드절(Guard Clause)','함수 맨 앞에서 비정상 조건을 검사해 일찍 return하는 방식.']]});

QB({id:'x77',cat:'debug',stage:1,level:2,title:'MissingReferenceException: 사라진 목표와의 거리',
 story:'포탑이 목표와의 거리를 재는 Distance()가 목표가 파괴된 뒤에도 불려서 에러가 나요.\n  at Turret.Distance (Turret.cs:8)\n목표가 없으면 거리 대신 0을 돌려주도록 고쳐 주세요.',
 goals:['target이 null이면 0을 반환한다','target이 있으면 target과 이 오브젝트의 x 좌표 차이의 절댓값을 반환한다'],
 limits:['Unity에서 Destroy된 오브젝트는 == null 이 true가 된다'],
 api:'Mathf.Abs, transform.position.x',
 starter:C`
using UnityEngine;

public class Turret : MonoBehaviour
{
    public Transform target;

    public float Distance()
    {
        return Mathf.Abs(target.position.x - transform.position.x);
    }
}`,
 solution:C`
using UnityEngine;

public class Turret : MonoBehaviour
{
    public Transform target;

    public float Distance()
    {
        if (target == null) return 0f;
        return Mathf.Abs(target.position.x - transform.position.x);
    }
}`,
 rules:[inFn('null 검사','Distance',/target\s*==\s*null|!\s*target\b|target\s*!=\s*null|target\s+is\s+(?:not\s+)?null/,'target이 없으면 먼저 처리해요.','Distance 맨 앞에서 if (target == null) return 0f; 를 쓰세요.')],
 test:(api,ok)=>{
  api.transform.position={x:2,y:0};
  api.set('target',{position:{x:7,y:0}});
  let d,e1=null;try{d=api.call('Distance')}catch(e){e1=e}
  ok('거리 계산',!e1&&Math.abs(d-5)<1e-6,'목표가 있으면 거리 5를 돌려줘요.',`거리가 ${d} 입니다. 5여야 해요.`);
  api.set('target',null);
  let r,e2=null;try{r=api.call('Distance')}catch(e){e2=e}
  ok('목표 소멸',!e2&&r===0,'목표가 사라지면 에러 없이 0을 돌려줘요.','목표가 null일 때 에러가 나요. 먼저 null을 검사하고 0을 반환하세요.');
 },
 hints:['에러 줄에서 target을 쓰고 있어요. target이 null이면 어떻게 될까요?','사용하기 전에 target == null 인지 확인하세요.','null이면 0f를 반환하고 나머지는 그대로 두세요.'],
 why:'값을 돌려주는 함수에서도 가드절은 똑같이 유효해요. "없을 때 무엇을 돌려줄지"를 정해 두면 호출하는 쪽이 안전해집니다.',
 concepts:[['MissingReferenceException','Destroy된 오브젝트의 참조를 계속 사용하면 발생한다.'],['가드절(Guard Clause)','함수 맨 앞에서 비정상 조건을 검사해 일찍 return하는 방식.']]});

QB({id:'x78',cat:'debug',stage:1,level:2,title:'MissingReferenceException: 죽은 플레이어를 따라가는 카메라',
 story:'카메라가 플레이어의 x 좌표를 따라가는데, 플레이어가 죽어 Destroy되면 카메라 스크립트가 에러를 뿜어요.\n  at CamFollow.LateUpdate (CamFollow.cs:9)\n플레이어가 없으면 카메라는 그 자리에 가만히 있어야 해요.',
 goals:['target이 null이면 아무것도 하지 않고 반환한다','target이 있으면 이 오브젝트의 x 좌표를 target의 x 좌표로 맞춘다 (y는 그대로)'],
 limits:['Destroy된 오브젝트는 == null 비교로 true가 된다'],
 api:'transform.position',
 starter:C`
using UnityEngine;

public class CamFollow : MonoBehaviour
{
    public Transform target;

    void LateUpdate()
    {
        Vector3 pos = transform.position;
        pos.x = target.position.x;
        transform.position = pos;
    }
}`,
 solution:C`
using UnityEngine;

public class CamFollow : MonoBehaviour
{
    public Transform target;

    void LateUpdate()
    {
        if (target == null) return;
        Vector3 pos = transform.position;
        pos.x = target.position.x;
        transform.position = pos;
    }
}`,
 rules:[inFn('null 검사','LateUpdate',/target\s*==\s*null|!\s*target\b|target\s*!=\s*null|target\s+is\s+(?:not\s+)?null/,'target이 없으면 건너뛰어요.','LateUpdate 맨 앞에서 if (target == null) return; 으로 처리하세요.')],
 test:(api,ok)=>{
  api.transform.position={x:0,y:3};
  api.set('target',{position:{x:6,y:0}});
  api.call('LateUpdate');
  ok('따라가기',api.transform.position.x===6&&api.transform.position.y===3,'x는 목표를 따라가고 y는 그대로예요.',`위치가 (${api.transform.position.x}, ${api.transform.position.y}) 입니다. (6, 3)이어야 해요.`);
  api.set('target',null);
  let err=null;try{api.call('LateUpdate')}catch(e){err=e}
  ok('목표 소멸',!err&&api.transform.position.x===6,'목표가 사라지면 에러 없이 멈춰요.','목표가 null일 때 에러가 나요. 먼저 null을 검사하세요.');
 },
 hints:['"파괴된 오브젝트 접근"이 핵심이에요.','target을 쓰기 전에 존재하는지 확인하세요.','맨 앞에 if (target == null) return; 을 넣으세요.'],
 why:'카메라, 추적 UI처럼 다른 오브젝트를 참조하는 코드는 참조 대상이 사라질 가능성을 항상 염두에 둬야 해요.',
 concepts:[['MissingReferenceException','Destroy된 오브젝트의 참조를 계속 사용하면 발생한다.'],['가드절(Guard Clause)','함수 맨 앞에서 비정상 조건을 검사해 일찍 return하는 방식.']]});

QB({id:'x79',cat:'debug',stage:1,level:3,title:'IndexOutOfRangeException: 마지막 칸을 읽으려다',
 story:'점수 기록 배열에서 마지막 값을 꺼내는 LastX()가 에러를 내요.\nIndexOutOfRangeException: Index was outside the bounds of the array.\n  at Track.LastX (Track.cs:8)\n배열의 마지막 인덱스는 Length가 아니라 Length - 1 이에요. 배열이 비어 있을 때도 안전해야 해요.',
 goals:['LastX(): 배열 xs의 마지막 값을 반환한다','배열이 비어 있으면 에러 없이 0을 반환한다'],
 limits:['xs.Length - 1 을 마지막 인덱스로 사용한다'],
 api:'xs.Length',
 starter:C`
using UnityEngine;

public class Track : MonoBehaviour
{
    public float[] xs;

    public float LastX()
    {
        return xs[xs.Length];
    }
}`,
 solution:C`
using UnityEngine;

public class Track : MonoBehaviour
{
    public float[] xs;

    public float LastX()
    {
        if (xs == null || xs.Length == 0) return 0f;
        return xs[xs.Length - 1];
    }
}`,
 rules:[],
 test:(api,ok)=>{
  api.set('xs',[10,20,30]);
  let r,err=null;try{r=api.call('LastX')}catch(e){err=e}
  ok('마지막 값',!err&&r===30,'마지막 값 30을 돌려줘요.',err?'인덱스가 범위를 벗어나요. 마지막 인덱스는 Length - 1 이에요.':`반환값이 ${r} 입니다. 30이어야 해요.`);
  api.set('xs',[]);
  let r2,err2=null;try{r2=api.call('LastX')}catch(e){err2=e}
  ok('빈 배열',!err2&&r2===0,'배열이 비어 있으면 0을 돌려줘요.','빈 배열에서 에러가 나요. 길이가 0이면 먼저 0을 반환하세요.');
 },
 hints:['길이가 3인 배열의 유효한 인덱스는 0, 1, 2 예요.','마지막 인덱스는 Length - 1 이에요.','길이가 0이면 어떤 인덱스도 유효하지 않으니 먼저 처리하세요.'],
 why:'배열 접근은 항상 0 ≤ index < Length 여야 해요. "마지막 = Length − 1"과 "빈 배열 먼저 처리"는 경계 조건의 기본이에요.',
 concepts:[['IndexOutOfRangeException','배열·리스트의 유효 범위(0 ~ Length−1)를 벗어난 인덱스로 접근했을 때 발생한다.']]});

QB({id:'x80',cat:'debug',stage:1,level:3,title:'IndexOutOfRangeException: 거꾸로 도는 순찰',
 story:'순찰 지점을 거꾸로 도는 PrevX()가 처음 호출에서 에러를 내요.\n  at Patrol.PrevX (Patrol.cs:9)\n지점이 3개면 0→2→1→0→2→… 로 돌아야 해요. index를 줄이다 −1이 되면 안 돼요.',
 goals:['PrevX(): 현재 index의 지점 x 좌표를 반환하고 index를 한 칸 뒤로 옮긴다','index가 0에서 줄어들면 마지막 칸으로 돌아간다 (순환)','지점이 하나도 없으면 에러 없이 0을 반환한다'],
 limits:['(index - 1 + Length) % Length 로 음수를 피하세요'],
 api:'xs.Length, % (나머지)',
 starter:C`
using UnityEngine;

public class Patrol : MonoBehaviour
{
    public float[] xs;
    private int index;

    public float PrevX()
    {
        float x = xs[index];
        index--;
        return x;
    }
}`,
 solution:C`
using UnityEngine;

public class Patrol : MonoBehaviour
{
    public float[] xs;
    private int index;

    public float PrevX()
    {
        if (xs == null || xs.Length == 0) return 0f;
        float x = xs[index];
        index = (index - 1 + xs.Length) % xs.Length;
        return x;
    }
}`,
 rules:[],
 test:(api,ok)=>{
  api.set('xs',[10,20,30]);api.set('index',0);
  const got=[];let err=null;
  try{for(let i=0;i<7;i++)got.push(api.call('PrevX'))}catch(e){err=e}
  ok('거꾸로 순환',!err&&got.join()==='10,30,20,10,30,20,10','10, 30, 20 을 거꾸로 돌아요.',err?'index가 −1이 되어 에러가 나요. 0에서 줄이면 마지막 칸으로 가야 해요.':`반환 순서: ${got.join(', ')}. 10, 30, 20, 10, 30, 20, 10 이어야 해요.`);
  api.set('xs',[]);api.set('index',0);
  let r,err2=null;try{r=api.call('PrevX')}catch(e){err2=e}
  ok('빈 배열',!err2&&r===0,'지점이 없으면 0을 반환해요.','지점이 하나도 없을 때 에러가 나요. 길이가 0이면 먼저 반환하세요.');
 },
 hints:['index가 0일 때 1을 빼면 −1이 되어 배열 밖이에요.','음수가 되지 않도록 Length를 더한 뒤 % Length 를 해요.','길이가 0이면 가장 먼저 반환하세요.'],
 why:'순환 인덱스는 앞으로든 뒤로든 % Length 로 한 번에 처리해요. 뒤로 갈 때는 음수가 안 되게 Length를 먼저 더하는 것이 요령이에요.',
 concepts:[['IndexOutOfRangeException','배열·리스트의 유효 범위를 벗어난 인덱스로 접근했을 때 발생한다.'],['순환 인덱스','(index ± 1 + Length) % Length 로 처음과 끝을 이어 붙인다.']]});

QB({id:'x81',cat:'debug',stage:1,level:3,title:'IndexOutOfRangeException: 슬롯 번호가 범위를 넘는다',
 story:'스폰 지점 배열에서 번호로 좌표를 꺼내는 GetX(slot)가, 기획자가 큰 번호를 넣으면 에러를 내요.\n  at Spawner.GetX (Spawner.cs:8)\n범위를 벗어난 번호는 가장 가까운 유효한 칸(0 또는 마지막)으로 맞춰 주세요.',
 goals:['GetX(slot): xs[slot]을 반환한다','slot이 0보다 작으면 0번 칸, 길이 이상이면 마지막 칸의 값을 반환한다','지점이 하나도 없으면 에러 없이 0을 반환한다'],
 limits:['Mathf.Clamp(slot, 0, xs.Length - 1) 을 사용하면 간단해요'],
 api:'Mathf.Clamp, xs.Length',
 starter:C`
using UnityEngine;

public class Spawner : MonoBehaviour
{
    public float[] xs;

    public float GetX(int slot)
    {
        return xs[slot];
    }
}`,
 solution:C`
using UnityEngine;

public class Spawner : MonoBehaviour
{
    public float[] xs;

    public float GetX(int slot)
    {
        if (xs == null || xs.Length == 0) return 0f;
        int i = Mathf.Clamp(slot, 0, xs.Length - 1);
        return xs[i];
    }
}`,
 rules:[],
 test:(api,ok)=>{
  api.set('xs',[10,20,30]);
  const t=s=>{try{return api.call('GetX',s)}catch(e){return 'ERR'}};
  ok('유효한 번호',t(1)===20,'1번 칸은 20이에요.',`GetX(1)이 ${t(1)} 입니다. 20이어야 해요.`);
  ok('큰 번호',t(9)===30,'큰 번호는 마지막 칸(30)으로 맞춰져요.',`GetX(9)이 ${t(9)} 입니다. 마지막 값 30이어야 해요.`);
  ok('음수 번호',t(-4)===10,'음수는 0번 칸(10)으로 맞춰져요.',`GetX(-4)가 ${t(-4)} 입니다. 0번 값 10이어야 해요.`);
  api.set('xs',[]);
  ok('빈 배열',t(0)===0,'지점이 없으면 0을 반환해요.','빈 배열에서 에러가 나요. 길이가 0이면 먼저 0을 반환하세요.');
 },
 hints:['slot이 Length 이상이거나 음수면 배열 밖이에요.','Mathf.Clamp로 범위 안으로 끌어오세요.','길이가 0이면 Clamp의 최댓값이 −1이 되니 먼저 따로 처리해야 해요.'],
 why:'바깥에서 들어온 번호는 믿지 말고 범위를 맞춰 쓰세요. Clamp는 한 줄로 "너무 작으면 최솟값, 너무 크면 최댓값"을 처리해 줍니다.',
 concepts:[['IndexOutOfRangeException','유효 범위(0 ~ Length−1)를 벗어난 인덱스로 접근했을 때 발생한다.'],['Mathf.Clamp','값을 최솟값과 최댓값 사이로 제한한다.']]});

/* ---- 수학 1단계 ---- */
QB({id:'x82',cat:'math',stage:1,level:1,title:'A에서 B로 향하는 방향 벡터',
 story:'투사체가 발사 지점에서 목표 지점으로 날아가려면 "방향만 담은" 벡터가 필요해요. 두 점의 차이를 구한 뒤 길이를 1로 맞춰서(정규화) 반환합니다. 두 점이 같으면 방향이 없으니 (0, 0)을 돌려주세요.',
 goals:['Direction(ax, ay, bx, by): A에서 B로 향하는 길이 1의 방향 벡터를 반환한다','두 점이 같은 위치이면 (0, 0)을 반환한다 (NaN이 나오면 안 돼요)'],
 limits:['반환값은 new Vector2(x, y)'],
 api:'Mathf.Sqrt(x), new Vector2(x, y)',
 starter:C`
Vector2 Direction(float ax, float ay, float bx, float by)
{
    return new Vector2(bx - ax, by - ay);
}`,
 solution:C`
Vector2 Direction(float ax, float ay, float bx, float by)
{
    float dx = bx - ax;
    float dy = by - ay;
    float len = Mathf.Sqrt(dx * dx + dy * dy);
    if (len == 0f) return new Vector2(0f, 0f);
    return new Vector2(dx / len, dy / len);
}`,
 rules:[],
 test:(api,ok)=>{
  const d=(a,b,c,e)=>{const r=api.call('Direction',a,b,c,e);return {x:r.x,y:r.y,len:Math.hypot(r.x,r.y)}};
  let r=d(0,0,3,4);
  ok('길이 1',Math.abs(r.len-1)<1e-4,'방향 벡터의 길이가 1이에요.',`길이가 ${r.len.toFixed(2)} 입니다. 1이어야 해요 (정규화 필요).`);
  ok('방향',Math.abs(r.x-0.6)<1e-4&&Math.abs(r.y-0.8)<1e-4,'(0,0)에서 (3,4)는 (0.6, 0.8) 방향이에요.',`결과가 (${r.x.toFixed(2)}, ${r.y.toFixed(2)}) 입니다. (0.6, 0.8)이어야 해요.`);
  r=d(5,5,5,-5);
  ok('아래 방향',Math.abs(r.x)<1e-6&&Math.abs(r.y+1)<1e-6,'아래쪽으로는 (0, −1)이에요.',`결과가 (${r.x}, ${r.y}) 입니다. (0, −1)이어야 해요.`);
  r=d(2,2,2,2);
  ok('같은 위치',r.x===0&&r.y===0,'같은 위치이면 (0, 0)이에요.','같은 위치에서 NaN이 나와요. 길이가 0이면 나누지 마세요.');
 },
 hints:['두 점의 차이 (bx − ax, by − ay)가 A→B 방향이에요.','길이는 √(dx² + dy²). 각 성분을 길이로 나누면 길이 1이 돼요.','길이가 0일 때는 나누기 전에 먼저 반환하세요.'],
 why:'방향과 거리를 분리해 두면 속도를 곱하기만 해서 같은 방향으로 어떤 속도든 낼 수 있어요. 정규화는 길이 0을 먼저 처리하는 습관과 한 쌍입니다.',
 concepts:[['정규화(Normalize)','벡터를 길이 1로 만들어 방향만 남기는 연산. 길이 0일 때는 나눌 수 없다.'],['벡터의 길이(크기)','√(x² + y²).']]});

QB({id:'x83',cat:'math',stage:1,level:1,title:'속도 상한을 넘지 않게',
 story:'폭발에 휘말린 캐릭터의 속도가 한없이 커지는 문제가 있어요. 속도 벡터의 길이가 최대 속도를 넘으면 방향은 그대로 두고 길이만 최대 속도로 줄여 주세요. 최대 속도보다 느리면 그대로 둡니다.',
 goals:['LimitSpeed(vx, vy, max): 속도 벡터의 길이가 max를 넘으면 길이를 max로 줄여 반환한다','방향은 그대로 유지한다','길이가 max 이하이면 입력 그대로 반환한다 (0일 때 NaN이 나오면 안 돼요)'],
 limits:['반환값은 new Vector2(x, y)'],
 api:'Mathf.Sqrt(x), new Vector2(x, y)',
 starter:C`
Vector2 LimitSpeed(float vx, float vy, float max)
{
    return new Vector2(vx, vy);
}`,
 solution:C`
Vector2 LimitSpeed(float vx, float vy, float max)
{
    float len = Mathf.Sqrt(vx * vx + vy * vy);
    if (len > max)
    {
        vx = vx / len * max;
        vy = vy / len * max;
    }
    return new Vector2(vx, vy);
}`,
 rules:[],
 test:(api,ok)=>{
  const m=(x,y,s)=>{const r=api.call('LimitSpeed',x,y,s);return {x:r.x,y:r.y,len:Math.hypot(r.x,r.y)}};
  let r=m(30,40,10);
  ok('상한 적용',Math.abs(r.len-10)<1e-4,'너무 빠르면 길이가 10으로 줄어요.',`속도 크기가 ${r.len.toFixed(2)} 입니다. 10이어야 해요.`);
  ok('방향 유지',Math.abs(r.x-6)<1e-4&&Math.abs(r.y-8)<1e-4,'방향은 그대로 (6, 8)이에요.',`결과가 (${r.x.toFixed(2)}, ${r.y.toFixed(2)}) 입니다. (6, 8)이어야 해요.`);
  r=m(3,4,10);
  ok('느리면 그대로',Math.abs(r.x-3)<1e-6&&Math.abs(r.y-4)<1e-6,'상한보다 느리면 그대로예요.',`(3, 4)가 (${r.x}, ${r.y}) 로 바뀌었어요. 상한 이하일 때는 건드리지 마세요.`);
  r=m(0,0,10);
  ok('정지 상태',r.x===0&&r.y===0,'멈춰 있으면 (0, 0)이에요.','(0, 0) 입력에서 NaN이 나와요.');
 },
 hints:['속도 벡터의 길이는 √(vx² + vy²) 예요.','길이가 max보다 클 때만 줄이면 돼요. 각 성분에 max/길이를 곱하세요.','"넘을 때만" 처리하면 길이 0에서의 나눗셈도 자연스럽게 피할 수 있어요.'],
 why:'길이 제한(clamp)은 이동 속도, 힘, 카메라 이동 등에서 흔히 써요. 방향은 두고 크기만 조절하는 것이 핵심이에요. Unity에는 Vector2.ClampMagnitude가 같은 일을 해 줍니다.',
 concepts:[['벡터의 길이(크기)','√(x² + y²). 크기를 바꿔도 방향은 그대로 둘 수 있다.'],['정규화(Normalize)','길이 1로 맞춰 방향만 남기는 연산.']]});

QB({id:'x84',cat:'math',stage:1,level:1,title:'대시: 입력이 없으면 앞으로',
 story:'대시 스킬은 누르고 있는 방향으로 일정 거리를 순간 이동해요. 대각선으로 눌러도 거리가 같아야 하고, 아무 방향도 누르지 않았다면 바라보는 방향(오른쪽)으로 대시해요.',
 goals:['DashOffset(h, v, dist): 입력 (h, v) 방향으로 dist만큼 이동하는 변위를 반환한다','대각선이어도 이동 거리는 dist 로 같다','입력이 (0, 0)이면 오른쪽 (dist, 0)으로 이동한다'],
 limits:['반환값은 new Vector2(x, y)'],
 api:'Mathf.Sqrt(x), new Vector2(x, y)',
 starter:C`
Vector2 DashOffset(float h, float v, float dist)
{
    return new Vector2(h * dist, v * dist);
}`,
 solution:C`
Vector2 DashOffset(float h, float v, float dist)
{
    float len = Mathf.Sqrt(h * h + v * v);
    if (len == 0f) return new Vector2(dist, 0f);
    return new Vector2(h / len * dist, v / len * dist);
}`,
 rules:[],
 test:(api,ok)=>{
  const m=(h,v,d)=>{const r=api.call('DashOffset',h,v,d);return {x:r.x,y:r.y,len:Math.hypot(r.x,r.y)}};
  let r=m(1,1,6);
  ok('대각선 거리',Math.abs(r.len-6)<1e-4,'대각선으로 대시해도 거리가 6이에요.',`이동 거리가 ${r.len.toFixed(2)} 입니다. 6이어야 해요.`);
  r=m(0,-1,6);
  ok('아래 방향',Math.abs(r.x)<1e-6&&Math.abs(r.y+6)<1e-6,'아래로 누르면 (0, −6)이에요.',`결과가 (${r.x}, ${r.y}) 입니다. (0, −6)이어야 해요.`);
  r=m(0.3,0,6);
  ok('약한 입력도 같은 거리',Math.abs(r.x-6)<1e-4,'살짝 눌러도 대시 거리는 6이에요.',`(0.3, 0) 입력의 결과가 (${r.x}, ${r.y}) 입니다. (6, 0)이어야 해요. 입력 크기가 아니라 방향만 쓰세요.`);
  r=m(0,0,6);
  ok('입력 없음',Math.abs(r.x-6)<1e-6&&r.y===0,'입력이 없으면 오른쪽으로 6이에요.','입력이 없을 때 (6, 0)이 되어야 해요. NaN이 나오지 않게 하세요.');
 },
 hints:['방향만 필요하니 입력 벡터를 길이 1로 정규화하세요.','정규화한 방향에 dist를 곱하면 항상 같은 거리가 돼요.','길이가 0이면 나누지 말고 오른쪽 (dist, 0)을 바로 반환하세요.'],
 why:'방향(정규화)과 크기(dist)를 분리하면 입력이 얼마나 기울었든 일정한 거리를 낼 수 있어요. 길이 0은 "기본 방향"으로 대체하는 패턴도 자주 씁니다.',
 concepts:[['정규화(Normalize)','벡터를 길이 1로 만들어 방향만 남기는 연산. 길이 0일 때는 나눌 수 없다.'],['방향과 크기의 분리','방향 벡터 × 크기로 이동량을 만들면 크기를 자유롭게 조절할 수 있다.']]});

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

QB({id:'x86',cat:'math',stage:1,level:2,title:'시야각과 사거리를 함께',
 story:'경비병은 시야각 안에 있고, 또 사거리 안에 있을 때만 플레이어를 발견해요. 방향은 내적과 cos로, 거리는 벡터 길이로 판정합니다.',
 goals:['Sees(fx, fy, tx, ty, halfAngle, range): (fx, fy)는 바라보는 방향(길이 1), (tx, ty)는 대상까지의 벡터','대상까지의 거리가 range 이하이고','정규화한 방향의 내적 ≥ cos(halfAngle) 이면 true (halfAngle 은 도 단위)','대상 벡터가 (0, 0)이면 false'],
 limits:['각도를 구하는 Atan2나 Acos 는 쓰지 않고 내적으로 판정한다','도 → 라디안 변환: Mathf.Deg2Rad'],
 api:'Mathf.Cos, Mathf.Deg2Rad, Mathf.Sqrt',
 starter:C`
bool Sees(float fx, float fy, float tx, float ty, float halfAngle, float range)
{
    return true;
}`,
 solution:C`
bool Sees(float fx, float fy, float tx, float ty, float halfAngle, float range)
{
    float len = Mathf.Sqrt(tx * tx + ty * ty);
    if (len == 0f || len > range) return false;
    float dot = (fx * tx + fy * ty) / len;
    return dot >= Mathf.Cos(halfAngle * Mathf.Deg2Rad);
}`,
 rules:[no('Atan2/Acos 금지',/Atan2|Acos/,'각도를 구하지 않고 내적으로 판정해요.','Atan2/Acos 대신 내적과 Mathf.Cos 비교로 판정하세요.')],
 test:(api,ok)=>{
  const s=(tx,ty)=>api.call('Sees',1,0,tx,ty,30,10);
  ok('가까운 정면',s(5,0)===true,'사거리 안 정면은 보여요.','사거리 안 정면(5, 0)은 보여야 해요.');
  ok('멀면 안 보임',s(15,0)===false,'사거리 밖이면 안 보여요.','정면이어도 거리 15는 사거리 10 밖이에요.');
  ok('시야각 밖',s(0,5)===false&&s(-5,0)===false,'시야각 밖은 안 보여요.','옆(0, 5)이나 뒤(−5, 0)는 시야각 30° 밖이에요.');
  ok('경계 안쪽',s(8,2)===true,'약 14°는 시야 안이에요.','약 14°(8, 2)는 시야각 30° 안이고 거리도 사거리 안이에요.');
  ok('경계 바깥',s(6,6)===false,'45°는 시야 밖이에요.','45°(6, 6)는 시야각 30° 밖이에요.');
  ok('겹침',s(0,0)===false,'같은 위치이면 false예요.','길이 0인 벡터는 방향이 없어서 false로 처리하세요.');
 },
 hints:['두 조건(거리, 각도)을 모두 만족해야 해요.','거리는 벡터 길이 √(tx² + ty²). 각도는 정규화한 내적과 cos(반각)을 비교해요.','길이가 0이거나 range보다 크면 먼저 false를 반환하세요.'],
 why:'시야 판정은 "거리 조건 + 방향 조건"의 조합이에요. 거리부터 걸러 내면 불필요한 계산도 줄어듭니다.',
 concepts:[['내적(Dot Product)','단위 벡터끼리는 사잇각의 코사인 값이다.'],['시야각 판정','정규화한 대상 방향과 정면 방향의 내적을 cos(반각)과 비교한다.']]});

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

QB({id:'x88',cat:'math',stage:1,level:3,title:'가까운 쪽으로 조금씩 돌기',
 story:'포탑이 현재 각도에서 목표 각도로 프레임마다 최대 maxStep도씩 돌아요. 350도에서 10도로 갈 때는 340도를 거꾸로 도는 것이 아니라 가까운 쪽(+20도)으로 돌아야 합니다. 결과는 0 이상 360 미만으로 맞춰 주세요.',
 goals:['TurnToward(current, target, maxStep): 최단 방향으로 최대 maxStep도 회전한 새 각도를 반환한다','남은 각도가 maxStep 이하이면 목표 각도에 정확히 도착한다','결과는 0 이상 360 미만으로 맞춘다'],
 limits:['Mathf.MoveTowardsAngle 을 쓰지 않고 직접 구현한다 (Mathf.Repeat, Mathf.Clamp 사용)'],
 api:'Mathf.Repeat(값, 길이), Mathf.Clamp(값, 최소, 최대)',
 starter:C`
float TurnToward(float current, float target, float maxStep)
{
    return current + Mathf.Clamp(target - current, -maxStep, maxStep);
}`,
 solution:C`
float TurnToward(float current, float target, float maxStep)
{
    float diff = Mathf.Repeat(target - current + 180f, 360f) - 180f;
    float step = Mathf.Clamp(diff, -maxStep, maxStep);
    return Mathf.Repeat(current + step, 360f);
}`,
 rules:[no('MoveTowardsAngle 금지',/MoveTowardsAngle/,'직접 구현했어요.','MoveTowardsAngle 대신 직접 계산해 보세요.')],
 test:(api,ok)=>{
  const t=(c,g,s)=>api.call('TurnToward',c,g,s);
  const near=(a,b)=>Math.abs(a-b)<1e-3||Math.abs(Math.abs(a-b)-360)<1e-3;
  ok('0도 경계 넘기',near(t(350,10,5),355)&&near(t(10,350,5),5),'350→10은 355로, 10→350은 5로 가요.',`350→10: ${t(350,10,5)}, 10→350: ${t(10,350,5)}. 각각 355, 5여야 해요.`);
  ok('도착',near(t(350,10,50),10)&&near(t(0,30,30),30),'남은 각도가 작으면 목표에 도착해요.',`350→10(최대 50): ${t(350,10,50)}. 10이어야 해요.`);
  ok('일반 회전',near(t(0,90,30),30)&&near(t(90,0,30),60),'일반 회전도 최대 30도씩 돌아요.',`0→90: ${t(0,90,30)}, 90→0: ${t(90,0,30)}. 각각 30, 60이어야 해요.`);
  let in360=true;for(let i=0;i<50;i++){const r=t(Math.random()*720-360,Math.random()*720-360,Math.random()*60);if(r<-1e-6||r>=360+1e-6)in360=false}
  ok('0 ~ 360',in360,'결과가 항상 0 ~ 360 범위예요.','결과가 0 이상 360 미만이어야 해요. Mathf.Repeat 로 감싸 주세요.');
 },
 hints:['먼저 두 각도의 최단 차이(−180 ~ 180)를 구하세요.','그 차이를 −maxStep ~ maxStep 으로 제한하면 이번 프레임에 돌 각도예요.','더한 뒤 Mathf.Repeat(…, 360)으로 0 ~ 360에 맞추세요.'],
 why:'각도 차이를 먼저 최단으로 만들고 그다음 한계를 걸면 어느 방향이든 자연스럽게 돌아요. 포탑, 카메라, 캐릭터 회전 모두 이 패턴입니다. 실전에서는 Mathf.MoveTowardsAngle이 같은 일을 해요.',
 concepts:[['각도의 순환성','각도는 360도마다 같은 방향이라 차이를 −180 ~ 180으로 감싸야 최단 회전이 된다.'],['Mathf.Clamp','값을 최솟값과 최댓값 사이로 제한한다.']]});

QB({id:'x89',cat:'math',stage:1,level:3,title:'조준이 맞았나? (각도 오차)',
 story:'사격 게임에서 현재 조준 각도가 목표 각도에서 tolerance도 이내이면 "조준 완료"예요. 359도와 1도처럼 0도를 사이에 둔 경우에도 가깝다고 판정해야 해요.',
 goals:['IsAimed(angle, target, tolerance): 최단 각도 차이의 절댓값이 tolerance 이하이면 true','359 ↔ 1 은 2도 차이이다','360도를 넘거나 음수인 각도도 같은 방향으로 처리한다'],
 limits:['Mathf.DeltaAngle 을 쓰지 않고 직접 구현한다 (Mathf.Repeat 사용)'],
 api:'Mathf.Repeat(값, 길이), Mathf.Abs',
 starter:C`
bool IsAimed(float angle, float target, float tolerance)
{
    return Mathf.Abs(target - angle) <= tolerance;
}`,
 solution:C`
bool IsAimed(float angle, float target, float tolerance)
{
    float diff = Mathf.Repeat(target - angle + 180f, 360f) - 180f;
    return Mathf.Abs(diff) <= tolerance;
}`,
 rules:[no('DeltaAngle 금지',/DeltaAngle/,'직접 구현했어요.','DeltaAngle 대신 직접 계산해 보세요.')],
 test:(api,ok)=>{
  const a=(x,y,t)=>api.call('IsAimed',x,y,t);
  ok('0도 경계',a(359,1,5)===true&&a(1,359,5)===true,'359°와 1°는 가까워요.','359와 1은 2도 차이예요. 360 순환을 고려하세요.');
  ok('멀면 false',a(0,90,10)===false&&a(350,20,10)===false,'멀리 떨어지면 false예요.','0과 90, 350과 20(30도 차이)은 tolerance 10 밖이에요.');
  ok('일반 값',a(100,105,5)===true&&a(100,106,5)===false,'경계 5도 이내만 true예요.','100과 105는 5도 이내, 106은 밖이에요.');
  ok('범위 밖 입력',a(720,10,10)===true&&a(-10,350,1)===true,'360을 넘거나 음수인 각도도 처리해요.','720은 0도와 같고, −10은 350도와 같아요.');
 },
 hints:['단순 뺄셈은 0도를 넘는 경우를 놓쳐요.','최단 각도 차이는 Mathf.Repeat(b − a + 180, 360) − 180 으로 구해요.','그 차이의 절댓값을 tolerance와 비교하세요.'],
 why:'각도 비교는 항상 "최단 차이" 위에서 해야 해요. 한 번 정리해 두면 조준, 시야, 회전 완료 판정에 그대로 재사용됩니다.',
 concepts:[['각도의 순환성','각도는 360도마다 같은 방향이라 차이를 −180 ~ 180으로 감싸야 한다.'],['Mathf.Repeat','값을 0 이상 길이 미만으로 순환시킨다.']]});

QB({id:'x90',cat:'math',stage:1,level:3,title:'어느 쪽으로 돌아야 빠를까 (회전 방향)',
 story:'AI가 목표 각도를 향해 돌 때 시계 방향인지 반시계 방향인지 정해야 해요. 최단 각도 차이가 양수면 반시계(+1), 음수면 시계(−1), 같으면 0이에요. 350도에서 10도로 가려면 반시계(+1)가 가깝습니다.',
 goals:['TurnDir(current, target): 최단 각도 차이가 양수이면 1, 음수이면 −1, 0이면 0을 반환한다','350 → 10 은 1, 10 → 350 은 −1','360도를 넘는 각도도 처리한다'],
 limits:['정확히 반대편(180도)처럼 애매한 경우는 테스트하지 않는다'],
 api:'Mathf.Repeat(값, 길이)',
 starter:C`
int TurnDir(float current, float target)
{
    if (target > current) return 1;
    if (target < current) return -1;
    return 0;
}`,
 solution:C`
int TurnDir(float current, float target)
{
    float diff = Mathf.Repeat(target - current + 180f, 360f) - 180f;
    if (diff > 0f) return 1;
    if (diff < 0f) return -1;
    return 0;
}`,
 rules:[],
 test:(api,ok)=>{
  const d=(a,b)=>api.call('TurnDir',a,b);
  ok('0도 경계 넘기',d(350,10)===1&&d(10,350)===-1,'350→10은 +1, 10→350은 −1이에요.',`350→10: ${d(350,10)}, 10→350: ${d(10,350)}. 각각 1, −1이어야 해요.`);
  ok('일반 값',d(0,90)===1&&d(90,0)===-1&&d(45,45)===0,'0→90은 +1, 90→0은 −1, 같으면 0이에요.',`0→90: ${d(0,90)}, 90→0: ${d(90,0)}, 45→45: ${d(45,45)}`);
  ok('범위 밖 입력',d(720,10)===1&&d(-10,370)===1&&d(30,30+360)===0,'360을 넘는 입력도 처리해요.',`720→10: ${d(720,10)}. +1이어야 하고, 30과 390은 같은 각도라 0이에요.`);
  ok('큰 차이도 최단',d(10,200)===-1&&d(200,10)===1,'200°는 10°에서 시계 방향이 더 가까워요.',`10→200: ${d(10,200)}, 200→10: ${d(200,10)}. 각각 −1, 1이어야 해요.`);
 },
 hints:['단순 비교는 0도를 넘는 경우에 틀려요.','최단 차이는 Mathf.Repeat(b − a + 180, 360) − 180 이에요.','그 차이의 부호로 방향을 정하세요.'],
 why:'방향 결정에도 "최단 각도 차이"가 기준이 돼요. 부호만 필요하다면 그 값을 한 번 구해서 양수·음수·0으로 나누면 끝입니다.',
 concepts:[['각도의 순환성','차이를 −180 ~ 180으로 감싸야 최단 회전 방향을 알 수 있다.'],['Mathf.Repeat','값을 0 이상 길이 미만으로 순환시킨다.']]});
