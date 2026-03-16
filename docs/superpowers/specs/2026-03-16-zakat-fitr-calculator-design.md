# Zakat al-Fitr Calculator — Design Spec
**Date:** 2026-03-16  **Project:** fitrZT  **Stack:** Vanilla HTML/CSS/JS (static, no build step)

---

## 1. Overview

A responsive web app (mobile-first) that calculates the total weight of food required for Zakat al-Fitr. The user selects their country, enters family size, assigns food types per person or group, and receives a total weight result. Fully bilingual: Arabic (RTL) and English (LTR) with a toggle.

---

## 2. User Flow

1. **Select country** — dropdown; auto-populates suggested food rows and weight for that country
2. **Enter family size** — +/− counter (minimum 1)
3. **Assign foods** — one or more food rows, each with a person count; total must equal family size
4. **View result** — total weight broken down per food group, with optional scholar weight override

---

## 3. Architecture

```
fitrZT/
├── index.html   # HTML shell — loads scripts, sets viewport
├── data.js      # All static data: countries, foods, translations, scholar weights
├── app.js       # All UI logic, state management, rendering
└── style.css    # All styles
```

No framework, no build step, no dependencies. Works offline. Deployable as static files.

**`primaryFoods` entry shape:** `{ key: string, kg: number }` — `key` matches a key in `FOODS`.

---

## 4. Features

### 4.1 Language Toggle
- Button in the header always shows the **other** language abbreviation: when EN is active, shows "AR"; when AR is active, shows "EN"
- Arabic: `<html dir="rtl">`, full RTL layout
- Arabic numerals: **automatic** — Eastern Arabic (٠١٢٣٤٥٦٧٨٩) when AR active, Western (0–9) when EN — no user toggle
- Default: `navigator.language` starts with "ar" → AR, else EN

### 4.2 Country Selection
- Initial state: blank placeholder ("Select country" / "اختر البلد") — Steps 2 and 3 are hidden until a country is selected
- 22 countries in a `<select>` dropdown, sorted alphabetically in the active language
- On selection: info badge appears below the dropdown
  - EN: `Suggested: {food} · {kg} kg/person · {madhab}`
  - AR: `المقترح: {food} · {kg} كغ/شخص · {madhab}`
  - `{madhab}` uses the Arabic madhab name when in AR mode (see Section 7 for madhab name translations)
  - For multi-food countries the badge shows the first/primary food only
- Food rows pre-filled from `primaryFoods` array; persons distributed evenly across rows, remainder to last row
- Country change triggers confirmation dialog if user has modified rows (see Section 8)
  - Implementation: native `window.confirm()` with `"{confirmTitle}\n{confirmBody}"` as the message (no styling). `confirmCancel` and `confirmReset` are defined in translations for future use if a custom modal is ever added, but are not used by the native `confirm()` implementation.

### 4.3 Family Size
- +/− counter, min 1, max 99; − disabled at 1, + disabled at 99
- Accepts typed input; non-numeric or out-of-range: revert to last valid value on blur
- Steps 2 and 3 become visible only after country is selected

### 4.4 Food Assignment
- **Food row fields:** emoji + food name (AR/EN), kg/person display (read-only, driven by active scholar chip — see 4.5), person count (−/+ only, no typed entry), subtotal kg
- Persons per row: counter floor is **0** (− disabled at 0, not at 1). Newly added rows start at 0 — this is a valid transient state while the user assigns them. The warning badge enforces full assignment before the result is shown. The + button is disabled when incrementing would cause the row's count to exceed the remaining unassigned persons. No silent auto-correction of other rows.
- **Warning badge** (below all rows):
  - Hidden when total assigned = family size
  - `assignWarningUnder` when total < family size
  - `assignWarningOver` when total > family size (can happen if user first raises family size then lowers it after assigning)
  - Result section hidden whenever the badge is visible (total ≠ family size)
  - When all food rows are deleted: total assigned = 0, badge shows `assignWarningUnder` with N = family size; add-food panel opens automatically
- **+ Add food type** button: disabled when total assigned = family size (all persons are accounted for, adding a 0-person row would be meaningless)
  - Opens an inline panel below existing rows (not a modal/drawer)
  - Panel shows a 2-column grid of all built-in food types on mobile (single-column on screens <320px)
  - Tapping a built-in food: adds a row with 0 persons; panel closes
  - Custom food entry: at the bottom of the grid — two fields (food name, kg/person) + "Add" button; validation: name must be non-empty, kg must be > 0; errors shown inline; on success adds a row with 0 persons and closes panel
  - ✕ button closes the panel without adding anything
