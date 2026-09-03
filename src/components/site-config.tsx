"use client";

import { createContext, useContext } from "react";

interface SiteConfig {
  logoText: string;
  logoImageUrl: string | null;
}

const SiteConfigContext = createContext<SiteConfig>({
  logoText: "نکساتک",
  logoImageUrl: null,
});

export function SiteConfigProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SiteConfig;
}) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
