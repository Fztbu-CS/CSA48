const baseUrl = import.meta.env.BASE_URL || '/';
const pigAvatars = ["/avatars/pig-1.webp","/avatars/pig-2.webp","/avatars/pig-3.webp","/avatars/pig-4.webp","/avatars/pig-5.webp","/avatars/pig-6.jpg","/avatars/pig-7.jpg","/avatars/pig-8.webp","/avatars/pig-9.jpg","/avatars/pig-10.webp","/avatars/pig-11.jpg","/avatars/pig-12.webp"];

export function isImageSrc(src?: string | null): boolean {
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

/** 保留图片头像；未设置图片时分配稳定的猪猪头像，单字用于加载失败兜底。 */
export function resolveAvatar(
  avatar: string | null | undefined,
  name: string
): { src: string | null; fallback: string } {
  const fallback = avatar && avatar.length <= 4 && !isImageSrc(avatar) ? avatar : name ? name.slice(0, 1) : '?';
  if (isImageSrc(avatar)) {
    return { src: resolveSrc(avatar!.trim()), fallback: name ? name.slice(0, 1) : '?' };
  }
  // Stable per-person selection: rebuilding or sorting never changes a pig.
  let hash = 2166136261;
  for (const char of name || '?') hash = Math.imul(hash ^ char.codePointAt(0)!, 16777619) >>> 0;
  return { src: resolveSrc(pigAvatars[hash % pigAvatars.length]), fallback };
}
