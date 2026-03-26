# Scholarly Sources & Options Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface multiple scholarly opinions with citations at every relevant decision point in the Zakat al-Fitr calculator.

**Architecture:** All changes are in the three existing files (`data.js`, `app.js`, `style.css`). No new files. `data.js` gains source/dispute/quote fields on existing objects plus a new `QUOTES` constant. `app.js` gains an `openQuoteKey` state field, a `renderQuotePanel()` helper, an `openQuote()` handler, and per-section rendering enhancements. Scholar chips move from `renderResult()` to `renderStep1()`. `style.css` gets new component classes.

**Tech Stack:** Vanilla JS, HTML, CSS. No build step. Open `public/index.html` directly in a browser to test. All changes are in `public/`.

---

## File Map

| File | What changes |
|---|---|
| `public/data.js` | Add `source_en/ar`, `dispute` to every FOOD; add `sa_kg`, `source_en/ar`, `quote_en/ar`, `ref_en/ar` to every SCHOLAR_PRESET; add `QUOTES` constant; add 6 new TRANSLATION keys |
| `public/app.js` | Add `openQuoteKey` to state; add `getQuote()`, `openQuote()`, `renderQuotePanel()`; enrich `renderStep1()` with scholar selector; enrich `renderStep3()` rows + picker; enrich `renderResult()` with basis line; update `buildCopyText()`; remove chips + override label from `renderResult()` |
| `public/style.css` | Add styles for: `.cite-tag`, `.quote-panel`, `.scholar-selector`, `.scholar-chip-wrap`, `.chip-kg`, `.dispute-badge`, `.food-source-label`, `.basis-line` |

---

## Task 1 — Enrich FOODS with source and dispute fields

**Files:**
- Modify: `public/data.js` — FOODS constant (lines 2–13)

- [ ] **Step 1: Replace the FOODS constant** with the enriched version below. Every food gets `source_en`, `source_ar`, and `dispute` (null or an object). Only `flour` has a non-null dispute.

```js
const FOODS = {
  wheat: {
    en: 'Wheat', ar: 'قمح', emoji: '🌾', majorityKg: 2.04, hanafiKg: 1.625,
    source_en: 'From hadith · Abu Saʿid al-Khudri',
    source_ar: 'من الحديث · أبو سعيد الخدري',
    dispute: null,
  },
  barley: {
    en: 'Barley', ar: 'شعير', emoji: '🌾', majorityKg: 2.30, hanafiKg: 3.25,
    source_en: 'From hadith · Abu Saʿid al-Khudri',
    source_ar: 'من الحديث · أبو سعيد الخدري',
    dispute: null,
  },
  dates: {
    en: 'Dates', ar: 'تمر', emoji: '🌴', majorityKg: 1.80, hanafiKg: 3.25,
    source_en: 'From hadith · Abu Saʿid al-Khudri',
    source_ar: 'من الحديث · أبو سعيد الخدري',
    dispute: null,
  },
  raisins: {
    en: 'Raisins', ar: 'زبيب', emoji: '🍇', majorityKg: 1.64, hanafiKg: 1.625,
    source_en: 'From hadith · Abu Saʿid al-Khudri',
    source_ar: 'من الحديث · أبو سعيد الخدري',
    dispute: null,
  },
  rice: {
    en: 'Rice', ar: 'أرز', emoji: '🍚', majorityKg: 2.30, hanafiKg: 2.50,
    source_en: 'Local staple principle · غالب قوت البلد',
    source_ar: 'مبدأ غالب قوت البلد',
    dispute: null,
  },
  flour: {
    en: 'Flour (wheat)', ar: 'دقيق', emoji: '🌾', majorityKg: 1.40, hanafiKg: 1.625,
    source_en: 'Valid per Hanafi & Hanbali; disputed per Shafi\'i',
    source_ar: 'جائز عند الحنفية والحنابلة؛ مختلف فيه عند الشافعية',
    dispute: {
      note_en: 'Not valid per Shafi\'i school',
      note_ar: 'غير جائز عند الشافعية',
    },
  },
  semolina: {
    en: 'Semolina', ar: 'سميد', emoji: '🌾', majorityKg: 2.50, hanafiKg: 2.50,
    source_en: 'Local staple principle · غالب قوت البلد',
    source_ar: 'مبدأ غالب قوت البلد',
    dispute: null,
  },
  sorghum: {
    en: 'Sorghum', ar: 'ذرة', emoji: '🌾', majorityKg: 2.30, hanafiKg: 2.30,
    source_en: 'Local staple principle · غالب قوت البلد',
    source_ar: 'مبدأ غالب قوت البلد',
    dispute: null,
  },
  millet: {
    en: 'Millet', ar: 'دخن', emoji: '🌾', majorityKg: 2.20, hanafiKg: 2.20,
    source_en: 'Local staple principle · Maliki nine-food list',
    source_ar: 'الأصناف التسعة عند المالكية · غالب قوت البلد',
    dispute: null,
  },
  aqit: {
    en: 'Dried Cheese', ar: 'أقط', emoji: '🧀', majorityKg: 2.05, hanafiKg: 2.05,
    source_en: 'From hadith · Abu Saʿid al-Khudri',
    source_ar: 'من الحديث · أبو سعيد الخدري',
    dispute: null,
  },
};
```

