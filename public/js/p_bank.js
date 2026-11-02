/* ===== 문제 사전: 코딩 첫걸음(입문) =====
   학습 지도에는 없는 추가 문제. 같은 단계의 개념을 다른 상황에서 한 번 더 쓴다. */
QB({id:'x1',cat:'start',stage:1,level:1,title:'아이템 정보를 변수로 적기',
 story:'인벤토리에 들어갈 아이템의 정보를 변수로 만들어요. 아이템 이름, 가격, 무게, 겹쳐서 쌓을 수 있는지를 알맞은 자료형으로 적어 주세요.',
 goals:['string 형식의 itemName, 값은 "포션"','int 형식의 price, 값은 50','float 형식의 weight, 값은 0.5','bool 형식의 isStackable, 값은 true'],
 limits:['글자는 큰따옴표로 감싸요','float 값은 0.5f처럼 f를 붙여요'],
 api:'int, float, string, bool',
 starter:C`
public class Item
{
    // 아이템 정보 변수 네 개를 만들어 보세요.
}`,
 solution:C`
public class Item
{
    string itemName = "포션";
    int price = 50;
    float weight = 0.5f;
    bool isStackable = true;
}`,
 rules:[
  fx('이름(string)',(c,code)=>/\bstring\s+itemName\s*=\s*"포션"\s*;/.test(code),'itemName을 string으로 만들고 "포션"을 넣었어요.','string itemName = "포션"; 처럼 쓰세요. 글자는 큰따옴표로 감싸요.'),
  has('가격(int)',/\bint\s+price\s*=\s*50\s*;/,'price를 int로 만들고 50을 넣었어요.','int price = 50; 처럼 쓰세요.'),
  has('무게(float)',/\bfloat\s+weight\s*=\s*0\.5f\s*;/,'weight를 float로 만들고 0.5f를 넣었어요.','float weight = 0.5f; 처럼 쓰세요. float에는 f를 붙여요.'),
  has('쌓기(bool)',/\bbool\s+isStackable\s*=\s*true\s*;/,'isStackable을 bool로 만들고 true를 넣었어요.','bool isStackable = true; 처럼 쓰세요.')
 ],
 hints:['변수는 "형식 이름 = 값;" 순서로 만들어요.','소수는 float, 정수는 int, 글자는 string, 참/거짓은 bool이에요.','float 값에는 f를 붙여요: 0.5f'],
 why:'이름은 string, 가격은 int, 무게는 float, 여부는 bool처럼 값의 성격에 맞는 자료형을 고르는 것이 변수의 시작이에요. 형식이 맞아야 계산과 비교가 올바르게 동작해요.',
 concepts:[['자료형 고르기','값의 성격에 맞춰 int(정수), float(소수), string(글자), bool(참/거짓)을 고른다.']]});

QB({id:'x2',cat:'start',stage:1,level:2,title:'골드 정산하기',
 story:'모험을 마치고 마을로 돌아왔어요. 처음에 가진 골드, 모험에서 번 골드, 쓴 골드를 받아서 지금 가진 골드가 얼마인지 계산해 주세요. 쓴 골드는 빼야 해요.',
 goals:['Gold(start, earned, spent)는 start + earned - spent 를 돌려준다','번 것이 없어도, 쓴 것이 없어도 올바르게 계산한다'],
 limits:['덧셈 +, 뺄셈 - 를 써요'],
 api:'+, -, return',
 starter:C`
int Gold(int start, int earned, int spent)
{
    // 지금 가진 골드를 계산해서 돌려주세요.
    return 0;
}`,
 solution:C`
int Gold(int start, int earned, int spent)
{
    int total = start + earned;
    total = total - spent;
    return total;
}`,
 alts:[C`
int Gold(int start, int earned, int spent)
{
    return start + earned - spent;
}`],
 test:(api,ok)=>{
  const g=(a,b,c)=>api.call('Gold',a,b,c);
  ok('보통 정산',g(100,250,80)===270,'100 + 250 - 80 = 270이에요.',`Gold(100, 250, 80)이 ${g(100,250,80)} 입니다. 270이어야 해요.`);
  ok('번 것 없음',g(50,0,20)===30,'번 골드가 없어도 계산돼요.',`Gold(50, 0, 20)이 ${g(50,0,20)} 입니다. 30이어야 해요.`);
  ok('쓴 것 없음',g(10,5,0)===15,'쓴 골드가 없으면 더하기만 해요.',`Gold(10, 5, 0)이 ${g(10,5,0)} 입니다. 15여야 해요.`);
 },
 hints:['가진 돈에 번 돈을 더하고, 쓴 돈을 빼요.','계산 결과를 변수에 담아 두었다가 return으로 돌려줄 수 있어요.','한 줄로 return start + earned - spent; 라고 써도 돼요.'],
 why:'메서드는 받은 값(매개변수)으로 계산하고 결과를 return으로 돌려줘요. 더하고 빼는 순서를 말 그대로 코드로 옮기면 돼요.',
 concepts:[['return 값','메서드가 계산한 결과를 부른 곳으로 돌려주는 값.']]});

QB({id:'x3',cat:'start',stage:1,level:3,title:'초를 분과 초로 바꾸기',
 story:'스톱워치가 135초라고 알려 주면 "2분 15초"처럼 보여 주고 싶어요. 60초가 1분이니까 60으로 나눈 몫이 분, 나머지가 초예요. 정수끼리 나누면 몫만 남는 성질과 나머지 연산자 %를 이용해 보세요.',
 goals:['FormatTime(seconds)는 "분 초" 형태의 글자를 돌려준다. 예: 135초 → "2분 15초"','60초 미만이면 "0분 45초"처럼 분은 0으로 적는다'],
 limits:['글자와 숫자는 + 로 이어 붙일 수 있어요','분은 seconds / 60, 초는 seconds % 60 이에요'],
 api:'/, %, string +',
 starter:C`
string FormatTime(int seconds)
{
    // 분과 초를 계산해서 글자로 돌려주세요.
    return "";
}`,
 solution:C`
string FormatTime(int seconds)
{
    int minutes = seconds / 60;
    int remain = seconds % 60;
    return minutes + "분 " + remain + "초";
}`,
 rules:[],
 test:(api,ok)=>{
  const f=s=>api.call('FormatTime',s);
  ok('135초',f(135)==='2분 15초','135초는 "2분 15초"예요.',`FormatTime(135)가 "${f(135)}" 입니다. "2분 15초"여야 해요. 글자 사이 공백과 "분", "초"까지 똑같이 써야 해요.`);
  ok('45초',f(45)==='0분 45초','45초는 "0분 45초"예요.',`FormatTime(45)가 "${f(45)}" 입니다. "0분 45초"여야 해요.`);
  ok('정확히 1분',f(60)==='1분 0초','60초는 "1분 0초"예요.',`FormatTime(60)이 "${f(60)}" 입니다. "1분 0초"여야 해요.`);
  ok('3600초',f(3600)==='60분 0초','3600초는 "60분 0초"예요.',`FormatTime(3600)이 "${f(3600)}" 입니다. "60분 0초"여야 해요.`);
 },
 hints:['int끼리 나누면 소수점 아래가 버려져서 몫만 남아요. 135 / 60 은 2예요.','나머지는 % 로 구해요. 135 % 60 은 15예요.','숫자와 글자는 + 로 이어 붙일 수 있어요: minutes + "분 " + remain + "초"'],
 why:'정수 나눗셈은 몫만, % 연산은 나머지만 남겨요. 두 가지를 함께 쓰면 시간을 분과 초로, 점수를 십의 자리와 일의 자리로 나누는 일을 쉽게 할 수 있어요.',
 concepts:[['몫과 나머지','정수끼리 나누면 몫만 남고(/), 나머지는 %로 구한다.'],['글자 이어 붙이기','string과 숫자를 + 로 이어 붙여 한 줄의 글자를 만든다.']]});

