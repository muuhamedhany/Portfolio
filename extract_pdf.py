import fitz
import os

pdf_path = r"public/CarKit User manual.pdf"
out_dir = r"public/projects"

if not os.path.exists(out_dir):
    os.makedirs(out_dir)

doc = fitz.open(pdf_path)
for i in range(len(doc)):
    page = doc.load_page(i)
    pix = page.get_pixmap(dpi=150)
    out_path = os.path.join(out_dir, f"CarKit-Manual-{i+1}.png")
    pix.save(out_path)
    print(f"Saved: {out_path}")
print("Done.")
