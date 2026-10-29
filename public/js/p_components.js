/* ===== 컴포넌트 ===== */
Q({id:'d1',cat:'components',stage:1,level:1,title:'Update마다 GetComponent를 부르고 있다',
 story:'점프 스크립트가 Update에서 매 프레임 GetComponent<Rigidbody2D>()로 컴포넌트를 찾고 있어요. 컴포넌트 검색은 가벼운 작업이 아니라서, 이런 호출이 쌓이면 성능이 떨어집니다. 한 번만 찾아서 재사용하도록 바꿔 주세요.',
 goals:['Rigidbody2D를 가리키는 필드(rb)를 만든다','Awake에서 GetComponent로 한 번만 가져와 rb에 저장한다','Update에서는 GetComponent를 호출하지 않고 rb를 사용한다','기능은 그대로: 스페이스를 누르면 위쪽 속도가 jumpSpeed가 된다'],
 limits:['Update 안에서 GetComponent 호출 금지','Update 안에서 Rigidbody2D 지역 변수를 새로 만들지 않는다'],
 api:'GetComponent<T>(), Input.GetKeyDown, rb.velocity',
 starter:C`
using UnityEngine;

public class Jumper : MonoBehaviour
{
    public float jumpSpeed = 8f;

    void Update()
    {
        // 매 프레임 컴포넌트를 새로 찾고 있어요
        Rigidbody2D rb = GetComponent<Rigidbody2D>();
        if (Input.GetKeyDown(KeyCode.Space))
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpSpeed);
        }
    }
}`,
 solution:C`
using UnityEngine;

public class Jumper : MonoBehaviour
{
    public float jumpSpeed = 8f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpSpeed);
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
  api.env.Input.GetKeyDown=k=>k==='Space';
  for(let i=0;i<10;i++)api.call('Update');
  const n=api.env.getCalls;
  ok('GetComponent 호출 횟수',n===0,'Update 10번 동안 GetComponent를 한 번도 호출하지 않았어요.',`Update 10번 동안 GetComponent를 ${n}번 호출했어요. 캐싱한 필드를 쓰세요.`);
  ok('점프 동작 유지',rb.velocity.y===8||rb.linearVelocity.y===8,'점프 속도가 정상 적용돼요.','스페이스를 눌렀을 때 y속도가 jumpSpeed(8)가 되어야 해요.');
 },
 hints:['GetComponent는 오브젝트의 컴포넌트 목록을 뒤져서 찾아요. 매 프레임 하면 같은 일을 반복하는 거예요.','결과를 담아 둘 필드를 만들고, 오브젝트가 만들어질 때 한 번만 채워 넣으세요.','Awake는 오브젝트가 만들어질 때 한 번 호출돼요. 필드에 넣어 두면 Update에서 그대로 쓸 수 있어요.'],
 why:'자주 쓰는 컴포넌트 참조는 Awake(또는 Start)에서 한 번 가져와 필드에 캐싱하는 것이 기본 습관이에요. 같은 결과를 매 프레임 다시 계산하는 낭비를 없애고, 코드도 rb 한 단어로 짧아집니다.',
 concepts:[['컴포넌트 캐싱','GetComponent의 결과를 필드에 저장해 재사용하는 것. 보통 Awake에서 한 번만 가져온다.'],['GetComponent 비용','오브젝트의 컴포넌트를 검색하는 작업이라 매 프레임 호출하면 낭비가 쌓인다.']]});

Q({id:'k1',cat:'components',stage:1,level:2,title:'필요한 컴포넌트를 보장하기',
 story:'PlayerMotor는 Rigidbody2D와 CapsuleCollider2D가 있어야 동작해요. 그런데 동료가 이 스크립트만 빈 오브젝트에 붙였다가 NullReferenceException을 만났습니다. 필요한 컴포넌트가 없으면 Unity가 자동으로 붙여 주게 하고, 실수로 스크립트를 두 번 붙이는 일도 막아 주세요.',
 goals:['PlayerMotor를 붙이면 Rigidbody2D와 CapsuleCollider2D가 자동으로 함께 붙게 한다','같은 오브젝트에 PlayerMotor를 두 번 붙일 수 없게 한다','Awake에서 Rigidbody2D를 가져와 rb에 저장한다 (이미 구현)'],
 limits:['코드에서 AddComponent로 직접 붙이지 않는다 — 특성(Attribute)으로 해결한다'],
 starter:C`
using UnityEngine;

// TODO: 필요한 컴포넌트를 보장하고, 중복 부착을 막는 특성을 붙이세요
public class PlayerMotor : MonoBehaviour
{
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(Rigidbody2D), typeof(CapsuleCollider2D))]
[DisallowMultipleComponent]
public class PlayerMotor : MonoBehaviour
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
[RequireComponent(typeof(CapsuleCollider2D))]
[DisallowMultipleComponent]
public class PlayerMotor : MonoBehaviour
{
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }
}`],
 rules:[
  fx('Rigidbody2D 요구',c=>/\[RequireComponent\([^\]]*typeof\(\s*Rigidbody2D\s*\)/.test(c),'Rigidbody2D를 요구해요.','[RequireComponent(typeof(Rigidbody2D))] 를 클래스 위에 붙이세요.'),
  fx('CapsuleCollider2D 요구',c=>/\[RequireComponent\([^\]]*typeof\(\s*CapsuleCollider2D\s*\)/.test(c),'CapsuleCollider2D도 요구해요.','CapsuleCollider2D도 RequireComponent에 포함하세요. 하나의 특성에 typeof를 쉼표로 이어도 되고 특성을 두 번 써도 돼요.'),
  has('중복 부착 방지',/\[DisallowMultipleComponent\]/,'같은 오브젝트에 두 번 붙일 수 없어요.','[DisallowMultipleComponent] 특성을 붙이면 같은 컴포넌트를 두 번 붙일 수 없어요.'),
  fx('특성이 클래스 바로 위',c=>/\]\s*(?:public\s+)?class\s+PlayerMotor/.test(c),'특성이 PlayerMotor 클래스에 붙어 있어요.','특성은 class 선언 바로 위에 적어야 그 클래스에 적용돼요.'),
  no('AddComponent 금지',/\bAddComponent\b/,'AddComponent 없이 특성으로 해결했어요.','이번에는 AddComponent 대신 특성(Attribute)으로 해결해 보세요.')
 ],
 hints:['Unity에는 "이 스크립트는 이 컴포넌트가 꼭 필요해"라고 선언하는 특성이 있어요. 이름에 Require가 들어갑니다.','typeof(컴포넌트 이름)을 인자로 넘겨요: [RequireComponent(typeof(X))]','중복 부착을 막는 특성은 DisallowMultipleComponent 예요.'],
 why:'[RequireComponent]는 의존하는 컴포넌트를 선언해 두면 부착 시 자동으로 붙여 주고, 필요한 컴포넌트를 지우려는 것도 막아 줍니다. 팀 작업에서 "빠뜨려서 생기는 NullReferenceException"을 에디터 단계에서 차단하는 방법이에요.',
 concepts:[['[RequireComponent]','스크립트가 의존하는 컴포넌트를 선언한다. 스크립트를 붙일 때 자동으로 함께 붙고 의존 컴포넌트는 지울 수 없다.'],['[DisallowMultipleComponent]','같은 종류의 컴포넌트를 한 오브젝트에 두 번 붙이지 못하게 막는다.']]});

Q({id:'k2',cat:'components',stage:1,level:3,title:'상속보다 조합: Character 쪼개기',
 story:'슬라임, 박쥐, 포탑이 모두 Character를 상속하고 있어요. 그런데 포탑은 움직이지 않는데도 speed와 Move를 물려받았고, 곧 체력이 없는 움직이는 함정이 추가될 예정입니다. 상속 하나에 모든 기능을 담는 대신 기능별 컴포넌트로 쪼개 주세요.',
 goals:['Character 클래스를 없애고, 체력을 담당하는 Health(hp, TakeDamage)와 이동을 담당하는 Mover(speed, Move)로 나눈다','Turret은 Health만 필요로 한다 ([RequireComponent]로 선언)','Turret에는 이동 관련 코드(speed, Move, Mover)가 없다'],
 limits:['모든 클래스는 MonoBehaviour만 상속한다 (다른 클래스 상속 금지)','Health와 Mover는 서로를 참조하지 않는다'],
 starter:C`
