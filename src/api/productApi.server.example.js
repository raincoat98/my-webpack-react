/**
 * 서버사이드 API 예시 (Node.js/Express)
 *
 * 클라이언트의 fetchProducts() 호출에 대응하는 백엔드 구현 예시입니다.
 */

// ============================================================
// 1. Express 서버 기본 설정
// ============================================================
/*
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// 데이터베이스에서 조회한다고 가정
const products = [
  { id: 1, name: 'Product A', price: 10000, description: '고급 상품 A', stock: 50, category: '카테고리 1' },
  { id: 2, name: 'Product B', price: 20000, description: '프리미엄 상품 B', stock: 30, category: '카테고리 2' },
  { id: 3, name: 'Product C', price: 30000, description: '최고급 상품 C', stock: 15, category: '카테고리 1' },
  { id: 4, name: 'Product D', price: 15000, description: '스탠다드 상품 D', stock: 45, category: '카테고리 3' },
  { id: 5, name: 'Product E', price: 25000, description: '프리미엄 상품 E', stock: 20, category: '카테고리 2' },
];

// ============================================================
// 2. 상품 목록 조회 API
// ============================================================
app.get('/api/products', (req, res) => {
  try {
    // 쿼리 파라미터로 필터링/정렬 등 처리 가능
    const { category, sortBy, order } = req.query;

    let filteredProducts = [...products];

    // 카테고리 필터링
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // 정렬
    if (sortBy) {
      filteredProducts.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (order === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // 성공 응답
    res.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '상품 목록 조회 실패',
      error: error.message,
    });
  }
});

// ============================================================
// 3. 특정 상품 상세 조회 API
// ============================================================
app.get('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '상품 조회 실패',
      error: error.message,
    });
  }
});

// ============================================================
// 4. 상품 생성 API
// ============================================================
app.post('/api/products', (req, res) => {
  try {
    const { name, price, description, stock, category } = req.body;

    // 유효성 검증
    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: '필수 정보가 누락되었습니다.',
      });
    }

    const newProduct = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name,
      price,
      description,
      stock: stock || 0,
      category,
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      message: '상품이 생성되었습니다.',
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '상품 생성 실패',
      error: error.message,
    });
  }
});

// ============================================================
// 5. 상품 수정 API
// ============================================================
app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const productIndex = products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }

    products[productIndex] = {
      ...products[productIndex],
      ...updateData,
      id: products[productIndex].id, // ID는 변경 불가
    };

    res.json({
      success: true,
      message: '상품이 수정되었습니다.',
      data: products[productIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '상품 수정 실패',
      error: error.message,
    });
  }
});

// ============================================================
// 6. 상품 삭제 API
// ============================================================
app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }

    const deletedProduct = products.splice(productIndex, 1);

    res.json({
      success: true,
      message: '상품이 삭제되었습니다.',
      data: deletedProduct[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '상품 삭제 실패',
      error: error.message,
    });
  }
});

// ============================================================
// 7. 서버 시작
// ============================================================
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
*/

// ============================================================
// 8. 데이터베이스 연결 예시 (MongoDB 사용)
// ============================================================
/*
const mongoose = require('mongoose');

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

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/products_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 데이터베이스에서 상품 조회
app.get('/api/products', async (req, res) => {
  try {
    const { category, sortBy = 'id', order = 'asc' } = req.query;

    let query = {};
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 });

    res.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '상품 목록 조회 실패',
      error: error.message,
    });
  }
});
*/

// ============================================================
// 9. 환경변수 및 에러 핸들링 예시
// ============================================================
/*
require('dotenv').config();

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '서버 오류가 발생했습니다.',
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 엔드포인트를 찾을 수 없습니다.',
  });
});
*/

module.exports = {};
