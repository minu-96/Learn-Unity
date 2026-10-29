/* ===== 설계 ===== */
Q({id:'g1',cat:'design',stage:1,level:1,title:'매직 넘버를 필드로 빼기',
 story:'회복 아이템의 회복량(20)과 최대 체력(100)이 코드 안에 숫자로 박혀 있어요. 기획자가 "회복량을 30으로, 최대 체력을 50으로 바꿔 보자"고 할 때마다 코드를 열어 고쳐야 합니다. 이 값들을 Inspector에서 조절할 수 있는 필드로 빼고, 함수는 필드 값을 사용하게 만들어 주세요.',
 goals:['healAmount(회복량)와 maxHp(최대 체력) 필드를 만든다 (기본값 20, 100)','Heal(hp): hp + healAmount 를 maxHp 를 넘지 않게 해서 반환한다','함수 안에는 20, 100 같은 숫자가 남아 있지 않다'],
 limits:['필드는 public 또는 [SerializeField]로 선언한다'],
 api:'Mathf.Min(a, b)',
 starter:C`
float Heal(float hp)
{
    return Mathf.Min(hp + 20f, 100f);
}`,
 solution:C`
public float healAmount = 20f;
public float maxHp = 100f;

float Heal(float hp)
{
    return Mathf.Min(hp + healAmount, maxHp);
}`,
 rules:[
  has('healAmount 필드',/\b(?:float|int)\s+healAmount\b/,'healAmount 필드가 있어요.','회복량을 담을 healAmount 필드를 만드세요.'),
  has('maxHp 필드',/\b(?:float|int)\s+maxHp\b/,'maxHp 필드가 있어요.','최대 체력을 담을 maxHp 필드를 만드세요.'),
  notIn('Heal 안의 매직 넘버','Heal',/\b(?:20|100)(?:\.0*)?f?\b/,'Heal 안에 20, 100이 남아 있지 않아요.','Heal 안에 20, 100 같은 숫자가 남아 있어요. 필드로 대체하세요.')
 ],
 test:(api,ok)=>{
  ok('기본값',api.call('Heal',50)===70&&api.call('Heal',95)===100,'기본값(20, 100)에서 올바르게 회복해요.','기본값에서 Heal(50)은 70, Heal(95)는 100이어야 해요.');
  api.set('healAmount',30);api.set('maxHp',50);
  ok('필드 값 반영',api.call('Heal',10)===40&&api.call('Heal',40)===50,'필드를 바꾸면 결과도 바뀌어요 (코드 수정 없이 조절 가능).','healAmount=30, maxHp=50으로 바꿨는데 결과가 그대로예요. Heal이 필드 값을 읽어야 해요.');
 },
 hints:['코드 안의 숫자 20과 100은 "왜 이 값인지"도 알 수 없고 바꾸려면 코드를 열어야 해요.','클래스 필드로 healAmount, maxHp를 선언하고 기본값을 20f, 100f로 두세요.','Heal 안에서는 숫자 대신 필드 이름을 쓰세요.'],
 why:'수치를 필드로 빼면 Inspector에서 재컴파일 없이 조절할 수 있고, 값의 의미가 이름으로 드러나요. 이것이 데이터와 로직을 분리하는 첫걸음입니다.',
 concepts:[['매직 넘버','코드에 의미 없이 박혀 있는 숫자. 이름 있는 필드나 상수로 바꿔 의미를 드러내고 조절 가능하게 한다.'],['[SerializeField]','private 필드를 Inspector에 노출하는 어트리뷰트. 캡슐화를 유지하면서 값을 조절할 수 있다.']]});

