# Scholarly Sources & Options — Design Spec
*Date: 2026-03-26*

## Overview

Enrich the Zakat al-Fitr calculator so users see all scholarly options and their sources at every decision point. Based on findings from two authoritative sources:

1. **Al-Qahtani** — *Zakat al-Fitr fi Daw' al-Kitab wa al-Sunna* (44 pages)
2. **Al-Qaradawi** — *Fiqh al-Zakat*, Bab 7: Zakat al-Fitr (pp. 864–905 of 1062-page encyclopedia)

Key scholarly findings that affect the app:

| Finding | Impact |
|---|---|
| Sa' weight: Qaradawi = 2.156 kg for wheat; Ibn Baz = ~3 kg | Current majority default (2.04 kg for wheat) is one of multiple valid positions |
| Flour (دقيق) is invalid per Shafi'i school | Needs dispute note; valid only under Hanafi/Hanbali |
| Wheat full Sa' vs half Sa': Hanafi uses half Sa' (~1.625 kg) | Already implemented; needs citation |
| Rice/millet/sorghum/semolina: not from explicit hadith | Valid under غالب قوت البلد principle; needs labelling |
| Original 5 hadith foods: dates, barley, raisins, aqit, wheat | Need "From hadith" label |
| Pakistan 1.75 kg flour: Qaradawi flags as potentially too low | Needs scholarly note |
| Cash payment: prohibited per Maliki/Shafi'i/Hanbali; allowed per Hanafi; Qaradawi prefers it | Informational note only (app calculates food amounts) |

---

## Approach

Inline scholarly options surfaced **at the moment of each relevant decision**, not behind a separate "sources" screen. Citations are compact by default and expandable on tap to show the full Arabic quote + translation.

---

## Changes

### 1. Scholar Selector — Step 1 (below country badge)

Move the existing scholar chips from Step 4 (result) to Step 1 (below the country info badge). They appear as soon as a country is selected.

**Each chip shows:**
- Label (e.g., "Ibn Baz / Hanbali")
- Sa' weight it uses (e.g., "3.00 kg/person") — for "Country default" this is dynamic, showing the selected country's primaryFoods[0].kg
- Tappable citation tag: *"Ibn Baz · Majmu' Fatawa"*

Tapping a citation tag opens the **Quote Panel** (see Section 5).

The selected chip drives all downstream kg calculations (same logic as current scholar chips, just moved earlier).

**Default selection:** matches the country's madhab (same as current behavior).

**Hanafi chip sa_kg display:** Shows "1.625 kg (wheat) / 3.25 kg (other)" since Hanafi uses half Sa' for wheat only. The chip label clarifies this rather than showing one ambiguous number.

**Country default chip source:** Citation tag reads *"[Country] Fatwa Council"* and the quote panel shows a general note: "This amount follows the official guidance of [Country]'s religious authorities based on local madhab practice."

---

### 2. Food Row Enhancements — Step 3

Each food row gets two additions:

**a) Madhab validity badge**
Small tag on the food name row showing any dispute. Only rendered when there is a dispute:
- Flour: ⚠ *"Not valid per Shafi'i"* — tappable, opens Quote Panel with al-Shafi'i quote
- All other foods: no badge (clean by default)

**b) Sa' source tag**
Next to the kg-per-person figure: a small tappable label showing the source for that weight. The number shown is the food's effective kg for the active preset (from `effectiveKg()`), not a generic Sa' figure:
- Example: *"2.30 kg · Qaradawi"* for rice when Maliki/Shafi'i is active (rice majorityKg = 2.30)
- Example: *"3.00 kg · Ibn Baz"* for any food when Hanbali is active
- Example: *"1.625 kg · Hanafi (½ Sa')"* for wheat when Hanafi is active
- Opens Quote Panel on tap

---

### 3. Food Picker Enhancements — Step 3 panel

Each food in the picker grid gets a source label below its name:

| Food | Label |
|---|---|
| Dates, Barley, Raisins, Aqit, Wheat | "From hadith · Abu Sa'id, Bukhari/Muslim" |
| Rice, Millet, Sorghum, Semolina | "Local staple principle · Qaradawi / Maliki" |
| Flour | "⚠ Disputed · Not valid per Shafi'i" |

These labels are non-tappable (informational only) to keep the picker lightweight.

---

### 4. Result Enhancements — Step 4

**a) Scholarly basis line**
Directly below the total kg figure:
- EN: *"Based on: Ibn Baz / Hanbali · 3.00 kg per person"*
- AR: *"بناءً على: ابن باز / الحنبلي · 3.00 كغ/شخص"*
- Tappable — opens Quote Panel

**b) Per-food citation tags**
Each breakdown line (e.g., "6.00 kg of Rice for 2 persons") gets a small citation tag. Tappable, opens Quote Panel.

**c) Copy result**
Append scholarly basis to copied text:
```
[existing result lines]
Based on: Ibn Baz / Hanbali (3.00 kg/person)
```

---

### 5. Quote Panel Component (Shared)

Single reusable inline component. Triggered by any citation tap anywhere in the app.

**Behaviour:**
- Renders **inline** (not a modal) — inserts below the trigger element, pushes content down
- Only one panel open at a time — opening another closes the current one
- Closes on ✕ tap, Escape key, or tap outside
- Focus moves into panel on open; returns to trigger on close

**Contents:**
```
[Scholar name] · [Book title] · [Page/hadith reference]
─────────────────────────────────
[Arabic quote — right-aligned, Lora serif, slightly larger]
─────────────────────────────────
[English translation — regular body text]
```

