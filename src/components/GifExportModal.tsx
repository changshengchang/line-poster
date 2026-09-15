import React, { useState } from 'react';
import { X, Download, Copy, Check, Sparkles, HelpCircle, Folder, HardDrive, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { copyGifToClipboard } from '../utils/gifGenerator';

interface GifExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  gifDataUrl: string | null;
  gifBlob: Blob | null;
  title: string;
  formattedText?: string;
}

export const GifExportModal: React.FC<GifExportModalProps> = ({
  isOpen,
  onClose,
  gifDataUrl,
  gifBlob,
  title,
  formattedText,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string>('已嘗試複製至剪貼簿');
  const [showLocationInfo, setShowLocationInfo] = useState(true);

  if (!isOpen || !gifDataUrl || !gifBlob) return null;

  const handleCopyAgain = async () => {
    const res = await copyGifToClipboard(gifBlob);
    setCopied(true);
    if (res.success) {
      setCopyFeedback('✅ 已複製！到 LINE 按 Ctrl+V 貼上');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } else {
      setCopyFeedback('請在下方動態圖按右鍵點「複製影像」！');
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyTextOnly = async () => {
    if (!formattedText) return;
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopiedText(true);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const cleanTitle = title.replace(/[^\w\u4e00-\u9fa5]/g, '_');
  const fileName = `LINE動態公告_${cleanTitle || '貼圖公告'}.gif`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = gifDataUrl;
    link.click();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <div
      id="gif-export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="gif-export-dialog"
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl animate-bounce">🎬</span>
            <div>
              <h3 className="font-bold text-base text-white">動態貼圖卡片已生成！</h3>
              <p className="text-xs text-emerald-100">已包含前後動態貼圖旋轉、心跳與跳動效果</p>
            </div>
          </div>
          <button
            id="close-gif-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-center">
          {/* Animated GIF Display */}
          <div className="relative inline-block mx-auto rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-300 max-h-[350px] group">
            <img
              src={gifDataUrl}
              alt="LINE 公告動態貼圖卡片"
              draggable={true}
              className="w-full h-auto max-h-[350px] object-contain block select-all cursor-grab active:cursor-grabbing"
              title="可直接將此圖片拖曳進 LINE 聊天室，或按 Ctrl+V 貼上"
            />
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded-full backdrop-blur-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>動態 GIF (可直接拖曳至 LINE)</span>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900/85 text-white text-[11px] font-semibold rounded-full shadow-md backdrop-blur-xs whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
              <span>⌨️ 已支援 LINE：按 Ctrl + V 即可直接貼圖</span>
            </div>
          </div>

          {/* Directory & Storage Location Explanation */}
          <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 text-left space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                <Folder className="w-4 h-4 text-blue-600" />
                <span>檔案儲存與放置目錄說明：</span>
              </div>
              <button
                onClick={() => setShowLocationInfo(!showLocationInfo)}
                className="text-[11px] text-blue-700 underline font-medium"
              >
                {showLocationInfo ? '收合' : '展開'}
              </button>
            </div>

            {showLocationInfo && (
              <div className="text-xs text-blue-900 space-y-2 leading-relaxed">
                <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-blue-100">
                  <span className="shrink-0 text-base">📋</span>
                  <div>
                    <strong className="text-blue-950">點擊「複製動態圖」：</strong>
                    <span className="text-gray-700">
                      檔案直接存入<strong>【電腦系統剪貼簿 (RAM 記憶體)】</strong>，不會在硬碟產生檔案！請直接到 LINE 聊天室按鍵盤 <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded-sm font-mono text-[11px]">Ctrl + V</kbd> 貼上即可發送。
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-blue-100">
                  <span className="shrink-0 text-base">📁</span>
                  <div>
                    <strong className="text-blue-950">點擊「下載動態 GIF」：</strong>
                    <span className="text-gray-700">
                      檔案會儲存於您電腦的<strong>【下載】資料夾 (Downloads 目錄)</strong>：
                    </span>
                    <ul className="mt-1 text-[11px] text-gray-600 list-disc list-inside">
                      <li>Windows：<code className="bg-blue-100/60 px-1 py-0.5 rounded text-blue-900 font-mono">C:\Users\使用者名稱\Downloads</code></li>
                      <li>Mac：<code className="bg-blue-100/60 px-1 py-0.5 rounded text-blue-900 font-mono">~/Downloads (下載項目)</code></li>
                    </ul>
                    <p className="mt-1 text-[11px] text-emerald-700 font-medium">
                      💡 下載後，在瀏覽器右上角下載紀錄點「在資料夾中顯示」，直接把 <code className="font-bold">{fileName}</code> 拖曳進 LINE 聊天室即可！
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              id="download-gif-file-btn"
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>下載動態 GIF 至「下載」資料夾</span>
            </button>

            <button
              id="copy-gif-again-btn"
              onClick={handleCopyAgain}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? copyFeedback : '複製動態圖 (進剪貼簿)'}</span>
            </button>

            {formattedText && (
              <button
                id="copy-text-in-modal-btn"
                onClick={handleCopyTextOnly}
                className="flex items-center justify-center gap-1.5 px-3.5 py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95"
                title="複製純文字格式"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                <span>{copiedText ? '已複製文字' : '複製文字'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            完成並關閉
          </button>
        </div>
      </div>
    </div>
  );
};
