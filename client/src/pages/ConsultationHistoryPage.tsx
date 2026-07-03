/* AI 루나 — ConsultationHistoryPage
 * Design: Mystic Dark Luxury
 * 로컬스토리지 기반 상담내역 관리
 */
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, RotateCcw, Eye } from 'lucide-react';
import { useLocation } from 'wouter';
import { getAllConsultations, deleteConsultation, getConsultationById, formatDate, ConsultationRecord } from '@/lib/consultationHistory';

export default function ConsultationHistoryPage() {
  const [, setLocation] = useLocation();
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(null);

  useEffect(() => {
    setConsultations(getAllConsultations());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('이 상담내역을 삭제하시겠습니까?')) {
      deleteConsultation(id);
      setConsultations(getAllConsultations());
      setSelectedId(null);
      setSelectedRecord(null);
    }
  };

  const handleView = (id: string) => {
    const record = getConsultationById(id);
    if (record) {
      setSelectedId(id);
      setSelectedRecord(record);
    }
  };

  const handleReload = (id: string) => {
    const record = getConsultationById(id);
    if (record) {
      if (record.type === 'saju') {
        sessionStorage.setItem('sajuResult', JSON.stringify(record.result));
      } else if (record.type === 'tarot') {
        sessionStorage.setItem('tarotResult', JSON.stringify(record.result));
      } else if (record.type === 'yuk') {
        sessionStorage.setItem('yukResult', JSON.stringify(record.result));
      }
      setLocation('/chat');
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'saju':
        return '📅 사주';
      case 'tarot':
        return '🃏 타로';
      case 'yuk':
        return '☯️ 육효';
      default:
        return '상담';
    }
  };

  const cardStyle = {
    background: 'oklch(0.17 0.04 270)',
    border: '1px solid oklch(1 0 0 / 10%)',
    borderRadius: '1rem',
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.12 0.03 270)' }}>
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center gap-3"
        style={{
          background: 'linear-gradient(160deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          borderColor: 'oklch(1 0 0 / 10%)',
        }}
      >
        <button
          onClick={() => setLocation('/')}
          className="p-2 rounded-lg transition-all hover:bg-white/10"
          style={{ color: 'oklch(0.78 0.15 85)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'oklch(0.94 0.015 90)', fontFamily: "'Noto Serif KR', serif" }}>
            상담 내역
          </h1>
          <p className="text-xs" style={{ color: 'oklch(0.78 0.15 85)' }}>이전 상담을 다시 보기</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {consultations.length === 0 ? (
          <div className="p-8 text-center" style={cardStyle}>
            <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-sm">
              저장된 상담내역이 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 상담내역 목록 */}
            <div className="lg:col-span-1 space-y-2">
              {consultations.map(record => (
                <button
                  key={record.id}
                  onClick={() => handleView(record.id)}
                  className="w-full p-4 rounded-lg text-left transition-all hover:bg-white/5"
                  style={{
                    ...cardStyle,
                    background: selectedId === record.id ? 'oklch(0.20 0.08 290)' : 'oklch(0.17 0.04 270)',
                    borderColor: selectedId === record.id ? 'oklch(0.78 0.15 85)' : 'oklch(1 0 0 / 10%)',
                  }}
                >
                  <p style={{ color: 'oklch(0.78 0.15 85)' }} className="text-xs font-semibold mb-1">
                    {getTypeLabel(record.type)}
                  </p>
                  <p style={{ color: 'oklch(0.94 0.015 90)' }} className="text-sm font-semibold truncate mb-1">
                    {record.question}
                  </p>
                  <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-xs">
                    {formatDate(record.date)}
                  </p>
                </button>
              ))}
            </div>

            {/* 상담내역 상세 */}
            {selectedRecord && (
              <div className="lg:col-span-2 space-y-3">
                {/* 기본 정보 */}
                <div className="p-5" style={cardStyle}>
                  <h3 className="text-sm font-bold mb-3 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                    상담 정보
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-xs">유형</p>
                      <p style={{ color: 'oklch(0.94 0.015 90)' }} className="text-sm font-semibold">
                        {getTypeLabel(selectedRecord.type)}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-xs">질문</p>
                      <p style={{ color: 'oklch(0.94 0.015 90)' }} className="text-sm">
                        {selectedRecord.question}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-xs">날짜</p>
                      <p style={{ color: 'oklch(0.94 0.015 90)' }} className="text-sm">
                        {formatDate(selectedRecord.date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 결과 정보 */}
                {selectedRecord.result && (
                  <div className="p-5" style={cardStyle}>
                    <h3 className="text-sm font-bold mb-3 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                      분석 결과
                    </h3>
                    <div className="space-y-2 text-sm" style={{ color: 'oklch(0.85 0.015 90)' }}>
                      {selectedRecord.type === 'saju' && selectedRecord.result.fourPillars && (
                        <>
                          <p>
                            <strong>명식:</strong> {selectedRecord.result.fourPillars.yearString}{' '}
                            {selectedRecord.result.fourPillars.monthString} {selectedRecord.result.fourPillars.dayString}
                            {selectedRecord.result.fourPillars.hourString ? ' ' + selectedRecord.result.fourPillars.hourString : ''}
                          </p>
                          <p>
                            <strong>양력:</strong> {selectedRecord.result.solarDate}
                          </p>
                          <p>
                            <strong>음력:</strong> {selectedRecord.result.lunarDate}
                          </p>
                        </>
                      )}
                      {selectedRecord.type === 'tarot' && selectedRecord.result.spreadName && (
                        <>
                          <p>
                            <strong>스프레드:</strong> {selectedRecord.result.spreadName}
                          </p>
                          <p>
                            <strong>카드 수:</strong> {selectedRecord.result.cards?.length || 0}장
                          </p>
                        </>
                      )}
                      {selectedRecord.type === 'yuk' && selectedRecord.result.hexagramInfo && (
                        <>
                          <p>
                            <strong>육괘:</strong> {selectedRecord.result.hexagramInfo.name}
                          </p>
                          <p>
                            <strong>의미:</strong> {selectedRecord.result.hexagramInfo.meaning}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* 메시지 기록 */}
                {selectedRecord.messages && selectedRecord.messages.length > 0 && (
                  <div className="p-5" style={cardStyle}>
                    <h3 className="text-sm font-bold mb-3 tracking-wide uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                      대화 기록 ({selectedRecord.messages.length})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedRecord.messages.slice(0, 5).map((msg, idx) => (
                        <div key={idx} className="p-2 rounded-lg" style={{ background: 'oklch(0.20 0.05 270)' }}>
                          <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-xs font-semibold mb-1">
                            {msg.role === 'user' ? '👤 당신' : '✨ AI 루나'}
                          </p>
                          <p style={{ color: 'oklch(0.85 0.015 90)' }} className="text-xs truncate">
                            {msg.content}
                          </p>
                        </div>
                      ))}
                      {selectedRecord.messages.length > 5 && (
                        <p style={{ color: 'oklch(0.60 0.02 290)' }} className="text-xs text-center">
                          +{selectedRecord.messages.length - 5}개 더...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReload(selectedRecord.id)}
                    className="flex-1 py-3 rounded-lg font-bold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
                      color: 'oklch(0.97 0.005 90)',
                      boxShadow: '0 4px 20px oklch(0.55 0.25 290 / 40%)',
                    }}
                  >
                    <RotateCcw size={16} /> 다시 상담하기
                  </button>
                  <button
                    onClick={() => handleDelete(selectedRecord.id)}
                    className="px-4 py-3 rounded-lg font-bold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                    style={{
                      background: 'oklch(0.17 0.04 270)',
                      color: 'oklch(0.70 0.20 0)',
                      border: '1px solid oklch(1 0 0 / 15%)',
                    }}
                  >
                    <Trash2 size={16} /> 삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
