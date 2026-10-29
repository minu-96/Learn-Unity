/* ===== 연출 ===== */
Q({id:'v1',cat:'direction',stage:1,level:1,title:'카메라 추적은 LateUpdate에서',
 story:'플레이어를 따라가는 카메라가 달릴 때 덜덜 떨리고, 이동 범위 끝에서도 맵 밖을 비춥니다. 게다가 target.position을 그대로 대입했더니 카메라의 z 값이 0이 되어 화면이 텅 비었어요. 카메라 추적 코드를 올바른 위치와 방식으로 다시 작성해 주세요.',
 goals:['LateUpdate에서 카메라 위치를 갱신한다 (플레이어 이동이 끝난 뒤에 따라가야 떨리지 않는다)','x = 대상의 x + offset.x 를 minX ~ maxX 범위로 제한한다','y = 대상의 y + offset.y','z = offset.z (카메라 깊이를 유지한다)'],
 limits:['transform.position 에는 new Vector3(x, y, z) 로 한 번에 대입한다','Update가 아니라 LateUpdate를 사용한다'],
 api:'LateUpdate(), Mathf.Clamp(값, 최소, 최대), target.position.x',
 starter:C`
using UnityEngine;

public class FollowCamera : MonoBehaviour
{
    public Transform target;
    public Vector3 offset = new Vector3(0f, 2f, -10f);
    public float minX = -5f;
    public float maxX = 5f;

    void Update()
    {
        transform.position = target.position;
    }
}`,
 solution:C`
using UnityEngine;

public class FollowCamera : MonoBehaviour
{
    public Transform target;
    public Vector3 offset = new Vector3(0f, 2f, -10f);
    public float minX = -5f;
    public float maxX = 5f;

    void LateUpdate()
    {
        float x = Mathf.Clamp(target.position.x + offset.x, minX, maxX);
        float y = target.position.y + offset.y;
        transform.position = new Vector3(x, y, offset.z);
    }
}`,
 rules:[
  inFn('LateUpdate에서 이동','LateUpdate',/transform\.position\s*=(?!=)/,'LateUpdate에서 카메라 위치를 갱신해요.','카메라 추적은 모든 Update가 끝난 뒤인 LateUpdate에서 하세요.'),
  notIn('Update에서 이동 금지','Update',/transform\.position\s*=(?!=)/,'Update에서 카메라를 옮기지 않아요.','Update에서 카메라를 옮기면 플레이어가 움직이기 전/후 순서가 섞여 떨릴 수 있어요. LateUpdate로 옮기세요.'),
 ],
 test:(api,ok)=>{
  if(!api.has('LateUpdate')){ok('LateUpdate 사용',false,'','LateUpdate() 함수를 만들어 카메라를 옮기세요.');return}
  api.set('offset',{x:0,y:2,z:-10});api.set('minX',-5);api.set('maxX',5);
  const at=x=>{api.set('target',{position:{x,y:3,z:0}});api.call('LateUpdate');return api.transform.position};
  let p=at(1);
  ok('따라가기',Math.abs(p.x-1)<1e-6&&Math.abs(p.y-5)<1e-6,'대상 + 오프셋 위치를 따라가요.',`대상이 (1, 3)일 때 카메라가 (${p.x}, ${p.y}) 입니다. (1, 5)여야 해요 (y = 대상 y + offset.y).`);
  ok('z 유지',p.z===-10,'카메라 z가 -10으로 유지돼요.',`카메라 z가 ${p.z} 입니다. offset.z(-10)를 써야 화면이 보여요.`);
  p=at(20);ok('오른쪽 한계',p.x===5,'오른쪽 끝에서 maxX(5)로 멈춰요.',`대상이 멀리 있을 때 x가 ${p.x} 입니다. maxX(5)를 넘지 않아야 해요.`);
  p=at(-20);ok('왼쪽 한계',p.x===-5,'왼쪽 끝에서 minX(-5)로 멈춰요.',`x가 ${p.x} 입니다. minX(-5)보다 작아지지 않아야 해요.`);
 },
 hints:['플레이어가 Update에서 움직인 "뒤에" 카메라가 따라가야 해요. 모든 Update가 끝난 뒤 호출되는 이벤트 함수가 따로 있어요.','target.position을 그대로 대입하면 카메라 z도 대상의 z(보통 0)가 돼 버려요. x, y, z를 따로 계산해 새 Vector3로 만드세요.','x만 Mathf.Clamp(값, minX, maxX)로 감싸면 돼요.'],
 why:'카메라는 항상 대상이 움직인 뒤에 움직여야 해서 LateUpdate를 씁니다. 대상 위치를 통째로 복사하면 카메라의 깊이(z)가 날아가는 2D의 단골 실수예요. 이동 범위를 Clamp로 묶어 맵 밖이 비치지 않게 하세요.',
 concepts:[['LateUpdate','모든 Update가 끝난 뒤 매 프레임 호출된다. 카메라 추적처럼 다른 오브젝트의 이동이 끝난 뒤 실행해야 하는 로직에 쓴다.'],['카메라 z 값','2D 카메라도 3D 공간에 있어서 z가 0이면 오브젝트와 겹쳐 화면이 비어 보인다. 보통 -10 정도로 둔다.'],['카메라 경계 제한','Mathf.Clamp로 카메라 위치를 맵 범위 안에 묶어 바깥이 보이지 않게 한다.']]});

