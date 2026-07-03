/* AI 루나 — SajuPage
 * Design: Mystic Dark Luxury
 * manseryeok 라이브러리 기반 정확한 사주 계산
 */
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { calculateFourPillars } from 'manseryeok';

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
}

export default function SajuPage() {
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState('');
  const [result, setResult] = useState<SajuResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const years = Array.from({ length: 100 }, (_, i) => String(2026 - i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleAnalyzeSaju = () => {
    if (!birthYear || !birthMonth || !birthDay || !gender) {
      alert('생년월일과 성별을 모두 입력해주세요.');
      return;
    }
    if (!unknownTime && (!birthHour || birthMinute === '')) {
      alert('태어난 시간을 선택하거나 "시간 모름"을 체크해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const fourPillars = calculateFourPillars({
        year: parseInt(birthYear),
        month: parseInt(birthMonth),
        day: parseInt(birthDay),
        hour: unknownTime ? 12 : parseInt(birthHour),
        minute: unknownTime ? 0 : parseInt(birthMinute),
      });

      // 성격/운세 해석
      const dayElement = fourPillars.dayElement.stem;
      const personalities: Record<string, string> = {
        '목': '창의적이고 진취적인 성향을 가지고 있습니다. 새로운 것을 좋아하고 리더십이 강하며, 성장과 발전을 추구합니다. 인정이 많고 정의감이 강합니다.',
        '화': '열정적이고 활발한 성격입니다. 사교성이 뛰어나고 표현력이 좋으며, 예술적 감각이 있습니다. 다만 급한 성격을 조절할 필요가 있습니다.',
        '토': '안정적이고 신뢰감을 주는 성격입니다. 포용력이 넓고 중재 능력이 뛰어나며, 꾸준하고 성실합니다. 변화보다는 안정을 추구합니다.',
        '금': '결단력이 있고 의지가 강합니다. 정의감이 뛰어나고 원칙을 중시하며, 깔끔하고 체계적입니다. 때로는 완벽주의적 성향이 있습니다.',
        '수': '지혜롭고 유연한 사고를 가지고 있습니다. 적응력이 뛰어나고 관찰력이 좋으며, 깊은 사색을 즐깁니다. 감수성이 풍부합니다.',
      };
      const lucks: Record<string, string> = {
        '목': '올해는 성장과 확장의 기운이 강합니다. 새로운 프로젝트나 학습에 도전하기 좋은 시기입니다.',
        '화': '올해는 인간관계가 활발해지고 인기가 상승합니다. 자기 표현에 적극적으로 나서세요.',
        '토': '올해는 안정과 축적의 시기입니다. 기반을 다지고 내실을 강화하는 데 집중하세요.',
        '금': '올해는 결실을 맺는 해입니다. 그동안의 노력이 성과로 나타나는 시기입니다.',
        '수': '올해는 지혜와 통찰의 해입니다. 내면의 성장에 집중하고 미래를 준비하세요.',
      };

      setResult({
        fourPillars,
        personality: personalities[dayElement] || personalities['목'],
        luck: lucks[dayElement] || lucks['목'],
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
            {stem}
          </p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
              style={{
                background: stemYinYang === '양' ? 'oklch(0.78 0.15 85 / 20%)' : 'oklch(0.55 0.25 290 / 20%)',
                color: stemYinYang === '양' ? 'oklch(0.78 0.15 85)' : 'oklch(0.70 0.20 290)',
              }}
            >
              {stemYinYang}
            </span>
            <span className="text-[9px]" style={{ color: 'oklch(0.60 0.02 290)' }}>{stemElement}</span>
          </div>
        </div>
        <div
          className="w-full h-px"
          style={{ background: 'oklch(1 0 0 / 10%)' }}
        />
        <div>
          <p className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
            {branch}
          </p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
              style={{
                background: branchYinYang === '양' ? 'oklch(0.78 0.15 85 / 20%)' : 'oklch(0.55 0.25 290 / 20%)',
                color: branchYinYang === '양' ? 'oklch(0.78 0.15 85)' : 'oklch(0.70 0.20 290)',
              }}
            >
              {branchYinYang}
            </span>
            <span className="text-[9px]" style={{ color: 'oklch(0.60 0.02 290)' }}>{branchElement}</span>
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
            <div className="grid grid-cols-2 gap-2">
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                disabled={unknownTime}
                className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center disabled:opacity-40"
                style={selectStyle}
              >
                <option value="">시간</option>
                {hours.map((h) => <option key={h} value={h}>{h}시</option>)}
              </select>
              <select
                value={birthMinute}
                onChange={(e) => setBirthMinute(e.target.value)}
                disabled={unknownTime}
                className="w-full px-3 py-3 rounded-xl text-sm focus:outline-none appearance-none text-center disabled:opacity-40"
                style={selectStyle}
              >
                <option value="">분</option>
                {minutes.map((m) => <option key={m} value={m}>{m}분</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) { setBirthHour(''); setBirthMinute(''); } }}
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
                사주 명식 {unknownTime && '(시주 제외)'}
              </h3>
              <div className={`grid gap-2 ${unknownTime ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {!unknownTime && (
                  <PillarCard
                    label="시주"
                    stem={result.fourPillars.hour.heavenlyStem}
                    branch={result.fourPillars.hour.earthlyBranch}
                    stemYinYang={result.fourPillars.hourYinYang.stem}
                    branchYinYang={result.fourPillars.hourYinYang.branch}
                    stemElement={result.fourPillars.hourElement.stem}
                    branchElement={result.fourPillars.hourElement.branch}
                  />
                )}
                <PillarCard
                  label="일주"
                  stem={result.fourPillars.day.heavenlyStem}
                  branch={result.fourPillars.day.earthlyBranch}
                  stemYinYang={result.fourPillars.dayYinYang.stem}
                  branchYinYang={result.fourPillars.dayYinYang.branch}
                  stemElement={result.fourPillars.dayElement.stem}
                  branchElement={result.fourPillars.dayElement.branch}
                />
                <PillarCard
                  label="월주"
                  stem={result.fourPillars.month.heavenlyStem}
                  branch={result.fourPillars.month.earthlyBranch}
                  stemYinYang={result.fourPillars.monthYinYang.stem}
                  branchYinYang={result.fourPillars.monthYinYang.branch}
                  stemElement={result.fourPillars.monthElement.stem}
                  branchElement={result.fourPillars.monthElement.branch}
                />
                <PillarCard
                  label="년주"
                  stem={result.fourPillars.year.heavenlyStem}
                  branch={result.fourPillars.year.earthlyBranch}
                  stemYinYang={result.fourPillars.yearYinYang.stem}
                  branchYinYang={result.fourPillars.yearYinYang.branch}
                  stemElement={result.fourPillars.yearElement.stem}
                  branchElement={result.fourPillars.yearElement.branch}
                />
              </div>
              {unknownTime && (
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
          </div>
        )}
      </div>
    </div>
  );
}
