/**
 * MetricSection component for grouping related metrics.
 * Provides consistent styling for metric categories on city detail pages.
 */

import type { ReactNode } from 'react';

export interface MetricSectionProps {
  /** Section title (e.g., "Rent", "Food", "Transport") */
  title: string;
  /** Optional icon to display next to the title */
  icon?: ReactNode;
  /** Child components (typically MetricCard components) */
  children: ReactNode;
}

/**
 * Groups related metrics under a titled section with consistent styling.
 * Children are displayed in a stacked layout with proper spacing.
 */
export function MetricSection({ title, icon, children }: MetricSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
        {icon && <span className="text-gray-500">{icon}</span>}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="mt-3 space-y-2 divide-y divide-gray-100">{children}</div>
    </div>
  );
}
