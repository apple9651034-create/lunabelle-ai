/* 타로 카드 유틸리티
 * 78장 완전 덱 + 질문 유형별 스프레드 알고리즘
 */

export interface TarotCard {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
  meaning: string;
  reversed: string;
  keywords: string[];
  imageUrl?: string;
}

export interface TarotSpread {
  name: string;
  positions: string[];
  interpretation: (cards: TarotCard[], reversed: boolean[]) => string;
}

// 대 아르카나 (22장)
const majorArcana: TarotCard[] = [
  { id: 0, name: '우매자 (The Fool)', arcana: 'major', meaning: '새로운 시작, 모험, 자유', reversed: '무모함, 위험, 주의 필요', keywords: ['시작', '모험', '자유'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_0_fool-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 1, name: '마술사 (The Magician)', arcana: 'major', meaning: '능력, 재능, 창조력', reversed: '조작, 혼란, 무능', keywords: ['능력', '창조', '힘'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_1_magician-3xQvfvJCwdGJqFWvCJRgJx.webp' },
  { id: 2, name: '여사제 (The High Priestess)', arcana: 'major', meaning: '직관, 신비, 지혜', reversed: '혼란, 비밀, 억압', keywords: ['직관', '신비', '지혜'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_2_high_priestess-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 3, name: '여황제 (The Empress)', arcana: 'major', meaning: '풍요, 창조, 모성', reversed: '불임, 공허, 의존', keywords: ['풍요', '창조', '사랑'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_3_empress-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 4, name: '황제 (The Emperor)', arcana: 'major', meaning: '권력, 통제, 리더십', reversed: '약함, 무질서, 독재', keywords: ['권력', '리더십', '통제'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_4_emperor-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 5, name: '교황 (The Hierophant)', arcana: 'major', meaning: '전통, 신앙, 가르침', reversed: '반항, 이단, 자유', keywords: ['전통', '신앙', '가르침'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_5_hierophant-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 6, name: '연인 (The Lovers)', arcana: 'major', meaning: '사랑, 조화, 선택', reversed: '불화, 이별, 갈등', keywords: ['사랑', '선택', '조화'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_6_lovers-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 7, name: '전차 (The Chariot)', arcana: 'major', meaning: '승리, 통제, 결단', reversed: '실패, 혼란, 지연', keywords: ['승리', '결단', '진행'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_7_chariot-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 8, name: '힘 (Strength)', arcana: 'major', meaning: '내적 힘, 인내, 용기', reversed: '약함, 자기 의심, 폭력', keywords: ['힘', '용기', '인내'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_8_strength-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 9, name: '은둔자 (The Hermit)', arcana: 'major', meaning: '명상, 성찰, 지혜', reversed: '고립, 공포, 무지', keywords: ['명상', '성찰', '지혜'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_9_hermit-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 10, name: '운명의 수레바퀴 (Wheel of Fortune)', arcana: 'major', meaning: '운명, 순환, 변화', reversed: '나쁜 운, 저항, 혼란', keywords: ['운명', '순환', '변화'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_10_wheel_of_fortune-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 11, name: '정의 (Justice)', arcana: 'major', meaning: '정의, 균형, 진실', reversed: '불공정, 편견, 거짓', keywords: ['정의', '균형', '진실'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_11_justice-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 12, name: '매달린 사람 (The Hanged Man)', arcana: 'major', meaning: '희생, 관점 변화, 깨달음', reversed: '무의미한 희생, 지연, 저항', keywords: ['희생', '관점', '깨달음'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_12_hanged_man-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 13, name: '죽음 (Death)', arcana: 'major', meaning: '변화, 끝, 새로운 시작', reversed: '정체, 거부, 지연', keywords: ['변화', '끝', '시작'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_13_death-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 14, name: '절제 (Temperance)', arcana: 'major', meaning: '균형, 조화, 절제', reversed: '불균형, 과잉, 갈등', keywords: ['균형', '조화', '절제'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_14_temperance-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 15, name: '악마 (The Devil)', arcana: 'major', meaning: '속박, 욕망, 물질성', reversed: '해방, 깨달음, 자유', keywords: ['속박', '욕망', '물질'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_15_devil-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 16, name: '탑 (The Tower)', arcana: 'major', meaning: '파괴, 혼란, 깨달음', reversed: '회피, 지연, 내적 붕괴', keywords: ['파괴', '혼란', '깨달음'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_16_tower-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 17, name: '별 (The Star)', arcana: 'major', meaning: '희망, 영감, 명확함', reversed: '절망, 혼란, 어둠', keywords: ['희망', '영감', '명확'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_17_star-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 18, name: '달 (The Moon)', arcana: 'major', meaning: '환상, 직관, 불안', reversed: '명확함, 진실, 안정', keywords: ['환상', '직관', '불안'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_18_moon-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 19, name: '태양 (The Sun)', arcana: 'major', meaning: '성공, 행복, 명확함', reversed: '실패, 슬픔, 혼란', keywords: ['성공', '행복', '명확'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_19_sun-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 20, name: '심판 (Judgement)', arcana: 'major', meaning: '부활, 소명, 깨달음', reversed: '의심, 거부, 지연', keywords: ['부활', '소명', '깨달음'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_20_judgement-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 21, name: '세계 (The World)', arcana: 'major', meaning: '완성, 성취, 여행', reversed: '불완전, 지연, 정체', keywords: ['완성', '성취', '여행'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_21_world-lYvLxFGJQzGJqFWvCJRgJx.webp' },
];

// 소 아르카나 - 완드 (14장)
const wandsSuit: TarotCard[] = [
  { id: 22, name: '완드 에이스', arcana: 'minor', suit: 'wands', number: 1, meaning: '새로운 기회, 창조, 영감', reversed: '지연, 장애, 혼란', keywords: ['기회', '창조', '영감'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_22_wand_ace-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 23, name: '완드 2', arcana: 'minor', suit: 'wands', number: 2, meaning: '계획, 선택, 결정', reversed: '혼란, 지연, 불안', keywords: ['계획', '선택', '결정'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_23_wand_two-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 24, name: '완드 3', arcana: 'minor', suit: 'wands', number: 3, meaning: '성장, 확장, 협력', reversed: '지연, 장애, 갈등', keywords: ['성장', '확장', '협력'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_24_wand_three-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 25, name: '완드 4', arcana: 'minor', suit: 'wands', number: 4, meaning: '축하, 안정, 평화', reversed: '불안, 혼란, 갈등', keywords: ['축하', '안정', '평화'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_25_wand_four-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 26, name: '완드 5', arcana: 'minor', suit: 'wands', number: 5, meaning: '갈등, 경쟁, 긴장', reversed: '화해, 평화, 합의', keywords: ['갈등', '경쟁', '긴장'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_26_wand_five-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 27, name: '완드 6', arcana: 'minor', suit: 'wands', number: 6, meaning: '승리, 성공, 인정', reversed: '실패, 좌절, 거부', keywords: ['승리', '성공', '인정'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_27_wand_six-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 28, name: '완드 7', arcana: 'minor', suit: 'wands', number: 7, meaning: '도전, 경쟁, 용기', reversed: '항복, 약함, 지연', keywords: ['도전', '경쟁', '용기'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_28_wand_seven-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 29, name: '완드 8', arcana: 'minor', suit: 'wands', number: 8, meaning: '빠른 진행, 에너지, 움직임', reversed: '지연, 정체, 혼란', keywords: ['빠름', '에너지', '움직임'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_29_wand_eight-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 30, name: '완드 9', arcana: 'minor', suit: 'wands', number: 9, meaning: '회복력, 인내, 강함', reversed: '약함, 지침, 포기', keywords: ['회복력', '인내', '강함'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_30_wand_nine-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 31, name: '완드 10', arcana: 'minor', suit: 'wands', number: 10, meaning: '부담, 책임, 압력', reversed: '해방, 경감, 자유', keywords: ['부담', '책임', '압력'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_31_wand_ten-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 32, name: '완드 페이지', arcana: 'minor', suit: 'wands', meaning: '탐험, 호기심, 열정', reversed: '무모함, 혼란, 지연', keywords: ['탐험', '호기심', '열정'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_32_wand_page-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 33, name: '완드 나이트', arcana: 'minor', suit: 'wands', meaning: '모험, 에너지, 열정', reversed: '무모함, 갈등, 지연', keywords: ['모험', '에너지', '열정'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_33_wand_knight-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 34, name: '완드 퀸', arcana: 'minor', suit: 'wands', meaning: '따뜨함, 친절, 창조성', reversed: '냉담, 비판, 질투', keywords: ['따뜨함', '친절', '창조'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_34_wand_queen-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 35, name: '완드 킹', arcana: 'minor', suit: 'wands', meaning: '리더십, 비전, 열정', reversed: '독재, 약함, 혼란', keywords: ['리더십', '비전', '열정'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_35_wand_king-lYvLxFGJQzGJqFWvCJRgJx.webp' },
];

// 소 아르카나 - 펜타클 (14장)
const pentaclesSuit: TarotCard[] = [
  { id: 36, name: '펜타클 에이스', arcana: 'minor', suit: 'pentacles', number: 1, meaning: '새로운 기회, 번영, 풍요', reversed: '지연, 손실, 혼란', keywords: ['기회', '번영', '풍요'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_36_pentacle_ace-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 37, name: '펜타클 2', arcana: 'minor', suit: 'pentacles', number: 2, meaning: '균형, 관리, 선택', reversed: '불균형, 혼란, 지연', keywords: ['균형', '관리', '선택'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_37_pentacle_two-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 38, name: '펜타클 3', arcana: 'minor', suit: 'pentacles', number: 3, meaning: '협력, 기술, 성장', reversed: '갈등, 무능, 지연', keywords: ['협력', '기술', '성장'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_38_pentacle_three-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 39, name: '펜타클 4', arcana: 'minor', suit: 'pentacles', number: 4, meaning: '안정, 소유, 보안', reversed: '손실, 불안, 변화', keywords: ['안정', '소유', '보안'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_39_pentacle_four-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 40, name: '펜타클 5', arcana: 'minor', suit: 'pentacles', number: 5, meaning: '빈곤, 어려움, 고통', reversed: '회복, 도움, 진행', keywords: ['빈곤', '어려움', '고통'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_40_pentacle_five-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 41, name: '펜타클 6', arcana: 'minor', suit: 'pentacles', number: 6, meaning: '나눔, 도움, 공정함', reversed: '인색, 부정, 불공정', keywords: ['나눔', '도움', '공정'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_41_pentacle_six-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 42, name: '펜타클 7', arcana: 'minor', suit: 'pentacles', number: 7, meaning: '평가, 성장, 재평가', reversed: '정체, 혼란, 지연', keywords: ['평가', '성장', '재평가'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_42_pentacle_seven-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 43, name: '펜타클 8', arcana: 'minor', suit: 'pentacles', number: 8, meaning: '기술, 학습, 숙련', reversed: '무능, 혼란, 지연', keywords: ['기술', '학습', '숙련'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_43_pentacle_eight-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 44, name: '펜타클 9', arcana: 'minor', suit: 'pentacles', number: 9, meaning: '풍요, 성공, 번영', reversed: '손실, 불안, 혼란', keywords: ['풍요', '성공', '번영'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_44_pentacle_nine-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 45, name: '펜타클 10', arcana: 'minor', suit: 'pentacles', number: 10, meaning: '부, 가족, 유산', reversed: '손실, 갈등, 분리', keywords: ['부', '가족', '유산'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_45_pentacle_ten-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 46, name: '펜타클 페이지', arcana: 'minor', suit: 'pentacles', meaning: '학생, 호기심, 성장', reversed: '무능, 혼란, 지연', keywords: ['학생', '호기심', '성장'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_46_pentacle_page-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 47, name: '펜타클 나이트', arcana: 'minor', suit: 'pentacles', meaning: '신뢰성, 성실, 진행', reversed: '무능, 지연, 혼란', keywords: ['신뢰', '성실', '진행'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_47_pentacle_knight-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 48, name: '펜타클 퀸', arcana: 'minor', suit: 'pentacles', meaning: '풍요, 관대함, 실질성', reversed: '인색, 불안, 혼란', keywords: ['풍요', '관대', '실질'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_48_pentacle_queen-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 49, name: '펜타클 킹', arcana: 'minor', suit: 'pentacles', meaning: '부, 성공, 리더십', reversed: '탐욕, 독재, 혼란', keywords: ['부', '성공', '리더십'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_49_pentacle_king-lYvLxFGJQzGJqFWvCJRgJx.webp' },
];

// 소 아르카나 - 소드 (14장)
const swordsSuit: TarotCard[] = [
  { id: 50, name: '소드 에이스', arcana: 'minor', suit: 'swords', number: 1, meaning: '명확함, 진실, 새로운 시작', reversed: '혼란, 거짓, 지연', keywords: ['명확', '진실', '시작'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_50_sword_ace-lYvLxFGJQzGJqFWvCJRgJx.webp' },
  { id: 51, name: '소드 2', arcana: 'minor', suit: 'swords', number: 2, meaning: '균형, 선택, 결정', reversed: '혼란, 거짓, 불안', keywords: ['균형', '선택', '결정'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_51_sword_two-icT2sdKxCFoKvGZ5RhvMsU.webp' },
  { id: 52, name: '소드 3', arcana: 'minor', suit: 'swords', number: 3, meaning: '슬픔, 고통, 분리', reversed: '치유, 회복, 용서', keywords: ['슬픔', '고통', '분리'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_52_sword_three-3EfWehnigSTqXc5ARgE8qf.webp' },
  { id: 53, name: '소드 4', arcana: 'minor', suit: 'swords', number: 4, meaning: '휴식, 명상, 회복', reversed: '불안, 혼란, 압력', keywords: ['휴식', '명상', '회복'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_53_sword_four-JuKo9EXGBd3otBvZ5Sww7E.webp' },
  { id: 54, name: '소드 5', arcana: 'minor', suit: 'swords', number: 5, meaning: '갈등, 패배, 혼란', reversed: '화해, 회복, 진행', keywords: ['갈등', '패배', '혼란'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_54_sword_five-iSbLStD9EEUBGZvzg727T2.png' },
  { id: 55, name: '소드 6', arcana: 'minor', suit: 'swords', number: 6, meaning: '여행, 이동, 진행', reversed: '지연, 정체, 혼란', keywords: ['여행', '이동', '진행'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_55_sword_six-b2RWP47tntfaHvn2orYt6K.png' },
  { id: 56, name: '소드 7', arcana: 'minor', suit: 'swords', number: 7, meaning: '도둑질, 배신, 속임', reversed: '진실, 정직, 회복', keywords: ['도둑', '배신', '속임'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_56_sword_seven-CWs5CCPUzg4uUWv8YtwFed.webp' },
  { id: 57, name: '소드 8', arcana: 'minor', suit: 'swords', number: 8, meaning: '제약, 갇힘, 혼란', reversed: '해방, 명확, 진행', keywords: ['제약', '갇힘', '혼란'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_57_sword_eight-gzATsGe3RY2p6dKbMf3Vjz.webp' },
  { id: 58, name: '소드 9', arcana: 'minor', suit: 'swords', number: 9, meaning: '절망, 불안, 악몽', reversed: '희망, 회복, 진행', keywords: ['절망', '불안', '악몽'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_58_sword_nine-QiJ9FQuCqfj3NxtFLFd73T.webp' },
  { id: 59, name: '소드 10', arcana: 'minor', suit: 'swords', number: 10, meaning: '고통, 끝, 슬픔', reversed: '회복, 용서, 치유', keywords: ['고통', '끝', '슬픔'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_59_sword_ten-KHTBmUeMeVSkZKDPw2GxjM.png' },
  { id: 60, name: '소드 페이지', arcana: 'minor', suit: 'swords', meaning: '호기심, 탐구, 명확함', reversed: '혼란, 무지, 거짓', keywords: ['호기심', '탐구', '명확'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_60_sword_page-MY2PjwrQBQDAqaEVhAqivt.webp' },
  { id: 61, name: '소드 나이트', arcana: 'minor', suit: 'swords', meaning: '용기, 진실, 행동', reversed: '무모함, 거짓, 혼란', keywords: ['용기', '진실', '행동'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_61_sword_knight-C6ZUdq56ntQ7M3QFP7XNQb.webp' },
  { id: 62, name: '소드 퀸', arcana: 'minor', suit: 'swords', meaning: '명확함, 진실, 독립', reversed: '냉담, 거짓, 혼란', keywords: ['명확', '진실', '독립'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_62_sword_queen-UFZTm8fksPESVbichQukcS.webp' },
  { id: 63, name: '소드 킹', arcana: 'minor', suit: 'swords', meaning: '리더십, 명확함, 진실', reversed: '독재, 거짓, 혼란', keywords: ['리더십', '명확', '진실'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_63_sword_king-Z5uGp7EQe7mkZHxSS9o2zg.webp' },
];

// 소 아르카나 - 컵 (14장)
const cupsSuit: TarotCard[] = [
  { id: 64, name: '컵 에이스', arcana: 'minor', suit: 'cups', number: 1, meaning: '새로운 사랑, 감정, 창조', reversed: '거부, 혼란, 공허', keywords: ['사랑', '감정', '창조'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_64_cup_ace-LMwfZjLWexC5bVrL6XpQ4b.webp' },
  { id: 65, name: '컵 2', arcana: 'minor', suit: 'cups', number: 2, meaning: '사랑, 조화, 관계', reversed: '이별, 갈등, 불화', keywords: ['사랑', '조화', '관계'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_65_cup_two-khHUZdEve5WzMPLj7nmpN6.webp' },
  { id: 66, name: '컵 3', arcana: 'minor', suit: 'cups', number: 3, meaning: '축하, 기쁨, 우정', reversed: '슬픔, 고립, 거부', keywords: ['축하', '기쁨', '우정'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_66_cup_three-VDqHU8Kqs9XXiaw3d928Dk.webp' },
  { id: 67, name: '컵 4', arcana: 'minor', suit: 'cups', number: 4, meaning: '무관심, 정체, 성찰', reversed: '관심, 진행, 깨달음', keywords: ['무관심', '정체', '성찰'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_67_cup_four-YqW95rKF6FMLCR25SuNqkh.webp' },
  { id: 68, name: '컵 5', arcana: 'minor', suit: 'cups', number: 5, meaning: '손실, 슬픔, 후회', reversed: '회복, 용서, 치유', keywords: ['손실', '슬픔', '후회'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_68_cup_five-hQeMdVaAkVri3MQwrXj7P3.webp' },
  { id: 69, name: '컵 6', arcana: 'minor', suit: 'cups', number: 6, meaning: '향수, 행복한 기억, 만남', reversed: '지연, 혼란, 거리', keywords: ['향수', '기억', '만남'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_69_cup_six-KHDZphgpWZYFXcUBWdtpAX.webp' },
  { id: 70, name: '컵 7', arcana: 'minor', suit: 'cups', number: 7, meaning: '환상, 선택, 기회', reversed: '혼란, 거부, 현실', keywords: ['환상', '선택', '기회'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_70_cup_seven-cnhihnKDGE99Rk7g6vQEHL.webp' },
  { id: 71, name: '컵 8', arcana: 'minor', suit: 'cups', number: 8, meaning: '떠남, 이별, 새로운 시작', reversed: '머뭄, 집착, 정체', keywords: ['떠남', '이별', '시작'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_71_cup_eight-Sng5rZkDL3DV8evgnzKXBS.webp' },
  { id: 72, name: '컵 9', arcana: 'minor', suit: 'cups', number: 9, meaning: '행복, 만족, 성취', reversed: '불만, 공허, 지연', keywords: ['행복', '만족', '성취'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_72_cup_nine-X7BmPEtMiYDqgBpEidzFys.webp' },
  { id: 73, name: '컵 10', arcana: 'minor', suit: 'cups', number: 10, meaning: '가족, 조화, 행복', reversed: '불화, 갈등, 거리', keywords: ['가족', '조화', '행복'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_73_cup_ten-N8zeLoeQKsdSpp9rcupKg7.webp' },
  { id: 74, name: '컵 페이지', arcana: 'minor', suit: 'cups', meaning: '감수성, 창조성, 영감', reversed: '무감각, 혼란, 지연', keywords: ['감수성', '창조', '영감'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_74_cup_page-RqSsY9woBqjyvADZneWZ5D.webp' },
  { id: 75, name: '컵 나이트', arcana: 'minor', suit: 'cups', meaning: '로맨틱, 꿈, 감정', reversed: '나이브, 거짓, 혼란', keywords: ['로맨틱', '꿈', '감정'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_75_cup_knight-2X6YosS3y28p6tdLGsuehi.webp' },
  { id: 76, name: '컵 퀸', arcana: 'minor', suit: 'cups', meaning: '사랑, 직관, 따뜨함', reversed: '냉담, 무감각, 거짓', keywords: ['사랑', '직관', '따뜨함'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_76_cup_queen-mgVPdqLhEowSHCwNxiTFDC.webp' },
  { id: 77, name: '컵 킹', arcana: 'minor', suit: 'cups', meaning: '감정 통제, 창조성, 리더십', reversed: '약함, 거짓, 혼란', keywords: ['감정', '창조', '리더십'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_77_cup_king-kiA7AyCQ7tvW8oEPwEftsE.webp' },
];

// 조커 카드
const jokerCard: TarotCard[] = [
  { id: 78, name: '조커 (The Joker)', arcana: 'major', meaning: '신비, 가능성, 예측 불가', reversed: '혼란, 불확실성, 위험', keywords: ['신비', '가능성', '예측'], imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663790248197/EBFqsicNNbXYW6ZmeVezcG/tarot_78_joker-H8pSCxhG2wDamspSV4iBhC.webp' },
];

// 전체 78장 덱
export const fullTarotDeck: TarotCard[] = [...majorArcana, ...wandsSuit, ...pentaclesSuit, ...swordsSuit, ...cupsSuit, ...jokerCard];

// 질문 유형 감지
export function detectQuestionType(question: string): 'love' | 'wealth' | 'health' | 'career' | 'general' {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('연애') || lowerQuestion.includes('사랑') || lowerQuestion.includes('인연') || lowerQuestion.includes('결혼')) {
    return 'love';
  }
  if (lowerQuestion.includes('돈') || lowerQuestion.includes('재물') || lowerQuestion.includes('사업') || lowerQuestion.includes('투자')) {
    return 'wealth';
  }
  if (lowerQuestion.includes('건강') || lowerQuestion.includes('병') || lowerQuestion.includes('활력')) {
    return 'health';
  }
  if (lowerQuestion.includes('직업') || lowerQuestion.includes('일') || lowerQuestion.includes('진로') || lowerQuestion.includes('성공')) {
    return 'career';
  }

  return 'general';
}

// 스프레드 선택
export function selectSpread(questionType: 'love' | 'wealth' | 'health' | 'career' | 'general'): TarotSpread {
  const spreads: Record<string, TarotSpread> = {
    love: {
      name: '3카드 스프레드 (과거-현재-미래)',
      positions: ['과거의 영향', '현재 상황', '미래 전망'],
      interpretation: (cards, reversed) => {
        return `과거: ${cards[0].name} (${reversed[0] ? '역방향' : '정방향'}) - ${reversed[0] ? cards[0].reversed : cards[0].meaning}\n현재: ${cards[1].name} (${reversed[1] ? '역방향' : '정방향'}) - ${reversed[1] ? cards[1].reversed : cards[1].meaning}\n미래: ${cards[2].name} (${reversed[2] ? '역방향' : '정방향'}) - ${reversed[2] ? cards[2].reversed : cards[2].meaning}`;
      },
    },
    wealth: {
      name: '켈틱 크로스 (10카드)',
      positions: ['현재 상황', '도전 요소', '멀리 있는 목표', '근처 영향', '당신의 태도', '외부 영향', '당신의 희망', '외부 의견', '최종 결과', '조언'],
      interpretation: (cards, reversed) => {
        return cards.slice(0, 10).map((card, i) => `${['현재', '도전', '목표', '근처', '태도', '외부', '희망', '의견', '결과', '조언'][i]}: ${card.name} (${reversed[i] ? '역방향' : '정방향'})`).join('\n');
      },
    },
    health: {
      name: '3카드 스프레드 (신체-정신-영혼)',
      positions: ['신체 상태', '정신 상태', '영혼 상태'],
      interpretation: (cards, reversed) => {
        return `신체: ${cards[0].name} - ${reversed[0] ? cards[0].reversed : cards[0].meaning}\n정신: ${cards[1].name} - ${reversed[1] ? cards[1].reversed : cards[1].meaning}\n영혼: ${cards[2].name} - ${reversed[2] ? cards[2].reversed : cards[2].meaning}`;
      },
    },
    career: {
      name: '5카드 스프레드 (현재-도전-조언-결과-시간)',
      positions: ['현재 상황', '도전 요소', '조언', '예상 결과', '시간 프레임'],
      interpretation: (cards, reversed) => {
        return cards.slice(0, 5).map((card, i) => `${['현재', '도전', '조언', '결과', '시간'][i]}: ${card.name} (${reversed[i] ? '역방향' : '정방향'})`).join('\n');
      },
    },
    general: {
      name: '3카드 스프레드 (과거-현재-미래)',
      positions: ['과거의 영향', '현재 상황', '미래 전망'],
      interpretation: (cards, reversed) => {
        return `과거: ${cards[0].name} - ${reversed[0] ? cards[0].reversed : cards[0].meaning}\n현재: ${cards[1].name} - ${reversed[1] ? cards[1].reversed : cards[1].meaning}\n미래: ${cards[2].name} - ${reversed[2] ? cards[2].reversed : cards[2].meaning}`;
      },
    },
  };

  return spreads[questionType];
}

// 카드 섞기 및 뽑기
export function drawCards(count: number, deck: TarotCard[] = fullTarotDeck): { cards: TarotCard[]; reversed: boolean[] } {
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  const cards = shuffled.slice(0, count);
  const reversed = cards.map(() => Math.random() > 0.5);

  return { cards, reversed };
}
