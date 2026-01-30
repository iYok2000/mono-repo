"use client";

import { memo, useMemo } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";

function ConditionalHeaderComponent() {
  const pathname = usePathname();
  
  // Check if we should hide the header
  const shouldHideHeader = useMemo(() => {
    return pathname.startsWith("/card");
  }, [pathname]);
  
  // Always render Header, just hide it with CSS to prevent unmounting
  return (
    <div style={{ display: shouldHideHeader ? 'none' : 'block' }}>
      <Header />
    </div>
  );
}

export const ConditionalHeader = memo(ConditionalHeaderComponent);
