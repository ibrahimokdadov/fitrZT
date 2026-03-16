# Zakat al-Fitr Calculator Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (AR/EN) responsive web calculator that computes the total food weight for Zakat al-Fitr based on country, family size, and food type assignments.

**Architecture:** Four static files — `data.js` holds all data and translations, `style.css` holds all styles, `index.html` is the HTML shell (loads scripts), `app.js` holds all UI logic and state. No framework, no build step, no dependencies. The app is fully functional as a local file or on any static host.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+)

**Testing approach:** No test runner — this is a zero-dependency static app. Verification is done via browser console assertions and manual interaction steps documented in each task. Each task includes a "Verify in browser" step with exact console commands and expected outputs.

---

## Chunk 1: Project Scaffold + Data Layer

---

### Task 1: Create project scaffold

**Files:**
- Create: `fitrZT/index.html`
- Create: `fitrZT/style.css`
- Create: `fitrZT/data.js`
- Create: `fitrZT/app.js`

- [ ] **Step 1: Create `index.html` skeleton**

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Zakat al-Fitr Calculator | حاسبة زكاة الفطر</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="app">
    <!-- content injected by JS -->
  </div>
  <script src="data.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

> Note: We also create `app.js` — the main JS logic lives there, not inline in index.html, to keep files focused.

- [ ] **Step 2: Create `style.css` with CSS variables and reset**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #0f1929;
  --surface:   #1a2332;
  --surface2:  #0f1929;
  --border:    #334155;
  --text:      #e2e8f0;
  --muted:     #94a3b8;
  --dimmed:    #475569;
  --blue:      #3b82f6;
  --green:     #10b981;
  --purple:    #8b5cf6;
  --gold:      #fbbf24;
  --gold-text: #fef3c7;
  --red:       #ef4444;
  --radius:    10px;
  --font: -apple-system, "Segoe UI", Arial, sans-serif;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  min-height: 100vh;
  padding: 16px;
}

#app {
  max-width: 480px;
  margin: 0 auto;
}
```

- [ ] **Step 3: Create empty `data.js` with structure stubs**

```js
// data.js — populated in Tasks 2–4
const FOODS = {};
const COUNTRIES = [];
const SCHOLAR_PRESETS = [];
const TRANSLATIONS = { en: {}, ar: {} };
```

- [ ] **Step 4: Create empty `app.js`**

```js
// app.js — populated in Tasks 5+
```

- [ ] **Step 5: Open `index.html` in browser, verify blank dark page loads with no console errors**

- [ ] **Step 6: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" init
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add index.html style.css data.js app.js
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: scaffold project structure"
```

---

### Task 2: Implement `FOODS` data

**Files:**
- Modify: `fitrZT/data.js`

- [ ] **Step 1: Replace `FOODS` stub with full food data**

```js
const FOODS = {
  wheat:    { en: 'Wheat',         ar: 'قمح',  emoji: '🌾', majorityKg: 2.04, hanafiKg: 1.625 },
  barley:   { en: 'Barley',        ar: 'شعير', emoji: '🌾', majorityKg: 2.30, hanafiKg: 3.25  },
  dates:    { en: 'Dates',         ar: 'تمر',  emoji: '🌴', majorityKg: 1.80, hanafiKg: 3.25  },
  raisins:  { en: 'Raisins',       ar: 'زبيب', emoji: '🍇', majorityKg: 1.64, hanafiKg: 1.625 },
  rice:     { en: 'Rice',          ar: 'أرز',  emoji: '🍚', majorityKg: 2.30, hanafiKg: 2.50  },
  flour:    { en: 'Flour (wheat)', ar: 'دقيق', emoji: '🌾', majorityKg: 1.40, hanafiKg: 1.625 },
  semolina: { en: 'Semolina',      ar: 'سميد', emoji: '🌾', majorityKg: 2.50, hanafiKg: 2.50  },
  sorghum:  { en: 'Sorghum',       ar: 'ذرة',  emoji: '🌾', majorityKg: 2.30, hanafiKg: 2.30  },
  millet:   { en: 'Millet',        ar: 'دخن',  emoji: '🌾', majorityKg: 2.20, hanafiKg: 2.20  },
  aqit:     { en: 'Dried Cheese',  ar: 'أقط',  emoji: '🧀', majorityKg: 2.05, hanafiKg: 2.05  },
};
```

- [ ] **Step 2: Verify in browser console**

```js
// Open index.html in browser, open DevTools console, run:
console.assert(FOODS.wheat.majorityKg === 2.04, 'wheat majority');
console.assert(FOODS.wheat.hanafiKg === 1.625, 'wheat hanafi');
console.assert(FOODS.barley.hanafiKg === 3.25, 'barley hanafi');
console.assert(FOODS.dates.hanafiKg === 3.25, 'dates hanafi');
console.assert(Object.keys(FOODS).length === 10, 'food count');
// Expected: no assertion failures
```

