/**
 * Tabs Component
 *
 * Accessible tab navigation component.
 * Follows WAI-ARIA tabs pattern for keyboard navigation.
 *
 * Security: Type-safe tab definitions prevent XSS.
 * Accessibility: Full keyboard navigation (Arrow keys, Home, End).
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cx } from "@/lib/cx";

export interface Tab {
  /** Unique identifier */
  id: string;

  /** Display label */
  label: string;

  /** Tab content */
  content: React.ReactNode;

  /** Is tab disabled? */
  disabled?: boolean;

  /** Optional icon */
  icon?: React.ReactNode;

  /** Optional badge (e.g., count) */
  badge?: React.ReactNode;
}

export interface TabsProps {
  /** Array of tabs */
  tabs: Tab[];

  /** Default active tab ID */
  defaultTab?: string;

  /** Controlled active tab ID */
  activeTab?: string;

  /** Callback when tab changes */
  onChange?: (tabId: string) => void;

  /** Custom className for container */
  className?: string;
}

/**
 * Tabs Component with keyboard navigation
 *
 * @example
 * <Tabs
 *   tabs={[
 *     { id: 'demo', label: 'Demo', content: <DemoComponent /> },
 *     { id: 'code', label: 'Code', content: <CodeViewer /> },
 *   ]}
 *   defaultTab="demo"
 * />
 */
export const Tabs = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  className,
}: TabsProps) => {
  // Determine if controlled or uncontrolled
  const isControlled = controlledActiveTab !== undefined;
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ""
  );

  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Update internal state if controlled value changes
  useEffect(() => {
    if (isControlled && controlledActiveTab) {
      setInternalActiveTab(controlledActiveTab);
    }
  }, [isControlled, controlledActiveTab]);

  /**
   * Handle tab change with validation
   */
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

  /**
   * Keyboard navigation handler
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentTabId: string) => {
      const enabledTabs = tabs.filter((t) => !t.disabled);
      const currentIndex = enabledTabs.findIndex((t) => t.id === currentTabId);

      let targetTab: Tab | undefined;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          targetTab = enabledTabs[currentIndex - 1] || enabledTabs[enabledTabs.length - 1];
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          targetTab = enabledTabs[currentIndex + 1] || enabledTabs[0];
          break;
        case 'Home':
          event.preventDefault();
          targetTab = enabledTabs[0];
          break;
        case 'End':
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
      {/* Tab List */}
      <div
        role="tablist"
        aria-label="Content tabs"
        className="flex gap-2 border-b border-[var(--color-border)]"
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
                // Base styles
                "inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",

                // Active state
                isActive
                  ? "border-[var(--color-primary)] text-[var(--foreground)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--foreground)]",

                // Disabled state
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

      {/* Tab Panels */}
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
