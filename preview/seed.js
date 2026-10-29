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
  d.docs['admins/adm1']={ok:true};
  d.accounts={'admin@admin.learn-unity.example':{uid:'adm1',pw:'pw1234'}};
  d.seeded=true;
  raw.set(JSON.stringify(d));
 }catch(e){}
})();
