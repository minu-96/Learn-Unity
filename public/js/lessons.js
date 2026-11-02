/* ===== 단계별 개념 카드 =====
   키는 'cat:stage'. 문제를 풀기 전에 읽는 핵심 3줄 + 짧은 예제 코드 + 자주 하는 실수.
   예제는 정답 코드가 아니라 개념을 보여 주는 예시이고, 채점되지 않는다. */
const LESSONS={
 'start:1':{points:['변수는 값을 담는 이름 붙은 상자예요. "형식 이름 = 값;" 으로 만들어요.','정수는 int, 소수는 float(3.5f), 글자는 string("용사"), 참/거짓은 bool이에요.','int끼리 나누면 소수점 아래가 버려져요. 비율은 (float)로 바꿔서 나눠요.'],
  code:`int hp = 100;
float speed = 3.5f;
string name = "용사";
bool isAlive = true;

hp = hp - 30;                    // 값은 바꿀 수 있어요
float ratio = (float)hp / 100;   // 0.7 (그냥 hp / 100 이면 0)`,watch:'float 값에는 f를 붙이고, 줄 끝에는 세미콜론 ; 을 붙여요. 둘 다 자주 빠뜨려요.'},
 'start:2':{points:['if (조건) { ... } 는 조건이 참일 때만 중괄호 안을 실행해요.','else if로 조건을 이어 붙이고, 어디에도 안 맞으면 else가 실행돼요.','그리고는 &&, 또는은 ||, 같다는 == (= 하나는 값을 넣는 대입이에요).'],
  code:`if (hp <= 0)
{
    state = "죽음";
}
else if (hp < 30)
{
    state = "위험";
}
else
{
    state = "생존";
}

bool canEnter = hasKey && level >= 5;`,watch:'"90점 이상"은 >= 90 이에요. > 90 은 90점을 포함하지 않아요.'},
 'start:3':{points:['for (int i = 0; i < 5; i++) { ... } 는 중괄호 안을 5번 되풀이해요.','합계나 개수는 반복문 밖에서 변수를 만들고, 안에서 더해요.','foreach (int x in 배열) 은 배열의 값을 하나씩 꺼내 줘요. 짝수는 x % 2 == 0 이에요.'],
  code:`int sum = 0;
for (int i = 1; i <= 10; i++)
{
    sum += i;            // sum = sum + i
}
// sum은 55

int evens = 0;
foreach (int x in nums)
{
    if (x % 2 == 0) evens++;
}`,watch:'합계 변수를 반복문 안에서 만들면 매번 0으로 돌아가 버려요. 반드시 밖에서 만드세요.'},
 'start:4':{points:['메서드는 이름을 붙인 코드 묶음이에요. "반환형식 이름(매개변수) { ... }" 로 만들어요.','이름(값); 으로 부르면 실행돼요. 만들기만 해서는 아무 일도 일어나지 않아요.','값을 돌려줄 때는 return, 돌려줄 게 없으면 반환형식을 void로 써요.'],
  code:`int Damage(int attack, int defense)
{
    int d = attack - defense;
    if (d < 0) d = 0;
    return d;
}

void Start()
{
    int result = Damage(10, 3);   // 7
}`,watch:'return을 만나면 메서드가 바로 끝나요. 그 아래 코드는 실행되지 않아요.'},
 'start:5':{points:['유니티 스크립트는 MonoBehaviour를 이어받은 클래스예요.','Start는 시작할 때 한 번, Update는 매 프레임 불려요.','이동량에는 Time.deltaTime을 곱하고, 한 번만 일어나는 키 입력은 Input.GetKeyDown을 써요.'],
  code:`public class Walker : MonoBehaviour
{
    public float speed = 2f;

    void Start()
    {
        Debug.Log("시작!");
    }

    void Update()
    {
        transform.Translate(Vector3.right * speed * Time.deltaTime);
        if (Input.GetKeyDown(KeyCode.Space)) Debug.Log("점프!");
    }
}`,watch:'Update 안의 Debug.Log는 매 프레임 찍혀서 콘솔이 금방 가득 차요. 필요한 조건 안에서만 찍으세요.'},
 'csharp:1':{points:['필드는 클래스 안에 두는 변수예요. public은 어디서나, private은 그 클래스 안에서만 접근해요.','[SerializeField] private 필드는 Inspector에 보이지만 다른 클래스는 값을 바꾸지 못해요.','if / for / switch로 흐름을 나눠요. 비교는 ==, 대입은 = 이에요.'],
  code:`public class Player : MonoBehaviour
{
    [SerializeField] private float speed = 5f;   // Inspector에서 조절
    private int hp = 100;                        // 이 클래스 안에서만

    void Start()
    {
        for (int i = 0; i < 3; i++)
        {
            if (hp > 50) hp -= 10;
        }
    }
}`,watch:'float 값에는 5f처럼 f를 붙여야 해요. 5.0은 double이라 float 변수에 바로 넣으면 컴파일 오류가 나요.'},
 'csharp:2':{points:['struct(Vector3 등)는 값이 복사되고, class는 참조(주소)가 복사돼요.','배열은 크기가 고정이고, List<T>는 Add / Remove로 크기가 변해요.','foreach로 도는 동안 같은 컬렉션을 수정하면 예외가 나요.'],
  code:`List<int> scores = new List<int> { 10, 20, 30 };
scores.Add(40);

for (int i = scores.Count - 1; i >= 0; i--)   // 지울 땐 뒤에서부터
{
    if (scores[i] < 25) scores.RemoveAt(i);
}
// scores: 30, 40`,watch:'foreach 안에서 Remove를 부르면 InvalidOperationException이 나요. 지울 땐 뒤에서부터 for로 돌거나, 지울 대상을 따로 모아 두세요.'},
 'csharp:3':{points:['델리게이트는 메서드를 담는 타입이고, event는 밖에서 구독/해제만 하도록 제한한 델리게이트예요.','구독자가 없으면 null이라서 ?.Invoke로 호출해요.','+=로 구독했으면 -=로 해제해요.'],
  code:`public class Health : MonoBehaviour
{
    public event System.Action<int> OnChanged;   // 구독만 허용

    int hp = 100;
    public void Hit(int dmg)
    {
        hp -= dmg;
        OnChanged?.Invoke(hp);   // 구독자가 없으면 null이라 ?. 로 호출
    }
}

// 구독하는 쪽
void OnEnable()  { health.OnChanged += Refresh; }
void OnDisable() { health.OnChanged -= Refresh; }`,watch:'구독만 하고 해제하지 않으면, 사라진 오브젝트가 계속 호출을 받아 오류가 나거나 메모리가 남아요.'},

 'unity:1':{points:['Awake → OnEnable → Start → Update 순서로 호출돼요.','Update는 프레임마다 실행돼서, 초당 이동량에는 Time.deltaTime을 곱해요.','Time.timeScale이 0이면 deltaTime도 0이에요.'],
  code:`void Awake()    { /* 자기 자신 준비: GetComponent 캐싱 */ }
void OnEnable() { /* 활성화될 때마다 */ }
void Start()    { /* 첫 Update 전에 한 번 */ }

void Update()
{
    // 프레임마다 실행 → 초당 이동량에 deltaTime을 곱한다
    transform.Translate(Vector3.right * speed * Time.deltaTime);
}`,watch:'deltaTime을 곱하지 않으면 프레임이 높은 PC에서 더 빨리 움직여요.'},
 'unity:2':{points:['입력은 Update에서 읽고, 물리 힘은 FixedUpdate에서 적용해요.','GetKeyDown은 눌린 그 프레임에만 true예요.','FixedUpdate는 고정된 물리 주기마다 호출돼요.'],
  code:`Rigidbody2D rb;
Vector2 move;
bool jump;

void Update()                       // 입력은 프레임마다 읽기
{
    move.x = Input.GetAxisRaw("Horizontal");
    if (Input.GetKeyDown(KeyCode.Space)) jump = true;
}

void FixedUpdate()                  // 물리는 고정 주기에 적용
{
    rb.velocity = new Vector2(move.x * speed, rb.velocity.y);   // Unity 6에서는 linearVelocity
}`,watch:'GetKeyDown을 FixedUpdate에서 읽으면 입력을 놓칠 수 있어요. Update에서 읽고 값을 넘겨 주세요.'},
 'unity:3':{points:['코루틴은 yield return으로 프레임이나 시간 단위로 나눠 실행하는 함수예요.','반복문 안에서 yield해야 프레임이 나뉘어요.','만든 오브젝트가 비활성화되거나 파괴되면 코루틴도 멈춰요.'],
  code:`IEnumerator Blink()
{
    for (int i = 0; i < 5; i++)
    {
        sprite.enabled = !sprite.enabled;
        yield return new WaitForSeconds(0.1f);   // 0.1초 쉬고 이어서
    }
    sprite.enabled = true;
}

void Hit() { StartCoroutine(Blink()); }`,watch:'yield가 없는 while(true)는 프레임을 넘기지 못해 게임이 멈춰요.'},

 'components:1':{points:['게임 오브젝트는 컴포넌트의 조합이에요.','GetComponent는 비용이 있으니 Awake에서 한 번 가져와 필드에 보관해요.','RequireComponent로 꼭 필요한 컴포넌트를 보장해요.'],
  code:`[RequireComponent(typeof(Rigidbody2D))]
public class Mover : MonoBehaviour
{
    Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();   // 한 번만 가져와 보관
    }

    void FixedUpdate() { rb.AddForce(Vector2.right); }
}`,watch:'GetComponent를 Update에서 매 프레임 부르면 낭비예요. Awake에서 한 번만 가져오세요.'},
 'components:2':{points:['컴포넌트끼리는 직접 참조, 인터페이스, 이벤트로 소통해요.','SendMessage는 문자열 기반이라 느리고 오타에 약해요.','TryGetComponent로 있을 때만 안전하게 가져와요.'],
  code:`public interface IDamageable { void TakeDamage(int amount); }

void OnTriggerEnter2D(Collider2D other)
{
    if (other.TryGetComponent(out IDamageable target))   // 있을 때만
        target.TakeDamage(10);
}`,watch:'SendMessage("TakeDamage")는 철자가 틀려도 컴파일러가 못 잡아요. 인터페이스나 이벤트로 연결하세요.'},

 'physics:1':{points:['Collider는 물리적으로 막고 Collision 이벤트를 보내요. Trigger는 통과하며 Trigger 이벤트를 보내요.','충돌 이벤트가 오려면 보통 한쪽에 Rigidbody가 필요해요.','너무 빠른 물체는 얇은 벽을 통과(터널링)할 수 있어요.'],
  code:`void OnCollisionEnter2D(Collision2D c)      // 막히는 충돌
{
    if (c.gameObject.CompareTag("Wall")) Bounce();
}

void OnTriggerEnter2D(Collider2D other)     // 통과하는 영역(isTrigger)
{
    if (other.CompareTag("Coin")) Destroy(other.gameObject);
}`,watch:'Trigger는 OnCollision이 아니라 OnTrigger 함수로 받아요. Collider에서 Is Trigger 체크 여부를 확인하세요.'},
 'physics:2':{points:['Transform을 직접 옮기면 물리 엔진을 거치지 않아 충돌이 무시돼요.','충돌이 필요한 이동은 Rigidbody의 velocity나 AddForce를 써요.','Raycast는 LayerMask로 검사 대상을 제한해요.'],
  code:`void FixedUpdate()
{
    rb.velocity = new Vector2(dir * speed, rb.velocity.y);   // transform 대신 물리로 이동
}

bool IsGrounded()
{
    return Physics2D.Raycast(transform.position, Vector2.down, 0.6f, groundMask);
}`,watch:'transform.position을 직접 바꾸면 벽을 뚫을 수 있어요. Raycast에는 LayerMask를 줘서 자기 자신과 부딪히지 않게 하세요.'},

 'animation:1':{points:['Animator Controller는 상태 머신이고, 파라미터와 전환 조건으로 상태가 바뀌어요.','파라미터는 Float, Int, Bool, Trigger 네 가지예요.','Has Exit Time이 켜져 있으면 현재 클립이 끝나야 전환이 시작돼요.'],
  code:`// Animator Controller의 파라미터: Speed(Float), IsGrounded(Bool), Jump(Trigger)
anim.SetFloat("Speed", Mathf.Abs(move.x));
anim.SetBool("IsGrounded", grounded);
anim.SetTrigger("Jump");          // 한 번만 발동하는 신호`,watch:'파라미터 이름의 철자가 틀리면 에러 없이 경고만 뜨고 동작하지 않아요. 이름을 상수로 빼 두세요.'},
 'animation:2':{points:['코드에서 SetFloat, SetBool, SetTrigger로 파라미터를 전달해요.','Blend Tree로 여러 클립을 섞어요.','Animation Event는 특정 프레임에 함수를 호출해요.'],
  code:`static readonly int SpeedHash = Animator.StringToHash("Speed");

void Update()
{
    anim.SetFloat(SpeedHash, rb.velocity.magnitude);
}

// Animation Event로 특정 프레임에서 호출되는 함수
public void OnFootstep() { audioSource.Play(); }`,watch:'문자열 대신 StringToHash로 미리 변환한 값을 쓰면 오타와 매 프레임 문자열 비교 비용을 줄여요.'},

 'particle:1':{points:['Main 모듈이 수명·속도·크기·반복 같은 기본값을 정해요.','Emission은 얼마나 자주(Rate) 또는 한꺼번에(Burst) 만들지 정해요.','Shape는 어디에서 어떤 방향으로 나올지 정해요.'],
  code:`var ps = GetComponent<ParticleSystem>();
var main = ps.main;                 // 모듈은 변수로 받아서 수정
main.startLifetime = 1.5f;
main.startSpeed = 4f;
main.loop = false;

var emission = ps.emission;
emission.rateOverTime = 20f;`,watch:'ps.main.startSpeed = 4f; 처럼 한 줄로 쓰면 컴파일 오류(CS1612)예요. 모듈을 var main = ps.main; 으로 받은 뒤 수정하세요.'},
 'particle:2':{points:['Over Lifetime 모듈은 파티클이 살아 있는 동안 색·크기·속도를 바꿔요.','곡선(AnimationCurve)과 그라디언트로 변화 모양을 정해요.','모듈은 enabled = true로 켜야 적용돼요.'],
  code:`var col = ps.colorOverLifetime;
col.enabled = true;

Gradient g = new Gradient();
g.SetKeys(
    new[] { new GradientColorKey(Color.yellow, 0f), new GradientColorKey(Color.red, 1f) },
    new[] { new GradientAlphaKey(1f, 0f), new GradientAlphaKey(0f, 1f) });
col.color = g;                      // 노랑 → 빨강, 서서히 투명`,watch:'Over Lifetime 모듈은 기본이 꺼져 있는 경우가 많아요. enabled를 켜지 않으면 값을 넣어도 변화가 없어요.'},
 'particle:3':{points:['Play / Stop / Emit으로 코드에서 재생을 제어해요.','Stop은 멈추는 방식(StopEmitting / StopEmittingAndClear)을 고를 수 있어요.','maxParticles로 개수 상한을 둬서 성능을 지켜요.'],
  code:`ps.Play();                                                // 재생
ps.Stop(true, ParticleSystemStopBehavior.StopEmitting);   // 새로 만들기만 멈춤

var main = ps.main;
main.maxParticles = 100;                                  // 최대 개수 제한

ps.Emit(30);                                              // 한 번에 30개 터뜨리기`,watch:'파티클을 매번 Instantiate / Destroy하면 GC가 쌓여요. 만들어 둔 것을 Play로 다시 쓰세요.'},

 'juice:1':{points:['행동에 즉시, 여러 감각(시각·소리·움직임)으로 반응하면 조작이 시원해져요.','과하면 정보가 가려지니 중요한 이벤트에만 크게 써요.','피드백은 입력과 결과를 이어 주는 신호예요.'],
  code:`void OnHit()
{
    sprite.color = Color.white;               // 1프레임 번쩍
    audioSource.PlayOneShot(hitSfx);          // 소리
    hitParticles.Play();                      // 입자
    StartCoroutine(HitStop(0.05f));           // 짧은 정지
}

IEnumerator HitStop(float t)
{
    Time.timeScale = 0f;
    yield return new WaitForSecondsRealtime(t);   // 실제 시간으로 기다림
    Time.timeScale = 1f;
}`,watch:'timeScale을 0으로 둔 동안 WaitForSeconds는 흐르지 않아 영원히 안 돌아와요. WaitForSecondsRealtime을 쓰세요.'},
 'juice:2':{points:['Lerp(a, b, t)는 a와 b를 비율 t로 섞어요. 매 프레임 같은 비율을 쓰면 점점 느려지는 감속이 돼요.','MoveTowards는 일정 속도로 가다가 정확히 도착해요.','이징(AnimationCurve)으로 시작과 끝의 가속을 조절해요.'],
  code:`// 목표로 부드럽게: 매 프레임 남은 거리의 일부만큼 이동
transform.position = Vector3.Lerp(
    transform.position, target, 1f - Mathf.Exp(-10f * Time.deltaTime));

// 일정 속도로 도착 보장
transform.position = Vector3.MoveTowards(
    transform.position, target, speed * Time.deltaTime);`,watch:'Lerp의 t에 0.1f 같은 상수를 쓰면 프레임레이트에 따라 느낌이 달라져요. deltaTime을 반영하는 식을 쓰세요.'},
 'juice:3':{points:['화면 흔들림은 위치에 작은 랜덤 오프셋을 더해 만들어요.','시간이 지날수록 세기를 줄이면 자연스러워요.','끝나면 반드시 원래 위치로 되돌려요.'],
  code:`IEnumerator Shake(float power, float time)
{
    Vector3 origin = transform.localPosition;
    for (float t = 0; t < time; t += Time.deltaTime)
    {
        float fade = 1f - t / time;                  // 점점 약해지게
        transform.localPosition = origin + (Vector3)(Random.insideUnitCircle * power * fade);
        yield return null;
    }
    transform.localPosition = origin;                // 원위치 복구
}`,watch:'끝난 뒤 원래 위치로 되돌리지 않으면 카메라가 어긋난 채 남아요. 흔들기가 겹쳐 시작될 때도 origin이 틀어지지 않는지 확인하세요.'},

 'direction:1':{points:['카메라가 대상을 따라가는 코드는 대상이 움직인 뒤인 LateUpdate에서 실행해요.','SmoothDamp는 부드럽게 따라가고, 줌은 orthographicSize나 fieldOfView로 바꿔요.','연출용 카메라 움직임은 입력과 분리해서 생각해요.'],
  code:`Vector3 vel;

void LateUpdate()                                    // 대상이 움직인 뒤에 따라가기
{
    Vector3 goal = target.position + offset;
    transform.position = Vector3.SmoothDamp(transform.position, goal, ref vel, 0.2f);
}

// 줌: orthographic 카메라는 orthographicSize로
cam.orthographicSize = Mathf.Lerp(cam.orthographicSize, 3f, Time.deltaTime * 4f);`,watch:'카메라 이동을 Update에서 하면 대상이 먼저 움직였는지에 따라 화면이 떨려 보일 수 있어요.'},
 'direction:2':{points:['연출은 코루틴으로 "순서대로 기다리며" 만들어요.','연출 중에는 입력을 잠그고, 끝나면 반드시 풀어요.','WaitUntil로 조건이 맞을 때까지 기다릴 수 있어요.'],
  code:`IEnumerator Intro()
{
    input.enabled = false;                       // 연출 중 입력 잠금
    yield return FadeIn(0.5f);
    yield return new WaitForSeconds(0.3f);
    dialogue.Show("여기가 그 폐허군.");
    yield return new WaitUntil(() => dialogue.IsDone);   // 조건 대기
    input.enabled = true;
}`,watch:'연출 코루틴이 중간에 끊겨도 입력 잠금이 풀리는지 확인하세요. 잠금이 풀리지 않으면 플레이어가 조작할 수 없게 돼요.'},
 'direction:3':{points:['UI 전환은 CanvasGroup의 alpha를 시간에 따라 바꿔 만들어요.','일시정지 중에도 진행되게 하려면 unscaledDeltaTime을 써요.','투명해진 UI는 raycast도 꺼야 뒤의 버튼이 눌려요.'],
  code:`IEnumerator FadeOut(CanvasGroup g, float time)
{
    for (float t = 0; t < time; t += Time.unscaledDeltaTime)   // 일시정지 중에도 진행
    {
        g.alpha = 1f - t / time;
        yield return null;
    }
    g.alpha = 0f;
    g.blocksRaycasts = false;                    // 안 보이면 클릭도 막지 않게
}`,watch:'alpha가 0이어도 blocksRaycasts가 켜져 있으면 보이지 않는 UI가 클릭을 가로채요.'},

 'design:1':{points:['데이터(수치)와 동작(코드)을 나누면 기획자가 코드 없이 값을 조절할 수 있어요.','ScriptableObject는 에셋으로 저장되는 데이터 컨테이너예요.','같은 데이터를 여러 오브젝트가 공유할 수 있어요.'],
  code:`[CreateAssetMenu(menuName = "Game/EnemyData")]
public class EnemyData : ScriptableObject
{
    public string displayName;
    public int maxHp;
    public float speed;
}

public class Enemy : MonoBehaviour
{
    [SerializeField] EnemyData data;      // 데이터는 에셋, 동작은 코드
    int hp;
    void Awake() { hp = data.maxHp; }
}`,watch:'ScriptableObject를 공유하는 모든 오브젝트가 같은 값을 봐요. 오브젝트마다 달라지는 값(현재 체력 등)은 따로 필드에 두세요.'},
 'design:2':{points:['상태가 여러 개이고 한 번에 하나만 가능하면 enum으로 표현해요.','bool 여러 개로 상태를 표현하면 동시에 켜지는 모순이 생겨요.','상태마다 할 일과 전환 조건을 나눠 쓰면 읽기 쉬워요.'],
  code:`enum State { Idle, Chase, Attack }
State state = State.Idle;

void Update()
{
    switch (state)
    {
        case State.Idle:   if (SeePlayer()) state = State.Chase; break;
        case State.Chase:  Move(); if (InRange()) state = State.Attack; break;
        case State.Attack: Hit();  if (!InRange()) state = State.Chase; break;
    }
}`,watch:'isRunning, isJumping, isAttacking을 따로 두면 서로 동시에 true인 경우를 일일이 막아야 해요.'},
 'design:3':{points:['서로를 직접 참조하면 하나를 고칠 때 다른 쪽도 같이 깨져요.','이벤트나 인터페이스로 "무슨 일이 일어났다"만 알리면 연결이 느슨해져요.','알리는 쪽은 받는 쪽이 누구인지 몰라도 돼요.'],
  code:`// 점수를 올리는 쪽은 UI를 알지 못한다
public static event System.Action<int> OnScoreChanged;

void AddScore(int v)
{
    score += v;
    OnScoreChanged?.Invoke(score);
}

// UI 쪽
void OnEnable()  { Game.OnScoreChanged += SetText; }
void OnDisable() { Game.OnScoreChanged -= SetText; }`,watch:'구독을 해제하지 않으면 씬을 옮긴 뒤에도 사라진 UI를 호출해 오류가 나요. OnDisable에서 꼭 해제하세요.'},

 'math:1':{points:['벡터는 방향과 크기를 함께 가진 값이에요. 목표 − 현재 = 현재에서 목표로 가는 벡터예요.','magnitude는 길이(거리), normalized는 길이를 1로 맞춘 방향이에요.','방향 × 속력 × deltaTime이 이동량이에요.'],
  code:`Vector2 toTarget = target.position - transform.position;   // 방향 + 거리
float dist = toTarget.magnitude;                            // 거리
Vector2 dir = toTarget.normalized;                          // 길이 1인 방향

rb.velocity = dir * speed;                                  // 방향 × 속력`,watch:'normalized 없이 방향 벡터에 속력을 곱하면 멀수록 빨라져요. 길이를 1로 맞춘 뒤 곱하세요.'},
 'math:2':{points:['Lerp(a, b, t)는 t(0~1)로 두 값을 섞어요. t는 0~1로 잘려요.','ClampMagnitude는 벡터 길이를 제한해요. 대각선 이동이 더 빨라지는 문제를 막아요.','각도는 360도에서 되감기므로 LerpAngle을 써요.'],
  code:`// 0~1 사이 비율 t로 a와 b를 섞는다
Vector3 p = Vector3.Lerp(a, b, t);

// 대각선이 더 빠르지 않게
Vector3 v = Vector3.ClampMagnitude(input, 1f);

// 각도 사이 보간 (359도 → 1도 같은 경우도 짧은 쪽으로)
float angle = Mathf.LerpAngle(current, target, 0.2f);`,watch:'Lerp의 t가 1을 넘어도 목표를 지나치지 않고 멈춰요. 지나치게 하려면 LerpUnclamped를 써야 해요.'},

 'debug:1':{points:['에러 메시지는 "무슨 일(종류) + 어디(파일:줄)"로 읽어요.','NullReferenceException은 비어 있는 변수를 쓸 때, IndexOutOfRange는 범위를 벗어난 번호를 쓸 때 나요.','맨 위에서 내가 쓴 코드 줄부터 확인해요.'],
  code:`NullReferenceException: Object reference not set to an instance of an object
Player.Update () (at Assets/Scripts/Player.cs:23)
//  ↑ 종류                                                ↑ 파일 : 줄 번호

// Player.cs 23번째 줄에서 값이 비어 있는 변수를 사용했다는 뜻`,watch:'에러가 한 번만 나면 Start / Awake를, 매 프레임 쏟아지면 Update를 먼저 의심하세요.'},
 'debug:2':{points:['추측하지 말고 값을 찍거나 중단점으로 확인해요.','버그가 나는 순서를 적어 두면 범위를 좁힐 수 있어요.','한 번에 하나만 바꿔서 원인을 확인해요.'],
  code:`Debug.Log($"hp={hp}, dmg={dmg}");           // 값을 찍어서 가정 확인
Debug.Assert(hp >= 0, "hp가 음수가 됨");    // 이 조건이 깨지면 알려 준다

// 특정 조건에서만 멈추기: Visual Studio / Rider의 조건부 중단점`,watch:'Update에서 Debug.Log를 매 프레임 찍으면 콘솔이 묻혀요. 조건이 맞을 때만 찍으세요.'},

 'optimization:1':{points:['Update 안에서 new, 문자열 이어 붙이기, LINQ는 메모리를 할당해요.','할당이 쌓이면 GC가 돌면서 순간적으로 끊겨요.','바뀔 때만 갱신하고, 컬렉션은 필드로 두고 재사용해요.'],
  code:`// 나쁨: 매 프레임 새 문자열·리스트 할당
void Update() { label.text = "HP " + hp; var list = new List<int>(); }

// 좋음: 바뀔 때만 갱신 / 미리 만들어 재사용
void SetHp(int v) { if (v == hp) return; hp = v; label.text = $"HP {v}"; }
readonly List<int> buffer = new List<int>();   // 필드로 재사용, 쓸 때 Clear()`,watch:'GC 끊김은 평소엔 괜찮다가 특정 순간에 튀어서 눈치채기 어려워요. Profiler의 GC Alloc 열로 확인하세요.'},
 'optimization:2':{points:['추측하지 말고 Profiler로 병목이 CPU인지 GPU인지부터 구분해요.','같은 머티리얼을 쓰면 드로우콜을 묶기 쉬워요.','renderer.material을 읽는 순간 복제본이 만들어져요.'],
  code:`// Window > Analysis > Profiler 로 먼저 측정

// 값만 바꿀 때는 머티리얼을 복제하지 않는 MaterialPropertyBlock
var block = new MaterialPropertyBlock();
renderer.GetPropertyBlock(block);
block.SetColor("_Color", Color.red);
renderer.SetPropertyBlock(block);`,watch:'renderer.material을 부르면 오브젝트마다 머티리얼 복제본이 생겨 배칭이 깨져요. 읽기만 할 땐 sharedMaterial을 쓰세요.'}
};
