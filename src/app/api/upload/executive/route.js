import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'assets', 'people');

function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80) || 'image';
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, message: '이미지 파일을 선택해 주세요.' },
        { status: 400 }
      );
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalName = file.name || 'image';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const base = sanitize(path.basename(originalName, path.extname(originalName)));
    const filename = `executive-${Date.now()}-${base}${ext}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    const filePath = path.join(UPLOAD_DIR, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error('Error uploading executive image:', error);
    return NextResponse.json(
      { success: false, message: '이미지 업로드에 실패했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
