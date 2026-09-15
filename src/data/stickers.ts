import { BulletPreset, ColorTheme, StickerItem } from '../types';

export const STICKER_COLLECTION: StickerItem[] = [
  // --- Animated / GIF Stickers (動畫貼圖) ---
  {
    id: 'anim-star',
    name: '閃耀金星',
    emoji: '⭐',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-spin',
  },
  {
    id: 'anim-heart',
    name: '跳動愛心',
    emoji: '💖',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-heartbeat',
  },
  {
    id: 'anim-megaphone',
    name: '動態大聲公',
    emoji: '📢',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-wobble',
  },
  {
    id: 'anim-bell',
    name: '搖擺警示鈴',
    emoji: '🔔',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-swing',
  },
  {
    id: 'anim-siren',
    name: '閃爍警示燈',
    emoji: '🚨',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-flash',
  },
  {
    id: 'anim-sparkles',
    name: '璀璨星芒',
    emoji: '✨',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-sparkle',
  },
  {
    id: 'anim-popper',
    name: '慶祝拉炮',
    emoji: '🎉',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-bounce',
  },
  {
    id: 'anim-fire',
    name: '燃燒熱火',
    emoji: '🔥',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-pulse-fast',
  },
  {
    id: 'anim-crown',
    name: '尊榮皇冠',
    emoji: '👑',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-float',
  },
  {
    id: 'anim-bulb',
    name: '靈感閃燈',
    emoji: '💡',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-glow',
  },
  {
    id: 'anim-flower',
    name: '春日櫻花',
    emoji: '🌸',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-spin-slow',
  },
  {
    id: 'anim-lightning',
    name: '能量閃電',
    emoji: '⚡',
    category: 'animated',
    isGif: true,
    animationClass: 'animate-sticker-flash',
  },

  // --- Notice & Alerts (提醒與公告) ---
  { id: 'not-loudspeaker', name: '大聲公', emoji: '📢', category: 'notice', isGif: true, animationClass: 'animate-sticker-wobble' },
  { id: 'not-bell', name: '提醒鈴鐺', emoji: '🔔', category: 'notice', isGif: true, animationClass: 'animate-sticker-swing' },
  { id: 'not-warning', name: '重要警告', emoji: '⚠️', category: 'notice', isGif: true, animationClass: 'animate-sticker-flash' },
  { id: 'not-siren', name: '警急警報', emoji: '🚨', category: 'notice', isGif: true, animationClass: 'animate-sticker-flash' },
  { id: 'not-cheer', name: '號角廣播', emoji: '📣', category: 'notice', isGif: true, animationClass: 'animate-sticker-wobble' },
  { id: 'not-bulb', name: '特別注意', emoji: '💡', category: 'notice', isGif: true, animationClass: 'animate-sticker-glow' },
  { id: 'not-pin', name: '紅色圖釘', emoji: '📌', category: 'notice', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'not-roundpin', name: '圓頭地標', emoji: '📍', category: 'notice', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'not-clipboard', name: '記事清單', emoji: '📋', category: 'notice', isGif: true, animationClass: 'animate-sticker-float' },
  { id: 'not-memo', name: '備忘筆記', emoji: '📝', category: 'notice', isGif: true, animationClass: 'animate-sticker-wobble' },
  { id: 'not-calendar', name: '日程行事曆', emoji: '🗓️', category: 'notice', isGif: true, animationClass: 'animate-sticker-float' },
  { id: 'not-clock', name: '時間截止', emoji: '⏰', category: 'notice', isGif: true, animationClass: 'animate-sticker-swing' },
  { id: 'not-hourglass', name: '倒數計時', emoji: '⏳', category: 'notice', isGif: true, animationClass: 'animate-sticker-float' },
  { id: 'not-mailbox', name: '通知信箱', emoji: '📮', category: 'notice', isGif: true, animationClass: 'animate-sticker-bounce' },

  // --- Hearts & Stars (星號與愛心) ---
  { id: 'hs-star', name: '五角星', emoji: '⭐', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-sparkle' },
  { id: 'hs-glowstar', name: '亮金星', emoji: '🌟', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-sparkle' },
  { id: 'hs-sparkle', name: '閃亮亮', emoji: '✨', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-sparkle' },
  { id: 'hs-dizzy', name: '旋轉星芒', emoji: '💫', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-spin-slow' },
  { id: 'hs-sparkheart', name: '閃亮愛心', emoji: '💖', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-heartbeat' },
  { id: 'hs-twohearts', name: '雙重愛心', emoji: '💕', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-heartbeat' },
  { id: 'hs-growheart', name: '澎湃愛心', emoji: '💗', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-heartbeat' },
  { id: 'hs-ribbonheart', name: '禮物愛心', emoji: '💝', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-heartbeat' },
  { id: 'hs-redheart', name: '熱情紅心', emoji: '❤️', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-heartbeat' },
  { id: 'hs-purpleheart', name: '高雅紫心', emoji: '💜', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-heartbeat' },
  { id: 'hs-crown', name: '金黃皇冠', emoji: '👑', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-float' },
  { id: 'hs-gem', name: '閃耀鑽石', emoji: '💎', category: 'heart-star', isGif: true, animationClass: 'animate-sticker-sparkle' },

  // --- Numbers & Badges (數字貼圖) ---
  { id: 'num-1', name: '數字 1', emoji: '1️⃣', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-2', name: '數字 2', emoji: '2️⃣', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-3', name: '數字 3', emoji: '3️⃣', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-4', name: '數字 4', emoji: '4️⃣', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-5', name: '數字 5', emoji: '5️⃣', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-6', name: '數字 6', emoji: '6️⃣', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-7', name: '數字 7', emoji: '7️⃣', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-8', name: '數字 8', emoji: '8️⃣', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-b1', name: '黑圓 1', emoji: '❶', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-b2', name: '黑圓 2', emoji: '❷', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-b3', name: '黑圓 3', emoji: '❸', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-b4', name: '黑圓 4', emoji: '❹', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-c1', name: '白圓 1', emoji: '①', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-c2', name: '白圓 2', emoji: '②', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-c3', name: '白圓 3', emoji: '③', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'num-c4', name: '白圓 4', emoji: '④', category: 'numbers', isGif: true, animationClass: 'animate-sticker-bounce' },

  // --- Symbols (菱形、打勾、符號) ---
  { id: 'sym-checkgreen', name: '綠色打勾', emoji: '✅', category: 'symbols', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'sym-checkheavy', name: '黑勾勾', emoji: '✔️', category: 'symbols', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'sym-checkbox', name: '方框打勾', emoji: '☑️', category: 'symbols', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'sym-diablue', name: '湛藍菱形', emoji: '🔷', category: 'symbols', isGif: true, animationClass: 'animate-sticker-sparkle' },
  { id: 'sym-diaorange', name: '橙黃菱形', emoji: '🔶', category: 'symbols', isGif: true, animationClass: 'animate-sticker-sparkle' },
  { id: 'sym-diadot', name: '晶瑩鑽格', emoji: '💠', category: 'symbols', isGif: true, animationClass: 'animate-sticker-spin-slow' },
  { id: 'sym-circlegreen', name: '鮮綠圓球', emoji: '🟢', category: 'symbols', isGif: true, animationClass: 'animate-sticker-pulse-fast' },
  { id: 'sym-circleyellow', name: '金黃圓球', emoji: '🟡', category: 'symbols', isGif: true, animationClass: 'animate-sticker-pulse-fast' },
  { id: 'sym-circlered', name: '紅色圓球', emoji: '🔴', category: 'symbols', isGif: true, animationClass: 'animate-sticker-pulse-fast' },
  { id: 'sym-circleblue', name: '藍色圓球', emoji: '🔵', category: 'symbols', isGif: true, animationClass: 'animate-sticker-pulse-fast' },
  { id: 'sym-target', name: '精準紅心', emoji: '🎯', category: 'symbols', isGif: true, animationClass: 'animate-sticker-wobble' },
  { id: 'sym-tri-up', name: '紅倒三角', emoji: '🔺', category: 'symbols', isGif: true, animationClass: 'animate-sticker-bounce' },

  // --- Celebration & Icons (慶祝與可愛) ---
  { id: 'cel-popper', name: '彩花拉炮', emoji: '🎉', category: 'celebration', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'cel-confetti', name: '彩帶五彩', emoji: '🎊', category: 'celebration', isGif: true, animationClass: 'animate-sticker-sparkle' },
  { id: 'cel-balloon', name: '飛揚氣球', emoji: '🎈', category: 'celebration', isGif: true, animationClass: 'animate-sticker-float' },
  { id: 'cel-gift', name: '精裝禮盒', emoji: '🎁', category: 'celebration', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'cel-cherry', name: '粉嫩櫻花', emoji: '🌸', category: 'celebration', isGif: true, animationClass: 'animate-sticker-spin-slow' },
  { id: 'cel-clover', name: '四葉幸運草', emoji: '🍀', category: 'celebration', isGif: true, animationClass: 'animate-sticker-float' },
  { id: 'cel-sunflower', name: '盛開向日葵', emoji: '🌻', category: 'celebration', isGif: true, animationClass: 'animate-sticker-spin-slow' },
  { id: 'cel-trophy', name: '金牌獎盃', emoji: '🏆', category: 'celebration', isGif: true, animationClass: 'animate-sticker-float' },
  { id: 'cel-rocket', name: '衝刺火箭', emoji: '🚀', category: 'celebration', isGif: true, animationClass: 'animate-sticker-bounce' },
  { id: 'cel-rainbow', name: '夢幻彩虹', emoji: '🌈', category: 'celebration', isGif: true, animationClass: 'animate-sticker-float' },
  { id: 'cel-fire', name: '火速推薦', emoji: '🔥', category: 'celebration', isGif: true, animationClass: 'animate-sticker-pulse-fast' },
  { id: 'cel-clap', name: '熱烈鼓掌', emoji: '👏', category: 'celebration', isGif: true, animationClass: 'animate-sticker-wobble' },
];

export const BULLET_PRESETS: BulletPreset[] = [
  {
    key: 'badge-num',
    label: '黑底白字數字球 (❶ ❷ ❸)',
    icon: '❶',
    getSymbol: (idx) => ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾', '❿'][idx] || `${idx + 1}.`,
  },
  {
    key: 'keycap-num',
    label: '彩色鍵盤數字 (1️⃣ 2️⃣ 3️⃣)',
    icon: '1️⃣',
    getSymbol: (idx) => ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][idx] || `${idx + 1}.`,
  },
  {
    key: 'circle-num',
    label: '白底空心數字 (① ② ③)',
    icon: '①',
    getSymbol: (idx) => ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'][idx] || `${idx + 1}.`,
  },
  {
    key: 'check-green',
    label: '綠意活力打勾 (✅)',
    icon: '✅',
    getSymbol: () => '✅',
  },
  {
    key: 'diamond-blue',
    label: '璀璨湛藍菱形 (🔷)',
    icon: '🔷',
    getSymbol: () => '🔷',
  },
  {
    key: 'diamond-gold',
    label: '金黃亮眼菱形 (🔶)',
    icon: '🔶',
    getSymbol: () => '🔶',
  },
  {
    key: 'gem-sparkle',
    label: '奢華水鑽菱格 (💠)',
    icon: '💠',
    getSymbol: () => '💠',
  },
  {
    key: 'star-gold',
    label: '閃亮五角金星 (⭐)',
    icon: '⭐',
    getSymbol: () => '⭐',
  },
  {
    key: 'pin-red',
    label: '提醒紅色圖釘 (📌)',
    icon: '📌',
    getSymbol: () => '📌',
  },
  {
    key: 'heart-pink',
    label: '浪漫粉嫩愛心 (💖)',
    icon: '💖',
    getSymbol: () => '💖',
  },
  {
    key: 'target-bullseye',
    label: '焦點精準紅心 (🎯)',
    icon: '🎯',
    getSymbol: () => '🎯',
  },
];

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'line-vibrant-green',
    name: 'LINE 經典鮮綠',
    category: '官方鮮明',
    bgGradient: 'from-emerald-50 via-teal-50 to-emerald-100',
    headerBg: 'bg-gradient-to-r from-[#06C755] to-[#04a044]',
    headerText: 'text-white',
    cardBg: 'bg-white',
    cardBorder: 'border-[#06C755]',
    textColor: 'text-gray-800',
    bulletBg: 'bg-emerald-600',
    bulletText: 'text-white',
    highlightColor: 'text-[#e11d48]', // bold ruby/coral red for numbers/dates
    highlightBg: 'bg-rose-50 border border-rose-200/80',
    accentColor: '#06C755',
    accentLight: '#e8f9f0',
    badgeBorder: 'border-emerald-300',
  },
  {
    id: 'warm-coral-sun',
    name: '活力暖陽珊瑚',
    category: '熱情吸睛',
    bgGradient: 'from-orange-50 via-rose-50 to-amber-100',
    headerBg: 'bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500',
    headerText: 'text-white',
    cardBg: 'bg-white',
    cardBorder: 'border-rose-400',
    textColor: 'text-gray-900',
    bulletBg: 'bg-rose-500',
    bulletText: 'text-white',
    highlightColor: 'text-[#d97706]', // deep amber
    highlightBg: 'bg-amber-50 border border-amber-300',
    accentColor: '#f43f5e',
    accentLight: '#ffe4e6',
    badgeBorder: 'border-rose-300',
  },
  {
    id: 'electric-blue-neon',
    name: '極速活力科技藍',
    category: '科技鮮明',
    bgGradient: 'from-sky-50 via-blue-50 to-indigo-100',
    headerBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500',
    headerText: 'text-white',
    cardBg: 'bg-white',
    cardBorder: 'border-blue-500',
    textColor: 'text-gray-800',
    bulletBg: 'bg-blue-600',
    bulletText: 'text-white',
    highlightColor: 'text-[#7c3aed]', // vibrant purple
    highlightBg: 'bg-purple-50 border border-purple-200',
    accentColor: '#2563eb',
    accentLight: '#eff6ff',
    badgeBorder: 'border-blue-300',
  },
  {
    id: 'sweet-berry-pink',
    name: '浪漫甜莓炫彩',
    category: '柔美甜心',
    bgGradient: 'from-pink-50 via-fuchsia-50 to-rose-100',
    headerBg: 'bg-gradient-to-r from-pink-500 via-purple-500 to-rose-400',
    headerText: 'text-white',
    cardBg: 'bg-white',
    cardBorder: 'border-pink-400',
    textColor: 'text-gray-900',
    bulletBg: 'bg-pink-600',
    bulletText: 'text-white',
    highlightColor: 'text-[#be185d]',
    highlightBg: 'bg-pink-50 border border-pink-200',
    accentColor: '#ec4899',
    accentLight: '#fdf2f8',
    badgeBorder: 'border-pink-300',
  },
  {
    id: 'obsidian-gold-luxury',
    name: '黑耀流金尊榮',
    category: '高貴深沉',
    bgGradient: 'from-gray-900 via-neutral-900 to-amber-950',
    headerBg: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500',
    headerText: 'text-gray-950',
    cardBg: 'bg-gray-900 text-gray-100',
    cardBorder: 'border-amber-400/80',
    textColor: 'text-gray-100',
    bulletBg: 'bg-amber-400',
    bulletText: 'text-black',
    highlightColor: 'text-[#fbbf24]', // glowing gold
    highlightBg: 'bg-amber-950/60 border border-amber-500/50',
    accentColor: '#f59e0b',
    accentLight: '#292524',
    badgeBorder: 'border-amber-400',
  },
];

/**
 * Resolves a reliable CSS animation class for any emoji or sticker
 */
export function getStickerAnimationClass(emoji?: string, fallbackClass?: string): string {
  if (!emoji) return fallbackClass || 'animate-sticker-bounce';

  if (/[💖❤️💕💗💝💜💓]/.test(emoji)) return 'animate-sticker-heartbeat';
  if (/[⭐🌟✨💫💎💠]/.test(emoji)) return 'animate-sticker-sparkle';
  if (/[🔔⏰⏳]/.test(emoji)) return 'animate-sticker-swing';
  if (/[📢📣🎯👏📝]/.test(emoji)) return 'animate-sticker-wobble';
  if (/[🚨⚠️💡⚡]/.test(emoji)) return 'animate-sticker-flash';
  if (/[🔥🟢🟡🔴🔵]/.test(emoji)) return 'animate-sticker-pulse-fast';
  if (/[🌸🌻🍀🎈🌈👑🏆]/.test(emoji)) return 'animate-sticker-float';
  if (/[🎉🎊🎁🚀]/.test(emoji)) return 'animate-sticker-bounce';
  if (/[✅✔️☑️📌📍1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣❶❷❸❹①②③④🔺🔷🔶]/.test(emoji)) return 'animate-sticker-bounce';

  return fallbackClass || 'animate-sticker-bounce';
}

/**
 * Resolves animation type key ('heartbeat' | 'wobble' | 'swing' | 'sparkle' | 'flash' | 'bounce' | 'float' | 'pulse-fast')
 */
export function resolveStickerAnimType(emoji?: string, explicitAnim?: string): string {
  if (explicitAnim) {
    return explicitAnim.replace('animate-sticker-', '');
  }
  if (!emoji) return 'bounce';

  if (/[💖❤️💕💗💝💜💓]/.test(emoji)) return 'heartbeat';
  if (/[⭐🌟✨💫💎💠]/.test(emoji)) return 'sparkle';
  if (/[🔔⏰⏳]/.test(emoji)) return 'swing';
  if (/[📢📣🎯👏📝]/.test(emoji)) return 'wobble';
  if (/[🚨⚠️💡⚡]/.test(emoji)) return 'flash';
  if (/[🔥🟢🟡🔴🔵]/.test(emoji)) return 'pulse-fast';
  if (/[🌸🌻🍀🎈🌈👑🏆]/.test(emoji)) return 'float';
  if (/[🎉🎊🎁🚀]/.test(emoji)) return 'bounce';
  return 'bounce';
}

