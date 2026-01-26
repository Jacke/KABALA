/**
 * Tax calculation utilities.
 */

import type { TaxMetrics, TaxCalculationResult, TaxBracket } from '@/types';

/**
 * Calculate income tax using progressive brackets.
 * @param yearlyIncome - Gross yearly income
 * @param brackets - Tax brackets sorted by threshold ascending
 * @param yearlyDeduction - Tax-free deduction (optional)
 * @returns Yearly income tax amount
 */
export function calculateIncomeTax(
  yearlyIncome: number,
  brackets: TaxBracket[],
  yearlyDeduction: number = 0
): number {
  const taxableIncome = Math.max(0, yearlyIncome - yearlyDeduction);

  if (taxableIncome === 0 || brackets.length === 0) {
    return 0;
  }

  let totalTax = 0;
  let previousThreshold = 0;

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const nextBracket = brackets[i + 1];
    const nextThreshold = nextBracket ? nextBracket.threshold : Infinity;

    if (taxableIncome <= bracket.threshold) {
      break;
    }

    const incomeInBracket = Math.min(
      taxableIncome - bracket.threshold,
      nextThreshold - bracket.threshold
    );

    if (incomeInBracket > 0) {
      totalTax += incomeInBracket * (bracket.rate / 100);
    }

    previousThreshold = bracket.threshold;
  }

  return totalTax;
}

/**
 * Calculate social security contributions.
 * @param yearlyIncome - Gross yearly income
 * @param employeeRate - Employee contribution rate as percentage
 * @param cap - Annual income cap for contributions (optional)
 * @returns Yearly social contributions amount
 */
export function calculateSocialContributions(
  yearlyIncome: number,
  employeeRate: number,
  cap?: number
): number {
  const taxableBase = cap ? Math.min(yearlyIncome, cap) : yearlyIncome;
  return taxableBase * (employeeRate / 100);
}

/**
 * Get current tax bracket rate for a given income.
 * @param yearlyIncome - Gross yearly income
 * @param brackets - Tax brackets sorted by threshold ascending
 * @param yearlyDeduction - Tax-free deduction (optional)
 * @returns Current marginal tax rate
 */
export function getCurrentBracketRate(
  yearlyIncome: number,
  brackets: TaxBracket[],
  yearlyDeduction: number = 0
): number {
  const taxableIncome = Math.max(0, yearlyIncome - yearlyDeduction);

  if (brackets.length === 0) {
    return 0;
  }

  // Find the highest bracket that applies
  let currentRate = brackets[0].rate;
  for (const bracket of brackets) {
    if (taxableIncome >= bracket.threshold) {
      currentRate = bracket.rate;
    } else {
      break;
    }
  }

  return currentRate;
}

/**
 * Calculate complete tax breakdown for a given monthly salary.
 * @param monthlySalary - Gross monthly salary
 * @param taxMetrics - Tax configuration for the city/country
 * @returns Complete tax calculation result
 */
export function calculateTaxes(
  monthlySalary: number,
  taxMetrics: TaxMetrics
): TaxCalculationResult {
  const grossYearly = monthlySalary * 12;
  const grossMonthly = monthlySalary;

  // Calculate income tax
  const incomeTaxYearly = calculateIncomeTax(
    grossYearly,
    taxMetrics.incomeTax.brackets,
    taxMetrics.incomeTax.yearlyDeduction
  );

  // Calculate social contributions
  const socialContributionsYearly = calculateSocialContributions(
    grossYearly,
    taxMetrics.socialContributions.employeeRate,
    taxMetrics.socialContributions.cap
  );

  // Calculate net income
  const totalDeductions = incomeTaxYearly + socialContributionsYearly;
  const netYearly = grossYearly - totalDeductions;
  const netMonthly = netYearly / 12;

  // Calculate effective rate
  const effectiveRate = grossYearly > 0
    ? (totalDeductions / grossYearly) * 100
    : 0;

  // Get current bracket rate
  const currentBracketRate = getCurrentBracketRate(
    grossYearly,
    taxMetrics.incomeTax.brackets,
    taxMetrics.incomeTax.yearlyDeduction
  );

  return {
    grossYearly,
    grossMonthly,
    incomeTaxYearly,
    socialContributionsYearly,
    netYearly,
    netMonthly,
    effectiveRate,
    currentBracketRate,
  };
}

/**
 * Format a number as currency with proper separators.
 * @param value - Number to format
 * @param decimals - Number of decimal places (default 0)
 * @returns Formatted string
 */
export function formatTaxAmount(value: number, decimals: number = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
