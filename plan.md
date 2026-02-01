# Micro Creator Radar MVP — plan.md
(ANP / COHLABI 내부용)  
목적: Instagram / TikTok / X 등 소셜 채널에서 **가설 검증에 적합한 ‘마이크로 크리에이터’ 후보를 빠르게 발굴·평가·풀로 관리**할 수 있는 웹 MVP를 Firebase(Studio)로 구축한다.  
핵심 원칙: **“발굴(Discovery)”이 아니라 “실험 성공률”을 높이는 레이더**가 되어야 한다.

---

## 0) MVP 정의 (한 문장)
**“마이크로 크리에이터 후보를 수집(또는 업로드) → 자동 스코어링(Commercial Intent / Health) → 리스트·필터·상세 보기 → 풀(Watchlist)로 저장 → 실험 투입/성과 기록까지 연결”**하는 내부 운영용 웹앱.

---

## 1) 성공 기준 (MVP KPI)
- 운영 효율:
  - (KPI1) 후보 수집/등록 → “검증 투입”까지 평균 리드타임 1일 이내
  - (KPI2) 후보 100명 중 “실험 투입 가능” 판정 비율 ≥ 20%
- 모델 효용:
  - (KPI3) 스코어 상위 20%의 실험 성공률이 하위 20% 대비 유의미하게 높음(최소 2배 목표)
- 활용성:
  - (KPI4) 영업/운영팀이 주 1회 이상 사용(Active users)

---

## 2) 사용자/권한
### 2.1 사용자
- **Ops(운영)**: 후보 발굴/검증, 풀 관리, 크리에이터 커뮤니케이션 전 단계 준비
- **Sales(영업)**: 카테고리별 강한 풀을 근거로 제안/수주, 실험 결과 레퍼런스 활용
- **Admin(관리자)**: 데이터 소스/스코어링 룰 관리, 사용자 권한 관리

### 2.2 권한(RBAC)
- Viewer: 읽기(리스트/상세/리포트)
- Editor: 후보 추가/수정, Watchlist 관리, 상태 변경
- Admin: 사용자/설정, 스코어링 파라미터, 데이터 import/export

---

## 3) MVP 범위 (Scope)
### 3.1 MVP에서 “한다”
1) **후보 등록**
   - (A) 수동 등록(링크 붙여넣기 + 기본 정보 입력)
   - (B) CSV 업로드(초기 가장 현실적)  
   - (옵션) 크롤링/스크래핑은 MVP에서 “플러그인 형태”로만 설계(법/약관 리스크)
2) **자동 스코어링(2축)**
   - **Health Score**: 계정 건강도(성장/참여/이상치)
   - **Commercial Intent Score**: 전환 가능성(CTA/링크 습관/제품 언급/댓글 신호)
3) **탐색 UI**
   - 리스트/필터/정렬/검색
   - 상세 페이지(최근 콘텐츠 스냅샷, 요약, 스코어 설명)
4) **풀(Watchlist) 운영**
   - 팀/캠페인별 Watchlist 생성
   - 후보를 Watchlist에 추가/제거
   - 상태(NEW → SHORTLIST → CONTACTED → ACTIVE → PAUSED) 관리
5) **실험 투입 기록(최소)**
   - 후보가 어떤 프로젝트/오퍼에 투입되었는지 기록
   - 결과 입력(수치 최소: 클릭/주문/매출/CPA/ROAS 중 가능한 것)
6) **리포트(최소)**
   - 스코어 구간별 실험 성과 비교(“레이더가 유효한가?” 증명용)

### 3.2 MVP에서 “안 한다(Non-goals)”
- 자동 DM 발송/메시징 자동화
- 결제/정산 레일(후속 단계)
- 플랫폼 공식 API 통합(승인/정책/개발 비용 이슈) — 단, 구조는 열어두기
- 복잡한 멀티 터치 어트리뷰션(후속 단계)

---

## 4) 데이터 설계 (입력/출력)
### 4.1 후보 입력 필드(최소)
- platform: instagram | tiktok | x
- handle / profile_url
- category_tags: (예: 웰니스, 수면, 단백질, 시니어, 이너뷰티 등)
- country/language (선택)
- notes (운영 메모)
- **metrics (가능하면)**
  - followers, following, posts_count
  - avg_views_lastN, avg_likes_lastN, avg_comments_lastN (없으면 공란 허용)
  - last_post_date
- **content samples (선택)**
  - 최근 콘텐츠 링크 1~5개 (텍스트/캡션을 수동 입력 가능)

### 4.2 출력(자동 산출)
- health_score (0–100)
- intent_score (0–100)
- total_score = 가중합(초기: 0.5/0.5)
- score_explain (왜 이렇게 나왔는지 짧은 설명)
- flags: {fraud_suspect, brand_safety_risk, inactive, outlier}

