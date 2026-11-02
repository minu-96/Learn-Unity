/* ===== 코딩 첫걸음 (입문: 개발을 처음 하는 사람용) =====
   유니티 없이 C# 코드만으로 풀립니다. 메서드를 완성하면 여러 입력으로 실행해서 채점합니다. */
Q({id:'e1',cat:'start',stage:1,level:1,title:'캐릭터 정보를 변수로 적어 보자',
 story:'게임을 만들려면 캐릭터의 이름, 레벨, 속도 같은 정보를 컴퓨터가 기억하게 해야 해요. 이렇게 값을 담아 두는 상자를 변수라고 불러요. 상자마다 담을 수 있는 값의 종류(자료형)가 정해져 있어요. 아래 네 가지 정보를 알맞은 자료형의 변수로 만들어 주세요.',
 goals:['이름: string 형식의 heroName, 값은 "용사"','레벨: int 형식의 level, 값은 1','이동 속도: float 형식의 speed, 값은 3.5','살아 있는지: bool 형식의 isAlive, 값은 true'],
 limits:['글자(string)는 큰따옴표 "로 감싸요','float 값은 3.5f처럼 숫자 뒤에 f를 붙여요'],
 api:'int, float, string, bool',
 starter:C`
public class Hero
{
    // 여기에 변수 네 개를 만들어 보세요.
    // 형식 이름 변수이름 = 값;
}`,
 solution:C`
public class Hero
{
    string heroName = "용사";
    int level = 1;
    float speed = 3.5f;
    bool isAlive = true;
}`,
 alts:[C`
public class Hero
{
    public string heroName = "용사";
    public int level = 1;
    public float speed = 3.5f;
    public bool isAlive = true;
}`],
 rules:[
  fx('이름(string)',(c,code)=>/\bstring\s+heroName\s*=\s*"용사"\s*;/.test(code),'heroName을 string으로 만들고 "용사"를 넣었어요.','string heroName = "용사"; 처럼 쓰세요. 글자는 큰따옴표로 감싸고 줄 끝에 세미콜론 ; 을 붙여요.'),
  has('레벨(int)',/\bint\s+level\s*=\s*1\s*;/,'level을 int로 만들고 1을 넣었어요.','int level = 1; 처럼 쓰세요. 소수점이 없는 정수는 int예요.'),
  has('속도(float)',/\bfloat\s+speed\s*=\s*3\.5f\s*;/,'speed를 float로 만들고 3.5f를 넣었어요.','float speed = 3.5f; 처럼 쓰세요. float 값은 숫자 뒤에 f를 붙여야 해요.'),
  has('생존(bool)',/\bbool\s+isAlive\s*=\s*true\s*;/,'isAlive를 bool로 만들고 true를 넣었어요.','bool isAlive = true; 처럼 쓰세요. bool은 true 또는 false만 담아요.')
 ],
 bads:[{code:C`
public class Hero
{
    string heroName = "용사";
    int level = 1;
    float speed = 3.5;
    bool isAlive = true;
}`,hit:'속도(float)'}],
 hints:['변수는 "형식 이름 = 값;" 순서로 만들어요. 예: int hp = 100;','소수는 float, 정수는 int, 글자는 string, 참/거짓은 bool이에요.','float 변수에 넣는 소수에는 f를 붙여요: 3.5f'],
 why:'변수는 형식에 맞는 값만 담을 수 있어요. 정수는 int, 소수는 float, 글자는 string, 참/거짓은 bool을 써요. 유니티에서 체력, 속도, 이름, 생존 여부를 다룰 때 가장 먼저 만드는 것이 이런 변수예요.',
 concepts:[['변수','값을 담아 두는 이름 붙은 상자. 형식 이름 = 값; 으로 만든다.'],['자료형 int/float/string/bool','정수, 소수, 글자, 참·거짓. 담을 수 있는 값의 종류가 정해져 있다.'],['float의 f','C#에서 소수는 기본이 double이라 float에는 3.5f처럼 f를 붙인다.']]});

Q({id:'e2',cat:'start',stage:1,level:2,title:'몬스터를 잡고 받는 경험치 계산',
 story:'몬스터를 한 마리 잡을 때마다 경험치를 받고, 스테이지를 깨면 보너스 경험치를 한 번 더 받아요. 잡은 마리 수, 한 마리당 경험치, 보너스를 받아서 전체 경험치를 계산해 주세요. 값이 바뀔 때마다 같은 식을 쓰니까 매개변수로 받은 값을 계산해서 돌려주면 돼요.',
 goals:['TotalExp(monsters, expEach, bonus)는 monsters × expEach + bonus 를 돌려준다','마리 수가 0이면 보너스만 돌려준다'],
 limits:['곱셈은 * 덧셈은 + 를 써요','결과를 돌려줄 때는 return 을 써요'],
 api:'+, *, return',
 starter:C`
int TotalExp(int monsters, int expEach, int bonus)
{
    // 전체 경험치를 계산해서 돌려주세요.
    return 0;
}`,
 solution:C`
int TotalExp(int monsters, int expEach, int bonus)
{
    int total = monsters * expEach;
    total = total + bonus;
    return total;
}`,
 alts:[C`
int TotalExp(int monsters, int expEach, int bonus)
{
    return monsters * expEach + bonus;
}`],
 rules:[],
 test:(api,ok)=>{
  const t=(a,b,c)=>api.call('TotalExp',a,b,c);
  ok('3마리 × 10 + 5',t(3,10,5)===35,'3마리를 잡고 보너스 5를 받으면 35예요.',`TotalExp(3, 10, 5)가 ${t(3,10,5)} 입니다. 3 × 10 + 5 = 35여야 해요.`);
  ok('0마리',t(0,10,5)===5,'한 마리도 안 잡으면 보너스만 받아요.',`TotalExp(0, 10, 5)가 ${t(0,10,5)} 입니다. 5여야 해요.`);
  ok('보너스 없음',t(7,4,0)===28,'보너스가 0이어도 잘 계산돼요.',`TotalExp(7, 4, 0)이 ${t(7,4,0)} 입니다. 28이어야 해요.`);
 },
 hints:['곱셈이 먼저, 덧셈이 나중이에요. monsters * expEach 를 먼저 만들어 보세요.','계산한 값을 변수에 담아 두고 마지막에 return 으로 돌려줄 수 있어요.','한 줄로 return monsters * expEach + bonus; 라고 써도 돼요.'],
 why:'메서드는 매개변수로 값을 받아 계산한 뒤 return으로 결과를 돌려줘요. 값만 바꿔서 같은 식을 여러 번 쓸 수 있다는 게 메서드의 핵심이에요.',
 concepts:[['매개변수','메서드가 밖에서 받는 값. 괄호 안에 형식과 이름으로 적는다.'],['return','계산한 값을 메서드를 부른 곳으로 돌려주고 메서드를 끝낸다.'],['연산자 순서','곱셈과 나눗셈이 덧셈과 뺄셈보다 먼저 계산된다.']]});

