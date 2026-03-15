"""
Eğitim Katılım Tutanağı PDF Üretici
Orijinal PDF form düzenine birebir uygun PDF oluşturur.
"""
import os
import io
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm, cm
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ---------- Font Setup ----------
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

def _register_fonts():
    """Register a Unicode-capable font. Falls back to Helvetica if none found."""
    candidates = [
        ("DejaVuSans", "DejaVuSans.ttf"),
        ("DejaVuSans-Bold", "DejaVuSans-Bold.ttf"),
    ]
    # Try common system paths
    search_dirs = [
        os.path.join(BASE_DIR, "fonts"),
        r"C:\Windows\Fonts",
        "/usr/share/fonts/truetype/dejavu",
        "/usr/share/fonts/dejavu",
    ]
    registered = {}
    for font_name, font_file in candidates:
        for d in search_dirs:
            path = os.path.join(d, font_file)
            if os.path.exists(path):
                try:
                    pdfmetrics.registerFont(TTFont(font_name, path))
                    registered[font_name] = True
                except:
                    pass
                break
    # Windows fallback: try Arial
    if "DejaVuSans" not in registered:
        for name, fname in [("DejaVuSans", "arial.ttf"), ("DejaVuSans-Bold", "arialbd.ttf")]:
            try:
                path = os.path.join(r"C:\Windows\Fonts", fname)
                if os.path.exists(path):
                    pdfmetrics.registerFont(TTFont(name, path))
                    registered[name] = True
            except:
                pass
    return "DejaVuSans" in registered

_HAS_UNICODE_FONT = _register_fonts()
FONT = "DejaVuSans" if _HAS_UNICODE_FONT else "Helvetica"
FONT_BOLD = "DejaVuSans-Bold" if _HAS_UNICODE_FONT else "Helvetica-Bold"

# ---------- Layout Constants ----------
PAGE_W, PAGE_H = landscape(A4)  # 841.8 x 595.2
MARGIN_LEFT = 12 * mm
MARGIN_RIGHT = 12 * mm
MARGIN_TOP = 10 * mm
MARGIN_BOTTOM = 8 * mm
USABLE_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT

# Curriculum data (exactly matches original form)
LEFT_CURRICULUM = [
    ("1", "GENEL KONULAR", True, "", "", ""),
    ("110", "a) Çalışma mevzuatı ile ilgili bilgiler,", False, "50", "", ""),
    ("120", "b) Çalışanların yasal hak ve sorumlulukları,", False, "50", "", ""),
    ("130", "c) İşyeri temizliği ve düzeni,", False, "50", "", ""),
    ("140", "ç) İş kazası ve meslek hastalığından doğan hukuki sonuçlar,", False, "50", "", ""),
    ("2", "SAĞLIK KONULARI", True, "", "", ""),
    ("210", "a) Meslek hastalıklarının sebepleri,", False, "", "", "60"),
    ("220", "b) Hastalıktan korunma prensipleri ve korunma tekniklerinin uygulanması,", False, "", "", "30"),
    ("230", "c) Biyolojik ve psikososyal risk etmenleri,", False, "", "", "45"),
    ("240", "ç) İlkyardım,", False, "", "", "60"),
    ("250", "d) Tütün ürünlerinin zararları ve pasif etkilenim,", False, "", "", "45"),
    ("", "", False, "", "", ""),
    ("4", "DİĞER KONULAR", True, "", "", ""),
    ("", "", False, "", "", ""),
    ("", "", False, "", "", ""),
]

