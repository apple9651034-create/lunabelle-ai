/* AI 루나 — DailyFortuneWidget.tsx
 * Design: Mystic Dark Luxury
 * 로컬스토리지의 사주 정보를 기반으로 맞춤형 운세 요약 제공
 * 매일 다른 운세 생성 + 사주 저장 기능
 */
import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, Save } from 'lucide-react';
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
  const [hasSavedSaju, setHasSavedSaju] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    // 로컬스토리지에서 사주 정보 로드
    const savedSaju = localStorage.getItem('mySaju');
    const consultations = localStorage.getItem('consultations');
    
    if (savedSaju) {
      // 저장된 사주가 있으면 사용
      setHasSavedSaju(true);
      try {
        const sajuData = JSON.parse(savedSaju);
        // 매일 다른 운세 생성 (날짜 기반)
        const today = new Date().toDateString();
        const lastFortuneDate = localStorage.getItem('lastFortuneDate');
        
        if (lastFortuneDate !== today) {
          // 새로운 날짜이므로 새로운 운세 생성
          const fortuneMessages = generateFortune(sajuData);
          setFortune(fortuneMessages);
          localStorage.setItem('lastFortuneDate', today);
          localStorage.setItem('todayFortune', fortuneMessages);
        } else {
          // 오늘의 운세 캐시에서 로드
          const cachedFortune = localStorage.getItem('todayFortune');
          setFortune(cachedFortune || generateFortune(sajuData));
        }
        
        // 행운 정보 로드
        if (sajuData.result?.fourPillars?.yearString) {
          const stemChar = sajuData.result.fourPillars.yearString.charAt(0);
          const details = getFortuneDetails(stemChar);
          setFortuneDetails(details);
        }
      } catch (e) {
        console.error('사주 정보 로드 실패:', e);
        setFortune(null);
      }
    } else if (consultations) {
      // 최근 사주 기록이 있으면 사용
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
          
          // 저장하지 않은 사주면 저장 버튼 표시
          setShowSaveButton(true);
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
      '오늘은 새로운 시작에 좋은 기운이 흐르는 날입니다. 용감하게 한 발을 내딛어 보세요. 우주는 당신의 노력을 응원하고 있습니다.',
      '긍정적인 에너지가 가득한 날입니다. 주변 사람들과 좋은 관계를 나누어 보세요. 당신의 따뜻한 에너지가 모두에게 전해질 것입니다.',
      '이 시간대에는 중요한 결정을 내리기에 좋은 타이밍입니다. 직관을 믿고 신중함을 잃지 마세요.',
      '창의력과 직관력이 높아지는 시간대입니다. 새로운 아이디어를 시도해보세요. 오늘의 영감이 내일의 성공이 될 수 있습니다.',
      '평온함과 안정이 찾아오는 날입니다. 마음을 정리하고 휴식을 취해보세요. 이 고요함 속에서 당신의 진정한 목소리를 들을 수 있습니다.',
      '운이 좋아지는 신호가 보입니다. 긍정적인 마음으로 하루를 시작하되, 작은 기회도 놓치지 마세요.',
      '오늘은 인간관계에 좋은 날입니다. 소중한 사람들과 시간을 보내세요. 당신의 진심이 가장 큰 선물입니다.',
      '재운이 좋은 날입니다. 새로운 기회에 주목하되, 신중한 판단을 잊지 마세요. 현명한 선택이 미래를 만듭니다.',
      '당신의 사주는 오늘 특별한 기운을 받고 있습니다. 이 순간을 소중히 여기고, 당신의 꿈을 향해 나아가세요.',
      '오늘은 성찰과 깨달음의 날입니다. 지나간 일들을 돌아보며 배운 점을 정리하세요. 이것이 당신을 더욱 성숙하게 만들 것입니다.',
    ];
    return fortuneMessages[date % fortuneMessages.length];
  };

  const generateFortune = (sajuRecord: any): string => {
    const today = new Date();
    const date = today.getDate();
    const dayOfWeek = today.getDay();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const personality = sajuRecord.result?.personality || '당신의 운세';
    const luck = sajuRecord.result?.luck || '긍정적인 에너지';

    // 사주 정보 기반 깊이 있는 운세 생성
    const fortuneMessages = [
      `오늘은 ${personality}의 기질이 빛나는 날입니다. 당신의 본래 강점을 믿고 새로운 도전에 나서세요. 우주의 에너지가 당신을 응원합니다.`,
      `${luck}를 활용하여 중요한 결정을 내리기에 좋은 타이밍입니다. 직관을 따르되, 신중함도 잃지 마세요. 오늘의 선택이 내일의 운을 만듭니다.`,
      `이 ${dayNames[dayOfWeek]}요일은 주변 사람들과의 관계가 더욱 돈독해질 수 있는 날입니다. 진심 어린 대화와 공감이 당신을 더욱 빛나게 할 것입니다.`,
      `창의력과 직관력이 높아지는 시간대입니다. 새로운 아이디어가 떠오르면 주저하지 말고 기록해두세요. 오늘의 영감이 내일의 성공이 될 수 있습니다.`,
      `평온함과 안정이 찾아오는 날입니다. 마음을 정리하고 중요한 일에 집중해보세요. 이 고요함 속에서 당신의 진정한 목소리를 들을 수 있을 것입니다.`,
      `운이 좋아지는 신호가 보입니다. 긍정적인 마음으로 하루를 시작하되, 작은 기회도 놓치지 마세요. 행운은 준비된 자에게 찾아옵니다.`,
      `오늘은 인간관계에 좋은 날입니다. 소중한 사람들과 시간을 보내세요. 당신의 따뜻한 말 한마디가 누군가의 하루를 바꿀 수 있습니다.`,
      `재운이 좋은 날입니다. 새로운 기회에 주목하되, 신중한 판단을 잊지 마세요. 이익과 손실의 균형을 맞추는 것이 현명한 선택입니다.`,
      `당신의 사주는 오늘 특별한 기운을 받고 있습니다. 이 순간을 소중히 여기고, 당신의 꿈을 향해 한 발 더 나아가세요.`,
      `오늘은 성찰과 깨달음의 날입니다. 지나간 일들을 돌아보며 배운 점을 정리하세요. 이것이 당신을 더욱 성숙하게 만들 것입니다.`,
    ];

    return fortuneMessages[date % fortuneMessages.length];
  };

  const handleSaveMyFortune = () => {
    // 사주를 "내 사주"로 저장
    const consultations = localStorage.getItem('consultations');
    if (consultations) {
      try {
        const records = JSON.parse(consultations);
        const sajuRecords = records.filter((r: any) => r.type === 'saju');
        if (sajuRecords.length > 0) {
          const latestSaju = sajuRecords[sajuRecords.length - 1];
          localStorage.setItem('mySaju', JSON.stringify(latestSaju));
          localStorage.removeItem('lastFortuneDate'); // 강제로 새로운 운세 생성
          setHasSavedSaju(true);
          setShowSaveButton(false);
          // 페이지 새로고침하여 업데이트
          setTimeout(() => window.location.reload(), 500);
        }
      } catch (e) {
        console.error('사주 저장 실패:', e);
      }
    }
  };

  if (loading) {
    return null;
  }

  // 사주 정보가 없으면 기본 운세 표시
  const displayFortune = fortune || generateDefaultFortune();

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, oklch(0.50 0.28 290 / 15%), oklch(0.78 0.15 85 / 10%))',
          border: '1px solid oklch(0.78 0.15 85 / 30%)',
          boxShadow: '0 0 20px oklch(0.55 0.25 290 / 10%)',
        }}
        onClick={() => setLocation('/saju')}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={24} style={{ color: 'oklch(0.78 0.15 85)' }} />
            <h3 className="text-lg font-semibold" style={{ color: 'oklch(0.78 0.15 85)', fontFamily: "'Noto Serif KR', serif" }}>
              오늘의 운세
            </h3>
            {hasSavedSaju && <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'oklch(0.50 0.28 290)', color: 'oklch(1 0 0)' }}>내 사주</span>}
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

        <div className="flex gap-2 text-xs mt-4" style={{ color: 'oklch(0.60 0.02 290)' }}>
          <span>🌙 {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</span>
          <span>•</span>
          <span>자세히 보기 →</span>
        </div>
      </div>

      {/* Save Button */}
      {showSaveButton && !hasSavedSaju && (
        <button
          onClick={handleSaveMyFortune}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
            color: 'oklch(0.97 0.005 90)',
            boxShadow: '0 4px 15px oklch(0.55 0.25 290 / 30%)',
          }}
        >
          <Save size={16} />
          이 사주를 내 사주로 저장하기
        </button>
      )}
    </div>
  );
}
