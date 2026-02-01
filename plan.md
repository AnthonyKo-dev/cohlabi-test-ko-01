# Micro Creator Radar MVP — plan.md (Instagram + X)
(ANP / COHLABI 내부용)

## 중요 고지(필수)
- Instagram / X(구 Twitter) 데이터 수집은 **각 플랫폼의 약관/정책을 준수**해야 합니다.
- 본 plan은 **공식 API(및 합법적 데이터 소스/사용자 제공 데이터)** 기반 구현을 전제로 작성합니다.
- “무단 스크래핑/크롤링으로 전체 사용자 풀을 훑는 방식”은 정책/법적 리스크가 매우 커서 MVP에서도 권장하지 않습니다.
- 대신 **(1) 키워드/해시태그 기반 검색 → (2) 후보 계정 확장(그래프 확장) → (3) 계정/콘텐츠 지표 평가**의 합법적 흐름으로 MVP를 설계합니다.

---

## 0) MVP 한 문장 정의
카테고리 키워드(예: 뷰티, 스낵, F&B, 수면 등)를 입력하면, **Instagram/X에서 관련 콘텐츠를 검색(합법적 커넥터)** → 계정 후보를 수집 → 마이크로 크리에이터 기준으로 1차 필터링(룰) → 상위 후보를 상세 화면에서 검토/Watchlist 관리 → (옵션) Slack으로 공유까지 가능한 내부 웹앱.

---

## 1) MVP 목표 및 성공 기준(KPI)
### 1.1 MVP 목표
- “마이크로 크리에이터 콘텐츠가 매출전환에 기여한다” 가설 검증을 위한 **실험 후보 풀을 빠르게 구성**
- 플랫폼별 특성을 반영한 **마이크로 기준 + ‘반응 이상치’ 기반 선별**
- (후속) 실험/성과 데이터가 쌓이면 레이더의 추천 정확도를 강화

### 1.2 KPI(운영/정확도)
- (KPI1) 키워드 입력 → 후보 50명 생성까지 10분 이내(배치 기반이면 1회 실행당 50명 이상)
- (KPI2) 후보 100명 중 “SHORTLIST(검토 가치)” ≥ 20%
- (KPI3) 상위 20% 스코어 그룹이 하위 20% 대비 “실험 성과(클릭/주문/매출)”가 유의미하게 높음(최소 2배 목표)
- (KPI4) 주간 Top 후보 10~20명 리스트를 팀이 실제로 사용(주 1회 이상)

---

## 2) 사용자/권한(RBAC)
- Viewer: 읽기(리스트/상세/리포트)
- Editor: 후보 추가/수정, Watchlist 관리, 상태 변경, Slack 전송
- Admin: 사용자/설정, 스코어링 파라미터/룰 관리, API 연결 설정

---

## 3) MVP 범위(Scope)
### 3.1 MVP에서 “한다”
1) **키워드 기반 탐색(Discovery)**
   - 키워드/해시태그를 입력하면 플랫폼 커넥터가 검색 실행
   - 결과(콘텐츠/게시물)에서 “작성자 계정”을 후보로 수집
2) **플랫폼별 1차 룰 필터(마이크로 + 반응 이상치)**
   - X/Instagram 각각 다른 룰 적용
3) **2차 콘텐츠 샘플링**
   - 계정당 상위 반응 콘텐츠 3~5개 저장(비용/속도 최적화)
4) **스코어링**
   - Health Score(활동성/지속성/이상치)
   - Engagement Outlier Score(팔로워 대비 반응 이상치)
   - (옵션) Commercial Intent Score(Gemini 텍스트 분석 기반)
5) **리스트/필터/상세/Watchlist 운영**
6) **Slack 연동(옵션/설정)**
   - Slack Incoming Webhook URL을 Admin에서 설정
   - 리스트/상세에서 “Slack 공유” 버튼 제공(배치 자동전송은 후속 단계)
7) **배치 실행(옵션)**
   - MVP에서는 “수동 실행(버튼)” + (가능하면) “하루 1회 스케줄 실행” 중 택1

### 3.2 MVP에서 “안 한다(Non-goals)”
- 무단 스크래핑/우회 수집(로그인/세션 탈취/봇 회피 등)
- DM 자동 발송, 결제/정산 레일
- 복잡한 멀티 터치 어트리뷰션

---

## 4) 데이터 수집 방식(커넥터 설계)
MVP는 “전체 사용자”를 훑지 않고, **검색 결과에서 계정을 수집**하는 방식으로 구현합니다.

### 4.1 X 커넥터(권장)
- X API(유료/권한 필요)를 통해:
  - Recent Search(키워드/해시태그) → 트윗 목록
  - 트윗 작성자 user_id → 사용자 정보 조회
  - (가능하면) 사용자 타임라인/최근 트윗 20개 조회로 지표 계산
