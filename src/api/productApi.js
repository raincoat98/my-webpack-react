// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// 샘플 상품 데이터 (모의 데이터용)
const sampleProducts = [
  { id: 1, name: 'Product A', price: 10000, description: '고급 상품 A', stock: 50, category: '카테고리 1' },
  { id: 2, name: 'Product B', price: 20000, description: '프리미엄 상품 B', stock: 30, category: '카테고리 2' },
  { id: 3, name: 'Product C', price: 30000, description: '최고급 상품 C', stock: 15, category: '카테고리 1' },
  { id: 4, name: 'Product D', price: 15000, description: '스탠다드 상품 D', stock: 45, category: '카테고리 3' },
  { id: 5, name: 'Product E', price: 25000, description: '프리미엄 상품 E', stock: 20, category: '카테고리 2' },
];

// 환경변수로 Mock API 사용 여부 결정 (기본값: true)
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API !== 'false';

/**
 * 상품 목록 조회 API
 * @param {Object} options - 조회 옵션
 * @param {string} options.category - 카테고리 필터
 * @param {string} options.sortBy - 정렬 필드
 * @param {string} options.order - 정렬 순서 (asc/desc)
 * @returns {Promise<Array>} 상품 데이터 배열
 */
export const fetchProducts = (options = {}) => {
  if (USE_MOCK_API) {
    // Mock API 사용
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sampleProducts);
      }, 500); // 500ms 후 데이터 반환 (네트워크 딜레이 시뮬레이션)
    });
  }

  // 실제 서버 API 호출
  const queryParams = new URLSearchParams();
  if (options.category) queryParams.append('category', options.category);
  if (options.sortBy) queryParams.append('sortBy', options.sortBy);
  if (options.order) queryParams.append('order', options.order);

  return fetch(`${API_BASE_URL}/products?${queryParams.toString()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message || '데이터 조회 실패');
    });
};

/**
 * 특정 상품 상세 조회 API
 * @param {number} productId - 상품 ID
 * @returns {Promise<Object>} 상품 데이터
 */
export const fetchProductDetail = (productId) => {
  if (USE_MOCK_API) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = sampleProducts.find(p => p.id === productId);
        if (product) {
          resolve(product);
        } else {
          reject(new Error('상품을 찾을 수 없습니다.'));
        }
      }, 300);
    });
  }

  return fetch(`${API_BASE_URL}/products/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message || '상품 조회 실패');
    });
};

/**
 * 상품 생성 API
 * @param {Object} productData - 상품 정보
 * @returns {Promise<Object>} 생성된 상품 데이터
 */
export const createProduct = (productData) => {
  if (USE_MOCK_API) {
    return new Promise((resolve) => {
      const newProduct = {
        id: Math.max(...sampleProducts.map(p => p.id), 0) + 1,
        ...productData,
      };
      sampleProducts.push(newProduct);
      setTimeout(() => resolve(newProduct), 300);
    });
  }

  return fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message || '상품 생성 실패');
    });
};

/**
 * 상품 수정 API
 * @param {number} productId - 상품 ID
 * @param {Object} productData - 수정할 상품 정보
 * @returns {Promise<Object>} 수정된 상품 데이터
 */
export const updateProduct = (productId, productData) => {
  if (USE_MOCK_API) {
    return new Promise((resolve, reject) => {
      const productIndex = sampleProducts.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        sampleProducts[productIndex] = {
          ...sampleProducts[productIndex],
          ...productData,
          id: sampleProducts[productIndex].id,
        };
        setTimeout(() => resolve(sampleProducts[productIndex]), 300);
      } else {
        reject(new Error('상품을 찾을 수 없습니다.'));
      }
    });
  }

  return fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message || '상품 수정 실패');
    });
};

/**
 * 상품 삭제 API
 * @param {number} productId - 상품 ID
 * @returns {Promise<Object>} 삭제된 상품 데이터
 */
export const deleteProduct = (productId) => {
  if (USE_MOCK_API) {
    return new Promise((resolve, reject) => {
      const productIndex = sampleProducts.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        const deletedProduct = sampleProducts.splice(productIndex, 1)[0];
        setTimeout(() => resolve(deletedProduct), 300);
      } else {
        reject(new Error('상품을 찾을 수 없습니다.'));
      }
    });
  }

  return fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message || '상품 삭제 실패');
    });
};
