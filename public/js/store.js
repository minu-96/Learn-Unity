/* ===== 저장소 어댑터 =====
   Firebase 설정이 있으면 구글 로그인 + Firestore, 없으면 게스트(이 브라우저의 localStorage만) 모드.
   Firestore 구조
     users/{uid}               이름·이메일·마지막 접속·진행 요약(summary)·문제별 상태(prob)  ← 운영진이 읽는 문서
     users/{uid}/data/state    풀이 기록·개념 사전·복습·연습 체크
     users/{uid}/data/work     작성 중인 코드(드래프트)·AI 생성 문제  ← 본인만 읽는다
     admins/{uid}              운영진 표시(콘솔에서만 생성)
     reports/{id}              채점 오류 신고
     config/weekly             이번 주 과제(운영진이 지정) */
const Store=(()=>{
 const cfg=window.FIREBASE_CONFIG||{};
 const configured=!!(cfg.apiKey&&cfg.projectId&&window.firebase);
 let auth=null,fdb=null,user=null,admin=false;
 const cache={};
 const listeners=[];
 const FIELD_LIMIT=900000;
 function init(){
  if(!configured)return Promise.resolve(null);
  if(!firebase.apps.length)firebase.initializeApp(cfg);
  auth=firebase.auth();fdb=firebase.firestore();
  return new Promise(res=>{
   let first=true;
   auth.onAuthStateChanged(async u=>{
    user=u?{uid:u.uid,name:u.displayName||(u.email||'').split('@')[0],email:u.email||'',photo:u.photoURL||''}:null;
    admin=false;
    if(u){try{const a=await fdb.doc('admins/'+u.uid).get();admin=a.exists}catch(e){}}
    if(user)user.admin=admin;
    if(first){first=false;res(user)}else listeners.forEach(f=>f(user));
   });
  });
 }
 const onChange=f=>listeners.push(f);
 const adminEmail=id=>String(id).trim().toLowerCase()+'@'+(window.ADMIN_EMAIL_DOMAIN||'admin.learn-unity.example');
 async function signInGoogle(){
  const pr=new firebase.auth.GoogleAuthProvider();
  await auth.signInWithPopup(pr);
 }
 async function signInAdmin(id,pw){await auth.signInWithEmailAndPassword(adminEmail(id),pw)}
 async function signOut(){if(auth)await auth.signOut()}
 const same=(k,json)=>cache[k]===json?true:(cache[k]=json,false);
 async function load(){
  if(!fdb||!user)return null;
  const [a,b]=await Promise.all([fdb.doc('users/'+user.uid+'/data/state').get(),fdb.doc('users/'+user.uid+'/data/work').get()]);
  const out={};
  if(a.exists){out.state=JSON.parse(a.data().json);cache.state=a.data().json}
  if(b.exists){out.work=JSON.parse(b.data().json);cache.work=b.data().json}
  return out;
 }
 /* state·work는 내용이 바뀐 것만 쓰고, 요약은 매번 갱신한다(운영진 화면용) */
 async function save(state,work,summary,prob){
  if(!fdb||!user)return;
  const s=JSON.stringify(state),w=JSON.stringify(work);
  if(s.length>FIELD_LIMIT||w.length>FIELD_LIMIT)throw new Error('저장 용량 초과');
  const jobs=[];
  if(!same('state',s))jobs.push(fdb.doc('users/'+user.uid+'/data/state').set({json:s}));
  if(!same('work',w))jobs.push(fdb.doc('users/'+user.uid+'/data/work').set({json:w}));
  const sum=JSON.stringify([summary,prob]);
  if(!same('sum',sum))jobs.push(fdb.doc('users/'+user.uid).set({name:user.name,email:user.email,photo:user.photo,lastActive:Date.now(),summary,prob},{merge:true}));
  await Promise.all(jobs);
 }
 async function touch(){
  if(!fdb||!user)return;
  await fdb.doc('users/'+user.uid).set({name:user.name,email:user.email,photo:user.photo,lastActive:Date.now()},{merge:true});
 }
 async function listUsers(){
  const q=await fdb.collection('users').get();
  return q.docs.map(d=>Object.assign({uid:d.id},d.data()));
 }
 async function report(r){
  if(!fdb||!user)throw new Error('로그인이 필요해요');
  await fdb.collection('reports').add(Object.assign({uid:user.uid,name:user.name,at:Date.now(),status:'open'},r));
 }
 async function listReports(){
  const q=await fdb.collection('reports').orderBy('at','desc').limit(100).get();
  return q.docs.map(d=>Object.assign({id:d.id},d.data()));
 }
 async function setReportStatus(id,status){await fdb.doc('reports/'+id).update({status})}
 /* 이번 주 과제: config/weekly 한 문서. 읽기는 로그인한 누구나, 쓰기는 운영진만 */
 async function getWeekly(){
  if(!fdb||!user)return null;
  const d=await fdb.doc('config/weekly').get();
  return d.exists?d.data():null;
 }
 async function setWeekly(o){if(!fdb||!user)throw new Error('로그인이 필요해요');await fdb.doc('config/weekly').set(o)}
 return {configured,getWeekly,setWeekly,init,onChange,signInGoogle,signInAdmin,signOut,load,save,touch,listUsers,report,listReports,setReportStatus,get user(){return user},get admin(){return admin}};
})();
