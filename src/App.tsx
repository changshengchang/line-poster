/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { AnnouncementEditor } from './components/AnnouncementEditor';
import { CardPreview } from './components/CardPreview';
import { TextOutputView } from './components/TextOutputView';
import { StickerPickerModal } from './components/StickerPickerModal';
import { AnnouncementConfig, StickerItem } from './types';
import { DEFAULT_ANNOUNCEMENT } from './data/templates';
import { Edit3, Eye, Sparkles } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<AnnouncementConfig>(DEFAULT_ANNOUNCEMENT);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Sticker Picker Modal State
  const [stickerPickerTarget, setStickerPickerTarget] = useState<
    'front' | 'back' | { type: 'item'; itemId: string } | null
  >(null);

  const handleOpenStickerPicker = (target: 'front' | 'back' | { type: 'item'; itemId: string }) => {
    setStickerPickerTarget(target);
  };

  const handleCloseStickerPicker = () => {
    setStickerPickerTarget(null);
  };

  const handleSelectSticker = (sticker: StickerItem) => {
    if (stickerPickerTarget === 'front') {
      setConfig((prev) => ({ ...prev, frontSticker: sticker }));
    } else if (stickerPickerTarget === 'back') {
      setConfig((prev) => ({ ...prev, backSticker: sticker }));
    } else if (typeof stickerPickerTarget === 'object' && stickerPickerTarget.type === 'item') {
      const itemId = stickerPickerTarget.itemId;
      setConfig((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, prefixEmoji: sticker.emoji } : item,
        ),
      }));
    }
  };

  const handleSelectTemplate = (templatePartial: Partial<AnnouncementConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...templatePartial,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col selection:bg-emerald-500 selection:text-white font-sans">
      {/* Top Navigation Header */}
      <Header onSelectTemplate={handleSelectTemplate} />

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden sticky top-[69px] z-20 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
        <button
          id="mobile-tab-editor-btn"
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'editor'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>編輯公告內容</span>
        </button>

        <button
          id="mobile-tab-preview-btn"
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'preview'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>即時預覽與發布</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Form & Configuration Editor */}
          <div
            className={`lg:col-span-6 space-y-6 ${
              activeTab === 'editor' ? 'block' : 'hidden lg:block'
            }`}
          >
            <AnnouncementEditor
              config={config}
              onChange={setConfig}
              onOpenStickerPicker={handleOpenStickerPicker}
              onSelectTemplate={(tmplId) => {}}
            />
          </div>

          {/* Right Column: Live Card Preview & Quick Copy/Export Actions */}
          <div
            className={`lg:col-span-6 space-y-6 lg:sticky lg:top-[90px] ${
              activeTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <CardPreview config={config} onOpenStickerPicker={handleOpenStickerPicker} />
            <TextOutputView config={config} />
          </div>
        </div>
      </main>

      {/* Sticker Library Modal */}
      <StickerPickerModal
        isOpen={stickerPickerTarget !== null}
        onClose={handleCloseStickerPicker}
        onSelectSticker={handleSelectSticker}
        targetLabel={
          stickerPickerTarget === 'front'
            ? '標題前置貼圖'
            : stickerPickerTarget === 'back'
            ? '標題後置貼圖'
            : '項目開頭貼圖'
        }
        currentSelectedId={
          stickerPickerTarget === 'front'
            ? config.frontSticker.id
            : stickerPickerTarget === 'back'
            ? config.backSticker.id
            : undefined
        }
      />
    </div>
  );
}
