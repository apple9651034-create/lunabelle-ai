import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TalismanDiscountTimerProps {
  purchaseTime: string; // ISO 형식의 구매 시간
  discountPercentage?: number; // 할인율 (기본값: 10)
}

export const TalismanDiscountTimer: React.FC<TalismanDiscountTimerProps> = ({
  purchaseTime,
  discountPercentage = 10,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const purchaseDate = new Date(purchaseTime).getTime();
      const expiryTime = purchaseDate + 24 * 60 * 60 * 1000; // 24시간 후
      const difference = expiryTime - now;

      if (difference <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
      } else {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isExpired: false,
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [purchaseTime]);

  if (timeLeft.isExpired) {
    return null; // 할인 기간이 끝나면 표시하지 않음
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
      style={{
        background: `oklch(0.80 0.15 40 / 15%)`,
        color: 'oklch(0.80 0.15 40)',
        border: '1px solid',
        borderColor: 'oklch(0.80 0.15 40 / 30%)',
      }}
    >
      <Clock size={16} />
      <span>
        {discountPercentage}% 할인 · {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default TalismanDiscountTimer;
