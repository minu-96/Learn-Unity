/* ===== 수학·벡터 ===== */
Q({id:'m1',cat:'math',stage:1,level:1,title:'대각선으로 가면 더 빠르다고?',
 story:'키보드 W+D를 같이 누르면 캐릭터가 대각선으로 1.41배 빠르게 움직여요. (1, 1) 벡터의 길이가 1이 아니라 √2이기 때문입니다. 입력 벡터의 길이가 1을 넘으면 길이를 1로 맞춰서 어느 방향이든 같은 속도가 되도록 해 주세요. 조이스틱을 살짝 기울인 경우(길이 1 미만)는 그대로 비례해야 합니다.',
 goals:['MoveVelocity(h, v, speed): 입력 (h, v)로 속도 벡터를 반환한다','입력 벡터의 길이가 1을 넘으면 길이 1로 정규화한 뒤 speed를 곱한다','길이가 1 이하이면 입력 그대로 speed를 곱한다 (살짝 기울이면 천천히)','입력이 (0, 0)이면 (0, 0) — 0으로 나누기 오류가 없어야 한다'],
 limits:['반환값은 new Vector2(x, y)'],
 api:'Mathf.Sqrt(x), new Vector2(x, y)',
 starter:C`
Vector2 MoveVelocity(float h, float v, float speed)
{
    return new Vector2(h * speed, v * speed);
}`,
 solution:C`
Vector2 MoveVelocity(float h, float v, float speed)
{
    float len = Mathf.Sqrt(h * h + v * v);
    if (len > 1f)
    {
        h /= len;
        v /= len;
    }
    return new Vector2(h * speed, v * speed);
}`,
 rules:[],
 test:(api,ok)=>{
  const m=(h,v,s)=>{const r=api.call('MoveVelocity',h,v,s);return {x:r.x,y:r.y,len:Math.hypot(r.x,r.y)}};
  let r=m(1,1,5);
  ok('대각선 속도',Math.abs(r.len-5)<1e-4,'대각선으로 가도 속도가 5로 같아요.',`(1, 1) 입력의 속도 크기가 ${r.len.toFixed(2)} 입니다. 5여야 해요 (정규화 필요).`);
  r=m(1,0,5);
  ok('직선 이동',Math.abs(r.x-5)<1e-6&&Math.abs(r.y)<1e-6,'직선 이동은 그대로 5예요.',`(1, 0) 입력의 속도가 (${r.x}, ${r.y}) 입니다. (5, 0)이어야 해요.`);
  r=m(0.5,0,5);
  ok('살짝 기울임',Math.abs(r.x-2.5)<1e-6,'조이스틱을 반만 기울이면 속도도 절반이에요.',`(0.5, 0) 입력의 속도가 (${r.x}, ${r.y}) 입니다. (2.5, 0)이어야 해요. 길이가 1 이하일 때는 정규화하지 마세요.`);
  r=m(0,0,5);
  ok('입력 없음',r.x===0&&r.y===0&&!isNaN(r.x)&&!isNaN(r.y),'입력이 없으면 (0, 0)이에요.','(0, 0) 입력에서 NaN이 나왔어요. 길이가 0일 때 나누지 않도록 하세요.');
 },
 hints:['벡터 (h, v)의 길이는 √(h² + v²) 예요. (1, 1)의 길이는 약 1.414죠.','각 성분을 길이로 나누면 길이 1의 방향 벡터(정규화)가 돼요.','"1을 넘을 때만" 정규화하면 길이가 0일 때 나눗셈도 자연스럽게 피할 수 있어요.'],
 why:'이동 속도를 방향 입력의 크기에 맡기면 대각선이 빨라져요. 길이를 1로 제한(정규화)하면 방향과 무관하게 속도가 일정합니다. 길이 1 이하일 때는 그대로 두어야 아날로그 입력의 강약이 살아요.',
 concepts:[['벡터의 길이(크기)','√(x² + y²). 방향 벡터의 크기가 1이 아니면 크기만큼 속도가 달라진다.'],['정규화(Normalize)','벡터를 길이 1로 만들어 방향만 남기는 연산. 길이 0일 때는 나눌 수 없으니 주의한다.'],['Vector2.ClampMagnitude','벡터 길이를 최대값으로 제한한다. 이 문제의 조건과 정확히 같은 동작.']]});

