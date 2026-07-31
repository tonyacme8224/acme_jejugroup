import React, { useState } from 'react';
import { Participant } from '../types';
import { ShieldCheck, UserCheck, Lock, X, AlertCircle, ArrowRight, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  currentVerifiedUser: Participant | null;
  onVerifyStudent: (student: Participant) => void;
  isAdminLoggedIn: boolean;
  onAdminLogin: (passcode: string) => boolean;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  participants,
  currentVerifiedUser,
  onVerifyStudent,
  isAdminLoggedIn,
  onAdminLogin,
  onLogout,
}) => {
  const [authMode, setAuthMode] = useState<'student' | 'admin'>('student');
  const [studentName, setStudentName] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStudentLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const nameClean = studentName.trim();
    const phoneClean = phoneLast4.trim();

    if (!nameClean || !phoneClean) {
      setErrorMessage('한글 이름과 휴대폰 번호 뒤 4자리를 모두 입력해주세요.');
      return;
    }

    const matched = participants.find(
      (p) => p.nameKr === nameClean && p.phoneLast4 === phoneClean
    );

    if (matched) {
      onVerifyStudent(matched);
      onClose();
    } else {
      setErrorMessage('일치하는 참가자 정보를 찾을 수 없습니다. 이름과 전화번호 뒤 4자리를 확인해주세요.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const success = onAdminLogin(adminPasscode);
    if (success) {
      onClose();
    } else {
      setErrorMessage('비밀번호가 일치하지 않습니다. (기본 관리자 비밀번호: 202608)');
    }
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

        {/* Header Tabs */}
        <div className="text-center mb-5">
          <h3 className="text-lg font-black text-slate-900">본인 인증 및 접속</h3>
          <p className="text-xs text-slate-500 mt-1">개인정보 보호를 위해 인증 후 조회 가능합니다.</p>

          <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 mt-4 text-xs font-bold">
            <button
              onClick={() => {
                setAuthMode('student');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1 ${
                authMode === 'student' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>학생 본인 조회</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('admin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1 ${
                authMode === 'admin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>인솔자 로그인</span>
            </button>
          </div>
        </div>

        {/* Currently logged in alert */}
        {(currentVerifiedUser || isAdminLoggedIn) && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-emerald-900">
                {isAdminLoggedIn ? '인솔자/관리자 상태' : `${currentVerifiedUser?.nameKr} 학생 인증 완료`}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-2.5 py-1 rounded-lg"
            >
              로그아웃
            </button>
          </div>
        )}

        {/* STUDENT LOOKUP FORM */}
        {authMode === 'student' && (
          <form onSubmit={handleStudentLookup} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">한글 성명</label>
              <input
                type="text"
                placeholder="예: 김가연"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">휴대폰 번호 뒤 4자리</label>
              <input
                type="password"
                maxLength={4}
                placeholder="예: 0371"
                value={phoneLast4}
                onChange={(e) => setPhoneLast4(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 tracking-widest"
              />
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs flex items-start space-x-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <span>본인 여권 및 객실 정보 확인</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ADMIN LOGIN FORM */}
        {authMode === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">관리자 비밀번호 (6자리)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="비밀번호 입력 (기본: 202608)"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs flex items-start space-x-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>관리자 마스터 접속</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
