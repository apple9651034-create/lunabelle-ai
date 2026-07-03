/* 오늘의 운세 위젯
 * Design: Mystic Dark Luxury
 * 로컬스토리지의 사주 정보를 기반으로 맞춤형 운세 요약 제공
 */
import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { getFortuneDetails } from "@/lib/fortuneDetails";
import { useLocation } from 'wouter';

interface DailyFortuneWidgetProps {
  onViewDetails?: () => void;
}

export default function DailyFortuneWidget({ onViewDetails }: DailyFortuneWidgetProps) {
  const [fortuneDetails, setFortuneDetails] = useState<any>(null);
  const [, setLocation] = useLocation();
  const [fortune, setFortune] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬스토리지에서 사주 정보 로드
    const consultations = localStorage.getItem('consultations');
    if (consultations) {
      try {
        const records = JSON.parse(consultations);
        const sajuRecords = records.filter((r: any) => r.type === 'saju');

        if (sajuRecords.length > 0) {
          // 가장 최근 사주 정보 사용
          const latestSaju = sajuRecords[sajuRecords.length - 1];
          const fortuneMessages = generateFortune(latestSaju);
          setFortune(fortuneMessages);
          
          // 행운 정보 로드
          if (latestSaju.result?.fourPillars?.yearString) {
            const stemChar = latestSaju.result.fourPillars.yearString.charAt(0);
            const details = getFortuneDetails(stemChar);
            setFortuneDetails(details);
          }
        } else {
          setFortune(null);
        }
      } catch (e) {
        console.error('사주 정보 로드 실패:', e);
        setFortune(null);
      }
    }
    setLoading(false);
  }, []);

  const generateDefaultFortune = (): string => {
    const today = new Date();
    const date = today.getDate();
    const fortuneMessages = [
      '오늘은 새로운 시작에 좋은 기운이 흐르는 날입니다. 용감하게 한 발을 내딛어 보세요.',
      '긍정적인 에너지가 가득한 날입니다. 주변 사람들과 좋은 관계를 나누어 보세요.',
      '이 시간대에는 중요한 결정을 내리기에 좋은 타이밍입니다.',
      '창의력과 직관력이 높아지는 시간대입니다. 새로운 아이디어를 시도해보세요.',
      '평온함과 안정이 찾아오는 날입니다. 마음을 정리하고 휴식을 취해보세요.',
    ];
    return fortuneMessages[date % fortuneMessages.length];
  };

  const generateFortune = (sajuRecord: any): string => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const date = today.getDate();

    // 사주 정보 기반 운세 생성
    const fortuneMessages = [
      `오늘은 ${sajuRecord.result?.personality || '당신의 운세'}에 따라 좋은 기운이 흐르는 날입니다.`,
      `${sajuRecord.result?.luck || '긍정적인 에너지'}를 활용하여 새로운 시작을 해보세요.`,
      `이 시간대에는 중요한 결정을 내리기에 좋은 타이밍입니다.`,
      `주변 사람들과의 관계가 더욱 돈독해질 수 있는 날입니다.`,
      `창의력과 직관력이 높아지는 시간대입니다. 새로운 아이디어를 시도해보세요.`,
    ];

    return fortuneMessages[date % fortuneMessages.length];
  };

  if (loading) {
    return null;
  }

  // 사주 정보가 없으면 기본 운세 표시
  const displayFortune = fortune || generateDefaultFortune();

  return (
    <div
      className="rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: 'linear-gradient(135deg, oklch(0.50 0.28 290 / 15%), oklch(0.78 0.15 85 / 10%))',
        border: '1px solid oklch(0.78 0.15 85 / 30%)',
      }}
      onClick={() => setLocation('/saju')}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={24} style={{ color: 'oklch(0.78 0.15 85)' }} />
          <h3 className="text-lg font-semibold" style={{ color: 'oklch(0.78 0.15 85)' }}>
            오늘의 운세
          </h3>
        </div>
        <ChevronRight size={20} style={{ color: 'oklch(0.60 0.02 290)' }} />
      </div>

      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: 'oklch(0.85 0.015 90)' }}
      >
        {displayFortune}
      </p>
      {/* Lucky Details */}
      {fortuneDetails && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "oklch(0.78 0.15 85 / 20%)" }}>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Lucky Colors */}
            <div>
              <p className="font-semibold mb-1" style={{ color: "oklch(0.78 0.15 85)" }}>🎨 행운의 색</p>
              <div className="flex gap-1">
                {fortuneDetails.luckyColors.map((c: any, i: number) => (
                  <div key={i} className="w-6 h-6 rounded-full border" style={{ background: c.hex, borderColor: "oklch(0.78 0.15 85 / 30%)" }} title={c.name} />
                ))}
              </div>
            </div>
            {/* Lucky Numbers */}
            <div>
              <p className="font-semibold mb-1" style={{ color: "oklch(0.78 0.15 85)" }}>🔢 행운의 숫자</p>
              <div className="flex gap-1">
                {fortuneDetails.luckyNumbers.map((n: number, i: number) => (
                  <span key={i} className="px-2 py-1 rounded bg-purple-600 text-white text-xs">{n}</span>
                ))}
              </div>
            </div>
            {/* Lucky Items */}
            <div className="col-span-2">
              <p className="font-semibold mb-1" style={{ color: "oklch(0.78 0.15 85)" }}>✨ 행운의 아이템</p>
              <div className="flex flex-wrap gap-1">
                {fortuneDetails.luckyItems.map((item: any, i: number) => (
                  <span key={i} className="px-2 py-1 rounded text-xs" style={{ background: "oklch(0.20 0.05 270)", color: "oklch(0.85 0.015 90)" }}>{item.emoji} {item.name}</span>
                ))}
              </div>
            </div>
            {/* Lucky Direction & Time */}
            <div>
              <p className="font-semibold mb-1" style={{ color: "oklch(0.78 0.15 85)" }}>🧭 길한 방향</p>
              <p style={{ color: "oklch(0.85 0.015 90)" }}>{fortuneDetails.luckyDirection}</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: "oklch(0.78 0.15 85)" }}>🕐 길한 시간</p>
              <p style={{ color: "oklch(0.85 0.015 90)" }}>{fortuneDetails.luckyTime}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 text-xs" style={{ color: 'oklch(0.60 0.02 290)' }}>
        <span>🌙 {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</span>
        <span>•</span>
        <span>자세히 보기 →</span>
      </div>
    </div>
  );
}
