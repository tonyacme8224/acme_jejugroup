import React, { useState, useEffect } from 'react';
import { CAMP_INFO, DAY_SCHEDULES } from '../data/campData';
import { TabType, Participant } from '../types';
import { CompanyLogo } from './CompanyLogo';
import {
  Calendar,
  Phone,
  Plane,
  Building2,
  FileCheck,
  ShieldCheck,
  UserCheck,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  MessageCircle,
  AlertCircle,
  Users,
  Copy,
  Check,
  HeartPulse,
  ShieldAlert,
  Lock,
} from 'lucide-react';

interface HomeTabProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenAuthModal: () => void;
  onOpenPassportListModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenHealthModal?: () => void;
  currentVerifiedUser: Participant | null;
  isAdminLoggedIn: boolean;
  onSelectScheduleDay?: (dayNumber: number) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onNavigateTab,
  onOpenAuthModal,
  onOpenPassportListModal,
  onOpenEmergencyModal,
  onOpenHealthModal,
  currentVerifiedUser,
  isAdminLoggedIn,
  onSelectScheduleDay,
}) => {
  // Selected preview date for "Today's Schedule" card
  // Default to Day 1 (Aug 10) or current camp date if within range
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // D-Day calculation relative to Aug 10, 2026
  const targetDate = new Date('2026-08-10T06:30:00');
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const dDayText = diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? 'D-DAY' : `D+${Math.abs(diffDays)}`;

  const currentDaySchedule = DAY_SCHEDULES.find((d) => d.dayNumber === selectedDayNum) || DAY_SCHEDULES[0];

  const handleCopyPhone = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div id="home-tab-content" className="space-y-4 pb-20">
      {/* CONFIDENTIAL NOTICE BANNER */}
      <div className="bg-rose-50 border border-rose-200/90 rounded-xl p-3 px-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2.5">
          <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-md tracking-wide shrink-0 shadow-2xs flex items-center gap-1">
            <Lock className="w-3 h-3 inline" />
            대외비
          </span>
          <span className="text-xs font-extrabold text-rose-900 leading-tight">
            본 핸드북 링크 외부유출 절대금지 (참가학생에 공유금지)
          </span>
        </div>
        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
      </div>

      {/* 1. TOP BRAND HERO CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-4 top-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wider uppercase">
          10박 12일 연수
        </div>

        <p className="text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
          {CAMP_INFO.titleEn}
        </p>
        <h2 className="text-xl font-black tracking-tight text-white mb-2">
          {CAMP_INFO.titleKr}
        </h2>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-medium mb-4">
          <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
            MON 8. 10 ~ 8. 21. FRI
          </span>
          <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 text-emerald-300 font-semibold">
            MALAYSIA · SINGAPORE
          </span>
        </div>

        {/* Organizations Badges */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px]">
          {CAMP_INFO.organizations.map((org, idx) => (
            <div key={idx} className="bg-slate-800/40 p-1.5 rounded-lg border border-slate-700/30">
              <p className="text-[9px] text-slate-400">{org.role}</p>
              <p className="font-semibold text-slate-200 truncate">{org.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. D-DAY CORE CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="bg-red-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-xs">
              {dDayText}
            </span>
            <span className="text-xs font-bold text-slate-700">출국 안내</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">8월 10일 월요일</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
          <div className="flex items-start space-x-2 text-xs">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">8월 10일 오전 6시 30분 (정시 집결)</span>
            </div>
          </div>
          <div className="flex items-start space-x-2 text-xs">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-slate-700 font-medium">
              {CAMP_INFO.assemblyInfo.location}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('schedule')}
          className="w-full mt-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1 transition-colors"
        >
          <span>출국 집합 및 세부사항 확인</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. TODAY'S SCHEDULE (DATE AUTO / SELECTOR CARD) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">오늘의 일정</h3>
          </div>
          {/* Day Date Selector */}
          <select
            value={selectedDayNum}
            onChange={(e) => setSelectedDayNum(Number(e.target.value))}
            className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {DAY_SCHEDULES.map((day) => (
              <option key={day.dayNumber} value={day.dayNumber}>
                Day {day.dayNumber} ({day.dateStr.split(' ')[0]} {day.dateStr.split(' ')[1]})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-extrabold text-emerald-900">{currentDaySchedule.dateStr}</span>
            <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold">
              {currentDaySchedule.tag}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800">{currentDaySchedule.title}</p>
        </div>

        {/* Highlights List */}
        <div className="space-y-2 mb-3">
          {currentDaySchedule.items.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className={`text-xs p-2.5 rounded-lg flex items-start space-x-2 ${
                item.isHighlight
                  ? 'bg-amber-50 border border-amber-200/80 font-medium text-slate-900'
                  : 'bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-[11px] font-bold text-slate-500 shrink-0 min-w-[42px]">
                {item.time || '주요'}
              </span>
              <span className="flex-1">{item.activity}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (onSelectScheduleDay) onSelectScheduleDay(selectedDayNum);
            onNavigateTab('schedule');
          }}
          className="w-full text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 py-1 flex items-center justify-center space-x-1"
        >
          <span>Day {selectedDayNum} 전체 일정표 보기</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. HEALTH & ALLERGY NOTICE QUICK CARD */}
      <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-5 h-5 text-rose-100" />
            <div>
              <h3 className="text-sm font-black tracking-tight">학생 건강 특이사항 & 알레르기 관리</h3>
              <p className="text-[11px] text-rose-100 font-medium">김미소, 김현경 등 학생별 증세 및 주의사항</p>
            </div>
          </div>
          <button
            onClick={onOpenHealthModal}
            className="bg-white text-rose-700 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs hover:bg-rose-50 transition-colors shrink-0"
          >
            확인하기
          </button>
        </div>
      </div>

      {/* 5. EMERGENCY CALL QUICK ACTIONS */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-slate-900">긴급 연락처 (바로연결)</h3>
          </div>
          <button
            onClick={onOpenEmergencyModal}
            className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg hover:bg-rose-100 transition-colors"
          >
            학생/보호자 비상연락망
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {CAMP_INFO.emergencyContacts.map((contact, idx) => {
            const isPhone = !('isLink' in contact && (contact as { isLink?: boolean }).isLink);
            return (
              <a
                key={idx}
                href={isPhone ? `tel:${contact.phone.replace(/[^0-9+]/g, '')}` : contact.phone}
                target={isPhone ? '_self' : '_blank'}
                rel="noreferrer"
                className={`p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between relative group ${
                  contact.primary
                    ? 'bg-red-50/70 border-red-200 text-slate-900 hover:bg-red-100/70'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div>
                  <p className="text-[10px] text-slate-500 font-medium truncate">{contact.label}</p>
                  <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{contact.name}</p>
                </div>
                <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs font-semibold text-emerald-700">
                  <span className="truncate">{contact.phone}</span>
                  {isPhone && (
                    <button
                      onClick={(e) => handleCopyPhone(contact.phone, e)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded"
                      title="복사"
                    >
                      {copiedPhone === contact.phone ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* 5. QUICK SHORTCUTS GRID */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-3">빠른 메뉴</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <button
            onClick={() => onNavigateTab('schedule')}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col items-center justify-center transition-colors border border-slate-100"
          >
            <Calendar className="w-5 h-5 text-indigo-600 mb-1" />
            <span className="text-[11px] font-semibold text-slate-800">전체일정</span>
          </button>

          <button
            onClick={() => onNavigateTab('schedule')}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col items-center justify-center transition-colors border border-slate-100"
          >
            <Plane className="w-5 h-5 text-sky-600 mb-1" />
            <span className="text-[11px] font-semibold text-slate-800">항공편</span>
          </button>

          <button
            onClick={() => onNavigateTab('hotel')}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col items-center justify-center transition-colors border border-slate-100"
          >
            <Building2 className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-[11px] font-semibold text-slate-800">호텔</span>
          </button>

          <button
            onClick={() => onNavigateTab('hotel')}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col items-center justify-center transition-colors border border-slate-100"
          >
            <Users className="w-5 h-5 text-amber-600 mb-1" />
            <span className="text-[11px] font-semibold text-slate-800">객실배정</span>
          </button>

          <button
            onClick={() => onNavigateTab('guide')}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col items-center justify-center transition-colors border border-slate-100"
          >
            <FileCheck className="w-5 h-5 text-teal-600 mb-1" />
            <span className="text-[11px] font-semibold text-slate-800">준비물</span>
          </button>

          <button
            onClick={onOpenPassportListModal}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col items-center justify-center transition-colors border border-slate-100"
          >
            <UserCheck className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-[11px] font-semibold text-slate-800">여권정보</span>
          </button>

          <button
            onClick={onOpenEmergencyModal}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col items-center justify-center transition-colors border border-slate-100"
          >
            <Phone className="w-5 h-5 text-rose-600 mb-1" />
            <span className="text-[11px] font-semibold text-slate-800">비상연락</span>
          </button>

          <button
            onClick={() => onNavigateTab('guide')}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col items-center justify-center transition-colors border border-slate-100"
          >
            <ShieldCheck className="w-5 h-5 text-purple-600 mb-1" />
            <span className="text-[11px] font-semibold text-slate-800">안전수칙</span>
          </button>
        </div>
      </div>

      {/* FOOTER COMPANY LOGO */}
      <CompanyLogo />
    </div>
  );
};