- MVP 입력: 키워드, 기간(최근 7일), 언어(ko/en), 제외 키워드, 최소/최대 팔로워

### 4.2 Instagram 커넥터(현실적 제약 반영)
- Instagram은 “전체 사용자 검색”이 공식적으로 제한적일 수 있습니다.
- MVP 대안(합법 범위 내):
  - Instagram Graph API(비즈니스/크리에이터 계정 및 권한 필요)에서 가능한 범위:
    - Hashtag Search → Recent Media / Top Media
    - Media에서 작성자/계정 정보를 가능한 범위로 수집
- 만약 Graph API로 작성자/팔로워 지표 접근이 제한되면:
  - (대안 A) **사용자 제공 데이터(수동 등록/CSV)**를 병행
  - (대안 B) **공식/합법적 데이터 제공 파트너(서드파티)** 연동을 추후 단계로 열어둠
- MVP는 “Instagram 커넥터”를 추상화해, 추후 교체 가능하도록 설계합니다.

---

## 5) 플랫폼별 “마이크로 크리에이터” 1차 필터 룰(MVP)
> 아래 기준은 **초기 가설검증용**으로 단순화한 것이며, Admin에서 파라미터로 조정 가능해야 합니다.

### 5.1 X(구 Twitter) — 룰 기반
- 팔로워: **500 ~ 50,000**
- 최근 N개 트윗(N=20) 기준(가능하면 API로 수집):
  - 평균 좋아요 / 팔로워 ≥ **3%**
  - 단일 트윗 좋아요가 계정 평균의 **3배 이상(outlier)**인 트윗 존재
  - 이미지/미디어 포함 트윗 비율 ≥ **50%** (콘텐츠 중심 계정)
- 통과 목적: “작은 계정인데 반응이 튀는 계정”만 선별

### 5.2 Instagram — 룰 기반(가능 지표에 맞춰 유연)
- 팔로워: **1,000 ~ 100,000**
- 최근 게시물/릴스 기준(가능하면):
  - 릴스 평균 조회수 / 팔로워 ≥ **1.5**
  - 이미지 게시물 좋아요율(좋아요/팔로워) ≥ **5%**
  - 댓글/좋아요 비율 ≥ **2%** (소통형 팬덤 신호)
- Graph API로 일부 지표가 제한될 경우:
  - “좋아요/댓글/조회” 등 공개 지표를 대체 입력(수동/CSV)할 수 있게 하고
  - MVP에서는 “지표가 있는 후보만 스코어링” 가능하도록 설계(미입력은 보수적 점수)

---

## 6) 2차 필터: 상위 콘텐츠 샘플링
- 계정당 반응 상위 3~5개 콘텐츠만 저장(텍스트/링크/썸네일 URL)
- 목적:
  - 데이터/AI 비용 절감
  - 사람이 검토할 때 “핵심만” 보게 만들기

---

## 7) 스코어링 모델(MVP)
### 7.1 점수 구성(100점)
- **Outlier Score(반응 이상치)**: 50
- **Health Score(활동성/지속성)**: 30
- **Commercial Intent Score(전환 신호, Gemini 텍스트 분석)**: 20 (옵션)

> 캐릭터 IP 스코어링은 본 MVP 범위에서 제외(후속 확장 가능).  
> 대신 “전환 실험에 적합한 계정” 관점의 신호에 집중.

### 7.2 Outlier Score(룰 기반)
- 팔로워 대비 평균 반응률(좋아요/댓글/조회) 구간 점수화
- 최근 20개 중 “반응 3배 이상” outlier 콘텐츠 존재 시 가점

### 7.3 Health Score(룰 기반)
- 최근 게시일(14일/30일 기준)
- 활동 빈도(최근 30일 포스팅 수)
- 급격한 변화(팔로워 급증/급락) 등 플래그(가능하면)

### 7.4 Commercial Intent Score(Gemini, 옵션)
- 입력: 상위 콘텐츠 캡션/해시태그/댓글 샘플
- Gemini 출력: CTA/구매유도/제품 언급/루틴형 콘텐츠 여부, 위험 표현(과장/의학적 주장) 플래그
- 웰니스 관련 리스크 플래그(“질병 치료” 등)는 반드시 감지해 운영 가이드에 반영

---

## 8) 화면/UX 기획(웹페이지)
### 8.1 IA
- /login
- /dashboard
- /search (키워드 입력 + 플랫폼 선택 + 실행)
- /creators (리스트/필터)
- /creators/:id (상세)
- /watchlists
- /watchlists/:id
- /experiments (후속 연결용, 최소 입력)
- /reports (점수-성과)
- /admin (API/Slack/룰 파라미터/사용자)

