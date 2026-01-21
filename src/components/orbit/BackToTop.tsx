"use client";

import * as React from "react";

export function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "fixed bottom-5 cursor-pointer right-5 z-50",
        "rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg",
        "bg-linear-to-r from-indigo-600 via-sky-500 to-pink-500",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2",
      ].join(" ")}
      aria-label="Back to top"
    >
      ↑ Top
    </button>
  );
}