- [ ] **Step 3: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add data.js
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: add food types data"
```

---

### Task 3: Implement `COUNTRIES` data

**Files:**
- Modify: `fitrZT/data.js`

- [ ] **Step 1: Replace `COUNTRIES` stub**

```js
const COUNTRIES = [
  { code:'dz', en:'Algeria',      ar:'الجزائر',   primaryFoods:[{key:'semolina',kg:2.50}],                        defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'ma', en:'Morocco',      ar:'المغرب',    primaryFoods:[{key:'semolina',kg:2.50}],                        defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'tn', en:'Tunisia',      ar:'تونس',      primaryFoods:[{key:'wheat',kg:2.50}],                           defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'ly', en:'Libya',        ar:'ليبيا',     primaryFoods:[{key:'wheat',kg:2.25},{key:'rice',kg:2.00}],       defaultKg:2.25, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'eg', en:'Egypt',        ar:'مصر',       primaryFoods:[{key:'wheat',kg:2.04}],                           defaultKg:2.04, madhab:"Shafi'i", madhabAr:'الشافعي'  },
  { code:'sd', en:'Sudan',        ar:'السودان',   primaryFoods:[{key:'wheat',kg:2.50},{key:'sorghum',kg:2.50}],   defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'so', en:'Somalia',      ar:'الصومال',   primaryFoods:[{key:'rice',kg:2.50}],                            defaultKg:2.50, madhab:"Shafi'i", madhabAr:'الشافعي'  },
  { code:'sa', en:'Saudi Arabia', ar:'السعودية',  primaryFoods:[{key:'rice',kg:3.00}],                            defaultKg:3.00, madhab:'Hanbali', madhabAr:'الحنبلي'  },
  { code:'ae', en:'UAE',          ar:'الإمارات',  primaryFoods:[{key:'rice',kg:2.50}],                            defaultKg:2.50, madhab:'Mixed',   madhabAr:'متعدد'    },
  { code:'jo', en:'Jordan',       ar:'الأردن',    primaryFoods:[{key:'wheat',kg:2.50}],                           defaultKg:2.50, madhab:'Mixed',   madhabAr:'متعدد'    },
  { code:'sy', en:'Syria',        ar:'سوريا',     primaryFoods:[{key:'wheat',kg:2.50}],                           defaultKg:2.50, madhab:"Shafi'i", madhabAr:'الشافعي'  },
  { code:'lb', en:'Lebanon',      ar:'لبنان',     primaryFoods:[{key:'wheat',kg:2.50}],                           defaultKg:2.50, madhab:'Mixed',   madhabAr:'متعدد'    },
  { code:'iq', en:'Iraq',         ar:'العراق',    primaryFoods:[{key:'wheat',kg:2.50}],                           defaultKg:2.50, madhab:'Hanafi',  madhabAr:'الحنفي'   },
  { code:'tr', en:'Turkey',       ar:'تركيا',     primaryFoods:[{key:'flour',kg:2.50}],                           defaultKg:2.50, madhab:'Hanafi',  madhabAr:'الحنفي'   },
  { code:'id', en:'Indonesia',    ar:'إندونيسيا', primaryFoods:[{key:'rice',kg:2.50}],                            defaultKg:2.50, madhab:"Shafi'i", madhabAr:'الشافعي'  },
  { code:'my', en:'Malaysia',     ar:'ماليزيا',   primaryFoods:[{key:'rice',kg:2.70}],                            defaultKg:2.70, madhab:"Shafi'i", madhabAr:'الشافعي'  },
  { code:'pk', en:'Pakistan',     ar:'باكستان',   primaryFoods:[{key:'flour',kg:1.75}],                           defaultKg:1.75, madhab:'Hanafi',  madhabAr:'الحنفي'   },
  { code:'in', en:'India',        ar:'الهند',     primaryFoods:[{key:'wheat',kg:2.04}],                           defaultKg:2.04, madhab:'Hanafi',  madhabAr:'الحنفي'   },
  { code:'sn', en:'Senegal',      ar:'السنغال',   primaryFoods:[{key:'rice',kg:2.50},{key:'millet',kg:2.20}],     defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'fr', en:'France',       ar:'فرنسا',     primaryFoods:[{key:'semolina',kg:2.50}],                        defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'us', en:'USA',          ar:'أمريكا',    primaryFoods:[{key:'rice',kg:2.04}],                            defaultKg:2.04, madhab:'Mixed',   madhabAr:'متعدد'    },
  { code:'gb', en:'UK',           ar:'بريطانيا',  primaryFoods:[{key:'rice',kg:2.50}],                            defaultKg:2.50, madhab:'Mixed',   madhabAr:'متعدد'    },
];
```

- [ ] **Step 2: Verify in browser console**

```js
console.assert(COUNTRIES.length === 22, 'country count');
const ly = COUNTRIES.find(c => c.code === 'ly');
console.assert(ly.primaryFoods.length === 2, 'Libya has 2 foods');
console.assert(ly.primaryFoods[0].kg === 2.25, 'Libya wheat kg');
console.assert(ly.primaryFoods[1].kg === 2.00, 'Libya rice kg');
const pk = COUNTRIES.find(c => c.code === 'pk');
console.assert(pk.defaultKg === 1.75, 'Pakistan default kg');
// Expected: no assertion failures
```

- [ ] **Step 3: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add data.js
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: add countries data"
```

---

### Task 4: Implement `SCHOLAR_PRESETS` and `TRANSLATIONS`

**Files:**
- Modify: `fitrZT/data.js`

- [ ] **Step 1: Replace `SCHOLAR_PRESETS` stub**

```js
const SCHOLAR_PRESETS = [
  { key: 'country',      en: 'Country default', ar: 'الافتراضي'       },
  { key: 'maliki_shafii',en: "Maliki / Shafi'i",ar: 'مالكي / شافعي'  },
  { key: 'hanafi',       en: 'Hanafi',          ar: 'حنفي'            },
  { key: 'ibn_baz',      en: 'Ibn Baz / Hanbali',ar: 'ابن باز / حنبلي'},
];
```

- [ ] **Step 2: Replace `TRANSLATIONS` stub**