Q({id:'g2',cat:'design',stage:1,level:2,title:'무기 데이터를 ScriptableObject로',
 story:'무기마다 스크립트를 따로 만들고 있어요. 하지만 무기의 차이는 숫자(공격력, 공격 속도)뿐입니다. 데이터만 담는 ScriptableObject 에셋으로 만들면 무기를 코드 없이 에디터에서 추가할 수 있어요. WeaponData 클래스를 완성해 주세요.',
 goals:['WeaponData 는 ScriptableObject 를 상속한다','에디터 메뉴에서 만들 수 있도록 [CreateAssetMenu] 를 붙인다','필드: string weaponName, int damage, float attacksPerSecond','float DPS(): 초당 피해량 = damage × attacksPerSecond 를 반환한다'],
 limits:['MonoBehaviour 가 아니라 ScriptableObject 를 상속한다'],
 api:'[CreateAssetMenu(fileName = "...", menuName = "...")]',
 starter:C`
using UnityEngine;

public class WeaponData : MonoBehaviour
{
    // TODO: 이름, 공격력, 공격 속도 필드와 DPS 계산
}`,
 solution:C`
using UnityEngine;

[CreateAssetMenu(fileName = "NewWeapon", menuName = "Game/Weapon")]
public class WeaponData : ScriptableObject
{
    public string weaponName;
    public int damage;
    public float attacksPerSecond;

    public float DPS()
    {
        return damage * attacksPerSecond;
    }
}`,
 rules:[
  has('ScriptableObject 상속',/class\s+WeaponData\s*:\s*ScriptableObject/,'ScriptableObject를 상속해요.','class WeaponData : ScriptableObject 로 선언하세요.'),
  has('CreateAssetMenu',/\[\s*CreateAssetMenu/,'[CreateAssetMenu]가 붙어 있어요.','클래스 위에 [CreateAssetMenu(fileName = "NewWeapon", menuName = "Game/Weapon")] 를 붙이세요.'),
  has('weaponName 필드',/\bstring\s+weaponName\b/,'weaponName 필드가 있어요.','public string weaponName; 필드를 만드세요.'),
  has('damage 필드',/\bint\s+damage\b/,'damage 필드가 있어요.','public int damage; 필드를 만드세요.'),
  has('attacksPerSecond 필드',/\bfloat\s+attacksPerSecond\b/,'attacksPerSecond 필드가 있어요.','public float attacksPerSecond; 필드를 만드세요.')
 ],
 test:(api,ok)=>{
  if(!api.has('DPS')){ok('DPS 계산',false,'','float DPS() 함수를 만드세요.');return}
  api.set('damage',12);api.set('attacksPerSecond',2.5);
  ok('DPS 계산',Math.abs(api.call('DPS')-30)<1e-6,'DPS = 12 × 2.5 = 30 이에요.',`DPS()가 ${api.call('DPS')} 입니다. damage × attacksPerSecond = 30 이어야 해요.`);
  api.set('damage',10);api.set('attacksPerSecond',0.5);
  ok('값이 바뀌면 결과도 바뀜',Math.abs(api.call('DPS')-5)<1e-6,'필드 값에 따라 DPS가 달라져요.','필드 값을 바꿨는데 DPS가 그대로예요. 필드를 읽어서 계산하세요.');
 },
 hints:['ScriptableObject는 씬에 올리지 않고 프로젝트 에셋으로 존재하는 데이터 컨테이너예요. 여러 오브젝트가 같은 에셋을 참조할 수 있어요.','클래스 선언 바로 위에 [CreateAssetMenu(...)]를 붙이면 우클릭 → Create 메뉴에 나타나요.','필드 세 개와 곱셈만 있으면 돼요.'],
 why:'차이가 데이터뿐이라면 클래스를 늘리는 대신 데이터 에셋을 늘리세요. 무기·적·아이템 같은 정의를 ScriptableObject로 만들면 기획자가 코드 없이 새 항목을 추가하고, 메모리도 공유됩니다.',
 concepts:[['ScriptableObject','씬에 붙지 않는 데이터 전용 에셋. 무기·적·아이템 같은 정의 데이터를 코드와 분리해 보관한다.'],['CreateAssetMenu','ScriptableObject를 에디터 Create 메뉴에서 바로 만들 수 있게 해 주는 어트리뷰트.'],['데이터 주도 설계','로직은 코드에, 변하는 값은 데이터 에셋에 두어 기획 변경이 코드 수정으로 번지지 않게 하는 설계.']]});

Q({id:'g3',cat:'design',stage:1,level:3,title:'ScriptableObject를 건드리면 모든 적이 같이 죽는다',
 story:'슬라임 3마리가 같은 EnemyData 에셋을 참조해요. 그런데 한 마리가 맞아서 체력이 깎이자 다른 슬라임들의 체력도 같이 줄었습니다. 게다가 플레이를 멈춘 뒤에도 Project 창의 EnemyData 에셋에 maxHp가 줄어든 채로 남아 있어요. 각 적이 독립적으로 체력을 갖도록 고쳐 주세요.',
 goals:['Awake: 자신의 hp 필드를 data.maxHp 로 초기화한다','TakeDamage(dmg): 자신의 hp 를 dmg 만큼 줄인다 (0 미만으로는 내려가지 않는다)','data(공유 에셋)의 값은 절대 변경하지 않는다'],
 limits:['data.xxx -= … 또는 data.xxx = … 형태로 에셋을 수정하지 않는다'],
 starter:C`
using UnityEngine;

public class Enemy : MonoBehaviour
{
    public EnemyData data;
    public int hp;

    void Awake()
    {
        hp = data.maxHp;
    }

    public void TakeDamage(int dmg)
    {
        data.maxHp -= dmg;
        hp = data.maxHp;
    }
}`,
 solution:C`
using UnityEngine;

public class Enemy : MonoBehaviour
{
    public EnemyData data;
    public int hp;

    void Awake()
    {
        hp = data.maxHp;
    }

    public void TakeDamage(int dmg)
    {
        hp = Mathf.Max(0, hp - dmg);
    }
}`,
 rules:[
  notIn('에셋 수정 금지','TakeDamage',/\bdata\.\w+\s*(?:[-+*\/]?=)(?!=)/,'공유 에셋을 수정하지 않아요.','data.maxHp 같은 에셋 값을 수정하면 같은 에셋을 쓰는 모든 적이 영향을 받아요. 자기 hp 필드를 수정하세요.')
 ],
 test:(api,ok)=>{
  const data={maxHp:30};api.set('data',data);
  api.call('Awake');
  ok('초기화',api.get('hp')===30,'Awake에서 hp를 에셋의 maxHp로 초기화해요.',`hp가 ${api.get('hp')} 입니다. 30으로 초기화해야 해요.`);
  api.call('TakeDamage',10);
  ok('자기 체력 감소',api.get('hp')===20,'맞으면 자기 hp가 줄어요.',`TakeDamage(10) 뒤 hp가 ${api.get('hp')} 입니다. 20이어야 해요.`);
  ok('에셋 보존',data.maxHp===30,'공유 에셋의 maxHp는 그대로예요.',`공유 에셋의 maxHp가 ${data.maxHp}로 바뀌었어요. 다른 적들도 영향을 받습니다.`);
  api.call('TakeDamage',100);
  ok('0 미만 방지',api.get('hp')===0,'체력은 0 아래로 내려가지 않아요.',`체력이 ${api.get('hp')} 입니다. 0 미만이 되지 않게 하세요.`);
 },
 hints:['여러 적이 "같은 에셋"을 참조한다는 건, 사실상 객체 하나를 함께 쓰고 있다는 뜻이에요. TakeDamage가 무엇을 깎고 있는지 보세요.','ScriptableObject는 하나의 에셋 파일이에요. 여러 적이 같은 에셋을 가리키면 사실상 같은 객체 하나를 공유하는 거예요.','에셋은 "설정값 모음(읽기 전용)"으로 쓰고, 변하는 현재 상태는 각 적의 필드가 갖게 하세요.','TakeDamage에서는 hp만 줄이고 data는 읽기만 하세요.'],
 why:'ScriptableObject에 런타임 상태를 쓰면 공유 때문에 모든 인스턴스에 반영돼요(에디터에서는 플레이 종료 후에도 값이 남기도 합니다). 에셋은 불변 데이터, 현재 상태는 인스턴스에 두는 것이 원칙이에요.',
 concepts:[['공유 에셋의 함정','ScriptableObject는 참조하는 모두가 하나를 공유한다. 런타임에 값을 바꾸면 전부에 영향이 가고 에디터에선 값이 남기도 한다.'],['설정값과 상태의 분리','설정은 에셋(읽기 전용), 현재 상태는 인스턴스 필드에 둔다.']]});

Q({id:'g4',cat:'design',stage:2,level:1,title:'bool 플래그를 상태(enum)로',
 story:'적 AI가 isChasing, isAttacking 같은 bool로 상태를 표현하는데, 둘 다 true가 되는 이상한 순간이 생겨요. 상태를 enum으로 정의하고 거리에 따라 현재 상태를 결정하는 함수를 작성해 주세요.',
 goals:['enum EnemyState { Patrol, Chase, Attack } 을 정의한다','Decide(dist): dist ≤ attackRange 이면 Attack','dist ≤ sightRange 이면 Chase','그 외에는 Patrol'],
 limits:['attackRange = 2, sightRange = 8 (필드로 제공)','공격 범위가 시야보다 우선한다'],
 starter:C`
public float attackRange = 2f;
public float sightRange = 8f;

// TODO: enum EnemyState 를 정의하세요

EnemyState Decide(float dist)
{
    return EnemyState.Patrol;
}`,
 solution:C`
public float attackRange = 2f;
public float sightRange = 8f;

enum EnemyState { Patrol, Chase, Attack }

EnemyState Decide(float dist)
{
    if (dist <= attackRange) return EnemyState.Attack;
    if (dist <= sightRange) return EnemyState.Chase;
    return EnemyState.Patrol;
}`,
 rules:[has('enum 정의',/\benum\s+EnemyState\s*\{[^}]*\bPatrol\b[^}]*\bChase\b[^}]*\bAttack\b[^}]*\}/,'EnemyState enum이 정의되어 있어요.','enum EnemyState { Patrol, Chase, Attack } 를 정의하세요.')],
 test:(api,ok)=>{
  const d=x=>api.call('Decide',x);
  ok('순찰',d(20)==='Patrol','멀면 Patrol이에요.',`거리 20에서 ${d(20)} 입니다. Patrol이어야 해요.`);
  ok('추격',d(5)==='Chase'&&d(8)==='Chase','시야 안이면 Chase예요.',`거리 5에서 ${d(5)} 입니다. Chase이어야 해요.`);
  ok('공격',d(1)==='Attack'&&d(2)==='Attack','공격 범위 안이면 Attack이에요 (경계 포함).',`거리 1에서 ${d(1)}, 거리 2에서 ${d(2)} 입니다. Attack이어야 해요.`);
 },
 hints:['여러 bool이 동시에 켜질 수 있다는 것이 문제예요. enum은 한 번에 값 하나만 가질 수 있어요.','좁은 범위(공격)부터 먼저 검사해야 해요. 공격 범위는 시야 안에 포함되니까요.','if를 위에서부터: 공격 → 추격 → 그 외는 순찰.'],
 why:'상태를 bool 여러 개로 흩어 두면 불가능한 조합이 생기고 점점 관리가 어려워져요. enum 하나로 모델링하면 "지금 어떤 상태인가"가 항상 하나로 정해집니다.',
 concepts:[['enum 상태 모델링','서로 배타적인 상태를 enum 하나로 표현해 동시에 켜지는 모순 조합을 원천 차단한다.'],['조건 검사 순서','범위가 겹치는 조건은 좁은(우선순위 높은) 조건부터 검사한다.']]});

