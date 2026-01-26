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
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-wrap gap-2 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-900/50 scale-105'
                  : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-102 border border-gray-600'
              }`}
            >
              <span className="mr-2 text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={`rounded-xl p-6 transition-all ${currentTab?.bgClass || 'bg-gray-900/50'}`}>
        {currentTab?.content}
      </div>
    </div>
  );
}