```js
const TRANSLATIONS = {
  en: {
    appTitle:                  'Zakat al-Fitr Calculator',
    appSubtitle:               'Calculate your Zakat al-Fitr',
    langToggle:                'AR',
    countryPlaceholder:        'Select country',
    step1Label:                'Select Country',
    step2Label:                'Family Members',
    step3Label:                'Food',
    infoBadge:                 'Suggested: {food} · {kg} kg/person · {madhab}',
    personSingular:            'person',
    personPlural:              'persons',
    addFoodBtn:                '+ Add food type',
    removeFoodRow:             'Remove row',
    closePanelBtn:             'Close',
    customFoodTitle:           'Custom food',
    customFoodNamePlaceholder: 'Food name',
    customFoodKgPlaceholder:   'kg per person',
    customFoodConfirm:         'Add',
    customFoodErrorName:       'Please enter a food name.',
    customFoodErrorKg:         'Please enter a valid weight (> 0).',
    assignWarningUnder:        '⚠ {n} {person} not yet assigned',
    assignWarningOver:         '⚠ {n} {person} over-assigned',
    overrideLabel:             'Weight per person:',
    resultTitle:               'Total Zakat al-Fitr',
    resultLine:                '{kg} kg of {food} for {n} {person}',
    resultTotal:               'Total: {kg} kg',
    copyBtn:                   'Copy result',
    copiedBtn:                 'Copied!',
    copyFallbackAlert:         'Copy this text:',
    resetBtn:                  'Reset',
    confirmTitle:              'Change country?',
    confirmBody:               'This will reset your food selection.',
    confirmCancel:             'Cancel',
    confirmReset:              'Reset',
  },
  ar: {
    appTitle:                  'حاسبة زكاة الفطر',
    appSubtitle:               'احسب زكاة الفطر الخاصة بك',
    langToggle:                'EN',
    countryPlaceholder:        'اختر البلد',
    step1Label:                'اختر البلد',
    step2Label:                'عدد أفراد الأسرة',
    step3Label:                'الطعام',
    infoBadge:                 'المقترح: {food} · {kg} كغ/شخص · {madhab}',
    personSingular:            'شخص',
    personPlural:              'أشخاص',
    addFoodBtn:                '+ إضافة نوع آخر',
    removeFoodRow:             'حذف الصف',
    closePanelBtn:             'إغلاق',
    customFoodTitle:           'طعام مخصص',
    customFoodNamePlaceholder: 'اسم الطعام',
    customFoodKgPlaceholder:   'كغ/شخص',
    customFoodConfirm:         'إضافة',
    customFoodErrorName:       'الرجاء إدخال اسم الطعام.',
    customFoodErrorKg:         'الرجاء إدخال وزن صحيح (> 0).',
    assignWarningUnder:        '⚠ {n} {person} لم يتم تعيينهم بعد',
    assignWarningOver:         '⚠ تم تعيين {n} {person} زيادة',
    overrideLabel:             'الوزن لكل شخص:',
    resultTitle:               'إجمالي زكاة الفطر',
    resultLine:                '{kg} كغ من {food} لـ {n} {person}',
    resultTotal:               'المجموع: {kg} كغ',
    copyBtn:                   'نسخ النتيجة',
    copiedBtn:                 'تم النسخ!',
    copyFallbackAlert:         'انسخ هذا النص:',
    resetBtn:                  'إعادة تعيين',
    confirmTitle:              'تغيير البلد؟',
    confirmBody:               'سيتم إعادة تعيين اختيار الطعام.',
    confirmCancel:             'إلغاء',
    confirmReset:              'إعادة تعيين',
  },
};
```

- [ ] **Step 3: Verify in browser console**

```js
console.assert(SCHOLAR_PRESETS.length === 4, 'preset count');
console.assert(TRANSLATIONS.en.appTitle === 'Zakat al-Fitr Calculator', 'EN title');
console.assert(TRANSLATIONS.ar.appTitle === 'حاسبة زكاة الفطر', 'AR title');
console.assert(TRANSLATIONS.en.langToggle === 'AR', 'EN toggle shows AR');
console.assert(TRANSLATIONS.ar.langToggle === 'EN', 'AR toggle shows EN');
// Expected: no assertion failures
```

- [ ] **Step 4: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add data.js
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: add scholar presets and translations"
```

---

## Chunk 2: App State + Country & Family Size UI

---

### Task 5: App state management and utility functions

**Files:**
- Modify: `fitrZT/app.js`

- [ ] **Step 1: Add state object and utility functions to `app.js`**

```js
// ── State ──────────────────────────────────────────────────────────────────
const state = {
  lang: (navigator.language || '').startsWith('ar') ? 'ar' : 'en',
  country: null,       // COUNTRIES entry or null
  familySize: 1,
  foodRows: [],        // [{ foodKey, name, isCustom, countryKg, persons }]
  scholarChip: 'country',
  foodPanelOpen: false,
  rowsModified: false, // true once user modifies pre-filled rows
};

// ── Translation helper ──────────────────────────────────────────────────────
function t(key, vars = {}) {
  let str = TRANSLATIONS[state.lang][key] || TRANSLATIONS.en[key] || key;
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replaceAll(`{${k}}`, v);
  });
  return str;
}

// ── Person label helper (singular/plural) ───────────────────────────────────
function personLabel(n) {
  return n === 1 ? t('personSingular') : t('personPlural');
}

// ── Number formatting (Eastern Arabic numerals in AR mode) ──────────────────
// Pass already-formatted strings (e.g. n.toFixed(2)) for decimal display.
// Pass integers directly for person counts.
function fmt(n) {
  if (state.lang === 'ar') {
    return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  }
  return String(n);
}
// ⚠ Important: always call fmt(value.toFixed(2)) for kg amounts at call sites,
// not fmt(value), to preserve trailing zeros (e.g. 2.30 not 2.3).

// ── Round to 2 decimal places ───────────────────────────────────────────────
function round2(n) {
  return Math.round(n * 100) / 100;
}

// ── Get effective kg for a food row given active scholar chip ───────────────
function effectiveKg(row) {
  if (row.isCustom) return row.countryKg; // custom always uses user-entered kg
  const food = FOODS[row.foodKey];
  switch (state.scholarChip) {
    case 'country':       return row.countryKg;
    case 'maliki_shafii': return food.majorityKg;
    case 'hanafi':        return food.hanafiKg;
    case 'ibn_baz':       return 3.0;
    default:              return row.countryKg;
  }
}

// ── Total assigned persons ──────────────────────────────────────────────────
function totalAssigned() {
  return state.foodRows.reduce((sum, r) => sum + r.persons, 0);
}

// ── Sort countries alphabetically in active language ────────────────────────
function sortedCountries() {
  return [...COUNTRIES].sort((a, b) =>
    (state.lang === 'ar' ? a.ar : a.en).localeCompare(
      state.lang === 'ar' ? b.ar : b.en,
      state.lang === 'ar' ? 'ar' : 'en'
    )
  );
}
```

- [ ] **Step 2: Verify in browser console**

```js
// Reload page, then:
state.lang = 'ar';
console.assert(t('appTitle') === 'حاسبة زكاة الفطر', 'AR title');
console.assert(fmt(42) === '٤٢', 'AR numerals');
state.lang = 'en';
console.assert(t('assignWarningUnder', {n:3, person:'persons'}) === '⚠ 3 persons not yet assigned', 'template');
console.assert(round2(2.3333) === 2.33, 'round2');

