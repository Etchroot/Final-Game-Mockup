# 로컬 실행 및 프로젝트 개요

## 로컬 실행 방법
1. Node.js(16+)가 설치되어 있는지 확인합니다.
2. 리포지토리 루트에서 `npm install`을 실행하여 의존성을 설치합니다.
3. 개발 모드로 실행하려면:
   ```bash
   npm run dev
   ```
4. 브라우저에서 `http://localhost:3000`으로 접속하면 게임을 바로 플레이할 수 있습니다.
5. OpenAI 통합을 테스트하려면 루트에 `.env.local` 파일을 만들고 `OPENAI_API_KEY=키값`을 추가하세요. 없으면 목업 응답이 사용됩니다.

## 현재 구현 범위 (MVP)
- Next.js App Router 기반 SPA 구조
- 시작 화면, 제조 화면, 결과 화면을 컴포넌트로 분리
- 하드코딩된 문장 10개, 10가지 향 버튼
- 10회 클릭 제한, 클릭 횟수 표시, 항아리 자리 표시
- 결과 페이지에서 레시피 비율 계산, 이름/설명 자동 생성(규칙 기반)
- 링크 복사 및 구매 버튼(더미 링크)
- OpenAI 연동 구조 포함, 키 없을 시 목업 동작
- Tailwind CSS로 장난스럽고 귀여운 스타일 적용
- 상태 관리를 위한 간단한 React Context 사용

## 주요 폴더 구조
```
/app                # Next.js App Router 폴더
  layout.tsx        # 공통 레이아웃
  page.tsx          # 시작 화면
  game/page.tsx     # 제조 화면
  result/page.tsx   # 결과 화면
/components         # 개별 UI 컴포넌트
  StartScreen.tsx
  ManufactureScreen.tsx
  ResultScreen.tsx
  ScentButton.tsx
  GameContext.tsx
/data               # 하드코딩된 게임 데이터
  sentences.ts
  scents.ts
/lib                # 유틸 함수 및 OpenAI 처리
  recipeUtils.ts
  openai.ts
/styles             # 글로벌 CSS
docs/overview.md    # 이 문서
README.md           # 프로젝트 개요
package.json, etc.  # 설치/빌드 스크립트
```

## 이후 개선 포인트
- 결과 설명/이름 생성을 OpenAI API로 본격 연결
- 항아리 색 혼합 애니메이션, 병 이미지 추가
- SNS 공유 이미지 생성 기능
- 모바일 레이아웃 최적화 및 반응형 개선
- 사용자가 직접 문장 입력 또는 저장 기능 추가
- 향 버튼 아이콘/이미지 세부 디자인
- 점수 모드, 사용자 계정/저장/랭킹 기능 확장
- 코드 리팩터링, 타입스크립트 완전 적용

``` 
(코드든 문서든 TODO 주석을 추가하여 다음 작업을 안내)