/**
 * 사용자 사주 프로필 관리
 * 1977년 7월 19일 오전 9시 16분 양력 고정
 */

import { calculateFourPillars } from 'manseryeok';

export interface UserSajuProfile {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  isLunar: boolean;
  gender: string;
  fourPillars: {
    yearString: string;
    monthString: string;
    dayString: string;
    hourString: string;
  };
  personality: string;
  luck: string;
}

// 기본 사주 프로필 - 1977년 7월 19일 오전 9시 16분 양력
export const DEFAULT_USER_SAJU: UserSajuProfile = {
  year: 1977,
  month: 7,
  day: 19,
  hour: 9,
  minute: 16,
  isLunar: false,
  gender: 'M',
  fourPillars: {
    yearString: '정사',
    monthString: '정미',
    dayString: '정축',
    hourString: '갑진',
  },
  personality: '정화일생 - 예민하고 열정적인 성격',
  luck: '2026년 병오년(丙午年) - 변화와 도약의 해',
};

export function getUserSajuProfile(): UserSajuProfile {
  const stored = localStorage.getItem('userSajuProfile');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('사주 프로필 로드 오류:', error);
    }
  }
  // 기본값 저장 및 반환
  saveUserSajuProfile(DEFAULT_USER_SAJU);
  return DEFAULT_USER_SAJU;
}

export function saveUserSajuProfile(profile: UserSajuProfile): void {
  localStorage.setItem('userSajuProfile', JSON.stringify(profile));
}

export function resetToDefaultProfile(): void {
  saveUserSajuProfile(DEFAULT_USER_SAJU);
}

export function getSajuSummary(): string {
  const profile = getUserSajuProfile();
  return `${profile.year}년 ${profile.month}월 ${profile.day}일 오전 ${profile.hour}시 ${profile.minute}분 출생 (양력)`;
}

export function getSajuMingshik(): string {
  const profile = getUserSajuProfile();
  return `${profile.fourPillars.yearString}${profile.fourPillars.monthString}${profile.fourPillars.dayString}${profile.fourPillars.hourString}`;
}

export function getSajuContext(): string {
  const profile = getUserSajuProfile();
  return `
사용자 사주 정보:
- 생년월일: ${profile.year}년 ${profile.month}월 ${profile.day}일
- 태어난 시간: 오전 ${profile.hour}시 ${profile.minute}분 (양력)
- 성별: ${profile.gender === 'M' ? '남성' : '여성'}
- 사주 명식: ${profile.fourPillars.yearString}${profile.fourPillars.monthString}${profile.fourPillars.dayString}${profile.fourPillars.hourString}
  (년주: ${profile.fourPillars.yearString}, 월주: ${profile.fourPillars.monthString}, 일주: ${profile.fourPillars.dayString}, 시주: ${profile.fourPillars.hourString})
- 성격: ${profile.personality}
- 운세: ${profile.luck}
  `;
}
