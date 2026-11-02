"""Extract and render actual browser-generated PDFs for visual QA.

QA-only dependencies can be installed outside the application:
python -m pip install --target artifacts/pdf-qa-python pypdf pypdfium2 pillow
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "artifacts" / "pdf-qa-python"))

try:
    from pypdf import PdfReader
    import pypdfium2 as pdfium
except ImportError as exc:
    raise SystemExit(
        "PDF QA dependencies missing. Install with: python -m pip install "
        "--target artifacts/pdf-qa-python pypdf pypdfium2 pillow"
    ) from exc


def inspect_pdf(source: Path, output: Path) -> dict:
    output.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(source)
    document = pdfium.PdfDocument(str(source))
    pages = []
    all_text = []
    for index, (pdf_page, text_page) in enumerate(zip(document, reader.pages)):
        text = text_page.extract_text() or ""
        all_text.append(text)
        width, height = pdf_page.get_size()
        # Text coordinates should remain within the physical page. This check
        # supplements, rather than replaces, inspection of the rendered PNGs.
        text_handle = pdf_page.get_textpage()
        outside = []
        for char in range(text_handle.count_chars()):
            char_text = text_handle.get_text_range(char, 1)
            if not char_text.strip():
                continue
            left, bottom, right, top = text_handle.get_charbox(char)
            if left < -1 or bottom < -1 or right > width + 1 or top > height + 1:
                outside.append({"char": char_text, "box": [left, bottom, right, top]})
        image_path = output / f"{source.stem}-page-{index + 1:02d}.png"
        bitmap = pdf_page.render(scale=1.3)
        bitmap.to_pil().save(image_path)
        pages.append({
            "page": index + 1,
            "width": width,
            "height": height,
            "characters": len(text.strip()),
            "text": text,
            "outOfPageGlyphs": outside,
            "image": str(image_path),
        })
        text_handle.close()
        bitmap.close()
        pdf_page.close()
    document.close()
    text = "\n".join(all_text)
    text_path = output / f"{source.stem}.txt"
    text_path.write_text(text, encoding="utf-8")
    return {
        "file": str(source),
        "bytes": source.stat().st_size,
        "pageCount": len(reader.pages),
        "text": text,
        "textFile": str(text_path),
        "pages": pages,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdfs", nargs="+", type=Path)
    parser.add_argument("--output", type=Path, default=ROOT / "artifacts" / "pdf-qa" / "rendered")
    args = parser.parse_args()
    reports = [inspect_pdf(source.resolve(), args.output.resolve()) for source in args.pdfs]
    target = args.output / "pdf-render-report.json"
    target.write_text(json.dumps(reports, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"report": str(target), "pdfs": [
        {"file": report["file"], "pages": report["pageCount"],
         "glyphsOutsidePage": sum(len(page["outOfPageGlyphs"]) for page in report["pages"])}
        for report in reports
    ]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
