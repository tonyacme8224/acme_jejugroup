import React, { useState } from 'react';
import { Participant } from '../types';
import { UserCheck, Eye, EyeOff, Copy, Check, X, Shield, Phone, BedDouble } from 'lucide-react';

interface StudentPassportModalProps {
  user: Participant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentPassportModal: React.FC<StudentPassportModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [showFullPassport, setShowFullPassport] = useState(false);
  const [showFullPhone, setShowFullPhone] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const maskPassport = (no: string) => {
    if (showFullPassport) return no;
    if (!no || no.length < 5) return '••••••••';
    return no.substring(0, 4) + '••••' + no.substring(no.length - 1);
  };

  const maskPhone = (ph: string) => {
    if (showFullPhone) return ph;
    return ph.replace(/(\d{3})-\d{4}-(\d{4})/, '$1-••••-$2');
  };

  const handleCopyInfo = () => {
    const text = `[글로벌 영어 챌린지 캠프 참가자 정보]
이름: ${user.nameKr} (${user.nameEn})
여권번호: ${user.passportNo}
생년월일: ${user.birthDate}
연락처: ${user.phone}
배정객실: 뉴욕호텔 ${user.roomMalaysia} (룸메이트: ${user.roommateKr})
보호자: ${user.guardianName} (${user.guardianRelation}, ${user.guardianPhone})`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{user.nameKr} 학생 본인 정보</h3>
            <p className="text-xs text-slate-500 font-medium">{user.nameEn}</p>
          </div>
        </div>

        {/* Privacy Masking Toggle Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-3 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">여권 및 전화번호 정보 보안 가림</span>
          <button
            onClick={() => {
              setShowFullPassport(!showFullPassport);
              setShowFullPhone(!showFullPhone);
            }}
            className="flex items-center space-x-1 text-emerald-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100"
          >
            {showFullPassport ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showFullPassport ? '가리기' : '전체 보기'}</span>
          </button>
        </div>

        {/* Passport Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 shadow-md space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start border-b border-slate-800 pb-2">
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">PASSPORT INFORMATION</p>
              <p className="text-sm font-black text-white">{user.nameEn}</p>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
              {user.gender === 'F' ? '여성 (F)' : '남성 (M)'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-[10px] text-slate-400">여권번호</p>
              <p className="font-mono font-bold text-amber-300 text-sm">{maskPassport(user.passportNo)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">생년월일</p>
              <p className="font-mono font-bold text-slate-200">{user.birthDate}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">발급일자</p>
              <p className="font-mono text-slate-300">{user.issueDate}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">만료일자</p>
              <p className="font-mono text-slate-300">{user.expiryDate}</p>
            </div>
          </div>
        </div>

        {/* Room & Emergency Details */}
        <div className="space-y-2 mt-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900 mb-1">
              <BedDouble className="w-4 h-4 text-emerald-600" />
              <span>배정 숙소 및 룸메이트</span>
            </div>
            <p className="text-slate-800">
              <strong>말레이시아 (뉴욕호텔):</strong> {user.roomMalaysia}
            </p>
            <p className="text-slate-800">
              <strong>룸메이트:</strong> {user.roommateKr}
            </p>
            <p className="text-slate-800">
              <strong>싱가포르 (머큐어):</strong> {user.roomSingapore}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900 mb-1">
              <Phone className="w-4 h-4 text-rose-600" />
              <span>연락처 및 비상연락</span>
            </div>
            <p className="text-slate-800">
              <strong>본인 연락처:</strong> {maskPhone(user.phone)}
            </p>
            <p className="text-slate-800">
              <strong>보호자 비상연락:</strong> {user.guardianName} ({user.guardianRelation}) - {user.guardianPhone}
            </p>
            {user.allergies && (
              <p className="text-rose-700 font-semibold pt-1">
                ⚠️ 알레르기/건강특이: {user.allergies}
              </p>
            )}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopyInfo}
          className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">내 정보 복사 완료</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>개인 정보 전체 복사</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