- [ ] **Step 2: Verify in browser console**

Open `public/index.html` in a browser. In DevTools console run:
```js
console.assert(FOODS.flour.dispute.note_en === "Not valid per Shafi'i school", 'flour dispute');
console.assert(FOODS.rice.dispute === null, 'rice no dispute');
console.assert(FOODS.wheat.source_en.includes('hadith'), 'wheat source');
```
Expected: no assertion failures.

- [ ] **Step 3: Commit**
```bash
git add public/data.js
git commit -m "feat(data): add source and dispute fields to FOODS"
```

---

## Task 2 — Enrich SCHOLAR_PRESETS with sa_kg, source, quote, ref fields

**Files:**
- Modify: `public/data.js` — SCHOLAR_PRESETS constant (lines 40–45)

- [ ] **Step 1: Replace the SCHOLAR_PRESETS constant** with the enriched version below.

```js
const SCHOLAR_PRESETS = [
  {
    key: 'country',
    en: 'Country default', ar: 'الافتراضي',
    sa_kg: null, // dynamic — uses country's primaryFoods[0].kg at render time
    source_en: 'Local Fatwa Council',
    source_ar: 'مجلس الإفتاء المحلي',
    quote_en: 'This amount follows the official guidance of the country\'s religious authorities based on local madhab practice.',
    quote_ar: 'هذا المقدار يتبع الإرشاد الرسمي للهيئات الدينية في البلد بناءً على المذهب المعتمد محليًا.',
    ref_en: 'Local Fatwa Council',
    ref_ar: 'مجلس الإفتاء المحلي',
  },
  {
    key: 'maliki_shafii',
    en: 'Maliki / Shafi\'i', ar: 'مالكي / شافعي',
    sa_kg: 2.156,
    source_en: 'Qaradawi · Fiqh al-Zakat, Vol. 2, pp. 890–892',
    source_ar: 'القرضاوي · فقه الزكاة، ج٢، ص٨٩٠–٨٩٢',
    quote_en: 'The Saʿ equals 2,156 grams by weight. The obligatory amount is one Saʿ from the predominant staple food of the country (غالب قوت البلد).',
    quote_ar: 'الصاع يساوي بالوزن بالجرامات ٢١٥٦. والواجب صاع من غالب قوت البلد.',
    ref_en: 'Al-Qaradawi, Fiqh al-Zakat, Vol. 2, pp. 890–892',
    ref_ar: 'القرضاوي، فقه الزكاة، ج٢، ص٨٩٠–٨٩٢',
  },
  {
    key: 'hanafi',
    en: 'Hanafi', ar: 'حنفي',
    sa_kg: 3.25, // full Hanafi Saʿ; wheat uses half (1.625 kg) — noted in quote
    source_en: 'Ibn Abidin · Radd al-Muhtar; Qaradawi · Fiqh al-Zakat, p. 882',
    source_ar: 'ابن عابدين · رد المحتار؛ القرضاوي · فقه الزكاة، ص٨٨٢',
    quote_en: 'Half a Saʿ of wheat suffices according to Abu Hanifa, which was the opinion of a group of Companions. The Hanafi Saʿ equals 8 Iraqi ratls (approx. 3.25 kg). For wheat specifically, half a Saʿ (approx. 1.625 kg) applies.',
    quote_ar: 'يجزئ نصف صاع من البر عند أبي حنيفة، وهو رأي جماعة من الصحابة. والصاع عند الحنفية ثمانية أرطال عراقية (نحو ٣.٢٥ كغ). وللقمح تحديدًا يجزئ نصف صاع (نحو ١.٦٢٥ كغ).',
    ref_en: 'Ibn Abidin, Radd al-Muhtar; Al-Qaradawi, Fiqh al-Zakat, p. 882',
    ref_ar: 'ابن عابدين، رد المحتار؛ القرضاوي، فقه الزكاة، ص٨٨٢',
  },
  {
    key: 'ibn_baz',
    en: 'Ibn Baz / Hanbali', ar: 'ابن باز / حنبلي',
    sa_kg: 3.00,
    source_en: 'Ibn Baz · Majmuʿ Fatawa wa Maqalat, Vol. 14',
    source_ar: 'ابن باز · مجموع فتاوى ومقالات، ج١٤',
    quote_en: 'As for kilograms, it is approximately three kilograms. It is more cautious to measure by volume.',
    quote_ar: 'أما بالكيلو فيقارب ثلاثة كيلو، والأحوط أن يخرج من الكيل.',
    ref_en: 'Ibn Baz, Majmuʿ Fatawa wa Maqalat, Vol. 14',
    ref_ar: 'ابن باز، مجموع فتاوى ومقالات، ج١٤',
  },
];
```