using UnityEngine;

// 모든 몬스터가 Character를 상속하는 구조입니다
public class Character : MonoBehaviour
{
    public int hp = 10;
    public float speed = 2f;

    public void TakeDamage(int dmg) { hp -= dmg; }
    public void Move(Vector2 dir) { transform.Translate(dir * speed * Time.deltaTime); }
}

public class Turret : Character
{
    // 포탑은 움직이지 않는데 Move와 speed를 물려받았습니다
}`,
 solution:C`
using UnityEngine;

public class Health : MonoBehaviour
{
    public int hp = 10;

    public void TakeDamage(int dmg) { hp -= dmg; }
}

public class Mover : MonoBehaviour
{
    public float speed = 2f;

    public void Move(Vector2 dir) { transform.Translate(dir * speed * Time.deltaTime); }
}

[RequireComponent(typeof(Health))]
public class Turret : MonoBehaviour
{
    // 이동 기능 없음: Health만 필요
}`,
 rules:[
  has('Health 컴포넌트',/\bclass\s+Health\s*:\s*MonoBehaviour\b/,'체력을 담당하는 Health 컴포넌트를 만들었어요.','class Health : MonoBehaviour 를 만드세요.'),
  inClass('Health 내용','Health',/\bhp\b[\s\S]*\bTakeDamage\s*\(|\bTakeDamage\s*\([\s\S]*\bhp\b/,'Health가 hp와 TakeDamage를 가지고 있어요.','Health에 hp 필드와 TakeDamage 메서드를 넣으세요.'),
  has('Mover 컴포넌트',/\bclass\s+Mover\s*:\s*MonoBehaviour\b/,'이동을 담당하는 Mover 컴포넌트를 만들었어요.','class Mover : MonoBehaviour 를 만드세요.'),
  inClass('Mover 내용','Mover',/\bspeed\b[\s\S]*\bMove\s*\(|\bMove\s*\([\s\S]*\bspeed\b/,'Mover가 speed와 Move를 가지고 있어요.','Mover에 speed 필드와 Move 메서드를 넣으세요.'),
  no('Character 제거',/\bclass\s+Character\b/,'Character 클래스를 없앴어요.','Character 클래스를 없애고 기능을 Health와 Mover로 나누세요.'),
  no('MonoBehaviour 외 상속 금지',/\bclass\s+\w+\s*:\s*(?!MonoBehaviour\b)\w+/,'모든 클래스가 MonoBehaviour만 상속해요.','다른 클래스를 상속하지 마세요. 필요한 기능은 컴포넌트를 함께 붙여서 조합합니다.'),
  has('Turret은 Health 요구',/\[RequireComponent\(\s*typeof\(\s*Health\s*\)\s*\)\]\s*(?:public\s+)?class\s+Turret\b/,'Turret이 Health를 요구해요.','Turret 위에 [RequireComponent(typeof(Health))] 를 붙여 체력이 필요하다고 선언하세요.'),
  notInClass('Turret에 이동 없음','Turret',/\b(?:speed|Move|Mover)\b/,'Turret에는 이동 관련 코드가 없어요.','Turret은 움직이지 않으니 speed, Move, Mover를 갖지 않아야 해요.'),
  notInClass('Health는 Mover를 모름','Health',/\bMover\b/,'Health가 Mover를 참조하지 않아요.','Health와 Mover는 서로 독립이어야 재사용하기 좋아요.'),
  notInClass('Mover는 Health를 모름','Mover',/\bHealth\b/,'Mover가 Health를 참조하지 않아요.','Health와 Mover는 서로 독립이어야 재사용하기 좋아요.')
 ],
 hints:['"무엇이다(is-a)" 대신 "무엇을 가졌다(has-a)"로 생각해 보세요. 포탑은 체력을 가졌고, 슬라임은 체력과 이동을 가졌어요.','체력 관련 필드·메서드를 모은 클래스 하나, 이동 관련을 모은 클래스 하나를 MonoBehaviour로 만들어요.','Turret이 Health에 의존한다는 선언은 [RequireComponent(typeof(Health))] 로 할 수 있어요.'],
 why:'깊은 상속은 "물려받고 싶지 않은 것까지 물려받는" 문제와 "새 조합이 필요할 때마다 계층이 꼬이는" 문제가 생깁니다. Unity는 게임 오브젝트에 작은 컴포넌트를 조합해 붙이는 구조라서, 기능별로 쪼갠 컴포넌트가 재사용과 확장에 유리해요.',
 concepts:[['컴포넌트 조합(Composition)','기능을 작은 컴포넌트로 나누어 필요한 것만 붙여 쓰는 설계. 깊은 상속 계층보다 유연하다.'],['단일 책임','클래스 하나는 한 가지 역할만 맡게 하는 원칙. Health는 체력, Mover는 이동처럼 나눈다.']]});

Q({id:'k3',cat:'components',stage:2,level:1,title:'SendMessage 대신 직접 호출하기',
 story:'총알이 맞은 대상에게 SendMessage("TakDamage", damage)로 피해를 전달하고 있어요. 그런데 메서드 이름에 오타가 있어도 컴파일 에러가 나지 않고, 받는 쪽이 없으면 조용히 무시돼서 버그를 찾기 어려워요. 컴파일러가 검사해 주는 방식으로 바꿔 주세요.',
 goals:['Hit(other): other의 Health 컴포넌트를 가져와 TakeDamage(damage)를 직접 호출한다','other에 Health가 없으면 아무 일도 하지 않는다 (예외 없음)'],
 limits:['SendMessage / BroadcastMessage 를 쓰지 않는다','메서드 이름을 문자열로 넘기지 않는다'],
 api:'other.GetComponent<Health>()',
 starter:C`
