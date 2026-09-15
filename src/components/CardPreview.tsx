import React, { useRef, useState } from 'react';
import {
  Copy,
  Download,
  Share2,
  Check,
  Image as ImageIcon,
  Smartphone,
  Eye,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Film,
  Loader2,
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import confetti from 'canvas-confetti';
import { AnnouncementConfig } from '../types';
import { BULLET_PRESETS, COLOR_THEMES, getStickerAnimationClass, resolveStickerAnimType } from '../data/stickers';
import { formatLineTextForClipboard, renderHighlightedText } from '../utils/textHighlighter';
import { generateAnimatedCardGif, copyGifToClipboard, copyRichTextWithGif } from '../utils/gifGenerator';
import { GifExportModal } from './GifExportModal';
import { LineShareModal } from './LineShareModal';

interface CardPreviewProps {
  config: AnnouncementConfig;
  onOpenStickerPicker: (target: 'front' | 'back') => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ config, onOpenStickerPicker }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgressText, setExportProgressText] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'card' | 'line-chat'>('card');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Animated GIF Modal State
  const [generatedGifData, setGeneratedGifData] = useState<{
    dataUrl: string;
    blob: Blob;
  } | null>(null);
  const [showGifModal, setShowGifModal] = useState(false);
  const [showLineShareModal, setShowLineShareModal] = useState(false);

  const theme = COLOR_THEMES.find((t) => t.id === config.themeId) || COLOR_THEMES[0];
  const bulletPreset = BULLET_PRESETS.find((p) => p.key === config.bulletStyle) || BULLET_PRESETS[1];

  // Helper to trigger toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Get wrapped title
  const getWrappedTitle = () => {
    switch (config.titleWrapper) {
      case 'parentheses':
        return `(${config.title})`;
      case 'brackets':
        return `【${config.title}】`;
      case 'corner':
        return `『${config.title}』`;
      case 'stars':
        return `✦ ${config.title} ✦`;
      case 'none':
      default:
        return config.title;
    }
  };

  // Determine highlight classes
  const getHighlightConfig = () => {
    switch (config.highlightScheme) {
      case 'bright-amber':
        return {
          highlightColorClass: 'text-amber-800 font-black',
          highlightBgClass: 'bg-amber-100/90 ring-1 ring-amber-400 px-1 py-0.5 rounded-md shadow-2xs',
        };
      case 'neon-magenta':
        return {
          highlightColorClass: 'text-pink-700 font-black',
          highlightBgClass: 'bg-pink-100/90 ring-1 ring-pink-300 px-1 py-0.5 rounded-md shadow-2xs',
        };
      case 'emerald-cyan':
        return {
          highlightColorClass: 'text-emerald-800 font-black',
          highlightBgClass: 'bg-emerald-100/90 ring-1 ring-emerald-400 px-1 py-0.5 rounded-md shadow-2xs',
        };
      case 'vibrant-coral':
      default:
        return {
          highlightColorClass: 'text-rose-700 font-black',
          highlightBgClass: 'bg-rose-100/90 ring-1 ring-rose-300 px-1 py-0.5 rounded-md shadow-2xs',
        };
    }
  };

  // Copy text formatted for LINE with animated sticker card support
  const handleCopyText = async () => {
    const formatted = formatLineTextForClipboard(
      config.title,
      config.titleWrapper,
      config.frontSticker.emoji,
      config.backSticker.emoji,
      bulletPreset.getSymbol,
      config.items,
      config.showFooterNotice ? config.footerNoticeText : undefined,
    );

    try {
      // Check if we need to generate animated GIF card to bundle into clipboard
      let currentGif = generatedGifData;
      if (!currentGif && cardRef.current) {
        setIsExporting(true);
        setExportProgressText('正在準備文字與動態貼圖...');
        try {
          currentGif = await generateAnimatedCardGif(cardRef.current);
          setGeneratedGifData(currentGif);
        } catch (gifErr) {
          console.warn('GIF generation during copy text notice:', gifErr);
        } finally {
          setIsExporting(false);
          setExportProgressText('');
        }
      }

      // Copy rich payload (text/plain + HTML with animated GIF)
      const res = await copyRichTextWithGif(
        formatted,
        currentGif?.blob,
        currentGif?.dataUrl,
      );

      setCopiedText(true);
      if (res.hasGif) {
        showToast('✅ 已複製文字並包含動態貼圖！貼至 LINE 即可呈現動態效果');
        setShowGifModal(true);
      } else {
        showToast('✅ 已複製 LINE 格式文字！');
      }
      confetti({ particleCount: 45, spread: 65, origin: { y: 0.8 } });
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error('Failed to copy text', err);
      showToast('複製失敗，請手動複製');
    }
  };

  // Generate & Copy Animated Card GIF (Requirement 1: Animated stickers play in LINE)
  const handleCopyAnimatedCard = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      setExportProgressText('正在準備錄製動態貼圖卡片...');

      const result = await generateAnimatedCardGif(
        cardRef.current,
        (current, total, status) => {
          setExportProgressText(status);
        },
      );

      setGeneratedGifData(result);

      // Generate crisp PNG blob for guaranteed LINE Desktop and browser Ctrl+V compatibility
      let pngBlob: Blob | null = null;
      try {
        pngBlob = await toBlob(cardRef.current, {
          pixelRatio: 2.2,
          backgroundColor: '#ffffff',
        });
      } catch (blobErr) {
        console.warn('toBlob fallback in copyAnimatedCard:', blobErr);
      }

      // Write image to clipboard in LINE-compatible format
      const copyRes = await copyGifToClipboard(result.blob, pngBlob || undefined);
      setCopiedImage(true);
      setShowGifModal(true);

      if (copyRes.success) {
        showToast('✅ 卡片已複製！到 LINE 輸入框按 Ctrl + V 即可成功貼圖發送');
      } else {
        showToast('🎬 動態卡片已生成！請在彈出視窗點選「下載」或拖曳圖片至 LINE');
      }

      confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 } });
      setTimeout(() => setCopiedImage(false), 3000);
    } catch (err) {
      console.error('Copy animated card failed', err);
      showToast('生成動態卡片失敗，請重試');
    } finally {
      setIsExporting(false);
      setExportProgressText('');
    }
  };

  // Download High-Resolution Static PNG
  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      setExportProgressText('正在生成靜態高畫質 PNG 圖檔...');
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      const cleanTitle = config.title.replace(/[^\w\u4e00-\u9fa5]/g, '_');
      link.download = `LINE公告_${cleanTitle || '貼圖公告'}.png`;
      link.href = dataUrl;
      link.click();
      showToast('🎉 高畫質 PNG 圖片已下載！');
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    } catch (err) {
      console.error('Download PNG failed', err);
      showToast('下載圖片時發生錯誤');
    } finally {
      setIsExporting(false);
      setExportProgressText('');
    }
  };

  // Share directly to LINE without referrer or hosting URL
  const handleShareToLine = () => {
    setShowLineShareModal(true);
  };

  return (
    <div className="space-y-4">
      {/* View Switcher & Action Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
          <button
            id="view-card-mode-btn"
            onClick={() => setPreviewMode('card')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              previewMode === 'card'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>鮮艷貼圖卡片</span>
          </button>
          <button
            id="view-line-chat-mode-btn"
            onClick={() => setPreviewMode('line-chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              previewMode === 'line-chat'
                ? 'bg-[#06C755] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>LINE 對話模擬</span>
          </button>
        </div>

        {/* Quick Copy & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary: Copy Animated Card (GIF) */}
          <button
            id="copy-card-image-btn"
            onClick={handleCopyAnimatedCard}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
            title="複製包含動態貼圖之卡片，貼至 LINE 即可呈現動態效果"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : copiedImage ? (
              <Check className="w-4 h-4 text-emerald-200" />
            ) : (
              <Film className="w-4 h-4 text-amber-300 animate-pulse" />
            )}
            <span>
              {isExporting ? '錄製動態貼圖中...' : copiedImage ? '動態卡片已複製！' : '複製動態卡片 (GIF)'}
            </span>
          </button>

          {/* Text copy (with dynamic animated stickers) */}
          <button
            id="copy-line-text-btn"
            onClick={handleCopyText}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold border border-gray-300 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
            title="複製文字並包含動態貼圖卡片至剪貼簿，貼至 LINE 即可呈現動態效果"
          >
            {copiedText ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500" />
            )}
            <span>{copiedText ? '已複製文字與動態圖！' : '複製文字 (含動態貼圖)'}</span>
          </button>

          {/* Static PNG Download */}
          <button
            id="download-card-png-btn"
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold border border-gray-300 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
            title="下載高解析靜態 PNG 圖檔"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>下載 PNG</span>
          </button>

          {/* Share directly into LINE */}
          <button
            id="share-to-line-app-btn"
            onClick={handleShareToLine}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
            title="直接開啟 LINE 發送"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LINE 分享</span>
          </button>
        </div>
      </div>

      {/* Export progress banner */}
      {isExporting && exportProgressText && (
        <div
          id="export-progress-banner"
          className="p-3 bg-emerald-900/90 text-emerald-100 text-xs font-bold rounded-xl text-center shadow-lg border border-emerald-700 flex items-center justify-center gap-2 animate-in fade-in"
        >
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>{exportProgressText}</span>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification-banner"
          className="p-3 bg-gray-900 text-white text-xs font-semibold rounded-xl text-center shadow-lg border border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {toastMessage}
        </div>
      )}

      {/* Preview Container */}
      <div className="relative flex justify-center items-center p-4 md:p-6 bg-gradient-to-b from-gray-100 to-gray-200/60 rounded-3xl border border-gray-200 min-h-[460px]">
        {previewMode === 'card' ? (
          /* ========================================================= */
          /* MODE A: VIBRANT STICKER CARD (Can be exported as PNG/copied) */
          /* ========================================================= */
          <div
            ref={cardRef}
            id="announcement-export-card"
            className={`w-full max-w-lg rounded-3xl shadow-xl border-4 overflow-hidden transition-all duration-300 ${
              theme.cardBorder
            } ${theme.cardBg}`}
            style={{
              boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Header Ribbon / Banner */}
            <div
              className={`px-5 py-5 sm:px-6 sm:py-6 ${theme.headerBg} ${theme.headerText} relative overflow-hidden`}
            >
              {/* Background decorative shimmer */}
              <div className="absolute inset-0 bg-white/10 opacity-30 pointer-events-none mix-blend-overlay"></div>
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/15 blur-xl pointer-events-none"></div>

              {/* Title Section with Front & Back Stickers */}
              <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 text-center">
                {/* Front Sticker Button */}
                <button
                  type="button"
                  onClick={() => onOpenStickerPicker('front')}
                  title="點擊更換前置貼圖"
                  className="group relative cursor-pointer transform hover:scale-120 transition-transform active:scale-95"
                >
                  <span
                    data-sticker="front"
                    data-anim={resolveStickerAnimType(
                      config.frontSticker.emoji,
                      config.frontSticker.animationClass,
                    )}
                    className={`text-3xl sm:text-4xl drop-shadow-md select-none inline-block ${getStickerAnimationClass(
                      config.frontSticker.emoji,
                      config.frontSticker.animationClass,
                    )}`}
                  >
                    {config.frontSticker.emoji}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 absolute -bottom-5 left-1/2 -translate-x-1/2 bg-black/80 text-[9px] text-white px-1.5 py-0.5 rounded-sm whitespace-nowrap transition-opacity pointer-events-none">
                    更換
                  </span>
                </button>

                {/* Main Announcement Title */}
                <h1 className="font-black text-xl sm:text-2xl tracking-tight leading-tight drop-shadow-xs max-w-[70%] break-words">
                  {getWrappedTitle()}
                </h1>

                {/* Back Sticker Button */}
                <button
                  type="button"
                  onClick={() => onOpenStickerPicker('back')}
                  title="點擊更換後置貼圖"
                  className="group relative cursor-pointer transform hover:scale-120 transition-transform active:scale-95"
                >
                  <span
                    data-sticker="back"
                    data-anim={resolveStickerAnimType(
                      config.backSticker.emoji,
                      config.backSticker.animationClass,
                    )}
                    className={`text-3xl sm:text-4xl drop-shadow-md select-none inline-block ${getStickerAnimationClass(
                      config.backSticker.emoji,
                      config.backSticker.animationClass,
                    )}`}
                  >
                    {config.backSticker.emoji}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 absolute -bottom-5 left-1/2 -translate-x-1/2 bg-black/80 text-[9px] text-white px-1.5 py-0.5 rounded-sm whitespace-nowrap transition-opacity pointer-events-none">
                    更換
                  </span>
                </button>
              </div>
            </div>

            {/* Decorative Divider Line */}
            <div className="h-1.5 bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300 opacity-90"></div>

            {/* Card Content Body */}
            <div className="p-5 sm:p-7 space-y-4">
              {config.items.map((item, idx) => {
                const bulletSymbol = item.prefixEmoji || bulletPreset.getSymbol(idx);

                return (
                  <div
                    key={item.id}
                    id={`preview-item-row-${idx}`}
                    className="flex items-start gap-3 text-left group"
                  >
                    {/* Bullet sticker / badge */}
                    <div className="shrink-0 pt-0.5">
                      <span
                        data-sticker="item"
                        data-anim={resolveStickerAnimType(bulletSymbol)}
                        className={`inline-flex items-center justify-center text-xl sm:text-2xl select-none filter drop-shadow-2xs transition-transform group-hover:scale-115 inline-block ${getStickerAnimationClass(
                          bulletSymbol,
                        )}`}
                        style={{ minWidth: '28px' }}
                      >
                        {bulletSymbol}
                      </span>
                    </div>

                    {/* Label & Content with date/number highlights */}
                    <div className="flex-1 text-sm sm:text-base leading-relaxed break-words">
                      {item.label && (
                        <span className="font-bold mr-1 text-gray-950 inline-block">
                          {item.label}：
                        </span>
                      )}

                      <span className="text-gray-800 font-medium">
                        {config.autoHighlight
                          ? renderHighlightedText(item.content, getHighlightConfig())
                          : item.content}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Optional Footer Notice Bar */}
              {config.showFooterNotice && config.footerNoticeText && (
                <div
                  id="preview-footer-notice"
                  className="mt-6 pt-4 border-t-2 border-dashed border-gray-200/90"
                >
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs sm:text-sm font-semibold shadow-2xs">
                    <span data-sticker="notice" className="text-base animate-bounce">
                      💡
                    </span>
                    <span className="flex-1">
                      {config.autoHighlight
                        ? renderHighlightedText(config.footerNoticeText, getHighlightConfig())
                        : config.footerNoticeText}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Note: Bottom Card Footer Branding ("LINE 文字貼圖公告卡") has been removed as requested */}
          </div>
        ) : (
          /* ========================================================= */
          /* MODE B: LINE CHAT BUBBLE SIMULATION                     */
          /* ========================================================= */
          <div
            id="line-chat-simulation-container"
            className="w-full max-w-md bg-[#849EB9] rounded-3xl shadow-2xl border-4 border-gray-700 overflow-hidden flex flex-col min-h-[500px]"
          >
            {/* LINE Mobile Top App Bar */}
            <div className="bg-[#2c3e50] text-white px-4 py-3 flex items-center justify-between border-b border-gray-600/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="font-bold text-xs">群組聊天室公告預覽</span>
              </div>
              <span className="text-[11px] text-gray-300">LINE App</span>
            </div>

            {/* Chat Messages Area */}
            <div className="p-4 flex-1 space-y-4 overflow-y-auto">
              {/* Date stamp in LINE */}
              <div className="text-center">
                <span className="inline-block px-3 py-0.5 bg-black/20 text-white text-[10px] rounded-full">
                  今天 下午 14:30
                </span>
              </div>

              {/* Chat Message Bubble (Green for user in LINE) */}
              <div className="flex justify-end gap-2 items-end">
                <span className="text-[10px] text-white/80 pb-0.5">已讀 28</span>

                <div className="max-w-[85%] bg-[#85e249] text-gray-900 rounded-2xl rounded-tr-xs p-3.5 shadow-md border border-[#72cb3c] space-y-2">
                  {/* Title with animated stickers */}
                  <div className="font-bold text-sm text-gray-950 flex items-center gap-1.5 border-b border-black/10 pb-1.5">
                    <span
                      className={`inline-block ${getStickerAnimationClass(
                        config.frontSticker.emoji,
                        config.frontSticker.animationClass,
                      )}`}
                    >
                      {config.frontSticker.emoji}
                    </span>
                    <span>{getWrappedTitle()}</span>
                    <span
                      className={`inline-block ${getStickerAnimationClass(
                        config.backSticker.emoji,
                        config.backSticker.animationClass,
                      )}`}
                    >
                      {config.backSticker.emoji}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 text-xs">
                    {config.items.map((item, idx) => {
                      const bullet = item.prefixEmoji || bulletPreset.getSymbol(idx);
                      return (
                        <div key={item.id} className="flex items-start gap-1.5 leading-snug">
                          <span
                            className={`shrink-0 inline-block ${getStickerAnimationClass(
                              bullet,
                            )}`}
                          >
                            {bullet}
                          </span>
                          <div>
                            {item.label && <span className="font-bold">{item.label}：</span>}
                            <span>{item.content}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer Notice */}
                  {config.showFooterNotice && config.footerNoticeText && (
                    <div className="pt-1.5 border-t border-black/10 text-[11px] text-gray-800 flex items-center gap-1">
                      <span className="animate-sticker-flash inline-block">💡</span>
                      <span>{config.footerNoticeText}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic image card preview inside LINE chat */}
              <div className="flex justify-end gap-2 items-end mt-2">
                <span className="text-[10px] text-white/80 pb-0.5">已讀 28</span>
                <div className="max-w-[80%] rounded-xl overflow-hidden shadow-md border-2 border-white/40 bg-white">
                  <div className="bg-[#06C755] text-white p-2 text-center text-xs font-bold flex items-center justify-center gap-1.5">
                    <span
                      className={`inline-block ${getStickerAnimationClass(
                        config.frontSticker.emoji,
                        config.frontSticker.animationClass,
                      )}`}
                    >
                      {config.frontSticker.emoji}
                    </span>
                    <span className="truncate">{config.title}</span>
                    <span
                      className={`inline-block ${getStickerAnimationClass(
                        config.backSticker.emoji,
                        config.backSticker.animationClass,
                      )}`}
                    >
                      {config.backSticker.emoji}
                    </span>
                  </div>
                  <div className="p-2.5 text-[11px] space-y-1 text-gray-700 bg-gray-50">
                    <p className="font-semibold text-rose-600">🎬 支援完整動態貼圖播放</p>
                    <p className="text-[10px] text-gray-500">已錄製流暢循環動畫，可於群組呈現生動效果</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat bottom input bar mock */}
            <div className="bg-white px-3 py-2 border-t border-gray-200 flex items-center gap-2">
              <div className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-400">
                已準備好隨時在群組傳送公告...
              </div>
              <button
                onClick={handleCopyText}
                className="w-7 h-7 bg-[#06C755] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-xs hover:bg-emerald-600"
                title="一鍵複製文字到剪貼簿"
              >
                📋
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animated GIF Result Modal */}
      <GifExportModal
        isOpen={showGifModal}
        onClose={() => setShowGifModal(false)}
        gifDataUrl={generatedGifData?.dataUrl || null}
        gifBlob={generatedGifData?.blob || null}
        title={config.title}
        formattedText={formatLineTextForClipboard(
          config.title,
          config.titleWrapper,
          config.frontSticker.emoji,
          config.backSticker.emoji,
          bulletPreset.getSymbol,
          config.items,
          config.showFooterNotice ? config.footerNoticeText : undefined,
        )}
      />

      {/* LINE Share Modal */}
      <LineShareModal
        isOpen={showLineShareModal}
        onClose={() => setShowLineShareModal(false)}
        formattedText={formatLineTextForClipboard(
          config.title,
          config.titleWrapper,
          config.frontSticker.emoji,
          config.backSticker.emoji,
          bulletPreset.getSymbol,
          config.items,
          config.showFooterNotice ? config.footerNoticeText : undefined,
        )}
        onCopyText={handleCopyText}
      />
    </div>
  );
};
