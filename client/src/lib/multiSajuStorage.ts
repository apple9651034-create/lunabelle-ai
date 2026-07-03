/* 다중 사주 저장 및 관리
 * 내 사주 외 다른 사람 사주도 추가 저장 가능
 */

export interface StoredSaju {
  id: string;
  name: string;
  relationship?: string; // '본인', '배우자', '자녀', '친구' 등
  birthDate: {
    solar: string;
    lunar: string;
    isLeapMonth: boolean;
  };
  birthTime: {
    hour: string;
    minute: string;
    isUnknown: boolean;
  };
  gender: string;
  fourPillars: any;
  personality: string;
  luck: string;
  savedAt: number;
}

const STORAGE_KEY = 'ai_luna_saju_list';
const PRIMARY_KEY = 'ai_luna_primary_saju';

export function saveSaju(saju: Omit<StoredSaju, 'id' | 'savedAt'>): StoredSaju {
  const storedSaju: StoredSaju = {
    ...saju,
    id: `saju_${Date.now()}`,
    savedAt: Date.now(),
  };

  const existing = getAllSaju();
  existing.push(storedSaju);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  return storedSaju;
}

export function getAllSaju(): StoredSaju[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getSajuById(id: string): StoredSaju | null {
  const all = getAllSaju();
  return all.find(s => s.id === id) || null;
}

export function updateSaju(id: string, updates: Partial<Omit<StoredSaju, 'id' | 'savedAt'>>): StoredSaju | null {
  const all = getAllSaju();
  const index = all.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  const updated = { ...all[index], ...updates };
  all[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  
  return updated;
}

export function deleteSaju(id: string): boolean {
  const all = getAllSaju();
  const filtered = all.filter(s => s.id !== id);
  
  if (filtered.length === all.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  
  // 삭제된 사주가 주사주였으면 주사주 초기화
  const primaryId = getPrimarySaju();
  if (primaryId === id) {
    clearPrimarySaju();
  }
  
  return true;
}

export function setPrimarySaju(id: string): boolean {
  const saju = getSajuById(id);
  if (!saju) return false;
  
  localStorage.setItem(PRIMARY_KEY, id);
  return true;
}

export function getPrimarySaju(): string | null {
  return localStorage.getItem(PRIMARY_KEY);
}

export function getPrimarySajuData(): StoredSaju | null {
  const id = getPrimarySaju();
  return id ? getSajuById(id) : null;
}

export function clearPrimarySaju(): void {
  localStorage.removeItem(PRIMARY_KEY);
}

export function getRelationshipLabel(relationship?: string): string {
  const labels: Record<string, string> = {
    'self': '본인',
    'spouse': '배우자',
    'child': '자녀',
    'parent': '부모',
    'sibling': '형제자매',
    'friend': '친구',
    'colleague': '동료',
    'other': '기타',
  };
  
  return labels[relationship || 'other'] || relationship || '기타';
}

export function formatSajuDisplay(saju: StoredSaju): string {
  const relationship = getRelationshipLabel(saju.relationship);
  return `${saju.name} (${relationship}) - ${saju.birthDate.solar}`;
}
