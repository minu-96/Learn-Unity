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
