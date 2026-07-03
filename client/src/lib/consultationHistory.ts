/* 상담내역 관리 유틸리티
 * 로컬스토리지를 통한 사주/육효/타로 상담 결과 저장 및 열람
 */

export interface ConsultationRecord {
  id: string;
  type: 'saju' | 'yuk' | 'tarot';
  date: string;
  question: string;
  result: any;
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const STORAGE_KEY = 'ai-luna-consultations';
const MAX_RECORDS = 50;

export function saveConsultation(record: Omit<ConsultationRecord, 'id' | 'date'>): string {
  const consultations = getAllConsultations();
  
  const newRecord: ConsultationRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
  };

  consultations.unshift(newRecord);

  // 최대 50개까지만 유지
  if (consultations.length > MAX_RECORDS) {
    consultations.splice(MAX_RECORDS);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
  return newRecord.id;
}

export function getAllConsultations(): ConsultationRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getConsultationById(id: string): ConsultationRecord | null {
  const consultations = getAllConsultations();
  return consultations.find(c => c.id === id) || null;
}

export function getConsultationsByType(type: 'saju' | 'yuk' | 'tarot'): ConsultationRecord[] {
  const consultations = getAllConsultations();
  return consultations.filter(c => c.type === type);
}

export function deleteConsultation(id: string): boolean {
  const consultations = getAllConsultations();
  const filtered = consultations.filter(c => c.id !== id);
  
  if (filtered.length === consultations.length) {
    return false; // 찾지 못함
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function updateConsultationMessages(id: string, messages: Array<{ role: 'user' | 'assistant'; content: string }>): boolean {
  const consultations = getAllConsultations();
  const record = consultations.find(c => c.id === id);
  
  if (!record) return false;

  record.messages = messages;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
  return true;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