Q({id:'g5',cat:'design',stage:2,level:2,title:'순찰하다가 발견하면 추격하는 AI',
 story:'파란 적이 60~420 구간을 순찰해요. 주황색 목표가 시야(120) 안에 들어오면 추격하다가, 시야에서 벗어나면 다시 순찰해야 합니다. 상태를 enum으로 두고 순찰 속도 80, 추격 속도 150으로 움직이게 해 주세요.',
 goals:['목표가 시야(sightRange) 밖이면 Patrol: 좌우 순찰 (속도 80)','시야 안이면 Chase: 목표를 향해 이동 (속도 150)','현재 상태를 enum 변수에 저장한다'],
 limits:['enum 으로 상태를 표현한다','이동량은 속도 × Time.deltaTime 으로 계산한다'],
 api:'Vector2.Distance(a, b), Vector2.MoveTowards(from, to, maxDelta), target.position (제공)',
 starter:C`
public float patrolSpeed = 80f;
public float chaseSpeed = 150f;
public float sightRange = 120f;
public float minX = 60f;
public float maxX = 420f;
float dir = 1f;

void Update()
{
    Vector3 pos = transform.position;
    pos.x += patrolSpeed * dir * Time.deltaTime;
    if (pos.x >= maxX) { pos.x = maxX; dir = -1f; }
    else if (pos.x <= minX) { pos.x = minX; dir = 1f; }
    transform.position = pos;
    // TODO: 상태(enum)를 만들고, 목표가 시야 안에 들어오면 추격하게 하세요
}`,
 solution:C`
enum State { Patrol, Chase }

public float patrolSpeed = 80f;
public float chaseSpeed = 150f;
public float sightRange = 120f;
public float minX = 60f;
public float maxX = 420f;
float dir = 1f;
State state = State.Patrol;

void Update()
{
    float dist = Vector2.Distance(transform.position, target.position);
    state = dist < sightRange ? State.Chase : State.Patrol;

    if (state == State.Chase)
    {
        transform.position = Vector2.MoveTowards(transform.position, target.position, chaseSpeed * Time.deltaTime);
    }
    else
    {
        Vector3 pos = transform.position;
        pos.x += patrolSpeed * dir * Time.deltaTime;
        if (pos.x >= maxX) { pos.x = maxX; dir = -1f; }
        else if (pos.x <= minX) { pos.x = minX; dir = 1f; }
        transform.position = pos;
    }
}`,
 world:{start:{x:60,y:135},target:{cx:240,cy:135,r:90,w:0.8}},runs:[{fps:60,seconds:10}],show:10,
 rules:[has('enum 상태',/\benum\s+\w+\s*\{/,'상태를 enum으로 정의했어요.','상태를 enum으로 정의하세요. (예: enum State { Patrol, Chase })'),
  has('Time.deltaTime',/Time\.deltaTime/,'프레임 시간을 곱해 이동해요.','이동량에 Time.deltaTime을 곱하세요.')],
 check:rs=>{const r=rs[0],f=r.frames,dt=1/r.fps;
  const dist=i=>Math.hypot(f[i][1]-f[i][3],f[i][2]-f[i][4]);
  const spd=i=>Math.hypot(f[i][1]-f[i-1][1],f[i][2]-f[i-1][2])/dt;
  let ps=[],cs=[],minD=1e9;
  for(let i=1;i<f.length;i++){const d=dist(i),dp=dist(i-1);minD=Math.min(minD,d);
   if(d>140&&dp>140)ps.push(spd(i));
   if(d>40&&d<100&&dp>40&&dp<100)cs.push(spd(i))}
  const avg=a=>a.reduce((s,x)=>s+x,0)/a.length;
  const pa=ps.length?avg(ps):0,ca=cs.length?avg(cs):0;
  return {items:[
   it(ps.length>=10&&pa>=65&&pa<=95,'순찰 속도',`목표가 멀 때 평균 ${pa.toFixed(0)}px/s 로 순찰해요.`,ps.length<10?'목표가 멀리 있는 구간이 없었어요.':`목표가 멀 때 속도가 ${pa.toFixed(0)}px/s 입니다. 순찰 속도는 약 80이어야 해요.`),
   it(minD<30,'추격 성공',`목표에 ${minD.toFixed(0)}px까지 접근했어요.`,`목표에 가장 가까워진 거리가 ${minD.toFixed(0)}px 입니다. 시야 안에 들어오면 목표를 향해 이동해야 해요.`),
   it(cs.length>=4&&ca>=125&&ca<=175,'추격 속도',`추격 중 평균 ${ca.toFixed(0)}px/s 로 달려요.`,cs.length<4?'추격이 시작되지 않았어요. 목표가 시야(120) 안에 들어오면 chaseSpeed로 접근하세요.':`추격 속도가 ${ca.toFixed(0)}px/s 입니다. 약 150이어야 해요.`)]}},
 hints:['지금 코드는 상태 없이 항상 순찰만 해요. 먼저 "지금 어떤 상태인가"를 enum 변수로 정하세요.','매 프레임 목표와의 거리를 구하고, 시야보다 가까우면 Chase, 아니면 Patrol로 바꾸세요.','Chase일 때는 Vector2.MoveTowards로 목표를 향해 chaseSpeed × Time.deltaTime 만큼 접근하세요.'],
 why:'상태 기계는 "지금 무엇을 하는 중인가"를 하나의 값으로 두고 상태마다 동작을 분리하는 설계예요. 전환 조건만 바꾸면 행동이 바뀌어서 AI를 확장하기 쉽습니다.',
 concepts:[['유한 상태 기계(FSM)','객체가 가질 수 있는 상태를 유한개로 정하고, 현재 상태에 따라 동작과 전환 조건을 정의하는 설계 패턴.'],['Vector2.MoveTowards','현재 위치에서 목표를 향해 최대 maxDelta만큼만 이동한다. 일정한 속도의 추격에 쓴다.']]});

Q({id:'g6',cat:'design',stage:2,level:3,title:'상태 전환 규칙표',
 story:'플레이어 상태 사이의 전환에는 규칙이 있어요. 죽은 상태에서는 아무 데도 갈 수 없고, 공중에서는 점프나 공격을 시작할 수 없습니다. CanTransition(from, to)로 허용된 전환만 true를 돌려주는 함수를 작성해 주세요.',
 goals:['Idle → Run, Jump, Attack, Dead','Run → Idle, Jump, Attack, Dead','Jump → Fall, Dead','Fall → Idle, Dead','Attack → Idle, Dead','Dead → (아무것도 불가)','같은 상태로의 전환은 허용하지 않는다 (false)'],
 limits:['enum PS { Idle, Run, Jump, Fall, Attack, Dead } 가 제공된다'],
 starter:C`
enum PS { Idle, Run, Jump, Fall, Attack, Dead }

bool CanTransition(PS from, PS to)
{
    return true;
}`,
 solution:C`
enum PS { Idle, Run, Jump, Fall, Attack, Dead }

bool CanTransition(PS from, PS to)
{
    if (from == to) return false;
    switch (from)
    {
        case PS.Idle:
        case PS.Run:
            return to == PS.Idle || to == PS.Run || to == PS.Jump || to == PS.Attack || to == PS.Dead;
        case PS.Jump:
            return to == PS.Fall || to == PS.Dead;
        case PS.Fall:
            return to == PS.Idle || to == PS.Dead;
        case PS.Attack:
            return to == PS.Idle || to == PS.Dead;
        default:
            return false;
    }
}`,
 rules:[],
 test:(api,ok)=>{
  const S=['Idle','Run','Jump','Fall','Attack','Dead'];
  const T={Idle:['Run','Jump','Attack','Dead'],Run:['Idle','Jump','Attack','Dead'],Jump:['Fall','Dead'],Fall:['Idle','Dead'],Attack:['Idle','Dead'],Dead:[]};
  const bad=[];
  for(const a of S)for(const b of S){const exp=T[a].indexOf(b)>=0;const got=!!api.call('CanTransition',a,b);if(exp!==got)bad.push(`${a}→${b}(${exp?'허용':'불가'}이어야 함)`)}
  ok('전환 규칙표',bad.length===0,'36가지 전환이 모두 규칙표와 일치해요.',`${bad.length}개 전환이 규칙과 달라요: ${bad.slice(0,4).join(', ')}${bad.length>4?' …':''}`);
  ok('죽으면 끝',S.every(s=>!api.call('CanTransition','Dead',s)),'Dead에서는 어디로도 갈 수 없어요.','Dead 상태에서 다른 상태로 갈 수 없어야 해요.');
  ok('공중에서 공격 불가',!api.call('CanTransition','Jump','Attack')&&!api.call('CanTransition','Fall','Jump'),'공중에서는 점프/공격을 시작할 수 없어요.','Jump/Fall 상태에서 Attack, Jump로 갈 수 없어야 해요.');
 },
 hints:['"어디서 출발하는가(from)"로 먼저 switch를 나누면 규칙표를 그대로 코드로 옮길 수 있어요.','Idle과 Run은 같은 곳으로 갈 수 있으니 case를 겹쳐 쓰면 편해요.','맨 앞에서 같은 상태로의 전환(from == to)을 먼저 걸러 내고, 어떤 case에도 해당하지 않으면 false를 돌려주세요.'],
 why:'전환 규칙을 한곳(CanTransition)에 모으면 "죽은 뒤에 점프" 같은 버그를 구조적으로 막을 수 있어요. 규칙표를 코드로 옮기는 습관은 상태가 늘어나도 유지보수를 쉽게 합니다.',
 concepts:[['전환 규칙 중앙화','상태 전환 가능 여부를 한 함수에 모아 규칙을 한눈에 보고 검증할 수 있게 한다.'],['switch의 fall-through case','case를 연속으로 쓰면 여러 상태가 같은 처리를 공유한다.']]});

Q({id:'g7',cat:'design',stage:3,level:1,title:'UI를 직접 부르지 말고 이벤트로 알리기',
 story:'Player.TakeDamage가 체력바 UI를 직접 호출하고 있어요. 그러면 Player가 UI에 의존하게 되고, UI를 지우면 Player가 에러를 냅니다. 대신 "체력이 바뀌었다"는 이벤트만 발생시키고, 누가 듣든 상관하지 않도록 바꿔 주세요.',
 goals:['public event Action<int> OnHpChanged 이벤트를 선언한다','TakeDamage(dmg): hp를 dmg만큼 줄이고 OnHpChanged 이벤트를 발생시켜 새 hp를 전달한다','구독자가 없어도 에러가 나지 않는다 (?.Invoke)'],
 limits:['TakeDamage 안에서 ui 를 직접 호출하지 않는다'],
 api:'public event Action<int> Name;  Name?.Invoke(값)',
 starter:C`
using System;
using UnityEngine;

public class Player : MonoBehaviour
{
    public HpBar ui;
    public int hp = 100;

    public void TakeDamage(int dmg)
    {
        hp -= dmg;
        ui.SetHp(hp);
    }
}`,
 solution:C`
using System;
using UnityEngine;

public class Player : MonoBehaviour
{
    public event Action<int> OnHpChanged;
    public int hp = 100;

    public void TakeDamage(int dmg)
    {
        hp -= dmg;
        OnHpChanged?.Invoke(hp);
    }
}`,
 rules:[
  has('event 선언',/\bevent\s+(?:System\.)?Action<\s*int\s*>\s+OnHpChanged\b/,'OnHpChanged 이벤트가 선언되어 있어요.','public event Action<int> OnHpChanged; 로 이벤트를 선언하세요.'),
  notIn('UI 직접 호출 금지','TakeDamage',/\bui\b/,'TakeDamage가 UI를 직접 부르지 않아요.','TakeDamage에서 ui를 호출하지 마세요. 이벤트만 발생시키면 돼요.'),
  inFn('안전한 발생','TakeDamage',/OnHpChanged\s*\?\.\s*Invoke\s*\(\s*hp\s*\)|OnHpChanged\s*!=\s*null/,'구독자가 없어도 안전하게 이벤트를 발생시켜요.','OnHpChanged?.Invoke(hp); 로 발생시키세요. 구독자가 없으면 null이라 ?. 가 필요해요.')
 ],
 test:(api,ok)=>{
  const got=[];
  api.set('hp',100);
  let threw=false;try{api.call('TakeDamage',10)}catch(e){threw=true}
  ok('구독자 없어도 안전',!threw&&api.get('hp')===90,'구독자가 없어도 에러 없이 체력이 줄어요.','구독자가 없을 때 에러가 나요. ?.Invoke 로 null일 때를 처리하세요.');
  api.set('OnHpChanged',v=>got.push(v));
  api.call('TakeDamage',25);
  ok('이벤트 발생',got.length===1&&got[0]===65,'체력이 바뀔 때 새 값(65)을 이벤트로 알려요.',`이벤트로 받은 값: [${got.join(', ')}]. TakeDamage 뒤에 새 hp(65)를 한 번 전달해야 해요.`);
 },
 hints:['Player는 "체력이 바뀌었다"는 사실만 방송하고, 누가 듣는지는 몰라도 돼요. 이것이 이벤트(옵저버) 패턴이에요.','Action<int>는 int 하나를 받는 메서드를 담는 타입이에요.','구독자가 없으면 이벤트는 null이라서 바로 Invoke하면 NullReference가 나요. ?. 를 쓰세요.'],
 why:'이벤트로 연결하면 Player는 UI를 모르고, UI는 Player를 구독하기만 하면 돼서 한쪽을 바꾸거나 지워도 다른 쪽이 안 깨져요. 사운드, 업적, 이펙트 같은 구독자를 코드 수정 없이 늘릴 수도 있습니다.',
 concepts:[['이벤트(옵저버 패턴)','발행자가 변화를 방송하고 구독자가 알아서 반응한다. 발행자는 구독자를 알 필요가 없어 결합도가 낮다.'],['?.Invoke','null 조건 연산자. 구독자가 없어 이벤트가 null일 때 호출을 건너뛴다.']]});

Q({id:'g8',cat:'design',stage:3,level:2,title:'구독은 해제까지 한 쌍',
 story:'체력바가 Player의 이벤트를 구독하는데, 체력바가 파괴된 뒤에도 Player가 계속 호출을 시도해서 MissingReferenceException이 나요. 활성화될 때 구독하고 비활성화/파괴될 때 반드시 해제하도록 OnEnable과 OnDisable을 작성해 주세요.',
 goals:['OnEnable: player.OnHpChanged 에 Refresh 를 구독한다 (+=)','OnDisable: 같은 이벤트에서 같은 Refresh 를 해제한다 (-=)','Refresh(int hp): 슬라이더 값을 hp 로 설정한다'],
 limits:['구독(+=)과 해제(-=)는 같은 이벤트, 같은 메서드여야 한다'],
 starter:C`
using UnityEngine;
using UnityEngine.UI;

public class HpBar : MonoBehaviour
{
    public Player player;
    public Slider slider;

    void OnEnable()
    {
        player.OnHpChanged += Refresh;
    }

    void Refresh(int hp)
    {
        slider.value = hp;
    }
}`,
 solution:C`
using UnityEngine;
using UnityEngine.UI;

public class HpBar : MonoBehaviour
{
    public Player player;
    public Slider slider;

    void OnEnable()
    {
        player.OnHpChanged += Refresh;
    }

    void OnDisable()
    {
        player.OnHpChanged -= Refresh;
    }

    void Refresh(int hp)
    {
        slider.value = hp;
    }
}`,
 rules:[
  inFn('OnEnable에서 구독','OnEnable',/player\.OnHpChanged\s*\+=\s*Refresh\s*;/,'OnEnable에서 구독해요.','OnEnable에서 player.OnHpChanged += Refresh; 로 구독하세요.'),
  inFn('OnDisable에서 해제','OnDisable',/player\.OnHpChanged\s*-=\s*Refresh\s*;/,'OnDisable에서 같은 메서드를 해제해요.','OnDisable에서 player.OnHpChanged -= Refresh; 로 해제하세요. 안 하면 파괴된 객체가 계속 호출돼요.'),
  inFn('Refresh 값 반영','Refresh',/slider\.value\s*=\s*hp/,'Refresh가 슬라이더를 갱신해요.','Refresh에서 slider.value = hp; 로 값을 반영하세요.')
 ],
 hints:['이벤트를 구독하면 발행자가 구독자의 참조를 들고 있어요. 구독자가 파괴되어도 참조가 남아 호출이 시도돼요.','OnEnable과 OnDisable은 짝이에요. 켜질 때 구독했으면 꺼질 때 해제하세요.','해제는 구독했던 것과 똑같은 이벤트와 똑같은 메서드로 써야 해요.'],
 why:'구독 해제를 빼먹는 건 이벤트 사용에서 가장 흔한 버그(파괴된 객체 호출, 메모리 누수, 중복 구독)의 원인입니다. OnEnable/OnDisable 쌍으로 쓰는 습관이 안전해요.',
 concepts:[['구독/해제 쌍','+=로 구독했으면 -=로 반드시 해제한다. 해제를 빼먹으면 파괴된 객체가 호출되거나 메모리가 누수된다.'],['OnEnable / OnDisable','오브젝트가 활성/비활성화될 때 호출된다. 이벤트 구독·해제를 짝으로 두기에 적합하다.']]});

Q({id:'g9',cat:'design',stage:3,level:3,title:'누구든 맞으면 반응하게: 인터페이스',
 story:'Bullet이 부딪힌 상대가 Enemy인지 Barrel인지 Player인지 일일이 GetComponent로 확인하고 있어요. 새로운 피격 대상이 생길 때마다 Bullet을 고쳐야 합니다. 이미 만들어진 IDamageable 인터페이스(void TakeDamage(int amount))를 이용해 Bullet이 상대의 종류를 몰라도 되도록 바꿔 주세요.',
 goals:['OnHit(other): other 에서 IDamageable 컴포넌트를 가져온다','가져온 것이 있으면 TakeDamage(damage) 를 호출한다','없으면 아무 일도 하지 않는다 (에러 없음)'],
 limits:['Enemy, Barrel, Player 같은 구체 타입은 코드에 등장하지 않는다'],
 api:'other.GetComponent<IDamageable>()',
 starter:C`
using UnityEngine;

public class Bullet : MonoBehaviour
{
    public int damage = 10;

    public void OnHit(GameObject other)
    {
        Enemy enemy = other.GetComponent<Enemy>();
        if (enemy != null) enemy.TakeDamage(damage);
    }
}`,
 solution:C`
using UnityEngine;

public class Bullet : MonoBehaviour
{
    public int damage = 10;

    public void OnHit(GameObject other)
    {
        IDamageable target = other.GetComponent<IDamageable>();
        if (target != null) target.TakeDamage(damage);
    }
}`,
 rules:[
  inFn('인터페이스 사용','OnHit',/GetComponent\s*<\s*IDamageable\s*>/,'IDamageable로 대상을 찾아요.','other.GetComponent<IDamageable>() 로 가져오세요.'),
  notIn('구체 타입 금지','OnHit',/\b(?:Enemy|Barrel|Player)\b/,'구체 타입이 등장하지 않아요.','OnHit에서 Enemy, Barrel 같은 구체 타입을 쓰지 마세요.')
 ],
 test:(api,ok)=>{
  const hits=[];
  const comp={TakeDamage(n){hits.push(n)}};
  const withComp={GetComponent(n){return n==='IDamageable'?comp:null}};
  const without={GetComponent(n){return null}};
  let threw=false;
  try{api.call('OnHit',withComp)}catch(e){threw=true}
  ok('피해 전달',!threw&&hits.length===1&&hits[0]===10,'IDamageable이 있으면 TakeDamage(10)을 호출해요.',`호출된 피해: [${hits.join(', ')}]. 10 한 번이어야 해요.`);
  threw=false;
  try{api.call('OnHit',without)}catch(e){threw=true}
  ok('대상이 없어도 안전',!threw&&hits.length===1,'IDamageable이 없으면 아무 일도 하지 않아요.','IDamageable이 없는 상대에서 에러가 나거나 피해가 전달됐어요. null이면 건너뛰세요.');
 },
 hints:['Bullet에게 필요한 건 "상대가 누구인가"가 아니라 "상대가 피해를 받을 수 있는가"예요.','인터페이스 IDamageable을 구현한 컴포넌트를 GetComponent<IDamageable>()로 가져올 수 있어요.','가져온 결과가 null이 아닐 때만 TakeDamage(damage)를 호출하세요.'],
 why:'구체 타입 대신 인터페이스(역할)에 의존하면 새 적, 파괴 가능한 상자, 보스를 추가해도 Bullet을 고칠 필요가 없어요. "무엇인가"가 아니라 "무엇을 할 수 있는가"에 의존하는 것이 낮은 결합도의 핵심입니다.',
 concepts:[['인터페이스 의존','구체 클래스 대신 역할(인터페이스)에 의존해 새 구현체를 추가해도 사용하는 쪽을 수정하지 않게 한다.'],['GetComponent<인터페이스>','인터페이스를 구현한 컴포넌트도 GetComponent로 가져올 수 있다.']]});
