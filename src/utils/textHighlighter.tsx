import React from 'react';

// Regex pattern that catches:
// 1. URLs
// 2. Taiwanese/Chinese Dates: e.g. xxx年xx月xx日, 113年11月20日, 10月25日, 2024/11/20, 2024-11-20
// 3. Time spans: e.g. 09:00~16:30, 09:00至16:30, 17:00, 下午 17:00, 24小時
// 4. Numbers with units or counts: 45位, 45人, 4天, 3小時, 100%, $500, #8888, 0912-345-678
// 5. Standalone or placeholder numbers: xxx, 123, 2024, etc.
const HIGHLIGHT_REGEX =
  /(https?:\/\/[^\s]+|(?:(?:xxx|\d{1,4})年)?(?:xxx|\d{1,2})月(?:xxx|\d{1,2})日(?:（(?:星期[一二三四五六日天]|週[一二三四五六日]|[一二三四五六日天])）|\((?:星期[一二三四五六日天]|週[一二三四五六日]|[一二三四五六日天])\))?|(?:20\d{2}[-/.])\d{1,2}[-/.](?:xxx|\d{1,2})|(?:上午|下午)?\s*\d{1,2}:\d{2}(?:(?:\s*[~～至到]\s*|\s*-\s*)(?:上午|下午)?\s*\d{1,2}:\d{2})?|\d+(?:\.\d+)?\s*(?:位|人|天|小時|分|秒|歲|張|名|折|點|次|元|筆|份|場|組|顆|箱|包|部|罐|度|%|％)|(?:\$|NT\$)\s*\d+|(?:#|分機\s*)?\d{3,5}|(?:09\d{2}[-\s]?\d{3}[-\s]?\d{3})|\b(?:xxx|\d+)\b)/i;

export interface HighlightStyleConfig {
  highlightColorClass: string;
  highlightBgClass?: string;
  boldWeightClass?: string;
}

export function renderHighlightedText(
  text: string,
  styleConfig: HighlightStyleConfig = {
    highlightColorClass: 'text-rose-600',
    highlightBgClass: 'bg-rose-50/90 ring-1 ring-rose-200/80 px-1 py-0.5 rounded-md',
    boldWeightClass: 'font-extrabold',
  },
): React.ReactNode {
  if (!text) return null;

  // Split text by the highlight regex while keeping matches
  const parts = text.split(HIGHLIGHT_REGEX);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;

        const isMatch = HIGHLIGHT_REGEX.test(part);
        if (isMatch) {
          return (
            <span
              key={index}
              className={`inline-block tracking-wide ${styleConfig.boldWeightClass || 'font-extrabold'} ${
                styleConfig.highlightColorClass
              } ${styleConfig.highlightBgClass || ''} transition-all duration-200 shadow-xs`}
            >
              {part}
            </span>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

// Convert plain text into LINE-formatted text with special unicode bold digits or brackets for high readability
export function formatLineTextForClipboard(
  title: string,
  wrapper: 'parentheses' | 'brackets' | 'corner' | 'stars' | 'none',
  frontEmoji: string,
  backEmoji: string,
  bulletStyleFn: (idx: number) => string,
  items: Array<{ label: string; content: string }>,
  footerText?: string,
): string {
  let wrappedTitle = title;
  switch (wrapper) {
    case 'parentheses':
      wrappedTitle = `(${title})`;
      break;
    case 'brackets':
      wrappedTitle = `【${title}】`;
      break;
    case 'corner':
      wrappedTitle = `『${title}』`;
      break;
    case 'stars':
      wrappedTitle = `✦ ${title} ✦`;
      break;
    case 'none':
    default:
      wrappedTitle = title;
      break;
  }

  const headerLine = `${frontEmoji} ${wrappedTitle} ${backEmoji}`.trim();
  const divider = '━━━━━━━━━━━━━━';

  const itemLines = items.map((item, idx) => {
    const bullet = bulletStyleFn(idx);
    const label = item.label ? `${item.label}：` : '';
    return `${bullet} ${label}${item.content}`;
  });

  const parts = [headerLine, divider, ...itemLines];

  if (footerText && footerText.trim()) {
    parts.push(divider);
    parts.push(`💡 ${footerText.trim()}`);
  }

  return parts.join('\n');
}
