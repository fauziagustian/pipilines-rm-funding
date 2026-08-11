#!/usr/bin/env python3
"""Generate the downloadable sample RM Funding management report."""

from __future__ import annotations

import argparse
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    HRFlowable,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


NAVY = colors.HexColor("#102C4D")
BLUE = colors.HexColor("#1769C2")
BLUE_SOFT = colors.HexColor("#EDF5FD")
GREEN = colors.HexColor("#198E5D")
GREEN_SOFT = colors.HexColor("#EAF7F1")
ORANGE = colors.HexColor("#C97925")
ORANGE_SOFT = colors.HexColor("#FFF3E7")
RED = colors.HexColor("#B84A4A")
RED_SOFT = colors.HexColor("#FFF0F0")
INK = colors.HexColor("#1E2B3C")
MUTED = colors.HexColor("#6F7B8C")
LINE = colors.HexColor("#E3E8EE")
CANVAS = colors.HexColor("#F5F7FA")
WHITE = colors.white


def register_fonts() -> tuple[str, str]:
    candidates = [
        (
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        ),
        (
            "/Library/Fonts/Arial.ttf",
            "/Library/Fonts/Arial Bold.ttf",
        ),
    ]
    for regular_path, bold_path in candidates:
        if Path(regular_path).exists() and Path(bold_path).exists():
            pdfmetrics.registerFont(TTFont("ReportSans", regular_path))
            pdfmetrics.registerFont(TTFont("ReportSansBold", bold_path))
            return "ReportSans", "ReportSansBold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


class ProgressBars(Flowable):
    def __init__(self, rows: list[tuple[str, float, str]], width: float = 470, height: float = 94):
        super().__init__()
        self.rows = rows
        self.width = width
        self.height = height

    def draw(self) -> None:
        canvas = self.canv
        bar_x = 118
        bar_w = self.width - 188
        y = self.height - 14
        for label, value, amount in self.rows:
            canvas.setFont(FONT, 8)
            canvas.setFillColor(MUTED)
            canvas.drawString(0, y - 2, label)
            canvas.setFillColor(colors.HexColor("#E8EDF2"))
            canvas.roundRect(bar_x, y - 5, bar_w, 7, 3.5, fill=1, stroke=0)
            canvas.setFillColor(BLUE if value >= 80 else ORANGE)
            canvas.roundRect(bar_x, y - 5, max(7, bar_w * value / 100), 7, 3.5, fill=1, stroke=0)
            canvas.setFont(FONT_BOLD, 8)
            canvas.setFillColor(INK)
            canvas.drawRightString(self.width, y - 2, f"{value:.1f}%  |  {amount}")
            y -= 28


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName=FONT_BOLD,
            fontSize=25,
            leading=29,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=8,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=9.5,
            leading=14,
            textColor=MUTED,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Heading2"],
            fontName=FONT_BOLD,
            fontSize=14,
            leading=17,
            textColor=INK,
            spaceBefore=4,
            spaceAfter=9,
        ),
        "kicker": ParagraphStyle(
            "Kicker",
            parent=base["BodyText"],
            fontName=FONT_BOLD,
            fontSize=7.5,
            leading=10,
            textColor=BLUE,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=8.5,
            leading=12.5,
            textColor=INK,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=7,
            leading=10,
            textColor=MUTED,
        ),
        "small_bold": ParagraphStyle(
            "SmallBold",
            parent=base["BodyText"],
            fontName=FONT_BOLD,
            fontSize=7.5,
            leading=10,
            textColor=INK,
        ),
        "metric": ParagraphStyle(
            "Metric",
            parent=base["BodyText"],
            fontName=FONT_BOLD,
            fontSize=13.5,
            leading=16,
            textColor=INK,
        ),
        "table_header": ParagraphStyle(
            "TableHeader",
            parent=base["BodyText"],
            fontName=FONT_BOLD,
            fontSize=7.5,
            leading=10,
            textColor=WHITE,
        ),
        "badge": ParagraphStyle(
            "Badge",
            parent=base["BodyText"],
            fontName=FONT_BOLD,
            fontSize=8,
            leading=9,
            textColor=WHITE,
            alignment=TA_CENTER,
        ),
        "center_small": ParagraphStyle(
            "CenterSmall",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=7,
            leading=9,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
        "right_small": ParagraphStyle(
            "RightSmall",
            parent=base["BodyText"],
            fontName=FONT,
            fontSize=7,
            leading=9,
            textColor=MUTED,
            alignment=TA_RIGHT,
        ),
    }


