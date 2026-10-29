/* ===== 파티클·VFX ===== */
Q({id:'p1',cat:'particle',stage:1,level:1,title:'한순간에 터뜨리기 (Burst)',
 story:'폭발 이펙트를 만들었는데 씬이 시작되자마자 파티클이 계속 흘러나와요. 폭발은 "필요한 순간에 한 번, 한꺼번에" 터져야 합니다. 자동 재생과 반복, 지속 방출을 끄고 Explode()가 호출될 때 파티클 30개를 한 번에 방출하게 해 주세요.',
 goals:['Awake에서 main 모듈: 반복(loop)과 자동 재생(playOnAwake)을 끈다','Awake에서 emission 모듈: 지속 방출량(rateOverTime)을 0으로 만든다','Explode()에서 파티클 30개를 즉시 방출한다 (ps.Emit)'],
 limits:['ps.main.loop = false 처럼 모듈에 바로 대입하면 컴파일 에러(CS1612)예요. var main = ps.main; 처럼 변수에 담아 수정하세요'],
 api:'ps.main.loop / playOnAwake, ps.emission.rateOverTime, ps.Emit(int)',
 starter:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class ExplosionFx : MonoBehaviour
{
    private ParticleSystem ps;

    void Awake()
    {
        ps = GetComponent<ParticleSystem>();
        // TODO: 자동 재생과 반복을 끄고, 지속 방출도 0으로 만드세요
    }

    public void Explode()
    {
        // TODO: 한순간에 파티클 30개를 터뜨리세요
    }
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class ExplosionFx : MonoBehaviour
{
    private ParticleSystem ps;

    void Awake()
    {
        ps = GetComponent<ParticleSystem>();

        var main = ps.main;
        main.loop = false;
        main.playOnAwake = false;

        var emission = ps.emission;
        emission.rateOverTime = 0f;
    }

    public void Explode()
    {
        ps.Emit(30);
    }
}`,
 rules:[
  inFn('loop 끄기','Awake',/\bloop\s*=\s*false\s*;/,'반복을 껐어요.','main.loop = false; 로 반복 재생을 끄세요.'),
  inFn('자동 재생 끄기','Awake',/\bplayOnAwake\s*=\s*false\s*;/,'자동 재생을 껐어요.','main.playOnAwake = false; 로 시작하자마자 재생되는 것을 막으세요.'),
  inFn('지속 방출 0','Awake',/\brateOverTime\s*=\s*0(?:\.0*)?f?\s*;/,'지속 방출량을 0으로 만들었어요.','emission.rateOverTime = 0f; 로 시간에 따른 지속 방출을 끄세요. 안 끄면 Emit과 별개로 계속 흘러나와요.'),
  inFn('Emit(30)','Explode',/\bEmit\s*\(\s*30\s*\)/,'Emit(30)으로 30개를 한 번에 방출해요.','ps.Emit(30) 으로 파티클 30개를 즉시 방출하세요.')
 ],
 test:(api,ok)=>{
  const ps=api.mk.ps();api.env.components.ParticleSystem=ps;
  api.call('Awake');
  ok('main 설정',ps.main.loop===false&&ps.main.playOnAwake===false,'반복과 자동 재생이 꺼졌어요.',`loop=${ps.main.loop}, playOnAwake=${ps.main.playOnAwake}. 둘 다 false여야 해요.`);
  ok('지속 방출',ps.emission.rateOverTime===0,'지속 방출량이 0이에요.',`rateOverTime이 ${ps.emission.rateOverTime} 입니다. 0이어야 해요.`);
  api.call('Explode');
  const e=ps.calls.filter(c=>c[0]==='Emit');
  ok('한 번에 30개',e.length===1&&e[0][1]===30,'Explode가 30개를 한 번에 방출해요.','Explode()에서 ps.Emit(30) 을 한 번 호출해야 해요.');
 },
 hints:['ParticleSystem은 모듈의 모음이에요. 반복·자동 재생은 main 모듈, 지속 방출은 emission 모듈에 있어요.','모듈은 var main = ps.main; 처럼 변수에 담은 뒤 값을 바꿔야 해요. (ps.main.loop = false 는 컴파일 에러)','ps.Emit(숫자) 는 지정한 수만큼의 파티클을 그 자리에서 바로 만들어요.'],
 why:'폭발·피격 같은 일회성 이펙트는 "시간에 따라 흘러나오는" 방식(rateOverTime)이 아니라 필요한 순간 한 번에 방출(Burst, Emit)해야 해요. 모듈 구조체는 변수로 받아 수정하는 것이 ParticleSystem 스크립팅의 기본 문법입니다.',
 concepts:[['Emission과 Burst','Emission은 파티클 생성 방식. rateOverTime은 지속 방출, Burst/Emit은 한순간에 여러 개 방출한다.'],['ParticleSystem 모듈 접근','main, emission 같은 모듈은 구조체 프로퍼티라 var main = ps.main; 처럼 변수에 담아 수정한다.'],['playOnAwake / loop','시작하자마자 재생할지, 끝나면 반복할지 정하는 main 모듈 설정.']]});

Q({id:'p2',cat:'particle',stage:1,level:2,title:'오라는 몸에 붙고, 트레일은 뒤에 남게',
 story:'캐릭터가 움직일 때 몸을 감싸는 오라 이펙트는 캐릭터를 따라다녀야 하고, 지나간 자리에 남는 먼지 트레일은 그 자리에 남아야 해요. 지금은 둘이 같은 방식으로 동작해서 오라가 뒤처지거나 트레일이 캐릭터에 붙어 다닙니다. 파티클 좌표계(Simulation Space)를 각각 맞게 설정해 주세요.',
 goals:['aura: 오브젝트와 함께 움직이도록 Simulation Space를 Local로 설정한다','trail: 오브젝트가 움직여도 이미 나온 파티클은 제자리에 남도록 World로 설정한다','둘 다 Play()로 재생을 시작한다'],
 limits:['모듈은 변수에 담아 수정한다 (ps.main.simulationSpace = ... 는 컴파일 에러)'],
 api:'main.simulationSpace = ParticleSystemSimulationSpace.Local / World, ps.Play()',
 starter:C`
using UnityEngine;

public class AuraAndTrail : MonoBehaviour
{
    [SerializeField] private ParticleSystem aura;    // 몸을 감싸고 함께 움직여야 함
    [SerializeField] private ParticleSystem trail;   // 지나간 자리에 남아야 함

    void Awake()
    {
        // TODO
    }
}`,
 solution:C`
using UnityEngine;

public class AuraAndTrail : MonoBehaviour
{
    [SerializeField] private ParticleSystem aura;
    [SerializeField] private ParticleSystem trail;

    void Awake()
    {
        var auraMain = aura.main;
        auraMain.simulationSpace = ParticleSystemSimulationSpace.Local;

        var trailMain = trail.main;
        trailMain.simulationSpace = ParticleSystemSimulationSpace.World;

        aura.Play();
        trail.Play();
    }
}`,
 rules:[
  inFn('Local 지정','Awake',/simulationSpace\s*=\s*ParticleSystemSimulationSpace\.Local/,'오라를 Local로 설정했어요.','오라에는 ParticleSystemSimulationSpace.Local 을 지정하세요.'),
  inFn('World 지정','Awake',/simulationSpace\s*=\s*ParticleSystemSimulationSpace\.World/,'트레일을 World로 설정했어요.','트레일에는 ParticleSystemSimulationSpace.World 를 지정하세요.')
 ],
 test:(api,ok)=>{
  const a=api.mk.ps(),t=api.mk.ps();
  api.set('aura',a);api.set('trail',t);
  api.call('Awake');
  ok('aura는 Local',a.main.simulationSpace==='Local','오라는 오브젝트와 함께 움직여요 (Local).',`aura의 simulationSpace가 ${a.main.simulationSpace} 입니다. Local이어야 오브젝트를 따라다녀요.`);
  ok('trail은 World',t.main.simulationSpace==='World','트레일은 이미 나온 파티클이 제자리에 남아요 (World).',`trail의 simulationSpace가 ${t.main.simulationSpace} 입니다. World여야 지나간 자리에 남아요.`);
  ok('재생 시작',a.calls.some(c=>c[0]==='Play')&&t.calls.some(c=>c[0]==='Play'),'두 시스템 모두 재생을 시작해요.','aura.Play(); trail.Play(); 로 재생을 시작하세요.');
 },
 hints:['Simulation Space는 파티클이 어떤 좌표계에서 움직이는지 정해요: Local, World, Custom.','Local이면 파티클이 오브젝트의 자식처럼 따라 움직이고, World이면 만들어진 순간의 월드 위치에 남아요.','main 모듈을 변수에 담아 simulationSpace에 ParticleSystemSimulationSpace.Local 같은 열거형을 대입하세요.'],
 why:'Simulation Space는 "발사 후 파티클이 누구를 기준으로 움직이는가"를 정해요. 몸에 붙는 오라·버프는 Local, 지나간 자리에 남는 먼지·연기·궤적은 World를 씁니다. 같은 이펙트도 이 설정 하나로 인상이 완전히 달라져요.',
 concepts:[['Simulation Space','파티클이 오브젝트(Local) 기준으로 움직이는지, 월드(World) 기준으로 남는지 정하는 설정.'],['Local vs World 이펙트','몸을 감싸는 오라는 Local, 지나간 자리에 남는 트레일·연기는 World로 둔다.']]});

Q({id:'p3',cat:'particle',stage:1,level:3,title:'끝난 이펙트가 씬에 쌓인다',
 story:'타격 이펙트를 Instantiate로 계속 만들었더니 재생이 끝나도 오브젝트가 사라지지 않고 씬에 쌓여서, 몇 분 뒤 프레임이 떨어졌어요. 이펙트는 한 번 재생하고 끝나면 스스로 파괴되어야 합니다. Destroy(gameObject, 2f) 같은 하드코딩 대신 ParticleSystem의 설정으로 해결해 주세요.',
 goals:['반복하지 않고 한 번만 재생한다 (loop = false)','재생이 끝나면 오브젝트가 자동으로 파괴되도록 Stop Action을 Destroy로 설정한다','Awake에서 재생을 시작한다'],
 limits:['Destroy(...) 를 직접 호출하지 않는다 — 이펙트 길이가 바뀌어도 알아서 맞게 파괴되어야 한다'],
 api:'main.loop, main.stopAction = ParticleSystemStopAction.Destroy, ps.Play()',
 starter:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class HitSpark : MonoBehaviour
{
    void Awake()
    {
        ParticleSystem ps = GetComponent<ParticleSystem>();
        // TODO: 한 번 재생하고, 끝나면 스스로 파괴되게 하세요
    }
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class HitSpark : MonoBehaviour
{
    void Awake()
    {
        ParticleSystem ps = GetComponent<ParticleSystem>();

        var main = ps.main;
        main.loop = false;
        main.stopAction = ParticleSystemStopAction.Destroy;

        ps.Play();
    }
}`,
 rules:[
  no('Destroy 직접 호출 금지',/\bDestroy\s*\(/,'Destroy를 직접 부르지 않았어요.','Destroy(gameObject, 시간) 은 이펙트 길이가 바뀌면 어긋나요. Stop Action 설정으로 해결하세요.'),
  inFn('Stop Action = Destroy','Awake',/stopAction\s*=\s*ParticleSystemStopAction\.Destroy/,'Stop Action을 Destroy로 설정했어요.','main.stopAction = ParticleSystemStopAction.Destroy; 를 설정하세요.'),
  inFn('loop 끄기','Awake',/\bloop\s*=\s*false\s*;/,'반복을 껐어요.','loop가 켜져 있으면 끝나지 않아서 파괴되지 않아요. main.loop = false;')
 ],
 test:(api,ok)=>{
  const ps=api.mk.ps();api.env.components.ParticleSystem=ps;
  api.call('Awake');
  ok('반복 끔',ps.main.loop===false,'한 번만 재생해요.','loop가 true면 이펙트가 끝나지 않아요. false로 바꾸세요.');
  ok('Stop Action',ps.main.stopAction==='Destroy','재생이 끝나면 오브젝트가 파괴돼요.',`stopAction이 ${ps.main.stopAction} 입니다. ParticleSystemStopAction.Destroy 로 설정하세요.`);
  ok('재생 시작',ps.calls.some(c=>c[0]==='Play'),'재생을 시작해요.','ps.Play() 로 재생을 시작하세요.');
 },
 hints:['ParticleSystem의 main 모듈에는 "재생이 끝나면 무엇을 할까"를 정하는 stopAction이 있어요.','Stop Action은 None, Disable, Destroy, Callback 중에서 고를 수 있어요.','반복 재생(loop)이 켜져 있으면 "끝남"이 없어서 Stop Action이 실행되지 않아요.'],
 why:'이펙트 오브젝트를 생성만 하고 정리하지 않으면 씬에 계속 쌓여서 성능이 떨어져요. Stop Action = Destroy(또는 풀링이면 Disable)는 이펙트가 끝난 시점에 정확히 정리해 주어서, 이펙트 길이를 바꿔도 코드를 고칠 필요가 없습니다.',
 concepts:[['Stop Action','파티클 재생이 모두 끝났을 때 오브젝트를 비활성화(Disable), 파괴(Destroy), 콜백 호출(Callback) 중 무엇을 할지 정하는 설정.'],['이펙트 정리','일회성 이펙트는 끝나면 스스로 정리되게 해서 씬에 쌓이는 것을 막는다.']]});

Q({id:'p4',cat:'particle',stage:2,level:1,title:'위로 좁게 솟는 불꽃 만들기',
 story:'횃불 불꽃을 만들려는데 파티클이 사방으로 퍼져서 폭죽처럼 보여요. 불꽃은 좁은 원뿔 모양으로 위로 솟고, 시간이 지나면 살짝 위로 떠올라야 합니다. Shape 모듈과 Main 모듈 값을 코드로 설정해 주세요.',
 goals:['Shape 모듈: shapeType을 Cone으로, angle(퍼지는 각도)을 20 이하로 설정한다','Main 모듈: startSpeed를 2~6 사이로 설정한다','Main 모듈: gravityModifier를 음수로 설정해 파티클이 위로 떠오르게 한다'],
 limits:['모듈은 변수에 담아 수정한다'],
 api:'shape.shapeType = ParticleSystemShapeType.Cone, shape.angle, main.startSpeed, main.gravityModifier',
 starter:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class TorchFlame : MonoBehaviour
{
    void Awake()
    {
        ParticleSystem ps = GetComponent<ParticleSystem>();
        // TODO: 좁은 원뿔로 위로 솟고, 살짝 떠오르는 불꽃으로 설정하세요
    }
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class TorchFlame : MonoBehaviour
{
    void Awake()
    {
        ParticleSystem ps = GetComponent<ParticleSystem>();

        var shape = ps.shape;
        shape.shapeType = ParticleSystemShapeType.Cone;
        shape.angle = 12f;

        var main = ps.main;
        main.startSpeed = 3f;
        main.gravityModifier = -0.1f;
    }
}`,
 rules:[
  inFn('Cone 모양','Awake',/shapeType\s*=\s*ParticleSystemShapeType\.Cone/,'방출 모양을 Cone으로 설정했어요.','shape.shapeType = ParticleSystemShapeType.Cone; 으로 원뿔 모양 방출을 지정하세요.'),
  inFn('angle 설정','Awake',/\bangle\s*=/,'퍼지는 각도를 설정했어요.','shape.angle 으로 원뿔의 퍼지는 각도를 좁게 설정하세요.'),
  inFn('gravityModifier 설정','Awake',/\bgravityModifier\s*=\s*-/,'중력 배율을 음수로 줬어요.','gravityModifier가 음수이면 중력의 반대 방향(위)으로 힘을 받아요.')
 ],
 test:(api,ok)=>{
  const ps=api.mk.ps();api.env.components.ParticleSystem=ps;
  api.call('Awake');
  ok('Cone',ps.shape.shapeType==='Cone','원뿔 모양으로 방출해요.',`shapeType이 ${ps.shape.shapeType} 입니다. Cone이어야 해요.`);
  ok('좁은 각도',ps.shape.angle<=20&&ps.shape.angle>0,`퍼지는 각도가 ${ps.shape.angle}°로 좁아요.`,`angle이 ${ps.shape.angle} 입니다. 0보다 크고 20 이하여야 불꽃처럼 좁게 솟아요 (기본값은 25).`);
  ok('시작 속도',ps.main.startSpeed>=2&&ps.main.startSpeed<=6,`시작 속도가 ${ps.main.startSpeed}예요.`,`startSpeed가 ${ps.main.startSpeed} 입니다. 2~6 사이여야 해요.`);
  ok('떠오름',ps.main.gravityModifier<0,'중력 배율이 음수라서 위로 떠올라요.',`gravityModifier가 ${ps.main.gravityModifier} 입니다. 음수여야 위로 떠올라요.`);
 },
 hints:['방출 영역과 방향을 정하는 모듈은 Shape예요. 원뿔은 Cone.','Cone의 angle은 원뿔이 벌어지는 정도예요. 값이 작을수록 좁게 솟아요.','Main 모듈의 gravityModifier는 중력의 영향 배율이에요. 음수이면 반대로 위로 올라가요.'],
 why:'이펙트의 인상은 "어디서, 어떤 방향으로, 얼마나 빠르게" 나오느냐에서 결정돼요. Shape 모듈로 방출 영역과 방향을 정하고, Main 모듈의 속도와 중력 배율로 움직임의 성격(솟구침, 떠오름, 떨어짐)을 만듭니다.',
 concepts:[['Shape 모듈','파티클이 방출되는 영역과 방향을 정한다. Cone, Sphere, Box, Circle 등이 있다.'],['gravityModifier','파티클이 받는 중력 배율. 0이면 무중력, 음수이면 위로 떠오른다.'],['startSpeed','파티클이 생성될 때의 초기 속도.']]});

Q({id:'p5',cat:'particle',stage:2,level:2,title:'커지면서 흩어지는 연기',
 story:'굴뚝 연기가 같은 크기로 올라가다가 갑자기 사라져서 어색해요. 진짜 연기는 위로 올라가면서 점점 퍼지며 커져요. Size over Lifetime 모듈로 수명 동안 크기가 30%에서 100%까지 선형으로 커지게 하고, 수명도 충분히 길게 설정해 주세요.',
 goals:['sizeOverLifetime 모듈을 켠다 (enabled = true)','크기 곡선: 수명의 시작에서 0.3배, 끝에서 1배가 되는 선형 곡선 (AnimationCurve.Linear)','main.startLifetime을 2초 이상으로 설정한다'],
 limits:['크기는 new ParticleSystem.MinMaxCurve(배율, 곡선) 형태로 넘긴다'],
 api:'sizeOverLifetime.enabled / size, new ParticleSystem.MinMaxCurve(1f, AnimationCurve.Linear(t0, v0, t1, v1))',
 starter:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class Smoke : MonoBehaviour
{
    void Awake()
    {
        ParticleSystem ps = GetComponent<ParticleSystem>();
        // TODO: 수명 동안 점점 커지는 연기를 만드세요
    }
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class Smoke : MonoBehaviour
{
    void Awake()
    {
        ParticleSystem ps = GetComponent<ParticleSystem>();

        var main = ps.main;
        main.startLifetime = 3f;

        var size = ps.sizeOverLifetime;
        size.enabled = true;
        size.size = new ParticleSystem.MinMaxCurve(1f, AnimationCurve.Linear(0f, 0.3f, 1f, 1f));
    }
}`,
 rules:[
  inFn('모듈 켜기','Awake',/\.enabled\s*=\s*true\s*;/,'Size over Lifetime 모듈을 켰어요.','모듈은 enabled = true 로 켜야 적용돼요. 켜지 않으면 설정한 곡선이 무시됩니다.'),
  inFn('MinMaxCurve 사용','Awake',/new\s+ParticleSystem\.MinMaxCurve\s*\(/,'MinMaxCurve로 곡선을 지정했어요.','size.size = new ParticleSystem.MinMaxCurve(1f, 곡선); 형태로 지정하세요.'),
  inFn('AnimationCurve 사용','Awake',/AnimationCurve\.(?:Linear|EaseInOut)\s*\(/,'AnimationCurve로 시간에 따른 변화를 만들었어요.','AnimationCurve.Linear(시작시간, 시작값, 끝시간, 끝값) 으로 곡선을 만드세요.')
 ],
 test:(api,ok)=>{
  const ps=api.mk.ps();api.env.components.ParticleSystem=ps;
  api.call('Awake');
  const s=ps.sizeOverLifetime;
  ok('모듈 켜짐',s.enabled===true,'Size over Lifetime이 켜졌어요.','sizeOverLifetime.enabled = true; 가 필요해요.');
  const c=s.size&&s.size.curve;
  ok('곡선 증가',!!c&&c.v1>c.v0&&c.v0>0,`크기 곡선이 ${c?c.v0:'?'} → ${c?c.v1:'?'} 로 커져요.`,'크기 곡선이 시작보다 끝에서 더 커야 해요. 예: Linear(0f, 0.3f, 1f, 1f)');
  ok('곡선 범위',!!c&&Math.abs(c.v0-0.3)<1e-6&&Math.abs(c.v1-1)<1e-6&&c.t0===0&&c.t1===1,'시작 0.3배, 끝 1배예요.','곡선이 시간 0일 때 0.3, 시간 1일 때 1이 되도록 Linear(0f, 0.3f, 1f, 1f) 로 만드세요.');
  ok('수명',ps.main.startLifetime>=2,`수명이 ${ps.main.startLifetime}초예요.`,`startLifetime이 ${ps.main.startLifetime} 입니다. 2초 이상이어야 커지는 모습이 보여요.`);
 },
 hints:['"Over Lifetime" 모듈은 파티클이 태어나서 사라질 때까지(0~1)의 변화를 곡선으로 정해요.','모듈은 반드시 enabled = true 로 켜야 해요.','AnimationCurve.Linear(시작 시간, 시작 값, 끝 시간, 끝 값) — 시간은 수명의 비율(0~1)이에요.'],
 why:'Over Lifetime 모듈은 파티클의 한살이를 0~1 시간축으로 보고 크기·색·속도를 곡선으로 정해요. 연기·불꽃·마법 이펙트가 생동감 있게 보이는 핵심이 이 변화 곡선입니다. 모듈을 켜는 것을 잊으면 아무 변화도 없다는 점도 기억하세요.',
 concepts:[['Over Lifetime 모듈','파티클의 수명(0~1)에 따라 크기·색·속도 등이 변하는 방식을 곡선으로 정하는 모듈.'],['AnimationCurve','시간에 따른 값의 변화를 나타내는 곡선. Linear, EaseInOut 등으로 간단히 만들 수 있다.'],['MinMaxCurve','상수, 두 값 사이 랜덤, 곡선 중 하나로 값을 표현하는 파티클 값 타입.']]});

Q({id:'p6',cat:'particle',stage:2,level:3,title:'색이 변하며 사라지는 불꽃 (Gradient)',
 story:'불꽃 파티클이 노란색 그대로 있다가 갑자기 툭 사라져요. 불꽃은 노란색에서 붉은색으로 변하면서 서서히 투명해져야 자연스럽습니다. Color over Lifetime에 그라디언트를 만들어 주세요. 알파가 마지막에 0이 되어야 갑자기 사라지는 느낌이 없어요.',
 goals:['colorOverLifetime 모듈을 켠다','그라디언트의 색: 시작은 노랑(Color.yellow), 끝은 빨강(Color.red)','그라디언트의 알파: 시작은 1(불투명), 끝은 0(투명)','만든 그라디언트를 new ParticleSystem.MinMaxGradient(gradient)로 모듈에 지정한다'],
 limits:['색 키와 알파 키는 각각 두 개 이상 만든다 (시간 0과 1)'],
 api:'new Gradient(), gradient.SetKeys(GradientColorKey[], GradientAlphaKey[]), colorOverLifetime.color',
 starter:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class FlameColor : MonoBehaviour
{
    void Awake()
    {
        ParticleSystem ps = GetComponent<ParticleSystem>();
        // TODO: 노랑 → 빨강으로 변하면서 서서히 투명해지는 그라디언트를 만드세요
    }
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class FlameColor : MonoBehaviour
{
    void Awake()
    {
        ParticleSystem ps = GetComponent<ParticleSystem>();

        var col = ps.colorOverLifetime;
        col.enabled = true;

        Gradient g = new Gradient();
        g.SetKeys(
            new GradientColorKey[] { new GradientColorKey(Color.yellow, 0f), new GradientColorKey(Color.red, 1f) },
            new GradientAlphaKey[] { new GradientAlphaKey(1f, 0f), new GradientAlphaKey(0f, 1f) });

        col.color = new ParticleSystem.MinMaxGradient(g);
    }
}`,
 rules:[
  inFn('모듈 켜기','Awake',/\.enabled\s*=\s*true\s*;/,'Color over Lifetime 모듈을 켰어요.','colorOverLifetime.enabled = true; 로 모듈을 켜세요.'),
  inFn('Gradient 생성','Awake',/new\s+Gradient\s*\(\s*\)/,'Gradient를 만들었어요.','Gradient g = new Gradient(); 로 그라디언트를 만드세요.'),
  inFn('SetKeys 사용','Awake',/\.SetKeys\s*\(/,'SetKeys로 색과 알파 키를 지정했어요.','g.SetKeys(색 키 배열, 알파 키 배열) 로 키를 지정하세요.'),
  inFn('MinMaxGradient로 지정','Awake',/new\s+ParticleSystem\.MinMaxGradient\s*\(/,'MinMaxGradient로 모듈에 넘겼어요.','col.color = new ParticleSystem.MinMaxGradient(g); 로 지정하세요.')
 ],
 test:(api,ok)=>{
  const ps=api.mk.ps();api.env.components.ParticleSystem=ps;
  api.call('Awake');
  const col=ps.colorOverLifetime;
  ok('모듈 켜짐',col.enabled===true,'Color over Lifetime이 켜졌어요.','colorOverLifetime.enabled = true; 가 필요해요.');
  const g=col.color&&col.color.gradient;
  ok('그라디언트 전달',!!g,'그라디언트가 모듈에 지정됐어요.','col.color = new ParticleSystem.MinMaxGradient(g); 로 그라디언트를 지정하세요.');
  if(!g)return;
  const ck=g.colorKeys,ak=g.alphaKeys;
  ok('키 개수',ck.length>=2&&ak.length>=2,'색 키와 알파 키가 각각 두 개 이상이에요.','색 키와 알파 키를 시간 0과 1에 각각 하나씩 만드세요.');
  const f=ck[0]&&ck[0].color,l=ck[ck.length-1]&&ck[ck.length-1].color;
  ok('노랑 → 빨강',!!f&&!!l&&f.r>0.9&&f.g>0.5&&l.r>0.9&&l.g<0.2,'노랑에서 빨강으로 변해요.','첫 색 키는 Color.yellow(시간 0), 마지막 색 키는 Color.red(시간 1)이어야 해요.');
  ok('서서히 투명',!!ak[0]&&!!ak[ak.length-1]&&ak[0].alpha>0.9&&ak[ak.length-1].alpha===0,'알파가 1에서 0으로 줄어서 서서히 사라져요.','알파 키는 시작이 1(불투명), 마지막이 0(투명)이어야 갑자기 사라지지 않아요.');
 },
 hints:['색이 시간에 따라 변하는 값은 Color over Lifetime 모듈의 gradient에 담아요.','Gradient는 색 키(GradientColorKey)와 알파 키(GradientAlphaKey)를 따로 가져요. 둘 다 시간(0~1)을 함께 받아요.','g.SetKeys(new GradientColorKey[]{...}, new GradientAlphaKey[]{...}); 그 뒤 new ParticleSystem.MinMaxGradient(g) 로 감싸 모듈에 넘기세요.'],
 why:'색 변화와 알파 페이드를 함께 쓰면 이펙트가 "생겼다 사라지는" 생명감이 생겨요. 끝에서 알파를 0으로 내려 주는 것이 특히 중요해서, 이게 없으면 파티클이 갑자기 툭 사라져 보입니다. 밝게 겹치는 느낌이 필요하면 머티리얼의 블렌드 방식(Additive)도 함께 고려하세요.',
 concepts:[['Gradient 키','색 키(시간별 색)와 알파 키(시간별 불투명도)를 따로 지정해 색의 변화를 만드는 구조.'],['알파 페이드','수명 끝에서 알파를 0으로 만들어 파티클이 갑자기 사라지는 것을 막는 기법.'],['Additive 블렌드','파티클 색을 배경에 더해서 겹칠수록 밝아지게 하는 머티리얼 설정. 불·빛 이펙트에 쓴다.']]});

Q({id:'p9',cat:'particle',stage:3,level:1,title:'눈보라가 1000개에서 멈춘다 (Max Particles)',
 story:'초당 500개씩 4초 동안 사는 눈보라 이펙트를 만들었는데, 시간이 지나도 화면이 가득 차지 않고 어느 순간부터 눈이 더 이상 늘지 않아요. Max Particles의 기본값이 1000이라서 동시에 존재할 수 있는 파티클 수가 막혀 있기 때문이에요. 필요한 만큼만, 그러나 3000을 넘지 않게 설정해 주세요.',
 goals:['방출량(rateOverTime)을 초당 500개로 설정한다','수명(startLifetime)을 4초로 설정한다','동시에 살아 있는 파티클의 최대 수(= 방출량 × 수명)를 계산해서 maxParticles를 그 값 이상 3000 이하로 설정한다'],
 limits:['maxParticles는 3000을 넘기지 않는다 (성능 상한)','모듈은 변수에 담아 수정한다'],
 api:'emission.rateOverTime, main.startLifetime, main.maxParticles',
 starter:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class Blizzard : MonoBehaviour
{
    void Awake()
    {
        ParticleSystem ps = GetComponent<ParticleSystem>();
        // TODO: 초당 500개, 수명 4초. 동시에 몇 개가 살아 있게 될까요? maxParticles를 맞춰 주세요.
    }
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class Blizzard : MonoBehaviour
{
    void Awake()
    {
        ParticleSystem ps = GetComponent<ParticleSystem>();

        var emission = ps.emission;
        emission.rateOverTime = 500f;

        var main = ps.main;
        main.startLifetime = 4f;
        main.maxParticles = 2000;
    }
}`,
 rules:[
  inFn('maxParticles 설정','Awake',/\bmaxParticles\s*=/,'maxParticles를 설정했어요.','main.maxParticles 를 직접 설정하세요. 기본값 1000이 상한이에요.')
 ],
 test:(api,ok)=>{
  const ps=api.mk.ps();api.env.components.ParticleSystem=ps;
  api.call('Awake');
  ok('방출량',ps.emission.rateOverTime===500,'초당 500개를 방출해요.',`rateOverTime이 ${ps.emission.rateOverTime} 입니다. 500이어야 해요.`);
  ok('수명',ps.main.startLifetime===4,'수명이 4초예요.',`startLifetime이 ${ps.main.startLifetime} 입니다. 4여야 해요.`);
  const need=500*4;
  ok('필요한 만큼',ps.main.maxParticles>=need,`maxParticles(${ps.main.maxParticles})가 필요량(${need}) 이상이에요.`,`maxParticles가 ${ps.main.maxParticles} 입니다. 동시에 살아 있는 수는 500 × 4 = ${need}개라서 그 이상이어야 끊기지 않아요.`);
  ok('상한',ps.main.maxParticles<=3000,'성능 상한(3000) 안에 있어요.',`maxParticles가 ${ps.main.maxParticles} 입니다. 3000을 넘기지 마세요. 무작정 크게 잡으면 낭비예요.`);
 },
 hints:['파티클 하나가 사는 동안 새 파티클이 계속 생겨요. 동시에 살아 있는 개수 ≈ 초당 방출량 × 수명.','500 × 4 = 2000개가 동시에 존재하게 돼요. 기본 상한 1000이면 절반이 막혀요.','필요량 이상, 하지만 3000 이하로 설정하세요.'],
 why:'Max Particles는 동시에 존재할 수 있는 파티클 수의 상한이에요. 방출량과 수명으로 필요한 수를 계산해 맞추고, 상한을 너무 크게 잡지 않아야 성능 사고를 막을 수 있습니다. 이펙트가 "이상하게 끊겨 보일 때" 가장 먼저 확인할 값 중 하나예요.',
 concepts:[['Max Particles','한 파티클 시스템에서 동시에 존재할 수 있는 파티클의 최대 수. 기본값은 1000이다.'],['동시 파티클 수 계산','초당 방출량 × 수명 ≈ 동시에 살아 있는 파티클 수. 이 값이 Max Particles보다 크면 방출이 막힌다.']]});

Q({id:'p7',cat:'particle',stage:3,level:2,title:'Stop 해도 입자가 남는다',
 story:'이펙트를 끌 때 ps.Stop()만 호출했더니, 이미 나온 파티클이 한참 허공에 떠다녀요. Stop은 기본적으로 "새로 만드는 것만 멈추고 이미 나온 파티클은 자연스럽게 끝날 때까지 둔다"는 동작입니다. 상황에 맞게 다른 종료 방식을 골라 주세요.',
 goals:['StopImmediately(): 타격 불꽃을 즉시 없앤다 — 방출을 멈추고 이미 나온 파티클도 모두 지운다','FadeOut(): 모닥불을 끈다 — 새 파티클만 멈추고, 이미 나온 파티클은 자연스럽게 사라지게 둔다'],
 limits:['Stop 호출 시 ParticleSystemStopBehavior를 명시한다','FadeOut에서는 Clear를 호출하지 않는다'],
 api:'ps.Stop(bool withChildren, ParticleSystemStopBehavior behavior), ParticleSystemStopBehavior.StopEmitting / StopEmittingAndClear',
 starter:C`
using UnityEngine;

public class FxController : MonoBehaviour
{
    private ParticleSystem ps;

    void Awake()
    {
        ps = GetComponent<ParticleSystem>();
    }

    // 타격 불꽃: 맞은 순간이 지나면 즉시 사라져야 함
    public void StopImmediately()
    {
        // TODO
    }

    // 모닥불 끄기: 더 이상 나오지 않지만 남은 불꽃은 자연스럽게 사라져야 함
    public void FadeOut()
    {
        // TODO
    }
}`,
 solution:C`
using UnityEngine;

public class FxController : MonoBehaviour
{
    private ParticleSystem ps;

    void Awake()
    {
        ps = GetComponent<ParticleSystem>();
    }

    public void StopImmediately()
    {
        ps.Stop(true, ParticleSystemStopBehavior.StopEmittingAndClear);
    }

    public void FadeOut()
    {
        ps.Stop(true, ParticleSystemStopBehavior.StopEmitting);
    }
}`,
 alts:[C`
using UnityEngine;

public class FxController : MonoBehaviour
{
    private ParticleSystem ps;

    void Awake()
    {
        ps = GetComponent<ParticleSystem>();
    }

    public void StopImmediately()
    {
        ps.Stop();
        ps.Clear();
    }

    public void FadeOut()
    {
        ps.Stop(true, ParticleSystemStopBehavior.StopEmitting);
    }
}`],
 rules:[
  inFn('StopImmediately가 지움','StopImmediately',/StopEmittingAndClear|\.Clear\s*\(/,'이미 나온 파티클까지 지워요.','즉시 없애려면 ParticleSystemStopBehavior.StopEmittingAndClear 로 멈추거나, Stop 뒤에 Clear를 호출하세요.'),
  inFn('FadeOut이 Stop 호출','FadeOut',/\.Stop\s*\(/,'FadeOut에서 Stop을 호출해요.','FadeOut에서 ps.Stop(...) 으로 방출을 멈추세요.'),
  notIn('FadeOut에서 Clear 금지','FadeOut',/StopEmittingAndClear|\.Clear\s*\(/,'남은 파티클을 지우지 않아요.','FadeOut은 남은 파티클이 자연스럽게 사라져야 하므로 Clear를 쓰면 안 돼요.')
 ],
 test:(api,ok)=>{
  const ps=api.mk.ps();api.env.components.ParticleSystem=ps;
  api.call('Awake');
  api.call('StopImmediately');
  let c=ps.calls;
  const imm=c.some(x=>x[0]==='Stop'&&x[2]==='StopEmittingAndClear')||(c.some(x=>x[0]==='Stop')&&c.some(x=>x[0]==='Clear'));
  ok('즉시 정지',imm,'방출을 멈추고 남은 파티클도 지워요.','StopImmediately는 StopEmittingAndClear 로 멈추거나 Stop 뒤에 Clear를 호출해야 해요.');
  ps.calls.length=0;
  api.call('FadeOut');
  c=ps.calls;
  const fade=c.some(x=>x[0]==='Stop'&&(x[2]==='StopEmitting'||x[2]===undefined))&&!c.some(x=>x[0]==='Clear')&&!c.some(x=>x[2]==='StopEmittingAndClear');
  ok('자연스럽게 종료',fade,'새 방출만 멈추고 남은 파티클은 자연스럽게 끝나요.','FadeOut은 StopEmitting 으로 멈추고 Clear나 StopEmittingAndClear를 쓰지 마세요.');
 },
 hints:['ParticleSystem.Stop은 두 번째 인자로 "어떻게 멈출지"를 받아요.','StopEmitting은 새 파티클만 멈추고, StopEmittingAndClear는 이미 나온 파티클도 즉시 지워요.','첫 번째 인자 withChildren은 자식 파티클 시스템도 같이 멈출지 정해요. 보통 true.'],
 why:'파티클 정지에는 "더 만들지 않기"와 "이미 만든 것도 지우기"가 따로 있어요. 상황에 맞게 고르면 어색하게 허공에 남는 입자도, 갑자기 뚝 끊기는 연출도 피할 수 있습니다.',
 concepts:[['StopEmitting','새 파티클 생성만 멈추고 이미 나온 파티클은 수명이 다할 때까지 둔다. Stop()의 기본 동작.'],['StopEmittingAndClear','방출을 멈추고 남은 파티클도 즉시 지운다.'],['ps.Clear','현재 존재하는 모든 파티클을 즉시 제거한다.']]});

Q({id:'p8',cat:'particle',stage:3,level:3,title:'큰 연기 파티클 때문에 모바일이 느리다',
 story:'큰 반투명 연기 파티클이 겹쳐 그려지면 같은 픽셀을 여러 번 칠하게 되어(오버드로우) 모바일 GPU가 크게 느려져요. 플랫폼에 따라 이펙트 품질을 낮추는 Apply(bool mobile) 를 만들어 주세요. 모바일에서는 개수와 크기를 줄이고, 화면 밖에서는 시뮬레이션도 멈추게 합니다.',
 goals:['모바일: maxParticles 30, 방출량(rateOverTime) 8, 시작 크기(startSize) 1.2, cullingMode는 Pause','데스크톱: maxParticles 100, 방출량 20, 시작 크기 2, cullingMode는 Automatic'],
 limits:['모듈은 변수에 담아 수정한다','mobile 값에 따라 if / else 로 나눈다'],
 api:'main.maxParticles, main.startSize, main.cullingMode = ParticleSystemCullingMode.Pause, emission.rateOverTime',
 starter:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class SmokeQuality : MonoBehaviour
{
    private ParticleSystem ps;

    void Awake()
    {
        ps = GetComponent<ParticleSystem>();
    }

    public void Apply(bool mobile)
    {
        var main = ps.main;
        var emission = ps.emission;
        // TODO: 모바일이면 가볍게, 아니면 풍성하게
    }
}`,
 solution:C`
using UnityEngine;

[RequireComponent(typeof(ParticleSystem))]
public class SmokeQuality : MonoBehaviour
{
    private ParticleSystem ps;

    void Awake()
    {
        ps = GetComponent<ParticleSystem>();
    }

    public void Apply(bool mobile)
    {
        var main = ps.main;
        var emission = ps.emission;

        if (mobile)
        {
            main.maxParticles = 30;
            main.startSize = 1.2f;
            main.cullingMode = ParticleSystemCullingMode.Pause;
            emission.rateOverTime = 8f;
        }
        else
        {
            main.maxParticles = 100;
            main.startSize = 2f;
            main.cullingMode = ParticleSystemCullingMode.Automatic;
            emission.rateOverTime = 20f;
        }
    }
}`,
 rules:[
  inFn('mobile 분기','Apply',/\bif\s*\(\s*!?\s*mobile\s*\)/,'mobile 값으로 분기해요.','if (mobile) { ... } else { ... } 로 모바일과 데스크톱 설정을 나누세요.')
 ],
 test:(api,ok)=>{
  const ps=api.mk.ps();api.env.components.ParticleSystem=ps;
  api.call('Awake');
  api.call('Apply',true);
  const m=[ps.main.maxParticles,ps.emission.rateOverTime,ps.main.startSize,ps.main.cullingMode];
  ok('모바일 설정',m[0]===30&&m[1]===8&&m[2]===1.2&&m[3]==='Pause','모바일 설정(30개, 방출 8, 크기 1.2, Pause)이 맞아요.',`모바일 값이 maxParticles=${m[0]}, rate=${m[1]}, size=${m[2]}, culling=${m[3]} 입니다. 30, 8, 1.2, Pause 여야 해요.`);
  api.call('Apply',false);
  const d=[ps.main.maxParticles,ps.emission.rateOverTime,ps.main.startSize,ps.main.cullingMode];
  ok('데스크톱 설정',d[0]===100&&d[1]===20&&d[2]===2&&d[3]==='Automatic','데스크톱 설정(100개, 방출 20, 크기 2, Automatic)이 맞아요.',`데스크톱 값이 maxParticles=${d[0]}, rate=${d[1]}, size=${d[2]}, culling=${d[3]} 입니다. 100, 20, 2, Automatic 이어야 해요.`);
 },
 hints:['오버드로우는 투명한 큰 이미지가 여러 겹 겹쳐서 같은 픽셀을 반복해서 그리는 현상이에요. 개수와 크기를 줄이면 가장 직접적으로 줄어요.','개수는 maxParticles와 emission.rateOverTime, 크기는 main.startSize, 화면 밖 처리는 main.cullingMode로 조절해요.','mobile이 true일 때와 false일 때 값을 각각 지정하세요.'],
 why:'반투명 파티클은 겹친 만큼 GPU가 여러 번 칠해서, 모바일에서는 큰 연기 하나가 프레임을 크게 떨어뜨릴 수 있어요. 파티클 수·크기를 줄이고 화면 밖 이펙트를 멈추는 것은 가장 쉬운 최적화이며, 플랫폼별 품질 설정으로 나눠 두면 데스크톱의 풍성함도 유지돼요.',
 concepts:[['오버드로우(Overdraw)','투명한 오브젝트가 겹쳐서 같은 픽셀을 여러 번 그리는 현상. 큰 반투명 파티클이 겹치면 모바일 GPU 성능이 크게 떨어진다.'],['Culling Mode','화면 밖의 파티클 시스템을 어떻게 처리할지 정한다. Pause는 화면 밖에서 시뮬레이션을 멈춘다.'],['품질 프리셋','플랫폼 성능에 맞게 파티클 수·크기를 코드나 설정으로 나눠 적용하는 방법.']]});