Q({id:'v2',cat:'direction',stage:1,level:2,title:'데드존: 작은 움직임엔 카메라가 가만히',
 story:'플레이어가 조금만 움직여도 카메라가 같이 흔들려서 멀미가 나요. 데드존(Dead Zone)을 두어 플레이어가 중앙 일정 범위 안에 있을 땐 카메라가 가만히 있고, 범위를 벗어나면 그 경계에 걸친 채 따라가게 하려고 합니다.',
 goals:['FollowX(camX, targetX, deadZone): 대상이 카메라에서 deadZone 이내(경계 포함)이면 camX를 그대로 반환한다','대상이 오른쪽으로 deadZone을 넘어가면, 대상이 경계에 걸리도록 camX를 오른쪽으로 옮긴 값을 반환한다','왼쪽도 마찬가지로 처리한다'],
 limits:['반환값은 새 카메라 x 좌표이다','예: camX 0, targetX 5, deadZone 2 → 3'],
 api:'Mathf.Abs, 조건문',
 starter:C`
float FollowX(float camX, float targetX, float deadZone)
{
    // 지금은 대상이 움직일 때마다 카메라가 항상 따라가요
    return targetX;
}`,
 solution:C`
float FollowX(float camX, float targetX, float deadZone)
{
    float dx = targetX - camX;
    if (dx > deadZone) return camX + (dx - deadZone);
    if (dx < -deadZone) return camX + (dx + deadZone);
    return camX;
}`,
 rules:[inFn('데드존 사용','FollowX',/deadZone/,'deadZone을 사용해요.','deadZone 값을 이용해 카메라가 움직일지 판단하세요.')],
 test:(api,ok)=>{
  const f=(c,t,d)=>api.call('FollowX',c,t,d);
  ok('안에서는 정지',f(0,1,2)===0&&f(0,-1.5,2)===0,'데드존 안에서는 카메라가 움직이지 않아요.',`대상이 데드존 안(거리 1, deadZone 2)인데 카메라가 ${f(0,1,2)}로 움직였어요. 그대로 0이어야 해요.`);
  ok('경계 포함',f(0,2,2)===0,'정확히 경계에 있을 때도 정지해요.',`거리가 deadZone과 같을 때 ${f(0,2,2)} 입니다. 0이어야 해요.`);
  ok('오른쪽으로 벗어남',Math.abs(f(0,5,2)-3)<1e-6,'오른쪽으로 벗어나면 경계에 걸리도록 3까지 따라가요.',`FollowX(0, 5, 2) = ${f(0,5,2)} 입니다. 대상이 경계(카메라 + 2)에 걸리게 3이어야 해요.`);
  ok('왼쪽으로 벗어남',Math.abs(f(0,-5,2)+3)<1e-6,'왼쪽도 -3까지 따라가요.',`FollowX(0, -5, 2) = ${f(0,-5,2)} 입니다. -3이어야 해요.`);
  ok('다른 위치에서도',Math.abs(f(10,16,2)-14)<1e-6,'카메라가 10에 있을 때도 올바르게 계산해요.',`FollowX(10, 16, 2) = ${f(10,16,2)} 입니다. 14여야 해요 (거리 6 → 2만 남기고 4 이동).`);
 },
 hints:['먼저 "대상이 카메라에서 얼마나 떨어져 있는가"(dx = targetX − camX)를 구하세요.','|dx| 가 deadZone 이하이면 아무것도 하지 않고, 넘을 때만 "넘은 만큼"만 움직이면 대상이 정확히 경계에 걸려요.','오른쪽이면 dx − deadZone, 왼쪽이면 dx + deadZone 만큼 카메라를 옮기세요.'],
 why:'Cinemachine의 Dead Zone이 하는 일이 바로 이거예요. 작은 움직임에 카메라가 반응하지 않으면 화면이 안정되고, 넘어가는 순간부터 따라가면 자연스럽습니다. 원리를 코드로 이해해 두면 설정값의 의미가 분명해져요.',
 concepts:[['데드존(Dead Zone)','대상이 이 범위 안에 있는 동안은 카메라가 움직이지 않는 영역. 작은 움직임에 화면이 흔들리는 것을 막는다.'],['Cinemachine','Virtual Camera 설정으로 추적, 댐핑, 데드존, 전환을 코드 없이 구성하는 Unity 카메라 시스템.']]});