Q({id:'m2',cat:'math',stage:1,level:2,title:'시야각 안에 있나? (내적)',
 story:'적의 시야 판정을 만들어요. 적이 바라보는 방향이 있고, 플레이어가 그 방향 기준 좌우 halfAngle도 안에 있으면 보이는 거예요. 각도를 일일이 구하지 않고 두 방향 벡터의 내적(Dot)과 코사인을 비교하면 간단히 판정할 수 있어요.',
 goals:['InFov(fx, fy, tx, ty, halfAngle): (fx, fy)는 바라보는 방향(길이 1), (tx, ty)는 플레이어까지의 벡터(길이 임의)','대상 벡터를 정규화한 뒤 내적을 구한다','내적 ≥ cos(halfAngle) 이면 true (halfAngle 은 도 단위)','대상 벡터의 길이가 0이면 false'],
 limits:['각도를 구하는 Atan2나 Acos 는 쓰지 않고 내적으로 판정한다','도 → 라디안 변환: Mathf.Deg2Rad'],
 api:'Mathf.Cos, Mathf.Deg2Rad, Mathf.Sqrt',
 starter:C`
bool InFov(float fx, float fy, float tx, float ty, float halfAngle)
{
    return true;
}`,
 solution:C`
bool InFov(float fx, float fy, float tx, float ty, float halfAngle)
{
    float len = Mathf.Sqrt(tx * tx + ty * ty);
    if (len == 0f) return false;
    float dot = (fx * tx + fy * ty) / len;
    return dot >= Mathf.Cos(halfAngle * Mathf.Deg2Rad);
}`,
 rules:[no('Atan2/Acos 금지',/Atan2|Acos/,'각도를 구하지 않고 내적으로 판정해요.','Atan2/Acos 대신 내적과 Mathf.Cos 비교로 판정하세요.')],
 test:(api,ok)=>{
  const f=(tx,ty)=>api.call('InFov',1,0,tx,ty,45);
  ok('정면',f(5,0)===true,'정면에 있으면 보여요.','바로 앞(5, 0)은 시야 안이에요.');
  ok('뒤쪽',f(-5,0)===false,'뒤에 있으면 안 보여요.','바로 뒤(-5, 0)는 시야 밖이어야 해요.');
  ok('옆쪽',f(0,5)===false,'90도 옆은 안 보여요.','90도 옆(0, 5)은 시야 밖이어야 해요 (halfAngle 45).');
  ok('경계 안쪽',f(5,4)===true&&f(4,-3)===true,'약 39°, 37°는 시야 안이에요.','각도 약 39°(5, 4)는 시야각 45° 안이어요. 대상 벡터를 정규화한 뒤 내적하세요.');
  ok('경계 바깥',f(5,6)===false,'약 50°는 시야 밖이에요.','각도 약 50°(5, 6)는 시야각 45° 밖이에요.');
  ok('길이와 무관',f(100,0)===true&&f(0.001,0)===true,'거리와 무관하게 방향으로만 판정해요.','대상 벡터를 정규화하지 않으면 거리에 따라 결과가 달라져요.');
  ok('겹침',f(0,0)===false,'대상이 같은 위치면 false예요.','길이 0인 벡터는 방향이 없어서 false로 처리하세요.');
 },
 hints:['두 단위 벡터의 내적은 두 방향 사이 각도의 코사인과 같아요. 가까운 방향일수록 1에 가까워요.','대상 벡터는 길이가 제각각이니 먼저 길이로 나누어(정규화) 내적하세요.','각도가 작을수록 코사인이 커져요. 내적 ≥ cos(halfAngle) 이면 시야 안이에요.'],
 why:'내적은 "두 방향이 얼마나 같은 쪽인가"를 싸게 계산해요. 각도 계산(삼각함수 역함수)보다 빠르고 코사인과 비교하면 시야, 전방/후방 판정, 조명 계산 등에 폭넓게 쓸 수 있습니다.',
 concepts:[['내적(Dot Product)','두 벡터 성분 곱의 합. 단위 벡터끼리는 사잇각의 코사인 값이라 방향이 얼마나 비슷한지 알려준다.'],['시야각 판정','정규화한 대상 방향과 정면 방향의 내적을 cos(반각)과 비교한다.'],['Mathf.Deg2Rad','도(degree)를 라디안으로 바꾸는 상수. 삼각함수는 라디안을 쓴다.']]});

