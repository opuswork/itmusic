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
    // Accept original file name as base64 to prevent filename injection / encoding issues
    const originalFileNameBase64 = formData.get('originalFileNameBase64');
    let originalFileName = file.name || 'image';
    if (originalFileNameBase64 && typeof originalFileNameBase64 === 'string') {
      try {
        const decoded = Buffer.from(originalFileNameBase64, 'base64').toString('utf-8');
        if (decoded.length > 0 && decoded.length < 512) originalFileName = decoded;
      } catch (_) {}
    }
    const ext = (originalFileName.includes('.') ? originalFileName.slice(originalFileName.lastIndexOf('.')) : '').toLowerCase() || '.jpg';
    const base = sanitize(originalFileName.replace(/\.[^/.]+$/, '') || 'image');
    const pathname = `sliders/slider-${Date.now()}-${base}${ext}`;

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
    console.error('Error uploading slider image:', error);
    return NextResponse.json(
      { success: false, message: '이미지 업로드에 실패했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
