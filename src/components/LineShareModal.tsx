import React, { useState } from 'react';
import { X, MessageCircle, Laptop, ExternalLink, Copy, Check, HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LineShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  formattedText: string;
  onCopyText: () => void;
}

export const LineShareModal: React.FC<LineShareModalProps> = ({
  isOpen,
  onClose,
  formattedText,
  onCopyText,
}) => {
  const [copied, setCopied] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  if (!isOpen) return null;

  const cleanText = formattedText.trim();
  const encodedText = encodeURIComponent(cleanText);

  // Method 1: Launch Native Desktop LINE App
  const handleLaunchDesktopLine = () => {
    // Attempt line:// protocol directly (opens Windows/macOS LINE desktop application)
    window.location.href = `line://share?text=${encodedText}`;
    setTimeout(() => {
      // Fallback url scheme if needed
      window.location.href = `line://msg/text/?${encodedText}`;
    }, 500);
  };

  // Method 2: Open LINE Web Share
  const handleOpenWebLine = () => {
    const a = document.createElement('a');
    // Using LINE modern universal share endpoint without referrer
    a.href = `https://line.me/R/share?text=${encodedText}`;
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
    a.referrerPolicy = 'no-referrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Method 3: Copy Text Directly
  const handleCopy = () => {
    onCopyText();
    setCopied(true);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="line-share-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="line-share-dialog"
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#06C755] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#06C755] flex items-center justify-center font-black text-sm">
              LINE
            </div>
            <div>
              <h3 className="font-bold text-base text-white">選擇 LINE 分享方式</h3>
              <p className="text-xs text-emerald-100">提供電腦版應用程式、網頁分享與一鍵貼上</p>
            </div>
          </div>
          <button
            id="close-line-share-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Method 1: Desktop App */}
          <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/60 hover:bg-emerald-50 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#06C755] text-white text-[11px] font-bold rounded-md">
                    最推薦・最完整
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-emerald-700" />
                    開啟 LINE 電腦版 App
                  </h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  直接喚起您電腦中已安裝的 LINE 軟體，<strong>好友與群組名單100%完整呈現</strong>，無需在網頁重複登入。
                </p>
              </div>
              <button
                id="launch-desktop-line-btn"
                onClick={handleLaunchDesktopLine}
                className="shrink-0 px-4 py-2.5 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-1"
              >
                <span>開啟 LINE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Method 2: Direct Copy & Paste */}
          <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-white transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <Copy className="w-4 h-4 text-gray-700" />
                  一鍵複製文字 (手動到 LINE 貼上)
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  將已排版好、含貼圖與日期的文字存入剪貼簿，直接在 LINE 聊天室按 <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded-sm font-mono text-[11px]">Ctrl + V</kbd> 貼上，最穩定快速！
                </p>
              </div>
              <button
                id="modal-copy-line-text-btn"
                onClick={handleCopy}
                className="shrink-0 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已複製！' : '複製文字'}</span>
              </button>
            </div>
          </div>

          {/* Method 3: Web Share Link */}
          <div className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                  開啟 LINE 網頁版分享
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  在瀏覽器分頁開啟 LINE 網頁分享視窗。
                </p>
              </div>
              <button
                id="launch-web-line-btn"
                onClick={handleOpenWebLine}
                className="shrink-0 px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-medium rounded-xl transition-all"
              >
                開啟網頁版
              </button>
            </div>
          </div>

          {/* Troubleshoot for Web Share Contact Blank Issue */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-left space-y-2">
            <button
              onClick={() => setShowTroubleshoot(!showTroubleshoot)}
              className="w-full flex items-center justify-between text-xs font-bold text-amber-900"
            >
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>為什麼 LINE 網頁版登入後「聊天室」無法顯示好友或群組？</span>
              </div>
              <span className="text-[11px] text-amber-700 underline">
                {showTroubleshoot ? '收合說明' : '查看原因與解決方式'}
              </span>
            </button>

            {showTroubleshoot && (
              <div className="pt-2 text-xs text-amber-800 space-y-2 leading-relaxed border-t border-amber-200/80 animate-in fade-in duration-150">
                <p>
                  <strong>原因 1：需手動點擊下方「💬 聊天室」按鈕</strong>
                  <br />
                  LINE 網頁分享預設停留在留言預覽畫面。請注意看畫面<strong>最下方左右兩顆大按鈕</strong>，必須點擊左邊的<strong>【💬 聊天室】</strong>按鈕，才會切換至好友與群組清單。
                </p>
                <p>
                  <strong>原因 2：瀏覽器 Cookie 隱私安全防護限制</strong>
                  <br />
                  新版 Chrome / Edge 等瀏覽器會限制第三方 Cookie 與跨站腳本，導致 LINE 網頁分享 API 無法從伺服器取得好友清單（因此呈現空白）。
                </p>
                <div className="p-2.5 bg-amber-100/80 rounded-xl font-medium text-amber-950">
                  💡 <strong>最佳解決方案：</strong>建議改點上方綠色<strong>「開啟 LINE 電腦版 App」</strong>或<strong>「複製文字直接至 LINE 貼上」</strong>，即可 100% 避免網頁端載入問題！
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
