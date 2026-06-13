"""
md_to_pdf.py
============
Converts all Markdown (.md) files in the docs/ folder
to styled PDF files in docs/pdf/ using markdown + xhtml2pdf.
"""

import os
import sys
import markdown
from xhtml2pdf import pisa

# ---------------------------------------------------------------------------
# CSS — professional document styling for xhtml2pdf
# ---------------------------------------------------------------------------
DOCUMENT_CSS = """
@page {
    size: a4 portrait;
    @frame header_frame {
        -pdf-frame-content: header_content;
        left: 54pt;
        width: 487pt;
        top: 36pt;
        height: 30pt;
    }
    @frame content_frame {
        left: 54pt;
        width: 487pt;
        top: 72pt;
        height: 698pt;
    }
    @frame footer_frame {
        -pdf-frame-content: footer_content;
        left: 54pt;
        width: 487pt;
        top: 775pt;
        height: 30pt;
    }
}

body {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.5;
    color: #1e293b;
}

h1 {
    font-size: 20pt;
    font-weight: bold;
    color: #0f172a;
    border-bottom: 2px solid #6366f1;
    padding-bottom: 6px;
    margin-top: 0;
    margin-bottom: 12pt;
}

h2 {
    font-size: 14pt;
    font-weight: bold;
    color: #1e293b;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin-top: 18pt;
    margin-bottom: 8pt;
}

h3 {
    font-size: 11pt;
    font-weight: bold;
    color: #334155;
    margin-top: 14pt;
    margin-bottom: 6pt;
}

h4 {
    font-size: 10pt;
    font-weight: bold;
    color: #475569;
    margin-top: 10pt;
    margin-bottom: 4pt;
}

p {
    margin: 0 0 8pt 0;
}

a {
    color: #6366f1;
    text-decoration: underline;
}

ul, ol {
    margin: 0 0 10pt 15pt;
}

li {
    margin-bottom: 3pt;
}

/* Inline code style */
code {
    font-family: Courier, monospace;
    font-size: 9pt;
    background-color: #f1f5f9;
    color: #7c3aed;
    padding: 1px 3px;
}

/* Pre / Code blocks */
pre {
    font-family: Courier, monospace;
    font-size: 8.5pt;
    background-color: #0f172a;
    color: #e2e8f0;
    padding: 10px;
    margin: 10pt 0;
    border-left: 3px solid #6366f1;
}

pre code {
    background-color: transparent;
    color: #e2e8f0;
    padding: 0;
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 12pt 0;
}

th {
    background-color: #6366f1;
    color: white;
    font-weight: bold;
    padding: 6px;
    border: 1px solid #cbd5e1;
    font-size: 9pt;
}

td {
    padding: 6px;
    border: 1px solid #cbd5e1;
    font-size: 9pt;
}

blockquote {
    border-left: 3px solid #6366f1;
    margin: 10pt 0;
    padding: 8px 12px;
    background-color: #f0f4ff;
    color: #3730a3;
}

hr {
    border: none;
    border-top: 1px solid #cbd5e1;
    margin: 15pt 0;
}

.cover-strip {
    height: 8px;
    background-color: #6366f1;
    margin-bottom: 32px;
}
"""

# ---------------------------------------------------------------------------
# HTML wrapper template
# ---------------------------------------------------------------------------
HTML_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
{css}
</style>
</head>
<body>

<!-- Static Header Frame Content -->
<div id="header_content">
    <table style="width: 100%; border: none; border-bottom: 1px solid #e2e8f0; margin: 0; padding-bottom: 4px;">
        <tr>
            <td style="font-size: 8pt; color: #64748b; border: none; padding: 0; font-weight: bold; background: transparent;">shopEZ E-commerce Marketplace</td>
            <td style="font-size: 8pt; color: #64748b; border: none; padding: 0; text-align: right; background: transparent;">Phase FSD Documentation</td>
        </tr>
    </table>
</div>

<!-- Static Footer Frame Content -->
<div id="footer_content">
    <table style="width: 100%; border: none; border-top: 1px solid #e2e8f0; margin: 0; padding-top: 4px;">
        <tr>
            <td style="font-size: 8pt; color: #94a3b8; border: none; padding: 0; background: transparent;">shopEZ -- FSD Documentation Suite</td>
            <td style="font-size: 8pt; color: #94a3b8; border: none; padding: 0; text-align: right; background: transparent;">Page <pdf:pagenumber /> of <pdf:pagecount /></td>
        </tr>
    </table>
</div>

<div class="cover-strip"></div>
{body}
</body>
</html>
"""

def md_to_pdf_xhtml2pdf(md_path: str, pdf_path: str) -> None:
    """Read a Markdown file, convert to HTML, render to PDF using xhtml2pdf."""
    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Convert Markdown to HTML (tables, fenced code blocks, TOC)
    html_body = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "toc"]
    )

    title = os.path.splitext(os.path.basename(md_path))[0].replace("_", " ")
    full_html = HTML_TEMPLATE.format(title=title, css=DOCUMENT_CSS, body=html_body)

    with open(pdf_path, "wb") as pdf_file:
        pisa_status = pisa.CreatePDF(
            src=full_html,
            dest=pdf_file,
            encoding="utf-8"
        )
    
    if pisa_status.err:
        raise Exception(f"xhtml2pdf error code {pisa_status.err}")
    
    print(f"  [SUCCESS] {os.path.basename(md_path)} -> {os.path.basename(pdf_path)}")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    docs_dir   = os.path.join(script_dir, "docs")
    pdf_dir    = os.path.join(docs_dir, "pdf")

    if not os.path.isdir(docs_dir):
        print(f"[ERROR] docs/ folder not found at: {docs_dir}")
        sys.exit(1)

    os.makedirs(pdf_dir, exist_ok=True)

    md_files = sorted(
        f for f in os.listdir(docs_dir)
        if f.lower().endswith(".md")
    )

    if not md_files:
        print("[WARN] No .md files found in docs/")
        sys.exit(0)

    print(f"\n[INFO] Converting {len(md_files)} Markdown file(s) -> PDF\n")
    print(f"   Source : {docs_dir}")
    print(f"   Output : {pdf_dir}\n")

    errors = []
    for filename in md_files:
        md_path  = os.path.join(docs_dir, filename)
        pdf_name = os.path.splitext(filename)[0] + ".pdf"
        pdf_path = os.path.join(pdf_dir, pdf_name)
        try:
            md_to_pdf_xhtml2pdf(md_path, pdf_path)
        except Exception as e:
            print(f"  [FAILED] {filename} -> FAILED: {e}")
            errors.append(filename)

    print(f"\n{'-'*55}")
    print(f"[SUMMARY] Done! {len(md_files) - len(errors)}/{len(md_files)} PDFs generated in docs/pdf/")
    if errors:
        print(f"[SUMMARY] Failed: {', '.join(errors)}")
    print(f"{'-'*55}\n")

if __name__ == "__main__":
    main()
