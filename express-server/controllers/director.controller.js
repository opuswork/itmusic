import DirectorModel from "../models/director.model.js";

function serializeBigInt(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (obj instanceof Date) return obj.toISOString();
  if (typeof obj === 'object') {
    const result = {};
    for (const key in obj) result[key] = serializeBigInt(obj[key]);
    return result;
  }
  return obj;
}

async function getAll(req, res) {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 5;
    const directors = await DirectorModel.findAll(skip, take);
    const total = await DirectorModel.count();
    res.json({
      success: true,
      data: serializeBigInt(directors),
      total: typeof total === 'bigint' ? total.toString() : total,
      skip,
      take,
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({
      success: false,
      message: '음악감독 데이터를 불러오는 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function getOne(req, res) {
  try {
    const id = req.params.id;
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ success: false, message: 'Invalid director id' });
    }
    const director = await DirectorModel.findById(id);
    if (!director) {
      return res.status(404).json({ success: false, message: '음악감독을 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: serializeBigInt(director) });
  } catch (error) {
    console.error('Error in getOne:', error);
    res.status(500).json({
      success: false,
      message: '음악감독 조회 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function create(req, res) {
  try {
    const { name = '', position = '', text = null, file_name1 = null, originalFileName = null } = req.body;
    const director = await DirectorModel.create({ name, position, text, file_name1, original_file_name: originalFileName });
    res.status(201).json({ success: true, data: serializeBigInt(director) });
  } catch (error) {
    console.error('Error in create:', error);
    res.status(500).json({
      success: false,
      message: '음악감독 등록 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ success: false, message: 'Invalid director id' });
    }
    const { name, position, text, file_name1, originalFileName } = req.body;
    const director = await DirectorModel.update(id, { name, position, text, file_name1, original_file_name: originalFileName });
    res.json({ success: true, data: serializeBigInt(director) });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '음악감독을 찾을 수 없습니다.' });
    }
    console.error('Error in update:', error);
    res.status(500).json({
      success: false,
      message: '음악감독 수정 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ success: false, message: 'Invalid director id' });
    }
    await DirectorModel.delete(id);
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '음악감독을 찾을 수 없습니다.' });
    }
    console.error('Error in remove:', error);
    res.status(500).json({
      success: false,
      message: '음악감독 삭제 중 오류가 발생했습니다.',
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
