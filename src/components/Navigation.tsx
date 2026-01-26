'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  const navItems = [
    { href: '/', label: t.nav.map },
    { href: '/rankings', label: t.nav.rankings },
    { href: '/compare', label: t.nav.compare },
    { href: '/calculator', label: t.nav.calculator },
    { href: '/time-to-home', label: t.nav.timeToHome },
  ];

  // Dark theme for time-to-home page
  const isDark = pathname === '/time-to-home';

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ru' : 'en');
  };

  return (
    <nav className={isDark ? 'border-b border-gray-800 bg-black' : 'border-b bg-white'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className={`text-xl font-bold ${isDark ? 'text-white' : ''}`}>
            KABALA
          </Link>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? isDark
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Language switcher */}
            <button
              onClick={toggleLanguage}
              className={`px-3 py-2 text-sm font-medium rounded-md border ${
                isDark
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              title={t.common.language}
            >
              {locale === 'en' ? '🇷🇺 RU' : '🇬🇧 EN'}
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleLanguage}
              className={`p-2 text-sm font-medium rounded-md ${
                isDark
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {locale === 'en' ? 'RU' : 'EN'}
            </button>
            <button
              type="button"
              className={`p-2 rounded-md ${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isOpen && (
          <div className={`sm:hidden pb-4 space-y-1 ${isDark ? 'bg-black' : ''}`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  pathname === item.href
                    ? isDark
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