using UnityEngine;

public class Bullet : MonoBehaviour
{
    public int damage = 10;

    void Hit(GameObject other)
    {
        // 문자열 기반이라 오타("TakDamage")가 나도 컴파일 에러가 없어요
        other.SendMessage("TakDamage", damage);
    }
}`,
 solution:C`
using UnityEngine;

public class Bullet : MonoBehaviour
{
    public int damage = 10;

    void Hit(GameObject other)
    {
        Health health = other.GetComponent<Health>();
        if (health != null)
        {
            health.TakeDamage(damage);
        }
    }
}`,
 rules:[
  no('SendMessage 금지',/\b(?:SendMessage|BroadcastMessage|SendMessageUpwards)\s*\(/,'문자열 기반 메시지를 쓰지 않아요.','SendMessage 계열은 메서드 이름을 문자열로 전달해서 오타를 컴파일러가 잡아 주지 못해요. 컴포넌트를 직접 가져와 호출하세요.'),
  inFn('Health 컴포넌트 사용','Hit',/GetComponent\s*<\s*Health\s*>|TryGetComponent\s*(?:<\s*Health\s*>)?\s*\(\s*out\s+(?:Health|var)\b/,'Health 컴포넌트를 타입으로 가져와요.','other.GetComponent<Health>() 또는 TryGetComponent(out Health h) 로 가져오세요.'),
  inFn('TakeDamage 직접 호출','Hit',/\.TakeDamage\s*\(\s*damage\s*\)/,'TakeDamage를 직접 호출해요.','가져온 Health의 TakeDamage(damage)를 직접 호출하세요. 메서드 이름이 틀리면 컴파일 에러가 나요.')
 ],
 test:(api,ok)=>{
  const h={TakeDamage(d){this.got=d}};
  const other=api.mk.go('Enemy',{Health:h});
  api.call('Hit',other);
  ok('Health에 피해 전달',h.got===10,'Health.TakeDamage(10)이 호출됐어요.',`Health에 전달된 피해가 ${h.got} 입니다. damage(10)가 전달되어야 해요.`);
  const wall=api.mk.go('Wall',{});
  api.call('Hit',wall);
  ok('Health 없는 대상',true,'Health가 없는 대상에도 예외가 나지 않아요.','');
 },
 hints:['SendMessage는 "이 이름의 메서드를 찾아서 실행해 줘"라고 문자열로 부탁하는 방식이에요. 이름이 틀려도 에러가 나지 않아요.','대신 other의 Health 컴포넌트를 직접 가져오면 컴파일러가 TakeDamage가 있는지 확인해 줘요.','Health가 없는 오브젝트(벽 등)에 맞았을 수도 있어요. 가져온 값이 null인지 확인하세요.'],
 why:'문자열로 메서드를 호출하면 오타와 시그니처 변경을 컴파일러가 알려주지 못하고 느리기까지 합니다. 컴포넌트를 타입으로 가져와 호출하면 이름 변경·삭제가 컴파일 에러로 바로 드러나요.',
 concepts:[['SendMessage의 단점','메서드 이름을 문자열로 호출해 오타를 컴파일러가 잡지 못하고, 받는 쪽이 없으면 조용히 무시되며 리플렉션 때문에 느리다.'],['타입 안전한 호출','컴포넌트를 타입으로 가져와 호출하면 이름·시그니처 오류를 컴파일 단계에서 알 수 있다.']]});

Q({id:'k4',cat:'components',stage:2,level:2,title:'맞는 대상이 뭔지 몰라도 되는 총알 (인터페이스)',
 story:'총알은 몬스터(Health)뿐 아니라 부술 수 있는 상자(Crate)에도 피해를 줘야 해요. 지금 코드는 other.GetComponent<Crate>().TakeDamage(1) 처럼 구체적인 클래스를 직접 알고 있어서, 대상이 하나 늘 때마다 총알 코드를 고쳐야 합니다. "피해를 받을 수 있다"는 약속(인터페이스)으로 풀어 주세요.',
 goals:['void TakeDamage(int amount) 를 가진 인터페이스 IDamageable 을 정의한다','Crate가 IDamageable을 구현한다: hp가 0 이하가 되면 Destroy(gameObject)','Bullet.Hit(other)는 other에서 IDamageable을 찾아 있을 때만 TakeDamage(damage)를 호출한다'],
 limits:['Bullet은 Crate나 Health 같은 구체 클래스 이름을 쓰지 않는다','IDamageable이 없는 대상(벽)에 맞아도 예외가 나지 않는다 (TryGetComponent 사용)'],
 starter:C`
