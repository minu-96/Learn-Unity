/* 미리보기 전용: 가상 부원·운영진 계정·신고를 가짜 Firebase 저장소에 한 번 심는다. 실제 서비스에는 포함되지 않는다. */
(function(){
 try{
  const raw=window.__fakefb;if(!raw)return;
  let d;try{d=JSON.parse(raw.get())}catch(e){}
  if(d&&d.seeded)return;
  d=d||{docs:{},auth:null,seq:0};
  const now=Date.now(),DAY=864e5;
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const order=['intro','basic','adv'];
  const byTier={};PROBLEMS.forEach(p=>(byTier[tierOf(p)]=byTier[tierOf(p)]||[]).push(p));
  /* [이름, 구간별 해결 비율, 자력 확률, 마지막 접속(일 전), 복습한 문제 수] */
  const M=[['김서연',[1,.7,.2],.85,0,10],['박준호',[1,.35,0],.7,2,4],['이도윤',[.85,0,0],.55,5,2],['최하은',[.5,0,0],.9,9,0],['정민재',[.25,0,0],.6,21,0],['한지우',[0,0,0],0,0,0]];
  M.forEach((m,i)=>{
   const solved={},review={};
   order.forEach((t,ti)=>{
    const ps=byTier[t];const n=Math.round(ps.length*m[1][ti]);
    ps.slice(0,n).forEach(p=>{const self=rnd()<m[2];solved[p.id]={ok:true,via:'auto',clean:self,tries:1+Math.floor(rnd()*4),at:now-m[3]*DAY};});
    ps.slice(n,n+2).forEach(p=>{if(m[1][ti]>0)solved[p.id]={ok:false,tries:2+Math.floor(rnd()*4),at:now-m[3]*DAY}});
   });
   Object.keys(solved).slice(0,m[4]).forEach((id,k)=>{review[id]={box:k%3,due:now,last:now-DAY,reps:1}});
   const summary=summarize(PROBLEMS,solved,review);
   const prob={};PROBLEMS.forEach(p=>{const r=solved[p.id];if(r)prob[p.id]=[r.ok?(r.clean?1:2):0,r.tries]});
   d.docs['users/demo'+i]={name:m[0],email:'demo'+(i+1)+'@example.com',photo:'',lastActive:m[3]===0&&i===5?0:now-m[3]*DAY-i*36e5,summary,prob};
  });
  d.docs['users/demo5'].lastActive=0;delete d.docs['users/demo5'].summary;delete d.docs['users/demo5'].prob;
  const p0=PROBLEMS.find(p=>p.id==='c3')||PROBLEMS[2];
  d.docs['reports/seed1']={uid:'demo1',name:'박준호',at:now-DAY,status:'open',pid:p0.id,title:p0.title,note:'Unity에서는 이 코드가 되는데 통과가 안 돼요',code:p0.starter,fails:['예시 항목: 채점 메시지가 여기에 표시돼요']};
  /* 체험 계정(Google 버튼)에도 진행 기록을 넣어 홈·복습·내 기록이 채워진 모습을 보여 준다 */
  (function(){
   const ti={intro:0,basic:1,adv:2},ci=id=>CATS.findIndex(c=>c.id===id);
   const path=PROBLEMS.slice().sort((a,b)=>ti[tierOf(a)]-ti[tierOf(b)]||ci(a.cat)-ci(b.cat)||a.stage-b.stage||a.level-b.level);
   const solved={},review={},dict={},act={},notes={};
   path.slice(0,11).forEach((p,i)=>{
    const self=i%4!==2;
    solved[p.id]={ok:true,via:'auto',clean:self,tries:1+(i%3),at:now-(11-i)*DAY/3};
    review[p.id]={box:i<3?0:Math.min(2,i%3),due:i<3?now-36e5*(3-i):now+(2+i)*DAY,last:now-DAY,reps:i<3?0:1};
    (p.concepts||[]).forEach(c=>{if(!dict[c.term])dict[c.term]={def:c.def,cat:p.cat,from:p.title,at:now-(11-i)*DAY/3}});
   });
   path.slice(11,13).forEach(p=>{solved[p.id]={ok:false,tries:2,at:0}});
   const dk=t=>{const x=new Date(t);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
   [1,2,3].forEach((n,i)=>{act[dk(now-i*DAY-DAY)]=n});act[dk(now)]=1;
   notes[path[0].id]={t:'private은 밖에서 못 건드리고, [SerializeField]는 Inspector에 보이게 한다',at:now-2*DAY};
   d.docs['users/g-minu/data/state']={json:JSON.stringify({v:3,solved,dict,review,practice:{'csharp:1':[true,true,false]},act,notes})};
   const drafts={};drafts[path[11].id]={code:path[11].starter+'\n// 작성 중',at:now-36e5};
   d.docs['users/g-minu/data/work']={json:JSON.stringify({custom:[],drafts})};
  })();
  d.docs['admins/adm1']={ok:true};
  d.accounts={'admin@admin.learn-unity.example':{uid:'adm1',pw:'pw1234'}};
  d.seeded=true;
  raw.set(JSON.stringify(d));
 }catch(e){}
})();