RIGHT_CURRICULUM = [
    ("3", "TEKNİK KONULAR", True, "", "", ""),
    ("310", "a) Kimyasal, fiziksel ve ergonomik risk etmenleri,", False, "40", "", ""),
    ("320", "b) Elle kaldırma ve taşıma,", False, "40", "", ""),
    ("330", "c) Parlama, patlama, yangın ve yangından korunma,", False, "40", "", ""),
    ("340", "ç) İş ekipmanlarının güvenli kullanımı,", False, "40", "", ""),
    ("350", "d) Ekranlı araçlarla çalışma,", False, "", "30", ""),
    ("360", "e) Elektrik, tehlikeleri, riskleri ve önlemleri,", False, "", "50", ""),
    ("370", "f) İş kazalarının sebepleri ve korunma prensipleri ile tekniklerinin uygulanması,", False, "", "50", ""),
    ("380", "g) Güvenlik ve sağlık işaretleri,", False, "", "40", ""),
    ("390", "ğ) Kişisel koruyucu donanım kullanımı,", False, "60", "", ""),
    ("395", "h) İş sağlığı ve güvenliği genel kuralları ve güvenlik kültürü,", False, "60", "", ""),
    ("399", "ı) Tahliye ve kurtarma,", False, "", "40", ""),
    ("4", "DİĞER KONULAR", True, "", "", ""),
    ("", "1-Yüksekte çalışma", False, "", "30", ""),
    ("", "", False, "", "", ""),
]

ROWS_PER_PAGE = 7  # participant rows per page (as in original)


def generate_training_pdf(company_name, sgk_no, participants, trainer_name="",
                          date1="", date2="", date3=""):
    """
    Generate a training participation form PDF.
    
    participants: list of dicts with keys: tcKimlikNo, adSoyad, gorevi
    Returns: bytes of the PDF
    """
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=landscape(A4))

    # Split participants into pages of ROWS_PER_PAGE
    pages_data = []
    for i in range(0, max(len(participants), 1), ROWS_PER_PAGE):
        pages_data.append(participants[i:i + ROWS_PER_PAGE])
    if not pages_data:
        pages_data = [[]]

    for page_idx, page_participants in enumerate(pages_data):
        if page_idx > 0:
            c.showPage()
        _draw_page(c, company_name, sgk_no, page_participants,
                   trainer_name, date1, date2, date3,
                   page_idx + 1, len(pages_data))

    c.save()
    buf.seek(0)
    return buf.getvalue()


def _draw_page(c, company_name, sgk_no, participants,
               trainer_name, date1, date2, date3,
               page_num, total_pages):
    """Draw a single page of the form."""
    y = PAGE_H - MARGIN_TOP

    # ===== TITLE =====
    c.setFont(FONT_BOLD, 11)
    c.drawCentredString(PAGE_W / 2, y, "TEMEL İŞ SAĞLIĞI VE GÜVENLİĞİ EĞİTİMİ KATILIM TUTANAĞI")
    y -= 14

    # ===== CURRICULUM TABLE =====
    cur_y = _draw_curriculum_table(c, y)

    # ===== COMPANY INFO ROW =====
    cur_y -= 2
    _draw_company_row(c, cur_y, company_name, sgk_no)
    cur_y -= 14

    # ===== PARTICIPANT TABLE =====
    cur_y = _draw_participant_table(c, cur_y, participants, date1, date2, date3)

    # ===== TRAINER ROW =====
    cur_y -= 2
    c.setFont(FONT_BOLD, 6.5)
    c.drawString(MARGIN_LEFT + 2, cur_y, "EĞİTMENLER")
    c.setFont(FONT, 6.5)
    c.drawString(MARGIN_LEFT + 60, cur_y, trainer_name)

    # Page number
    if total_pages > 1:
        c.setFont(FONT, 6)
        c.drawRightString(PAGE_W - MARGIN_RIGHT, MARGIN_BOTTOM,
                          f"Sayfa {page_num}/{total_pages}")


