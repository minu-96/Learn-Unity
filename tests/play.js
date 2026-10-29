// 플레이테스트: 학생이 실제로 쓸 법한 다양한 풀이(맞는 것/틀린 것)를 채점해 본다
const fs=require('fs');
const {PROBLEMS,gradeAll,engine,CS}=require('./load.js');

const run=o=>Promise.resolve(engine(o));
const V=[]; // [id, expect 'pass'|'fail', 설명, code, (fail일 때 메시지에 포함되어야 할 문구)]
const P=(id,note,code)=>V.push([id,'pass',note,code]);
const F=(id,note,code,hit)=>V.push([id,'fail',note,code,hit]);

/* ---- 이동/시뮬레이션: 벡터 연산자로 쓴 풀이 ---- */
P('s1','벡터 연산자 +=',`public float speed = 80f;
void Update()
{
    transform.position += Vector3.right * speed * Time.deltaTime;
}`);
P('s1','Translate',`[SerializeField] private float speed = 80f;
void Update() { transform.Translate(speed * Time.deltaTime, 0f, 0f); }`);
P('s1','클래스 전체 + new Vector3',`using UnityEngine;
public class Mover : MonoBehaviour
{
    public float speed = 80f;
    void Update()
    {
        transform.position = transform.position + new Vector3(speed * Time.deltaTime, 0, 0);
    }
}`);
F('s1','deltaTime 없이',`public float speed = 80f;
void Update() { transform.position += Vector3.right * speed / 60f; }`,'deltaTime');
F('s1','CS1612',`public float speed = 80f;
void Update() { transform.position.x += speed * Time.deltaTime; }`,'CS1612');
P('s2','Mathf.Sign 대신 bool 방향',`public float speed = 100f;
bool goingRight = true;
float dir = 1f;
void Update()
{
    Vector3 p = transform.position;
    p += Vector3.right * (goingRight ? 1 : -1) * speed * Time.deltaTime;
    if (p.x >= 420f) { p.x = 420f; goingRight = false; }
    if (p.x <= 60f) { p.x = 60f; goingRight = true; }
    transform.position = p;
}`);
P('j6','벡터 Lerp + Exp',`public float follow = 5f;
void Update()
{
    transform.position = Vector3.Lerp(transform.position, target.position, 1f - Mathf.Exp(-follow * Time.deltaTime));
}`);
P('j6','target 필드를 직접 선언',`public Transform target;
public float follow = 5f;
void LateUpdate() { }
void Update()
{
    float t = 1 - Mathf.Exp(-follow * Time.deltaTime);
    transform.position = Vector2.Lerp(transform.position, target.position, t);
}`);
P('s3','방향 벡터 직접 계산',`public float speed = 100f;
void Update()
{
    Vector3 toTarget = target.position - transform.position;
    float step = speed * Time.deltaTime;
    if (toTarget.magnitude <= step) transform.position = target.position;
    else transform.position += toTarget.normalized * step;
}`);
F('s3','Lerp 에 speed*deltaTime',`public float speed = 100f;
void Update()
{
    transform.position = Vector2.Lerp(transform.position, target.position, speed * Time.deltaTime * 0.01f);
}`,'속도');
P('g5','switch + 벡터 연산',`enum State { Patrol, Chase }
State state;
public float patrolSpeed = 80f, chaseSpeed = 150f, sightRange = 120f;
float dir = 1;
void Update()
{
    float d = Vector2.Distance(transform.position, target.position);
    state = d < sightRange ? State.Chase : State.Patrol;
    switch (state)
    {
        case State.Patrol:
            transform.position += Vector3.right * dir * patrolSpeed * Time.deltaTime;
            if (transform.position.x > 420) dir = -1;
            if (transform.position.x < 60) dir = 1;
            break;
        case State.Chase:
            Vector3 to = (target.position - transform.position).normalized;
            transform.position += to * chaseSpeed * Time.deltaTime;
            break;
    }
}`);
/* ---- 셰이크: 벡터 연산 ---- */
P('j8','벡터 연산 + var',`using System.Collections;
using UnityEngine;
public class CameraShake : MonoBehaviour
{
    IEnumerator Shake(float duration, float power)
    {
        var origin = transform.position;
        float elapsed = 0f;
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float strength = power * (1f - elapsed / duration);
            Vector3 offset = new Vector3(Random.Range(-1f, 1f), Random.Range(-1f, 1f), 0f) * strength;
            transform.position = origin + offset;
            yield return null;
        }
        transform.position = origin;
    }
}`);
F('j8','감쇠 없음',`using System.Collections;
using UnityEngine;
public class CameraShake : MonoBehaviour
{
    IEnumerator Shake(float duration, float power)
    {
        Vector3 origin = transform.position;
        float t = 0f;
        while (t < duration)
        {
            t += Time.deltaTime;
            transform.position = origin + new Vector3(Random.Range(-1f, 1f), Random.Range(-1f, 1f), 0) * power;
            yield return null;
        }
        transform.position = origin;
    }
}`,'약해');
P('j9','프로퍼티 + 벡터',`using UnityEngine;
public class TraumaShake : MonoBehaviour
{
    public float maxOffset = 1f;
    public float decayPerSecond = 1f;
    private Vector3 basePos;
    private float trauma;
    float Shake => trauma * trauma;

    void Awake() { basePos = transform.position; }

    public void AddTrauma(float amount) { trauma = Mathf.Min(1f, trauma + amount); }

    void Update()
    {
        trauma -= decayPerSecond * Time.deltaTime;
        if (trauma < 0) trauma = 0;
        Vector3 offset = new Vector3(Random.Range(-1f, 1f), Random.Range(-1f, 1f), 0) * maxOffset * Shake;
        transform.position = basePos + offset;
    }
}`);
/* ---- 수학 ---- */
P('m1','ClampMagnitude',`Vector2 MoveVelocity(float h, float v, float speed)
{
    return Vector2.ClampMagnitude(new Vector2(h, v), 1f) * speed;
}`);
P('m1','normalized',`Vector2 MoveVelocity(float h, float v, float speed)
{
    Vector2 input = new Vector2(h, v);
    if (input.magnitude > 1f) input = input.normalized;
    return input * speed;
}`);
F('m1','항상 normalized',`Vector2 MoveVelocity(float h, float v, float speed)
{
    return new Vector2(h, v).normalized * speed;
}`,'기울');
P('m2','Vector2.Dot',`bool InFov(float fx, float fy, float tx, float ty, float halfAngle)
{
    Vector2 to = new Vector2(tx, ty);
    if (to == Vector2.zero) return false;
    return Vector2.Dot(new Vector2(fx, fy), to.normalized) >= Mathf.Cos(halfAngle * Mathf.Deg2Rad);
}`);
P('m3','DeltaAngle',`float ShortestAngle(float from, float to) => Mathf.DeltaAngle(from, to);`);
P('m3','while로 감싸기',`float ShortestAngle(float from, float to)
{
    float d = (to - from) % 360f;
    while (d > 180f) d -= 360f;
    while (d < -180f) d += 360f;
    return d;
}`);
P('m4','직접 구현',`float Approach(float current, float target, float maxStep)
{
    float diff = target - current;
    if (Mathf.Abs(diff) <= maxStep) return target;
    return current + Mathf.Sign(diff) * maxStep;
}`);
P('m6','Vector2.Lerp + up',`Vector2 Arc(float ax, float ay, float bx, float by, float t, float height)
{
    t = Mathf.Clamp01(t);
    Vector2 p = Vector2.Lerp(new Vector2(ax, ay), new Vector2(bx, by), t);
    return p + Vector2.up * (4 * height * t * (1 - t));
}`);
/* ---- C# 문법 ---- */
P('c6','float 지역 변수로 나누기',`float HpRatio(int hp, int maxHp)
{
    if (maxHp <= 0) return 0f;
    float ratio = hp / (float)maxHp;
    return Mathf.Clamp01(ratio);
}
int HpPercent(int hp, int maxHp)
{
    return Mathf.RoundToInt(HpRatio(hp, maxHp) * 100);
}`);
F('c6','정수 나눗셈 버그 그대로',`float HpRatio(int hp, int maxHp)
{
    if (maxHp <= 0) return 0f;
    return Mathf.Clamp01(hp / maxHp);
}
int HpPercent(int hp, int maxHp)
{
    return Mathf.RoundToInt(HpRatio(hp, maxHp) * 100);
}`,'0.25');
F('c6','float → int 대입 컴파일 오류',`float HpRatio(int hp, int maxHp)
{
    if (maxHp <= 0) return 0f;
    return Mathf.Clamp01((float)hp / maxHp);
}
int HpPercent(int hp, int maxHp)
{
    int p = HpRatio(hp, maxHp) * 100;
    return p;
}`,'CS0266');
P('c2','뒤에서부터 for',`using System.Collections.Generic;
void RemoveDead(List<int> hps)
{
    for (int i = hps.Count - 1; i >= 0; i--)
        if (hps[i] <= 0) hps.RemoveAt(i);
}
int CountAlive(List<int> hps)
{
    int n = 0;
    for (int i = 0; i < hps.Count; i++) if (hps[i] > 0) n++;
    return n;
}`);
F('c2','foreach 안에서 Remove',`using System.Collections.Generic;
void RemoveDead(List<int> hps)
{
    foreach (int hp in hps)
        if (hp <= 0) hps.Remove(hp);
}
int CountAlive(List<int> hps) { return hps.Count; }`,'');
P('c8','Count 프로퍼티 + 표현식 본문',`using System.Collections.Generic;
using UnityEngine;
public class Inventory : MonoBehaviour
{
    public int capacity = 3;
    private List<string> bag = new List<string>();
    bool IsFull => bag.Count >= capacity;
    bool AddItem(string name)
    {
        if (IsFull || bag.Contains(name)) return false;
        bag.Add(name);
        return true;
    }
    bool RemoveItem(string name) => bag.Remove(name);
    int ItemCount() => bag.Count;
}`);
P('c4','if (OnDied != null)',`using System;
using UnityEngine;
public class Health : MonoBehaviour
{
    [SerializeField] private int maxHp = 100;
    private int hp;
    private bool isDead;
    public event Action<int, int> OnHealthChanged;
    public event Action OnDied;
    void Awake() { hp = maxHp; }
    public void TakeDamage(int dmg)
    {
        if (isDead) return;
        if (dmg <= 0) return;
        hp -= dmg;
        if (hp < 0) hp = 0;
        if (OnHealthChanged != null) OnHealthChanged(hp, maxHp);
        if (hp == 0 && !isDead)
        {
            isDead = true;
            if (OnDied != null) OnDied();
        }
    }
}`);
/* ---- Unity 핵심 ---- */
P('u10','필드로 지연 시간',`using System.Collections;
using UnityEngine;
public class Spawner : MonoBehaviour
{
    public GameObject enemyPrefab;
    public float delay = 2f;
    public int spawned;
    void Start() { StartCoroutine(SpawnAfterDelay()); }
    IEnumerator SpawnAfterDelay()
    {
        yield return new WaitForSeconds(delay);
        Instantiate(enemyPrefab);
        spawned++;
    }
}`);
P('u4','for 루프 + Mathf.Lerp',`using System.Collections;
using UnityEngine;
public class FadeOut : MonoBehaviour
{
    public float duration = 1f;
    float alpha = 1f;
    IEnumerator Fade()
    {
        for (float t = 0; t < duration; t += Time.deltaTime)
        {
            alpha = Mathf.Lerp(1f, 0f, t / duration);
            yield return null;
        }
        alpha = 0f;
        gameObject.SetActive(false);
    }
}`);
F('u4','yield 없이 무한 루프',`using System.Collections;
using UnityEngine;
public class FadeOut : MonoBehaviour
{
    public float duration = 1f;
    float alpha = 1f;
    IEnumerator Fade()
    {
        while (alpha > 0f)
        {
            alpha -= Time.deltaTime / duration * 0;
        }
        yield return null;
    }
}`,'');
/* ---- 컴포넌트 ---- */
P('d1','TryGetComponent',`using UnityEngine;
public class Mover : MonoBehaviour
{
    [SerializeField] private float speed = 5f;
    [SerializeField] private Rigidbody2D rb;
    void Awake() { TryGetComponent(out rb); }
    void Update()
    {
        rb.velocity = new Vector2(Input.GetAxisRaw("Horizontal") * speed, rb.velocity.y);
        if (Input.GetKeyDown(KeyCode.Space)) rb.velocity = new Vector2(rb.velocity.x, 8f);
    }
}`);
P('k3','TryGetComponent(out Health h)',null);
/* ---- 물리 ---- */
P('y2','collider.CompareTag',null);
P('y4','Sign으로 제한',`using UnityEngine;
public class ForceMover : MonoBehaviour
{
    public float accel = 30f;
    public float maxSpeed = 8f;
    private Rigidbody2D rb;
    private float moveX;
    void Awake() => rb = GetComponent<Rigidbody2D>();
    void Update() => moveX = Input.GetAxis("Horizontal");
    void FixedUpdate()
    {
        rb.AddForce(Vector2.right * moveX * accel);
        if (Mathf.Abs(rb.velocity.x) > maxSpeed)
            rb.velocity = new Vector2(Mathf.Sign(rb.velocity.x) * maxSpeed, rb.velocity.y);
    }
}`);
/* ---- 연출/설계/디버깅/최적화 ---- */
P('v1','Max/Min로 제한',`using UnityEngine;
public class FollowCamera : MonoBehaviour
{
    public Transform target;
    public Vector3 offset = new Vector3(0f, 2f, -10f);
    public float minX = -5f;
    public float maxX = 5f;
    void LateUpdate()
    {
        Vector3 p = target.position + offset;
        p.x = Mathf.Max(minX, Mathf.Min(maxX, p.x));
        transform.position = p;
    }
}`);
P('v8','중괄호 형태',null);
P('b2','중괄호 형태',`using UnityEngine;
public class Chaser : MonoBehaviour
{
    public Transform target;
    public float speed = 2f;
    void Update()
    {
        if (target == null)
        {
            return;
        }
        float dir = target.position.x > transform.position.x ? 1f : -1f;
        transform.position += new Vector3(dir * speed * Time.deltaTime, 0, 0);
    }
}`);
F('b3','범위 검사 없이',`using UnityEngine;
public class Patrol : MonoBehaviour
{
    public float[] xs;
    private int index;
    public float NextX()
    {
        float x = xs[index];
        index = index + 1;
        if (index > xs.Length) index = 0;
        return x;
    }
}`,'에러');
P('b3','if로 되돌리기',`using UnityEngine;
public class Patrol : MonoBehaviour
{
    public float[] xs;
    private int index;
    public float NextX()
    {
        if (xs == null || xs.Length == 0) return 0;
        float x = xs[index];
        index++;
        if (index >= xs.Length) index = 0;
        return x;
    }
}`);
P('b6','뒤에서부터 for',null);
P('g6','HashSet 규칙표',`using System.Collections.Generic;
enum PS { Idle, Run, Jump, Fall, Attack, Dead }
bool CanTransition(PS from, PS to)
{
    if (from == to || from == PS.Dead) return false;
    if (to == PS.Dead) return true;
    switch (from)
    {
        case PS.Idle: return to == PS.Run || to == PS.Jump || to == PS.Attack;
        case PS.Run: return to == PS.Idle || to == PS.Jump || to == PS.Attack;
        case PS.Jump: return to == PS.Fall;
        case PS.Fall: case PS.Attack: return to == PS.Idle;
    }
    return false;
}`);
P('o1','lastScore + ToString',`using UnityEngine;
using UnityEngine.UI;
public class ScoreUI : MonoBehaviour
{
    public Text scoreText;
    public int score;
    private int lastScore = int.MinValue;
    void Update()
    {
        if (lastScore != score)
        {
            lastScore = score;
            scoreText.text = "Score: " + score.ToString();
        }
    }
}`);
P('o2','Queue 사용',`using System.Collections.Generic;
using UnityEngine;
public class BulletPool : MonoBehaviour
{
    public GameObject prefab;
    private Queue<GameObject> pool = new Queue<GameObject>();
    public GameObject Get()
    {
        GameObject obj = pool.Count > 0 ? pool.Dequeue() : Instantiate(prefab);
        obj.SetActive(true);
        return obj;
    }
    public void Release(GameObject obj)
    {
        obj.SetActive(false);
        pool.Enqueue(obj);
    }
}`);
P('o3','foreach 없이 min 추적',`int NearestIndex(float[] xs, float px)
{
    if (xs.Length == 0) return -1;
    int best = 0;
    for (int i = 1; i < xs.Length; i++)
        if (Mathf.Abs(xs[i] - px) < Mathf.Abs(xs[best] - px)) best = i;
    return best;
}`);
P('j2','unscaledDeltaTime 루프',`using System.Collections;
using UnityEngine;
public class HitStopper : MonoBehaviour
{
    IEnumerator HitStop()
    {
        Time.timeScale = 0.05f;
        float t = 0f;
        while (t < 0.06f)
        {
            t += Time.unscaledDeltaTime;
            yield return null;
        }
        Time.timeScale = 1f;
    }
}`);
P('j3','if로 최댓값',`using UnityEngine;
public class JuiceSettings : MonoBehaviour
{
    public bool juiceEnabled = true;
    public bool reduceMotion = false;
    public float intensity = 0.5f;
    public float maxPower = 1f;
    public float shake;
    float Scaled(float power)
    {
        if (!juiceEnabled) return 0;
        if (reduceMotion) return 0;
        float v = power * intensity;
        return v > maxPower ? maxPower : v;
    }
    public void ApplyShake(float power)
    {
        float s = Scaled(power);
        if (s > shake) shake = s;
    }
}`);
F('j3','double 리터럴',`using UnityEngine;
public class JuiceSettings : MonoBehaviour
{
    public bool juiceEnabled = true;
    public bool reduceMotion = false;
    public float intensity = 0.5;
    public float maxPower = 1f;
    public float shake;
    float Scaled(float power) { return 0; }
    public void ApplyShake(float power) { }
}`,'CS0664');
P('j5','곱셈으로 세제곱',`using System.Collections;
using UnityEngine;
public class PopUp : MonoBehaviour
{
    public float duration = 0.25f;
    float EaseOutBack(float t)
    {
        const float c1 = 1.70158f;
        const float c3 = c1 + 1f;
        float u = t - 1f;
        return 1f + c3 * u * u * u + c1 * u * u;
    }
    IEnumerator PopIn()
    {
        for (float e = 0; e < duration; e += Time.deltaTime)
        {
            float s = EaseOutBack(e / duration);
            transform.localScale = Vector3.one * s;
            yield return null;
        }
        transform.localScale = Vector3.one;
    }
}`);
P('j1','변수에 담아 재생',`using UnityEngine;
public class HitFeedback : MonoBehaviour
{
    [SerializeField] private AudioSource audioSource;
    [SerializeField] private AudioClip hitClip;
    [SerializeField] private ParticleSystem hitFx;
    [SerializeField] private int debrisCount = 8;
    public void OnHit()
    {
        float pitch = Random.Range(0.9f, 1.1f);
        audioSource.pitch = pitch;
        audioSource.PlayOneShot(hitClip);
        hitFx.Emit(debrisCount);
    }
}`);
F('_','문법 오류: 세미콜론',`public float speed = 80f
void Update() { }`,'세미콜론');

