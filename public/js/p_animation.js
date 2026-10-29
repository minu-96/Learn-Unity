/* ===== 애니메이션 ===== */
Q({id:'a1',cat:'animation',stage:1,level:1,title:'공격 애니메이션이 한 번만 재생되게',
 story:'마우스 왼쪽 버튼을 누르면 공격 애니메이션이 재생돼야 하는데, 지금은 한 번 누르면 공격 동작이 계속 반복돼요. Animator 파라미터를 Bool로 켜 놓고 끄지 않았기 때문입니다. "한 번 발동하고 스스로 꺼지는" 파라미터 종류를 써서 고쳐 주세요.',
 goals:['공격 버튼을 누른 프레임에 Animator의 "Attack" 파라미터를 한 번 발동한다','버튼을 누르지 않은 프레임에는 아무 파라미터도 건드리지 않는다'],
 limits:['SetBool("Attack", ...) 를 쓰지 않는다','Animator Controller의 Attack 파라미터는 Trigger 타입이라고 가정한다'],
 api:'anim.SetTrigger("이름"), Input.GetMouseButtonDown(0)',
 starter:C`
using UnityEngine;

public class PlayerAttack : MonoBehaviour
{
    private Animator anim;

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            // Bool은 직접 false로 돌려놓기 전까지 true라서 공격이 계속 반복됩니다
            anim.SetBool("Attack", true);
        }
    }
}`,
 solution:C`
using UnityEngine;

public class PlayerAttack : MonoBehaviour
{
    private Animator anim;

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            anim.SetTrigger("Attack");
        }
    }
}`,
 rules:[
  no('SetBool 금지',/SetBool\s*\(/,'일회성 동작에 Bool을 쓰지 않아요.','공격처럼 한 번만 일어나는 동작에 SetBool을 쓰면 직접 false로 되돌려야 해요. Trigger를 쓰세요.'),
  inFn('SetTrigger 사용','Update',/SetTrigger\s*\(/,'Trigger로 한 번만 발동해요.','anim.SetTrigger(\"Attack\") 로 한 번만 발동하세요.')
 ],
 test:(api,ok)=>{
  const anim=api.mk.anim();api.env.components.Animator=anim;
  api.call('Awake');
  const seq=[true,false,false];let i=0;
  api.env.Input.GetMouseButtonDown=()=>seq[i];
  for(i=0;i<seq.length;i++)api.call('Update');
  const trig=anim.log.filter(l=>l[0]==='SetTrigger');
  ok('버튼 한 번 → 트리거 한 번',trig.length===1&&trig[0][1]==='Attack','누른 프레임에만 SetTrigger("Attack")이 한 번 호출돼요.',`SetTrigger("Attack") 호출이 ${trig.length}번이에요. 누른 프레임에 정확히 한 번이어야 해요.`);
  ok('다른 파라미터 건드리지 않음',anim.log.length===trig.length,'다른 파라미터는 건드리지 않아요.','Attack 외에 다른 Animator 호출이 있어요.');
 },
 hints:['Animator 파라미터 종류: Float, Int, Bool, Trigger. Bool은 켜 두면 계속 켜진 상태예요.','Trigger는 "이 순간 발동"을 뜻하고, 전환이 한 번 소비하면 자동으로 꺼져요.','C#에서는 anim.SetTrigger("파라미터 이름") 으로 발동해요.'],
 why:'Bool은 "상태", Trigger는 "사건"을 표현해요. 공격·점프처럼 한 번 일어나는 사건은 Trigger로, 달리는 중·땅에 닿음처럼 지속되는 상태는 Bool로 다루면 전환 조건이 깔끔해집니다.',
 concepts:[['Animator 파라미터 종류','Float·Int는 수치, Bool은 지속 상태, Trigger는 한 번 발동하는 사건을 전달한다.'],['SetTrigger','Trigger 파라미터를 발동한다. 전환 조건으로 소비되면 자동으로 꺼진다.']]});

Q({id:'a2',cat:'animation',stage:1,level:2,title:'달리는 중, 땅에 있는 중을 Animator에 알려주기',
 story:'Animator Controller에는 Idle ↔ Run ↔ Jump 전환을 위한 Bool 파라미터 IsRunning, IsGrounded가 만들어져 있어요. 코드에서 매 프레임 현재 상태를 계산해서 Animator에 전달해 주세요. 왼쪽으로 달릴 때(속도가 음수)도 달리는 것으로 인식해야 합니다.',
 goals:['IsRunning: 수평 속도의 크기(절댓값)가 runThreshold보다 크면 true','IsGrounded: grounded 필드 값을 그대로 전달','Update에서 매 프레임 두 값을 SetBool로 전달한다'],
 limits:['속도의 부호와 상관없이 판단한다 (Mathf.Abs)','파라미터 이름은 Animator Controller와 정확히 같아야 한다: "IsRunning", "IsGrounded"'],
 api:'anim.SetBool("이름", 값), Mathf.Abs, rb.velocity.x',
 starter:C`
using UnityEngine;

public class AnimatorBridge : MonoBehaviour
{
    public float runThreshold = 0.1f;
    private Animator anim;
    private Rigidbody2D rb;
    private bool grounded;   // 다른 스크립트가 갱신합니다

    void Awake()
    {
        anim = GetComponent<Animator>();
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        // TODO: 현재 상태를 Animator에 전달하세요
    }
}`,
 solution:C`
using UnityEngine;

public class AnimatorBridge : MonoBehaviour
{
    public float runThreshold = 0.1f;
    private Animator anim;
    private Rigidbody2D rb;
    private bool grounded;

    void Awake()
    {
        anim = GetComponent<Animator>();
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        bool running = Mathf.Abs(rb.velocity.x) > runThreshold;
        anim.SetBool("IsRunning", running);
        anim.SetBool("IsGrounded", grounded);
    }
}`,
 rules:[
  inFn('IsRunning 전달','Update',/SetBool\s*\(/,'SetBool로 상태를 전달해요.','anim.SetBool(\"IsRunning\", 값) 으로 달리는 중인지 전달하세요.'),
  inFn('절댓값 사용','Update',/Mathf\.Abs\s*\(|\bMath\.Abs\s*\(/,'속도의 절댓값으로 판단해요.','왼쪽으로 달릴 때 velocity.x는 음수예요. Mathf.Abs로 크기를 구한 뒤 비교하세요.')
 ],
 test:(api,ok)=>{
  const anim=api.mk.anim(),rb=api.mk.rb();
  api.env.components.Animator=anim;api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  const val=n=>{const l=anim.log.filter(x=>x[0]==='SetBool'&&x[1]===n);return l.length?l[l.length-1][2]:undefined};
  const run=vx=>{anim.log.length=0;rb.velocity={x:vx,y:0};rb.linearVelocity={x:vx,y:0};api.call('Update');return val('IsRunning')};
  ok('오른쪽 달리기',run(3)===true,'오른쪽으로 달리면 IsRunning이 true예요.','속도 3인데 IsRunning이 true가 아니에요.');
  ok('왼쪽 달리기',run(-3)===true,'왼쪽으로 달려도 IsRunning이 true예요.','속도 -3(왼쪽)인데 IsRunning이 true가 아니에요. Mathf.Abs를 쓰세요.');
  ok('멈춤',run(0)===false,'멈추면 IsRunning이 false예요.','속도 0인데 IsRunning이 false가 아니에요.');
  api.set('grounded',true);anim.log.length=0;api.call('Update');
  ok('IsGrounded 전달',val('IsGrounded')===true,'grounded 값이 IsGrounded로 전달돼요.','grounded가 true인데 IsGrounded가 true로 전달되지 않았어요.');
 },
 hints:['Update에서 매 프레임 현재 상태를 계산해 SetBool로 넘기면 Animator가 전환 조건을 판단해요.','왼쪽으로 달리면 속도가 음수예요. 크기만 비교하려면 절댓값을 써야 해요.','"어떤 값보다 크다"의 결과 자체가 bool이에요. 조건식 결과를 그대로 SetBool에 넘길 수 있어요.'],
 why:'Animator는 상태 머신이고, 코드는 "지금 상황"을 파라미터로 전달하는 역할만 맡습니다. 상황 판단(달리는가, 땅에 있는가)은 코드가 하고, 어떤 클립을 재생할지는 Animator 전환 조건에 맡기면 역할이 깔끔하게 나뉘어요.',
 concepts:[['Animator 파라미터 전달','코드는 상태 값을 SetBool/SetFloat로 넘기고, 어떤 클립을 재생할지는 Animator의 전환 조건이 결정한다.'],['Mathf.Abs','절댓값. 방향(부호)과 상관없이 크기만 비교할 때 쓴다.']]});

Q({id:'a3',cat:'animation',stage:1,level:3,title:'점프 전환이 한참 늦게 일어난다',
 story:'점프 키를 눌러도 점프 애니메이션이 한참 뒤에야 시작돼요. 걷는 중일수록 더 늦게 바뀌고, 착지해도 대기 동작으로 늦게 돌아와요. Animator 창의 전환 화살표에는 Has Exit Time이 체크되어 있어요. 입력하는 순간 바로 동작이 바뀌도록 Jump와 Land를 구현해 주세요.',
 goals:['Jump(): 땅에 있을 때만 "Jump" 상태로 0.05~0.2초 동안 크로스페이드 전환하고 grounded를 false로 바꾼다','Land(): 공중에 있을 때만 "Idle" 상태로 0.05~0.2초 동안 크로스페이드 전환하고 grounded를 true로 바꾼다','이미 공중인데 Jump를 다시 호출하거나, 이미 땅인데 Land를 호출하면 아무 일도 하지 않는다'],
 limits:['SetTrigger로 전환하지 않고 CrossFade를 사용한다','상태 이름은 "Jump", "Idle" 이다'],
 api:'anim.CrossFade("상태 이름", 전환 시간(초))',
 starter:C`
using UnityEngine;

public class JumpAnim : MonoBehaviour
{
    private Animator anim;
    private bool grounded = true;

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    public void Jump()
    {
        // TODO
    }

    public void Land()
    {
        // TODO
    }
}`,
 solution:C`
using UnityEngine;

public class JumpAnim : MonoBehaviour
{
    private Animator anim;
    private bool grounded = true;

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    public void Jump()
    {
        if (!grounded) return;
        grounded = false;
        anim.CrossFade("Jump", 0.1f);
    }

    public void Land()
    {
        if (grounded) return;
        grounded = true;
        anim.CrossFade("Idle", 0.1f);
    }
}`,
 rules:[
  no('SetTrigger 금지',/SetTrigger\s*\(/,'SetTrigger 대신 CrossFade를 써요.','이번 문제는 Exit Time을 기다리지 않도록 CrossFade로 상태를 직접 전환하는 연습이에요.'),
  inFn('Jump에서 CrossFade','Jump',/CrossFade\s*\(/,'Jump에서 CrossFade로 전환해요.','Jump 안에서 anim.CrossFade("Jump", 0.1f) 를 호출하세요.'),
  inFn('Land에서 CrossFade','Land',/CrossFade\s*\(/,'Land에서 CrossFade로 전환해요.','Land 안에서 anim.CrossFade("Idle", 0.1f) 를 호출하세요.')
 ],
 test:(api,ok)=>{
  const anim=api.mk.anim();api.env.components.Animator=anim;
  api.call('Awake');
  api.call('Jump');
  const a=anim.log[0];
  ok('Jump 전환',!!a&&a[0]==='CrossFade'&&a[1]==='Jump'&&a[2]>=0.05&&a[2]<=0.2,'"Jump" 상태로 짧게 크로스페이드해요.','Jump()에서 anim.CrossFade("Jump", 0.1f) 처럼 0.05~0.2초 사이의 전환 시간으로 호출하세요.');
  api.call('Jump');
  ok('공중에서 Jump 무시',anim.log.length===1,'공중에서는 Jump를 다시 호출해도 무시해요.','이미 공중인데 Jump가 또 전환을 일으켰어요. grounded를 확인하세요.');
  api.call('Land');
  const b=anim.log[1];
  ok('Land 전환',!!b&&b[0]==='CrossFade'&&b[1]==='Idle'&&b[2]>=0.05&&b[2]<=0.2,'"Idle" 상태로 짧게 크로스페이드해요.','Land()에서 anim.CrossFade("Idle", 0.1f) 처럼 호출하세요.');
  api.call('Land');
  ok('땅에서 Land 무시',anim.log.length===2,'땅에서는 Land를 다시 호출해도 무시해요.','이미 땅인데 Land가 또 전환을 일으켰어요.');
 },
 hints:['Has Exit Time이 켜진 전환은 현재 클립이 끝날(정해진 시점에 도달할) 때까지 기다렸다가 시작돼요. 입력에 즉시 반응해야 하는 동작은 코드에서 상태를 직접 전환할 수 있어요.','Has Exit Time이 켜진 전환은 현재 클립이 끝난 뒤에야 시작돼요. 입력 반응이 필요한 곳에서는 이게 지연의 원인이 돼요.','Animator.CrossFade(상태 이름, 전환 시간)은 전환 조건을 기다리지 않고 지정한 상태로 바로 넘어가요.','Jump/Land가 연속으로 호출돼도 한 번만 반응하도록 grounded 상태를 확인하고 바꾸세요.'],
 why:'Animator 전환은 조건과 Exit Time 규칙을 따르기 때문에 입력 반응이 필요한 동작에서는 지연이 생길 수 있어요. 이때 Has Exit Time을 끄거나, 코드에서 CrossFade/Play로 상태를 직접 지정할 수 있습니다. 직접 전환은 강력한 만큼 Animator 그래프와 어긋나지 않게 상태 관리를 함께 해야 해요.',
 concepts:[['Has Exit Time','켜져 있으면 현재 클립이 지정한 비율까지 재생된 뒤에야 전환이 시작된다. 즉각 반응이 필요한 전환에서는 끈다.'],['Animator.CrossFade','지정한 상태로 지정한 시간 동안 블렌딩하며 전환한다. 전환 조건을 거치지 않는다.']]});

Q({id:'a4',cat:'animation',stage:2,level:1,title:'속도에 따라 걷기↔달리기를 부드럽게 섞기',
 story:'Blend Tree(Idle–Walk–Run)를 Speed 파라미터로 조절하려고 해요. 입력 크기를 그대로 넣었더니 키를 누르는 순간 Idle에서 Run으로 뚝 끊기며 바뀝니다. SetFloat의 감쇠(damping) 오버로드를 써서 값이 서서히 따라가게 만들어 주세요.',
 goals:['Update에서 수평 입력의 크기(절댓값, 0~1)를 Speed 파라미터로 전달한다','전달할 때 감쇠 시간(dampTime)을 0.1초로 주고, 마지막 인자로 Time.deltaTime을 넘긴다'],
 limits:['anim.SetFloat 에 네 개의 인자를 넘긴다 (이름, 값, 감쇠 시간, deltaTime)'],
 api:'anim.SetFloat(name, value, dampTime, deltaTime), Input.GetAxis, Mathf.Abs',
 starter:C`
using UnityEngine;

public class BlendMover : MonoBehaviour
{
    private Animator anim;

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    void Update()
    {
        float speed = Mathf.Abs(Input.GetAxis("Horizontal"));
        // 값이 뚝뚝 바뀝니다. 감쇠를 적용하세요.
        anim.SetFloat("Speed", speed);
    }
}`,
 solution:C`
using UnityEngine;

public class BlendMover : MonoBehaviour
{
    private Animator anim;

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    void Update()
    {
        float speed = Mathf.Abs(Input.GetAxis("Horizontal"));
        anim.SetFloat("Speed", speed, 0.1f, Time.deltaTime);
    }
}`,
 rules:[
  inFn('감쇠 오버로드','Update',/SetFloat\s*\([^;]*,[^;]*,[^;]*,\s*Time\.deltaTime\s*\)/,'감쇠 시간을 주는 SetFloat를 써요.','anim.SetFloat(\"Speed\", 값, 0.1f, Time.deltaTime) 처럼 감쇠 시간과 deltaTime을 함께 넘기세요.')
 ],
 test:(api,ok)=>{
  const anim=api.mk.anim();api.env.components.Animator=anim;
  api.call('Awake');
  api.env.Time.deltaTime=0.016;
  api.env.Input.GetAxis=()=>-0.5;
  api.call('Update');
  const l=anim.log[0];
  ok('Speed 전달',!!l&&l[0]==='SetFloat'&&l[1]==='Speed'&&Math.abs(l[2]-0.5)<1e-6,'입력의 크기(0.5)를 Speed로 전달해요.','입력 -0.5 → Speed 0.5 가 전달되어야 해요 (절댓값).');
  ok('감쇠 시간',!!l&&l.length===5&&l[3]>0&&l[3]<=0.3,'감쇠 시간을 줬어요.','SetFloat의 세 번째 인자로 감쇠 시간(예: 0.1f)을 주세요.');
  ok('deltaTime 전달',!!l&&l[4]===0.016,'마지막 인자로 Time.deltaTime을 넘겼어요.','네 번째 인자로 Time.deltaTime을 넘겨야 감쇠가 프레임 시간에 맞게 계산돼요.');
 },
 hints:['Animator.SetFloat에는 값을 한 번에 바꾸는 버전과, 서서히 따라가게 하는 버전이 있어요.','서서히 따라가는 버전은 SetFloat(이름, 목표값, 감쇠 시간, deltaTime) 형태예요.','입력이 -1이면 왼쪽이에요. Blend Tree는 보통 크기만 필요하니 절댓값을 쓰세요.'],
 why:'Blend Tree는 파라미터 값에 따라 클립을 섞기 때문에 값이 뚝 바뀌면 동작도 뚝 바뀝니다. dampTime을 주면 Animator가 현재 값을 목표 값으로 부드럽게 이동시켜서 별도 보간 코드 없이 자연스러운 전환이 돼요.',
 concepts:[['Blend Tree','파라미터 값에 따라 여러 클립을 섞어 재생하는 Animator 상태. 걷기와 달리기를 속도로 섞을 때 쓴다.'],['SetFloat 감쇠(dampTime)','파라미터 값을 목표 값으로 지정한 시간에 걸쳐 서서히 이동시키는 오버로드.']]});

Q({id:'a5',cat:'animation',stage:2,level:2,title:'이동이 두 배로 적용된다 (Root Motion)',
 story:'걷기 애니메이션 클립에 이동이 포함되어 있는 상태에서, 스크립트로도 transform을 움직였더니 캐릭터가 두 배 빠르게 움직여요. Animator의 Apply Root Motion이 켜져 있어서 애니메이션과 스크립트가 각각 캐릭터를 움직이기 때문입니다. 이동은 스크립트가 맡기로 했어요.',
 goals:['Awake에서 Animator의 Root Motion 적용을 끈다 (applyRootMotion = false)','Update에서 수평 입력 × speed × Time.deltaTime 만큼 transform을 움직인다'],
 limits:['Animator 컴포넌트는 Awake에서 한 번만 가져온다'],
 api:'anim.applyRootMotion, transform.Translate(x, y, z)',
 starter:C`
using UnityEngine;

public class ScriptMover : MonoBehaviour
{
    public float speed = 3f;
    private Animator anim;

    void Awake()
    {
        anim = GetComponent<Animator>();
        // TODO: 애니메이션이 캐릭터를 움직이지 않게 하세요
    }

    void Update()
    {
        float x = Input.GetAxisRaw("Horizontal");
        transform.Translate(x * speed * Time.deltaTime, 0f, 0f);
    }
}`,
 solution:C`
using UnityEngine;

public class ScriptMover : MonoBehaviour
{
    public float speed = 3f;
    private Animator anim;

    void Awake()
    {
        anim = GetComponent<Animator>();
        anim.applyRootMotion = false;
    }

    void Update()
    {
        float x = Input.GetAxisRaw("Horizontal");
        transform.Translate(x * speed * Time.deltaTime, 0f, 0f);
    }
}`,
 rules:[
  inFn('Root Motion 끄기','Awake',/\bapplyRootMotion\s*=\s*false\s*;/,'Awake에서 Root Motion을 꺼요.','anim.applyRootMotion = false; 로 애니메이션의 이동 적용을 끄세요.')
 ],
 test:(api,ok)=>{
  const anim=api.mk.anim();api.env.components.Animator=anim;
  api.call('Awake');
  ok('Root Motion 꺼짐',anim.applyRootMotion===false,'applyRootMotion이 꺼졌어요.','Awake 후 applyRootMotion이 false여야 해요.');
  api.env.Time.deltaTime=0.1;api.env.Input.GetAxisRaw=()=>1;
  api.transform.position={x:0,y:0};
  api.call('Update');
  ok('스크립트 이동',Math.abs(api.transform.position.x-0.3)<1e-6,'입력 방향으로 speed × deltaTime 만큼 이동해요.',`x가 ${api.transform.position.x} 입니다. 3 × 0.1 = 0.3 이어야 해요.`);
 },
 hints:['Root Motion은 애니메이션 클립 안의 이동/회전을 실제 Transform에 적용해 주는 기능이에요.','스크립트가 이동을 맡을 때는 Root Motion을 꺼야 이중 적용이 안 돼요.','Animator에는 applyRootMotion 이라는 bool 속성이 있어요.'],
 why:'캐릭터 이동의 주도권은 하나여야 해요. 애니메이션이 이동을 주도하면 Root Motion을 켜고, 코드·물리가 주도하면 끕니다. 둘이 동시에 켜져 있으면 이동이 겹쳐서 두 배가 되거나 미끄러지는 현상이 생겨요.',
 concepts:[['Root Motion','애니메이션 클립이 가진 이동·회전을 실제 Transform에 적용하는 기능. 스크립트 이동과 함께 켜 두면 이동이 이중으로 적용된다.'],['이동 주도권','캐릭터 이동은 애니메이션, 스크립트, 물리 중 한 곳이 주도해야 한다.']]});

Q({id:'a6',cat:'animation',stage:2,level:3,title:'파라미터 이름 문자열을 해시로 바꾸기',
 story:'Update에서 매 프레임 anim.SetFloat("Speed", ...), anim.SetBool("IsRunning", ...) 처럼 문자열로 파라미터를 지정하고 있어요. Animator는 내부적으로 이 문자열을 매번 해시로 변환해서 찾기 때문에 낭비이고, 오타도 컴파일러가 못 잡습니다. 이름을 한 번만 해시로 바꿔 두고 재사용해 주세요.',
 goals:['클래스 필드로 SpeedHash와 IsRunningHash를 static readonly int 로 선언하고 Animator.StringToHash로 초기화한다','Update에서는 문자열 대신 이 해시 값으로 SetFloat / SetBool 을 호출한다','동작은 그대로: Speed에는 입력 크기(절댓값), IsRunning에는 Speed > 0.1 의 결과를 전달한다'],
 limits:['Update 안에서 SetFloat, SetBool 의 첫 인자에 문자열 리터럴을 쓰지 않는다'],
 api:'Animator.StringToHash("이름"), anim.SetFloat(int, float), anim.SetBool(int, bool)',
 starter:C`
using UnityEngine;

public class HashedAnimator : MonoBehaviour
{
    private Animator anim;

    // TODO: 파라미터 이름을 해시로 바꿔 둘 필드

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    void Update()
    {
        float speed = Mathf.Abs(Input.GetAxis("Horizontal"));
        anim.SetFloat("Speed", speed);
        anim.SetBool("IsRunning", speed > 0.1f);
    }
}`,
 solution:C`
using UnityEngine;

public class HashedAnimator : MonoBehaviour
{
    private static readonly int SpeedHash = Animator.StringToHash("Speed");
    private static readonly int IsRunningHash = Animator.StringToHash("IsRunning");

    private Animator anim;

    void Awake()
    {
        anim = GetComponent<Animator>();
    }

    void Update()
    {
        float speed = Mathf.Abs(Input.GetAxis("Horizontal"));
        anim.SetFloat(SpeedHash, speed);
        anim.SetBool(IsRunningHash, speed > 0.1f);
    }
}`,
 rules:[
  has('SpeedHash 선언',/\bstatic\s+readonly\s+int\s+SpeedHash\s*=\s*Animator\.StringToHash\s*\(\s*"\s*"\s*\)/,'SpeedHash를 static readonly로 선언했어요.','private static readonly int SpeedHash = Animator.StringToHash("Speed"); 처럼 선언하세요.'),
  has('IsRunningHash 선언',/\bstatic\s+readonly\s+int\s+IsRunningHash\s*=\s*Animator\.StringToHash\s*\(\s*"\s*"\s*\)/,'IsRunningHash를 static readonly로 선언했어요.','private static readonly int IsRunningHash = Animator.StringToHash("IsRunning"); 처럼 선언하세요.'),
  notIn('문자열 리터럴 금지','Update',/Set(?:Float|Bool|Integer|Trigger)\s*\(\s*"/,'Update에서 문자열 대신 해시를 써요.','Update 안의 SetFloat/SetBool 첫 인자에 문자열이 남아 있어요. 필드로 만든 해시 값을 쓰세요.')
 ],
 test:(api,ok)=>{
  const anim=api.mk.anim();api.env.components.Animator=anim;
  api.call('Awake');
  api.env.Input.GetAxis=()=>-0.8;
  api.call('Update');
  const H=api.env.Animator.StringToHash;
  const f=anim.log.find(l=>l[0]==='SetFloat'),b=anim.log.find(l=>l[0]==='SetBool');
  ok('Speed 해시',!!f&&f.raw===H('Speed')&&Math.abs(f[2]-0.8)<1e-6,'SetFloat에 Speed의 해시와 0.8을 전달해요.','SetFloat의 첫 인자가 "Speed"의 해시(Animator.StringToHash("Speed"))이고 값은 0.8이어야 해요.');
  ok('IsRunning 해시',!!b&&b.raw===H('IsRunning')&&b[2]===true,'SetBool에 IsRunning의 해시와 true를 전달해요.','SetBool의 첫 인자가 "IsRunning"의 해시이고 값은 true(0.8 > 0.1)여야 해요.');
 },
 hints:['Animator.StringToHash("이름")이 돌려주는 int 값으로도 SetFloat/SetBool 같은 함수를 호출할 수 있어요.','해시는 이름이 바뀌지 않으니 한 번만 계산하면 돼요. 필드에 static readonly int 로 저장해 두세요.','Update에서는 SpeedHash, IsRunningHash 같은 필드만 쓰면 돼요.'],
 why:'문자열 파라미터는 호출할 때마다 해시 계산이 일어나요. 이름을 해시로 한 번만 바꿔 static readonly 필드에 보관하면 매 프레임 계산이 사라지고, 이름이 한곳에 모여 오타·이름 변경에도 안전해져요.',
 concepts:[['Animator.StringToHash','파라미터·상태 이름을 int 해시로 변환한다. 한 번만 계산해 재사용하면 문자열 해시 비용이 사라진다.'],['static readonly','클래스 전체에서 하나만 존재하고 초기화 이후 바뀌지 않는 값. 해시·상수에 어울린다.']]});
