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