def _draw_curriculum_table(c, y_start):
    """Draw the two-column curriculum table matching original layout."""
    half_w = USABLE_W / 2
    left_x = MARGIN_LEFT
    right_x = MARGIN_LEFT + half_w

    # Column widths for each half
    code_w = 20 * mm
    s1_w = 14 * mm
    s2_w = 14 * mm
    s3_w = 14 * mm
    topic_w = half_w - code_w - s1_w - s2_w - s3_w

    row_h = 11
    header_h = 18

    # Draw header
    c.setFont(FONT_BOLD, 5.5)
    
    # Left header
    _draw_cell_rect(c, left_x, y_start, code_w, header_h, "Eğitim\nKodu", True, align='center', font_size=5.5)
    _draw_cell_rect(c, left_x + code_w, y_start, topic_w, header_h, "Eğitim Konuları", True, align='center', font_size=5.5)
    _draw_cell_rect(c, left_x + code_w + topic_w, y_start, s1_w, header_h, "1.Eğitim\nSüre (dk)", True, align='center', font_size=5)
    _draw_cell_rect(c, left_x + code_w + topic_w + s1_w, y_start, s2_w, header_h, "2.Eğitim\nSüre (dk)", True, align='center', font_size=5)
    _draw_cell_rect(c, left_x + code_w + topic_w + s1_w + s2_w, y_start, s3_w, header_h, "3.Eğitim\nSüre (dk)", True, align='center', font_size=5)
    
    # Right header
    _draw_cell_rect(c, right_x, y_start, code_w, header_h, "Eğitim\nKodu", True, align='center', font_size=5.5)
    _draw_cell_rect(c, right_x + code_w, y_start, topic_w, header_h, "Eğitim Konuları", True, align='center', font_size=5.5)
    _draw_cell_rect(c, right_x + code_w + topic_w, y_start, s1_w, header_h, "1.Eğitim\nSüre (dk)", True, align='center', font_size=5)
    _draw_cell_rect(c, right_x + code_w + topic_w + s1_w, y_start, s2_w, header_h, "2.Eğitim\nSüre (dk)", True, align='center', font_size=5)
    _draw_cell_rect(c, right_x + code_w + topic_w + s1_w + s2_w, y_start, s3_w, header_h, "3.Eğitim\nSüre (dk)", True, align='center', font_size=5)

    y = y_start - header_h

    # Draw curriculum rows
    for i in range(len(LEFT_CURRICULUM)):
        left = LEFT_CURRICULUM[i]
        right = RIGHT_CURRICULUM[i]

        l_code, l_topic, l_bold, l_s1, l_s2, l_s3 = left
        r_code, r_topic, r_bold, r_s1, r_s2, r_s3 = right

        l_font = FONT_BOLD if l_bold else FONT
        r_font = FONT_BOLD if r_bold else FONT
        fs = 5.5

        # Left side
        _draw_cell_rect(c, left_x, y, code_w, row_h, l_code, False, align='center', font_size=fs, font_name=l_font)
        _draw_cell_rect(c, left_x + code_w, y, topic_w, row_h, l_topic, False, align='left', font_size=fs, font_name=l_font)
        _draw_cell_rect(c, left_x + code_w + topic_w, y, s1_w, row_h, l_s1, False, align='center', font_size=fs)
        _draw_cell_rect(c, left_x + code_w + topic_w + s1_w, y, s2_w, row_h, l_s2, False, align='center', font_size=fs)
        _draw_cell_rect(c, left_x + code_w + topic_w + s1_w + s2_w, y, s3_w, row_h, l_s3, False, align='center', font_size=fs)

        # Right side
        _draw_cell_rect(c, right_x, y, code_w, row_h, r_code, False, align='center', font_size=fs, font_name=r_font)
        _draw_cell_rect(c, right_x + code_w, y, topic_w, row_h, r_topic, False, align='left', font_size=fs, font_name=r_font)
        _draw_cell_rect(c, right_x + code_w + topic_w, y, s1_w, row_h, r_s1, False, align='center', font_size=fs)
        _draw_cell_rect(c, right_x + code_w + topic_w + s1_w, y, s2_w, row_h, r_s2, False, align='center', font_size=fs)
        _draw_cell_rect(c, right_x + code_w + topic_w + s1_w + s2_w, y, s3_w, row_h, r_s3, False, align='center', font_size=fs)

        y -= row_h

    return y


