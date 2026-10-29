/* ===== 코어: 규칙 · 변환기 · 실행 엔진 · 채점 ===== */
const J=a=>a.join('\n');
const C=(s,...v)=>String.raw(s,...v).replace(/^\n/,'').replace(/\s+$/,'');
const last=r=>r.frames[r.frames.length-1];

/* ---- 규칙 빌더 (데이터 형태라서 AI가 만든 문제도 같은 규칙을 쓴다) ---- */
const _s=r=>({re:r.source,fl:(r.flags||'').replace(/[gy]/g,'')});
const has=(label,re,ok,fail)=>Object.assign({k:'has',label,ok,fail},_s(re));
const no=(label,re,ok,fail)=>Object.assign({k:'no',label,ok,fail},_s(re));
const inFn=(label,fn,re,ok,fail)=>Object.assign({k:'in',fn,label,ok,fail},_s(re));
const notIn=(label,fn,re,ok,fail)=>Object.assign({k:'nin',fn,label,ok,fail},_s(re));
const notInLoop=(label,kw,re,ok,fail)=>Object.assign({k:'nloop',fn:kw,label,ok,fail},_s(re));
const inClass=(label,cls,re,ok,fail)=>Object.assign({k:'inc',fn:cls,label,ok,fail},_s(re));
const notInClass=(label,cls,re,ok,fail)=>Object.assign({k:'ninc',fn:cls,label,ok,fail},_s(re));
const cnt=(label,re,min,ok,fail)=>Object.assign({k:'cnt',min,label,ok,fail},_s(re));
const fx=(label,f,ok,fail)=>({k:'fx',label,f,ok,fail});

/* ---- 코드 정리: 주석 제거 + (선택) 문자열 내용 비우기 ---- */
function scanCode(src,blank){
 let o='',i=0;const n=src.length;
 while(i<n){
  const c=src[i],d=src[i+1];
  if(c==='/'&&d==='/'){while(i<n&&src[i]!=='\n')i++;continue}
  if(c==='/'&&d==='*'){i+=2;while(i<n&&!(src[i]==='*'&&src[i+1]==='/')){if(src[i]==='\n')o+='\n';i++}i+=2;continue}
  if(c==='"'){
   let j=i+1;while(j<n&&src[j]!=='"'&&src[j]!=='\n'){if(src[j]==='\\')j++;j++}
   o+=blank?'""':src.slice(i,j+1);i=j+1;continue;
  }
  o+=c;i++;
 }
 return o;
}
const clean=src=>scanCode(String(src).replace(/\r/g,''),true);
function balance(c){
 const st=[],pairs={')':'(',']':'[','}':'{'};
 for(let i=0;i<c.length;i++){
  const ch=c[i];
  if('([{'.includes(ch))st.push(ch);
  else if(')]}'.includes(ch)){if(st.pop()!==pairs[ch])return `'${ch}' 괄호가 짝이 맞지 않습니다. 열고 닫는 괄호 수를 확인하세요.`}
 }
 if(st.length)return `닫지 않은 '${st[st.length-1]}' 가 있습니다. 중괄호/괄호를 닫았는지 확인하세요.`;
 return null;
}
function fnBodies(c,name){
 const pre='\\b(?:void|bool|int|float|double|string|IEnumerator|IEnumerable|[A-Z]\\w*(?:<[^<>]*>)?(?:\\[\\])?)\\s+'+name+'\\s*\\(([^()]|\\([^()]*\\))*\\)\\s*';
 const out=[];let m;
 const re=new RegExp(pre+'\\{','g');
 while((m=re.exec(c))){
  let i=m.index+m[0].length,d=1;const s=i;
  while(i<c.length&&d>0){const ch=c[i];if(ch==='{')d++;else if(ch==='}')d--;i++}
  out.push(c.slice(s,i-1));
 }
 const re2=new RegExp(pre+'=>','g');
 while((m=re2.exec(c))){
  let i=m.index+m[0].length,d=0;const s=i;
  while(i<c.length){const ch=c[i];if('({['.includes(ch))d++;else if(')}]'.includes(ch))d--;else if(ch===';'&&d<=0)break;i++}
  out.push(c.slice(s,i+1));
 }
 return out;
}

