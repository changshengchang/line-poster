import React, { useState } from 'react';
import { Copy, Check, Share2, Sparkles, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnnouncementConfig } from '../types';
import { BULLET_PRESETS } from '../data/stickers';
import { formatLineTextForClipboard } from '../utils/textHighlighter';

interface TextOutputViewProps {
  config: AnnouncementConfig;
}

export const TextOutputView: React.FC<TextOutputViewProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);
  const bulletPreset = BULLET_PRESETS.find((p) => p.key === config.bulletStyle) || BULLET_PRESETS[1];

  const formattedText = formatLineTextForClipboard(
    config.title,
    config.titleWrapper,
    config.frontSticker.emoji,
    config.backSticker.emoji,
    bulletPreset.getSymbol,
    config.items,
    config.showFooterNotice ? config.footerNoticeText : undefined,
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.85 } });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      id="text-output-section"
      className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-gray-200/80 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">LINE 純文字公告格式</h3>
            <p className="text-xs text-gray-500">已排版好對齊、符號與分隔線，可直接貼入任何通訊軟體</p>
          </div>
        </div>

        <button
          id="copy-raw-text-view-btn"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-100" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? '已複製！' : '一鍵複製'}</span>
        </button>
      </div>

      <div className="relative">
        <textarea
          id="formatted-text-display-box"
          readOnly
          value={formattedText}
          rows={Math.max(6, config.items.length + 5)}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs sm:text-sm text-gray-800 focus:outline-none select-all resize-none shadow-inner leading-relaxed"
        />
        <div className="absolute right-3 bottom-3 text-[11px] text-gray-400 bg-white/90 px-2 py-0.5 rounded-md border border-gray-200 pointer-events-none">
          {formattedText.length} 字元
        </div>
      </div>
    </div>
  );
};
