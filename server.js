const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'data/products.json');

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 파일에서 읽기 / 쓰기
function loadProducts() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function saveProducts(products) {
  fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

/**
 * GET /api/products
 */
app.get('/api/products', (req, res) => {
  let result = loadProducts();

  if (req.query.category) {
    result = result.filter(p => p.category === req.query.category);
  }

  if (req.query.sortBy) {
    const sortBy = req.query.sortBy;
    const order = req.query.order === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      if (typeof a[sortBy] === 'string') return a[sortBy].localeCompare(b[sortBy]) * order;
      return (a[sortBy] - b[sortBy]) * order;
    });
  }

  const rowCount = result.length;
  const startRow = parseInt(req.query.startRow, 10) || 0;
  const endRow = parseInt(req.query.endRow, 10) || result.length;

  res.json({ success: true, data: result.slice(startRow, endRow), rowCount });
});

/**
 * GET /api/products/:id
 */
app.get('/api/products/:id', (req, res) => {
  const products = loadProducts();
  const product = products.find(p => p.id === parseInt(req.params.id, 10));

  if (!product) {
    return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다.' });
  }

  res.json({ success: true, data: product });
});

/**
 * POST /api/products
 */
app.post('/api/products', (req, res) => {
  const { name, price, description, stock, category } = req.body;

  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({ success: false, message: '필수 필드가 누락되었습니다.' });
  }

  const products = loadProducts();
  const newProduct = {
    id: Math.max(...products.map(p => p.id), 0) + 1,
    name,
    price,
    description: description || '',
    stock,
    category: category || '',
  };

  products.push(newProduct);
  saveProducts(products);

  res.status(201).json({ success: true, data: newProduct });
});

/**
 * PUT /api/products/:id
 */
app.put('/api/products/:id', (req, res) => {
  const products = loadProducts();
  const productId = parseInt(req.params.id, 10);
  const idx = products.findIndex(p => p.id === productId);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다.' });
  }

  products[idx] = { ...products[idx], ...req.body, id: productId };
  saveProducts(products);

  res.json({ success: true, data: products[idx] });
});

/**
 * PATCH /api/products/:id/status
 */
app.patch('/api/products/:id/status', (req, res) => {
  const products = loadProducts();
  const productId = parseInt(req.params.id, 10);
  const idx = products.findIndex(p => p.id === productId);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다.' });
  }

  products[idx].active = !products[idx].active;
  saveProducts(products);

  res.json({ success: true, data: products[idx] });
});

/**
 * GET /api/products/:id/history
 */
app.get('/api/products/:id/history', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const products = loadProducts();
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다.' });
  }

  const history = [
    { id: 1, date: '2025-01-15', type: '가격변경', before: product.price * 0.9, after: product.price, user: '관리자' },
    { id: 2, date: '2025-02-10', type: '재고입고', before: product.stock - 20, after: product.stock, user: '창고담당' },
    { id: 3, date: '2025-03-05', type: '카테고리변경', before: '미분류', after: product.category, user: '관리자' },
    { id: 4, date: '2025-04-20', type: '상품명변경', before: `${product.name} (구)`, after: product.name, user: '관리자' },
  ];

  res.json({ success: true, data: history });
});

/**
 * GET /api/products/:id/memo
 */
app.get('/api/products/:id/memo', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const products = loadProducts();
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다.' });
  }

  const memos = [
    { id: 1, content: `${product.name} 신규 등록 완료. 품질 검수 통과.`, createdAt: '2025-01-10 09:00', author: '관리자' },
    { id: 2, content: '공급업체 변경으로 인한 가격 조정 예정.', createdAt: '2025-03-01 14:30', author: '구매팀' },
    { id: 3, content: '여름 시즌 프로모션 대상 상품으로 지정.', createdAt: '2025-05-12 11:00', author: '마케팅' },
  ];

  res.json({ success: true, data: memos });
});

/**
 * DELETE /api/products/:id
 */
app.delete('/api/products/:id', (req, res) => {
  const products = loadProducts();
  const productId = parseInt(req.params.id, 10);
  const idx = products.findIndex(p => p.id === productId);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다.' });
  }

  const deleted = products.splice(idx, 1)[0];
  saveProducts(products);

  res.json({ success: true, data: deleted });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});
