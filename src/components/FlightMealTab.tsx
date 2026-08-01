import React, { useState, useMemo } from 'react';
import {
  OUTBOUND_MEALS,
  INBOUND_MEALS,
  STUDENT_MEAL_SELECTIONS,
  MealMenuItem,
  StudentMealSelection,
  getOutboundMeal,
  getInboundMeal,
} from '../data/flightMealData';
import {
  Utensils,
  PlaneTakeoff,
  PlaneLanding,
  Search,
  Filter,
  RotateCcw,
  ZoomIn,
  X,
  Users,
  CheckCircle2,
  Info,
  ChevronRight,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';

interface FlightMealTabProps {
  onNavigateHome?: () => void;
}

export const FlightMealTab: React.FC<FlightMealTabProps> = () => {
  // Filters State
  const [searchName, setSearchName] = useState('');
  const [selectedOutboundFilter, setSelectedOutboundFilter] = useState<number | 'all'>('all');
  const [selectedInboundFilter, setSelectedInboundFilter] = useState<number | 'all'>('all');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Lightbox Modal State for Menu Details
  const [previewMeal, setPreviewMeal] = useState<{
    meal: MealMenuItem;
    students: StudentMealSelection[];
  } | null>(null);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return STUDENT_MEAL_SELECTIONS.filter((s) => {
      // Search Name Filter
      const matchName = searchName.trim() === '' || s.nameKr.includes(searchName.trim());
      // Outbound Filter
      const matchOutbound =
        selectedOutboundFilter === 'all' || s.outboundMealId === selectedOutboundFilter;
      // Inbound Filter
      const matchInbound =
        selectedInboundFilter === 'all' || s.inboundMealId === selectedInboundFilter;

      return matchName && matchOutbound && matchInbound;
    });
  }, [searchName, selectedOutboundFilter, selectedInboundFilter]);

  // Outbound Counts
  const outboundCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    STUDENT_MEAL_SELECTIONS.forEach((s) => {
      if (counts[s.outboundMealId] !== undefined) {
        counts[s.outboundMealId]++;
      }
    });
    return counts;
  }, []);

  // Inbound Counts
  const inboundCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    STUDENT_MEAL_SELECTIONS.forEach((s) => {
      if (counts[s.inboundMealId] !== undefined) {
        counts[s.inboundMealId]++;
      }
    });
    return counts;
  }, []);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchName('');
    setSelectedOutboundFilter('all');
    setSelectedInboundFilter('all');
  };

  // Open Lightbox with list of students who ordered this meal
  const handleOpenMealModal = (meal: MealMenuItem) => {
    const isOutbound = meal.flightType === '출국편';
    const students = STUDENT_MEAL_SELECTIONS.filter((s) =>
      isOutbound ? s.outboundMealId === meal.menuNumber : s.inboundMealId === meal.menuNumber
    );
    setPreviewMeal({ meal, students });
  };

  // Copy Summary text to Clipboard
  const handleCopySummary = () => {
    let text = `[제주대학생 글로벌 영어 챌린지 캠프 기내식 신청 현황 (총 ${STUDENT_MEAL_SELECTIONS.length}명)]\n\n`;
    text += `■ 출국편(스쿠트항공) 신청 집계:\n`;
    OUTBOUND_MEALS.forEach((m) => {
      text += `- ${m.menuNumber}번 메뉴: ${outboundCounts[m.menuNumber] || 0}명\n`;
    });
    text += `\n■ 귀국편(티웨이항공) 신청 집계:\n`;
    INBOUND_MEALS.forEach((m) => {
      text += `- ${m.menuNumber}번 메뉴: ${inboundCounts[m.menuNumber] || 0}명\n`;
    });
    text += `\n■ 학생별 명단:\n`;
    STUDENT_MEAL_SELECTIONS.forEach((s) => {
      text += `${s.id}. ${s.nameKr} | 출국: ${s.outboundMealId}번 메뉴 | 귀국: ${s.inboundMealId}번 메뉴\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div id="flight-meal-tab-content" className="space-y-5 pb-20 max-w-4xl mx-auto">
      {/* PAGE HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-md border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                INFLIGHT MEALS STATUS
              </span>
              <h2 className="text-xl font-black tracking-tight text-white">기내식 신청현황</h2>
            </div>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-1 rounded-full font-bold">
            22명 전원 완료
          </span>
        </div>

        {/* Top Notice Banner */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-300 leading-relaxed flex items-start space-x-2.5 mt-3">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="font-medium text-slate-200">
            아래 표는 학생별 기내식 신청 현황입니다. 상단 메뉴 사진과 번호를 참고하여 출국편 및 귀국편 신청 메뉴를 확인할 수 있습니다.
          </p>
        </div>
      </div>

      {/* TOP SECTION: MENU GUIDES */}
      <div className="space-y-4">
        {/* A. 출국편 기내식 안내 (스쿠트) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/90">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                <PlaneTakeoff className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  출국편 기내식 안내 (스쿠트)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  제주 → 싱가포르 (TR829) · 메뉴 1번 ~ 3번
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              총 22명 신청
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {OUTBOUND_MEALS.map((meal) => {
              const count = outboundCounts[meal.menuNumber] || 0;
              return (
                <div
                  key={meal.id}
                  onClick={() => handleOpenMealModal(meal)}
                  className="group bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl p-2.5 text-center transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-blue-600 text-white font-black text-xs px-2 py-0.5 rounded-md shadow-2xs">
                        {meal.menuNumber}번
                      </span>
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded">
                        {count}명
                      </span>
                    </div>

                    {/* Meal Image Card */}
                    <div className="w-full aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden relative my-1 border border-blue-100/80 group-hover:scale-[1.02] transition-transform">
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-xs p-1 rounded-full text-white shadow-2xs">
                        <ZoomIn className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 text-center">
                    <p className="text-[11px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {meal.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* B. 귀국편 기내식 안내 (티웨이) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/90">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                <PlaneLanding className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  귀국편 기내식 안내 (티웨이)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  싱가포르 → 제주 (TW162) · 메뉴 1번 ~ 4번
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              총 22명 신청
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {INBOUND_MEALS.map((meal) => {
              const count = inboundCounts[meal.menuNumber] || 0;
              return (
                <div
                  key={meal.id}
                  onClick={() => handleOpenMealModal(meal)}
                  className="group bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xl p-2.5 text-center transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-emerald-600 text-white font-black text-xs px-2 py-0.5 rounded-md shadow-2xs">
                        {meal.menuNumber}번
                      </span>
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {count}명
                      </span>
                    </div>

                    {/* Meal Image Card */}
                    <div className="w-full aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden relative my-1 border border-emerald-100/80 group-hover:scale-[1.02] transition-transform">
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-xs p-1 rounded-full text-white shadow-2xs">
                        <ZoomIn className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 text-center">
                    <p className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {meal.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: STUDENT MEAL SELECTION TABLE */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
        {/* Table Header & Copy Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>학생별 기내식 신청 내역</span>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                총 {filteredStudents.length}명 / 22명
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              각 학생이 선택한 출국편(스쿠트) 및 귀국편(티웨이) 기내식 번호
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center space-x-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl transition-colors shadow-2xs"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>복사완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>현황 요약 복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="학생 이름 검색 (예: 강다원)"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
              />
              {searchName && (
                <button
                  onClick={() => setSearchName('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Outbound Meal Filter */}
            <div>
              <select
                value={selectedOutboundFilter}
                onChange={(e) =>
                  setSelectedOutboundFilter(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                className="w-full py-1.5 px-3 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
              >
                <option value="all">✈️ 출국편(스쿠트) 전체 메뉴</option>
                <option value={1}>출국 1번 메뉴 ({outboundCounts[1]}명)</option>
                <option value={2}>출국 2번 메뉴 ({outboundCounts[2]}명)</option>
                <option value={3}>출국 3번 메뉴 ({outboundCounts[3]}명)</option>
              </select>
            </div>

            {/* Inbound Meal Filter */}
            <div>
              <select
                value={selectedInboundFilter}
                onChange={(e) =>
                  setSelectedInboundFilter(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                className="w-full py-1.5 px-3 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              >
                <option value="all">✈️ 귀국편(티웨이) 전체 메뉴</option>
                <option value={1}>귀국 1번 메뉴 ({inboundCounts[1]}명)</option>
                <option value={2}>귀국 2번 메뉴 ({inboundCounts[2]}명)</option>
                <option value={3}>귀국 3번 메뉴 ({inboundCounts[3]}명)</option>
                <option value={4}>귀국 4번 메뉴 ({inboundCounts[4]}명)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges & Reset */}
          {(searchName || selectedOutboundFilter !== 'all' || selectedInboundFilter !== 'all') && (
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                <span className="text-slate-500 font-semibold">적용 필터:</span>
                {searchName && (
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                    이름: "{searchName}"
                  </span>
                )}
                {selectedOutboundFilter !== 'all' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                    출국 {selectedOutboundFilter}번 메뉴
                  </span>
                )}
                {selectedInboundFilter !== 'all' && (
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    귀국 {selectedInboundFilter}번 메뉴
                  </span>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="text-slate-500 hover:text-slate-800 font-bold flex items-center space-x-1 shrink-0 ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>필터 초기화</span>
              </button>
            </div>
          )}
        </div>

        {/* DESKTOP / RESPONSIVE TABLE VIEW */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-tight">
              <tr>
                <th className="py-3 px-3.5 text-center w-14">번호</th>
                <th className="py-3 px-3.5 min-w-[100px]">이름</th>
                <th className="py-3 px-3.5 bg-blue-50/70 text-blue-900 border-l border-slate-200 min-w-[150px]">
                  출국편 신청 메뉴 (스쿠트)
                </th>
                <th className="py-3 px-3.5 bg-emerald-50/70 text-emerald-900 border-l border-slate-200 min-w-[150px]">
                  귀국편 신청 메뉴 (티웨이)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                    검색 조건에 해당되는 학생이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const outboundMeal = getOutboundMeal(student.outboundMealId);
                  const inboundMeal = getInboundMeal(student.inboundMealId);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Number */}
                      <td className="py-3 px-3.5 text-center font-bold text-slate-500">
                        {student.id}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-3.5 font-black text-slate-900 text-sm">
                        {student.nameKr}
                      </td>

                      {/* Outbound Meal */}
                      <td className="py-3 px-3.5 border-l border-slate-100 bg-blue-50/20">
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-600 text-white font-black text-xs px-2 py-0.5 rounded shadow-2xs shrink-0">
                            {student.outboundMealId}번
                          </span>
                          <span className="font-bold text-slate-800">
                            {outboundMeal.name}
                          </span>
                        </div>
                      </td>

                      {/* Inbound Meal */}
                      <td className="py-3 px-3.5 border-l border-slate-100 bg-emerald-50/20">
                        <div className="flex items-center space-x-2">
                          <span className="bg-emerald-600 text-white font-black text-xs px-2 py-0.5 rounded shadow-2xs shrink-0">
                            {student.inboundMealId}번
                          </span>
                          <span className="font-bold text-slate-800">
                            {inboundMeal.name}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* SUMMARY STATS FOOTER BAR */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800">
              전체 22명 기내식 조사 완료
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-semibold text-slate-600 flex-wrap">
            <span>출국: 1번({outboundCounts[1]}명), 2번({outboundCounts[2]}명), 3번({outboundCounts[3]}명)</span>
            <span className="text-slate-300">|</span>
            <span>귀국: 1번({inboundCounts[1]}명), 2번({inboundCounts[2]}명), 3번({inboundCounts[3]}명), 4번({inboundCounts[4]}명)</span>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL FOR DETAILED MEAL VIEW */}
      {previewMeal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewMeal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span
                  className={`font-black text-xs px-2.5 py-1 rounded-md text-white ${
                    previewMeal.meal.flightType === '출국편'
                      ? 'bg-blue-600'
                      : 'bg-emerald-600'
                  }`}
                >
                  {previewMeal.meal.flightType} {previewMeal.meal.menuNumber}번
                </span>
                <h3 className="font-black text-slate-900 text-base">
                  {previewMeal.meal.airline}항공 {previewMeal.meal.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewMeal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meal Large Preview Visual */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center space-y-2">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                <img
                  src={previewMeal.meal.imageUrl}
                  alt={previewMeal.meal.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {previewMeal.meal.nameEn && (
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold py-1 px-2.5 rounded-lg text-center">
                    {previewMeal.meal.nameEn}
                  </div>
                )}
              </div>
              <h4 className="text-base font-black text-slate-900 mt-1">
                {previewMeal.meal.name}
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {previewMeal.meal.description}
              </p>
            </div>

            {/* Students who ordered this meal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  해당 메뉴 신청 학생 ({previewMeal.students.length}명)
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 max-h-48 overflow-y-auto">
                {previewMeal.students.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-2">
                    해당 메뉴를 신청한 학생이 없습니다.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {previewMeal.students.map((st) => (
                      <div
                        key={st.id}
                        className="bg-white p-2 rounded-lg border border-slate-200/80 flex items-center justify-between font-bold text-slate-900"
                      >
                        <span>
                          {st.id}. {st.nameKr}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Close Button */}
            <button
              onClick={() => setPreviewMeal(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
            >
              확인 닫기
            </button>
          </div>
        </div>
      )}

      {/* FOOTER COMPANY LOGO */}
      <CompanyLogo />
    </div>
  );
};
