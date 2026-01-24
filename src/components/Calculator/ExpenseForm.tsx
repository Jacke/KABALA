'use client';

/**
 * ExpenseForm component for inputting monthly expenses by category.
 */

export interface ExpenseState {
  rent: number;
  groceries: number;
  diningOut: number;
  transport: number;
  utilities: number;
  internet: number;
  mobile: number;
  gym: number;
  entertainment: number;
  healthcare: number;
}

export const defaultExpenses: ExpenseState = {
  rent: 0,
  groceries: 0,
  diningOut: 0,
  transport: 0,
  utilities: 0,
  internet: 0,
  mobile: 0,
  gym: 0,
  entertainment: 0,
  healthcare: 0,
};

export interface ExpenseFormProps {
  /** Current expense values */
  expenses: ExpenseState;
  /** Callback when expenses change */
  onChange: (expenses: ExpenseState) => void;
  /** Reset to default/city values */
  onReset?: () => void;
  /** Whether reset button should be shown */
  showReset?: boolean;
}

interface ExpenseInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
}

function ExpenseInput({ label, value, onChange, hint }: ExpenseInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          $
        </span>
        <input
          type="number"
          min={0}
          max={50000}
          step={1}
          value={value || ''}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            onChange(Math.max(0, Math.min(50000, val)));
          }}
          className="block w-full rounded-md border border-gray-300 pl-7 pr-16 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="0"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          /month
        </span>
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

/**
 * Form for inputting monthly expenses by category.
 */
export function ExpenseForm({
  expenses,
  onChange,
  onReset,
  showReset = false,
}: ExpenseFormProps) {
  const updateField = (field: keyof ExpenseState, value: number) => {
    onChange({ ...expenses, [field]: value });
  };

  return (
    <div className="space-y-4">
      {showReset && onReset && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Reset to city averages
          </button>
        </div>
      )}

      <FormSection title="Housing">
        <ExpenseInput
          label="Rent"
          value={expenses.rent}
          onChange={(v) => updateField('rent', v)}
          hint="Monthly rent for your apartment"
        />
      </FormSection>

      <FormSection title="Food">
        <ExpenseInput
          label="Groceries"
          value={expenses.groceries}
          onChange={(v) => updateField('groceries', v)}
          hint="Monthly grocery shopping"
        />
        <ExpenseInput
          label="Dining Out"
          value={expenses.diningOut}
          onChange={(v) => updateField('diningOut', v)}
          hint="Restaurants and takeout"
        />
      </FormSection>

      <FormSection title="Transportation">
        <ExpenseInput
          label="Public Transit / Car"
          value={expenses.transport}
          onChange={(v) => updateField('transport', v)}
          hint="Monthly pass or fuel/maintenance"
        />
      </FormSection>

      <FormSection title="Utilities">
        <ExpenseInput
          label="Basic Utilities"
          value={expenses.utilities}
          onChange={(v) => updateField('utilities', v)}
          hint="Electricity, heating, water"
        />
        <ExpenseInput
          label="Internet"
          value={expenses.internet}
          onChange={(v) => updateField('internet', v)}
        />
        <ExpenseInput
          label="Mobile Phone"
          value={expenses.mobile}
          onChange={(v) => updateField('mobile', v)}
        />
      </FormSection>

      <FormSection title="Lifestyle">
        <ExpenseInput
          label="Gym / Fitness"
          value={expenses.gym}
          onChange={(v) => updateField('gym', v)}
        />
        <ExpenseInput
          label="Entertainment"
          value={expenses.entertainment}
          onChange={(v) => updateField('entertainment', v)}
          hint="Movies, events, hobbies"
        />
      </FormSection>

      <FormSection title="Healthcare">
        <ExpenseInput
          label="Health & Medications"
          value={expenses.healthcare}
          onChange={(v) => updateField('healthcare', v)}
          hint="Insurance, medications, doctor visits"
        />
      </FormSection>
    </div>
  );
}
