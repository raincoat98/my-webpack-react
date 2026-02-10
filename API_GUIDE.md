# Product API 가이드

## 개요

이 프로젝트는 상품 관리 시스템의 클라이언트-서버 API 예시를 제공합니다.

- **클라이언트**: React + ag-grid
- **서버**: Node.js/Express (예시)
- **데이터베이스**: 메모리 저장소 또는 MongoDB (확장 가능)

---

## 파일 구조

```
src/
├── api/
│   ├── productApi.js                 # 클라이언트 API 함수 (Mock 또는 실제 서버 연결)
│   └── productApi.server.example.js  # 서버사이드 구현 예시 (Express)
├── components/
│   └── ProductList.js                # 상품 목록 컴포넌트
└── ...

.env.example                          # 환경변수 예시
```

---

## 빠른 시작

### 1. Mock API 사용 (기본값)

환경변수가 설정되지 않으면 Mock API를 사용합니다.

```bash
npm start
```

Mock 데이터가 로드되어 즉시 테스트 가능합니다.

### 2. 실제 서버 연결

`.env` 파일을 생성하여 서버 URL을 설정합니다:

```bash
cp .env.example .env
```

`.env` 파일 수정:

```env
REACT_APP_USE_MOCK_API=false
REACT_APP_API_URL=http://localhost:5000/api
```

그 후 서버를 실행해야 합니다 (아래 참조).

---

## 클라이언트 API (`productApi.js`)

### 사용 가능한 함수

#### 1. 상품 목록 조회

```javascript
import { fetchProducts } from '@/api/productApi';

// 기본 사용
const products = await fetchProducts();

// 옵션 포함
const products = await fetchProducts({
  category: '카테고리 1',
  sortBy: 'price',
  order: 'asc'
});
```

#### 2. 상품 상세 조회

```javascript
import { fetchProductDetail } from '@/api/productApi';

const product = await fetchProductDetail(1);
```

#### 3. 상품 생성

```javascript
import { createProduct } from '@/api/productApi';

const newProduct = await createProduct({
  name: 'New Product',
  price: 50000,
  description: '새 상품 설명',
  stock: 100,
  category: '카테고리 1'
});
```

#### 4. 상품 수정

```javascript
import { updateProduct } from '@/api/productApi';

const updated = await updateProduct(1, {
  price: 55000,
  stock: 80
});
```

#### 5. 상품 삭제

```javascript
import { deleteProduct } from '@/api/productApi';

const deleted = await deleteProduct(1);
```

---

## 서버사이드 구현 예시

`productApi.server.example.js` 파일에서 Express 서버의 전체 구현 예시를 확인할 수 있습니다.

### 설치 및 실행

```bash
# 서버 디렉토리로 이동
cd server

# 의존성 설치
npm install express cors dotenv

# 서버 실행
npm start
# 포트 5000에서 실행됨
```

### API 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/products` | 상품 목록 조회 |
| GET | `/api/products/:id` | 상품 상세 조회 |
| POST | `/api/products` | 상품 생성 |
| PUT | `/api/products/:id` | 상품 수정 |
| DELETE | `/api/products/:id` | 상품 삭제 |

### 요청 예시

```bash
# 상품 목록 조회
curl http://localhost:5000/api/products

# 카테고리 필터링
curl "http://localhost:5000/api/products?category=카테고리%201"

# 상품 생성
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "price": 50000,
    "description": "상품 설명",
    "stock": 100,
    "category": "카테고리 1"
  }'

# 상품 수정
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 55000}'

# 상품 삭제
curl -X DELETE http://localhost:5000/api/products/1
```

### 응답 형식

모든 응답은 다음 형식을 따릅니다:

```json
{
  "success": true,
  "data": { /* 실제 데이터 */ },
  "message": "선택사항"
}
```

오류 응답:

```json
{
  "success": false,
  "message": "오류 설명",
  "error": "상세 오류 정보"
}
```

---

## 데이터베이스 연결 (MongoDB 예시)

`productApi.server.example.js`의 "8. 데이터베이스 연결 예시" 섹션을 참조하세요.

### 필수 패키지

```bash
npm install mongoose dotenv
```

### MongoDB 연결 설정

```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/products_db');
```

### .env 설정

```env
MONGODB_URI=mongodb://localhost:27017/products_db
```

---

## 환경변수 설정

`.env.example`을 참고하여 `.env` 파일을 생성하세요.

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `REACT_APP_API_URL` | 서버 API URL | `http://localhost:5000/api` |
| `REACT_APP_USE_MOCK_API` | Mock API 사용 여부 | `true` |
| `NODE_ENV` | 환경 (development/production) | `development` |

---

## 개발 흐름

### 1. Mock API로 개발

```bash
# .env 설정 (또는 기본값 사용)
REACT_APP_USE_MOCK_API=true

# 개발 서버 시작
npm start
```

### 2. 서버 구현

`productApi.server.example.js`의 코드를 참고하여 백엔드 API를 구현합니다.

```bash
# 서버 실행
cd server
npm install
npm start
```

### 3. 실제 서버 연결로 전환

```env
REACT_APP_USE_MOCK_API=false
REACT_APP_API_URL=http://localhost:5000/api
```

재시작:

```bash
npm start
```

---

## 에러 처리

API 함수들은 Promise를 반환하므로 `try-catch` 또는 `.catch()`를 사용하세요:

```javascript
// try-catch 사용
try {
  const products = await fetchProducts();
} catch (error) {
  console.error('상품 조회 실패:', error.message);
}

// .catch() 사용
fetchProducts()
  .catch((error) => {
    console.error('상품 조회 실패:', error.message);
  });
```

---

## CORS 설정 (개발 환경)

개발 중 CORS 오류가 발생하면 서버의 CORS 설정을 확인하세요:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // React 개발 서버
  credentials: true
}));
```

---

## 성능 최적화

### 페이지네이션

서버에 페이지네이션 지원을 추가할 수 있습니다:

```javascript
// 요청
fetchProducts({ page: 1, pageSize: 10 })

// 서버 구현
app.get('/api/products', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (page - 1) * pageSize;

  const products = await Product.find()
    .skip(skip)
    .limit(pageSize);

  const total = await Product.countDocuments();

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  });
});
```

### 캐싱

브라우저 캐싱을 활용하거나 Redis를 사용할 수 있습니다:

```javascript
// 간단한 메모리 캐싱
const cache = {};

app.get('/api/products', (req, res) => {
  if (cache.products) {
    return res.json(cache.products);
  }

  // 데이터 조회 후 캐싱
  const data = await fetchFromDB();
  cache.products = { success: true, data };
  res.json(cache.products);
});
```

---

## 더 알아보기

- [Express 공식 문서](https://expressjs.com)
- [MongoDB 공식 문서](https://docs.mongodb.com)
- [ag-grid 문서](https://www.ag-grid.com/javascript-data-grid)
- [React 공식 문서](https://react.dev)

---

## 문제 해결

### Mock API가 아닌 실제 서버 호출이 안 되는 경우

1. `.env` 파일에서 `REACT_APP_USE_MOCK_API=false`로 설정했는지 확인
2. 서버가 `http://localhost:5000`에서 실행 중인지 확인
3. 브라우저 개발자도구 Network 탭에서 API 호출을 확인

### CORS 오류

1. 서버의 CORS 설정을 확인
2. `Access-Control-Allow-Origin` 헤더가 클라이언트의 origin을 포함하는지 확인

### 데이터베이스 연결 오류

1. MongoDB가 실행 중인지 확인 (기본 포트: 27017)
2. 연결 문자열이 올바른지 확인
3. 방화벽/네트워크 설정을 확인
