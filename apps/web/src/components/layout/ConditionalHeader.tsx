"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on /card routes
  if (pathname.startsWith("/card")) {
    return null;
  }
  
  return <Header />;
}
