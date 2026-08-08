const fs = require('fs');
const pdf2img = require('pdf-img-convert');
const path = require('path');

async function extractPDF() {
  const pdfPath = path.join(__dirname, 'public', 'CarKit User manual.pdf');
  const outDir = path.join(__dirname, 'public', 'projects');
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Reading PDF from:', pdfPath);
  try {
    const pdfArray = await pdf2img.convert(pdfPath, {
      width: 1920,
      base64: false
    });
    
    console.log(`Found ${pdfArray.length} pages.`);
    
    for (let i = 0; i < pdfArray.length; i++) {
      const outPath = path.join(outDir, `CarKit-Manual-${i + 1}.png`);
      fs.writeFileSync(outPath, pdfArray[i]);
      console.log(`Saved: ${outPath}`);
    }
    
    console.log('Done converting PDF to images.');
  } catch (err) {
    console.error('Error converting PDF:', err);
  }
}

extractPDF();
