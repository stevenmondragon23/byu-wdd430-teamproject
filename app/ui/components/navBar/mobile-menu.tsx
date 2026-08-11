"use client";

import { useState } from "react";

type MobileMenuProps = {
  children: React.ReactNode;
};

export default function MobileMenu({ children }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`menu-toggle ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        id="mobile-navigation"
        className={`nav-links ${isOpen ? "is-open" : ""}`}
      >
        {children}
      </div>
    </>
  );
}
