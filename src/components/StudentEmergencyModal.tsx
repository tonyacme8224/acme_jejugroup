import React, { useState } from 'react';
import { Participant } from '../types';
import { X, Search, Phone, Shield, BedDouble, AlertCircle, Copy, Check } from 'lucide-react';

interface StudentEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
}

export const StudentEmergencyModal: React.FC<StudentEmergencyModalProps> = ({
  isOpen,
  onClose,
  participants,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  if (!isOpen) return null;

  // Camp HQ Contacts
  const hqContacts = [
    { role: '총괄관리자(비상주)', name: '김상윤 대표', phone: '010-3340-6307' },
    { role: '현지총괄관리', name: '최창열 실장', phone: '010-3726-0703' },
    { role: '현지총괄운영', name: '구민서 과장', phone: '010-9312-9926' },
    { role: '제주진흥원', name: '고미영 부장', phone: '010-2336-7713' },
    { role: '제주진흥원', name: '홍승완 주임', phone: '010-3460-8549' },
  ];

  const filteredParticipants = participants.filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      p.nameKr.includes(term) ||
      p.nameEn.toLowerCase().includes(term) ||
      p.guardianName.includes(term) ||
      p.roomMalaysia.includes(term) ||
      p.phone.includes(term)
    );
  });

  const handleCopyPhone = (ph: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ph);
    setCopiedPhone(ph);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-200 relative animate-scaleUp max-h-[90vh] flex flex-col">
        {/* Header & Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <Phone className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">학생 & 보호자 비상연락망</h3>
              <p className="text-xs text-slate-500 font-medium">전체 참가자 학생/보호자 전화 원터치 연결</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camp HQ Contacts Card */}
        <div className="py-3 shrink-0">
          <div className="bg-slate-900 text-white rounded-2xl p-3 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                캠프 총괄 관리자 & 운영진
              </span>
              <span className="text-[10px] text-slate-400">터치시 전화연결</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {hqContacts.map((c, idx) => (
                <a
                  key={idx}
                  href={`tel:${c.phone.replace(/[^0-9]/g, '')}`}
                  className="bg-slate-800/90 hover:bg-slate-800 p-2 rounded-xl border border-slate-700 flex flex-col justify-between transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400">{c.role}</span>
                    <Phone className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="font-bold text-slate-100">{c.name}</span>
                  <span className="font-mono text-[11px] text-emerald-300 font-semibold mt-0.5">{c.phone}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pb-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="학생명 / 보호자명 / 객실번호 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
            />
          </div>
        </div>

        {/* Student & Guardian Phone List */}
        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1 pb-2">
          {filteredParticipants.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">검색 결과가 없습니다.</p>
          ) : (
            filteredParticipants.map((p) => (
              <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${
                        p.isStaff ? 'bg-slate-900' : p.gender === 'F' ? 'bg-rose-500' : 'bg-sky-500'
                      }`}
                    >
                      {p.isStaff ? '인솔자' : p.gender === 'F' ? '여학생' : '남학생'}
                    </span>
                    <h4 className="font-black text-slate-900 text-sm">{p.nameKr}</h4>
                    <span className="text-slate-500 font-medium">({p.nameEn})</span>
                  </div>

                  <span className="font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                    뉴욕 {p.roomMalaysia}
                  </span>
                </div>

                {/* Call buttons grid */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${p.phone.replace(/[^0-9]/g, '')}`}
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 rounded-xl font-bold flex flex-col justify-between transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-emerald-700">
                      <span>학생 본인</span>
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="font-mono text-xs font-black text-emerald-900 mt-1">{p.phone}</span>
                  </a>

                  <a
                    href={`tel:${p.guardianPhone.replace(/[^0-9]/g, '')}`}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-950 rounded-xl font-bold flex flex-col justify-between transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-rose-700">
                      <span>보호자 ({p.guardianName}, {p.guardianRelation})</span>
                      <Phone className="w-3.5 h-3.5 text-rose-600" />
                    </div>
                    <span className="font-mono text-xs font-black text-rose-900 mt-1">{p.guardianPhone}</span>
                  </a>
                </div>

                {p.allergies && p.allergies !== '없음' && (
                  <p className="text-[11px] text-rose-700 font-bold bg-rose-100/50 p-1.5 rounded-lg border border-rose-200/60">
                    ⚠️ 건강/알레르기 특이사항: {p.allergies}
                  </p>
                )}
              </div>
            ))
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
