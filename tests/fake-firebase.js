/* 테스트용 가짜 Firebase(compat) - 브라우저에서 window.firebase를 대신한다. 데이터는 localStorage('fakefb')에 둔다.
   실제 보안 규칙(firestore.rules)은 검증하지 못한다. */
(function(){
 const KEY='fakefb';
 let mem=null;
 const raw={get(){try{const v=localStorage.getItem(KEY);if(v!=null)return v}catch(e){}return mem},set(v){mem=v;try{localStorage.setItem(KEY,v)}catch(e){}}};
 window.__fakefb=raw;
 const load=()=>{try{return JSON.parse(raw.get())||{docs:{},auth:null,seq:0}}catch(e){return {docs:{},auth:null,seq:0}}};
 const save=d=>raw.set(JSON.stringify(d));
 const clone=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));
 const snap=(id,v)=>({id,exists:v!==undefined,data:()=>clone(v)});
 const listeners=[];
 function authUser(a){return a?{uid:a.uid,displayName:a.name||null,email:a.email,photoURL:''}:null}
 const firebase={
  apps:[],
  initializeApp(c){this.apps.push(c)},
  auth:Object.assign(()=>({
   onAuthStateChanged(f){listeners.push(f);setTimeout(()=>f(authUser(load().auth)),0)},
   async signInWithPopup(){const d=load();d.auth={uid:'g-'+(window.__FAKE_GOOGLE||'minu'),name:window.__FAKE_GOOGLE||'민우',email:(window.__FAKE_GOOGLE||'minu')+'@gmail.com'};save(d);listeners.forEach(f=>f(authUser(d.auth)))},
   async signInWithEmailAndPassword(email,pw){
    const d=load();const acc=(d.accounts||{})[email];
    if(!acc||acc.pw!==pw){const e=new Error('bad');e.code='auth/invalid-credential';throw e}
    d.auth={uid:acc.uid,name:null,email};save(d);listeners.forEach(f=>f(authUser(d.auth)));
   },
   async signOut(){const d=load();d.auth=null;save(d);listeners.forEach(f=>f(null))}
  }),{GoogleAuthProvider:function(){}}),
  firestore(){
   const docRef=path=>({
    async get(){return snap(path.split('/').pop(),load().docs[path])},
    async set(v,o){const d=load();d.docs[path]=(o&&o.merge)?Object.assign({},d.docs[path]||{},clone(v)):clone(v);save(d)},
    async update(v){const d=load();if(!d.docs[path])throw new Error('no doc');Object.assign(d.docs[path],clone(v));save(d)}
   });
   const col=name=>{
    let ord=null,lim=1e9;
    const q={
     orderBy(f,dir){ord=[f,dir];return q},limit(n){lim=n;return q},
     async get(){
      const d=load();let rows=Object.entries(d.docs).filter(([p])=>p.startsWith(name+'/')&&p.split('/').length===2).map(([p,v])=>[p.split('/')[1],v]);
      if(ord)rows.sort((a,b)=>ord[1]==='desc'?b[1][ord[0]]-a[1][ord[0]]:a[1][ord[0]]-b[1][ord[0]]);
      return {docs:rows.slice(0,lim).map(([id,v])=>snap(id,v))};
     },
     async add(v){const d=load();const id='r'+(++d.seq);d.docs[name+'/'+id]=clone(v);save(d);return {id}}
    };
    return q;
   };
   return {doc:docRef,collection:col};
  }
 };
 window.firebase=firebase;
})();