### 8.2 Search 화면(핵심 추가)
- 입력:
  - 플랫폼 선택: Instagram / X (복수 선택)
  - 키워드/해시태그(복수)
  - 언어/국가(선택)
  - 기간(최근 7일/30일)
  - 팔로워 범위(기본값 포함)
- 실행 방식:
  - “Run Search” 버튼(수동 실행)
  - 실행 로그(몇 개 콘텐츠/계정 수집했는지)
- 출력:
  - “이번 실행에서 추가된 후보 n명” + 바로 리스트로 이동

### 8.3 Creators List
- 필터: 플랫폼, 카테고리, 상태, 점수 범위, flags
- 정렬: total_score / outlier_score / health_score / 최신 게시일
- row: 핸들, 팔로워, 상태, 점수(게이지), 요약 1줄, “Slack 공유”, “Watchlist 추가”

### 8.4 Creator Detail
- 상단: 프로필 링크, 주요 지표, 상태 변경, 점수 + “왜 이런 점수?”
- 중단: 상위 콘텐츠 3~5개(링크/캡션 요약)
- 하단: Watchlist 포함 현황, (선택) 실험 투입 기록

### 8.5 Slack 공유(버튼 기반)
- 상세/리스트에서 “Slack 공유” 클릭 시:
  - webhook으로 메시지 전송
  - MVP 메시지 템플릿:
    - 플랫폼, 계정, 팔로워, 핵심 지표(반응률/아웃라이어), 점수, 링크, 1줄 코멘트

---

## 9) 기술 아키텍처(Firebase)
### 9.1 스택
- Frontend: Next.js + Firebase Hosting
- Auth: Firebase Authentication(Workspace 권장)
- DB: Firestore
- Backend: Cloud Functions(커넥터 호출/스코어링/Gemini)
- Batch: Cloud Scheduler(선택)
- Storage: CSV/샘플 저장(선택)
- AI: Gemini(서버사이드 호출)

### 9.2 주요 Cloud Functions
- runSearch(platforms, keywords, params): 커넥터 실행 → 후보 upsert
- scoreCreator(creatorId): 룰 기반 점수 계산(+Gemini 옵션)
- sendToSlack(creatorId or watchlistId)
- importCSV(file)

### 9.3 Firestore 모델(요약)
- creators/{id}: profile + metrics + scores + status + flags + samples
- searches/{id}: 실행 파라미터/로그/결과 요약
- watchlists/{id}: creator_ids + notes
- admin_settings/{id}: slack_webhook, scoring_params, api_keys_ref
- activity_logs/{id}

---

## 10) 개발 마일스톤
### M0(1주)
- Auth + CRUD(creator/watchlist)
- Search 화면 UI + “수동 후보 등록/CSV 업로드”
- Slack webhook 설정 + 버튼 전송

### M1(2~3주)
- X 커넥터(API 기반)로 키워드 검색 → 후보 자동 생성
- 룰 기반 스코어링(Outlier/Health) + 리스트 필터/정렬

### M2(4주)
- Instagram 커넥터(가능 범위 내) 적용 또는 “입력/제공 데이터 기반” 하이브리드
- Gemini 기반 Intent 옵션 + Reports(점수 구간별 성과 비교)

---

## 11) Firebase Studio + Gemini 개발 지시문(복붙용)
- 목표: 위 IA 및 기능을 갖춘 내부 웹 MVP를 Firebase(Hosting/Auth/Firestore/Functions)로 구현
- 핵심 요구사항:
  - /search에서 키워드 입력 → (X API 우선) 검색 실행 → 후보 계정 생성
  - 후보 리스트/필터/정렬/상세
  - 플랫폼별 룰 필터(팔로워 범위 + 반응률/아웃라이어 + 미디어 비율)
  - Watchlist 관리
  - Slack Incoming Webhook 연동(버튼 전송)
  - (옵션) Instagram 커넥터는 추상화하여 구현(가능 범위 내 API/입력 기반)
  - 모든 외부 API 및 Gemini 호출은 Cloud Functions에서만 수행(키 보호)
  - Firestore 보안 규칙(RBAC) 포함
  - README에 환경변수 설정(X API 키, Instagram 토큰, Slack webhook)과 배포 절차 명시

---

## 12) 리스크/주의사항
- “전체 사용자 대상 자동 탐색”은 공식 API로도 제한이 있을 수 있으므로, MVP는 **키워드/해시태그 기반의 합법적 수집**을 전제로 한다.
- 웰니스 관련 콘텐츠는 과장/의학적 주장 리스크가 있어, Gemini 분석 시 risk flag를 반드시 포함하고 운영 기준을 만든다.
