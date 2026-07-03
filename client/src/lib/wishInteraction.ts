/* AI 루나 — wishInteraction.ts
 * 소원 게시판 상호작용 기능 (공감/응원)
 * 다른 사용자의 소원에 공감 및 응원 메시지 추가
 */

export interface WishInteraction {
  id: string;
  wishId: number;
  type: 'empathy' | 'encouragement'; // 공감 또는 응원
  message?: string;
  timestamp: string;
  userId?: string; // 익명 사용자 ID
}

export interface WishWithInteractions {
  wishId: number;
  empathyCount: number;
  encouragementCount: number;
  interactions: WishInteraction[];
  userEmpathized?: boolean;
  userEncouraged?: boolean;
}

const STORAGE_KEY = 'ai-luna-wish-interactions';

export function loadInteractions(): Map<number, WishWithInteractions> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Map();
    
    const data = JSON.parse(stored);
    return new Map(Object.entries(data).map(([key, value]) => [
      parseInt(key),
      value as WishWithInteractions
    ]));
  } catch (e) {
    console.error('상호작용 로드 실패:', e);
    return new Map();
  }
}

export function saveInteractions(interactions: Map<number, WishWithInteractions>) {
  try {
    const data = Object.fromEntries(interactions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('상호작용 저장 실패:', e);
  }
}

export function addEmpathy(wishId: number): WishWithInteractions {
  const interactions = loadInteractions();
  let wishInteraction = interactions.get(wishId) || {
    wishId,
    empathyCount: 0,
    encouragementCount: 0,
    interactions: [],
    userEmpathized: false,
    userEncouraged: false,
  };

  // 이미 공감했으면 제거, 아니면 추가
  if (wishInteraction.userEmpathized) {
    wishInteraction.empathyCount = Math.max(0, wishInteraction.empathyCount - 1);
    wishInteraction.interactions = wishInteraction.interactions.filter(
      (i) => !(i.type === 'empathy' && i.userId === getUserId())
    );
    wishInteraction.userEmpathized = false;
  } else {
    wishInteraction.empathyCount += 1;
    wishInteraction.interactions.push({
      id: `${wishId}-empathy-${Date.now()}`,
      wishId,
      type: 'empathy',
      timestamp: new Date().toISOString(),
      userId: getUserId(),
    });
    wishInteraction.userEmpathized = true;
  }

  interactions.set(wishId, wishInteraction);
  saveInteractions(interactions);
  return wishInteraction;
}

export function addEncouragement(wishId: number, message?: string): WishWithInteractions {
  const interactions = loadInteractions();
  let wishInteraction = interactions.get(wishId) || {
    wishId,
    empathyCount: 0,
    encouragementCount: 0,
    interactions: [],
    userEmpathized: false,
    userEncouraged: false,
  };

  // 이미 응원했으면 제거, 아니면 추가
  if (wishInteraction.userEncouraged) {
    wishInteraction.encouragementCount = Math.max(0, wishInteraction.encouragementCount - 1);
    wishInteraction.interactions = wishInteraction.interactions.filter(
      (i) => !(i.type === 'encouragement' && i.userId === getUserId())
    );
    wishInteraction.userEncouraged = false;
  } else {
    wishInteraction.encouragementCount += 1;
    wishInteraction.interactions.push({
      id: `${wishId}-encouragement-${Date.now()}`,
      wishId,
      type: 'encouragement',
      message,
      timestamp: new Date().toISOString(),
      userId: getUserId(),
    });
    wishInteraction.userEncouraged = true;
  }

  interactions.set(wishId, wishInteraction);
  saveInteractions(interactions);
  return wishInteraction;
}

export function getWishInteractions(wishId: number): WishWithInteractions {
  const interactions = loadInteractions();
  return interactions.get(wishId) || {
    wishId,
    empathyCount: 0,
    encouragementCount: 0,
    interactions: [],
    userEmpathized: false,
    userEncouraged: false,
  };
}

export function getRecentEncouragements(wishId: number, limit: number = 3): WishInteraction[] {
  const wishInteraction = getWishInteractions(wishId);
  return wishInteraction.interactions
    .filter((i) => i.type === 'encouragement' && i.message)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

function getUserId(): string {
  let userId = localStorage.getItem('ai-luna-user-id');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('ai-luna-user-id', userId);
  }
  return userId;
}

export const ENCOURAGEMENT_TEMPLATES = [
  '화이팅! 당신의 꿈이 이루어질 거예요 💫',
  '응원합니다! 좋은 일만 가득하길 🙏',
  '당신은 충분히 잘하고 있어요 ✨',
  '함께 응원하고 있습니다 💪',
  '모든 것이 잘될 거라고 믿어요 🌟',
  '당신의 노력이 반드시 빛날 거예요 ⭐',
  '행운이 함께하길 바랍니다 🍀',
  '최고의 결과를 기원합니다 🎯',
];