- **Single family member (family size = 1):** one food row, person count locked at 1 (−/+ hidden). "+ Add food type" button is disabled (all 1 person is assigned). Multi-food assignment is not possible.
- **Remove row (✕):** no confirmation. If removing would leave 0 rows, the add-food panel opens automatically.
- **Custom food rows:** the kg/person field is always user-editable and is unaffected by scholar chip changes. The chip's label for a custom row shows the user's entered value at all times.

### 4.5 Scholar Weight Override
Four chips displayed in the result section. Active chip highlighted. Default: **Country default**. Changing chip recalculates all non-custom food row subtotals instantly.

| Chip key | Label EN | Label AR | Rule |
|---|---|---|---|
| country | Country default | الافتراضي | Each row uses its stored `countryKg` (set from `primaryFoods` on country selection, or `food.majorityKg` for rows added later) |
| maliki_shafii | Maliki / Shafi'i | مالكي / شافعي | Each row uses `food.majorityKg` |
| hanafi | Hanafi | حنفي | Each row uses `food.hanafiKg` |
| ibn_baz | Ibn Baz / Hanbali | ابن باز / حنبلي | 3.0 kg for all foods |

Custom food rows always use the user's entered kg regardless of chip.

**`countryKg` explained:** When a food row is pre-filled from `primaryFoods`, its `countryKg` is set to the weight in the `primaryFoods` entry. When a row is added via the food picker (not pre-filled), its `countryKg` = `food.majorityKg`. This allows Libya's wheat row to have `countryKg = 2.25` and rice row `countryKg = 2.00` independently, while the Country default chip correctly applies each row's own country weight.

### 4.6 Result Display
- Visible only when total assigned = family size
- Large total weight (e.g., `9.3 كغ` or `9.3 kg`) at the top
- Breakdown list: one line per food row
  - EN: `{kg} kg of {food} for {n} person(s)`
  - AR: `{kg} كغ من {food} لـ {n} شخص/أشخاص` (see plural rules in Section 7)
- All weights displayed and copied to **2 decimal places**
- **Copy button:** copies result as plain text; on success: button label changes to "Copied!" / "تم النسخ!" for 2 seconds, then reverts. On clipboard API failure: alert with the text pre-selected for manual copy.
  - EN copy format:
    ```
    Zakat al-Fitr — {Country}
    {N} persons
    {Food}: {X} kg ({N} persons)
    ...
    Total: {X} kg
    ```
  - AR copy format:
    ```
    زكاة الفطر — {البلد}
    {N} أشخاص
    {طعام}: {X} كغ ({N} أشخاص)
    ...
    المجموع: {X} كغ
    ```
- **Reset button:** clears all state, returns to initial (country dropdown blank, Steps 2+3 hidden)

---

## 5. Data Layer (`data.js`)

### 5.1 Food Types
The `hanafiKg` column is the **authoritative Hanafi weight** used by the Hanafi chip. The prose in Section 4.5 is for developer understanding only; the table governs.

| Key | EN | AR | emoji | majorityKg | hanafiKg | Notes |
|---|---|---|---|---|---|---|
| wheat | Wheat | قمح | 🌾 | 2.04 | 1.625 | Majority: full Sa'; Hanafi: half Sa' |
| barley | Barley | شعير | 🌾 | 2.30 | 3.25 | Hanafi full Sa' is heavier |
| dates | Dates | تمر | 🌴 | 1.80 | 3.25 | Hanafi full Sa' is heavier |
| raisins | Raisins | زبيب | 🍇 | 1.64 | 1.625 | Hanafi: half Sa' |
| rice | Rice | أرز | 🍚 | 2.30 | 2.50 | Malaysia official: 2.70 kg |
| flour | Flour (wheat) | دقيق | 🌾 | 1.40 | 1.625 | Less dense; Hanafi: half Sa' |
| semolina | Semolina | سميد | 🌾 | 2.50 | 2.50 | North Africa staple |
| sorghum | Sorghum | ذرة | 🌾 | 2.30 | 2.30 | Sudan / Sahel staple |
| millet | Millet | دخن | 🌾 | 2.20 | 2.20 | West Africa staple |
| aqit | Dried Cheese | أقط | 🧀 | 2.05 | 2.05 | Classical; no Hanafi half-Sa' rule applies |

### 5.2 Countries

Each entry: `{ code, en, ar, primaryFoods: [{foodKey, kg}], defaultKg, madhab, madhabAr }`