Q({id:'v3',cat:'direction',stage:1,level:3,title:'보스 등장 컷: 가상 카메라 우선순위',
 story:'보스가 등장할 때 카메라가 보스를 잠깐 비췄다가 원래대로 돌아오게 하고 싶어요. Cinemachine을 쓰면 카메라 Transform을 직접 건드릴 필요 없이 가상 카메라의 Priority(우선순위)만 바꾸면 Brain이 알아서 부드럽게 전환합니다. 보스 카메라의 우선순위를 올렸다가 되돌리는 코루틴을 완성해 주세요.',
 goals:['시작 전에 bossCam.Priority 의 원래 값을 저장한다','bossCam.Priority 를 20 으로 올린다','duration 초 동안 기다린다','기다린 뒤 저장해 둔 원래 우선순위로 되돌린다'],
 limits:['Camera.main 이나 transform.position 을 직접 건드리지 않는다','대기에는 WaitForSeconds 를 사용한다'],
 api:'bossCam.Priority (CinemachineVirtualCamera), yield return new WaitForSeconds(초)',
 starter:C`
using System.Collections;
using UnityEngine;

public class BossIntro : MonoBehaviour
{
    public CinemachineVirtualCamera bossCam;

    IEnumerator FocusBoss(float duration)
    {
        bossCam.Priority = 20;
        yield return null;
    }
}`,
 solution:C`
using System.Collections;
using UnityEngine;

public class BossIntro : MonoBehaviour
{
    public CinemachineVirtualCamera bossCam;

    IEnumerator FocusBoss(float duration)
    {
        int prev = bossCam.Priority;
        bossCam.Priority = 20;
        yield return new WaitForSeconds(duration);
        bossCam.Priority = prev;
    }
}`,
 rules:[
  notIn('Transform 직접 조작 금지','FocusBoss',/Camera\.main|transform\.position/,'카메라 Transform을 직접 건드리지 않아요.','Cinemachine Brain이 Transform을 덮어써요. Priority만 바꾸세요.'),
  inFn('대기','FocusBoss',/WaitForSeconds\s*\(\s*duration\s*\)/,'duration 동안 기다려요.','yield return new WaitForSeconds(duration); 으로 기다리세요.')
 ],
 test:(api,ok)=>{
  const cam={Priority:5};api.set('bossCam',cam);
  const co=api.co(api.call('FocusBoss',2));
  co.advance(0.016);
  ok('우선순위 올리기',cam.Priority===20,'Priority가 20으로 올라가요.',`Priority가 ${cam.Priority} 입니다. 20으로 올려야 보스 카메라가 활성화돼요.`);
  co.advance(1.0);
  ok('대기 중 유지',cam.Priority===20&&!co.done,'기다리는 동안 우선순위가 유지돼요.','duration이 지나기 전에 우선순위가 돌아가거나 코루틴이 끝났어요.');
  co.advance(1.1);
  ok('원래 값 복구',co.done&&cam.Priority===5,'끝난 뒤 원래 우선순위(5)로 돌아와요.',`끝난 뒤 Priority가 ${cam.Priority}, 끝남=${co.done} 입니다. 저장해 둔 원래 값(5)으로 되돌려야 해요.`);
 },
 hints:['가상 카메라 여러 대 중 Priority가 가장 높은 카메라를 Brain이 선택해요. 우선순위를 올리면 그 카메라로 전환됩니다.','되돌리려면 올리기 "전에" 원래 값을 변수에 저장해 둬야 해요.','Cinemachine이 Main Camera의 Transform을 매 프레임 덮어쓰므로 직접 옮기는 코드는 무시돼요.'],
 why:'Cinemachine에서는 카메라를 "옮기는" 대신 어떤 가상 카메라를 "선택"하는지만 정하면 돼요. Priority를 바꾸면 Brain이 블렌드 설정대로 부드럽게 전환해서, 컷신 코드가 단순해지고 전환 연출도 에디터에서 조절할 수 있습니다.',
 concepts:[['Cinemachine Brain','Main Camera에 붙어 가상 카메라 중 하나를 골라 그 위치로 카메라를 움직이고 전환을 블렌딩한다.'],['Virtual Camera Priority','값이 가장 높은 가상 카메라가 활성 카메라가 된다. 값을 바꿔 카메라를 전환한다.']]});

Q({id:'v4',cat:'direction',stage:2,level:1,title:'공격 판정은 애니메이션 이벤트로',
 story:'공격 버튼을 누르자마자 판정이 켜져서, 칼을 휘두르기도 전에 적이 맞아요. 판정은 칼이 실제로 휘둘러지는 프레임에, 그리고 끝나는 프레임에 꺼져야 합니다. 이런 타이밍은 Animation Event로 애니메이션의 특정 프레임에서 함수를 호출해 맞춥니다.',
 goals:['Attack(): 애니메이터의 "Attack" 트리거만 발생시킨다 (판정은 건드리지 않는다)','OnAttackHit(): 애니메이션 이벤트가 호출한다 — 판정(hitbox)을 켠다','OnAttackEnd(): 애니메이션 이벤트가 호출한다 — 판정을 끈다'],
 limits:['Attack() 안에서 hitbox를 조작하지 않는다'],
 api:'anim.SetTrigger("이름"), hitbox.SetActive(bool)',
 starter:C`
using UnityEngine;

public class SwordAttack : MonoBehaviour
{
    [SerializeField] private Animator anim;
    [SerializeField] private GameObject hitbox;

    public void Attack()
    {
        anim.SetTrigger("Attack");
        hitbox.SetActive(true);
    }

    public void OnAttackHit() { }
    public void OnAttackEnd() { }
}`,
 solution:C`
using UnityEngine;

public class SwordAttack : MonoBehaviour
{
    [SerializeField] private Animator anim;
    [SerializeField] private GameObject hitbox;

    public void Attack()
    {
        anim.SetTrigger("Attack");
    }

    public void OnAttackHit()
    {
        hitbox.SetActive(true);
    }

    public void OnAttackEnd()
    {
        hitbox.SetActive(false);
    }
}`,
 rules:[
  notIn('Attack에서 판정 금지','Attack',/hitbox/,'Attack()은 판정을 건드리지 않아요.','Attack()에서 hitbox를 켜면 휘두르기 전에 판정이 생겨요. 이벤트 함수에서 켜세요.'),
  inFn('판정 켜기','OnAttackHit',/hitbox\.SetActive\s*\(\s*true\s*\)/,'OnAttackHit에서 판정을 켜요.','OnAttackHit() 에서 hitbox.SetActive(true) 를 호출하세요.'),
  inFn('판정 끄기','OnAttackEnd',/hitbox\.SetActive\s*\(\s*false\s*\)/,'OnAttackEnd에서 판정을 꺼요.','OnAttackEnd() 에서 hitbox.SetActive(false) 를 호출하세요.')
 ],
 test:(api,ok)=>{
  const hb={active:false,SetActive(v){this.active=v}};
  const an={triggers:[],SetTrigger(n){this.triggers.push(n)}};
  api.set('hitbox',hb);api.set('anim',an);
  api.call('Attack');
  ok('트리거 발생',an.triggers.length===1&&an.triggers[0]==='Attack','Attack 트리거를 발생시켜요.','Attack()에서 anim.SetTrigger("Attack")을 호출해야 해요.');
  ok('시작 시점엔 판정 없음',hb.active===false,'공격 시작 직후에는 판정이 꺼져 있어요.','공격을 시작하자마자 판정이 켜졌어요. 이벤트 시점까지 기다려야 해요.');
  api.call('OnAttackHit');
  ok('이벤트에서 켜짐',hb.active===true,'OnAttackHit 시점에 판정이 켜져요.','OnAttackHit()이 호출됐는데 판정이 꺼져 있어요.');
  api.call('OnAttackEnd');
  ok('이벤트에서 꺼짐',hb.active===false,'OnAttackEnd 시점에 판정이 꺼져요.','OnAttackEnd()가 호출됐는데 판정이 켜져 있어요.');
 },
 hints:['코드는 "공격 시작"만 알려주고, 칼이 실제로 맞는 순간은 애니메이션이 알고 있어요.','Animation 창에서 원하는 프레임에 이벤트를 추가하면 그 프레임에서 같은 오브젝트의 함수를 호출해요.','OnAttackHit과 OnAttackEnd를 만들고, 각각 판정을 켜고 끄세요.'],
 why:'게임 로직의 타이밍을 코드의 시간(WaitForSeconds)으로 맞추면 애니메이션을 수정할 때마다 어긋나요. Animation Event를 쓰면 동작과 판정의 타이밍이 애니메이션 프레임에 고정돼 디자이너가 클립만 고쳐도 맞아떨어집니다.',
 concepts:[['Animation Event','애니메이션 클립의 특정 프레임에서 같은 오브젝트의 함수를 호출하는 기능. 동작과 로직의 타이밍을 맞춘다.'],['공격 판정 타이밍','판정은 공격 시작이 아니라 실제 타격 구간에만 켜서 부당한 피격을 막는다.']]});

