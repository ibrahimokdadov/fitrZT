"""
Zakat al-Fitr Calculator — demo GIF generator
Shows the scholarly sources feature: scholar chips, quote panel, dispute badge, basis line.
Run: python scripts/gen_demo_gif.py
Output: media/demo.gif
"""

from PIL import Image, ImageDraw, ImageFont
import os, math

# ── Palette (from style.css :root) ─────────────────────────────────────────
BG          = (247, 244, 239)   # hsl(40,28%,95%)
SURFACE     = (255, 255, 255)
SURFACE2    = (253, 251, 248)   # hsl(40,20%,97%)
BORDER      = (235, 229, 218)   # hsl(38,18%,88%)
TEXT        = ( 25,  29,  43)   # hsl(220,18%,14%)
MUTED       = (112, 116, 133)   # hsl(220,8%,48%)
DIMMED      = (163, 165, 174)   # hsl(220,5%,68%)
BLUE        = ( 27,  99, 103)   # hsl(183,62%,30%)
BLUE_BG     = ( 27,  99, 103, 15)
GREEN       = ( 42, 122,  82)   # hsl(153,50%,35%)
PURPLE      = (105,  78, 176)   # hsl(263,42%,52%)
GOLD        = (219, 148,  13)   # hsl(38,88%,48%)
GOLD_BG     = (255, 249, 235)   # hsl(40,100%,96%)
GOLD_TEXT   = ( 76,  51,  15)   # hsl(36,55%,20%)
AMBER_BG    = (255, 244, 222)   # hsl(38,100%,94%)
AMBER_BDR   = (229, 194, 134)   # hsl(38,80%,75%)
AMBER_TEXT  = ( 94,  60,  20)   # hsl(36,60%,30%)
WHITE       = (255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)

W, H = 480, 820
FONT_DIR = "C:/Windows/Fonts/"

# ── Fonts ───────────────────────────────────────────────────────────────────
def F(name, size):
    for f in [name, "segoeui.ttf", "arial.ttf"]:
        try: return ImageFont.truetype(FONT_DIR + f, size)
        except: pass
    return ImageFont.load_default()

def FA(size):
    """Arabic-capable font."""
    for f in ["ARIALUNI.TTF", "arabtype.ttf", "aldhabi.ttf"]:
        try: return ImageFont.truetype(FONT_DIR + f, size)
        except: pass
    return ImageFont.load_default()

f_title    = F("segoeuib.ttf", 18)
f_subtitle = F("segoeui.ttf",  12)
f_label    = F("segoeuib.ttf", 11)
f_body     = F("segoeui.ttf",  13)
f_body_sm  = F("segoeui.ttf",  11)
f_chip     = F("segoeuib.ttf", 12)
f_chip_sm  = F("segoeui.ttf",  10)
f_cite     = F("segoeui.ttf",  10)
f_badge    = F("segoeuib.ttf", 10)
f_arabic   = FA(15)
f_arabic_sm= FA(12)
f_btn      = F("segoeuib.ttf", 12)
f_step_num = F("segoeuib.ttf", 12)
f_result   = F("segoeuib.ttf", 22)

# ── Helpers ──────────────────────────────────────────────────────────────────
def rr(draw, xy, r, fill=None, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)

def txt(draw, pos, text, font, fill=TEXT, anchor="la"):
    draw.text(pos, text, font=font, fill=fill, anchor=anchor)

def tw(draw, text, font):
    return draw.textbbox((0,0), text, font=font)[2]

