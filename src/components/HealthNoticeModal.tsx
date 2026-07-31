import React from 'react';
import { X, HeartPulse, AlertTriangle, ShieldAlert, Phone, UserCheck, CheckCircle2 } from 'lucide-react';
import { Participant } from '../types';

interface HealthNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
}

export const HealthNoticeModal: React.FC<HealthNoticeModalProps> = ({
  isOpen,
  onClose,
  participants,
}) => {
  if (!isOpen) return null;

  // Filter participants who have allergies/symptoms defined (not '없음')
  const healthCareStudents = participants.filter(
    (p) => p.allergies && p.allergies !== '없음'
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">학생 건강 특이사항 & 알레르기 관리</h2>
              <p className="text-[11px] text-rose-100">학생 {healthCareStudents.length}명 관리 정보 (증세 및 주의사항)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/50 flex-1">
          {/* Top Notice */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 space-y-1.5 text-amber-900">
            <div className="flex items-center space-x-2 font-bold text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>인솔자 및 식사 관리 주의사항</span>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              현지 식사(해산물, 유제품, 과일 등) 제공 및 이동/에어컨 가동 시 아래 학생들의 특이사항을 사전 확인하고 세심하게 가이드를 진행해 주세요.
            </p>
          </div>

          {/* Student Health Cards */}
          <div className="space-y-3">
            {healthCareStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 hover:border-rose-300 transition-all"
              >
                {/* Student Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-slate-900">{student.nameKr}</span>
                    <span className="text-[11px] text-slate-400 font-medium">({student.nameEn})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {student.roomMalaysia}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    건강 유의
                  </span>
                </div>

                {/* Details Grid */}
                <div className="space-y-2">
                  {/* Allergy Name */}
                  <div className="flex items-start space-x-2 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-900 text-[11px]">알레르기 / 질환:</span>
                      <p className="font-extrabold text-rose-700 text-xs mt-0.5">{student.allergies}</p>
                    </div>
                  </div>

                  {/* Symptoms */}
                  {student.symptoms && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                      <span className="font-bold text-slate-700 text-[11px]">🚨 주요 증세:</span>
                      <p className="text-slate-800 text-[11px] leading-relaxed">{student.symptoms}</p>
                    </div>
                  )}

                  {/* Precautions */}
                  {student.precautions && (
                    <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 space-y-0.5">
                      <span className="font-bold text-emerald-800 text-[11px]">💡 관리 및 주의사항:</span>
                      <p className="text-emerald-900 text-[11px] leading-relaxed">{student.precautions}</p>
                    </div>
                  )}
                </div>

                {/* Guardian Contact Row */}
                <div className="pt-1 flex items-center justify-between text-[11px] bg-slate-50 px-3 py-2 rounded-xl">
                  <div className="text-slate-600">
                    비상보호자: <span className="font-bold text-slate-800">{student.guardianName}</span> ({student.guardianRelation})
                  </div>
                  <a
                    href={`tel:${student.guardianPhone}`}
                    className="inline-flex items-center space-x-1 font-bold text-rose-600 bg-white border border-rose-200 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-rose-500" />
                    <span>보호자 통화</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