- [ ] **Step 2: Verify in browser console**
```js
console.assert(SCHOLAR_PRESETS.find(p=>p.key==='ibn_baz').sa_kg === 3.00, 'ibn baz sa_kg');
console.assert(SCHOLAR_PRESETS.find(p=>p.key==='maliki_shafii').sa_kg === 2.156, 'maliki sa_kg');
console.assert(SCHOLAR_PRESETS.find(p=>p.key==='country').sa_kg === null, 'country sa_kg null');
console.assert(typeof SCHOLAR_PRESETS.find(p=>p.key==='hanafi').quote_en === 'string', 'hanafi quote');
```
Expected: no assertion failures.

- [ ] **Step 3: Commit**
```bash
git add public/data.js
git commit -m "feat(data): add sa_kg, source, quote, ref fields to SCHOLAR_PRESETS"
```

---

## Task 3 — Add QUOTES constant and new translation keys to data.js

**Files:**
- Modify: `public/data.js` — add after SCHOLAR_PRESETS, before TRANSLATIONS

- [ ] **Step 1: Add the QUOTES constant** after the SCHOLAR_PRESETS block and before the TRANSLATIONS block.

```js
const QUOTES = {
  food_hadith: {
    ref_en: 'Abu Saʿid al-Khudri, Sahih al-Bukhari #1506, Sahih Muslim #985',
    ref_ar: 'أبو سعيد الخدري، صحيح البخاري ١٥٠٦، صحيح مسلم ٩٨٥',
    quote_ar: 'كنا نخرج زكاة الفطر صاعاً من طعام، أو صاعاً من أقط، أو صاعاً من شعير، أو صاعاً من تمر، أو صاعاً من زبيب.',
    quote_en: 'We used to pay Zakat al-Fitr: one Saʿ of food, or one Saʿ of dried cheese (aqit), or one Saʿ of barley, or one Saʿ of dates, or one Saʿ of raisins.',
  },
  food_local_staple: {
    ref_en: 'Al-Qaradawi, Fiqh al-Zakat, p. 892; Maliki principle: غالب قوت البلد',
    ref_ar: 'القرضاوي، فقه الزكاة، ص٨٩٢؛ المبدأ المالكي: غالب قوت البلد',
    quote_ar: 'لو أن قوماً يعيشون على الأرز كانت فطرتهم مما يتقوتون به.',
    quote_en: 'If a people live on rice, their Fitrah is from what they eat as their staple.',
  },
  food_dispute_flour: {
    ref_en: 'Al-Shafiʿi, al-Umm; Al-Nawawi, al-Majmuʿ, Vol. 6',
    ref_ar: 'الشافعي، الأم؛ النووي، المجموع، ج٦',
    quote_ar: 'لا يجزئ الدقيق والسويق والخبز في زكاة الفطر عند الشافعية.',
    quote_en: 'Flour, sawiq, and bread are not valid for Zakat al-Fitr according to the Shafiʿi school.',
  },
};
```

- [ ] **Step 2: Add new keys to TRANSLATIONS** — inside both `en` and `ar` objects.

In `TRANSLATIONS.en` add after the last existing key (`confirmReset`):
```js
    scholarMethodLabel:  'Calculation method',
    sourceLabel:         'Source',
    basedOn:             'Based on:',
    hadithSource:        'From hadith',
    localStaple:         'Local staple',
    disputed:            'Disputed',
    closeSource:         'Close source',
    hanafiWheatNote:     '½ Saʿ for wheat',
```