def wrap(draw, text, font, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if tw(draw, test, font) <= max_w:
            cur = test
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

# ── Component drawers ────────────────────────────────────────────────────────
def draw_bg(img):
    img.paste(BG, [0, 0, W, H])
    draw = ImageDraw.Draw(img)
    # subtle dot texture
    for y in range(0, H, 24):
        for x in range(0, W, 24):
            draw.ellipse([x-1, y-1, x+1, y+1], fill=(180, 168, 148, 60))

def draw_header(draw, y=24):
    txt(draw, (24, y),    "Zakat al-Fitr Calculator", f_title, TEXT)
    txt(draw, (24, y+26), "Calculate your Zakat al-Fitr", f_subtitle, MUTED)
    # AR lang button
    rr(draw, [W-80, y+2, W-24, y+22], 12, fill=SURFACE, outline=BORDER, width=1)
    txt(draw, (W-52, y+12), "AR", f_chip_sm, MUTED, anchor="mm")

def draw_step_card(draw, y, num, label, accent, height, open_=True):
    bot = y + height
    rr(draw, [16, y, W-16, bot], 12, fill=SURFACE, outline=BORDER, width=2)
    # accent left bar
    draw.rectangle([16, y+2, 20, bot-2], fill=accent)
    rr(draw, [16, y, 20, bot], 1, fill=accent)
    # step circle
    rr(draw, [30, y+14, 50, y+34], 10, fill=accent)
    txt(draw, (40, y+24), str(num), f_step_num, WHITE, anchor="mm")
    txt(draw, (58, y+24), label, f_label, TEXT, anchor="lm")
    return bot

def draw_country_badge(draw, y):
    rr(draw, [30, y, W-30, y+28], 8, fill=GOLD_BG, outline=(235, 200, 130), width=1)
    txt(draw, (W//2, y+14), "Suggested: Rice · 3.00 kg/person · Hanbali",
        f_body_sm, GOLD_TEXT, anchor="mm")

def draw_chip(draw, x, y, label, kg_note, active=False, extra_note=""):
    chip_w = tw(draw, label, f_chip) + (tw(draw, kg_note, f_chip_sm) if kg_note else 0) + 36
    fill   = GOLD_BG    if active else SURFACE
    border = GOLD       if active else BORDER
    label_c= GOLD_TEXT  if active else MUTED
    rr(draw, [x, y, x+chip_w, y+28], 14, fill=fill, outline=border, width=2 if active else 1)
    lbl_w = tw(draw, label, f_chip)
    txt(draw, (x+12, y+14), label, f_chip, GOLD_TEXT if active else TEXT, anchor="lm")
    if kg_note:
        txt(draw, (x+14+lbl_w, y+14), f"  {kg_note}", f_chip_sm, GOLD_TEXT if active else MUTED, anchor="lm")
    if extra_note:
        txt(draw, (x+14+lbl_w + tw(draw, f"  {kg_note}", f_chip_sm) + 4, y+14),
            extra_note, f_chip_sm, GOLD_TEXT if active else MUTED, anchor="lm")
    return x + chip_w

def draw_cite_btn(draw, x, y, label, highlight=False):
    btn_w = min(tw(draw, label, f_cite) + 18, 190)
    col = BLUE if highlight else MUTED
    bdr = BLUE if highlight else BORDER
    rr(draw, [x, y, x+btn_w, y+20], 4, fill=SURFACE2, outline=bdr, width=1)
    # book icon
    txt(draw, (x+6, y+10), "📖", f_cite, anchor="lm")
    # label — clip to width
    txt(draw, (x+20, y+10), label[:22]+"…" if tw(draw, label, f_cite)>btn_w-24 else label,
        f_cite, col, anchor="lm")
    return x + btn_w

def draw_quote_panel(draw, y, ref, arabic, english, url=None):
    panel_h = 110 + (18 if url else 0)
    rr(draw, [30, y, W-30, y+panel_h], 8, fill=SURFACE2, outline=BORDER, width=1)
    # ref line + optional link
    txt(draw, (42, y+12), ref[:40]+"…" if len(ref)>40 else ref, f_body_sm, MUTED)
    if url:
        link_x = W - 30 - tw(draw, "View source ↗", f_cite) - 12
        txt(draw, (link_x, y+12), "View source ↗", f_cite, BLUE)
    # divider
    draw.line([(42, y+28), (W-42, y+28)], fill=BORDER, width=1)
    # Arabic (right-aligned)
    lines_ar = wrap(draw, arabic, f_arabic, W-84)
    ay = y + 36
    for line in lines_ar[:2]:
        txt(draw, (W-42, ay), line, f_arabic, TEXT, anchor="ra")
        ay += 20
    # divider
    draw.line([(42, ay+2), (W-42, ay+2)], fill=BORDER, width=1)
    # English
    lines_en = wrap(draw, english, f_body_sm, W-84)
    ey = ay + 10
    for line in lines_en[:2]:
        txt(draw, (42, ey), line, f_body_sm, MUTED)
        ey += 16
    return y + panel_h

def draw_food_row(draw, y, emoji, name, kg, cite_label, dispute=False):
    rr(draw, [30, y, W-30, y+44], 8, fill=SURFACE, outline=BORDER, width=1)
    txt(draw, (44, y+22), emoji,      f_body,    anchor="lm")
    txt(draw, (66, y+22), name,        f_body,    TEXT, anchor="lm")
    if dispute:
        bx = 66 + tw(draw, name, f_body) + 6
        rr(draw, [bx, y+13, bx+110, y+31], 4, fill=AMBER_BG, outline=AMBER_BDR, width=1)
        txt(draw, (bx+6, y+22), "⚠ Not valid per Shafi'i", f_badge, AMBER_TEXT, anchor="lm")
    # kg + cite on right
    kg_x = W - 150
    txt(draw, (kg_x, y+14), kg, f_chip, TEXT, anchor="lm")
    draw_cite_btn(draw, kg_x, y+27, cite_label)
    # subtotal right
    subtotal = kg
    txt(draw, (W-38, y+22), subtotal, f_chip, MUTED, anchor="rm")

def draw_result_card(draw, y, total, preset_label, kg_pp, source):
    card_h = 130
    rr(draw, [16, y, W-16, y+card_h], 12, fill=SURFACE, outline=BORDER, width=2)
    draw.rectangle([16, y+2, 20, y+card_h-2], fill=GOLD)
    rr(draw, [16, y, 20, y+card_h], 1, fill=GOLD)
    txt(draw, (30, y+18), "Total Zakat al-Fitr", f_label, MUTED)
    txt(draw, (30, y+44), total, f_result, TEXT)
    # basis line
    basis = f"Based on: {preset_label} · {kg_pp}"
    txt(draw, (30, y+72), basis, f_body_sm, MUTED)
    draw_cite_btn(draw, 30 + tw(draw, basis, f_body_sm) + 8, y+64, source)
    draw.line([(30, y+90), (W-30, y+90)], fill=BORDER, width=1)
    txt(draw, (30, y+102), "6.00 kg of Rice for 2 persons", f_body_sm, MUTED)
    txt(draw, (30, y+118), "6.00 kg of Wheat for 2 persons", f_body_sm, MUTED)

# ── Scene maker ──────────────────────────────────────────────────────────────
def make_frame(scene):
    img  = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_bg(img)
    draw = ImageDraw.Draw(img)
    draw_header(draw)

    y = 80
    s = scene

    # ── Step 1: Country ─────────────────────────────────────────────────────
    step1_h = 60 if not s.get("country") else (
        300 if s.get("quote_open") else 220 if s.get("chips") else 100
    )
    draw_step_card(draw, y, 1, "Select Country", BLUE, step1_h)

    if s.get("country"):
        # Country select (shown selected)
        rr(draw, [30, y+48, W-30, y+72], 8, fill=SURFACE, outline=BORDER, width=1)
        txt(draw, (44, y+60), s["country"], f_body, TEXT, anchor="lm")
        txt(draw, (W-44, y+60), "▾", f_body, MUTED, anchor="rm")

        draw_country_badge(draw, y+80)
        cy = y + 116

        if s.get("chips"):
            # Scholar method label
            txt(draw, (30, cy), "CALCULATION METHOD", f_badge, DIMMED)
            cy += 18

            presets = [
                ("Country default", "3.00 kg", False, ""),
                ("Maliki / Shafi'i", "2.16 kg", False, ""),
                ("Hanafi",           "3.25 kg", False, "½ Sa' for wheat"),
                ("Ibn Baz / Hanbali","3.00 kg", s.get("ibn_baz_active", False), ""),
            ]
            active_idx = s.get("active_chip", 0)
            for i, (lbl, kg, _, note) in enumerate(presets):
                is_active = (i == active_idx)
                cx = 30
                chip_end = draw_chip(draw, cx, cy, lbl, kg, is_active, note if lbl=="Hanafi" else "")
                cite_lbl = ["Local Fatwa Council", "Qaradawi", "Ibn Abidin", "Ibn Baz"][i]
                draw_cite_btn(draw, chip_end + 8, cy+4, cite_lbl, highlight=(s.get("quote_open") and i == s.get("cite_idx", -1)))

                if s.get("quote_open") and i == s.get("cite_idx", -1):
                    cy += 34
                    refs = [
                        ("Local Fatwa Council", "هذا المقدار يتبع الإرشاد الرسمي للهيئات الدينية.", "This amount follows the official guidance of the country's religious authorities.", None),
                        ("Qaradawi · Fiqh al-Zakat, Vol. 2", "الصاع يساوي بالوزن بالجرامات ٢١٥٦. والواجب صاع من غالب قوت البلد.", "The Sa' equals 2,156 grams. The obligatory amount is one Sa' from the predominant staple food.", "monzer.kahf.com/…fiqhalzakah_vol2.pdf"),
                        ("Ibn Abidin · Radd al-Muhtar", "يجزئ نصف صاع من البر عند أبي حنيفة.", "Half a Sa' of wheat suffices according to Abu Hanifa.", None),
                        ("Ibn Baz · Majmu' Fatawa, Vol. 14", "أما بالكيلو فيقارب ثلاثة كيلو، والأحوط أن يخرج من الكيل.", "As for kilograms, it is approximately three kilograms.", "binbaz.org.sa/fatwas/5912/…"),
                    ]
                    ref, ar, en, url = refs[i]
                    draw_quote_panel(draw, cy, ref, ar, en, url)
                    cy += 128
                else:
                    cy += 34

    y += step1_h + 14

    # ── Step 2: Family ───────────────────────────────────────────────────────
    if s.get("show_step2"):
        draw_step_card(draw, y, 2, "Family Members", GREEN, 62)
        rr(draw, [W//2-50, y+38, W//2+50, y+58], 8, fill=SURFACE, outline=BORDER, width=1)
        txt(draw, (W//2-30, y+48), "−", f_btn, MUTED, anchor="lm")
        txt(draw, (W//2,    y+48), "4", f_body, TEXT, anchor="mm")
        txt(draw, (W//2+18, y+48), "+", f_btn, MUTED, anchor="lm")
        y += 76

    # ── Step 3: Food ─────────────────────────────────────────────────────────
    if s.get("show_step3"):
        food_rows = s.get("food_rows", [])
        step3_h = 64 + len(food_rows) * 58 + (130 if s.get("food_quote_open") else 0)
        draw_step_card(draw, y, 3, "Food", PURPLE, step3_h)
        ry = y + 48
        cite_lbl = ["Country default", "Maliki / Shafi'i", "Hanafi", "Ibn Baz"][s.get("active_chip", 0)]
        cite_short = ["Local Fatwa", "Qaradawi", "Ibn Abidin", "Ibn Baz"][s.get("active_chip", 0)]
        for fi, (emoji, name, kg, dispute) in enumerate(food_rows):
            draw_food_row(draw, ry, emoji, name, kg, cite_short, dispute)
            if s.get("food_quote_open") and fi == s.get("food_cite_idx", -1):
                ry += 48
                draw_quote_panel(draw, ry,
                    "Ibn Baz · Majmu' Fatawa, Vol. 14",
                    "أما بالكيلو فيقارب ثلاثة كيلو، والأحوط أن يخرج من الكيل.",
                    "As for kilograms, approximately three kilograms.",
                    "binbaz.org.sa/fatwas/5912/…")
                ry += 124
            elif s.get("flour_quote_open") and name == "Flour":
                ry += 48
                draw_quote_panel(draw, ry,
                    "Al-Shafi'i, al-Umm; Al-Nawawi, al-Majmu'",
                    "لا يجزئ الدقيق والسويق والخبز في زكاة الفطر عند الشافعية.",
                    "Flour, sawiq, and bread are not valid for Zakat al-Fitr according to the Shafi'i school.",
                    "islamqa.info/en/answers/99743/…")
                ry += 124
            else:
                ry += 50
        # Add food button
        rr(draw, [30, ry, W-30, ry+30], 8, fill=SURFACE2, outline=BORDER, width=1)
        txt(draw, (W//2, ry+15), "+ Add food type", f_body_sm, MUTED, anchor="mm")
        y += step3_h + 14

    # ── Step 4: Result ────────────────────────────────────────────────────────
    if s.get("show_result"):
        presets = ["Country default", "Maliki / Shafi'i", "Hanafi", "Ibn Baz / Hanbali"]
        sources = ["Local Fatwa", "Qaradawi", "Ibn Abidin", "Ibn Baz"]
        ai = s.get("active_chip", 0)
        draw_result_card(draw, y, "12.00 kg", presets[ai], "3.00 kg/person", sources[ai])

    return img


# ── Scene list ───────────────────────────────────────────────────────────────
scenes = [
    # 1. App open — empty state
    (dict(country=None), 1200),
    # 2. Country selected — Saudi Arabia
    (dict(country="Saudi Arabia"), 900),
    # 3. Scholar chips appear
    (dict(country="Saudi Arabia", chips=True, active_chip=0), 1400),
    # 4. Tap Ibn Baz cite-tag — quote panel opens
    (dict(country="Saudi Arabia", chips=True, active_chip=0, quote_open=True, cite_idx=3), 2200),
    # 5. Close panel, click Ibn Baz chip (active)
    (dict(country="Saudi Arabia", chips=True, active_chip=3), 900),
    # 6. Chips + step 2 visible
    (dict(country="Saudi Arabia", chips=True, active_chip=3, show_step2=True), 900),
    # 7. Step 3 — food rows (rice + wheat) appear
    (dict(country="Saudi Arabia", chips=True, active_chip=3, show_step2=True, show_step3=True,
          food_rows=[("🍚","Rice","3.00 kg",False),("🌾","Wheat","3.00 kg",False)]), 1400),
    # 8. Tap rice row cite-tag — Ibn Baz quote opens
    (dict(country="Saudi Arabia", chips=True, active_chip=3, show_step2=True, show_step3=True,
          food_rows=[("🍚","Rice","3.00 kg",False),("🌾","Wheat","3.00 kg",False)],
          food_quote_open=True, food_cite_idx=0), 2000),
    # 9. Close — add flour row with dispute
    (dict(country="Saudi Arabia", chips=True, active_chip=3, show_step2=True, show_step3=True,
          food_rows=[("🍚","Rice","3.00 kg",False),("🌾","Wheat","3.00 kg",False),("🌾","Flour","3.00 kg",True)]), 1200),
    # 10. Tap flour dispute badge — Shafi'i quote
    (dict(country="Saudi Arabia", chips=True, active_chip=3, show_step2=True, show_step3=True,
          food_rows=[("🍚","Rice","3.00 kg",False),("🌾","Wheat","3.00 kg",False),("🌾","Flour","3.00 kg",True)],
          flour_quote_open=True), 2200),
    # 11. Result appears
    (dict(country="Saudi Arabia", chips=True, active_chip=3, show_step2=True, show_step3=True,
          food_rows=[("🍚","Rice","3.00 kg",False),("🌾","Wheat","3.00 kg",False)],
          show_result=True), 2400),
    # 12. Switch to Maliki/Shafi'i chip — result updates
    (dict(country="Saudi Arabia", chips=True, active_chip=1, show_step2=True, show_step3=True,
          food_rows=[("🍚","Rice","2.30 kg",False),("🌾","Wheat","2.04 kg",False)],
          show_result=True), 2000),
    # 13. Tap Qaradawi cite in result — panel opens (reuse quote_open trick)
    (dict(country="Saudi Arabia", chips=True, active_chip=1, show_step2=True, show_step3=True,
          food_rows=[("🍚","Rice","2.30 kg",False),("🌾","Wheat","2.04 kg",False)],
          show_result=True, quote_open=True, cite_idx=1), 2200),
    # 14. Back to clean result state — pause before loop
    (dict(country="Saudi Arabia", chips=True, active_chip=0, show_step2=True, show_step3=True,
          food_rows=[("🍚","Rice","3.00 kg",False),("🌾","Wheat","3.00 kg",False)],
          show_result=True), 1800),
]

# ── Render ───────────────────────────────────────────────────────────────────
print("Rendering frames…")
frames    = [make_frame(s) for s, _ in scenes]
durations = [d for _, d in scenes]

print("Quantizing…")
quant = [f.quantize(colors=128, method=Image.Quantize.FASTOCTREE) for f in frames]

OUT = "C:/Users/ibrah/cascadeProjects/fitrZT/media/demo.gif"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

quant[0].save(
    OUT,
    save_all=True,
    append_images=quant[1:],
    duration=durations,
    loop=0,
    optimize=True,
)

size_mb = os.path.getsize(OUT) / 1_000_000
print(f"Saved: {OUT}  ({size_mb:.2f} MB, {len(frames)} frames)")

if size_mb > 3:
    print("Over 3 MB — re-quantizing to 64 colors…")
    quant64 = [f.quantize(colors=64, method=Image.Quantize.FASTOCTREE) for f in frames]
    quant64[0].save(OUT, save_all=True, append_images=quant64[1:],
                    duration=durations, loop=0, optimize=True)
    print(f"Re-saved: {os.path.getsize(OUT)/1_000_000:.2f} MB")
