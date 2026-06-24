/* AI 루나 — SajuPage
 * Design: Mystic Dark Luxury
 * 자시(子時) = 24:00~01:59 기준, 양/음 표시, 시간 모름 시 시주 제외
 */
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

// 천간 (10개)
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const STEM_YINYANG: Record<string, '양' | '음'> = {
  '甲': '양', '乙': '음', '丙': '양', '丁': '음', '戊': '양',
  '己': '음', '庚': '양', '辛': '음', '壬': '양', '癸': '음',
};
const STEM_ELEMENT: Record<string, string> = {
  '甲': '목(木)', '乙': '목(木)', '丙': '화(火)', '丁': '화(火)', '戊': '토(土)',
  '己': '토(土)', '庚': '금(金)', '辛': '금(金)', '壬': '수(水)', '癸': '수(水)',
};

// 지지 (12개)
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const BRANCH_YINYANG: Record<string, '양' | '음'> = {
  '子': '양', '丑': '음', '寅': '양', '卯': '음', '辰': '양', '巳': '음',
  '午': '양', '未': '음', '申': '양', '酉': '음', '戌': '양', '亥': '음',
};
const BRANCH_ELEMENT: Record<string, string> = {
  '子': '수(水)', '丑': '토(土)', '寅': '목(木)', '卯': '목(木)', '辰': '토(土)', '巳': '화(火)',
  '午': '화(火)', '未': '토(土)', '申': '금(金)', '酉': '금(金)', '戌': '토(土)', '亥': '수(水)',
};

// 시진 (자시 = 24:00~01:59 기준)
const TIME_SLOTS = [
  { label: '자시 (子時) 24:00~01:59', value: 'ja' },
  { label: '축시 (丑時) 02:00~03:59', value: 'chuk' },
  { label: '인시 (寅時) 04:00~05:59', value: 'in' },
  { label: '묘시 (卯時) 06:00~07:59', value: 'myo' },
  { label: '진시 (辰時) 08:00~09:59', value: 'jin' },
  { label: '사시 (巳時) 10:00~11:59', value: 'sa' },
  { label: '오시 (午時) 12:00~13:59', value: 'o' },
  { label: '미시 (未時) 14:00~15:59', value: 'mi' },
  { label: '신시 (申時) 16:00~17:59', value: 'sin' },
  { label: '유시 (酉時) 18:00~19:59', value: 'yu' },
  { label: '술시 (戌時) 20:00~21:59', value: 'sul' },
  { label: '해시 (亥時) 22:00~23:59', value: 'hae' },
];

const TIME_BRANCH_MAP: Record<string, string> = {
  ja: '子', chuk: '丑', in: '寅', myo: '卯', jin: '辰', sa: '巳',
  o: '午', mi: '未', sin: '申', yu: '酉', sul: '戌', hae: '亥',
};

interface Pillar {
  stem: string;
  branch: string;
  stemYinYang: '양' | '음';
  branchYinYang: '양' | '음';
  stemElement: string;
  branchElement: string;
}

interface SajuResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null;
  personality: string;
  luck: string;
}

function calculatePillar(seed: number): Pillar {
  const stemIdx = ((seed % 10) + 10) % 10;
  const branchIdx = ((seed % 12) + 12) % 12;
  const stem = HEAVENLY_STEMS[stemIdx];
  const branch = EARTHLY_BRANCHES[branchIdx];
  return {
    stem,
    branch,
    stemYinYang: STEM_YINYANG[stem],
    branchYinYang: BRANCH_YINYANG[branch],
    stemElement: STEM_ELEMENT[stem],
    branchElement: BRANCH_ELEMENT[branch],
  };
}