function loopBodies(c,kw){
 const re=new RegExp('\\b'+kw+'\\s*\\(','g'),out=[];let m;
 while((m=re.exec(c))){
  let i=m.index+m[0].length,d=1;
  while(i<c.length&&d>0){if(c[i]==='(')d++;else if(c[i]===')')d--;i++}
  while(i<c.length&&/\s/.test(c[i]))i++;
  let s=i;
  if(c[i]==='{'){let b=1;i++;while(i<c.length&&b>0){if(c[i]==='{')b++;else if(c[i]==='}')b--;i++}out.push(c.slice(s+1,i-1))}
  else{while(i<c.length&&c[i]!==';')i++;out.push(c.slice(s,i+1))}
 }
 return out;
}
function classBodies(c,name){
 const re=new RegExp('\\b(?:class|struct|interface)\\s+'+name+'\\b[^{;]*\\{','g'),out=[];let m;
 while((m=re.exec(c))){
  let i=m.index+m[0].length,d=1;const s0=i;
  while(i<c.length&&d>0){if(c[i]==='{')d++;else if(c[i]==='}')d--;i++}
  out.push(c.slice(s0,i-1));
 }
 return out;
}
/* ---- 정적 채점 ---- */
function gradeStatic(p,code){
 const c=clean(code),items=[];
 const norm=s=>clean(s).replace(/\s+/g,'');
 if(norm(code)===norm(p.starter)){
  return [{sec:'req',ok:false,label:'코드 수정',msg:'시작 코드에서 달라진 부분이 없어요. TODO 주석이 있는 곳부터 채워 보세요.',base:true}];
 }
 const cs=c.match(/\btransform\.(position|localPosition|localScale|eulerAngles)\.([xyz])\s*(?:[-+*\/])?=(?!=)/);
 if(cs)items.push({sec:'req',ok:false,label:'컴파일 오류 CS1612',msg:`transform.${cs[1]}.${cs[2]} 에는 직접 대입할 수 없어요. Vector3는 구조체라서 transform.${cs[1]}가 돌려주는 건 복사본입니다. 지역 변수(Vector3 pos = transform.${cs[1]};)에 복사해 값을 바꾼 뒤 transform.${cs[1]} = pos; 로 다시 넣어야 해요.`,base:true});
 const pm=c.match(/\.(main|emission|shape|colorOverLifetime|sizeOverLifetime|velocityOverLifetime|rotationOverLifetime|noise|collision|trails|lights|limitVelocityOverLifetime|forceOverLifetime|textureSheetAnimation)\.([A-Za-z]+)\s*(?:[-+*\/])?=(?!=)/);
 if(pm)items.push({sec:'req',ok:false,label:'컴파일 오류 CS1612',msg:`.${pm[1]}.${pm[2]} 에는 직접 대입할 수 없어요. ParticleSystem의 모듈(${pm[1]})은 구조체로 돌려받는 프로퍼티라서, 지역 변수에 먼저 담은 뒤 값을 바꿔야 해요. 예: var ${pm[1]} = ps.${pm[1]}; ${pm[1]}.${pm[2]} = ...;`,base:true});
 const b=balance(c);
 if(b)items.push({sec:'req',ok:false,label:'문법 구조',msg:b,base:true});
 for(const r of p.rules||[]){
  let ok=false,msg=null;
  try{
   if(r.k==='fx'){const v=r.f(c,code);ok=v===true||(v&&v.ok===true);if(v&&v.msg)msg=v.msg}
   else{
    const re=new RegExp(r.re,r.fl||'');
    if(r.k==='has')ok=re.test(c);
    else if(r.k==='no')ok=!re.test(c);
    else if(r.k==='cnt')ok=(c.match(new RegExp(r.re,(r.fl||'')+'g'))||[]).length>=(r.min||1);
    else if(r.k==='inc'||r.k==='ninc'){
     const bodies=classBodies(c,r.fn);
     if(!bodies.length){
      if(r.k==='inc'){items.push({sec:'req',ok:false,label:r.label,msg:`${r.fn} 클래스를 찾지 못했어요. 이름을 확인하세요.`});continue}
      ok=true;
     }else{const re2=new RegExp(r.re,r.fl||'');ok=r.k==='inc'?bodies.some(x=>re2.test(x)):!bodies.some(x=>re2.test(x))}
    }
    else if(r.k==='nloop'){ok=!loopBodies(c,r.fn).some(x=>re.test(x))}
    else if(r.k==='in'||r.k==='nin'){
     const bodies=fnBodies(c,r.fn);
     if(!bodies.length){
      if(r.k==='in'){items.push({sec:'req',ok:false,label:r.label,msg:`${r.fn} 메서드를 찾지 못했어요. 이름과 형태(반환 형식, 괄호, 중괄호)를 확인하세요.`});continue}
      ok=true;
     }else ok=r.k==='in'?bodies.some(x=>re.test(x)):!bodies.some(x=>re.test(x));
    }
   }
  }catch(e){ok=false;msg='검사 규칙을 실행하지 못했어요.'}
  items.push({sec:'req',ok,label:r.label,msg:msg||(ok?r.ok:r.fail)});
 }
 return items;
}

