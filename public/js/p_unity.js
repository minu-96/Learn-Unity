/* ===== Unity 핵심 ===== */
Q({id:'s1',cat:'unity',stage:1,level:1,title:'프레임이 달라도 같은 속도로 이동하기',
 story:'오브젝트가 오른쪽으로 초당 80 유닛의 속도로 움직여야 해요. 지금 코드는 프레임마다 고정값(1.5)만큼 움직여서, 성능이 좋은 PC(144fps)와 낮은 기기(30fps)에서 결과가 크게 달라집니다. 어떤 기기에서든 3초 뒤에 같은 곳에 도착하게 고쳐 주세요.',
 goals:['30fps와 144fps 모두 3초 뒤 노란 목표 지점(x≈280)에 도착한다','속도는 speed 필드(초당 80)로 조절할 수 있다'],
 limits:['프레임당 이동량(1.5 같은 숫자)을 직접 쓰지 않는다','transform.position.x 에 직접 대입하지 않는다 (CS1612) — 지역 변수로 복사 후 다시 대입'],
 api:'transform.position(Vector3), Time.deltaTime',
 starter:C`
public float speed = 80f;

void Update()
{
    // 프레임마다 1.5씩 움직이는 중입니다. 초당 속도로 바꿔 보세요.
    Vector3 pos = transform.position;
    pos.x += 1.5f;
    transform.position = pos;
}`,
 solution:C`
public float speed = 80f;

void Update()
{
    Vector3 pos = transform.position;
    pos.x += speed * Time.deltaTime;
    transform.position = pos;
}`,
 world:{start:{x:40,y:135},goal:{x:280,y:135,r:10}},runs:[{fps:30,seconds:3},{fps:144,seconds:3}],show:3,
 rules:[has('Time.deltaTime 사용',/Time\.deltaTime/,'이동량에 Time.deltaTime을 곱했어요.','이동량에 Time.deltaTime(직전 프레임과의 시간 간격)을 곱해야 프레임레이트와 무관해져요.'),
  inFn('speed 필드 사용','Update',/\bspeed\b/,'speed 값을 사용해요.','하드코딩한 숫자 대신 speed 필드를 쓰세요. Inspector에서 속도를 조절할 수 있어야 해요.')],
 check:rs=>{const a=last(rs[0]),b=last(rs[1]);const same=Math.abs(a[1]-b[1])<4,hit=Math.abs(b[1]-280)<12;
  return {items:[
   it(same,'프레임레이트 무관',`30fps x=${a[1].toFixed(1)}, 144fps x=${b[1].toFixed(1)} 로 거의 같아요.`,`30fps x=${a[1].toFixed(1)}, 144fps x=${b[1].toFixed(1)} 로 달라요. 프레임당 이동량이 아니라 속도 × 프레임 시간(Time.deltaTime)으로 계산해야 해요.`),
   it(hit,'목표 도착',`3초 뒤 목표 지점(x≈280)에 도착했어요 (x=${b[1].toFixed(1)}).`,`3초 뒤 x=${b[1].toFixed(1)} 로 목표(280)에 도착하지 못했어요. 속도가 초당 80 유닛인지 확인하세요.`)]}},
 hints:['Update는 프레임마다 호출돼요. 144fps에서는 1초에 144번, 30fps에서는 30번이죠. 그래서 "한 번에 1.5"는 기기마다 속도가 달라요.','Time.deltaTime은 직전 프레임에서 지금까지 걸린 시간(초)이에요. 144fps면 약 0.007, 30fps면 약 0.033.','초당 속도 × 프레임 시간 = 이번 프레임의 이동량. speed * Time.deltaTime'],
 why:'프레임당 고정 이동량은 프레임이 많은 기기에서 더 빨라집니다. 초당 속도에 Time.deltaTime을 곱하면 "이번 프레임에 흐른 시간만큼" 움직이므로 프레임레이트와 관계없이 같은 거리를 가요.',
 concepts:[['Time.deltaTime','직전 프레임과 이번 프레임 사이의 시간(초). 속도 × deltaTime으로 이동하면 프레임레이트와 무관한 움직임이 된다.'],['프레임 독립 이동','프레임당 고정 이동량 대신 초당 속도에 deltaTime을 곱해 기기 성능과 무관하게 같은 결과를 내는 것.']]});

