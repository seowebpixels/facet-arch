// src/utils/scrollLock.ts

let touchPreventHandler: ((e: TouchEvent) => void) | null = null;

export const ScrollLock = {
  lock() {
    if (typeof document === 'undefined') return;

    // Apply strict CSS locks directly on root elements
    document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    document.documentElement.style.setProperty('height', '100vh', 'important');
    document.documentElement.style.setProperty('touch-action', 'none', 'important');

    document.body.style.setProperty('overflow', 'hidden', 'important');
    document.body.style.setProperty('height', '100vh', 'important');
    document.body.style.setProperty('touch-action', 'none', 'important');

    // Prevent iOS / Mobile touch scrolling
    if (!touchPreventHandler) {
      touchPreventHandler = (e: TouchEvent) => {
        // Allow scrolling inside lightbox or modal if open
        const isModalOpen = (e.target as HTMLElement)?.closest('#lightbox-modal');
        if (!isModalOpen) {
          e.preventDefault();
        }
      };
      window.addEventListener('touchmove', touchPreventHandler, { passive: false });
    }
  },

  unlock() {
    if (typeof document === 'undefined') return;

    // Remove inline overrides completely
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('height');
    document.documentElement.style.removeProperty('touch-action');

    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('height');
    document.body.style.removeProperty('touch-action');

    // Clean up touch event listener
    if (touchPreventHandler) {
      window.removeEventListener('touchmove', touchPreventHandler);
      touchPreventHandler = null;
    }
  }
};