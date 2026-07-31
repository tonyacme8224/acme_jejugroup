import React from 'react';
import { EmergencyNotice } from '../types';
import { Bell, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: EmergencyNotice[];
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  onClose,
  notices,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 relative animate-scaleUp max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-4 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">캠프 공지사항</h3>
            <p className="text-xs text-slate-500 font-medium">실시간 현지 안내 메시지</p>
          </div>
        </div>

        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {notices.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">등록된 공지사항이 없습니다.</p>
          ) : (
            notices.map((notice) => (
              <div
                key={notice.id}
                className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                  notice.isUrgent
                    ? 'bg-amber-50 border-amber-300/80 text-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${
                      notice.isUrgent ? 'bg-amber-600' : 'bg-slate-700'
                    }`}
                  >
                    {notice.isUrgent ? '긴급 공지' : '일반 공지'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{notice.createdAt}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs">{notice.title}</h4>
                <p className="text-slate-700 leading-relaxed text-xs">{notice.content}</p>

                <p className="text-[10px] text-slate-400 text-right pt-1">작성자: {notice.author}</p>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
        >
          확인 완료
        </button>
      </div>
    </div>
  );
};
