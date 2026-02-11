import CultureModel from "../models/culture.model.js";

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

    console.log('Fetching cultures with skip:', skip, 'take:', take);

    // model을 통해 데이터 호출
    const cultures = await CultureModel.findAll(skip, take);
    const total = await CultureModel.count();

    console.log('Successfully fetched', cultures.length, 'cultures out of', total);
    // 디버깅: visit 값 확인
    if (cultures.length > 0) {
      console.log('Sample culture before serialization:', {
        num: cultures[0].num,
        visit: cultures[0].visit,
        visitType: typeof cultures[0].visit
      });
    }

    // BigInt를 문자열로 변환
    const serializedCultures = serializeBigInt(cultures);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;
    
    // 디버깅: 직렬화 후 visit 값 확인
    if (serializedCultures.length > 0) {
      console.log('Sample culture after serialization:', {
        num: serializedCultures[0].num,
        visit: serializedCultures[0].visit,
        visitType: typeof serializedCultures[0].visit
      });
    }

    // view로 표현
    res.json({
      success: true,
      data: serializedCultures,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: '문화 데이터를 불러오는 중 오류가 발생했습니다.',
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
      return res.status(400).json({ success: false, message: 'Invalid culture id' });
    }
    const culture = await CultureModel.findById(id);
    if (!culture) {
      return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: serializeBigInt(culture) });
  } catch (error) {
    console.error('Error in getOne:', error);
    res.status(500).json({
      success: false,
      message: '문화 게시물 조회 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function create(req, res) {
  try {
    const { subject = '', content = null, category = null } = req.body;
    const culture = await CultureModel.create({ subject, content, category });
    res.status(201).json({ success: true, data: serializeBigInt(culture) });
  } catch (error) {
    console.error('Error in create:', error);
    res.status(500).json({
      success: false,
      message: '문화 게시물 등록 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ success: false, message: 'Invalid culture id' });
    }
    const { subject, content, category } = req.body;
    const culture = await CultureModel.update(id, { subject, content, category });
    res.json({ success: true, data: serializeBigInt(culture) });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
    }
    console.error('Error in update:', error);
    res.status(500).json({
      success: false,
      message: '문화 게시물 수정 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ success: false, message: 'Invalid culture id' });
    }
    await CultureModel.delete(id);
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
    }
    console.error('Error in remove:', error);
    res.status(500).json({
      success: false,
      message: '문화 게시물 삭제 중 오류가 발생했습니다.',
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