import TeachersModel from "../models/teachers.model.js";

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

    console.log('Fetching teachers with skip:', skip, 'take:', take);
    
    // model을 통해 데이터 호출
    const teachers = await TeachersModel.findAll(skip, take);
    const total = await TeachersModel.count();

    console.log('Successfully fetched', teachers.length, 'teachers out of', total);

    // BigInt를 문자열로 변환
    const serializedTeachers = serializeBigInt(teachers);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    // view로 표현
    res.json({
      success: true,
      data: serializedTeachers,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: '교수진 데이터를 불러오는 중 오류가 발생했습니다.',
      error: error.message,
      code: error.code,
    });
  }
}

export default {
  getAll,
};