/* ---- 실행 엔진: 워커 안에서 그대로 돌아가므로 바깥 변수를 쓰지 않는다 ---- */
function engine(o){
 const logs=[];
 const dt=o.fps?1/o.fps:1/60;
 const V=(x,y,z)=>{const o={x:x,y:y};if(z!==undefined)o.z=z;return o};
 const Vector2=function(x,y,z){return V(x,y,z)};
 const Z=(a,b)=>a.z!==undefined||(b&&b.z!==undefined);
 const VV=(x,y,z,keep)=>keep?V(x,y,z):V(x,y);
 Vector2.Distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z||0)-(b.z||0));
 Vector2.MoveTowards=(a,b,d)=>{const k=Z(a,b),dx=b.x-a.x,dy=b.y-a.y,dz=(b.z||0)-(a.z||0),m=Math.hypot(dx,dy,dz);return (m<=d||m===0)?VV(b.x,b.y,b.z||0,k):VV(a.x+dx/m*d,a.y+dy/m*d,(a.z||0)+dz/m*d,k)};
 Vector2.Lerp=(a,b,t)=>{t=Math.max(0,Math.min(1,t));return VV(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,(a.z||0)+((b.z||0)-(a.z||0))*t,Z(a,b))};
 Vector2.LerpUnclamped=(a,b,t)=>VV(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,(a.z||0)+((b.z||0)-(a.z||0))*t,Z(a,b));
 Vector2.Dot=(a,b)=>a.x*b.x+a.y*b.y+(a.z||0)*(b.z||0);
 Vector2.ClampMagnitude=(v,m)=>{const l=Math.hypot(v.x,v.y,v.z||0);if(l<=m||l===0)return VV(v.x,v.y,v.z||0,Z(v));const k=m/l;return VV(v.x*k,v.y*k,(v.z||0)*k,Z(v))};
 Vector2.Angle=(a,b)=>{const la=Math.hypot(a.x,a.y,a.z||0),lb=Math.hypot(b.x,b.y,b.z||0);if(!la||!lb)return 0;return Math.acos(Math.max(-1,Math.min(1,Vector2.Dot(a,b)/la/lb)))*180/Math.PI};
 Vector2.SignedAngle=(a,b)=>{const u=Vector2.Angle(a,b);return (a.x*b.y-a.y*b.x)<0?-u:u};
 Vector2.Perpendicular=v=>V(-v.y,v.x);
 Vector2.Reflect=(d,n)=>{const k=2*Vector2.Dot(d,n);return VV(d.x-k*n.x,d.y-k*n.y,(d.z||0)-k*(n.z||0),Z(d))};
 Vector2.Scale=(a,b)=>VV(a.x*b.x,a.y*b.y,(a.z||0)*(b.z||0),Z(a,b));
 Vector2.Min=(a,b)=>VV(Math.min(a.x,b.x),Math.min(a.y,b.y),Math.min(a.z||0,b.z||0),Z(a,b));
 Vector2.Max=(a,b)=>VV(Math.max(a.x,b.x),Math.max(a.y,b.y),Math.max(a.z||0,b.z||0),Z(a,b));
 Vector2.Cross=(a,b)=>V(a.y*(b.z||0)-(a.z||0)*b.y,(a.z||0)*b.x-a.x*(b.z||0),a.x*b.y-a.y*b.x);
 Vector2.SmoothDamp=(c,t,vel,st,max,dtt)=>{const f=(x,y,vv)=>{const omega=2/Math.max(0.0001,st),dt2=dtt===undefined?dt:dtt,xx=omega*dt2,ex=1/(1+xx+0.48*xx*xx+0.235*xx*xx*xx);const ch=x-y;const tmp=(vv+omega*ch)*dt2;const nv=(vv-omega*tmp)*ex;return [y+(ch+tmp)*ex,nv]};const v0=vel&&vel.value?vel.value:V(0,0);const rx=f(c.x,t.x,v0.x),ry=f(c.y,t.y,v0.y);if(vel)vel.value=V(rx[1],ry[1]);return VV(rx[0],ry[0],t.z||0,Z(c,t))};
 Vector2.positiveInfinity=V(Infinity,Infinity);Vector2.zero=V(0,0);Vector2.forward=V(0,0,1);Vector2.back=V(0,0,-1);Vector2.one=V(1,1);Vector2.right=V(1,0);Vector2.left=V(-1,0);Vector2.up=V(0,1);Vector2.down=V(0,-1);
 const Mathf={PI:Math.PI,Infinity:Infinity,Deg2Rad:Math.PI/180,Rad2Deg:180/Math.PI,Exp:Math.exp,Pow:Math.pow,Log:Math.log,Abs:Math.abs,Min:Math.min,Max:Math.max,Sqrt:Math.sqrt,Sin:Math.sin,Cos:Math.cos,Atan2:Math.atan2,Floor:Math.floor,Ceil:Math.ceil,Round:Math.round,
  FloorToInt:Math.floor,CeilToInt:Math.ceil,RoundToInt:x=>{const r=Math.round(x);return (Math.abs(x%1)===0.5&&r%2!==0)?r-1:r},Sign:x=>x<0?-1:1,
  Clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),Clamp01:v=>Math.max(0,Math.min(1,v)),Lerp:(a,b,t)=>a+(b-a)*Math.max(0,Math.min(1,t)),
  InverseLerp:(a,b,v)=>a===b?0:Math.max(0,Math.min(1,(v-a)/(b-a))),Repeat:(t,l)=>t-Math.floor(t/l)*l,
  MoveTowards:(a,b,d)=>Math.abs(b-a)<=d?b:a+(b>a?1:-1)*d,Approximately:(a,b)=>Math.abs(a-b)<1e-5,
  DeltaAngle:(a,b)=>{const d=((b-a)%360+360)%360;return d>180?d-360:d},Acos:Math.acos,Asin:Math.asin,Atan:Math.atan,Tan:Math.tan,Epsilon:1.401298e-45,Log10:Math.log10,LerpUnclamped:(a,b,t)=>a+(b-a)*t,SmoothStep:(a,b,t)=>{t=Math.max(0,Math.min(1,t));t=t*t*(3-2*t);return a+(b-a)*t},LerpAngle:(a,b,t)=>{let d=((b-a)%360+540)%360-180;return a+d*Math.max(0,Math.min(1,t))},Floor:Math.floor,IsPowerOfTwo:x=>x>0&&(x&(x-1))===0,SmoothDamp:(c,t,cell,st,max,dtt)=>{const omega=2/Math.max(0.0001,st),d2=dtt===undefined?dt:dtt,xx=omega*d2,ex=1/(1+xx+0.48*xx*xx+0.235*xx*xx*xx);const ch=c-t;const vv=cell?cell.value||0:0;const tmp=(vv+omega*ch)*d2;if(cell)cell.value=(vv-omega*tmp)*ex;return t+(ch+tmp)*ex},PingPong:(t,l)=>{t=((t%(2*l))+2*l)%(2*l);return t>l?2*l-t:t}};
 const Time={deltaTime:dt,time:0,timeScale:1,unscaledDeltaTime:dt,unscaledTime:0,fixedDeltaTime:0.02,frameCount:0,realtimeSinceStartup:0};
 const Debug={Log:(...a)=>{if(logs.length<60)logs.push(a.map(String).join(' '))}};
 Debug.LogWarning=Debug.Log;Debug.LogError=Debug.Log;
 const Random={Range:(a,b)=>a+Math.random()*(b-a),value:0.5};
 let axisFn=()=>0;
 const IN={kd:()=>false,k:()=>false,ku:()=>false,md:()=>false,m:()=>false,mu:()=>false};
 const btn=(key,mouse)=>n=>{if(n==='Jump')return IN[key]('Space');if(n==='Fire1')return IN[mouse](0)||IN[key]('LeftControl');if(n==='Submit')return IN[key]('Return');return IN[key](n)};
 const Input={get GetAxis(){return axisFn},set GetAxis(f){axisFn=f},get GetAxisRaw(){return axisFn},set GetAxisRaw(f){axisFn=f},
  get GetKeyDown(){return IN.kd},set GetKeyDown(f){IN.kd=f},get GetKey(){return IN.k},set GetKey(f){IN.k=f},get GetKeyUp(){return IN.ku},set GetKeyUp(f){IN.ku=f},
  get GetMouseButtonDown(){return IN.md},set GetMouseButtonDown(f){IN.md=f},get GetMouseButton(){return IN.m},set GetMouseButton(f){IN.m=f},get GetMouseButtonUp(){return IN.mu},set GetMouseButtonUp(f){IN.mu=f},
  get GetButtonDown(){return btn('kd','md')},set GetButtonDown(f){IN.kd=f},get GetButton(){return btn('k','m')},set GetButton(f){IN.k=f},get GetButtonUp(){return btn('ku','mu')},set GetButtonUp(f){IN.ku=f},
  mousePosition:{x:0,y:0,z:0},anyKeyDown:false,anyKey:false};
 const KeyCode=new Proxy({},{get:(t,k)=>typeof k==='string'&&!k.startsWith('__')?k:undefined,has:(t,k)=>typeof k==='string'&&!k.startsWith('__')});
 const env={Time,Debug,Random,Input,Mathf,Vector2,components:{},destroyed:[],instantiated:[],logs};
 env.started=[];env.scenes=[];env.stopped=[];env.getCalls=0;env.rayCalls=[];env.children={};
 const GetComponent=n=>{env.getCalls++;return env.components[n]||null};
 const GetComponentInChildren=(n,inc)=>{env.getCalls++;const c=env.children[n];if(c)return inc===true?c:null;return env.components[n]||null};
 const nameProxy=()=>new Proxy({},{get:(t,k)=>typeof k==='string'&&!k.startsWith('__')&&k!=='then'&&k!=='toJSON'?k:undefined,has:(t,k)=>typeof k==='string'&&!k.startsWith('__')});
 const REV={};const hashOf=s=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;REV[h]=s;return h};
 const Animator={StringToHash:hashOf};env.Animator=Animator;
 const Physics2D={Raycast:function(){env.rayCalls.push(Array.prototype.slice.call(arguments));return env.ray?env.ray.apply(null,arguments):{collider:null}}};
 const LayerMask={GetMask:function(){return arguments.length*64},NameToLayer:()=>8};
 const mkGo=(tag,comps)=>{const g={tag:tag||'Untagged',name:tag||'obj',activeSelf:true,activeInHierarchy:true,CompareTag(t){return t===this.tag},GetComponent:n=>(comps||{})[n]||null,
  TryGetComponent(n,cell){if(n&&typeof n==='object'){cell=n;n=cell.type}const c=(comps||{})[n]||null;cell.value=c;return c!==null},GetComponentInParent:n=>(comps||{})[n]||null,SetActive(v){this.activeSelf=v},
  transform:{position:{x:0,y:0,z:0}},contacts:[],relativeVelocity:{x:0,y:0},attachedRigidbody:null};g.gameObject=g;g.collider=g;g.otherCollider=g;g.rigidbody=null;return g};
 const Color=function(r,g,b,a){return {r:r,g:g,b:b,a:a===undefined?1:a}};
 Color.red=Color(1,0,0);Color.green=Color(0,1,0);Color.blue=Color(0,0,1);Color.white=Color(1,1,1);Color.black=Color(0,0,0);Color.yellow=Color(1,0.92,0.016);Color.cyan=Color(0,1,1);Color.magenta=Color(1,0,1);Color.gray=Color(0.5,0.5,0.5);Color.clear=Color(0,0,0,0);
 const ParticleSystem={MinMaxCurve:function(a,b){this.constant=b===undefined?a:undefined;this.multiplier=b===undefined?undefined:a;this.curve=b;this.kind=b===undefined?'constant':'curve'},MinMaxGradient:function(a,b){this.gradient=(a&&a.SetKeys)?a:undefined;this.colorMin=(a&&a.SetKeys)?undefined:a;this.colorMax=b},Burst:function(t,c){this.time=t;this.count=c}};
 const AnimationCurve=function(){this.keys=[]};
 AnimationCurve.Linear=(t0,v0,t1,v1)=>({kind:'Linear',t0,v0,t1,v1});
 AnimationCurve.EaseInOut=(t0,v0,t1,v1)=>({kind:'EaseInOut',t0,v0,t1,v1});
 AnimationCurve.Constant=(t0,t1,v)=>({kind:'Constant',t0,v0:v,t1,v1:v});
 const GradientColorKey=function(c,t){this.color=c;this.time=t};
 const GradientAlphaKey=function(a,t){this.alpha=a;this.time=t};
 const Gradient=function(){this.colorKeys=[];this.alphaKeys=[];this.SetKeys=function(c,a){this.colorKeys=c;this.alphaKeys=a}};
 const mk={
  ps:()=>({calls:[],isPlaying:false,main:{loop:true,playOnAwake:true,startLifetime:5,startSpeed:5,startSize:1,gravityModifier:0,maxParticles:1000,simulationSpace:'Local',stopAction:'None',cullingMode:'AlwaysSimulate',duration:5},emission:{enabled:true,rateOverTime:10},shape:{enabled:true,shapeType:'Cone',angle:25,radius:1},colorOverLifetime:{enabled:false},sizeOverLifetime:{enabled:false},velocityOverLifetime:{enabled:false},Play(){this.calls.push(['Play']);this.isPlaying=true},Stop(w,b){this.calls.push(['Stop',w,b]);this.isPlaying=false},Emit(n){this.calls.push(['Emit',n])},Clear(){this.calls.push(['Clear'])},Pause(){this.calls.push(['Pause'])}}),
  go:mkGo,
  anim:()=>{const o={log:[],applyRootMotion:true,speed:1,enabled:true};const rec=n=>function(){const a=Array.prototype.slice.call(arguments);const raw=a[0];if(typeof raw==='number'&&REV[raw]!==undefined)a[0]=REV[raw];const e=[n].concat(a);e.raw=raw;this.log.push(e)};['SetFloat','SetBool','SetInteger','SetTrigger','ResetTrigger','CrossFade','CrossFadeInFixedTime','Play'].forEach(n=>o[n]=rec(n));o.GetBool=function(n){for(let i=this.log.length-1;i>=0;i--){const l=this.log[i];if(l[0]==='SetBool'&&(l[1]===n||l.raw===n))return l[2]}return false};o.GetFloat=function(n){for(let i=this.log.length-1;i>=0;i--){const l=this.log[i];if(l[0]==='SetFloat'&&(l[1]===n||l.raw===n))return l[2]}return 0};return o},
  rb:()=>{let vel={x:0,y:0};const r={get velocity(){return vel},set velocity(v){vel={x:v.x,y:v.y}},get linearVelocity(){return vel},set linearVelocity(v){vel={x:v.x,y:v.y}},angularVelocity:0,position:{x:0,y:0},gravityScale:1,mass:1,drag:0,linearDamping:0,bodyType:'Dynamic',isKinematic:false,collisionDetectionMode:'Discrete',interpolation:'None',constraints:'None',forces:[],AddForce(f,m){this.forces.push([f,m])},AddTorque(t){},MovePosition(p){this.moved=p},MoveRotation(a){},Sleep(){},WakeUp(){}};return r},
 };
 const Destroy=(x,t)=>{env.destroyed.push(x);if(x&&typeof x==='object'&&!t){try{Object.defineProperty(x,'__destroyed',{value:true,configurable:true})}catch(e){}}};
 const GetComponents=n=>{env.getCalls++;const c=env.components[n];return c?[c]:[]};
 const TryGetComponent=(n,cell)=>{if(n&&typeof n==='object'){cell=n;n=cell.type}env.getCalls++;const c=env.components[n]||null;cell.value=c;return c!==null};
 const FindObjectOfType=n=>env.components[n]||null;
 const Quaternion={identity:{x:0,y:0,z:0,w:1,euler:{x:0,y:0,z:0}},Euler:(x,y,z)=>({x:0,y:0,z:0,w:1,euler:{x,y,z}}),AngleAxis:(a,ax)=>({x:0,y:0,z:0,w:1,euler:{x:0,y:0,z:a}})};
 const Instantiate=(x)=>{const o2=Object.assign({},x||{});env.instantiated.push(o2);return o2};
 const string={IsNullOrEmpty:s=>s==null||s===''};
 const gameObject={name:'obj',activeSelf:true,tag:'Untagged',SetActive(v){this.activeSelf=v}};
 const WaitForSeconds=function(s){this.s=s};
 const WaitForSecondsRealtime=function(s){this.s=s;this.realtime=true};
 const WaitForEndOfFrame=function(){};
 const WaitForFixedUpdate=function(){};
 const WaitUntil=function(f){this.f=f};
 const WaitWhile=function(f){this.f=f};
 const StartCoroutine=g=>{env.started.push(g);return g};
 const StopCoroutine=g=>{env.stopped.push(g)};
 const StopAllCoroutines=()=>{env.stopped.push('ALL')};
 const makeCo=gen=>{
  let wait=0,cond=null,done=false,started=false,rt=false;
  const step=()=>{
   const r=gen.next();
   if(r.done){done=true;return}
   const y=r.value;wait=0;cond=null;rt=false;
   if(y instanceof WaitForSeconds||y instanceof WaitForSecondsRealtime){wait=y.s;rt=!!y.realtime}
   else if(y instanceof WaitUntil)cond=y.f;
   else if(y instanceof WaitWhile)cond=()=>!y.f();
  };
  return {get done(){return done},advance(d){
   if(done)return;
   if(!started){started=true;step();return}
   if(cond){if(cond())step()}
   else if(wait>0){wait-=rt?d:d*Time.timeScale;if(wait<=1e-9)step()}
   else step();
  }};
 };
 const L=o.world||{start:{x:0,y:0}};
 const T={x:L.start.x,y:L.start.y};const SC={x:1,y:1};
 const EU={x:0,y:0,z:0};
 const transform={name:'obj',get position(){return V(T.x,T.y,T.z)},set position(v){T.x=v.x;T.y=v.y;if(v.z!==undefined)T.z=v.z},
  get localPosition(){return V(T.x,T.y,T.z)},set localPosition(v){T.x=v.x;T.y=v.y;if(v.z!==undefined)T.z=v.z},
  get localScale(){return V(SC.x,SC.y,SC.z===undefined?1:SC.z)},set localScale(v){SC.x=v.x;SC.y=v.y;if(v.z!==undefined)SC.z=v.z},
  get eulerAngles(){return V(EU.x,EU.y,EU.z)},set eulerAngles(v){EU.x=v.x;EU.y=v.y;EU.z=v.z||0},
  get rotation(){return {x:0,y:0,z:0,w:1,euler:{x:EU.x,y:EU.y,z:EU.z}}},set rotation(q){if(q&&q.euler){EU.x=q.euler.x;EU.y=q.euler.y;EU.z=q.euler.z}},
  get right(){const a=EU.z*Math.PI/180;return V(Math.cos(a),Math.sin(a),0)},get up(){const a=EU.z*Math.PI/180;return V(-Math.sin(a),Math.cos(a),0)},
  Translate(x,y,z){if(typeof x==='object'){T.x+=x.x;T.y+=x.y;return}T.x+=x;T.y+=y},Rotate(x,y,z){if(typeof x==='object'){EU.z+=x.z||0;return}EU.z+=z||0},
  GetChild:()=>null,childCount:0,parent:null,SetParent(){},gameObject:null};
 const target={position:V(0,0)};
 const setTarget=t=>{if(L.target){target.position.x=L.target.cx+L.target.r*Math.cos(L.target.w*t);target.position.y=L.target.cy+L.target.r*Math.sin(L.target.w*t)}};
 setTarget(0);
 const G={MaterialPropertyBlock:function(){this.colors={};this.SetColor=function(n,c){this.colors[n]=c}},SceneManager:{LoadScene:n=>{env.scenes.push(n)}},Color,ParticleSystem,AnimationCurve,Gradient,GradientColorKey,GradientAlphaKey,ParticleSystemStopBehavior:nameProxy(),ParticleSystemStopAction:nameProxy(),ParticleSystemSimulationSpace:nameProxy(),ParticleSystemShapeType:nameProxy(),ParticleSystemCullingMode:nameProxy(),GetComponentInChildren,Animator,Physics2D,LayerMask,ForceMode2D:nameProxy(),ForceMode:nameProxy(),RigidbodyType2D:nameProxy(),CollisionDetectionMode2D:nameProxy(),RigidbodyInterpolation2D:nameProxy(),transform,target,Vector2,Vector3:Vector2,Mathf,Time,Debug,Random,Input,KeyCode,GetComponent,GetComponents,Destroy,Instantiate,TryGetComponent,FindObjectOfType,Quaternion,string,gameObject,WaitForSeconds,WaitForSecondsRealtime,WaitForEndOfFrame,WaitForFixedUpdate,WaitUntil,WaitWhile,StartCoroutine,StopCoroutine,StopAllCoroutines};
 let built;
 try{
  built=CS.load(o.code,G,{timeMs:1500});
  if(o.world&&o.world.target&&('target' in built.inst)&&built.inst.target==null)built.inst.target=target;
 }catch(e){return {kind:o.kind,frames:[],results:[],logs,error:{name:e.name||'Error',message:e.message||String(e),line:e.line},fps:o.fps}}
 const fns=built.fns;
 if(o.kind==='unit'){
  const results=[];
  const api={call(n){const a=Array.prototype.slice.call(arguments,1);if(!fns[n])throw {name:'NOFN',message:n};return fns[n].apply(null,a)},has:n=>!!fns[n],get:built.get,set:built.set,env,transform,target,gameObject,co:makeCo,mk};
  const ok=(label,cond,pass,fail)=>results.push({sec:'test',ok:!!cond,label,msg:cond?pass:fail});
  try{
   o.test(api,ok);
  }catch(e){
   if(e&&e.name==='NOFN')results.push({sec:'test',ok:false,label:'메서드 '+e.message,msg:`${e.message} 메서드를 찾지 못했어요. 이름과 매개변수를 문제의 요구사항과 같게 선언했는지 확인하세요.`});
   else return {kind:'unit',results,logs,error:{name:e&&e.name||'Error',message:e&&e.message||String(e),line:e&&e.line}};
  }
  return {kind:'unit',results,logs,error:null};
 }
 const frames=[];
 const push=t=>frames.push([t,T.x,T.y,target.position.x,target.position.y]);
 const n=Math.round(o.seconds*o.fps),t0=Date.now();
 try{
  if(fns.Start)fns.Start();
  push(0);
  for(let i=1;i<=n;i++){
   const t=i*dt;Time.time=t;Time.deltaTime=dt;setTarget(t);
   if(fns.Update)fns.Update();
   if(!isFinite(T.x)||!isFinite(T.y))throw {name:'Error',message:'transform.position 이 숫자가 아닌 값(NaN)이 되었습니다.'};
   push(t);
   if(i%200===0&&Date.now()-t0>2500)throw {name:'Timeout',message:'time'};
  }
 }catch(e){return {kind:'sim',frames,logs,error:{name:e.name||'Error',message:e.message||String(e),line:e.line},fps:o.fps}}
 return {kind:'sim',frames,logs,error:null,fps:o.fps};
}