const mockRow = { foodKey:'wheat', isCustom:false, countryKg:2.5, persons:1 };
state.scholarChip = 'hanafi';
console.assert(effectiveKg(mockRow) === 1.625, 'hanafi wheat kg');
state.scholarChip = 'ibn_baz';
console.assert(effectiveKg(mockRow) === 3.0, 'ibn_baz kg');
state.scholarChip = 'country';
// Expected: no assertion failures
```

- [ ] **Step 3: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add app.js
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: add app state and utility functions"
```

---

### Task 6: Render skeleton + header + language toggle

**Files:**
- Modify: `fitrZT/app.js`
- Modify: `fitrZT/style.css`

- [ ] **Step 1: Add `render()` function and header to `app.js`**

```js
// ── Render ──────────────────────────────────────────────────────────────────
function render() {
  const app = document.getElementById('app');
  document.documentElement.lang = state.lang;
  document.documentElement.dir  = state.lang === 'ar' ? 'rtl' : 'ltr';

  app.innerHTML = `
    <header class="app-header">
      <div class="app-title-group">
        <h1 class="app-title">${t('appTitle')}</h1>
        <p class="app-subtitle">${t('appSubtitle')}</p>
      </div>
      <button class="lang-btn" onclick="toggleLang()" aria-label="Switch language">
        ${t('langToggle')}
      </button>
    </header>

    <main>
      ${renderStep1()}
      ${state.country ? renderStep2() : ''}
      ${state.country ? renderStep3() : ''}
      ${state.country && totalAssigned() === state.familySize ? renderResult() : ''}
    </main>
  `;
}

function toggleLang() {
  state.lang = state.lang === 'en' ? 'ar' : 'en';
  render();
}

// Stub renderers — filled in subsequent tasks
function renderStep1() { return '<section class="step-card step-blue"><p>Step 1</p></section>'; }
function renderStep2() { return '<section class="step-card step-green"><p>Step 2</p></section>'; }
function renderStep3() { return '<section class="step-card step-purple"><p>Step 3</p></section>'; }
function renderResult() { return '<section class="step-card step-gold"><p>Result</p></section>'; }

// Boot
render();
```

- [ ] **Step 2: Add header and step card styles to `style.css`**

```css
/* Header */
.app-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}
.app-title { font-size: 1.25rem; font-weight: 700; color: var(--text); }
.app-subtitle { font-size: 0.85rem; color: var(--muted); margin-top: 2px; }
.lang-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  flex-shrink: 0;
}
.lang-btn:hover { border-color: var(--blue); color: var(--blue); }

/* Step cards */
.step-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 16px;
  border: 2px solid var(--border);
}
.step-blue   { border-color: var(--blue);   }
.step-green  { border-color: var(--green);  }
.step-purple { border-color: var(--purple); }
.step-gold   { border-color: var(--gold);   }

.step-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.step-number {
  width: 30px; height: 30px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.9rem;
  flex-shrink: 0;
  color: #fff;
}
.step-blue   .step-number { background: var(--blue);   }
.step-green  .step-number { background: var(--green);  }
.step-purple .step-number { background: var(--purple); }
.step-gold   .step-number { background: var(--gold); color: #000; }
.step-label { font-size: 1rem; font-weight: 600; }
```

- [ ] **Step 3: Open in browser — verify header shows "Zakat al-Fitr Calculator", language button shows "AR". Click button — page flips to RTL, title becomes Arabic, button shows "EN". Click again — reverts.**

- [ ] **Step 4: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add app.js style.css
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: add render loop, header, and language toggle"
```

---

### Task 7: Step 1 — Country selection

**Files:**
- Modify: `fitrZT/app.js`
- Modify: `fitrZT/style.css`

- [ ] **Step 1: Replace `renderStep1()` stub**

```js
function renderStep1() {
  const countries = sortedCountries();
  const selectedCode = state.country ? state.country.code : '';
  const options = countries.map(c =>
    `<option value="${c.code}" ${c.code === selectedCode ? 'selected' : ''}>
      ${state.lang === 'ar' ? c.ar : c.en}
    </option>`
  ).join('');

  const badge = state.country ? (() => {
    const pf = state.country.primaryFoods[0];
    const food = FOODS[pf.key];
    const foodName = state.lang === 'ar' ? food.ar : food.en;
    const madhab = state.lang === 'ar' ? state.country.madhabAr : state.country.madhab;
    return `<div class="info-badge">
      ${t('infoBadge', { food: foodName, kg: fmt(pf.kg.toFixed(2)), madhab })}
    </div>`;
  })() : '';

  return `
    <section class="step-card step-blue">
      <div class="step-heading">
        <div class="step-number">1</div>
        <span class="step-label">${t('step1Label')}</span>
      </div>
      <select class="country-select" onchange="onCountryChange(this.value)"
              aria-label="${t('step1Label')}">
        <option value="" disabled ${!selectedCode ? 'selected' : ''}>
          ${t('countryPlaceholder')}
        </option>
        ${options}
      </select>
      ${badge}
    </section>`;
}

function onCountryChange(code) {
  const newCountry = COUNTRIES.find(c => c.code === code);
  if (state.country && state.rowsModified) {
    if (!confirm(`${t('confirmTitle')}\n${t('confirmBody')}`)) return;
  }
  state.country = newCountry;
  state.rowsModified = false;
  state.scholarChip = 'country';
  prefillFoodRows();
  render();
}

function prefillFoodRows() {
  const pf = state.country.primaryFoods;
  const total = state.familySize;
  const perRow = Math.floor(total / pf.length);
  const remainder = total % pf.length;
  state.foodRows = pf.map((f, i) => ({
    foodKey: f.key,
    name: '',           // resolved from FOODS at render time
    isCustom: false,
    countryKg: f.kg,
    persons: perRow + (i === pf.length - 1 ? remainder : 0),
  }));
}
```

- [ ] **Step 2: Add country select styles to `style.css`**

```css
.country-select {
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}
.country-select:focus { outline: 2px solid var(--blue); }

.info-badge {
  margin-top: 10px;
  background: #0f3460;
  border-radius: 8px;
  padding: 10px 14px;
  color: #93c5fd;
  font-size: 0.85rem;
}
```

- [ ] **Step 3: Verify in browser**
  - Page loads with only Step 1 (country dropdown) visible
  - Select "Algeria" → info badge appears: "Suggested: Semolina · 2.50 kg/person · Maliki"
  - Switch to AR → badge shows Arabic text, dropdown shows Arabic country names
  - Select Libya in AR mode → info badge shows Arabic text for wheat (القمح)

- [ ] **Step 4: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add app.js style.css
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: add country selection step"
```

