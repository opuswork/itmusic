import ConcertModel from "../models/concert.model.js";

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

    console.log('Fetching concerts with skip:', skip, 'take:', take);

    // model을 통해 데이터 호출
    const concerts = await ConcertModel.findAll(skip, take);
    const total = await ConcertModel.count();

    console.log('Successfully fetched', concerts.length, 'concerts out of', total);

    // BigInt를 문자열로 변환
    const serializedConcerts = serializeBigInt(concerts);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    // view로 표현
    res.json({
      success: true,
      data: serializedConcerts,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: '공연소식 데이터를 불러오는 중 오류가 발생했습니다.',
      error: error.message,
      code: error.code,
    });
  }
}

export default {
  getAll,
};