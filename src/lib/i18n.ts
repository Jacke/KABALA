export type Locale = 'en' | 'ru';

export const translations = {
  en: {
    // Navigation
    nav: {
      map: 'Map',
      rankings: 'Rankings',
      compare: 'Compare',
      calculator: 'Calculator',
      timeToHome: 'Time to Home',
    },

    // Time to Home page
    timeToHome: {
      title: 'TIME TO YOUR HOME',
      subtitle: 'Face the brutal reality. See how long it really takes to buy property, with inflation destroying your dreams every year.',
      warning: 'Warning: Results may cause existential dread, depression, apathy, bed-rot, and various addictions',
      calculateButton: 'Calculate My Doom',

      // Form
      form: {
        yourAge: 'Your Age',
        targetCity: 'Target City',
        currentSavings: 'Current Savings',
        monthlySavings: 'Monthly Savings',
        monthlySavingsHint: 'How much you can save each month',
      },

      // Results
      results: {
        resultsFor: 'Results for',
        yourAge: 'Your age',
        realityCheck: 'REALITY CHECK',
        realityCheckText: 'At your current savings rate, you would need {years} years to afford property here. That\'s beyond a human lifetime. Consider different cities or drastically increasing income.',
        cruelReality: 'The cruel reality of inflation',
        inflation: 'Inflation',
        propertyGrowth: 'Property growth',
        year: '/year',
        source: 'Source',
        updated: 'Updated',
        dreamScenario: 'Dream scenario',
        reality: 'REALITY',
        age: 'Age',
        longer: 'longer',
        whySoLong: 'Why so long?',

        // Lifetime messages
        multipleLifetimes: 'Multiple lifetimes required',
        wontLive: 'You won\'t live to see this',
        liveVeryLong: 'Only if you live very long',
        retirementAge: 'Retirement age purchase',
        alreadyAffordable: 'Already affordable!',
        years: 'years',
        year_singular: 'year',

        // Explanations
        chasingTarget: 'Property prices grow {growth}%/year while inflation is {inflation}%. Your savings are being outpaced — you\'re chasing a moving target that runs faster than you.',
        grandchildren: 'At this rate, even your great-great-great-grandchildren wouldn\'t own this property. The math simply doesn\'t work.',
        mathematicallyImpossible: 'This timeline exceeds average human lifespan twice over. Without drastic changes, this property is mathematically impossible for you.',
        pricesDouble: 'With current inflation trends, property prices will double every {years} years while your savings struggle to keep up.',
        runningBackwards: 'Property prices are growing faster than your savings. You\'re running backwards on a treadmill.',
      },

      // Tips
      tips: {
        title: 'How to actually afford this',
        tip1: 'Increase income 2-3x through career growth, side business, or switching to high-paying industry',
        tip2: 'Consider cities with similar quality of life but 3-5x lower property prices',
        tip3: 'Buy with a partner — two incomes cut the timeline dramatically',
        tip4: 'Start investing early — compound growth at 7-10% beats savings accounts',
        tip5: 'Look into government programs, subsidized mortgages, or first-time buyer benefits',
        tip6: 'Consider smaller property first as investment, then upgrade later',
        tip7: 'Remote work allows earning big-city salary while living in affordable area',
        tip8: 'Family help remains the #1 way people afford first homes in expensive cities',
        tip9: 'Market timing: crashes happen every 10-15 years, be ready with savings',
      },

      // How it works
      howItWorks: {
        title: 'How This Calculator Crushes Your Dreams',
        step1Title: 'Enter Your Sad Reality',
        step1Text: 'Your age, pathetic savings, and the pittance you can save monthly',
        step2Title: 'Pick Your Dream City',
        step2Text: '56 cities with brutally honest real property prices',
        step3Title: 'Face The Truth',
        step3Text: 'Dream scenario vs harsh reality with inflation eating your future',
        dataSource: 'Inflation data from',
        lastUpdated: 'Last updated',
        disclaimer: 'This calculator uses real economic forecasts. The painful numbers you see are not exaggerations — they\'re what happens when inflation compounds year after year.',
      },
    },

    // Compare page
    compare: {
      title: 'Compare Cities',
      subtitle: 'Select cities to compare their cost of living metrics. Set a home base to see relative differences.',
      loading: 'Loading cities...',
      loadingComparison: 'Loading comparison...',
      selectFirst: 'Select first city',
      addAnother: 'Add another city',
      maxCities: 'Maximum of {max} cities can be compared at once.',
      tipHomeBase: 'Tip: Click 🏠 on a city to set it as your home base and see relative differences.',
      selectToStart: 'Select cities above to start comparing',
      selectOneMore: 'Select at least one more city to compare',
      clearAll: 'Clear all',
      setAsHome: 'Set as home base',
      removeCity: 'Remove city',
      homeBase: 'Home base',
    },

    // Rankings page
    rankings: {
      title: 'City Rankings',
      subtitle: 'Compare cities by different metrics',
    },

    // Calculator page
    calculator: {
      title: 'Salary Calculator',
      subtitle: 'Calculate your purchasing power',
    },

    // Home page
    home: {
      title: 'Global Purchasing Power',
      subtitle: 'Compare cost of living across cities worldwide',
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      city: 'City',
      country: 'Country',
      price: 'Price',
      settings: 'Settings',
      language: 'Language',
    },

    // Regions
    regions: {
      eu: 'Europe',
      cis: 'CIS Countries',
      other: 'Asia & Americas',
    },
  },

  ru: {
    // Navigation
    nav: {
      map: 'Карта',
      rankings: 'Рейтинги',
      compare: 'Сравнить',
      calculator: 'Калькулятор',
      timeToHome: 'Время до жилья',
    },

    // Time to Home page
    timeToHome: {
      title: 'ВРЕМЯ ДО ТВОЕГО ЖИЛЬЯ',
      subtitle: 'Взгляни правде в глаза. Узнай, сколько реально нужно времени на покупку недвижимости, пока инфляция уничтожает твои мечты.',
      warning: 'Осторожно: результаты могут вызвать экзистенциальный кризис, депрессию, апатию, bed-rot и различные зависимости',
      calculateButton: 'Рассчитать мою судьбу',

      // Form
      form: {
        yourAge: 'Твой возраст',
        targetCity: 'Целевой город',
        currentSavings: 'Текущие накопления',
        monthlySavings: 'Ежемесячные сбережения',
        monthlySavingsHint: 'Сколько можешь откладывать каждый месяц',
      },

      // Results
      results: {
        resultsFor: 'Результаты для',
        yourAge: 'Твой возраст',
        realityCheck: 'ПРОВЕРКА РЕАЛЬНОСТЬЮ',
        realityCheckText: 'При твоей текущей норме сбережений, тебе понадобится {years} лет на покупку недвижимости здесь. Это превышает человеческую жизнь. Рассмотри другие города или кардинально увеличь доход.',
        cruelReality: 'Жестокая правда об инфляции',
        inflation: 'Инфляция',
        propertyGrowth: 'Рост цен на жильё',
        year: '/год',
        source: 'Источник',
        updated: 'Обновлено',
        dreamScenario: 'Мечта',
        reality: 'РЕАЛЬНОСТЬ',
        age: 'Возраст',
        longer: 'дольше',
        whySoLong: 'Почему так долго?',

        // Lifetime messages
        multipleLifetimes: 'Понадобится несколько жизней',
        wontLive: 'Ты не доживёшь до этого',
        liveVeryLong: 'Только если проживёшь очень долго',
        retirementAge: 'Покупка на пенсии',
        alreadyAffordable: 'Уже доступно!',
        years: 'лет',
        year_singular: 'год',

        // Explanations
        chasingTarget: 'Цены на недвижимость растут на {growth}%/год, а инфляция — {inflation}%. Твои сбережения не успевают — ты гонишься за целью, которая бежит быстрее тебя.',
        grandchildren: 'При таком темпе даже твои праправнуки не смогут купить эту недвижимость. Математика просто не сходится.',
        mathematicallyImpossible: 'Этот срок превышает среднюю продолжительность жизни вдвое. Без радикальных изменений эта недвижимость математически недостижима.',
        pricesDouble: 'При текущих трендах цены на недвижимость удвоятся каждые {years} лет, пока твои сбережения пытаются угнаться.',
        runningBackwards: 'Цены на недвижимость растут быстрее твоих сбережений. Ты бежишь назад на беговой дорожке.',
      },

      // Tips
      tips: {
        title: 'Как реально это себе позволить',
        tip1: 'Увеличь доход в 2-3 раза через карьерный рост, свой бизнес или переход в высокооплачиваемую сферу',
        tip2: 'Рассмотри города с похожим качеством жизни, но ценами в 3-5 раз ниже',
        tip3: 'Покупай с партнёром — два дохода кардинально сокращают срок',
        tip4: 'Начни инвестировать рано — сложный процент 7-10% годовых бьёт банковский вклад',
        tip5: 'Изучи госпрограммы, льготную ипотеку и программы для первого жилья',
        tip6: 'Рассмотри меньшую квартиру как инвестицию, потом обменяй на большую',
        tip7: 'Удалёнка позволяет получать столичную зарплату, живя в доступном регионе',
        tip8: 'Помощь семьи — способ №1, как люди покупают первое жильё в дорогих городах',
        tip9: 'Тайминг рынка: кризисы случаются каждые 10-15 лет, будь готов с накоплениями',
      },

      // How it works
      howItWorks: {
        title: 'Как этот калькулятор разрушает мечты',
        step1Title: 'Введи свою печальную реальность',
        step1Text: 'Твой возраст, жалкие накопления и гроши, которые можешь откладывать',
        step2Title: 'Выбери город мечты',
        step2Text: '56 городов с брутально честными ценами на недвижимость',
        step3Title: 'Взгляни правде в глаза',
        step3Text: 'Сценарий мечты против суровой реальности с инфляцией, пожирающей будущее',
        dataSource: 'Данные по инфляции от',
        lastUpdated: 'Обновлено',
        disclaimer: 'Этот калькулятор использует реальные экономические прогнозы. Болезненные цифры — это не преувеличение, это то, что происходит, когда инфляция накапливается год за годом.',
      },
    },

    // Compare page
    compare: {
      title: 'Сравнение городов',
      subtitle: 'Выбери города для сравнения стоимости жизни. Установи базовый город для относительного сравнения.',
      loading: 'Загрузка городов...',
      loadingComparison: 'Загрузка сравнения...',
      selectFirst: 'Выбери первый город',
      addAnother: 'Добавить ещё город',
      maxCities: 'Максимум {max} городов можно сравнить одновременно.',
      tipHomeBase: 'Совет: нажми 🏠 на городе, чтобы установить его базовым и видеть относительную разницу.',
      selectToStart: 'Выбери города выше для начала сравнения',
      selectOneMore: 'Выбери хотя бы ещё один город для сравнения',
      clearAll: 'Очистить всё',
      setAsHome: 'Установить базовым',
      removeCity: 'Убрать город',
      homeBase: 'Базовый город',
    },

    // Rankings page
    rankings: {
      title: 'Рейтинги городов',
      subtitle: 'Сравнивай города по разным метрикам',
    },

    // Calculator page
    calculator: {
      title: 'Калькулятор зарплаты',
      subtitle: 'Рассчитай свою покупательную способность',
    },

    // Home page
    home: {
      title: 'Глобальная покупательная способность',
      subtitle: 'Сравнивай стоимость жизни в городах мира',
    },

    // Common
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      city: 'Город',
      country: 'Страна',
      price: 'Цена',
      settings: 'Настройки',
      language: 'Язык',
    },

    // Regions
    regions: {
      eu: 'Европа',
      cis: 'Страны СНГ',
      other: 'Азия и Америка',
    },
  },
} as const;

