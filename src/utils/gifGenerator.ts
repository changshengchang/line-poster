import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { toCanvas } from 'html-to-image';
import { resolveStickerAnimType } from '../data/stickers';

export interface GifProgressCallback {
  (currentFrame: number, totalFrames: number, statusText: string): void;
}

// Generate animated GIF by capturing multiple frames with stepped sticker transformations
export async function generateAnimatedCardGif(
  element: HTMLElement,
  onProgress?: GifProgressCallback,
): Promise<{ blob: Blob; dataUrl: string }> {
  const totalFrames = 12;
  const frameDelay = 100; // 100ms per frame = 1.2s seamless loop

  // Find ALL animated sticker elements within the card (title front/back, item bullets, notice bar, etc.)
  const stickerElements = Array.from(element.querySelectorAll<HTMLElement>('[data-sticker]'));

  // Backup original styles
  const originalStyles = new Map<HTMLElement, { transform: string; transformOrigin: string }>();
  stickerElements.forEach((el) => {
    originalStyles.set(el, {
      transform: el.style.transform || '',
      transformOrigin: el.style.transformOrigin || '',
    });
  });

  const gif = GIFEncoder();
  let cardWidth = 0;
  let cardHeight = 0;

  try {
    for (let i = 0; i < totalFrames; i++) {
      const progress = i / totalFrames; // 0 to 1
      onProgress?.(i + 1, totalFrames, `正在錄製全卡片動態貼圖幀數 (${i + 1}/${totalFrames})...`);

      // Apply programmatic motion transforms for frame i across ALL stickers
      stickerElements.forEach((el, idx) => {
        const animType =
          el.dataset.anim ||
          resolveStickerAnimType(el.textContent?.trim());
        const role = el.dataset.sticker;

        // Apply slight phase offset for item bullets so they form a pleasant dynamic wave
        let itemProgress = progress;
        if (role === 'item') {
          itemProgress = (progress + idx * 0.14) % 1;
        }

        applyStickerTransform(el, animType, itemProgress);
      });

      // Small delay for browser reflow
      await new Promise((r) => setTimeout(r, 20));

      // Capture frame as canvas
      const canvas = await toCanvas(element, {
        pixelRatio: 1.5,
        backgroundColor: '#ffffff',
      });

      cardWidth = canvas.width;
      cardHeight = canvas.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      const imageData = ctx.getImageData(0, 0, cardWidth, cardHeight);
      const rgba = imageData.data;

      // Quantize colors for GIF palette (256 max colors)
      const palette = quantize(rgba, 128);
      const index = applyPalette(rgba, palette);

      // Write frame into GIF
      gif.writeFrame(index, cardWidth, cardHeight, {
        palette,
        delay: frameDelay,
        repeat: 0, // infinite loop
      });
    }

    onProgress?.(totalFrames, totalFrames, '動態 GIF 封裝完成！');
    gif.finish();

    const bytes = gif.bytes();
    const blob = new Blob([bytes], { type: 'image/gif' });
    const dataUrl = URL.createObjectURL(blob);

    return { blob, dataUrl };
  } finally {
    // Restore original styles for ALL elements
    originalStyles.forEach((saved, el) => {
      el.style.transform = saved.transform;
      el.style.transformOrigin = saved.transformOrigin;
    });
  }
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Convert any Image Blob (like GIF) into a clean, uncompressed PNG Blob for OS & LINE clipboard compatibility
export function convertImageBlobToPngBlob(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 600;
      canvas.height = img.naturalHeight || img.height || 400;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (pngBlob) => {
          if (pngBlob) {
            resolve(pngBlob);
          } else {
            reject(new Error('Failed to convert canvas to PNG blob'));
          }
        },
        'image/png',
        1.0,
      );
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

export async function copyGifToClipboard(
  blob: Blob,
  customPngBlob?: Blob,
): Promise<{ success: boolean; method: 'direct' | 'png-compatible' | 'html' | 'failed' }> {
  // 1. Prepare PNG blob - mandatory for LINE Desktop and Chrome clipboard compatibility
  let pngBlob = customPngBlob;
  if (!pngBlob) {
    if (blob.type === 'image/png') {
      pngBlob = blob;
    } else {
      try {
        pngBlob = await convertImageBlobToPngBlob(blob);
      } catch (err) {
        console.warn('Could not convert to PNG blob for clipboard:', err);
      }
    }
  }

  // 2. Prepare HTML containing animated GIF
  let htmlBlob: Blob | null = null;
  try {
    const base64 = await blobToBase64(blob);
    const htmlContent = `<img src="${base64}" alt="LINE 公告貼圖卡" />`;
    htmlBlob = new Blob([htmlContent], { type: 'text/html' });
  } catch (err) {
    console.warn('HTML blob preparation failed:', err);
  }

  // Method 1: Try writing image/gif directly (Supported in Safari or experimental Chromium)
  if (blob.type === 'image/gif') {
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/gif': blob,
          }),
        ]);
        return { success: true, method: 'direct' };
      }
    } catch {
      // Expected in standard Chrome/Edge: 'image/gif' not allowed on write
    }
  }

  // Method 2: Write image/png (standard OS clipboard format that LINE recognizes on Ctrl+V)
  try {
    if (navigator.clipboard && window.ClipboardItem && pngBlob) {
      const clipboardData: Record<string, Blob> = {
        'image/png': pngBlob,
      };
      if (htmlBlob) {
        clipboardData['text/html'] = htmlBlob;
      }
      await navigator.clipboard.write([new ClipboardItem(clipboardData)]);
      return { success: true, method: 'png-compatible' };
    }
  } catch (e2) {
    console.warn('Writing image/png to clipboard failed, trying text/html fallback...', e2);
  }

  // Method 3: Fallback to text/html only
  if (htmlBlob) {
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': htmlBlob,
          }),
        ]);
        return { success: true, method: 'html' };
      }
    } catch (e3) {
      console.warn('HTML image copy fallback failed...', e3);
    }
  }

  return { success: false, method: 'failed' };
}

