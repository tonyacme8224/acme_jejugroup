import React from 'react';
import { CAMP_INFO } from '../data/campData';
import { Participant, EmergencyNotice } from '../types';
import { Bell, ShieldCheck, UserCheck, AlertTriangle, PhoneCall } from 'lucide-react';

interface HeaderProps {
  currentVerifiedUser: Participant | null;
  isAdminLoggedIn: boolean;
  onOpenAuthModal: () => void;
  onOpenNoticeModal: () => void;
  activeNotices: EmergencyNotice[];
}

export const Header: React.FC<HeaderProps> = ({
  currentVerifiedUser,
  isAdminLoggedIn,
  onOpenAuthModal,
  onOpenNoticeModal,
  activeNotices,
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">

      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            GEC
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight tracking-tight text-white flex items-center gap-1.5">
              <span>{CAMP_INFO.titleKr}</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
              MALAYSIA · SINGAPORE 2026
            </p>
          </div>
        </div>

        {/* User Auth Status / Login Button */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-notices"
            onClick={onOpenNoticeModal}
            className="relative p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="공지사항"
          >
            <Bell className="w-5 h-5" />
            {activeNotices.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            )}
          </button>

          <button
            id="btn-auth-status"
            onClick={onOpenAuthModal}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              isAdminLoggedIn
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isAdminLoggedIn ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>관리자 로그인됨</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>관리자 로그인</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
