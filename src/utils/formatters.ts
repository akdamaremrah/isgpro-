export const formatSGK = (sgk: string | undefined | null) => {
    if (!sgk) return '—';
    const s = sgk.replace(/\D/g, ''); // Extract only digits
    if (s.length !== 26) return sgk; // Return raw if it's not a full 26-digit SGK
    // Standard format: X.XXXX.XX.XX.XXXXXXX.XXX.XX.XX.XXX
    return `${s.slice(0, 1)}.${s.slice(1, 5)}.${s.slice(5, 7)}.${s.slice(7, 9)}.${s.slice(9, 16)}.${s.slice(16, 19)}.${s.slice(19, 21)}.${s.slice(21, 23)}.${s.slice(23, 26)}`;
};
