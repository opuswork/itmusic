import OperatorsModel from "../models/operators.model.js";

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
    console.log('Fetching operators...');
    
    // model을 통해 데이터 호출
    const operators = await OperatorsModel.findAll();

    console.log('Successfully fetched', operators.length, 'operators');

    // BigInt를 문자열로 변환
    const serializedOperators = serializeBigInt(operators);

    // view로 표현
    res.json({
      success: true,
      data: serializedOperators,
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: '운영위원 데이터를 불러오는 중 오류가 발생했습니다.',
      error: error.message,
      code: error.code,
    });
  }
}

export default {
  getAll,
};