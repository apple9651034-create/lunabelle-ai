/**
 * 사용자 사주 프로필 관리
 * 프로필 시스템과 통합
 */
import { getActiveProfile, addProfile, SajuProfile } from './profileManager';

const LEGACY_STORAGE_KEY = 'userSajuProfile';

export interface UserSajuProfile {
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
}

/**
 * 사용자 사주 프로필 가져오기
 * 활성 프로필이 있으면 그것을 사용, 없으면 레거시 저장소에서 가져오기
 */
export function getUserSajuProfile(): UserSajuProfile | null {
  try {
    // 1. 활성 프로필 확인
    const activeProfile = getActiveProfile();
    if (activeProfile) {
      return {
        year: activeProfile.year,
        month: activeProfile.month,
        day: activeProfile.day,
        hour: activeProfile.hour,
        gender: activeProfile.gender,
        fourPillars: activeProfile.fourPillars,
        personality: activeProfile.personality,
        luck: activeProfile.luck,
      };
    }

    // 2. 레거시 저장소에서 가져오기
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      
      // 레거시 데이터를 새 프로필 시스템으로 마이그레이션
      if (!getActiveProfile()) {
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
      
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * 사용자 사주 프로필 저장
 * 활성 프로필과 레거시 저장소 모두에 저장
 */
export function saveUserSajuProfile(profile: UserSajuProfile): void {
  try {
    // 레거시 저장소에 저장 (호환성)
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(profile));

    // 프로필 시스템에 저장
    const activeProfile = getActiveProfile();
    if (activeProfile) {
      // 기존 활성 프로필 업데이트는 profileManager에서 처리
      // 여기서는 레거시만 업데이트
    } else {
      // 활성 프로필이 없으면 새로 추가
      addProfile({
        name: '본인',
        year: profile.year,
        month: profile.month,
        day: profile.day,
        hour: profile.hour,
        gender: profile.gender,
        fourPillars: profile.fourPillars,
        personality: profile.personality,
        luck: profile.luck,
      });
    }
  } catch {
    // 저장 실패 무시
  }
}

/**
 * 기본 사주 프로필 생성
 */
export function getDefaultSajuProfile(): UserSajuProfile {
  return {
    year: '1977',
    month: '7',
    day: '19',
    hour: '9',
    gender: 'M',
  };
}
