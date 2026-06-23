import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface SajuResult {
  heavenlyStem: string;
  earthlyBranch: string;
  element: string;
  personality: string;
  luck: string;
}

export default function SajuPage() {
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState<SajuResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeSaju = () => {
    if (!birthDate) {
      alert('생년월일을 입력해주세요');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result: SajuResult = {
        heavenlyStem: '甲',
        earthlyBranch: '子',
        element: '목(木)',
        personality: '창의적이고 진취적인 성향을 가지고 있습니다. 새로운 것을 좋아하고 리더십이 강합니다.',
        luck: '올해는 새로운 시작의 해입니다. 변화를 두려워하지 말고 도전하세요.',
      };
      setResult(result);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">🌙 사주 분석</h1>
        <p className="text-indigo-100 mt-2">생년월일로 당신의 운명을 알아보세요</p>
      </div>

      <div className="px-6 py-8">
        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">당신의 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">생년월일</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">성별</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-700">남성</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-700">여성</span>
                </label>
              </div>
            </div>
            <Button
              onClick={handleAnalyzeSaju}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
            >
              {isLoading ? '분석 중...' : '사주 분석하기'}
            </Button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">분석 결과</h2>

            {/* Saju Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">천간</p>
                <p className="text-3xl font-bold text-indigo-600">{result.heavenlyStem}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">지지</p>
                <p className="text-3xl font-bold text-indigo-600">{result.earthlyBranch}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">오행</p>
                <p className="text-lg font-bold text-indigo-600">{result.element}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">성별</p>
                <p className="text-lg font-bold text-indigo-600">{gender === 'male' ? '남성' : '여성'}</p>
              </div>
            </div>

            {/* Personality */}
            <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-600">
              <h3 className="font-bold text-slate-900 mb-3">성격 분석</h3>
              <p className="text-slate-700 leading-relaxed">{result.personality}</p>
            </div>

            {/* Luck */}
            <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-600">
              <h3 className="font-bold text-slate-900 mb-3">운세</h3>
              <p className="text-slate-700 leading-relaxed">{result.luck}</p>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-600 mb-2">연애운</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full ${
                        i <= 4 ? 'bg-pink-500' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-600 mb-2">재운</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full ${
                        i <= 3 ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-600 mb-2">건강운</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full ${
                        i <= 4 ? 'bg-green-500' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
