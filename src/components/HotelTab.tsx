import React, { useState } from 'react';
import { HOTELS, INITIAL_PARTICIPANTS } from '../data/campData';
import { Participant } from '../types';
import {
  Building2,
  MapPin,
  Phone,
  Search,
  Users,
  BedDouble,
  Info,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface HotelTabProps {
  participants: Participant[];
  currentVerifiedUser: Participant | null;
}

export const HotelTab: React.FC<HotelTabProps> = ({
  participants,
  currentVerifiedUser,
}) => {
  const [activeHotelTab, setActiveHotelTab] = useState<'my' | 'sg'>('my');
  const [searchName, setSearchName] = useState<string>('');
  const [searchedParticipant, setSearchedParticipant] = useState<Participant | null>(null);

  const currentHotel = HOTELS.find((h) => h.id === (activeHotelTab === 'my' ? 'hotel-my' : 'hotel-sg')) || HOTELS[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;
    const found = participants.find(
      (p) => p.nameKr.includes(searchName.trim()) || p.nameEn.toLowerCase().includes(searchName.trim().toLowerCase())
    );
    setSearchedParticipant(found || null);
  };

  // Group participants by room for Malaysia (New York Hotel)
  const femaleStudents = participants.filter((p) => p.gender === 'F' && !p.isStaff);
  const maleStudents = participants.filter((p) => p.gender === 'M' && !p.isStaff);
  const staffMembers = participants.filter((p) => p.isStaff);

  // Helper to group by room
  const groupByRoom = (list: Participant[]) => {
    const roomMap: { [room: string]: Participant[] } = {};
    list.forEach((p) => {
      const room = p.roomMalaysia || '미정';
      if (!roomMap[room]) roomMap[room] = [];
      roomMap[room].push(p);
    });
    return roomMap;
  };

  const femaleRooms = groupByRoom(femaleStudents);
  const maleRooms = groupByRoom(maleStudents);

  return (
    <div id="hotel-tab-content" className="space-y-4 pb-20">
      {/* Hotel Country Switcher */}
      <div className="bg-slate-100 p-1 rounded-2xl flex space-x-1 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveHotelTab('my')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeHotelTab === 'my'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'hover:text-slate-900'
          }`}
        >
          <span>말레이시아 조호바루 (뉴욕호텔)</span>
        </button>
        <button
          onClick={() => setActiveHotelTab('sg')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeHotelTab === 'sg'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'hover:text-slate-900'
          }`}
        >
          <span>싱가포르 (머큐어 티릿)</span>
        </button>
      </div>

      {/* Hotel Details Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] bg-slate-100 font-bold text-slate-600 px-2 py-0.5 rounded uppercase">
              {currentHotel.country}
            </span>
            <h3 className="text-base font-black text-slate-900 mt-0.5">{currentHotel.nameKr}</h3>
            <p className="text-xs text-slate-500 font-medium">{currentHotel.nameEn}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-start space-x-2 text-slate-700">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-medium">{currentHotel.address}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium">숙박 기간</span>
              <p className="font-bold text-slate-900 mt-0.5">{currentHotel.period}</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium">객실 형태 & 수</span>
              <p className="font-bold text-slate-900 mt-0.5">{currentHotel.type} ({currentHotel.roomsCount})</p>
            </div>
          </div>
        </div>

        {/* Rules Accordion */}
        <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 space-y-1 text-xs">
          <p className="font-bold text-amber-950 flex items-center gap-1 mb-1">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>호텔 이용 수칙</span>
          </p>
          <ul className="space-y-1 text-amber-900">
            {currentHotel.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="text-amber-600 shrink-0">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={currentHotel.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google 지도 보기</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </a>

          <a
            href={`tel:${currentHotel.phone.replace(/[^0-9+]/g, '')}`}
            className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span>프런트 데스크 연결</span>
          </a>
        </div>
      </div>

      {/* STUDENT MY ROOM LOOKUP SEARCH CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center space-x-2">
          <BedDouble className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">내 객실 & 룸메이트 빠른 검색</h3>
        </div>

        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="이름을 입력하세요 (예: 김가연)"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
          >
            검색
          </button>
        </form>

        {/* Search Result Card */}
        {searchedParticipant && (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900">{searchedParticipant.nameKr} 학생</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-2 py-0.5 rounded">
                검색 결과
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="text-[10px] text-slate-400 font-medium">배정 객실</span>
                <p className="font-extrabold text-emerald-800 text-sm mt-0.5">{searchedParticipant.roomMalaysia}</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="text-[10px] text-slate-400 font-medium">룸메이트</span>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{searchedParticipant.roommateKr}</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 pt-1">
              📍 숙소: {currentHotel.nameKr} (말레이시아 조호바루)
            </p>
          </div>
        )}

        {searchName && !searchedParticipant && (
          <p className="text-xs text-rose-500 text-center py-2">
            입력하신 이름의 학생을 찾을 수 없습니다. 다시 확인해주세요.
          </p>
        )}
      </div>

      {/* FULL ROOM ALLOCATION TABLE */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">전체 객실 배정표</h3>
            <p className="text-xs text-slate-500">뉴욕호텔 조호바루 (말레이시아)</p>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold">
            학생 2인1실 10개 객실 배정
          </span>
        </div>

        {/* Singapore Room Notice Banner */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900 flex items-start space-x-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>싱가포르 객실 안내:</strong> 머큐어 싱가포르 티릿 호텔 객실은 현지 도착 및 체크인 당일 최종 업데이트됩니다.
          </p>
        </div>

        {/* Female Rooms Table */}
        <div>
          <h4 className="text-xs font-extrabold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 mb-2 flex justify-between">
            <span>여학생 객실 배정표 (9실)</span>
            <span>18명</span>
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-2.5 w-20">객실번호</th>
                  <th className="p-2.5">배정 인원 (2인 1실)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(femaleRooms).map(([room, members]) => (
                  <tr key={room} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{room}</td>
                    <td className="p-2.5 text-slate-800">
                      {members.map((m) => m.nameKr).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Male Rooms Table */}
        <div>
          <h4 className="text-xs font-extrabold text-sky-800 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 mb-2 flex justify-between">
            <span>남학생 객실 배정표 (1실)</span>
            <span>2명</span>
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-2.5 w-20">객실번호</th>
                  <th className="p-2.5">배정 인원 (2인 1실)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(maleRooms).map(([room, members]) => (
                  <tr key={room} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{room}</td>
                    <td className="p-2.5 text-slate-800">
                      {members.map((m) => m.nameKr).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