QB({id:'x4',cat:'start',stage:2,level:1,title:'체력이 음수가 되지 않게',
 story:'큰 데미지를 받으면 체력이 -30처럼 음수가 될 수 있어요. 체력 바가 이상하게 보이니 0 밑으로 내려가지 않게 해야 해요. 체력 값을 받아서, 0보다 작으면 0을, 아니면 그대로 돌려주세요.',
 goals:['ClampHp(hp)는 hp가 0보다 작으면 0을 돌려준다','0 이상이면 hp를 그대로 돌려준다'],
 limits:['if문을 사용해요'],
 api:'if, <, return',
 starter:C`
int ClampHp(int hp)
{
    // 음수라면 0을 돌려주세요.
    return hp;
}`,
 solution:C`
int ClampHp(int hp)
{
    if (hp < 0)
    {
        return 0;
    }
    return hp;
}`,
 rules:[has('if문 사용',/\bif\s*\(/,'if문으로 나눴어요.','if (hp < 0) { ... } 처럼 if문을 써 보세요.')],
 test:(api,ok)=>{
  const c=h=>api.call('ClampHp',h);
  ok('음수',c(-30)===0,'-30은 0이 돼요.',`ClampHp(-30)이 ${c(-30)} 입니다. 0이어야 해요.`);
  ok('0',c(0)===0,'0은 그대로 0이에요.',`ClampHp(0)이 ${c(0)} 입니다. 0이어야 해요.`);
  ok('양수',c(75)===75,'양수는 그대로예요.',`ClampHp(75)가 ${c(75)} 입니다. 75여야 해요.`);
 },
 hints:['hp < 0 이면 음수예요.','조건이 참일 때 return 0; 으로 바로 끝내면 아래 코드는 실행되지 않아요.','나머지 경우에는 return hp; 로 그대로 돌려줘요.'],
 why:'값이 정해진 범위를 넘지 않게 막는 처리는 게임에서 가장 흔한 if문 사용이에요. 체력, 골드, 수량이 음수가 되면 화면 표시와 계산이 모두 어긋나요.',
 concepts:[['값 범위 제한','계산 결과가 허용 범위를 넘으면 if로 경계 값으로 바로잡는다.']]});

QB({id:'x5',cat:'start',stage:2,level:2,title:'나이에 따른 입장료',
 story:'놀이공원 입장료를 계산해요. 7세 이하는 무료, 8세부터 18세까지는 500원, 19세 이상은 1000원이에요. 나이를 받아서 입장료를 돌려주는 메서드를 만들어 주세요. 경계 나이(7, 18)를 조심하세요.',
 goals:['Fare(age)는 7세 이하이면 0, 18세 이하이면 500, 그 외에는 1000을 돌려준다'],
 limits:['큰 범위가 아니라 작은 나이부터 확인하면 쉬워요'],
 api:'if, else if, <=',
 starter:C`
int Fare(int age)
{
    // 나이에 맞는 입장료를 돌려주세요.
    return 1000;
}`,
 solution:C`
int Fare(int age)
{
    if (age <= 7)
    {
        return 0;
    }
    else if (age <= 18)
    {
        return 500;
    }
    return 1000;
}`,
 rules:[has('if문 사용',/\bif\s*\(/,'if문으로 나눴어요.','나이 구간을 if / else if 로 나눠 보세요.')],
 test:(api,ok)=>{
  const f=a=>api.call('Fare',a);
  [[0,0],[7,0],[8,500],[18,500],[19,1000],[40,1000]].forEach(([a,e])=>ok(a+'세',f(a)===e,`${a}세는 ${e}원이에요.`,`Fare(${a})가 ${f(a)} 입니다. ${e}여야 해요. ${a===7||a===18?'경계 나이는 <= 와 < 의 차이를 확인하세요.':''}`));
 },
 hints:['작은 나이부터 확인해요. 7 이하면 무료예요.','그다음 18 이하면 500, 나머지는 1000이에요.','"이하"는 <= 예요.'],
 why:'구간이 여러 개일 때는 한쪽 끝부터 차례로 걸러내면 구간의 반대쪽 끝을 따로 쓰지 않아도 돼요. 경계 값이 어느 구간에 들어가는지는 >= 와 > 로 정해요.',
 concepts:[['구간 나누기','작은 값(또는 큰 값)부터 차례로 확인하면 각 구간의 한쪽 끝만 쓰면 된다.']]});

QB({id:'x6',cat:'start',stage:2,level:3,title:'윤년일까?',
 story:'달력 앱을 만들고 있어요. 윤년이면 2월이 29일이에요. 윤년은 4로 나누어떨어지지만 100으로 나누어떨어지는 해는 제외하고, 400으로 나누어떨어지면 다시 윤년이에요. 2000년은 윤년, 1900년은 아니고, 2024년은 윤년이에요.',
 goals:['IsLeap(year)는 윤년이면 true, 아니면 false를 돌려준다'],
 limits:['나누어떨어지는지는 year % 4 == 0 으로 확인해요','&&, || 를 알맞게 묶어요'],
 api:'%, &&, ||',
 starter:C`
bool IsLeap(int year)
{
    // 윤년 규칙을 코드로 옮겨 보세요.
    return false;
}`,
 solution:C`
bool IsLeap(int year)
{
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}`,
 alts:[C`
bool IsLeap(int year)
{
    if (year % 400 == 0)
    {
        return true;
    }
    if (year % 100 == 0)
    {
        return false;
    }
    return year % 4 == 0;
}`],
 rules:[],
 test:(api,ok)=>{
  const l=y=>api.call('IsLeap',y);
  [[2024,true],[2023,false],[1900,false],[2000,true],[2100,false],[1996,true]].forEach(([y,e])=>ok(y+'년',l(y)===e,`${y}년은 ${e?'윤년':'평년'}이에요.`,`IsLeap(${y})가 ${l(y)} 입니다. ${e}여야 해요. ${y%100===0?'100으로 나누어떨어지는 해는 400으로도 나누어떨어질 때만 윤년이에요.':''}`));
 },
 hints:['"4의 배수이면서 100의 배수는 아님"을 먼저 한 묶음으로 만들어요.','그 묶음 또는 "400의 배수"이면 윤년이에요.','괄호로 묶어 &&와 ||의 순서를 분명히 하세요.'],
 why:'여러 규칙이 겹칠 때는 규칙을 한 줄씩 문장으로 먼저 적고, 그대로 &&와 ||로 옮기면 돼요. 예외의 예외가 있는 규칙은 괄호로 묶어서 읽는 순서를 분명히 해요.',
 concepts:[['조건 조합','&&와 ||를 괄호로 묶어 예외가 있는 규칙을 한 식으로 쓴다.']]});

QB({id:'x7',cat:'start',stage:3,level:1,title:'카운트다운',
 story:'게임이 시작되기 전에 "3", "2", "1", "시작!"을 차례로 출력하고 싶어요. 숫자가 3에서 1까지 줄어들어요. 반복문으로 3, 2, 1을 출력하고 마지막에 "시작!"을 출력해 주세요.',
 goals:['Countdown()을 부르면 3, 2, 1, 시작! 이 순서대로 출력된다','숫자 출력에 반복문을 사용한다'],
 limits:['i를 줄이려면 i-- 를 써요'],
 api:'for, i--, Debug.Log',
 starter:C`
void Countdown()
{
    // 3, 2, 1 을 반복문으로 출력하고 "시작!"을 출력하세요.
}`,
 solution:C`
void Countdown()
{
    for (int i = 3; i >= 1; i--)
    {
        Debug.Log(i);
    }
    Debug.Log("시작!");
}`,
 rules:[has('반복문 사용',/\b(?:for|while)\s*\(/,'반복문으로 숫자를 출력했어요.','3, 2, 1 은 반복문으로 출력해 보세요.')],
 test:(api,ok)=>{
  api.env.logs.length=0;api.call('Countdown');
  const L=api.env.logs.slice();
  ok('순서',L.join(',')==='3,2,1,시작!','3, 2, 1, 시작! 순서로 출력됐어요.',`출력이 ${JSON.stringify(L)} 입니다. 3, 2, 1, 시작! 순서여야 해요.`);
 },
 hints:['i를 3에서 시작해서 1까지 줄여 가요: for (int i = 3; i >= 1; i--)','반복문 안에서 Debug.Log(i); 를 써요.','"시작!"은 반복문이 끝난 뒤에 한 번만 출력해요.'],
 why:'for의 세 부분은 시작값, 계속할 조건, 한 번 끝날 때마다 할 일이에요. i++ 대신 i--를 쓰면 거꾸로 셀 수 있어요.',
 concepts:[['i-- (감소)','반복할 때마다 i를 1씩 줄인다. 거꾸로 셀 때 쓴다.']]});

QB({id:'x8',cat:'start',stage:3,level:2,title:'구구단 한 단 출력하기',
 story:'수학 학습 게임에서 구구단 한 단을 보여 주려고 해요. 단 n을 받아서 "n x 1 = 결과"부터 "n x 9 = 결과"까지 9줄을 출력해 주세요. 예를 들어 3단이면 "3 x 1 = 3", "3 x 2 = 6" ... "3 x 9 = 27" 이에요.',
 goals:['Times(n)은 1부터 9까지 곱한 결과를 "n x i = 결과" 형태로 9줄 출력한다','반복문을 사용한다'],
 limits:['숫자와 글자를 + 로 이어 붙여요','곱셈 기호 x 는 글자예요 (곱셈 연산은 *)'],
 api:'for, *, string +',
 starter:C`
void Times(int n)
{
    // 구구단 한 단을 출력하세요.
}`,
 solution:C`
void Times(int n)
{
    for (int i = 1; i <= 9; i++)
    {
        Debug.Log(n + " x " + i + " = " + (n * i));
    }
}`,
 rules:[has('반복문 사용',/\b(?:for|while)\s*\(/,'반복문으로 9줄을 출력했어요.','9줄을 직접 쓰지 말고 반복문을 써 보세요.')],
 test:(api,ok)=>{
  api.env.logs.length=0;api.call('Times',3);
  const L=api.env.logs.slice();
  ok('9줄',L.length===9,'9줄이 출력됐어요.',`${L.length}줄이 출력됐어요. 9줄이어야 해요.`);
  ok('첫 줄',L[0]==='3 x 1 = 3','첫 줄이 "3 x 1 = 3"이에요.',`첫 줄이 "${L[0]}" 입니다. "3 x 1 = 3"이어야 해요.`);
  ok('마지막 줄',L[8]==='3 x 9 = 27','마지막 줄이 "3 x 9 = 27"이에요.',`마지막 줄이 "${L[8]}" 입니다. "3 x 9 = 27"이어야 해요.`);
  api.env.logs.length=0;api.call('Times',7);
  ok('7단',api.env.logs[3]==='7 x 4 = 28','7단도 맞아요.',`7단의 네 번째 줄이 "${api.env.logs[3]}" 입니다. "7 x 4 = 28"이어야 해요.`);
 },
 hints:['i를 1부터 9까지 돌리는 for문을 만들어요.','한 줄은 n + " x " + i + " = " + (n * i) 로 이어 붙여요.','곱셈 결과를 이어 붙일 때는 (n * i) 처럼 괄호로 묶어요.'],
 why:'반복문의 변수 i를 출력과 계산에 함께 쓰면 규칙이 있는 여러 줄을 한 번에 만들 수 있어요. 글자와 숫자를 이어 붙일 때는 계산 부분을 괄호로 묶어 먼저 계산되게 해요.',
 concepts:[['반복 변수 활용','for의 i를 출력과 계산에 함께 써서 규칙이 있는 결과를 만든다.']]});

QB({id:'x9',cat:'start',stage:3,level:3,title:'가장 큰 점수 찾기',
 story:'플레이어들의 점수 배열에서 가장 큰 점수를 찾으려고 해요. 배열의 값을 하나씩 보면서, 지금까지 본 최댓값보다 크면 최댓값을 바꾸면 돼요. 점수가 음수인 경우도 있으니 조심하세요.',
 goals:['MaxOf(nums)는 배열에서 가장 큰 값을 돌려준다','모든 값이 음수여도 올바르게 동작한다','반복문과 if를 함께 사용한다'],
 limits:['최댓값을 담는 변수를 반복문 바깥에 만들어요','처음 값을 무엇으로 시작할지 생각해 보세요'],
 api:'foreach, if, 비교',
 starter:C`
int MaxOf(int[] nums)
{
    // 가장 큰 값을 찾아서 돌려주세요.
    return 0;
}`,
 solution:C`
int MaxOf(int[] nums)
{
    int max = nums[0];
    foreach (int x in nums)
    {
        if (x > max)
        {
            max = x;
        }
    }
    return max;
}`,
 rules:[has('반복문 사용',/\b(?:for|foreach|while)\s*\(/,'반복문으로 하나씩 비교했어요.','배열의 값을 하나씩 비교하려면 반복문을 써요.')],
 test:(api,ok)=>{
  const m=a=>api.call('MaxOf',a);
  ok('섞인 값',m([3,9,2])===9,'[3, 9, 2]의 최댓값은 9예요.',`MaxOf([3, 9, 2])가 ${m([3,9,2])} 입니다. 9여야 해요.`);
  ok('모두 음수',m([-5,-2,-8])===-2,'[-5, -2, -8]의 최댓값은 -2예요.',`MaxOf([-5, -2, -8])이 ${m([-5,-2,-8])} 입니다. -2여야 해요. 최댓값을 0으로 시작하면 음수 배열에서 틀려요. 첫 번째 값으로 시작해 보세요.`);
  ok('값 하나',m([7])===7,'값이 하나면 그 값이에요.',`MaxOf([7])이 ${m([7])} 입니다. 7이어야 해요.`);
  ok('맨 앞이 최대',m([10,1,2])===10,'첫 값이 최대여도 맞아요.',`MaxOf([10, 1, 2])가 ${m([10,1,2])} 입니다. 10이어야 해요.`);
 },
 hints:['max 변수를 만들어 두고, 더 큰 값을 만날 때마다 바꿔요.','max를 0으로 시작하면 모든 값이 음수일 때 틀려요. nums[0]으로 시작해 보세요.','if (x > max) { max = x; }'],
 why:'최댓값, 최솟값 찾기는 "기준 값을 정하고 하나씩 비교하며 갱신"하는 패턴이에요. 기준 값을 무엇으로 시작하는지가 경계 사례(음수, 값이 하나)를 좌우해요.',
 concepts:[['최댓값 패턴','기준 값을 첫 요소로 두고 하나씩 비교해 더 크면 갱신한다.'],['초기값 선택','기준 값을 0 같은 임의 값으로 두면 음수 같은 경계 사례에서 틀릴 수 있다.']]});

QB({id:'x10',cat:'start',stage:4,level:1,title:'두 수 중 큰 값 돌려주기',
 story:'두 플레이어의 점수 중 더 높은 점수를 알려 주는 메서드를 만들어요. 메서드는 두 정수를 받아서 큰 쪽을 돌려줘요. 같으면 그 값을 돌려주면 돼요.',
 goals:['Bigger(a, b)는 a와 b 중 큰 값을 돌려준다'],
 limits:['Mathf.Max를 쓰지 않고 if로 직접 비교해 보세요'],
 api:'메서드 정의, if, return',
 starter:C`
int Bigger(int a, int b)
{
    // 큰 값을 돌려주세요.
    return 0;
}`,
 solution:C`
int Bigger(int a, int b)
{
    if (a > b)
    {
        return a;
    }
    return b;
}`,
 rules:[no('Mathf.Max 금지',/\bMathf\.Max\b/,'직접 비교해서 큰 값을 골랐어요.','이번에는 Mathf.Max 없이 if로 직접 비교해 보세요.')],
 test:(api,ok)=>{
  const b=(x,y)=>api.call('Bigger',x,y);
  ok('앞이 큼',b(9,4)===9,'9와 4 중 9가 커요.',`Bigger(9, 4)가 ${b(9,4)} 입니다. 9여야 해요.`);
  ok('뒤가 큼',b(2,7)===7,'2와 7 중 7이 커요.',`Bigger(2, 7)이 ${b(2,7)} 입니다. 7이어야 해요.`);
  ok('같음',b(5,5)===5,'같으면 그 값이에요.',`Bigger(5, 5)가 ${b(5,5)} 입니다. 5여야 해요.`);
  ok('음수',b(-3,-8)===-3,'음수끼리도 비교돼요.',`Bigger(-3, -8)이 ${b(-3,-8)} 입니다. -3이어야 해요.`);
 },
 hints:['a가 b보다 크면 a를, 아니면 b를 돌려줘요.','if (a > b) { return a; } 다음 줄에 return b; 를 쓰면 돼요.','return을 만나면 메서드가 끝나요.'],
 why:'메서드는 받은 값으로 판단해서 하나의 결과를 돌려줘요. 이런 작은 비교 메서드를 여러 곳에서 불러 쓰면 같은 if를 반복해서 쓰지 않아도 돼요.',
 concepts:[['메서드로 판단 묶기','자주 쓰는 비교나 판단을 메서드로 만들어 이름으로 부른다.']]});

QB({id:'x11',cat:'start',stage:4,level:2,title:'회복 물약 쓰기',
 story:'회복 물약을 마시면 체력이 amount만큼 올라가요. 하지만 체력은 최대 체력(maxHp)을 넘을 수 없어요. 현재 체력, 회복량, 최대 체력을 받아서 물약을 마신 뒤의 체력을 돌려주는 메서드를 만들어 주세요.',
 goals:['Heal(hp, amount, maxHp)는 hp + amount 를 돌려준다','결과가 maxHp보다 크면 maxHp를 돌려준다'],
 limits:['if문으로 한도를 넘는지 확인해요'],
 api:'매개변수, if, return',
 starter:C`
int Heal(int hp, int amount, int maxHp)
{
    // 회복한 뒤의 체력을 돌려주세요. 최대 체력을 넘으면 안 돼요.
    return hp;
}`,
 solution:C`
int Heal(int hp, int amount, int maxHp)
{
    int result = hp + amount;
    if (result > maxHp)
    {
        result = maxHp;
    }
    return result;
}`,
 rules:[],
 test:(api,ok)=>{
  const h=(a,b,c)=>api.call('Heal',a,b,c);
  ok('보통 회복',h(40,30,100)===70,'40에서 30을 회복하면 70이에요.',`Heal(40, 30, 100)이 ${h(40,30,100)} 입니다. 70이어야 해요.`);
  ok('한도 초과',h(90,30,100)===100,'최대 체력을 넘으면 100에서 멈춰요.',`Heal(90, 30, 100)이 ${h(90,30,100)} 입니다. 100이어야 해요. 최대 체력을 넘으면 maxHp로 바꿔 주세요.`);
  ok('딱 맞음',h(70,30,100)===100,'딱 맞게 채우면 100이에요.',`Heal(70, 30, 100)이 ${h(70,30,100)} 입니다. 100이어야 해요.`);
  ok('이미 가득',h(100,10,100)===100,'이미 가득이면 그대로예요.',`Heal(100, 10, 100)이 ${h(100,10,100)} 입니다. 100이어야 해요.`);
 },
 hints:['먼저 hp + amount 를 계산해서 변수에 담아요.','그 값이 maxHp보다 크면 maxHp로 바꿔요.','마지막에 변수를 return으로 돌려줘요.'],
 why:'값을 더한 뒤 허용 범위를 넘으면 상한으로 바로잡는 처리는 체력, 마나, 골드 등 거의 모든 수치에 쓰여요. 계산과 제한을 한 메서드에 묶어 두면 어디서 불러도 같은 규칙이 지켜져요.',
 concepts:[['상한 제한','더한 결과가 최댓값을 넘으면 최댓값으로 바꿔 돌려준다.']]});

QB({id:'x12',cat:'start',stage:4,level:3,title:'별점 세 개로 평가 만들기',
 story:'게임 리뷰에서 별점 세 개의 평균을 구하고, 그 평균으로 "최고", "보통", "별로" 평가를 하려고 해요. 평균을 구하는 Average 메서드는 이미 만들어져 있어요. Rating 메서드에서 Average를 불러서 평균이 4.5 이상이면 "최고", 3 이상이면 "보통", 그보다 낮으면 "별로"를 돌려주세요.',
 goals:['Rating(a, b, c)는 Average(a, b, c)를 불러 평균을 구한다','평균 4.5 이상 "최고", 3 이상 "보통", 그 밖에는 "별로"를 돌려준다'],
 limits:['Average는 고치지 않고 Rating 안에서 호출해요'],
 api:'메서드 호출, float 비교',
 starter:C`
float Average(int a, int b, int c)
{
    return (a + b + c) / 3f;
}

string Rating(int a, int b, int c)
{
    // Average를 불러서 평가를 돌려주세요.
    return "";
}`,
 solution:C`
float Average(int a, int b, int c)
{
    return (a + b + c) / 3f;
}

string Rating(int a, int b, int c)
{
    float avg = Average(a, b, c);
    if (avg >= 4.5f)
    {
        return "최고";
    }
    else if (avg >= 3f)
    {
        return "보통";
    }
    return "별로";
}`,
 rules:[inFn('Average 호출','Rating',/\bAverage\s*\(/,'Rating 안에서 Average를 불렀어요.','평균을 직접 계산하지 말고 Average(a, b, c)를 불러 보세요.')],
 test:(api,ok)=>{
  const r=(a,b,c)=>api.call('Rating',a,b,c);
  ok('최고',r(5,5,4)==='최고','평균 약 4.67은 "최고"예요.',`Rating(5, 5, 4)가 "${r(5,5,4)}" 입니다. "최고"여야 해요.`);
  ok('보통',r(3,3,3)==='보통','평균 3은 "보통"이에요. 경계 값도 맞아요.',`Rating(3, 3, 3)이 "${r(3,3,3)}" 입니다. "보통"이어야 해요. 3 이상이니 >= 를 쓰세요.`);
  ok('별로',r(1,2,3)==='별로','평균 2는 "별로"예요.',`Rating(1, 2, 3)이 "${r(1,2,3)}" 입니다. "별로"여야 해요.`);
  ok('4.5 경계',r(5,4,5)==='최고'||r(5,4,5)==='보통','평균 약 4.67은 "최고"예요.','평균 계산이 이상해요.');
 },
 hints:['float avg = Average(a, b, c); 로 평균을 변수에 담아요.','큰 기준(4.5)부터 확인하고, 그다음 3을 확인해요.','float 기준에는 4.5f처럼 f를 붙여요.'],
 why:'작은 메서드를 만들어 두고 다른 메서드가 불러 쓰면, 평균 계산 방식이 바뀌어도 한 곳만 고치면 돼요. 계산하는 메서드와 판단하는 메서드를 나누면 각각 이해하기 쉬워요.',
 concepts:[['계산과 판단 분리','값을 계산하는 메서드와 그 값으로 판단하는 메서드를 나눠서 조합한다.']]});

QB({id:'x13',cat:'start',stage:5,level:1,title:'시작할 때 체력 알려 주기',
 story:'게임이 시작될 때 플레이어의 체력을 콘솔에 보여 주고 싶어요. hp 변수가 100으로 만들어져 있어요. Start에서 "HP: 100"이라고 출력해 주세요. 값을 글자에 직접 쓰지 말고 hp 변수를 이어 붙여야 hp가 바뀌어도 맞아요.',
 goals:['Start에서 "HP: " 뒤에 hp 변수 값을 이어 붙여 출력한다','hp가 100이면 "HP: 100"이 출력된다'],
 limits:['"HP: 100"을 통째로 쓰지 않고 hp 변수를 이어 붙여요'],
 api:'Start, Debug.Log, string +',
 starter:C`
using UnityEngine;

public class Status : MonoBehaviour
{
    public int hp = 100;

    void Start()
    {
        // 체력을 출력해 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Status : MonoBehaviour
{
    public int hp = 100;

    void Start()
    {
        Debug.Log("HP: " + hp);
    }
}`,
 rules:[inFn('hp 변수 이어 붙이기','Start',/\bDebug\.Log\s*\(\s*""\s*\+\s*hp\s*\)/,'hp 변수를 이어 붙여 출력해요.','Debug.Log("HP: " + hp); 처럼 글자와 hp 변수를 +로 이어 붙여 보세요.')],
 test:(api,ok)=>{
  api.env.logs.length=0;api.call('Start');
  const L=api.env.logs.slice();
  ok('HP 출력',L.length===1&&L[0]==='HP: 100','"HP: 100"이 한 번 출력돼요.',`출력이 ${JSON.stringify(L)} 입니다. "HP: 100"이 한 번 나와야 해요.`);
  api.set('hp',55);api.env.logs.length=0;api.call('Start');
  ok('hp가 바뀌면',api.env.logs[0]==='HP: 55','hp가 55로 바뀌면 "HP: 55"가 출력돼요.',`hp를 55로 바꿨는데 "${api.env.logs[0]}"가 출력됐어요. "HP: 55"여야 해요. hp 변수를 이어 붙였는지 확인하세요.`);
 },
 hints:['글자와 변수를 + 로 이어 붙일 수 있어요: "HP: " + hp','Debug.Log(...) 안에 이어 붙인 값을 넣어요.','"HP: 100"을 통째로 쓰면 hp가 바뀔 때 틀려요.'],
 why:'Debug.Log에 글자와 변수를 이어 붙이면 지금 변수가 어떤 값인지 콘솔에서 바로 확인할 수 있어요. 변수가 의도대로 바뀌는지 확인할 때 가장 많이 쓰는 방법이에요.',
 concepts:[['값 로그 찍기','Debug.Log("이름: " + 변수) 로 변수의 현재 값을 콘솔에서 확인한다.']]});

QB({id:'x14',cat:'start',stage:5,level:2,title:'계속 도는 오브젝트',
 story:'코인이 제자리에서 빙글빙글 도는 연출을 만들어요. Update에서 오브젝트를 회전시키는데, 이동처럼 회전도 Time.deltaTime을 곱해야 컴퓨터 성능과 상관없이 같은 속도로 돌아요. 초당 speed도만큼 도는 코인을 만들어 주세요.',
 goals:['speed(float, 기본값 90)를 선언한다','Update에서 speed × Time.deltaTime 만큼 회전한다','1초가 지나면 약 90도 회전해 있다'],
 limits:['transform.Rotate 를 써요','2D에서는 z축으로 돌아요'],
 api:'Update, transform.Rotate, Time.deltaTime',
 starter:C`
using UnityEngine;

public class Coin : MonoBehaviour
{
    public float speed = 90f;

    void Update()
    {
        // 코인을 회전시켜 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Coin : MonoBehaviour
{
    public float speed = 90f;

    void Update()
    {
        transform.Rotate(0f, 0f, speed * Time.deltaTime);
    }
}`,
 alts:[C`
using UnityEngine;

public class Coin : MonoBehaviour
{
    public float speed = 90f;

    void Update()
    {
        transform.Rotate(Vector3.forward * speed * Time.deltaTime);
    }
}`],
 rules:[has('Time.deltaTime 사용',/\bTime\.deltaTime\b/,'회전량에 Time.deltaTime을 곱했어요.','회전량에도 Time.deltaTime을 곱해야 프레임 속도와 상관없이 같은 속도로 돌아요.')],
 test:(api,ok)=>{
  for(let i=0;i<60;i++)api.call('Update');
  const z=api.transform.eulerAngles.z;
  ok('1초 회전',Math.abs(z-90)<1,'1초(60프레임) 동안 약 90도 회전했어요.',`60프레임이 지난 뒤 회전이 ${z.toFixed(1)}도 입니다. speed가 90이니 약 90도여야 해요. 프레임마다 speed × Time.deltaTime 만큼 돌려야 해요.`);
 },
 hints:['transform.Rotate(x, y, z) 는 각 축으로 도 단위만큼 돌려요. 2D에서는 z축이에요.','돌릴 각도는 speed * Time.deltaTime 이에요.','Time.deltaTime을 빼면 컴퓨터가 빠를수록 빨리 돌아요.'],
 why:'이동뿐 아니라 회전, 크기 변화, 색 변화처럼 시간에 따라 변하는 모든 값은 Time.deltaTime을 곱해서 "초당" 변화량으로 만들어야 프레임 속도와 상관없이 같은 연출이 나와요.',
 concepts:[['초당 회전','회전각 × Time.deltaTime 으로 프레임 속도와 상관없는 초당 회전 속도를 만든다.']]});

QB({id:'x15',cat:'start',stage:5,level:3,title:'R키로 처음 위치로 돌아가기',
 story:'플레이어가 길을 잃었을 때 R 키를 누르면 처음 위치(0, 0)로 돌아가게 하고 싶어요. 키를 누른 순간에만 한 번 일어나야 해요. 위치를 바꾸려면 transform.position에 새 위치를 넣어요. Vector3.zero는 (0, 0, 0)이에요.',
 goals:['Update에서 R키를 누른 순간 위치를 (0, 0)으로 되돌린다','R이 아닌 키를 눌렀을 때는 위치가 그대로다'],
 limits:['키 이름은 KeyCode.R 이에요','transform.position = Vector3.zero; 로 위치를 바꿔요'],
 api:'Input.GetKeyDown, transform.position, Vector3.zero',
 starter:C`
using UnityEngine;

public class Respawn : MonoBehaviour
{
    void Update()
    {
        // R키를 누르면 처음 위치로 돌아가게 해 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Respawn : MonoBehaviour
{
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.R))
        {
            transform.position = Vector3.zero;
        }
    }
}`,
 rules:[has('GetKeyDown 사용',/\bInput\.GetKeyDown\s*\(\s*KeyCode\.R\s*\)/,'R키를 누른 순간을 확인했어요.','Input.GetKeyDown(KeyCode.R) 으로 R키를 누른 순간을 확인해 보세요.')],
 test:(api,ok)=>{
  const I=api.env.Input;let key='';
  I.GetKeyDown=k=>k===key;I.GetKey=k=>k===key;
  api.transform.position={x:5,y:3};
  key='';api.call('Update');
  ok('안 누르면 그대로',api.transform.position.x===5&&api.transform.position.y===3,'키를 누르지 않으면 위치가 그대로예요.','키를 누르지 않았는데 위치가 바뀌었어요. if로 R키를 눌렀을 때만 바꾸세요.');
  key='Return';api.call('Update');
  ok('다른 키',api.transform.position.x===5&&api.transform.position.y===3,'R이 아닌 키에는 반응하지 않아요.','R이 아닌 키에도 위치가 바뀌었어요. KeyCode.R만 확인해야 해요.');
  key='R';api.call('Update');
  ok('R키',api.transform.position.x===0&&api.transform.position.y===0,'R키를 누르면 (0, 0)으로 돌아가요.',`R키를 눌렀는데 위치가 (${api.transform.position.x}, ${api.transform.position.y}) 입니다. (0, 0)이어야 해요.`);
 },
 hints:['if (Input.GetKeyDown(KeyCode.R)) { ... } 안에서 위치를 바꿔요.','transform.position = Vector3.zero; 는 위치를 (0, 0, 0)으로 만들어요.','Update 밖이나 Start에 쓰면 처음 한 번만 실행돼요.'],
 why:'키 입력은 Update에서 매 프레임 확인하고, 한 번만 일어나야 하는 동작은 GetKeyDown을 써요. transform.position에 새 위치를 대입하면 오브젝트가 순간이동해요. 체크포인트나 리스폰의 가장 간단한 형태예요.',
 concepts:[['transform.position 대입','transform.position = 새 위치; 로 오브젝트를 그 위치로 즉시 옮긴다.'],['Vector3.zero','(0, 0, 0)을 나타내는 값. 원점 위치나 정지 상태를 나타낼 때 쓴다.']]});

/* ===== 같은 단계·같은 레벨의 비슷한 문제 (한 세트가 3문제가 되도록) ===== */
QB({id:'x16',cat:'start',stage:1,level:1,title:'몬스터 정보를 변수로 적기',
 story:'적으로 나올 몬스터의 정보를 변수로 만들어요. 이름, 공격력, 이동 속도, 보스인지 여부를 알맞은 자료형으로 적어 주세요.',
 goals:['string 형식의 monsterName, 값은 "슬라임"','int 형식의 attack, 값은 5','float 형식의 moveSpeed, 값은 1.5','bool 형식의 isBoss, 값은 false'],
 limits:['글자는 큰따옴표로 감싸요','float 값에는 f를 붙여요'],
 api:'int, float, string, bool',
 starter:C`
public class Monster
{
    // 몬스터 정보 변수 네 개를 만들어 보세요.
}`,
 solution:C`
public class Monster
{
    string monsterName = "슬라임";
    int attack = 5;
    float moveSpeed = 1.5f;
    bool isBoss = false;
}`,
 rules:[
  fx('이름(string)',(c,code)=>/\bstring\s+monsterName\s*=\s*"슬라임"\s*;/.test(code),'monsterName을 string으로 만들었어요.','string monsterName = "슬라임"; 처럼 쓰세요.'),
  has('공격력(int)',/\bint\s+attack\s*=\s*5\s*;/,'attack을 int로 만들었어요.','int attack = 5; 처럼 쓰세요.'),
  has('속도(float)',/\bfloat\s+moveSpeed\s*=\s*1\.5f\s*;/,'moveSpeed를 float로 만들었어요.','float moveSpeed = 1.5f; 처럼 쓰세요. f를 붙여요.'),
  has('보스 여부(bool)',/\bbool\s+isBoss\s*=\s*false\s*;/,'isBoss를 bool로 만들었어요.','bool isBoss = false; 처럼 쓰세요.')
 ],
 hints:['"형식 이름 = 값;" 순서로 써요.','정수는 int, 소수는 float, 글자는 string, 참/거짓은 bool이에요.','float 값에는 1.5f처럼 f를 붙여요.'],
 why:'값의 성격에 맞는 자료형을 고르는 것이 변수의 시작이에요. 같은 모양의 선언을 여러 번 써 보며 형식, 이름, 값의 순서를 손에 익혀요.',
 concepts:[['변수 선언','자료형 이름 = 값; 의 순서로 변수를 만든다.']]});

QB({id:'x17',cat:'start',stage:1,level:1,title:'스테이지 정보를 변수로 적기',
 story:'스테이지의 정보를 변수로 만들어요. 스테이지 이름, 번호, 제한 시간(초), 클리어 여부를 알맞은 자료형으로 적어 주세요.',
 goals:['string 형식의 stageName, 값은 "숲"','int 형식의 number, 값은 3','float 형식의 timeLimit, 값은 60.5','bool 형식의 cleared, 값은 false'],
 limits:['글자는 큰따옴표로 감싸요','float 값에는 f를 붙여요'],
 api:'int, float, string, bool',
 starter:C`
public class Stage
{
    // 스테이지 정보 변수 네 개를 만들어 보세요.
}`,
 solution:C`
public class Stage
{
    string stageName = "숲";
    int number = 3;
    float timeLimit = 60.5f;
    bool cleared = false;
}`,
 rules:[
  fx('이름(string)',(c,code)=>/\bstring\s+stageName\s*=\s*"숲"\s*;/.test(code),'stageName을 string으로 만들었어요.','string stageName = "숲"; 처럼 쓰세요.'),
  has('번호(int)',/\bint\s+number\s*=\s*3\s*;/,'number를 int로 만들었어요.','int number = 3; 처럼 쓰세요.'),
  has('제한 시간(float)',/\bfloat\s+timeLimit\s*=\s*60\.5f\s*;/,'timeLimit를 float로 만들었어요.','float timeLimit = 60.5f; 처럼 쓰세요. f를 붙여요.'),
  has('클리어(bool)',/\bbool\s+cleared\s*=\s*false\s*;/,'cleared를 bool로 만들었어요.','bool cleared = false; 처럼 쓰세요.')
 ],
 hints:['"형식 이름 = 값;" 순서로 써요.','번호는 정수라 int, 시간은 소수라 float이에요.','60.5f 처럼 f를 붙여요.'],
 why:'게임의 거의 모든 데이터는 이름, 숫자, 소수, 참/거짓 중 하나로 표현돼요. 무엇이 어떤 형식인지 고르는 연습이 이후 모든 코드의 바탕이에요.',
 concepts:[['자료형 선택','값이 정수인지 소수인지 글자인지 참/거짓인지에 따라 형식을 고른다.']]});

QB({id:'x18',cat:'start',stage:1,level:2,title:'방의 넓이 구하기',
 story:'맵 편집기에서 방의 가로와 세로 길이를 받아서 넓이를 구하려고 해요. 넓이는 가로 × 세로예요. 두 값을 받아 넓이를 돌려주는 메서드를 완성해 주세요.',
 goals:['Area(w, h)는 w × h 를 돌려준다','한 변이 0이면 0이다'],
 limits:['곱셈은 * 를 써요'],
 api:'*, return',
 starter:C`
int Area(int w, int h)
{
    // 넓이를 계산해서 돌려주세요.
    return 0;
}`,
 solution:C`
int Area(int w, int h)
{
    int result = w * h;
    return result;
}`,
 alts:[C`
int Area(int w, int h)
{
    return w * h;
}`],
 rules:[],
 test:(api,ok)=>{
  const a=(x,y)=>api.call('Area',x,y);
  ok('보통 방',a(4,6)===24,'4 × 6 = 24예요.',`Area(4, 6)이 ${a(4,6)} 입니다. 24여야 해요.`);
  ok('정사각형',a(5,5)===25,'5 × 5 = 25예요.',`Area(5, 5)가 ${a(5,5)} 입니다. 25여야 해요.`);
  ok('한 변이 0',a(0,9)===0,'한 변이 0이면 넓이도 0이에요.',`Area(0, 9)가 ${a(0,9)} 입니다. 0이어야 해요.`);
 },
 hints:['가로와 세로를 곱해요: w * h','계산 결과를 변수에 담았다가 return 해도 되고 바로 return 해도 돼요.','매개변수 이름은 그대로 사용해요.'],
 why:'매개변수로 받은 값을 식에 넣어 계산하고 return으로 돌려주는 것이 메서드의 기본 모양이에요. 같은 식에 다른 값을 넣어 여러 번 쓸 수 있어요.',
 concepts:[['매개변수와 반환','받은 값으로 계산해서 return으로 결과를 돌려준다.']]});

QB({id:'x19',cat:'start',stage:1,level:2,title:'세금 붙이기',
 story:'상점에서 물건 가격에 10% 세금이 붙어요. 가격을 받아서 세금을 더한 값을 돌려주는 메서드를 만들어요. 세금은 가격을 10으로 나눈 값이에요. 정수끼리 나누면 소수점 아래는 버려진다는 점에 유의하세요. 예를 들어 15에 대한 세금은 1이에요.',
 goals:['WithTax(price)는 price + price / 10 을 돌려준다'],
 limits:['정수 나눗셈이니 소수점 아래는 버려져요'],
 api:'/, +, return',
 starter:C`
int WithTax(int price)
{
    // 세금을 더한 가격을 돌려주세요.
    return price;
}`,
 solution:C`
int WithTax(int price)
{
    int tax = price / 10;
    return price + tax;
}`,
 rules:[],
 test:(api,ok)=>{
  const w=p=>api.call('WithTax',p);
  ok('1000원',w(1000)===1100,'1000원에 세금 100원이 붙어 1100원이에요.',`WithTax(1000)이 ${w(1000)} 입니다. 1100이어야 해요.`);
  ok('250원',w(250)===275,'250원에 세금 25원이 붙어 275원이에요.',`WithTax(250)이 ${w(250)} 입니다. 275여야 해요.`);
  ok('15원',w(15)===16,'15 / 10 은 1이라 16원이에요.',`WithTax(15)가 ${w(15)} 입니다. 16이어야 해요. 15 / 10 은 정수 나눗셈이라 1이에요.`);
 },
 hints:['세금은 price / 10 이에요.','가격에 세금을 더해서 돌려줘요.','정수끼리 나누면 15 / 10 은 1이 돼요.'],
 why:'정수 나눗셈은 소수점 아래를 버려요. 금액처럼 소수가 필요 없는 계산에서는 이 성질이 그대로 쓰이지만, 비율을 정확히 구해야 할 때는 float로 바꿔야 해요.',
 concepts:[['정수 나눗셈','int / int 는 몫만 남기고 소수점 아래는 버린다.']]});

QB({id:'x20',cat:'start',stage:1,level:3,title:'두 점수의 평균(소수점까지)',
 story:'두 판의 점수를 받아 평균을 구해요. 정수끼리 더해서 2로 나누면 소수점 아래가 사라져 3.5가 3이 되어 버려요. float로 바꿔서 소수점까지 정확한 평균을 돌려주세요.',
 goals:['Average(a, b)는 두 점수의 평균을 float로 돌려준다','3과 4의 평균은 3.5이다'],
 limits:['(float) 로 바꾸거나 2f 로 나눠요'],
 api:'(float) 형변환, 나눗셈',
 starter:C`
float Average(int a, int b)
{
    return (a + b) / 2;
}`,
 solution:C`
float Average(int a, int b)
{
    return (a + b) / 2f;
}`,
 alts:[C`
float Average(int a, int b)
{
    return (float)(a + b) / 2;
}`],
 rules:[],
 test:(api,ok)=>{
  const av=(a,b)=>api.call('Average',a,b);
  const near=(x,y)=>Math.abs(x-y)<0.001;
  ok('3과 4',near(av(3,4),3.5),'3과 4의 평균은 3.5예요.',`Average(3, 4)가 ${av(3,4)} 입니다. 3.5여야 해요. int끼리 나누면 소수점 아래가 사라져요.`);
  ok('같은 점수',near(av(10,10),10),'같은 점수의 평균은 그 점수예요.',`Average(10, 10)이 ${av(10,10)} 입니다. 10이어야 해요.`);
  ok('홀수 합',near(av(1,2),1.5),'1과 2의 평균은 1.5예요.',`Average(1, 2)가 ${av(1,2)} 입니다. 1.5여야 해요.`);
 },
 hints:['(a + b) / 2 는 둘 다 int라 소수점 아래가 버려져요.','나누는 수를 2f 로 바꾸면 float 나눗셈이 돼요.','또는 (float)(a + b) / 2 처럼 앞에 (float)를 붙여요.'],
 why:'계산에 float가 한쪽이라도 끼면 결과도 float가 돼요. 평균이나 비율처럼 소수점이 의미 있는 계산에서는 식 어디에서 float로 바뀌는지 확인하세요.',
 concepts:[['float 나눗셈','한쪽이라도 float이면 소수점까지 계산한다. 2f 또는 (float)로 바꾼다.']]});

QB({id:'x21',cat:'start',stage:1,level:3,title:'점수의 자릿수 더하기',
 story:'두 자리 점수 47을 보면 십의 자리는 4, 일의 자리는 7이에요. 두 자리를 더하면 11이에요. 정수 나눗셈(/)은 몫을, 나머지 연산자(%)는 나머지를 구해 주니, 이 둘로 자릿수를 나눌 수 있어요.',
 goals:['DigitSum(n)은 두 자리 이하 정수 n의 십의 자리와 일의 자리를 더해 돌려준다','한 자리 수(5)는 5이다'],
 limits:['십의 자리는 n / 10, 일의 자리는 n % 10 이에요'],
 api:'/, %',
 starter:C`
int DigitSum(int n)
{
    // 십의 자리와 일의 자리를 더해 보세요.
    return 0;
}`,
 solution:C`
int DigitSum(int n)
{
    int tens = n / 10;
    int ones = n % 10;
    return tens + ones;
}`,
 rules:[],
 test:(api,ok)=>{
  const d=n=>api.call('DigitSum',n);
  ok('47',d(47)===11,'4 + 7 = 11이에요.',`DigitSum(47)이 ${d(47)} 입니다. 11이어야 해요. 십의 자리는 47 / 10, 일의 자리는 47 % 10 이에요.`);
  ok('한 자리',d(5)===5,'한 자리 수는 그대로예요.',`DigitSum(5)가 ${d(5)} 입니다. 5여야 해요.`);
  ok('90',d(90)===9,'9 + 0 = 9예요.',`DigitSum(90)이 ${d(90)} 입니다. 9여야 해요.`);
  ok('99',d(99)===18,'9 + 9 = 18이에요.',`DigitSum(99)가 ${d(99)} 입니다. 18이어야 해요.`);
 },
 hints:['47 / 10 은 4, 47 % 10 은 7이에요.','십의 자리와 일의 자리를 각각 변수에 담으면 보기 쉬워요.','두 값을 더해서 return 해요.'],
 why:'/ 는 몫, % 는 나머지예요. 둘을 함께 쓰면 자릿수 분리, 시간 변환, 격자 좌표 계산 등 "나누어 담기"가 필요한 곳에 두루 쓸 수 있어요.',
 concepts:[['자릿수 분리','n / 10 은 십의 자리 이상, n % 10 은 일의 자리다.']]});

QB({id:'x22',cat:'start',stage:2,level:1,title:'짝수일까 홀수일까',
 story:'숫자를 받아서 "짝수" 또는 "홀수"를 알려 주는 메서드를 만들어요. 2로 나눈 나머지가 0이면 짝수예요. 조건에 따라 다른 글자를 돌려주려면 if를 써요.',
 goals:['Parity(n)은 n이 짝수이면 "짝수", 아니면 "홀수"를 돌려준다','0은 짝수이다'],
 limits:['if문을 사용해요','나머지는 n % 2 로 구해요'],
 api:'if, %, return',
 starter:C`
string Parity(int n)
{
    // 짝수인지 홀수인지 알려 주세요.
    return "";
}`,
 solution:C`
string Parity(int n)
{
    if (n % 2 == 0)
    {
        return "짝수";
    }
    return "홀수";
}`,
 rules:[has('if문 사용',/\bif\s*\(/,'if문으로 나눴어요.','if (n % 2 == 0) { ... } 처럼 if문을 써 보세요.')],
 test:(api,ok)=>{
  const p=n=>api.call('Parity',n);
  [[4,'짝수'],[7,'홀수'],[0,'짝수'],[1,'홀수'],[100,'짝수']].forEach(([n,e])=>ok(n,p(n)===e,`${n}은 ${e}예요.`,`Parity(${n})이 "${p(n)}" 입니다. "${e}"여야 해요.`));
 },
 hints:['2로 나눈 나머지가 0이면 짝수예요: n % 2 == 0','같은지 비교할 때는 = 가 아니라 == 를 써요.','if가 참일 때 "짝수"를 돌려주고, 아니면 "홀수"를 돌려줘요.'],
 why:'if문은 조건이 참일 때만 실행돼요. 같은지 비교하는 == 와 값을 넣는 = 를 헷갈리지 않는 것이 첫 번째 관문이에요.',
 concepts:[['== 와 =','== 는 같은지 비교하고, = 는 값을 넣는다.']]});

QB({id:'x23',cat:'start',stage:2,level:1,title:'합격인가요?',
 story:'시험 점수가 60점 이상이면 합격이에요. 점수를 받아서 합격이면 true, 아니면 false를 돌려주는 메서드를 만들어 주세요. 정확히 60점은 합격이에요.',
 goals:['IsPass(score)는 score가 60 이상이면 true를 돌려준다','60 미만이면 false를 돌려준다'],
 limits:['if문을 사용해요','"이상"은 >= 예요'],
 api:'if, >=, bool',
 starter:C`
bool IsPass(int score)
{
    // 합격이면 true, 아니면 false를 돌려주세요.
    return false;
}`,
 solution:C`
bool IsPass(int score)
{
    if (score >= 60)
    {
        return true;
    }
    return false;
}`,
 rules:[has('if문 사용',/\bif\s*\(/,'if문으로 나눴어요.','if (score >= 60) { ... } 처럼 if문을 써 보세요.')],
 test:(api,ok)=>{
  const f=s=>api.call('IsPass',s);
  [[100,true],[60,true],[59,false],[0,false]].forEach(([s,e])=>ok(s+'점',f(s)===e,`${s}점은 ${e?'합격':'불합격'}이에요.`,`IsPass(${s})가 ${f(s)} 입니다. ${e}여야 해요.${s===60?' 정확히 60점은 합격이라 >= 를 써야 해요.':''}`));
 },
 hints:['"60 이상"은 score >= 60 이에요.','조건이 참이면 true를, 아니면 false를 돌려줘요.','경계 값 60이 포함되는지 확인하세요.'],
 why:'기준 값 이상/초과/이하/미만은 >=, >, <=, < 로 구분해요. 경계 값이 어느 쪽에 들어가는지는 항상 먼저 확인할 것이에요.',
 concepts:[['경계 값','딱 기준 값일 때 어느 쪽으로 볼지 >= 와 > 로 정한다.']]});

QB({id:'x24',cat:'start',stage:2,level:2,title:'물의 상태 알려 주기',
 story:'과학 게임에서 온도에 따라 물의 상태를 보여 줘요. 0도 이하는 "얼음", 0도 초과 100도 미만은 "물", 100도 이상은 "수증기"예요. 온도를 받아서 상태를 글자로 돌려주세요. 경계 온도(0, 100)가 어느 쪽에 들어가는지 조심하세요.',
 goals:['State(t)는 0 이하면 "얼음", 100 미만이면 "물", 그 외에는 "수증기"를 돌려준다'],
 limits:['if / else if / else 를 사용해요'],
 api:'if, else if, else',
 starter:C`
string State(int t)
{
    // 온도에 맞는 상태를 돌려주세요.
    return "";
}`,
 solution:C`
string State(int t)
{
    if (t <= 0)
    {
        return "얼음";
    }
    else if (t < 100)
    {
        return "물";
    }
    else
    {
        return "수증기";
    }
}`,
 rules:[has('if문 사용',/\bif\s*\(/,'if문으로 나눴어요.','if / else if / else 로 구간을 나눠 보세요.')],
 test:(api,ok)=>{
  const s=t=>api.call('State',t);
  [[-10,'얼음'],[0,'얼음'],[1,'물'],[99,'물'],[100,'수증기'],[150,'수증기']].forEach(([t,e])=>ok(t+'도',s(t)===e,`${t}도는 ${e}예요.`,`State(${t})가 "${s(t)}" 입니다. "${e}"여야 해요.${t===0||t===100?' 경계 온도는 <= 와 < 의 차이를 확인하세요.':''}`));
 },
 hints:['작은 값부터 확인해요. 0 이하면 얼음이에요.','그다음 100 미만이면 물이에요.','나머지는 모두 수증기예요.'],
 why:'구간이 여러 개일 때는 한쪽 끝부터 걸러내요. 경계 값이 어느 구간에 들어가는지는 <= 와 < 로 정해져요.',
 concepts:[['구간 나누기','작은 값부터 차례로 조건을 걸러내면 나머지는 else로 처리된다.']]});

QB({id:'x25',cat:'start',stage:2,level:2,title:'체력 상태 알려 주기',
 story:'체력 바 색을 정하려고 해요. 체력 비율(%)이 25 이하이면 "위험", 60 이하이면 "주의", 그보다 높으면 "안전"이에요. 현재 체력과 최대 체력을 받아서 비율을 구한 뒤 상태를 돌려주세요. 비율은 hp * 100 / maxHp 로 구하면 정수 비율이 돼요.',
 goals:['HpState(hp, maxHp)는 비율이 25 이하면 "위험", 60 이하면 "주의", 그 외에는 "안전"을 돌려준다'],
 limits:['비율은 hp * 100 / maxHp 로 구해요'],
 api:'if, else if, 정수 계산',
 starter:C`
string HpState(int hp, int maxHp)
{
    // 체력 비율로 상태를 돌려주세요.
    return "";
}`,
 solution:C`
string HpState(int hp, int maxHp)
{
    int percent = hp * 100 / maxHp;
    if (percent <= 25)
    {
        return "위험";
    }
    else if (percent <= 60)
    {
        return "주의";
    }
    return "안전";
}`,
 rules:[],
 test:(api,ok)=>{
  const s=(a,b)=>api.call('HpState',a,b);
  [[10,100,'위험'],[25,100,'위험'],[26,100,'주의'],[60,100,'주의'],[61,100,'안전'],[50,200,'위험'],[200,200,'안전']].forEach(([h,m,e])=>ok(h+'/'+m,s(h,m)===e,`${h}/${m}은 "${e}"예요.`,`HpState(${h}, ${m})이 "${s(h,m)}" 입니다. "${e}"여야 해요.`));
 },
 hints:['먼저 hp * 100 / maxHp 로 비율을 구해 변수에 담아요.','작은 비율부터 확인해요. 25 이하는 위험이에요.','그다음 60 이하는 주의, 나머지는 안전이에요.'],
 why:'값을 비율로 바꾸고 구간으로 나누는 처리는 체력 바, 배터리 표시, 로딩 진행 등에 그대로 쓰여요.',
 concepts:[['비율 계산 후 구간 나누기','hp * 100 / maxHp 로 비율을 만든 뒤 if / else if 로 구간을 나눈다.']]});

QB({id:'x26',cat:'start',stage:2,level:3,title:'스킬을 쓸 수 있을까',
 story:'스킬을 쓰려면 마나가 비용 이상이어야 하고, 침묵 상태가 아니어야 하고, 기절 상태도 아니어야 해요. 마나, 비용, 침묵 여부, 기절 여부를 받아서 스킬을 쓸 수 있는지 돌려주세요.',
 goals:['CanCast(mp, cost, silenced, stunned)는 마나가 충분하고 침묵도 기절도 아닐 때만 true를 돌려준다'],
 limits:['&& 로 조건을 묶고, "아니다"는 ! 로 써요'],
 api:'&&, !',
 starter:C`
bool CanCast(int mp, int cost, bool silenced, bool stunned)
{
    // 스킬을 쓸 수 있으면 true를 돌려주세요.
    return false;
}`,
 solution:C`
bool CanCast(int mp, int cost, bool silenced, bool stunned)
{
    return mp >= cost && !silenced && !stunned;
}`,
 alts:[C`
bool CanCast(int mp, int cost, bool silenced, bool stunned)
{
    if (silenced) return false;
    if (stunned) return false;
    return mp >= cost;
}`],
 rules:[],
 test:(api,ok)=>{
  const c=(a,b,s,t)=>api.call('CanCast',a,b,s,t);
  ok('모두 만족',c(50,30,false,false)===true,'마나가 충분하고 상태 이상이 없으면 쓸 수 있어요.','마나가 충분하고 침묵도 기절도 아니면 true여야 해요.');
  ok('마나 딱 맞음',c(30,30,false,false)===true,'마나가 정확히 비용과 같아도 쓸 수 있어요.','마나가 비용과 같을 때도 true여야 해요. >= 를 쓰세요.');
  ok('마나 부족',c(29,30,false,false)===false,'마나가 모자라면 쓸 수 없어요.','마나가 비용보다 적으면 false여야 해요.');
  ok('침묵',c(100,30,true,false)===false,'침묵이면 쓸 수 없어요.','침묵 상태이면 false여야 해요.');
  ok('기절',c(100,30,false,true)===false,'기절이면 쓸 수 없어요.','기절 상태이면 false여야 해요.');
 },
 hints:['조건이 세 개이고 모두 만족해야 해요. && 로 이어요.','"침묵이 아니다"는 !silenced 로 써요.','마나 조건은 mp >= cost 예요.'],
 why:'&&는 모든 조건이 참일 때만 참이에요. ! 는 참/거짓을 뒤집어요. 여러 상태를 함께 따지는 "사용 가능 여부" 판정은 게임 코드에 늘 나와요.',
 concepts:[['! (아니다)','참/거짓을 뒤집는다. !silenced 는 침묵이 아니라는 뜻이다.']]});

QB({id:'x27',cat:'start',stage:2,level:3,title:'할인 받을 수 있나요',
 story:'카페 할인 규칙이에요. 쿠폰이 있으면 언제나 할인이에요. 쿠폰이 없으면 회원이면서 주말(토요일 6, 일요일 7)일 때만 할인이에요. 회원 여부, 요일 번호, 쿠폰 여부를 받아서 할인 가능한지 돌려주세요.',
 goals:['Discount(isMember, day, coupon)는 쿠폰이 있으면 true','쿠폰이 없으면 회원이면서 요일이 6 또는 7일 때만 true','그 외에는 false'],
 limits:['&& 와 || 를 괄호로 묶어요'],
 api:'&&, ||, ==',
 starter:C`
bool Discount(bool isMember, int day, bool coupon)
{
    // 할인이 가능하면 true를 돌려주세요.
    return false;
}`,
 solution:C`
bool Discount(bool isMember, int day, bool coupon)
{
    return coupon || (isMember && (day == 6 || day == 7));
}`,
 alts:[C`
bool Discount(bool isMember, int day, bool coupon)
{
    if (coupon)
    {
        return true;
    }
    return isMember && day >= 6;
}`],
 rules:[],
 test:(api,ok)=>{
  const d=(m,y,c)=>api.call('Discount',m,y,c);
  ok('쿠폰',d(false,2,true)===true,'쿠폰이 있으면 할인이에요.','쿠폰이 있으면 true여야 해요.');
  ok('회원 주말',d(true,7,false)===true,'회원이 일요일이면 할인이에요.','쿠폰이 없어도 회원이면서 주말(6 또는 7)이면 true여야 해요.');
  ok('회원 평일',d(true,3,false)===false,'회원이어도 평일이면 할인이 아니에요.','회원이어도 평일이면 false여야 해요.');
  ok('비회원 주말',d(false,6,false)===false,'비회원은 주말이어도 할인이 아니에요.','비회원은 주말이어도 쿠폰이 없으면 false여야 해요.');
  ok('아무것도 없음',d(false,1,false)===false,'아무 조건도 없으면 할인이 아니에요.','조건이 모두 없으면 false여야 해요.');
 },
 hints:['쿠폰이 있으면 바로 true예요. 이 경우는 || 로 이어요.','쿠폰이 없을 때는 "회원이면서 주말"이에요. 주말은 day == 6 || day == 7 이에요.','섞어 쓸 때는 괄호로 순서를 분명히 해요.'],
 why:'&&와 ||가 섞인 규칙은 문장으로 먼저 정리한 뒤 괄호로 묶어 옮기면 실수가 줄어요. 규칙을 문장 단위로 쪼개 보세요.',
 concepts:[['괄호로 우선순위','&&와 ||가 섞일 때는 괄호로 묶어 읽는 순서를 분명히 한다.']]});

QB({id:'x28',cat:'start',stage:3,level:1,title:'0부터 4까지 출력하기',
 story:'for 반복문의 i는 0부터 시작해서 하나씩 늘어나요. 0, 1, 2, 3, 4를 차례로 출력하는 메서드를 만들어 주세요. 반복문 안에서 i를 그대로 Debug.Log에 넣으면 돼요.',
 goals:['CountUp()을 부르면 0, 1, 2, 3, 4가 순서대로 출력된다','반복문을 사용한다'],
 limits:['5번 반복하는 for문을 사용해요'],
 api:'for, Debug.Log',
 starter:C`
void CountUp()
{
    // 0부터 4까지 출력하세요.
}`,
 solution:C`
void CountUp()
{
    for (int i = 0; i < 5; i++)
    {
        Debug.Log(i);
    }
}`,
 rules:[has('반복문 사용',/\b(?:for|while)\s*\(/,'반복문으로 출력했어요.','숫자를 하나씩 쓰지 말고 반복문을 써 보세요.')],
 test:(api,ok)=>{
  api.env.logs.length=0;api.call('CountUp');
  const L=api.env.logs.slice();
  ok('0~4',L.join(',')==='0,1,2,3,4','0, 1, 2, 3, 4가 순서대로 출력됐어요.',`출력이 ${JSON.stringify(L)} 입니다. 0, 1, 2, 3, 4 순서여야 해요.`);
 },
 hints:['i를 0에서 시작해 5보다 작을 때까지 반복해요: for (int i = 0; i < 5; i++)','반복문 안에서 Debug.Log(i); 를 써요.','i < 5 는 4까지 출력해요.'],
 why:'for의 변수 i는 반복할 때마다 값이 하나씩 바뀌어요. 이 값을 출력이나 계산에 쓰는 것이 반복문 활용의 시작이에요.',
 concepts:[['반복 변수 i','for가 한 번 돌 때마다 하나씩 변하는 값. 출력과 계산에 쓴다.']]});

QB({id:'x29',cat:'start',stage:3,level:1,title:'짝수만 출력하기',
 story:'2, 4, 6, 8, 10을 차례로 출력하는 메서드를 만들어요. i를 1씩 늘리지 않고 2씩 늘리면 한 번에 짝수만 건너뛰며 만들 수 있어요. i += 2 로 2씩 늘릴 수 있어요.',
 goals:['Evens()를 부르면 2, 4, 6, 8, 10이 순서대로 출력된다','반복문을 사용한다'],
 limits:['i를 2씩 늘려요'],
 api:'for, i += 2',
 starter:C`
void Evens()
{
    // 2, 4, 6, 8, 10을 출력하세요.
}`,
 solution:C`
void Evens()
{
    for (int i = 2; i <= 10; i += 2)
    {
        Debug.Log(i);
    }
}`,
 rules:[has('반복문 사용',/\b(?:for|while)\s*\(/,'반복문으로 출력했어요.','숫자를 하나씩 쓰지 말고 반복문을 써 보세요.')],
 test:(api,ok)=>{
  api.env.logs.length=0;api.call('Evens');
  const L=api.env.logs.slice();
  ok('짝수',L.join(',')==='2,4,6,8,10','2, 4, 6, 8, 10이 출력됐어요.',`출력이 ${JSON.stringify(L)} 입니다. 2, 4, 6, 8, 10 순서여야 해요.`);
 },
 hints:['i를 2에서 시작해 10 이하일 때까지 반복해요.','한 번 돌 때마다 i를 2씩 늘려요: i += 2','반복문 안에서 Debug.Log(i); 를 써요.'],
 why:'for의 세 번째 칸은 i++ 만이 아니에요. i += 2 처럼 원하는 만큼 늘리거나, i-- 처럼 줄일 수 있어요.',
 concepts:[['증가량 바꾸기','for의 마지막 칸에서 i += 2 처럼 한 번에 늘리는 양을 바꿀 수 있다.']]});

QB({id:'x30',cat:'start',stage:3,level:2,title:'팩토리얼 구하기',
 story:'n 팩토리얼은 1부터 n까지 모두 곱한 값이에요. 5 팩토리얼은 1 × 2 × 3 × 4 × 5 = 120이에요. 0과 1의 팩토리얼은 1로 약속해요. 반복문으로 곱해서 구해 주세요.',
 goals:['Factorial(n)은 1부터 n까지 모두 곱한 값을 돌려준다','n이 0이면 1이다','반복문을 사용한다'],
 limits:['곱을 담는 변수는 0이 아니라 1로 시작해야 해요'],
 api:'for, *=',
 starter:C`
int Factorial(int n)
{
    // 1부터 n까지 곱해 보세요.
    return 0;
}`,
 solution:C`
int Factorial(int n)
{
    int result = 1;
    for (int i = 1; i <= n; i++)
    {
        result *= i;
    }
    return result;
}`,
 rules:[has('반복문 사용',/\b(?:for|while)\s*\(/,'반복문으로 곱했어요.','공식을 쓰지 말고 반복문으로 하나씩 곱해 보세요.')],
 test:(api,ok)=>{
  const f=n=>api.call('Factorial',n);
  ok('5',f(5)===120,'5! = 120이에요.',`Factorial(5)가 ${f(5)} 입니다. 120이어야 해요.`);
  ok('0',f(0)===1,'0! = 1이에요.',`Factorial(0)이 ${f(0)} 입니다. 1이어야 해요. 곱셈은 1부터 시작해야 해요.`);
  ok('1',f(1)===1,'1! = 1이에요.',`Factorial(1)이 ${f(1)} 입니다. 1이어야 해요.`);
  ok('6',f(6)===720,'6! = 720이에요.',`Factorial(6)이 ${f(6)} 입니다. 720이어야 해요.`);
 },
 hints:['곱을 담는 변수는 1로 시작해요. 0으로 시작하면 계속 0이에요.','i를 1부터 n까지 돌며 result *= i; 로 곱해요.','반복문이 끝난 뒤 return result; 를 써요.'],
 why:'합계는 0에서, 곱은 1에서 시작해야 해요. 각 연산의 "아무것도 안 했을 때의 값"을 시작값으로 두면 빈 경우(n=0)도 자연스럽게 맞아요.',
 concepts:[['누적 곱','합계는 0, 곱은 1로 시작해서 반복마다 갱신한다.']]});

QB({id:'x31',cat:'start',stage:3,level:2,title:'제곱 계산하기',
 story:'base를 exp번 곱한 값을 구하는 메서드를 만들어요. 2의 10제곱은 1024예요. 곱하는 것을 exp번 반복하면 돼요. 0제곱은 1이에요.',
 goals:['Power(b, exp)는 b를 exp번 곱한 값을 돌려준다','exp가 0이면 1이다','반복문을 사용한다'],
 limits:['Mathf.Pow를 쓰지 않고 반복문으로 계산해요'],
 api:'for, *=',
 starter:C`
int Power(int b, int exp)
{
    // b를 exp번 곱해 보세요.
    return 0;
}`,
 solution:C`
int Power(int b, int exp)
{
    int result = 1;
    for (int i = 0; i < exp; i++)
    {
        result *= b;
    }
    return result;
}`,
 rules:[has('반복문 사용',/\b(?:for|while)\s*\(/,'반복문으로 곱했어요.','반복문으로 exp번 곱해 보세요.'),no('Mathf.Pow 금지',/\bMathf\.Pow\b/,'직접 곱해서 계산했어요.','이번에는 Mathf.Pow 없이 반복문으로 계산해 보세요.')],
 test:(api,ok)=>{
  const p=(a,b)=>api.call('Power',a,b);
  ok('2의 10제곱',p(2,10)===1024,'2의 10제곱은 1024예요.',`Power(2, 10)이 ${p(2,10)} 입니다. 1024여야 해요.`);
  ok('0제곱',p(5,0)===1,'아무리 큰 수도 0제곱은 1이에요.',`Power(5, 0)이 ${p(5,0)} 입니다. 1이어야 해요. 곱을 1로 시작하세요.`);
  ok('3의 3제곱',p(3,3)===27,'3의 3제곱은 27이에요.',`Power(3, 3)이 ${p(3,3)} 입니다. 27이어야 해요.`);
 },
 hints:['결과를 1로 시작해요.','exp번 반복하며 result *= b; 로 곱해요.','반복 횟수는 i < exp 로 정해요.'],
 why:'제곱은 같은 수를 반복해서 곱하는 일이에요. 반복 횟수를 입력값으로 정하고, 시작값을 연산에 맞게(곱은 1) 두는 것이 핵심이에요.',
 concepts:[['반복 횟수를 값으로 정하기','i < exp 처럼 매개변수로 받은 값을 반복 횟수에 쓴다.']]});

QB({id:'x32',cat:'start',stage:3,level:3,title:'양수 점수만 더하기',
 story:'점수 배열에는 감점(음수)도 섞여 있어요. 양수 점수만 골라서 모두 더하려고 해요. 배열을 하나씩 보면서 0보다 큰 값만 합계에 더해 주세요.',
 goals:['SumPositive(nums)는 배열에서 0보다 큰 값만 모두 더해 돌려준다','양수가 없거나 빈 배열이면 0이다','반복문과 if를 함께 사용한다'],
 limits:['합계를 담는 변수는 반복문 바깥에서 만들어요'],
 api:'foreach, if, +=',
 starter:C`
int SumPositive(int[] nums)
{
    // 양수만 골라서 더하세요.
    return 0;
}`,
 solution:C`
int SumPositive(int[] nums)
{
    int sum = 0;
    foreach (int x in nums)
    {
        if (x > 0)
        {
            sum += x;
        }
    }
    return sum;
}`,
 rules:[has('반복문 사용',/\b(?:for|foreach|while)\s*\(/,'반복문으로 하나씩 확인했어요.','배열의 값을 하나씩 확인하려면 반복문을 써요.')],
 test:(api,ok)=>{
  const s=a=>api.call('SumPositive',a);
  ok('섞인 값',s([1,-2,3])===4,'[1, -2, 3]에서 양수 1과 3의 합은 4예요.',`SumPositive([1, -2, 3])이 ${s([1,-2,3])} 입니다. 4여야 해요.`);
  ok('모두 음수',s([-1,-5])===0,'양수가 없으면 0이에요.',`SumPositive([-1, -5])가 ${s([-1,-5])} 입니다. 0이어야 해요.`);
  ok('빈 배열',s([])===0,'빈 배열은 0이에요.',`SumPositive([])가 ${s([])} 입니다. 0이어야 해요.`);
  ok('0은 제외',s([0,4,0])===4,'0은 양수가 아니라 더해도 달라지지 않아요.',`SumPositive([0, 4, 0])이 ${s([0,4,0])} 입니다. 4여야 해요.`);
 },
 hints:['합계 변수를 0으로 만들어 두어요.','foreach (int x in nums) 로 하나씩 꺼내요.','if (x > 0) 일 때만 sum += x; 를 해요.'],
 why:'반복문 안에서 조건을 걸어 일부만 모으는 "필터링 합계"는 점수, 아이템, 데미지 계산에 두루 쓰여요.',
 concepts:[['조건부 누적','반복 안에서 if로 조건에 맞는 값만 합계에 더한다.']]});

QB({id:'x33',cat:'start',stage:3,level:3,title:'기준보다 높은 점수 세기',
 story:'랭킹 점수 배열에서 기준 점수(limit)보다 높은 점수가 몇 개인지 세려고 해요. 기준과 같은 점수는 세지 않아요. 배열을 하나씩 보면서 limit보다 큰 값을 만날 때마다 개수를 늘려 주세요.',
 goals:['CountOver(nums, limit)는 배열에서 limit보다 큰 값의 개수를 돌려준다','limit과 같은 값은 세지 않는다','빈 배열이면 0이다'],
 limits:['개수를 담는 변수는 반복문 바깥에서 만들어요'],
 api:'foreach, if, count++',
 starter:C`
int CountOver(int[] nums, int limit)
{
    // limit보다 큰 값의 개수를 세어 보세요.
    return 0;
}`,
 solution:C`
int CountOver(int[] nums, int limit)
{
    int count = 0;
    foreach (int x in nums)
    {
        if (x > limit)
        {
            count++;
        }
    }
    return count;
}`,
 rules:[has('반복문 사용',/\b(?:for|foreach|while)\s*\(/,'반복문으로 하나씩 확인했어요.','배열의 값을 하나씩 확인하려면 반복문을 써요.')],
 test:(api,ok)=>{
  const c=(a,l)=>api.call('CountOver',a,l);
  ok('기준 15',c([10,20,30],15)===2,'[10, 20, 30]에서 15보다 큰 값은 2개예요.',`CountOver([10, 20, 30], 15)가 ${c([10,20,30],15)} 입니다. 2여야 해요.`);
  ok('같은 값 제외',c([5,5],5)===0,'기준과 같은 값은 세지 않아요.',`CountOver([5, 5], 5)가 ${c([5,5],5)} 입니다. 0이어야 해요. "보다 크다"는 > 예요.`);
  ok('빈 배열',c([],5)===0,'빈 배열은 0이에요.',`CountOver([], 5)가 ${c([],5)} 입니다. 0이어야 해요.`);
  ok('모두 큼',c([9,8,7],1)===3,'모두 기준보다 크면 전부 세요.',`CountOver([9, 8, 7], 1)이 ${c([9,8,7],1)} 입니다. 3이어야 해요.`);
 },
 hints:['개수를 담는 변수를 0으로 만들어 두어요.','foreach로 하나씩 꺼내 x > limit 인지 확인해요.','조건이 참일 때마다 count++ 로 하나씩 늘려요.'],
 why:'"조건을 만족하는 것의 개수 세기"는 누적 변수, 반복문, if의 가장 기본적인 조합이에요. 기준 값 자체를 포함하는지는 > 와 >= 로 정해요.',
 concepts:[['조건부 개수 세기','반복 안에서 if가 참일 때마다 count를 1씩 늘린다.']]});

QB({id:'x34',cat:'start',stage:4,level:1,title:'제목을 출력하는 메서드',
 story:'게임이 시작될 때 제목 줄을 보여 주고 싶어요. 제목 출력은 ShowTitle 메서드로 따로 만들고, Start에서 불러 주세요. ShowTitle은 돌려줄 값이 없으니 void예요. 제목은 "=== 훈련소 ===" 이에요.',
 goals:['"=== 훈련소 ==="를 출력하는 ShowTitle() 메서드를 만든다','Start()에서 ShowTitle()을 호출한다','Start를 실행하면 제목이 한 번 출력된다'],
 limits:['Debug.Log는 ShowTitle 안에만 써요'],
 api:'void, 메서드 정의와 호출',
 starter:C`
void Start()
{
    // 여기서 ShowTitle()을 불러 보세요.
}

// 여기에 ShowTitle 메서드를 만들어 보세요.
`,
 solution:C`
void Start()
{
    ShowTitle();
}

void ShowTitle()
{
    Debug.Log("=== 훈련소 ===");
}`,
 rules:[
  has('ShowTitle 만들기',/\bvoid\s+ShowTitle\s*\(\s*\)\s*\{/,'void ShowTitle() 메서드를 만들었어요.','void ShowTitle() { ... } 형태로 메서드를 만들어 보세요.'),
  inFn('Start에서 부르기','Start',/\bShowTitle\s*\(\s*\)\s*;/,'Start에서 ShowTitle()을 불렀어요.','Start 안에서 ShowTitle(); 을 써서 불러 보세요.')
 ],
 test:(api,ok)=>{
  api.env.logs.length=0;api.call('Start');
  const L=api.env.logs.slice();
  ok('한 번 출력',L.length===1&&L[0]==='=== 훈련소 ===','제목이 한 번 출력돼요.',`Start를 실행했더니 출력이 ${JSON.stringify(L)} 입니다. "=== 훈련소 ==="가 한 번만 나와야 해요.`);
 },
 hints:['메서드를 만드는 모양: void 이름() { 할 일 }','메서드를 부르는 모양: 이름();','만든 메서드를 Start 안에서 불러야 시작할 때 실행돼요.'],
 why:'메서드를 만드는 것(정의)과 쓰는 것(호출)은 별개예요. 이름을 붙여 코드를 나누어 두면 Start가 무슨 일을 하는지 한눈에 보여요.',
 concepts:[['메서드 호출','이름(); 으로 만들어 둔 메서드를 실행한다.']]});

QB({id:'x35',cat:'start',stage:4,level:1,title:'두 배로 만들기',
 story:'아이템을 먹으면 점수가 두 배가 돼요. 숫자를 받아서 두 배로 만들어 돌려주는 메서드를 만들어 주세요. 이번에는 직접 메서드를 정의해야 해요. 받은 값과 돌려줄 값이 모두 정수예요.',
 goals:['int 값을 받아 두 배를 돌려주는 Double(n) 메서드를 만든다'],
 limits:['반환 형식은 int예요'],
 api:'메서드 정의, return',
 starter:C`
// 여기에 Double 메서드를 만들어 보세요.
`,
 solution:C`
int Double(int n)
{
    return n * 2;
}`,
 rules:[has('Double 만들기',/\bint\s+Double\s*\(\s*int\s+\w+\s*\)/,'int Double(int n) 형태로 만들었어요.','int Double(int n) { ... } 처럼 반환 형식과 매개변수를 써서 만들어 보세요.')],
 test:(api,ok)=>{
  const d=n=>api.call('Double',n);
  ok('5',d(5)===10,'5의 두 배는 10이에요.',`Double(5)가 ${d(5)} 입니다. 10이어야 해요.`);
  ok('0',d(0)===0,'0의 두 배는 0이에요.',`Double(0)이 ${d(0)} 입니다. 0이어야 해요.`);
  ok('음수',d(-3)===-6,'-3의 두 배는 -6이에요.',`Double(-3)이 ${d(-3)} 입니다. -6이어야 해요.`);
 },
 hints:['메서드 모양: 반환형식 이름(매개변수) { 할 일 }','돌려줄 값이 정수이니 앞에 int를 써요.','return n * 2; 로 돌려줘요.'],
 why:'메서드를 만들 때는 무엇을 받고(매개변수) 무엇을 돌려줄지(반환 형식) 먼저 정해요. 이 두 가지가 메서드의 "모양"이에요.',
 concepts:[['메서드의 모양','반환형식 이름(매개변수) { ... } 에서 받는 값과 돌려줄 값을 정한다.']]});

QB({id:'x36',cat:'start',stage:4,level:2,title:'퍼센트 할인 계산',
 story:'가격과 할인율(%)을 받아서 할인된 가격을 돌려주는 메서드를 만들어요. 할인액은 price * percent / 100 이에요. 정수 계산이라 소수점 아래는 버려져요.',
 goals:['Discounted(price, percent)는 price에서 할인액(price * percent / 100)을 뺀 값을 돌려준다','할인율이 0이면 가격 그대로이다'],
 limits:['정수 계산이니 소수점 아래는 버려져요'],
 api:'매개변수, *, /, return',
 starter:C`
int Discounted(int price, int percent)
{
    // 할인된 가격을 돌려주세요.
    return price;
}`,
 solution:C`
int Discounted(int price, int percent)
{
    int off = price * percent / 100;
    return price - off;
}`,
 rules:[],
 test:(api,ok)=>{
  const d=(a,b)=>api.call('Discounted',a,b);
  ok('20% 할인',d(1000,20)===800,'1000원의 20% 할인은 800원이에요.',`Discounted(1000, 20)이 ${d(1000,20)} 입니다. 800이어야 해요.`);
  ok('소수점 버림',d(999,10)===900,'999원의 10%는 99.9지만 정수라 99, 결과는 900원이에요.',`Discounted(999, 10)이 ${d(999,10)} 입니다. 900이어야 해요. 할인액 99.9는 정수 계산에서 99가 돼요.`);
  ok('할인 없음',d(500,0)===500,'할인율이 0이면 그대로예요.',`Discounted(500, 0)이 ${d(500,0)} 입니다. 500이어야 해요.`);
 },
 hints:['할인액은 price * percent / 100 이에요.','곱셈을 먼저 하고 나눠야 값이 정확해요.','가격에서 할인액을 빼서 돌려줘요.'],
 why:'곱하고 나누는 순서가 정수 계산의 정확도를 좌우해요. percent / 100 을 먼저 계산하면 0이 되어 버려서, 곱셈을 먼저 하는 것이 중요해요.',
 concepts:[['곱셈 먼저','정수 계산에서 비율을 구할 때는 곱한 뒤에 나눈다.']]});

QB({id:'x37',cat:'start',stage:4,level:2,title:'레벨업 판정',
 story:'레벨업에 필요한 경험치는 현재 레벨 × 100이에요. 레벨 3이면 300 경험치가 필요해요. 현재 레벨과 경험치를 받아서, 경험치가 필요량 이상이면 레벨을 1 올려 돌려주고 아니면 그대로 돌려주세요.',
 goals:['NextLevel(level, exp)는 exp가 level × 100 이상이면 level + 1을 돌려준다','그렇지 않으면 level을 돌려준다'],
 limits:['필요한 경험치는 level * 100 이에요'],
 api:'매개변수, if, return',
 starter:C`
int NextLevel(int level, int exp)
{
    // 레벨업 판정 후의 레벨을 돌려주세요.
    return level;
}`,
 solution:C`
int NextLevel(int level, int exp)
{
    int need = level * 100;
    if (exp >= need)
    {
        return level + 1;
    }
    return level;
}`,
 rules:[],
 test:(api,ok)=>{
  const n=(a,b)=>api.call('NextLevel',a,b);
  ok('경험치 충분',n(3,350)===4,'레벨 3에 350 경험치면 레벨 4예요.',`NextLevel(3, 350)이 ${n(3,350)} 입니다. 4여야 해요.`);
  ok('딱 맞음',n(3,300)===4,'정확히 300이면 레벨업이에요.',`NextLevel(3, 300)이 ${n(3,300)} 입니다. 4여야 해요. >= 를 쓰세요.`);
  ok('모자람',n(3,299)===3,'299는 모자라서 그대로예요.',`NextLevel(3, 299)가 ${n(3,299)} 입니다. 3이어야 해요.`);
  ok('0 경험치',n(1,0)===1,'경험치가 0이면 그대로예요.',`NextLevel(1, 0)이 ${n(1,0)} 입니다. 1이어야 해요.`);
 },
 hints:['필요한 경험치는 level * 100 이에요.','exp가 필요량 이상이면 level + 1을 돌려줘요.','아니면 level을 그대로 돌려줘요.'],
 why:'메서드가 받은 값으로 계산(필요량)하고 판단(이상인가)하고 결과를 돌려주는, 작지만 완결된 흐름이에요. 이런 작은 메서드가 모여 게임 규칙이 돼요.',
 concepts:[['계산 후 판단','값을 계산한 뒤 if로 판단하고 결과를 return으로 돌려준다.']]});

QB({id:'x38',cat:'start',stage:4,level:3,title:'세금과 쿠폰이 있는 총 가격',
 story:'세금 계산 Tax 메서드는 이미 만들어져 있어요. 총 가격은 가격에 세금을 더한 값이고, 쿠폰이 있으면 500원을 빼요. 총 가격이 0 아래로 내려가면 0이에요. Total 메서드에서 Tax를 불러 주세요.',
 goals:['Total(price, coupon)은 Tax(price)를 불러 price + 세금을 구한다','coupon이 true이면 500을 뺀다','결과가 음수면 0을 돌려준다'],
 limits:['Tax는 고치지 않고 Total 안에서 호출해요'],
 api:'메서드 호출, if',
 starter:C`
int Tax(int price)
{
    return price / 10;
}

int Total(int price, bool coupon)
{
    // Tax를 불러서 총 가격을 돌려주세요.
    return 0;
}`,
 solution:C`
int Tax(int price)
{
    return price / 10;
}

int Total(int price, bool coupon)
{
    int sum = price + Tax(price);
    if (coupon)
    {
        sum = sum - 500;
    }
    if (sum < 0)
    {
        sum = 0;
    }
    return sum;
}`,
 rules:[inFn('Tax 호출','Total',/\bTax\s*\(/,'Total 안에서 Tax를 불렀어요.','세금을 직접 계산하지 말고 Tax(price)를 불러 보세요.')],
 test:(api,ok)=>{
  const t=(p,c)=>api.call('Total',p,c);
  ok('쿠폰 없음',t(1000,false)===1100,'1000원에 세금 100원, 총 1100원이에요.',`Total(1000, false)가 ${t(1000,false)} 입니다. 1100이어야 해요.`);
  ok('쿠폰 있음',t(1000,true)===600,'1100원에서 쿠폰 500원을 빼면 600원이에요.',`Total(1000, true)가 ${t(1000,true)} 입니다. 600이어야 해요.`);
  ok('음수 방지',t(300,true)===0,'330원에서 500원을 빼면 음수라 0원이에요.',`Total(300, true)가 ${t(300,true)} 입니다. 0이어야 해요. 음수가 되면 0으로 바꿔 주세요.`);
 },
 hints:['먼저 price + Tax(price) 를 구해요.','coupon이 true이면 500을 빼요.','마지막에 0보다 작으면 0으로 바꿔서 돌려줘요.'],
 why:'이미 만든 메서드를 불러 쓰면 세금 규칙이 바뀌어도 Tax 한 곳만 고치면 돼요. 작은 메서드를 엮어 큰 규칙을 만드는 습관을 길러요.',
 concepts:[['메서드 재사용','이미 있는 메서드를 불러서 같은 계산을 다시 쓰지 않는다.']]});

QB({id:'x39',cat:'start',stage:4,level:3,title:'짝수 판별 메서드로 개수 세기',
 story:'IsEven 메서드는 이미 만들어져 있어요. 1부터 n까지의 수 중 짝수가 몇 개인지 세는 CountEvenTo 메서드를 만들어 주세요. 반복문 안에서 IsEven을 불러서 판단해요.',
 goals:['CountEvenTo(n)은 1부터 n까지 중 짝수의 개수를 돌려준다','판단은 IsEven을 불러서 한다','n이 0이면 0이다'],
 limits:['% 로 직접 짝수를 따지지 않고 IsEven을 불러요'],
 api:'for, 메서드 호출, if',
 starter:C`
bool IsEven(int n)
{
    return n % 2 == 0;
}

int CountEvenTo(int n)
{
    // 1부터 n까지 짝수의 개수를 세어 보세요.
    return 0;
}`,
 solution:C`
bool IsEven(int n)
{
    return n % 2 == 0;
}

int CountEvenTo(int n)
{
    int count = 0;
    for (int i = 1; i <= n; i++)
    {
        if (IsEven(i))
        {
            count++;
        }
    }
    return count;
}`,
 rules:[inFn('IsEven 호출','CountEvenTo',/\bIsEven\s*\(/,'CountEvenTo 안에서 IsEven을 불렀어요.','직접 % 로 따지지 말고 IsEven(i)을 불러 보세요.')],
 test:(api,ok)=>{
  const c=n=>api.call('CountEvenTo',n);
  ok('10까지',c(10)===5,'1~10에는 짝수가 5개예요.',`CountEvenTo(10)이 ${c(10)} 입니다. 5여야 해요.`);
  ok('1까지',c(1)===0,'1에는 짝수가 없어요.',`CountEvenTo(1)이 ${c(1)} 입니다. 0이어야 해요.`);
  ok('0',c(0)===0,'0이면 0개예요.',`CountEvenTo(0)이 ${c(0)} 입니다. 0이어야 해요.`);
  ok('7까지',c(7)===3,'1~7에는 짝수가 3개(2, 4, 6)예요.',`CountEvenTo(7)이 ${c(7)} 입니다. 3이어야 해요.`);
 },
 hints:['개수를 담는 변수를 반복문 바깥에 만들어요.','i를 1부터 n까지 돌며 IsEven(i)가 true인지 확인해요.','true일 때마다 count++ 를 해요.'],
 why:'반복문, 조건문, 메서드 호출이 한 번에 모이는 문제예요. 판단을 별도의 메서드로 빼 두면 반복문이 "무엇을 센다"만 보여서 읽기 쉬워요.',
 concepts:[['반복문 안에서 메서드 호출','판단 규칙을 메서드로 빼 두고 반복문에서 불러 쓴다.']]});

QB({id:'x40',cat:'start',stage:5,level:1,title:'시작할 때 이름 부르기',
 story:'게임이 시작될 때 플레이어 이름을 콘솔에 보여 줘요. playerName 변수에 "용사"가 들어 있어요. Start에서 "이름: 용사"처럼 출력해 주세요. 이름을 글자에 직접 쓰지 말고 변수를 이어 붙여야 이름이 바뀌어도 맞아요.',
 goals:['Start에서 "이름: " 뒤에 playerName 변수 값을 이어 붙여 출력한다','playerName이 "용사"이면 "이름: 용사"가 출력된다'],
 limits:['"이름: 용사"를 통째로 쓰지 않고 playerName 변수를 이어 붙여요'],
 api:'Start, Debug.Log, string +',
 starter:C`
using UnityEngine;

public class Intro : MonoBehaviour
{
    public string playerName = "용사";

    void Start()
    {
        // 이름을 출력해 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Intro : MonoBehaviour
{
    public string playerName = "용사";

    void Start()
    {
        Debug.Log("이름: " + playerName);
    }
}`,
 rules:[inFn('변수 이어 붙이기','Start',/\bDebug\.Log\s*\(\s*""\s*\+\s*playerName\s*\)/,'playerName 변수를 이어 붙여 출력해요.','Debug.Log("이름: " + playerName); 처럼 글자와 변수를 +로 이어 붙여 보세요.')],
 test:(api,ok)=>{
  api.env.logs.length=0;api.call('Start');
  const L=api.env.logs.slice();
  ok('이름 출력',L.length===1&&L[0]==='이름: 용사','"이름: 용사"가 한 번 출력돼요.',`출력이 ${JSON.stringify(L)} 입니다. "이름: 용사"가 한 번 나와야 해요.`);
  api.set('playerName','마법사');api.env.logs.length=0;api.call('Start');
  ok('이름이 바뀌면',api.env.logs[0]==='이름: 마법사','이름이 바뀌면 출력도 바뀌어요.',`이름을 "마법사"로 바꿨는데 "${api.env.logs[0]}"가 출력됐어요. 변수를 이어 붙였는지 확인하세요.`);
 },
 hints:['글자와 변수를 + 로 이어 붙여요: "이름: " + playerName','Debug.Log(...) 안에 이어 붙인 값을 넣어요.','이름을 통째로 쓰면 값이 바뀔 때 틀려요.'],
 why:'변수와 글자를 이어 붙여 출력하면 현재 값을 콘솔에서 바로 확인할 수 있어요. 코드가 의도대로 움직이는지 확인하는 가장 흔한 방법이에요.',
 concepts:[['변수 값 출력','Debug.Log("이름: " + 변수) 로 변수의 현재 값을 확인한다.']]});

QB({id:'x41',cat:'start',stage:5,level:1,title:'시작할 때 두 줄 출력하기',
 story:'게임이 시작될 때 콘솔에 "로딩 완료"를 먼저 출력하고, 이어서 "게임 시작"을 출력하고 싶어요. 코드는 위에서 아래로 차례로 실행되니 순서대로 쓰면 돼요.',
 goals:['Start에서 "로딩 완료"를 먼저 출력한다','이어서 "게임 시작"을 출력한다'],
 limits:['Update가 아니라 Start에 써요','두 줄이 정확히 한 번씩만 나와야 해요'],
 api:'Start, Debug.Log',
 starter:C`
using UnityEngine;

public class Boot : MonoBehaviour
{
    void Start()
    {
        // 두 줄을 차례로 출력해 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Boot : MonoBehaviour
{
    void Start()
    {
        Debug.Log("로딩 완료");
        Debug.Log("게임 시작");
    }
}`,
 rules:[inFn('Start에서 출력','Start',/\bDebug\.Log\s*\(\s*""\s*\)\s*;/,'Start에서 출력해요.','Start 안에 Debug.Log("..."); 를 써 보세요.')],
 test:(api,ok)=>{
  api.env.logs.length=0;api.call('Start');
  const L=api.env.logs.slice();
  ok('두 줄',L.length===2&&L[0]==='로딩 완료'&&L[1]==='게임 시작','"로딩 완료", "게임 시작" 순서로 출력돼요.',`출력이 ${JSON.stringify(L)} 입니다. "로딩 완료", "게임 시작" 순서로 두 줄이 나와야 해요.`);
 },
 hints:['Debug.Log("글자"); 한 줄이 출력 한 줄이에요.','순서대로 두 줄을 써요.','줄 끝의 세미콜론 ; 을 빠뜨리지 마세요.'],
 why:'코드는 위에서 아래로 차례로 실행돼요. Start 안에 쓴 순서가 곧 실행 순서이고, 콘솔의 출력 순서예요.',
 concepts:[['실행 순서','코드는 위에서 아래로 차례로 실행된다.']]});

QB({id:'x42',cat:'start',stage:5,level:2,title:'위로 떠오르는 풍선',
 story:'풍선이 위로 천천히 떠올라요. Update에서 매 프레임 위쪽(Vector3.up)으로 조금씩 움직이는데, 컴퓨터 성능과 상관없이 초당 같은 거리를 가도록 Time.deltaTime을 곱해 주세요. 속도는 초당 1.5예요.',
 goals:['speed(float, 기본값 1.5)를 선언한다','Update에서 위쪽으로 speed × Time.deltaTime 만큼 움직인다','1초가 지나면 y가 약 1.5만큼 올라간다'],
 limits:['위쪽은 Vector3.up 이에요','이동량에 Time.deltaTime을 곱해요'],
 api:'Update, Time.deltaTime, Vector3.up',
 starter:C`
using UnityEngine;

public class Balloon : MonoBehaviour
{
    public float speed = 1.5f;

    void Update()
    {
        // 위로 떠오르게 해 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Balloon : MonoBehaviour
{
    public float speed = 1.5f;

    void Update()
    {
        transform.Translate(Vector3.up * speed * Time.deltaTime);
    }
}`,
 alts:[C`
using UnityEngine;

public class Balloon : MonoBehaviour
{
    public float speed = 1.5f;

    void Update()
    {
        transform.position += Vector3.up * speed * Time.deltaTime;
    }
}`],
 rules:[has('Time.deltaTime 사용',/\bTime\.deltaTime\b/,'이동량에 Time.deltaTime을 곱했어요.','이동량에 Time.deltaTime을 곱해야 프레임 속도와 상관없이 같은 속도로 떠올라요.')],
 test:(api,ok)=>{
  for(let i=0;i<60;i++)api.call('Update');
  const x=api.transform.position.x,y=api.transform.position.y;
  ok('1초 이동',Math.abs(y-1.5)<0.05,'1초(60프레임) 동안 y가 약 1.5만큼 올라갔어요.',`60프레임이 지난 뒤 y가 ${y.toFixed(2)} 입니다. 약 1.5여야 해요. 프레임마다 speed × Time.deltaTime 만큼 움직여야 해요.`);
  ok('위로만',Math.abs(x)<1e-6,'옆으로는 움직이지 않아요.',`x가 ${x.toFixed(2)} 입니다. 위쪽(y 방향)으로만 움직여야 해요.`);
 },
 hints:['Vector3.up 은 위쪽 방향이에요. 방향 × 속도 × 시간이 이동량이에요.','transform.Translate(이동량) 은 현재 위치에서 이동량만큼 움직여요.','Time.deltaTime을 빼면 컴퓨터가 빠를수록 빨리 올라가요.'],
 why:'방향 벡터에 속도와 Time.deltaTime을 곱하는 것이 시간에 따른 이동의 기본 식이에요. 방향만 바꾸면 위, 아래, 좌, 우 어디로든 같은 식으로 움직일 수 있어요.',
 concepts:[['방향 × 속도 × 시간','이동량은 방향 벡터에 속도와 Time.deltaTime을 곱해서 구한다.']]});

QB({id:'x43',cat:'start',stage:5,level:2,title:'왼쪽으로 걷는 적',
 story:'적이 오른쪽에서 왼쪽으로 걸어와요. Update에서 왼쪽(Vector3.left)으로 이동하되 Time.deltaTime을 곱해 컴퓨터가 달라도 같은 속도가 되게 해 주세요. 속도는 초당 3이에요.',
 goals:['speed(float, 기본값 3)를 선언한다','Update에서 왼쪽으로 speed × Time.deltaTime 만큼 움직인다','1초가 지나면 x가 약 -3이 된다'],
 limits:['왼쪽은 Vector3.left 예요','이동량에 Time.deltaTime을 곱해요'],
 api:'Update, Time.deltaTime, Vector3.left',
 starter:C`
using UnityEngine;

public class Enemy : MonoBehaviour
{
    public float speed = 3f;

    void Update()
    {
        // 왼쪽으로 걷게 해 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Enemy : MonoBehaviour
{
    public float speed = 3f;

    void Update()
    {
        transform.Translate(Vector3.left * speed * Time.deltaTime);
    }
}`,
 rules:[has('Time.deltaTime 사용',/\bTime\.deltaTime\b/,'이동량에 Time.deltaTime을 곱했어요.','이동량에 Time.deltaTime을 곱하지 않으면 컴퓨터 성능에 따라 속도가 달라져요.')],
 test:(api,ok)=>{
  for(let i=0;i<60;i++)api.call('Update');
  const x=api.transform.position.x,y=api.transform.position.y;
  ok('1초 이동',Math.abs(x+3)<0.05,'1초(60프레임) 동안 x가 약 -3만큼 움직였어요.',`60프레임이 지난 뒤 x가 ${x.toFixed(2)} 입니다. 약 -3이어야 해요. 왼쪽은 Vector3.left, 프레임마다 speed × Time.deltaTime 만큼이에요.`);
  ok('옆으로만',Math.abs(y)<1e-6,'위아래로는 움직이지 않아요.',`y가 ${y.toFixed(2)} 입니다. 왼쪽으로만 움직여야 해요.`);
 },
 hints:['Vector3.left 는 왼쪽 방향이에요.','이동량은 방향 × speed × Time.deltaTime 이에요.','transform.Translate(이동량) 으로 움직여요.'],
 why:'방향 벡터만 Vector3.right에서 Vector3.left로 바꾸면 반대쪽으로 움직여요. 속도와 Time.deltaTime을 곱하는 식은 그대로예요.',
 concepts:[['방향 벡터','Vector3.right, left, up, down 은 각 방향의 길이 1짜리 벡터다.']]});

QB({id:'x44',cat:'start',stage:5,level:3,title:'D키를 누르는 동안 오른쪽으로',
 story:'D 키를 누르고 있는 동안만 캐릭터가 오른쪽으로 걸어가요. 점프처럼 누른 순간 한 번이 아니라, 누르고 있는 동안 매 프레임 움직여야 해요. 그럴 때는 Input.GetKey를 쓰고, 이동에는 Time.deltaTime을 곱해요. 속도는 초당 4예요.',
 goals:['speed(float, 기본값 4)를 선언한다','D키를 누르고 있는 동안 오른쪽으로 speed × Time.deltaTime 만큼 움직인다','누르지 않으면 움직이지 않는다'],
 limits:['누르고 있는 동안은 Input.GetKey, 키 이름은 KeyCode.D 예요'],
 api:'Input.GetKey, KeyCode.D, Time.deltaTime',
 starter:C`
using UnityEngine;

public class Runner : MonoBehaviour
{
    public float speed = 4f;

    void Update()
    {
        // D키를 누르고 있는 동안 오른쪽으로 걷게 해 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Runner : MonoBehaviour
{
    public float speed = 4f;

    void Update()
    {
        if (Input.GetKey(KeyCode.D))
        {
            transform.Translate(Vector3.right * speed * Time.deltaTime);
        }
    }
}`,
 rules:[has('GetKey 사용',/\bInput\.GetKey\s*\(\s*KeyCode\.D\s*\)/,'D키를 누르고 있는 동안을 확인했어요.','Input.GetKey(KeyCode.D) 로 누르고 있는 동안을 확인해 보세요.'),has('Time.deltaTime 사용',/\bTime\.deltaTime\b/,'이동량에 Time.deltaTime을 곱했어요.','이동량에 Time.deltaTime을 곱해야 해요.')],
 test:(api,ok)=>{
  const I=api.env.Input;let held=false;
  I.GetKey=k=>k==='D'&&held;I.GetKeyDown=k=>false;
  held=false;for(let i=0;i<30;i++)api.call('Update');
  ok('안 누르면 정지',Math.abs(api.transform.position.x)<1e-6,'키를 누르지 않으면 움직이지 않아요.',`키를 누르지 않았는데 x가 ${api.transform.position.x.toFixed(2)}가 됐어요. if로 D키를 누를 때만 움직이게 하세요.`);
  held=true;for(let i=0;i<60;i++)api.call('Update');
  const x=api.transform.position.x;
  ok('1초 동안 누름',Math.abs(x-4)<0.05,'1초 동안 누르고 있으면 약 4만큼 움직여요.',`1초 동안 눌렀더니 x가 ${x.toFixed(2)} 입니다. 약 4여야 해요. 누르고 있는 동안은 GetKey(GetKeyDown은 누른 순간 한 프레임만)이고, 이동에는 Time.deltaTime을 곱해요.`);
 },
 hints:['if (Input.GetKey(KeyCode.D)) { ... } 안에서 움직여요.','GetKey는 누르고 있는 동안 계속 true, GetKeyDown은 누른 순간 한 번만 true예요.','이동량은 Vector3.right * speed * Time.deltaTime 이에요.'],
 why:'이동처럼 이어지는 동작은 GetKey, 점프나 발사처럼 한 번만 일어나는 동작은 GetKeyDown을 써요. 두 가지의 차이를 구분하는 것이 입력 처리의 핵심이에요.',
 concepts:[['GetKey와 GetKeyDown','GetKey는 누르고 있는 동안, GetKeyDown은 누른 순간 한 프레임만 true다.']]});

QB({id:'x45',cat:'start',stage:5,level:3,title:'스페이스를 누를 때마다 점수 올리기',
 story:'스페이스 키를 누를 때마다 점수가 1점씩 올라가고, 올라간 점수를 "점수: 3"처럼 출력해요. 키를 누르고 있어도 한 번 누른 것으로 쳐야 해요. 누른 순간만 true인 Input.GetKeyDown을 써 주세요.',
 goals:['score(int, 기본값 0)를 선언한다','스페이스를 누른 순간 score를 1 올리고 "점수: " 뒤에 score를 붙여 출력한다','누르고 있는 동안에는 한 번만 오른다'],
 limits:['누른 순간만 확인하는 Input.GetKeyDown을 써요'],
 api:'Input.GetKeyDown, score++, Debug.Log',
 starter:C`
using UnityEngine;

public class Counter : MonoBehaviour
{
    public int score = 0;

    void Update()
    {
        // 스페이스를 누를 때마다 점수를 올려 보세요.
    }
}`,
 solution:C`
using UnityEngine;

public class Counter : MonoBehaviour
{
    public int score = 0;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            score++;
            Debug.Log("점수: " + score);
        }
    }
}`,
 rules:[has('GetKeyDown 사용',/\bInput\.GetKeyDown\s*\(\s*KeyCode\.Space\s*\)/,'스페이스를 누른 순간을 확인했어요.','Input.GetKeyDown(KeyCode.Space) 으로 누른 순간을 확인해 보세요.')],
 test:(api,ok)=>{
  const I=api.env.Input;let held=false,down=false;
  I.GetKeyDown=k=>k==='Space'&&down;I.GetKey=k=>k==='Space'&&held;
  const frame=(h,d)=>{held=h;down=d;api.call('Update')};
  api.env.logs.length=0;
  frame(true,true);frame(true,false);frame(true,false);
  ok('길게 눌러도 한 번',api.get('score')===1&&api.env.logs.length===1,'3프레임 동안 눌러도 점수는 1점만 올라요.',`3프레임 동안 누르고 있었더니 점수가 ${api.get('score')}점, 출력이 ${api.env.logs.length}번이에요. 1점, 1번이어야 해요. 누른 순간만 true인 GetKeyDown을 쓰세요.`);
  frame(false,false);frame(true,true);
  ok('다시 누르면 2점',api.get('score')===2&&api.env.logs[api.env.logs.length-1]==='점수: 2','다시 누르면 2점이 되고 "점수: 2"가 출력돼요.',`다시 눌렀더니 점수가 ${api.get('score')}점, 마지막 출력이 "${api.env.logs[api.env.logs.length-1]}"예요. 2점과 "점수: 2"여야 해요.`);
 },
 hints:['if (Input.GetKeyDown(KeyCode.Space)) { ... } 안에서 점수를 올려요.','score++ 로 1을 더하고, Debug.Log("점수: " + score) 로 출력해요.','GetKey를 쓰면 누르고 있는 동안 계속 올라가요.'],
 why:'누른 순간에만 한 번 실행되어야 하는 일(점수, 발사, 점프)은 GetKeyDown이에요. 누를 때마다 값이 쌓이는 변수와 함께 쓰면 입력 횟수를 세는 기본 구조가 돼요.',
 concepts:[['입력 횟수 세기','GetKeyDown과 score++ 를 함께 써서 키를 누른 횟수를 센다.']]});
