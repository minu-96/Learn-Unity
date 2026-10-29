/* ===== C# 문법 ===== */
Q({id:'c1',cat:'csharp',stage:1,level:1,title:'Inspector에는 보이고 다른 클래스는 못 건드리게',
 story:'기획자가 Inspector에서 플레이어의 속도와 최대 체력을 조절하고 싶어 합니다. 그런데 동료 프로그래머가 다른 스크립트에서 player.speed 값을 마음대로 바꾸는 바람에 버그가 났습니다. 값은 에디터에서 조절하되, 코드로는 함부로 바꾸지 못하게 만들어 주세요.',
 goals:['speed(float, 기본값 5)와 maxHp(int, 기본값 100)를 Inspector에서 수정할 수 있게 선언한다','currentHp(int)를 선언하고, 다른 스크립트는 읽기만 가능하게 한다 (값 변경은 이 클래스 안에서만)','Awake에서 currentHp를 maxHp로 초기화한다'],
 limits:['speed와 maxHp는 public으로 선언하지 않는다','currentHp는 Inspector에 나타나지 않아야 한다'],
 starter:C`
using UnityEngine;

public class Player : MonoBehaviour
{
    // TODO: speed, maxHp 선언

    // TODO: currentHp 선언 (밖에서는 읽기만 가능)

    void Awake()
    {
        // TODO: 현재 체력을 최대 체력으로 초기화
    }
}`,
 solution:C`
using UnityEngine;

public class Player : MonoBehaviour
{
    [SerializeField] private float speed = 5f;
    [SerializeField] private int maxHp = 100;
    public int CurrentHp { get; private set; }

    void Awake()
    {
        CurrentHp = maxHp;
    }
}`,
 alts:[C`
using UnityEngine;

public class Player : MonoBehaviour
{
    [SerializeField] float speed = 5f;
    [SerializeField] int maxHp = 100;
    private int currentHp;
    public int CurrentHp => currentHp;

    void Awake()
    {
        currentHp = maxHp;
    }
}`],
 rules:[
  has('speed 선언',/\[SerializeField\]\s*(?:private\s+)?float\s+speed\b/,'speed를 [SerializeField] private으로 선언했어요. Inspector 노출과 캡슐화를 함께 챙겼어요.','speed는 [SerializeField]를 붙인 float 필드로 선언하세요. private 필드에 [SerializeField]를 붙이면 Inspector에는 보이지만 다른 클래스에서는 접근할 수 없어요.'),
  has('speed 기본값 5',/float\s+speed\s*=\s*5(?:\.0*)?f?\s*;/,'speed의 기본값이 5예요.','speed의 기본값이 5가 아니에요. float 값은 5f처럼 f 접미사를 붙여 씁니다.'),
  has('maxHp 선언과 기본값 100',/\[SerializeField\]\s*(?:private\s+)?int\s+maxHp\s*=\s*100\s*;/,'maxHp를 [SerializeField] int로 선언하고 100으로 초기화했어요.','maxHp는 [SerializeField]를 붙인 int 필드로 선언하고 기본값을 100으로 두세요.'),
  no('public 필드 금지',/\bpublic\s+(?:float|int)\s+(?:speed|maxHp)\b/,'speed와 maxHp를 public으로 열어 두지 않았어요.','public 필드는 Inspector에도 보이지만 모든 클래스가 값을 바꿀 수 있어요. 이번 문제에서는 [SerializeField] private을 쓰세요.'),
  has('읽기 전용 currentHp',/\bpublic\s+int\s+\w+\s*(?:\{\s*get;\s*(?:private|protected)\s+set;\s*\}|=>\s*\w+\s*;|\{\s*get\s*\{?\s*return\s+\w+;\s*\}?\s*\})/,'currentHp를 밖에서는 읽기만 되는 프로퍼티로 공개했어요.','currentHp(또는 CurrentHp)를 public int 프로퍼티로 만들되 set은 private으로 막으세요. 예: public int CurrentHp { get; private set; }'),
  no('currentHp 직접 공개 금지',/\bpublic\s+int\s+currentHp\s*[;=]/,'currentHp 필드를 직접 공개하지 않았어요.','public int currentHp; 는 밖에서 값을 덮어쓸 수 있어요. 읽기 전용 프로퍼티로 바꾸세요.'),
  no('currentHp Inspector 비노출',/\[SerializeField\][^;{]*\b[cC]urrentHp\b/,'currentHp는 Inspector에 노출되지 않아요.','currentHp에 [SerializeField]를 붙이면 Inspector에서 값을 바꿀 수 있어요. 이번에는 노출하지 않습니다.'),
  inFn('Awake에서 초기화','Awake',/\b[cC]urrentHp\s*=\s*maxHp\s*;/,'Awake에서 currentHp를 maxHp로 맞췄어요.','Awake 안에서 currentHp = maxHp; 로 초기화하세요.')
 ],
 hints:['Inspector에는 보이지만 외부 클래스는 접근하지 못하게 하는 조합은 [SerializeField]와 private이에요.','밖에서 읽기만 가능하게 하려면 set을 private으로 둔 자동 구현 프로퍼티를 쓸 수 있어요: { get; private set; }','프로퍼티 이름은 관례상 대문자로 시작해요 (CurrentHp).'],
 why:'public 필드는 Inspector에 보이지만 모든 클래스가 값을 바꿀 수 있어요. [SerializeField] private은 "에디터에서는 조절, 코드에서는 보호"를 동시에 만족하는 Unity의 표준 패턴이고, { get; private set; } 프로퍼티는 읽기만 공개하는 방법입니다.',
 concepts:[['[SerializeField]','private 필드를 Inspector에 노출하는 특성. 외부 접근은 막으면서 값은 에디터에서 조절하게 한다.'],['접근 제한자와 캡슐화','public/private으로 공개 범위를 정해 다른 클래스가 내부 값을 마음대로 바꾸지 못하게 하는 설계.'],['프로퍼티(get/private set)','읽기는 공개하고 쓰기는 클래스 내부로 제한하는 멤버.']]});

Q({id:'s2',cat:'csharp',stage:1,level:2,title:'벽에 닿으면 방향을 바꾸는 왕복 이동',
 story:'오브젝트가 x=60과 x=420 사이를 계속 왕복해야 합니다. 지금은 오른쪽으로만 가서 화면 밖으로 나갑니다. 방향을 기억하는 변수와 if문으로 양 끝에서 방향을 뒤집어 주세요.',
 goals:['10초 동안 오른쪽 끝(약 420)까지 갔다가 왼쪽 끝(약 60)으로 돌아온다','60~420 범위를 벗어나지 않는다'],
 limits:['이동량은 speed × Time.deltaTime 으로 계산한다','방향은 변수에 저장한다 (예: float dir)','transform.position.x 에 직접 대입하면 컴파일 에러(CS1612)예요. 지역 변수로 복사해서 수정하세요'],
 api:'transform.position(Vector3), Time.deltaTime',
 starter:C`
public float speed = 100f;

void Update()
{
    Vector3 pos = transform.position;
    pos.x += speed * Time.deltaTime;
    transform.position = pos;
    // TODO: 방향 변수를 만들고, 양 끝(60, 420)에서 뒤집어 보세요.
}`,
 solution:C`
public float speed = 100f;
public float minX = 60f;
public float maxX = 420f;
float dir = 1f;

void Update()
{
    Vector3 pos = transform.position;
    pos.x += speed * dir * Time.deltaTime;
    if (pos.x >= maxX) { pos.x = maxX; dir = -1f; }
    else if (pos.x <= minX) { pos.x = minX; dir = 1f; }
    transform.position = pos;
}`,
 world:{start:{x:60,y:135}},runs:[{fps:60,seconds:10}],show:10,
 rules:[has('Time.deltaTime 사용',/Time\.deltaTime/,'프레임 시간을 곱해 이동해요.','이동량에 Time.deltaTime을 곱하세요. 곱하지 않으면 프레임레이트에 따라 속도가 달라집니다.'),
  has('방향 변수',/\b(?:float|int)\s+\w*[dD]ir\w*\s*=/,'방향을 변수에 저장했어요.','방향을 기억할 변수(예: float dir = 1f;)를 클래스 필드로 만드세요. 지역 변수로 두면 매 프레임 초기화돼요.')],
 check:rs=>{const f=rs[0].frames.map(a=>a[1]);const mx=Math.max(...f),mn=Math.min(...f);const im=f.indexOf(mx);const after=Math.min(...f.slice(im));
  return {items:[
   it(mx>=415,'오른쪽 끝 도달',`x 최대값이 ${mx.toFixed(0)}로 오른쪽 끝(420)까지 갔어요.`,`x 최대값이 ${mx.toFixed(0)}예요. 오른쪽 끝(약 420)까지 가지 못했어요. 속도와 시간을 확인하세요.`),
   it(after<=70,'왼쪽으로 복귀',`오른쪽 끝에서 방향을 바꿔 x=${after.toFixed(0)}까지 돌아왔어요.`,'오른쪽 끝에서 돌아오지 않았어요. 끝에 닿으면 방향 값을 -1로 바꿔야 해요.'),
   it(mn>=50&&mx<=430,'범위 유지',`x가 ${mn.toFixed(0)}~${mx.toFixed(0)} 범위 안에 있어요.`,`x가 ${mn.toFixed(0)}~${mx.toFixed(0)} 로 범위를 벗어났어요. 끝에 닿았을 때 위치도 경계값으로 되돌리세요.`)]}},
 hints:['지금 코드는 항상 +방향으로만 더합니다. 이동량에 곱해 줄 "방향" 값이 필요해요 (오른쪽 1, 왼쪽 -1).','방향 값은 Update 밖(클래스 필드)에 두어야 프레임이 지나도 기억돼요.','pos.x가 끝 값 이상/이하가 되면 방향의 부호를 뒤집고, pos.x를 경계값으로 되돌려 주세요.'],
 why:'움직임의 "상태"(지금 어느 방향인가)는 변수에 저장하고, 조건문으로 그 상태를 바꿉니다. 경계를 넘은 위치를 경계값으로 되돌리지 않으면 프레임이 튀었을 때 범위 밖에 머무를 수 있어요.',
 concepts:[['상태 변수와 조건문','방향 같은 상태를 변수에 저장하고 if로 조건에 따라 값을 바꾸면 반복되는 동작을 제어할 수 있다.'],['경계 처리(Clamp)','값이 범위를 넘으면 경계 값으로 되돌려 범위 밖으로 나가지 않게 하는 처리.'],['CS1612와 구조체 복사','Vector3는 구조체라 transform.position은 복사본을 돌려준다. 값을 바꾸려면 지역 변수에 복사해 수정한 뒤 다시 대입한다.']]});

Q({id:'c6',cat:'csharp',stage:1,level:3,title:'체력바가 항상 0 아니면 1로만 나온다',
 story:'체력바 UI가 이상해요. 체력이 50/200인데 0%로 보이고, 가득 찼을 때만 100%가 됩니다. 콘솔에 에러는 없어요. 체력 비율과 퍼센트를 올바르게 계산하는 두 메서드를 완성해 주세요.',
 goals:['HpRatio(hp, maxHp): 0~1 사이의 float 비율을 반환한다 (50, 200 → 0.25)','HpPercent(hp, maxHp): 비율을 0~100 정수로 반올림해 반환한다 (1, 3 → 33)','maxHp가 0 이하이면 0을 반환한다 (0으로 나누기 방지)','hp가 음수이거나 maxHp를 넘어도 결과는 0~1 범위를 지킨다'],
 limits:['정수끼리 바로 나누지 않는다 (int / int 는 소수점을 버려요)','HpPercent는 HpRatio를 재사용한다'],
 starter:C`
float HpRatio(int hp, int maxHp)
{
    return hp / maxHp;   // 50 / 200 을 계산하면?
}

int HpPercent(int hp, int maxHp)
{
    // TODO: HpRatio를 이용해 0~100 정수로 (반올림)
    return 0;
}`,
 solution:C`
float HpRatio(int hp, int maxHp)
{
    if (maxHp <= 0) return 0f;
    return Mathf.Clamp01((float)hp / maxHp);
}

int HpPercent(int hp, int maxHp)
{
    return Mathf.RoundToInt(HpRatio(hp, maxHp) * 100f);
}`,
 alts:[C`
float HpRatio(int hp, int maxHp)
{
    if (maxHp == 0) return 0;
    float r = hp * 1f / maxHp;
    return Mathf.Clamp(r, 0f, 1f);
}

int HpPercent(int hp, int maxHp)
{
    return (int)(HpRatio(hp, maxHp) * 100f + 0.5f);
}`],
 rules:[
  inFn('HpRatio 재사용','HpPercent',/\bHpRatio\s*\(/,'HpPercent가 HpRatio를 재사용해요.','비율 계산을 복사하지 말고 HpRatio(hp, maxHp)를 호출해 재사용하세요.'),
 ],
 test:(api,ok)=>{
  const r=(a,b)=>api.call('HpRatio',a,b);
  ok('HpRatio(50, 200)',Math.abs(r(50,200)-0.25)<1e-6,'50/200 = 0.25 를 반환했어요.',`HpRatio(50, 200) 이 ${r(50,200)} 입니다. 0.25여야 해요. 정수 나눗셈 때문일 수 있어요.`);
  ok('HpRatio 경계',r(200,200)===1&&r(0,200)===0,'가득 찬 체력은 1, 0은 0이에요.','HpRatio(200, 200)은 1, HpRatio(0, 200)은 0이어야 해요.');
  ok('범위 제한',r(300,200)===1&&r(-5,200)===0,'범위를 벗어나는 hp도 0~1로 제한돼요.','HpRatio(300, 200)은 1, HpRatio(-5, 200)은 0이어야 해요. 클램프가 필요해요.');
  ok('maxHp가 0',r(10,0)===0,'maxHp가 0이어도 0을 반환해요.','HpRatio(10, 0)은 0이어야 해요.');
  const p=(a,b)=>api.call('HpPercent',a,b);
  ok('HpPercent 반올림',p(1,3)===33&&p(2,3)===67&&p(200,200)===100,'1/3→33, 2/3→67, 가득→100 이에요.',`HpPercent(1,3)=${p(1,3)}, (2,3)=${p(2,3)}, (200,200)=${p(200,200)}. 각각 33, 67, 100이어야 해요.`);
 },
 hints:['hp와 maxHp는 둘 다 int예요. C#에서 int / int 는 정수 나눗셈이라 소수점이 버려져요 (50 / 200 = 0).','C#에서 int / int 의 결과는 int예요. 50 / 200 은 0.25가 아니라 0이 됩니다.','나누기 전에 한쪽을 (float)로 바꾸면 float 나눗셈이 됩니다. (float)hp / maxHp','결과를 Mathf.Clamp01로 감싸면 0~1 범위를 보장해요. 퍼센트는 Mathf.RoundToInt(비율 * 100f).'],
 why:'C#은 두 피연산자가 모두 int이면 정수 나눗셈을 합니다. 비율·퍼센트를 계산할 때는 한쪽을 float으로 바꾼 뒤 나눠야 하고, 분모가 0이 될 수 있는지와 값의 범위를 항상 함께 생각해야 해요.',
 concepts:[['정수 나눗셈','int / int 는 소수점 이하를 버린 int를 돌려준다. 비율 계산 전에 float으로 변환해야 한다.'],['형 변환(cast)','(float)hp 처럼 값을 다른 형식으로 바꾸는 문법. 나눗셈 전에 쓰면 소수점이 살아난다.'],['Mathf.Clamp01','값을 0~1 범위로 제한한다. 비율이나 보간 값 보호에 자주 쓴다.']]});

Q({id:'c8',cat:'csharp',stage:2,level:1,title:'List로 가방 만들기',
 story:'인벤토리를 만들고 있어요. 가방 크기는 기획자가 Inspector에서 바꿀 수 있어야 하고, 같은 아이템은 중복으로 넣을 수 없습니다. 크기가 변하는 컬렉션인 List<string>으로 가방을 완성해 주세요.',
 goals:['AddItem(name): 가방이 가득 찼거나 같은 이름이 이미 있으면 false, 아니면 추가하고 true','RemoveItem(name): 있으면 제거하고 true, 없으면 false','ItemCount(): 지금 들어 있는 아이템 수를 반환한다'],
 limits:['가방은 List<string> bag 으로 관리한다 (배열 금지)','가방 크기는 capacity 필드를 사용하고 3 같은 숫자를 직접 쓰지 않는다'],
 starter:C`
using System.Collections.Generic;
using UnityEngine;

public class Inventory : MonoBehaviour
{
    public int capacity = 3;
    private List<string> bag = new List<string>();

    bool AddItem(string name)
    {
        // TODO: 가득 찼거나 중복이면 false, 아니면 추가하고 true
        return false;
    }

    bool RemoveItem(string name)
    {
        // TODO
        return false;
    }

    int ItemCount()
    {
        // TODO
        return 0;
    }
}`,
 solution:C`
using System.Collections.Generic;
using UnityEngine;

public class Inventory : MonoBehaviour
{
    public int capacity = 3;
    private List<string> bag = new List<string>();

    bool AddItem(string name)
    {
        if (bag.Count >= capacity) return false;
        if (bag.Contains(name)) return false;
        bag.Add(name);
        return true;
    }

    bool RemoveItem(string name)
    {
        return bag.Remove(name);
    }

    int ItemCount()
    {
        return bag.Count;
    }
}`,
 rules:[
  has('List<string> 사용',/List<string>\s+bag\b/,'List<string>으로 가방을 관리해요.','가방은 List<string> bag 으로 선언하세요. 배열은 크기가 고정이라 아이템을 넣고 빼기 불편해요.'),
  no('배열 금지',/\bstring\s*\[\s*\]/,'배열 없이 List만 썼어요.','이번 문제에서는 배열(string[]) 대신 List를 쓰세요.'),
  notIn('숫자 직접 비교 금지','AddItem',/\b(?:Count|Length)\s*(?:>=|>|==)\s*\d+/,'3 같은 숫자를 직접 쓰지 않았어요.','Count와 비교할 때 숫자를 직접 쓰지 말고 capacity를 쓰세요. Inspector에서 값을 바꿔도 동작해야 해요.'),
  inFn('중복 확인','AddItem',/\bContains\s*\(|\bIndexOf\s*\(|\bExists\s*\(|\bFind\s*\(/,'이미 있는 아이템인지 확인해요.','List.Contains(name)으로 이미 들어 있는지 확인하세요.'),
  inFn('제거','RemoveItem',/\bRemove\s*\(/,'List.Remove로 제거해요.','List.Remove(name)을 쓰면 제거에 성공했는지 bool로 돌려줘요.')
 ],
 test:(api,ok)=>{
  api.set('capacity',2);
  const a=api.call('AddItem','검'),b=api.call('AddItem','방패'),c=api.call('AddItem','포션');
  ok('추가와 가득 참',a===true&&b===true&&c===false,'2칸 가방에 2개까지만 들어가요.',`capacity=2 일 때 검:${a}, 방패:${b}, 포션:${c} 입니다. true, true, false 여야 해요.`);
  ok('중복 방지',api.call('AddItem','검')===false,'같은 이름은 거절해요.','이미 있는 "검"을 다시 넣으면 false여야 해요.');
  ok('ItemCount',api.call('ItemCount')===2,'아이템 수가 2예요.',`ItemCount()가 ${api.call('ItemCount')} 입니다. 2여야 해요.`);
  ok('제거',api.call('RemoveItem','검')===true&&api.call('RemoveItem','없는것')===false&&api.call('ItemCount')===1,'있는 것은 true, 없는 것은 false로 제거해요.','RemoveItem은 있으면 제거 후 true, 없으면 false를 반환해야 해요.');
  api.set('capacity',3);
  ok('capacity 변경 반영',api.call('AddItem','포션')===true&&api.call('AddItem','열쇠')===true&&api.call('AddItem','지도')===false,'capacity를 바꾸면 가방 크기도 바뀌어요.','capacity를 3으로 바꿨는데 반영되지 않아요. 숫자를 직접 쓰지 말고 capacity 필드를 비교하세요.');
 },
 hints:['List<T>는 Add, Remove, Contains, Count 를 제공해요.','가득 참 검사는 bag.Count와 capacity를 비교하면 됩니다.','Remove는 지우는 데 성공하면 true를 돌려주니 그 값을 그대로 반환할 수 있어요.'],
 why:'배열은 크기가 고정이고 List<T>는 크기가 변해서 인벤토리처럼 추가·삭제가 잦은 데이터에 어울려요. 한도 값처럼 기획이 바꿀 수 있는 숫자는 코드에 박지 말고 필드로 빼 두면 Inspector에서 조절할 수 있어요.',
 concepts:[['List<T>','크기가 자동으로 늘고 줄어드는 컬렉션. Add, Remove, Contains, Count 등을 제공한다.'],['배열 vs List','배열은 크기 고정, List는 가변 크기. 추가·삭제가 잦으면 List가 편하다.']]});

Q({id:'c2',cat:'csharp',stage:2,level:2,title:'죽은 적을 목록에서 지우기',
 story:'적 체력 목록에서 죽은 적(체력 0 이하)을 지우는 코드를 짰는데, Unity가 "InvalidOperationException: Collection was modified" 를 내며 멈춥니다. foreach로 도는 중에 같은 목록을 수정했기 때문이에요. 안전하게 지우는 방법으로 고쳐 주세요.',
 goals:['RemoveDead(hps): 체력이 0 이하인 값을 모두 같은 리스트에서 제거한다 (남은 값의 순서는 유지)','CountAlive(hps): 체력이 0보다 큰 값의 개수를 반환한다'],
 limits:['foreach 안에서 같은 리스트를 수정하지 않는다','새 리스트를 반환하지 않고 전달받은 리스트를 직접 수정한다 (반환형은 void)','연속으로 죽은 값(0, 0, 0)도 빠짐없이 지워져야 한다'],
 starter:C`
using System.Collections.Generic;

void RemoveDead(List<int> hps)
{
    foreach (int hp in hps)
    {
        if (hp <= 0)
        {
            hps.Remove(hp);   // 순회 중 수정: InvalidOperationException
        }
    }
}

int CountAlive(List<int> hps)
{
    // TODO
    return 0;
}`,
 solution:C`
using System.Collections.Generic;

void RemoveDead(List<int> hps)
{
    hps.RemoveAll(hp => hp <= 0);
}

int CountAlive(List<int> hps)
{
    int n = 0;
    foreach (int hp in hps)
    {
        if (hp > 0) n++;
    }
    return n;
}`,
 alts:[C`
using System.Collections.Generic;

void RemoveDead(List<int> hps)
{
    for (int i = hps.Count - 1; i >= 0; i--)
    {
        if (hps[i] <= 0) hps.RemoveAt(i);
    }
}

int CountAlive(List<int> hps)
{
    int n = 0;
    for (int i = 0; i < hps.Count; i++)
    {
        if (hps[i] > 0) n++;
    }
    return n;
}`],
 bads:[{code:C`
void RemoveDead(List<int> hps)
{
    for (int i = 0; i < hps.Count; i++)
    {
        if (hps[i] <= 0) hps.RemoveAt(i);
    }
}
int CountAlive(List<int> hps) { return hps.Count; }`,hit:'연속'}],
 rules:[
  notInLoop('foreach 안에서 수정 금지','foreach',/\.(?:Remove|RemoveAt|RemoveAll|Add|Insert|Clear)\s*\(/,'foreach 안에서 리스트를 수정하지 않았어요.','foreach로 도는 컬렉션을 반복문 안에서 수정하면 예외가 납니다. RemoveAll을 쓰거나, 뒤에서부터 도는 for문으로 바꾸세요.'),
  inFn('RemoveDead가 제거함','RemoveDead',/RemoveAll\s*\(|RemoveAt\s*\(|\.Remove\s*\(/,'RemoveDead가 리스트에서 값을 제거해요.','RemoveDead 안에서 리스트의 값을 직접 제거하세요.')
 ],
 test:(api,ok)=>{
  const l=[0,5,0,0,7,-1];
  api.call('RemoveDead',l);
  ok('연속된 값까지 제거',JSON.stringify(l)==='[5,7]','죽은 값만 지워지고 [5, 7] 이 남았어요.',`RemoveDead 후 리스트가 [${l.join(', ')}] 입니다. [5, 7] 이어야 해요. 앞에서부터 도는 for문에서 RemoveAt(i)를 하면 다음 원소를 건너뛰어요.`);
  const l2=[3,4];api.call('RemoveDead',l2);
  ok('살아있는 값 보존',JSON.stringify(l2)==='[3,4]','모두 살아 있으면 그대로예요.','살아 있는 값이 지워졌어요.');
  const e=[];api.call('RemoveDead',e);
  ok('빈 리스트',e.length===0,'빈 리스트도 안전해요.','빈 리스트에서도 문제없이 동작해야 해요.');
  ok('CountAlive',api.call('CountAlive',[0,5,0,2,9])===3,'살아 있는 개수를 셌어요.',`CountAlive([0,5,0,2,9]) 는 3이어야 해요 (현재 ${api.call('CountAlive',[0,5,0,2,9])}).`);
 },
 hints:['foreach는 순회하는 동안 컬렉션이 바뀌면 예외를 던져요.','조건에 맞는 요소를 한 번에 지우는 List.RemoveAll(조건) 이 있어요.','for로 지운다면 앞에서부터 돌면 다음 원소를 건너뛰어요. 뒤에서부터 도세요.'],
 why:'foreach는 열거자(Enumerator)를 쓰는데, 순회 중 컬렉션이 바뀌면 열거자가 상태를 알 수 없어 예외를 냅니다. 지울 때는 RemoveAll로 조건을 넘기거나, 인덱스가 밀리지 않도록 뒤에서부터 for로 돌면서 RemoveAt 하세요.',
 concepts:[['foreach 중 수정 금지','foreach로 순회하는 컬렉션을 반복문 안에서 수정하면 InvalidOperationException이 발생한다.'],['List.RemoveAll','조건에 맞는 요소를 한 번에 제거하는 List 메서드.'],['역순 for 삭제','삭제하면 뒤 원소의 인덱스가 당겨지므로 뒤에서부터 순회하면 건너뛰지 않는다.']]});

Q({id:'c5',cat:'csharp',stage:2,level:3,title:'x만 따라가는 카메라 (CS1612)',
 story:'횡스크롤 카메라가 플레이어의 x좌표만 따라가고 높이(y)는 그대로여야 해요. 그런데 아래 코드는 컴파일조차 되지 않아요:\nerror CS1612: Cannot modify the return value of \'Transform.position\' because it is not a variable\n컴파일되고 의도대로 동작하도록 고쳐 주세요.',
 goals:['LateUpdate에서 target.position.x 를 카메라 transform.position.x 에 반영한다','y와 z는 기존 값을 유지한다'],
 limits:['transform.position.x 에 직접 대입하지 않는다','Vector3 값을 지역 변수에 복사해 수정하거나, 새 Vector3를 만들어 대입한다'],
 starter:C`
public Transform target;

void LateUpdate()
{
    // error CS1612
    transform.position.x = target.position.x;
}`,
 solution:C`
public Transform target;

void LateUpdate()
{
    Vector3 pos = transform.position;
    pos.x = target.position.x;
    transform.position = pos;
}`,
 alts:[C`
public Transform target;

void LateUpdate()
{
    transform.position = new Vector3(target.position.x, transform.position.y, transform.position.z);
}`],
 rules:[
  inFn('position을 다시 대입','LateUpdate',/\btransform\.position\s*=(?!=)/,'수정한 값을 transform.position에 다시 대입했어요.','transform.position은 복사본이에요. 수정한 Vector3를 transform.position = pos; 로 다시 대입해야 실제로 움직입니다.')
 ],
 test:(api,ok)=>{
  api.transform.position={x:0,y:10};
  api.set('target',{position:{x:50,y:99}});
  api.call('LateUpdate');
  const p=api.transform.position;
  ok('x 따라가기',p.x===50,'카메라 x가 target.x(50)를 따라가요.',`카메라 x가 ${p.x} 입니다. target의 x(50)가 되어야 해요.`);
  ok('y 유지',p.y===10,'카메라 y는 그대로예요.',`카메라 y가 ${p.y} 로 바뀌었어요. y는 원래 값(10)을 유지해야 해요.`);
 },
 hints:['transform.position 은 프로퍼티라서 값을 "복사해서" 돌려줘요. 그 복사본의 x만 고치는 건 의미가 없어서 컴파일러가 막습니다.','Vector3 pos = transform.position; 처럼 지역 변수에 담아 보세요.','수정한 뒤에는 transform.position = pos; 로 되돌려 넣어야 반영돼요.'],
 why:'Vector3는 struct(값 형식)라서 transform.position을 읽으면 복사본이 나옵니다. 복사본의 x만 고쳐도 원본은 변하지 않으니 C#이 컴파일 단계에서 막아요. "복사 → 수정 → 다시 대입"이 Unity에서 위치·회전·스케일을 한 축만 바꾸는 표준 패턴입니다.',
 concepts:[['값 형식(struct)과 참조 형식(class)','struct는 대입할 때 값이 복사되고 class는 참조가 복사된다. Vector3는 struct다.'],['CS1612','구조체 프로퍼티의 반환값(복사본)을 수정할 수 없다는 컴파일 에러. 지역 변수에 복사해 수정한 뒤 다시 대입한다.'],['LateUpdate','모든 Update가 끝난 뒤 호출. 대상의 이동이 끝난 뒤 따라가는 카메라 처리에 적합하다.']]});

Q({id:'c9',cat:'csharp',stage:3,level:1,title:'점수가 바뀌면 알려주기 (event)',
 story:'점수가 바뀌면 점수판 UI, 효과음, 업적 시스템이 각각 반응해야 해요. ScoreManager가 이들을 하나하나 직접 호출하면 코드가 얽히니, "점수가 바뀌었다"는 소식만 방송(event)하고 누가 듣든 상관하지 않게 만들어 주세요.',
 goals:['새 점수(int)를 전달하는 이벤트 OnScoreChanged 를 선언한다','AddScore(amount)에서 점수를 더한 뒤 이벤트를 발생시킨다 (새 점수를 전달)','구독자가 아무도 없어도 NullReferenceException이 나지 않는다'],
 limits:['Action<int> 에 event 키워드를 붙여 선언한다 (다른 클래스가 Invoke하거나 덮어쓰지 못하게)','UI나 오디오 클래스를 직접 참조하지 않는다'],
 starter:C`
using System;
using UnityEngine;

public class ScoreManager : MonoBehaviour
{
    private int score;

    // TODO: 점수가 바뀌었음을 알리는 이벤트를 선언하세요 (새 점수를 전달)

    public void AddScore(int amount)
    {
        score += amount;
        // TODO: 이벤트 발생
    }
}`,
 solution:C`
using System;
using UnityEngine;

public class ScoreManager : MonoBehaviour
{
    private int score;

    public event Action<int> OnScoreChanged;

    public void AddScore(int amount)
    {
        score += amount;
        OnScoreChanged?.Invoke(score);
    }
}`,
 alts:[C`
using System;
using UnityEngine;

public class ScoreManager : MonoBehaviour
{
    private int score;
    public event Action<int> OnScoreChanged;

    public void AddScore(int amount)
    {
        score += amount;
        if (OnScoreChanged != null) OnScoreChanged(score);
    }
}`],
 rules:[
  has('event 선언',/\bpublic\s+event\s+(?:System\.)?Action<int>\s+\w+\s*;/,'public event Action<int>으로 선언했어요.','public event Action<int> OnScoreChanged; 처럼 선언하세요. int는 새 점수를 전달하기 위한 매개변수예요.'),
  no('event 없는 delegate 금지',/\bpublic\s+(?:System\.)?Action(?:<[^>]*>)?\s+\w+\s*;/,'event 키워드로 외부의 직접 호출을 막았어요.','event 없이 public Action을 두면 다른 클래스가 Invoke하거나 = 로 덮어쓸 수 있어요. event 키워드를 붙이세요.'),
  inFn('이벤트 발생','AddScore',/\w+\s*\?\.\s*Invoke\s*\(\s*score\s*\)|!=\s*null[^;{]*\)\s*\{?\s*\w+(?:\.Invoke)?\s*\(\s*score\s*\)/,'점수를 더한 뒤 새 점수를 담아 이벤트를 발생시켜요 (null 안전).','AddScore 안에서 이벤트를 발생시키세요. 구독자가 없으면 이벤트가 null이니 OnScoreChanged?.Invoke(score); 처럼 ?.Invoke를 쓰세요.'),
  no('UI 직접 참조 금지',/\b(?:ScoreUI|UIManager|TMP_Text|Text|AudioSource|AchievementManager)\b/,'특정 UI/오디오 클래스를 참조하지 않아 결합이 낮아요.','ScoreManager가 UI나 오디오를 직접 참조하면 이벤트를 쓰는 의미가 사라져요. 소식만 방송하세요.')
 ],
 hints:['event는 delegate(메서드를 담는 타입)에 "외부는 구독/해제만 가능" 제한을 건 것이에요. Action<int>는 int 하나를 받는 메서드를 담을 수 있어요.','구독자가 하나도 없으면 이벤트 변수는 null입니다. null이면 호출할 수 없어요.','?.Invoke(값) 은 null이 아닐 때만 호출해 줘요.'],
 why:'이벤트는 "무슨 일이 생겼다"를 알리는 쪽(발행자)과 반응하는 쪽(구독자)을 분리합니다. 발행자는 구독자가 누구인지 몰라도 되고, event 키워드 덕분에 외부는 += / -= 만 할 수 있어요. 구독자가 없으면 null이므로 ?.Invoke로 안전하게 호출합니다.',
 concepts:[['event / Action','Action은 반환값 없는 메서드를 담는 델리게이트이고 event를 붙이면 외부에서는 구독(+=)과 해제(-=)만 가능하다.'],['?.Invoke','null이 아닐 때만 델리게이트를 호출하는 안전한 방법. 구독자가 없을 때의 NullReferenceException을 막는다.'],['옵저버 패턴','상태 변화를 발행하고 관심 있는 쪽이 구독해 반응하는 구조. 발행자와 구독자의 결합을 낮춘다.']]});

Q({id:'c10',cat:'csharp',stage:3,level:2,title:'구독과 해제를 짝으로',
 story:'점수판 UI(ScoreUI)가 ScoreManager의 OnScoreChanged 이벤트를 구독해 텍스트를 갱신하려고 해요. 그런데 화면을 닫았다 열 때마다 점수 갱신이 두 번, 세 번씩 일어납니다. 구독만 하고 해제를 하지 않아서 생기는 문제예요. 올바른 위치에서 구독하고 해제해 주세요.',
 goals:['오브젝트가 활성화될 때 HandleScore를 구독한다','오브젝트가 비활성화될 때 같은 메서드를 구독 해제한다'],
 limits:['OnEnable / OnDisable 에서 구독과 해제를 한 쌍으로 맞춘다','람다식(=>)으로 구독하지 않는다 (같은 람다를 해제할 수 없어요)','Update에서 manager의 값을 매 프레임 읽어 오지 않는다'],
 starter:C`
using TMPro;
using UnityEngine;

public class ScoreUI : MonoBehaviour
{
    [SerializeField] private ScoreManager manager;
    [SerializeField] private TMP_Text label;

    // TODO: 활성화되면 구독, 비활성화되면 해제

    private void HandleScore(int score)
    {
        label.text = $"Score: {score}";
    }
}`,
 solution:C`
using TMPro;
using UnityEngine;

public class ScoreUI : MonoBehaviour
{
    [SerializeField] private ScoreManager manager;
    [SerializeField] private TMP_Text label;

    private void OnEnable()
    {
        manager.OnScoreChanged += HandleScore;
    }

    private void OnDisable()
    {
        manager.OnScoreChanged -= HandleScore;
    }

    private void HandleScore(int score)
    {
        label.text = $"Score: {score}";
    }
}`,
 rules:[
  inFn('OnEnable에서 구독','OnEnable',/\bOnScoreChanged\s*\+=\s*HandleScore\b/,'OnEnable에서 HandleScore를 구독해요.','OnEnable 안에서 manager.OnScoreChanged += HandleScore; 로 구독하세요.'),
  inFn('OnDisable에서 해제','OnDisable',/\bOnScoreChanged\s*-=\s*HandleScore\b/,'OnDisable에서 같은 메서드를 해제해요.','OnDisable 안에서 manager.OnScoreChanged -= HandleScore; 로 해제하세요. 구독한 것과 같은 메서드여야 해요.'),
  no('람다 구독 금지',/\+=\s*\(?\s*\w*\s*\)?\s*=>/,'메서드 이름으로 구독해서 해제할 수 있어요.','람다로 구독하면 해제할 때 같은 람다를 만들 수 없어 해제가 되지 않아요. 이름 있는 메서드를 쓰세요.'),
  notIn('Start에서 구독 금지','Start',/\+=/,'Start에서 구독하지 않았어요.','Start는 한 번만 호출되지만 OnDisable은 활성/비활성마다 호출돼요. 짝이 맞지 않으니 OnEnable에서 구독하세요.'),
  notIn('Awake에서 구독 금지','Awake',/\+=/,'Awake에서 구독하지 않았어요.','Awake에서 구독하면 비활성화됐다 다시 켜질 때 구독이 복구되지 않아요. OnEnable로 옮기세요.'),
  notIn('폴링 금지','Update',/manager\b/,'값을 매 프레임 물어보지 않고 이벤트를 받아요.','Update에서 manager를 읽는 폴링 대신 이벤트가 알려주는 값을 쓰세요.')
 ],
 hints:['OnEnable/OnDisable은 오브젝트가 켜질 때마다/꺼질 때마다 호출되는 짝이에요.','이벤트 구독은 += 해제는 -= 예요.','구독할 때 쓴 메서드와 해제할 때 쓰는 메서드가 같아야 해요.'],
 why:'구독을 해제하지 않으면 발행자가 구독자 참조를 계속 들고 있어 중복 호출, 파괴된 오브젝트 접근(MissingReferenceException), 메모리 누수가 생깁니다. OnEnable/OnDisable 짝으로 구독을 관리하면 활성 상태와 구독 상태가 항상 일치해요.',
 concepts:[['구독/해제 짝 맞추기','+=로 구독한 대상은 -=로 해제해야 한다. OnEnable/OnDisable 쌍이 가장 안전하다.'],['람다 구독의 함정','이름 없는 람다로 구독하면 같은 람다를 다시 만들 수 없어 해제할 수 없다.'],['OnEnable / OnDisable','오브젝트가 활성/비활성화될 때마다 호출되는 이벤트 함수.']]});

Q({id:'c4',cat:'csharp',stage:3,level:3,title:'죽음은 딱 한 번만 알리는 체력 시스템',
 story:'체력 시스템을 이벤트 기반으로 만듭니다. 체력이 바뀌면 체력바 UI가, 죽으면 게임오버 매니저와 사운드가 각각 반응해요. 구독자가 없어도 안전해야 하고, 죽은 뒤에 또 공격받아도 "죽음" 알림이 두 번 가면 안 됩니다.',
 goals:['OnHealthChanged(현재 체력, 최대 체력) 이벤트와 OnDied() 이벤트를 선언한다','TakeDamage(dmg): 체력을 줄이되 0 아래로 내려가지 않게 하고, 변화가 있으면 OnHealthChanged를 발생시킨다','체력이 0이 되는 순간 OnDied를 딱 한 번 발생시킨다','이미 죽은 뒤나 0 이하의 피해량은 무시한다'],
 limits:['구독자가 없어도 예외가 나지 않는다','두 이벤트 모두 event 키워드로 선언한다','죽었는지 기억하는 상태 변수(isDead)를 사용한다'],
 starter:C`
using System;
using UnityEngine;

public class Health : MonoBehaviour
{
    [SerializeField] private int maxHp = 100;
    private int hp;
    private bool isDead;

    // TODO: 이벤트 2개 선언

    void Awake()
    {
        hp = maxHp;
    }

    public void TakeDamage(int dmg)
    {
        // TODO
    }
}`,
 solution:C`
using System;
using UnityEngine;

public class Health : MonoBehaviour
{
    [SerializeField] private int maxHp = 100;
    private int hp;
    private bool isDead;

    public event Action<int, int> OnHealthChanged;
    public event Action OnDied;

    void Awake()
    {
        hp = maxHp;
    }

    public void TakeDamage(int dmg)
    {
        if (isDead || dmg <= 0) return;

        hp = Mathf.Max(0, hp - dmg);
        OnHealthChanged?.Invoke(hp, maxHp);

        if (hp == 0)
        {
            isDead = true;
            OnDied?.Invoke();
        }
    }
}`,
 rules:[
  has('OnHealthChanged 선언',/\bpublic\s+event\s+(?:System\.)?Action<int\s*,\s*int>\s+OnHealthChanged\s*;/,'OnHealthChanged를 Action<int, int> 이벤트로 선언했어요.','public event Action<int, int> OnHealthChanged; 로 선언하세요 (현재 체력, 최대 체력).'),
  has('OnDied 선언',/\bpublic\s+event\s+(?:System\.)?Action\s+OnDied\s*;/,'OnDied를 Action 이벤트로 선언했어요.','public event Action OnDied; 로 선언하세요.'),
  no('event 없는 delegate 금지',/\bpublic\s+(?:System\.)?Action(?:<[^>]*>)?\s+\w+\s*;/,'event 키워드를 모두 붙였어요.','event 없이 public Action을 두면 밖에서 마음대로 호출/덮어쓸 수 있어요.'),
  inFn('null 안전 호출','TakeDamage',/\?\s*\.\s*Invoke|!=\s*null/,'null 안전 호출을 사용해요.','구독자가 없으면 이벤트는 null이에요. ?.Invoke 또는 null 검사를 쓰세요.'),
  inFn('isDead 사용','TakeDamage',/\bisDead\b/,'죽음 상태를 기억해서 중복 알림을 막아요.','죽었다는 사실을 isDead에 기록하고, 이미 죽었다면 일찍 return 하세요.')
 ],
 test:(api,ok)=>{
  api.call('Awake');
  api.call('TakeDamage',10);
  ok('구독자 없이 호출',true,'구독자가 없어도 예외 없이 동작해요.','');
  api.call('Awake');
  const log=[];let died=0;
  api.set('OnHealthChanged',(c,m)=>log.push(c+'/'+m));
  api.set('OnDied',()=>{died++});
  api.set('isDead',false);
  api.call('TakeDamage',30);
  ok('체력 변화 알림',log.join()==='70/100',`체력 변화 알림 (${log.join(', ')})이 정확해요.`,`30 피해 후 OnHealthChanged 인자가 [${log.join(', ')}] 입니다. 70/100 이어야 해요.`);
  api.call('TakeDamage',500);
  ok('0 아래로 내려가지 않음',log[log.length-1]==='0/100',`과다 피해에도 체력이 0까지만 내려가요.`,`500 피해 후 마지막 알림이 ${log[log.length-1]} 입니다. 0/100 이어야 해요. Mathf.Max(0, ...)로 막아 보세요.`);
  ok('죽음 알림 1회',died===1,'OnDied가 정확히 한 번 호출됐어요.',`OnDied가 ${died}번 호출됐어요. 체력이 0이 되는 순간 한 번만 호출해야 해요.`);
  const n=log.length;
  api.call('TakeDamage',10);
  ok('죽은 뒤 무시',died===1&&log.length===n,'죽은 뒤의 피해는 무시해요.','이미 죽은 뒤에도 이벤트가 또 발생했어요. isDead이면 바로 return 하세요.');
 },
 hints:['이벤트는 두 개: 값을 전달하는 Action<int, int>와 값이 없는 Action이에요.','체력을 깎은 뒤 0 이하로 내려가지 않게 Mathf.Max(0, ...)를 쓰세요.','죽는 순간 isDead = true로 기록하고, 함수 첫 줄에서 isDead면 return 하면 중복 알림이 사라져요.'],
 why:'이벤트는 "한 번 일어난 일"을 알립니다. 죽음처럼 한 번만 처리해야 하는 일은 상태(isDead)로 중복을 막아야 해요. 구독자가 없을 때를 대비한 ?.Invoke와 합치면 발행 쪽 코드는 구독자가 누구든, 몇 명이든 바꿀 필요가 없습니다.',
 concepts:[['Action<T1,T2>','매개변수를 여러 개 받는 반환값 없는 델리게이트. 이벤트로 여러 값을 함께 전달할 수 있다.'],['중복 이벤트 방지','한 번만 일어나야 하는 이벤트는 상태 변수로 이미 발생했는지 기록하고 재진입을 막는다.'],['가드 절(guard clause)','함수 초반에 조건이 맞지 않으면 바로 return 해 이후 로직을 단순하게 만드는 패턴.']]});
