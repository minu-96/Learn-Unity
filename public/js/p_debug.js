/* ===== 디버깅 ===== */
Q({id:'b1',cat:'debug',stage:1,level:1,title:'NullReferenceException: rb가 비어 있다',
 story:'넉백을 주려고 Knockback()을 호출하면 콘솔에 이렇게 뜹니다:\nNullReferenceException: Object reference not set to an instance of an object\n  at Mob.Knockback (Mob.cs:12)\n12번째 줄은 rb.AddForce(...) 예요. rb 필드는 선언만 했을 뿐 값을 넣은 적이 없습니다. 원인을 찾아 고쳐 주세요.',
 goals:['Awake에서 Rigidbody2D 컴포넌트를 가져와 rb에 저장한다','Knockback(dir)은 rb.AddForce 로 힘을 한 번 가한다 (dir 방향으로 force 만큼)'],
 limits:['Knockback 안에서 매번 GetComponent 를 호출하지 않는다 (Awake에서 한 번만)'],
 api:'GetComponent<Rigidbody2D>(), rb.AddForce(Vector2)',
 starter:C`
using UnityEngine;

public class Mob : MonoBehaviour
{
    private Rigidbody2D rb;
    public float force = 5f;

    void Awake()
    {
    }

    public void Knockback(float dir)
    {
        rb.AddForce(new Vector2(dir * force, 0f));
    }
}`,
 solution:C`
using UnityEngine;

public class Mob : MonoBehaviour
{
    private Rigidbody2D rb;
    public float force = 5f;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    public void Knockback(float dir)
    {
        rb.AddForce(new Vector2(dir * force, 0f));
    }
}`,
 rules:[
  inFn('Awake에서 캐싱','Awake',/\brb\s*=\s*GetComponent\s*<\s*Rigidbody2D\s*>\s*\(\s*\)|TryGetComponent\s*(?:<\s*Rigidbody2D\s*>)?\s*\(\s*out\s+rb\b/,'Awake에서 rb를 가져와요.','Awake에서 rb = GetComponent<Rigidbody2D>(); 로 채워 주세요.'),
  notIn('Knockback에서 GetComponent 금지','Knockback',/GetComponent/,'Knockback에서 GetComponent를 호출하지 않아요.','매번 GetComponent를 부르지 말고 Awake에서 한 번만 가져오세요.')
 ],
 test:(api,ok)=>{
  const rb=api.mk.rb();api.env.components.Rigidbody2D=rb;
  let err=null;
  try{api.call('Awake');api.call('Knockback',1)}catch(e){err=e}
  ok('에러 없이 실행',!err,'NullReference 없이 실행돼요.','rb가 비어 있어서 에러가 나요. Awake에서 rb에 컴포넌트를 넣어 주세요.');
  ok('힘 적용',rb.forces.length===1&&rb.forces[0][0].x===5,'dir 방향으로 force(5)만큼 힘을 가해요.','Knockback이 rb.AddForce로 (5, 0) 힘을 한 번 가해야 해요.');
 },
 hints:['NullReference는 "비어 있는 변수를 사용했다"는 뜻이에요. 스택 트레이스의 줄 번호가 사용한 위치를 알려줘요.','rb는 선언만 되어 있고 어디서도 값이 채워지지 않았어요. 값을 채울 장소를 생각해 보세요.','Awake에서 GetComponent<Rigidbody2D>()의 결과를 rb에 대입하세요.'],
 why:'NullReference는 가장 흔한 에러예요. 스택 트레이스의 줄에서 "점(.) 앞의 변수"가 비었는지 확인하고, 그 변수가 어디서 채워져야 했는지 찾으세요. 컴포넌트는 Awake에서 한 번 가져와 캐싱하는 것이 정석입니다.',
 concepts:[['NullReferenceException','값이 없는(null) 참조를 통해 멤버에 접근했을 때 발생한다. 스택 트레이스의 줄에서 점 앞의 변수를 의심한다.'],['필드 초기화 시점','private 필드는 선언만으로 채워지지 않는다. Awake/Start에서 GetComponent로 채우거나 Inspector에서 연결해야 한다.']]});

Q({id:'b2',cat:'debug',stage:1,level:2,title:'MissingReferenceException: 파괴된 목표를 계속 쫓는다',
 story:'적이 플레이어를 쫓는 중에 플레이어가 죽어서 Destroy되면 이런 에러가 쏟아집니다:\nMissingReferenceException: The object of type \'Transform\' has been destroyed but you are still trying to access it.\n  at Chaser.Update (Chaser.cs:10)\n목표가 사라졌는지 확인하고 사라졌으면 가만히 있도록 고쳐 주세요.',
 goals:['target 이 null 이면 아무것도 하지 않고 반환한다','target 이 있으면 target 쪽으로 x 방향으로 speed × Time.deltaTime 만큼 이동한다 (target.x가 더 크면 +, 더 작으면 −)'],
 limits:['Unity에서는 Destroy된 오브젝트가 == null 비교로 true가 된다 (if (target == null) 을 사용하세요)'],
 api:'transform.position, Time.deltaTime',
 starter:C`
using UnityEngine;

public class Chaser : MonoBehaviour
{
    public Transform target;
    public float speed = 2f;

    void Update()
    {
        Vector3 pos = transform.position;
        float dir = target.position.x > pos.x ? 1f : -1f;
        pos.x += dir * speed * Time.deltaTime;
        transform.position = pos;
    }
}`,
 solution:C`
using UnityEngine;

public class Chaser : MonoBehaviour
{
    public Transform target;
    public float speed = 2f;

    void Update()
    {
        if (target == null) return;
        Vector3 pos = transform.position;
        float dir = target.position.x > pos.x ? 1f : -1f;
        pos.x += dir * speed * Time.deltaTime;
        transform.position = pos;
    }
}`,
 rules:[inFn('null 검사','Update',/target\s*==\s*null|!\s*target\b|target\s*!=\s*null|target\s+is\s+(?:not\s+)?null/,'target이 없으면 건너뛰어요.','Update 맨 앞에서 if (target == null) return; 으로 사라진 목표를 처리하세요.')],
 test:(api,ok)=>{
  api.env.Time.deltaTime=0.5;api.transform.position={x:0,y:0};
  api.set('target',{position:{x:10,y:0}});
  api.call('Update');
  ok('목표 쫓기',Math.abs(api.transform.position.x-1)<1e-6,'목표가 있으면 쫓아가요 (speed 2 × 0.5초 = 1).',`위치 x가 ${api.transform.position.x} 입니다. 1이어야 해요.`);
  api.set('target',null);
  let err=null;try{api.call('Update')}catch(e){err=e}
  ok('목표 소멸',!err&&Math.abs(api.transform.position.x-1)<1e-6,'목표가 사라지면 에러 없이 멈춰요.','목표가 null일 때 에러가 나거나 계속 움직여요. null이면 return하세요.');
 },
 hints:['에러 메시지의 핵심은 "파괴된 오브젝트에 접근했다"예요. 스택 트레이스가 가리키는 줄에서 어떤 변수가 파괴되었을지 찾으세요.','Unity는 Destroy된 오브젝트를 null과 같게 취급(==)해요. 사용하기 전에 확인하세요.','Update 맨 앞에서 target이 없으면 return하면 나머지 코드가 안전해요.'],
 why:'참조하던 오브젝트가 사라질 수 있다면 사용하기 전에 null을 확인하는 가드가 필요해요. 이른 return(가드절)으로 위험한 경우를 맨 앞에서 걸러 내면 나머지 코드가 단순해집니다.',
 concepts:[['MissingReferenceException','Destroy된 오브젝트의 참조를 계속 사용하면 발생한다. 사용 전 == null 검사로 막는다.'],['가드절(Guard Clause)','함수 맨 앞에서 비정상 조건을 검사해 일찍 return하는 방식. 중첩을 줄여 읽기 쉬워진다.']]});

Q({id:'b3',cat:'debug',stage:1,level:3,title:'IndexOutOfRangeException: 순찰 지점을 넘어선다',
 story:'적이 순찰 지점을 순서대로 돌다가 마지막 지점에 도착하면 이런 에러가 나요:\nIndexOutOfRangeException: Index was outside the bounds of the array.\n  at Patrol.NextX (Patrol.cs:9)\n지점이 3개면 0→1→2→0→1→… 으로 계속 돌아야 합니다. 지점이 하나도 없을 때도 에러가 나면 안 돼요.',
 goals:['NextX(): 현재 index의 지점 x 좌표(xs[index])를 반환하고, index 를 다음으로 옮긴다','마지막 지점 다음에는 0으로 돌아간다 (순환)','지점이 하나도 없으면 에러 없이 0을 반환한다'],
 limits:['나머지 연산자(%) 로 순환시키면 간단해요'],
 api:'xs.Length, % (나머지)',
 starter:C`
using UnityEngine;

public class Patrol : MonoBehaviour
{
    public float[] xs;
    private int index;

    public float NextX()
    {
        float x = xs[index];
        index++;
        return x;
    }
}`,
 solution:C`
using UnityEngine;

public class Patrol : MonoBehaviour
{
    public float[] xs;
    private int index;

    public float NextX()
    {
        if (xs == null || xs.Length == 0) return 0f;
        float x = xs[index];
        index = (index + 1) % xs.Length;
        return x;
    }
}`,
 rules:[],
 test:(api,ok)=>{
  api.set('xs',[10,20,30]);api.set('index',0);
  const got=[];let err=null;
  try{for(let i=0;i<7;i++)got.push(api.call('NextX'))}catch(e){err=e}
  ok('순환',!err&&got.join()==='10,20,30,10,20,30,10','10, 20, 30 을 순서대로 돌아요.',err?'3번 넘게 호출하면 에러가 나요. 마지막 지점 다음에 index를 0으로 되돌려야 해요.':`반환 순서: ${got.join(', ')}. 10, 20, 30, 10, 20, 30, 10 이어야 해요.`);
  api.set('xs',[]);api.set('index',0);
  let r,err2=null;try{r=api.call('NextX')}catch(e){err2=e}
  ok('빈 배열',!err2&&r===0,'지점이 없으면 0을 반환해요.','지점이 하나도 없을 때 에러가 나요. 길이가 0이면 먼저 반환하세요.');
 },
 hints:['스택 트레이스가 가리키는 줄(xs[index])에서 index가 배열 길이 이상이 됐다는 뜻이에요.','index를 1 증가시킨 뒤 길이에 도달하면 0으로 돌려놓는 방법이 필요해요. 나머지 연산이 딱 맞아요.','길이가 0이면 어떤 index도 유효하지 않아요. 가장 먼저 검사하세요. 0으로 나누는 문제도 피할 수 있어요.'],
 why:'배열 접근은 항상 0 ≤ index < Length 여야 해요. 순환 구조는 (index + 1) % Length로 간단히 쓰고, 빈 배열 같은 경계 조건을 먼저 처리하면 예외를 방지할 수 있습니다.',
 concepts:[['IndexOutOfRangeException','배열·리스트의 유효 범위(0 ~ Length−1)를 벗어난 인덱스로 접근했을 때 발생한다.'],['순환 인덱스','(index + 1) % Length 로 마지막 다음에 처음으로 돌아가는 인덱스를 만든다.']]});

Q({id:'b4',cat:'debug',stage:2,level:1,title:'"도착!" 로그가 영영 안 찍힌다',
 story:'오브젝트가 x=0에서 목표 x=1로 이동하는데, 도착하면 "도착!"이 한 번만 찍혀야 해요. 에러는 없는데 로그가 안 찍힙니다. 코드는 매 프레임 x를 조금씩 더하다가 x == target 이 되면 로그를 찍어요. 하지만 x가 target과 정확히 같아지는 일은 거의 없어요. 부동소수점 오차와 오버슈트 때문입니다.',
 goals:['도착하면 Debug.Log("도착!") 을 정확히 한 번 찍는다 (도착 후 다시 찍지 않는다)','x 는 target 을 지나치지 않고 정확히 target 에서 멈춘다','도착 전에는 로그를 찍지 않는다'],
 limits:['x == target 같은 부동소수점 직접 비교를 하지 않는다 (Mathf.Approximately 또는 MoveTowards 사용)'],
 api:'Mathf.MoveTowards, Mathf.Approximately, Debug.Log',
 starter:C`
using UnityEngine;

public class Mover : MonoBehaviour
{
    public float x;
    public float target = 1f;
    public float speed = 0.3f;

    void Update()
    {
        x += speed * Time.deltaTime;
        if (x == target)
        {
            Debug.Log("도착!");
        }
    }
}`,
 solution:C`
using UnityEngine;

public class Mover : MonoBehaviour
{
    public float x;
    public float target = 1f;
    public float speed = 0.3f;
    private bool arrived;

    void Update()
    {
        if (arrived) return;
        x = Mathf.MoveTowards(x, target, speed * Time.deltaTime);
        if (Mathf.Approximately(x, target))
        {
            arrived = true;
            Debug.Log("도착!");
        }
    }
}`,
 rules:[no('부동소수점 == 금지',/\bx\s*==\s*target\b/,'x == target 비교를 쓰지 않아요.','부동소수점은 == 로 비교하지 마세요. 이동에는 Mathf.MoveTowards, 비교에는 Mathf.Approximately를 쓰세요.')],
 test:(api,ok)=>{
  const logs=[];api.env.Debug.Log=m=>logs.push(m);
  api.env.Time.deltaTime=0.1;api.set('x',0);api.set('target',1);api.set('speed',0.3);
  let early=false;
  for(let i=0;i<200;i++){api.call('Update');if(i<20&&logs.length)early=true}
  ok('도착 로그',logs.length>=1,'"도착!"이 찍혀요.','200프레임 동안 로그가 한 번도 안 찍혔어요. 도착 판정이 정확히 같음(==)에 의존하면 놓쳐요.');
  ok('한 번만',logs.length===1,'로그는 정확히 한 번만 찍혀요.',`로그가 ${logs.length}번 찍혔어요. 도착한 뒤에는 다시 찍지 않도록 상태를 기억하세요.`);
  ok('일찍 찍지 않음',!early,'도착 전에는 로그가 없어요.','도착하기 전에 로그가 찍혔어요.');
  ok('지나치지 않음',Math.abs(api.get('x')-1)<1e-6,'x가 정확히 목표에서 멈춰요.',`최종 x가 ${api.get('x')} 입니다. 목표 1을 지나치거나 못 미치면 안 돼요.`);
 },
 hints:['0.3 × 0.1 = 0.03씩 더하면 어느 순간 0.99999… 다음 1.00000…2 같이 목표를 아슬아슬하게 비껴가요. 부동소수점은 정확한 같음을 기대하면 안 돼요.','이동에는 "목표를 지나치지 않는" 함수가, 비교에는 "아주 가까우면 같다고 보는" 함수가 있어요.','도착한 뒤에도 Update는 계속 불려요. 이미 도착했는지를 기억하는 변수가 필요해요.'],
 why:'부동소수점은 오차가 있어서 == 비교가 믿을 수 없고, 이동으로 목표에 "정확히" 닿길 기대하는 것도 위험해요. MoveTowards로 오버슈트를 막고 Approximately로 비교하며, 일회성 이벤트는 상태 플래그로 중복을 막으세요.',
 concepts:[['부동소수점 비교','float은 오차가 있어 == 로 비교하지 않는다. Mathf.Approximately 또는 허용 오차 비교를 쓴다.'],['일회성 이벤트 플래그','매 프레임 호출되는 곳에서 한 번만 실행해야 하는 일은 bool 플래그로 이미 실행했는지 기억한다.']]});

Q({id:'b5',cat:'debug',stage:2,level:2,title:'가끔 속도가 영영 두 배가 된다',
 story:'속도 증가 아이템을 먹으면 3초 동안 속도가 2배가 돼요. 그런데 아이템을 연달아 먹으면 가끔 속도가 4배로 올라가고, 효과가 끝난 뒤에도 원래 속도로 돌아오지 않아요. 항상 재현되지 않고 "연달아 먹을 때"만 생기는 버그입니다. 효과가 겹쳐도 원래 속도(baseSpeed)로 정확히 돌아오도록 고쳐 주세요.',
 goals:['아이템을 먹는 동안(효과 중) 속도는 baseSpeed × 2 (겹쳐 먹어도 2배까지만)','효과가 모두 끝나면 속도는 baseSpeed 로 돌아온다','새 효과를 시작할 때 이전 효과 코루틴이 있으면 멈춘다'],
 limits:['speed 를 *= 2 / /= 2 로 변경하지 않는다 — baseSpeed 에서 계산한다'],
 api:'StartCoroutine, StopCoroutine, yield return new WaitForSeconds',
 starter:C`
using System.Collections;
using UnityEngine;

public class SpeedBuff : MonoBehaviour
{
    public float baseSpeed = 5f;
    public float speed = 5f;

    public void ApplyBuff()
    {
        StartCoroutine(Buff());
    }

    IEnumerator Buff()
    {
        speed *= 2f;
        yield return new WaitForSeconds(3f);
        speed /= 2f;
    }
}`,
 solution:C`
using System.Collections;
using UnityEngine;

public class SpeedBuff : MonoBehaviour
{
    public float baseSpeed = 5f;
    public float speed = 5f;
    private Coroutine buffRoutine;

    public void ApplyBuff()
    {
        if (buffRoutine != null) StopCoroutine(buffRoutine);
        buffRoutine = StartCoroutine(Buff());
    }

    IEnumerator Buff()
    {
        speed = baseSpeed * 2f;
        yield return new WaitForSeconds(3f);
        speed = baseSpeed;
        buffRoutine = null;
    }
}`,
 rules:[
  notIn('배수 누적 금지','Buff',/speed\s*\*=|speed\s*\/=/,'speed를 *=, /= 로 바꾸지 않아요.','speed *= 2 는 겹칠 때 4배가 돼요. baseSpeed × 2 처럼 기준에서 계산해 대입하세요.'),
  inFn('이전 효과 정리','ApplyBuff',/StopCoroutine\s*\(/,'새 효과 전에 이전 코루틴을 멈춰요.','새 버프를 시작하기 전에 진행 중인 이전 코루틴을 StopCoroutine으로 멈추세요.')
 ],
 test:(api,ok)=>{
  const env=api.env;env.started.length=0;env.stopped.length=0;
  api.set('baseSpeed',5);api.set('speed',5);
  api.call('ApplyBuff');
  const c0=api.co(env.started[0]);c0.advance(0.016);c0.advance(1);
  api.call('ApplyBuff');
  const cs=env.started.map(g=>({g,co:api.co(g)}));
  const live=cs.filter(c=>env.stopped.indexOf(c.g)<0);
  live.forEach(c=>c.co.advance(0.016));
  ok('겹쳐도 2배까지',api.get('speed')===10,'연달아 먹어도 속도는 2배(10)까지예요.',`연달아 먹었을 때 속도가 ${api.get('speed')} 입니다. 10(= baseSpeed × 2)이어야 해요.`);
  live.forEach(c=>c.co.advance(4));
  ok('끝나면 원래 속도',api.get('speed')===5,'효과가 끝나면 원래 속도(5)로 돌아와요.',`효과가 끝난 뒤 속도가 ${api.get('speed')} 입니다. baseSpeed(5)로 돌아와야 해요.`);
 },
 hints:['재현 조건을 먼저 정리해 보세요: "연달아 먹을 때만". 코루틴이 두 개 동시에 돌고 있는 상황이에요.','*= 2 와 /= 2 는 서로 짝이 맞아야만 원래대로 돌아와요. 중간에 겹치면 짝이 어긋나요. 기준값(baseSpeed)에서 매번 계산해 대입하면 어긋나지 않아요.','새로 시작하기 전에 이전 코루틴을 멈추고(StopCoroutine), 끝나면 핸들을 비우세요.'],
 why:'가끔만 발생하는 버그는 "재현 조건"을 찾는 것이 절반이에요. 상태를 *=, /= 로 점진적으로 바꾸면 중첩에 취약하니, 기준값에서 계산해 대입하고 중복 코루틴을 정리하세요.',
 concepts:[['재현 조건 찾기','간헐적 버그는 언제 발생하는지(연타, 특정 순서, 동시 실행 등)를 기록해 조건을 좁힌다.'],['기준값에서 대입','버프·디버프는 *=, /= 로 누적하지 말고 기준값에서 계산해 대입해 중첩에도 안전하게 한다.']]});

Q({id:'b6',cat:'debug',stage:2,level:3,title:'죽은 적이 가끔 안 지워진다',
 story:'적이 죽으면(hp ≤ 0) 목록에서 지워야 해요. foreach로 돌면서 Remove하면 Unity에서는 "InvalidOperationException: Collection was modified"가 나요. 이를 피하려고 for로 바꿨더니 이번엔 에러는 없는데 죽은 적이 연속으로 둘 이상 있을 때 하나가 안 지워지는 버그가 생겼어요. 모든 죽은 적을 정확히 지워 주세요.',
 goals:['Cleanup(): hps 목록에서 0 이하인 값을 모두 제거한다','연속으로 죽은 적이 여러 명이어도 모두 제거된다','남은 적의 순서는 유지된다'],
 limits:['순회 중 목록을 수정하는 foreach 는 쓰지 않는다','RemoveAll 이나 뒤에서부터 도는 for 를 쓰면 안전하다'],
 api:'hps.RemoveAll(조건), hps.RemoveAt(i), hps.Count',
 starter:C`
using System.Collections.Generic;
using UnityEngine;

public class EnemyList : MonoBehaviour
{
    public List<int> hps = new List<int>();

    public void Cleanup()
    {
        for (int i = 0; i < hps.Count; i++)
        {
            if (hps[i] <= 0)
            {
                hps.RemoveAt(i);
            }
        }
    }
}`,
 solution:C`
using System.Collections.Generic;
using UnityEngine;

public class EnemyList : MonoBehaviour
{
    public List<int> hps = new List<int>();

    public void Cleanup()
    {
        hps.RemoveAll(hp => hp <= 0);
    }
}`,
 alts:[C`
using System.Collections.Generic;
using UnityEngine;

public class EnemyList : MonoBehaviour
{
    public List<int> hps = new List<int>();

    public void Cleanup()
    {
        for (int i = hps.Count - 1; i >= 0; i--)
        {
            if (hps[i] <= 0) hps.RemoveAt(i);
        }
    }
}`],
 rules:[no('foreach 금지',/foreach\s*\(/,'순회 중 수정하는 foreach를 쓰지 않아요.','foreach 안에서 컬렉션을 수정하면 예외가 나요.')],
 test:(api,ok)=>{
  api.set('hps',[0,0,5,-1,0,7]);api.call('Cleanup');
  ok('연속으로 죽은 적',api.get('hps').join()==='5,7','죽은 적이 연속이어도 모두 지워져요.',`정리 후 목록: [${api.get('hps').join(', ')}]. [5, 7]이어야 해요. 앞에서부터 지우면 다음 원소가 한 칸 당겨져 건너뛰게 돼요.`);
  api.set('hps',[3,4,5]);api.call('Cleanup');
  ok('아무도 안 죽음',api.get('hps').join()==='3,4,5','아무도 안 죽었으면 그대로예요.','살아 있는 적이 지워졌어요.');
  api.set('hps',[0,0,0]);api.call('Cleanup');
  ok('전부 죽음',api.get('hps').length===0,'모두 죽었으면 목록이 비어요.',`목록이 ${api.get('hps').length}개 남았어요. 비어야 해요.`);
 },
 hints:['앞에서부터 i를 증가시키며 RemoveAt(i)를 하면, 지워진 자리로 다음 원소가 당겨져 와요. 그런데 i는 또 증가해서 그 원소를 건너뛰어요.','해결책 1: 뒤에서부터 도는 for (i를 줄이며). 지워도 아직 안 본 원소의 위치가 바뀌지 않아요.','해결책 2: 조건을 한 번에 지워 주는 RemoveAll(람다)이 있어요.'],
 why:'순회 중 컬렉션을 수정하면 foreach는 예외, 앞에서부터 도는 for는 원소 건너뛰기(조용한 버그)가 돼요. 지우면서 순회할 땐 뒤에서부터 돌거나 RemoveAll을 쓰세요. 에러 없이 결과만 틀리는 버그는 경계 조건과 재현 조건을 의심해야 합니다.',
 concepts:[['순회 중 컬렉션 수정','foreach 중에 추가/삭제하면 예외가 나고, 앞에서부터 도는 for에서 삭제하면 원소를 건너뛴다.'],['RemoveAll','조건에 맞는 원소를 한 번에 제거하는 List 메서드.'],['뒤에서부터 순회','삭제해도 아직 방문하지 않은 원소의 위치가 변하지 않아 안전하다.']]});