---

## 5) 스코어링 로직 (MVP 버전)
> MVP에서는 **룰 기반 + Gemini 요약/분류** 혼합이 현실적이다.  
> 이후 데이터가 쌓이면 ML/랭킹으로 고도화.

### 5.1 Health Score (룰 기반 예시)
- 최근 게시: last_post_date가 14일 이내면 +15, 30일 이내면 +8, 그 외 -10
- 참여율(가능 시): (avg_likes + avg_comments) / followers
  - 3% 이상 +20, 1% 이상 +10, 0.3% 미만 -10
- 성장률(가능 시): 최근 30일 followers 증가율
  - +10% 이상 +15, 음수면 -15
- 이상치 탐지(간단):
  - followers 대비 댓글/좋아요 비율이 극단적이면 fraud_suspect

### 5.2 Commercial Intent Score (Gemini + 룰)
#### 입력(텍스트 중심, MVP)
- 최근 캡션/해시태그/댓글 대표 샘플(수동 입력 또는 CSV)
- 콘텐츠 유형 태그(리뷰, 루틴, 비교, 언박싱, 추천, ASMR 등)

#### Gemini 사용(추천)
- 분류: “구매 의도 신호(CTA, 링크 유도, 제품 효능 언급, 사용 전후, 가격/구매처 언급)” 유무
- 요약: 콘텐츠 톤/타깃/제품 카테고리 적합성
- 리스크: 과장광고/의학적 주장 가능성(웰니스는 특히 중요)

#### Intent 룰 예시
- 캡션에 “링크/프로필/구매/할인/쿠폰” 등 CTA 단어 포함 → +15
- ‘루틴/습관’형 콘텐츠(반복구매 가능 카테고리와 적합) → +10
- ‘비포애프터/효능 단정’ 등 리스크 표현 → brand_safety_risk 플래그 + 감점

---

## 6) 화면/UX 기획 (웹페이지에서 보여지는 방식)
### 6.1 정보구조(IA)
- /login
- /dashboard
- /creators (리스트/필터)
- /creators/:id (상세)
- /watchlists
- /watchlists/:id
- /experiments (실험 기록 목록)
- /reports (스코어-성과 리포트)
- /admin (설정/사용자/임포트)

### 6.2 Dashboard (요약)
- 카드 4개:
  - 이번 주 신규 후보 수
  - SHORTLIST 수
  - ACTIVE 수
  - PAUSED/INACTIVE 수
- “Top Intent (상위 10)” 테이블
- “Top Health (상위 10)” 테이블
- 최근 활동 로그(누가 무엇을 변경했는지)

### 6.3 Creators List (핵심 화면)
- 상단 필터:
  - 플랫폼, 카테고리 태그, 국가/언어(선택), 상태, 스코어 범위 슬라이더
  - flags(brand_safety_risk/fraud_suspect/inactive)
- 정렬:
  - total_score, intent_score, health_score, 최근 게시일
- 각 row에 표시:
  - 프로필(플랫폼 아이콘+핸들), 팔로워(있으면), 상태 배지
  - Health/Intent 점수(작은 바/게이지)
  - “설명 1줄”(score_explain)
  - 버튼: 상세보기 / Watchlist 추가

### 6.4 Creator Detail
- 상단:
  - 프로필 링크, 기본 메트릭, 상태 변경 드롭다운
  - 점수 3종(Health/Intent/Total) + “왜 이런 점수?”(explain)
- 중단:
  - 콘텐츠 샘플(링크 리스트 + 캡션/요약)
  - Gemini 요약 카드(타깃/톤/적합 카테고리/리스크)
- 하단:
  - Watchlist 포함 현황
  - 실험 투입 기록(프로젝트명, 오퍼, 결과)

### 6.5 Watchlists
- Watchlist 생성(예: “수면 루틴 파일럿”, “단백질 음료 테스트”)
- Watchlist 상세:
  - 포함 크리에이터 리스트
  - “다음 액션” 체크리스트(연락/샘플/콘텐츠 업로드)
  - 간단 코멘트/태그

### 6.6 Experiments (최소)
- 필드:
  - experiment_name, client_brand, product_category, offer_type
  - creators_involved(참여 크리에이터)
  - tracking: link/utm/coupon (텍스트)
  - results: clicks, orders, revenue, cpa, roas (가능한 것만)
  - notes/learned
- 목표: **레이더 점수와 결과를 연결할 데이터**가 쌓이게 하는 것.

### 6.7 Reports
- “스코어 구간별 성과”
  - Intent 상위 20% vs 하위 20%의 평균 주문/매출 비교
  - Health 상위 vs 하위 비교
- 카테고리별 성과 히트맵(옵션)
- CSV export

---

