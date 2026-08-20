'use client';

import { upload } from '@vercel/blob/client';

const MAX_DIMENSION = 2000;
const MAX_BYTES_BEFORE_COMPRESS = 2.5 * 1024 * 1024;
const JPEG_QUALITY = 0.85;

function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80) || 'image';
}

async function compressIfNeeded(file) {
  if (!file?.type?.startsWith('image/') || file.type === 'image/gif') return file;
  if (file.size <= MAX_BYTES_BEFORE_COMPRESS) return file;
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY);
    });
    if (!blob || blob.size >= file.size) return file;

    const name = `${(file.name || 'image').replace(/\.[^/.]+$/, '')}.jpg`;
    return new File([blob], name, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Image compression failed, uploading original:', error);
    return file;
  }
}

export async function uploadImageToBlob(file, folder = 'images') {
  if (!file) throw new Error('이미지 파일을 선택해 주세요.');

  const originalFileName = file.name || 'image';
  const toUpload = await compressIfNeeded(file);
  const uploadName = toUpload.name || originalFileName;
  const ext = (uploadName.includes('.') ? uploadName.slice(uploadName.lastIndexOf('.')) : '').toLowerCase() || '.jpg';
  const base = sanitize(uploadName.replace(/\.[^/.]+$/, '') || 'image');
  const pathname = `${folder}/${folder.replace(/s$/, '')}-${Date.now()}-${base}${ext}`;

  try {
    const blob = await upload(pathname, toUpload, {
      access: 'public',
      handleUploadUrl: '/api/upload/blob',
      multipart: toUpload.size > 4 * 1024 * 1024,
      contentType: toUpload.type || undefined,
      clientPayload: JSON.stringify({ folder, originalFileName }),
    });

    return {
      filename: blob.url,
      originalFileName,
    };
  } catch (error) {
    const msg = error?.message || '';
    if (/413|too large|entity too large/i.test(msg)) {
      throw new Error('이미지 용량이 너무 큽니다. 더 작은 파일을 선택해 주세요.');
    }
    throw new Error(msg || '이미지 업로드에 실패했습니다.');
  }
}

export async function parseUploadResponse(res, fallbackMessage) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    if (res.status === 413) {
      throw new Error('파일이 너무 큽니다. 더 작은 파일을 선택해 주세요.');
    }
    if (res.status === 404) {
      throw new Error('업로드 경로를 찾을 수 없습니다.');
    }
    throw new Error(fallbackMessage);
  }
  if (!res.ok) {
    throw new Error(data?.message || fallbackMessage);
  }
  return data;
}