/* ---- 배치 2: 애니메이션/물리/컴포넌트/Unity ---- */
P('a2','해시 + linearVelocity',`using UnityEngine;
public class AnimatorBridge : MonoBehaviour
{
    static readonly int RunHash = Animator.StringToHash("IsRunning");
    static readonly int GroundHash = Animator.StringToHash("IsGrounded");
    public float runThreshold = 0.1f;
    Animator anim;
    Rigidbody2D rb;
    bool grounded;
    void Awake() { anim = GetComponent<Animator>(); rb = GetComponent<Rigidbody2D>(); }
    void Update()
    {
        anim.SetBool(RunHash, Mathf.Abs(rb.linearVelocity.x) > runThreshold);
        anim.SetBool(GroundHash, grounded);
    }
}`);
P('a1','해시 트리거',`using UnityEngine;
public class PlayerAttack : MonoBehaviour
{
    private static readonly int AttackHash = Animator.StringToHash("Attack");
    private Animator anim;
    void Awake() => anim = GetComponent<Animator>();
    void Update()
    {
        if (Input.GetButtonDown("Fire1")) anim.SetTrigger(AttackHash);
    }
}`);
F('p3','main 모듈 직접 대입(CS1612)',`using UnityEngine;
public class HitSpark : MonoBehaviour
{
    void Awake()
    {
        ParticleSystem ps = GetComponent<ParticleSystem>();
        ps.main.loop = false;
        ps.main.stopAction = ParticleSystemStopAction.Destroy;
        ps.Play();
    }
}`,'CS1612');
P('y5','GetButtonDown("Jump")',`using UnityEngine;
public class Jumper : MonoBehaviour
{
    public float jumpForce = 7f;
    Rigidbody2D rb;
    bool grounded;
    void Awake() { rb = GetComponent<Rigidbody2D>(); }
    void Update()
    {
        if (grounded && Input.GetButtonDown("Jump"))
        {
            rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
            grounded = false;
        }
    }
    void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.collider.CompareTag("Ground")) grounded = true;
    }
    void OnCollisionExit2D(Collision2D collision)
    {
        if (collision.collider.CompareTag("Ground")) grounded = false;
    }
}`);
P('u3','linearVelocity (Unity 6)',`using UnityEngine;
public class Mover : MonoBehaviour
{
    public float speed = 6f;
    Rigidbody2D rb;
    float moveX;
    void Awake() { rb = GetComponent<Rigidbody2D>(); }
    void Update() { moveX = Input.GetAxis("Horizontal"); }
    void FixedUpdate() { rb.linearVelocity = new Vector2(moveX * speed, rb.linearVelocity.y); }
}`);
P('k5','named argument',`using UnityEngine;
using UnityEngine.UI;
public class HudController : MonoBehaviour
{
    public void ShowWarning()
    {
        var icon = GetComponentInChildren<Image>(includeInactive: true);
        if (icon) icon.gameObject.SetActive(true);
    }
}`);
P('u8','else if 묶음 + 프로퍼티 없이',`public int jumpCount;
public float charge;
public float fired;
void Update()
{
    if (Input.GetKeyDown(KeyCode.Space)) jumpCount += 1;
    if (Input.GetKey(KeyCode.Space)) charge = charge + Time.deltaTime;
    if (Input.GetKeyUp(KeyCode.Space)) { fired = charge; charge = 0; }
}`);
P('u9','Vector2 연산',`public float speed = 5f;
public float dirX = 1f;
private Rigidbody2D rb;
void Awake() { rb = GetComponent<Rigidbody2D>(); }
void ApplyVelocity() { rb.velocity = new Vector2(dirX * speed, rb.velocity.y); }
void ApplyStep() { rb.MovePosition(rb.position + Vector2.right * dirX * speed * Time.fixedDeltaTime); }`);
P('u7','Mathf.Clamp01',`public float fadeSpeed = 2f;
float alpha;
public void Pause() { Time.timeScale = 0; alpha = 0; }
public void Resume() { Time.timeScale = 1; }
void Update() { alpha = Mathf.Clamp01(alpha + fadeSpeed * Time.unscaledDeltaTime); }`);
P('p7','Clear 따로',`using UnityEngine;
public class FxController : MonoBehaviour
{
    ParticleSystem ps;
    void Awake() { ps = GetComponent<ParticleSystem>(); }
    public void StopImmediately() { ps.Stop(); ps.Clear(); }
    public void FadeOut() { ps.Stop(true, ParticleSystemStopBehavior.StopEmitting); }
}`);
P('y1','tag 상수',`using UnityEngine;
public class Coin : MonoBehaviour
{
    const string PlayerTag = "Player";
    public int value = 1;
    public static int collected;
    void Awake() { GetComponent<Collider2D>().isTrigger = true; }
    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag(PlayerTag))
        {
            collected += value;
            Destroy(gameObject);
        }
    }
}`);

(async()=>{
 let bad=0;
 for(const [id,exp,note,code,hit] of V){
  if(!code)continue;
  const p=PROBLEMS.find(x=>x.id===(id==='_'?'s1':id));
  const g=await gradeAll(p,code,run);
  const failed=g.items.filter(i=>!i.ok);
  const msgs=failed.map(i=>i.label+': '+i.msg).join(' | ');
  const ok=exp==='pass'?g.pass:(!g.pass&&(!hit||msgs.includes(hit)));
  if(!ok)bad++;
  console.log((ok?'✓':'✗'),id,exp,'—',note,ok&&exp==='pass'?'':'\n     → '+(g.pass?'통과함':msgs.slice(0,400)));
 }
 console.log('playtest bad',bad,'/',V.filter(v=>v[3]).length);
})();
