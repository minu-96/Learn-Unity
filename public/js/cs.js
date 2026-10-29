/* ===== C# 부분집합 인터프리터: eval/new Function 없이 학생 코드를 실행한다 ===== */
const CS=(()=>{
 function CSErr(name,message,line){this.name=name;this.message=message;this.line=line}
 const err=(name,msg,line)=>new CSErr(name,msg,line);

 /* ---------- 렉서 ---------- */
 const KW=new Set(('abstract as base bool break byte case catch char class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void volatile while').split(' '));
 const PRIM=new Set('bool byte char decimal double float int long object sbyte short string uint ulong ushort void'.split(' '));
 const OPS=['??=','<<=','=>','==','!=','<=','>=','&&','||','++','--','+=','-=','*=','/=','%=','&=','|=','^=','??','?.','<<','::'];
 function lex(src){
  const toks=[];let i=0,line=1;const n=src.length;
  const push=(t,v,extra)=>{const o={t,v,line,pos:i0,sp:ws};if(extra)Object.assign(o,extra);toks.push(o)};
  let i0=0,ws=true;
  while(i<n){
   const c=src[i];
   if(c==='\n'){line++;i++;ws=true;continue}
   if(c===' '||c==='\t'||c==='\r'){i++;ws=true;continue}
   if(c==='/'&&src[i+1]==='/'){while(i<n&&src[i]!=='\n')i++;continue}
   if(c==='/'&&src[i+1]==='*'){i+=2;while(i<n&&!(src[i]==='*'&&src[i+1]==='/')){if(src[i]==='\n')line++;i++}i+=2;ws=true;continue}
   if(c==='#'){while(i<n&&src[i]!=='\n')i++;continue}
   i0=i;
   // 문자열
   let interp=false,verb=false,j=i;
   while(src[j]==='$'||src[j]==='@'){if(src[j]==='$')interp=true;else verb=true;j++}
   if(src[j]==='"'&&(interp||verb||j===i)){
    i=j+1;const parts=[];let buf='';
    const startLine=line;
    for(;;){
     if(i>=n)throw err('ParseError','문자열이 닫히지 않았어요. 큰따옴표(")를 확인하세요.',startLine);
     const ch=src[i];
     if(ch==='\n'){if(!verb)throw err('ParseError','문자열이 줄 끝까지 닫히지 않았어요. 큰따옴표(")를 확인하세요.',line);line++}
     if(ch==='"'){if(verb&&src[i+1]==='"'){buf+='"';i+=2;continue}i++;break}
     if(!verb&&ch==='\\'){const e=src[i+1];buf+=({n:'\n',t:'\t','"':'"','\\':'\\','0':'\0',r:'\r','\'':'\''})[e]??e;i+=2;continue}
     if(interp&&ch==='{'){
      if(src[i+1]==='{'){buf+='{';i+=2;continue}
      parts.push(buf);buf='';
      let d=0,k=i+1,q=null,expr='',fmt=null;
      for(;k<n;k++){
       const h=src[k];
       if(q){expr+=h;if(h==='\\'){expr+=src[k+1];k++}else if(h===q)q=null;continue}
       if(h==='"'||h==="'"){q=h;expr+=h;continue}
       if(h==='('||h==='['||h==='{'){d++;expr+=h;continue}
       if(h===')'||h===']'){d--;expr+=h;continue}
       if(h==='}'){if(d===0)break;d--;expr+=h;continue}
       if(h===':'&&d===0){fmt='';k++;while(k<n&&src[k]!=='}'){fmt+=src[k];k++}break}
       expr+=h;
      }
      parts.push({expr,fmt,line});i=k+1;continue;
     }
     if(interp&&ch==='}'&&src[i+1]==='}'){buf+='}';i+=2;continue}
     buf+=ch;i++;
    }
    parts.push(buf);
    if(interp)push('istr',parts);else push('str',parts.join(''));
    ws=false;continue;
   }
   if(c==="'"){
    let v=src[i+1];let k=i+2;
    if(v==='\\'){const e=src[i+2];v=({n:'\n',t:'\t','\'':'\'','"':'"','\\':'\\','0':'\0'})[e]??e;k=i+3}
    if(src[k]!=="'")throw err('ParseError',"문자(char) 리터럴이 잘못됐어요. 작은따옴표는 한 글자에만 써요. 문자열이면 큰따옴표를 쓰세요.",line);
    i=k+1;push('chr',v);ws=false;continue;
   }
   if(/[0-9]/.test(c)||(c==='.'&&/[0-9]/.test(src[i+1]||''))){
    let k=i,isF=false,txt='';
    if(c==='0'&&/[xX]/.test(src[i+1])){k=i+2;while(/[0-9a-fA-F_]/.test(src[k]||''))k++;txt=src.slice(i,k).replace(/_/g,'');i=k;push('num',parseInt(txt,16),{isF:false});ws=false;continue}
    while(/[0-9_]/.test(src[k]||''))k++;
    if(src[k]==='.'&&/[0-9]/.test(src[k+1]||'')){isF=true;k++;while(/[0-9_]/.test(src[k]||''))k++}
    if(/[eE]/.test(src[k]||'')&&/[-+0-9]/.test(src[k+1]||'')){isF=true;k++;if(/[-+]/.test(src[k]))k++;while(/[0-9]/.test(src[k]||''))k++}
    txt=src.slice(i,k).replace(/_/g,'');
    let suf=src[k]||'';
    let dbl=isF;
    if(/[fF]/.test(suf)){isF=true;dbl=false;k++}
    else if(/[dDmM]/.test(suf)){isF=true;dbl=true;k++}
    else if(/[uUlL]/.test(suf)){k++;if(/[uUlL]/.test(src[k]||''))k++}
    if(/[A-Za-z_]/.test(src[k]||''))throw err('ParseError',`숫자 '${src.slice(i,k+1)}' 형식이 잘못됐어요.`,line);
    i=k;push('num',parseFloat(txt),{isF,dbl});ws=false;continue;
   }
   if(/[A-Za-z_@\u00C0-\uFFFF]/.test(c)){
    let k=i;if(c==='@')k++;
    while(k<n&&/[A-Za-z0-9_\u00C0-\uFFFF]/.test(src[k]))k++;
    const w=src.slice(c==='@'?i+1:i,k);i=k;
    push(KW.has(w)&&c!=='@'?'kw':'id',w);ws=false;continue;
   }
   let op=null;
   for(const o of OPS)if(src.startsWith(o,i)){op=o;break}
   if(op==='?.'&&/[0-9]/.test(src[i+2]||''))op=null;
   if(!op){if('{}()[];,.:?+-*/%<>=!&|^~'.includes(c))op=c;else throw err('ParseError',`알 수 없는 문자 '${c}' 가 있어요.`,line)}
   i+=op.length;push('op',op);ws=false;
  }
  i0=i;push('eof','');
  return toks;
 }

 /* ---------- 파서 ---------- */
 function parse(src){
  const T=lex(src);let p=0;
  const pk=(k=0)=>T[Math.min(p+k,T.length-1)];
  const is=(v,k=0)=>{const t=pk(k);return (t.t==='op'||t.t==='kw')&&t.v===v};
  const isId=(k=0)=>pk(k).t==='id';
  const nx=()=>T[p++];
  const eat=v=>{if(is(v)){p++;return true}return false};
  const desc=t=>t.t==='eof'?'코드 끝':`'${t.v}'`;
  const fail=(msg,t)=>{t=t||pk();throw err('ParseError',msg,t.line)};
  const expect=v=>{if(!eat(v)){const t=pk();const prev=T[p-1];
   if(v===';')fail(`${prev?prev.line:t.line}번째 줄 끝에 세미콜론(;)이 빠진 것 같아요. (${desc(t)} 앞)`,prev||t);
   fail(`${desc(t)} 대신 '${v}' 가 와야 해요.`,t)}};
  const ident=()=>{const t=pk();if(t.t==='id'){p++;return t.v}fail(`이름(식별자)이 와야 하는데 ${desc(t)} 가 있어요.`,t)};
  const node=(k,o,t)=>Object.assign({k,line:(t||pk()).line},o);

  /* 타입 */
  function tryType(){
   const s=p;const t=parseTypeInner();if(!t){p=s;return null}return t;
  }
  function parseTypeInner(){
   let name;
   const t=pk();
   if(t.t==='kw'&&PRIM.has(t.v)){p++;name=t.v}
   else if(t.t==='id'){p++;name=t.v;while(is('.')&&isId(1)){p+=2;name+='.'+T[p-1].v}}
   else return null;
   let args=null;
   if(is('<')){
    const s=p;p++;args=[];
    for(;;){const a=parseTypeInner();if(!a){p=s;args=null;break}args.push(a);if(eat(','))continue;if(eat('>'))break;p=s;args=null;break}
    if(!args)return {name,args:null,arr:0,simple:true};
   }
   if(is('?')&&!(pk(1).t==='id'&&(is('=',2)||is(';',2)||is(',',2)||is(')',2)))){}
   else if(is('?')){p++}
   let arr=0;
   while(is('[')&&(is(']',1)||is(',',1))){p++;while(eat(','));expect(']');arr++}
   return {name:name.replace(/^System\./,'').replace(/^UnityEngine\./,'').replace(/^Collections\.Generic\./,''),args,arr};
  }
  const tname=t=>t?(t.arr?'array':t.name):null;

  /* 식 */
  function parseExpr(){return parseAssign()}
  function lambdaAhead(){
   if(isId()&&is('=>',1))return true;
   if(is('(')){let d=0,k=0;for(;;k++){const t=pk(k);if(t.t==='eof')return false;if(t.t==='op'&&t.v==='(')d++;else if(t.t==='op'&&t.v===')'){d--;if(d===0)break}}return is('=>',k+1)}
   return false;
  }
  function parseLambda(){
   const t=pk();const params=[];
   if(isId()){params.push(ident())}
   else{expect('(');if(!is(')')){do{const s=p;let ty=tryType();if(ty&&isId()){params.push(ident())}else{p=s;params.push(ident())}}while(eat(','))}expect(')')}
   expect('=>');
   if(is('{'))return node('lambda',{params,body:parseBlock()},t);
   return node('lambda',{params,expr:parseExpr()},t);
  }
  const ASSIGN=new Set(['=','+=','-=','*=','/=','%=','&=','|=','^=','??=','<<=']);
  function parseAssign(){
   if(lambdaAhead())return parseLambda();
   const t=pk();const l=parseTernary();
   const o=pk();
   if(o.t==='op'&&ASSIGN.has(o.v)){p++;const r=parseAssign();return node('assign',{op:o.v,l,r},t)}
   if(o.t==='op'&&o.v==='>'&&is('>=',1)&&!pk(1).sp){p+=2;const r=parseAssign();return node('assign',{op:'>>=',l,r},t)}
   return l;
  }
  function parseTernary(){
   const t=pk();const c=parseCoal();
   if(is('?')){p++;const a=parseAssign();expect(':');const b=parseAssign();return node('cond',{c,a,b},t)}
   return c;
  }
  function parseCoal(){
   const t=pk();const l=parseBin(1);
   if(is('??')){p++;return node('coal',{l,r:parseCoal()},t)}
   return l;
  }
  const PREC={'||':1,'&&':2,'|':3,'^':4,'&':5,'==':6,'!=':6,'<':7,'>':7,'<=':7,'>=':7,'is':7,'as':7,'<<':8,'>>':8,'+':9,'-':9,'*':10,'/':10,'%':10};
  function binOp(){
   const t=pk();
   if(t.t==='op'&&t.v==='>'&&is('>',1)&&!pk(1).sp&&!is('=',2))return {v:'>>',len:2};
   if((t.t==='op'||t.t==='kw')&&PREC[t.v]&&!(t.v==='>'&&is('=',1)&&!pk(1).sp))return {v:t.v,len:1};
   return null;
  }
  function parseBin(min){
   const t=pk();let l=parseUnary();
   for(;;){
    const o=binOp();if(!o||PREC[o.v]<min)break;
    p+=o.len;
    if(o.v==='is'||o.v==='as'){
     let neg=false;
     if(o.v==='is'&&isId()&&pk().v==='not'){p++;neg=true}
     if(is('null')){p++;l=node('bin',{op:neg?'!=':'==',l,r:node('lit',{v:null})},t);continue}
     const ty=tryType();if(!ty)fail('is/as 뒤에는 타입이 와야 해요.');
     let bind=null;if(o.v==='is'&&isId()&&!is('=>',1))bind=ident();
     l=node(o.v,{e:l,ty,bind,neg},t);continue;
    }
    const r=parseBin(PREC[o.v]+1);
    l=node('bin',{op:o.v,l,r},t);
   }
   return l;
  }
  function castAhead(){
   if(!is('('))return null;
   const s=p;p++;
   const ty=tryType();
   if(!ty||!is(')')){p=s;return null}
   p++;
   const nt=pk();
   const prim=PRIM.has(ty.name)||ty.arr;
   const startsUnary=nt.t==='id'||nt.t==='num'||nt.t==='str'||nt.t==='istr'||nt.t==='chr'||(nt.t==='op'&&(nt.v==='('||nt.v==='!'||nt.v==='~'))||(nt.t==='kw'&&['this','new','true','false','null','typeof','default','base'].includes(nt.v))||(nt.t==='kw'&&PRIM.has(nt.v));
   if(prim&&(startsUnary||(nt.t==='op'&&(nt.v==='-'||nt.v==='+'))))return ty;
   if(!prim&&startsUnary&&/^[A-Z]/.test(ty.name.split('.').pop()))return ty;
   p=s;return null;
  }
  function parseUnary(){
   const t=pk();
   if(t.t==='op'&&['-','+','!','~'].includes(t.v)){p++;return node('un',{op:t.v,e:parseUnary()},t)}
   if(t.t==='op'&&(t.v==='++'||t.v==='--')){p++;return node('pre',{op:t.v,e:parseUnary()},t)}
   const ty=castAhead();
   if(ty)return node('cast',{ty,e:parseUnary()},t);
   let e=parsePostfix(parsePrimary());
   while(is('switch')&&is('{',1)){
    const st=pk();p+=2;const arms=[];
    while(!is('}')){
     let pat;
     if(isId()&&pk().v==='_'){p++;pat={any:true}}
     else if(is('<')||is('>')||is('<=')||is('>=')){const op=nx().v;pat={op,e:parseBin(9)}}
     else if(is('null')){p++;pat={e:node('lit',{v:null})}}
     else pat={e:parseBin(8)};
     let when=null;if(isId()&&pk().v==='when'){p++;when=parseCoal()}
     expect('=>');const v=parseAssign();arms.push({pat,when,v});
     if(!eat(','))break;
    }
    expect('}');e=node('swexpr',{e,arms},st);
   }
   return e;
  }
  function genericArgsAhead(){
   if(!is('<'))return null;
   const s=p;p++;const args=[];
   for(;;){const a=parseTypeInner();if(!a){p=s;return null}args.push(a);if(eat(','))continue;if(eat('>'))break;p=s;return null}
   if(is('(')||is('.'))return args;
   p=s;return null;
  }
  function parseArgs(close){
   const args=[];
   if(is(close)){p++;return args}
   do{
    const t=pk();
    if(isId()&&is(':',1)&&!is('::',1)){p+=2}
    if(is('out')||is('ref')||is('in')){
     const mode=nx().v;
     if(is('var')||(isId()&&pk().v==='var'&&isId(1))){p++;args.push(node('outdecl',{name:ident(),ty:null,mode},t));continue}
     const s=p;const ty=tryType();
     if(ty&&isId()&&(is(',',1)||is(close,1))){args.push(node('outdecl',{name:ident(),ty,mode},t));continue}
     p=s;args.push(node('refarg',{e:parseExpr(),mode},t));continue;
    }
    args.push(parseExpr());
   }while(eat(','));
   expect(close);
   return args;
  }
  function parsePostfix(e){
   for(;;){
    const t=pk();
    if(is('.')||is('?.')){
     const nul=nx().v==='?.';
     if(nul&&is('[')){p++;const a=parseArgs(']');e=node('index',{e,args:a,nul},t);continue}
     const name=ident();const g=genericArgsAhead();
     e=node('mem',{e,name,nul,gen:g},t);continue;
    }
    if(is('(')){p++;const args=parseArgs(')');e=node('call',{f:e,args},t);continue}
    if(is('[')){p++;const args=parseArgs(']');e=node('index',{e,args},t);continue}
    if(is('++')||is('--')){const op=nx().v;e=node('post',{op,e},t);continue}
    if(is('!')&&(is('.',1)||is(';',1)||is(')',1))){p++;continue}
    break;
   }
   return e;
  }
  function parseInitList(){
   expect('{');const items=[];
   while(!is('}')){
    if(is('{')){items.push(node('pair',{items:parseInitList()}));}
    else if(isId()&&is('=',1)){const name=ident();p++;items.push(node('objinit',{name,v:parseExpr()}))}
    else if(is('[')){p++;const key=parseExpr();expect(']');expect('=');items.push(node('pair',{items:[key,parseExpr()]}))}
    else items.push(parseExpr());
    if(!eat(','))break;
   }
   expect('}');return items;
  }
  function parsePrimary(){
   const t=pk();
   if(t.t==='num'){p++;return node('lit',{v:t.v,isF:t.isF,dbl:t.dbl,num:true},t)}
   if(t.t==='str'){p++;return node('lit',{v:t.v},t)}
   if(t.t==='chr'){p++;return node('lit',{v:t.v,chr:true},t)}
   if(t.t==='istr'){p++;
    const parts=t.v.map(x=>{if(typeof x==='string')return x;let sub;try{sub=parse('__E('+x.expr+');')}catch(e){throw err('ParseError','문자열 보간 {'+x.expr+'} 안의 식을 해석하지 못했어요.',t.line)}return {e:sub.exprOnly,fmt:x.fmt}});
    return node('istr',{parts},t)}
   if(t.t==='kw'){
    if(t.v==='true'||t.v==='false'){p++;return node('lit',{v:t.v==='true'},t)}
    if(t.v==='null'){p++;return node('lit',{v:null},t)}
    if(t.v==='this'){p++;return node('this',{},t)}
    if(t.v==='base'){p++;return node('this',{base:true},t)}
    if(t.v==='typeof'){p++;expect('(');const ty=tryType();expect(')');return node('lit',{v:ty?ty.name:'?'},t)}
    if(t.v==='default'){p++;if(eat('(')){const ty=tryType();expect(')');return node('default',{ty},t)}return node('default',{ty:null},t)}
    if(t.v==='new'){p++;return parseNew(t)}
    if(PRIM.has(t.v)){p++;return node('id',{name:t.v},t)}
   }
   if(t.t==='id'){
    if(t.v==='nameof'&&is('(',1)){p+=2;let last='';while(!is(')')){last=nx().v}p++;return node('lit',{v:last},t)}
    p++;const g=genericArgsAhead();
    return node('id',{name:t.v,gen:g},t);
   }
   if(is('(')){p++;const e=parseExpr();expect(')');return e}
   if(t.t==='op'&&t.v==='[')fail('여기에는 [ 가 올 수 없어요. 배열을 만들 때는 new int[] { 1, 2 } 처럼 써요.',t);
   fail(`${desc(t)} 가 여기에 올 수 없어요. 식이 와야 하는 자리예요.`,t);
  }
  function parseNew(t){
   if(is('[')){p++;expect(']');return node('newarr',{ty:null,init:parseInitList()},t)}
   if(is('(')){p++;const args=parseArgs(')');let init=null;if(is('{'))init=parseInitList();return node('new',{ty:null,args,init},t)}
   if(is('{')){return node('anon',{init:parseInitList()},t)}
   const s=p;
   let name;const tt=pk();
   if(tt.t==='kw'&&PRIM.has(tt.v)){p++;name=tt.v}else{name=ident();while(is('.')&&isId(1)){p++;name+='.'+ident()}}
   let args=null;
   if(is('<')){p++;args=[];do{const a=parseTypeInner();if(!a)fail('제네릭 타입 인자를 해석하지 못했어요.');args.push(a)}while(eat(','));expect('>')}
   name=name.replace(/^System\./,'').replace(/^UnityEngine\./,'').replace(/^Collections\.Generic\./,'');
   if(is('[')){
    p++;
    if(is(']')||is(',')){while(eat(','));expect(']');while(is('[')){p++;expect(']')}return node('newarr',{ty:{name,args},init:parseInitList()},t)}
    const size=parseExpr();expect(']');
    const dims=[size];
    while(is('[')){p++;if(!is(']'))dims.push(parseExpr());expect(']')}
    let init=null;if(is('{'))init=parseInitList();
    return node('newarr',{ty:{name,args},size,dims,init},t);
   }
   let cargs=[];if(is('(')){p++;cargs=parseArgs(')')}
   let init=null;if(is('{'))init=parseInitList();
   return node('new',{ty:{name,args},args:cargs,init},t);
  }

  /* 문장 */
  function parseBlock(){
   const t=pk();expect('{');const body=[];
   while(!is('}')){if(pk().t==='eof')fail("닫는 중괄호 '}' 가 부족해요.",t);body.push(parseStmt())}
   p++;return node('block',{body},t);
  }
  function declAhead(){
   const s=p;
   if(is('const'))p++;
   const ty=tryType();
   if(ty&&isId()&&(is('=',1)||is(';',1)||is(',',1))){return ty}
   p=s;return null;
  }
  function parseVarDecl(ty,t){
   const vars=[];
   do{
    const nt=pk();const name=ident();let init=null;
    if(eat('=')){init=(is('{')&&ty.arr)?node('newarr',{ty:{name:ty.name},init:parseInitList()},nt):parseExpr()}
    vars.push({name,init,line:nt.line});
   }while(eat(','));
   return node('decl',{ty,vars},t);
  }
  function parseEmbedded(){return parseStmt(true)}
  function parseStmt(embedded){
   const t=pk();
   if(is('{'))return parseBlock();
   if(is(';')){p++;return node('empty',{},t)}
   if(t.t==='kw'){
    switch(t.v){
     case 'if':{p++;expect('(');const c=parseExpr();expect(')');const a=parseEmbedded();let b=null;if(eat('else'))b=parseEmbedded();return node('if',{c,a,b},t)}
     case 'while':{p++;expect('(');const c=parseExpr();expect(')');return node('while',{c,body:parseEmbedded()},t)}
     case 'do':{p++;const body=parseEmbedded();expect('while');expect('(');const c=parseExpr();expect(')');expect(';');return node('do',{c,body},t)}
     case 'for':{p++;expect('(');let init=[];
      if(!is(';')){const ty=declAhead();if(ty)init=[parseVarDecl(ty,t)];else{do{init.push(node('expr',{e:parseExpr()},t))}while(eat(','))}}
      expect(';');const c=is(';')?null:parseExpr();expect(';');const it=[];if(!is(')')){do{it.push(parseExpr())}while(eat(','))}expect(')');
      return node('for',{init,c,it,body:parseEmbedded()},t)}
     case 'foreach':{p++;expect('(');let ty=null;if(isId()&&pk().v==='var'&&isId(1)){p++}else{ty=tryType();if(!ty)fail('foreach 안에 변수 타입이 와야 해요.')}
      const name=ident();expect('in');const e=parseExpr();expect(')');return node('foreach',{ty,name,e,body:parseEmbedded()},t)}
     case 'switch':{p++;expect('(');const e=parseExpr();expect(')');expect('{');const secs=[];
      while(!is('}')){const labels=[];
       while(is('case')||is('default')){
        if(eat('default')){expect(':');labels.push(null);continue}
        p++;
        const s0=p;const ty=tryType();
        if(ty&&isId()&&(is(':',1)||is('when',1))){const b=ident();labels.push({ty,bind:b});eat(':');continue}
        p=s0;labels.push({e:parseExpr()});expect(':');
       }
       if(!labels.length)fail('switch 안에는 case 또는 default 가 와야 해요.');
       const body=[];while(!is('case')&&!is('default')&&!is('}'))body.push(parseStmt());
       secs.push({labels,body});
      }
      p++;return node('switch',{e,secs},t)}
     case 'break':p++;expect(';');return node('break',{},t);
     case 'continue':p++;expect(';');return node('continue',{},t);
     case 'return':{p++;const e=is(';')?null:parseExpr();expect(';');return node('return',{e},t)}
     case 'throw':{p++;const e=is(';')?null:parseExpr();expect(';');return node('throw',{e},t)}
     case 'try':{p++;const tb=parseBlock();let cb=null,cv=null,fb=null;
      while(is('catch')){p++;if(eat('(')){tryType();if(isId())cv=ident();expect(')')}const b=parseBlock();if(!cb)cb=b}
      if(eat('finally'))fb=parseBlock();
      return node('try',{tb,cb,cv,fb},t)}
     case 'lock':case 'using':{if(is('(',1)){p+=2;const d=declAhead();if(d)parseVarDecl(d,t);else parseExpr();expect(')');return parseEmbedded()}break}
     case 'goto':fail('goto 는 이 연습장에서 지원하지 않아요.',t);
    }
   }
   if(isId()&&t.v==='yield'&&(is('return',1)||is('break',1))){
    p++;if(eat('break')){expect(';');return node('ybreak',{},t)}
    p++;const e=parseExpr();expect(';');return node('yield',{e},t);
   }
   const ty=declAhead();
   if(ty){if(embedded){}const d=parseVarDecl(ty,t);expect(';');return d}
   if(isId()&&pk().v==='var'&&isId(1)&&is('=',2)){p++;const d=parseVarDecl({name:'var'},t);expect(';');return d}
   const e=parseExpr();
   if(!['assign','call','pre','post','new'].includes(e.k)){
    if(e.k==='bin'&&(e.op==='<'||e.op==='>'))fail('이 줄을 해석하지 못했어요. 제네릭 타입(<…>)이나 비교식 위치를 확인하세요.',t);
    fail('이 줄은 실행되는 문장이 아니에요. 대입(=), 메서드 호출, ++/-- 같은 문장이어야 해요.',t);
   }
   expect(';');
   return node('expr',{e},t);
  }

  /* 선언 */
  const MODS=new Set(['public','private','protected','internal','static','readonly','const','override','virtual','abstract','sealed','partial','extern','volatile','unsafe','new','async']);
  function skipAttrs(){while(is('[')){let d=0;do{const t=nx();if(t.v==='[')d++;else if(t.v===']')d--;if(t.t==='eof')fail('[ 속성이 닫히지 않았어요.')}while(d>0)}}
  function mods(){const m=new Set();for(;;){skipAttrs();const t=pk();if((t.t==='kw'||t.t==='id')&&MODS.has(t.v)&&!(t.v==='new'&&is('(',1))){m.add(t.v);p++;continue}break}return m}
  function parseParams(){
   expect('(');const ps=[];
   if(!is(')')){do{
    skipAttrs();let mode=null;
    if(is('ref')||is('out')||is('in')||is('params')||(isId()&&pk().v==='this')){mode=nx().v}
    const ty=tryType();if(!ty)fail('매개변수 타입이 와야 해요.');
    const name=ident();let def=null;if(eat('='))def=parseExpr();
    ps.push({name,ty,mode:mode==='params'||mode==='this'||mode==='in'?null:mode,def,params:mode==='params'});
   }while(eat(','))}
   expect(')');return ps;
  }
  function parseEnum(){
   const t=pk();p++;const name=ident();if(eat(':'))tryType();expect('{');const members=[];let val=0;
   while(!is('}')){skipAttrs();const m=ident();if(eat('=')){const e=parseExpr();if(e.k==='lit'&&typeof e.v==='number')val=e.v;else if(e.k==='un'&&e.op==='-'&&e.e.k==='lit')val=-e.e.v}members.push({name:m,val});val++;if(!eat(','))break}
   expect('}');eat(';');return {kind:'enum',name,members,line:t.line};
  }
  function parseTypeDecl(m){
   const t=nx();const kind=t.v;
   const name=ident();
   if(is('<')){let d=0;do{const x=nx();if(x.v==='<')d++;else if(x.v==='>')d--}while(d>0)}
   let bases=[];
   if(eat(':')){do{const b=tryType();if(b)bases.push(b.name)}while(eat(','))}
   while(isId()&&pk().v==='where'){while(!is('{'))p++}
   const cls={kind,name,bases,fields:[],methods:{},props:{},ctors:[],nested:[],enums:[],isStatic:m.has('static'),line:t.line};
   expect('{');
   parseMembers(cls,'}');
   expect('}');eat(';');
   return cls;
  }
  function parseMembers(cls,end){
   while(!is(end)&&pk().t!=='eof'){
    if(is('using')){while(!is(';'))p++;p++;continue}
    if(is(';')){p++;continue}
    const t=pk();
    const m=mods();
    if(is('class')||is('struct')||is('interface')||(isId()&&pk().v==='record'&&isId(1))){
     if(isId())pk().v='class';
     const c=parseTypeDecl(m);if(c.kind==='interface')continue;cls.nested.push(c);continue;
    }
    if(is('enum')){cls.enums.push(parseEnum());continue}
    if(is('namespace')){p++;tryType();if(eat(';'))continue;expect('{');parseMembers(cls,'}');expect('}');continue}
    if(is('delegate')){while(!is(';'))p++;p++;continue}
    let isEvent=false;if(eat('event'))isEvent=true;
    if(isId()&&pk().v===cls.name&&is('(',1)){p++;const params=parseParams();if(eat(':')){nx();expect('(');parseArgs(')')}const body=is('{')?parseBlock():(expect(';'),null);cls.ctors.push({params,body,line:t.line});continue}
    if(is('~')){p++;ident();parseParams();parseBlock();continue}
    const ty=tryType();
    if(!ty)fail(`${desc(pk())} 를 해석하지 못했어요. 클래스 안에는 필드, 메서드, 프로퍼티 선언이 와야 해요. 문장은 메서드 안에 써야 해요.`);
    if(is('operator')||is('this')){fail('연산자 오버로드나 인덱서는 이 연습장에서 지원하지 않아요.')}
    if(is('(')&&cls.name===ty.name){/* 생성자 */const params=parseParams();if(eat(':')){nx();expect('(');parseArgs(')')}const body=parseBlock();cls.ctors.push({params,body,line:t.line});continue}
    if(!isId()){
     if(is('('))fail(`메서드 '${ty.name}' 앞에 반환 타입(void 등)이 빠졌어요.`);
     fail(`${desc(pk())} 를 해석하지 못했어요. 선언 형식을 확인하세요.`);
    }
    const name=ident();
    if(is('<')){let d=0;do{const x=nx();if(x.v==='<')d++;else if(x.v==='>')d--}while(d>0)}
    if(is('(')){
     const params=parseParams();
     while(isId()&&pk().v==='where'){while(!is('{')&&!is('=>')&&!is(';'))p++}
     let body=null,expr=null;
     if(is('{'))body=parseBlock();else if(eat('=>')){expr=parseExpr();expect(';')}else expect(';');
     const meth={name,params,ret:ty,body,expr,isStatic:m.has('static'),iter:/^(IEnumerator|IEnumerable)$/.test(ty.name),line:t.line};
     (cls.methods[name]=cls.methods[name]||[]).push(meth);
     continue;
    }
    if(is('{')&&!isEvent){
     p++;const prop={name,ty,isStatic:m.has('static'),get:null,set:null,auto:true,line:t.line};
     while(!is('}')){
      mods();
      const a=ident();
      if(a!=='get'&&a!=='set'&&a!=='init')fail("프로퍼티 안에는 get 또는 set 이 와야 해요.");
      let body=null,expr=null;
      if(is('{')){body=parseBlock();prop.auto=false}else if(eat('=>')){expr=parseExpr();expect(';');prop.auto=false}else expect(';');
      prop[a==='init'?'set':a]={body,expr,has:true};
     }
     p++;
     if(eat('=')){prop.init=parseExpr();expect(';')}
     cls.props[name]=prop;continue;
    }
    if(is('=>')){p++;const expr=parseExpr();expect(';');cls.props[name]={name,ty,isStatic:m.has('static'),get:{expr,has:true},set:null,auto:false,line:t.line};continue}
    /* 필드 */
    p--;
    do{
     const nt=pk();const fname=ident();let init=null;
     if(eat('=')){init=(is('{')&&ty.arr)?node('newarr',{ty:{name:ty.name},init:parseInitList()},nt):parseExpr()}
     cls.fields.push({name:fname,ty,init,isStatic:m.has('static')||m.has('const'),isConst:m.has('const'),isEvent,line:nt.line});
    }while(eat(','));
    if(!is(';')){
     const prev=T[p-1];
     fail(`${prev.line}번째 줄 끝에 세미콜론(;)이 빠진 것 같아요. 필드 선언은 ; 로 끝나야 해요.`,prev);
    }
    p++;
   }
  }
  if(T[0].t==='id'&&T[0].v==='__E'){/* 보간 식 전용 */p=2;const e=parseExpr();return {exprOnly:e}}
  const top={kind:'class',name:'__Snippet',bases:[],fields:[],methods:{},props:{},ctors:[],nested:[],enums:[],line:1};
  parseMembers(top,'eof__');
  if(pk().t!=='eof'){const t=pk();if(t.v==='}')fail("여는 중괄호보다 닫는 중괄호 '}' 가 더 많아요.",t);fail(`${desc(t)} 를 해석하지 못했어요.`,t)}
  return top;
 }

 /* ---------- 실행기 ---------- */
 const isVec=v=>v!==null&&typeof v==='object'&&typeof v.x==='number'&&typeof v.y==='number'&&!Array.isArray(v)&&!v.__cls;
 const mkV=(x,y,z)=>{const o={x,y};if(z!==undefined)o.z=z;return o};
 const isCol=v=>v!==null&&typeof v==='object'&&typeof v.r==='number'&&typeof v.g==='number'&&typeof v.b==='number'&&!v.__cls;
 const cp=v=>{if(isVec(v)){const o={x:v.x,y:v.y};if(v.z!==undefined)o.z=v.z;if(v.w!==undefined)o.w=v.w;return o}if(isCol(v))return {r:v.r,g:v.g,b:v.b,a:v.a};return v};
 const INTS=new Set(['int','long','short','byte','uint','ulong','ushort','sbyte']);
 const FLOATS=new Set(['float','double','decimal']);
 const normT=t=>!t?null:INTS.has(t)?'int':FLOATS.has(t)?'float':t;
 function fmtNum(v,f){
  if(typeof v!=='number')return String(v);
  if(f){const m=/^([FfNnPp])(\d*)$/.exec(f);if(m){const d=m[2]===''?2:+m[2];if(/[Pp]/.test(m[1]))return (v*100).toFixed(d)+'%';return v.toFixed(d)}
   const z=/^0(?:\.(0+))?$/.exec(f);if(z)return v.toFixed(z[1]?z[1].length:0);
   const dd=/^[Dd](\d+)$/.exec(f);if(dd)return String(Math.trunc(v)).padStart(+dd[1],'0')}
  if(Number.isInteger(v))return String(v);
  if(!isFinite(v))return v>0?'Infinity':v<0?'-Infinity':'NaN';
  return String(+v.toPrecision(7));
 }
 function str(v,f){
  if(v===null||v===undefined)return '';
  if(typeof v==='boolean')return v?'True':'False';
  if(typeof v==='number')return fmtNum(v,f);
  if(typeof v==='string')return v;
  if(isVec(v))return '('+[v.x,v.y].concat(v.z!==undefined?[v.z]:[]).map(n=>n.toFixed(2)).join(', ')+')';
  if(isCol(v))return `RGBA(${v.r.toFixed(3)}, ${v.g.toFixed(3)}, ${v.b.toFixed(3)}, ${(v.a??1).toFixed(3)})`;
  if(v.__cls)return v.__cls.name;
  if(Array.isArray(v))return 'System.Collections.Generic.List';
  if(typeof v.ToString==='function')return v.ToString();
  return v.name||'Object';
 }

 /* 컬렉션 */
 class Dict{constructor(){this.m=new Map()}
  get Count(){return this.m.size}get Keys(){return [...this.m.keys()]}get Values(){return [...this.m.values()]}
  Add(k,v){if(this.m.has(k))throw err('ArgumentException','이미 같은 키가 Dictionary에 있어요: '+str(k));this.m.set(k,v)}
  ContainsKey(k){return this.m.has(k)}ContainsValue(v){return [...this.m.values()].includes(v)}
  Remove(k){return this.m.delete(k)}Clear(){this.m.clear()}
  TryGetValue(k,cell){if(this.m.has(k)){cell.value=this.m.get(k);return true}cell.value=null;return false}
  TryAdd(k,v){if(this.m.has(k))return false;this.m.set(k,v);return true}
  __get(k){if(!this.m.has(k))throw err('KeyNotFoundException','Dictionary에 없는 키예요: '+str(k));return this.m.get(k)}
  __set(k,v){this.m.set(k,v)}
  [Symbol.iterator](){return [...this.m.entries()].map(([Key,Value])=>({Key,Value}))[Symbol.iterator]()}}
 class HSet{constructor(a){this.s=new Set(a||[])}get Count(){return this.s.size}Add(x){if(this.s.has(x))return false;this.s.add(x);return true}Contains(x){return this.s.has(x)}Remove(x){return this.s.delete(x)}Clear(){this.s.clear()}[Symbol.iterator](){return this.s[Symbol.iterator]()}}
 class Queue{constructor(a){this.a=[...(a||[])]}get Count(){return this.a.length}Enqueue(x){this.a.push(x)}Dequeue(){if(!this.a.length)throw err('InvalidOperationException','빈 Queue에서 Dequeue 했어요.');return this.a.shift()}Peek(){if(!this.a.length)throw err('InvalidOperationException','빈 Queue에서 Peek 했어요.');return this.a[0]}Contains(x){return this.a.includes(x)}Clear(){this.a.length=0}TryDequeue(cell){if(!this.a.length){cell.value=null;return false}cell.value=this.a.shift();return true}[Symbol.iterator](){return this.a[Symbol.iterator]()}}
 class Stack{constructor(a){this.a=[...(a||[])]}get Count(){return this.a.length}Push(x){this.a.push(x)}Pop(){if(!this.a.length)throw err('InvalidOperationException','빈 Stack에서 Pop 했어요.');return this.a.pop()}Peek(){if(!this.a.length)throw err('InvalidOperationException','빈 Stack에서 Peek 했어요.');return this.a[this.a.length-1]}Contains(x){return this.a.includes(x)}Clear(){this.a.length=0}[Symbol.iterator](){return [...this.a].reverse()[Symbol.iterator]()}}
 class SB{constructor(s){this.s=s?String(s):''}get Length(){return this.s.length}Append(x){this.s+=str(x);return this}AppendLine(x){this.s+=(x===undefined?'':str(x))+'\n';return this}Clear(){this.s='';return this}Insert(i,x){this.s=this.s.slice(0,i)+str(x)+this.s.slice(i);return this}ToString(){return this.s}}

 function arrMethod(a,name,args,line,fnCall){
  const chk=i=>{if(!(i>=0&&i<a.length))throw err('ArgumentOutOfRangeException',`인덱스 ${i} 가 범위(0 ~ ${a.length-1})를 벗어났어요.`,line)};
  const f=x=>(...y)=>fnCall(x,y);
  switch(name){
   case 'Add':a.push(args[0]);a.__v=(a.__v||0)+1;return;
   case 'AddRange':for(const x of iter(args[0],line))a.push(x);a.__v=(a.__v||0)+1;return;
   case 'Remove':{const i=a.indexOf(args[0]);if(i<0)return false;a.splice(i,1);a.__v=(a.__v||0)+1;return true}
   case 'RemoveAt':chk(args[0]);a.splice(args[0],1);a.__v=(a.__v||0)+1;return;
   case 'RemoveRange':a.splice(args[0],args[1]);a.__v=(a.__v||0)+1;return;
   case 'Insert':if(!(args[0]>=0&&args[0]<=a.length))chk(args[0]);a.splice(args[0],0,args[1]);a.__v=(a.__v||0)+1;return;
   case 'Contains':return a.some(x=>x===args[0]||(isVec(x)&&isVec(args[0])&&x.x===args[0].x&&x.y===args[0].y));
   case 'IndexOf':return a.indexOf(args[0]);
   case 'Clear':a.length=0;a.__v=(a.__v||0)+1;return;
   case 'RemoveAll':{const p=f(args[0]);let n=0;for(let i=a.length-1;i>=0;i--)if(p(a[i])){a.splice(i,1);n++}a.__v=(a.__v||0)+1;return n}
   case 'Find':{const p=f(args[0]);const r=a.find(x=>p(x));return r===undefined?null:r}
   case 'FindIndex':{const p=f(args[0]);return a.findIndex(x=>p(x))}
   case 'FindAll':case 'Where':{const p=f(args[0]);return a.filter(x=>p(x))}
   case 'Exists':case 'Any':{if(!args.length)return a.length>0;const p=f(args[0]);return a.some(x=>p(x))}
   case 'All':{const p=f(args[0]);return a.every(x=>p(x))}
   case 'ForEach':{const p=f(args[0]);for(const x of [...a])p(x);return}
   case 'Sort':{if(args.length){const c=f(args[0]);a.sort((x,y)=>c(x,y))}else a.sort((x,y)=>typeof x==='string'?(x<y?-1:x>y?1:0):x-y);a.__v=(a.__v||0)+1;return}
   case 'Reverse':a.reverse();return;
   case 'ToArray':case 'ToList':return [...a];
   case 'Select':{const p=f(args[0]);return a.map(x=>p(x))}
   case 'OrderBy':{const p=f(args[0]);return [...a].sort((x,y)=>{const u=p(x),v=p(y);return u<v?-1:u>v?1:0})}
   case 'OrderByDescending':{const p=f(args[0]);return [...a].sort((x,y)=>{const u=p(x),v=p(y);return u<v?1:u>v?-1:0})}
   case 'First':{const r=args.length?a.filter(x=>f(args[0])(x)):a;if(!r.length)throw err('InvalidOperationException','First(): 요소가 없어요.',line);return r[0]}
   case 'FirstOrDefault':{const r=args.length?a.filter(x=>f(args[0])(x)):a;return r.length?r[0]:null}
   case 'Last':{if(!a.length)throw err('InvalidOperationException','Last(): 요소가 없어요.',line);return a[a.length-1]}
   case 'LastOrDefault':return a.length?a[a.length-1]:null;
   case 'Count':{if(!args.length)return a.length;const p=f(args[0]);return a.filter(x=>p(x)).length}
   case 'Sum':{const p=args.length?f(args[0]):x=>x;return a.reduce((s,x)=>s+p(x),0)}
   case 'Min':case 'Max':{if(!a.length)throw err('InvalidOperationException',name+'(): 요소가 없어요.',line);const p=args.length?f(args[0]):x=>x;const v=a.map(x=>p(x));return name==='Min'?Math.min(...v):Math.max(...v)}
   case 'Average':{if(!a.length)throw err('InvalidOperationException','Average(): 요소가 없어요.',line);const p=args.length?f(args[0]):x=>x;return a.reduce((s,x)=>s+p(x),0)/a.length}
   case 'Distinct':return [...new Set(a)];
   case 'Take':return a.slice(0,args[0]);
   case 'Skip':return a.slice(args[0]);
   case 'Concat':return a.concat([...iter(args[0],line)]);
   case 'GetLength':return a.length;
   case 'Clone':return [...a];
   case 'CopyTo':{for(let i=0;i<a.length;i++)args[0][(args[1]||0)+i]=a[i];return}
   case 'ToString':return 'System.Collections.Generic.List';
  }
  throw err('MissingMember',`리스트/배열에는 '${name}' 메서드가 없어요.`,line);
 }
 function strMethod(s,name,args,line){
  switch(name){
   case 'ToUpper':case 'ToUpperInvariant':return s.toUpperCase();
   case 'ToLower':case 'ToLowerInvariant':return s.toLowerCase();
   case 'Contains':return s.includes(args[0]);
   case 'StartsWith':return s.startsWith(args[0]);
   case 'EndsWith':return s.endsWith(args[0]);
   case 'IndexOf':return s.indexOf(args[0]);
   case 'Substring':{if(args[0]>s.length||args[0]<0||(args.length>1&&args[0]+args[1]>s.length))throw err('ArgumentOutOfRangeException','Substring 범위가 문자열 길이를 벗어났어요.',line);return args.length>1?s.substr(args[0],args[1]):s.slice(args[0])}
   case 'Trim':return s.trim();case 'TrimStart':return s.trimStart();case 'TrimEnd':return s.trimEnd();
   case 'Replace':return s.split(args[0]).join(args[1]);
   case 'Split':return s.split(typeof args[0]==='string'?args[0]:String(args[0]));
   case 'Equals':return s===args[0];
   case 'ToString':return s;
   case 'PadLeft':return s.padStart(args[0],args[1]||' ');
   case 'PadRight':return s.padEnd(args[0],args[1]||' ');
   case 'CompareTo':return s<args[0]?-1:s>args[0]?1:0;
   case 'ToCharArray':return s.split('');
  }
  throw err('MissingMember',`string 에는 '${name}' 메서드가 없어요.`,line);
 }
 function* iter(v,line){
  if(v===null||v===undefined)throw err('NullReferenceException','foreach 대상이 null 이에요.',line);
  if(typeof v==='string'){yield* v;return}
  if(Array.isArray(v)){
   const ver=v.__v||0,len=v.length;
   for(let i=0;i<v.length;i++){
    if((v.__v||0)!==ver||v.length!==len)throw err('InvalidOperationException','Collection was modified: foreach 로 순회하는 도중에 컬렉션을 수정했어요(추가/삭제). 뒤에서부터 도는 for 문이나 RemoveAll 을 쓰세요.',line);
    yield v[i];
   }
   if((v.__v||0)!==ver||v.length!==len)throw err('InvalidOperationException','Collection was modified: foreach 로 순회하는 도중에 컬렉션을 수정했어요(추가/삭제).',line);
   return;
  }
  if(v[Symbol.iterator]){yield* v;return}
  throw err('Unsupported','이 값은 foreach 로 순회할 수 없어요.',line);
 }

 function Scope(parent){this.vars=new Map();this.parent=parent}
 Scope.prototype.find=function(n){let s=this;while(s){const b=s.vars.get(n);if(b)return b;s=s.parent}return null};

 function load(src,G,opt){
  opt=opt||{};
  const ast=typeof src==='string'?parse(src):src;
  const t0=Date.now(),limitMs=opt.timeMs||2500;let ticks=0;
  const tick=line=>{if(++ticks%5000===0&&Date.now()-t0>limitMs)throw err('Timeout','실행이 너무 오래 걸려요. 무한 루프가 없는지 확인하세요.',line)};

  /* 클래스 정리 */
  const classes=new Map(),enums=new Map(),enumOrd=new Map();
  const enumSet=new WeakSet();
  const regEnum=e=>{const o={};enumSet.add(o);e.members.forEach(m=>{o[m.name]=m.name;enumOrd.set(e.name+'.'+m.name,m.val);if(!enumOrd.has(m.name))enumOrd.set(m.name,m.val)});o.__enum=e.name;o.__members=e.members;enums.set(e.name,o)};
  const regCls=(c,outer)=>{c.outer=outer||null;c.statics={};classes.set(c.name,c);c.enums.forEach(regEnum);c.nested.forEach(n=>regCls(n,c))};
  regCls(ast,null);
  let main=ast;
  const hasMembers=c=>c.fields.length||Object.keys(c.methods).length||Object.keys(c.props).length;
  if(!hasMembers(ast)&&ast.nested.length){
   main=ast.nested.find(c=>c.bases.some(b=>/MonoBehaviour|ScriptableObject|NetworkBehaviour|StateMachineBehaviour/.test(b)))||ast.nested.find(c=>c.kind==='class')||ast.nested[0];
  }
  const findMethod=(c,n)=>{while(c){if(c.methods[n])return {c,ms:c.methods[n]};c=c.outer&&c.kind!=='class'?null:(classes.get(c.bases[0])||null)}return null};
  const findProp=(c,n)=>{while(c){if(c.props[n])return {c,pr:c.props[n]};c=classes.get(c.bases[0])||null}return null};
  const findField=(c,n)=>{while(c){const f=c.fields.find(f=>f.name===n);if(f)return {c,f};c=classes.get(c.bases[0])||null}return null};
  const findStaticOwner=(c,n)=>{let k=c;while(k){if(k.fields.some(f=>f.name===n&&f.isStatic)||Object.values(k.props).some(pr=>pr.name===n&&pr.isStatic))return k;k=k.outer}return null};

  const defaultOf=ty=>{
   if(!ty)return null;
   if(ty.arr)return null;
   const n=normT(ty.name);
   if(n==='int'||n==='float')return 0;
   if(n==='bool')return false;
   if(n==='char')return '\0';
   if(ty.name==='Vector2')return mkV(0,0);
   if(ty.name==='Vector3')return mkV(0,0,0);
   if(ty.name==='Color')return {r:0,g:0,b:0,a:0};
   if(enums.has(ty.name)){const e=enums.get(ty.name);const z=e.__members.find(m=>m.val===0)||e.__members[0];return z?z.name:null}
   const uc=classes.get(ty.name);if(uc&&uc.kind==='struct')return instantiate(uc,[],0);
   return null;
  };

  /* 정적 타입 추론(정수 나눗셈 등) */
  function ty(n,cx){
   if(n._t!==undefined&&n.k!=='id')return n._t;
   let r=null;
   switch(n.k){
    case 'lit':r=n.num?(n.dbl?'double':n.isF?'float':'int'):typeof n.v==='string'?(n.chr?'char':'string'):typeof n.v==='boolean'?'bool':null;break;
    case 'id':{const b=cx.scope&&cx.scope.find(n.name);if(b)return normT(b.t);
     const f=cx.cls&&findField(cx.cls,n.name);if(f)return normT(f.f.ty.arr?'array':f.f.ty.name);
     const pr=cx.cls&&findProp(cx.cls,n.name);if(pr)return normT(pr.pr.ty.name);return null}
    case 'mem':if(n.name==='Count'||n.name==='Length')r='int';else if(n.e.k==='this'){const f=cx.cls&&findField(cx.cls,n.name);r=f?normT(f.f.ty.name):null}else if(n.e.k==='id'&&n.e.name==='Mathf'&&['PI','Infinity','Deg2Rad','Rad2Deg','Epsilon'].includes(n.name))r='float';else if(n.e.k==='id'&&n.e.name==='Time')r='float';break;
    case 'call':{
     if(n.f.k==='mem'&&n.f.e.k==='id'&&n.f.e.name==='Mathf'){r=/ToInt$/.test(n.f.name)?'int':(['Abs','Max','Min','Clamp'].includes(n.f.name)&&n.args.every(a=>ty(a,cx)==='int'))?'int':'float';break}
     if(n.f.k==='mem'&&(n.f.name==='Count'))r='int';
     if(n.f.k==='id'&&cx.cls){const m=findMethod(cx.cls,n.f.name);if(m)r=normT(m.ms[0].ret.name)}
     if(n.f.k==='mem'&&n.f.e.k==='id'&&n.f.e.name==='Random'&&n.f.name==='Range')r=n.args.every(a=>ty(a,cx)==='int')?'int':'float';
     return r}
    case 'cast':r=normT(n.ty.name);break;
    case 'un':r=n.op==='!'?'bool':ty(n.e,cx);return r;
    case 'pre':case 'post':return ty(n.e,cx);
    case 'bin':{if(['==','!=','<','>','<=','>=','&&','||'].includes(n.op))return 'bool';
     const a=ty(n.l,cx),b=ty(n.r,cx);
     if(a==='string'||b==='string')return n.op==='+'?'string':null;
     const num=x=>x==='int'||x==='float'||x==='double'||x==='char';
     if(a==='int'&&b==='int')return 'int';
     if(num(a)&&num(b))return (a==='double'||b==='double')?'double':(a==='float'||b==='float')?'float':'int';return null}
    case 'cond':{const a=ty(n.a,cx),b=ty(n.b,cx);return a===b?a:(a==='double'||b==='double')?'double':(a==='float'||b==='float')?'float':null}
    default:return null;
   }
   n._t=r;return r;
  }

  const isDoubleVar=(n,cx)=>{if(n.k!=='id')return false;const b=cx.scope&&cx.scope.find(n.name);if(b)return b.t==='double';const f=cx.cls&&findField(cx.cls,n.name);return !!(f&&f.f.ty.name==='double')};
  /* 값 구하기 */
  const nullErr=(n,what)=>err('NullReferenceException',`${what||srcOf(n)} 이(가) null 이에요. 값을 넣지 않았거나(Inspector 연결, GetComponent 누락) 이미 파괴된 대상일 수 있어요.`,n.line);
  const srcOf=n=>{switch(n.k){case 'id':return n.name;case 'mem':return srcOf(n.e)+'.'+n.name;case 'this':return 'this';case 'call':return srcOf(n.f)+'(…)';case 'index':return srcOf(n.e)+'[…]';default:return '이 값'}};
  const boundCache=new WeakMap();
  function bound(inst,c,name){
   const key=inst||c;let m=boundCache.get(key);if(!m){m=new Map();boundCache.set(key,m)}
   if(!m.has(name)){const f=(...a)=>invoke(c,inst,name,a,0);f.__name=name;m.set(name,f)}
   return m.get(name);
  }
  const TypeRef=function(c){this.__type=c};
  function lookupId(n,cx){
   const name=n.name;
   const b=cx.scope&&cx.scope.find(name);if(b)return {ok:true,v:b.v};
   if(cx.inst&&(name in cx.inst))return {ok:true,v:cx.inst[name]};
   if(cx.cls){
    const pr=findProp(cx.cls,name);if(pr&&!pr.pr.isStatic&&cx.inst)return {ok:true,v:getProp(pr.c,pr.pr,cx.inst)};
    const so=findStaticOwner(cx.cls,name);if(so){ensureStatics(so);const spr=so.props[name];if(spr&&!spr.auto)return {ok:true,v:getProp(so,spr,null)};return {ok:true,v:so.statics[name]}}
    const m=findMethod(cx.cls,name);if(m)return {ok:true,v:bound(m.ms[0].isStatic?null:cx.inst,m.c,name)};
   }
   if(enums.has(name))return {ok:true,v:enums.get(name)};
   if(classes.has(name))return {ok:true,v:new TypeRef(classes.get(name))};
   if(name in G)return {ok:true,v:G[name]};
   return {ok:false};
  }
  const staticsInit=new Set();
  function ensureStatics(c){
   if(staticsInit.has(c))return;staticsInit.add(c);
   const cx={inst:null,cls:c,scope:null};
   for(const f of c.fields)if(f.isStatic)c.statics[f.name]=f.init?conv(f.ty,ev(f.init,cx,f.ty),f.line):defaultOf(f.ty);
   for(const pr of Object.values(c.props))if(pr.isStatic&&pr.auto)c.statics[pr.name]=pr.init?ev(pr.init,cx):defaultOf(pr.ty);
  }
  function getProp(c,pr,inst){
   if(pr.auto){const store=inst||(ensureStatics(c),c.statics);return store['__p_'+pr.name]!==undefined?store['__p_'+pr.name]:(pr.isStatic?c.statics[pr.name]:inst['__p_'+pr.name])}
   if(!pr.get)throw err('CS0154',`'${pr.name}' 프로퍼티에는 get 이 없어서 읽을 수 없어요.`);
   const cx={inst,cls:c,scope:new Scope(null)};
   if(pr.get.expr)return ev(pr.get.expr,cx);
   return runBody(pr.get.body,cx,false);
  }
  function setProp(c,pr,inst,v,line){
   if(pr.auto){if(!pr.set)throw err('CS0200',`'${pr.name}' 프로퍼티는 읽기 전용(get 만 있음)이라 값을 넣을 수 없어요.`,line);const store=inst||(ensureStatics(c),c.statics);store['__p_'+pr.name]=cp(v);return}
   if(!pr.set)throw err('CS0200',`'${pr.name}' 프로퍼티는 읽기 전용(get 만 있음)이라 값을 넣을 수 없어요.`,line);
   const sc=new Scope(null);sc.vars.set('value',{v:cp(v),t:pr.ty.name});
   const cx={inst,cls:c,scope:sc};
   if(pr.set.expr){ev(pr.set.expr,cx);return}
   runBody(pr.set.body,cx,false);
  }
  function conv(tyy,v,line){
   if(!tyy||v===undefined)return v;
   const n=normT(tyy.name);
   if(n==='int'&&typeof v==='number'&&!Number.isInteger(v)&&!tyy.arr){return Math.trunc(v)}
   return cp(v);
  }

  function instantiate(c,args,line){
   if(c.kind==='interface')throw err('CS0144','인터페이스는 new 로 만들 수 없어요.',line);
   const inst={};Object.defineProperty(inst,'__cls',{value:c,enumerable:false});
   const chain=[];let k=c;while(k){chain.unshift(k);k=classes.get(k.bases[0])||null}
   for(const kc of chain){
    const cx={inst,cls:kc,scope:null};
    for(const f of kc.fields)if(!f.isStatic){if(f.init&&f.ty.name==='float'&&!f.ty.arr&&ty(f.init,cx)==='double')throw err('CS0664',`double 값을 float 필드 '${f.name}' 에 넣을 수 없어요. 소수 뒤에 f 를 붙이세요 (예: 0.5f).`,f.line);inst[f.name]=f.init?conv(f.ty,ev(f.init,cx,f.ty),f.line):defaultOf(f.ty)}
    for(const pr of Object.values(kc.props))if(pr.auto&&!pr.isStatic)inst['__p_'+pr.name]=pr.init?cp(ev(pr.init,cx)):defaultOf(pr.ty);
   }
   const ctor=pickOverload(c.ctors,args);
   if(ctor&&ctor.body){const sc=bindParams(ctor.params,args,{inst,cls:c},line);runBody(ctor.body,{inst,cls:c,scope:sc},false)}
   return inst;
  }
  function pickOverload(ms,args){
   if(!ms||!ms.length)return null;
   const fit=ms.filter(m=>args.length<=m.params.length&&m.params.slice(args.length).every(p=>p.def||p.params)||m.params.some(p=>p.params));
   if(fit.length<=1)return fit[0]||null;
   const score=m=>m.params.reduce((s,p,i)=>{const a=args[i];if(a===undefined||a&&a.__ref)return s;const t=normT(p.ty.name);if(t==='int'&&Number.isInteger(a))return s+1;if(t==='float'&&typeof a==='number')return s+0.5;if(t==='string'&&typeof a==='string')return s+1;if(t==='bool'&&typeof a==='boolean')return s+1;return s},0)-(m.params.length-args.length)*0.1;
   return fit.sort((a,b)=>score(b)-score(a))[0];
  }
  function bindParams(params,args,cx,line){
   const sc=new Scope(null);
   params.forEach((p,i)=>{
    if(p.params){sc.vars.set(p.name,{v:args.slice(i).length===1&&Array.isArray(args[i])?args[i]:args.slice(i),t:'array'});return}
    let a=args[i];
    if(p.mode==='ref'||p.mode==='out'){
     if(!a||!a.__ref)throw err('CS1620',`'${p.name}' 매개변수에는 ${p.mode} 키워드를 붙여 전달해야 해요.`,line);
     sc.vars.set(p.name,a.binding);return;
    }
    if(a&&a.__ref)a=a.binding.v;
    if(a===undefined)a=p.def?ev(p.def,cx):defaultOf(p.ty);
    sc.vars.set(p.name,{v:conv(p.ty,a,line),t:p.ty.arr?'array':p.ty.name});
   });
   return sc;
  }
  function invoke(c,inst,name,args,line){
   const found=findMethod(c,name);
   if(!found)throw err('MissingMember',`'${name}' 메서드를 찾지 못했어요.`,line);
   const m=pickOverload(found.ms,args);
   if(!m)throw err('CS1501',`'${name}' 메서드에 인자 ${args.length}개를 받는 형태가 없어요.`,line);
   const cls=found.c;
   const sc=bindParams(m.params,args,{inst,cls},line);
   const cx={inst:m.isStatic?null:inst,cls,scope:sc};
   if(m.iter){
    const g=execG(m.body,cx);
    return (function*(){for(;;){const r=g.next();if(r.done)return;yield r.value}})();
   }
   if(m.expr)return ev(m.expr,cx);
   if(!m.body)return undefined;
   const r=runBody(m.body,cx,true);
   if(r===NORET&&normT(m.ret.name)!=='void'&&m.ret.name!=='void')throw err('CS0161',`'${name}' 메서드의 모든 경로에서 값을 반환하지 않아요. return 문을 확인하세요.`,m.line);
   return r===NORET?undefined:r;
  }
  const NORET={};
  function runBody(body,cx,isMethod){
   const g=execG(body,cx);const r=g.next();
   if(!r.done)throw err('CS1624','yield return 은 IEnumerator 를 반환하는 메서드(코루틴) 안에서만 쓸 수 있어요.',body.line);
   const c=r.value;
   if(c&&c.k==='ret')return c.v;
   return NORET;
  }
  function callFn(f,args,line){
   if(typeof f!=='function')throw err('CS0149','호출할 수 없는 값이에요(메서드가 아님).',line);
   return f(...args);
  }
  function lambda(n,cx){
   return (...a)=>{
    const sc=new Scope(cx.scope);n.params.forEach((p,i)=>sc.vars.set(p,{v:cp(a[i]),t:null}));
    const c2={inst:cx.inst,cls:cx.cls,scope:sc};
    if(n.expr)return ev(n.expr,c2);
    const r=runBody(n.body,c2,true);return r===NORET?undefined:r;
   };
  }
  const combine=(a,b)=>{
   if(a===null||a===undefined)return b;if(b===null||b===undefined)return a;
   const list=(a.__list||[a]).concat(b.__list||[b]);
   const f=(...x)=>{let r;for(const g of list)r=g(...x);return r};f.__list=list;return f;
  };
  const remove=(a,b)=>{
   if(!a)return a;const list=[...(a.__list||[a])];const bl=b&&b.__list||[b];
   for(let i=list.length-bl.length;i>=0;i--){if(bl.every((x,j)=>list[i+j]===x)){list.splice(i,bl.length);break}}
   if(!list.length)return null;if(list.length===1)return list[0];
   const f=(...x)=>{let r;for(const g of list)r=g(...x);return r};f.__list=list;return f;
  };
  function eq(a,b){
   if((a===null||a===undefined)&&(b===null||b===undefined))return true;
   if(a===null||a===undefined||b===null||b===undefined){
    const o=a==null?b:a;if(o&&typeof o==='object'&&o.__destroyed)return true;return false}
   if(isVec(a)&&isVec(b))return Math.abs(a.x-b.x)<1e-5&&Math.abs(a.y-b.y)<1e-5&&Math.abs((a.z||0)-(b.z||0))<1e-5;
   if(isCol(a)&&isCol(b))return a.r===b.r&&a.g===b.g&&a.b===b.b&&a.a===b.a;
   return a===b;
  }
  function arith(op,a,b,n,cx){
   if(op==='+'&&(typeof a==='string'||typeof b==='string'))return str(a)+str(b);
   const va=isVec(a),vb=isVec(b);
   if(va||vb){
    const z=(va&&a.z!==undefined)||(vb&&b.z!==undefined);
    const mk=(x,y,zz)=>z?mkV(x,y,zz):mkV(x,y);
    if(va&&vb&&(op==='+'||op==='-')){const s=op==='+'?1:-1;return mk(a.x+s*b.x,a.y+s*b.y,(a.z||0)+s*(b.z||0))}
    if(va&&typeof b==='number'&&(op==='*'||op==='/')){const k=op==='*'?b:1/b;return mk(a.x*k,a.y*k,(a.z||0)*k)}
    if(vb&&typeof a==='number'&&op==='*')return mk(b.x*a,b.y*a,(b.z||0)*a);
    if(va&&vb&&op==='*')return mk(a.x*b.x,a.y*b.y,(a.z||0)*(b.z||0));
    throw err('CS0019',`벡터에는 '${op}' 연산을 이렇게 쓸 수 없어요.`,n.line);
   }
   if(isCol(a)&&isCol(b)&&(op==='+'||op==='-'||op==='*')){const f=op==='+'?(x,y)=>x+y:op==='-'?(x,y)=>x-y:(x,y)=>x*y;return {r:f(a.r,b.r),g:f(a.g,b.g),b:f(a.b,b.b),a:f(a.a??1,b.a??1)}}
   if(isCol(a)&&typeof b==='number'&&op==='*')return {r:a.r*b,g:a.g*b,b:a.b*b,a:(a.a??1)*b};
   if(a===null||a===undefined||b===null||b===undefined)throw err('NullReferenceException',`'${op}' 계산에 null 값이 들어갔어요.`,n.line);
   if(typeof a==='boolean'||typeof b==='boolean'){
    if(op==='&')return !!(a&&b);if(op==='|')return !!(a||b);if(op==='^')return a!==b;
    throw err('CS0019',`bool 값에는 '${op}' 연산을 쓸 수 없어요.`,n.line);
   }
   if(typeof a==='string'&&a.length===1&&typeof b==='number')a=a.charCodeAt(0);
   if(typeof b==='string'&&b.length===1&&typeof a==='number')b=b.charCodeAt(0);
   if(typeof a!=='number'||typeof b!=='number')throw err('CS0019',`'${str(a)}' 와 '${str(b)}' 에 '${op}' 연산을 쓸 수 없어요.`,n.line);
   switch(op){
    case '+':return a+b;case '-':return a-b;case '*':return a*b;
    case '/':{
     const ints=n&&ty(n.l,cx)==='int'&&ty(n.r,cx)==='int';
     if(ints){if(b===0)throw err('DivideByZeroException','정수를 0으로 나눴어요.',n.line);return Math.trunc(a/b)}
     return a/b;
    }
    case '%':{if(n&&ty(n.l,cx)==='int'&&ty(n.r,cx)==='int'&&b===0)throw err('DivideByZeroException','정수를 0으로 나눈 나머지를 구했어요.',n.line);return a%b}
    case '&':return a&b;case '|':return a|b;case '^':return a^b;
    case '<<':return a<<b;case '>>':return a>>b;
   }
  }
  function memberGet(o,name,n,cx){
   if(o instanceof TypeRef){
    const c=o.__type;ensureStatics(c);
    if(c.enums.find(e=>e.name===name))return enums.get(name);
    const nc=c.nested.find(x=>x.name===name);if(nc)return new TypeRef(nc);
    const pr=c.props[name];if(pr&&pr.isStatic)return getProp(c,pr,null);
    if(name in c.statics)return c.statics[name];
    const m=findMethod(c,name);if(m)return bound(null,m.c,name);
    throw err('MissingMember',`'${c.name}' 에는 정적 멤버 '${name}' 이(가) 없어요.`,n.line);
   }
   if(o&&enumSet.has(o)){if(o.__members.some(m=>m.name===name))return name;throw err('CS0117',`'${o.__enum}' 열거형에는 '${name}' 이(가) 없어요.`,n.line)}
   if(o&&o.__cls){
    if(name in o)return o[name];
    const pr=findProp(o.__cls,name);if(pr)return getProp(pr.c,pr.pr,o);
    const m=findMethod(o.__cls,name);if(m)return bound(o,m.c,name);
    if(o===mainInst&&(name in G))return G[name];
    throw err('MissingMember',`'${o.__cls.name}' 에는 '${name}' 이(가) 없어요. 철자와 선언을 확인하세요.`,n.line);
   }
   if(Array.isArray(o)){if(name==='Length'||name==='Count')return o.length;if(name==='Rank')return 1;throw err('MissingMember',`리스트/배열에는 '${name}' 이(가) 없어요. 메서드라면 괄호 ()를 붙이세요.`,n.line)}
   if(typeof o==='string'){if(name==='Length')return o.length;throw err('MissingMember',`string 에는 '${name}' 속성이 없어요.`,n.line)}
   if(typeof o==='number'){throw err('MissingMember',`숫자에는 '${name}' 속성이 없어요.`,n.line)}
   if(isVec(o)&&!(name in o)){
    const z=o.z!==undefined;
    if(name==='magnitude')return Math.hypot(o.x,o.y,o.z||0);
    if(name==='sqrMagnitude')return o.x*o.x+o.y*o.y+(o.z||0)*(o.z||0);
    if(name==='normalized'){const m=Math.hypot(o.x,o.y,o.z||0);if(m<1e-5)return z?mkV(0,0,0):mkV(0,0);return z?mkV(o.x/m,o.y/m,o.z/m):mkV(o.x/m,o.y/m)}
    if(name==='z')return 0;
   }
   if(typeof o==='function'&&o.__list&&name==='Method')return o;
   if(o!==null&&typeof o==='object'||typeof o==='function'){
    if(name in o)return o[name];
    if(name==='ToString')return ()=>str(o);
    throw err('MissingMember',`'${srcOf(n.e)}' 에는 '${name}' 이(가) 없어요. 철자를 확인하세요. 철자가 맞다면 이 연습장이 아직 흉내 내지 않는 Unity 기능일 수 있어요(AI 판정을 이용하세요).`,n.line);
   }
   throw err('MissingMember',`'${name}' 에 접근할 수 없어요.`,n.line);
  }
  function memberSet(o,name,v,n,cx){
   if(o instanceof TypeRef){const c=o.__type;ensureStatics(c);const pr=c.props[name];if(pr){setProp(c,pr,null,v,n.line);return}c.statics[name]=cp(v);return}
   if(o&&o.__cls){
    if(name in o){const f=findField(o.__cls,name);if(f&&f.f.isConst)throw err('CS0131','const 필드에는 값을 넣을 수 없어요.',n.line);o[name]=f?conv(f.f.ty,v,n.line):cp(v);return}
    const pr=findProp(o.__cls,name);if(pr){setProp(pr.c,pr.pr,o,v,n.line);return}
    throw err('MissingMember',`'${o.__cls.name}' 에는 '${name}' 이(가) 없어요.`,n.line);
   }
   if(o===null||o===undefined)throw nullErr(n.e);
   if(typeof o!=='object'&&typeof o!=='function')throw err('CS1612',`'${srcOf(n.e)}' 의 멤버에는 직접 값을 넣을 수 없어요.`,n.line);
   if(Array.isArray(o)&&(name==='Length'||name==='Count'))throw err('CS0200','Length/Count 는 읽기 전용이에요.',n.line);
   o[name]=cp(v);
  }
  function lref(n,cx){
   switch(n.k){
    case 'id':{
     const b=cx.scope&&cx.scope.find(n.name);
     if(b)return {get:()=>b.v,set:v=>{b.v=normT(b.t)==='int'&&typeof v==='number'?Math.trunc(v):cp(v)},b};
     if(cx.inst&&(n.name in cx.inst)){const f=findField(cx.cls,n.name);return {get:()=>cx.inst[n.name],set:v=>{if(f&&f.f.isConst)throw err('CS0131','const 필드에는 값을 넣을 수 없어요.',n.line);cx.inst[n.name]=f?conv(f.f.ty,v,n.line):cp(v)}}}
     if(cx.cls){
      const pr=findProp(cx.cls,n.name);if(pr&&!pr.pr.isStatic)return {get:()=>getProp(pr.c,pr.pr,cx.inst),set:v=>setProp(pr.c,pr.pr,cx.inst,v,n.line)};
      const so=findStaticOwner(cx.cls,n.name);if(so){ensureStatics(so);const spr=so.props[n.name];if(spr&&!spr.auto)return {get:()=>getProp(so,spr,null),set:v=>setProp(so,spr,null,v,n.line)};const f=so.fields.find(f=>f.name===n.name);return {get:()=>so.statics[n.name],set:v=>{if(f&&f.isConst)throw err('CS0131','const 필드에는 값을 넣을 수 없어요.',n.line);so.statics[n.name]=f?conv(f.ty,v,n.line):cp(v)}}}
     }
     if(n.name in G)return {get:()=>G[n.name],set:v=>{G[n.name]=v}};
     throw err('CS0103',`'${n.name}' 이라는 이름이 없어요. 변수를 선언했는지, 철자가 맞는지 확인하세요.`,n.line);
    }
    case 'mem':{
     const o=ev(n.e,cx);
     if((o===null||o===undefined)&&!(n.e.k==='this'))throw nullErr(n.e);
     return {get:()=>memberGet(o,n.name,n,cx),set:v=>memberSet(o,n.name,v,n,cx)};
    }
    case 'index':{
     const o=ev(n.e,cx);if(o===null||o===undefined)throw nullErr(n.e);
     const ks=n.args.map(a=>ev(a,cx));const k=ks[0];
     if(Array.isArray(o)){
      const chk=()=>{if(!(Number.isInteger(k)&&k>=0&&k<o.length))throw err('IndexOutOfRangeException',`인덱스 ${str(k)} 가 배열 범위(0 ~ ${o.length-1})를 벗어났어요.`,n.line)};
      return {get:()=>{chk();return o[k]},set:v=>{chk();o[k]=cp(v)}};
     }
     if(o instanceof Dict)return {get:()=>o.__get(k),set:v=>o.__set(k,cp(v))};
     if(typeof o==='string')return {get:()=>{if(!(k>=0&&k<o.length))throw err('IndexOutOfRangeException',`인덱스 ${k} 가 문자열 범위를 벗어났어요.`,n.line);return o[k]},set:()=>{throw err('CS0200','string 의 글자는 바꿀 수 없어요.',n.line)}};
     return {get:()=>o[k],set:v=>{o[k]=cp(v)}};
    }
    case 'this':return {get:()=>cx.inst,set:()=>{throw err('CS1604','this 에는 값을 넣을 수 없어요.',n.line)}};
   }
   throw err('CS0131','이 식에는 값을 넣을 수 없어요. 대입(=)의 왼쪽은 변수, 필드, 프로퍼티여야 해요.',n.line);
  }
  function evArgs(args,cx){
   return args.map(a=>{
    if(a.k==='outdecl'){const b={v:a.ty?defaultOf(a.ty):null,t:a.ty?a.ty.name:null};cx.scope.vars.set(a.name,b);return {__ref:true,binding:b}}
    if(a.k==='refarg'){
     if(a.e.k==='id'){const b=cx.scope&&cx.scope.find(a.e.name);if(b)return {__ref:true,binding:b}}
     const r=lref(a.e,cx);let t=null;
     if(a.e.k==='id'&&cx.cls){const f=findField(cx.cls,a.e.name);if(f)t=f.f.ty.name}
     const b={get v(){return r.get()},set v(x){r.set(x)},t};return {__ref:true,binding:b};
    }
    return ev(a,cx);
   });
  }
  function hostCall(fn,self,args,line,gen){
   const cells=[];
   const real=args.map(a=>{if(a&&a.__ref){const c={value:a.binding.v,type:a.binding.t};cells.push([c,a.binding]);return c}return a});
   const full=gen?gen.map(g=>g.name).concat(real):real;
   let r;
   try{r=fn.apply(self,full)}catch(e){if(e instanceof CSErr||e&&e.name&&/Exception|Timeout|CS\d|MissingMember/.test(e.name))throw e;throw err('HostError',(e&&e.message)||String(e),line)}
   for(const [c,b] of cells)b.v=c.value;
   return r;
  }
  function call(n,cx){
   const f=n.f;
   if(f.k==='id'){
    const name=f.name;
    const b=cx.scope&&cx.scope.find(name);
    if(b){const args=evArgs(n.args,cx);if(b.v===null||b.v===undefined)throw nullErr(f);return callFn(b.v,args.map(a=>a&&a.__ref?a.binding.v:a),n.line)}
    if(cx.cls){
     const m=findMethod(cx.cls,name);
     if(m){const args=evArgs(n.args,cx);return invoke(m.c,cx.inst,name,args,n.line)}
     if(cx.inst&&(name in cx.inst)){const v=cx.inst[name];if(v==null)throw nullErr(f);return callFn(v,evArgs(n.args,cx),n.line)}
    }
    if(name in G){const args=evArgs(n.args,cx);const fn=G[name];if(typeof fn!=='function')throw err('CS0149',`'${name}' 은(는) 메서드가 아니에요.`,n.line);return hostCall(fn,G,args,n.line,f.gen)}
    if(classes.has(name))throw err('CS1955',`'${name}' 은(는) 타입이에요. 객체를 만들려면 new ${name}(...) 처럼 써요.`,n.line);
    throw err('CS0103',`'${name}' 메서드나 함수가 없어요. 철자와 선언을 확인하세요. Unity API라면 이 연습장이 아직 흉내 내지 않는 기능일 수 있어요(AI 판정을 이용하세요).`,n.line);
   }
   if(f.k==='mem'){
    const name=f.name;
    if(f.e.k==='this'&&f.e.base){const m=findMethod(classes.get(cx.cls.bases[0])||{methods:{}},name);if(!m)return undefined;return invoke(m.c,cx.inst,name,evArgs(n.args,cx),n.line)}
    const o=ev(f.e,cx);
    if(o===null||o===undefined){if(f.nul)return null;if(name==='Invoke'||name==='ToString'&&false)throw nullErr(f.e,srcOf(f.e)+' (구독자가 없는 이벤트/델리게이트)');throw nullErr(f.e)}
    const args=evArgs(n.args,cx);
    const plain=()=>args.map(a=>a&&a.__ref?a.binding.v:a);
    if(o instanceof TypeRef){
     const c=o.__type;const m=findMethod(c,name);
     if(m)return invoke(m.c,null,name,args,n.line);
     throw err('MissingMember',`'${c.name}' 에는 정적 메서드 '${name}' 이(가) 없어요.`,n.line);
    }
    if(o.__cls){
     const m=findMethod(o.__cls,name);
     if(m)return invoke(m.c,o,name,args,n.line);
     if(name in o){const v=o[name];if(v==null)throw nullErr(f);return callFn(v,plain(),n.line)}
     if(o===mainInst&&(name in G)&&typeof G[name]==='function')return hostCall(G[name],G,args,n.line,f.gen);
     if(name==='ToString')return o.__cls.name;if(name==='GetType')return {Name:o.__cls.name};if(name==='Equals')return o===args[0];if(name==='GetHashCode')return 0;
     throw err('MissingMember',`'${o.__cls.name}' 에는 '${name}' 메서드가 없어요.`,n.line);
    }
    if(typeof o==='function'){
     if(name==='Invoke')return o(...plain());
     if(name==='DynamicInvoke')return o(...plain());
    }
    if(Array.isArray(o))return arrMethod(o,name,plain(),n.line,(fn,a)=>callFn(fn,a,n.line));
    if(typeof o==='string')return strMethod(o,name,plain(),n.line);
    if(typeof o==='number'){if(name==='ToString')return fmtNum(args[0]===undefined?o:o,args[0]);if(name==='CompareTo')return o<args[0]?-1:o>args[0]?1:0;if(name==='Equals')return o===args[0];if(name==='GetHashCode')return o|0;throw err('MissingMember',`숫자에는 '${name}' 메서드가 없어요.`,n.line)}
    if(typeof o==='boolean'){if(name==='ToString')return str(o);if(name==='Equals')return o===args[0]}
    if(enumSet.has(o)){if(name==='ToString')return o.__enum}
    if(isVec(o)&&typeof o[name]!=='function'){
     if(name==='Normalize'){const m=Math.hypot(o.x,o.y,o.z||0);if(m>1e-5){o.x/=m;o.y/=m;if(o.z!==undefined)o.z/=m}else{o.x=0;o.y=0;if(o.z!==undefined)o.z=0}return}
     if(name==='Set'){o.x=args[0];o.y=args[1];if(args.length>2)o.z=args[2];return}
     if(name==='ToString')return str(o);if(name==='Equals')return eq(o,args[0]);
    }
    if(name==='ToString'&&typeof o[name]!=='function')return str(o);
    if(name==='Equals'&&typeof o[name]!=='function')return eq(o,args[0]);
    if(name==='CompareTag'&&typeof o[name]!=='function'&&'tag' in o)return o.tag===args[0];
    const fn=o[name];
    if(typeof fn!=='function'){
     if(fn===undefined)throw err('MissingMember',`'${srcOf(f.e)}' 에는 '${name}' 메서드가 없어요. 철자를 확인하세요. 철자가 맞다면 이 연습장이 아직 흉내 내지 않는 Unity 기능일 수 있어요(AI 판정을 이용하세요).`,n.line);
     throw err('CS1955',`'${name}' 은(는) 메서드가 아니라 값이에요. 괄호 () 를 빼세요.`,n.line);
    }
    return hostCall(fn,o,args,n.line,f.gen);
   }
   const fv=ev(f,cx);if(fv==null)throw nullErr(f);
   return callFn(fv,evArgs(n.args,cx).map(a=>a&&a.__ref?a.binding.v:a),n.line);
  }
  function newObj(n,cx,declTy){
   const tyy=n.ty||declTy;
   if(!tyy)throw err('Unsupported','new() 의 타입을 알 수 없어요. new 타입이름() 처럼 써 주세요.',n.line);
   const name=tyy.name;const args=evArgs(n.args||[],cx).map(a=>a&&a.__ref?a.binding.v:a);
   let o;
   if(tyy.arr&&!n.ty){return []}
   switch(name){
    case 'List':case 'IList':case 'IEnumerable':case 'ICollection':o=args.length&&typeof args[0]!=='number'?[...iter(args[0],n.line)]:[];break;
    case 'Dictionary':o=new Dict();break;
    case 'HashSet':o=new HSet(args[0]?[...iter(args[0],n.line)]:null);break;
    case 'Queue':o=new Queue(args[0]&&typeof args[0]!=='number'?[...iter(args[0],n.line)]:null);break;
    case 'Stack':o=new Stack(args[0]&&typeof args[0]!=='number'?[...iter(args[0],n.line)]:null);break;
    case 'StringBuilder':case 'Text.StringBuilder':o=new SB(args[0]);break;
    case 'object':o={};break;
    case 'string':o=args.length?String(args[0]).repeat(args[1]||1):'';break;
    case 'Vector2':o=mkV(args[0]||0,args[1]||0);break;
    case 'Vector3':o=mkV(args[0]||0,args[1]||0,args[2]||0);break;
    default:{
     const uc=classes.get(name);
     if(uc){o=instantiate(uc,evArgs(n.args||[],cx),n.line);break}
     let H=name in G?G[name]:undefined;
     if(H===undefined&&name.includes('.')){H=name.split('.').reduce((x,k)=>x&&typeof x==='object'||typeof x==='function'?x[k]:undefined,G)}
     if(typeof H==='function'){try{o=Reflect.construct(H,args)}catch(e){o=H(...args)}break}
     if(name==='GameObject'){o={name:args[0]||'GameObject',activeSelf:true,SetActive(v){this.activeSelf=v}};break}
     throw err('CS0246',`'${name}' 타입을 찾지 못했어요. 철자를 확인하세요. Unity 타입이라면 이 연습장이 아직 흉내 내지 않는 기능일 수 있어요(AI 판정을 이용하세요).`,n.line);
    }
   }
   if(n.init){
    for(const it of n.init){
     if(it.k==='objinit'){memberSet(o,it.name,ev(it.v,cx),{e:{k:'id',name},line:n.line},cx);continue}
     if(it.k==='pair'){const [k,v]=it.items.map(x=>ev(x,cx));if(o instanceof Dict)o.Add(k,v);else if(Array.isArray(o))o.push(k);continue}
     const v=ev(it,cx);
     if(Array.isArray(o))o.push(cp(v));else if(o.Add)o.Add(v);else if(o.Enqueue)o.Enqueue(v);else if(o.Push)o.Push(v);
    }
   }
   return o;
  }
  function newArr(n,cx){
   const elemT=n.ty?n.ty.name:null;
   if(n.init){return n.init.map(x=>x.k==='pair'?x.items.map(y=>ev(y,cx)):conv(n.ty,ev(x,cx),n.line))}
   const size=ev(n.size,cx);
   if(!(Number.isInteger(size)&&size>=0))throw err('OverflowException','배열 크기는 0 이상의 정수여야 해요.',n.line);
   const dv=defaultOf({name:elemT});
   return Array.from({length:size},()=>n.dims&&n.dims.length>1?Array.from({length:ev(n.dims[1],cx)},()=>cp(dv)):cp(dv));
  }
  function castV(tyy,v,n){
   const t=normT(tyy.name);
   if(t==='int'){
    if(typeof v==='string'&&enumOrd.has(v))return enumOrd.get(v);
    if(typeof v==='string'&&v.length===1)return v.charCodeAt(0);
    if(typeof v!=='number')throw err('CS0030',`'${str(v)}' 을(를) int 로 바꿀 수 없어요.`,n.line);
    return Math.trunc(v);
   }
   if(t==='float'){if(typeof v==='string'&&enumOrd.has(v))return enumOrd.get(v);if(typeof v==='string'&&v.length===1)return v.charCodeAt(0);return v}
   if(t==='char'&&typeof v==='number')return String.fromCharCode(v);
   if(enums.has(tyy.name)&&typeof v==='number'){const m=enums.get(tyy.name).__members.find(x=>x.val===v);return m?m.name:v}
   if(tyy.name==='Vector2'&&isVec(v))return mkV(v.x,v.y);
   if(tyy.name==='Vector3'&&isVec(v))return mkV(v.x,v.y,v.z||0);
   return v;
  }
  function typeMatch(v,tyy){
   if(v===null||v===undefined)return false;
   const t=normT(tyy.name);
   if(t==='int')return typeof v==='number'&&Number.isInteger(v);
   if(t==='float')return typeof v==='number';
   if(t==='string')return typeof v==='string';
   if(t==='bool')return typeof v==='boolean';
   if(v.__cls){let c=v.__cls;while(c){if(c.name===tyy.name||c.bases.includes(tyy.name))return true;c=classes.get(c.bases[0])||null}return false}
   if(v.__type===tyy.name||v.__types&&v.__types.includes(tyy.name))return true;
   return v.__type===undefined&&!v.__types;
  }
  function ev(n,cx,declTy){
   switch(n.k){
    case 'lit':return n.v;
    case 'istr':return n.parts.map(x=>typeof x==='string'?x:str(ev(x.e,cx),x.fmt)).join('');
    case 'id':{
     const r=lookupId(n,cx);if(r.ok){if(n.gen&&typeof r.v==='function')return (...a)=>r.v(...n.gen.map(g=>g.name),...a);return r.v}
     if(n.name==='int'||n.name==='float'||n.name==='string'||n.name==='bool'||n.name==='double'){
      return {MaxValue:n.name==='int'?2147483647:3.4028235e38,MinValue:n.name==='int'?-2147483648:-3.4028235e38,Epsilon:1.401298e-45,PositiveInfinity:Infinity,NegativeInfinity:-Infinity,NaN:NaN,
       IsNullOrEmpty:s=>s==null||s==='',IsNullOrWhiteSpace:s=>s==null||!String(s).trim(),Join:(sep,a)=>[...iter(a,n.line)].map(x=>str(x)).join(sep),Format:(f,...a)=>f.replace(/\{(\d+)(?::([^}]+))?\}/g,(m,i,ff)=>str(a[i],ff)),Empty:'',Concat:(...a)=>a.map(x=>str(x)).join(''),
       Parse:s=>{const v=n.name==='int'?parseInt(s,10):parseFloat(s);if(isNaN(v))throw err('FormatException',`'${s}' 를 숫자로 바꿀 수 없어요.`,n.line);return v},IsNaN:Number.isNaN,IsInfinity:x=>!isFinite(x)&&!isNaN(x),
       TryParse:(s,cell)=>{const v=n.name==='int'?(/^\s*-?\d+\s*$/.test(s)?parseInt(s,10):NaN):parseFloat(s);if(isNaN(v)){cell.value=0;return false}cell.value=v;return true}};
     }
     if(n.name==='Enum')return {GetValues:t=>t,Parse:(t,s)=>s};
     throw err('CS0103',`'${n.name}' 이라는 이름이 없어요. 변수나 필드를 선언했는지, 철자(대소문자 포함)가 맞는지 확인하세요.`,n.line);
    }
    case 'this':return cx.inst;
    case 'mem':{
     const o=ev(n.e,cx);
     if(o===null||o===undefined){if(n.nul)return null;throw nullErr(n.e)}
     if(n.nul&&o&&o.__destroyed)return null;
     const v=memberGet(o,n.name,n,cx);
     if(n.gen&&typeof v==='function')return (...a)=>v.apply(o,[...n.gen.map(g=>g.name),...a]);
     if(typeof v==='function'&&!v.__name&&!(o.__cls)&&!(o instanceof TypeRef))return v.bind(o);
     return v;
    }
    case 'index':{const o=ev(n.e,cx);if((o===null||o===undefined)&&n.nul)return null;return lref(n,cx).get()}
    case 'call':return call(n,cx);
    case 'new':return newObj(n,cx,declTy);
    case 'newarr':return newArr(n,cx);
    case 'anon':{const o={};for(const it of n.init)if(it.k==='objinit')o[it.name]=ev(it.v,cx);return o}
    case 'default':return n.ty?defaultOf(n.ty):(declTy?defaultOf(declTy):null);
    case 'lambda':return lambda(n,cx);
    case 'swexpr':{
     const v=ev(n.e,cx);
     for(const arm of n.arms){
      let ok;
      if(arm.pat.any)ok=true;
      else if(arm.pat.op){const r=ev(arm.pat.e,cx);ok=arm.pat.op==='<'?v<r:arm.pat.op==='>'?v>r:arm.pat.op==='<='?v<=r:v>=r}
      else ok=eq(v,ev(arm.pat.e,cx));
      if(ok&&arm.when)ok=truthy(ev(arm.when,cx),arm.when);
      if(ok)return ev(arm.v,cx,declTy);
     }
     throw err('SwitchExpressionException','switch 식에서 어떤 경우에도 해당하지 않았어요. _ => 기본값 을 추가하세요.',n.line);
    }
    case 'cast':return castV(n.ty,ev(n.e,cx),n);
    case 'is':{const v=ev(n.e,cx);const ok=typeMatch(v,n.ty);if(ok&&n.bind)cx.scope.vars.set(n.bind,{v,t:n.ty.name});return n.neg?!ok:ok}
    case 'as':{const v=ev(n.e,cx);return typeMatch(v,n.ty)?v:null}
    case 'cond':{const c=ev(n.c,cx);return truthy(c,n.c)?ev(n.a,cx,declTy):ev(n.b,cx,declTy)}
    case 'coal':{const l=ev(n.l,cx);return (l===null||l===undefined)?ev(n.r,cx):l}
    case 'un':{const v=ev(n.e,cx);
     if(n.op==='-'){if(isVec(v))return v.z!==undefined?mkV(-v.x,-v.y,-v.z):mkV(-v.x,-v.y);if(typeof v!=='number')throw err('CS0023',`'-' 연산은 숫자에만 쓸 수 있어요.`,n.line);return -v}
     if(n.op==='+')return v;
     if(n.op==='!'){if(typeof v!=='boolean'&&!(v===null||v===undefined||typeof v==='object'))throw err('CS0023',"'!' 연산은 bool 값에만 쓸 수 있어요.",n.line);return !truthy(v,n.e)}
     if(n.op==='~')return ~v;
     break}
    case 'pre':case 'post':{
     const r=lref(n.e,cx);const v=r.get();
     if(typeof v!=='number')throw err('CS0023',`'${n.op}' 는 숫자 변수에만 쓸 수 있어요.`,n.line);
     const nv=n.op==='++'?v+1:v-1;r.set(nv);return n.k==='pre'?nv:v;
    }
    case 'bin':{
     const op=n.op;
     if(op==='&&'){const l=ev(n.l,cx);if(!truthy(l,n.l))return false;return truthy(ev(n.r,cx),n.r)}
     if(op==='||'){const l=ev(n.l,cx);if(truthy(l,n.l))return true;return truthy(ev(n.r,cx),n.r)}
     const a=ev(n.l,cx),b=ev(n.r,cx);
     switch(op){
      case '==':return eq(a,b);case '!=':return !eq(a,b);
      case '<':case '>':case '<=':case '>=':{
       if(typeof a!=='number'||typeof b!=='number'){
        if(typeof a==='string'&&typeof b==='string'&&a.length===1&&b.length===1){}
        else if(a===null||a===undefined||b===null||b===undefined)throw err('NullReferenceException','비교 연산에 null 값이 들어갔어요.',n.line);
        else throw err('CS0019',`'${op}' 비교는 숫자끼리만 할 수 있어요.`,n.line);
       }
       return op==='<'?a<b:op==='>'?a>b:op==='<='?a<=b:a>=b;
      }
     }
     return arith(op,a,b,n,cx);
    }
    case 'assign':{
     const op=n.op;
     if(op==='='){
      const r=lref(n.l,cx);let v=ev(n.r,cx);
      {const lt=ty(n.l,cx),rt=ty(n.r,cx);if(lt==='float'&&rt==='double'&&!isDoubleVar(n.l,cx))throw err('CS0664',`double 값을 float 에 넣을 수 없어요. 소수 뒤에 f 를 붙이세요 (예: 0.5f).`,n.line);
       if(lt==='int'&&(rt==='float'||rt==='double'))throw err('CS0266',`float 값을 int 변수 '${n.l.name}' 에 그대로 넣을 수 없어요. (int) 로 변환하거나 Mathf.RoundToInt 등을 쓰세요.`,n.line)}
      r.set(v);return v;
     }
     const r=lref(n.l,cx);const cur=r.get();
     if(op==='??='){if(cur===null||cur===undefined){const v=ev(n.r,cx);r.set(v);return v}return cur}
     const rv=ev(n.r,cx);
     if((op==='+='||op==='-=')&&(typeof rv==='function'||(rv===null&&typeof cur==='function'))){
      const nv=op==='+='?combine(cur,rv):remove(cur,rv);r.set(nv);return nv;
     }
     if((op==='+='||op==='-=')&&typeof cur==='function'&&rv===null)return cur;
     if(cur===null||cur===undefined){if(op==='+='&&typeof rv==='string'){r.set(rv);return rv}throw nullErr(n.l)}
     const bop=op.slice(0,-1);
     let nv;
     if(bop==='/'||bop==='%'){const fake={k:'bin',op:bop,l:n.l,r:n.r,line:n.line};nv=arith(bop,cur,rv,fake,cx)}
     else nv=arith(bop,cur,rv,n,cx);
     if(ty(n.l,cx)==='int'&&typeof nv==='number'&&!Number.isInteger(nv)){
      if(ty(n.r,cx)==='float')throw err('CS0266',`int 변수 '${srcOf(n.l)}' 에 float 계산 결과를 넣을 수 없어요. (int) 로 변환하세요.`,n.line);
      nv=Math.trunc(nv);
     }
     r.set(nv);return nv;
    }
   }
   throw err('Unsupported',`이 식(${n.k})은 아직 지원하지 않아요.`,n.line);
  }
  function truthy(v,n){
   if(typeof v==='boolean')return v;
   if(v===null||v===undefined)return false;
   if(typeof v==='object'||typeof v==='function')return !v.__destroyed;
   throw err('CS0029',`조건식에는 bool(참/거짓) 값이 와야 해요. 지금은 '${str(v)}' 이(가) 왔어요. 비교 연산자(==, > 등)를 썼는지 확인하세요.`,n&&n.line);
  }

  /* 문장 실행 (제너레이터: 코루틴의 yield 를 자연스럽게 처리) */
  const BRK={k:'brk'},CONT={k:'cont'};
  function* execG(s,cx){
   tick(s.line);
   switch(s.k){
    case 'block':{
     const c2={inst:cx.inst,cls:cx.cls,scope:new Scope(cx.scope)};
     for(const st of s.body){const r=yield* execG(st,c2);if(r)return r}
     return;
    }
    case 'empty':return;
    case 'decl':{
     for(const v of s.vars){
      if(cx.scope.vars.has(v.name))throw err('CS0128',`'${v.name}' 변수가 같은 범위에 이미 선언되어 있어요.`,v.line);
      let val;
      if(v.init){val=ev(v.init,cx,s.ty);
       const tn=normT(s.ty.name);
       if(tn==='int'&&ty(v.init,cx)==='float')throw err('CS0266',`float 값을 int 변수 '${v.name}' 에 그대로 넣을 수 없어요. (int) 로 변환하거나 Mathf.RoundToInt 등을 쓰세요.`,v.line);
       if(tn==='float'&&s.ty.name==='float'&&ty(v.init,cx)==='double')throw err('CS0664',`double 값을 float 변수 '${v.name}' 에 넣을 수 없어요. 소수 뒤에 f 를 붙이세요 (예: 0.5f).`,v.line);
       if(tn==='int'&&ty(v.init,cx)==='double')throw err('CS0266',`double 값을 int 변수 '${v.name}' 에 그대로 넣을 수 없어요.`,v.line);
      }else val=s.ty.name==='var'?undefined:defaultOf(s.ty);
      if(s.ty.name==='var'&&!v.init)throw err('CS0818','var 로 선언한 변수는 바로 값을 넣어야 해요.',v.line);
      const t=s.ty.name==='var'?(v.init?ty(v.init,cx):null):(s.ty.arr?'array':s.ty.name);
      cx.scope.vars.set(v.name,{v:s.ty.name==='var'?cp(val):conv(s.ty,val,v.line),t,unassigned:!v.init});
     }
     return;
    }
    case 'expr':ev(s.e,cx);return;
    case 'if':{if(truthy(ev(s.c,cx),s.c))return yield* execG(s.a,sub(cx));else if(s.b)return yield* execG(s.b,sub(cx));return}
    case 'while':{
     while(truthy(ev(s.c,cx),s.c)){tick(s.line);const r=yield* execG(s.body,sub(cx));if(r===BRK)break;if(r===CONT)continue;if(r)return r}
     return;
    }
    case 'do':{
     do{tick(s.line);const r=yield* execG(s.body,sub(cx));if(r===BRK)break;if(r===CONT)continue;if(r)return r}while(truthy(ev(s.c,cx),s.c));
     return;
    }
    case 'for':{
     const c2=sub(cx);
     for(const i of s.init)yield* execG(i,c2);
     for(;;){
      tick(s.line);
      if(s.c&&!truthy(ev(s.c,c2),s.c))break;
      const r=yield* execG(s.body,sub(c2));
      if(r===BRK)break;
      if(r&&r!==CONT)return r;
      for(const e of s.it)ev(e,c2);
     }
     return;
    }
    case 'foreach':{
     const coll=ev(s.e,cx);
     for(const v of iter(coll,s.line)){
      tick(s.line);
      const c2=sub(cx);c2.scope.vars.set(s.name,{v:cp(v),t:s.ty?s.ty.name:null,ro:true});
      const r=yield* execG(s.body,c2);
      if(r===BRK)break;if(r===CONT)continue;if(r)return r;
     }
     return;
    }
    case 'switch':{
     const v=ev(s.e,cx);
     let idx=-1;
     for(let i=0;i<s.secs.length&&idx<0;i++){
      for(const lb of s.secs[i].labels){
       if(lb===null)continue;
       if(lb.ty){if(typeMatch(v,lb.ty)){idx=i;break}continue}
       if(eq(v,ev(lb.e,cx))){idx=i;break}
      }
     }
     if(idx<0)idx=s.secs.findIndex(x=>x.labels.includes(null));
     if(idx<0)return;
     const c2=sub(cx);
     for(const st of s.secs[idx].body){const r=yield* execG(st,c2);if(r===BRK)return;if(r)return r}
     if(s.secs[idx].body.length&&idx<s.secs.length)throw err('CS0163','switch 의 case 는 break 나 return 으로 끝나야 해요(다음 case 로 넘어갈 수 없어요).',s.secs[idx].body[s.secs[idx].body.length-1].line);
     return;
    }
    case 'break':return BRK;
    case 'continue':return CONT;
    case 'return':return {k:'ret',v:s.e?ev(s.e,cx):undefined};
    case 'yield':{const v=ev(s.e,cx);yield v;return}
    case 'ybreak':return {k:'ret',v:undefined};
    case 'throw':{const v=s.e?ev(s.e,cx):null;throw err('Exception',(v&&v.Message)||str(v)||'예외가 발생했어요.',s.line)}
    case 'try':{
     try{const r=yield* execG(s.tb,cx);if(r)return r}
     catch(e){
      if(!s.cb||(e&&e.name==='Timeout'))throw e;
      const c2=sub(cx);if(s.cv)c2.scope.vars.set(s.cv,{v:{Message:e.message,name:e.name},t:'Exception'});
      const r=yield* execG(s.cb,c2);if(r)return r;
     }
     finally{if(s.fb){yield* execG(s.fb,cx)}}
     return;
    }
   }
   throw err('Unsupported',`이 문장(${s.k})은 아직 지원하지 않아요.`,s.line);
  }
  const sub=cx=>({inst:cx.inst,cls:cx.cls,scope:new Scope(cx.scope)});

  /* 메인 인스턴스 */
  let mainInst=null;
  mainInst=instantiate(main,[],main.line);
  const fns={};
  const allM=c=>{const out={};let k=c;const chain=[];while(k){chain.unshift(k);k=classes.get(k.bases[0])||null}for(const kc of chain)for(const n of Object.keys(kc.methods))out[n]=kc;return out};
  for(const [n,c] of Object.entries(allM(main)))fns[n]=(...a)=>invoke(c,mainInst,n,a,0);
  return {
   fns,
   inst:mainInst,
   get(n){if(n in mainInst)return mainInst[n];const pr=findProp(main,n);if(pr)return getProp(pr.c,pr.pr,mainInst);ensureStatics(main);if(n in main.statics)return main.statics[n];return undefined},
   set(n,v){const pr=findProp(main,n);if(pr&&!(n in mainInst)){if(pr.pr.auto){mainInst['__p_'+n]=v;return}setProp(pr.c,pr.pr,mainInst,v,0);return}ensureStatics(main);if(!(n in mainInst)&&(n in main.statics)){main.statics[n]=v;return}mainInst[n]=v},
   classes,enums
  };
 }
 return {lex,parse,load,CSErr,str,isVec};
})();
