"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cx } from "@/lib/cx";

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  className,
}: TabsProps) => {
  const isControlled = controlledActiveTab !== undefined;
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ""
  );

  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (isControlled && controlledActiveTab) {
      setInternalActiveTab(controlledActiveTab);
    }
  }, [isControlled, controlledActiveTab]);

  const handleTabChange = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab || tab.disabled) return;

      if (!isControlled) {
        setInternalActiveTab(tabId);
      }
      onChange?.(tabId);
    },
    [tabs, isControlled, onChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentTabId: string) => {
      const enabledTabs = tabs.filter((t) => !t.disabled);
      const currentIndex = enabledTabs.findIndex((t) => t.id === currentTabId);

      let targetTab: Tab | undefined;

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          targetTab =
            enabledTabs[currentIndex - 1] ||
            enabledTabs[enabledTabs.length - 1];
          break;
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          targetTab = enabledTabs[currentIndex + 1] || enabledTabs[0];
          break;
        case "Home":
          event.preventDefault();
          targetTab = enabledTabs[0];
          break;
        case "End":
          event.preventDefault();
          targetTab = enabledTabs[enabledTabs.length - 1];
          break;
        default:
          return;
      }

      if (targetTab) {
        handleTabChange(targetTab.id);
        tabRefs.current.get(targetTab.id)?.focus();
      }
    },
    [tabs, handleTabChange]
  );

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={cx("w-full", className)}>
      <div
        role="tablist"
        aria-label="Content tabs"
        className="flex gap-2 border-b border-(--color-border)"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={cx(
                "inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "border-(--color-primary) text-foreground"
                  : "border-transparent text-(--color-muted) hover:text-foreground",
                tab.disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`tabpanel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={!isActive}
            className={cx("py-6", !isActive && "sr-only")}
          >
            {isActive && tab.content}
          </div>
        );
      })}
    </div>
  );
};
