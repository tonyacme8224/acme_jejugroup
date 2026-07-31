import React, { useState, useEffect } from 'react';
import { CHECKLIST, CAMP_RULES, INSURANCE_ITEMS } from '../data/campData';
import { ChecklistCategory } from '../types';
import {
  ShieldAlert,
  CheckSquare,
  Square,
  ShieldCheck,
  Luggage,
  Sparkles,
  Info,
  RotateCcw,
  Zap,
  Globe,
  AlertTriangle,
} from 'lucide-react';

export const LivingGuideTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'rules' | 'checklist' | 'insurance' | 'local'>('rules');

  // Checklist checked state saved in localStorage
  const [checkedItems, setCheckedItems] = useState<{ [id: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('gec_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gec_checklist', JSON.stringify(checkedItems));
    } catch (e) {
      console.error(e);
    }
  }, [checkedItems]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetChecklist = () => {
    if (window.confirm('준비물 체크 상태를 초기화하시겠습니까?')) {
      setCheckedItems({});
    }
  };

  const totalChecklistItems = CHECKLIST.flatMap((c) => c.items).length;
  const completedChecklistItems = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedChecklistItems / totalChecklistItems) * 100);

  return (
    <div id="living-guide-tab-content" className="space-y-4 pb-20">
      {/* Subtab Navigation Bar */}
      <div className="bg-slate-100 p-1 rounded-2xl flex space-x-1 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveSubTab('rules')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeSubTab === 'rules' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          생활수칙
        </button>
        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeSubTab === 'checklist' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          준비물
        </button>
        <button
          onClick={() => setActiveSubTab('insurance')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeSubTab === 'insurance' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          여행자보험
        </button>
        <button
          onClick={() => setActiveSubTab('local')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeSubTab === 'local' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          현지정보
        </button>
      </div>

      {/* SUBTAB 1: LIVING RULES & SAFETY */}
      {activeSubTab === 'rules' && (
        <div className="space-y-3">
          <div className="bg-amber-500 text-slate-950 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-slate-950 shrink-0" />
              <h3 className="text-sm font-black">글로벌 캠프 수직 & 싱가포르 법률 준수</h3>
            </div>
            <p className="text-xs font-semibold mt-1 opacity-90">
              안전하고 유익한 연수를 위해 아래 수칙을 반드시 준수해주시기 바랍니다.
            </p>
          </div>

          <div className="space-y-2.5">
            {CAMP_RULES.map((rule, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-xs space-y-1 transition-all ${
                  rule.level === 'danger'
                    ? 'bg-rose-50/80 border-rose-200 text-slate-900'
                    : 'bg-amber-50/80 border-amber-200 text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${
                      rule.level === 'danger' ? 'bg-rose-600' : 'bg-amber-600'
                    }`}
                  >
                    {rule.level === 'danger' ? '엄격 금지' : '주의 사항'}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs">{rule.title}</h4>
                </div>
                <p className="text-slate-700 text-xs pl-0.5">{rule.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Luggage className="w-4 h-4 text-emerald-600" />
              <span>수하물 및 출국 주의 규정</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">위탁 수하물</span>
                <p className="font-extrabold text-slate-900 mt-0.5">18kg 미만 (1개)</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">기내 수하물</span>
                <p className="font-extrabold text-slate-900 mt-0.5">10kg 이하 (1개)</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1 leading-snug">
              ⚠️ 보조배터리와 라이터는 반드시 기내 수하물로 들고 탑승하셔야 합니다.
            </p>
          </div>
        </div>
      )}

      {/* SUBTAB 2: INTERACTIVE CHECKLIST */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-4">
          {/* Progress Bar Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-900">준비물 챙기기 달성도</span>
              <span className="text-emerald-700 font-black">
                {completedChecklistItems} / {totalChecklistItems} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={resetChecklist}
                className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>체크 초기화</span>
              </button>
            </div>
          </div>

          {/* Checklist Categories */}
          <div className="space-y-3">
            {CHECKLIST.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                  {cat.category}
                </h4>

                <div className="space-y-1.5">
                  {cat.items.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all select-none ${
                          isChecked
                            ? 'bg-emerald-50/70 border-emerald-200 text-slate-400 line-through'
                            : 'bg-slate-50 border-slate-100 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className={isChecked ? 'line-through text-slate-400' : 'font-medium text-slate-900'}>
                            {item.text}
                          </span>
                        </div>

                        {item.note && (
                          <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-medium shrink-0 ml-2">
                            {item.note}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: TRAVEL INSURANCE */}
      {activeSubTab === 'insurance' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">해외 여행자보험 보장 내용</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              캠프 참가자 전원 DB손해보험 / 현대해상 단체 여행자보험 가입 완료
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-2.5">보장 항목</th>
                  <th className="p-2.5 text-right">보장 한도액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INSURANCE_ITEMS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-800">{item.item}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-800">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">※ 사고 및 병원 진료 시 절차</p>
            <p>1. 인솔자 및 운영 담당자에게 즉시 알림</p>
            <p>2. 현지 협력 병원 이송 및 진단서/영수증 원본 수령</p>
            <p>3. 귀국 후 보상 청구서 제출 및 보험금 지급 처리</p>
          </div>
        </div>
      )}

      {/* SUBTAB 4: LOCAL INFO & ESIM */}
      {activeSubTab === 'local' && (
        <div className="space-y-3 text-xs">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>말레이시아 & 싱가포르 국가 정보</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 text-xs">말레이시아 (조호바루)</span>
                <p className="text-[11px] text-slate-600">통화: 링깃 (MYR)</p>
                <p className="text-[11px] text-slate-600">시차: 한국보다 1시간 늦음</p>
                <p className="text-[11px] text-slate-600">전압: 230V / G타입 (3핀)</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 text-xs">싱가포르</span>
                <p className="text-[11px] text-slate-600">통화: 싱가포르 달러 (SGD)</p>
                <p className="text-[11px] text-slate-600">시차: 한국보다 1시간 늦음</p>
                <p className="text-[11px] text-slate-600">전압: 230V / G타입 (3핀)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>eSIM 및 해외 데이터 준비</span>
            </h4>
            <p className="text-slate-700 leading-snug">
              말레이시아와 싱가포르 양국 모두 적용되는 <strong>'말레이시아/싱가포르 통합 eSIM'</strong> 또는 해외 로밍 데이터 요금제를 사전에 준비하시는 것을 권장합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
