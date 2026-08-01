import React from 'react';
import { TabType } from '../types';
import { Home, Calendar, Building, ShieldAlert, Menu, Utensils } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isAdminLoggedIn: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  isAdminLoggedIn,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: '홈', icon: <Home className="w-5 h-5" /> },
    { id: 'schedule', label: '일정', icon: <Calendar className="w-5 h-5" /> },
    { id: 'flightMeal', label: '기내식', icon: <Utensils className="w-5 h-5" /> },
    { id: 'guide', label: '생활안내', icon: <ShieldAlert className="w-5 h-5" /> },
    { id: 'more', label: isAdminLoggedIn ? '관리자' : '더보기', icon: <Menu className="w-5 h-5" /> },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 text-slate-400 shadow-lg"
    >
      <div className="max-w-md mx-auto px-2 flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-emerald-500/10 text-emerald-400' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
