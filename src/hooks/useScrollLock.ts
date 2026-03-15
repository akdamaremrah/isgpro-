import { useEffect } from 'react';

export const useScrollLock = (lock: boolean) => {
    useEffect(() => {
        if (lock) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '8px'; // Prevent layout shift if possible
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0';
        };
    }, [lock]);
};
