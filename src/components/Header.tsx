import React from 'react';
import { MessageSquare, Sparkles, BookmarkCheck } from 'lucide-react';
import { TEMPLATE_PRESETS } from '../data/templates';
import { AnnouncementConfig } from '../types';

interface HeaderProps {
  onSelectTemplate: (config: Partial<AnnouncementConfig>) => void;
  activeTemplateId?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSelectTemplate }) => {
  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30 shadow-2xs backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#06C755] to-emerald-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <span className="text-2xl animate-sticker-wobble">📢</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  LINE 公告文字貼圖製作器
                </h1>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                  專業製圖版
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                支援前後動態貼圖、醒目數字與菱形符號、日期粗體鮮豔高亮、一鍵複製與長圖下載
              </p>
            </div>
          </div>

          {/* Quick Template Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <div className="text-xs font-semibold text-gray-400 shrink-0 flex items-center gap-1 mr-1">
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>快速範本：</span>
            </div>
            {TEMPLATE_PRESETS.map((tmpl) => (
              <button
                key={tmpl.id}
                id={`template-preset-btn-${tmpl.id}`}
                onClick={() => onSelectTemplate(tmpl.config)}
                className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100/80 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-gray-700 border border-gray-200 transition-all active:scale-95"
                title={tmpl.description}
              >
                <span>{tmpl.badge}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