---

### Task 8: Step 2 — Family size counter

**Files:**
- Modify: `fitrZT/app.js`
- Modify: `fitrZT/style.css`

- [ ] **Step 1: Replace `renderStep2()` stub**

```js
function renderStep2() {
  const n = state.familySize;
  return `
    <section class="step-card step-green">
      <div class="step-heading">
        <div class="step-number">2</div>
        <span class="step-label">${t('step2Label')}</span>
      </div>
      <div class="counter-row">
        <button class="counter-btn" onclick="changeFamily(-1)"
                ${n <= 1 ? 'disabled' : ''}
                aria-label="Decrease family size">−</button>
        <input class="counter-input" type="number" value="${n}" min="1" max="99"
               onblur="onFamilyInputBlur(this.value)"
               aria-label="${t('step2Label')}" />
        <button class="counter-btn" onclick="changeFamily(1)"
                ${n >= 99 ? 'disabled' : ''}
                aria-label="Increase family size">+</button>
      </div>
    </section>`;
}

function changeFamily(delta) {
  const next = state.familySize + delta;
  if (next < 1 || next > 99) return;
  state.familySize = next;
  redistributePersons();
  render();
}

function onFamilyInputBlur(raw) {
  const n = parseInt(raw, 10);
  state.familySize = isNaN(n) || n < 1 ? 1 : n > 99 ? 99 : n;
  redistributePersons();
  render();
}

// Redistribute persons evenly when family SIZE changes (not when row counts change).
// This is only called from changeFamily() and onFamilyInputBlur() — never from
// row person-count interactions. Spec says "no silent auto-correction of other rows"
// on row +/− interactions; this redistribution is a separate, user-initiated action
// (changing the family size) and is explicitly acceptable.
function redistributePersons() {
  if (!state.foodRows.length) return;
  const total = state.familySize;
  const perRow = Math.floor(total / state.foodRows.length);
  const remainder = total % state.foodRows.length;
  state.foodRows.forEach((r, i) => {
    r.persons = perRow + (i === state.foodRows.length - 1 ? remainder : 0);
  });
}
```

- [ ] **Step 2: Add counter styles to `style.css`**

```css
.counter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}
.counter-btn {
  background: #1e3a2f;
  border: 1px solid var(--green);
  color: var(--green);
  width: 44px; height: 44px;
  border-radius: 8px;
  font-size: 1.4rem;
  cursor: pointer;
  line-height: 1;
}
.counter-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.counter-btn:not(:disabled):hover { background: #2a4a3f; }
.counter-input {
  background: var(--surface2);
  border: 1px solid var(--green);
  color: #34d399;
  font-size: 1.8rem;
  font-weight: 700;
  width: 80px;
  text-align: center;
  border-radius: 8px;
  padding: 8px 4px;
}
.counter-input::-webkit-inner-spin-button,
.counter-input::-webkit-outer-spin-button { -webkit-appearance: none; }
.counter-input:focus { outline: 2px solid var(--green); }
```

- [ ] **Step 3: Verify in browser**
  - Select Algeria → Steps 1 and 2 visible, Step 3 visible (pre-filled from country)
  - Counter starts at 1, − disabled
  - Click + three times → shows 4
  - Click − → shows 3
  - At 99, + is disabled
  - Type "abc" in field, click away → reverts to last valid value
  - Type "200", click away → snaps to 99

- [ ] **Step 4: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add app.js style.css
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: add family size counter"
```

---

## Chunk 3: Food Rows, Scholar Chips, Result, and Polish

---

### Task 9: Step 3 — Food rows

**Files:**
- Modify: `fitrZT/app.js`
- Modify: `fitrZT/style.css`

- [ ] **Step 1: Replace `renderStep3()` stub**

```js
function renderStep3() {
  const assigned = totalAssigned();
  const diff = assigned - state.familySize;
  const isSingle = state.familySize === 1;

  const rows = state.foodRows.map((row, i) => {
    const food = row.isCustom ? null : FOODS[row.foodKey];
    const name = row.isCustom
      ? row.name
      : (state.lang === 'ar' ? food.ar : food.en);
    const emoji = row.isCustom ? '🍽' : food.emoji;
    const kg = effectiveKg(row);
    const subtotal = round2(kg * row.persons);
    const remaining = state.familySize - assigned + row.persons;
    const plusDisabled = row.persons >= remaining;
    const minusDisabled = row.persons <= 0;

    const kgDisplay = row.isCustom
      ? `<input class="kg-inline-input" type="number" step="0.01" min="0.01"
               value="${row.countryKg}"
               onblur="onCustomKgBlur(${i}, this.value)"
               aria-label="kg per person" /> ${state.lang==='ar'?'كغ':'kg'}`
      : `${fmt(kg.toFixed(2))} ${state.lang==='ar'?'كغ':'kg'}`;

    return `
      <div class="food-row">
        <div class="food-row-info">
          <span class="food-emoji">${emoji}</span>
          <span class="food-name">${name}</span>
          <span class="food-kg">${kgDisplay}</span>
        </div>
        <div class="food-row-controls">
          ${isSingle ? '' : `
            <button class="counter-btn sm" onclick="changeRowPersons(${i},-1)"
                    ${minusDisabled?'disabled':''}
                    aria-label="${t('removeFoodRow')}">−</button>
            <span class="row-persons">${fmt(row.persons)}</span>
            <button class="counter-btn sm" onclick="changeRowPersons(${i},1)"
                    ${plusDisabled?'disabled':''}
                    aria-label="Add person">+</button>
          `}
          <span class="row-subtotal">${fmt(subtotal.toFixed(2))} ${state.lang==='ar'?'كغ':'kg'}</span>
          <button class="remove-row-btn" onclick="removeRow(${i})"
                  aria-label="${t('removeFoodRow')}">✕</button>
        </div>
      </div>`;
  }).join('');

  const warningHtml = diff !== 0 ? `
    <div class="assign-warning">
      ${diff < 0
        ? t('assignWarningUnder', { n: fmt(Math.abs(diff)), person: personLabel(Math.abs(diff)) })
        : t('assignWarningOver',  { n: fmt(diff),           person: personLabel(diff) })}
    </div>` : '';

  const addBtnDisabled = assigned >= state.familySize || isSingle;

  return `
    <section class="step-card step-purple">
      <div class="step-heading">
        <div class="step-number">3</div>
        <span class="step-label">${t('step3Label')}</span>
      </div>
      ${rows}
      ${warningHtml}
      <button class="add-food-btn" onclick="toggleFoodPanel()"
              ${addBtnDisabled ? 'disabled' : ''}>
        ${t('addFoodBtn')}
      </button>
      ${state.foodPanelOpen ? renderFoodPanel() : ''}
    </section>`;
}