Q({id:'m3',cat:'math',stage:1,level:3,title:'350도에서 10도까지, 어느 쪽으로 돌까?',
 story:'포탑이 현재 각도에서 목표 각도로 회전해야 해요. 그냥 뺄셈(10 − 350 = −340)을 하면 포탑이 거의 한 바퀴를 도는 이상한 방향으로 돌아요. 360도가 한 바퀴라는 점을 고려해 "가까운 쪽 방향"의 각도 차이(−180 ~ 180)를 구하는 함수를 작성해 주세요.',
 goals:['ShortestAngle(from, to): from에서 to까지 돌아야 하는 최소 각도를 −180 ~ 180 범위로 반환한다 (양수 = 반시계, 음수 = 시계)','350 → 10 은 +20, 10 → 350 은 −20','0 → 180 은 ±180 모두 허용'],
 limits:['Mathf.DeltaAngle 을 쓰면 정답이지만, 직접 구현해 원리를 익혀 보세요 (Mathf.Repeat 사용)'],
 api:'Mathf.Repeat(값, 길이) → 0 ≤ 결과 < 길이',
 starter:C`
float ShortestAngle(float from, float to)
{
    return to - from;
}`,
 solution:C`
float ShortestAngle(float from, float to)
{
    return Mathf.Repeat(to - from + 180f, 360f) - 180f;
}`,
 rules:[],
 test:(api,ok)=>{
  const s=(a,b)=>api.call('ShortestAngle',a,b);
  ok('0도 경계 넘기',Math.abs(s(350,10)-20)<1e-4&&Math.abs(s(10,350)+20)<1e-4,'350→10은 +20, 10→350은 −20 이에요.',`350→10: ${s(350,10)}, 10→350: ${s(10,350)}. 각각 +20, −20이어야 해요.`);
  ok('일반 값',Math.abs(s(0,90)-90)<1e-4&&Math.abs(s(90,0)+90)<1e-4&&s(45,45)===0,'0→90은 +90, 90→0은 −90, 같으면 0이에요.',`0→90: ${s(0,90)}, 90→0: ${s(90,0)}, 45→45: ${s(45,45)}`);
  ok('반대편',Math.abs(Math.abs(s(0,180))-180)<1e-4,'정반대는 ±180이에요.',`0→180: ${s(0,180)}. 절댓값이 180이어야 해요.`);
  ok('범위 밖 입력',Math.abs(s(720,10)-10)<1e-4&&Math.abs(s(-10,370)-20)<1e-4,'360도를 넘는 입력도 처리해요.',`720→10: ${s(720,10)}, −10→370: ${s(-10,370)}. 각각 +10, +20이어야 해요.`);
  let ok2=true;for(let i=0;i<50;i++){const a=Math.random()*1000-500,b=Math.random()*1000-500;const r=s(a,b);if(r<-180-1e-6||r>180+1e-6)ok2=false}
  ok('항상 −180 ~ 180',ok2,'결과가 항상 −180 ~ 180 범위예요.','결과가 −180 ~ 180을 벗어나는 경우가 있어요.');
 },
 hints:['각도는 360에서 한 바퀴를 돌아 처음으로 돌아와요. 같은 방향도 10, 370, −350처럼 여러 값으로 쓸 수 있어요.','Mathf.Repeat(x, 360)은 x를 0 ~ 360 범위로 감싸 줘요. 이를 −180 ~ 180으로 옮기려면 180을 더했다가 빼면 돼요.','공식: Repeat(to − from + 180, 360) − 180'],
 why:'각도는 원형(순환)이라 단순 뺄셈이 안 통해요. 최단 각도 차이를 구하는 이 공식은 회전 보간, 조준, 카메라 회전에서 계속 등장합니다. 실전에서는 Mathf.DeltaAngle이 같은 일을 해요.',
 concepts:[['각도의 순환성','각도는 360도마다 같은 방향이라 뺄셈 결과를 −180 ~ 180으로 감싸야 최단 회전이 된다.'],['Mathf.Repeat','값을 0 이상 길이 미만으로 순환시킨다. 각도, 타일 인덱스 등 반복 구조에 쓴다.'],['Mathf.DeltaAngle','두 각도 사이의 최단 부호 있는 차이를 돌려주는 내장 함수.']]});

