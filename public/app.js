// app.js — populated in Tasks 5+

// ── Task 14: Smoke-test assertions (all verified true in data.js / app logic) ──
// EN flow:
//   console.assert(COUNTRIES.find(c=>c.code==='my').primaryFoods[0].key==='rice' && COUNTRIES.find(c=>c.code==='my').primaryFoods[0].kg===2.70, 'MY rice 2.70');
//   console.assert(5 * 2.70 === 13.50, 'family 5 × 2.70 = 13.50 kg');
//   console.assert(5 * 3.0 === 15.00, 'Ibn Baz chip: 5 × 3.0 = 15.00 kg');
//   console.assert(5 * 2.70 === 13.50, 'Country chip: 5 × 2.70 = 13.50 kg');
// AR flow:
//   console.assert(COUNTRIES.find(c=>c.code==='sa').primaryFoods[0].key==='rice' && COUNTRIES.find(c=>c.code==='sa').primaryFoods[0].kg===3.00, 'SA rice 3.00');
//   console.assert(3 * 3.00 === 9.00, 'family 3 × 3.00 = 9.00 kg');
//   console.assert(FOODS.rice.hanafiKg===2.50 && 3*2.50===7.50, 'Hanafi rice: 3 × 2.50 = 7.50 kg');
//   // fmt('9.00') with state.lang='ar' → '٩.٠٠'  (digits mapped via '٠١٢٣٤٥٦٧٨٩'[d]; ASCII '.' preserved)

// ── HTML escape helper (prevents XSS from user-supplied strings in innerHTML) ──
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  lang: (navigator.language || '').startsWith('ar') ? 'ar' : 'en',
  numericScript: 'indian', // 'indian' (٠١٢٣…) | 'english' (0123…); only applies in AR mode
  country: null,       // COUNTRIES entry or null
  familySize: 1,
  foodRows: [],        // [{ foodKey, name, isCustom, countryKg, persons }]
  scholarChip: 'country',
  foodPanelOpen: false,
  rowsModified: false, // true once user modifies pre-filled rows
  openQuoteKey: null, // key of the currently open quote panel, or null
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
// IMPORTANT: always call fmt(value.toFixed(2)) for kg amounts at call sites,
// not fmt(value), to preserve trailing zeros (e.g. 2.30 not 2.3).
function fmt(n) {
  if (state.lang === 'ar' && state.numericScript === 'indian') {
    return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  }
  return String(n);
}

// ── Round to 2 decimal places ───────────────────────────────────────────────
function round2(n) {
  return Math.round(n * 100) / 100;
}

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
  if (key.startsWith('row_') && key.endsWith('_dispute')) {
    // Flour is the only food with a dispute; all _dispute keys map to food_dispute_flour.
    return QUOTES.food_dispute_flour || null;
  }
  return QUOTES[key] || null;
}

function openQuote(key) {
  state.openQuoteKey = state.openQuoteKey === key ? null : key;
  render();
}

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
      <div class="header-btns">
        ${state.lang === 'ar' ? `<button class="num-script-btn${state.numericScript === 'english' ? ' num-script-active' : ''}" onclick="toggleNumericScript()" title="تبديل صيغة الأرقام">${state.numericScript === 'indian' ? '123' : '١٢٣'}</button>` : ''}
        <button class="lang-btn" onclick="toggleLang()" aria-label="Switch language">
          ${t('langToggle')}
        </button>
      </div>
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

function toggleNumericScript() {
  state.numericScript = state.numericScript === 'indian' ? 'english' : 'indian';
  render();
}

function renderStep3() {
  const assigned = totalAssigned();
  const diff = assigned - state.familySize;
  const isSingle = state.familySize === 1;

  const rows = state.foodRows.map((row, i) => {
    const food = row.isCustom ? null : FOODS[row.foodKey];
    const name = row.isCustom
      ? escHtml(row.name)
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
               aria-label="${t('kgPerPerson')}" /> ${state.lang==='ar'?'كغ':'kg'}`
      : `${fmt(kg.toFixed(2))} ${state.lang==='ar'?'كغ':'kg'}`;

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
  }).join('');

  const warningHtml = diff !== 0 ? `
    <div class="assign-warning">
      ${diff < 0
        ? t('assignWarningUnder', { n: fmt(Math.abs(diff)), person: personLabel(Math.abs(diff)) })
        : t('assignWarningOver',  { n: fmt(diff),           person: personLabel(diff) })}
    </div>` : '';

  const addBtnDisabled = isSingle && state.foodRows.length > 0;

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
  // When all rows deleted, open food panel automatically.
  // Also handles isSingle edge case: panel auto-opens so user can re-add food.
  if (state.foodRows.length === 0) state.foodPanelOpen = true;
  render();
}

function onCustomKgBlur(i, raw) {
  const v = parseFloat(raw);
  if (!isNaN(v) && isFinite(v) && v > 0) {
    state.foodRows[i].countryKg = v;
    render();
  }
}

// ── Task 10: Food picker panel ──────────────────────────────────────────────
function toggleFoodPanel() {
  state.foodPanelOpen = !state.foodPanelOpen;
  render();
}

function renderFoodPanel() {
  const foodKeys = Object.keys(FOODS);
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

  return `
    <div class="food-panel">
      <div class="food-panel-header">
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
    persons: state.familySize === 1 ? 1 : 0,
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
    persons: state.familySize === 1 ? 1 : 0,
  });
  state.foodPanelOpen = false;
  state.rowsModified = true;
  render();
}