using UnityEngine;

public class Crate : MonoBehaviour
{
    public int hp = 5;

    public void TakeDamage(int amount)
    {
        hp -= amount;
        if (hp <= 0) Destroy(gameObject);
    }
}

public class Bullet : MonoBehaviour
{
    public int damage = 1;

    void Hit(GameObject other)
    {
        // Bullet이 Crate를 직접 알고 있고, 벽에 맞으면 NullReferenceException이 납니다
        other.GetComponent<Crate>().TakeDamage(damage);
    }
}`,
 solution:C`
using UnityEngine;

public interface IDamageable
{
    void TakeDamage(int amount);
}

public class Crate : MonoBehaviour, IDamageable
{
    public int hp = 5;

    public void TakeDamage(int amount)
    {
        hp -= amount;
        if (hp <= 0) Destroy(gameObject);
    }
}

public class Bullet : MonoBehaviour
{
    public int damage = 1;

    void Hit(GameObject other)
    {
        if (other.TryGetComponent<IDamageable>(out var target))
        {
            target.TakeDamage(damage);
        }
    }
}`,
 rules:[
  has('IDamageable 인터페이스',/\binterface\s+IDamageable\s*\{[^}]*\bvoid\s+TakeDamage\s*\(\s*int\s+\w+\s*\)\s*;[^}]*\}/,'IDamageable 인터페이스를 정의했어요.','public interface IDamageable { void TakeDamage(int amount); } 를 정의하세요.'),
  has('Crate가 구현',/\bclass\s+Crate\s*:\s*MonoBehaviour\s*,\s*IDamageable\b/,'Crate가 IDamageable을 구현해요.','class Crate : MonoBehaviour, IDamageable 처럼 인터페이스를 구현한다고 선언하세요.'),
  inClass('Crate 파괴','Crate',/Destroy\s*\(\s*gameObject\s*\)/,'체력이 0 이하면 파괴돼요.','Crate는 hp가 0 이하가 되면 Destroy(gameObject)를 호출해야 해요.'),
  notInClass('Bullet이 구체 타입을 모름','Bullet',/\b(?:Crate|Health|Enemy)\b/,'Bullet이 구체적인 클래스를 모르고 인터페이스만 알아요.','Bullet 안에 Crate/Health 같은 이름이 있으면 새 대상이 생길 때마다 총알을 고쳐야 해요. IDamageable만 쓰세요.'),
  fx('TryGetComponent로 안전하게',c=>/TryGetComponent\s*<\s*IDamageable\s*>\s*\(\s*out\s+(?:var|IDamageable)\s+(\w+)\s*\)[\s\S]*?\b\1\s*\.\s*TakeDamage\s*\(\s*damage\s*\)/.test(c)||/(\w+)\s*=\s*\w+\.GetComponent<IDamageable>\s*\(\s*\)\s*;\s*if\s*\(\s*\1\s*!=\s*null\s*\)/.test(c),'IDamageable이 있을 때만 TakeDamage를 호출해요.','other.TryGetComponent<IDamageable>(out var target) 로 있을 때만 가져와 target.TakeDamage(damage)를 호출하세요 (또는 GetComponent 후 null 검사).')
 ],
 hints:['인터페이스는 "이 메서드를 가진다"는 약속이에요. 구현하는 클래스는 서로 달라도 호출하는 쪽은 인터페이스만 알면 됩니다.','Crate의 선언에 : MonoBehaviour, IDamageable 처럼 인터페이스를 이어서 적어요.','TryGetComponent<T>(out var x)는 컴포넌트가 있으면 true를 반환하고 x에 담아 줘요. 없어도 예외가 나지 않아요.'],
 why:'호출하는 쪽이 구체 클래스를 알면 대상이 늘 때마다 수정이 번집니다. 인터페이스로 "피해를 받을 수 있다"는 능력만 약속하면 몬스터·상자·플레이어가 서로 달라도 총알 코드는 그대로예요. TryGetComponent는 없을 때를 안전하게 처리해 주고요.',
 concepts:[['인터페이스(interface)','구현해야 할 멤버를 선언만 해 둔 약속. 서로 다른 클래스를 같은 방식으로 다룰 수 있게 한다.'],['TryGetComponent','컴포넌트가 있으면 true와 함께 돌려주고 없으면 false를 반환한다. null 예외 없이 안전하게 가져온다.'],['결합도 낮추기','호출하는 쪽이 구체 클래스를 모르고 약속(인터페이스)만 알도록 해 수정이 번지지 않게 하는 것.']]});

Q({id:'k5',cat:'components',stage:2,level:3,title:'꺼져 있는 자식은 찾아지지 않는다',
 story:'HUD 아래에 평소에는 꺼져 있다가 위험할 때만 켜지는 경고 아이콘(Image)이 있어요. ShowWarning()에서 GetComponentInChildren<Image>()로 찾아 켜려는데 NullReferenceException이 납니다. 아이콘은 분명히 HUD의 자식으로 붙어 있고, 켜 둔 상태에서 실행하면 잘 찾아져요.',
 goals:['ShowWarning()에서 꺼져 있는 자식의 Image도 찾는다','찾은 Image의 gameObject를 활성화한다','자식에 Image가 없으면 아무 일도 하지 않는다 (예외 없음)'],
 limits:['Find, FindObjectOfType 같은 씬 전체 검색은 쓰지 않는다'],
 api:'GetComponentInChildren<T>(bool includeInactive)',
 starter:C`
