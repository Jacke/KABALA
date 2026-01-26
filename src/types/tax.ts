/**
 * Tax-related type definitions.
 */

/**
 * A single tax bracket defining a threshold and rate.
 */
export interface TaxBracket {
  /** Income threshold (yearly, in local currency) */
  threshold: number;
  /** Tax rate as percentage (e.g., 13 for 13%) */
  rate: number;
}

/**
 * Income tax configuration with progressive brackets.
 */
export interface IncomeTaxConfig {
  /** Progressive tax brackets (sorted by threshold ascending) */
  brackets: TaxBracket[];
  /** Yearly tax-free deduction/allowance (optional) */
  yearlyDeduction?: number;
}

/**
 * Social security contributions configuration.
 */
export interface SocialContributionsConfig {
  /** Employee contribution rate as percentage */
  employeeRate: number;
  /** Employer contribution rate as percentage (for reference) */
  employerRate: number;
  /** Annual income cap for contributions (optional) */
  cap?: number;
}

/**
 * VAT (Value Added Tax) configuration.
 */
export interface VatConfig {
  /** Standard VAT rate as percentage */
  standard: number;
  /** Reduced VAT rate as percentage (optional) */
  reduced?: number;
}

/**
 * Property tax configuration.
 */
export interface PropertyTaxConfig {
  /** Annual rate as percentage of cadastral value */
  ratePercent: number;
}

/**
 * Complete tax metrics for a city/country.
 */
export interface TaxMetrics {
  /** Income tax configuration */
  incomeTax: IncomeTaxConfig;
  /** Social security contributions */
  socialContributions: SocialContributionsConfig;
  /** VAT rates */
  vat: VatConfig;
  /** Property tax (optional) */
  propertyTax?: PropertyTaxConfig;
}

/**
 * Result of tax calculation for a given income.
 */
export interface TaxCalculationResult {
  /** Gross yearly income */
  grossYearly: number;
  /** Gross monthly income */
  grossMonthly: number;
  /** Income tax amount (yearly) */
  incomeTaxYearly: number;
  /** Social contributions amount (yearly) */
  socialContributionsYearly: number;
  /** Net yearly income after taxes */
  netYearly: number;
  /** Net monthly income after taxes */
  netMonthly: number;
  /** Effective tax rate as percentage */
  effectiveRate: number;
  /** Current tax bracket rate */
  currentBracketRate: number;
}
