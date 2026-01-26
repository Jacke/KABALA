'use client';

import { Tabs, type Tab } from '@/components/ui';
import { MetricCard, MetricSection } from './';
import { TaxCalculator } from './TaxCalculator';
import { HistoricalCharts } from './HistoricalCharts';
import type { CityWithMetrics } from '@/types';

interface CityTabsProps {
  city: CityWithMetrics;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'housing', label: 'Housing' },
  { id: 'daily', label: 'Daily Life' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'taxes', label: 'Taxes' },
  { id: 'trends', label: 'Trends' },
];

export function CityTabs({ city }: CityTabsProps) {
  const { metrics, currency } = city;
  const currencyCode = currency.code;

  return (
    <Tabs tabs={tabs} defaultTab="overview">
      {(activeTab) => (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricSection title="Income">
                <MetricCard
                  label="Average Salary"
                  value={metrics.salary.average}
                  currencyCode={currencyCode}
                  subtitle="net monthly"
                  showBoth
                />
                {metrics.salary.median && (
                  <MetricCard
                    label="Median Salary"
                    value={metrics.salary.median}
                    currencyCode={currencyCode}
                    subtitle="net monthly"
                    showBoth
                  />
                )}
                {metrics.salary.minimum && (
                  <MetricCard
                    label="Minimum Wage"
                    value={metrics.salary.minimum}
                    currencyCode={currencyCode}
                    subtitle="net monthly"
                    showBoth
                  />
                )}
              </MetricSection>

              <MetricSection title="Rent (1BR)">
                <MetricCard
                  label="City Center"
                  value={metrics.rent.oneBedroom}
                  currencyCode={currencyCode}
                  subtitle="monthly"
                  showBoth
                />
              </MetricSection>

              <MetricSection title="Key Costs">
                <MetricCard
                  label="Groceries"
                  value={metrics.food.groceries}
                  currencyCode={currencyCode}
                  subtitle="monthly"
                  showBoth
                />
                <MetricCard
                  label="Transport Pass"
                  value={metrics.transport.monthlyPass}
                  currencyCode={currencyCode}
                  subtitle="monthly"
                  showBoth
                />
                <MetricCard
                  label="Utilities"
                  value={metrics.utilities.basic}
                  currencyCode={currencyCode}
                  subtitle="monthly"
                  showBoth
                />
              </MetricSection>
            </div>
          )}

          {/* Housing Tab */}
          {activeTab === 'housing' && (
            <div className="space-y-6">
              {/* Rent Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rent (Monthly)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {metrics.rent.studio && (
                    <MetricSection title="Studio">
                      <MetricCard
                        label="Monthly Rent"
                        value={metrics.rent.studio}
                        currencyCode={currencyCode}
                        showBoth
                      />
                    </MetricSection>
                  )}
                  <MetricSection title="1 Bedroom">
                    <MetricCard
                      label="Monthly Rent"
                      value={metrics.rent.oneBedroom}
                      currencyCode={currencyCode}
                      showBoth
                    />
                  </MetricSection>
                  <MetricSection title="2 Bedroom">
                    <MetricCard
                      label="Monthly Rent"
                      value={metrics.rent.twoBedroom}
                      currencyCode={currencyCode}
                      showBoth
                    />
                  </MetricSection>
                  <MetricSection title="3 Bedroom">
                    <MetricCard
                      label="Monthly Rent"
                      value={metrics.rent.threeBedroom}
                      currencyCode={currencyCode}
                      showBoth
                    />
                  </MetricSection>
                </div>
              </div>

              {/* Buy - City Center Section */}
              {metrics.property.buyCityCenter && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Buy - City Center</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricSection title="1 Bedroom (~50 sqm)">
                      <MetricCard
                        label="Purchase Price"
                        value={metrics.property.buyCityCenter.oneBedroom}
                        currencyCode={currencyCode}
                        showBoth
                      />
                    </MetricSection>
                    <MetricSection title="2 Bedroom (~75 sqm)">
                      <MetricCard
                        label="Purchase Price"
                        value={metrics.property.buyCityCenter.twoBedroom}
                        currencyCode={currencyCode}
                        showBoth
                      />
                    </MetricSection>
                    <MetricSection title="3 Bedroom (~110 sqm)">
                      <MetricCard
                        label="Purchase Price"
                        value={metrics.property.buyCityCenter.threeBedroom}
                        currencyCode={currencyCode}
                        showBoth
                      />
                    </MetricSection>
                  </div>
                </div>
              )}

              {/* Buy - Outside Center Section */}
              {metrics.property.buyOutside && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Buy - Outside Center</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricSection title="1 Bedroom (~50 sqm)">
                      <MetricCard
                        label="Purchase Price"
                        value={metrics.property.buyOutside.oneBedroom}
                        currencyCode={currencyCode}
                        showBoth
                      />
                    </MetricSection>
                    <MetricSection title="2 Bedroom (~75 sqm)">
                      <MetricCard
                        label="Purchase Price"
                        value={metrics.property.buyOutside.twoBedroom}
                        currencyCode={currencyCode}
                        showBoth
                      />
                    </MetricSection>
                    <MetricSection title="3 Bedroom (~110 sqm)">
                      <MetricCard
                        label="Purchase Price"
                        value={metrics.property.buyOutside.threeBedroom}
                        currencyCode={currencyCode}
                        showBoth
                      />
                    </MetricSection>
                  </div>
                </div>
              )}

              {/* Price per sqm reference */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price per sqm</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricSection title="City Center">
                    <MetricCard
                      label="per sqm"
                      value={metrics.property.cityCenter}
                      currencyCode={currencyCode}
                      showBoth
                    />
                  </MetricSection>
                  <MetricSection title="Outside Center">
                    <MetricCard
                      label="per sqm"
                      value={metrics.property.outside}
                      currencyCode={currencyCode}
                      showBoth
                    />
                  </MetricSection>
                </div>
              </div>
            </div>
          )}

          {/* Daily Life Tab */}
          {activeTab === 'daily' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricSection title="Food">
                <MetricCard
                  label="Groceries"
                  value={metrics.food.groceries}
                  currencyCode={currencyCode}
                  subtitle="per month"
                  showBoth
                />
                <MetricCard
                  label="Restaurant Meal"
                  value={metrics.food.restaurantMeal}
                  currencyCode={currencyCode}
                  subtitle="mid-range"
                  showBoth
                />
                <MetricCard
                  label="Fast Food"
                  value={metrics.food.fastFood}
                  currencyCode={currencyCode}
                  subtitle="combo meal"
                  showBoth
                />
              </MetricSection>

              <MetricSection title="Transport">
                <MetricCard
                  label="Monthly Pass"
                  value={metrics.transport.monthlyPass}
                  currencyCode={currencyCode}
                  subtitle="public transit"
                  showBoth
                />
                <MetricCard
                  label="Taxi"
                  value={metrics.transport.taxiPerKm}
                  currencyCode={currencyCode}
                  subtitle="per km"
                  showBoth
                />
                <MetricCard
                  label="Gasoline"
                  value={metrics.transport.gasoline}
                  currencyCode={currencyCode}
                  subtitle="per liter"
                  showBoth
                />
              </MetricSection>

              <MetricSection title="Utilities">
                <MetricCard
                  label="Basic"
                  value={metrics.utilities.basic}
                  currencyCode={currencyCode}
                  subtitle="electricity, heating, water"
                  showBoth
                />
                <MetricCard
                  label="Internet"
                  value={metrics.utilities.internet}
                  currencyCode={currencyCode}
                  subtitle="60+ Mbps"
                  showBoth
                />
                <MetricCard
                  label="Mobile"
                  value={metrics.utilities.mobile}
                  currencyCode={currencyCode}
                  subtitle="monthly plan"
                  showBoth
                />
              </MetricSection>
            </div>
          )}

          {/* Lifestyle Tab */}
          {activeTab === 'lifestyle' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricSection title="Entertainment">
                <MetricCard
                  label="Gym Membership"
                  value={metrics.lifestyle.gymMembership}
                  currencyCode={currencyCode}
                  subtitle="monthly"
                  showBoth
                />
                <MetricCard
                  label="Cinema"
                  value={metrics.lifestyle.cinema}
                  currencyCode={currencyCode}
                  subtitle="one ticket"
                  showBoth
                />
                <MetricCard
                  label="Cappuccino"
                  value={metrics.lifestyle.cappuccino}
                  currencyCode={currencyCode}
                  subtitle="regular"
                  showBoth
                />
              </MetricSection>

              <MetricSection title="Healthcare">
                <MetricCard
                  label="Doctor Visit"
                  value={metrics.healthcare.doctorVisit}
                  currencyCode={currencyCode}
                  subtitle="general practitioner"
                  showBoth
                />
                <MetricCard
                  label="Medications"
                  value={metrics.healthcare.medicationBasic}
                  currencyCode={currencyCode}
                  subtitle="basic monthly"
                  showBoth
                />
              </MetricSection>

              {metrics.education && (metrics.education.preschool || metrics.education.internationalSchool) && (
                <MetricSection title="Education">
                  {metrics.education.preschool && (
                    <MetricCard
                      label="Preschool"
                      value={metrics.education.preschool}
                      currencyCode={currencyCode}
                      subtitle="monthly"
                      showBoth
                    />
                  )}
                  {metrics.education.internationalSchool && (
                    <MetricCard
                      label="International School"
                      value={metrics.education.internationalSchool}
                      currencyCode={currencyCode}
                      subtitle="yearly"
                      showBoth
                    />
                  )}
                </MetricSection>
              )}
            </div>
          )}

          {/* Taxes Tab */}
          {activeTab === 'taxes' && (
            <div>
              {metrics.tax ? (
                <TaxCalculator
                  tax={metrics.tax}
                  currency={currency}
                  averageSalary={metrics.salary.average.local}
                  minimumSalary={metrics.salary.minimum?.local || metrics.salary.average.local * 0.3}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Tax information not available for this city
                </div>
              )}
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div>
              {city.historical ? (
                <HistoricalCharts historical={city.historical} cityName={city.name} />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Historical data not available for this city
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Tabs>
  );
}
