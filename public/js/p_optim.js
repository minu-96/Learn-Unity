/* ===== 최적화 ===== */
Q({id:'o1',cat:'optimization',stage:1,level:1,title:'매 프레임 문자열을 만들고 있다',
 story:'점수 UI를 갱신하려고 Update에서 매 프레임 "Score: " + score 로 새 문자열을 만들고 있어요. 점수가 그대로여도 프레임마다 문자열이 생성되어 GC 쓰레기가 쌓이고, 텍스트 컴포넌트도 매번 다시 그려져요. 점수가 바뀐 프레임에만 갱신하도록 고쳐 주세요.',
 goals:['점수가 바뀌지 않았으면 scoreText.text 에 아무것도 대입하지 않는다','점수가 바뀌면 "Score: 점수" 형태로 갱신한다','마지막으로 표시한 점수를 필드에 기억한다'],
 limits:['Update 구조는 유지한다'],
 api:'string interpolation $"Score: {score}"',
 starter:C`
using UnityEngine;
using UnityEngine.UI;

public class ScoreUI : MonoBehaviour
{
    public Text scoreText;
    public int score;

    void Update()
    {
        scoreText.text = "Score: " + score;
    }
}`,
 solution:C`
using UnityEngine;
using UnityEngine.UI;

public class ScoreUI : MonoBehaviour
{
    public Text scoreText;
    public int score;
    private int shown = -1;

    void Update()
    {
        if (score == shown) return;
        shown = score;
        scoreText.text = $"Score: {score}";
    }
}`,
 rules:[],
 test:(api,ok)=>{
  let n=0,last='';
  api.set('scoreText',{get text(){return last},set text(v){n++;last=v}});
  api.set('score',5);
  for(let i=0;i<100;i++)api.call('Update');
  ok('한 번만 갱신',n===1,'점수가 그대로면 100프레임 동안 1번만 갱신해요.',`점수가 그대로인데 텍스트를 ${n}번 갱신했어요. 바뀐 프레임에만 갱신해야 해요.`);
  ok('표시 내용','Score: 5'===last,'"Score: 5"로 표시돼요.',`표시된 텍스트가 "${last}" 입니다. "Score: 5"여야 해요.`);
  api.set('score',6);api.call('Update');api.call('Update');
  ok('변하면 갱신',n===2&&last==='Score: 6','점수가 바뀌면 다시 갱신해요.',`점수를 6으로 바꾼 뒤 갱신 횟수 ${n}, 텍스트 "${last}". 갱신 횟수 2, "Score: 6"이어야 해요.`);
 },
 hints:['문자열 연결은 매번 새 문자열 객체를 만들어요. 쓰레기(garbage)가 쌓이면 GC가 돌면서 프레임이 끊길 수 있어요.','"바뀌었는가?"를 판단하려면 마지막으로 표시한 값을 기억하고 있어야 해요.','같으면 바로 return, 다르면 값을 기억하고 한 번만 텍스트를 갱신하세요.'],
 why:'가장 싼 최적화는 "하지 않는 것"이에요. 값이 바뀔 때만 갱신하면 문자열 생성과 UI 재구성 비용을 대부분 없앨 수 있습니다. 변경 감지 또는 이벤트 기반 갱신은 UI 최적화의 기본이에요.',
 concepts:[['GC 할당','문자열 연결 같은 힙 할당이 쌓이면 가비지 컬렉션이 일어나 프레임이 순간적으로 끊긴다.'],['변경 감지','이전 값을 기억해 두었다가 달라졌을 때만 비싼 작업(UI 갱신)을 수행한다.']]});