Q({id:'v5',cat:'direction',stage:2,level:2,title:'코드로 쓰는 타임라인: 인트로 시퀀스',
 story:'게임 시작 시 인트로 연출을 만들어요. 먼저 1초 동안 조용히 화면을 보여 주다가 제목을 띄우고, 2초 뒤에 제목을 숨긴 다음에야 플레이어가 조작할 수 있어야 합니다. 지금 코드는 시작하자마자 제목이 뜨고 조작도 막지 않아요.',
 goals:['시퀀스 시작 즉시 inputEnabled = false','1초 뒤 titleShown = true','그로부터 2초 뒤 titleShown = false','마지막에 inputEnabled = true 로 조작 허용'],
 limits:['각 단계 사이에는 WaitForSeconds 를 사용한다'],
 api:'yield return new WaitForSeconds(초)',
 starter:C`
using System.Collections;
using UnityEngine;

public class IntroSequence : MonoBehaviour
{
    public bool inputEnabled = true;
    public bool titleShown;

    IEnumerator Play()
    {
        titleShown = true;
        yield return new WaitForSeconds(3f);
        titleShown = false;
    }
}`,
 solution:C`
using System.Collections;
using UnityEngine;

public class IntroSequence : MonoBehaviour
{
    public bool inputEnabled = true;
    public bool titleShown;

    IEnumerator Play()
    {
        inputEnabled = false;
        yield return new WaitForSeconds(1f);
        titleShown = true;
        yield return new WaitForSeconds(2f);
        titleShown = false;
        inputEnabled = true;
    }
}`,
 rules:[
  inFn('조작 잠금','Play',/inputEnabled\s*=\s*false/,'시퀀스 동안 조작을 잠가요.','연출 중에는 inputEnabled = false 로 입력을 막으세요.'),
  inFn('조작 해제','Play',/inputEnabled\s*=\s*true/,'끝나면 조작을 풀어요.','연출이 끝나면 inputEnabled = true 로 되돌려야 해요.')
 ],
 test:(api,ok)=>{
  api.set('inputEnabled',true);api.set('titleShown',false);
  const co=api.co(api.call('Play'));
  co.advance(0.001);co.advance(0.5);
  ok('시작: 조용히 + 조작 잠금',api.get('inputEnabled')===false&&api.get('titleShown')===false,'처음 1초는 제목 없이 조작이 잠겨 있어요.',`0.5초 시점에 inputEnabled=${api.get('inputEnabled')}, titleShown=${api.get('titleShown')}. 조작은 잠기고(false) 제목은 아직 숨겨져(false) 있어야 해요.`);
  co.advance(0.6);
  ok('1초 뒤 제목 표시',api.get('titleShown')===true&&api.get('inputEnabled')===false,'1초 뒤에 제목이 나타나요.',`1.1초 시점에 titleShown=${api.get('titleShown')}. 1초 뒤에 제목이 보여야 해요.`);
  co.advance(1.5);
  ok('제목 유지',api.get('titleShown')===true,'제목이 2초 동안 유지돼요.','제목이 2초가 지나기 전에 사라졌어요.');
  co.advance(1.0);
  ok('끝나면 조작 허용',co.done&&api.get('titleShown')===false&&api.get('inputEnabled')===true,'제목이 사라지고 조작이 풀려요.',`끝난 뒤 titleShown=${api.get('titleShown')}, inputEnabled=${api.get('inputEnabled')}, 끝남=${co.done}. 제목은 숨기고 조작은 허용해야 해요.`);
 },
 hints:['코루틴은 위에서 아래로 읽히는 "시간표"예요. 한 줄 실행하고, 기다리고, 다음 줄을 실행하죠.','시작할 때 조작을 막고(false), 맨 끝에 다시 허용(true)하세요. 끝에서 푸는 걸 잊으면 영원히 조작이 안 돼요.','타이밍: 대기 1초 → 제목 표시 → 대기 2초 → 제목 숨김 → 조작 허용.'],
 why:'Timeline이 에디터에서 하는 일을 코드로 쓰면 코루틴 시퀀스가 됩니다. 연출의 핵심은 순서와 타이밍이고, 연출 동안 입력을 잠갔다가 마지막에 반드시 풀어주는 짝 맞추기를 놓치면 게임이 멈춰 버리는 버그가 돼요.',
 concepts:[['코루틴 시퀀스','yield return으로 단계 사이를 기다리며 연출을 위에서 아래로 순서대로 작성하는 방식. 코드로 쓰는 간이 Timeline.'],['입력 잠금','컷신·연출 동안 플레이어 입력을 막고 끝나면 반드시 복구한다. 복구를 빼먹으면 소프트락이 생긴다.']]});