In `TRANSLATIONS.ar` add after `confirmReset`:
```js
    scholarMethodLabel:  'طريقة الحساب',
    sourceLabel:         'المصدر',
    basedOn:             'بناءً على:',
    hadithSource:        'من الحديث',
    localStaple:         'غالب قوت البلد',
    disputed:            'مختلف فيه',
    closeSource:         'إغلاق المصدر',
    hanafiWheatNote:     'نصف صاع للقمح',
```

- [ ] **Step 3: Verify in browser console**
```js
console.assert(typeof QUOTES.food_hadith.quote_ar === 'string', 'food_hadith quote_ar');
console.assert(QUOTES.food_dispute_flour.ref_en.includes('Shafi'), 'flour dispute ref');
console.assert(TRANSLATIONS.en.basedOn === 'Based on:', 'basedOn en');
console.assert(TRANSLATIONS.ar.localStaple === 'غالب قوت البلد', 'localStaple ar');
```
Expected: no assertion failures.

- [ ] **Step 4: Commit**
```bash
git add public/data.js
git commit -m "feat(data): add QUOTES constant and scholarly translation keys"
```

---

## Task 4 — Add CSS for new components

**Files:**
- Modify: `public/style.css` — append new rules at the end of the file

- [ ] **Step 1: Append the following CSS block** at the very end of `style.css`.

```css
/* ── Scholar Selector (Step 1) ──────────────────────────────────────────── */
.scholar-selector {
  margin-top: 12px;
}
.scholar-selector-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}
.scholar-chips {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.scholar-chip-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.scholar-chip-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 500;
  font-family: var(--font);
  color: var(--muted);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.chip:hover {
  border-color: var(--gold);
  color: var(--text);
}
.chip-active {
  background: var(--gold-bg);
  border-color: var(--gold);
  color: var(--gold-text);
  font-weight: 600;
}
.chip-kg {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.75;
}

/* ── Cite Tag ────────────────────────────────────────────────────────────── */
.cite-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.70rem;
  font-family: var(--font);
  color: var(--muted);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cite-tag:hover {
  border-color: var(--blue);
  color: var(--blue);
}
.cite-tag::before {
  content: '📖';
  font-size: 0.65rem;
}

/* ── Quote Panel ─────────────────────────────────────────────────────────── */
.quote-panel {
  background: var(--surface2);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  margin-top: 6px;
  font-size: 0.82rem;
}
.quote-panel-ref {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 8px;
}
.quote-panel-divider {
  height: 1px;
  background: var(--border);
  margin: 8px 0;
}
.quote-panel-arabic {
  font-family: var(--font-display);
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text);
  direction: rtl;
  text-align: right;
}
.quote-panel-translation {
  font-size: 0.80rem;
  line-height: 1.55;
  color: var(--muted);
  font-style: italic;
}

/* ── Dispute Badge ───────────────────────────────────────────────────────── */
.dispute-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: hsl(38 100% 94%);
  border: 1px solid hsl(38 80% 75%);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 0.70rem;
  font-weight: 500;
  color: hsl(36 60% 30%);
  cursor: pointer;
  font-family: var(--font);
  transition: background 0.15s;
}
.dispute-badge:hover {
  background: hsl(38 100% 88%);
}

/* ── Food Source Label (picker) ──────────────────────────────────────────── */
.food-source-label {
  font-size: 0.65rem;
  color: var(--dimmed);
  margin-top: 2px;
  line-height: 1.3;
  text-align: center;
}
.food-source-label.disputed {
  color: hsl(36 60% 40%);
}

/* ── Basis Line (Step 4) ─────────────────────────────────────────────────── */
.basis-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 4px 0 12px;
  font-size: 0.78rem;
  color: var(--muted);
}
```

