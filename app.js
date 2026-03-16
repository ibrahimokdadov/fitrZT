// app.js — populated in Tasks 5+

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