Q({id:'u2',cat:'unity',stage:1,level:2,title:'GameManager가 아직 준비되지 않았다고요?',
 story:'Player.Awake에서 GameManager.Instance.RegisterPlayer(this)를 호출했더니 가끔 NullReferenceException이 납니다. GameManager는 자기 Awake에서 Instance를 설정하는데, 서로 다른 오브젝트의 Awake 순서는 정해져 있지 않기 때문이에요. 안전한 위치로 옮겨 주세요.',
 goals:['자기 자신에게 붙은 컴포넌트(Rigidbody2D)를 가져오는 일은 Awake에서 한다','다른 오브젝트(GameManager.Instance)에 접근하는 일은 Start에서 한다'],
 limits:['Awake와 OnEnable에서는 GameManager.Instance를 쓰지 않는다','RegisterPlayer(this) 호출은 정확히 그대로 유지한다'],
 starter:C`
using UnityEngine;

public class Player : MonoBehaviour
{
    private Rigidbody2D rb;

    void Awake()
    {
        // 지금은 GameManager가 아직 준비되기 전일 수 있어서 NullReferenceException이 납니다
        GameManager.Instance.RegisterPlayer(this);
        rb = GetComponent<Rigidbody2D>();
    }
}`,
 solution:C`
using UnityEngine;

public class Player : MonoBehaviour
{
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Start()
    {
        GameManager.Instance.RegisterPlayer(this);
    }
}`,
 rules:[
  inFn('Awake에서 자기 컴포넌트 가져오기','Awake',/\brb\s*=\s*GetComponent\s*<\s*Rigidbody2D\s*>\s*\(\s*\)|TryGetComponent\s*(?:<\s*Rigidbody2D\s*>)?\s*\(\s*out\s+rb\b/,'자기 컴포넌트는 Awake에서 가져와요.','자기 오브젝트의 Rigidbody2D는 Awake에서 rb = GetComponent<Rigidbody2D>(); 로 가져오세요.'),
  notIn('Awake에서 Instance 금지','Awake',/\bGameManager\s*\.\s*Instance\b/,'Awake에서 다른 오브젝트에 접근하지 않아요.','Awake는 오브젝트마다 순서가 정해져 있지 않아요. 다른 오브젝트의 Instance는 모든 Awake가 끝난 뒤인 Start에서 쓰세요.'),
  notIn('OnEnable에서 Instance 금지','OnEnable',/\bGameManager\s*\.\s*Instance\b/,'OnEnable에서도 접근하지 않아요.','OnEnable은 Awake 직후에 호출되므로 마찬가지로 안전하지 않아요.'),
  inFn('Start에서 등록','Start',/\bGameManager\s*\.\s*Instance\s*\.\s*RegisterPlayer\s*\(\s*this\s*\)\s*;/,'Start에서 GameManager에 등록해요.','Start 안에서 GameManager.Instance.RegisterPlayer(this); 를 호출하세요.')
 ],
 hints:['Unity는 씬의 모든 오브젝트의 Awake를 먼저 실행한 뒤, 첫 Update 전에 Start를 실행해요.','Awake: 내 것(내 컴포넌트·내 변수) 준비. Start: 남의 것(다른 오브젝트·싱글톤) 사용.','Start 메서드를 새로 만들어 등록 코드를 옮기세요.'],
 why:'서로 다른 오브젝트 사이의 Awake 호출 순서는 보장되지 않아요. 그래서 "자기 초기화는 Awake, 다른 오브젝트 접근은 Start"가 Unity의 기본 약속입니다. 순서가 중요하면 Script Execution Order 설정도 있지만 구조로 푸는 편이 더 안전해요.',
 concepts:[['Awake와 Start의 차이','Awake는 오브젝트 생성 직후 자기 초기화에, Start는 첫 Update 직전 모든 Awake가 끝난 뒤 다른 오브젝트에 접근하는 초기화에 쓴다.'],['싱글톤 Instance 접근 시점','다른 오브젝트가 Awake에서 설정하는 Instance는 Awake 단계에서 접근하면 아직 null일 수 있다.']]});

Q({id:'u7',cat:'unity',stage:1,level:3,title:'일시정지 중에도 흐르는 메뉴 연출',
 story:'일시정지하면 Time.timeScale = 0 으로 게임을 멈추는데, 일시정지 메뉴가 나타나는 페이드 연출도 같이 멈춰 버려서 메뉴가 투명한 채로 남아요. timeScale의 영향을 받지 않는 시간으로 메뉴 알파값을 올려 주세요.',
 goals:['Pause(): 시간을 멈추고(timeScale 0) alpha를 0으로 초기화한다 (이미 구현되어 있어요)','Resume(): 시간을 정상 속도(1)로 되돌린다','Update(): 일시정지 중에도 alpha가 fadeSpeed 속도로 0 → 1까지 올라간다 (1을 넘지 않는다)'],
 limits:['Time.deltaTime 은 timeScale 이 0이면 0이 되므로 쓰지 않는다'],
 api:'Time.timeScale, Time.deltaTime, Time.unscaledDeltaTime',
 starter:C`
public float fadeSpeed = 2f;
float alpha = 0f;

public void Pause()
{
    Time.timeScale = 0f;
    alpha = 0f;
}

public void Resume()
{
    // TODO
}

void Update()
{
    // 메뉴가 서서히 나타나야 합니다 (alpha 0 → 1)
    alpha += fadeSpeed * Time.deltaTime;
    alpha = Mathf.Min(alpha, 1f);
}`,
 solution:C`
public float fadeSpeed = 2f;
float alpha = 0f;

public void Pause()
{
    Time.timeScale = 0f;
    alpha = 0f;
}

public void Resume()
{
    Time.timeScale = 1f;
}

void Update()
{
    alpha += fadeSpeed * Time.unscaledDeltaTime;
    alpha = Mathf.Min(alpha, 1f);
}`,
 rules:[
  inFn('Resume이 시간을 되돌림','Resume',/Time\.timeScale\s*=\s*1(?:\.0*)?f?\s*;/,'Resume에서 timeScale을 1로 되돌려요.','Resume에서 Time.timeScale = 1f; 로 시간을 다시 흐르게 하세요.'),
  inFn('unscaledDeltaTime 사용','Update',/Time\.unscaledDeltaTime/,'timeScale의 영향을 받지 않는 시간을 써요.','일시정지 중에도 흘러야 하는 UI 연출에는 Time.unscaledDeltaTime을 쓰세요.'),
  notIn('Update에서 deltaTime 금지','Update',/Time\.deltaTime/,'timeScale 영향을 받는 deltaTime을 쓰지 않았어요.','Time.deltaTime은 timeScale이 0이면 0이 돼요. Update에서 쓰지 마세요.')
 ],
 test:(api,ok)=>{
  const T=api.env.Time;
  T.deltaTime=0;T.unscaledDeltaTime=0.1;
  api.call('Pause');
  ok('Pause',T.timeScale===0,'Pause가 시간을 멈춰요 (timeScale 0).','Pause 후 Time.timeScale이 0이어야 해요.');
  for(let i=0;i<5;i++)api.call('Update');
  const a=api.get('alpha');
  ok('일시정지 중 페이드',Math.abs(a-1)<1e-6,'timeScale이 0이어도 0.5초 동안 alpha가 1까지 올라갔어요.',`일시정지 중에 alpha가 ${a.toFixed(2)} 입니다. fadeSpeed(2) × 0.5초 = 1이 되어야 해요. deltaTime은 일시정지 중 0이에요.`);
  for(let i=0;i<10;i++)api.call('Update');
  ok('alpha 상한',api.get('alpha')<=1,'alpha가 1을 넘지 않아요.','alpha가 1을 넘었어요. Mathf.Min이나 Clamp01로 제한하세요.');
  api.call('Resume');
  ok('Resume',T.timeScale===1,'Resume이 시간을 되돌려요.','Resume 후 Time.timeScale이 1이어야 해요.');
 },
 hints:['Time.timeScale = 0 이면 Time.deltaTime도 0이에요. 그래서 deltaTime으로 올리던 alpha가 멈춥니다.','Time.unscaledDeltaTime은 timeScale과 상관없이 실제로 흐른 시간이에요.','Resume은 timeScale을 1로 되돌리는 한 줄이면 돼요.'],
 why:'timeScale은 게임 속 시간의 배속이에요. 슬로모션·일시정지에서 게임 로직은 멈춰야 하지만 메뉴 연출, 페이드, 입력 처리는 실제 시간으로 흘러야 하니 unscaledDeltaTime을 씁니다.',
 concepts:[['Time.timeScale','게임 시간의 배속. 0이면 deltaTime 기반 로직이 모두 멈춘다.'],['Time.unscaledDeltaTime','timeScale의 영향을 받지 않는 프레임 간격. 일시정지 중에도 움직여야 하는 UI 연출에 쓴다.']]});

Q({id:'u8',cat:'unity',stage:2,level:1,title:'누른 순간·누르는 중·뗀 순간',
 story:'점프는 스페이스를 누른 그 프레임에 딱 한 번만 일어나야 하고, 누르고 있는 동안에는 힘이 충전되며, 키를 뗀 순간 충전한 값이 발사돼야 해요. 지금 코드는 GetKey 하나만 써서 키를 누르고 있는 내내 점프가 폭주합니다.',
 goals:['스페이스를 누른 프레임에만 jumpCount를 1 올린다','스페이스를 누르고 있는 동안 매 프레임 charge에 Time.deltaTime을 더한다','스페이스를 뗀 프레임에 charge 값을 fired에 저장하고 charge를 0으로 되돌린다'],
 limits:['세 가지 입력을 각각 GetKeyDown, GetKey, GetKeyUp 으로 구분해서 쓴다'],
 api:'Input.GetKeyDown / GetKey / GetKeyUp (KeyCode.Space), Time.deltaTime',
 starter:C`
public int jumpCount;
public float charge;
public float fired;

void Update()
{
    // 지금은 GetKey만 써서 누르고 있는 내내 점프가 폭주하고, 뗄 때는 아무 일도 없습니다.
    if (Input.GetKey(KeyCode.Space))
    {
        jumpCount++;
    }
}`,
 solution:C`
public int jumpCount;
public float charge;
public float fired;

void Update()
{
    if (Input.GetKeyDown(KeyCode.Space))
    {
        jumpCount++;
    }
    if (Input.GetKey(KeyCode.Space))
    {
        charge += Time.deltaTime;
    }
    if (Input.GetKeyUp(KeyCode.Space))
    {
        fired = charge;
        charge = 0f;
    }
}`,
 rules:[
  has('GetKeyDown 사용',/Input\.GetKeyDown\s*\(/,'누른 순간은 GetKeyDown으로 감지해요.','"누른 프레임 한 번"은 Input.GetKeyDown 으로 감지합니다.'),
  has('GetKey 사용',/Input\.GetKey\s*\(/,'누르는 동안은 GetKey로 감지해요.','"누르고 있는 동안"은 Input.GetKey 로 감지합니다.'),
  has('GetKeyUp 사용',/Input\.GetKeyUp\s*\(/,'뗀 순간은 GetKeyUp으로 감지해요.','"뗀 프레임 한 번"은 Input.GetKeyUp 으로 감지합니다.')
 ],
 test:(api,ok)=>{
  const I=api.env.Input,T=api.env.Time;
  T.deltaTime=0.1;
  const frames=[{d:1,h:1,u:0},{d:0,h:1,u:0},{d:0,h:1,u:0},{d:0,h:0,u:1},{d:0,h:0,u:0}];
  let f=frames[0];
  I.GetKeyDown=k=>k==='Space'&&!!f.d;I.GetKey=k=>k==='Space'&&!!f.h;I.GetKeyUp=k=>k==='Space'&&!!f.u;
  for(f of frames)api.call('Update');
  const j=api.get('jumpCount'),fi=api.get('fired'),ch=api.get('charge');
  ok('점프는 한 번',j===1,'누르고 있는 3프레임 동안에도 점프는 1번만 일어났어요.',`jumpCount가 ${j} 입니다. 누른 순간(GetKeyDown)에만 1 올라야 해요 (기대값 1).`);
  ok('충전 후 발사',Math.abs(fi-0.3)<1e-6,'3프레임(0.3초) 충전한 값이 fired에 저장됐어요.',`fired가 ${fi.toFixed(2)} 입니다. 누르고 있던 3프레임 × 0.1초 = 0.3 이어야 해요.`);
  ok('충전값 초기화',ch===0,'발사 뒤 charge가 0으로 돌아왔어요.',`charge가 ${ch.toFixed(2)} 입니다. 키를 뗀 뒤에는 0이어야 해요.`);
 },
 hints:['세 가지 함수는 각각 "누른 프레임", "누르는 중 매 프레임", "뗀 프레임"에만 true가 돼요.','charge는 GetKey 블록에서 계속 더하고, GetKeyUp 블록에서 fired로 옮긴 뒤 0으로 만드세요.','한 Update 안에 if를 세 개 나란히 써도 괜찮아요.'],
 why:'GetKey는 누르고 있는 모든 프레임에서 true라서 "한 번 일어나는 일"에 쓰면 폭주해요. 점프·공격 시작은 GetKeyDown, 차징·이동은 GetKey, 차징 해제는 GetKeyUp처럼 입력의 "순간"과 "상태"를 구분해 쓰는 게 기본입니다.',
 concepts:[['GetKeyDown / GetKey / GetKeyUp','누른 프레임, 누르는 동안, 뗀 프레임에서 각각 true가 되는 입력 함수. 한 번만 일어날 동작은 Down/Up을 쓴다.'],['충전(차징) 입력','GetKey로 시간을 누적하고 GetKeyUp에서 값을 사용한 뒤 초기화하는 패턴.']]});

Q({id:'u3',cat:'unity',stage:2,level:2,title:'입력은 Update, 물리는 FixedUpdate',
 story:'Rigidbody2D로 캐릭터를 움직이는데 Update 안에서 입력도 읽고 속도도 바로 바꾸고 있어요. 물리 엔진은 FixedUpdate 주기로 돌기 때문에 프레임레이트에 따라 움직임이 어긋나고, 반대로 입력을 FixedUpdate에서 읽으면 키 입력을 놓칠 수 있습니다. 역할을 나눠 주세요.',
 goals:['Update에서는 수평 입력을 읽어 moveX 필드에 저장만 한다','FixedUpdate에서는 저장된 moveX를 이용해 Rigidbody2D의 속도를 적용한다 (y속도는 유지)'],
 limits:['Update에서는 rb의 속도를 건드리지 않는다','FixedUpdate에서는 Input을 읽지 않는다'],
 api:'Input.GetAxisRaw("Horizontal"), rb.velocity (Unity 6에서는 rb.linearVelocity 도 같은 의미)',
 starter:C`
using UnityEngine;

public class Mover : MonoBehaviour
{
    public float speed = 6f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        // 입력과 물리가 한 곳에 섞여 있어요. 나눠 보세요.
        float x = Input.GetAxisRaw("Horizontal");
        rb.velocity = new Vector2(x * speed, rb.velocity.y);
    }
}`,
 solution:C`
using UnityEngine;

public class Mover : MonoBehaviour
{
    public float speed = 6f;
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
        rb.velocity = new Vector2(moveX * speed, rb.velocity.y);
    }
}`,
 rules:[
  inFn('Update에서 입력 읽기','Update',/Input\.GetAxis(?:Raw)?\s*\(/,'입력은 Update에서 읽어요.','Update 안에서 Input.GetAxisRaw("Horizontal") 로 입력을 읽어 필드에 저장하세요.'),
  notIn('Update에서 물리 금지','Update',/\b(?:velocity|linearVelocity|AddForce|MovePosition)\b/,'Update에서 물리를 건드리지 않아요.','Update에서 rb의 속도·힘을 바꾸면 물리 주기와 어긋나요. FixedUpdate로 옮기세요.'),
  inFn('FixedUpdate에서 속도 적용','FixedUpdate',/\b(?:velocity|linearVelocity|AddForce|MovePosition)\b/,'FixedUpdate에서 속도를 적용해요.','FixedUpdate 메서드를 만들어 rb의 속도를 적용하세요.'),
  notIn('FixedUpdate에서 입력 금지','FixedUpdate',/\bInput\s*\./,'FixedUpdate에서 입력을 읽지 않아요.','FixedUpdate는 프레임보다 덜 자주 호출될 수 있어 GetKeyDown 같은 입력을 놓쳐요. 입력은 Update에서 읽어 필드에 저장해 두세요.')
 ],
 test:(api,ok)=>{
  const rb={velocity:{x:0,y:3},linearVelocity:{x:0,y:3}};
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.env.Input.GetAxisRaw=()=>1;
  api.call('Update');
  const vx=()=>Math.max(Math.abs(rb.velocity.x),Math.abs(rb.linearVelocity.x));
  ok('Update는 입력만',vx()===0,'Update는 입력만 읽고 속도는 건드리지 않아요.','Update를 호출했더니 속도가 바뀌었어요. 속도 적용은 FixedUpdate에서 하세요.');
  api.env.Input.GetAxisRaw=()=>0;
  api.call('FixedUpdate');
  const sp=api.get('speed');
  ok('FixedUpdate가 저장된 입력 적용',rb.velocity.x===sp||rb.linearVelocity.x===sp,'FixedUpdate가 Update에서 저장한 입력으로 속도를 적용해요.',`FixedUpdate 후 속도 x가 ${rb.velocity.x} 입니다. Update에서 저장해 둔 moveX(1) × speed(${sp}) 이어야 해요.`);
  ok('y 속도 유지',rb.velocity.y===3||rb.linearVelocity.y===3,'y 속도(중력·점프)를 덮어쓰지 않아요.','y 속도가 바뀌었어요. new Vector2(x * speed, rb.velocity.y) 처럼 기존 y를 유지하세요.');
 },
 hints:['Update는 렌더 프레임마다, FixedUpdate는 고정된 물리 주기마다 호출돼요. 서로 호출 횟수가 달라요.','Update에서 읽은 입력을 FixedUpdate가 쓸 수 있도록 클래스 필드에 저장하세요.','y속도는 점프·중력에서 오기 때문에 rb.velocity.y를 그대로 넘겨야 해요.'],
 why:'입력은 프레임마다 확인해야 놓치지 않고, 물리는 고정 주기로 일관되게 적용해야 안정적이에요. 그래서 "Update에서 입력 읽기 → 필드에 저장 → FixedUpdate에서 물리에 적용"이 Rigidbody 이동의 기본 구조입니다.',
 concepts:[['Update vs FixedUpdate','Update는 렌더 프레임마다, FixedUpdate는 일정한 물리 주기마다 호출된다. 입력은 Update, 물리 적용은 FixedUpdate에서 한다.'],['Rigidbody2D.velocity','물체의 현재 속도(초당 유닛). 직접 대입하면 즉시 그 속도로 움직인다.']]});

Q({id:'u9',cat:'unity',stage:2,level:3,title:'velocity에도 deltaTime을 곱했더니',
 story:'FixedUpdate에서 Rigidbody2D를 움직이는 두 가지 방법을 쓰고 있어요. ApplyVelocity를 쓰면 캐릭터가 달팽이처럼 느리고, ApplyStep을 쓰면 아예 움직이지 않아요. 두 메서드 모두 초당 speed만큼 움직이도록 고쳐 주세요.',
 goals:['ApplyVelocity(): rb.velocity 의 x를 dirX * speed 로 설정한다 (y는 유지)','ApplyStep(): rb.MovePosition으로 x를 dirX * speed * Time.fixedDeltaTime 만큼 옮긴 위치를 넘긴다 (y는 유지)'],
 limits:['ApplyVelocity 안에서는 Time.deltaTime 을 쓰지 않는다','ApplyStep 에서는 현재 위치(rb.position)에서 출발한다'],
 api:'rb.velocity, rb.position, rb.MovePosition(Vector2), Time.fixedDeltaTime',
 starter:C`
public float speed = 5f;
public float dirX = 1f;
private Rigidbody2D rb;

void Awake()
{
    rb = GetComponent<Rigidbody2D>();
}

void ApplyVelocity()
{
    rb.velocity = new Vector2(dirX * speed * Time.deltaTime, rb.velocity.y);
}

void ApplyStep()
{
    rb.MovePosition(new Vector2(rb.position.x, rb.position.y));
}`,
 solution:C`
public float speed = 5f;
public float dirX = 1f;
private Rigidbody2D rb;

void Awake()
{
    rb = GetComponent<Rigidbody2D>();
}

void ApplyVelocity()
{
    rb.velocity = new Vector2(dirX * speed, rb.velocity.y);
}

void ApplyStep()
{
    float step = dirX * speed * Time.fixedDeltaTime;
    rb.MovePosition(new Vector2(rb.position.x + step, rb.position.y));
}`,
 rules:[
  notIn('velocity에 deltaTime 금지','ApplyVelocity',/deltaTime/,'velocity에는 시간을 곱하지 않았어요.','velocity는 이미 초당 속도예요. 여기에 deltaTime을 또 곱하면 이동이 1/50~1/60 로 줄어듭니다.'),
  inFn('MovePosition에 시간 곱하기','ApplyStep',/(?:fixedDeltaTime|deltaTime)/,'MovePosition에는 시간을 곱해 한 스텝의 이동량을 만들어요.','MovePosition에 넘기는 건 위치예요. 속도 × 시간(Time.fixedDeltaTime)으로 이번 스텝의 이동량을 계산하세요.')
 ],
 test:(api,ok)=>{
  const T=api.env.Time;T.deltaTime=0.02;T.fixedDeltaTime=0.02;
  const rb={velocity:{x:0,y:1},linearVelocity:{x:0,y:1},position:{x:2,y:7},MovePosition(p){this.moved=p}};
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.call('ApplyVelocity');
  const vx=rb.velocity.x,lx=rb.linearVelocity.x;
  ok('속도 적용',vx===5||lx===5,'x 속도가 5(초당 유닛)예요.',`x 속도가 ${vx} 입니다. dirX(1) × speed(5) = 5 여야 해요. deltaTime을 곱하면 0.1이 돼요.`);
  api.call('ApplyStep');
  const m=rb.moved;
  ok('MovePosition 호출',!!m,'MovePosition을 호출했어요.','ApplyStep 안에서 rb.MovePosition(...)을 호출하세요.');
  if(m){
   ok('한 스텝 이동량',Math.abs(m.x-2.1)<1e-6,'현재 위치에서 한 스텝(0.1유닛)만큼 옮겼어요.',`MovePosition x가 ${m.x} 입니다. 2 + 5 × 0.02 = 2.1 이어야 해요.`);
   ok('y 유지',m.y===7,'y 위치는 유지했어요.','y 위치가 바뀌었어요. rb.position.y 를 그대로 넘기세요.');
  }
 },
 hints:['"움직임에는 deltaTime을 곱한다"는 규칙이 언제나 맞는 건 아니에요. 넘기는 값이 "초당 속도"인지 "이번 스텝의 위치"인지에 따라 달라요.','속도(초당 유닛)는 "1초 동안 얼마나 가는지"를 말해요. Rigidbody가 알아서 시간을 곱해 이동시켜요.','MovePosition은 속도가 아니라 "도착 위치"를 받아요. 이번 스텝에 옮길 거리를 직접 계산해야 해요.','이번 스텝의 이동량 = 속도 × Time.fixedDeltaTime. 현재 위치 + 이동량 = 목표 위치.'],
 why:'값이 "속도"인지 "위치/이동량"인지 구분하면 deltaTime을 곱할지 말지가 정해져요. rb.velocity나 AddForce(Force)처럼 엔진이 시간을 곱해 주는 API에는 곱하지 않고, 직접 위치를 계산해서 넘기는 MovePosition, Translate에는 곱합니다.',
 concepts:[['속도 vs 이동량','속도(초당 거리)는 엔진이 시간에 맞춰 적용하고, 이동량(한 프레임/스텝의 거리)은 직접 속도 × 시간으로 계산해야 한다.'],['Time.fixedDeltaTime','물리 업데이트 간격(기본 0.02초). FixedUpdate에서 Time.deltaTime은 이 값을 돌려준다.'],['Rigidbody2D.MovePosition','물리 엔진을 통해 다음 스텝의 목표 위치로 이동시킨다. 충돌을 존중한다.']]});

Q({id:'u10',cat:'unity',stage:3,level:1,title:'2초 뒤에 적을 한 번 소환하기',
 story:'게임이 시작되고 2초 뒤에 적을 딱 한 번 소환하고 싶어요. Update에서 타이머 변수를 직접 관리하는 대신, 시간 흐름에 따라 코드를 나눠 실행하는 코루틴으로 만들어 주세요.',
 goals:['IEnumerator SpawnAfterDelay() 코루틴을 만든다: 2초를 기다린 뒤 enemyPrefab을 Instantiate하고 spawned를 1 올린다','Start에서 이 코루틴을 시작한다','2초가 지나기 전에는 소환되지 않고, 소환은 정확히 한 번만 일어난다'],
 limits:['대기에는 WaitForSeconds를 쓴다','Update에서 시간을 직접 누적하는 방식은 쓰지 않는다'],
 api:'IEnumerator, yield return new WaitForSeconds(초), StartCoroutine(...), Instantiate(...)',
 starter:C`
using System.Collections;
using UnityEngine;

public class Spawner : MonoBehaviour
{
    public GameObject enemyPrefab;
    public int spawned;

    void Start()
    {
        // 2초 뒤에 적을 한 번만 소환하고 싶습니다.
    }

    // TODO: 코루틴을 만들어 보세요.
}`,
 solution:C`
using System.Collections;
using UnityEngine;

public class Spawner : MonoBehaviour
{
    public GameObject enemyPrefab;
    public int spawned;

    void Start()
    {
        StartCoroutine(SpawnAfterDelay());
    }

    IEnumerator SpawnAfterDelay()
    {
        yield return new WaitForSeconds(2f);
        Instantiate(enemyPrefab);
        spawned++;
    }
}`,
 rules:[
  has('코루틴 메서드 선언',/\bIEnumerator\s+SpawnAfterDelay\s*\(\s*\)/,'IEnumerator를 반환하는 SpawnAfterDelay를 만들었어요.','IEnumerator SpawnAfterDelay() 형태로 코루틴 메서드를 선언하세요.'),
  inFn('WaitForSeconds로 대기','SpawnAfterDelay',/yield\s+return\s+new\s+WaitForSeconds\s*\(/,'WaitForSeconds로 기다려요.','yield return new WaitForSeconds(2f); 로 2초를 기다리세요.'),
  inFn('Start에서 시작','Start',/StartCoroutine\s*\(\s*SpawnAfterDelay\s*\(\s*\)\s*\)/,'Start에서 StartCoroutine으로 시작해요.','코루틴은 StartCoroutine(...)으로 시작해야 실행돼요. 그냥 SpawnAfterDelay()만 부르면 아무 일도 일어나지 않습니다.'),
  notIn('Update 타이머 금지','Update',/Time\./,'Update로 타이머를 만들지 않았어요.','Update에서 Time으로 직접 시간을 누적하는 대신 코루틴으로 해결하세요.')
 ],
 test:(api,ok)=>{
  api.env.Time.deltaTime=0.1;
  api.call('Start');
  const g=api.env.started[0];
  if(!g){ok('코루틴 시작',false,'','Start에서 StartCoroutine(...)으로 코루틴을 시작해야 해요.');return}
  const co=api.co(g);
  for(let i=0;i<19;i++)co.advance(0.1);
  ok('2초 전에는 소환 안 함',api.get('spawned')===0&&api.env.instantiated.length===0,'1.9초까지는 아무것도 소환되지 않아요.','2초가 지나기 전에 소환이 일어났어요. yield return new WaitForSeconds(2f) 뒤에 소환해야 해요.');
  for(let i=0;i<3;i++)co.advance(0.1);
  ok('2초 뒤 한 번 소환',api.get('spawned')===1&&api.env.instantiated.length===1,'2초가 지난 뒤 한 번 소환했어요.',`2초 뒤 spawned=${api.get('spawned')}, 생성 수=${api.env.instantiated.length} 입니다. 둘 다 1이어야 해요.`);
  for(let i=0;i<30;i++)co.advance(0.1);
  ok('반복되지 않음',api.get('spawned')===1&&co.done,'더 이상 소환하지 않고 코루틴이 끝나요.','한 번만 소환해야 하는데 계속 소환되고 있어요.');
 },
 hints:['코루틴은 IEnumerator를 반환하고, 중간에 yield return으로 "여기서 잠깐 쉬었다가 이어서 실행"할 수 있는 함수예요.','쉬는 시간은 yield return new WaitForSeconds(초) 로 지정해요.','코루틴 함수를 그냥 호출하면 실행되지 않아요. StartCoroutine(함수()) 로 시작해야 합니다.'],
 why:'코루틴은 "몇 프레임/몇 초 뒤에 이어서"를 순서대로 읽히는 코드로 쓰게 해 줍니다. Update로 타이머를 직접 만들면 변수와 조건이 늘지만, 코루틴은 시간의 흐름이 코드의 위→아래 흐름과 같아져서 훨씬 읽기 쉬워요.',
 concepts:[['코루틴(Coroutine)','yield return으로 프레임이나 시간 단위로 나눠 실행하는 함수. IEnumerator를 반환하고 StartCoroutine으로 시작한다.'],['WaitForSeconds','코루틴을 지정한 초만큼 멈춰 두는 yield 명령. Time.timeScale의 영향을 받는다.']]});

Q({id:'u4',cat:'unity',stage:3,level:2,title:'페이드 아웃하다가 Unity가 멈춘다',
 story:'오브젝트가 서서히 사라지는 FadeOut 코루틴을 작성했는데, 실행하는 순간 Unity 에디터가 멈춰 버렸어요. 원인을 찾아서 고치고, duration초에 걸쳐 alpha가 1에서 0으로 줄어든 뒤 오브젝트가 꺼지게 만들어 주세요.',
 goals:['while 루프가 매 프레임 한 번씩만 돌도록 프레임을 양보한다','duration초에 걸쳐 alpha가 1 → 0으로 줄어든다','끝나면 alpha는 정확히 0이고 gameObject가 비활성화된다'],
 limits:['메서드 이름은 Fade 를 유지한다','alpha 감소량은 Time.deltaTime 과 duration 으로 계산한다'],
 api:'yield return null, Time.deltaTime, gameObject.SetActive(false)',
 starter:C`
using System.Collections;
using UnityEngine;

public class FadeOut : MonoBehaviour
{
    public float duration = 1f;
    float alpha = 1f;

    IEnumerator Fade()
    {
        // 실행하면 Unity가 멈춥니다. 이유를 찾아 고치세요.
        while (alpha > 0f)
        {
            alpha -= Time.deltaTime / duration;
        }
        alpha = 0f;
        gameObject.SetActive(false);
    }
}`,
 solution:C`
using System.Collections;
using UnityEngine;

public class FadeOut : MonoBehaviour
{
    public float duration = 1f;
    float alpha = 1f;

    IEnumerator Fade()
    {
        while (alpha > 0f)
        {
            alpha -= Time.deltaTime / duration;
            yield return null;
        }
        alpha = 0f;
        gameObject.SetActive(false);
    }
}`,
 rules:[
  inFn('루프 안에서 프레임 양보','Fade',/yield\s+return/,'루프 안에서 yield return으로 프레임을 양보해요.','while 안에 yield return이 없으면 루프가 한 프레임 안에서 끝없이 돌아 Unity가 멈춰요. 루프 안쪽 끝에 yield return null; 을 넣으세요.')
 ],
 test:(api,ok)=>{
  api.env.Time.deltaTime=0.1;
  api.set('duration',1);api.set('alpha',1);
  const co=api.co(api.call('Fade'));
  for(let i=0;i<4;i++)co.advance(0.1);
  const mid=api.get('alpha');
  ok('프레임마다 조금씩 감소',!co.done&&mid>0.3&&mid<0.9,`중간에 alpha가 ${mid.toFixed(2)}로 서서히 줄고 있어요.`,`4프레임 뒤 alpha=${mid.toFixed(2)}, 끝남=${co.done}. 프레임마다 조금씩 줄어드는 중이어야 해요.`);
  let n=0;while(!co.done&&n++<30)co.advance(0.1);
  ok('duration 안에 끝남',co.done&&n<=12,`약 1초 만에 끝났어요.`,`코루틴이 ${co.done?'너무 늦게':'끝나지 않고'} 진행돼요. 1초(10프레임) 안팎에 끝나야 해요.`);
  ok('alpha 0',api.get('alpha')===0,'alpha가 정확히 0이에요.',`alpha가 ${api.get('alpha')} 입니다. 정확히 0이어야 해요.`);
  ok('비활성화',api.gameObject.activeSelf===false,'오브젝트가 꺼졌어요.','끝난 뒤 gameObject.SetActive(false)가 필요해요.');
 },
 hints:['while 루프는 조건이 거짓이 될 때까지 쉬지 않고 계속 돕니다. 그런데 Time.deltaTime은 "한 프레임" 안에서는 바뀌지 않아요.','코루틴에서 프레임을 넘기는 방법은 yield return 이에요.','루프 한 바퀴를 돌 때마다 yield return null; 을 넣으면 "다음 프레임에 이어서"가 됩니다.'],
 why:'Unity의 모든 코드는 메인 스레드에서 한 프레임씩 실행돼요. 코루틴의 while 루프에 yield가 없으면 한 프레임 안에서 영원히 돌아 화면이 멈춥니다. 반복하며 시간이 흐르길 기다리는 코루틴은 반드시 루프 안에서 yield 해야 해요.',
 concepts:[['yield return null','코루틴을 현재 프레임에서 멈추고 다음 프레임에 이어서 실행하게 한다. 루프 안에서 매 프레임 진행할 때 쓴다.'],['무한 루프와 프레임','yield 없는 while 루프는 한 프레임 안에서 끝나지 않아 Unity 전체가 멈춘다.']]});

Q({id:'u11',cat:'unity',stage:3,level:3,title:'껐다 켜면 스폰이 멈춰 있는 스포너',
 story:'Spawner 오브젝트를 SetActive(false)로 껐다가 다시 켰더니 적이 더 이상 나오지 않아요. 처음 켰을 때는 1초마다 잘 나왔어요. 켜질 때마다 스폰이 다시 시작되고, 중복으로 실행되지 않게 고쳐 주세요.',
 goals:['오브젝트가 켜질 때마다 SpawnLoop 코루틴을 시작한다 (시작한 코루틴은 routine 필드에 저장)','꺼질 때 실행 중인 코루틴을 StopCoroutine으로 멈추고 routine을 비운다','이미 돌고 있는 코루틴이 있으면 새로 시작하지 않는다'],
 limits:['Start에서는 StartCoroutine을 호출하지 않는다','SpawnLoop 코루틴 자체는 그대로 둔다'],
 api:'StartCoroutine(...) → Coroutine 반환, StopCoroutine(Coroutine), OnEnable / OnDisable',
 starter:C`
using System.Collections;
using UnityEngine;

public class Spawner : MonoBehaviour
{
    public GameObject prefab;
    public float interval = 1f;
    private Coroutine routine;

    void Start()
    {
        // 껐다 켜면 스폰이 멈춰 있어요
        StartCoroutine(SpawnLoop());
    }

    IEnumerator SpawnLoop()
    {
        while (true)
        {
            Instantiate(prefab);
            yield return new WaitForSeconds(interval);
        }
    }
}`,
 solution:C`
using System.Collections;
using UnityEngine;

public class Spawner : MonoBehaviour
{
    public GameObject prefab;
    public float interval = 1f;
    private Coroutine routine;

    void OnEnable()
    {
        if (routine == null)
        {
            routine = StartCoroutine(SpawnLoop());
        }
    }

    void OnDisable()
    {
        if (routine != null)
        {
            StopCoroutine(routine);
            routine = null;
        }
    }

    IEnumerator SpawnLoop()
    {
        while (true)
        {
            Instantiate(prefab);
            yield return new WaitForSeconds(interval);
        }
    }
}`,
 rules:[
  inFn('OnEnable에서 시작','OnEnable',/routine\s*=\s*StartCoroutine\s*\(\s*SpawnLoop\s*\(\s*\)\s*\)/,'켜질 때마다 코루틴을 시작하고 핸들을 저장해요.','OnEnable 안에서 routine = StartCoroutine(SpawnLoop()); 로 시작하고 핸들을 저장하세요.'),
  inFn('중복 시작 방지','OnEnable',/routine\s*(?:==|!=)\s*null/,'이미 돌고 있으면 새로 시작하지 않아요.','OnEnable이 연속으로 호출돼도 코루틴이 둘 돌지 않게 routine이 null인지 확인하세요.'),
  inFn('OnDisable에서 정지','OnDisable',/StopCoroutine\s*\(\s*routine\s*\)/,'꺼질 때 코루틴을 멈춰요.','OnDisable에서 StopCoroutine(routine) 으로 정리하세요. 컴포넌트만 비활성화되는 경우에는 Unity가 코루틴을 자동으로 멈추지 않아요.'),
  inFn('핸들 비우기','OnDisable',/routine\s*=\s*null/,'핸들을 비워 다음 시작을 준비해요.','멈춘 뒤 routine = null; 로 비워야 다시 켜졌을 때 새로 시작할 수 있어요.'),
  notIn('Start에서 시작 금지','Start',/StartCoroutine/,'Start에서 시작하지 않아요.','Start는 한 번만 호출돼서 껐다 켜면 다시 시작되지 않아요. OnEnable로 옮기세요.')
 ],
 test:(api,ok)=>{
  const E=api.env;
  api.call('OnEnable');
  ok('켜지면 시작',E.started.length===1,'켜지면 코루틴이 시작돼요.','OnEnable에서 StartCoroutine(SpawnLoop())을 호출하세요.');
  api.call('OnEnable');
  ok('중복 시작 방지',E.started.length===1,'연속으로 켜져도 코루틴은 하나만 돌아요.',`OnEnable을 연속으로 호출하니 코루틴이 ${E.started.length}개 시작됐어요. 이미 돌고 있으면 시작하지 마세요.`);
  api.call('OnDisable');
  ok('꺼지면 정지',E.stopped.length>=1,'꺼질 때 StopCoroutine을 호출해요.','OnDisable에서 StopCoroutine(routine)을 호출하세요.');
  api.call('OnEnable');
  ok('다시 켜면 재시작',E.started.length===2,'껐다 켜면 다시 시작돼요.',`다시 켠 뒤 시작된 코루틴 수가 ${E.started.length} 입니다. 2여야 해요. 정지한 뒤 routine을 null로 비웠는지 확인하세요.`);
 },
 hints:['GameObject가 비활성화되면 그 오브젝트에서 시작한 코루틴은 모두 멈춰요. 그런데 Start는 처음 한 번만 호출되죠.','GameObject가 비활성화되면 그 오브젝트에서 시작한 코루틴은 모두 멈추고, 다시 켜져도 자동으로 재개되지 않아요.','"켜질 때마다"와 "꺼질 때마다"에 반응하는 이벤트 함수는 OnEnable / OnDisable 이에요.','StartCoroutine이 돌려주는 Coroutine 값을 필드에 저장해 두면 나중에 StopCoroutine으로 멈출 수 있어요. 비워 두는 것도 잊지 마세요.'],
 why:'코루틴의 수명은 시작한 GameObject에 묶여 있어요. 활성/비활성에 맞춰 돌아야 하는 반복 작업은 OnEnable에서 시작하고 OnDisable에서 정리하는 짝으로 관리합니다. 핸들을 저장해 두면 중복 실행도 막고 원하는 때에 멈출 수도 있어요.',
 concepts:[['코루틴과 활성 상태','GameObject가 비활성화되면 그 오브젝트의 코루틴이 모두 멈추고 재활성화돼도 자동으로 재개되지 않는다.'],['Coroutine 핸들','StartCoroutine이 반환하는 값. 저장해 두면 StopCoroutine으로 특정 코루틴만 멈추고 중복 실행도 막을 수 있다.']]});
