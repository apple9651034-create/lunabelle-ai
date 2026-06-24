# AI 루나 - 디자인 아이디어

## 세 가지 방향 검토

### 1. Mystic Dark Luxury (확률: 0.07)
심오한 밤하늘과 신비로운 동양 점술의 분위기를 담은 다크 테마. 딥 네이비와 금색의 조화.

### 2. Ethereal Light Shrine (확률: 0.05)
한국 전통 사찰의 고요함에서 영감을 받은 밝고 정갈한 테마. 크림과 인디고의 조화.

### 3. Celestial Gradient Flow (확률: 0.08)
우주와 별자리를 모티프로 한 보라-남색 그라디언트 테마. 현대적이면서도 신비로운 느낌.

---

## 선택: **Mystic Dark Luxury**

기존 코드가 이미 보라색 계열을 사용하고 있으며, 점술 서비스의 특성상 신비롭고 고급스러운 다크 테마가 가장 적합합니다.

### Design Movement
**Neo-Oriental Mysticism** — 동양 점술의 신비로움을 현대적 다크 럭셔리 UI로 재해석

### Core Principles
1. 어둠 속의 빛: 깊은 다크 배경에 금빛과 보라빛 포인트
2. 신성한 여백: 충분한 공간감으로 신비로운 분위기 조성
3. 유동적 흐름: 별빛처럼 흐르는 애니메이션과 그라디언트
4. 전통과 현대의 융합: 한국 전통 문양 모티프를 현대적 UI에 녹여냄

### Color Philosophy
- **배경**: 딥 네이비 `oklch(0.12 0.03 270)` — 밤하늘의 깊이
- **주 색상**: 보라 `oklch(0.55 0.25 290)` — 신비로운 에너지
- **강조 색상**: 금색 `oklch(0.78 0.15 85)` — 고급스러운 빛
- **텍스트**: 크림 `oklch(0.95 0.02 90)` — 따뜻한 달빛

### Layout Paradigm
모바일 우선 하단 내비게이션 구조. 각 페이지는 전체 화면을 활용하며, 카드 기반 콘텐츠 레이아웃.

### Signature Elements
1. 달 이모지(🌙)와 별빛 파티클 효과
2. 금색 테두리와 글로우 효과가 있는 카드
3. 보라-금색 그라디언트 헤더

### Interaction Philosophy
부드러운 페이드-인 애니메이션, 카드 호버 시 은은한 글로우 효과, 버튼 클릭 시 파문 효과

### Animation
- 페이지 전환: 200ms fade
- 카드 호버: 150ms ease-out scale(1.02) + shadow 증가
- 로딩: 달 이모지 bounce 애니메이션

### Typography System
- **헤더**: Noto Serif KR (serif, 고급스러운 느낌)
- **본문**: Noto Sans KR (sans-serif, 가독성)
- **포인트**: 금색 텍스트로 강조

### Brand Essence
"동양의 지혜로 당신의 운명을 밝히는 AI 점술사" — 신비롭고, 고급스럽고, 신뢰할 수 있는

### Brand Voice
- 헤드라인: "당신의 운명이 속삭입니다"
- CTA: "루나에게 물어보세요"
- 금지: "Welcome", "Get started"

### Signature Brand Color
**심야 보라** `oklch(0.55 0.25 290)` — AI 루나만의 신비로운 보라
