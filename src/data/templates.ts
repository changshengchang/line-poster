import { AnnouncementConfig } from '../types';
import { STICKER_COLLECTION } from './stickers';

export const DEFAULT_ANNOUNCEMENT: AnnouncementConfig = {
  title: '人事室-文康活動報名公告',
  titleWrapper: 'parentheses', // (標題)
  frontSticker: STICKER_COLLECTION[0], // ⭐ 閃耀金星 (animated)
  backSticker: STICKER_COLLECTION[1], // 💖 跳動愛心 (animated)
  bulletStyle: 'keycap-num', // 1️⃣ 2️⃣ 3️⃣
  themeId: 'line-vibrant-green',
  highlightScheme: 'vibrant-coral',
  fontSize: 'normal',
  showFooterNotice: true,
  footerNoticeText: '名額有限，敬請同仁踴躍報名參加！若有疑問請洽分機 #8888',
  autoHighlight: true,
  items: [
    {
      id: 'item-1',
      label: '辦理時間',
      content: '113年11月20日（星期三）09:00至16:30',
    },
    {
      id: 'item-2',
      label: '報名期間',
      content: '113年10月25日（五）下午 17:00 以前截止',
    },
    {
      id: 'item-3',
      label: '報名表單網址',
      content: 'https://forms.gle/enjoy-activity-2024',
    },
    {
      id: 'item-4',
      label: '其他注意事項',
      content: '請自備環保餐具與水杯，當日備有專車接駁，額滿為止！',
    },
  ],
};

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  config: Partial<AnnouncementConfig>;
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'personnel-activity',
    name: '人事室文康活動 (預設標準)',
    description: '公家與企業福委會活動、員工旅遊、報名公告必備',
    badge: '活動推薦',
    config: {
      title: '人事室-文康活動報名公告',
      titleWrapper: 'parentheses',
      frontSticker: STICKER_COLLECTION[0], // ⭐
      backSticker: STICKER_COLLECTION[1], // 💖
      bulletStyle: 'keycap-num',
      themeId: 'line-vibrant-green',
      items: [
        { id: '1', label: '辦理時間', content: '113年11月20日（星期三）09:00~16:30' },
        { id: '2', label: '報名期間', content: '113年10月25日以前截止' },
        { id: '3', label: '報名表單網址', content: 'https://forms.gle/enjoy-activity-2024' },
        { id: '4', label: '其他注意事項', content: '名額限 45 位，額滿為止，請自備環保隨行杯！' },
      ],
      footerNoticeText: '如有任何報名問題，請洽人事室文康小組！',
    },
  },
  {
    id: 'urgent-notice',
    name: '緊急重要提醒 / 系統停機',
    description: '醒目警示燈號、紅色打勾與搶眼鈴鐺',
    badge: '緊急通知',
    config: {
      title: '資訊室-系統停機升級維護公告',
      titleWrapper: 'brackets',
      frontSticker: STICKER_COLLECTION[4], // 🚨
      backSticker: STICKER_COLLECTION[3], // 🔔
      bulletStyle: 'check-green',
      themeId: 'warm-coral-sun',
      items: [
        { id: '1', label: '維護時間', content: '113年10月30日（六）22:00 至 10月31日 06:00' },
        { id: '2', label: '受影響範圍', content: '全校/全公司公文系統、內部差勤打卡' },
        { id: '3', label: '因應措施', content: '請同仁於 10月30日 21:30 前完成存檔並登出' },
        { id: '4', label: '緊急連絡人', content: '資訊部值班工程師 0912-345-678' },
      ],
      footerNoticeText: '造成不便敬請見諒，維護完成後將發出上線通知。',
    },
  },
  {
    id: 'training-meeting',
    name: '業務培訓 / 全員會議',
    description: '湛藍科技感、菱形鑽石符號、清晰時程',
    badge: '會議培訓',
    config: {
      title: '管理部-第四季員工專業培訓講座',
      titleWrapper: 'stars',
      frontSticker: STICKER_COLLECTION[2], // 📢
      backSticker: STICKER_COLLECTION[8], // 👑
      bulletStyle: 'diamond-blue',
      themeId: 'electric-blue-neon',
      items: [
        { id: '1', label: '研習日期', content: '113年12月05日（四）14:00~17:00' },
        { id: '2', label: '講座地點', content: '總部大樓 7 樓多功能視聽會議廳' },
        { id: '3', label: '報名網址', content: 'https://training.company.com/q4-course' },
        { id: '4', label: '講師陣容', content: '特別邀請產業知名顧問親臨指導（含認證時數 3 小時）' },
      ],
      footerNoticeText: '全員皆可自由報名，當天提供精緻茶點！',
    },
  },
  {
    id: 'holiday-schedule',
    name: '節日連假 / 行事曆公告',
    description: '彩花拉炮、甜蜜愛心、休假須知',
    badge: '休假通知',
    config: {
      title: '總務處-中秋連假出勤與值班公告',
      titleWrapper: 'parentheses',
      frontSticker: STICKER_COLLECTION[6], // 🎉
      backSticker: STICKER_COLLECTION[10], // 🌸
      bulletStyle: 'badge-num',
      themeId: 'sweet-berry-pink',
      items: [
        { id: '1', label: '放假區間', content: '113年09月14日（六）至 09月17日（二）共 4 天' },
        { id: '2', label: '補班日期', content: '無須補班，09月18日（三）恢復正常上班' },
        { id: '3', label: '門禁安全', content: '休假期間請各單位務必拔除不必要電源並鎖緊門窗' },
        { id: '4', label: '值班通報', content: '警衛室 24小時專線：(02) 2345-6789' },
      ],
      footerNoticeText: '敬祝大家中秋佳節愉快，闔家平安團圓！',
    },
  },
];