function calculateSaju(year: number, month: number, day: number, timeSlot: string | null): SajuResult {
  // 년주 계산 (갑자년 기준)
  const yearStemIdx = (year - 4) % 10;
  const yearBranchIdx = (year - 4) % 12;
  const yearPillar = calculatePillar(yearStemIdx + yearBranchIdx * 5);
  yearPillar.stem = HEAVENLY_STEMS[((year - 4) % 10 + 10) % 10];
  yearPillar.branch = EARTHLY_BRANCHES[((year - 4) % 12 + 12) % 12];
  yearPillar.stemYinYang = STEM_YINYANG[yearPillar.stem];
  yearPillar.branchYinYang = BRANCH_YINYANG[yearPillar.branch];
  yearPillar.stemElement = STEM_ELEMENT[yearPillar.stem];
  yearPillar.branchElement = BRANCH_ELEMENT[yearPillar.branch];

  // 월주 계산
  const monthStemBase = ((year - 4) % 10) * 2 + month;
  const monthPillar = calculatePillar(monthStemBase);
  monthPillar.stem = HEAVENLY_STEMS[(monthStemBase % 10 + 10) % 10];
  monthPillar.branch = EARTHLY_BRANCHES[((month + 1) % 12 + 12) % 12];
  monthPillar.stemYinYang = STEM_YINYANG[monthPillar.stem];
  monthPillar.branchYinYang = BRANCH_YINYANG[monthPillar.branch];
  monthPillar.stemElement = STEM_ELEMENT[monthPillar.stem];
  monthPillar.branchElement = BRANCH_ELEMENT[monthPillar.branch];

  // 일주 계산 (간단 공식)
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayStemIdx = ((diffDays % 10) + 10) % 10;
  const dayBranchIdx = ((diffDays % 12) + 12) % 12;
  const dayPillar: Pillar = {
    stem: HEAVENLY_STEMS[dayStemIdx],
    branch: EARTHLY_BRANCHES[dayBranchIdx],
    stemYinYang: STEM_YINYANG[HEAVENLY_STEMS[dayStemIdx]],
    branchYinYang: BRANCH_YINYANG[EARTHLY_BRANCHES[dayBranchIdx]],
    stemElement: STEM_ELEMENT[HEAVENLY_STEMS[dayStemIdx]],
    branchElement: BRANCH_ELEMENT[EARTHLY_BRANCHES[dayBranchIdx]],
  };

  // 시주 계산
  let hourPillar: Pillar | null = null;
  if (timeSlot) {
    const hourBranch = TIME_BRANCH_MAP[timeSlot];
    const hourBranchIdx = EARTHLY_BRANCHES.indexOf(hourBranch);
    const hourStemIdx = (dayStemIdx * 2 + hourBranchIdx) % 10;
    hourPillar = {
      stem: HEAVENLY_STEMS[hourStemIdx],
      branch: hourBranch,
      stemYinYang: STEM_YINYANG[HEAVENLY_STEMS[hourStemIdx]],
      branchYinYang: BRANCH_YINYANG[hourBranch],
      stemElement: STEM_ELEMENT[HEAVENLY_STEMS[hourStemIdx]],
      branchElement: BRANCH_ELEMENT[hourBranch],
    };
  }

  // 성격/운세 해석
  const dayElement = STEM_ELEMENT[dayPillar.stem];
  const personalities: Record<string, string> = {
    '목(木)': '창의적이고 진취적인 성향을 가지고 있습니다. 새로운 것을 좋아하고 리더십이 강하며, 성장과 발전을 추구합니다. 인정이 많고 정의감이 강합니다.',
    '화(火)': '열정적이고 활발한 성격입니다. 사교성이 뛰어나고 표현력이 좋으며, 예술적 감각이 있습니다. 다만 급한 성격을 조절할 필요가 있습니다.',
    '토(土)': '안정적이고 신뢰감을 주는 성격입니다. 포용력이 넓고 중재 능력이 뛰어나며, 꾸준하고 성실합니다. 변화보다는 안정을 추구합니다.',
    '금(金)': '결단력이 있고 의지가 강합니다. 정의감이 뛰어나고 원칙을 중시하며, 깔끔하고 체계적입니다. 때로는 완벽주의적 성향이 있습니다.',
    '수(水)': '지혜롭고 유연한 사고를 가지고 있습니다. 적응력이 뛰어나고 관찰력이 좋으며, 깊은 사색을 즐깁니다. 감수성이 풍부합니다.',
  };
  const lucks: Record<string, string> = {
    '목(木)': '올해는 성장과 확장의 기운이 강합니다. 새로운 프로젝트나 학습에 도전하기 좋은 시기입니다.',
    '화(火)': '올해는 인간관계가 활발해지고 인기가 상승합니다. 자기 표현에 적극적으로 나서세요.',
    '토(土)': '올해는 안정과 축적의 시기입니다. 기반을 다지고 내실을 강화하는 데 집중하세요.',
    '금(金)': '올해는 결실을 맺는 해입니다. 그동안의 노력이 성과로 나타나는 시기입니다.',
    '수(水)': '올해는 지혜와 통찰의 해입니다. 내면의 성장에 집중하고 미래를 준비하세요.',
  };

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    personality: personalities[dayElement] || personalities['목(木)'],
    luck: lucks[dayElement] || lucks['목(木)'],
  };
}

