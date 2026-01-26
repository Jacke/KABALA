'use client';

/**
 * Interactive tax calculator with salary slider.
 * Shows real-time tax calculations based on progressive brackets.
 */

import { useState, useMemo } from 'react';
import type { TaxMetrics, Currency } from '@/types';
import { calculateTaxes, formatTaxAmount } from '@/lib/tax';

interface TaxCalculatorProps {
  /** Tax configuration for the city */
  tax: TaxMetrics;
  /** City currency */
  currency: Currency;
  /** Average salary for default slider position */
  averageSalary: number;
  /** Minimum salary for slider range */
  minimumSalary: number;
}

/**
 * Format currency value with symbol.
 */
function formatWithSymbol(value: number, symbol: string): string {
  return `${symbol}${formatTaxAmount(value)}`;
}

/**
 * Tax brackets display table.
 */
function TaxBracketsTable({
  tax,
  currency,
  currentIncome,
}: {
  tax: TaxMetrics;
  currency: Currency;
  currentIncome: number;
}) {
  const yearlyDeduction = tax.incomeTax.yearlyDeduction || 0;
  const taxableIncome = Math.max(0, currentIncome * 12 - yearlyDeduction);

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        Income Tax Brackets
      </h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 pr-4 font-medium text-gray-600">
                From
              </th>
              <th className="text-right py-2 font-medium text-gray-600">
                Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {tax.incomeTax.brackets.map((bracket, index) => {
              const isActive = taxableIncome >= bracket.threshold;
              const nextBracket = tax.incomeTax.brackets[index + 1];
              const isCurrentBracket =
                isActive &&
                (!nextBracket || taxableIncome < nextBracket.threshold);

              return (
                <tr
                  key={bracket.threshold}
                  className={`border-b border-gray-100 ${
                    isCurrentBracket
                      ? 'bg-blue-50 font-medium'
                      : isActive
                        ? 'text-gray-900'
                        : 'text-gray-400'
                  }`}
                >
                  <td className="py-2 pr-4">
                    {formatWithSymbol(bracket.threshold, currency.symbol)}
                    {bracket.threshold === 0 ? '' : '+'}
                    /year
                  </td>
                  <td className="py-2 text-right">{bracket.rate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {yearlyDeduction > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Tax-free allowance: {formatWithSymbol(yearlyDeduction, currency.symbol)}/year
        </p>
      )}
    </div>
  );
}

/**
 * Additional tax info (VAT, social contributions, property tax).
 */
function AdditionalTaxInfo({
  tax,
  currency,
}: {
  tax: TaxMetrics;
  currency: Currency;
}) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Other Taxes</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">VAT (Standard)</span>
          <p className="font-medium">{tax.vat.standard}%</p>
        </div>
        {tax.vat.reduced !== undefined && (
          <div>
            <span className="text-gray-500">VAT (Reduced)</span>
            <p className="font-medium">{tax.vat.reduced}%</p>
          </div>
        )}
        <div>
          <span className="text-gray-500">Social (Employee)</span>
          <p className="font-medium">{tax.socialContributions.employeeRate}%</p>
        </div>
        <div>
          <span className="text-gray-500">Social (Employer)</span>
          <p className="font-medium">{tax.socialContributions.employerRate}%</p>
        </div>
        {tax.propertyTax && (
          <div>
            <span className="text-gray-500">Property Tax</span>
            <p className="font-medium">{tax.propertyTax.ratePercent}%/year</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Interactive tax calculator with salary slider.
 */
export function TaxCalculator({
  tax,
  currency,
  averageSalary,
  minimumSalary,
}: TaxCalculatorProps) {
  // Slider range: minimum to 5x average
  const minSalary = Math.max(minimumSalary, 100);
  const maxSalary = averageSalary * 5;

  const [monthlySalary, setMonthlySalary] = useState(averageSalary);

  // Calculate taxes
  const result = useMemo(
    () => calculateTaxes(monthlySalary, tax),
    [monthlySalary, tax]
  );

  // Calculate slider percentage
  const sliderPercent = ((monthlySalary - minSalary) / (maxSalary - minSalary)) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tax Calculator
      </h3>

      {/* Salary Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            Gross Monthly Salary
          </label>
          <span className="text-lg font-bold text-gray-900">
            {formatWithSymbol(monthlySalary, currency.symbol)}
          </span>
        </div>
        <input
          type="range"
          min={minSalary}
          max={maxSalary}
          step={Math.max(1, Math.round((maxSalary - minSalary) / 500))}
          value={monthlySalary}
          onChange={(e) => setMonthlySalary(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatWithSymbol(minSalary, currency.symbol)}</span>
          <span>{formatWithSymbol(maxSalary, currency.symbol)}</span>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        {/* Gross */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <div>
            <span className="text-gray-600">Gross</span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-gray-900">
              {formatWithSymbol(result.grossMonthly, currency.symbol)}/mo
            </span>
            <span className="text-gray-500 text-sm ml-2">
              ({formatWithSymbol(result.grossYearly, currency.symbol)}/yr)
            </span>
          </div>
        </div>

        {/* Income Tax */}
        <div className="flex justify-between items-center text-red-600">
          <div>
            <span>Income Tax</span>
            <span className="text-xs ml-1">({result.currentBracketRate}% bracket)</span>
          </div>
          <div className="text-right">
            <span className="font-medium">
              -{formatWithSymbol(result.incomeTaxYearly / 12, currency.symbol)}/mo
            </span>
          </div>
        </div>

        {/* Social Contributions */}
        {tax.socialContributions.employeeRate > 0 && (
          <div className="flex justify-between items-center text-red-600">
            <div>
              <span>Social Contributions</span>
              <span className="text-xs ml-1">
                ({tax.socialContributions.employeeRate}%)
              </span>
            </div>
            <div className="text-right">
              <span className="font-medium">
                -{formatWithSymbol(result.socialContributionsYearly / 12, currency.symbol)}/mo
              </span>
            </div>
          </div>
        )}

        {/* Net */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div>
            <span className="font-semibold text-gray-900">Net (Take-home)</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-green-600 text-lg">
              {formatWithSymbol(result.netMonthly, currency.symbol)}/mo
            </span>
            <span className="text-gray-500 text-sm ml-2">
              ({formatWithSymbol(result.netYearly, currency.symbol)}/yr)
            </span>
          </div>
        </div>

        {/* Effective Rate */}
        <div className="flex justify-between items-center pt-2 text-sm">
          <span className="text-gray-500">Effective Tax Rate</span>
          <span className="font-medium text-gray-700">
            {result.effectiveRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Tax Brackets Table */}
      <TaxBracketsTable tax={tax} currency={currency} currentIncome={monthlySalary} />

      {/* Additional Tax Info */}
      <AdditionalTaxInfo tax={tax} currency={currency} />
    </div>
  );
}