Q({id:'e3',cat:'start',stage:1,level:3,title:'체력 바가 자꾸 0%로 나와요',
 story:'체력 바에 현재 체력이 몇 퍼센트인지 보여 주려고 hp / maxHp * 100 을 썼는데, 체력이 50/100이어도 0%가 나와요. int끼리 나누면 소수점 아래가 모두 버려져서 50 / 100 이 0이 되기 때문이에요. 소수점까지 정확히 나오도록 고쳐 주세요.',
 goals:['HpPercent(hp, maxHp)는 현재 체력이 최대 체력의 몇 퍼센트인지 float로 돌려준다','hp가 50, maxHp가 100이면 50, hp가 1, maxHp가 3이면 약 33.33이다'],
 limits:['(float)hp 처럼 앞에 (float)를 붙이면 float로 바꿔서 계산해요'],
 api:'(float) 형변환, 나눗셈',
 starter:C`
float HpPercent(int hp, int maxHp)
{
    return hp / maxHp * 100;
}`,
 solution:C`
float HpPercent(int hp, int maxHp)
{
    return (float)hp / maxHp * 100f;
}`,
 alts:[C`
float HpPercent(int hp, int maxHp)
{
    return hp * 100f / maxHp;
}`],
 rules:[],
 test:(api,ok)=>{
  const t=(a,b)=>api.call('HpPercent',a,b);
  const near=(a,b)=>Math.abs(a-b)<0.01;
  ok('절반',near(t(50,100),50),'50/100은 50%예요.',`HpPercent(50, 100)이 ${t(50,100)} 입니다. 50이어야 해요. int끼리 나누면 소수점 아래가 사라져요.`);
  ok('3분의 1',near(t(1,3),33.33),'1/3은 약 33.33%예요.',`HpPercent(1, 3)이 ${t(1,3)} 입니다. 약 33.33이어야 해요.`);
  ok('빈 체력',near(t(0,100),0),'체력이 0이면 0%예요.',`HpPercent(0, 100)이 ${t(0,100)} 입니다. 0이어야 해요.`);
  ok('최대 체력 200',near(t(25,200),12.5),'25/200은 12.5%예요.',`HpPercent(25, 200)이 ${t(25,200)} 입니다. 12.5여야 해요.`);
 },
 hints:['int 나누기 int는 결과도 int라서 소수점 아래가 버려져요. 50 / 100 은 0이에요.','둘 중 하나를 float로 바꾸면 소수점까지 계산돼요: (float)hp / maxHp','100을 곱하는 순서도 중요해요. 먼저 곱하고 나눠도 되고, 나눗셈 전에 float로 바꿔도 돼요.'],
 why:'C#에서 int끼리 나누면 몫만 남고 소수점 아래는 버려져요. 비율이나 퍼센트를 구할 때는 한쪽을 float로 바꿔 나눠야 해요. 유니티에서 체력 바(fillAmount)를 채울 때 자주 만나는 상황이에요.',
 concepts:[['정수 나눗셈','int끼리 나누면 소수점 아래가 버려진다. 50 / 100 은 0이다.'],['형변환 (float)','값을 다른 자료형으로 바꿔서 계산한다. (float)hp 는 hp를 소수로 바꾼 값이다.']]});