Q({id:'m4',cat:'math',stage:2,level:1,title:'목표를 지나치지 않고 접근하기',
 story:'체력바가 목표 값을 향해 일정한 속도로 움직여야 하는데, 지금은 step만큼 계속 더하다 보니 목표를 지나쳐서 흔들려요. 현재 값에서 목표를 향해 최대 maxStep만큼만 이동하고, 목표에 닿으면 정확히 목표에 멈추는 함수를 작성해 주세요.',
 goals:['Approach(current, target, maxStep): current에서 target 쪽으로 maxStep 만큼 움직인 값을 반환한다','남은 거리가 maxStep 이하이면 정확히 target 을 반환한다 (지나치지 않음)','target 이 current 보다 작을 때도 동작한다 (감소)'],
 limits:['Mathf.MoveTowards 를 사용하거나 직접 구현해도 된다'],
 api:'Mathf.MoveTowards(현재, 목표, 최대이동량)',
 starter:C`
float Approach(float current, float target, float maxStep)
{
    if (current < target) return current + maxStep;
    return current - maxStep;
}`,
 solution:C`
float Approach(float current, float target, float maxStep)
{
    return Mathf.MoveTowards(current, target, maxStep);
}`,
 rules:[],
 test:(api,ok)=>{
  const a=(c,t,m)=>api.call('Approach',c,t,m);
  ok('올라가기',a(0,10,3)===3&&a(8,10,3)===10,'목표를 향해 최대 3씩, 마지막엔 정확히 10이에요.',`Approach(0,10,3)=${a(0,10,3)}, Approach(8,10,3)=${a(8,10,3)}. 각각 3, 10이어야 해요.`);
  ok('내려가기',a(10,0,3)===7&&a(2,0,3)===0,'감소할 때도 지나치지 않아요.',`Approach(10,0,3)=${a(10,0,3)}, Approach(2,0,3)=${a(2,0,3)}. 각각 7, 0이어야 해요.`);
  ok('이미 도착',a(5,5,3)===5,'목표에 도착했으면 그대로예요.',`Approach(5,5,3)=${a(5,5,3)}. 5여야 해요 (떨리면 안 돼요).`);
  let x=0,n=0;while(x!==10&&n++<20)x=a(x,10,3);
  ok('수렴',x===10&&n===4,'4번 만에 정확히 10에 도착해서 멈춰요.',`반복해도 정확히 10에 멈추지 못했어요 (현재 ${x}).`);
 },
 hints:['목표를 지나칠 수 있는 이유는 남은 거리가 step보다 작을 때도 step만큼 움직이기 때문이에요.','"남은 거리"와 "maxStep" 중 작은 쪽만큼만 움직이면 지나치지 않아요.','증가/감소 방향 구분이 귀찮다면 이 일을 해 주는 Mathf 함수가 있어요.'],
 why:'MoveTowards는 일정한 속도의 접근, Lerp는 거리에 비례한 감속 접근이에요. UI 게이지·카운터처럼 "일정한 속도로 따라잡기"에는 MoveTowards가 알맞고 도착 시 정확히 멈추는 것이 장점입니다.',
 concepts:[['Mathf.MoveTowards','현재 값에서 목표로 최대 maxDelta만 이동하고 목표를 넘지 않는다. 일정한 속도의 접근.'],['등속 접근 vs 감속 접근','MoveTowards는 일정한 속도, Lerp(고정 t)는 가까울수록 느려지는 지수적 접근이다.']]});