const TOOL_LIMIT=new Set(['ParseError','MissingMember','CS0246','Unsupported','HostError']);
function mapErr(e){
 const m=e.message||'',n=e.name||'Error',ln=e.line?`${e.line}번째 줄 · `:'';
 const NAMES={ParseError:'문법',NullReferenceException:'NullReferenceException',IndexOutOfRangeException:'IndexOutOfRangeException',ArgumentOutOfRangeException:'ArgumentOutOfRangeException',InvalidOperationException:'InvalidOperationException',DivideByZeroException:'DivideByZeroException',KeyNotFoundException:'KeyNotFoundException',MissingMember:'찾을 수 없는 멤버',Timeout:'무한 루프 의심',HostError:'실행 오류',Unsupported:'지원하지 않는 문법'};
 if(n==='NOFN')return `${m} 메서드를 찾지 못했어요. 이름과 매개변수를 문제의 요구사항과 같게 선언했는지 확인하세요.`;
 if(n==='Timeout')return `${ln}무한 루프 의심 · 실행이 제한 시간 안에 끝나지 않아 중단했어요. while/for 조건이 언젠가 거짓이 되는지 확인하세요.`;
 const label=NAMES[n]||n;
 return `${ln}${label} · ${m}`;
}
const isToolLimit=e=>!!e&&(TOOL_LIMIT.has(e.name)||/AI 판정/.test(e.message||''));

