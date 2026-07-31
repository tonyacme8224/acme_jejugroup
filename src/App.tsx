/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, Participant, EmergencyNotice } from './types';
import { INITIAL_PARTICIPANTS, INITIAL_NOTICES } from './data/campData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { ScheduleTab } from './components/ScheduleTab';
import { LivingGuideTab } from './components/LivingGuideTab';
import { HotelTab } from './components/HotelTab';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { StudentPassportModal } from './components/StudentPassportModal';
import { NoticeModal } from './components/NoticeModal';
import { PassportListModal } from './components/PassportListModal';
import { StudentEmergencyModal } from './components/StudentEmergencyModal';
import { UserCheck, ShieldCheck, Lock, Phone, BookOpen, AlertTriangle, FileText, ChevronRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedScheduleDay, setSelectedScheduleDay] = useState<number>(1);

  // Participants persistent state
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem('gec_participants');
      return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS;
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  });

  // Emergency Notices persistent state
  const [notices, setNotices] = useState<EmergencyNotice[]>(() => {
    try {
      const saved = localStorage.getItem('gec_notices');
      return saved ? JSON.parse(saved) : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  // Verified Student User
  const [currentVerifiedUser, setCurrentVerifiedUser] = useState<Participant | null>(() => {
    try {
      const savedId = localStorage.getItem('gec_verified_user_id');
      if (!savedId) return null;
      return INITIAL_PARTICIPANTS.find((p) => p.id === savedId) || null;
    } catch {
      return null;
    }
  });

  // Admin Logged In State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gec_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isStudentPassportModalOpen, setIsStudentPassportModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isPassportListModalOpen, setIsPassportListModalOpen] = useState(false);
  const [isStudentEmergencyModalOpen, setIsStudentEmergencyModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gec_participants', JSON.stringify(participants));
    } catch (e) {
      console.error(e);
    }
  }, [participants]);

  useEffect(() => {
    try {
      localStorage.setItem('gec_notices', JSON.stringify(notices));
    } catch (e) {
      console.error(e);
    }
  }, [notices]);

  const handleVerifyStudent = (student: Participant) => {
    setCurrentVerifiedUser(student);
    try {
      localStorage.setItem('gec_verified_user_id', student.id);
    } catch (e) {
      console.error(e);
    }
    // Open passport detail modal upon successful lookup
    setIsStudentPassportModalOpen(true);
  };

  const handleAdminLogin = (passcode: string) => {
    if (passcode.trim() === '202608') {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem('gec_is_admin', 'true');
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentVerifiedUser(null);
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('gec_verified_user_id');
      localStorage.setItem('gec_is_admin', 'false');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateParticipantRoom = (id: string, roomMY: string, roomSG: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, roomMalaysia: roomMY, roomSingapore: roomSG } : p))
    );
  };

  const handleAddNotice = (newNotice: Omit<EmergencyNotice, 'id' | 'createdAt'>) => {
    const noticeObj: EmergencyNotice = {
      ...newNotice,
      id: 'notice-' + Date.now(),
      createdAt: new Date().toLocaleString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setNotices((prev) => [noticeObj, ...prev]);
  };

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 font-sans antialiased flex flex-col items-center">
      {/* Mobile App Container Frame */}
      <div className="w-full max-w-md min-h-screen bg-slate-100 flex flex-col relative shadow-2xl border-x border-slate-800/50">
        {/* Sticky Header */}
        <Header
          currentVerifiedUser={currentVerifiedUser}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenNoticeModal={() => setIsNoticeModalOpen(true)}
          activeNotices={notices}
        />

        {/* Main Tab View Router */}
        <main className="flex-1 p-3.5 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeTab
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onOpenPassportListModal={() => setIsPassportListModalOpen(true)}
              onOpenEmergencyModal={() => setIsStudentEmergencyModalOpen(true)}
              currentVerifiedUser={currentVerifiedUser}
              isAdminLoggedIn={isAdminLoggedIn}
              onSelectScheduleDay={(dayNum) => setSelectedScheduleDay(dayNum)}
            />
          )}

          {activeTab === 'schedule' && <ScheduleTab initialDay={selectedScheduleDay} />}

          {activeTab === 'guide' && <LivingGuideTab />}

          {activeTab === 'hotel' && (
            <HotelTab
              participants={participants}
              currentVerifiedUser={currentVerifiedUser}
            />
          )}

          {activeTab === 'more' && (
            <div>
              {isAdminLoggedIn ? (
                <AdminPanel
                  participants={participants}
                  onUpdateParticipantRoom={handleUpdateParticipantRoom}
                  notices={notices}
                  onAddNotice={handleAddNotice}
                  onDeleteNotice={handleDeleteNotice}
                  onLogout={handleLogout}
                />
              ) : (
                <div className="space-y-3 pb-20">
                  {/* Passport Info Quick Button */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4 text-indigo-700" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">전체 참가자 여권정보 명단</h3>
                        <p className="text-[11px] text-slate-500">로그인 없이 전체 22명 여권정보 즉시 확인</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPassportListModalOpen(true)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>여권정보 목록 보기</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Student & Guardian Emergency Contacts Quick Button */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                        <Phone className="w-4 h-4 text-rose-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">학생 & 보호자 비상연락망</h3>
                        <p className="text-[11px] text-slate-500">전체 학생 연락처 및 보호자 비상전화 바로 연결</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsStudentEmergencyModalOpen(true)}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>비상연락망 전체보기</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Admin Passcode Login Banner */}
                  <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      <div>
                        <h4 className="font-extrabold text-amber-400 text-xs">인솔자 관리자 전용 기능</h4>
                        <p className="text-[11px] text-slate-300">객실배정 수정 및 긴급 공지 등록</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-colors"
                    >
                      인솔자 관리자 로그인
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          isAdminLoggedIn={isAdminLoggedIn}
        />

        {/* MODALS */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          participants={participants}
          currentVerifiedUser={currentVerifiedUser}
          onVerifyStudent={handleVerifyStudent}
          isAdminLoggedIn={isAdminLoggedIn}
          onAdminLogin={handleAdminLogin}
          onLogout={handleLogout}
        />

        <StudentPassportModal
          isOpen={isStudentPassportModalOpen}
          onClose={() => setIsStudentPassportModalOpen(false)}
          user={currentVerifiedUser}
        />

        <NoticeModal
          isOpen={isNoticeModalOpen}
          onClose={() => setIsNoticeModalOpen(false)}
          notices={notices}
        />

        <PassportListModal
          isOpen={isPassportListModalOpen}
          onClose={() => setIsPassportListModalOpen(false)}
          participants={participants}
        />

        <StudentEmergencyModal
          isOpen={isStudentEmergencyModalOpen}
          onClose={() => setIsStudentEmergencyModalOpen(false)}
          participants={participants}
        />
      </div>
    </div>
  );
}
