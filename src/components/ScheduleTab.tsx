import React, { useState } from 'react';
import { DAY_SCHEDULES, CLASS_TIMETABLE, FLIGHTS, CAMP_INFO } from '../data/campData';
import { DaySchedule, ClassTimetableItem } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Plane,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Coffee,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface ScheduleTabProps {
  initialDay?: number;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ initialDay = 1 }) => {
  const [viewMode, setViewMode] = useState<'all' | 'class' | 'flight'>('all');
  const [expandedDay, setExpandedDay] = useState<number | null>(initialDay);
  const [copiedFlight, setCopiedFlight] = useState<string | null>(null);

  const toggleDay = (dayNum: number) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFlight(id);
    setTimeout(() => setCopiedFlight(null), 2000);
  };

  return (
    <div id="schedule-tab-content" className="space-y-4 pb-20">
      {/* Upper Change Notice Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start space-x-2 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>안내:</strong> 전체 일정은 현지 사정이나 운영기관의 요청으로 인해 일부 변경될 수 있습니다. (오리엔테이션 표준 규정)
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 text-xs font-bold text-slate-600">
        <button
          onClick={() => setViewMode('all')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            viewMode === 'all'
              ? 'bg-white text-slate-900 shadow-xs font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          ① 전체 일정 요약 (Day 1~12)
        </button>
        <button
          onClick={() => setViewMode('class')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            viewMode === 'class'
              ? 'bg-white text-slate-900 shadow-xs font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          ② 수업일 상세 시간표
        </button>
        <button
          onClick={() => setViewMode('flight')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            viewMode === 'flight'
              ? 'bg-white text-slate-900 shadow-xs font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          ③ 항공편 & 집합
        </button>
      </div>

      {/* MODE 1: FULL ITINERARY (DAY 1 TO DAY 12) */}
      {viewMode === 'all' && (
        <div className="space-y-3">
          {DAY_SCHEDULES.map((day) => {
            const isExpanded = expandedDay === day.dayNumber;

            const tagColor =
              day.tag === '출국'
                ? 'bg-sky-100 text-sky-800 border-sky-200'
                : day.tag === '교육일'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : day.tag === '싱가포르'
                ? 'bg-purple-100 text-purple-800 border-purple-200'
                : 'bg-rose-100 text-rose-800 border-rose-200';

            return (
              <div
                key={day.dayNumber}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  isExpanded ? 'border-emerald-500/80 ring-1 ring-emerald-500/30' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Day Card Header */}
                <div
                  onClick={() => toggleDay(day.dayNumber)}
                  className="p-3.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      <span className="text-[9px] text-slate-400 uppercase font-medium">DAY</span>
                      <span className="text-sm font-black text-emerald-400">{day.dayNumber}</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-0.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${tagColor}`}>
                          {day.tag}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{day.dateStr}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{day.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-emerald-600" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Day Activity Details Timeline */}
                {isExpanded && (
                  <div className="p-3.5 bg-slate-50 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-200/60 font-medium">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>지역: {day.location}</span>
                      </span>
                      <span>상세 타임라인</span>
                    </div>

                    <div className="relative pl-3 space-y-2 border-l-2 border-slate-200">
                      {day.items.map((item, idx) => (
                        <div key={idx} className="relative group">
                          {/* Timeline Dot */}
                          <div
                            className={`absolute -left-[17px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white ${
                              item.isHighlight ? 'border-amber-500 bg-amber-400' : 'border-slate-400'
                            }`}
                          />

                          <div
                            className={`p-2.5 rounded-xl border text-xs transition-all ${
                              item.isHighlight
                                ? 'bg-amber-50/90 border-amber-200 text-slate-900 font-semibold shadow-xs'
                                : 'bg-white border-slate-200/80 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              {item.time && (
                                <span className="font-extrabold text-emerald-700 text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                  {item.time}
                                </span>
                              )}
                              {item.isHighlight && (
                                <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-extrabold">
                                  주요 활동
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-slate-900 mt-1">{item.activity}</p>
                            {item.note && (
                              <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                <Info className="w-3 h-3 text-slate-400" />
                                <span>{item.note}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: DAILY CLASS TIMETABLE (07:30 ~ 22:00) */}
      {viewMode === 'class' && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">말레이시아 집중 영어수업일 시간표</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              1:5 몰입그룹수업 + 1:1 커뮤니케이션 + English Café + Hello From Jeju 프로젝트
            </p>
          </div>

          <div className="space-y-2">
            {CLASS_TIMETABLE.map((item, idx) => {
              const typeBadge =
                item.type === '수업'
                  ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                  : item.type === '식사'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : item.type === '활동'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200';

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    item.isImportant
                      ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-xs">{item.time}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${typeBadge}`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs">{item.title}</p>
                    {item.subtitle && <p className="text-[11px] text-slate-500">{item.subtitle}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 3: FLIGHT & GROUP ASSEMBLY DETAILS */}
      {viewMode === 'flight' && (
        <div className="space-y-4">
          {/* Group Assembly Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 rounded-2xl shadow-sm border border-slate-800">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                필독 집합 안내
              </span>
              <h4 className="text-xs font-bold text-amber-300">출국일 단체 집결 장소</h4>
            </div>

            <p className="text-base font-black text-white">{CAMP_INFO.assemblyInfo.datetime}</p>
            <p className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{CAMP_INFO.assemblyInfo.location}</span>
            </p>

            <ul className="mt-3 space-y-1 text-xs text-slate-300 border-t border-slate-800 pt-3">
              {CAMP_INFO.assemblyInfo.guidelines.map((g, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Flights Cards */}
          {FLIGHTS.map((f, idx) => {
            const flightKey = `flight-${f.flightNo}`;
            return (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <Plane className={`w-4 h-4 ${f.type === 'outbound' ? 'text-sky-600' : 'text-indigo-600'}`} />
                    <span className="text-xs font-extrabold text-slate-900">
                      {f.type === 'outbound' ? '출국편' : '귀국편'} : {f.route}
                    </span>
                  </div>
                  <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {f.airline}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">항공편명</span>
                    <p className="font-extrabold text-slate-900 text-sm mt-0.5">{f.flightNo}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">탑승일자</span>
                    <p className="font-bold text-slate-900 mt-0.5">{f.date.split(' ')[1]} {f.date.split(' ')[2]}</p>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">출발:</span>
                    <span className="font-bold text-slate-900">{f.departureAirport} ({f.departureTime})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">도착:</span>
                    <span className="font-bold text-slate-900">{f.arrivalAirport} ({f.arrivalTime})</span>
                  </div>
                  <p className="text-[10px] text-slate-400 text-right font-medium">※ {f.timeBasis}</p>
                </div>

                <button
                  onClick={() => handleCopy(`${f.route} ${f.airline} ${f.flightNo} (${f.date})`, flightKey)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1 transition-colors"
                >
                  {copiedFlight === flightKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">항공편 정보 복사 완료</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>항공편 일정 복사</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
