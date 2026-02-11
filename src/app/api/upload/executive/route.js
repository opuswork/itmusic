import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80) || 'image';
}

export async function POST(request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'BLOB_READ_WRITE_TOKEN이 설정되지 않았습니다. Vercel Blob 스토어를 연결해 주세요.' },
        { status: 503 }
      );
    }
    const formData = await request.formData();
    const file = formData.get('image');
    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, message: '이미지 파일을 선택해 주세요.' },
        { status: 400 }
      );
    }
    const originalFileName = file.name || 'image';
    const ext = (originalFileName.includes('.') ? originalFileName.slice(originalFileName.lastIndexOf('.')) : '').toLowerCase() || '.jpg';
    const base = sanitize(originalFileName.replace(/\.[^/.]+$/, '') || 'image');
    const pathname = `executives/executive-${Date.now()}-${base}${ext}`;

    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });

    return NextResponse.json({
      success: true,
      filename: blob.url,
      originalFileName: originalFileName,
    });
  } catch (error) {
    console.error('Error uploading executive image:', error);
    return NextResponse.json(
      { success: false, message: '이미지 업로드에 실패했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