## 7) 기술 아키텍처 (Firebase 기준)
### 7.1 스택
- Frontend: Next.js(또는 React) + Firebase Hosting
- Auth: Firebase Authentication (Google Workspace 로그인 권장)
- DB: Firestore
- Backend: Cloud Functions
- Batch/Schedule: Cloud Scheduler + Functions (후속)
- File: Cloud Storage (CSV 업로드)
- AI: Gemini API (서버사이드 호출 권장)

### 7.2 데이터 모델(Firestore)
- users/{uid}
  - role, name, team
- creators/{creatorId}
  - platform, handle, profile_url
  - category_tags[], country, language
  - metrics{...}
  - scores{health,intent,total,explain,flags}
  - status, notes
  - created_at, updated_at
- watchlists/{watchlistId}
  - name, description, tags[], owner_uid
  - creator_ids[]
  - created_at, updated_at
- experiments/{experimentId}
  - name, client_brand, category, offer_type
  - creator_ids[]
  - tracking{...}
  - results{...}
  - notes, created_at, updated_at
- activity_logs/{logId}
  - actor_uid, action, entity_type, entity_id, timestamp

### 7.3 보안 규칙(개요)
- Auth required
- role 기반 접근 제어
- creators: Viewer read, Editor write
- admin: all

---

## 8) 운영 플로우 (팀이 실제로 쓰는 방법)
1) Ops가 후보를 수동/CSV로 업로드
2) 자동 스코어링 실행(저장 시 트리거)
3) 리스트에서 필터 → SHORTLIST에 올림
4) Watchlist(캠페인) 생성 후 후보를 담음
5) 실험 투입 시 experiment 기록 생성 + 후보 상태 ACTIVE
6) 결과 입력(가능한 최소 수치라도)
7) Reports에서 “점수-성과 상관”을 주기적으로 확인하고 룰 수정

---

## 9) Gemini 프롬프트 설계 (서버사이드)
### 9.1 입력 포맷(권장 JSON)
{
  "platform": "instagram",
  "handle": "@xxx",
  "category_tags": ["wellness","sleep"],
  "samples": [
    {"caption": "...", "hashtags": ["..."], "comments_sample": ["...", "..."]},
    ...
  ]
}

### 9.2 출력 포맷(엄격 JSON)
{
  "intent_score": 0,
  "intent_reasons": ["..."],
  "audience_summary": "…",
  "content_type_tags": ["routine","review"],
  "brand_safety_flags": ["medical_claim_risk","exaggerated_claim"],
  "suggested_products": ["sleep","protein","low_sugar_drink"],
  "one_line_note": "…"
}

### 9.3 프롬프트 가드레일
- 항상 JSON만 출력
- 과장/의학적 주장 리스크는 반드시 감지(없으면 빈 배열)
- 확신 없으면 낮은 점수

---

## 10) 개발 단계/마일스톤
### M0 (1주)
- Auth + 기본 CRUD(creator 등록/리스트/상세)
- Watchlist CRUD
- CSV import(Storage 업로드 → Function 파싱 → Firestore 저장)

### M1 (2~3주)
- 스코어링 룰(Health) 구현
- Gemini 요약/Intent 스코어링 연결(Cloud Function)
- 필터/정렬/검색 UX 완성

### M2 (4주)
- Experiments 기록 + Reports 1종(상위/하위 비교)
- Admin(스코어 가중치/룰 파라미터 수정)

---

## 11) Firebase Studio + Gemini에 줄 “개발 지시문” (복붙용)
- 프로젝트 목표: 위 IA와 기능을 갖춘 내부 웹 MVP
- 요구사항:
  - Firebase Auth + Firestore + Hosting
  - creators CRUD, watchlists CRUD, experiments CRUD
  - CSV import 기능(Cloud Storage 업로드 후 파싱)
  - 스코어 계산(룰 기반 Health + Gemini 기반 Intent)
  - 리스트 필터/정렬/검색
  - Reports: Intent 상위 20% vs 하위 20%의 평균 성과 비교(orders/revenue)
  - RBAC: Viewer/Editor/Admin
- UI:
  - 대시보드(요약 카드 + Top tables)
  - 리스트 테이블 + 점수 게이지 + 상태 배지
  - 상세 페이지에 점수 설명/요약 카드 표시
- 품질:
  - 모든 Gemini 호출은 서버사이드로(키 보호)
  - Firestore 보안 규칙 포함
  - README에 배포 방법 포함

---

## 12) 리스크/주의사항
- 소셜 플랫폼 크롤링/스크래핑은 정책/법적 리스크가 있으므로 MVP는 **수동/CSV 입력 중심**으로 시작하고, 추후 공식 API/파트너 방식으로 확장.
- 웰니스/건강 관련 콘텐츠는 과장·의학적 주장 리스크가 높으므로 **brand_safety_flags**를 반드시 운영 프로세스에 포함.

---
