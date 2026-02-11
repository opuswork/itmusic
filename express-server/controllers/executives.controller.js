import ExecutivesModel from "../models/executives.model.js";

// BigInt를 문자열로 변환하는 헬퍼 함수
function serializeBigInt(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (typeof obj === 'object') {
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
    const take = parseInt(req.query.take) || 5;

    console.log('Fetching executives with skip:', skip, 'take:', take);
    
    // model을 통해 데이터 호출
    const executives = await ExecutivesModel.findAll(skip, take);
    const total = await ExecutivesModel.count();

    console.log('Successfully fetched', executives.length, 'executives out of', total);

    // BigInt를 문자열로 변환
    const serializedExecutives = serializeBigInt(executives);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    // view로 표현
    res.json({
      success: true,
      data: serializedExecutives,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: '상임이사 데이터를 불러오는 중 오류가 발생했습니다.',
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
      return res.status(400).json({ success: false, message: 'Invalid executive id' });
    }
    const executive = await ExecutivesModel.findById(id);
    if (!executive) {
      return res.status(404).json({ success: false, message: '상임이사를 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: serializeBigInt(executive) });
  } catch (error) {
    console.error('Error in getOne:', error);
    res.status(500).json({
      success: false,
      message: '상임이사 조회 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function create(req, res) {
  try {
    const { order_num = 0, name = null, profile = '', position = '', file_name1 = null, originalFileName = null } = req.body;
    const executive = await ExecutivesModel.create({ order_num, name, profile, position, file_name1, original_file_name: originalFileName });
    res.status(201).json({ success: true, data: serializeBigInt(executive) });
  } catch (error) {
    console.error('Error in create:', error);
    res.status(500).json({
      success: false,
      message: '상임이사 등록 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ success: false, message: 'Invalid executive id' });
    }
    const { order_num, name, profile, position, file_name1, originalFileName } = req.body;
    const executive = await ExecutivesModel.update(id, { order_num, name, profile, position, file_name1, original_file_name: originalFileName });
    res.json({ success: true, data: serializeBigInt(executive) });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '상임이사를 찾을 수 없습니다.' });
    }
    console.error('Error in update:', error);
    res.status(500).json({
      success: false,
      message: '상임이사 수정 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ success: false, message: 'Invalid executive id' });
    }
    await ExecutivesModel.delete(id);
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '상임이사를 찾을 수 없습니다.' });
    }
    console.error('Error in remove:', error);
    res.status(500).json({
      success: false,
      message: '상임이사 삭제 중 오류가 발생했습니다.',
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