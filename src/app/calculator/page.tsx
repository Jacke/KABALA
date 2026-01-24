'use client';

/**
 * Budget Calculator page.
 * Allows users to input expenses and see equivalent budget in another city.
 */

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getCityById, getCityIndex } from '@/lib/data';
import { CitySelector } from '@/components/Compare';
import {
  ExpenseForm,
  BudgetResults,
  defaultExpenses,
} from '@/components/Calculator';
import type { ExpenseState } from '@/components/Calculator';
import type { CityWithMetrics } from '@/types';

/**
 * Pre-fill expenses from city averages.
 */
function getExpensesFromCity(city: CityWithMetrics): ExpenseState {
  return {
    rent: Math.round(city.metrics.rent.oneBedroom.usd),
    groceries: Math.round(city.metrics.food.groceries.usd),
    diningOut: Math.round(city.metrics.food.restaurantMeal.usd * 4),
    transport: Math.round(city.metrics.transport.monthlyPass.usd),
    utilities: Math.round(city.metrics.utilities.basic.usd),
    internet: Math.round(city.metrics.utilities.internet.usd),
    mobile: Math.round(city.metrics.utilities.mobile.usd),
    gym: Math.round(city.metrics.lifestyle.gymMembership.usd),
    entertainment: Math.round(city.metrics.lifestyle.cinema.usd * 4),
    healthcare: Math.round(city.metrics.healthcare.medicationBasic.usd),
  };
}

/**
 * Calculate total expenses.
 */
function calculateTotal(expenses: ExpenseState): number {
  return Object.values(expenses).reduce((sum, val) => sum + val, 0);
}

/**
 * Inner component that uses useSearchParams.
 */
function CalculatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sourceCityId, setSourceCityId] = useState<string | null>(null);
  const [targetCityId, setTargetCityId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<ExpenseState>(defaultExpenses);
  const [isInitialized, setIsInitialized] = useState(false);

  const cityIndex = getCityIndex();
  const validCityIds = useMemo(
    () => new Set(cityIndex.map((c) => c.id)),
    [cityIndex]
  );

  const sourceCity = sourceCityId ? getCityById(sourceCityId) : null;
  const targetCity = targetCityId ? getCityById(targetCityId) : null;
  const totalExpenses = useMemo(() => calculateTotal(expenses), [expenses]);

  // Initialize from URL on mount
  useEffect(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (from && validCityIds.has(from)) {
      setSourceCityId(from);
      const city = getCityById(from);
      if (city) {
        setExpenses(getExpensesFromCity(city));
      }
    }
    if (to && validCityIds.has(to)) {
      setTargetCityId(to);
    }
    setIsInitialized(true);
  }, [searchParams, validCityIds]);

  // Update URL when cities change
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (sourceCityId) params.set('from', sourceCityId);
    if (targetCityId) params.set('to', targetCityId);

    const newUrl = params.toString()
      ? `/calculator?${params.toString()}`
      : '/calculator';
    router.replace(newUrl, { scroll: false });
  }, [sourceCityId, targetCityId, isInitialized, router]);

  const handleSourceCityChange = (cityId: string) => {
    setSourceCityId(cityId);
    const city = getCityById(cityId);
    if (city) {
      setExpenses(getExpensesFromCity(city));
    }
  };

  const handleReset = () => {
    if (sourceCity) {
      setExpenses(getExpensesFromCity(sourceCity));
    } else {
      setExpenses(defaultExpenses);
    }
  };

  const hasExpenses = totalExpenses > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Budget Calculator</h1>
        <p className="text-gray-600 mt-2">
          Enter your monthly expenses to see what equivalent budget you would
          need in another city.
        </p>
      </div>

      {/* City selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <CitySelector
            cities={cityIndex}
            selectedId={sourceCityId}
            onChange={handleSourceCityChange}
            label="Your Current City"
            excludeId={targetCityId}
          />
          {sourceCity && (
            <p className="text-sm text-blue-700 mt-2">
              Pre-filled with average costs. Adjust to match your spending.
            </p>
          )}
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <CitySelector
            cities={cityIndex}
            selectedId={targetCityId}
            onChange={setTargetCityId}
            label="Target City"
            excludeId={sourceCityId}
          />
          {targetCity && (
            <p className="text-sm text-purple-700 mt-2">
              See your equivalent budget in {targetCity.name}
            </p>
          )}
        </div>
      </div>

      {/* Expense form */}
      <ExpenseForm
        expenses={expenses}
        onChange={setExpenses}
        onReset={handleReset}
        showReset={hasExpenses}
      />

      {/* Current total display */}
      <div className="bg-gray-900 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Your Monthly Expenses</p>
            <p className="text-3xl font-bold">
              ${totalExpenses.toLocaleString()}
            </p>
          </div>
          {sourceCity && (
            <div className="text-right">
              <p className="text-gray-400 text-sm">in</p>
              <p className="text-lg font-medium">{sourceCity.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Results or prompts */}
      {sourceCity && targetCity && hasExpenses ? (
        <BudgetResults
          sourceCity={sourceCity}
          targetCity={targetCity}
          expenses={expenses}
        />
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">
            {!sourceCity
              ? 'Select your current city to get started'
              : !hasExpenses
                ? 'Enter your monthly expenses above'
                : 'Select a target city to see your equivalent budget'}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Calculator page wrapper with Suspense for useSearchParams.
 */
export default function CalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Budget Calculator
            </h1>
            <p className="text-gray-600 mt-2">Loading calculator...</p>
          </div>
        </div>
      }
    >
      <CalculatorContent />
    </Suspense>
  );
}