ST = styles()


def p(text: str, style: str = "body") -> Paragraph:
    return Paragraph(text, ST[style])


def section(kicker: str, title: str) -> list[Flowable]:
    return [p(kicker.upper(), "kicker"), p(title, "section")]


def metric_cell(label: str, value: str, note: str, tone: colors.Color = BLUE_SOFT) -> Table:
    card = Table(
        [[p(label, "small")], [p(value, "metric")], [p(note, "small")]],
        colWidths=[38 * mm],
        rowHeights=[6 * mm, 8 * mm, 7 * mm],
    )
    card.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), tone),
                ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                ("ROUNDEDCORNERS", [7]),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    return card


def data_table(rows, widths, header=True, align_right_columns=()):
    converted = []
    for row_index, row in enumerate(rows):
        converted.append(
            [
                p(str(value), "table_header" if header and row_index == 0 else "small")
                for value in row
            ]
        )
    table = Table(converted, colWidths=widths, repeatRows=1 if header else 0)
    commands = [
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("BACKGROUND", (0, 0), (-1, 0), NAVY if header else WHITE),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE if header else INK),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, CANVAS]),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    for col in align_right_columns:
        commands.append(("ALIGN", (col, 1 if header else 0), (col, -1), "RIGHT"))
    table.setStyle(TableStyle(commands))
    return table


def callout(title: str, body: str, color=BLUE_SOFT, accent=BLUE):
    box = Table([[p(title, "small_bold"), p(body, "small")]], colWidths=[42 * mm, 128 * mm])
    box.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), color),
                ("BOX", (0, 0), (-1, -1), 0.7, accent),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return box