export default function SajuPage() {
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState('');
  const [result, setResult] = useState<SajuResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const years = Array.from({ length: 100 }, (_, i) => String(2026 - i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const handleAnalyzeSaju = () => {
    if (!birthYear || !birthMonth || !birthDay || !gender) {
      alert('생년월일과 성별을 모두 입력해주세요.');
      return;
    }
    if (!unknownTime && !timeSlot) {
      alert('태어난 시간을 선택하거나 "시간 모름"을 체크해주세요.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const r = calculateSaju(
        parseInt(birthYear),
        parseInt(birthMonth),
        parseInt(birthDay),
        unknownTime ? null : timeSlot
      );
      setResult(r);
      setIsLoading(false);
    }, 1500);
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

  const PillarCard = ({ pillar, label }: { pillar: Pillar; label: string }) => (
    <div
      className="rounded-xl p-4 text-center"
      style={{ background: 'oklch(0.20 0.05 270)', border: '1px solid oklch(0.55 0.25 290 / 20%)' }}
    >
      <p className="text-[10px] font-bold tracking-wider uppercase mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
        {label}
      </p>
      <div className="space-y-1.5">
        <div>
          <p className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
            {pillar.stem}
          </p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
              style={{
                background: pillar.stemYinYang === '양' ? 'oklch(0.78 0.15 85 / 20%)' : 'oklch(0.55 0.25 290 / 20%)',
                color: pillar.stemYinYang === '양' ? 'oklch(0.78 0.15 85)' : 'oklch(0.70 0.20 290)',
              }}
            >
              {pillar.stemYinYang}
            </span>
            <span className="text-[9px]" style={{ color: 'oklch(0.60 0.02 290)' }}>{pillar.stemElement}</span>
          </div>
        </div>
        <div
          className="w-full h-px"
          style={{ background: 'oklch(1 0 0 / 10%)' }}
        />
        <div>
          <p className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
            {pillar.branch}
          </p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
              style={{
                background: pillar.branchYinYang === '양' ? 'oklch(0.78 0.15 85 / 20%)' : 'oklch(0.55 0.25 290 / 20%)',
                color: pillar.branchYinYang === '양' ? 'oklch(0.78 0.15 85)' : 'oklch(0.70 0.20 290)',
              }}
            >
              {pillar.branchYinYang}
            </span>
            <span className="text-[9px]" style={{ color: 'oklch(0.60 0.02 290)' }}>{pillar.branchElement}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{
          background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔮</span>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
              사주 분석
            </h1>
            <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>생년월일시로 운명을 분석합니다</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Input Form */}
        <div className="p-5 space-y-4" style={cardStyle}>
          {/* 생년월일 */}
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
              생년월일
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center"
                style={selectStyle}
              >
                <option value="">년도</option>
                {years.map((y) => <option key={y} value={y}>{y}년</option>)}
              </select>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center"
                style={selectStyle}
              >
                <option value="">월</option>
                {months.map((m) => <option key={m} value={m}>{parseInt(m)}월</option>)}
              </select>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center"
                style={selectStyle}
              >
                <option value="">일</option>
                {days.map((d) => <option key={d} value={d}>{parseInt(d)}일</option>)}
              </select>
            </div>
          </div>

          {/* 태어난 시간 */}
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
              태어난 시간
            </label>
            <select
              value={unknownTime ? '' : timeSlot}
              onChange={(e) => { setTimeSlot(e.target.value); setUnknownTime(false); }}
              disabled={unknownTime}
              className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center disabled:opacity-40"
              style={selectStyle}
            >
              <option value="">시간 선택</option>
              {TIME_SLOTS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) setTimeSlot(''); }}
                className="w-4 h-4 rounded"
              />
              <span className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>시간 모름 (시주 제외하고 분석)</span>
            </label>
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
              성별
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['남성', '여성'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className="py-3 rounded-xl text-sm font-semibold transition-all"
                  style={
                    gender === g
                      ? {
                          background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                          color: 'oklch(0.97 0.005 90)',
                        }
                      : {
                          background: 'oklch(0.20 0.05 270)',
                          color: 'oklch(0.70 0.02 290)',
                          border: '1px solid oklch(1 0 0 / 10%)',
                        }
                  }
                >
                  {g === '남성' ? '👨 남성' : '👩 여성'}
                </button>
              ))}
            </div>
          </div>

          {/* 분석 버튼 */}
          <button
            onClick={handleAnalyzeSaju}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
              color: 'oklch(0.97 0.005 90)',
              boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
              fontFamily: "'Noto Serif KR', serif",
            }}
          >
            {isLoading ? <><Loader2 size={16} className="animate-spin" /> 분석 중...</> : '🔮 사주 분석하기'}
          </button>
        </div>

        {/* Result - 명식표 */}
        {result && (
          <div className="space-y-3">
            {/* 사주 명식 */}
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-4 tracking-wide uppercase text-center" style={{ color: 'oklch(0.78 0.15 85)' }}>
                사주 명식 {!result.hourPillar && '(시주 제외)'}
              </h3>
              <div className={`grid gap-2 ${result.hourPillar ? 'grid-cols-4' : 'grid-cols-3'}`}>
                {result.hourPillar && <PillarCard pillar={result.hourPillar} label="시주" />}
                <PillarCard pillar={result.dayPillar} label="일주" />
                <PillarCard pillar={result.monthPillar} label="월주" />
                <PillarCard pillar={result.yearPillar} label="년주" />
              </div>
              {!result.hourPillar && (
                <p className="text-[11px] text-center mt-3" style={{ color: 'oklch(0.55 0.02 290)' }}>
                  * 태어난 시간을 모르므로 시주를 제외하고 분석했습니다
                </p>
              )}
            </div>

            {/* 성격 분석 */}
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>성격 분석</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.85 0.015 90)' }}>{result.personality}</p>
            </div>

            {/* 올해의 운세 */}
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>올해의 운세</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.85 0.015 90)' }}>{result.luck}</p>
            </div>

            {/* 오행 분석 */}
            <div className="p-5" style={cardStyle}>
              <h3 className="text-sm font-bold mb-3 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>오행 분석</h3>
              <div className="grid grid-cols-5 gap-2">
                {['목(木)', '화(火)', '토(土)', '금(金)', '수(水)'].map((element) => {
                  const count = [
                    result.yearPillar.stemElement,
                    result.yearPillar.branchElement,
                    result.monthPillar.stemElement,
                    result.monthPillar.branchElement,
                    result.dayPillar.stemElement,
                    result.dayPillar.branchElement,
                    ...(result.hourPillar ? [result.hourPillar.stemElement, result.hourPillar.branchElement] : []),
                  ].filter((e) => e === element).length;
                  const maxCount = result.hourPillar ? 8 : 6;
                  const elementColors: Record<string, string> = {
                    '목(木)': 'oklch(0.60 0.18 145)',
                    '화(火)': 'oklch(0.60 0.22 25)',
                    '토(土)': 'oklch(0.70 0.12 75)',
                    '금(金)': 'oklch(0.80 0.05 90)',
                    '수(水)': 'oklch(0.55 0.20 250)',
                  };
                  return (
                    <div key={element} className="text-center">
                      <div
                        className="h-16 rounded-lg mb-1 flex items-end justify-center overflow-hidden relative"
                        style={{ background: 'oklch(0.15 0.03 270)' }}
                      >
                        <div
                          className="w-full rounded-t-sm transition-all duration-700"
                          style={{
                            height: `${(count / maxCount) * 100}%`,
                            background: elementColors[element],
                            minHeight: count > 0 ? '4px' : '0',
                          }}
                        />
                      </div>
                      <p className="text-[10px] font-bold" style={{ color: elementColors[element] }}>
                        {element.split('(')[0]}
                      </p>
                      <p className="text-[9px]" style={{ color: 'oklch(0.55 0.02 290)' }}>{count}개</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