- [ ] **Step 2: Verify visually** — open `public/index.html`, select a country. There should be no visual change yet (new classes aren't used in HTML until later tasks), but no CSS errors in console.

- [ ] **Step 3: Commit**
```bash
git add public/style.css
git commit -m "feat(style): add cite-tag, quote-panel, scholar-selector, dispute-badge CSS"
```

---

## Task 5 — Add openQuoteKey state + getQuote() + openQuote() + renderQuotePanel() to app.js

**Files:**
- Modify: `public/app.js`

- [ ] **Step 1: Add `openQuoteKey` to the state object** (line ~25, the `const state = {` block). Add after `rowsModified`:

```js
  openQuoteKey: null, // key of the currently open quote panel, or null
```

- [ ] **Step 2: Add `resetAll()` cleanup** — `openQuoteKey` must be reset. Find `function resetAll()` and add `state.openQuoteKey = null;` after the existing resets:

```js
function resetAll() {
  state.country = null;
  state.familySize = 1;
  state.foodRows = [];
  state.scholarChip = 'country';
  state.foodPanelOpen = false;
  state.rowsModified = false;
  state.openQuoteKey = null;
  render();
}
```

- [ ] **Step 3: Add `getQuote(key)` function** — paste after the `round2` function (line ~63):

```js
// ── Resolve a quote object by key ───────────────────────────────────────────
// Keys prefixed 'chip_'  → scholar preset data (for Step 1 chips)
// Keys prefixed 'row_'   → active scholar preset data (for food row cite-tags)
// 'result_basis'         → active scholar preset data (for result basis line)
// 'food_hadith', 'food_local_staple', 'food_dispute_flour' → QUOTES entries
function getQuote(key) {
  if (key === null) return null;
  if (key.startsWith('chip_')) {
    const presetKey = key.slice(5); // remove 'chip_'
    const p = SCHOLAR_PRESETS.find(x => x.key === presetKey);
    return p ? { ref_en: p.ref_en, ref_ar: p.ref_ar, quote_en: p.quote_en, quote_ar: p.quote_ar } : null;
  }
  if (key === 'result_basis' || (key.startsWith('row_') && key.endsWith('_source'))) {
    const p = SCHOLAR_PRESETS.find(x => x.key === state.scholarChip);
    return p ? { ref_en: p.ref_en, ref_ar: p.ref_ar, quote_en: p.quote_en, quote_ar: p.quote_ar } : null;
  }
  return QUOTES[key] || null;
}
```

- [ ] **Step 4: Add `openQuote(key)` function** — paste immediately after `getQuote`:

```js
function openQuote(key) {
  state.openQuoteKey = state.openQuoteKey === key ? null : key;
  render();
}
```

- [ ] **Step 5: Add `renderQuotePanel(key)` function** — paste immediately after `openQuote`:

```js
// Renders an inline quote panel if state.openQuoteKey matches key.
// Returns empty string otherwise.
function renderQuotePanel(key) {
  if (state.openQuoteKey !== key) return '';
  const q = getQuote(key);
  if (!q) return '';
  const ref   = state.lang === 'ar' ? q.ref_ar   : q.ref_en;
  return `
    <div class="quote-panel" role="region" aria-label="${state.lang === 'ar' ? 'مصدر علمي' : 'Scholar source'}">
      <div class="quote-panel-ref">${escHtml(ref)}</div>
      <div class="quote-panel-divider"></div>
      <div class="quote-panel-arabic">${escHtml(q.quote_ar)}</div>
      <div class="quote-panel-divider"></div>
      <div class="quote-panel-translation">${escHtml(q.quote_en)}</div>
    </div>`;
}
```

- [ ] **Step 6: Verify in browser console**
```js
// After selecting a country, run:
state.openQuoteKey = 'chip_ibn_baz';
render();
// Check: no JS errors in console.
state.openQuoteKey = null;
render();
```
Expected: no errors. The app renders normally (quote panel not visible yet since no cite-tag buttons exist yet).

- [ ] **Step 7: Commit**
```bash
git add public/app.js
git commit -m "feat(app): add openQuoteKey state, getQuote, openQuote, renderQuotePanel"
```

---

## Task 6 — Move scholar chips to renderStep1() with citations

**Files:**
- Modify: `public/app.js` — `renderStep1()` and `renderResult()`

- [ ] **Step 1: Add a `renderScholarSelector()` helper function** — paste after `renderQuotePanel`:

```js
// Renders scholar chip selector with cite-tags. Used in renderStep1().
function renderScholarSelector() {
  const chipsHtml = SCHOLAR_PRESETS.map(p => {
    const label = state.lang === 'ar' ? p.ar : p.en;
    // sa_kg: for 'country' preset use the country's primaryFoods[0].kg dynamically
    const saKgVal = p.key === 'country'
      ? state.country.primaryFoods[0].kg
      : p.sa_kg;
    const saKgStr = `${fmt(saKgVal.toFixed(2))} ${state.lang === 'ar' ? 'كغ' : 'kg'}`;
    const hanafiNote = (p.key === 'hanafi')
      ? `<span class="chip-kg">(${t('hanafiWheatNote')})</span>`
      : '';
    const sourceLabel = state.lang === 'ar' ? p.source_ar : p.source_en;
    const quoteKey = `chip_${p.key}`;
    const isActive = state.scholarChip === p.key;
    return `
      <div class="scholar-chip-wrap">
        <div class="scholar-chip-row">
          <button class="chip ${isActive ? 'chip-active' : ''}" onclick="selectChip('${p.key}')">
            ${escHtml(label)}
            <span class="chip-kg">${saKgStr}</span>
            ${hanafiNote}
          </button>
          <button class="cite-tag" onclick="openQuote('${quoteKey}')"
                  aria-label="${t('sourceLabel')}">
            ${escHtml(sourceLabel)}
          </button>
        </div>
        ${renderQuotePanel(quoteKey)}
      </div>`;
  }).join('');

  return `
    <div class="scholar-selector">
      <div class="scholar-selector-title">${t('scholarMethodLabel')}</div>
      <div class="scholar-chips">${chipsHtml}</div>
    </div>`;
}
```

- [ ] **Step 2: Update `renderStep1()`** — add `${renderScholarSelector()}` after the badge. Find the `renderStep1` function. The return statement currently ends with `${badge}`. Change it to:

```js
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
      ${state.country ? renderScholarSelector() : ''}
    </section>`;
```

- [ ] **Step 3: Remove chips and override label from `renderResult()`**. Find `renderResult()`. Delete these two lines inside it:
```js
  const chips = SCHOLAR_PRESETS.map(p => `...`).join('');
```
and in the return template, remove:
```html
      <div class="override-label">${t('overrideLabel')}</div>
      <div class="chip-row">${chips}</div>
```

- [ ] **Step 4: Verify in browser**
  1. Select a country → 4 scholar chips appear in Step 1 with cite-tags
  2. Tap a cite-tag → quote panel expands inline below that chip row
  3. Tap the same cite-tag again → panel closes
  4. Tap a different cite-tag → previous panel closes, new one opens
  5. Select a different chip → kg in the result (Step 4) changes correctly
  6. Step 4 no longer shows chips or the "Weight per person:" label

- [ ] **Step 5: Commit**
```bash
git add public/app.js
git commit -m "feat(app): move scholar chips to Step 1 with source citations"
```

---

## Task 7 — Add dispute badge and source tag to food rows

**Files:**
- Modify: `public/app.js` — `renderStep3()` food row template (lines ~137–178)

- [ ] **Step 1: Update the food row template** inside `renderStep3()`. Find the `rows` map. Replace the entire `return \`...\`` template for each row with this updated version:

```js
    // Dispute badge (flour only)
    const disputeHtml = (!row.isCustom && food && food.dispute)
      ? `<button class="dispute-badge" onclick="openQuote('row_${i}_dispute')"
                 aria-label="${t('disputed')}">
           ⚠ ${escHtml(food.dispute[state.lang === 'ar' ? 'note_ar' : 'note_en'])}
         </button>`
      : '';

    // Source cite-tag key for this row (points to active scholar preset)
    const rowSourceKey = `row_${i}_source`;

    return `
      <div class="food-row">
        <div class="food-row-info">
          <span class="food-emoji">${emoji}</span>
          <span class="food-name">${name} ${disputeHtml}</span>
          <span class="food-kg">
            ${kgDisplay}
            ${!row.isCustom ? `<button class="cite-tag" onclick="openQuote('${rowSourceKey}')"
                aria-label="${t('sourceLabel')}">
                ${escHtml(state.lang === 'ar'
                  ? SCHOLAR_PRESETS.find(p=>p.key===state.scholarChip).source_ar
                  : SCHOLAR_PRESETS.find(p=>p.key===state.scholarChip).source_en)}
              </button>` : ''}
          </span>
        </div>
        <div class="food-row-controls">
          ${isSingle ? '' : `
            <button class="counter-btn sm" onclick="changeRowPersons(${i},-1)"
                    ${minusDisabled?'disabled':''}
                    aria-label="${t('removeFoodRow')}">−</button>
            <span class="row-persons">${fmt(row.persons)}</span>
            <button class="counter-btn sm" onclick="changeRowPersons(${i},1)"
                    ${plusDisabled?'disabled':''}
                    aria-label="${t('addPersonBtn')} – ${name}">+</button>
          `}
          <span class="row-subtotal">${fmt(subtotal.toFixed(2))} ${state.lang==='ar'?'كغ':'kg'}</span>
          <button class="remove-row-btn" onclick="removeRow(${i})"
                  aria-label="${t('removeFoodRow')}">✕</button>
        </div>
        ${renderQuotePanel(rowSourceKey)}
        ${(!row.isCustom && food && food.dispute) ? renderQuotePanel(`row_${i}_dispute`) : ''}
      </div>`;
```

Note: The `food` variable is already defined earlier in the map as `const food = row.isCustom ? null : FOODS[row.foodKey];`

- [ ] **Step 2: Verify in browser**
  1. Select a country → food rows show cite-tags next to kg values
  2. Add flour from the picker → a ⚠ "Not valid per Shafi'i" badge appears on the flour row
  3. Tap the badge → quote panel with the Shafi'i flour quote appears
  4. Tap the cite-tag on a rice row → scholar source quote panel appears
  5. Switch scholar chip → cite-tag label on rows updates to the new scholar's source

- [ ] **Step 3: Commit**
```bash
git add public/app.js
git commit -m "feat(app): add dispute badge and source cite-tag to food rows"
```

---

## Task 8 — Add source labels to food picker items

**Files:**
- Modify: `public/app.js` — `renderFoodPanel()` function

- [ ] **Step 1: Update `renderFoodPanel()`** — in the `grid` map, replace the `return` template to include a source label below each food name:

```js
  const grid = foodKeys.map(key => {
    const food = FOODS[key];
    const name = state.lang === 'ar' ? food.ar : food.en;

    // Determine source label text
    let sourceText, sourceClass;
    if (food.dispute) {
      sourceText = `⚠ ${t('disputed')} · ${food.dispute[state.lang === 'ar' ? 'note_ar' : 'note_en']}`;
      sourceClass = 'food-source-label disputed';
    } else if (food.source_en.includes('hadith') || food.source_en.includes('Hadith')) {
      sourceText = t('hadithSource');
      sourceClass = 'food-source-label';
    } else {
      sourceText = t('localStaple');
      sourceClass = 'food-source-label';
    }

    return `
      <button class="food-picker-item" onclick="addBuiltinFood('${key}')">
        <span>${food.emoji}</span>
        <span>${name}</span>
        <span class="${sourceClass}">${sourceText}</span>
      </button>`;
  }).join('');
```

- [ ] **Step 2: Verify in browser**
  1. Select a country → click "+ Add food type"
  2. Picker opens → each food shows a label below its name:
     - Dates/Barley/Raisins/Aqit/Wheat → "From hadith"
     - Rice/Millet/Sorghum/Semolina → "Local staple"
     - Flour → "⚠ Disputed · Not valid per Shafi'i"
  3. Switch to Arabic → labels appear in Arabic

- [ ] **Step 3: Commit**
```bash
git add public/app.js
git commit -m "feat(app): add source labels to food picker items"
```

---

## Task 9 — Add scholarly basis line to result and update copy text

**Files:**
- Modify: `public/app.js` — `renderResult()` and `buildCopyText()`

- [ ] **Step 1: Add the basis line to `renderResult()`**. Inside the `renderResult()` function, add the following block and variable just before the `return` template:

```js
  const activePreset = SCHOLAR_PRESETS.find(p => p.key === state.scholarChip);
  const presetLabel  = state.lang === 'ar' ? activePreset.ar : activePreset.en;
  const saKgVal      = state.scholarChip === 'country'
    ? state.country.primaryFoods[0].kg
    : activePreset.sa_kg;
  const saKgStr      = `${fmt(saKgVal.toFixed(2))} ${state.lang === 'ar' ? 'كغ/شخص' : 'kg/person'}`;
  const presetSource = state.lang === 'ar' ? activePreset.source_ar : activePreset.source_en;

  const basisLineHtml = `
    <div class="basis-line">
      <span>${t('basedOn')} ${escHtml(presetLabel)} · ${saKgStr}</span>
      <button class="cite-tag" onclick="openQuote('result_basis')"
              aria-label="${t('sourceLabel')}">
        ${escHtml(presetSource)}
      </button>
    </div>
    ${renderQuotePanel('result_basis')}`;
```

- [ ] **Step 2: Insert `basisLineHtml` into the return template** in `renderResult()`. Place it immediately after the `result-total-kg` div and before `result-lines`:

```js
  return `
    <section class="step-card step-gold">
      <div class="result-total-label">${t('resultTitle')}</div>
      <div class="result-total-kg">${fmt(total.toFixed(2))} ${state.lang==='ar'?'كغ':'kg'}</div>
      ${basisLineHtml}
      <div class="result-lines">${lines}</div>
      <div class="result-actions">
        <button class="result-btn copy-btn" id="copyBtn" onclick="copyResult()">
          ${t('copyBtn')}
        </button>
        <button class="result-btn reset-btn" onclick="resetAll()">
          ${t('resetBtn')}
        </button>
      </div>
    </section>`;
```

- [ ] **Step 3: Update `buildCopyText()`** to append the scholarly basis. Find `buildCopyText()`. Replace the final `return` line:

```js
  // Scholarly basis line appended to copied text
  const basisStr = state.lang === 'ar'
    ? `بناءً على: ${state.lang === 'ar' ? activePreset.ar : activePreset.en} (${fmt(saKgVal.toFixed(2))} كغ/شخص)`
    : `Based on: ${activePreset.en} (${saKgVal.toFixed(2)} kg/person)`;

  return `${header}\n${lines}\n${totalStr}\n${basisStr}`;
```

Note: `activePreset` and `saKgVal` are not in scope inside `buildCopyText()` — add them at the top of that function:

```js
function buildCopyText() {
  const activePreset = SCHOLAR_PRESETS.find(p => p.key === state.scholarChip);
  const saKgVal = state.scholarChip === 'country'
    ? state.country.primaryFoods[0].kg
    : activePreset.sa_kg;
  // ... rest of existing code unchanged ...
```

- [ ] **Step 4: Verify in browser**
  1. Select country, add family size, check result appears
  2. Below the total kg, a line reads "Based on: Country default · 3.00 kg/person" (for Saudi Arabia with country chip)
  3. A cite-tag appears next to it; tapping it shows the quote panel
  4. Copy the result → paste in a text editor → last line shows "Based on: ..."
  5. Switch scholar chips → basis line updates

- [ ] **Step 5: Commit**
```bash
git add public/app.js
git commit -m "feat(app): add scholarly basis line to result and copy text"
```

---

## Task 10 — Final verification pass

**Files:** None modified — this is a verification task only.

- [ ] **Step 1: Full EN flow test**
  1. Open `public/index.html` in browser (no server needed — file:// works)
  2. Select **Malaysia** → badge shows "Rice · 2.70 kg · Shafi'i"
  3. Scholar selector appears with 4 chips; **Country default** is active showing 2.70 kg
  4. Tap the cite-tag on **Maliki / Shafi'i** → quote panel shows Qaradawi quote in Arabic + English
  5. Click **Maliki / Shafi'i** chip → it activates
  6. Set family to 3 → Step 3 shows rice row; cite-tag label says "Qaradawi · Fiqh al-Zakat, Vol. 2, pp. 890–892"
  7. Open food picker → rice shows "Local staple", dates shows "From hadith", flour shows "⚠ Disputed..."
  8. Add flour → flour row shows "⚠ Not valid per Shafi'i" badge; tapping it shows Shafi'i quote
  9. Result shows total, then "Based on: Maliki / Shafi'i · 2.156 kg/person" with cite-tag
  10. Copy result → paste shows scholarly basis on last line

- [ ] **Step 2: Full AR flow test**
  1. Click AR button → page goes RTL
  2. Select **السعودية** → scholar chips appear in Arabic labels
  3. Active chip: "الافتراضي" showing 3.00 كغ
  4. Tap cite-tag → quote panel appears with Arabic ref and quote
  5. Result shows: "بناءً على: الافتراضي · 3.00 كغ/شخص"
  6. Numeric toggle: switch to English numerals → all numbers switch including chip kg display

- [ ] **Step 3: Mobile width test**
  1. In DevTools, set viewport to 375px width
  2. Scholar chips should not overflow horizontally (each chip is block in `scholar-chips` flex-column)
  3. Cite-tags truncate with ellipsis if source label is long (overflow: hidden; text-overflow: ellipsis applied)
  4. Quote panels are readable — text wraps properly

- [ ] **Step 4: Final commit**
```bash
git add public/data.js public/app.js public/style.css
git commit -m "feat: scholarly sources and options — complete implementation"
```

---

## Self-Review Checklist (run before starting)

- [x] **Spec coverage:** All 6 spec sections covered across tasks 1–9
- [x] **No placeholders:** All code blocks are complete
- [x] **Type consistency:** `openQuoteKey` used consistently; `getQuote(key)` returns `{ ref_en, ref_ar, quote_en, quote_ar }` as consumed by `renderQuotePanel()`; `SCHOLAR_PRESETS` fields added in Task 2 consumed in Tasks 5–9
- [x] **Scholar chips removed from renderResult():** Done in Task 6 Step 3
- [x] **`overrideLabel` and `chip-row` removed from result template:** Done in Task 6 Step 3
- [x] **`resetAll()` clears `openQuoteKey`:** Done in Task 5 Step 2
- [x] **`buildCopyText()` gets `activePreset` and `saKgVal` locally:** Done in Task 9 Step 3
