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

export default {
  getAll,
};