Q({id:'s3',cat:'math',stage:2,level:2,title:'일정한 속도로 목표 쫓아가기',
 story:'주황색 목표가 원을 그리며 움직이고, 오브젝트가 초속 100으로 쫓아가야 해요. 지금은 매 프레임 Lerp(t=0.05)를 쓰고 있어서 멀수록 빠르고 가까울수록 느려지며, 프레임레이트에 따라 속도도 달라집니다. 어떤 프레임레이트에서도 멀리 있을 때는 초속 100, 가까워지면 목표에 딱 붙도록 고쳐 주세요.',
 goals:['목표가 멀 때(거리 60 이상) 30fps와 144fps 모두 평균 속도가 약 100px/s (±15)','마지막 3초 동안 평균 거리가 10px 미만 (끝까지 따라잡음)'],
 limits:['이동량은 속도 × Time.deltaTime 으로 계산한다','고정 비율 Lerp를 쓰지 않는다'],
 api:'Vector2.MoveTowards(from, to, maxDelta), target.position (제공), Time.deltaTime',
 starter:C`
public float speed = 100f;

void Update()
{
    transform.position = Vector2.Lerp(transform.position, target.position, 0.05f);
}`,
 solution:C`
public float speed = 100f;

void Update()
{
    transform.position = Vector2.MoveTowards(transform.position, target.position, speed * Time.deltaTime);
}`,
 world:{start:{x:60,y:135},target:{cx:240,cy:135,r:90,w:0.8}},runs:[{fps:30,seconds:10},{fps:144,seconds:10}],show:10,
 rules:[has('deltaTime 반영',/Time\.deltaTime/,'이동량에 Time.deltaTime이 반영돼요.','이동량에 Time.deltaTime을 곱하세요.'),
  no('고정 Lerp 비율 금지',/Lerp\s*\([^;]*,\s*0?\.\d+f?\s*\)/,'고정 비율 Lerp를 쓰지 않아요.','Lerp의 세 번째 인자에 고정 숫자를 쓰면 프레임레이트와 거리에 따라 속도가 달라져요.')],
 check:rs=>{const far=r=>{const f=r.frames,dt=1/r.fps;let s=[],c=0;for(let i=1;i<f.length;i++){const d0=Math.hypot(f[i-1][1]-f[i-1][3],f[i-1][2]-f[i-1][4]);if(d0>=60){s.push(Math.hypot(f[i][1]-f[i-1][1],f[i][2]-f[i-1][2])/dt)}}return s.length?s.reduce((a,b)=>a+b,0)/s.length:0};
  const tail=r=>{const f=r.frames,n=Math.round(3*r.fps);let s=0,c=0;for(let i=f.length-n;i<f.length;i++){s+=Math.hypot(f[i][1]-f[i][3],f[i][2]-f[i][4]);c++}return s/c};
  const a=far(rs[0]),b=far(rs[1]),t1=tail(rs[0]),t2=tail(rs[1]);
  return {items:[
   it(Math.abs(a-100)<=15&&Math.abs(b-100)<=15,'일정한 이동 속도',`멀 때 속도가 30fps ${a.toFixed(0)} / 144fps ${b.toFixed(0)} px/s 로 약 100이에요.`,`멀 때 속도가 30fps ${a.toFixed(0)} / 144fps ${b.toFixed(0)} px/s 입니다. 두 경우 모두 약 100이어야 해요 (Time.deltaTime × speed 만큼 일정하게 접근).`),
   it(t1<10&&t2<10,'끝까지 따라잡음',`마지막 3초 평균 거리가 30fps ${t1.toFixed(1)} / 144fps ${t2.toFixed(1)} 로 목표에 붙어 있어요.`,`마지막 3초 평균 거리가 30fps ${t1.toFixed(1)} / 144fps ${t2.toFixed(1)} 입니다. 목표에 딱 붙어야 해요 (10 미만).`)]}},
 hints:['Lerp(a, b, 0.05)는 "남은 거리의 5%"를 이동해요. 멀면 크게, 가까우면 작게 움직이죠. 일정한 속도가 필요하면 다른 함수가 맞아요.','Vector2.MoveTowards는 "최대 이 거리만큼만" 접근하고, 도착하면 목표에 정확히 멈춰요.','maxDelta 자리에 speed × Time.deltaTime 을 넣으면 프레임레이트와 무관해져요.'],
 why:'Lerp(고정 t)는 가까울수록 느려지는 지수적 접근이고 프레임에 의존해요. 일정한 속도로 목표에 접근하려면 MoveTowards(현재, 목표, 속도 × deltaTime)을 쓰세요. 두 방식의 차이를 구분하는 것이 이동 로직의 기본입니다.',
 concepts:[['Vector2.MoveTowards','현재 위치에서 목표를 향해 최대 maxDelta만큼만 이동한다. 도착하면 목표에 정확히 멈춘다.'],['Lerp 접근의 특성','고정 t로 매 프레임 Lerp하면 남은 거리에 비례해 이동하므로 가까울수록 느려지고 프레임레이트에 영향을 받는다.']]});

