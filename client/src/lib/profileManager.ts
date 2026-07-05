/**
 * 프로필 관리 라이브러리
 * 여러 사주 프로필을 저장하고 관리
 */

export interface SajuProfile {
  id: string;
  name: string; // 프로필 이름 (예: "본인", "아내", "딸")
  year: string;
  month: string;
  day: string;
  hour: string;
  gender: string;
  fourPillars?: {
    yearString: string;
    monthString: string;
    dayString: string;
    hourString: string;
  };
  personality?: string;
  luck?: string;
  createdAt: number;
  isActive: boolean; // 현재 활성 프로필
}

const PROFILES_STORAGE_KEY = 'userSajuProfiles';
const ACTIVE_PROFILE_KEY = 'activeProfileId';

/**
 * 모든 프로필 가져오기
 */
export function getAllProfiles(): SajuProfile[] {
  try {
    const data = localStorage.getItem(PROFILES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 활성 프로필 가져오기
 */
export function getActiveProfile(): SajuProfile | null {
  try {
    const profiles = getAllProfiles();
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    
    if (activeId) {
      return profiles.find(p => p.id === activeId) || null;
    }
    
    // 활성 프로필이 없으면 첫 번째 프로필 반환
    const active = profiles.find(p => p.isActive);
    return active || profiles[0] || null;
  } catch {
    return null;
  }
}

/**
 * 프로필 추가
 */
export function addProfile(profile: Omit<SajuProfile, 'id' | 'createdAt' | 'isActive'>): SajuProfile {
  const profiles = getAllProfiles();
  const newProfile: SajuProfile = {
    ...profile,
    id: `profile_${Date.now()}`,
    createdAt: Date.now(),
    isActive: profiles.length === 0, // 첫 프로필이면 활성화
  };
  
  profiles.push(newProfile);
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  
  if (newProfile.isActive) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, newProfile.id);
  }
  
  return newProfile;
}

/**
 * 프로필 활성화 (setActiveProfile 별칭)
 */
export function setActiveProfile(profileId: string): boolean {
  return activateProfile(profileId);
}

/**
 * 프로필 활성화
 */
export function activateProfile(profileId: string): boolean {
  const profiles = getAllProfiles();
  const profileIndex = profiles.findIndex(p => p.id === profileId);
  
  if (profileIndex === -1) return false;
  
  // 모든 프로필의 isActive를 false로 설정
  profiles.forEach(p => p.isActive = false);
  
  // 선택한 프로필을 활성화
  profiles[profileIndex].isActive = true;
  
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
  
  return true;
}

/**
 * 프로필 삭제
 */
export function deleteProfile(profileId: string): boolean {
  const profiles = getAllProfiles();
  const filteredProfiles = profiles.filter(p => p.id !== profileId);
  
  if (filteredProfiles.length === profiles.length) return false; // 프로필을 찾지 못함
  
  // 삭제된 프로필이 활성 프로필이었다면 첫 번째 프로필 활성화
  if (profiles.find(p => p.id === profileId)?.isActive && filteredProfiles.length > 0) {
    filteredProfiles[0].isActive = true;
    localStorage.setItem(ACTIVE_PROFILE_KEY, filteredProfiles[0].id);
  }
  
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(filteredProfiles));
  
  return true;
}

/**
 * 프로필 업데이트
 */
export function updateProfile(profileId: string, updates: Partial<SajuProfile>): SajuProfile | null {
  const profiles = getAllProfiles();
  const profileIndex = profiles.findIndex(p => p.id === profileId);
  
  if (profileIndex === -1) return null;
  
  profiles[profileIndex] = { ...profiles[profileIndex], ...updates, id: profileId };
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  
  return profiles[profileIndex];
}

/**
 * 기존 localStorage 프로필을 새 시스템으로 마이그레이션
 */
export function migrateOldProfile(): void {
  try {
    const oldProfile = localStorage.getItem('userSajuProfile');
    if (oldProfile && !localStorage.getItem(PROFILES_STORAGE_KEY)) {
      const parsed = JSON.parse(oldProfile);
      addProfile({
        name: '본인',
        year: parsed.year,
        month: parsed.month,
        day: parsed.day,
        hour: parsed.hour,
        gender: parsed.gender,
        fourPillars: parsed.fourPillars,
        personality: parsed.personality,
        luck: parsed.luck,
      });
    }
  } catch {
    // 마이그레이션 실패 무시
  }
}

// 프로필 업데이트 함수
export function updateProfile(id: string, updates: Partial<Profile>): void {
  const profiles = getAllProfiles();
  const updatedProfiles = profiles.map(p => 
    p.id === id ? { ...p, ...updates } : p
  );
  localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));
}

// 프로필 삭제 함수
export function deleteProfile(id: string): void {
  const profiles = getAllProfiles();
  const filteredProfiles = profiles.filter(p => p.id !== id);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(filteredProfiles));
}

// 모든 프로필 가져오기 함수
export function getAllProfiles(): Profile[] {
  try {
    const profiles = localStorage.getItem(PROFILES_KEY);
    return profiles ? JSON.parse(profiles) : [];
  } catch {
    return [];
  }
}