// Use a generic type that works for both languages
export type TranslationKeys = {
  nav: { map: string; rankings: string; compare: string; calculator: string; timeToHome: string };
  timeToHome: {
    title: string;
    subtitle: string;
    warning: string;
    calculateButton: string;
    form: { yourAge: string; targetCity: string; currentSavings: string; monthlySavings: string; monthlySavingsHint: string };
    results: {
      resultsFor: string; yourAge: string; realityCheck: string; realityCheckText: string;
      cruelReality: string; inflation: string; propertyGrowth: string; year: string;
      source: string; updated: string; dreamScenario: string; reality: string; age: string;
      longer: string; whySoLong: string; multipleLifetimes: string; wontLive: string;
      liveVeryLong: string; retirementAge: string; alreadyAffordable: string; years: string;
      year_singular: string; chasingTarget: string; grandchildren: string;
      mathematicallyImpossible: string; pricesDouble: string; runningBackwards: string;
    };
    tips: { title: string; tip1: string; tip2: string; tip3: string; tip4: string; tip5: string; tip6: string; tip7: string; tip8: string; tip9: string };
    howItWorks: {
      title: string; step1Title: string; step1Text: string; step2Title: string; step2Text: string;
      step3Title: string; step3Text: string; dataSource: string; lastUpdated: string; disclaimer: string;
    };
  };
  compare: {
    title: string; subtitle: string; loading: string; loadingComparison: string;
    selectFirst: string; addAnother: string; maxCities: string; tipHomeBase: string;
    selectToStart: string; selectOneMore: string; clearAll: string; setAsHome: string;
    removeCity: string; homeBase: string;
  };
  rankings: { title: string; subtitle: string };
  calculator: { title: string; subtitle: string };
  home: { title: string; subtitle: string };
  common: { loading: string; error: string; city: string; country: string; price: string; settings: string; language: string };
  regions: { eu: string; cis: string; other: string };
};

export function getTranslation(locale: Locale): TranslationKeys {
  return translations[locale] as TranslationKeys;
}
