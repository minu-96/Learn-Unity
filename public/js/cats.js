const LV={1:'Lv.1 기본',2:'Lv.2 보통',3:'Lv.3 도전'};
const CATS=[
 {id:'start',name:'코딩 첫걸음',desc:'변수·조건·반복·메서드',stages:[
  {title:'변수와 자료형',theory:'변수는 값을 담는 이름 붙은 상자입니다. 정수는 int, 소수는 float(값 뒤에 f를 붙여 3.5f), 글자는 string("큰따옴표"), 참/거짓은 bool입니다. 정수끼리 나누면 소수점 아래가 버려지니, 비율을 구할 때는 (float)로 바꿔서 나눕니다.'},
  {title:'조건문',theory:'if (조건) { ... } 는 조건이 참일 때만 실행됩니다. else if로 조건을 이어 붙이고 else로 나머지를 처리합니다. 조건은 같음(==), 크기(<, <=, >, >=)로 비교하고, 그리고(&&)와 또는(||)로 묶습니다. return을 만나면 메서드가 거기서 끝납니다.'},
  {title:'반복문',theory:'같은 일을 여러 번 할 때 for (int i = 0; i < 횟수; i++) { ... } 를 씁니다. 배열의 값을 하나씩 꺼낼 때는 foreach (int x in 배열)을 씁니다. 합계나 개수는 반복문 밖에 변수를 만들어 두고 안에서 더합니다. 나머지 연산자 %로 짝수(x % 2 == 0)를 가릴 수 있습니다.'},
  {title:'메서드',theory:'메서드는 이름을 붙인 코드 묶음입니다. 반환 형식 이름(매개변수) { ... } 로 만들고 이름(값)으로 부릅니다. 값을 돌려주려면 return을 쓰고, 돌려줄 것이 없으면 반환 형식을 void로 둡니다. 큰 일을 작은 메서드로 나눠 서로 부르면 읽기 쉽습니다.'},
  {title:'유니티 첫 스크립트',theory:'유니티 스크립트는 MonoBehaviour를 이어받은 클래스입니다. Start는 시작할 때 한 번, Update는 매 프레임 호출됩니다. Debug.Log로 콘솔에 글자를 찍고, 이동량에는 Time.deltaTime을 곱해 프레임 속도와 상관없이 같은 속도로 움직입니다. Input.GetKeyDown은 키를 누른 그 프레임에만 true입니다.'}]},
 {id:'csharp',name:'C# 문법',desc:'변수·컬렉션·이벤트',stages:[
  {title:'변수와 제어문',theory:'변수는 값을 담는 이름표이고, 접근 제한자(public/private)로 공개 범위를 정합니다. if, for, switch로 실행 흐름을 제어합니다. Unity에서는 public 필드와 [SerializeField] 필드가 Inspector에 노출됩니다.'},
  {title:'타입과 컬렉션',theory:'struct는 복사되는 값 형식, class는 참조가 복사되는 참조 형식입니다. 배열은 크기가 고정이고 List<T>는 크기가 변합니다. foreach로 순회하는 동안 같은 컬렉션을 수정하면 예외가 납니다.'},
  {title:'델리게이트와 이벤트',theory:'델리게이트는 메서드를 담는 타입이고 event는 외부에서 구독/해제만 하도록 제한한 델리게이트입니다. 구독자가 없으면 null이라 ?.Invoke를 쓰고, 구독한 객체가 사라질 때는 -=로 해제합니다.'}]},
 {id:'unity',name:'Unity 핵심',desc:'생명주기·입력·코루틴',stages:[
  {title:'시간과 이벤트 함수',theory:'이벤트 함수는 Awake, OnEnable, Start, Update 순으로 호출됩니다. Update는 프레임마다 실행되므로 이동은 속도에 Time.deltaTime을 곱해 프레임레이트와 무관하게 만듭니다. timeScale이 0이면 deltaTime도 0입니다.'},
  {title:'입력과 물리 루프',theory:'FixedUpdate는 고정된 물리 주기마다 호출되고 Update는 렌더 프레임마다 호출됩니다. 입력은 Update에서 읽고, 물리 힘 적용은 FixedUpdate에서 하는 것이 안전합니다.'},
  {title:'코루틴',theory:'코루틴은 yield return으로 프레임이나 시간 단위로 나눠 실행하는 함수입니다. 반복문 안에서 yield해야 프레임이 나뉘고, 시작한 오브젝트가 비활성화되거나 파괴되면 멈춥니다.'}]},
 {id:'components',name:'컴포넌트',desc:'조합·참조·통신',stages:[
  {title:'컴포넌트 기본',theory:'게임 오브젝트는 컴포넌트의 조합입니다. GetComponent는 비용이 있으니 Awake에서 한 번 가져와 캐싱하고, RequireComponent로 필요한 컴포넌트를 보장합니다. 깊은 상속보다 작은 컴포넌트의 조합이 Unity다운 구조입니다.'},
  {title:'컴포넌트 사이의 통신',theory:'컴포넌트끼리는 직접 참조, 인터페이스, 이벤트로 소통합니다. SendMessage는 문자열 기반이라 느리고 오타에 약합니다. TryGetComponent로 있을 때만 안전하게 가져올 수 있습니다.'}]},
 {id:'physics',name:'물리·충돌',desc:'콜라이더·Rigidbody',stages:[
  {title:'콜라이더와 충돌',theory:'Collider는 물리적으로 막고 Collision 이벤트를, Trigger는 통과하며 Trigger 이벤트를 보냅니다. 충돌 이벤트가 오려면 보통 한쪽에 Rigidbody가 필요하고, 너무 빠른 물체는 얇은 벽을 통과(터널링)할 수 있습니다.'},
  {title:'Rigidbody 이동과 검사',theory:'Transform을 직접 옮기면 물리 엔진을 거치지 않아 충돌이 무시됩니다. 충돌이 필요한 이동은 Rigidbody의 velocity나 AddForce를 쓰고, Raycast는 LayerMask로 검사 대상을 제한합니다.'}]},
 {id:'animation',name:'애니메이션',desc:'Animator·전환',stages:[
  {title:'Animator 기본',theory:'Animator Controller는 상태 머신이고 파라미터(Float, Int, Bool, Trigger)와 전환 조건으로 상태가 바뀝니다. Has Exit Time이 켜져 있으면 현재 클립이 끝나야 전환이 시작됩니다.'},
  {title:'코드와 애니메이션',theory:'코드에서 SetFloat, SetBool, SetTrigger로 파라미터를 전달하고, Blend Tree로 여러 클립을 섞습니다. Root Motion은 클립의 이동을 Transform에 적용하며, Animation Event는 특정 프레임에 함수를 호출합니다.'}]},
 {id:'particle',name:'파티클·VFX',desc:'Particle System',stages:[
  {title:'파티클 시스템 기본 모듈',theory:'Particle System은 모듈의 조합입니다. Emission은 생성 속도와 Burst, Main 모듈은 수명·속도·크기·Simulation Space·Max Particles·Stop Action을 정합니다.'},
  {title:'모양과 변화',theory:'Shape 모듈이 방출 영역과 방향을 정하고, Over Lifetime 모듈이 시간에 따른 색·크기·속도 변화를 정합니다. 머티리얼의 블렌드 방식(Additive, Alpha Blended)이 밝기와 질감을 좌우합니다.'},
  {title:'코드 제어와 성능',theory:'코드로 Play와 Stop을 제어하고 Stop 동작(StopEmitting, StopEmittingAndClear)을 구분합니다. 큰 투명 파티클이 겹치면 오버드로우로 모바일 성능이 크게 떨어집니다.'}]},
 {id:'juice',name:'게임 주스',desc:'타격감·움직임의 느낌',stages:[
  {title:'피드백의 원리',theory:'게임 주스는 입력과 결과에 사운드, 파티클, 화면 흔들림, 히트스톱 같은 과장된 피드백을 더해 조작의 쾌감을 키우는 기법입니다. 정보 전달을 방해하지 않도록 강도를 조절하고 끄기 옵션을 둡니다.'},
  {title:'움직임의 느낌',theory:'선형 이동은 기계적으로 느껴집니다. 스쿼시 & 스트레치, 이징, 스무딩으로 가감속과 탄성을 주고, 보간은 프레임레이트와 무관하게 구현해야 합니다.'},
  {title:'화면 흔들림과 반응',theory:'카메라 셰이크는 충격 직후 강하게 시작해 감쇠해야 자연스럽습니다. 흔들림은 기준 위치에 오프셋을 더하는 방식으로 구현해야 끝난 뒤에 위치가 어긋나지 않습니다.'}]},
 {id:'direction',name:'연출',desc:'카메라·타임라인·UI',stages:[
  {title:'카메라 연출',theory:'Cinemachine은 Virtual Camera로 추적, 댐핑, 데드존, 전환을 설정하고 CinemachineBrain이 Main Camera에 적용합니다. 카메라 Transform을 직접 건드리면 Brain이 덮어씁니다.'},
  {title:'시퀀스 연출',theory:'Timeline은 애니메이션, 오디오, 카메라 트랙을 시간축에 배치해 컷신을 만듭니다. Animation Event는 애니메이션 프레임에 맞춰 함수를 호출해 동작과 로직의 타이밍을 맞춥니다.'},
  {title:'UI·화면 전환 연출',theory:'CanvasGroup으로 UI를 한 번에 페이드하고, 연출이 끝난 뒤 씬을 전환합니다. 같은 대상에 연출이 겹치지 않도록 이전 코루틴이나 트윈을 중단하고 시작합니다.'}]},
 {id:'design',name:'설계',desc:'데이터·상태·결합도',stages:[
  {title:'데이터 분리',theory:'수치와 설정은 코드 밖(필드, ScriptableObject)으로 빼서 기획 변경이 코드 수정으로 번지지 않게 합니다. ScriptableObject는 에셋이므로 런타임 상태는 따로 둡니다.'},
  {title:'상태 모델링',theory:'행동을 Patrol, Chase 같은 상태로 나누고 전환 조건을 명확히 합니다. bool 플래그가 늘어나면 enum이나 State 패턴을 고려합니다.'},
  {title:'결합도 낮추기',theory:'클래스끼리 직접 호출하면 수정이 연쇄됩니다. 이벤트(옵저버)와 인터페이스로 느슨하게 연결하고, 문자열 기반 Find 의존을 줄입니다.'}]},
 {id:'math',name:'수학·벡터',desc:'방향·보간·이동',stages:[
  {title:'벡터 기초',theory:'벡터는 방향과 크기를 가집니다. normalized는 길이를 1로 만들어 방향만 남기고, 방향 벡터는 도착 - 출발이며, 단위 벡터의 내적은 두 방향 사이 각의 코사인입니다.'},
  {title:'보간과 이동',theory:'Lerp는 a와 b를 t 비율로 섞고, MoveTowards는 일정 거리만큼만 접근합니다. 고정 t를 매 프레임 쓰면 프레임레이트에 의존하므로 deltaTime을 반영합니다.'}]},
 {id:'debug',name:'디버깅',desc:'로그·원인 추적',stages:[
  {title:'에러 메시지 읽기',theory:'콘솔의 예외 이름과 스택 트레이스(파일:줄 번호)에서 원인 위치를 찾습니다. NullReference는 비어 있는 참조, MissingReference는 파괴된 오브젝트 접근입니다.'},
  {title:'논리 버그 추적',theory:'에러 없이 결과가 틀리는 버그는 경계 조건(off-by-one), 부동소수점 비교, 재현 조건을 의심합니다. 재현 조건을 기록하고 로그로 상태를 확인합니다.'}]},
 {id:'optimization',name:'최적화',desc:'메모리·렌더링',stages:[
  {title:'메모리와 GC',theory:'힙 할당이 쌓이면 GC 스파이크로 프레임이 끊깁니다. 오브젝트 풀링, 캐싱, 문자열 연결·LINQ 회피로 할당을 줄입니다.'},
  {title:'측정과 렌더링',theory:'최적화는 Profiler로 병목을 측정하는 데서 시작합니다. Draw Call은 머티리얼 공유와 배칭으로 줄이고, 모바일 메모리는 텍스처 압축으로 줄입니다.'}]}
];