using UnityEngine;
using UnityEngine.UI;

public class HudController : MonoBehaviour
{
    public void ShowWarning()
    {
        // 여기서 NullReferenceException 이 나요
        Image icon = GetComponentInChildren<Image>();
        icon.gameObject.SetActive(true);
    }
}`,
 solution:C`
using UnityEngine;
using UnityEngine.UI;

public class HudController : MonoBehaviour
{
    public void ShowWarning()
    {
        Image icon = GetComponentInChildren<Image>(true);
        if (icon != null)
        {
            icon.gameObject.SetActive(true);
        }
    }
}`,
 rules:[
  inFn('비활성 포함 검색','ShowWarning',/GetComponentInChildren\s*<\s*Image\s*>\s*\(\s*(?:includeInactive\s*:\s*)?true\s*\)/,'꺼진 자식까지 포함해서 찾아요.','GetComponentInChildren<Image>(true) 처럼 includeInactive를 true로 넘기세요.'),
  inFn('null 검사','ShowWarning',/!=\s*null|\bif\s*\(\s*\w+\s*\)/,'없는 경우를 검사해요.','자식에 Image가 없을 수도 있으니 null이 아닐 때만 활성화하세요.'),
  inFn('활성화','ShowWarning',/gameObject\s*\.\s*SetActive\s*\(\s*true\s*\)/,'찾은 아이콘을 켜요.','icon.gameObject.SetActive(true) 로 오브젝트를 켜세요.'),
  no('씬 전체 검색 금지',/\b(?:GameObject\.Find|FindObjectOfType|FindObjectsOfType|FindFirstObjectByType)\b/,'씬 전체 검색을 쓰지 않았어요.','씬 전체를 뒤지는 Find 계열은 느리고 결합도가 높아요. 자식 검색으로 해결하세요.')
 ],
 test:(api,ok)=>{
  const img={gameObject:{activeSelf:false,SetActive(v){this.activeSelf=v}}};
  api.env.children.Image=img;
  api.call('ShowWarning');
  ok('꺼진 자식 활성화',img.gameObject.activeSelf===true,'꺼져 있던 경고 아이콘이 켜졌어요.','경고 아이콘이 켜지지 않았어요. 비활성 자식을 찾도록 인자를 확인하세요.');
  api.env.children={};
  api.call('ShowWarning');
  ok('Image가 없을 때',true,'Image가 없어도 예외 없이 지나가요.','');
 },
 hints:['"켜 둔 상태에서는 찾아진다"가 결정적인 단서예요. GetComponentInChildren은 기본적으로 비활성화된 오브젝트를 건너뛰어요.','GetComponentInChildren은 기본적으로 활성화된 오브젝트만 검색해요.','인자로 bool 하나를 받는 오버로드가 있어요. 이름이 includeInactive 예요.','찾지 못하면 null이 돌아오니 사용하기 전에 확인하세요.'],
 why:'Unity의 GetComponent 계열 검색(GetComponentInChildren, GetComponentsInChildren, FindObjectsOfType 등)은 기본값이 "활성 오브젝트만"인 경우가 많아요. 꺼져 있다가 켜지는 오브젝트를 찾을 때는 includeInactive 인자를 명시해야 합니다.',
 concepts:[['includeInactive','GetComponentInChildren 등에서 비활성 오브젝트까지 검색할지 정하는 인자. 기본값은 false라 꺼진 자식은 건너뛴다.'],['null 검사','찾기 함수는 못 찾으면 null을 돌려주므로 사용 전에 확인해 NullReferenceException을 막는다.']]});