function changeRowPersons(i, delta) {
  const row = state.foodRows[i];
  const assigned = totalAssigned();
  const next = row.persons + delta;
  if (next < 0) return;
  if (delta > 0 && assigned >= state.familySize) return;
  row.persons = next;
  state.rowsModified = true;
  render();
}

function removeRow(i) {
  state.foodRows.splice(i, 1);
  state.rowsModified = true;
  // When all rows are deleted, open the food panel automatically.
  // ⚠ Edge case: if familySize === 1 (isSingle), the add-food button is disabled,
  // so we open the panel directly here even for single-member families.
  if (state.foodRows.length === 0) state.foodPanelOpen = true;
  render();
}

function onCustomKgBlur(i, raw) {
  const v = parseFloat(raw);
  if (!isNaN(v) && v > 0) {
    state.foodRows[i].countryKg = v;
    render();
  }
}
```

- [ ] **Step 2: Add food row styles to `style.css`**

```css
.food-row {
  background: var(--surface2);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.food-row-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}
.food-emoji { font-size: 1.2rem; flex-shrink: 0; }
.food-name  { font-size: 0.9rem; color: var(--text); white-space: nowrap; }
.food-kg    { font-size: 0.8rem; color: var(--muted); margin-inline-start: 4px; }
.food-row-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.row-persons { font-weight: 700; min-width: 20px; text-align: center; }
.row-subtotal { font-size: 0.85rem; font-weight: 700; color: #34d399; }
.remove-row-btn {
  background: none;
  border: none;
  color: var(--dimmed);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 2px 6px;
  border-radius: 4px;
}
.remove-row-btn:hover { color: var(--red); }
.counter-btn.sm { width: 28px; height: 28px; font-size: 1rem; }

.assign-warning {
  background: #3a1a00;
  border: 1px solid var(--gold);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--gold);
  font-size: 0.85rem;
  margin-top: 8px;
}

.add-food-btn {
  margin-top: 10px;
  width: 100%;
  background: none;
  border: 1px dashed var(--border);
  color: var(--muted);
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}
.add-food-btn:not(:disabled):hover { border-color: var(--purple); color: var(--purple); }
.add-food-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.kg-inline-input {
  width: 56px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.8rem;
}
```

- [ ] **Step 3: Verify in browser**
  - Select Algeria (family 1) → one semolina row, person count hidden, subtotal = 2.50 kg
  - Increase family to 4 → person count shows, all 4 assigned to semolina, subtotal = 10.00 kg
  - Select Libya (family 4) → two rows: wheat (2 persons, 4.50 kg) and rice (2 persons, 4.00 kg)
  - Remove wheat row → warning badge "⚠ 2 persons not yet assigned", add-food panel opens
  - In AR mode → numbers show as Eastern Arabic, labels in Arabic

- [ ] **Step 4: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add app.js style.css
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: add food rows with person counters"
```

---

### Task 10: Food picker panel + custom food entry

**Files:**
- Modify: `fitrZT/app.js`
- Modify: `fitrZT/style.css`

- [ ] **Step 1: Add `renderFoodPanel()` and `toggleFoodPanel()` / `addBuiltinFood()` to `app.js`**

```js
function toggleFoodPanel() {
  state.foodPanelOpen = !state.foodPanelOpen;
  render();
}

function renderFoodPanel() {
  const foodKeys = Object.keys(FOODS);
  const grid = foodKeys.map(key => {
    const food = FOODS[key];
    const name = state.lang === 'ar' ? food.ar : food.en;
    return `
      <button class="food-picker-item" onclick="addBuiltinFood('${key}')">
        <span>${food.emoji}</span>
        <span>${name}</span>
      </button>`;
  }).join('');

  return `
    <div class="food-panel">
      <div class="food-panel-header">
        <span></span>
        <button class="close-panel-btn" onclick="toggleFoodPanel()"
                aria-label="${t('closePanelBtn')}">✕</button>
      </div>
      <div class="food-picker-grid">${grid}</div>
      <div class="custom-food-form">
        <p class="custom-food-title">${t('customFoodTitle')}</p>
        <input id="customFoodName" type="text" class="custom-input"
               placeholder="${t('customFoodNamePlaceholder')}" />
        <span id="customFoodNameErr" class="field-error" hidden></span>
        <input id="customFoodKg" type="number" step="0.01" min="0.01" class="custom-input"
               placeholder="${t('customFoodKgPlaceholder')}" />
        <span id="customFoodKgErr" class="field-error" hidden></span>
        <button class="add-custom-btn" onclick="addCustomFood()">
          ${t('customFoodConfirm')}
        </button>
      </div>
    </div>`;
}

function addBuiltinFood(key) {
  const food = FOODS[key];
  state.foodRows.push({
    foodKey: key,
    name: '',
    isCustom: false,
    countryKg: food.majorityKg,
    persons: 0,
  });
  state.foodPanelOpen = false;
  state.rowsModified = true;
  render();
}

function addCustomFood() {
  const nameEl = document.getElementById('customFoodName');
  const kgEl   = document.getElementById('customFoodKg');
  const nameErr = document.getElementById('customFoodNameErr');
  const kgErr   = document.getElementById('customFoodKgErr');
  let valid = true;

  nameErr.hidden = true;
  kgErr.hidden   = true;

  if (!nameEl.value.trim()) {
    nameErr.textContent = t('customFoodErrorName');
    nameErr.hidden = false;
    valid = false;
  }
  const kg = parseFloat(kgEl.value);
  if (isNaN(kg) || kg <= 0) {
    kgErr.textContent = t('customFoodErrorKg');
    kgErr.hidden = false;
    valid = false;
  }
  if (!valid) return;

  state.foodRows.push({
    foodKey: null,
    name: nameEl.value.trim(),
    isCustom: true,
    countryKg: kg,
    persons: 0,
  });
  state.foodPanelOpen = false;
  state.rowsModified = true;
  render();
}
```

