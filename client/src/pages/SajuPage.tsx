/* AI 루나 — SajuPage
 * Design: Mystic Dark Luxury
 * manseryeok 라이브러리 기반 정확한 사주 계산
 * 양력/음력 선택 + 윤달 옵션 + 이미지 저장/카카오톡 공유
 */
import React, { useState, useRef } from 'react';
import { Loader2, Download, Share2, ArrowLeft, MessageCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { calculateFourPillars, solarToLunar, lunarToSolar } from 'manseryeok';
import html2canvas from 'html2canvas';
import MysticalLoader from '@/components/MysticalLoader';
import { shareToKakao, shareToInstagram, generateSajuShareData } from '@/lib/shareResult';
import { getFortuneDetails } from '@/lib/fortuneDetails';
import { deductCharge, getCharges, isChargesEmpty } from '@/lib/chargeSystem';

declare global {
  interface Window {
    Kakao?: any;
  }
}

interface FourPillars {
  year: { heavenlyStem: string; earthlyBranch: string };
  month: { heavenlyStem: string; earthlyBranch: string };
  day: { heavenlyStem: string; earthlyBranch: string };
  hour: { heavenlyStem: string; earthlyBranch: string };
  yearElement: { stem: string; branch: string };
  monthElement: { stem: string; branch: string };
  dayElement: { stem: string; branch: string };
  hourElement: { stem: string; branch: string };
  yearYinYang: { stem: string; branch: string };
  monthYinYang: { stem: string; branch: string };
  dayYinYang: { stem: string; branch: string };
  hourYinYang: { stem: string; branch: string };
  yearString: string;
  monthString: string;
  dayString: string;
  hourString: string;
  yearHanja: string;
  monthHanja: string;
  dayHanja: string;
  hourHanja: string;
  tenGods?: any;
  voidBranches: string[];
}

interface SajuResult {
  fourPillars: FourPillars;
  personality: string;
  luck: string;
  solarDate: string;
  lunarDate: string;
  fortuneDetails?: any;
}

export default function SajuPage() {
  const [, setLocation] = useLocation();
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState('');
  const [result, setResult] = useState<SajuResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return <MysticalLoader type="saju" />;
  }

  const years = Array.from({ length: 100 }, (_, i) => String(2026 - i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const hours = ["자시(24-02)", "축시(02-04)", "인시(04-06)", "묘시(06-08)", "진시(08-10)", "사시(10-12)", "오시(12-14)", "미시(14-16)", "신시(16-18)", "유시(18-20)", "술시(20-22)", "해시(22-24)"];
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleShareKakao = () => {
    if (!result) return;
    const shareData = generateSajuShareData(result.fourPillars, result.personality);
    shareToKakao(shareData);
  };

  const handleShareInstagram = () => {
    if (!result) return;
    const shareData = generateSajuShareData(result.fourPillars, result.personality);
    shareToInstagram(shareData);
  };

  const handleSaveImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `사주분석_${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장에 실패했습니다.');
    }
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) {
      alert('카카오톡 공유 기능을 사용하려면 카카오 SDK가 필요합니다.');
      return;
    }
    try {
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '🔮 AI 루나 사주 분석 결과',
          description: `${result?.solarDate}\n사주: ${result?.fourPillars.yearString} ${result?.fourPillars.monthString} ${result?.fourPillars.dayString}`,
          imageUrl: 'https://via.placeholder.com/200',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '사주 분석 보기',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      alert('카카오톡 공유에 실패했습니다.');
    }
  };

  const handleAnalyzeSaju = () => {
    if (!birthYear || !birthMonth || !birthDay || !gender) {
      alert('생년월일과 성별을 모두 입력해주세요.');
      return;
    }
    if (!unknownTime && (!birthHour || birthMinute === '')) {
      alert('태어난 시간을 선택하거나 "시간 모름"을 체크해주세요.');
      return;
    }

    // 충전별 확인
    if (isChargesEmpty()) {
      alert('충전별이 부족합니다. 충전해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      let solarYear = parseInt(birthYear);
      let solarMonth = parseInt(birthMonth);
      let solarDay = parseInt(birthDay);
      let lunarYear = solarYear;
      let lunarMonth = solarMonth;
      let lunarDay = solarDay;
      let solarDateStr = '';
      let lunarDateStr = '';

      if (calendarType === 'lunar') {
        const solarConverted = lunarToSolar(solarYear, solarMonth, solarDay, isLeapMonth);
        solarYear = solarConverted.year;
        solarMonth = solarConverted.month;
        solarDay = solarConverted.day;
        lunarDateStr = `음력 ${lunarYear}년 ${isLeapMonth ? '윤' : ''}${lunarMonth}월 ${lunarDay}일`;
        solarDateStr = `양력 ${solarYear}년 ${solarMonth}월 ${solarDay}일`;
      } else {
        const lunarConverted = solarToLunar(solarYear, solarMonth, solarDay);
        lunarYear = lunarConverted.year;
        lunarMonth = lunarConverted.month;
        lunarDay = lunarConverted.day;
        solarDateStr = `양력 ${solarYear}년 ${solarMonth}월 ${solarDay}일`;
        lunarDateStr = `음력 ${lunarYear}년 ${lunarMonth}월 ${lunarDay}일`;
      }

      // 시간 인덱스(0-11)를 실제 시간값(0-23)으로 변환
      // 자시(24-02)=0 → 0시, 축시(02-04)=1 → 2시, 인시(04-06)=2 → 4시, ..., 해시(22-24)=11 → 22시
      let hourValue = 0;
      if (!unknownTime) {
        const hourIndex = parseInt(birthHour);
        if (hourIndex === 0) hourValue = 0; // 자시: 자정
        else hourValue = hourIndex * 2; // 나머지: 2시간씩
      } else {
        hourValue = 12; // 시간 모름: 정오
      }

      const fourPillars = calculateFourPillars({
        year: solarYear,
        month: solarMonth,
        day: solarDay,
        hour: hourValue,
        minute: unknownTime ? 0 : parseInt(birthMinute),
      });

      const dayElement = fourPillars.dayElement.stem;
      const fortuneDetails = getFortuneDetails(dayElement);
      
      const personalities: Record<string, string> = {
        '갑': '갑목(甲木)은 숲의 큰 나무로, 창의적이고 진취적인 성향을 가지고 있습니다. 새로운 것을 좋아하고 리더십이 강하며, 성장과 발전을 추구합니다. 고집이 있을 수 있으니 유연성을 기르세요.',
        '을': '을목(乙木)은 풀과 덩굴로, 부드럽고 섬세한 감성을 지녔습니다. 예술적 감각이 뛰어나고 감정이 풍부하며, 타인의 감정을 잘 이해합니다. 자신감을 키우는 것이 중요합니다.',
        '병': '병화(丙火)는 태양의 불로, 열정적이고 활발한 성격입니다. 사교성이 뛰어나고 표현력이 좋으며, 예술적 감각이 있습니다. 충동적인 경향이 있으니 신중함을 기르세요.',
        '정': '정화(丁火)는 촛불의 불로, 따뜻하고 섬세한 성격입니다. 직관력이 뛰어나고 감정 표현이 풍부하며, 타인을 배려하는 마음이 깊습니다. 자신의 감정 관리가 필요합니다.',
        '무': '무토(戊土)는 산의 흙으로, 안정적이고 신뢰감을 주는 성격입니다. 포용력이 넓고 중재 능력이 뛰어나며, 꾸준하고 성실합니다. 변화에 대응하는 능력을 키우세요.',
        '기': '기토(己土)는 밭의 흙으로, 섬세하고 배려심 많은 성격입니다. 세심한 관찰력과 분석력이 뛰어나며, 타인을 돌보는 것을 좋아합니다. 자신을 더 소중히 여기세요.',
        '경': '경금(庚金)은 광산의 금속으로, 결단력이 있고 의지가 강합니다. 정의감이 뛰어나고 원칙을 중시하며, 깔끔하고 체계적입니다. 경직된 태도를 유연하게 조절하세요.',
        '신': '신금(辛金)은 보석의 금속으로, 섬세하고 정교한 성격입니다. 미적 감각이 뛰어나고 세밀한 작업을 잘하며, 우아함을 추구합니다. 자신감을 더 가져도 좋습니다.',
        '임': '임수(壬水)는 강의 물로, 지혜롭고 유연한 사고를 가지고 있습니다. 적응력이 뛰어나고 관찰력이 좋으며, 깊은 사색을 즐깁니다. 결단력을 기르는 것이 중요합니다.',
        '계': '계수(癸水)는 이슬의 물로, 섬세하고 감정이 풍부한 성격입니다. 직관력이 뛰어나고 신비로운 매력이 있으며, 타인의 마음을 잘 읽습니다. 자신의 의견을 더 표현하세요.',
      };
      const lucks: Record<string, string> = {
        '갑': '2026년 병오년(丙午年)은 성장과 확장의 기운이 강합니다. 새로운 프로젝트에 도전하기 좋은 시기입니다. 특히 상반기에 좋은 기회가 찾아올 것입니다.',
        '을': '2026년 병오년(丙午年)은 섬세함이 빛나는 해입니다. 예술이나 창의적인 활동에 집중하면 좋은 결과를 얻을 수 있습니다.',
        '병': '2026년 병오년(丙午年)은 인간관계가 활발해지고 인기가 상승합니다. 자기 표현에 적극적으로 나서세요. 사교 활동이 성공으로 이어질 것입니다.',
        '정': '2026년 병오년(丙午年)은 감정의 안정과 내적 성장의 시기입니다. 명상이나 자기계발에 집중하면 좋습니다.',
        '토': '2026년 병오년(丙午年)은 안정과 축적의 시기입니다. 기반을 다지고 내실을 강화하는 데 집중하세요. 재정 운이 좋습니다.',
        '기': '2026년 병오년(丙午年)은 세심함과 배려가 빛나는 해입니다. 주변 사람들을 돌보는 활동이 좋은 평판을 얻을 것입니다.',
        '경': '2026년 병오년(丙午年)은 결실을 맺는 해입니다. 그동안의 노력이 성과로 나타나는 시기입니다. 목표 달성에 집중하세요.',
        '신': '2026년 병오년(丙午年)은 미적 감각과 정교함이 강조되는 해입니다. 품질 있는 일에 집중하면 좋은 평가를 받을 것입니다.',
        '임': '2026년 병오년(丙午年)은 지혜와 통찰의 해입니다. 내면의 성장에 집중하고 미래를 준비하세요. 학습과 연구에 좋은 시기입니다.',
        '계': '2026년 병오년(丙午年)은 신비로운 매력이 빛나는 해입니다. 직관을 믿고 따르면 좋은 결과를 얻을 수 있습니다.',
      };

      // 충전별 차감
      const deducted = deductCharge();
      if (!deducted) {
        alert('충전별 차감에 실패했습니다.');
        setIsLoading(false);
        return;
      }

      setResult({
        fourPillars,
        personality: personalities[dayElement] || personalities['갑'],
        luck: lucks[dayElement] || lucks['갑'],
        solarDate: solarDateStr,
        lunarDate: lunarDateStr,
        fortuneDetails,
      });
    } catch (error) {
      console.error('사주 계산 오류:', error);
      alert('사주 계산 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const cardStyle = {
    background: 'oklch(0.17 0.04 270)',
    border: '1px solid oklch(1 0 0 / 10%)',
    borderRadius: '1rem',
  };

  const selectStyle = {
    background: 'oklch(0.20 0.05 270)',
    color: 'oklch(0.94 0.015 90)',
    border: '1px solid oklch(1 0 0 / 15%)',
  };

  const PillarCard = ({ label, stem, branch, stemYinYang, branchYinYang, stemElement, branchElement }: any) => (
    <div className="rounded-xl p-4 text-center" style={{ background: 'oklch(0.20 0.05 270)', border: '1px solid oklch(0.55 0.25 290 / 20%)' }}>
      <p className="text-[10px] font-bold tracking-wider uppercase mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>{label}</p>
      <div className="space-y-1.5">
        <div>
          <p className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>{stem}</p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: stemYinYang === '양' ? 'oklch(0.78 0.15 85 / 20%)' : 'oklch(0.55 0.25 290 / 20%)', color: stemYinYang === '양' ? 'oklch(0.78 0.15 85)' : 'oklch(0.70 0.20 290)' }}>{stemYinYang}</span>
            <span className="text-[9px]" style={{ color: 'oklch(0.60 0.02 290)' }}>{stemElement}</span>
          </div>
        </div>
        <div className="w-full h-px" style={{ background: 'oklch(1 0 0 / 10%)' }} />
        <div>
          <p className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>{branch}</p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: branchYinYang === '양' ? 'oklch(0.78 0.15 85 / 20%)' : 'oklch(0.55 0.25 290 / 20%)', color: branchYinYang === '양' ? 'oklch(0.78 0.15 85)' : 'oklch(0.70 0.20 290)' }}>{branchYinYang}</span>
            <span className="text-[9px]" style={{ color: 'oklch(0.60 0.02 290)' }}>{branchElement}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>
      <div className="px-5 py-4 border-b" style={{ background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)', borderColor: 'oklch(1 0 0 / 10%)' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔮</span>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>사주 분석</h1>
            <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>생년월일시로 운명을 분석합니다</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="p-5 space-y-4" style={cardStyle}>
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>달력 유형</label>
            <div className="grid grid-cols-2 gap-2">
              {['solar', 'lunar'].map((type) => (
                <button key={type} onClick={() => setCalendarType(type as 'solar' | 'lunar')} className="py-3 rounded-xl text-sm font-semibold transition-all" style={calendarType === type ? { background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))', color: 'oklch(0.97 0.005 90)' } : { background: 'oklch(0.20 0.05 270)', color: 'oklch(0.70 0.02 290)', border: '1px solid oklch(1 0 0 / 10%)' }}>
                  {type === 'solar' ? '☀️ 양력' : '🌙 음력'}
                </button>
              ))}
            </div>
            {calendarType === 'lunar' && (
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={isLeapMonth} onChange={(e) => setIsLeapMonth(e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>윤달</span>
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>생년월일</label>
            <div className="grid grid-cols-3 gap-2">
              <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center" style={selectStyle}><option value="">년도</option>{years.map((y) => <option key={y} value={y}>{y}년</option>)}</select>
              <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center" style={selectStyle}><option value="">월</option>{months.map((m) => <option key={m} value={m}>{parseInt(m)}월</option>)}</select>
              <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center" style={selectStyle}><option value="">일</option>{days.map((d) => <option key={d} value={d}>{parseInt(d)}일</option>)}</select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>태어난 시간</label>
            <div className="grid grid-cols-2 gap-2">
              <select value={birthHour} onChange={(e) => setBirthHour(e.target.value)} disabled={unknownTime} className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center disabled:opacity-40" style={selectStyle}><option value="">시간</option>{hours.map((h, i) => <option key={h} value={String(i)}>{h}</option>)}</select>
              <select value={birthMinute} onChange={(e) => setBirthMinute(e.target.value)} disabled={unknownTime} className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center disabled:opacity-40" style={selectStyle}><option value="">분</option>{minutes.map((m) => <option key={m} value={m}>{m}분</option>)}</select>
            </div>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={unknownTime} onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) { setBirthHour(''); setBirthMinute(''); } }} className="w-4 h-4 rounded" />
              <span className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>시간 모름</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>성별</label>
            <div className="grid grid-cols-2 gap-2">
              {['남성', '여성'].map((g) => (
                <button key={g} onClick={() => setGender(g)} className="py-3 rounded-xl text-sm font-semibold transition-all" style={gender === g ? { background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))', color: 'oklch(0.97 0.005 90)' } : { background: 'oklch(0.20 0.05 270)', color: 'oklch(0.70 0.02 290)', border: '1px solid oklch(1 0 0 / 10%)' }}>
                  {g === '남성' ? '👨 남성' : '👩 여성'}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleAnalyzeSaju} disabled={isLoading} className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))', color: 'oklch(0.97 0.005 90)', boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)', fontFamily: "'Noto Serif KR', serif" }}>
            {isLoading ? <><Loader2 size={16} className="animate-spin" /> 분석 중...</> : '🔮 사주 분석하기'}
          </button>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-3 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>입력 날짜</h3>
              <div className="space-y-1.5 text-sm" style={{ color: 'oklch(0.85 0.015 90)' }}>
                <p>{result.solarDate}</p>
                <p>{result.lunarDate}</p>
              </div>
            </div>

            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-4 tracking-wide uppercase text-center" style={{ color: 'oklch(0.78 0.15 85)' }}>사주 명식 {unknownTime && '(시주 제외)'}</h3>
              <div className={`grid gap-2 ${unknownTime ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {!unknownTime && <PillarCard label="시주" stem={result.fourPillars.hour.heavenlyStem} branch={result.fourPillars.hour.earthlyBranch} stemYinYang={result.fourPillars.hourYinYang.stem} branchYinYang={result.fourPillars.hourYinYang.branch} stemElement={result.fourPillars.hourElement.stem} branchElement={result.fourPillars.hourElement.branch} />}
                <PillarCard label="일주" stem={result.fourPillars.day.heavenlyStem} branch={result.fourPillars.day.earthlyBranch} stemYinYang={result.fourPillars.dayYinYang.stem} branchYinYang={result.fourPillars.dayYinYang.branch} stemElement={result.fourPillars.dayElement.stem} branchElement={result.fourPillars.dayElement.branch} />
                <PillarCard label="월주" stem={result.fourPillars.month.heavenlyStem} branch={result.fourPillars.month.earthlyBranch} stemYinYang={result.fourPillars.monthYinYang.stem} branchYinYang={result.fourPillars.monthYinYang.branch} stemElement={result.fourPillars.monthElement.stem} branchElement={result.fourPillars.monthElement.branch} />
                <PillarCard label="년주" stem={result.fourPillars.year.heavenlyStem} branch={result.fourPillars.year.earthlyBranch} stemYinYang={result.fourPillars.yearYinYang.stem} branchYinYang={result.fourPillars.yearYinYang.branch} stemElement={result.fourPillars.yearElement.stem} branchElement={result.fourPillars.yearElement.branch} />
              </div>
            </div>

            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>성격 분석</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.85 0.015 90)' }}>{result.personality}</p>
            </div>

            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>올해의 운세</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.85 0.015 90)' }}>{result.luck}</p>
            </div>

            <div ref={resultRef} className="p-5 rounded-xl" style={{ background: 'oklch(0.17 0.04 270)', border: '1px solid oklch(1 0 0 / 10%)' }}>
              <h3 className="text-sm font-bold mb-4 tracking-wide uppercase text-center" style={{ color: 'oklch(0.78 0.15 85)' }}>📊 사주 분석 결과</h3>
              <div className="space-y-3 text-xs" style={{ color: 'oklch(0.85 0.015 90)' }}>
                <p>입력 날짜: {result.solarDate} / {result.lunarDate}</p>
                <p>사주 명식: {result.fourPillars.yearString} {result.fourPillars.monthString} {result.fourPillars.dayString}{result.fourPillars.hourString ? ' ' + result.fourPillars.hourString : ''}</p>
                <p>성격: {result.personality}</p>
                <p>운세: {result.luck}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button onClick={handleSaveImage} className="py-2 px-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.95] flex items-center justify-center gap-1" style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.94 0.015 90)', border: '1px solid oklch(1 0 0 / 10%)' }}>
                <Download size={14} /> 저장
              </button>
              <button onClick={handleShareKakao} className="py-2 px-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.95] flex items-center justify-center gap-1" style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.94 0.015 90)', border: '1px solid oklch(1 0 0 / 10%)' }}>
                <Share2 size={14} /> 카톡
              </button>
              <button onClick={handleShareInstagram} className="py-2 px-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.95] flex items-center justify-center gap-1" style={{ background: 'oklch(0.20 0.05 270)', color: 'oklch(0.94 0.015 90)', border: '1px solid oklch(1 0 0 / 10%)' }}>
                <Share2 size={14} /> 인스타
              </button>
            </div>

            <button onClick={() => { if (result) { sessionStorage.setItem('sajuResult', JSON.stringify(result)); window.location.href = '/chat'; } }} className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))', color: 'oklch(0.97 0.005 90)', boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)', fontFamily: "'Noto Serif KR', serif" }}>
              <MessageCircle size={18} /> AI 루나와 상담하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
