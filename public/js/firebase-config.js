/* Firebase 웹 앱 설정. Firebase 콘솔 → 프로젝트 설정 → '내 앱'의 firebaseConfig 값을 붙여 넣는다.
   이 값은 비밀 키가 아니라 공개용 식별자라서 저장소에 올려도 된다(접근 제어는 firestore.rules가 한다).
   비워 두면 로그인 없이 이 브라우저에만 저장하는 게스트 모드로 동작한다. */
window.FIREBASE_CONFIG={
  apiKey:'',
  authDomain:'',
  projectId:'',
  appId:''
};
/* 운영진 아이디는 Firebase 인증에 '아이디@admin.learn-unity.example' 형태의 이메일로 등록한다. */
window.ADMIN_EMAIL_DOMAIN='admin.learn-unity.example';
