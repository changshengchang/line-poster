import React, { useState } from 'react';
import { X, Search, Sparkles, AlertCircle, Heart, Hash, CheckSquare, PartyPopper } from 'lucide-react';
import { StickerItem } from '../types';
import { STICKER_COLLECTION, getStickerAnimationClass } from '../data/stickers';

interface StickerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (sticker: StickerItem) => void;
  targetLabel?: string;
  currentSelectedId?: string;
}

export const StickerPickerModal: React.FC<StickerPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectSticker,
  targetLabel = '選擇貼圖',
  currentSelectedId,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: '全部貼圖', icon: Sparkles },
    { id: 'animated', label: '🎬 動態貼圖 (GIF感)', icon: Sparkles },
    { id: 'notice', label: '📢 提醒與公告', icon: AlertCircle },
    { id: 'heart-star', label: '💖 星星與愛心', icon: Heart },
    { id: 'numbers', label: '🔢 數字標號', icon: Hash },
    { id: 'symbols', label: '🔷 菱形與打勾', icon: CheckSquare },
    { id: 'celebration', label: '🌸 慶祝與圖示', icon: PartyPopper },
  ];

  const filteredStickers = STICKER_COLLECTION.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emoji.includes(searchQuery);
    return matchesCat && matchesQuery;
  });

  return (
    <div
      id="sticker-picker-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="sticker-picker-dialog"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="flex items-center space-x-2">
            <span className="text-2xl animate-bounce">✨</span>
            <div>
              <h3 className="font-bold text-lg text-white">更換貼圖庫</h3>
              <p className="text-xs text-emerald-100">正在為【{targetLabel}】挑選最合適之貼圖符號</p>
            </div>
          </div>
          <button
            id="close-sticker-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            title="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Tabs */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/70 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="sticker-search-input"
              type="text"
              placeholder="搜尋貼圖名稱或符號（如：愛心、星號、鈴鐺、打勾）..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticker Grid */}
        <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
          {filteredStickers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm">找不到符合的貼圖，請嘗試更換關鍵字</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {filteredStickers.map((sticker) => {
                const isSelected = currentSelectedId === sticker.id;
                return (
                  <button
                    key={sticker.id}
                    id={`sticker-option-${sticker.id}`}
                    onClick={() => {
                      onSelectSticker(sticker);
                      onClose();
                    }}
                    className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:scale-108 hover:shadow-md ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/30'
                        : 'border-gray-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/30'
                    }`}
                  >
                    {sticker.isGif && (
                      <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-gradient-to-r from-amber-500 to-rose-500 text-[9px] font-black text-white rounded-full shadow-xs">
                        動態
                      </span>
                    )}

                    <span
                      className={`text-2xl mb-1 transition-transform group-hover:scale-115 inline-block ${
                        getStickerAnimationClass(sticker.emoji, sticker.animationClass)
                      }`}
                    >
                      {sticker.emoji}
                    </span>

                    <span className="text-[11px] font-medium text-gray-600 truncate max-w-full group-hover:text-emerald-700">
                      {sticker.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>💡 點擊任何貼圖即可直接套用至公告內容</span>
          <button
            id="cancel-sticker-modal-btn"
            onClick={onClose}
            className="px-4 py-1.5 text-gray-600 hover:text-gray-900 font-medium"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
