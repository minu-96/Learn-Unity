/* 미리보기 아티팩트 빌드: 웹앱을 단일 HTML로 묶고, Firebase 대신 가짜 Firebase + 가상 데이터를 넣는다.
   사용: node preview/build.js <출력파일> */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),pub=path.join(root,'public');
const r=f=>fs.readFileSync(f,'utf8');
const order=['cs','core','cats','tiers','practice','head',...fs.readdirSync(path.join(pub,'js')).filter(f=>/^p_.*\.js$/.test(f)).map(f=>f.slice(0,-3)).sort(),'store','views','ui'];
const logic=['cs','core','cats','tiers','practice','head',...order.filter(x=>x.startsWith('p_'))].map(n=>r(path.join(pub,'js',n+'.js'))).join('\n');
const app=['store','views'].map(n=>r(path.join(pub,'js',n+'.js'))).join('\n');
const cfg="window.FIREBASE_CONFIG={apiKey:'preview',authDomain:'preview',projectId:'preview',appId:'preview'};window.ADMIN_EMAIL_DOMAIN='admin.learn-unity.example';";
const parts={fake:r(path.join(root,'tests','fake-firebase.js')),cfg,logic,seed:r(path.join(__dirname,'seed.js')),app,ui:r(path.join(pub,'js','ui.js'))};
for(const [k,v] of Object.entries(parts)){ if(/<\/script/i.test(v)||/<!--/.test(v)) throw new Error(k+' contains </script or <!--'); new Function(v); }
const css=r(path.join(pub,'css','style.css'));
const html=`<title>유니티 훈련소</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+KR:wght@400;500;700&display=swap">
<style>
${css}
#pv{max-width:1020px;margin:0 auto 12px;padding:8px 12px;border:1px dashed var(--line);border-radius:6px;font-size:12px;color:var(--muted);line-height:1.6}
#pv b{color:var(--ink)}
</style>
<div id="pv"><b>미리보기</b> · 실제 Firebase 대신 가짜 로그인과 가상 부원 데이터로 동작해요. Google 버튼은 임시 계정으로 들어가고, 운영진은 아이디 <b>admin</b> / 비밀번호 <b>pw1234</b>로 접속해 보세요. 기록은 이 브라우저에만 남아요.</div>
<div class="wrap" id="app"></div>
<script>
${parts.fake}
${parts.cfg}
</script>
<script>
${parts.logic}
</script>
<script>
${parts.seed}
</script>
<script>
${parts.app}
</script>
<script>
${parts.ui}
</script>
`;
fs.writeFileSync(process.argv[2]||path.join(__dirname,'preview.html'),html);
console.log('built',html.length,'bytes');
