import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

const ALLOWED_PREFIXES = ['competitions/', 'executives/', 'images/', 'sliderImages/', 'documents/'];

export async function POST(request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'BLOB_READ_WRITE_TOKEN이 설정되지 않았습니다. Vercel Blob 스토어를 연결해 주세요.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
          throw new Error('허용되지 않은 업로드 경로입니다.');
        }
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif',
          ],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Error handling blob client upload:', error);
    return NextResponse.json(
      { success: false, message: error.message || '이미지 업로드에 실패했습니다.' },
      { status: 400 }
    );
  }
}
