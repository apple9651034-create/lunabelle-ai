/**
 * 프로필 선택 모달
 * 여러 사주 프로필 중 하나를 선택하거나 새로 추가
 */
import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { getAllProfiles, addProfile, deleteProfile, activateProfile, SajuProfile } from '@/lib/profileManager';

interface ProfileSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileChange?: (profile: SajuProfile) => void;
}

export default function ProfileSelector({ isOpen, onClose, onProfileChange }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<SajuProfile[]>(getAllProfiles());
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    month: '',
    day: '',
    hour: '',
    gender: 'M',
  });

  const handleAddProfile = () => {
    const { name, year, month, day, hour } = formData;
    
    if (!name.trim()) {
      alert('프로필 이름을 입력해주세요');
      return;
    }

    if (!year || !month || !day || !hour) {
      alert('생년월일과 시간을 모두 입력해주세요');
      return;
    }

    // 새 프로필 추가 (사용자가 입력한 정보로)
    const newProfile = addProfile({
      name: name.trim(),
      year,
      month,
      day,
      hour,
      gender: formData.gender,
    });

    setProfiles(getAllProfiles());
    setFormData({ name: '', year: '', month: '', day: '', hour: '', gender: 'M' });
    setShowAddForm(false);
    onProfileChange?.(newProfile);
  };

  const handleSelectProfile = (profileId: string) => {
    activateProfile(profileId);
    const updated = getAllProfiles();
    setProfiles(updated);
    const selected = updated.find(p => p.id === profileId);
    if (selected) {
      onProfileChange?.(selected);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    if (confirm('이 프로필을 삭제하시겠습니까?')) {
      deleteProfile(profileId);
      const updated = getAllProfiles();
      setProfiles(updated);
      if (updated.length > 0) {
        onProfileChange?.(updated[0]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto" style={{
        background: 'oklch(0.12 0.03 270)',
        border: '1px solid oklch(1 0 0 / 10%)',
      }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: 'oklch(0.94 0.015 90)' }}>
            📿 사주 프로필
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:opacity-70"
            style={{ color: 'oklch(0.70 0.02 290)' }}
          >
            ✕
          </button>
        </div>

        {/* 프로필 목록 */}
        {!showAddForm && (
          <>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  className="w-full p-3 rounded-lg text-left transition-all hover:scale-105 flex items-center justify-between"
                  style={{
                    background: profile.isActive ? 'oklch(0.50 0.28 290)' : 'oklch(0.20 0.05 270)',
                    border: profile.isActive ? '2px solid oklch(0.78 0.15 85)' : '1px solid oklch(1 0 0 / 10%)',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold" style={{ color: 'oklch(0.94 0.015 90)' }}>
                      {profile.name}
                    </p>
                    <p className="text-xs" style={{ color: 'oklch(0.70 0.02 290)' }}>
                      {profile.year}년 {profile.month}월 {profile.day}일 {profile.hour}시
                    </p>
                  </div>
                  <div className="flex gap-2 ml-2 flex-shrink-0">
                    {profile.isActive && (
                      <Check size={18} style={{ color: 'oklch(0.78 0.15 85)' }} />
                    )}
                    {profiles.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProfile(profile.id);
                        }}
                        className="p-1 hover:opacity-70 transition-opacity"
                        style={{ color: 'oklch(0.70 0.18 60)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: 'oklch(0.20 0.05 270)',
                color: 'oklch(0.78 0.15 85)',
                border: '1px solid oklch(0.78 0.15 85 / 30%)',
              }}
            >
              <Plus size={18} />
              새 프로필 추가
            </button>
          </>
        )}

        {/* 프로필 추가 폼 */}
        {showAddForm && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold" style={{ color: 'oklch(0.70 0.02 290)' }}>
                프로필 이름
              </label>
              <input
                type="text"
                placeholder="예: 아내, 딸, 아들"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none mt-1"
                style={{
                  background: 'oklch(0.20 0.05 270)',
                  color: 'oklch(0.94 0.015 90)',
                  border: '1px solid oklch(1 0 0 / 15%)',
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold" style={{ color: 'oklch(0.70 0.02 290)' }}>
                생년월일
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <input
                  type="number"
                  placeholder="년"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="px-2 py-2 rounded-lg text-sm focus:outline-none"
                  style={{
                    background: 'oklch(0.20 0.05 270)',
                    color: 'oklch(0.94 0.015 90)',
                    border: '1px solid oklch(1 0 0 / 15%)',
                  }}
                />
                <input
                  type="number"
                  placeholder="월"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="px-2 py-2 rounded-lg text-sm focus:outline-none"
                  style={{
                    background: 'oklch(0.20 0.05 270)',
                    color: 'oklch(0.94 0.015 90)',
                    border: '1px solid oklch(1 0 0 / 15%)',
                  }}
                />
                <input
                  type="number"
                  placeholder="일"
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="px-2 py-2 rounded-lg text-sm focus:outline-none"
                  style={{
                    background: 'oklch(0.20 0.05 270)',
                    color: 'oklch(0.94 0.015 90)',
                    border: '1px solid oklch(1 0 0 / 15%)',
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold" style={{ color: 'oklch(0.70 0.02 290)' }}>
                  시간
                </label>
                <input
                  type="number"
                  placeholder="시간"
                  value={formData.hour}
                  onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                  className="w-full px-2 py-2 rounded-lg text-sm focus:outline-none mt-1"
                  style={{
                    background: 'oklch(0.20 0.05 270)',
                    color: 'oklch(0.94 0.015 90)',
                    border: '1px solid oklch(1 0 0 / 15%)',
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold" style={{ color: 'oklch(0.70 0.02 290)' }}>
                  성별
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-2 py-2 rounded-lg text-sm focus:outline-none mt-1"
                  style={{
                    background: 'oklch(0.20 0.05 270)',
                    color: 'oklch(0.94 0.015 90)',
                    border: '1px solid oklch(1 0 0 / 15%)',
                  }}
                >
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddProfile}
                className="flex-1 py-2 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: 'oklch(0.50 0.28 290)',
                  color: 'oklch(1 0 0)',
                }}
              >
                추가
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', year: '', month: '', day: '', hour: '', gender: 'M' });
                }}
                className="flex-1 py-2 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: 'oklch(0.20 0.05 270)',
                  color: 'oklch(0.70 0.02 290)',
                  border: '1px solid oklch(1 0 0 / 10%)',
                }}
              >
                취소
              </button>
            </div>
          </div>
        )}

        {!showAddForm && (
          <button
            onClick={onClose}
            className="w-full mt-3 py-2 rounded-lg font-semibold text-sm transition-all"
            style={{
              background: 'oklch(0.50 0.28 290)',
              color: 'oklch(1 0 0)',
            }}
          >
            완료
          </button>
        )}
      </div>
    </div>
  );
}