Q({id:'o2',cat:'optimization',stage:1,level:2,title:'총알을 매번 Instantiate/Destroy 하지 않기: 오브젝트 풀',
 story:'총알을 쏠 때마다 Instantiate, 맞으면 Destroy를 하고 있어요. 연사가 빠르면 메모리 할당과 GC 때문에 프레임이 끊깁니다. 쓴 총알을 파괴하지 않고 비활성화해서 보관했다가 다시 꺼내 쓰는 오브젝트 풀을 만들어 주세요.',
 goals:['Get(): 풀에 쉬고 있는 오브젝트가 있으면 하나 꺼내서 활성화해 반환한다','풀이 비어 있으면 Instantiate(prefab)으로 새로 만든다','Release(obj): 파괴하지 않고 비활성화한 뒤 풀에 넣는다'],
 limits:['Release에서 Destroy 를 호출하지 않는다','풀은 List<GameObject> 로 관리한다'],
 api:'Instantiate(prefab), obj.SetActive(bool), List.Add / RemoveAt / Count',
 starter:C`
using System.Collections.Generic;
using UnityEngine;

public class BulletPool : MonoBehaviour
{
    public GameObject prefab;
    private List<GameObject> pool = new List<GameObject>();

    public GameObject Get()
    {
        return Instantiate(prefab);
    }

    public void Release(GameObject obj)
    {
        Destroy(obj);
    }
}`,
 solution:C`
using System.Collections.Generic;
using UnityEngine;

public class BulletPool : MonoBehaviour
{
    public GameObject prefab;
    private List<GameObject> pool = new List<GameObject>();

    public GameObject Get()
    {
        if (pool.Count > 0)
        {
            GameObject obj = pool[pool.Count - 1];
            pool.RemoveAt(pool.Count - 1);
            obj.SetActive(true);
            return obj;
        }
        return Instantiate(prefab);
    }

    public void Release(GameObject obj)
    {
        obj.SetActive(false);
        pool.Add(obj);
    }
}`,
 rules:[notIn('Release에서 Destroy 금지','Release',/\bDestroy\s*\(/,'Release에서 Destroy하지 않아요.','Release에서 Destroy하지 말고 비활성화한 뒤 풀에 보관하세요.')],
 test:(api,ok)=>{
  const env=api.env;env.instantiated.length=0;env.destroyed.length=0;
  api.set('prefab',{activeSelf:true,SetActive(v){this.activeSelf=v}});
  const a=api.call('Get');
  ok('처음엔 생성',env.instantiated.length===1,'풀이 비어 있으면 새로 만들어요.','풀이 비어 있을 때는 Instantiate로 하나 만들어야 해요.');
  api.call('Release',a);
  ok('반납 시 비활성화',a.activeSelf===false&&env.destroyed.length===0,'반납한 오브젝트는 파괴하지 않고 비활성화해요.','Release 후 오브젝트가 비활성화되어야 하고 Destroy되면 안 돼요.');
  const b=api.call('Get');
  ok('재사용',b===a&&a.activeSelf===true&&env.instantiated.length===1,'반납한 오브젝트를 다시 꺼내 활성화해요 (새로 만들지 않음).','다시 Get했을 때 반납한 오브젝트를 재사용해야 해요 (Instantiate 호출이 늘면 안 돼요).');
  const c=api.call('Get');
  ok('모자라면 추가 생성',c!==b&&env.instantiated.length===2,'풀이 비면 다시 새로 만들어요.','풀이 비어 있으면 새 오브젝트를 만들어야 해요.');
 },
 hints:['Destroy는 메모리를 해제하고 Instantiate는 새로 할당해요. 둘 다 연속으로 일어나면 GC 부담이 커져요.','"파괴" 대신 "비활성화 + 보관", "생성" 대신 "보관소에서 꺼내 활성화"로 바꾸면 돼요.','Get은 풀에서 꺼낼 게 있으면 꺼내고(없으면 새로 생성), Release는 비활성화한 뒤 풀에 넣으세요.'],
 why:'오브젝트 풀링은 자주 만들고 없애는 대상(총알, 이펙트, 적)의 할당을 없애 GC 스파이크를 막는 정석이에요. 켜질 때 상태를 초기화(위치, 체력)하는 것을 잊지 마세요. Unity에는 ObjectPool<T> 클래스도 있습니다.',
 concepts:[['오브젝트 풀링','자주 생성·파괴되는 오브젝트를 미리 만들어 두고 비활성화/활성화로 재사용해 할당과 GC를 줄이는 기법.'],['Instantiate/Destroy 비용','생성과 파괴는 메모리 할당과 GC를 유발해 빈번히 일어나면 프레임이 끊긴다.']]});

Q({id:'o3',cat:'optimization',stage:1,level:3,title:'가장 가까운 적 찾기: 할당 없이',
 story:'매 프레임 호출되는 "가장 가까운 적 찾기"가 리스트를 복사하고 있어요. 호출될 때마다 새 컬렉션을 만들어서 GC 쓰레기가 쌓입니다. 새 객체나 LINQ 없이 반복문 하나로 가장 가까운 적의 인덱스를 찾아 주세요.',
 goals:['NearestIndex(xs, px): xs 중에서 px 에 가장 가까운 값의 인덱스를 반환한다','xs 가 비어 있으면 -1','함수 안에서 new 로 컬렉션을 만들지 않고, LINQ(OrderBy, First, Min 등)도 쓰지 않는다'],
 limits:['거리는 Mathf.Abs(xs[i] - px)','동률이면 앞쪽 인덱스'],
 api:'for 루프, Mathf.Abs',
 starter:C`
int NearestIndex(float[] xs, float px)
{
    List<float> copy = new List<float>(xs);
    int best = 0;
    for (int i = 0; i < copy.Count; i++)
    {
        if (Mathf.Abs(copy[i] - px) < Mathf.Abs(copy[best] - px)) best = i;
    }
    return best;
}`,
 solution:C`
int NearestIndex(float[] xs, float px)
{
    int best = -1;
    float bestDist = Mathf.Infinity;
    for (int i = 0; i < xs.Length; i++)
    {
        float d = Mathf.Abs(xs[i] - px);
        if (d < bestDist)
        {
            bestDist = d;
            best = i;
        }
    }
    return best;
}`,
 rules:[notIn('할당/LINQ 금지','NearestIndex',/\bnew\b|\.\s*(?:OrderBy|Where|Select|First|FirstOrDefault|Min|Max|ToList|ToArray|Any)\s*\(/,'할당이나 LINQ 없이 반복문으로 찾아요.','NearestIndex 안에서 new 컬렉션이나 LINQ를 쓰지 마세요. 반복문 하나와 변수 두 개면 충분해요.')],
 test:(api,ok)=>{
  const n=(xs,p)=>api.call('NearestIndex',xs,p);
  ok('가까운 값',n([1,5,9],6)===1&&n([1,5,9],100)===2&&n([1,5,9],-3)===0,'가장 가까운 인덱스를 찾아요.',`NearestIndex([1,5,9], 6)=${n([1,5,9],6)}, 100→${n([1,5,9],100)}, −3→${n([1,5,9],-3)}. 각각 1, 2, 0이어야 해요.`);
  ok('빈 배열',n([],3)===-1,'비어 있으면 −1이에요.',`빈 배열에서 ${n([],3)} 입니다. −1이어야 해요.`);
  ok('동률은 앞쪽',n([2,4],3)===0,'동률이면 앞쪽 인덱스예요.',`NearestIndex([2,4], 3)=${n([2,4],3)}. 동률이면 0(앞쪽)이어야 해요.`);
  ok('한 개',n([7],0)===0,'원소가 하나면 0이에요.','원소가 하나일 때 0이어야 해요.');
 },
 hints:['"현재까지 가장 가까운 거리"를 기억하는 변수 하나만 있으면 한 번의 순회로 충분해요.','처음엔 아무것도 못 찾은 상태(best = −1, 거리 = 무한대)로 시작하세요.','더 가까운 값을 만나면 거리와 인덱스를 함께 갱신하세요. 같을 때는 갱신하지 않으면 앞쪽이 유지돼요.'],
 why:'매 프레임 호출되는 코드(핫 패스)에서는 new로 컬렉션을 만들거나 LINQ를 쓰면 쓰레기가 계속 쌓여요. 변수 몇 개와 for 루프만으로 할당 없이 구현하는 습관이 모바일 성능에서 큰 차이를 만듭니다.',
 concepts:[['핫 패스(Hot Path)','Update처럼 매우 자주 실행되는 코드. 여기서의 할당과 비효율은 누적되어 성능에 큰 영향을 준다.'],['LINQ와 GC','LINQ는 편리하지만 내부에서 임시 객체를 할당해 매 프레임 호출 코드에는 적합하지 않다.']]});

Q({id:'o4',cat:'optimization',stage:2,level:1,title:'측정부터: 프레임 시간 프로파일러',
 story:'"게임이 가끔 끊겨요"라는 말만으로는 최적화할 수 없어요. 먼저 측정해야 합니다. 최근 4프레임의 프레임 시간을 저장하는 링 버퍼를 만들고, 평균과 "스파이크(평균의 2배를 넘는 프레임)" 판정을 구현해 주세요.',
 goals:['Add(dt): 버퍼에 프레임 시간을 저장한다. 가득 차면 가장 오래된 값을 덮어쓴다 (링 버퍼)','Average(): 지금까지 저장된 값들의 평균 (아직 4개가 안 찼으면 저장된 개수로 나눈다, 0개면 0)','IsSpike(dt): 저장된 값이 있고 dt 가 평균의 2배를 넘으면 true'],
 limits:['버퍼 크기는 4 (buf 필드 제공)'],
 api:'idx = (idx + 1) % buf.Length',
 starter:C`
public float[] buf = new float[4];
private int idx;
private int count;

public void Add(float dt)
{
    // TODO: 링 버퍼에 저장
}

public float Average()
{
    return 0f;
}

public bool IsSpike(float dt)
{
    return false;
}`,
 solution:C`
public float[] buf = new float[4];
private int idx;
private int count;

public void Add(float dt)
{
    buf[idx] = dt;
    idx = (idx + 1) % buf.Length;
    if (count < buf.Length) count++;
}

public float Average()
{
    if (count == 0) return 0f;
    float sum = 0f;
    for (int i = 0; i < count; i++) sum += buf[i];
    return sum / count;
}

public bool IsSpike(float dt)
{
    return count > 0 && dt > Average() * 2f;
}`,
 rules:[],
 test:(api,ok)=>{
  const near=(a,b)=>Math.abs(a-b)<1e-6;
  ok('비어 있을 때',api.call('Average')===0&&api.call('IsSpike',1)===false,'비어 있으면 평균 0, 스파이크 아님이에요.','저장된 값이 없을 때 Average는 0, IsSpike는 false여야 해요.');
  api.call('Add',0.02);api.call('Add',0.04);
  ok('덜 찬 평균',near(api.call('Average'),0.03),'2개만 저장됐을 땐 2로 나눠요 (0.03).',`Average = ${api.call('Average')} 입니다. 저장된 2개의 평균 0.03이어야 해요 (버퍼 길이 4로 나누면 안 돼요).`);
  api.call('Add',0.01);api.call('Add',0.01);
  ok('가득 찬 평균',near(api.call('Average'),0.02),'4개의 평균은 0.02예요.',`Average = ${api.call('Average')} 입니다. 0.02여야 해요.`);
  api.call('Add',0.1);
  ok('링 버퍼 덮어쓰기',near(api.call('Average'),0.04),'가장 오래된 값(0.02)이 0.1로 교체돼 평균 0.04예요.',`Average = ${api.call('Average')} 입니다. 5번째 값은 가장 오래된 값을 덮어써야 해요 → (0.1+0.04+0.01+0.01)/4 = 0.04.`);
  ok('스파이크 판정',api.call('IsSpike',0.09)===true&&api.call('IsSpike',0.07)===false,'평균(0.04)의 2배(0.08)를 넘으면 스파이크예요.',`IsSpike(0.09)=${api.call('IsSpike',0.09)}, IsSpike(0.07)=${api.call('IsSpike',0.07)}. 각각 true, false여야 해요.`);
 },
 hints:['링 버퍼는 고정 크기 배열에 쓰는 위치(idx)를 계속 돌리는 구조예요. 끝에 도달하면 처음으로 돌아가 가장 오래된 값을 덮어써요.','평균은 "채워진 개수"로 나눠야 해요. 처음 몇 프레임은 버퍼가 덜 찼으니까요. 채워진 개수를 세는 변수가 필요해요.','IsSpike는 평균을 먼저 구하고 dt가 그 2배를 넘는지 비교해요. 저장된 값이 없을 때는 false로 처리하세요.'],
 why:'최적화는 추측이 아니라 측정에서 시작해요. 프레임 시간의 평균과 스파이크를 기록하면 "언제 끊기는지"를 알 수 있고, 그 시점을 Unity Profiler로 파고들어 원인을 찾을 수 있습니다.',
 concepts:[['Profiler 우선 최적화','추측으로 최적화하지 말고 Profiler로 병목을 측정한 뒤 가장 큰 비용부터 줄인다.'],['링 버퍼','고정 크기 배열에서 쓰기 위치를 순환시켜 최근 N개의 값만 유지하는 자료구조.'],['프레임 스파이크','평소보다 유난히 오래 걸린 프레임. 체감 끊김의 주된 원인이다.']]});

Q({id:'o5',cat:'optimization',stage:2,level:2,title:'.material 을 쓰면 배칭이 깨진다',
 story:'적을 맞으면 하얗게 번쩍이게 하려고 renderer.material.color 를 바꿨더니, 적 100마리가 각자 머티리얼 복사본을 갖게 되어 Draw Call이 100배로 늘었어요. renderer.material 은 접근하는 순간 머티리얼을 복제하기 때문입니다. 머티리얼을 복제하지 않고 오브젝트별로 색만 다르게 보이려면 MaterialPropertyBlock 을 써야 합니다.',
 goals:['Highlight(c): MaterialPropertyBlock 을 만들어(없을 때만) _Color 에 c 를 설정한다','rend.SetPropertyBlock(block) 으로 렌더러에 적용한다','rend.material 은 사용하지 않는다'],
 limits:['블록은 필드에 저장해 재사용한다 (매번 new 하지 않기)'],
 api:'new MaterialPropertyBlock(), block.SetColor("_Color", c), rend.SetPropertyBlock(block)',
 starter:C`
using UnityEngine;

public class HitFlash : MonoBehaviour
{
    [SerializeField] private Renderer rend;

    public void Highlight(Color c)
    {
        rend.material.color = c;
    }
}`,
 solution:C`
using UnityEngine;

public class HitFlash : MonoBehaviour
{
    [SerializeField] private Renderer rend;
    private MaterialPropertyBlock block;

    public void Highlight(Color c)
    {
        if (block == null) block = new MaterialPropertyBlock();
        block.SetColor("_Color", c);
        rend.SetPropertyBlock(block);
    }
}`,
 rules:[
  no('.material 금지',/\.material\b/,'.material을 쓰지 않아요.','renderer.material은 접근 시 머티리얼을 복제해요. MaterialPropertyBlock을 쓰세요.'),
  has('SetPropertyBlock',/SetPropertyBlock\s*\(/,'SetPropertyBlock으로 적용해요.','rend.SetPropertyBlock(block) 으로 적용하세요.')
 ],
 test:(api,ok)=>{
  let mc=0;const sets=[];
  api.set('rend',{get material(){mc++;return {color:null}},sets,SetPropertyBlock(b){sets.push(b)}});
  api.call('Highlight',{r:1,g:0,b:0,a:1});
  api.call('Highlight',{r:0,g:1,b:0,a:1});
  ok('머티리얼 복제 없음',mc===0,'머티리얼을 복제하지 않아요.',`.material에 ${mc}번 접근했어요. 접근할 때마다 머티리얼이 복제돼요.`);
  ok('블록 적용',sets.length===2&&sets[1].colors&&sets[1].colors._Color&&sets[1].colors._Color.g===1,'매번 _Color를 설정한 블록을 적용해요.','SetPropertyBlock에 _Color가 설정된 블록을 넘겨야 해요.');
  ok('블록 재사용',sets.length===2&&sets[0]===sets[1],'블록 하나를 재사용해요.','매번 새 블록을 만들지 말고 필드에 저장해 재사용하세요.');
 },
 hints:['renderer.material에 접근하는 순간 Unity는 그 렌더러 전용 머티리얼 복사본을 만들어요. 공유 머티리얼이 아니게 되어 배칭이 깨져요.','머티리얼은 그대로 두고 "이 렌더러만 이 값을 덮어쓴다"는 정보를 따로 전달하는 도구가 MaterialPropertyBlock이에요.','블록은 한 번만 만들어 필드에 보관하고, 색만 바꿔서 SetPropertyBlock으로 다시 적용하세요.'],
 why:'같은 머티리얼을 공유하는 오브젝트는 배칭으로 한 번에 그릴 수 있어요. .material로 접근하면 복제되어 공유가 깨지고 Draw Call과 메모리가 늘어납니다. 개별 색이나 값만 다를 때는 MaterialPropertyBlock이 해법이에요.',
 concepts:[['Draw Call과 배칭','같은 머티리얼을 쓰는 오브젝트는 묶어서 한 번에 그릴 수 있다. 머티리얼이 갈라지면 Draw Call이 늘어난다.'],['Renderer.material vs sharedMaterial','material은 접근 시 복제본을 만들고, sharedMaterial은 공유 원본을 가리킨다.'],['MaterialPropertyBlock','머티리얼을 복제하지 않고 렌더러별로 속성 값을 덮어쓰는 도구.']]});

Q({id:'o6',cat:'optimization',stage:2,level:3,title:'텍스처가 메모리를 얼마나 먹을까?',
 story:'모바일에서 메모리 부족으로 앱이 꺼져요. 범인 후보는 큰 텍스처입니다. 텍스처 한 장이 메모리를 얼마나 차지하는지 계산하는 함수를 만들어 압축의 효과를 눈으로 확인해 보세요. 메모리 = 가로 × 세로 × 픽셀당 비트 수 ÷ 8 (바이트), 밉맵을 쓰면 약 4/3배가 됩니다.',
 goals:['EstimateKB(width, height, bitsPerPixel, mipmaps): 텍스처의 예상 메모리를 KB(1024 바이트) 단위의 정수(소수점 버림)로 반환한다','밉맵이 켜져 있으면 전체에 4/3 을 곱한다','예: 1024×1024, RGBA32(32비트), 밉맵 없음 → 4096KB. 4비트 압축 텍스처는 → 512KB'],
 limits:['중간 계산은 float 으로 한다 (정수 나눗셈으로 소수점이 사라지지 않게)'],
 starter:C`
int EstimateKB(int width, int height, int bitsPerPixel, bool mipmaps)
{
    return 0;
}`,
 solution:C`
int EstimateKB(int width, int height, int bitsPerPixel, bool mipmaps)
{
    float bytes = width * height * bitsPerPixel / 8f;
    if (mipmaps) bytes *= 4f / 3f;
    return (int)(bytes / 1024f);
}`,
 rules:[],
 test:(api,ok)=>{
  const e=(w,h,b,m)=>api.call('EstimateKB',w,h,b,m);
  ok('RGBA32',e(1024,1024,32,false)===4096,'1024×1024 RGBA32는 4096KB예요.',`결과 ${e(1024,1024,32,false)}KB. 4096KB여야 해요 (1024×1024×4바이트).`);
  ok('압축 텍스처',e(1024,1024,4,false)===512&&e(2048,2048,4,false)===2048,'4비트 압축은 8분의 1 크기예요 (512KB).',`1024², 4bpp → ${e(1024,1024,4,false)}KB (512KB여야 해요).`);
  const m=e(1024,1024,32,true);
  ok('밉맵',m>=5460&&m<=5462,'밉맵을 켜면 약 33% 더 커져요 (5461KB).',`밉맵 포함 결과 ${m}KB. 4096 × 4/3 ≈ 5461KB여야 해요.`);
  const m2=e(1024,1024,4,true);
  ok('압축 + 밉맵',m2>=681&&m2<=683,'압축+밉맵은 약 682KB예요.',`결과 ${m2}KB. 512 × 4/3 ≈ 682KB여야 해요.`);
  ok('정수 반환',Number.isInteger(m),'결과는 소수점이 버려진 정수예요.','정수(int)로 변환해서 반환하세요.');
 },
 hints:['픽셀 수 × 픽셀당 비트 ÷ 8 = 바이트. 1024에서 KB로 바꾸려면 다시 1024로 나눠요.','4/3 같은 비율은 정수로 쓰면 1이 돼 버려요. 4f / 3f 처럼 float으로 쓰세요.','마지막에 (int)로 변환하면 소수점이 버려져요.'],
 why:'텍스처는 모바일 메모리의 가장 큰 비중을 차지하는 자원이에요. 해상도는 제곱으로, 비트 수는 비례로 메모리를 늘리고 밉맵은 1/3을 더합니다. 4~8비트 압축 포맷(ASTC, ETC2)은 메모리를 4~8배 줄여요. 수치를 계산해 보면 어디를 줄여야 할지 보입니다.',
 concepts:[['텍스처 메모리 계산','가로 × 세로 × 픽셀당 비트 ÷ 8. 해상도를 두 배로 키우면 메모리는 네 배가 된다.'],['텍스처 압축','ASTC·ETC2 같은 GPU 압축 포맷은 비트 수를 줄여 메모리와 대역폭을 크게 절약한다.'],['밉맵(Mipmap)','멀리 있는 오브젝트용 축소 텍스처 체인. 품질과 성능을 얻는 대신 메모리가 약 33% 늘어난다.']]});
