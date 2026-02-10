/**
 * 서버 사이드 API 유틸리티
 *
 * 이 파일은 서버에서 데이터를 직접 가져올 때 사용합니다.
 * Express 서버에서 Route 핸들러 내에서 사용할 수 있습니다.
 */

// ============================================================
// 1. 샘플 데이터 (실제는 DB에서 가져옴)
// ============================================================
const sampleProducts = [
  { id: 1, name: 'Product A', price: 10000, description: '고급 상품 A', stock: 50, category: '카테고리 1' },
  { id: 2, name: 'Product B', price: 20000, description: '프리미엄 상품 B', stock: 30, category: '카테고리 2' },
  { id: 3, name: 'Product C', price: 30000, description: '최고급 상품 C', stock: 15, category: '카테고리 1' },
  { id: 4, name: 'Product D', price: 15000, description: '스탠다드 상품 D', stock: 45, category: '카테고리 3' },
  { id: 5, name: 'Product E', price: 25000, description: '프리미엄 상품 E', stock: 20, category: '카테고리 2' },
];

// ============================================================
// 2. 서버 사이드 상품 조회 함수
// ============================================================

/**
 * 서버에서 모든 상품을 조회
 * @param {Object} options - 조회 옵션
 * @param {string} options.category - 카테고리 필터
 * @param {string} options.sortBy - 정렬 필드
 * @param {string} options.order - 정렬 순서 (asc/desc)
 * @returns {Promise<Array>} 상품 배열
 */
export async function getProductsServerSide(options = {}) {
  try {
    // 실제 환경에서는 DB에서 조회
    // const products = await Product.find(query).sort(...);

    // 현재는 메모리 데이터 사용
    let products = [...sampleProducts];

    // 카테고리 필터링
    if (options.category) {
      products = products.filter(p => p.category === options.category);
    }

    // 정렬
    if (options.sortBy) {
      products.sort((a, b) => {
        const aVal = a[options.sortBy];
        const bVal = b[options.sortBy];

        if (options.order === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    return products;
  } catch (error) {
    console.error('서버 사이드 상품 조회 오류:', error);
    throw error;
  }
}

/**
 * 서버에서 특정 상품을 상세 조회
 * @param {number} productId - 상품 ID
 * @returns {Promise<Object>} 상품 객체
 */
export async function getProductDetailServerSide(productId) {
  try {
    // 실제 환경에서는 DB에서 조회
    // const product = await Product.findById(productId);

    const product = sampleProducts.find(p => p.id === parseInt(productId));

    if (!product) {
      throw new Error(`상품을 찾을 수 없습니다. ID: ${productId}`);
    }

    return product;
  } catch (error) {
    console.error('서버 사이드 상품 상세 조회 오류:', error);
    throw error;
  }
}

// ============================================================
// 3. Express 라우트 핸들러 예시
// ============================================================

/**
 * Express 라우트 핸들러 예시
 *
 * 사용법:
 * app.get('/products-server', handleProductsServer);
 */
export async function handleProductsServer(req, res) {
  try {
    const { category, sortBy, order } = req.query;

    const products = await getProductsServerSide({
      category,
      sortBy,
      order,
    });

    // SSR을 위해 HTML로 렌더링 (실제는 React 컴포넌트를 SSR)
    res.json({
      success: true,
      data: products,
      total: products.length,
      renderedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '상품 목록 조회 실패',
      error: error.message,
    });
  }
}

/**
 * Express 라우트 핸들러 예시 (상세 조회)
 *
 * 사용법:
 * app.get('/products-server/:id', handleProductDetailServer);
 */
export async function handleProductDetailServer(req, res) {
  try {
    const { id } = req.params;

    const product = await getProductDetailServerSide(id);

    res.json({
      success: true,
      data: product,
      renderedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: '상품 조회 실패',
      error: error.message,
    });
  }
}

// ============================================================
// 4. MongoDB/Mongoose 예시
// ============================================================

/**
 * MongoDB에서 상품을 조회하는 예시 (주석 처리)
 *
 * 사용법:
 * 1. npm install mongoose
 * 2. 아래 코드 주석 해제
 * 3. MongoDB 연결 설정
 */

/*
import mongoose from 'mongoose';

// Product 스키마
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

// MongoDB에서 조회
export async function getProductsFromDB(options = {}) {
  try {
    let query = {};

    if (options.category) {
      query.category = options.category;
    }

    const sortBy = options.sortBy || 'id';
    const order = options.order === 'desc' ? -1 : 1;

    const products = await Product.find(query).sort({ [sortBy]: order });

    return products;
  } catch (error) {
    console.error('DB 조회 오류:', error);
    throw error;
  }
}
*/

// ============================================================
// 5. 캐싱 예시
// ============================================================

/**
 * 간단한 인메모리 캐싱 (실제로는 Redis 권장)
 */
class ProductCache {
  constructor(ttl = 60000) { // 기본 1분
    this.cache = {};
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache[key] = {
      value,
      expiresAt: Date.now() + this.ttl,
    };
  }

  get(key) {
    const item = this.cache[key];

    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      delete this.cache[key];
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache = {};
  }
}

export const productCache = new ProductCache(60000); // 1분 캐시

/**
 * 캐시를 활용한 상품 조회
 */
export async function getProductsWithCache(options = {}) {
  const cacheKey = JSON.stringify(options);
  const cached = productCache.get(cacheKey);

  if (cached) {
    console.log('캐시에서 상품 데이터 반환');
    return cached;
  }

  console.log('DB에서 상품 데이터 조회 및 캐싱');
  const products = await getProductsServerSide(options);
  productCache.set(cacheKey, products);

  return products;
}

export default {
  getProductsServerSide,
  getProductDetailServerSide,
  handleProductsServer,
  handleProductDetailServer,
  productCache,
  getProductsWithCache,
};
