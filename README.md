# My Webpack React

React 16 프로젝트 with Webpack, Babel, Ant Design 3.x, React Router, and Zustand.

## 프로젝트 구조

```
my-webpack-react/
├── src/
│   ├── pages/
│   │   ├── Home.js
│   │   └── About.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.html
│   └── store.js
├── webpack.config.js
├── .babelrc
├── package.json
└── README.md
```

## 설치 및 실행

### 의존성 설치
```bash
yarn install
```

### 개발 서버 실행
```bash
yarn dev
```

### 프로덕션 빌드
```bash
yarn build
```

## 기술 스택

- **React 16** - UI 라이브러리
- **Webpack 5** - 모듈 번들러
- **Babel 7** - JavaScript 트랜스파일러
- **Ant Design 3.x** - UI 컴포넌트 라이브러리
- **React Router v5** - 클라이언트 라우팅
- **Zustand** - 상태 관리

## 주요 기능

- Counter 기능 (Zustand를 이용한 상태 관리)
- 메시지 관리
- 페이지 라우팅 (Home, About)
- Ant Design 3.x 컴포넌트 사용

## 개발 가이드

### 새로운 페이지 추가

1. `src/pages/` 디렉토리에 새 컴포넌트 파일 생성
2. `src/App.js`에 라우트 추가

### Zustand 스토어 사용

```javascript
import { useStore } from '@/store';

function MyComponent() {
  const count = useStore((state) => state.count);
  const incrementCount = useStore((state) => state.incrementCount);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementCount}>+1</button>
    </div>
  );
}
```

### Ant Design 컴포넌트 사용

```javascript
import { Button, Card, Input } from 'antd';

// Ant Design 컴포넌트 사용
```
