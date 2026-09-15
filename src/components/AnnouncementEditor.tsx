import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ArrowLeftRight,
  Palette,
  CheckCircle2,
  FileText,
  RotateCcw,
  Highlighter,
  HelpCircle,
  Hash,
} from 'lucide-react';
import { AnnouncementConfig, AnnouncementItem, BulletStyleKey, StickerItem } from '../types';
import { BULLET_PRESETS, COLOR_THEMES, STICKER_COLLECTION } from '../data/stickers';
import { DEFAULT_ANNOUNCEMENT } from '../data/templates';

interface AnnouncementEditorProps {
  config: AnnouncementConfig;
  onChange: (newConfig: AnnouncementConfig) => void;
  onOpenStickerPicker: (target: 'front' | 'back' | { type: 'item'; itemId: string }) => void;
  onSelectTemplate: (templateId: string) => void;
}

export const AnnouncementEditor: React.FC<AnnouncementEditorProps> = ({
  config,
  onChange,
  onOpenStickerPicker,
}) => {
  const [showTextImporter, setShowTextImporter] = useState(false);
  const [importRawText, setImportRawText] = useState('');

  // Update helper
  const updateConfig = (partial: Partial<AnnouncementConfig>) => {
    onChange({ ...config, ...partial });
  };

  // Item helpers
  const handleItemChange = (id: string, field: 'label' | 'content', value: string) => {
    const newItems = config.items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateConfig({ items: newItems });
  };

  const handleAddItem = () => {
    const newItem: AnnouncementItem = {
      id: `item-${Date.now()}`,
      label: `項目說明`,
      content: '請填寫詳細內容與日期時間',
    };
    updateConfig({ items: [...config.items, newItem] });
  };

  const handleDeleteItem = (id: string) => {
    if (config.items.length <= 1) {
      alert('至少需保留一個公告項目！');
      return;
    }
    updateConfig({ items: config.items.filter((item) => item.id !== id) });
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.items.length) return;
    const newItems = [...config.items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    updateConfig({ items: newItems });
  };

  const handleSwapStickers = () => {
    updateConfig({
      frontSticker: config.backSticker,
      backSticker: config.frontSticker,
    });
  };

  // Quick text parser for raw pasted lines
  const handleParseImportedText = () => {
    if (!importRawText.trim()) return;

    const lines = importRawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    let newTitle = config.title;
    let newItems: AnnouncementItem[] = [];

    // Check if first line looks like a title
    let startIndex = 0;
    const firstLine = lines[0];
    const bracketMatch = firstLine.match(/^[(\[（【『《](.*?)[)\]）】』》]$/);
    if (bracketMatch) {
      newTitle = bracketMatch[1];
      startIndex = 1;
    } else if (firstLine.includes('公告') || firstLine.includes('通知')) {
      newTitle = firstLine.replace(/^[(\[（【『《]/, '').replace(/[)\]）】』》]$/, '');
      startIndex = 1;
    }

    // Parse remaining lines
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      // Skip pure divider lines
      if (/^[━─—=-]+$/.test(line)) continue;

      // Match item pattern like "1.辦理時間：xxx" or "1、辦理時間: xxx" or "✅ 辦理時間"
      const match = line.match(/^(?:(?:\d+[.、:：])|[❶❷❸❹❺①②③④⑤1️⃣2️⃣3️⃣4️⃣5️⃣✅🔷🔶⭐📌💠])?\s*(?:([^：:]+)[：:])?\s*(.*)$/);
      if (match) {
        const label = (match[1] || `項目 ${newItems.length + 1}`).trim();
        const content = (match[2] || line).trim();
        newItems.push({
          id: `item-${Date.now()}-${i}`,
          label,
          content,
        });
      } else {
        newItems.push({
          id: `item-${Date.now()}-${i}`,
          label: `注意事項`,
          content: line,
        });
      }
    }

    if (newItems.length === 0) {
      newItems = config.items;
    }

    updateConfig({
      title: newTitle,
      items: newItems,
    });

    setShowTextImporter(false);
    setImportRawText('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Title Configuration */}
      <section
        id="section-title-editor"
        className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-gray-200/80 transition-all hover:border-emerald-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">公告標題與前後動態貼圖</h2>
              <p className="text-xs text-gray-500">可自由設定標題文字、外框樣式與前後星號/愛心/提醒貼圖</p>
            </div>
          </div>

          <button
            id="reset-default-template-btn"
            onClick={() => onChange(DEFAULT_ANNOUNCEMENT)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 font-medium transition-colors"
            title="還原為人事室預設範例"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>還原範本</span>
          </button>
        </div>

        {/* Title Input & Wrapper */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              公告標題主文字
            </label>
            <div className="flex gap-2">
              <input
                id="announcement-title-input"
                type="text"
                value={config.title}
                onChange={(e) => updateConfig({ title: e.target.value })}
                placeholder="例如：人事室-文康活動報名公告"
                className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />

              <select
                id="announcement-wrapper-select"
                value={config.titleWrapper}
                onChange={(e) => updateConfig({ titleWrapper: e.target.value as any })}
                className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="parentheses">( 圓括號 ) - 官方推薦</option>
                <option value="brackets">【 實心方頭括號 】</option>
                <option value="corner">『 雙角括號 』</option>
                <option value="stars">✦ 璀璨星芒 ✦</option>
                <option value="none">無外框</option>
              </select>
            </div>
          </div>

          {/* Front & Back Stickers Chooser */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Front Sticker */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/70 to-teal-50/40 border border-emerald-200/80">
              <div className="flex items-center space-x-2.5">
                <div className="text-2xl p-1.5 bg-white rounded-lg shadow-xs border border-emerald-100 flex items-center justify-center">
                  <span className={config.frontSticker.animationClass || ''}>
                    {config.frontSticker.emoji}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-800">標題前置貼圖</span>
                    {config.frontSticker.isGif && (
                      <span className="px-1.5 py-0.2 bg-amber-500 text-[10px] font-black text-white rounded-full">
                        動態GIF
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">{config.frontSticker.name}</p>
                </div>
              </div>

              <button
                id="change-front-sticker-btn"
                onClick={() => onOpenStickerPicker('front')}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-100 rounded-lg border border-emerald-300 shadow-2xs transition-all"
              >
                更換貼圖
              </button>
            </div>

            {/* Back Sticker */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-50/70 to-pink-50/40 border border-rose-200/80">
              <div className="flex items-center space-x-2.5">
                <div className="text-2xl p-1.5 bg-white rounded-lg shadow-xs border border-rose-100 flex items-center justify-center">
                  <span className={config.backSticker.animationClass || ''}>
                    {config.backSticker.emoji}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-800">標題後置貼圖</span>
                    {config.backSticker.isGif && (
                      <span className="px-1.5 py-0.2 bg-rose-500 text-[10px] font-black text-white rounded-full">
                        動態GIF
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">{config.backSticker.name}</p>
                </div>
              </div>

              <button
                id="change-back-sticker-btn"
                onClick={() => onOpenStickerPicker('back')}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-100 rounded-lg border border-rose-300 shadow-2xs transition-all"
              >
                更換貼圖
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              id="swap-front-back-stickers-btn"
              onClick={handleSwapStickers}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>對調前後貼圖位置</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Bullet Symbols & Number Stickers (Requirement 4) */}
      <section
        id="section-bullet-selector"
        className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-gray-200/80 transition-all hover:border-emerald-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">各點序號貼圖與符號樣式</h2>
              <p className="text-xs text-gray-500">以亮眼之數字貼圖、打勾符號、菱形圖或星號呈現</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {BULLET_PRESETS.map((preset) => {
            const isSelected = config.bulletStyle === preset.key;
            return (
              <button
                key={preset.key}
                id={`bullet-preset-${preset.key}`}
                onClick={() => updateConfig({ bulletStyle: preset.key })}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 text-blue-900 font-bold shadow-xs'
                    : 'border-gray-200 hover:border-blue-300 bg-gray-50/50 hover:bg-white text-gray-700'
                }`}
              >
                <span className="text-xl shrink-0 p-1 bg-white rounded-lg shadow-2xs border border-gray-100">
                  {preset.icon}
                </span>
                <span className="text-xs truncate">{preset.label.split('(')[0]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Items Content Editor (Requirement 1 & 2) */}
      <section
        id="section-items-editor"
        className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-gray-200/80 transition-all hover:border-emerald-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">公告項目與文字細節</h2>
              <p className="text-xs text-gray-500">
                可修改、新增、重新排序或貼上文字自動拆解
              </p>
            </div>
          </div>

          <button
            id="toggle-raw-importer-btn"
            onClick={() => setShowTextImporter(!showTextImporter)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 font-semibold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showTextImporter ? '收合文字解析' : '貼上文字快速解析'}</span>
          </button>
        </div>

        {/* Quick Text Importer Box */}
        {showTextImporter && (
          <div
            id="raw-text-importer-box"
            className="mb-5 p-4 rounded-xl bg-purple-50/80 border border-purple-200 space-y-3 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900">
                📋 貼上您現有的公告文字，系統自動解析分點：
              </span>
              <span className="text-[11px] text-purple-600">支援 1. 2. 3. 或打勾項目自動拆分</span>
            </div>
            <textarea
              id="raw-text-import-textarea"
              rows={4}
              value={importRawText}
              onChange={(e) => setImportRawText(e.target.value)}
              placeholder={`(人事室-文康活動報名公告)\n1.辦理時間：113年11月20日\n2.報名期間:113年10月25日以前\n3.報名表單網址:https://forms.gle/sample\n4.其他注意事項:請自備水杯`}
              className="w-full p-3 bg-white border border-purple-200 rounded-lg text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-end gap-2">
              <button
                id="cancel-import-text-btn"
                onClick={() => setShowTextImporter(false)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
              >
                取消
              </button>
              <button
                id="confirm-parse-text-btn"
                onClick={handleParseImportedText}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                解析並匯入
              </button>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-3">
          {config.items.map((item, index) => {
            const currentBullet =
              BULLET_PRESETS.find((p) => p.key === config.bulletStyle)?.getSymbol(index) || `${index + 1}.`;

            return (
              <div
                key={item.id}
                id={`editor-item-row-${item.id}`}
                className="group flex flex-col md:flex-row gap-2.5 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-purple-300 transition-all"
              >
                {/* Bullet badge indicator & row index */}
                <div className="flex items-center justify-between md:justify-start gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-lg w-7 h-7 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-2xs font-bold text-gray-800"
                      title="目前序號貼圖"
                    >
                      {item.prefixEmoji || currentBullet}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">#{index + 1}</span>
                  </div>

                  {/* Move Up/Down Controls for Mobile */}
                  <div className="flex md:hidden items-center gap-1">
                    <button
                      onClick={() => handleMoveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveItem(index, 'down')}
                      disabled={index === config.items.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Label & Content Inputs */}
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleItemChange(item.id, 'label', e.target.value)}
                    placeholder="項目名稱 (如: 辦理時間)"
                    className="w-full sm:w-36 px-3 py-1.5 text-xs font-bold text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) => handleItemChange(item.id, 'content', e.target.value)}
                    placeholder="項目詳細內容，如日期、時間或說明"
                    className="flex-1 px-3 py-1.5 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Desktop Move & Delete Controls */}
                <div className="hidden md:flex items-center gap-1 shrink-0">
                  <button
                    id={`move-up-item-${item.id}`}
                    onClick={() => handleMoveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 rounded-md hover:bg-gray-100"
                    title="上移"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`move-down-item-${item.id}`}
                    onClick={() => handleMoveItem(index, 'down')}
                    disabled={index === config.items.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 rounded-md hover:bg-gray-100"
                    title="下移"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`delete-item-${item.id}`}
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-rose-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                    title="刪除此項目"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add item button */}
        <div className="mt-4 flex justify-between items-center">
          <button
            id="add-announcement-item-btn"
            onClick={handleAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-300 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>新增公告項目 (如：報名費用、攜帶物品)</span>
          </button>
          <span className="text-xs text-gray-400">共 {config.items.length} 個公告項目</span>
        </div>

        {/* Optional Footer Notice */}
        <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <span>💡 底部特別提醒 / 補充備註 (可選)</span>
            </label>
            <input
              type="checkbox"
              id="toggle-footer-notice"
              checked={config.showFooterNotice}
              onChange={(e) => updateConfig({ showFooterNotice: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
            />
          </div>

          {config.showFooterNotice && (
            <input
              id="footer-notice-input"
              type="text"
              value={config.footerNoticeText}
              onChange={(e) => updateConfig({ footerNoticeText: e.target.value })}
              placeholder="例如：名額有限，敬請同仁踴躍報名參加！若有疑問請洽分機 #8888"
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          )}
        </div>
      </section>

      {/* 4. Vivid Color Theme & Date/Number Highlight (Requirement 5) */}
      <section
        id="section-color-and-highlight"
        className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-gray-200/80 transition-all hover:border-emerald-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">鮮艷配色與數字/日期自動粗體高亮</h2>
              <p className="text-xs text-gray-500">
                自動以高對比亮色及粗體標註數字與日期，與一般文字清楚區隔
              </p>
            </div>
          </div>

          {/* Toggle Auto Highlight */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-semibold text-gray-700">自動高亮數字日期</span>
            <input
              type="checkbox"
              id="toggle-auto-highlight"
              checked={config.autoHighlight}
              onChange={(e) => updateConfig({ autoHighlight: e.target.checked })}
              className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500"
            />
          </label>
        </div>

        {/* Highlighting Scheme Choice */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <Highlighter className="w-3.5 h-3.5 text-amber-500" />
            <span>數字與日期高亮色彩：</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {
                id: 'vibrant-coral',
                label: '活力紅寶石 (醒目極致)',
                color: 'text-rose-600 bg-rose-50 border-rose-300',
              },
              {
                id: 'bright-amber',
                label: '亮眼金琥珀 (溫暖耀眼)',
                color: 'text-amber-600 bg-amber-50 border-amber-300',
              },
              {
                id: 'neon-magenta',
                label: '螢光霓虹桃 (吸睛甜心)',
                color: 'text-pink-600 bg-pink-50 border-pink-300',
              },
              {
                id: 'emerald-cyan',
                label: '極光青翡翠 (高尚清晰)',
                color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
              },
            ].map((sch) => {
              const isSelected = config.highlightScheme === sch.id;
              return (
                <button
                  key={sch.id}
                  id={`highlight-scheme-${sch.id}`}
                  onClick={() => updateConfig({ highlightScheme: sch.id as any })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all ${
                    isSelected
                      ? `${sch.color} ring-2 ring-offset-1 ring-amber-400 shadow-2xs`
                      : 'border-gray-200 text-gray-600 bg-gray-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
                    <span className="truncate">{sch.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Theme Selector */}
        <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <Palette className="w-3.5 h-3.5 text-emerald-500" />
            <span>卡片視覺色彩主題：</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {COLOR_THEMES.map((th) => {
              const isSelected = config.themeId === th.id;
              return (
                <button
                  key={th.id}
                  id={`theme-select-${th.id}`}
                  onClick={() => updateConfig({ themeId: th.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/60 hover:bg-white'
                  }`}
                >
                  <div
                    className="w-full h-4 rounded-md mb-2 shadow-2xs"
                    style={{ background: th.accentColor }}
                  />
                  <div className="text-xs text-gray-900 font-semibold truncate">{th.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">{th.category}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
