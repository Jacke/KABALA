'use client';

import { useState, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
  content: ReactNode;
  bgClass?: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-900/30'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`rounded-xl p-6 transition-all ${currentTab?.bgClass || 'bg-gray-900/50'}`}>
        {currentTab?.content}
      </div>
    </div>
  );
}