The `defaultKg` = the first primary food's kg. The Country default chip uses each **row's** `countryKg`, not `defaultKg` globally (see Section 4.5). `defaultKg` is only used for the info badge display.

Note: Country official weights can differ from the general school weight (e.g., Tunisia Maliki official uses 2.50 kg for wheat, not the classical majority 2.04 kg — this reflects the local fatwa body's ruling).

| Code | EN | AR | Primary Food(s) [key: kg] | defaultKg | madhab | madhabAr |
|---|---|---|---|---|---|---|
| dz | Algeria | الجزائر | semolina: 2.50 | 2.50 | Maliki | المالكي |
| ma | Morocco | المغرب | semolina: 2.50 | 2.50 | Maliki | المالكي |
| tn | Tunisia | تونس | wheat: 2.50 | 2.50 | Maliki | المالكي |
| ly | Libya | ليبيا | wheat: 2.25, rice: 2.00 | 2.25 | Maliki | المالكي |
| eg | Egypt | مصر | wheat: 2.04 | 2.04 | Shafi'i | الشافعي |
| sd | Sudan | السودان | wheat: 2.50, sorghum: 2.50 | 2.50 | Maliki | المالكي |
| so | Somalia | الصومال | rice: 2.50 | 2.50 | Shafi'i | الشافعي |
| sa | Saudi Arabia | السعودية | rice: 3.00 | 3.00 | Hanbali | الحنبلي |
| ae | UAE | الإمارات | rice: 2.50 | 2.50 | Mixed | متعدد |
| jo | Jordan | الأردن | wheat: 2.50 | 2.50 | Mixed | متعدد |
| sy | Syria | سوريا | wheat: 2.50 | 2.50 | Shafi'i | الشافعي |
| lb | Lebanon | لبنان | wheat: 2.50 | 2.50 | Mixed | متعدد |
| iq | Iraq | العراق | wheat: 2.50 | 2.50 | Hanafi | الحنفي |
| tr | Turkey | تركيا | flour: 2.50 | 2.50 | Hanafi | الحنفي |
| id | Indonesia | إندونيسيا | rice: 2.50 | 2.50 | Shafi'i | الشافعي |
| my | Malaysia | ماليزيا | rice: 2.70 | 2.70 | Shafi'i | الشافعي |
| pk | Pakistan | باكستان | flour: 1.75 | 1.75 | Hanafi | الحنفي |
| in | India | الهند | wheat: 2.04 | 2.04 | Hanafi | الحنفي |
| sn | Senegal | السنغال | rice: 2.50, millet: 2.20 | 2.50 | Maliki | المالكي |
| fr | France | فرنسا | semolina: 2.50 | 2.50 | Maliki | المالكي |
| us | USA | أمريكا | rice: 2.04 | 2.04 | Mixed | متعدد |
| gb | UK | بريطانيا | rice: 2.50 | 2.50 | Mixed | متعدد |

**Pakistan note:** `flour: 1.75 kg` is the 2026 Council of Islamic Ideology Pakistan official ruling (slightly above the strict Hanafi 1.625 kg). It is a country-specific override; the Hanafi chip will apply 1.625 kg for flour instead.

**USA note:** `rice: 2.04 kg` follows the Fiqh Council of North America (FCNA) food-based standard. FCNA's cash recommendation ($10) is out of scope.

---

## 6. UI & Layout

- Mobile-first, max-width 480px centered on desktop
- Dark theme: `#0f1929` background, step card borders: blue (country), green (family), purple (food), gold (result)
- RTL full flip when Arabic active: `dir="rtl"` on `<html>`, flex-direction reversal, text-align start
- Accessible: `<label>` for all inputs, `aria-label` on icon-only buttons (remove ✕, language toggle), visible focus rings
- System font stack: `-apple-system, Segoe UI, Arial, sans-serif`
- No images, no external fonts

---

## 7. Translations (`TRANSLATIONS.en` and `TRANSLATIONS.ar` in `data.js`)

All dynamic strings use `{placeholder}` syntax. Plural rules: for Arabic, use `أشخاص` (plural) for n > 1 and `شخص` (singular) for n = 1. Use `personSingular` / `personPlural` keys.

| Key | EN | AR |
|---|---|---|
| appTitle | Zakat al-Fitr Calculator | حاسبة زكاة الفطر |
| appSubtitle | Calculate your Zakat al-Fitr | احسب زكاة الفطر الخاصة بك |
| langToggle | AR | EN |
| countryPlaceholder | Select country | اختر البلد |
| step1Label | Select Country | اختر البلد |
| step2Label | Family Members | عدد أفراد الأسرة |
| step3Label | Food | الطعام |
| infoBadge | Suggested: {food} · {kg} kg/person · {madhab} | المقترح: {food} · {kg} كغ/شخص · {madhab} |
| personSingular | person | شخص |
| personPlural | persons | أشخاص |
| addFoodBtn | + Add food type | + إضافة نوع آخر |
| removeFoodRow | Remove row | حذف الصف |
| closePanelBtn | Close | إغلاق |
| customFoodTitle | Custom food | طعام مخصص |
| customFoodNamePlaceholder | Food name | اسم الطعام |
| customFoodKgPlaceholder | kg per person | كغ/شخص |
| customFoodConfirm | Add | إضافة |
| customFoodErrorName | Please enter a food name. | الرجاء إدخال اسم الطعام. |
| customFoodErrorKg | Please enter a valid weight (> 0). | الرجاء إدخال وزن صحيح (> 0). |
| assignWarningUnder | ⚠ {n} {person} not yet assigned | ⚠ {n} {person} لم يتم تعيينهم بعد |
| assignWarningOver | ⚠ {n} {person} over-assigned | ⚠ تم تعيين {n} {person} زيادة |
| overrideLabel | Weight per person: | الوزن لكل شخص: |
| resultTitle | Total Zakat al-Fitr | إجمالي زكاة الفطر |
| resultLine | {kg} kg of {food} for {n} {person} | {kg} كغ من {food} لـ {n} {person} |
| resultTotal | Total: {kg} kg | المجموع: {kg} كغ |
| copyBtn | Copy result | نسخ النتيجة |
| copiedBtn | Copied! | تم النسخ! |
| copyFallbackAlert | Copy this text: | انسخ هذا النص: |
| resetBtn | Reset | إعادة تعيين |
| confirmTitle | Change country? | تغيير البلد؟ |
| confirmBody | This will reset your food selection. | سيتم إعادة تعيين اختيار الطعام. |
| confirmCancel | Cancel | إلغاء |
| confirmReset | Reset | إعادة تعيين |

**{person} placeholder** is resolved at runtime: if `n === 1` use `personSingular`, else `personPlural`.

---

## 8. Validation & Edge Cases

| Scenario | Behaviour |
|---|---|
| Country not yet selected | Steps 2 and 3 hidden |
| Family size − at 1 | Button disabled |
| Family size + at 99 | Button disabled |
| Typed non-numeric in family size | Revert to last valid value on blur |
| Food row + would exceed remaining | Button dims, blocked |
| Total assigned < family size | Warning badge shown; result hidden |
| Total assigned > family size | Warning badge shown; result hidden |
| All food rows deleted | Warning badge; add-food panel opens automatically |
| Family size = 1 | Only one food row; person count locked at 1; add-food button disabled |
| Custom food — empty name | Inline error below name field; add blocked |
| Custom food — kg ≤ 0 | Inline error below kg field; add blocked |
| Country change — no food rows modified | No dialog; resets silently |
| Country change — rows modified | Confirmation dialog; Cancel preserves state; Reset clears and pre-fills new country |
| Copy — clipboard API success | Button label → "Copied!" / "تم النسخ!" for 2 s, then reverts |
| Copy — clipboard API failure | Alert with pre-selected text for manual copy |

---

## 9. Out of Scope

- Cash equivalent
- User accounts / saving results
- Push notifications / Ramadan reminders
- Backend / server
- PWA / service worker

---

## 10. Scholarly Research Summary

The Sa' is a volumetric measure of ~3 litres. Its weight varies by food density:

| School | Sa' weight | Wheat / flour rule |
|---|---|---|
| Hanafi | 3,250 g | Half Sa' (1,625 g) for wheat, flour, raisins |
| Maliki / Shafi'i / Hanbali | 2,040–2,176 g | Full Sa' for all foods |
| Ibn Baz (practical) | ~3,000 g | Full Sa' for all foods |

Country official weights may differ from the general school weight (e.g., Tunisia Maliki official = 2.50 kg for wheat vs. classical majority 2.04 kg). The app uses the country's official fatwa body weight as the default and exposes all four scholarly positions via the override chips.

Sources: binbaz.org.sa, dar-alifta.org, islamweb.net, islamqa.info, BAZNAS Indonesia, JAKIM Malaysia, UAE Fatwa Council, Morocco Higher Ulamas Council, Council of Islamic Ideology Pakistan, Fiqh Council of North America.
