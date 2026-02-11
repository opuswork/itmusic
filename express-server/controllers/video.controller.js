import VideoModel from "../models/video.model.js";

// BigInt와 Date를 문자열로 변환하는 헬퍼 함수
function serializeBigInt(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  // Date 객체를 ISO 문자열로 변환
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }
  
  if (typeof obj === 'object') {
    // 빈 객체 체크
    if (Object.keys(obj).length === 0) {
      return null;
    }
    const result = {};
    for (const key in obj) {
      result[key] = serializeBigInt(obj[key]);
    }
    return result;
  }
  
  return obj;
}

// controller 함수:
async function getAll(req, res) {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 10;

    console.log('Fetching videos with skip:', skip, 'take:', take);

    // model을 통해 데이터 호출
    const videos = await VideoModel.findAll(skip, take);
    const total = await VideoModel.count();

    console.log('Successfully fetched', videos.length, 'videos out of', total);

    // BigInt를 문자열로 변환
    const serializedVideos = serializeBigInt(videos);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    // view로 표현
    res.json({
      success: true,
      data: serializedVideos,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: '영상 데이터를 불러오는 중 오류가 발생했습니다.',
      error: error.message,
      code: error.code,
    });
  }
}

async function getOne(req, res) {
  try {
    const id = req.params.id;
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ success: false, message: 'Invalid video id' });
    }
    const video = await VideoModel.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: '영상을 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: serializeBigInt(video) });
  } catch (error) {
    console.error('Error in getOne:', error);
    res.status(500).json({
      success: false,
      message: '영상 조회 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function create(req, res) {
  try {
    const { subject = '', text = null, link = null } = req.body;
    const video = await VideoModel.create({ subject, text, link });
    res.status(201).json({ success: true, data: serializeBigInt(video) });
  } catch (error) {
    console.error('Error in create:', error);
    res.status(500).json({
      success: false,
      message: '영상 등록 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ success: false, message: 'Invalid video id' });
    }
    const { subject, text, link } = req.body;
    const video = await VideoModel.update(id, { subject, text, link });
    res.json({ success: true, data: serializeBigInt(video) });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '영상을 찾을 수 없습니다.' });
    }
    console.error('Error in update:', error);
    res.status(500).json({
      success: false,
      message: '영상 수정 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ success: false, message: 'Invalid video id' });
    }
    await VideoModel.delete(id);
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '영상을 찾을 수 없습니다.' });
    }
    console.error('Error in remove:', error);
    res.status(500).json({
      success: false,
      message: '영상 삭제 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

export default {
  getAll,
  getOne,
  create,
  update,
  remove,
};
