/**
 * 사주 분석 결과를 아코디언 UI로 렌더링
 * 마크다운 헤딩(## 1️⃣ 일간 확인 등)으로 구분된 텍스트를 파싱하여 아코디언으로 표시
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Streamdown } from 'streamdown';

interface Section {
  title: string;
  content: string;
  emoji: string;
}

/**
 * 사주 분석 결과 텍스트를 섹션으로 파싱
 */
function parseSajuAnalysis(text: string): Section[] {
  const sections: Section[] = [];
  
  // ## 1️⃣ 일간 확인 형식의 헤딩 찾기
  const headingRegex = /^## (\d+️⃣)\s+(.+?)$/gm;
  let match;
  let lastIndex = 0;
  const matches: Array<{ index: number; emoji: string; title: string }> = [];

  while ((match = headingRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      emoji: match[1],
      title: match[2],
    });
  }

  // 각 섹션의 내용 추출
  matches.forEach((m, i) => {
    const startIndex = m.index + m.emoji.length + m.title.length + 5; // "## " + emoji + title + "\n"
    const endIndex = i < matches.length - 1 ? matches[i + 1].index : text.length;
    const content = text.substring(startIndex, endIndex).trim();

    sections.push({
      title: m.title,
      content,
      emoji: m.emoji,
    });
  });

  return sections;
}

interface SajuAnalysisAccordionProps {
  content: string;
}

export function SajuAnalysisAccordion({ content }: SajuAnalysisAccordionProps) {
  const sections = parseSajuAnalysis(content);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // 첫 섹션 기본 열림

  if (sections.length === 0) {
    // 파싱 실패 시 원본 텍스트 표시
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        <Streamdown>{content}</Streamdown>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sections.map((section, index) => (
        <div
          key={index}
          className="border border-opacity-20 rounded-lg overflow-hidden"
          style={{ borderColor: 'oklch(1 0 0 / 20%)' }}
        >
          {/* 아코디언 헤더 */}
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white hover:bg-opacity-5 transition-colors"
            style={{
              background: expandedIndex === index ? 'oklch(0.22 0.05 270)' : 'transparent',
            }}
          >
            <span className="font-semibold text-sm flex items-center gap-2">
              <span>{section.emoji}</span>
              <span>{section.title}</span>
            </span>
            <ChevronDown
              size={18}
              className={`transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}
              style={{ color: 'oklch(0.78 0.15 85)' }}
            />
          </button>

          {/* 아코디언 내용 */}
          {expandedIndex === index && (
            <div
              className="px-4 py-3 border-t border-opacity-10 text-sm leading-relaxed"
              style={{ borderColor: 'oklch(1 0 0 / 10%)' }}
            >
              <Streamdown>{section.content}</Streamdown>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SajuAnalysisAccordion;
