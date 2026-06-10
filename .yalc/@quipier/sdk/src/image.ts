// Client-side image normalization for feed post attachments.
//
// Goal: whatever the user picks, produce a data URL that comfortably fits the
// server's size ceiling — uploads must never fail just because the source was
// large. We cap the longest edge, then iteratively trade quality (and finally
// dimensions) until the *decoded* byte size is under TARGET_BYTES.

/** Decoded-byte budget the encoder aims to stay under. The server accepts a bit
 *  more (see FEED_IMAGE_MAX_BYTES) so this leaves headroom for estimate slop. */
const TARGET_BYTES = 1_500_000;
const MAX_DIM = 1600;

/** Estimate the decoded byte length of a base64 data URL (what the server caps). */
function decodedBytes(dataUrl: string): number {
  const i = dataUrl.indexOf(",");
  if (i < 0) return dataUrl.length;
  const payload = dataUrl.slice(i + 1);
  const pad = payload.endsWith("==") ? 2 : payload.endsWith("=") ? 1 : 0;
  return Math.floor((payload.length * 3) / 4) - pad;
}

/** Read an image File into a normalized data URL that fits the upload budget.
 *  - GIFs stay as-is when already small (preserves animation), else flattened.
 *  - PNGs keep transparency until shrinking alone can't fit, then fall to JPEG.
 *  - Everything else is JPEG, quality-stepped to fit.
 *  Falls back to the raw data URL if a <canvas> isn't available. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("이미지를 읽지 못했습니다"));
    reader.onload = () => {
      const raw = reader.result as string;
      // Small animated GIFs: keep as-is (can't redraw without losing animation).
      if (/^data:image\/gif/i.test(raw) && decodedBytes(raw) <= TARGET_BYTES) {
        resolve(raw);
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(raw);
      img.onload = () => resolve(encodeToFit(img, /^data:image\/png/i.test(raw), raw));
      img.src = raw;
    };
    reader.readAsDataURL(file);
  });
}

function encodeToFit(
  img: HTMLImageElement,
  preferPng: boolean,
  fallback: string,
): string {
  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  if (!w || !h) return fallback;
  if (Math.max(w, h) > MAX_DIM) {
    const s = MAX_DIM / Math.max(w, h);
    w = Math.round(w * s);
    h = Math.round(h * s);
  }

  let png = preferPng;
  let quality = 0.85;
  let best = fallback;

  for (let step = 0; step < 16; step++) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, w);
    canvas.height = Math.max(1, h);
    const ctx = canvas.getContext("2d");
    if (!ctx) return best;
    ctx.drawImage(img, 0, 0, w, h);

    let out: string;
    try {
      out = canvas.toDataURL(png ? "image/png" : "image/jpeg", quality);
    } catch {
      return best;
    }
    best = out;
    if (decodedBytes(out) <= TARGET_BYTES) return out;

    // Still too big — reduce.
    if (png) {
      // PNG ignores quality. Shrink; once small, switch to JPEG.
      if (Math.max(w, h) <= 700) {
        png = false;
        quality = 0.82;
      } else {
        w = Math.round(w * 0.82);
        h = Math.round(h * 0.82);
      }
    } else if (quality > 0.42) {
      quality -= 0.13;
    } else if (Math.max(w, h) > 360) {
      w = Math.round(w * 0.82);
      h = Math.round(h * 0.82);
      quality = 0.6;
    } else {
      return out; // good-enough floor — don't degrade further
    }
  }
  return best;
}
