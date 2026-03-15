// ─────────────────────────────────────────────────────────────────────────────
// API Base URL — üretimde VITE_API_URL env değişkenini kullan,
// lokalde http://localhost:5000 fallback'i devreye girer.
// ─────────────────────────────────────────────────────────────────────────────
export const API_BASE: string =
    (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000';