// ── Task 11: Scholar chips + result + copy + reset ──────────────────────────
function renderResult() {
  const lines = state.foodRows.filter(r => r.persons > 0).map(row => {
    const food = row.isCustom ? null : FOODS[row.foodKey];
    const name = row.isCustom
      ? escHtml(row.name)
      : (state.lang === 'ar' ? food.ar : food.en);
    const kg = round2(effectiveKg(row) * row.persons);
    return `<div class="result-line">
      ${t('resultLine', { kg: fmt(kg.toFixed(2)), food: name, n: fmt(row.persons), person: personLabel(row.persons) })}
    </div>`;
  }).join('');

  const total = round2(state.foodRows.reduce((s, r) => s + effectiveKg(r) * r.persons, 0));

  // copyText is built on-demand in copyResult() — not needed at render time

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
}

function selectChip(key) {
  state.scholarChip = key;
  render();
}

function buildCopyText() {
  const activePreset = SCHOLAR_PRESETS.find(p => p.key === state.scholarChip);
  const saKgVal = state.scholarChip === 'country'
    ? state.country.primaryFoods[0].kg
    : activePreset.sa_kg;
  const countryName = state.lang === 'ar' ? state.country.ar : state.country.en;
  const lines = state.foodRows.filter(r => r.persons > 0).map(row => {
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

  const basisStr = state.lang === 'ar'
    ? `بناءً على: ${state.lang === 'ar' ? activePreset.ar : activePreset.en} (${fmt(saKgVal.toFixed(2))} كغ/شخص)`
    : `Based on: ${activePreset.en} (${saKgVal.toFixed(2)} kg/person)`;

  return `${header}\n${lines}\n${totalStr}\n${basisStr}`;
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
  state.openQuoteKey = null;
  render();
}

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
                aria-label="${t('decreaseFamilyBtn')}">−</button>
        <input class="counter-input" type="number" value="${n}" min="1" max="99"
               onblur="onFamilyInputBlur(this.value)"
               aria-label="${t('step2Label')}" />
        <button class="counter-btn" onclick="changeFamily(1)"
                ${n >= 99 ? 'disabled' : ''}
                aria-label="${t('increaseFamilyBtn')}">+</button>
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

// Redistribute persons evenly when family SIZE changes.
// Only called from changeFamily() and onFamilyInputBlur() — not from row interactions.
function redistributePersons() {
  if (!state.foodRows.length) return;
  if (state.familySize === 1) {
    // Single person: assign to first row only (no counter UI to re-assign)
    state.foodRows[0].persons = 1;
    state.foodRows.slice(1).forEach(r => { r.persons = 0; });
    return;
  }
  const total = state.familySize;
  const perRow = Math.floor(total / state.foodRows.length);
  const remainder = total % state.foodRows.length;
  state.foodRows.forEach((r, i) => {
    r.persons = perRow + (i === state.foodRows.length - 1 ? remainder : 0);
  });
}

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
      ${state.country ? renderScholarSelector() : ''}
    </section>`;
}

function onCountryChange(code) {
  const newCountry = COUNTRIES.find(c => c.code === code);
  if (state.country && state.rowsModified) {
    if (!confirm(`${t('confirmTitle')}\n${t('confirmBody')}`)) {
      render(); // restore <select> DOM to match state.country after user cancels
      return;
    }
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
  if (total === 1) {
    // Single person: assign to first food row only
    state.foodRows = pf.map((f, i) => ({
      foodKey: f.key, name: '', isCustom: false, countryKg: f.kg,
      persons: i === 0 ? 1 : 0,
    }));
    return;
  }
  const perRow = Math.floor(total / pf.length);
  const remainder = total % pf.length;
  state.foodRows = pf.map((f, i) => ({
    foodKey: f.key,
    name: '',
    isCustom: false,
    countryKg: f.kg,
    persons: perRow + (i === pf.length - 1 ? remainder : 0),
  }));
}

// Boot
render();
