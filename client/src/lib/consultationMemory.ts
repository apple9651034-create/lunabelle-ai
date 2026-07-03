/**
 * 상담 메모리 시스템
 * 사용자의 상담 내용을 저장하고 관리하여 이어서 상담할 수 있도록 함
 */

export interface ConsultationMemory {
  id: string;
  type: 'saju' | 'tarot' | 'yuk'; // 상담 유형
  date: string; // ISO 8601 형식
  mainConcern: string; // 주요 고민
  details: string; // 상담 세부 내용
  response: string; // AI 응답 (상담 결과)
  keyPoints: string[]; // 핵심 포인트
  status: string; // 현재 상황 (진행 중, 해결됨, 진행 중 등)
  followUp?: string; // 후속 조치 사항
}

export interface UserProfile {
  userId: string;
  consultations: ConsultationMemory[];
  lastConsultationDate: string;
  mainConcerns: string[]; // 반복되는 주요 고민들
  progressNotes: string; // 전체 진행 상황 메모
}

/**
 * 상담 메모리 저장
 */
export const saveConsultationMemory = (consultation: ConsultationMemory) => {
  try {
    const existingData = localStorage.getItem('consultationMemories');
    const memories: ConsultationMemory[] = existingData ? JSON.parse(existingData) : [];
    memories.push(consultation);
    localStorage.setItem('consultationMemories', JSON.stringify(memories));
    return true;
  } catch (error) {
    console.error('Failed to save consultation memory:', error);
    return false;
  }
};

/**
 * 모든 상담 메모리 조회
 */
export const getConsultationMemories = (): ConsultationMemory[] => {
  try {
    const data = localStorage.getItem('consultationMemories');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load consultation memories:', error);
    return [];
  }
};

/**
 * 최근 상담 조회
 */
export const getLatestConsultation = (): ConsultationMemory | null => {
  const memories = getConsultationMemories();
  return memories.length > 0 ? memories[memories.length - 1] : null;
};

/**
 * 특정 타입의 최근 상담 조회
 */
export const getLatestConsultationByType = (type: 'saju' | 'tarot' | 'yuk'): ConsultationMemory | null => {
  const memories = getConsultationMemories();
  const filtered = memories.filter((m) => m.type === type);
  return filtered.length > 0 ? filtered[filtered.length - 1] : null;
};

/**
 * 상담 요약 생성 (AI 프롬프트용)
 */
export const generateConsultationSummary = (): string => {
  const memories = getConsultationMemories();
  if (memories.length === 0) return '';

  const recentConsultations = memories.slice(-5); // 최근 5개 상담
  let summary = '### 이전 상담 내역\n\n';

  recentConsultations.forEach((consultation, index) => {
    const date = new Date(consultation.date).toLocaleDateString('ko-KR');
    summary += `**${index + 1}. ${date} - ${consultation.type.toUpperCase()} 상담**\n`;
    summary += `주요 고민: ${consultation.mainConcern}\n`;
    summary += `상담 내용: ${consultation.details.substring(0, 100)}...\n`;
    summary += `현재 상황: ${consultation.status}\n\n`;
  });

  return summary;
};

/**
 * 상담 컨텍스트 생성 (AI 프롬프트에 추가할 컨텍스트)
 */
export const generateConsultationContext = (type: 'saju' | 'tarot' | 'yuk'): string => {
  const latest = getLatestConsultationByType(type);
  if (!latest) return '';

  const daysSinceLastConsultation = Math.floor(
    (Date.now() - new Date(latest.date).getTime()) / (1000 * 60 * 60 * 24)
  );

  let context = `사용자의 이전 ${type} 상담 정보:\n`;
  context += `- 상담 날짜: ${daysSinceLastConsultation}일 전\n`;
  context += `- 주요 고민: ${latest.mainConcern}\n`;
  context += `- 당시 상황: ${latest.details}\n`;
  context += `- 현재 진행 상황: ${latest.status}\n`;

  if (latest.followUp) {
    context += `- 후속 조치: ${latest.followUp}\n`;
  }

  context += '\n이전 상담 내용을 바탕으로 사용자를 인식하고, 진행 상황을 물어보며 이어서 상담해주세요.\n';

  return context;
};

/**
 * 상담 메모리 삭제
 */
export const deleteConsultationMemory = (id: string) => {
  try {
    const existingData = localStorage.getItem('consultationMemories');
    if (!existingData) return false;

    const memories: ConsultationMemory[] = JSON.parse(existingData);
    const filtered = memories.filter((m) => m.id !== id);
    localStorage.setItem('consultationMemories', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete consultation memory:', error);
    return false;
  }
};

/**
 * 상담 메모리 업데이트
 */
export const updateConsultationMemory = (id: string, updates: Partial<ConsultationMemory>) => {
  try {
    const existingData = localStorage.getItem('consultationMemories');
    if (!existingData) return false;

    const memories: ConsultationMemory[] = JSON.parse(existingData);
    const index = memories.findIndex((m) => m.id === id);
    if (index === -1) return false;

    memories[index] = { ...memories[index], ...updates };
    localStorage.setItem('consultationMemories', JSON.stringify(memories));
    return true;
  } catch (error) {
    console.error('Failed to update consultation memory:', error);
    return false;
  }
};

/**
 * 주요 고민 추출 (AI가 상담 내용에서 추출)
 */
export const extractMainConcern = (consultationText: string): string => {
  // 간단한 키워드 기반 추출 (실제로는 AI로 처리)
  const keywords = ['문제', '고민', '걱정', '어려움', '힘들', '문제가', '걱정이', '고민이'];
  const sentences = consultationText.split('。|!|?|\.').filter((s) => s.trim());

  for (const sentence of sentences) {
    for (const keyword of keywords) {
      if (sentence.includes(keyword)) {
        return sentence.trim().substring(0, 100);
      }
    }
  }

  return sentences[0]?.trim().substring(0, 100) || '';
};