/* ---- 통합 채점: 정적 규칙 + 컴파일(구문) 검사 + 동작 검사 ---- */
async function gradeAll(p,code,run){
 const items=gradeStatic(p,code);
 const out={items,logs:[],runs:null,show:null,skipped:false,runtimeError:null,toolLimit:false};
 if(items.some(i=>i.base&&!i.ok))return finish(out);
 try{CS.parse(code)}catch(e){
  const msg=mapErr(e)+(e.name==='ParseError'?'\n문법이 맞는데도 이 메시지가 나온다면 이 연습장이 아직 모르는 문법일 수 있어요. 그럴 땐 AI 판정을 받아 보세요.':'');
  items.unshift({sec:'req',ok:false,label:'문법(컴파일) 검사',msg,base:true});
  out.toolLimit=true;out.runtimeError=msg;return finish(out);
 }
 const needRun=(p.world&&p.check)||p.test;
 if(!needRun)return finish(out);
 const fail=(label,e)=>{out.runtimeError=mapErr(e);if(isToolLimit(e))out.toolLimit=true;items.push({sec:'test',ok:false,label,msg:out.runtimeError})};
 try{
  if(p.world&&p.check){
   const show=await run({kind:'sim',code,world:p.world,fps:60,seconds:p.show});
   const rs=[];if(!show.error)for(const r of p.runs)rs.push(await run({kind:'sim',code,world:p.world,fps:r.fps,seconds:r.seconds}));
   out.show=show;out.logs=show.logs||[];
   const bad=[show,...rs].find(r=>r.error);
   if(bad)fail('실행',bad.error);
   else{const r=p.check(rs);r.items.forEach(i=>items.push(Object.assign({sec:'test'},i)))}
  }
  if(p.test){
   const r=await run({kind:'unit',code,test:p.test,fps:60});
   out.logs=out.logs.length?out.logs:(r.logs||[]);
   (r.results||[]).forEach(i=>items.push(i));
   if(r.error)fail('실행 중 오류',r.error);
  }
 }catch(e){fail('실행 중 오류',{name:'HostError',message:String(e&&e.message||e)})}
 return finish(out);
 function finish(o2){o2.pass=o2.items.length>0&&o2.items.every(i=>i.ok);return o2}
}
