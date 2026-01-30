"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Controls Header visibility via CSS class without unmounting/remounting
 * This prevents flickering when navigating between pages
 */
export function HeaderVisibilityController() {
  const pathname = usePathname();

  useEffect(() => {
    // Add or remove CSS class based on pathname
    const shouldHideHeader = pathname.startsWith("/card");
    const headerElement = document.querySelector("nav");
    
    if (headerElement) {
      if (shouldHideHeader) {
        headerElement.classList.add("hidden");
      } else {
        headerElement.classList.remove("hidden");
      }
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