**Accessibility:**
- `role="region"`, `aria-label="Scholar source"`
- Focus trap while open
- Escape closes

---

### 6. Data Model Changes — data.js

#### FOODS — new fields per food entry

```js
{
  // existing fields unchanged...
  source_en: 'From hadith · Abu Sa\'id al-Khudri, Bukhari/Muslim',
  source_ar: 'من الحديث · أبو سعيد الخدري، البخاري/مسلم',
  dispute: {                          // null if no dispute
    madhab: 'shafii',                 // which school disputes it
    note_en: 'Not valid per Shafi\'i school (al-Shafi\'i, al-Umm)',
    note_ar: 'غير جائز عند الشافعية (الشافعي، الأم)',
    quote_en: 'Flour, sawiq and bread are not valid for Zakat al-Fitr.',
    quote_ar: 'لا يجزئ الدقيق والسويق والخبز في زكاة الفطر.',
    ref_en: 'Al-Shafi\'i, al-Umm; Al-Nawawi, al-Majmu\'',
    ref_ar: 'الشافعي، الأم؛ النووي، المجموع',
  }
}
```

#### SCHOLAR_PRESETS — new fields per preset

```js
{
  // existing fields unchanged...
  sa_kg: 2.156,              // Sa' weight this preset uses (for display)
  source_en: 'Qaradawi · Fiqh al-Zakat, Vol. 2 pp. 880–891',
  source_ar: 'القرضاوي · فقه الزكاة، ج٢ ص٨٨٠–٨٩١',
  quote_en: 'The Sa\' equals 2,156 grams by weight. The obligatory amount is one Sa\' from the predominant staple food of the country (غالب قوت البلد).',
  quote_ar: 'الصاع يساوي بالوزن بالجرامات ٢١٥٦. والواجب صاع من غالب قوت البلد.',
}
```

**Scholar preset Sa' weights:**

| Preset | sa_kg | Source |
|---|---|---|
| Country default | (uses country's primaryFoods kg) | Country's fatwa council |
| Maliki / Shafi'i | 2.156 | Qaradawi, Fiqh al-Zakat |
| Hanafi | 3.25 (full); 1.625 (half for wheat) | Hanafi fiqh; Ibn Abidin |
| Ibn Baz / Hanbali | 3.00 | Ibn Baz, Majmu' Fatawa |

---

## Quotes to Implement

### Maliki / Shafi'i (Qaradawi)
- **AR:** *«الصاع يساوي بالوزن بالجرامات ٢١٥٦، والواجب صاع من غالب قوت البلد»*
- **EN:** "The Sa' equals 2,156 grams by weight. The obligatory amount is one Sa' from the predominant staple food of the country."
- **Ref:** Al-Qaradawi, *Fiqh al-Zakat*, Vol. 2, pp. 890–892

### Ibn Baz / Hanbali
- **AR:** *«أما بالكيلو فيقارب ثلاثة كيلو، والأحوط أن يخرج من الكيل»*
- **EN:** "As for kilograms, it is approximately three kilograms. It is more cautious to measure by volume."
- **Ref:** Ibn Baz, *Majmu' Fatawa wa Maqalat*, Vol. 14

### Hanafi (wheat half-Sa')
- **AR:** *«يجزئ نصف صاع من البر عند أبي حنيفة، وهو رأي جماعة من الصحابة»*
- **EN:** "Half a Sa' of wheat suffices according to Abu Hanifa, which was the opinion of a group of Companions."
- **Ref:** Ibn Abidin, *Radd al-Muhtar*; Al-Qaradawi, *Fiqh al-Zakat*, p. 882

### Flour dispute (Shafi'i)
- **AR:** *«لا يجزئ الدقيق والسويق والخبز في زكاة الفطر عند الشافعية»*
- **EN:** "Flour, sawiq, and bread are not valid for Zakat al-Fitr according to the Shafi'i school."
- **Ref:** Al-Shafi'i, *al-Umm*; Al-Nawawi, *al-Majmu'*, Vol. 6

### Local staple principle
- **AR:** *«لو أن قومًا يعيشون على الأرز كانت فطرتهم مما يتقوتون به»*
- **EN:** "If a people live on rice, their Fitrah is from what they eat as their staple."
- **Ref:** Al-Qaradawi, *Fiqh al-Zakat*, p. 892; Maliki principle: *غالب قوت البلد*

### Abu Sa'id hadith (original 5 foods)
- **AR:** *«كنا نخرج زكاة الفطر صاعاً من طعام، أو صاعاً من أقط، أو صاعاً من شعير، أو صاعاً من تمر، أو صاعاً من زبيب»*
- **EN:** "We used to pay Zakat al-Fitr: one Sa' of food, or one Sa' of dried cheese, or one Sa' of barley, or one Sa' of dates, or one Sa' of raisins."
- **Ref:** Abu Sa'id al-Khudri, *Sahih al-Bukhari* #1506, *Sahih Muslim* #985

---

## What Does NOT Change

- The step structure (Country → Family → Food → Result) stays the same
- No new steps added
- Food row person assignment logic unchanged
- Custom food entry unchanged
- Language toggle (EN/AR) and RTL support unchanged
- All existing scholar chip logic reused — chips just move to Step 1 and gain citations

---

## Out of Scope

- Cash payment calculation (informational note only, no new calculator mode)
- Fetus/nisab obligation logic
- Timing reminders (when to pay)
- New countries or foods beyond what's already in data.js