def _draw_company_row(c, y, company_name, sgk_no):
    """Draw the company name and SGK row."""
    half_w = USABLE_W / 2

    # Left: EĞİTİMİ ALAN FİRMA
    c.setFont(FONT_BOLD, 6.5)
    c.rect(MARGIN_LEFT, y - 13, half_w, 13, stroke=1, fill=0)
    c.drawString(MARGIN_LEFT + 3, y - 10, "EĞİTİMİ ALAN FİRMA")
    c.setFont(FONT, 6.5)
    # Firma adı - uzunsa küçült
    name_fs = 6.5
    name_w = c.stringWidth(company_name, FONT, name_fs)
    max_w = half_w - 110
    while name_w > max_w and name_fs > 4:
        name_fs -= 0.3
        name_w = c.stringWidth(company_name, FONT, name_fs)
    c.setFont(FONT, name_fs)
    c.drawString(MARGIN_LEFT + 105, y - 10, company_name)

    # Right: İŞYERİ SGK NO
    c.setFont(FONT_BOLD, 6.5)
    c.rect(MARGIN_LEFT + half_w, y - 13, half_w, 13, stroke=1, fill=0)
    c.drawString(MARGIN_LEFT + half_w + 3, y - 10, "İŞYERİ SGK NO")
    c.setFont(FONT, 6.5)
    c.drawString(MARGIN_LEFT + half_w + 80, y - 10, sgk_no)


def _draw_participant_table(c, y_start, participants, date1, date2, date3):
    """Draw the participant table matching original layout."""
    # Column widths
    no_w = 16 * mm
    tc_w = 42 * mm
    name_w = 55 * mm
    job_w = 40 * mm
    date_w = 32 * mm
    sig_w = (USABLE_W - no_w - tc_w - name_w - job_w - date_w * 3 - 3) / 3
    # Adjust to fill
    total = no_w + tc_w + name_w + job_w + (date_w + sig_w) * 3
    leftover = USABLE_W - total
    name_w += leftover  # give extra to name column

    cols = [no_w, tc_w, name_w, job_w, date_w, sig_w, date_w, sig_w, date_w, sig_w]
    header_h = 14
    row_h = 15

    x = MARGIN_LEFT
    y = y_start

    # Header
    headers = ["No", "TC Kimlik No", "Adı Soyadı", "Görevi",
               "1.Eğitim Tarihi", "İmza", "2.Eğitim Tarihi", "İmza",
               "3.Eğitim Tarihi", "İmza"]

    c.setFont(FONT_BOLD, 5.5)
    cx = x
    for i, hdr in enumerate(headers):
        _draw_cell_rect(c, cx, y, cols[i], header_h, hdr, True, align='center', font_size=5.5)
        cx += cols[i]
    y -= header_h

    # Participant rows
    c.setFont(FONT, 6)
    for row_idx in range(ROWS_PER_PAGE):
        cx = x
        if row_idx < len(participants):
            p = participants[row_idx]
            row_data = [
                str(row_idx + 1),
                p.get('tcKimlikNo', ''),
                p.get('adSoyad', ''),
                p.get('gorevi', ''),
                date1, "",
                date2, "",
                date3, ""
            ]
        else:
            row_data = [str(row_idx + 1), "", "", "", "", "", "", "", "", ""]

        for i, val in enumerate(row_data):
            align = 'center' if i in (0, 4, 5, 6, 7, 8, 9) else 'left'
            fs = 6
            if i == 1:  # TC
                fs = 5.5
            if i == 2:  # Name - auto-shrink
                tw = c.stringWidth(val, FONT, fs)
                while tw > cols[i] - 4 and fs > 3.5:
                    fs -= 0.3
                    tw = c.stringWidth(val, FONT, fs)
            _draw_cell_rect(c, cx, y, cols[i], row_h, val, False, align=align, font_size=fs)
            cx += cols[i]
        y -= row_h

    return y


def _draw_cell_rect(c, x, y, w, h, text, is_header=False,
                    align='left', font_size=6, font_name=None):
    """Draw a cell rectangle with text."""
    # Draw border
    c.setLineWidth(0.4)
    c.rect(x, y - h, w, h, stroke=1, fill=0)

    if not text:
        return

    fn = font_name or (FONT_BOLD if is_header else FONT)
    c.setFont(fn, font_size)

    # Handle multi-line
    lines = text.split('\n')
    line_h = font_size + 1.5
    total_text_h = len(lines) * line_h
    start_y = y - (h - total_text_h) / 2 - font_size + 1

    for i, line in enumerate(lines):
        ly = start_y - i * line_h
        if align == 'center':
            c.drawCentredString(x + w / 2, ly, line)
        elif align == 'right':
            c.drawRightString(x + w - 2, ly, line)
        else:
            c.drawString(x + 2, ly, line)
