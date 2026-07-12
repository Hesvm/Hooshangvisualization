"use client";

import { useEffect } from "react";

export function useIOSViewportHeight() {
  useEffect(() => {
    const setViewportHeight = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-vh", `${viewportHeight * 0.01}px`);
    };

    /* iOS tries to natively scroll the focused input into view above the
       keyboard. The shell is `position: fixed` and already repositions itself
       via visualViewport (see Composer's keyboard-follow), so that native
       scroll doesn't reveal anything useful — it just scrolls the fixed shell
       out from under the layout viewport, leaving blank document background
       behind it. Snap it back every time it happens. */
    const resetNativeScroll = () => {
      if (window.scrollX !== 0 || window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };

    setViewportHeight();
    resetNativeScroll();
    window.visualViewport?.addEventListener("resize", setViewportHeight);
    window.visualViewport?.addEventListener("scroll", setViewportHeight);
    window.addEventListener("resize", setViewportHeight);
    window.addEventListener("scroll", resetNativeScroll);

    return () => {
      window.visualViewport?.removeEventListener("resize", setViewportHeight);
      window.visualViewport?.removeEventListener("scroll", setViewportHeight);
      window.removeEventListener("resize", setViewportHeight);
      window.removeEventListener("scroll", resetNativeScroll);
    };
  }, []);
}
