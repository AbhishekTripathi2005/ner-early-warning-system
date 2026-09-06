import os
import shutil

DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "docs")
PUBLIC_DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "docs")

DOCS_TO_RENDER = [
    {
        "md_file": "TECH_STACK.md",
        "html_file": "tech_stack.html",
        "pdf_file": "SIH26001_Tech_Stack_Specification.pdf",
        "title": "SIH26001 - Tech Stack & Architecture Specification"
    },
    {
        "md_file": "MODEL_CARD.md",
        "html_file": "model_card.html",
        "pdf_file": "SIH26001_Model_Cards_Evaluation.pdf",
        "title": "SIH26001 - AI/ML Model Cards & Evaluation Report"
    },
    {
        "md_file": "DATASET_STATUS.md",
        "html_file": "dataset_status.html",
        "pdf_file": "SIH26001_Dataset_Status_Matrix.pdf",
        "title": "SIH26001 - Dataset Status & Integration Matrix"
    }
]

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown-dark.min.css">
  <style>
    @media print {{
      .no-print {{ display: none !important; }}
      body {{ background: #ffffff !important; color: #000000 !important; }}
      .markdown-body {{ background: #ffffff !important; color: #000000 !important; font-size: 11px; }}
      .markdown-body table {{ color: #000000 !important; }}
    }}
    * {{ box-sizing: border-box; }}
    body {{
      background: #090d16;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }}
    .no-print {{
      width: 100%;
      max-width: 1000px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0e1424;
      border: 1px solid #1e293b;
      padding: 12px 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      gap: 12px;
      flex-wrap: wrap;
    }}
    .back-link {{
      color: #38bdf8;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }}
    .back-link:hover {{ text-decoration: underline; }}
    .btn-group {{ display: flex; gap: 10px; }}
    .btn {{
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: bold;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
      transition: all 0.2s;
    }}
    .btn-primary {{
      background: #0284c7;
      color: white;
    }}
    .btn-primary:hover {{ background: #0369a1; }}
    .btn-secondary {{
      background: #1e293b;
      color: #e2e8f0;
      border: 1px solid #334155;
    }}
    .btn-secondary:hover {{ background: #334155; }}
    .content-box {{
      width: 100%;
      max-width: 1000px;
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 12px;
      padding: 36px 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    }}
    .markdown-body table {{
      display: table;
      width: 100%;
      overflow-x: auto;
    }}
    .markdown-body table th, .markdown-body table td {{
      padding: 8px 12px;
    }}
  </style>
</head>
<body>
  <div class="no-print">
    <a href="download_center.html" class="back-link">&larr; Back to Submission Download Center</a>
    <div class="btn-group">
      <a href="{pdf_file}" download class="btn btn-primary">📥 Download Official PDF</a>
      <button onclick="window.print()" class="btn btn-secondary">🖨️ Print / Save to PDF</button>
    </div>
  </div>

  <div class="content-box">
    <article id="content" class="markdown-body">
      Loading document content...
    </article>
  </div>

  <script id="raw-markdown" type="text/markdown">
{markdown_content}
  </script>

  <script>
    const rawMd = document.getElementById('raw-markdown').textContent;
    marked.setOptions({{
      gfm: true,
      breaks: true
    }});
    document.getElementById('content').innerHTML = marked.parse(rawMd);
  </script>
</body>
</html>
"""

def generate_html_views():
    for item in DOCS_TO_RENDER:
        md_path = os.path.join(DOCS_DIR, item["md_file"])
        if not os.path.exists(md_path):
            print(f"Skipping {md_path}, not found.")
            continue

        with open(md_path, "r", encoding="utf-8") as f:
            md_content = f.read()

        html_out = HTML_TEMPLATE.format(
            title=item["title"],
            pdf_file=item["pdf_file"],
            markdown_content=md_content.replace("</script>", "<\\/script>")
        )

        out_html_path = os.path.join(DOCS_DIR, item["html_file"])
        with open(out_html_path, "w", encoding="utf-8") as f:
            f.write(html_out)

        pub_html_path = os.path.join(PUBLIC_DOCS_DIR, item["html_file"])
        with open(pub_html_path, "w", encoding="utf-8") as f:
            f.write(html_out)

        print(f"Rendered {item['html_file']} to docs/ and frontend/public/docs/")

if __name__ == "__main__":
    generate_html_views()