Q({id:'v6',cat:'direction',stage:2,level:3,title:'스킵 가능한 컷신',
 story:'컷신이 5초 걸리는데 건너뛰기 버튼을 눌러도 아무 일도 일어나지 않아요. 건너뛰기를 누르면 진행 중인 컷신 코루틴을 멈추고 끝난 상태로 곧바로 만들어야 합니다. 이미 끝난 컷신에서 건너뛰기를 눌러도 아무 일도 없어야 해요.',
 goals:['Play(): 컷신 코루틴을 시작하고 running 에 저장한다','컷신이 끝나면(자연 종료 또는 스킵) EndCutscene()이 상태를 정리하고 running을 비운다','Skip(): 진행 중인 컷신이 있을 때만 코루틴을 멈추고 EndCutscene()을 호출한다','이미 끝났으면 Skip()은 아무것도 하지 않는다'],
 limits:['코루틴은 StartCoroutine 이 반환한 값으로 StopCoroutine 해야 한다'],
 api:'Coroutine running = StartCoroutine(...), StopCoroutine(running)',
 starter:C`
using System.Collections;
using UnityEngine;

public class Cutscene : MonoBehaviour
{
    public bool cutsceneRunning;
    private Coroutine running;

    public void Play()
    {
        StartCoroutine(Run());
    }

    IEnumerator Run()
    {
        cutsceneRunning = true;
        yield return new WaitForSeconds(5f);
        EndCutscene();
    }

    void EndCutscene()
    {
        cutsceneRunning = false;
    }

    public void Skip()
    {
        EndCutscene();
    }
}`,
 solution:C`
using System.Collections;
using UnityEngine;

public class Cutscene : MonoBehaviour
{
    public bool cutsceneRunning;
    private Coroutine running;

    public void Play()
    {
        running = StartCoroutine(Run());
    }

    IEnumerator Run()
    {
        cutsceneRunning = true;
        yield return new WaitForSeconds(5f);
        EndCutscene();
    }

    void EndCutscene()
    {
        cutsceneRunning = false;
        running = null;
    }

    public void Skip()
    {
        if (running == null) return;
        StopCoroutine(running);
        EndCutscene();
    }
}`,
 rules:[
  inFn('핸들 저장','Play',/\brunning\s*=\s*StartCoroutine\s*\(/,'코루틴 핸들을 running에 저장해요.','나중에 멈추려면 running = StartCoroutine(Run()); 으로 핸들을 저장해야 해요.'),
  inFn('코루틴 멈춤','Skip',/StopCoroutine\s*\(/,'Skip에서 코루틴을 멈춰요.','Skip()에서 StopCoroutine(running) 으로 진행 중인 컷신을 멈추세요.'),
  inFn('끝나면 비우기','EndCutscene',/\brunning\s*=\s*null/,'끝나면 running을 비워요.','EndCutscene()에서 running = null; 로 비워야 끝난 뒤의 Skip을 구분할 수 있어요.')
 ],
 test:(api,ok)=>{
  const env=api.env;
  api.call('Play');
  const g=env.started[0];
  if(!g){ok('코루틴 시작',false,'','Play()에서 StartCoroutine으로 컷신을 시작해야 해요.');return}
  const co=api.co(g);co.advance(0.016);
  ok('컷신 진행',api.get('cutsceneRunning')===true,'컷신이 진행 중이에요.','Play() 후 cutsceneRunning이 true여야 해요.');
  api.call('Skip');
  ok('코루틴 중단',env.stopped.indexOf(g)>=0,'Skip이 진행 중인 코루틴을 멈춰요.','Skip()이 StopCoroutine으로 컷신 코루틴을 멈추지 않았어요. 그냥 상태만 바꾸면 5초 뒤에 코루틴이 다시 이어져요.');
  ok('즉시 종료 상태',api.get('cutsceneRunning')===false,'스킵하면 곧바로 컷신이 끝난 상태가 돼요.','Skip() 뒤에 cutsceneRunning이 false여야 해요.');
  const n=env.stopped.length;
  api.call('Skip');
  ok('끝난 뒤 스킵 무시',env.stopped.length===n,'이미 끝난 컷신의 Skip은 아무것도 하지 않아요.','컷신이 끝났는데 Skip이 또 StopCoroutine을 호출했어요. running이 null이면 바로 return하세요.');
  env.started.length=0;api.call('Play');
  const co2=api.co(env.started[0]);co2.advance(0.016);co2.advance(6);
  const m=env.stopped.length;
  api.call('Skip');
  ok('자연 종료 후',co2.done&&api.get('cutsceneRunning')===false&&env.stopped.length===m,'끝까지 재생된 뒤에도 Skip이 안전해요.','컷신이 자연 종료된 뒤에는 running이 null이어야 해서 Skip이 아무것도 하지 않아야 해요.');
 },
 hints:['코루틴을 중간에 멈추려면 StartCoroutine이 돌려주는 값(Coroutine)을 어딘가에 저장해 두어야 해요.','Skip에서는 "지금 진행 중인가?"를 running이 null인지로 판단해요. 끝나면 반드시 null로 비워 두세요.','컷신이 끝나는 길은 두 가지(자연 종료, 스킵)이고 둘 다 EndCutscene() 하나로 정리하면 중복이 없어요.'],
 why:'코루틴 핸들을 저장하면 StopCoroutine으로 정확히 그 코루틴만 멈출 수 있어요. 끝나는 경로가 여러 개일 때는 정리 코드를 한 함수로 모으고 핸들을 null로 비워 두면 "이미 끝났는지" 판단도 쉬워집니다.',
 concepts:[['Coroutine 핸들','StartCoroutine이 반환하는 값. 저장해 두었다가 StopCoroutine에 넘겨 해당 코루틴만 멈춘다.'],['종료 경로 통합','자연 종료와 중도 종료 모두 같은 정리 함수를 거치게 해 상태가 어긋나는 것을 막는다.']]});

Q({id:'v7',cat:'direction',stage:3,level:1,title:'UI 페이드 아웃 후 클릭 막기',
 story:'메뉴 UI를 CanvasGroup으로 서서히 투명하게 만들었는데, 완전히 사라진 뒤에도 보이지 않는 버튼이 클릭돼요. 알파가 0이 되어도 상호작용과 레이캐스트는 따로 꺼야 합니다.',
 goals:['duration 동안 group.alpha 를 1에서 0으로 서서히 줄인다','끝나면 group.alpha 를 정확히 0으로 맞춘다','끝나면 group.interactable 과 group.blocksRaycasts 를 false 로 바꾼다'],
 limits:['진행 비율은 Mathf.Clamp01(t / duration) 으로 계산한다'],
 api:'CanvasGroup.alpha, CanvasGroup.interactable, CanvasGroup.blocksRaycasts',
 starter:C`
using System.Collections;
using UnityEngine;

public class MenuFader : MonoBehaviour
{
    public CanvasGroup group;
    public float duration = 0.5f;

    IEnumerator FadeOut()
    {
        float t = 0f;
        while (t < duration)
        {
            t += Time.deltaTime;
            group.alpha = 1f - Mathf.Clamp01(t / duration);
            yield return null;
        }
    }
}`,
 solution:C`
using System.Collections;
using UnityEngine;

public class MenuFader : MonoBehaviour
{
    public CanvasGroup group;
    public float duration = 0.5f;

    IEnumerator FadeOut()
    {
        float t = 0f;
        while (t < duration)
        {
            t += Time.deltaTime;
            group.alpha = 1f - Mathf.Clamp01(t / duration);
            yield return null;
        }
        group.alpha = 0f;
        group.interactable = false;
        group.blocksRaycasts = false;
    }
}`,
 rules:[
  inFn('상호작용 끄기','FadeOut',/group\.interactable\s*=\s*false/,'interactable을 꺼요.','group.interactable = false; 로 상호작용을 끄세요.'),
  inFn('레이캐스트 끄기','FadeOut',/group\.blocksRaycasts\s*=\s*false/,'blocksRaycasts를 꺼요.','group.blocksRaycasts = false; 로 클릭을 막으세요.')
 ],
 test:(api,ok)=>{
  const gr={alpha:1,interactable:true,blocksRaycasts:true};api.set('group',gr);api.set('duration',0.5);api.env.Time.deltaTime=0.1;
  const co=api.co(api.call('FadeOut'));
  co.advance(0.1);co.advance(0.1);
  ok('서서히 투명해짐',gr.alpha>0&&gr.alpha<1,`진행 중 알파가 ${gr.alpha.toFixed(2)}로 서서히 줄어요.`,`진행 중 알파가 ${gr.alpha} 입니다. 0과 1 사이에서 서서히 변해야 해요.`);
  ok('진행 중엔 클릭 가능',gr.interactable&&gr.blocksRaycasts,'페이드 중에는 아직 상호작용이 유지돼요.','페이드가 끝나기 전에 상호작용을 끄지 마세요.');
  for(let i=0;i<10;i++)co.advance(0.1);
  ok('알파 0',co.done&&gr.alpha===0,'끝나면 알파가 정확히 0이에요.',`끝난 뒤 알파가 ${gr.alpha}, 끝남=${co.done} 입니다.`);
  ok('클릭 차단',gr.interactable===false&&gr.blocksRaycasts===false,'끝나면 상호작용과 레이캐스트가 꺼져요.','보이지 않는 UI가 클릭돼요. interactable, blocksRaycasts를 false로 바꾸세요.');
 },
 hints:['알파가 0이어도 UI는 여전히 존재해서 클릭을 가로채요. 보이는 것과 상호작용은 별개예요.','CanvasGroup에는 alpha 말고도 상호작용 관련 속성이 두 개 있어요.','페이드가 완전히 끝난 뒤에 끄는 것이 좋아요. 도중에 끄면 반쯤 보이는 버튼이 반응하지 않아요.'],
 why:'CanvasGroup은 자식 UI를 한꺼번에 페이드하고 입력까지 제어하는 도구예요. 투명도만 0으로 만들고 상호작용을 남기면 유령 버튼 버그가 생깁니다. 보이는 상태와 입력 상태를 함께 관리하세요.',
 concepts:[['CanvasGroup','자식 UI 전체의 alpha, 상호작용(interactable), 레이캐스트 차단(blocksRaycasts)을 한 번에 제어하는 컴포넌트.'],['유령 버튼','투명해졌지만 입력은 남아 있어 보이지 않는 UI가 클릭되는 버그.']]});

Q({id:'v8',cat:'direction',stage:3,level:2,title:'페이드가 끝난 뒤에 씬 전환',
 story:'시작 버튼을 누르면 화면이 검게 페이드되며 게임 씬으로 넘어가야 해요. 그런데 지금은 페이드가 시작되자마자 씬이 로드돼 연출이 잘리고, 버튼을 여러 번 누르면 전환이 중복돼요. 페이드가 완전히 끝난 뒤에 씬을 로드하고, 중복 클릭을 막아 주세요.',
 goals:['OnClickStart(): 이미 전환 중이면 아무것도 하지 않는다. 아니면 isLoading을 true로 하고 FadeAndLoad("Game") 코루틴을 시작한다','FadeAndLoad: fadeTime 동안 fade.alpha 를 0에서 1로 올린다','알파가 1이 된 뒤에 SceneManager.LoadScene(sceneName) 을 호출한다'],
 limits:['LoadScene은 페이드가 끝나기 전에 호출하지 않는다'],
 api:'SceneManager.LoadScene(이름), CanvasGroup.alpha',
 starter:C`
using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

public class StartButton : MonoBehaviour
{
    public CanvasGroup fade;
    public float fadeTime = 0.4f;
    private bool isLoading;

    public void OnClickStart()
    {
        StartCoroutine(FadeAndLoad("Game"));
    }

    IEnumerator FadeAndLoad(string sceneName)
    {
        SceneManager.LoadScene(sceneName);
        float t = 0f;
        while (t < fadeTime)
        {
            t += Time.deltaTime;
            fade.alpha = Mathf.Clamp01(t / fadeTime);
            yield return null;
        }
    }
}`,
 solution:C`
using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

public class StartButton : MonoBehaviour
{
    public CanvasGroup fade;
    public float fadeTime = 0.4f;
    private bool isLoading;

    public void OnClickStart()
    {
        if (isLoading) return;
        isLoading = true;
        StartCoroutine(FadeAndLoad("Game"));
    }

    IEnumerator FadeAndLoad(string sceneName)
    {
        float t = 0f;
        while (t < fadeTime)
        {
            t += Time.deltaTime;
            fade.alpha = Mathf.Clamp01(t / fadeTime);
            yield return null;
        }
        fade.alpha = 1f;
        SceneManager.LoadScene(sceneName);
    }
}`,
 rules:[
  inFn('중복 클릭 방지','OnClickStart',/if\s*\(\s*isLoading\s*(?:==\s*true\s*)?\)/,'전환 중이면 클릭을 무시해요.','OnClickStart 맨 앞에서 if (isLoading) return; 으로 중복 클릭을 막으세요.'),
  inFn('로딩 표시','OnClickStart',/isLoading\s*=\s*true/,'전환 시작 시 isLoading을 true로 해요.','전환을 시작하면 isLoading = true; 로 표시하세요.')
 ],
 test:(api,ok)=>{
  const env=api.env;env.scenes.length=0;env.started.length=0;
  const gr={alpha:0};api.set('fade',gr);api.set('fadeTime',0.4);env.Time.deltaTime=0.1;
  api.call('OnClickStart');api.call('OnClickStart');api.call('OnClickStart');
  ok('중복 클릭 방지',env.started.length===1,'여러 번 눌러도 전환은 한 번만 시작돼요.',`버튼을 3번 눌렀더니 전환이 ${env.started.length}번 시작됐어요. 한 번만이어야 해요.`);
  if(!env.started[0])return;
  const co=api.co(env.started[0]);
  let early=false;
  for(let i=0;i<3;i++){co.advance(0.1);if(env.scenes.length>0&&gr.alpha<1)early=true}
  ok('페이드 중 로드 금지',!early,'페이드가 끝나기 전에는 씬을 로드하지 않아요.','페이드가 끝나기 전에 LoadScene이 호출됐어요. 반복문이 끝난 뒤로 옮기세요.');
  for(let i=0;i<4;i++)co.advance(0.1);
  ok('페이드 완료',gr.alpha===1,'페이드 알파가 1이 돼요.',`페이드 알파가 ${gr.alpha} 입니다. 1이어야 해요.`);
  ok('씬 로드',env.scenes.length===1&&env.scenes[0]==='Game','페이드 후 "Game" 씬을 로드해요.',`로드된 씬: [${env.scenes.join(', ')}]. 페이드가 끝난 뒤 "Game" 씬을 한 번 로드해야 해요.`);
 },
 hints:['코루틴 안에서 코드는 위에서 아래로 실행돼요. LoadScene을 어디에 두느냐가 곧 "언제 로드되느냐"예요.','씬 로드는 페이드 반복문이 모두 끝난 뒤에 둬야 해요.','한 번 누르면 isLoading을 true로 바꾸고, 시작 부분에서 이미 true이면 return하면 중복 클릭이 막혀요.'],
 why:'화면 전환 연출은 순서가 전부예요: 페이드 아웃 → 씬 로드 → 페이드 인. 로드를 먼저 하면 연출이 끊기고, 중복 입력을 막지 않으면 씬이 여러 번 로드될 수 있어요. 전환 중 상태 플래그가 이를 막아 줍니다.',
 concepts:[['씬 전환 연출 순서','페이드 아웃이 끝난 뒤에 씬을 로드하고 새 씬에서 페이드 인한다. 순서가 어긋나면 연출이 끊긴다.'],['중복 입력 방지','전환 중임을 나타내는 플래그로 같은 동작이 여러 번 시작되는 것을 막는다.']]});

Q({id:'v9',cat:'direction',stage:3,level:3,title:'겹치는 토스트 메시지 정리',
 story:'아이템을 연속으로 주우면 "획득!" 토스트가 겹쳐서, 새 메시지가 뜬 직후 이전 코루틴이 끝나며 메시지를 갑자기 지워 버려요. 새 토스트를 띄울 때 이전 토스트 코루틴을 멈추고, 끝난 코루틴은 정리해 주세요.',
 goals:['ShowToast(msg): message에 msg를 저장하고, 진행 중인 이전 토스트 코루틴이 있으면 멈춘 뒤 새 코루틴을 시작해 fadeRoutine에 저장한다','ToastRoutine: 알파를 1로 켜고 1.5초 기다린 뒤 0으로 끄고 fadeRoutine을 비운다','이미 끝난 코루틴을 불필요하게 StopCoroutine하지 않는다'],
 limits:['핸들(fadeRoutine)이 null인지 확인한 뒤에 멈춘다'],
 api:'StartCoroutine, StopCoroutine, CanvasGroup.alpha',
 starter:C`
using System.Collections;
using UnityEngine;

public class Toast : MonoBehaviour
{
    public CanvasGroup toast;
    public string message;
    private Coroutine fadeRoutine;

    public void ShowToast(string msg)
    {
        message = msg;
        StartCoroutine(ToastRoutine());
    }

    IEnumerator ToastRoutine()
    {
        toast.alpha = 1f;
        yield return new WaitForSeconds(1.5f);
        toast.alpha = 0f;
    }
}`,
 solution:C`
using System.Collections;
using UnityEngine;

public class Toast : MonoBehaviour
{
    public CanvasGroup toast;
    public string message;
    private Coroutine fadeRoutine;

    public void ShowToast(string msg)
    {
        message = msg;
        if (fadeRoutine != null) StopCoroutine(fadeRoutine);
        fadeRoutine = StartCoroutine(ToastRoutine());
    }

    IEnumerator ToastRoutine()
    {
        toast.alpha = 1f;
        yield return new WaitForSeconds(1.5f);
        toast.alpha = 0f;
        fadeRoutine = null;
    }
}`,
 rules:[
  inFn('이전 코루틴 정리','ShowToast',/StopCoroutine\s*\(\s*fadeRoutine\s*\)/,'새 토스트 전에 이전 코루틴을 멈춰요.','StopCoroutine(fadeRoutine) 으로 이전 토스트를 먼저 멈추세요.'),
  inFn('null 검사','ShowToast',/fadeRoutine\s*!=\s*null/,'핸들이 있을 때만 멈춰요.','if (fadeRoutine != null) 로 확인한 뒤에 멈추세요.'),
  inFn('핸들 저장','ShowToast',/fadeRoutine\s*=\s*StartCoroutine\s*\(/,'새 코루틴의 핸들을 저장해요.','fadeRoutine = StartCoroutine(ToastRoutine()); 으로 핸들을 저장하세요.')
 ],
 test:(api,ok)=>{
  const env=api.env;env.started.length=0;env.stopped.length=0;
  const tg={alpha:0};api.set('toast',tg);
  api.call('ShowToast','A');
  const g1=env.started[0];
  if(!g1){ok('토스트 시작',false,'','ShowToast에서 StartCoroutine으로 토스트를 시작해야 해요.');return}
  const c1=api.co(g1);c1.advance(0.5);
  api.call('ShowToast','B');
  ok('이전 토스트 멈춤',env.stopped.indexOf(g1)>=0,'새 토스트를 띄울 때 이전 코루틴을 멈춰요.','두 번째 ShowToast가 이전 코루틴을 멈추지 않았어요. 이전 코루틴이 새 메시지를 지워 버려요.');
  ok('메시지 갱신',api.get('message')==='B'&&env.started.length===2,'새 메시지로 갱신되고 새 코루틴이 시작돼요.','message가 B로 바뀌고 새 코루틴이 시작되어야 해요.');
  const c2=api.co(env.started[1]);c2.advance(0.1);c2.advance(2);
  ok('정상 종료',c2.done&&tg.alpha===0,'새 토스트는 끝까지 보였다가 사라져요.',`토스트가 끝난 뒤 알파 ${tg.alpha}, 끝남=${c2.done}`);
  const n=env.stopped.length;
  api.call('ShowToast','C');
  ok('끝난 코루틴은 건드리지 않음',env.stopped.length===n,'이미 끝난 토스트는 다시 멈추지 않아요.','끝난 토스트에 StopCoroutine을 또 호출했어요. 끝날 때 fadeRoutine = null; 로 비워야 해요.');
 },
 hints:['같은 연출을 두 번 시작하면 이전 코루틴이 계속 살아 있어서 서로 알파를 덮어써요.','StartCoroutine이 돌려주는 핸들을 필드에 저장해 두면 다음에 그걸로 멈출 수 있어요.','코루틴이 끝나면 핸들을 null로 비워서 "이미 끝났음"을 표시하세요.'],
 why:'UI 연출은 같은 대상에 겹치기 쉬워요. "시작 전에 이전 것을 멈추고, 끝나면 핸들을 비운다"는 패턴 하나로 코루틴과 트윈이 서로 충돌하는 버그를 대부분 막을 수 있습니다.',
 concepts:[['연출 중복 방지','같은 대상에 연출을 시작하기 전에 진행 중인 이전 코루틴이나 트윈을 먼저 멈춘다.'],['핸들 null 정리','코루틴이 끝날 때 핸들을 null로 비워 "진행 중인지"를 정확히 판단할 수 있게 한다.']]});