// Copy both plain text AND animated GIF in a single rich clipboard payload
export async function copyRichTextWithGif(
  plainText: string,
  gifBlob?: Blob,
  gifDataUrl?: string,
): Promise<{ success: boolean; hasGif: boolean }> {
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      let base64 = gifDataUrl;
      if (!base64 && gifBlob) {
        base64 = await blobToBase64(gifBlob);
      }

      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const clipboardData: Record<string, Blob> = {
        'text/plain': textBlob,
      };

      if (base64) {
        // Embed the animated GIF in HTML format so rich apps, emails and messengers can paste the animated card
        const htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <p><img src="${base64}" alt="LINE 動態公告貼圖卡" style="max-width: 500px; width: 100%; border-radius: 18px;" /></p>
            <pre style="font-family: inherit; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${plainText}</pre>
          </div>
        `.trim();
        clipboardData['text/html'] = new Blob([htmlContent], { type: 'text/html' });
      }

      await navigator.clipboard.write([new ClipboardItem(clipboardData)]);
      return { success: true, hasGif: !!base64 };
    }
  } catch (e) {
    console.warn('Rich clipboard copy failed, falling back to writeText...', e);
  }

  // Fallback to plain writeText
  try {
    await navigator.clipboard.writeText(plainText);
    return { success: true, hasGif: false };
  } catch (err) {
    console.error('writeText fallback failed...', err);
    return { success: false, hasGif: false };
  }
}



function applyStickerTransform(
  el: HTMLElement | null,
  animType: string,
  progress: number, // 0 to 1
) {
  if (!el) return;

  const twoPi = Math.PI * 2;
  const cleanAnim = animType.replace('animate-sticker-', '').trim();

  switch (cleanAnim) {
    case 'heartbeat': {
      // 2 pulses in 1 cycle
      const p = progress * 2;
      const subP = p % 1;
      let scale = 1;
      if (subP < 0.25) {
        scale = 1 + (subP / 0.25) * 0.32;
      } else if (subP < 0.5) {
        scale = 1.32 - ((subP - 0.25) / 0.25) * 0.32;
      }
      el.style.transform = `scale(${scale.toFixed(3)})`;
      break;
    }
    case 'wobble': {
      const angle = Math.sin(progress * twoPi) * 18;
      const scale = 1 + Math.abs(Math.sin(progress * twoPi)) * 0.15;
      el.style.transform = `rotate(${angle.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      break;
    }
    case 'swing': {
      const angle = Math.sin(progress * twoPi) * 24;
      el.style.transformOrigin = 'top center';
      el.style.transform = `rotate(${angle.toFixed(1)}deg)`;
      break;
    }
    case 'sparkle':
    case 'spin': {
      const angle = progress * 360;
      const scale = 1 + Math.sin(progress * twoPi) * 0.25;
      el.style.transform = `rotate(${angle.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      break;
    }
    case 'spin-slow': {
      const angle = progress * 360;
      el.style.transform = `rotate(${angle.toFixed(1)}deg)`;
      break;
    }
    case 'flash': {
      const scale = 1 + Math.abs(Math.sin(progress * twoPi)) * 0.26;
      el.style.transform = `scale(${scale.toFixed(3)})`;
      break;
    }
    case 'bounce': {
      const y = -Math.abs(Math.sin(progress * twoPi)) * 14;
      const scale = 1 + (1 - Math.abs(Math.sin(progress * twoPi))) * 0.08;
      el.style.transform = `translateY(${y.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      break;
    }
    case 'float': {
      const y = Math.sin(progress * twoPi) * -9;
      const angle = Math.sin(progress * twoPi) * 6;
      el.style.transform = `translateY(${y.toFixed(1)}px) rotate(${angle.toFixed(1)}deg)`;
      break;
    }
    case 'pulse-fast': {
      const scale = 1 + Math.sin(progress * twoPi * 2) * 0.22;
      el.style.transform = `scale(${scale.toFixed(3)})`;
      break;
    }
    case 'glow': {
      const scale = 1 + Math.abs(Math.sin(progress * twoPi)) * 0.22;
      el.style.transform = `scale(${scale.toFixed(3)})`;
      break;
    }
    default: {
      const y = -Math.abs(Math.sin(progress * twoPi)) * 12;
      el.style.transform = `translateY(${y.toFixed(1)}px)`;
      break;
    }
  }
}
