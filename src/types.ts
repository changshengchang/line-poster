export interface AnnouncementItem {
  id: string;
  prefixEmoji?: string; // Optional per-item override
  label: string; // e.g. "辦理時間"
  content: string; // e.g. "113年11月20日（星期三）09:00~16:30"
}

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  category: 'animated' | 'notice' | 'heart-star' | 'numbers' | 'symbols' | 'celebration';
  isGif?: boolean;
  gifUrl?: string;
  animationClass?: string;
}

export type BulletStyleKey =
  | 'badge-num' // ❶ ❷ ❸ ❹
  | 'keycap-num' // 1️⃣ 2️⃣ 3️⃣ 4️⃣
  | 'circle-num' // ① ② ③ ④
  | 'check-green' // ✅
  | 'diamond-blue' // 🔷
  | 'diamond-gold' // 🔶
  | 'gem-sparkle' // 💎
  | 'star-gold' // ⭐
  | 'pin-red' // 📌
  | 'heart-pink' // 💖
  | 'target-bullseye' // 🎯
  | 'custom';

export interface BulletPreset {
  key: BulletStyleKey;
  label: string;
  icon: string;
  getSymbol: (index: number) => string;
}

export interface ColorTheme {
  id: string;
  name: string;
  category: string;
  bgGradient: string;
  headerBg: string;
  headerText: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  bulletBg: string;
  bulletText: string;
  highlightColor: string; // for numbers & dates
  highlightBg: string;
  accentColor: string;
  accentLight: string;
  badgeBorder: string;
}

export interface AnnouncementConfig {
  title: string;
  titleWrapper: 'parentheses' | 'brackets' | 'corner' | 'stars' | 'none';
  frontSticker: StickerItem;
  backSticker: StickerItem;
  bulletStyle: BulletStyleKey;
  items: AnnouncementItem[];
  themeId: string;
  highlightScheme: 'vibrant-coral' | 'bright-amber' | 'neon-magenta' | 'emerald-cyan' | 'electric-blue';
  showFooterNotice: boolean;
  footerNoticeText: string;
  fontSize: 'normal' | 'large' | 'compact';
  autoHighlight: boolean;
}
