Вот чётко сформулированный дизайн-промт и архитектура для `kabala.md` — **вдохновляющего финансового дашборда для размышляющего белого воротничка**:

---

## 🎨 Промт для AI-дизайна

```text
Design a beautiful, minimalist personal finance dashboard for a white-collar worker. The interface should feel meditative and insightful — not corporate or gamified. Use soft typography, calm color palette (beige, navy, grayscale), and modern layout techniques (glassmorphism, neumorphism, or subtle gradients).

The dashboard should answer:
- "Where did all my money go?"
- "Where am I now financially?"
- "What could happen next if my life stays as is?"

Key components:
- A timeline switcher (Past, Now, Future)
- Transaction segments: Housing, Food, Subscriptions, Fun, Travel, etc.
- Visualizations: Pie charts, stacked bars, smooth line graphs
- A forecast simulation panel with salary, burn rate, and target goals
- Contextual messages like “Your lifestyle costs 2.3x your income” or “You’ll run out of cash in 7 months”

Inspiration: Notion, Apple Screen Time, Linear, Reflect.app

The layout should be adaptive, with both mobile and desktop versions, and give a sense of clarity and long-term control.
```

---

## 🧱 Архитектура `kabala.md`

### 🧩 1. **Frontend**

* **Framework**: Next.js 14 + Tailwind + shadcn/ui
* **Pages**:

  * `/`: Dashboard (with time slider)
  * `/upload`: Manual or CSV import
  * `/insights`: Burn rate, runway, future
* **Key Components**:

  * `TimeModeSwitcher`: Past / Now / Future
  * `SegmentPieChart`, `SpendingStackBar`
  * `ForecastCard`, `NetWorthTrendLine`
  * `SegmentSelector`, `InsightSentence`
  * `BurnRateGauge`, `SavingsRunway`

---

### 📦 2. **Backend**

* **Stack**: Go or Supabase (Postgres)
* **Core Models**:

  ```go
  type Transaction struct {
    ID        string
    Amount    float64
    Date      time.Time
    Type      string // "income" | "expense"
    Category  string // "housing", "food", etc.
    Note      string
  }

  type ForecastScenario struct {
    BaseSalary float64
    MonthlyBurn float64
    TargetGoals []Goal
  }

  type Goal struct {
    Label   string
    Target  float64
    DueDate time.Time
  }
  ```

---

### 📈 3. **Модули логики**

* **Segmentation**: правила на основе категорий + ML авто-классификация
* **Burn Rate Engine**: расчёт среднего по неделям/месяцам
* **Forecast Engine**:

  * If salary stays the same, when will you go broke?
  * What if you reduce food/rent expenses by 10%?
* **Insight Generator** (text blocks):

  * “Most money goes to subscriptions — 28%”
  * “Your financial rhythm changed after November”

---

### ⚙️ 4. **Инфраструктура**

* SQLite для локальных экспериментов
* Railway / Supabase for light cloud sync
* `Makefile`, `.env`, `Dockerfile` для быстрой dev среды

---

## 🎯 Возможные инсайты:

| Вопрос                 | Механика                                  |
| ---------------------- | ----------------------------------------- |
| Что у меня сейчас?     | Вывод: остатки, динамика, структура трат  |
| Куда ушло?             | Группировка + timeline                    |
| Что может быть дальше? | Forecast с burn rate, “если всё оставить” |

---

Хочешь, могу сразу накидать компонентный список, mock API, или готовую frontend scaffold на Next.js. Переходим к `tgpt.md`?

