# 유니티 훈련소 (Learn-Unity)

Unity 개발 스터디용 **코드 작성 연습장**. 상황(스토리)·목표·제한을 읽고 C# 코드를 직접 작성하면, 조건별로 채점해 무엇이 맞고 틀렸는지 알려줍니다. 객관식은 없습니다.

- 13개 분야 · 35개 단계 · 105문제, 학습 구간은 **입문 / 기초 / 응용 / 심화**
- 채점은 전부 브라우저에서 동작 (AI 없음, 비용 없음)
  1. 정적 규칙 검사(코드 구조·금지 패턴)
  2. 컴파일 스타일 검사(C# 해석기가 줄 번호와 함께 오류를 알려줌)
  3. 동작 검사(Unity를 흉내 낸 엔진에서 코드를 실제로 실행)
- 간격 반복 복습, 개념 사전, "Unity에서 직접 해보기" 과제
- Google 로그인 + 진도 저장, 운영진 대시보드 (Firebase)

## 문제 사전
학습 지도 문제를 하나 풀면 같은 단계·레벨의 비슷한 문제 3개가 '문제 사전'에 열립니다(현재 입문 45문제 + 기초 63문제 = 108문제).

## 구조

```
public/                 Firebase Hosting이 그대로 서비스하는 정적 사이트
  index.html
  css/style.css
  js/cs.js              C# 부분집합 해석기 (eval 미사용)
  js/core.js            규칙 빌더 · 정적 검사 · Unity 모의 엔진 · 채점(gradeAll)
  js/cats.js            분야·단계·이론 요약
  js/tiers.js           입문/기초/응용/심화 매핑 · 진행 요약(summarize) · 수료 기준
  js/p_*.js             분야별 문제 (90개)
  js/practice.js        단계별 "Unity에서 직접 해보기"
  js/store.js           Firebase 어댑터 (설정이 없으면 게스트 모드)
  js/lessons.js         단계별 짧은 개념 설명(핵심 3줄 + 예제 코드)
  js/glossary.js        문제 속 용어를 누르면 뜻이 뜨는 용어 풀이
  js/fx.js              효과음 · 색종이 · 경험치/레벨 · 배지 · C# 구문 색
  js/views.js           로그인 · 내 기록 · 운영진 화면
  js/learn.js           오늘(홈) · 학습 지도 · 단계 화면
  js/ui.js              상태·저장·복습·문제 화면
  js/firebase-config.js Firebase 웹 앱 설정 (배포 시 채움)
firestore.rules         보안 규칙
firebase.json           호스팅 + 규칙 설정
tests/                  채점 검증 · 통합 테스트
docs/                   운영 가이드 · 베타 체크리스트 · 작업 기록
```

## 실행·테스트

```bash
npm install            # 통합 테스트(playwright)를 쓸 때만 필요
npm test               # 105문제 정답/오답 검증 + 학생 풀이 72개 + 코드 모양 변형 + 해석기 단위 테스트
npm run smoke          # 가짜 Firebase로 로그인·저장·운영진 화면 통합 테스트
npx serve public       # 로컬에서 열기 (firebase-config.js가 비어 있으면 게스트 모드)
```

## 새 문제 추가

`public/js/p_*.js`에 `Q({...})`로 추가하고 `tiers.js`의 `TIER_OF`에 해당 `분야:단계`가 있는지 확인한 뒤 `npm test`를 돌립니다. 시작 코드는 실패하고 정답은 통과해야 하며, 일부러 틀린 풀이(`bads`)는 실패해야 테스트가 통과합니다.
