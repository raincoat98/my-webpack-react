const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// In-memory product data
let products = [
  { id: 1, name: 'Product A', price: 10000, description: '고급 상품 A', stock: 50, category: '카테고리 1' },
  { id: 2, name: 'Product B', price: 20000, description: '프리미엄 상품 B', stock: 30, category: '카테고리 2' },
  { id: 3, name: 'Product C', price: 30000, description: '최고급 상품 C', stock: 15, category: '카테고리 1' },
  { id: 4, name: 'Product D', price: 15000, description: '스탠다드 상품 D', stock: 45, category: '카테고리 3' },
  { id: 5, name: 'Product E', price: 25000, description: '프리미엄 상품 E', stock: 20, category: '카테고리 2' },
];

/**
 * GET /api/products
 * 상품 목록 조회
 * Query parameters:
 *   - category: 카테고리 필터
 *   - sortBy: 정렬 필드 (name, price, stock)
 *   - order: 정렬 순서 (asc, desc)
 */
app.get('/api/products', (req, res) => {
  let result = [...products];

  // 카테고리 필터링
  if (req.query.category) {
    result = result.filter(p => p.category === req.query.category);
  }

  // 정렬
  if (req.query.sortBy) {
    const sortBy = req.query.sortBy;
    const order = req.query.order === 'desc' ? -1 : 1;

    result.sort((a, b) => {
      if (typeof a[sortBy] === 'string') {
        return a[sortBy].localeCompare(b[sortBy]) * order;
      }
      return (a[sortBy] - b[sortBy]) * order;
    });
  }

  res.json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/products/:id
 * 상품 상세 조회
 */
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === productId);

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
});

/**
 * POST /api/products
 * 상품 생성
 */
app.post('/api/products', (req, res) => {
  const { name, price, description, stock, category } = req.body;

  // 유효성 검사
  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({
      success: false,
      message: '필수 필드가 누락되었습니다.',
    });
  }

  const newProduct = {
    id: Math.max(...products.map(p => p.id), 0) + 1,
    name,
    price,
    description: description || '',
    stock,
    category: category || '',
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    data: newProduct,
  });
});

/**
 * PUT /api/products/:id
 * 상품 수정
 */
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '상품을 찾을 수 없습니다.',
    });
  }

  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
    id: productId, // ID는 변경 불가
  };

  products[productIndex] = updatedProduct;

  res.json({
    success: true,
    data: updatedProduct,
  });
});

/**
 * DELETE /api/products/:id
 * 상품 삭제
 */
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '상품을 찾을 수 없습니다.',
    });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];

  res.json({
    success: true,
    data: deletedProduct,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});
