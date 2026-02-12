import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const ALLOWED_EXT = ['.hwp', '.pdf', '.docx', '.doc'];
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/x-hwp',
  'application/octet-stream', // hwp often sent as this
];

function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80) || 'document';
}

function hasAllowedExt(name) {
  const ext = (name || '').toLowerCase().slice(name.lastIndexOf('.'));
  return ALLOWED_EXT.some((e) => e === ext);
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
    const file = formData.get('document');
    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, message: '파일을 선택해 주세요. (HWP, PDF, DOCX만 가능)' },
        { status: 400 }
      );
    }
    const originalFileName = file.name || 'document';
    if (!hasAllowedExt(originalFileName)) {
      return NextResponse.json(
        { success: false, message: 'HWP, PDF, DOCX 파일만 업로드할 수 있습니다.' },
        { status: 400 }
      );
    }
    const ext = (originalFileName.includes('.') ? originalFileName.slice(originalFileName.lastIndexOf('.')) : '').toLowerCase() || '.pdf';
    const base = sanitize(originalFileName.replace(/\.[^/.]+$/, '') || 'document');
    const pathname = `documents/competition-${Date.now()}-${base}${ext}`;

    const contentType = file.type && ALLOWED_TYPES.includes(file.type) ? file.type : undefined;
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: contentType || undefined,
    });

    return NextResponse.json({
      success: true,
      filename: blob.url,
      originalFileName: originalFileName,
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { success: false, message: '문서 업로드에 실패했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