def numbered_recommendations(items: list[tuple[str, str]]) -> Table:
    rows = []
    for index, (title, body) in enumerate(items, start=1):
        badge = Table([[p(str(index), "badge")]], colWidths=[8 * mm], rowHeights=[8 * mm])
        badge.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), BLUE),
                    ("TEXTCOLOR", (0, 0), (-1, -1), WHITE),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("ROUNDEDCORNERS", [4]),
                ]
            )
        )
        rows.append([badge, p(f"<b>{title}</b><br/>{body}", "body")])
    table = Table(rows, colWidths=[11 * mm, 159 * mm], rowHeights=[18 * mm] * len(rows))
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LINEBELOW", (0, 0), (-1, -2), 0.45, LINE),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def page_chrome(canvas, doc):
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 14 * mm, width, 14 * mm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont(FONT_BOLD, 9)
    canvas.drawString(20 * mm, height - 9 * mm, "PIPELINE RM FUNDING")
    canvas.setFont(FONT, 7)
    canvas.drawRightString(width - 20 * mm, height - 9 * mm, "BRI JATINEGARA | SAMPLE REPORT")

    canvas.setStrokeColor(LINE)
    canvas.line(20 * mm, 15 * mm, width - 20 * mm, 15 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont(FONT, 6.5)
    canvas.drawString(20 * mm, 10 * mm, "DEMO - BUKAN DATA RESMI BANK")
    canvas.drawCentredString(width / 2, 10 * mm, "Periode 1-11 Agustus 2026")
    canvas.drawRightString(width - 20 * mm, 10 * mm, f"Halaman {doc.page}")
    canvas.restoreState()


def build_report(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(output_path),
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=22 * mm,
        bottomMargin=22 * mm,
        title="Sample Laporan Kinerja RM Funding BRI Jatinegara",
        author="Demo Pipeline RM Funding",
        subject="Sample laporan dari fitur aplikasi Pipeline RM Funding",
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        id="content",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="report", frames=[frame], onPage=page_chrome)])

    story: list[Flowable] = []
    story.extend(
        [
            Spacer(1, 4 * mm),
            p("LAPORAN MANAJEMEN CABANG", "kicker"),
            p("Kinerja RM Funding<br/>BRI Jatinegara", "title"),
            p(
                "Sample laporan terpadu yang menggabungkan dashboard capaian, pipeline, kunjungan harian, bukti aktivitas, tindak lanjut, dan manajemen data.",
                "subtitle",
            ),
            Spacer(1, 5 * mm),
            callout(
                "Status dokumen",
                "Dokumen ini menggunakan data simulasi frontend untuk keperluan demo dan pembahasan rancangan aplikasi. Angka tidak boleh diperlakukan sebagai data operasional resmi BRI.",
                ORANGE_SOFT,
                ORANGE,
            ),
            Spacer(1, 7 * mm),
        ]
    )
    story.extend(section("Ringkasan eksekutif", "Kondisi kinerja sampai 11 Agustus 2026"))
    metrics = Table(
        [[
            metric_cell("Total pipeline", "Rp297,45 M", "154 pipeline aktif", BLUE_SOFT),
            metric_cell("Realisasi target", "72,4%", "Rp215,30 M", GREEN_SOFT),
            metric_cell("Kunjungan", "196", "174 disetujui", ORANGE_SOFT),
            metric_cell("Penyimpanan", "1,51 GB", "estimasi per bulan", colors.HexColor("#F2EFFC")),
        ]],
        colWidths=[42.5 * mm] * 4,
    )
    metrics.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 2), ("RIGHTPADDING", (0, 0), (-1, -1), 2)]))
    story.extend(
        [
            metrics,
            Spacer(1, 6 * mm),
            p(
                "Realisasi funding berada pada 72,4% dari target periode. Pipeline aktif masih memberikan ruang konversi sebesar Rp297,45 M, dengan Rp80,35 M berada pada kategori Hot. Fokus manajemen disarankan pada percepatan 16 prospek Hot, penyelesaian 23 tindak lanjut, dan perbaikan 8 laporan kunjungan.",
                "body",
            ),
            Spacer(1, 6 * mm),
            HRFlowable(width="100%", thickness=0.6, color=LINE),
            Spacer(1, 5 * mm),
        ]
    )
    story.extend(section("Capaian produk", "Perbandingan target dan realisasi"))
    story.extend(
        [
            ProgressBars(
                [
                    ("Giro", 78.6, "Rp86,5 M"),
                    ("Tabungan", 68.2, "Rp54,6 M"),
                    ("Deposito", 70.7, "Rp74,2 M"),
                ],
                width=170 * mm,
                height=29 * mm,
            ),
            Spacer(1, 3 * mm),
            callout(
                "Kesimpulan pimpinan",
                "Giro menjadi kontributor realisasi terkuat. Deposito memiliki nilai pipeline Hot terbesar dan perlu dikawal sampai tanggal komitmen. Tabungan membutuhkan penambahan prospek baru serta follow-up lebih rapat.",
                BLUE_SOFT,
                BLUE,
            ),
        ]
    )

    story.append(PageBreak())
    story.extend(section("Pipeline funding", "Komposisi peluang dan prioritas tindak lanjut"))
    pipeline_rows = [
        ["Status", "Jumlah", "Nilai", "Porsi", "Arah tindak lanjut"],
        ["Hot", "16", "Rp80,35 M", "27,0%", "Kawal komitmen maksimal 7 hari"],
        ["Warm", "91", "Rp169,10 M", "56,8%", "Lengkapi kebutuhan dan jadwal follow-up"],
        ["Cold", "47", "Rp48,00 M", "16,2%", "Validasi ulang minat dan potensi"],
        ["Total", "154", "Rp297,45 M", "100%", "Weighted pipeline Rp181,62 M"],
    ]
    story.extend(
        [
            data_table(pipeline_rows, [28 * mm, 20 * mm, 30 * mm, 22 * mm, 70 * mm], align_right_columns=(1, 2, 3)),
            Spacer(1, 6 * mm),
        ]
    )
    story.extend(section("Performa RM", "Contoh leaderboard untuk rapat evaluasi"))
    rm_rows = [
        ["RM Funding", "Realisasi", "Capaian", "Kunjungan", "Pipeline aktif", "Skor"],
        ["Kinanah", "Rp38,4 M", "85,3%", "44", "27", "91"],
        ["Karlina", "Rp34,7 M", "82,6%", "41", "24", "88"],
        ["Rudi Hartono", "Rp31,5 M", "78,8%", "38", "22", "84"],
        ["Siti Amalia", "Rp28,9 M", "82,6%", "37", "20", "83"],
        ["Andi Pratama", "Rp26,8 M", "70,5%", "36", "18", "78"],
    ]
    story.extend(
        [
            data_table(rm_rows, [38 * mm, 28 * mm, 22 * mm, 25 * mm, 30 * mm, 18 * mm], align_right_columns=(1, 2, 3, 4, 5)),
            Spacer(1, 4 * mm),
            p("Catatan: tabel menampilkan 5 contoh RM dari asumsi 15 RM aktif. Skor menggabungkan capaian funding, aktivitas kunjungan, kualitas laporan, dan ketepatan tindak lanjut.", "small"),
            Spacer(1, 6 * mm),
        ]
    )
    story.extend(section("Daftar prioritas", "Pipeline dengan komitmen terdekat"))
    priority_rows = [
        ["Prospek", "Produk", "Potensi", "Status", "Komitmen", "PIC"],
        ["PT Surya Karya Abadi", "Giro", "Rp12,5 M", "Hot", "14 Agu", "Kinanah"],
        ["RS Harapan Keluarga", "Deposito", "Rp9,8 M", "Hot", "15 Agu", "Karlina"],
        ["Yayasan Cendekia Jaya", "Tabungan", "Rp7,4 M", "Warm", "16 Agu", "Rudi H."],
        ["PT Mandiri Niaga", "Giro", "Rp6,2 M", "Warm", "18 Agu", "Siti A."],
    ]
    story.append(data_table(priority_rows, [46 * mm, 22 * mm, 25 * mm, 22 * mm, 22 * mm, 27 * mm], align_right_columns=(2,)))

    story.append(PageBreak())
    story.extend(section("Kunjungan harian", "Kepatuhan bukti aktivitas dan kualitas laporan"))
    visit_metrics = Table(
        [[
            metric_cell("Total kunjungan", "196", "periode berjalan", BLUE_SOFT),
            metric_cell("Disetujui", "174", "88,8% laporan", GREEN_SOFT),
            metric_cell("Menunggu review", "14", "7,1% laporan", ORANGE_SOFT),
            metric_cell("Perlu perbaikan", "8", "4,1% laporan", RED_SOFT),
        ]],
        colWidths=[42.5 * mm] * 4,
    )
    visit_metrics.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 2), ("RIGHTPADDING", (0, 0), (-1, -1), 2)]))
    story.extend([visit_metrics, Spacer(1, 6 * mm)])
    visit_rows = [
        ["Indikator kontrol", "Hasil sample", "Status", "Tindakan"],
        ["Foto bukti", "588 foto", "Sesuai batas 3 foto", "Pertahankan kompresi otomatis"],
        ["Lokasi dan waktu", "98% lengkap", "2% perlu validasi", "Minta RM memperbarui lokasi"],
        ["Hasil kunjungan", "188 lengkap", "8 perlu perbaikan", "Selesaikan maksimal 1 hari kerja"],
        ["Tindak lanjut", "23 belum selesai", "3 terlambat", "Eskalasi pada Lead RM"],
    ]
    story.extend(
        [
            data_table(visit_rows, [39 * mm, 34 * mm, 39 * mm, 58 * mm]),
            Spacer(1, 6 * mm),
        ]
    )
    story.extend(section("Contoh log aktivitas", "Data yang dapat dilihat atasan"))
    activity_rows = [
        ["Waktu", "Nasabah", "Tujuan", "Hasil", "Status"],
        ["11 Agu 09:00", "PT Surya Karya Abadi", "Finalisasi Giro", "Dokumen lengkap, menunggu tanda tangan", "Review"],
        ["11 Agu 10:30", "RS Harapan Keluarga", "Penawaran Deposito", "Meminta simulasi tenor 3 dan 6 bulan", "Disetujui"],
        ["11 Agu 13:30", "Yayasan Cendekia Jaya", "Follow-up Tabungan", "Foto lokasi perlu dilengkapi", "Perbaikan"],
    ]
    story.extend(
        [
            data_table(activity_rows, [27 * mm, 39 * mm, 35 * mm, 49 * mm, 20 * mm]),
            Spacer(1, 6 * mm),
            callout(
                "Kebijakan foto",
                "Foto dikompresi sebelum upload menjadi WebP, sisi terpanjang 1.600 px, target 400 KB dan maksimal 1 MB per foto. EXIF pribadi dihapus; lokasi dan waktu disimpan sebagai metadata terstruktur.",
                GREEN_SOFT,
                GREEN,
            ),
        ]
    )

    story.append(PageBreak())
    story.extend(section("Manajemen data", "Estimasi kapasitas, backup, dan retensi"))
    storage_rows = [
        ["Asumsi", "Nilai", "Keterangan"],
        ["RM aktif", "15 orang", "Cakupan Cabang Jatinegara"],
        ["Kunjungan per RM per hari", "4", "22 hari kerja per bulan"],
        ["Foto per kunjungan", "3", "Target rata-rata 400 KB per foto"],
        ["Kunjungan per bulan", "1.320", "15 x 4 x 22"],
        ["Foto per bulan", "1,51 GB", "Belum termasuk buffer operasional"],
        ["Kapasitas aman tahun 1", "22 GB", "Termasuk buffer 20%"],
        ["Backup bulanan", "1,59 GB", "Paket terenkripsi dan checksum"],
    ]
    story.extend(
        [
            data_table(storage_rows, [64 * mm, 35 * mm, 71 * mm]),
            Spacer(1, 7 * mm),
        ]
    )
    story.extend(section("Siklus hidup data", "Kontrol yang direkomendasikan"))
    lifecycle_rows = [
        ["Periode", "Status", "Akses", "Kontrol utama"],
        ["0-12 bulan", "Online dan aktif", "Dashboard dan audit cabang", "Private object storage, audit akses"],
        ["13-24 bulan", "Arsip bulanan", "Pinca dan pihak berwenang", "Enkripsi, manifest, checksum"],
        [">24 bulan", "Kandidat hapus", "Melalui persetujuan", "Legal hold, backup tervalidasi, recycle 30 hari"],
    ]
    story.extend(
        [
            data_table(lifecycle_rows, [30 * mm, 37 * mm, 46 * mm, 57 * mm]),
            Spacer(1, 7 * mm),
        ]
    )
    story.extend(section("Rekomendasi tindak lanjut", "Agenda rapat pimpinan cabang"))
    story.append(
        numbered_recommendations(
            [
                ("Percepat pipeline Hot", "Kawal 16 pipeline Hot bernilai Rp80,35 M dan tetapkan PIC serta tanggal komitmen yang jelas."),
                ("Tutup temuan kunjungan", "Selesaikan 8 laporan yang perlu perbaikan dan 3 tindak lanjut terlambat maksimal 1 hari kerja."),
                ("Jalankan backup terverifikasi", "Buat arsip terenkripsi setiap bulan, simpan manifest, dan verifikasi checksum sebelum retensi atau penghapusan."),
                ("Gunakan laporan mingguan", "Pinca dan Lead RM meninjau capaian produk, leaderboard RM, kualitas kunjungan, dan perhatian prioritas dalam satu rapat."),
            ]
        )
    )
    story.extend(
        [
            Spacer(1, 5 * mm),
            callout(
                "Catatan implementasi",
                "Versi produksi harus mengambil angka dari database terotorisasi, menerapkan RBAC di backend, menyimpan foto pada private object storage, dan mencatat seluruh tindakan sensitif pada audit trail.",
                RED_SOFT,
                RED,
            ),
        ]
    )

    doc.build(story)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    build_report(args.output.resolve())
    print(args.output.resolve())


if __name__ == "__main__":
    main()
