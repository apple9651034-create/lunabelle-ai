/**
 * 프로필 관리 컴포넌트
 * 프로필 목록에서 개별 프로필을 수정/삭제할 수 있는 UI
 */
import React, { useState } from 'react';
import { Edit2, Trash2, X, Save } from 'lucide-react';
import { getAllProfiles, updateProfile, deleteProfile } from '@/lib/profileManager';

interface Profile {
  id: string;
  name: string;
  year: string;
  month: string;
  day: string;
  hour: string;
  gender: string;
}

interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
}

export default function ProfileManager({
  isOpen,
  onClose,
  onProfileUpdated,
}: ProfileManagerProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Profile>>({});

  React.useEffect(() => {
    if (isOpen) {
      const allProfiles = getAllProfiles();
      setProfiles(allProfiles);
    }
  }, [isOpen]);

  const handleEdit = (profile: Profile) => {
    setEditingId(profile.id);
    setEditingData(profile);
  };

  const handleSave = () => {
    if (editingId && editingData) {
      updateProfile(editingId, editingData);
      setProfiles(profiles.map(p => p.id === editingId ? { ...p, ...editingData } : p));
      setEditingId(null);
      onProfileUpdated();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('이 프로필을 삭제하시겠습니까?')) {
      deleteProfile(id);
      setProfiles(profiles.filter(p => p.id !== id));
      onProfileUpdated();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 모달 컨텐츠 */}
      <div
        className="relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, oklch(0.18 0.08 290) 0%, oklch(0.14 0.04 270) 100%)',
          border: '2px solid oklch(0.70 0.18 60)',
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg transition-colors hover:bg-white/10"
        >
          <X size={24} style={{ color: 'oklch(0.94 0.015 90)' }} />
        </button>

        {/* 헤더 */}
        <div
          className="p-8 text-center border-b"
          style={{
            background: 'linear-gradient(135deg, oklch(0.50 0.28 290), oklch(0.45 0.25 310))',
            borderColor: 'oklch(0.70 0.18 60)',
          }}
        >
          <h2 className="text-2xl font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
            👤 프로필 관리
          </h2>
        </div>

        {/* 프로필 목록 */}
        <div className="p-8">
          {profiles.length === 0 ? (
            <p className="text-center" style={{ color: 'oklch(0.70 0.02 290)' }}>
              등록된 프로필이 없습니다.
            </p>
          ) : (
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="p-4 rounded-lg border"
                  style={{
                    background: 'oklch(0.20 0.05 270)',
                    borderColor: editingId === profile.id ? 'oklch(0.70 0.18 60)' : 'oklch(1 0 0 / 10%)',
                  }}
                >
                  {editingId === profile.id ? (
                    // 편집 모드
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
                          이름
                        </label>
                        <input
                          type="text"
                          value={editingData.name || ''}
                          onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg mt-1"
                          style={{
                            background: 'oklch(0.15 0.04 270)',
                            color: 'oklch(0.94 0.015 90)',
                            border: '1px solid oklch(1 0 0 / 20%)',
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <label className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
                            년
                          </label>
                          <input
                            type="text"
                            value={editingData.year || ''}
                            onChange={(e) => setEditingData({ ...editingData, year: e.target.value })}
                            className="w-full px-2 py-1 rounded text-sm"
                            style={{
                              background: 'oklch(0.15 0.04 270)',
                              color: 'oklch(0.94 0.015 90)',
                              border: '1px solid oklch(1 0 0 / 20%)',
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
                            월
                          </label>
                          <input
                            type="text"
                            value={editingData.month || ''}
                            onChange={(e) => setEditingData({ ...editingData, month: e.target.value })}
                            className="w-full px-2 py-1 rounded text-sm"
                            style={{
                              background: 'oklch(0.15 0.04 270)',
                              color: 'oklch(0.94 0.015 90)',
                              border: '1px solid oklch(1 0 0 / 20%)',
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
                            일
                          </label>
                          <input
                            type="text"
                            value={editingData.day || ''}
                            onChange={(e) => setEditingData({ ...editingData, day: e.target.value })}
                            className="w-full px-2 py-1 rounded text-sm"
                            style={{
                              background: 'oklch(0.15 0.04 270)',
                              color: 'oklch(0.94 0.015 90)',
                              border: '1px solid oklch(1 0 0 / 20%)',
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
                            시간
                          </label>
                          <input
                            type="text"
                            value={editingData.hour || ''}
                            onChange={(e) => setEditingData({ ...editingData, hour: e.target.value })}
                            className="w-full px-2 py-1 rounded text-sm"
                            style={{
                              background: 'oklch(0.15 0.04 270)',
                              color: 'oklch(0.94 0.015 90)',
                              border: '1px solid oklch(1 0 0 / 20%)',
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                          style={{
                            background: 'oklch(0.50 0.28 290)',
                            color: 'oklch(1 0 0)',
                          }}
                        >
                          <Save size={16} />
                          저장
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 px-3 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                          style={{
                            background: 'oklch(0.25 0.08 280)',
                            color: 'oklch(0.70 0.02 290)',
                          }}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 보기 모드
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                          {profile.name}
                        </p>
                        <p className="text-sm" style={{ color: 'oklch(0.70 0.02 290)' }}>
                          {profile.year}년 {profile.month}월 {profile.day}일 {profile.hour}시
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(profile)}
                          className="p-2 rounded-lg transition-all hover:bg-white/10"
                          style={{ color: 'oklch(0.70 0.18 60)' }}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(profile.id)}
                          className="p-2 rounded-lg transition-all hover:bg-white/10"
                          style={{ color: 'oklch(1 0 0)' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-3 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{
              background: 'oklch(0.25 0.08 280)',
              color: 'oklch(0.70 0.02 290)',
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
