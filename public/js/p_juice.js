/* ===== 게임 주스 ===== */
Q({id:'j1',cat:'juice',stage:1,level:1,title:'밋밋한 타격감 살리기 (소리와 파티클)',
 story:'적을 때려도 아무 반응이 없어서 맞았는지조차 알기 어려워요. OnHit()에 가장 기본적인 피드백인 "타격음"과 "파편 파티클"을 넣어 주세요. 같은 소리가 반복되면 금방 지루하니, 재생할 때마다 피치를 조금씩 다르게 해 주는 것이 좋습니다.',
 goals:['재생할 때마다 audioSource.pitch를 0.9~1.1 사이의 랜덤 값으로 바꾼다 (Random.Range)','audioSource.PlayOneShot(hitClip)으로 타격음을 재생한다','hitFx.Emit(8)로 파편 파티클 8개를 방출한다'],
 limits:['피치를 바꾼 뒤에 소리를 재생한다 (순서 중요)'],
 api:'audioSource.pitch, audioSource.PlayOneShot(AudioClip), Random.Range(min, max), ps.Emit(n)',
 starter:C`
using UnityEngine;

public class HitFeedback : MonoBehaviour
{
    [SerializeField] private AudioSource audioSource;
    [SerializeField] private AudioClip hitClip;
    [SerializeField] private ParticleSystem hitFx;

    public void OnHit()
    {
        // 지금은 아무 피드백이 없어서 맞았는지 알기 어렵습니다
    }
}`,
 solution:C`
using UnityEngine;

public class HitFeedback : MonoBehaviour
{
    [SerializeField] private AudioSource audioSource;
    [SerializeField] private AudioClip hitClip;
    [SerializeField] private ParticleSystem hitFx;

    public void OnHit()
    {
        audioSource.pitch = Random.Range(0.9f, 1.1f);
        audioSource.PlayOneShot(hitClip);
        hitFx.Emit(8);
    }
}`,
 rules:[
 ],
 test:(api,ok)=>{
  const a={pitch:1,played:[],PlayOneShot(c){this.played.push([c,this.pitch])}};
  const fx=api.mk.ps();
  api.set('audioSource',a);api.set('hitClip','clip');api.set('hitFx',fx);
  api.env.Random.Range=(lo,hi)=>lo;api.call('OnHit');
  api.env.Random.Range=(lo,hi)=>hi;api.call('OnHit');
  const p=a.played;
  ok('타격음 재생',p.length===2&&p[0][0]==='clip','OnHit마다 hitClip을 재생해요.','OnHit을 호출할 때마다 PlayOneShot(hitClip)이 호출되어야 해요.');
  ok('피치 변주',p.length===2&&p[0][1]!==p[1][1],'호출마다 다른 피치로 재생해요.','두 번 재생했는데 피치가 같아요. 재생 직전에 Random.Range로 pitch를 바꾸세요.');
  ok('피치 범위',p.length===2&&p.every(x=>x[1]>=0.9&&x[1]<=1.1),'피치가 0.9~1.1 안에 있어요.','피치는 0.9~1.1 범위여야 해요. 너무 크게 바꾸면 소리가 이상하게 들려요.');
  ok('파티클',fx.calls.filter(c=>c[0]==='Emit'&&c[1]===8).length===2,'호출마다 파티클 8개를 방출해요.','OnHit마다 hitFx.Emit(8)이 호출되어야 해요.');
 },
 hints:['게임 주스는 "맞았다"는 사실을 눈과 귀로 확실히 알려주는 작은 피드백의 모음이에요. 소리와 파티클이 가장 기본이에요.','같은 소리를 계속 들으면 금방 질려요. 피치를 약간씩 바꾸면 같은 클립도 매번 다르게 들려요.','pitch를 먼저 바꾸고 PlayOneShot을 호출해야 바뀐 피치로 재생돼요.'],
 why:'타격감은 입력과 결과 사이의 확실한 피드백에서 나와요. 소리·파티클처럼 저렴한 피드백만으로도 체감이 크게 달라지고, 피치·볼륨의 작은 랜덤 변주로 반복 피로를 줄일 수 있습니다.',
 concepts:[['게임 주스(Game Juice)','입력과 결과에 소리·파티클·흔들림 같은 과장된 피드백을 더해 조작의 쾌감을 키우는 기법.'],['오디오 변주','같은 효과음을 피치·볼륨을 조금씩 랜덤으로 바꿔 재생해 반복의 지루함을 줄이는 기법.'],['AudioSource.PlayOneShot','소리가 겹쳐도 앞 소리를 끊지 않고 효과음을 재생한다.']]});

