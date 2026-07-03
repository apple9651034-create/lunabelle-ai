/* AI 루나 — usePreventDuplicateSubmit.ts
 * 중복 요청 방지 훅
 * 사용자의 중복 클릭으로 인한 불필요한 API 호출 방지
 */
import { useState, useCallback } from 'react';

interface UsePreventDuplicateSubmitOptions {
  cooldownMs?: number; // 밀리초 단위 쿨다운 시간 (기본값: 1000ms)
}

export function usePreventDuplicateSubmit(options: UsePreventDuplicateSubmitOptions = {}) {
  const { cooldownMs = 1000 } = options;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const canSubmit = useCallback((): boolean => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    return timeSinceLastSubmit >= cooldownMs;
  }, [lastSubmitTime, cooldownMs]);

  const handleSubmit = useCallback(
    async <T,>(submitFn: () => Promise<T>): Promise<T | null> => {
      // 이미 요청 중이거나 쿨다운 중이면 무시
      if (isSubmitting || !canSubmit()) {
        return null;
      }

      setIsSubmitting(true);
      setLastSubmitTime(Date.now());

      try {
        const result = await submitFn();
        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, canSubmit]
  );

  return {
    isSubmitting,
    canSubmit,
    handleSubmit,
  };
}
