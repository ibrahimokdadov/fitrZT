// app.js — populated in Tasks 5+

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
// IMPORTANT: always call fmt(value.toFixed(2)) for kg amounts at call sites,
// not fmt(value), to preserve trailing zeros (e.g. 2.30 not 2.3).
function fmt(n) {
  if (state.lang === 'ar') {
    return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  }
  return String(n);
}

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
    return `
      <button class="food-picker-item" onclick="addBuiltinFood('${key}')">
        <span>${food.emoji}</span>
        <span>${name}</span>
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
  const chips = SCHOLAR_PRESETS.map(p => `
    <button class="chip ${state.scholarChip === p.key ? 'chip-active' : ''}"
            onclick="selectChip('${p.key}')">
      ${state.lang === 'ar' ? p.ar : p.en}
    </button>`).join('');

  const lines = state.foodRows.map(row => {
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

  return `
    <section class="step-card step-gold">
      <div class="result-total-label">${t('resultTitle')}</div>
      <div class="result-total-kg">${fmt(total.toFixed(2))} ${state.lang==='ar'?'كغ':'kg'}</div>
      <div class="result-lines">${lines}</div>
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

// Redistribute persons evenly when family SIZE changes.
// Only called from changeFamily() and onFamilyInputBlur() — not from row interactions.
function redistributePersons() {
  if (!state.foodRows.length) return;
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
    name: '',
    isCustom: false,
    countryKg: f.kg,
    persons: perRow + (i === pf.length - 1 ? remainder : 0),
  }));
}

// Boot
render();