Q({id:'j2',cat:'juice',stage:1,level:2,title:'히트스톱이 영원히 안 끝난다',
 story:'타격 순간 게임을 아주 잠깐 멈추는 "히트스톱"을 넣었어요. Time.timeScale을 0.05로 낮추고 0.06초 뒤에 1로 되돌리려는데, 게임이 영원히 느린 상태로 남아 있습니다. WaitForSeconds는 timeScale의 영향을 받아서, timeScale이 낮으면 대기 시간도 그만큼 늘어나기 때문이에요.',
 goals:['HitStop 코루틴 시작 시 Time.timeScale을 0.05로 낮춘다','실제 시간 기준으로 0.06초를 기다린다','기다린 뒤 Time.timeScale을 1로 되돌린다'],
 limits:['timeScale의 영향을 받지 않는 대기 방법을 쓴다'],
 api:'Time.timeScale, yield return new WaitForSecondsRealtime(초)',
 starter:C`
using System.Collections;
using UnityEngine;

public class HitStopper : MonoBehaviour
{
    IEnumerator HitStop()
    {
        Time.timeScale = 0.05f;
        yield return new WaitForSeconds(0.06f);   // 느려진 시간 안에서 기다리면 한참 걸려요
        Time.timeScale = 1f;
    }
}`,
 solution:C`
using System.Collections;
using UnityEngine;

public class HitStopper : MonoBehaviour
{
    IEnumerator HitStop()
    {
        Time.timeScale = 0.05f;
        yield return new WaitForSecondsRealtime(0.06f);
        Time.timeScale = 1f;
    }
}`,
 rules:[
  inFn('실제 시간 기준 대기','HitStop',/WaitForSecondsRealtime\s*\(|unscaledDeltaTime|realtimeSinceStartup/,'timeScale의 영향을 받지 않는 시간으로 기다려요.','WaitForSeconds는 timeScale의 영향을 받아요. WaitForSecondsRealtime을 쓰세요.'),
 ],
 test:(api,ok)=>{
  const T=api.env.Time;T.timeScale=1;
  const co=api.co(api.call('HitStop'));
  co.advance(0.016);
  ok('시간이 느려짐',T.timeScale<=0.2&&T.timeScale>=0,`timeScale이 ${T.timeScale}로 낮아졌어요.`,`timeScale이 ${T.timeScale} 입니다. 0.05 정도로 낮춰야 해요.`);
  for(let i=0;i<10;i++)co.advance(0.016);
  ok('실제 시간으로 복구',co.done&&T.timeScale===1,'실제 시간 약 0.16초 안에 timeScale이 1로 복구돼요.',`0.16초(실제 시간)가 지났는데 ${co.done?'':'코루틴이 아직 끝나지 않았고 '}timeScale이 ${T.timeScale} 입니다. WaitForSeconds는 느려진 시간을 기준으로 기다려서 훨씬 오래 걸려요.`);
 },
 hints:['Time.timeScale이 0.05이면 게임 속 1초는 실제로 20초예요. WaitForSeconds(0.06)은 게임 시간 기준이라 실제로는 1.2초가 걸립니다.','시간 배속과 상관없이 실제 시간을 기준으로 기다리는 대기 명령이 따로 있어요. 이름 끝에 Realtime이 붙어요.','복구 코드(timeScale = 1)가 실행되지 않으면 게임이 느린 채로 남는다는 점을 기억하세요.'],
 why:'히트스톱·슬로모션은 timeScale을 조작하는 연출인데, 그 연출을 되돌리는 타이머가 timeScale의 영향을 받으면 스스로 발목을 잡습니다. 연출 타이머는 항상 unscaled(Realtime) 시간으로 두는 것이 안전해요.',
 concepts:[['히트스톱(Hit Stop)','타격 순간 게임을 아주 잠깐 멈추거나 느리게 해서 충격을 강조하는 연출.'],['WaitForSecondsRealtime','Time.timeScale의 영향을 받지 않고 실제 시간으로 기다리는 yield 명령.']]});

Q({id:'j3',cat:'juice',stage:1,level:3,title:'주스가 과하면 독: 끄기 옵션과 강도 조절',
 story:'화면 흔들림이 너무 강하다는 플레이어가 많고, 어떤 플레이어는 멀미 때문에 흔들림을 끄고 싶어 해요. 주스는 강도를 조절하고 끌 수 있어야 하며, 연타로 여러 번 맞아도 흔들림이 무한정 커지면 안 됩니다. 설정에 맞게 흔들림 세기를 계산하는 코드를 작성해 주세요.',
 goals:['Scaled(power): juiceEnabled가 false이거나 reduceMotion이 true이면 0, 아니면 power × intensity 를 maxPower 이하로 제한해 반환한다','ApplyShake(power): shake 필드를 갱신한다 — 여러 번 호출되면 합산이 아니라 가장 큰 값만 남긴다 (Mathf.Max)'],
 limits:['설정 값(juiceEnabled, reduceMotion, intensity, maxPower)은 필드로 제공되어 있다','합산(+=)하면 연타 시 흔들림이 폭주하므로 쓰지 않는다'],
 starter:C`
using UnityEngine;

public class JuiceSettings : MonoBehaviour
{
    public bool juiceEnabled = true;
    public bool reduceMotion = false;
    public float intensity = 0.5f;
    public float maxPower = 1f;
    public float shake;

    float Scaled(float power)
    {
        // TODO
        return power;
    }

    public void ApplyShake(float power)
    {
        // TODO
    }
}`,
 solution:C`
using UnityEngine;

public class JuiceSettings : MonoBehaviour
{
    public bool juiceEnabled = true;
    public bool reduceMotion = false;
    public float intensity = 0.5f;
    public float maxPower = 1f;
    public float shake;

    float Scaled(float power)
    {
        if (!juiceEnabled || reduceMotion) return 0f;
        return Mathf.Min(power * intensity, maxPower);
    }

    public void ApplyShake(float power)
    {
        shake = Mathf.Max(shake, Scaled(power));
    }
}`,
 rules:[
  notIn('합산 금지','ApplyShake',/\bshake\s*\+=|\bshake\s*=\s*shake\s*\+/,'흔들림을 합산하지 않아요.','+= 로 합산하면 연타 시 흔들림이 폭주해요. Mathf.Max를 쓰세요.')
 ],
 test:(api,ok)=>{
  const s=p=>api.call('Scaled',p);
  api.set('juiceEnabled',false);
  ok('주스 끄기',s(0.8)===0,'juiceEnabled가 false이면 0이에요.','juiceEnabled가 false인데 0이 아니에요.');
  api.set('juiceEnabled',true);api.set('reduceMotion',true);
  ok('모션 줄이기',s(0.8)===0,'reduceMotion이면 흔들림이 0이에요.','reduceMotion이 true인데 0이 아니에요.');
  api.set('reduceMotion',false);
  ok('강도 적용',Math.abs(s(0.6)-0.3)<1e-6,'power × intensity (0.6 × 0.5 = 0.3) 예요.',`Scaled(0.6)이 ${s(0.6)} 입니다. 0.6 × 0.5 = 0.3 이어야 해요.`);
  ok('상한',s(5)===1,'maxPower(1)를 넘지 않아요.',`Scaled(5)가 ${s(5)} 입니다. maxPower(1)로 제한해야 해요.`);
  api.set('shake',0);
  api.call('ApplyShake',0.6);api.call('ApplyShake',0.2);
  ok('가장 큰 값 유지',Math.abs(api.get('shake')-0.3)<1e-6,'연타해도 가장 큰 값(0.3)만 남아요.',`shake가 ${api.get('shake')} 입니다. 0.3(= 큰 쪽)이어야 해요. 합산하면 0.4가 돼요.`);
 },
 hints:['설정 항목이 여러 개일 때는 "끄는 조건"부터 먼저 걸러내고(return 0), 그다음 계산을 하면 읽기 쉬워요.','power × intensity 를 maxPower와 비교해 작은 쪽을 쓰면 상한이 돼요: Mathf.Min','연타를 더하면 흔들림이 커지기만 해요. 더 센 쪽만 남기려면 둘 중 큰 값을 고르는 Mathf.Max를 써요.'],
 why:'주스는 플레이어를 즐겁게 하려는 것이므로 불편하게 만들면 실패예요. 강도 슬라이더, 끄기 옵션, 모션 감소(접근성) 설정을 두고, 중첩되는 효과는 합산하지 않고 상한을 두는 것이 안전합니다.',
 concepts:[['주스의 강도 조절','피드백의 세기를 설정으로 줄이거나 끌 수 있게 하고 상한을 둬서 과한 연출이 정보 전달과 편안함을 해치지 않게 한다.'],['모션 감소 옵션','멀미나 불편함을 호소하는 플레이어를 위해 흔들림·번쩍임을 줄이거나 끄는 접근성 설정.'],['효과 중첩 처리','같은 종류의 효과가 연달아 발생하면 합산 대신 최댓값을 취하거나 상한을 두어 폭주를 막는다.']]});

Q({id:'j4',cat:'juice',stage:2,level:1,title:'스쿼시 & 스트레치',
 story:'점프하는 슬라임이 딱딱한 상자처럼 움직여요. 위아래로 빠르게 움직일 때는 길쭉하게(스트레치), 반대로 가로는 좁아지게 해서 탄력을 주려고 합니다. 이때 면적이 유지되어야(가로 × 세로 = 1) 부피가 변하지 않는 자연스러운 느낌이 나요.',
 goals:['stretch = |세로 속도| × stretchPerSpeed 를 0 ~ maxStretch 범위로 제한해 계산한다','세로 크기 y = 1 + stretch','가로 크기 x = 1 / y (면적 유지)','Update에서 transform.localScale 에 (x, y, 1)을 대입한다'],
 limits:['transform.localScale.x 에 직접 대입하지 않는다 (CS1612)','속도가 0이면 크기는 정확히 (1, 1) 이다'],
 api:'rb.velocity.y, Mathf.Abs, Mathf.Clamp, transform.localScale = new Vector3(x, y, 1f)',
 starter:C`
using UnityEngine;

public class SquashStretch : MonoBehaviour
{
    public float stretchPerSpeed = 0.03f;
    public float maxStretch = 0.5f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        // TODO: 세로 속도에 따라 길어지고, 가로는 좁아지게 하세요
    }
}`,
 solution:C`
using UnityEngine;

public class SquashStretch : MonoBehaviour
{
    public float stretchPerSpeed = 0.03f;
    public float maxStretch = 0.5f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        float stretch = Mathf.Clamp(Mathf.Abs(rb.velocity.y) * stretchPerSpeed, 0f, maxStretch);
        float y = 1f + stretch;
        float x = 1f / y;
        transform.localScale = new Vector3(x, y, 1f);
    }
}`,
 rules:[
  inFn('localScale 대입','Update',/\btransform\.localScale\s*=(?!=)/,'localScale에 새 값을 대입해요.','transform.localScale = new Vector3(x, y, 1f); 로 대입하세요.'),
 ],
 test:(api,ok)=>{
  const rb=api.mk.rb();api.env.components.Rigidbody2D=rb;
  api.call('Awake');
  const setV=v=>{rb.velocity={x:0,y:v};rb.linearVelocity={x:0,y:v}};
  const sc=()=>api.transform.localScale;
  setV(0);api.call('Update');
  ok('정지 상태',Math.abs(sc().x-1)<1e-6&&Math.abs(sc().y-1)<1e-6,'속도가 0이면 (1, 1)이에요.',`속도 0일 때 크기가 (${sc().x}, ${sc().y}) 입니다. (1, 1)이어야 해요.`);
  setV(-10);api.call('Update');
  ok('빠르게 떨어질 때 길어짐',Math.abs(sc().y-1.3)<1e-6,'속도 10일 때 세로가 1.3배예요.',`속도 10일 때 y가 ${sc().y} 입니다. stretch = 10 × 0.03 = 0.3 → y = 1.3 이어야 해요 (속도의 부호는 무시).`);
  ok('면적 유지',Math.abs(sc().x*sc().y-1)<1e-6,'가로 × 세로 = 1 로 면적이 유지돼요.',`x × y = ${(sc().x*sc().y).toFixed(3)} 입니다. 1이어야 해요. x = 1 / y 로 계산해 보세요.`);
  setV(100);api.call('Update');
  ok('최대 늘어남',Math.abs(sc().y-1.5)<1e-6,'너무 빨라도 maxStretch(0.5)까지만 늘어나요.',`속도 100일 때 y가 ${sc().y} 입니다. maxStretch(0.5)로 제한해 1.5가 되어야 해요.`);
 },
 hints:['빠른 만큼 길어지게 하려면 "속도의 크기"가 필요해요. 위로 가든 아래로 가든 크기는 같아요.','늘어남이 무한정 커지지 않게 상한(maxStretch)을 두고, 아래쪽(0)도 지켜 주세요.','가로 × 세로 = 1 이 되려면 가로 = 1 / 세로 예요.'],
 why:'스쿼시 & 스트레치는 애니메이션 12원칙의 하나로, 움직임에 탄력과 무게를 줘요. 면적(부피)을 유지하면서 늘어나거나 눌리면 자연스럽게 보입니다. 상한을 두지 않으면 순간적인 큰 속도에서 모양이 터져 보이니 항상 범위를 제한하세요.',
 concepts:[['스쿼시 & 스트레치','움직임 방향으로 늘어나고 충돌 시 눌리는 변형으로 탄력과 무게를 표현하는 연출 기법.'],['면적(부피) 보존','한 축이 늘어나면 다른 축을 그만큼 줄여 전체 부피가 같아 보이게 하는 원칙.']]});

Q({id:'j5',cat:'juice',stage:2,level:2,title:'통통 튀며 나타나는 팝업 (Ease Out Back)',
 story:'아이템 획득 팝업이 일정한 속도로 스르륵 커지기만 해서 밋밋해요. 목표 크기를 살짝 넘었다가 돌아오는 "튕김"(Ease Out Back)을 주면 훨씬 생동감이 생깁니다. 이징 함수를 직접 만들고 코루틴으로 적용해 주세요.',
 goals:['EaseOutBack(t): t=0이면 0, t=1이면 1이고, 그 사이 어딘가에서 1을 넘는(오버슈트) 곡선을 반환한다','PopIn(): duration 동안 매 프레임 localScale을 (e, e, 1)로 설정한다 (e = EaseOutBack(경과 비율))','끝나면 정확히 (1, 1, 1)이 된다'],
 limits:['t는 0~1로 제한한다 (Mathf.Clamp01)','공식: c1 = 1.70158, c3 = c1 + 1, 결과 = 1 + c3 × (t−1)³ + c1 × (t−1)²'],
 api:'Mathf.Pow(밑, 지수), Mathf.Clamp01, transform.localScale, yield return null',
 starter:C`
using System.Collections;
using UnityEngine;

public class PopUp : MonoBehaviour
{
    public float duration = 0.25f;

    float EaseOutBack(float t)
    {
        // TODO: 공식을 적용하세요
        return t;
    }

    IEnumerator PopIn()
    {
        float elapsed = 0f;
        // TODO: duration 동안 크기를 키우고, 마지막에 정확히 1로 맞추세요
        yield return null;
    }
}`,
 solution:C`
using System.Collections;
using UnityEngine;

public class PopUp : MonoBehaviour
{
    public float duration = 0.25f;

    float EaseOutBack(float t)
    {
        float c1 = 1.70158f;
        float c3 = c1 + 1f;
        float u = t - 1f;
        return 1f + c3 * Mathf.Pow(u, 3f) + c1 * Mathf.Pow(u, 2f);
    }

    IEnumerator PopIn()
    {
        float elapsed = 0f;
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = Mathf.Clamp01(elapsed / duration);
            float e = EaseOutBack(t);
            transform.localScale = new Vector3(e, e, 1f);
            yield return null;
        }
        transform.localScale = new Vector3(1f, 1f, 1f);
    }
}`,
 rules:[
  inFn('이징 적용','PopIn',/EaseOutBack\s*\(/,'PopIn이 EaseOutBack을 사용해요.','PopIn 안에서 EaseOutBack(t)의 결과로 크기를 정하세요.'),
  inFn('프레임 양보','PopIn',/yield\s+return/,'프레임마다 양보해요.','while 루프 안에서 yield return null; 을 해야 프레임이 진행돼요.')
 ],
 test:(api,ok)=>{
  const e=t=>api.call('EaseOutBack',t);
  ok('양 끝 값',Math.abs(e(0))<1e-6&&Math.abs(e(1)-1)<1e-6,'EaseOutBack(0)=0, EaseOutBack(1)=1 이에요.',`EaseOutBack(0)=${e(0)}, EaseOutBack(1)=${e(1)}. 각각 0, 1이어야 해요.`);
  let mx=0;for(let i=1;i<20;i++)mx=Math.max(mx,e(i/20));
  ok('오버슈트',mx>1.05&&mx<1.3,`중간에 최대 ${mx.toFixed(2)}까지 넘었다가 돌아와요.`,`중간 최댓값이 ${mx.toFixed(3)} 입니다. 1을 약 10% 정도 넘는(1.05~1.3) 곡선이어야 해요.`);
  api.env.Time.deltaTime=0.05;
  const co=api.co(api.call('PopIn'));
  let n=0,peak=0;
  while(!co.done&&n++<20){co.advance(0.05);peak=Math.max(peak,api.transform.localScale.x)}
  ok('팝업 오버슈트',peak>1.05,`팝업 중 최대 ${peak.toFixed(2)}배까지 커졌다 돌아와요.`,`팝업 중 최대 크기가 ${peak.toFixed(2)} 입니다. EaseOutBack 값을 localScale에 적용하세요.`);
  ok('정확히 1로 마무리',co.done&&n<=12&&api.transform.localScale.x===1&&api.transform.localScale.y===1,'duration 안에 끝나고 정확히 (1, 1)로 맞춰져요.',`끝난 뒤 크기가 (${api.transform.localScale.x}, ${api.transform.localScale.y}), 끝남=${co.done} 입니다. 마지막에 정확히 (1, 1, 1)로 맞추세요.`);
 },
 hints:['이징 함수는 0~1의 진행 비율을 받아 "느낌이 있는" 0~1의 결과로 바꿔 줘요. 선형이면 그대로, Ease Out Back이면 1을 살짝 넘었다 돌아와요.','공식을 u = t − 1 로 두면 1 + c3·u³ + c1·u² 로 간단해져요.','코루틴은 경과 시간을 누적해 t = 경과 / 지속시간 (0~1 제한)을 만들고, 끝나면 오차 없이 정확한 목표값으로 마무리하세요.'],
 why:'선형 보간은 기계적으로 느껴져요. 이징 함수로 가속·감속·오버슈트를 주면 같은 시간의 연출도 훨씬 생동감이 생깁니다. 보간 끝에서는 부동소수점 오차가 남지 않도록 최종 값을 정확히 대입하는 습관이 중요해요.',
 concepts:[['이징(Easing)','진행 비율을 가속·감속·오버슈트 등의 곡선으로 바꿔 움직임에 느낌을 주는 함수.'],['오버슈트','목표값을 살짝 넘었다가 돌아오는 움직임. 팝업·탄성 연출에 쓴다.'],['최종 값 스냅','보간 코루틴이 끝날 때 목표값을 정확히 대입해 오차가 남지 않게 하는 처리.']]});

Q({id:'j6',cat:'juice',stage:2,level:3,title:'프레임레이트와 무관한 부드러운 추적',
 story:'주황색 목표(target)가 원을 그리며 움직이고, 오브젝트(카메라 역할)가 이를 부드럽게 따라가요. 그런데 144Hz 모니터를 쓰는 팀원은 카메라가 훨씬 빨리 따라붙어서 느낌이 다르다고 해요. 어떤 프레임레이트에서도 같은 느낌이 나게 고쳐 주세요.',
 goals:['30fps와 144fps에서 마지막 3초 동안 목표와의 평균 거리가 같아야 한다 (차이 3 이내)','순간이동처럼 딱 붙어도(평균 거리 3 미만), 너무 느슨해도(40 이상) 안 된다','따라가는 속도는 follow 필드로 조절한다'],
 limits:['매 프레임 고정 비율 Lerp(…, 0.1f)를 그대로 쓰지 않는다'],
 api:'Vector2.Lerp(a, b, t), Mathf.Exp, Time.deltaTime, target.position (이 문제에서 제공)',
 starter:C`
public float follow = 5f;

void Update()
{
    transform.position = Vector2.Lerp(transform.position, target.position, 0.1f);
}`,
 solution:C`
public float follow = 5f;

void Update()
{
    float t = 1f - Mathf.Exp(-follow * Time.deltaTime);
    transform.position = Vector2.Lerp(transform.position, target.position, t);
}`,
 world:{start:{x:330,y:135},target:{cx:240,cy:135,r:90,w:0.8}},runs:[{fps:30,seconds:8},{fps:144,seconds:8}],show:8,
 rules:[has('deltaTime 반영',/Time\.deltaTime/,'보간 계수에 Time.deltaTime이 반영돼요.','보간 계수 t에 Time.deltaTime이 반영되어야 프레임레이트와 무관해져요.'),
  no('고정 Lerp 비율 금지',/Lerp\s*\([^;]*,\s*0?\.\d+f?\s*\)/,'고정된 비율로 Lerp하지 않아요.','Lerp의 세 번째 인자에 0.1f 같은 고정 숫자를 쓰면 프레임레이트에 따라 결과가 달라져요.')],
 check:rs=>{const avg=r=>{const f=r.frames,dt=1/r.fps,n=Math.round(3/dt);let s=0,c=0;for(let i=f.length-n;i<f.length;i++){s+=Math.hypot(f[i][1]-f[i][3],f[i][2]-f[i][4]);c++}return s/c};
  const a=avg(rs[0]),b=avg(rs[1]);const same=Math.abs(a-b)<3,range=b>=3&&b<40&&a>=3&&a<40;
  return {items:[
   it(same,'프레임레이트 무관',`평균 거리가 30fps ${a.toFixed(1)} / 144fps ${b.toFixed(1)} 로 거의 같아요.`,`평균 거리가 30fps ${a.toFixed(1)} / 144fps ${b.toFixed(1)} 로 달라요. 보간 계수 t에 Time.deltaTime이 반영되어야 해요.`),
   it(range,'적절한 추적 거리',`평균 거리 ${b.toFixed(1)} 로 부드럽게 따라가요.`,`평균 거리가 너무 작거나 커요 (30fps ${a.toFixed(1)} / 144fps ${b.toFixed(1)}). follow 값으로 따라가는 속도를 조절하세요.`)]}},
 hints:['Update가 1초에 몇 번 불리느냐에 따라 "프레임마다 10%"의 효과가 달라져요. 144fps는 30fps보다 훨씬 많이 따라붙죠.','한 프레임에 줄일 거리 비율은 프레임 시간에 따라 지수적으로 달라져야 정확해요: 1 − e^(−k·dt)','Mathf.Exp(-follow * Time.deltaTime) 를 1에서 빼서 t를 만드세요.'],
 why:'transform.position = Lerp(현재, 목표, 고정값)은 프레임레이트에 의존하는 흔한 실수예요. t = 1 − exp(−k·dt) 로 보간 계수를 만들면 프레임 간격이 달라도 같은 속도로 수렴해서, 카메라 스무딩·UI 추적 같은 연출이 기기와 무관하게 같은 느낌을 줍니다.',
 concepts:[['프레임 독립 스무딩','t = 1 − exp(−k·dt)로 보간 계수를 만들면 프레임레이트와 무관하게 같은 속도로 목표에 수렴한다.'],['카메라 스무딩','카메라가 대상을 즉시가 아니라 지수적으로 따라가게 해 움직임을 부드럽게 만드는 기법.']]});

Q({id:'j7',cat:'juice',stage:3,level:1,title:'셰이크 강도는 점점 약해져야 한다',
 story:'화면 흔들림이 일정한 세기로 계속되다가 갑자기 뚝 끊겨서 어색해요. 충격은 처음에 가장 세고 시간이 지날수록 약해져야 자연스럽습니다. 경과 시간에 따라 흔들림 세기를 계산하는 함수를 만들어 주세요.',
 goals:['ShakePower(elapsed, duration, power): 시작 순간(elapsed = 0)에는 power 그대로','시간이 지날수록 약해지고 duration에 도달하면 정확히 0','duration 이후에는 계속 0 (음수가 되면 안 된다)','중간 지점(duration의 절반)에서는 power의 절반 이하'],
 limits:['t = elapsed / duration 을 0~1로 제한(Mathf.Clamp01)해서 쓴다'],
 starter:C`
float ShakePower(float elapsed, float duration, float power)
{
    // TODO: 시간이 지날수록 약해지는 세기를 반환하세요
    return power;
}`,
 solution:C`
float ShakePower(float elapsed, float duration, float power)
{
    float t = Mathf.Clamp01(elapsed / duration);
    float remain = 1f - t;
    return power * remain * remain;
}`,
 alts:[C`
float ShakePower(float elapsed, float duration, float power)
{
    float t = Mathf.Clamp01(elapsed / duration);
    return power * (1f - t);
}`],
 rules:[
 ],
 test:(api,ok)=>{
  const f=(e)=>api.call('ShakePower',e,2,10);
  ok('시작 세기',Math.abs(f(0)-10)<1e-6,'시작 순간에는 power(10) 그대로예요.',`ShakePower(0, 2, 10) 이 ${f(0)} 입니다. 10이어야 해요.`);
  ok('끝에서 0',Math.abs(f(2))<1e-6,'duration에 도달하면 0이에요.',`ShakePower(2, 2, 10) 이 ${f(2)} 입니다. 0이어야 해요.`);
  ok('끝난 뒤 0',f(5)===0||Math.abs(f(5))<1e-9,'duration 이후에도 0이에요 (음수 없음).',`ShakePower(5, 2, 10) 이 ${f(5)} 입니다. duration 이후에는 0이어야 해요. 경과 비율을 0~1로 제한하세요.`);
  ok('절반 지점',f(1)<=5+1e-6&&f(1)>=0,`중간 지점에서 ${f(1).toFixed(2)} (절반 이하)로 약해져요.`,`중간 지점 세기가 ${f(1)} 입니다. power의 절반(5) 이하여야 해요.`);
  let dec=true;for(let i=0;i<10;i++)if(f(i*0.2+0.2)>f(i*0.2)+1e-9)dec=false;
  ok('계속 약해짐',dec,'시간이 지날수록 계속 약해져요.','시간이 지났는데 세기가 다시 커지는 구간이 있어요.');
 },
 hints:['진행 비율 t = elapsed / duration 은 0에서 1로 변해요. 세기는 반대로 1에서 0으로 변하면 돼요.','가장 간단한 감쇠는 power × (1 − t). 조금 더 빨리 잦아들게 하려면 (1 − t)를 제곱하세요.','duration을 넘긴 시간이 들어와도 음수가 되지 않게 t를 0~1로 제한하세요.'],
 why:'실제 충격의 진동은 처음에 가장 크고 서서히 감쇠해요. 세기 곡선을 선형(1−t)이나 제곱((1−t)²)으로 감쇠시키면 흔들림이 자연스럽게 끝납니다. 곡선이 위로 볼록할수록 끝이 부드러워요.',
 concepts:[['셰이크 감쇠','충격 직후 강도를 최대로 두고 시간에 따라 0으로 줄여 자연스럽게 끝나게 하는 처리.'],['Mathf.Clamp01','값을 0~1로 제한한다. 진행 비율 계산에서 범위를 벗어난 값을 막는다.']]});

Q({id:'j8',cat:'juice',stage:3,level:2,title:'셰이크가 끝나고 카메라가 제자리로 안 돌아온다',
 story:'카메라 셰이크가 끝난 뒤 카메라가 원래 자리가 아닌 엉뚱한 곳에 남아요. 무작위 오프셋을 위치에 += 로 계속 더하기만 하고, 끝났을 때 되돌리지 않기 때문입니다. 기준 위치를 저장해 두고 "기준 + 오프셋"으로 설정하고, 끝나면 기준 위치로 정확히 복구하도록 코루틴을 완성해 주세요.',
 goals:['Shake(duration, power): 시작 시 기준 위치를 저장한다','매 프레임 흔들림 세기를 남은 시간 비율만큼 줄여 가며(감쇠), x와 y 오프셋을 Random.Range(-1f, 1f) × power × 감쇠 로 구해 위치를 기준 + 오프셋으로 설정한다','끝나면 정확히 기준 위치로 복구한다'],
 limits:['위치에 += 로 누적하지 않는다','오프셋은 Random.Range(-1f, 1f) 로 만든다 (Random.insideUnitCircle 사용 안 함)'],
 api:'transform.position(복사 후 대입), Random.Range, Mathf.Clamp01, yield return null',
 starter:C`
using System.Collections;
using UnityEngine;

public class CameraShake : MonoBehaviour
{
    IEnumerator Shake(float duration, float power)
    {
        float t = 0f;
        while (t < duration)
        {
            t += Time.deltaTime;
            // 위치를 계속 더하기만 하면 원점에서 점점 벗어나요
            Vector3 p = transform.position;
            transform.position = new Vector3(p.x + Random.Range(-1f, 1f) * power, p.y + Random.Range(-1f, 1f) * power, p.z);
            yield return null;
        }
    }
}`,
 solution:C`
using System.Collections;
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
            float damper = 1f - Mathf.Clamp01(t / duration);
            float x = Random.Range(-1f, 1f) * power * damper;
            float y = Random.Range(-1f, 1f) * power * damper;
            transform.position = new Vector3(origin.x + x, origin.y + y, origin.z);
            yield return null;
        }
        transform.position = origin;
    }
}`,
 rules:[
  inFn('기준 위치 저장','Shake',/\b(?:Vector3|Vector2|var)\s+\w+\s*=\s*(?:this\.)?transform\.(?:position|localPosition)\s*;/,'시작할 때 기준 위치를 저장해요.','흔들기 전에 Vector3 origin = transform.position; 처럼 기준 위치를 저장하세요.'),
 ],
 test:(api,ok)=>{
  api.env.Time.deltaTime=0.1;
  api.env.Random.Range=(lo,hi)=>hi;
  api.transform.position={x:5,y:3};
  const co=api.co(api.call('Shake',0.5,0.4));
  let moved=false,bounded=true,n=0;const offs=[];
  while(!co.done&&n++<20){
   co.advance(0.1);
   const p=api.transform.position;
   if(!co.done)offs.push(Math.abs(p.x-5));
   if(Math.abs(p.x-5)>1e-9||Math.abs(p.y-3)>1e-9)moved=true;
   if(Math.abs(p.x-5)>0.4+1e-6||Math.abs(p.y-3)>0.4+1e-6)bounded=false;
  }
  ok('흔들림이 있음',moved,'흔들리는 동안 위치가 달라져요.','위치가 전혀 바뀌지 않았어요. Random.Range로 만든 오프셋을 위치에 적용하세요.');
  const early=offs.length?offs[0]:0,late=offs.length>2?offs[offs.length-1]:early;
  ok('점점 약해짐',offs.length>2&&late<early*0.6,'시간이 지날수록 흔들림이 약해져요.',`처음 흔들림 ${early.toFixed(2)}, 끝 무렵 ${late.toFixed(2)} 입니다. 남은 시간 비율(1 - t / duration)을 곱해 점점 약해지게 하세요.`);
  ok('범위 안에서 흔들림',bounded,'기준 위치에서 power(0.4) 범위 안에서만 흔들려요.','기준 위치에서 power를 넘게 벗어났어요. 위치를 += 로 누적하지 말고 "기준 + 오프셋"으로 설정하세요.');
  const p=api.transform.position;
  ok('정확히 복구',co.done&&p.x===5&&p.y===3,'끝난 뒤 기준 위치 (5, 3)로 정확히 돌아와요.',`끝난 뒤 위치가 (${p.x}, ${p.y}), 끝남=${co.done} 입니다. 마지막에 transform.position = origin; 으로 복구하세요.`);
 },
 hints:['위치에 += 로 오프셋을 더하면 매번 이전 흔들림 위에 쌓여서 원점에서 점점 멀어져요.','기준 위치를 한 번 저장해 두고, 매 프레임 "기준 + 오프셋"을 새로 대입하세요. 오프셋은 누적되지 않아요.','while 루프가 끝난 뒤에 transform.position = origin; 을 한 번 더 넣으면 오차 없이 제자리로 돌아와요.'],
 why:'연출용 변위는 항상 "기준 + 오프셋" 구조로 만들어야 해요. 기준을 보관하고 매번 새로 계산하면 누적 오차가 없고 끝날 때 기준으로 복구하기도 쉽습니다. 세기를 남은 시간 비율로 감쇠시키면 끝이 자연스러워요.',
 concepts:[['오프셋 누적 방지','연출용 변위는 기준 위치를 저장하고 기준 + 오프셋으로 대입한다. +=로 누적하면 원점이 어긋난다.'],['카메라 셰이크','카메라 위치에 시간에 따라 줄어드는 무작위 오프셋을 더해 충격을 표현하는 연출.']]});

Q({id:'j9',cat:'juice',stage:3,level:3,title:'트라우마(Trauma) 방식 셰이크',
 story:'고급 카메라 셰이크는 흔들림 세기를 직접 다루지 않고 "트라우마(0~1)"라는 값을 쌓았다가 시간에 따라 줄이는 방식을 써요. 맞을 때마다 trauma가 쌓이고(최대 1), 실제 흔들림은 trauma의 제곱에 비례해서 약할 때는 거의 안 보이고 강할 때는 확 커집니다.',
 goals:['AddTrauma(amount): trauma에 amount를 더하되 0~1 범위를 벗어나지 않게 한다','Update: trauma를 decayPerSecond × Time.deltaTime 만큼 줄이되 0 아래로 내려가지 않게 한다','Update: 흔들림 세기 = trauma × trauma. x, y 오프셋 = maxOffset × 세기 × Random.Range(-1f, 1f)','Update: 위치는 항상 basePos + 오프셋으로 설정한다 (trauma가 0이면 basePos 그대로)'],
 limits:['위치에 += 로 누적하지 않는다','basePos는 Awake에서 저장한다 (이미 구현되어 있다)'],
 api:'Mathf.Clamp01, Mathf.Max, Random.Range, transform.position',
 starter:C`
using UnityEngine;

public class TraumaShake : MonoBehaviour
{
    public float maxOffset = 1f;
    public float decayPerSecond = 1f;
    private Vector3 basePos;
    private float trauma;

    void Awake()
    {
        basePos = transform.position;
    }

    public void AddTrauma(float amount)
    {
        // TODO: trauma를 더하되 0~1을 벗어나지 않게
    }

    void Update()
    {
        // TODO: trauma 감소, 제곱에 비례한 흔들림, 기준 위치 + 오프셋
    }
}`,
 solution:C`
using UnityEngine;

public class TraumaShake : MonoBehaviour
{
    public float maxOffset = 1f;
    public float decayPerSecond = 1f;
    private Vector3 basePos;
    private float trauma;

    void Awake()
    {
        basePos = transform.position;
    }

    public void AddTrauma(float amount)
    {
        trauma = Mathf.Clamp01(trauma + amount);
    }

    void Update()
    {
        trauma = Mathf.Max(0f, trauma - decayPerSecond * Time.deltaTime);
        float shake = trauma * trauma;
        float ox = maxOffset * shake * Random.Range(-1f, 1f);
        float oy = maxOffset * shake * Random.Range(-1f, 1f);
        transform.position = new Vector3(basePos.x + ox, basePos.y + oy, basePos.z);
    }
}`,
 rules:[
  inFn('감쇠','Update',/decayPerSecond/,'decayPerSecond로 trauma를 줄여요.','Update에서 trauma를 decayPerSecond × Time.deltaTime 만큼 줄이세요.'),
  notIn('위치 누적 금지','Update',/transform\.position\s*(?:\+|-)=/,'위치를 누적하지 않아요.','기준 + 오프셋으로 대입하세요.')
 ],
 test:(api,ok)=>{
  api.env.Time.deltaTime=0.1;
  api.env.Random.Range=(lo,hi)=>hi;
  api.transform.position={x:5,y:3};
  api.call('Awake');
  api.call('AddTrauma',0.5);
  api.call('Update');
  const p=api.transform.position;
  ok('제곱에 비례',Math.abs(p.x-5.16)<1e-6&&Math.abs(p.y-3.16)<1e-6,'trauma 0.4 → 세기 0.16 → 오프셋 0.16 이에요.',`위치가 (${p.x.toFixed(3)}, ${p.y.toFixed(3)}) 입니다. 감쇠 후 trauma 0.4 → 0.4² = 0.16 이므로 (5.16, 3.16) 이어야 해요.`);
  api.call('AddTrauma',5);
  ok('trauma 상한',api.get('trauma')<=1+1e-9&&api.get('trauma')>=1-1e-9,'trauma가 1을 넘지 않아요.',`trauma가 ${api.get('trauma')} 입니다. 1을 넘지 않게 제한하세요.`);
  let n=0;while(api.get('trauma')>0&&n++<30)api.call('Update');
  api.call('Update');
  const q=api.transform.position;
  ok('끝나면 제자리',api.get('trauma')===0&&q.x===5&&q.y===3,'trauma가 0이 되면 정확히 기준 위치로 돌아와요.',`trauma=${api.get('trauma')}, 위치 (${q.x}, ${q.y}). trauma가 0이면 (5, 3)이어야 해요.`);
 },
 hints:['trauma는 "충격이 얼마나 쌓였는가"를 0~1로 나타내는 값이에요. 더할 때 1을 넘지 않게, 줄일 때 0 아래로 내려가지 않게 하세요.','실제 흔들림은 trauma가 아니라 trauma × trauma 에 비례해요. 약한 충격은 은은하게, 강한 충격은 확실하게 느껴져요.','위치는 항상 basePos + (ox, oy) 로 대입하면 trauma가 0일 때 자동으로 basePos가 돼요.'],
 why:'trauma 방식은 연타해서 맞았을 때 자연스럽게 흔들림이 쌓이고, 제곱 곡선 덕분에 약한 충격의 미세한 흔들림과 강한 충격의 큰 흔들림이 분명히 구분돼요. 세기를 상한으로 묶고 기준 + 오프셋 구조를 쓰면 안정적으로 제어됩니다.',
 concepts:[['Trauma 기반 셰이크','충격을 0~1의 trauma 값으로 쌓고 시간에 따라 줄이며, 흔들림은 trauma의 제곱에 비례하게 하는 카메라 셰이크 방식.'],['비선형 매핑','입력 값을 제곱 등으로 변환해 작은 값은 더 작게, 큰 값은 더 크게 만들어 체감을 키우는 기법.']]});
