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
