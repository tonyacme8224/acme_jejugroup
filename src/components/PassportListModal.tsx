import React, { useState } from 'react';
import { Participant } from '../types';
import { X, Search, Copy, Check, FileText, UserCheck, AlertCircle, ShieldAlert } from 'lucide-react';

interface PassportListModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
}

export const PassportListModal: React.FC<PassportListModalProps> = ({
  isOpen,
  onClose,
  participants,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'staff'>('all');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredParticipants = participants.filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      p.nameKr.includes(term) ||
      p.nameEn.toLowerCase().includes(term) ||
      p.passportNo.toLowerCase().includes(term) ||
      p.roomMalaysia.includes(term);

    const matchesRole =
      roleFilter === 'all' ? true : roleFilter === 'student' ? !p.isStaff : p.isStaff;

    return matchesSearch && matchesRole;
  });

  // Passport expiry warning check (< 6 months from Aug 2026)
  const isPassportExpiringSoon = (expiryStr: string) => {
    try {
      const parts = expiryStr.split('.');
      if (parts.length < 3) return false;
      const expDate = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
      const travelDate = new Date('2026-08-10');
      const diffMonths = (expDate.getTime() - travelDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return diffMonths < 6;
    } catch {
      return false;
    }
  };

  // Copy Airline name list
  const handleCopyAirlineFormat = () => {
    const list = filteredParticipants
      .map((p) => `${p.nameEn.toUpperCase()} / ${p.passportNo} (${p.nameKr})`)
      .join('\n');

    navigator.clipboard.writeText(list);
    setCopiedType('airline');
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Copy full table text
  const handleCopyFullText = () => {
    const header = `[글로벌 영어 챌린지 캠프 참가자 여권명단 (총 ${filteredParticipants.length}명)]\n\n`;
    const body = filteredParticipants
      .map(
        (p, idx) =>
          `${idx + 1}. ${p.nameKr} (${p.nameEn}) | 여권: ${p.passportNo} | 생년월일: ${p.birthDate} | 발급: ${p.issueDate} | 만료: ${p.expiryDate} | 객실: ${p.roomMalaysia}`
      )
      .join('\n');

    navigator.clipboard.writeText(header + body);
    setCopiedType('full');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-200 relative animate-scaleUp max-h-[90vh] flex flex-col">
        {/* Header & Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">전체 참가자 여권정보</h3>
              <p className="text-xs text-slate-500 font-medium">
                로그인 없이 전체 {participants.length}명 여권정보 즉시 조회
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Role Filter */}
        <div className="py-3 space-y-2 shrink-0">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="이름 / 영문명 / 여권번호 / 객실 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 shrink-0"
            >
              <option value="all">전체 ({participants.length}명)</option>
              <option value="student">학생 ({participants.filter((p) => !p.isStaff).length}명)</option>
              {participants.some((p) => p.isStaff) && (
                <option value="staff">인솔자 ({participants.filter((p) => p.isStaff).length}명)</option>
              )}
            </select>
          </div>

          {/* Quick Copy Action Buttons */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleCopyAirlineFormat}
              className="py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-bold rounded-xl flex items-center justify-center space-x-1 transition-colors"
            >
              {copiedType === 'airline' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">항공사제출용 복사완료</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                  <span>항공발권용 명단 복사</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyFullText}
              className="py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold rounded-xl flex items-center justify-center space-x-1 transition-colors"
            >
              {copiedType === 'full' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">전체 여권목록 복사완료</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>여권 전체텍스트 복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Participant Cards List */}
        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1 pb-2">
          {filteredParticipants.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">검색 결과가 없습니다.</p>
          ) : (
            filteredParticipants.map((p) => {
              const expRisk = isPassportExpiringSoon(p.expiryDate);

              return (
                <div
                  key={p.id}
                  className={`bg-slate-50 border rounded-2xl p-3.5 text-xs space-y-2 transition-all ${
                    expRisk ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                  }`}
                >
                  {/* Top Header Row */}
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${
                          p.isStaff ? 'bg-slate-900' : p.gender === 'F' ? 'bg-rose-500' : 'bg-sky-500'
                        }`}
                      >
                        {p.isStaff ? '인솔자' : p.gender === 'F' ? '여학생' : '남학생'}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm">{p.nameKr}</h4>
                      <span className="text-slate-500 font-semibold">({p.nameEn})</span>
                    </div>

                    <span className="font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                      {p.roomMalaysia}
                    </span>
                  </div>

                  {/* Passport Info Grid */}
                  <div className="grid grid-cols-2 gap-2 text-slate-800">
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">여권번호</span>
                      <span className="font-mono font-black text-indigo-950 text-sm">{p.passportNo}</span>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">생년월일</span>
                      <span className="font-mono font-bold text-slate-900">{p.birthDate}</span>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">발급일자</span>
                      <span className="font-mono text-slate-700">{p.issueDate}</span>
                    </div>

                    <div
                      className={`p-2 rounded-xl border ${
                        expRisk
                          ? 'bg-rose-100/70 border-rose-300 text-rose-900'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block font-medium">만료일자</span>
                      <span className="font-mono font-bold">
                        {p.expiryDate} {expRisk && '⚠️ 만료주의'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
        >
          닫기
        </button>
      </div>
    </div>
  );
};
