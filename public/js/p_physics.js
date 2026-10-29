/* ===== 물리·충돌 ===== */
Q({id:'y1',cat:'physics',stage:1,level:1,title:'코인은 통과하면서 감지하기',
 story:'코인을 먹는 기능을 OnCollisionEnter2D로 만들었더니 플레이어가 코인에 부딪혀서 멈춰 버려요. 코인은 통과하면서 "닿았다"는 사실만 알아야 합니다. 물리적으로 막는 충돌(Collision) 대신 통과하는 트리거(Trigger)로 바꿔 주세요.',
 goals:['Awake에서 이 오브젝트의 Collider2D를 Trigger로 설정한다 (isTrigger = true)','OnTriggerEnter2D에서 Player 태그를 가진 대상일 때만 collected에 value를 더하고 코인을 파괴한다','Player가 아닌 대상이 닿으면 아무 일도 일어나지 않는다'],
 limits:['OnCollisionEnter2D는 제거한다','태그 비교는 other.tag == "Player" 대신 CompareTag를 쓴다'],
 api:'Collider2D.isTrigger, OnTriggerEnter2D(Collider2D other), other.CompareTag("..."), Destroy(gameObject)',
 starter:C`
using UnityEngine;

public class Coin : MonoBehaviour
{
    public int value = 1;
    public static int collected;

    void Awake()
    {
        // TODO: 콜라이더를 Trigger로 만들어 플레이어를 막지 않게 하세요
    }

    // 지금은 충돌(Collision)이라서 플레이어가 코인에 막혀 버립니다
    void OnCollisionEnter2D(Collision2D col)
    {
        collected += value;
        Destroy(gameObject);
    }
}`,
 solution:C`
using UnityEngine;

public class Coin : MonoBehaviour
{
    public int value = 1;
    public static int collected;

    void Awake()
    {
        GetComponent<Collider2D>().isTrigger = true;
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (!other.CompareTag("Player")) return;
        collected += value;
        Destroy(gameObject);
    }
}`,
 rules:[
  no('OnCollisionEnter2D 제거',/\bOnCollisionEnter2D\b/,'Collision 이벤트를 쓰지 않아요.','OnCollisionEnter2D는 물리적으로 막는 충돌용이에요. 트리거 이벤트(OnTriggerEnter2D)로 바꾸세요.'),
  has('OnTriggerEnter2D 사용',/\bvoid\s+OnTriggerEnter2D\s*\(\s*Collider2D\s+\w+\s*\)/,'OnTriggerEnter2D(Collider2D)를 사용해요.','void OnTriggerEnter2D(Collider2D other) 로 선언하세요. 매개변수는 Collision2D가 아니라 Collider2D예요.'),
  inFn('CompareTag 사용','OnTriggerEnter2D',/\.CompareTag\s*\(/,'CompareTag로 태그를 비교해요.','태그 비교는 other.CompareTag("Player") 를 쓰세요. .tag == "..." 는 문자열을 새로 만들어 비효율적이에요.'),
  no('.tag 비교 금지',/\.tag\s*(?:==|!=)/,'.tag 문자열 비교를 쓰지 않았어요.','.tag == "Player" 대신 CompareTag를 쓰세요.')
 ],
 test:(api,ok)=>{
  const col={isTrigger:false};
  api.env.components.Collider2D=col;
  api.call('Awake');
  ok('Trigger 설정',col.isTrigger===true,'Awake에서 콜라이더가 Trigger가 돼요.','Awake에서 GetComponent<Collider2D>().isTrigger = true; 로 Trigger로 만드세요. Trigger가 아니면 OnTriggerEnter2D가 호출되지 않아요.');
  api.call('OnTriggerEnter2D',api.mk.go('Enemy'));
  ok('플레이어가 아니면 무시',api.get('collected')===0&&api.env.destroyed.length===0,'Player가 아닌 대상은 무시해요.','Player 태그가 아닌 대상이 닿았는데 코인이 먹혔어요. CompareTag로 확인하세요.');
  api.call('OnTriggerEnter2D',api.mk.go('Player'));
  ok('코인 획득',api.get('collected')===1&&api.env.destroyed.length===1,'Player가 닿으면 value만큼 늘고 코인이 파괴돼요.',`획득량=${api.get('collected')}, 파괴 수=${api.env.destroyed.length}. 둘 다 1이어야 해요.`);
 },
 hints:['Collision은 서로를 막는 충돌, Trigger는 통과하면서 "겹쳤다"만 알려 주는 감지예요. 이벤트 함수 이름도 달라요.','콜라이더 컴포넌트에는 isTrigger 속성이 있어요. 인스펙터의 Is Trigger 체크박스예요.','Trigger 이벤트의 매개변수는 부딪힌 상대의 Collider2D 예요. 태그 확인은 CompareTag.'],
 why:'Collider의 Is Trigger를 켜면 물리적으로 막지 않고 겹침 이벤트(OnTriggerEnter/Stay/Exit)만 발생해요. 아이템 획득, 감지 영역, 골 지점처럼 "통과하면서 알아야 하는 것"은 Trigger로 만듭니다.',
 concepts:[['Collision vs Trigger','Collision은 물리적으로 막고 OnCollision* 이벤트를, Trigger는 통과하며 OnTrigger* 이벤트를 보낸다.'],['CompareTag','태그를 비교하는 권장 방법. .tag == "..."는 문자열을 새로 할당한다.'],['isTrigger','콜라이더를 트리거로 바꾸는 속성. 인스펙터의 Is Trigger 체크박스와 같다.']]});

Q({id:'y2',cat:'physics',stage:1,level:2,title:'총알이 벽에 닿으면 사라지게',
 story:'총알 프리팹을 만들었는데, 벽에 닿아도 아무 일도 일어나지 않고 총알은 중력 때문에 아래로 떨어져요. 충돌 이벤트가 오려면 보통 Rigidbody가 필요하고, 총알은 일직선으로 날아가야 하니 중력도 꺼야 합니다. 총알의 물리 설정과 충돌 처리를 완성해 주세요.',
 goals:['Awake에서 중력의 영향을 받지 않게 한다 (gravityScale = 0)','Awake에서 오른쪽으로 speed 만큼의 속도를 준다','OnCollisionEnter2D에서 Wall 태그를 가진 대상과 부딪히면 총알을 파괴한다 (다른 대상은 무시)'],
 limits:['충돌 이벤트(OnCollisionEnter2D)를 사용한다 — Trigger가 아니다','총알에는 이미 [RequireComponent(typeof(Rigidbody2D))] 가 붙어 있다'],
 api:'rb.gravityScale, rb.velocity, OnCollisionEnter2D(Collision2D col), col.gameObject.CompareTag',
 starter:C`
using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class Bullet : MonoBehaviour
{
    public float speed = 12f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        // TODO: 중력을 받지 않게 하고, 오른쪽으로 speed 만큼 날아가게 하세요
    }

    // TODO: Wall 태그를 가진 물체와 부딪히면 총알을 파괴하세요
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class Bullet : MonoBehaviour
{
    public float speed = 12f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        rb.gravityScale = 0f;
        rb.velocity = new Vector2(speed, 0f);
    }

    void OnCollisionEnter2D(Collision2D col)
    {
        if (col.gameObject.CompareTag("Wall"))
        {
            Destroy(gameObject);
        }
    }
}`,
 rules:[
  inFn('중력 끄기','Awake',/\bgravityScale\s*=\s*0(?:\.0*)?f?\s*;/,'gravityScale을 0으로 만들었어요.','총알이 떨어지지 않게 rb.gravityScale = 0f; 로 중력을 끄세요.'),
  inFn('속도 부여','Awake',/\b(?:velocity|linearVelocity)\s*=/,'Awake에서 속도를 줬어요.','rb.velocity = new Vector2(speed, 0f); 로 오른쪽으로 날아가게 하세요.'),
  has('OnCollisionEnter2D 사용',/\bvoid\s+OnCollisionEnter2D\s*\(\s*Collision2D\s+\w+\s*\)/,'OnCollisionEnter2D(Collision2D)를 사용해요.','void OnCollisionEnter2D(Collision2D col) 로 선언하세요. 매개변수는 Collision2D예요.'),
  inFn('Wall 태그 확인','OnCollisionEnter2D',/\.CompareTag\s*\(/,'CompareTag로 벽인지 확인해요.','collision.gameObject.CompareTag(\"Wall\") 로 벽인지 확인하세요.'),
  inFn('파괴','OnCollisionEnter2D',/Destroy\s*\(\s*gameObject\s*\)/,'총알을 파괴해요.','Destroy(gameObject) 로 총알을 없애세요.')
 ],
 test:(api,ok)=>{
  const rb=api.mk.rb();
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  ok('중력 끄기',rb.gravityScale===0,'중력을 받지 않아요.',`gravityScale이 ${rb.gravityScale} 입니다. 0이어야 해요.`);
  const sp=api.get('speed');
  ok('오른쪽으로 비행',rb.velocity.x===sp||rb.linearVelocity.x===sp,`오른쪽으로 ${sp}의 속도를 가져요.`,`x 속도가 ${rb.velocity.x} 입니다. speed(${sp})여야 해요.`);
  api.call('OnCollisionEnter2D',api.mk.go('Enemy'));
  ok('벽이 아니면 무시',api.env.destroyed.length===0,'벽이 아닌 대상과는 사라지지 않아요.','Wall 태그가 아닌 대상과 부딪혔는데 총알이 사라졌어요.');
  api.call('OnCollisionEnter2D',api.mk.go('Wall'));
  ok('벽에 닿으면 사라짐',api.env.destroyed.length===1,'벽에 닿으면 총알이 파괴돼요.','Wall 태그와 부딪혔을 때 Destroy(gameObject)가 호출되어야 해요.');
 },
 hints:['충돌 이벤트가 오려면 보통 충돌하는 두 물체 중 적어도 한쪽에 Rigidbody가 있어야 해요. 총알에는 이미 붙어 있죠.','Rigidbody2D의 gravityScale이 중력을 얼마나 받을지 정해요. 0이면 받지 않아요.','Collision2D 매개변수에서 부딪힌 상대 게임 오브젝트는 col.gameObject 예요.'],
 why:'충돌 이벤트가 오려면 Collider와 Rigidbody 조합이 맞아야 하고, 총알 같은 발사체는 중력을 끄고 속도를 직접 줍니다. 부딪힌 대상이 누구인지는 태그나 컴포넌트로 구분해서 필요한 반응만 하게 하세요.',
 concepts:[['충돌 이벤트 조건','OnCollision* 이벤트는 양쪽에 Collider가 있고 적어도 한쪽에 Rigidbody가 있어야 호출된다.'],['gravityScale','Rigidbody2D가 중력의 영향을 받는 정도. 0이면 떨어지지 않는다.'],['Collision2D.gameObject','충돌한 상대 오브젝트. 태그나 컴포넌트로 종류를 구분한다.']]});

Q({id:'y3',cat:'physics',stage:1,level:3,title:'빠른 총알이 얇은 벽을 통과한다 (터널링)',
 story:'총알 속도를 80으로 올렸더니 두께 0.2짜리 얇은 벽을 그대로 통과해 버려요. 속도가 10일 때는 잘 막혔어요. 움직임도 프레임마다 살짝 끊겨 보여요. 벽을 통과하지 않고 부드럽게 날아가도록 고쳐 주세요.',
 goals:['Awake에서 collisionDetectionMode를 Continuous로 설정한다','Awake에서 interpolation을 Interpolate로 설정한다','bodyType은 Dynamic을 유지한다 (Kinematic으로 바꾸지 않는다)'],
 limits:['Time.fixedDeltaTime 을 줄이는 방법은 쓰지 않는다 (프로젝트 전체 성능에 영향)'],
 api:'rb.collisionDetectionMode = CollisionDetectionMode2D.Continuous, rb.interpolation = RigidbodyInterpolation2D.Interpolate',
 starter:C`
using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class FastBullet : MonoBehaviour
{
    public float speed = 80f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        rb.gravityScale = 0f;
        rb.velocity = new Vector2(speed, 0f);
        // TODO: 얇은 벽을 통과하지 않도록 설정하세요
    }
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class FastBullet : MonoBehaviour
{
    public float speed = 80f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        rb.gravityScale = 0f;
        rb.velocity = new Vector2(speed, 0f);
        rb.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
        rb.interpolation = RigidbodyInterpolation2D.Interpolate;
    }
}`,
 rules:[
  no('fixedDeltaTime 변경 금지',/Time\.fixedDeltaTime\s*=/,'물리 주기를 건드리지 않았어요.','Time.fixedDeltaTime을 줄이면 모든 물리 계산 비용이 늘어요. 빠른 물체에만 Continuous를 쓰세요.')
 ],
 test:(api,ok)=>{
  const rb=api.mk.rb();
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  ok('연속 충돌 감지',rb.collisionDetectionMode==='Continuous','collisionDetectionMode가 Continuous예요.',`collisionDetectionMode가 ${rb.collisionDetectionMode} 입니다. CollisionDetectionMode2D.Continuous 로 바꾸세요. Discrete는 스텝마다 위치만 검사해서 통과할 수 있어요.`);
  ok('보간',rb.interpolation==='Interpolate','interpolation이 Interpolate예요.',`interpolation이 ${rb.interpolation} 입니다. RigidbodyInterpolation2D.Interpolate 로 설정하면 물리 스텝 사이에서도 부드럽게 보여요.`);
  ok('Dynamic 유지',rb.bodyType==='Dynamic','bodyType이 Dynamic이에요.',`bodyType이 ${rb.bodyType} 입니다. 연속 충돌 감지는 Dynamic 바디에서 동작해요.`);
  ok('속도 유지',rb.velocity.x===80||rb.linearVelocity.x===80,'속도는 그대로 80이에요.','속도를 낮추지 말고 충돌 감지 방식을 바꾸세요.');
 },
 hints:['물리 엔진은 기본적으로 0.02초마다 위치를 갱신해요. 한 스텝에 80 × 0.02 = 1.6 유닛을 이동하면, 두께 0.2짜리 벽을 "건너뛰어" 겹치는 순간이 없을 수 있어요.','기본값인 Discrete 모드는 물리 스텝마다 "그 위치"에서만 겹침을 검사해요. 스텝 사이의 경로는 검사하지 않죠.','Rigidbody2D에는 충돌 감지 방식을 정하는 collisionDetectionMode 속성이 있어요.','CollisionDetectionMode2D.Continuous 는 이동 경로까지 검사해서 터널링을 막아요. 렌더 움직임은 interpolation으로 부드럽게 해요.'],
 why:'기본 Discrete 방식은 스텝마다 위치만 검사하므로 빠르고 얇은 물체는 벽을 건너뛸 수 있어요(터널링). Continuous는 이동 경로를 검사해서 막아 주지만 비용이 더 드니, 총알처럼 빠른 물체에만 선택적으로 씁니다.',
 concepts:[['터널링(Tunneling)','물체가 너무 빨라 한 물리 스텝에 얇은 벽을 건너뛰어 충돌하지 않는 현상.'],['Continuous 충돌 감지','이동 경로까지 검사해서 터널링을 막는 방식. Discrete보다 비용이 높아 필요한 물체에만 쓴다.'],['Interpolation','물리 스텝 사이의 렌더 위치를 보간해 움직임을 부드럽게 보이게 하는 설정.']]});

Q({id:'y4',cat:'physics',stage:2,level:1,title:'AddForce로 가속하고 최고 속도 제한하기',
 story:'플레이어가 transform.Translate로 움직이고 있어서 벽을 뚫고 지나가요. Transform을 직접 옮기면 물리 엔진을 거치지 않기 때문이에요. Rigidbody2D에 힘을 주어 움직이게 바꾸되, 힘을 계속 주면 속도가 끝없이 빨라지니 최고 속도도 제한해 주세요.',
 goals:['Update에서 수평 입력을 읽어 moveX에 저장한다','FixedUpdate에서 rb.AddForce로 moveX × accel 만큼 힘을 준다','FixedUpdate에서 수평 속도의 크기가 maxSpeed를 넘으면 maxSpeed로 제한한다 (y 속도는 유지)'],
 limits:['transform.Translate 와 transform.position 대입으로 이동하지 않는다','힘 적용과 속도 제한은 FixedUpdate 에서 한다'],
 api:'rb.AddForce(Vector2), rb.velocity, Mathf.Clamp',
 starter:C`
using UnityEngine;

public class ForceMover : MonoBehaviour
{
    public float accel = 30f;
    public float maxSpeed = 8f;
    private Rigidbody2D rb;
    private float moveX;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        // 지금은 Transform을 직접 움직여서 벽을 뚫고 지나갑니다
        float x = Input.GetAxisRaw("Horizontal");
        transform.Translate(x * 5f * Time.deltaTime, 0f, 0f);
    }
}`,
 solution:C`
using UnityEngine;

public class ForceMover : MonoBehaviour
{
    public float accel = 30f;
    public float maxSpeed = 8f;
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
        rb.AddForce(new Vector2(moveX * accel, 0f));

        float vx = Mathf.Clamp(rb.velocity.x, -maxSpeed, maxSpeed);
        rb.velocity = new Vector2(vx, rb.velocity.y);
    }
}`,
 rules:[
  no('Transform 직접 이동 금지',/\btransform\s*\.\s*(?:Translate|position\s*=)/,'Transform을 직접 옮기지 않아요.','transform.Translate/position 대입은 물리 엔진을 거치지 않아서 충돌을 무시해요. Rigidbody로 움직이세요.'),
  inFn('Update에서 입력 저장','Update',/\bmoveX\s*=\s*Input\.GetAxis(?:Raw)?\s*\(/,'입력을 Update에서 읽어 moveX에 저장해요.','Update에서 moveX = Input.GetAxisRaw("Horizontal"); 로 입력을 저장하세요.'),
  inFn('FixedUpdate에서 AddForce','FixedUpdate',/\brb\.AddForce\s*\(/,'FixedUpdate에서 힘을 줘요.','FixedUpdate에서 rb.AddForce(...) 로 힘을 주세요.'),
  inFn('최고 속도 제한','FixedUpdate',/Mathf\.Clamp\s*\(|Mathf\.Min\s*\(|Mathf\.Sign|\bmaxSpeed\b/,'maxSpeed로 속도를 제한해요.','수평 속도를 Mathf.Clamp(rb.velocity.x, -maxSpeed, maxSpeed) 처럼 제한하세요.')
 ],
 test:(api,ok)=>{
  const rb=api.mk.rb();rb.velocity={x:0,y:-3};rb.linearVelocity={x:0,y:-3};
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.env.Input.GetAxisRaw=()=>1;
  api.call('Update');
  api.call('FixedUpdate');
  const f=rb.forces[0];
  ok('입력 방향으로 힘',!!f&&f[0].x>0&&f[0].y===0,'입력 방향(+x)으로 힘을 줘요.','FixedUpdate에서 rb.AddForce(new Vector2(moveX * accel, 0f)) 처럼 입력 방향으로 힘을 주세요.');
  if(f)ok('힘의 크기',f[0].x===api.get('accel'),'힘의 크기가 accel이에요.',`힘의 x가 ${f[0].x} 입니다. accel(${api.get('accel')})이어야 해요.`);
  rb.velocity={x:20,y:-3};rb.linearVelocity={x:20,y:-3};
  api.call('FixedUpdate');
  const mx=api.get('maxSpeed');
  ok('최고 속도 제한',rb.velocity.x===mx||rb.linearVelocity.x===mx,`수평 속도가 ${mx}로 제한돼요.`,`수평 속도가 ${rb.velocity.x} 입니다. maxSpeed(${mx})를 넘으면 maxSpeed로 제한해야 해요.`);
  ok('y 속도 유지',rb.velocity.y===-3||rb.linearVelocity.y===-3,'y 속도(중력)는 그대로예요.','y 속도가 바뀌었어요. new Vector2(vx, rb.velocity.y) 처럼 기존 y를 유지하세요.');
 },
 hints:['Rigidbody에 힘을 주면 가속하고, 충돌은 엔진이 알아서 처리해요. 그래서 벽을 뚫지 않아요.','입력은 Update에서 읽어 필드에 저장하고, 힘은 FixedUpdate에서 줘요. 힘은 속도와 달리 계속 쌓이는 점에 주의하세요.','힘만 주면 계속 빨라져요. 힘을 준 뒤 현재 수평 속도를 -maxSpeed ~ maxSpeed 로 제한하세요.'],
 why:'Transform을 직접 옮기면 물리 엔진은 "순간이동"으로 보고 충돌을 계산하지 않아요. 충돌이 필요한 움직임은 Rigidbody의 힘/속도로 만들고, 힘은 누적되므로 최고 속도 제한을 함께 두는 것이 기본입니다.',
 concepts:[['Transform 직접 이동의 한계','transform.Translate나 position 대입은 물리 엔진을 거치지 않아 충돌이 무시될 수 있다.'],['AddForce','Rigidbody에 힘을 줘서 가속시킨다. 매 스텝 주면 속도가 계속 늘기 때문에 최고 속도를 제한한다.']]});

Q({id:'y5',cat:'physics',stage:2,level:2,title:'땅에 있을 때만 점프하기',
 story:'점프를 만들었는데 공중에서도 스페이스를 누르면 계속 날아올라요. "땅에 닿아 있는 동안만 점프할 수 있다"는 규칙이 필요합니다. 충돌 이벤트로 접지 상태를 기록하고, 순간적인 힘(Impulse)으로 점프시켜 주세요.',
 goals:['Ground 태그와 충돌을 시작하면 grounded = true, 충돌이 끝나면 grounded = false','스페이스를 누른 프레임에 grounded일 때만 위로 jumpForce의 힘을 ForceMode2D.Impulse로 준다','점프한 즉시 grounded = false 로 바꿔 한 번 점프로 두 번 점프되지 않게 한다','Ground가 아닌 대상과의 충돌은 grounded에 영향을 주지 않는다'],
 limits:['점프 입력은 Update에서, 접지 상태 변경은 충돌 이벤트(OnCollisionEnter2D / OnCollisionExit2D)에서 처리한다'],
 api:'rb.AddForce(Vector2, ForceMode2D.Impulse), OnCollisionEnter2D / OnCollisionExit2D(Collision2D col)',
 starter:C`
using UnityEngine;

public class Jumper : MonoBehaviour
{
    public float jumpForce = 7f;
    private Rigidbody2D rb;
    private bool grounded;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        // 공중에서도 계속 점프할 수 있어요
        if (Input.GetKeyDown(KeyCode.Space))
        {
            rb.AddForce(new Vector2(0f, jumpForce));
        }
    }

    // TODO: Ground와의 충돌 시작/종료로 grounded를 관리하세요
}`,
 solution:C`
using UnityEngine;

public class Jumper : MonoBehaviour
{
    public float jumpForce = 7f;
    private Rigidbody2D rb;
    private bool grounded;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space) && grounded)
        {
            rb.AddForce(new Vector2(0f, jumpForce), ForceMode2D.Impulse);
            grounded = false;
        }
    }

    void OnCollisionEnter2D(Collision2D col)
    {
        if (col.gameObject.CompareTag("Ground")) grounded = true;
    }

    void OnCollisionExit2D(Collision2D col)
    {
        if (col.gameObject.CompareTag("Ground")) grounded = false;
    }
}`,
 rules:[
  has('OnCollisionEnter2D',/\bvoid\s+OnCollisionEnter2D\s*\(\s*Collision2D\s+\w+\s*\)/,'충돌 시작을 감지해요.','OnCollisionEnter2D(Collision2D col) 으로 땅에 닿은 순간을 감지하세요.'),
  has('OnCollisionExit2D',/\bvoid\s+OnCollisionExit2D\s*\(\s*Collision2D\s+\w+\s*\)/,'충돌 종료를 감지해요.','OnCollisionExit2D(Collision2D col) 으로 땅에서 떨어진 순간을 감지하세요.'),
  inFn('Impulse 사용','Update',/ForceMode2D\.Impulse/,'점프에는 순간 힘(Impulse)을 써요.','점프처럼 한 번에 주는 힘은 ForceMode2D.Impulse 로 주세요. 기본값(Force)은 지속적인 힘이라 의도보다 약해요.')
 ],
 test:(api,ok)=>{
  const rb=api.mk.rb();
  api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  api.env.Input.GetKeyDown=k=>k==='Space';
  api.call('Update');
  ok('공중에서는 점프 불가',rb.forces.length===0,'땅에 닿지 않았을 때는 점프하지 않아요.','grounded가 false인데 점프했어요. 접지 상태일 때만 AddForce를 호출하세요.');
  api.call('OnCollisionEnter2D',api.mk.go('Wall'));
  api.call('Update');
  ok('Ground가 아닌 충돌 무시',rb.forces.length===0,'Ground가 아닌 대상과 부딪혀도 접지가 되지 않아요.','Wall과 부딪혔는데 땅으로 인식했어요. Ground 태그를 확인하세요.');
  api.call('OnCollisionEnter2D',api.mk.go('Ground'));
  api.call('Update');
  const f=rb.forces[0];
  ok('땅에서 점프',!!f&&f[0].y===api.get('jumpForce')&&f[1]==='Impulse','땅에서는 위로 jumpForce의 순간 힘을 줘요.','Ground에 닿아 있을 때 AddForce(new Vector2(0f, jumpForce), ForceMode2D.Impulse) 로 점프해야 해요.');
  api.call('Update');
  ok('이중 점프 방지',rb.forces.length===1,'점프한 즉시 접지가 해제돼서 두 번 점프되지 않아요.','점프 직후 grounded를 false로 바꾸지 않아서 한 번 더 점프했어요.');
  api.call('OnCollisionEnter2D',api.mk.go('Ground'));
  api.call('OnCollisionExit2D',api.mk.go('Ground'));
  api.call('Update');
  ok('떨어지면 접지 해제',rb.forces.length===1,'땅에서 떨어지면 점프할 수 없어요.','OnCollisionExit2D에서 grounded를 false로 바꾸세요.');
 },
 hints:['"땅에 닿아 있다"는 상태를 bool 필드에 기억해 두고, 점프 조건에 함께 쓰세요.','충돌을 시작한 순간은 OnCollisionEnter2D, 끝난 순간은 OnCollisionExit2D 예요. 상대가 땅인지는 태그로 확인해요.','점프처럼 한 번에 주는 힘은 AddForce의 두 번째 인자로 ForceMode2D.Impulse 를 주세요.'],
 why:'접지 상태는 점프의 가장 기본적인 조건이에요. 충돌 Enter/Exit 이벤트로 상태를 기록하면 간단히 만들 수 있고, 점프한 즉시 상태를 끄면 이벤트 지연 때문에 생기는 이중 점프도 막을 수 있습니다.',
 concepts:[['접지(Grounded) 판정','캐릭터가 땅에 닿아 있는지 기록하는 상태. 충돌 Enter/Exit나 Raycast로 판단한다.'],['ForceMode2D.Impulse','질량을 고려한 순간적인 힘. 점프나 폭발처럼 한 번에 주는 힘에 쓴다.']]});

Q({id:'y6',cat:'physics',stage:2,level:3,title:'발밑 Raycast가 자기 자신에게 맞는다',
 story:'IsGrounded()를 Raycast로 만들었는데 공중에서도 항상 true가 나와요. 땅 오브젝트들은 모두 Ground 레이어에 있고, 캐릭터 자신에게도 콜라이더가 붙어 있어요. 땅을 밟고 있을 때만 true가 되도록 고쳐 주세요.',
 goals:['IsGrounded()가 Physics2D.Raycast로 발밑(아래 방향)을 검사한다','검사 거리는 checkDistance, 검사 대상은 groundMask(LayerMask)로 제한한다','땅에 맞았을 때만 true, 공중에서는 false를 반환한다 (자기 자신은 무시)'],
 limits:['hit.collider != null 로 맞았는지 판단한다','Raycast에 레이어 마스크를 넘겨야 한다'],
 api:'Physics2D.Raycast(origin, direction, distance, layerMask), RaycastHit2D.collider',
 starter:C`
using UnityEngine;

public class GroundCheck : MonoBehaviour
{
    [SerializeField] private LayerMask groundMask;
    [SerializeField] private float checkDistance = 0.6f;

    public bool IsGrounded()
    {
        // 공중에서도 항상 true 예요
        RaycastHit2D hit = Physics2D.Raycast(transform.position, Vector2.down, checkDistance);
        return hit.collider != null;
    }
}`,
 solution:C`
using UnityEngine;

public class GroundCheck : MonoBehaviour
{
    [SerializeField] private LayerMask groundMask;
    [SerializeField] private float checkDistance = 0.6f;

    public bool IsGrounded()
    {
        RaycastHit2D hit = Physics2D.Raycast(transform.position, Vector2.down, checkDistance, groundMask);
        return hit.collider != null;
    }
}`,
 rules:[
  inFn('Raycast 사용','IsGrounded',/Physics2D\.Raycast\s*\(/,'Physics2D.Raycast로 검사해요.','Physics2D.Raycast(시작점, 방향, 거리, 레이어마스크) 로 발밑을 검사하세요.'),
  inFn('hit.collider로 판정','IsGrounded',/\.collider\s*!=\s*null|\.collider\s*==\s*null/,'hit.collider로 맞았는지 판단해요.','RaycastHit2D가 무엇인가에 맞았는지는 hit.collider != null 로 확인하세요.')
 ],
 test:(api,ok)=>{
  const E=api.env;
  api.set('groundMask',64);api.set('checkDistance',0.6);
  E.groundBelow=false;
  E.ray=(o,d,dist,mask)=>mask===undefined?{collider:'self'}:(mask===64&&E.groundBelow?{collider:'ground'}:{collider:null});
  const air=api.call('IsGrounded');
  ok('공중에서는 false',air===false,'공중에서는 false예요 (자기 자신에 맞지 않아요).','공중인데 true가 나와요. LayerMask를 넘기지 않으면 레이가 자기 자신의 콜라이더에 맞아요.');
  E.groundBelow=true;
  ok('땅 위에서는 true',api.call('IsGrounded')===true,'땅 레이어 위에서는 true예요.','땅 위인데 false예요. groundMask를 네 번째 인자로 넘겼는지 확인하세요.');
  const c=E.rayCalls[E.rayCalls.length-1];
  ok('아래 방향과 거리',!!c&&c[1].y<0&&c[2]===0.6,'아래 방향으로 checkDistance만큼 쏴요.','Vector2.down 방향으로 checkDistance만큼 쏘세요.');
 },
 hints:['레이는 캐릭터의 중심에서 출발해요. 가장 먼저 맞는 콜라이더가 무엇일지 생각해 보세요. 바로 자기 자신이에요.','Raycast는 시작점에서 방향으로 쏜 선이 처음 만나는 콜라이더를 알려줘요. 시작점이 캐릭터 안쪽이면 자기 콜라이더가 먼저 걸립니다.','Physics2D.Raycast에는 어떤 레이어만 검사할지 정하는 layerMask 인자(네 번째)가 있어요.','땅 오브젝트를 전용 레이어에 두고, 그 레이어만 담은 LayerMask(groundMask)를 넘기면 자기 자신은 검사 대상에서 빠져요.'],
 why:'Raycast는 기본적으로 모든 레이어를 검사하기 때문에 쏘는 쪽의 콜라이더에 먼저 맞기 쉬워요. LayerMask로 "내가 알고 싶은 대상"만 검사하게 하면 자기 자신·플레이어·장식물에 오작동하는 문제를 구조적으로 막고 검사 비용도 줄어듭니다.',
 concepts:[['Raycast','시작점에서 방향으로 가상의 선을 쏴서 처음 만나는 콜라이더를 검사한다. 접지·시야·히트스캔에 쓴다.'],['LayerMask','검사할 레이어를 고르는 비트 마스크. Raycast에 넘기면 해당 레이어만 검사한다.'],['RaycastHit2D.collider','Raycast가 맞춘 콜라이더. null이면 아무것도 맞지 않은 것이다.']]});