Q({id:'m6',cat:'math',stage:2,level:3,title:'포물선으로 점프하는 위치 계산',
 story:'아이템이 상자에서 튀어나와 포물선을 그리며 목표 지점에 떨어져야 해요. 진행 비율 t(0~1)에 따라 위치를 계산해 주세요. 수평으로는 시작에서 끝까지 일정하게 이동하고, 높이는 시작과 끝을 잇는 직선보다 위로 볼록하게 올라가서 중간(t=0.5)에서 정확히 height만큼 더 높아야 해요.',
 goals:['Arc(ax, ay, bx, by, t, height): 시작 (ax, ay)에서 끝 (bx, by)으로 가는 포물선 위의 점을 new Vector2(x, y)로 반환한다','x는 시작과 끝 사이를 t 비율로 일정하게 이동한다','y는 시작~끝 높이를 잇는 직선 위에 포물선 높이를 더한 값이며, t=0.5에서 정확히 height만큼 높다','t=0 이면 시작점, t=1 이면 끝점 (높이 보정은 0)'],
 limits:['t 는 0~1 범위를 넘으면 0~1로 제한한다 (Mathf.Clamp01)'],
 api:'Mathf.Lerp, Mathf.Clamp01, new Vector2(x, y)',
 starter:C`
Vector2 Arc(float ax, float ay, float bx, float by, float t, float height)
{
    return new Vector2(ax, ay);
}`,
 solution:C`
Vector2 Arc(float ax, float ay, float bx, float by, float t, float height)
{
    t = Mathf.Clamp01(t);
    float x = Mathf.Lerp(ax, bx, t);
    float y = Mathf.Lerp(ay, by, t) + 4f * height * t * (1f - t);
    return new Vector2(x, y);
}`,
 rules:[],
 test:(api,ok)=>{
  const a=(t)=>{const r=api.call('Arc',0,0,10,0,t,2);return r};
  let r=a(0);ok('시작점',Math.abs(r.x)<1e-6&&Math.abs(r.y)<1e-6,'t=0이면 시작점 (0, 0)이에요.',`t=0 위치가 (${r.x}, ${r.y}) 입니다. (0, 0)이어야 해요.`);
  r=a(1);ok('끝점',Math.abs(r.x-10)<1e-6&&Math.abs(r.y)<1e-6,'t=1이면 끝점 (10, 0)이에요.',`t=1 위치가 (${r.x}, ${r.y}) 입니다. (10, 0)이어야 해요.`);
  r=a(0.5);ok('최고점',Math.abs(r.x-5)<1e-6&&Math.abs(r.y-2)<1e-6,'t=0.5에서 최고 높이 2예요.',`t=0.5 위치가 (${r.x}, ${r.y}) 입니다. (5, 2)여야 해요.`);
  r=a(0.25);ok('중간 지점',Math.abs(r.x-2.5)<1e-6&&Math.abs(r.y-1.5)<1e-6,'t=0.25에서 높이 1.5예요.',`t=0.25 위치가 (${r.x}, ${r.y}) 입니다. (2.5, 1.5)여야 해요.`);
  const q=api.call('Arc',0,5,10,5,0.5,2);
  const w=api.call('Arc',0,0,10,4,0.5,2);
  ok('높이 차이가 있을 때',Math.abs(w.y-4)<1e-6&&Math.abs(q.y-7)<1e-6,'시작과 끝의 높이가 달라도 올바른 포물선이에요.',`(0,0)→(10,4), t=0.5의 y가 ${w.y} 입니다. 직선 중간 2에 포물선 2를 더한 4여야 해요.`);
  const o=api.call('Arc',0,0,10,0,2,2);
  ok('t 범위 제한',Math.abs(o.x-10)<1e-6&&Math.abs(o.y)<1e-6,'t가 1을 넘어도 끝점에 머물러요.',`t=2일 때 위치가 (${o.x}, ${o.y}) 입니다. t를 0~1로 제한하세요.`);
 },
 hints:['수평 이동은 단순해요. 시작과 끝을 t의 비율로 섞는 Lerp면 돼요.','높이를 위로 볼록한 곡선으로 만드는 가장 간단한 식은 t(1−t)예요. t=0과 t=1에서 0이고 t=0.5에서 최대 0.25가 돼요.','최고 높이가 height가 되려면 t(1−t)에 4 × height를 곱하세요 (0.25 × 4 = 1).'],
 why:'포물선은 이차식 t(1−t)로 쉽게 만들 수 있어요. 물리 시뮬레이션 없이도 아이템 드롭, 투사체, 점프 연출을 보간만으로 표현할 수 있고, 시작·끝 위치를 정확히 보장해서 예측 가능합니다.',
 concepts:[['포물선 보간','수평은 Lerp, 높이는 4h·t·(1−t)를 더해 시작과 끝을 정확히 지나는 포물선 경로를 만든다.'],['보간 파라미터 t','0에서 1로 진행하는 비율. 이 값 하나로 위치·색·크기를 모두 같은 타이밍으로 조절할 수 있다.']]});