Q({id:'e4',cat:'start',stage:2,level:1,title:'체력이 0이면 죽음, 아니면 생존',
 story:'캐릭터의 체력을 받아서 상태를 글자로 알려 주는 메서드를 만들어요. 체력이 0 이하이면 "죽음", 그렇지 않으면 "생존"이에요. 조건에 따라 다른 일을 하게 만드는 문장이 if예요.',
 goals:['State(hp)는 hp가 0 이하이면 "죽음"을 돌려준다','그렇지 않으면 "생존"을 돌려준다'],
 limits:['if (조건) { ... } 문을 사용해요','"이하"는 <= 로 써요'],
 api:'if, <=, return',
 starter:C`
string State(int hp)
{
    // if 문으로 상태를 나눠 보세요.
    return "";
}`,
 solution:C`
string State(int hp)
{
    if (hp <= 0)
    {
        return "죽음";
    }
    return "생존";
}`,
 alts:[C`
string State(int hp)
{
    if (hp <= 0)
    {
        return "죽음";
    }
    else
    {
        return "생존";
    }
}`],
 rules:[has('if문 사용',/\bif\s*\(/,'if문으로 나눴어요.','이번에는 if (조건) { ... } 문을 써서 나눠 보세요.')],
 test:(api,ok)=>{
  const s=h=>api.call('State',h);
  ok('체력 0',s(0)==='죽음','체력 0은 "죽음"이에요.',`State(0)이 "${s(0)}" 입니다. "죽음"이어야 해요. 0 이하이니까 <= 를 쓰세요.`);
  ok('체력 음수',s(-5)==='죽음','체력이 음수여도 "죽음"이에요.',`State(-5)가 "${s(-5)}" 입니다. "죽음"이어야 해요.`);
  ok('체력 1',s(1)==='생존','체력 1은 "생존"이에요.',`State(1)이 "${s(1)}" 입니다. "생존"이어야 해요.`);
  ok('체력 100',s(100)==='생존','체력 100은 "생존"이에요.',`State(100)이 "${s(100)}" 입니다. "생존"이어야 해요.`);
 },
 hints:['if (hp <= 0) { return "죽음"; } 처럼 조건이 참일 때 할 일을 중괄호 안에 써요.','return을 만나면 메서드가 거기서 끝나요. if 아래에 "생존"을 돌려주면 나머지 경우를 처리할 수 있어요.','"이하"는 <=, "미만"은 < 예요.'],
 why:'if문은 조건이 참일 때만 중괄호 안을 실행해요. 비교 연산자(<=, >=, ==)와 함께 써서 체력 0 이하 같은 상황을 가려내요. 경계값(정확히 0일 때)을 포함하는지 <= 와 < 의 차이로 정해져요.',
 concepts:[['if문','조건이 참일 때만 중괄호 안의 코드를 실행한다.'],['비교 연산자','같다 ==, 작다 <, 작거나 같다 <=, 크다 >, 크거나 같다 >= 로 값을 비교하면 참/거짓이 나온다.']]});

Q({id:'e5',cat:'start',stage:2,level:2,title:'점수로 등급 매기기',
 story:'시험 점수를 받아 등급을 알려 주는 메서드를 만들어요. 90점 이상은 "A", 80점 이상은 "B", 70점 이상은 "C", 그보다 낮으면 "D"예요. 조건이 여러 개일 때는 else if로 이어 붙이거나, 큰 점수부터 차례대로 확인하면 돼요.',
 goals:['Grade(score)는 90 이상이면 "A", 80 이상이면 "B", 70 이상이면 "C"를 돌려준다','70 미만이면 "D"를 돌려준다','경계 점수(90, 80, 70)는 높은 등급이다'],
 limits:['"이상"은 >= 예요','큰 점수 조건부터 확인해요'],
 api:'if, else if, else, >=',
 starter:C`
string Grade(int score)
{
    // 점수에 맞는 등급을 돌려주세요.
    return "D";
}`,
 solution:C`
string Grade(int score)
{
    if (score >= 90)
    {
        return "A";
    }
    else if (score >= 80)
    {
        return "B";
    }
    else if (score >= 70)
    {
        return "C";
    }
    else
    {
        return "D";
    }
}`,
 alts:[C`
string Grade(int score)
{
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    return "D";
}`],
 rules:[has('if문 사용',/\bif\s*\(/,'if문으로 등급을 나눴어요.','if (score >= 90) 같은 조건문을 써 보세요.')],
 test:(api,ok)=>{
  const g=s=>api.call('Grade',s);
  [[100,'A'],[90,'A'],[89,'B'],[80,'B'],[79,'C'],[70,'C'],[69,'D'],[0,'D']].forEach(([s,e])=>
   ok(s+'점',g(s)===e,`${s}점은 ${e}예요.`,`Grade(${s})가 "${g(s)}" 입니다. "${e}"여야 해요.${s%10===0||s%10===9?' 경계 점수는 >= 와 > 의 차이를 확인하세요.':''}`));
 },
 hints:['큰 점수부터 확인해요. 90 이상이면 A, 아니면 80 이상이면 B, 이런 식이에요.','else if 로 조건을 이어 붙이면 앞 조건이 거짓일 때만 다음 조건을 확인해요.','"이상"은 >= 예요. > 는 그 값을 포함하지 않아서 90점이 A가 되지 않아요.'],
 why:'조건이 여러 개일 때는 else if로 이어서 위에서부터 차례로 확인해요. 앞 조건이 참이면 아래는 확인하지 않고, 위에서 큰 값부터 걸러내면 범위 조건을 따로 쓰지 않아도 돼요.',
 concepts:[['else if / else','앞의 if가 거짓일 때 다음 조건을 확인하고, 모두 거짓이면 else가 실행된다.'],['경계값','딱 90점처럼 기준에 걸치는 값. >= 와 > 중 무엇을 쓰는지에 따라 결과가 달라진다.']]});

Q({id:'e6',cat:'start',stage:2,level:3,title:'잠긴 문은 언제 열릴까',
 story:'게임 속 문이 있어요. 열쇠를 가지고 있고 레벨이 5 이상이면 열려요. 그리고 관리자는 열쇠도 레벨도 없이 언제나 열 수 있어요. 이런 조건을 합칠 때는 그리고(&&), 또는(||)을 써요. 문을 열 수 있는지 알려 주는 메서드를 만들어 주세요.',
 goals:['CanOpen(hasKey, level, isAdmin)은 (열쇠가 있고 레벨이 5 이상)이면 true','관리자(isAdmin)이면 다른 조건과 관계없이 true','그 외에는 false'],
 limits:['&& 는 "그리고"(둘 다 참), || 는 "또는"(하나라도 참)이에요'],
 api:'&&, ||, bool',
 starter:C`
bool CanOpen(bool hasKey, int level, bool isAdmin)
{
    // 열 수 있으면 true, 없으면 false 를 돌려주세요.
    return false;
}`,
 solution:C`
bool CanOpen(bool hasKey, int level, bool isAdmin)
{
    if (isAdmin)
    {
        return true;
    }
    return hasKey && level >= 5;
}`,
 alts:[C`
bool CanOpen(bool hasKey, int level, bool isAdmin)
{
    return (hasKey && level >= 5) || isAdmin;
}`],
 rules:[],
 test:(api,ok)=>{
  const c=(k,l,a)=>api.call('CanOpen',k,l,a);
  ok('열쇠 + 레벨 5',c(true,5,false)===true,'열쇠가 있고 레벨 5이면 열려요.','열쇠가 있고 레벨이 5이면 true여야 해요. 레벨은 >= 5 로 비교하세요.');
  ok('열쇠 + 레벨 4',c(true,4,false)===false,'레벨이 4이면 열쇠가 있어도 안 열려요.','열쇠가 있어도 레벨이 5 미만이면 false여야 해요.');
  ok('열쇠 없음 + 레벨 9',c(false,9,false)===false,'열쇠가 없으면 레벨이 높아도 안 열려요.','레벨이 높아도 열쇠가 없으면 false여야 해요. 열쇠와 레벨은 둘 다 필요해요(&&).');
  ok('관리자',c(false,1,true)===true,'관리자는 언제나 열 수 있어요.','관리자(isAdmin)이면 열쇠와 레벨이 없어도 true여야 해요.');
  ok('관리자 + 열쇠',c(true,10,true)===true,'관리자이고 조건도 맞으면 열려요.','관리자이면서 열쇠와 레벨도 맞는 경우 true여야 해요.');
 },
 hints:['열쇠와 레벨은 둘 다 맞아야 해요. 그래서 hasKey && level >= 5 예요.','관리자는 위 조건과 "또는"으로 이어져요: (hasKey && level >= 5) || isAdmin','먼저 if (isAdmin) { return true; } 로 관리자를 처리하고 나머지를 && 로 계산해도 돼요.'],
 why:'&&는 양쪽이 모두 참일 때만 참이고, ||는 한쪽만 참이어도 참이에요. 괄호로 묶어 순서를 분명히 하면 복잡한 조건도 읽기 쉬워요. 문, 상점, 스킬 사용 조건처럼 여러 상태를 함께 따지는 곳에서 늘 쓰여요.',
 concepts:[['&& (그리고)','양쪽 조건이 모두 참일 때만 참이다.'],['|| (또는)','양쪽 중 하나라도 참이면 참이다.'],['괄호로 묶기','&&와 ||가 섞일 때는 괄호로 묶어 계산 순서를 분명히 한다.']]});

Q({id:'e7',cat:'start',stage:3,level:1,title:'응원 문구를 다섯 번 외치기',
 story:'경기 시작 전에 "파이팅!"을 다섯 번 외치게 하고 싶어요. 같은 줄을 다섯 번 복사해서 붙여넣을 수도 있지만, 100번이면 어떨까요? 같은 일을 정해진 횟수만큼 반복할 때는 for 반복문을 써요. Debug.Log는 콘솔 창에 글자를 출력하는 명령이에요.',
 goals:['Cheer()를 부르면 "파이팅!"이 정확히 5번 출력된다','for 반복문을 사용한다'],
 limits:['Debug.Log("파이팅!") 줄을 복사해서 여러 번 쓰지 않고 반복문 안에 한 번만 써요'],
 api:'for, Debug.Log',
 starter:C`
void Cheer()
{
    // 반복문으로 "파이팅!"을 5번 출력하세요.
    Debug.Log("파이팅!");
}`,
 solution:C`
void Cheer()
{
    for (int i = 0; i < 5; i++)
    {
        Debug.Log("파이팅!");
    }
}`,
 alts:[C`
void Cheer()
{
    int count = 0;
    while (count < 5)
    {
        Debug.Log("파이팅!");
        count++;
    }
}`],
 rules:[has('반복문 사용',/\b(?:for|while)\s*\(/,'반복문으로 되풀이했어요.','for (int i = 0; i < 5; i++) { ... } 처럼 반복문을 써 보세요.')],
 test:(api,ok)=>{
  api.env.logs.length=0;api.call('Cheer');
  const L=api.env.logs.slice();
  ok('5번 출력',L.length===5,'"파이팅!"이 5번 출력됐어요.',`"파이팅!"이 ${L.length}번 출력됐어요. 정확히 5번이어야 해요.`);
  ok('문구',L.length>0&&L.every(x=>x==='파이팅!'),'출력한 문구가 모두 "파이팅!"이에요.','출력 문구가 "파이팅!"과 달라요. 글자를 확인하세요.');
 },
 hints:['for (int i = 0; i < 5; i++) 는 i가 0, 1, 2, 3, 4일 때 중괄호 안을 실행해요. 모두 5번이에요.','반복할 코드는 for의 중괄호 { } 안에 넣어요.','i < 5 를 i <= 5 로 쓰면 6번이 되니 주의하세요.'],
 why:'for는 "시작값; 계속할 조건; 한 번 끝날 때마다 할 일"로 반복 횟수를 정해요. 0부터 시작해서 < 횟수로 끝내는 모양은 배열과 리스트를 다룰 때도 그대로 써요.',
 concepts:[['for 반복문','for (시작; 조건; 증가) { ... } 로 정해진 횟수만큼 중괄호 안을 되풀이한다.'],['Debug.Log','유니티 콘솔 창에 글자를 출력한다. 값이 맞는지 확인할 때 가장 먼저 쓰는 도구다.']]});

Q({id:'e8',cat:'start',stage:3,level:2,title:'1부터 n까지 더하기',
 story:'레벨 n까지 올리는 데 필요한 경험치가 레벨 1이면 1, 레벨 2이면 2, 레벨 3이면 3처럼 레벨과 같다고 해요. 그럼 n레벨까지 필요한 경험치의 총합은 1 + 2 + 3 + ... + n 이에요. 반복문으로 이 합을 구해 주세요.',
 goals:['SumTo(n)은 1부터 n까지 모두 더한 값을 돌려준다','n이 0이면 0이다','반복문을 사용한다'],
 limits:['합계를 담을 변수를 반복문 바깥에서 먼저 만들어요'],
 api:'for, +=',
 starter:C`
int SumTo(int n)
{
    // 합계를 담을 변수를 만들고, 반복문 안에서 더해 보세요.
    return 0;
}`,
 solution:C`
int SumTo(int n)
{
    int sum = 0;
    for (int i = 1; i <= n; i++)
    {
        sum += i;
    }
    return sum;
}`,
 alts:[C`
int SumTo(int n)
{
    int sum = 0;
    int i = 1;
    while (i <= n)
    {
        sum = sum + i;
        i++;
    }
    return sum;
}`],
 rules:[has('반복문 사용',/\b(?:for|while)\s*\(/,'반복문으로 더했어요.','공식으로 바로 계산하지 말고 반복문으로 하나씩 더해 보세요.')],
 test:(api,ok)=>{
  const s=n=>api.call('SumTo',n);
  ok('10까지',s(10)===55,'1부터 10까지의 합은 55예요.',`SumTo(10)이 ${s(10)} 입니다. 55여야 해요. i를 1부터 n까지(n 포함) 더하세요.`);
  ok('1',s(1)===1,'1까지의 합은 1이에요.',`SumTo(1)이 ${s(1)} 입니다. 1이어야 해요.`);
  ok('0',s(0)===0,'0이면 아무것도 더하지 않아 0이에요.',`SumTo(0)이 ${s(0)} 입니다. 0이어야 해요.`);
  ok('100',s(100)===5050,'1부터 100까지의 합은 5050이에요.',`SumTo(100)이 ${s(100)} 입니다. 5050이어야 해요.`);
 },
 hints:['반복문 바깥에 int sum = 0; 을 만들어 두고, 반복할 때마다 sum += i; 로 더해요.','i를 1에서 시작해 i <= n 일 때까지 돌리면 n도 포함돼요.','마지막에 return sum; 을 잊지 마세요. 반복문이 끝난 뒤에 써야 해요.'],
 why:'합계, 개수, 최댓값처럼 여러 값을 모아 하나의 결과를 만들 때는 "반복문 밖에 변수를 만들고, 안에서 갱신하고, 끝나면 사용한다"는 틀을 써요. 이 틀은 점수 계산, 인벤토리 합산 등 게임 로직 곳곳에 나와요.',
 concepts:[['누적 변수','반복문 바깥에서 0으로 시작해 반복 안에서 값을 더해 가는 변수.'],['+=','sum += i; 는 sum = sum + i; 와 같다.']]});

Q({id:'e9',cat:'start',stage:3,level:3,title:'짝수 아이템만 세기',
 story:'가방 안 아이템 번호가 배열로 들어 있어요. 짝수 번호가 붙은 아이템이 몇 개인지 세려고 해요. 배열의 값을 하나씩 꺼내 보려면 foreach를 쓰고, 짝수인지는 2로 나눈 나머지가 0인지로 알 수 있어요. 나머지는 % 연산자로 구해요.',
 goals:['CountEven(nums)는 배열에서 짝수의 개수를 돌려준다','빈 배열이면 0이다','반복문과 if를 함께 사용한다'],
 limits:['짝수는 x % 2 == 0 으로 확인해요'],
 api:'foreach, %, if',
 starter:C`
int CountEven(int[] nums)
{
    // 짝수의 개수를 세어서 돌려주세요.
    return 0;
}`,
 solution:C`
int CountEven(int[] nums)
{
    int count = 0;
    foreach (int x in nums)
    {
        if (x % 2 == 0)
        {
            count++;
        }
    }
    return count;
}`,
 alts:[C`
int CountEven(int[] nums)
{
    int count = 0;
    for (int i = 0; i < nums.Length; i++)
    {
        if (nums[i] % 2 == 0)
        {
            count = count + 1;
        }
    }
    return count;
}`],
 rules:[has('반복문 사용',/\b(?:for|foreach|while)\s*\(/,'반복문으로 하나씩 확인했어요.','배열의 값을 하나씩 확인하려면 foreach (int x in nums) 같은 반복문을 써요.'),has('% 사용',/%/,'나머지 연산자로 짝수를 가렸어요.','짝수인지는 x % 2 == 0 으로 확인해요.')],
 test:(api,ok)=>{
  const c=a=>api.call('CountEven',a);
  ok('섞인 배열',c([1,2,3,4,6])===3,'[1, 2, 3, 4, 6]에는 짝수가 3개예요.',`CountEven([1, 2, 3, 4, 6])이 ${c([1,2,3,4,6])} 입니다. 3이어야 해요.`);
  ok('홀수만',c([1,3,5])===0,'홀수만 있으면 0개예요.',`CountEven([1, 3, 5])가 ${c([1,3,5])} 입니다. 0이어야 해요.`);
  ok('짝수만',c([2,4])===2,'짝수만 있으면 전부 세요.',`CountEven([2, 4])가 ${c([2,4])} 입니다. 2여야 해요.`);
  ok('0 포함',c([0,10,7])===2,'0도 짝수예요.',`CountEven([0, 10, 7])이 ${c([0,10,7])} 입니다. 2여야 해요. 0 % 2 는 0이라 짝수예요.`);
  ok('빈 배열',c([])===0,'빈 배열은 0이에요.',`CountEven([])가 ${c([])} 입니다. 0이어야 해요.`);
 },
 hints:['개수를 담을 변수를 반복문 바깥에 만들고, 짝수를 만날 때마다 1씩 늘려요.','foreach (int x in nums) 는 배열의 값을 하나씩 x에 꺼내 줘요.','7 % 2 는 1, 8 % 2 는 0 이에요. 나머지가 0이면 짝수예요.'],
 why:'반복문 안에서 if로 조건에 맞는 것만 골라 세는 패턴은 가장 자주 쓰는 조합이에요. 살아 있는 적의 수, 일정 점수 이상인 플레이어 수처럼 배열이나 리스트에서 조건을 만족하는 것을 셀 때 그대로 쓰여요.',
 concepts:[['foreach','배열이나 리스트의 값을 처음부터 끝까지 하나씩 꺼내 반복한다.'],['나머지 연산자 %','7 % 2 는 1처럼 나눈 뒤 남는 값. 짝수는 2로 나눈 나머지가 0이다.'],['배열 int[]','같은 종류의 값을 여러 개 담는 상자. Length로 개수를 안다.']]});

Q({id:'e10',cat:'start',stage:4,level:1,title:'나만의 메서드 만들고 부르기',
 story:'메서드는 이름을 붙인 명령 묶음이에요. 한 번 만들어 두면 이름만 부르면 몇 번이든 쓸 수 있어요. 게임이 시작되면(Start) 인사를 하게 하고 싶어요. "안녕하세요!"를 출력하는 Greet 메서드를 직접 만들고, Start에서 불러 주세요.',
 goals:['"안녕하세요!"를 출력하는 Greet() 메서드를 만든다 (돌려줄 값이 없으니 void)','Start()에서 Greet()를 호출한다','Start()를 실행하면 "안녕하세요!"가 한 번 출력된다'],
 limits:['Debug.Log는 Greet 안에만 써요','메서드를 부를 때는 이름 뒤에 괄호 Greet(); 를 붙여요'],
 api:'void, 메서드 정의와 호출',
 starter:C`
void Start()
{
    // 여기서 Greet()를 불러 보세요.
}

// 여기에 Greet 메서드를 만들어 보세요.
`,
 solution:C`
void Start()
{
    Greet();
}

void Greet()
{
    Debug.Log("안녕하세요!");
}`,
 rules:[
  has('Greet 만들기',/\bvoid\s+Greet\s*\(\s*\)\s*\{/,'void Greet() 메서드를 만들었어요.','void Greet() { ... } 형태로 메서드를 만들어 보세요. 돌려줄 값이 없으면 앞에 void를 써요.'),
  inFn('Greet 안에서 출력','Greet',/\bDebug\.Log\s*\(\s*""\s*\)\s*;/,'Greet 안에서 "안녕하세요!"를 출력해요.','Greet 메서드 안에 Debug.Log("안녕하세요!"); 를 써 보세요.'),
  inFn('Start에서 부르기','Start',/\bGreet\s*\(\s*\)\s*;/,'Start에서 Greet()를 불렀어요.','Start 안에서 Greet(); 를 써서 메서드를 불러 보세요.')
 ],
 test:(api,ok)=>{
  api.env.logs.length=0;api.call('Start');
  const L=api.env.logs.slice();
  ok('한 번 출력',L.length===1&&L[0]==='안녕하세요!','Start를 실행하면 "안녕하세요!"가 한 번 출력돼요.',`Start를 실행했더니 출력이 ${JSON.stringify(L)} 입니다. "안녕하세요!"가 한 번만 나와야 해요.`);
 },
 hints:['메서드를 만드는 모양: void 이름() { 할 일 }','메서드를 부르는 모양: 이름(); 예를 들어 Greet();','만든 메서드는 Start 안에서 불러야 게임이 시작될 때 실행돼요.'],
 why:'메서드를 만드는 것(정의)과 쓰는 것(호출)은 별개예요. 정의만 해 두면 아무 일도 일어나지 않고, 누군가 이름을 불러야 실행돼요. Start, Update도 유니티가 대신 불러 주는 메서드예요.',
 concepts:[['메서드 정의','void 이름() { ... } 처럼 코드 묶음에 이름을 붙이는 것.'],['메서드 호출','이름(); 으로 만들어 둔 메서드를 실행하는 것.'],['void','돌려줄 값이 없는 메서드의 반환 형식.']]});

Q({id:'e11',cat:'start',stage:4,level:2,title:'공격력에서 방어력을 뺀 데미지',
 story:'공격력과 방어력을 받아서 적에게 들어가는 데미지를 계산해 보세요. 데미지는 공격력에서 방어력을 뺀 값이에요. 그런데 방어력이 공격력보다 높으면 음수가 되어 체력이 오히려 회복되어 버려요. 이럴 때는 데미지가 0이 되게 해 주세요.',
 goals:['Damage(attack, defense)는 attack - defense 를 돌려준다','결과가 음수이면 0을 돌려준다'],
 limits:['메서드가 값을 돌려줄 때는 반환 형식(int)을 써요'],
 api:'매개변수, return, if',
 starter:C`
int Damage(int attack, int defense)
{
    // 공격력에서 방어력을 빼서 돌려주세요. 음수는 0으로 만들어 주세요.
    return attack;
}`,
 solution:C`
int Damage(int attack, int defense)
{
    int result = attack - defense;
    if (result < 0)
    {
        result = 0;
    }
    return result;
}`,
 alts:[C`
int Damage(int attack, int defense)
{
    if (attack <= defense)
    {
        return 0;
    }
    return attack - defense;
}`],
 rules:[],
 test:(api,ok)=>{
  const d=(a,b)=>api.call('Damage',a,b);
  ok('보통 데미지',d(10,3)===7,'공격력 10, 방어력 3이면 7이에요.',`Damage(10, 3)이 ${d(10,3)} 입니다. 7이어야 해요.`);
  ok('방어력이 더 높음',d(3,10)===0,'방어력이 더 높으면 0이에요.',`Damage(3, 10)이 ${d(3,10)} 입니다. 0이어야 해요. 음수가 되면 0으로 바꿔 주세요.`);
  ok('같을 때',d(5,5)===0,'같으면 0이에요.',`Damage(5, 5)가 ${d(5,5)} 입니다. 0이어야 해요.`);
 },
 hints:['먼저 attack - defense 를 변수에 담아 두면 확인하기 편해요.','그 값이 0보다 작으면 0으로 바꾸고 돌려줘요.','if (result < 0) { result = 0; } 처럼 쓸 수 있어요.'],
 why:'메서드는 받은 값(매개변수)으로 계산하고 결과를 return으로 돌려줘요. 값이 범위를 벗어나지 않게 막는 처리(음수를 0으로)는 체력, 골드, 수량 계산에서 자주 필요해요.',
 concepts:[['반환 형식','메서드 이름 앞의 int, float, void 등. 돌려주는 값의 종류를 정한다.'],['범위 제한','계산 결과가 정해진 범위를 넘지 않게 if로 바로잡는 처리.']]});

Q({id:'e12',cat:'start',stage:4,level:3,title:'작은 메서드를 엮어 치명타 데미지 만들기',
 story:'기본 데미지 계산은 이미 BaseDamage 메서드로 만들어져 있어요. 이제 치명타를 넣으려고 해요. 치명타가 터지면 기본 데미지의 2배예요. 데미지 계산을 처음부터 다시 쓰지 말고, 이미 있는 BaseDamage를 불러서 쓰는 FinalDamage 메서드를 만들어 주세요.',
 goals:['FinalDamage(attack, defense, critical)는 BaseDamage를 불러 기본 데미지를 구한다','critical이 true이면 기본 데미지의 2배, false이면 그대로 돌려준다'],
 limits:['BaseDamage는 고치지 않고 FinalDamage 안에서 호출해요'],
 api:'메서드 호출, bool 매개변수',
 starter:C`
int BaseDamage(int attack, int defense)
{
    int d = attack - defense;
    if (d < 0)
    {
        d = 0;
    }
    return d;
}

int FinalDamage(int attack, int defense, bool critical)
{
    // BaseDamage를 불러서 치명타면 2배로 만들어 주세요.
    return 0;
}`,
 solution:C`
int BaseDamage(int attack, int defense)
{
    int d = attack - defense;
    if (d < 0)
    {
        d = 0;
    }
    return d;
}

int FinalDamage(int attack, int defense, bool critical)
{
    int d = BaseDamage(attack, defense);
    if (critical)
    {
        d = d * 2;
    }
    return d;
}`,
 rules:[inFn('BaseDamage 호출','FinalDamage',/\bBaseDamage\s*\(/,'FinalDamage 안에서 BaseDamage를 불렀어요.','FinalDamage 안에서 BaseDamage(attack, defense) 를 불러 기본 데미지를 구해 보세요.')],
 test:(api,ok)=>{
  const f=(a,b,c)=>api.call('FinalDamage',a,b,c);
  ok('치명타 아님',f(10,4,false)===6,'치명타가 아니면 기본 데미지 6이에요.',`FinalDamage(10, 4, false)가 ${f(10,4,false)} 입니다. 6이어야 해요.`);
  ok('치명타',f(10,4,true)===12,'치명타이면 2배인 12예요.',`FinalDamage(10, 4, true)가 ${f(10,4,true)} 입니다. 12여야 해요.`);
  ok('방어력이 높아도 0',f(2,9,true)===0,'기본 데미지가 0이면 치명타여도 0이에요.',`FinalDamage(2, 9, true)가 ${f(2,9,true)} 입니다. 0이어야 해요.`);
 },
 hints:['BaseDamage(attack, defense) 를 불러서 나온 값을 변수에 담아 두세요.','if (critical) { ... } 로 치명타일 때만 2배로 만들 수 있어요. critical은 이미 true/false 값이라 == true 는 필요 없어요.','마지막에 변수를 return 으로 돌려주세요.'],
 why:'이미 만든 메서드를 다른 메서드에서 불러 쓰면 같은 계산을 다시 쓰지 않아도 돼요. 기본 계산이 바뀌어도 한 곳만 고치면 되고요. 큰 기능을 작은 메서드로 쪼개서 엮는 것이 코드를 읽기 쉽게 만드는 기본이에요.',
 concepts:[['메서드 조합','작은 메서드를 만들어 두고 다른 메서드 안에서 불러 쓰는 것.'],['bool 매개변수','true/false를 받아 동작을 바꾼다. if (critical) 처럼 그대로 조건에 쓸 수 있다.']]});

Q({id:'e13',cat:'start',stage:5,level:1,title:'유니티에서 첫 인사',
 story:'이제 유니티 스크립트를 만들어 봐요. 유니티 스크립트는 MonoBehaviour를 이어받은 클래스예요. 그 안의 Start 메서드는 게임이 시작될 때 유니티가 딱 한 번 불러 줘요. Start에서 콘솔에 "Hello Unity!"를 출력해 주세요.',
 goals:['Start에서 Debug.Log("Hello Unity!")를 호출한다','게임을 시작하면 한 번만 출력된다'],
 limits:['글자는 큰따옴표로 감싸요','Update가 아니라 Start에 써요 (Update는 매 프레임 실행돼요)'],
 api:'Start, Debug.Log',
 starter:C`
using UnityEngine;

public class Hello : MonoBehaviour
{
    void Start()
    {
        // 여기에 콘솔 출력 코드를 써 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Hello : MonoBehaviour
{
    void Start()
    {
        Debug.Log("Hello Unity!");
    }
}`,
 rules:[inFn('Start에서 출력','Start',/\bDebug\.Log\s*\(\s*""\s*\)\s*;/,'Start에서 "Hello Unity!"를 출력해요.','Start 안에 Debug.Log("Hello Unity!"); 를 써 보세요. 글자와 느낌표까지 똑같이 써야 해요.')],
 test:(api,ok)=>{
  api.env.logs.length=0;api.call('Start');
  const L=api.env.logs.slice();
  ok('한 번 출력',L.length===1&&L[0]==='Hello Unity!','Start에서 "Hello Unity!"가 한 번 출력돼요.',`Start를 실행했더니 출력이 ${JSON.stringify(L)} 입니다. "Hello Unity!"가 한 번만 나와야 해요.`);
 },
 hints:['Debug.Log("보여줄 글자"); 가 콘솔에 글자를 출력하는 명령이에요.','Start는 게임이 시작될 때 한 번만 실행돼요.','줄 끝의 세미콜론 ; 을 빠뜨리지 마세요.'],
 why:'Start는 첫 프레임 전에 한 번 호출되는 시작 메서드예요. Debug.Log로 콘솔을 확인하는 습관은 코드가 의도대로 움직이는지 알아내는 가장 기본적인 방법이에요.',
 concepts:[['MonoBehaviour','게임 오브젝트에 붙일 수 있는 유니티 스크립트의 기본 클래스.'],['Start','게임이 시작될 때 한 번 호출되는 메서드.'],['Debug.Log','Console 창에 글자를 출력한다.']]});

Q({id:'e14',cat:'start',stage:5,level:2,title:'오른쪽으로 걷는 캐릭터',
 story:'Update는 화면이 그려질 때마다(매 프레임) 불려요. 컴퓨터 성능에 따라 1초에 30번 불릴 수도, 144번 불릴 수도 있어요. 프레임마다 똑같이 조금씩 움직이면 빠른 컴퓨터에서는 더 빨리 걷게 돼요. 이동량에 Time.deltaTime(지난 프레임 이후 흐른 시간)을 곱하면 컴퓨터가 달라도 초당 같은 거리를 가요. 초당 speed만큼 오른쪽으로 걷게 해 주세요.',
 goals:['speed(float, 기본값 2)를 선언한다','Update에서 오른쪽(x 방향)으로 speed × Time.deltaTime 만큼 움직인다','1초가 지나면 x가 약 2만큼 이동한다'],
 limits:['이동량에 Time.deltaTime을 곱해요','오른쪽은 Vector3.right 이고, transform.Translate 로 움직여요'],
 api:'Update, Time.deltaTime, transform.Translate, Vector3.right',
 starter:C`
using UnityEngine;

public class Walker : MonoBehaviour
{
    public float speed = 2f;

    void Update()
    {
        // 오른쪽으로 걷게 해 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Walker : MonoBehaviour
{
    public float speed = 2f;

    void Update()
    {
        transform.Translate(Vector3.right * speed * Time.deltaTime);
    }
}`,
 alts:[C`
using UnityEngine;

public class Walker : MonoBehaviour
{
    public float speed = 2f;

    void Update()
    {
        transform.position += Vector3.right * speed * Time.deltaTime;
    }
}`],
 rules:[has('Time.deltaTime 사용',/\bTime\.deltaTime\b/,'이동량에 Time.deltaTime을 곱했어요.','이동량에 Time.deltaTime을 곱하지 않으면 컴퓨터 성능에 따라 속도가 달라져요.')],
 test:(api,ok)=>{
  for(let i=0;i<60;i++)api.call('Update');
  const x=api.transform.position.x,y=api.transform.position.y;
  ok('1초 이동',Math.abs(x-2)<0.05,'1초(60프레임) 동안 x가 약 2만큼 이동했어요.',`60프레임이 지난 뒤 x가 ${x.toFixed(2)} 입니다. speed가 2이니 약 2여야 해요. 프레임마다 speed × Time.deltaTime 만큼 움직여야 해요.`);
  ok('옆으로만',Math.abs(y)<1e-6,'위아래로는 움직이지 않아요.',`y가 ${y.toFixed(2)} 입니다. 오른쪽(x 방향)으로만 움직여야 해요.`);
 },
 hints:['Vector3.right 는 오른쪽 방향이에요. 방향 × 속도 × 시간이 이동량이에요.','transform.Translate(이동량) 은 지금 위치에서 이동량만큼 움직여요.','Time.deltaTime 을 빠뜨리면 한 프레임에 2칸씩 가서 순식간에 사라져요.'],
 why:'Update는 프레임마다 불려서 프레임 속도에 따라 횟수가 달라요. 이동량에 Time.deltaTime을 곱하면 "프레임당"이 아닌 "초당" 속도가 돼서 어느 컴퓨터에서나 같은 속도로 움직여요. 이동 코드를 쓸 때 가장 먼저 기억해야 하는 규칙이에요.',
 concepts:[['Update','매 프레임 호출되는 메서드. 호출 횟수는 컴퓨터 성능마다 다르다.'],['Time.deltaTime','지난 프레임 이후 흐른 시간(초). 이동량에 곱해 프레임 속도와 상관없는 초당 속도를 만든다.'],['transform.Translate','현재 위치에서 주어진 만큼 움직인다.']]});

Q({id:'e15',cat:'start',stage:5,level:3,title:'스페이스를 누르면 점프!',
 story:'스페이스 키를 누르면 "점프!"를 출력하게 만들어 봐요. 키 입력은 Input 으로 확인해요. Input.GetKeyDown은 키를 누른 그 순간의 한 프레임에만 true이고, Input.GetKey는 누르고 있는 동안 계속 true예요. 점프는 누를 때 한 번만 일어나야 하니 어느 쪽이 맞을까요?',
 goals:['Update에서 스페이스(KeyCode.Space)를 누른 순간 "점프!"를 출력한다','키를 계속 누르고 있어도 한 번만 출력된다','다른 키에는 반응하지 않는다'],
 limits:['키 이름은 KeyCode.Space 로 써요'],
 api:'Input.GetKeyDown, Input.GetKey, KeyCode.Space',
 starter:C`
using UnityEngine;

public class Jumper : MonoBehaviour
{
    void Update()
    {
        // 스페이스를 누르면 "점프!"를 출력해 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Jumper : MonoBehaviour
{
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            Debug.Log("점프!");
        }
    }
}`,
 rules:[has('GetKeyDown 사용',/\bInput\.GetKeyDown\s*\(\s*KeyCode\.Space\s*\)/,'스페이스를 누른 순간을 확인했어요.','Input.GetKeyDown(KeyCode.Space) 으로 스페이스를 누른 순간을 확인해 보세요.')],
 test:(api,ok)=>{
  const I=api.env.Input;let held=false,down=false;
  I.GetKeyDown=k=>k==='Space'&&down;I.GetKey=k=>k==='Space'&&held;
  const frame=(h,d)=>{held=h;down=d;api.call('Update')};
  api.env.logs.length=0;frame(false,false);
  ok('안 누르면 조용',api.env.logs.length===0,'키를 누르지 않으면 아무 일도 없어요.','키를 누르지 않았는데 출력이 나왔어요. if로 키를 눌렀을 때만 출력하게 하세요.');
  api.env.logs.length=0;frame(true,true);frame(true,false);frame(true,false);
  const n=api.env.logs.length;
  ok('누르는 동안 한 번',n===1&&api.env.logs[0]==='점프!',`스페이스를 3프레임 동안 누르고 있어도 "점프!"는 한 번만 나왔어요.`,`3프레임 동안 누르고 있었더니 "점프!"가 ${n}번 나왔어요. 한 번만 나와야 해요. 누르고 있는 동안 계속 true인 GetKey 대신, 누른 순간만 true인 GetKeyDown을 쓰세요.`);
  api.env.logs.length=0;
  I.GetKeyDown=k=>k==='Return';I.GetKey=k=>k==='Return';api.call('Update');
  ok('다른 키',api.env.logs.length===0,'다른 키에는 반응하지 않아요.','다른 키를 눌렀는데 출력이 나왔어요. KeyCode.Space 만 확인해야 해요.');
 },
 hints:['if (조건) { ... } 안에 Debug.Log("점프!"); 를 넣어요.','조건은 Input.GetKeyDown(KeyCode.Space) 예요. 키를 누른 그 프레임에만 true가 돼요.','Input.GetKey는 누르고 있는 동안 매 프레임 true라서 점프가 계속 일어나요.'],
 why:'GetKeyDown은 눌린 순간 한 프레임, GetKey는 눌려 있는 내내, GetKeyUp은 뗀 순간 한 프레임에 true예요. 점프나 발사처럼 한 번만 일어나야 하는 동작은 GetKeyDown, 이동이나 차징처럼 이어지는 동작은 GetKey를 써요.',
 concepts:[['Input.GetKeyDown','키를 누른 그 프레임에만 true. 점프, 발사처럼 한 번 일어나는 동작에 쓴다.'],['Input.GetKey','키를 누르고 있는 동안 매 프레임 true. 이동처럼 이어지는 동작에 쓴다.'],['입력은 Update에서','프레임마다 키 상태를 확인해야 놓치지 않는다.']]});
