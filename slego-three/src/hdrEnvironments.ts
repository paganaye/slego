// Auto-discovered HDR environments using Vite's import.meta.glob
// This will always reflect the actual files in public/hdr at build time.

export const HDR_ENVIRONMENTS = Object.values(
  import.meta.glob('/public/hdr/*.hdr', { as: 'url', eager: true })
) as string[];