- [ ] **Step 2: Add food panel styles to `style.css`**

```css
.food-panel {
  margin-top: 10px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
}
.food-panel-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.close-panel-btn {
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 1rem;
  padding: 2px 6px;
}
.close-panel-btn:hover { color: var(--text); }

.food-picker-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}
@media (max-width: 319px) {
  .food-picker-grid { grid-template-columns: 1fr; }
}
.food-picker-item {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
}
.food-picker-item:hover { border-color: var(--purple); color: var(--purple); }

.custom-food-form { border-top: 1px solid var(--border); padding-top: 12px; }
.custom-food-title { font-size: 0.85rem; color: var(--muted); margin-bottom: 8px; }
.custom-input {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  margin-bottom: 4px;
}
.custom-input:focus { outline: 2px solid var(--purple); }
.field-error { color: var(--red); font-size: 0.8rem; display: block; margin-bottom: 6px; }
.add-custom-btn {
  margin-top: 6px;
  background: var(--purple);
  border: none;
  color: #fff;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}
.add-custom-btn:hover { opacity: 0.85; }
```

- [ ] **Step 3: Verify in browser**
  - With Algeria (family 4) and semolina row assigned, click "+ Add food type" → panel opens
  - First reduce semolina persons to 3 using the − button on that row (freeing 1 unassigned person, which enables the add-food button)
  - Click "+ Add food type" → panel opens
  - Click "Dates" → adds dates row with 0 persons; warning shows "⚠ 1 person not yet assigned"
  - Assign 2 persons to dates, reduce semolina to 2 → warning disappears, result appears
  - Click "+ Add food type" again → click ✕ → panel closes
  - Custom food: leave name blank, click Add → error shown; enter name "Corn" kg "2.1" → adds row
  - Custom food: enter kg "-1" → error shown

- [ ] **Step 4: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add app.js style.css
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: add food picker panel and custom food entry"
```

---

### Task 11: Scholar weight chips

**Files:**
- Modify: `fitrZT/app.js`
- Modify: `fitrZT/style.css`

- [ ] **Step 1: Update `renderResult()` to include scholar chips and result**

```js
function renderResult() {
  const chips = SCHOLAR_PRESETS.map(p => `
    <button class="chip ${state.scholarChip === p.key ? 'chip-active' : ''}"
            onclick="selectChip('${p.key}')">
      ${state.lang === 'ar' ? p.ar : p.en}
    </button>`).join('');

  const lines = state.foodRows.map(row => {
    const food = row.isCustom ? null : FOODS[row.foodKey];
    const name = row.isCustom
      ? row.name
      : (state.lang === 'ar' ? food.ar : food.en);
    const kg = round2(effectiveKg(row) * row.persons);
    return `<div class="result-line">
      ${t('resultLine', { kg: fmt(kg.toFixed(2)), food: name, n: fmt(row.persons), person: personLabel(row.persons) })}
    </div>`;
  }).join('');

  const total = round2(state.foodRows.reduce((s, r) => s + effectiveKg(r) * r.persons, 0));

  // copyText is built on-demand in copyResult() — not needed at render time

  return `
    <section class="step-card step-gold">
      <div class="result-total-label">${t('resultTitle')}</div>
      <div class="result-total-kg">${fmt(total.toFixed(2))} ${state.lang==='ar'?'كغ':'kg'}</div>
      ${lines}
      <div class="override-label">${t('overrideLabel')}</div>
      <div class="chip-row">${chips}</div>
      <div class="result-actions">
        <button class="result-btn copy-btn" id="copyBtn" onclick="copyResult()">
          ${t('copyBtn')}
        </button>
        <button class="result-btn reset-btn" onclick="resetAll()">
          ${t('resetBtn')}
        </button>
      </div>
    </section>`;
}

function selectChip(key) {
  state.scholarChip = key;
  render();
}

function buildCopyText() {
  const countryName = state.lang === 'ar' ? state.country.ar : state.country.en;
  const lines = state.foodRows.map(row => {
    const food = row.isCustom ? null : FOODS[row.foodKey];
    const name = row.isCustom ? row.name : (state.lang==='ar' ? food.ar : food.en);
    const kg = round2(effectiveKg(row) * row.persons);
    const nStr = fmt(row.persons);
    const person = personLabel(row.persons);
    return state.lang === 'ar'
      ? `${name}: ${fmt(kg.toFixed(2))} كغ (${nStr} ${person})`
      : `${name}: ${kg.toFixed(2)} kg (${nStr} ${person})`;
  }).join('\n');

  const total = round2(state.foodRows.reduce((s,r) => s + effectiveKg(r)*r.persons, 0));
  const totalStr = state.lang==='ar'
    ? `المجموع: ${fmt(total.toFixed(2))} كغ`
    : `Total: ${total.toFixed(2)} kg`;

  const header = state.lang==='ar'
    ? `زكاة الفطر — ${countryName}\n${fmt(state.familySize)} ${personLabel(state.familySize)}`
    : `Zakat al-Fitr — ${countryName}\n${state.familySize} ${personLabel(state.familySize)}`;

  return `${header}\n${lines}\n${totalStr}`;
}

async function copyResult() {
  const text = buildCopyText();
  const btn = document.getElementById('copyBtn');
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = t('copiedBtn');
    setTimeout(() => { btn.textContent = t('copyBtn'); }, 2000);
  } catch {
    alert(`${t('copyFallbackAlert')}\n\n${text}`);
  }
}

