import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'portfolio';
const publicUrl = process.env.VITE_CLOUDFLARE_R2_PUBLIC_URL;

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error('❌ Missing Cloudflare R2 credentials in .env');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function uploadFile(localPath, key, contentType = 'application/octet-stream') {
  const fileBuffer = fs.readFileSync(localPath);
  console.log(`Uploading ${localPath} (${fileBuffer.length} bytes) to R2 as "${key}"...`);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  console.log(`✅ Uploaded "${key}" to bucket "${bucketName}".`);
  if (publicUrl) {
    console.log(`Public URL: ${publicUrl.replace(/\/+$/, '')}/${key}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const targetFile = args.find((a) => !a.startsWith('--'));

  if (targetFile) {
    const fullPath = path.resolve(process.cwd(), targetFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      process.exit(1);
    }
    const key = path.basename(fullPath);
    const contentType = key.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream';
    await uploadFile(fullPath, key, contentType);
    return;
  }

  // Default: upload cv.pdf if present
  const cvPath = path.resolve(__dirname, '../public/cv.pdf');
  if (fs.existsSync(cvPath)) {
    await uploadFile(cvPath, 'cv.pdf', 'application/pdf');
  } else {
    console.log('No public/cv.pdf found to upload.');
  }
}

main().catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});
