import React, { useState } from 'react';
import { Participant, EmergencyNotice } from '../types';
import {
  ShieldCheck,
  Search,
  Copy,
  Check,
  Phone,
  Eye,
  EyeOff,
  AlertTriangle,
  Edit3,
  Plus,
  Trash2,
  Lock,
  UserCheck,
  FileSpreadsheet,
  AlertCircle,
  Download,
  Bell,
  BedDouble,
} from 'lucide-react';

interface AdminPanelProps {
  participants: Participant[];
  onUpdateParticipantRoom: (id: string, roomMY: string, roomSG: string) => void;
  notices: EmergencyNotice[];
  onAddNotice: (notice: Omit<EmergencyNotice, 'id' | 'createdAt'>) => void;
  onDeleteNotice: (id: string) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  participants,
  onUpdateParticipantRoom,
  notices,
  onAddNotice,
  onDeleteNotice,
  onLogout,
}) => {
  const [adminTab, setAdminTab] = useState<'participants' | 'emergency' | 'editor' | 'notices'>('participants');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'staff'>('all');
  const [showFullData, setShowFullData] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Edit Room State
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
  const [editRoomMY, setEditRoomMY] = useState('');
  const [editRoomSG, setEditRoomSG] = useState('');

  // Add Notice State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeUrgent, setNewNoticeUrgent] = useState(false);

  // Filtered Participants
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.nameKr.includes(searchTerm.trim()) ||
      p.nameEn.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      p.passportNo.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      p.roomMalaysia.includes(searchTerm.trim());

    const matchesRole =
      filterRole === 'all' ? true : filterRole === 'student' ? !p.isStaff : p.isStaff;

    return matchesSearch && matchesRole;
  });

  // Expiry Warning Check: Travel date Aug 2026 -> expiry before Feb 2027 is risky
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

  const maskPassport = (no: string) => {
    if (showFullData) return no;
    if (!no || no.length < 5) return '••••••••';
    return no.substring(0, 4) + '••••' + no.substring(no.length - 1);
  };

  const maskPhone = (ph: string) => {
    if (showFullData) return ph;
    return ph.replace(/(\d{3})-\d{4}-(\d{4})/, '$1-••••-$2');
  };

  // Copy Airline Format Name list (e.g., GAYEON KIM / KIM GAYEON)
  const handleCopyAirlineNames = () => {
    const names = participants
      .filter((p) => !p.isStaff)
      .map((p) => `${p.nameEn} (${p.passportNo})`)
      .join('\n');

    navigator.clipboard.writeText(names);
    setCopiedText('airline');
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Save Room Edit
  const handleSaveRoom = (p: Participant) => {
    onUpdateParticipantRoom(p.id, editRoomMY || p.roomMalaysia, editRoomSG || p.roomSingapore);
    setEditingParticipantId(null);
  };

  // Handle Add Notice Submit
  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;

    onAddNotice({
      title: newNoticeTitle.trim(),
      content: newNoticeContent.trim(),
      isUrgent: newNoticeUrgent,
      author: '인솔자 본부',
    });

    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticeUrgent(false);
  };

  return (
    <div id="admin-panel-content" className="space-y-4 pb-20">
      {/* Admin Warning Top Card */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-black text-white">인솔자 / 관리자 마스터 대시보드</h2>
          </div>
          <button
            onClick={onLogout}
            className="text-xs bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 font-bold px-2.5 py-1 rounded-lg border border-rose-500/40"
          >
            관리자 로그아웃
          </button>
        </div>

        <p className="text-xs text-slate-300">
          ⚠️ 개인정보 보호: 참가자 22명의 여권번호, 연락처, 보호자 정보가 포함되어 있습니다. 단체방 외부 유출에 유의바랍니다.
        </p>

        {/* Global Privacy Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400">민감정보 (여권/전화번호) 전체 마스킹 해제:</span>
          <button
            onClick={() => setShowFullData(!showFullData)}
            className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition-colors ${
              showFullData
                ? 'bg-amber-400 text-slate-950 font-extrabold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {showFullData ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showFullData ? '전체 공개 중' : '가림 설정 중'}</span>
          </button>
        </div>
      </div>

      {/* Admin Subtabs Navigation */}
      <div className="bg-slate-100 p-1 rounded-2xl flex space-x-1 text-xs font-bold text-slate-700">
        <button
          onClick={() => setAdminTab('participants')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            adminTab === 'participants' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-950'
          }`}
        >
          여권/참가자 (22명)
        </button>
        <button
          onClick={() => setAdminTab('emergency')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            adminTab === 'emergency' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-950'
          }`}
        >
          비상연락망
        </button>
        <button
          onClick={() => setAdminTab('editor')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            adminTab === 'editor' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-950'
          }`}
        >
          객실수정
        </button>
        <button
          onClick={() => setAdminTab('notices')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            adminTab === 'notices' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-950'
          }`}
        >
          공지등록
        </button>
      </div>

      {/* TAB 1: MASTER PARTICIPANTS & PASSPORT LIST */}
      {adminTab === 'participants' && (
        <div className="space-y-3">
          {/* Search & Export Controls */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="이름 / 영문 / 여권 / 객실번호 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                />
              </div>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800"
              >
                <option value="all">전체 (22명)</option>
                <option value="student">학생 (20명)</option>
                <option value="staff">인솔자 (2명)</option>
              </select>
            </div>

            <button
              onClick={handleCopyAirlineNames}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
            >
              {copiedText === 'airline' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">항공사 발권용 영문 성명 복사 완료</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>항공사 제출용 학생 영문명+여권번호 복사</span>
                </>
              )}
            </button>
          </div>

          {/* Participant Cards List */}
          <div className="space-y-2">
            {filteredParticipants.map((p) => {
              const expRisk = isPassportExpiringSoon(p.expiryDate);

              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl p-3.5 border shadow-xs space-y-2 text-xs transition-all ${
                    expRisk ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
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

                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {p.roomMalaysia}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400">여권번호</span>
                      <p className="font-mono font-bold text-slate-900">{maskPassport(p.passportNo)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">생년월일</span>
                      <p className="font-mono text-slate-800">{p.birthDate}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">여권 만료일</span>
                      <p className={`font-mono font-bold ${expRisk ? 'text-rose-600' : 'text-slate-800'}`}>
                        {p.expiryDate} {expRisk && '⚠️ 만료 임박'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">본인 연락처</span>
                      <p className="font-bold text-slate-900">{maskPhone(p.phone)}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">
                      보호자: {p.guardianName} ({p.guardianRelation}) - {maskPhone(p.guardianPhone)}
                    </span>
                    {p.allergies && <span className="text-rose-600 font-bold">⚠️ {p.allergies}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: UNIFIED EMERGENCY CONTACT MATRIX */}
      {adminTab === 'emergency' && (
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 mb-1">통합 비상연락망 및 보호자 즉시 연결</h3>
            <p className="text-slate-500">학생 터치 시 본인/보호자 전화 바로 연결 버튼이 표시됩니다.</p>
          </div>

          <div className="space-y-2.5">
            {participants.map((p) => (
              <div key={p.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-slate-900 text-sm">{p.nameKr}</span>
                    <span className="text-slate-500">({p.nameEn})</span>
                  </div>
                  <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-800">
                    {p.roomMalaysia}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`tel:${p.phone.replace(/[^0-9]/g, '')}`}
                    className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-bold flex items-center justify-center space-x-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>학생: {maskPhone(p.phone)}</span>
                  </a>

                  <a
                    href={`tel:${p.guardianPhone.replace(/[^0-9]/g, '')}`}
                    className="p-2 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl font-bold flex items-center justify-center space-x-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-rose-700" />
                    <span>보호자: {p.guardianName} ({p.guardianRelation})</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE ROOM EDITOR */}
      {adminTab === 'editor' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">싱가포르 & 말레이시아 객실배정 수정</h3>
            <p className="text-slate-500 mt-0.5">
              싱가포르 체크인 후 인솔자가 객실번호를 입력하면 실시간 반영됩니다.
            </p>
          </div>

          <div className="space-y-3">
            {participants.map((p) => {
              const isEditing = editingParticipantId === p.id;

              return (
                <div key={p.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">{p.nameKr} ({p.nameEn})</span>
                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setEditingParticipantId(p.id);
                          setEditRoomMY(p.roomMalaysia);
                          setEditRoomSG(p.roomSingapore);
                        }}
                        className="p-1.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveRoom(p)}
                        className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                      >
                        저장
                      </button>
                    )}
                  </div>

                  {!isEditing ? (
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400">말레이시아 뉴욕호텔</span>
                        <p className="font-bold text-slate-900">{p.roomMalaysia}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">싱가포르 머큐어</span>
                        <p className="font-bold text-emerald-800">{p.roomSingapore}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">말레이시아 객실</label>
                        <input
                          type="text"
                          value={editRoomMY}
                          onChange={(e) => setEditRoomMY(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">싱가포르 객실</label>
                        <input
                          type="text"
                          value={editRoomSG}
                          onChange={(e) => setEditRoomSG(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-emerald-800"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: URGENT ANNOUNCEMENTS EDITOR */}
      {adminTab === 'notices' && (
        <div className="space-y-4 text-xs">
          {/* Create Notice Form */}
          <form onSubmit={handleCreateNotice} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">새 긴급 공지사항 등록</h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">공지 제목</label>
              <input
                type="text"
                placeholder="예: 오늘 저녁 집합시간 변경 안내"
                value={newNoticeTitle}
                onChange={(e) => setNewNoticeTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">공지 내용</label>
              <textarea
                rows={3}
                placeholder="상세 내용을 입력하세요."
                value={newNoticeContent}
                onChange={(e) => setNewNoticeContent(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="urgent-check"
                checked={newNoticeUrgent}
                onChange={(e) => setNewNoticeUrgent(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
              <label htmlFor="urgent-check" className="font-bold text-amber-900">
                상단 긴급 롤링 배너 고정 (긴급 공지)
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center space-x-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>공지사항 등록하기</span>
            </button>
          </form>

          {/* Existing Notices List */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">등록된 공지 목록 ({notices.length}건)</h3>

            <div className="space-y-2">
              {notices.map((n) => (
                <div key={n.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    <button
                      onClick={() => onDeleteNotice(n.id)}
                      className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-700">{n.content}</p>
                  <p className="text-[10px] text-slate-400">{n.createdAt} · {n.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