function resetAll() {
  state.country = null;
  state.familySize = 1;
  state.foodRows = [];
  state.scholarChip = 'country';
  state.foodPanelOpen = false;
  state.rowsModified = false;
  render();
}
```

- [ ] **Step 2: Add result + chip styles to `style.css`**

```css
.result-total-label {
  font-size: 0.85rem;
  color: var(--gold);
  text-align: center;
  margin-bottom: 4px;
}
.result-total-kg {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--gold-text);
  text-align: center;
  margin-bottom: 12px;
}
.result-line {
  font-size: 0.9rem;
  color: var(--muted);
  padding: 4px 0;
  border-bottom: 1px solid var(--border);
}
.result-line:last-of-type { border-bottom: none; }
.override-label {
  font-size: 0.8rem;
  color: var(--dimmed);
  margin: 12px 0 6px;
}
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}
.chip {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--muted);
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 0.8rem;
  cursor: pointer;
}
.chip:hover { border-color: var(--gold); color: var(--gold); }
.chip-active {
  background: #1e3a1a;
  border-color: var(--gold);
  color: var(--gold);
}
.result-actions { display: flex; gap: 10px; }
.result-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
}
.copy-btn  { background: var(--gold);  color: #000; font-weight: 600; }
.copy-btn:hover { opacity: 0.85; }
.reset-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); }
.reset-btn:hover { border-color: var(--red); color: var(--red); }
```

- [ ] **Step 3: Verify in browser**
  - Select Algeria, family 4, all 4 persons on semolina → result appears: "10.00 kg"
  - Click "Maliki / Shafi'i" chip → kg stays 10.00 (semolina majorityKg = 2.50, same)
  - Reduce semolina to 2 (freeing 2 unassigned persons), then click "+ Add food type" → add wheat row (0 persons); assign 2 persons to wheat → result: "5.00 kg semolina + 4.08 kg wheat = 9.08 kg"
  - Click "Hanafi" chip → wheat row changes to 1.625 kg → total 5.00 + 3.25 = 8.25 kg
  - Click "Ibn Baz" chip → all rows use 3.0 kg → total = 12.00 kg
  - Click Copy → "Copied!" appears for 2 seconds
  - Click Reset → page returns to initial blank state
  - In AR mode → all text in Arabic, numbers in Eastern Arabic

- [ ] **Step 4: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add app.js style.css
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: add scholar chips, result display, copy and reset"
```

---

### Task 12: Country change confirmation + `.gitignore`

**Files:**
- Modify: `fitrZT/app.js`
- Create: `fitrZT/.gitignore`

- [ ] **Step 1: Ensure `onCountryChange` uses native `confirm()` correctly (already implemented in Task 7 — verify it works)**

In browser:
1. Select Algeria, increase family to 4, add a dates row (modify rows)
2. Change country to Egypt in the dropdown
3. Confirm dialog appears with "Change country?" text → click Cancel → Algeria stays
4. Change country again → click Reset → Egypt is selected, rows reset to wheat pre-fill

- [ ] **Step 2: Create `.gitignore`**

```
.superpowers/
```

- [ ] **Step 3: Commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add .gitignore
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "chore: add gitignore"
```

---

### Task 13: Accessibility and responsive polish

**Files:**
- Modify: `fitrZT/style.css`
- Modify: `fitrZT/index.html`

- [ ] **Step 1: Add focus ring styles and mobile spacing to `style.css`**

```css
/* Focus rings */
*:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
}
button:focus-visible { outline-color: var(--purple); }

/* Smooth language direction transition */
html { transition: none; } /* No transition on dir flip — avoid layout flash */

/* Mobile bottom padding so result isn't clipped */
main { padding-bottom: 40px; }

/* RTL number alignment fix */
[dir="rtl"] .counter-input,
[dir="rtl"] .kg-inline-input { direction: ltr; }

/* Chip wrap on small screens */
@media (max-width: 360px) {
  .chip { font-size: 0.75rem; padding: 4px 8px; }
  .result-total-kg { font-size: 2.2rem; }
}
```

- [ ] **Step 2: Add meta tags to `index.html` `<head>`**

```html
<meta name="theme-color" content="#0f1929" />
<meta name="description"
      content="Zakat al-Fitr calculator — bilingual Arabic/English" />
```

- [ ] **Step 3: Keyboard navigation test**
  - Tab through: language button → country dropdown → family −/+ → food row controls → chips → copy/reset
  - All interactive elements receive visible focus ring
  - Arrow keys work on `<select>` dropdown

- [ ] **Step 4: Verify RTL correctness in AR mode**
  - Step numbers appear on the right in RTL
  - Counter −/+ buttons are correctly mirrored (− on the right, + on the left in RTL)
  - Food row controls align to the left side in RTL
  - Result chip row wraps correctly

- [ ] **Step 5: Final commit**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add style.css index.html
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "feat: accessibility and responsive polish"
```

---

### Task 14: End-to-end smoke test

**Files:** none

- [ ] **Step 1: Full EN flow**
  1. Open `index.html` — dark page, language button shows "AR"
  2. Select "Malaysia" → info badge: "Suggested: Rice · 2.70 kg/person · Shafi'i"
  3. Increase family to 5
  4. One rice row (5 persons, 13.50 kg) → result shows 13.50 kg
  5. Click "Ibn Baz / Hanbali" chip → result becomes 15.00 kg (5 × 3.0)
  6. Click "Country default" → back to 13.50 kg
  7. Reduce rice-1 persons to 3 (freeing 2 unassigned), then click "+ Add food type" → add another rice row → warning shows "⚠ 2 persons not yet assigned", result hidden
  8. Set rice-2 persons to 2, rice-1 to 3 → total 5, result shows 13.50 kg
  9. Click Copy → clipboard contains English-format text
  10. Click Reset → blank initial state

- [ ] **Step 2: Full AR flow**
  1. Click "AR" → page flips RTL, all labels in Arabic
  2. Select "السعودية" → badge shows Arabic
  3. Family 3 → result: ٩٫٠٠ كغ (Eastern Arabic numerals)
  4. Click "حنفي" chip → rice hanafiKg = 2.50, result: ٧٫٥٠ كغ
  5. Click "نسخ النتيجة" → clipboard contains Arabic-format text

- [ ] **Step 3: Final commit if any fixes made**

```bash
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" add app.js style.css index.html
git -C "/c/Users/ibrah/cascadeProjects/fitrZT" commit -m "fix: smoke test corrections"
```
