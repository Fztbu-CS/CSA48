const baseUrl = import.meta.env.BASE_URL || '/';

export function isImageSrc(src?: string): boolean {
  if (!src) return false;
  const s = src.trim().toLowerCase();
  return (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('data:image/') ||
    s.startsWith('/') ||
    s.endsWith('.png') ||
    s.endsWith('.jpg') ||
    s.endsWith('.jpeg') ||
    s.endsWith('.webp') ||
    s.endsWith('.gif') ||
    s.endsWith('.svg')
  );
}

function resolveSrc(src: string): string {
  if (/^(https?:|data:)/.test(src)) return src;
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = src.startsWith('/') ? src : `/${src}`;
  return `${cleanBase}${cleanPath}`;
}

/** 解析头像字段：图片地址（非图片时为 null）与单字兜底文案 */
export function resolveAvatar(
  avatar: string | undefined,
  name: string
): { src: string | null; fallback: string } {
  const fallback = avatar && avatar.length <= 4 && !isImageSrc(avatar) ? avatar : name ? name.slice(0, 1) : '?';
  if (isImageSrc(avatar)) {
    return { src: resolveSrc(avatar!.trim()), fallback: name ? name.slice(0, 1) : '?' };
  }
  return { src: null, fallback };
}