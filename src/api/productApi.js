// 샘플 상품 데이터
const sampleProducts = [
  { id: 1, name: 'Product A', price: 10000, description: '고급 상품 A', stock: 50, category: '카테고리 1' },
  { id: 2, name: 'Product B', price: 20000, description: '프리미엄 상품 B', stock: 30, category: '카테고리 2' },
  { id: 3, name: 'Product C', price: 30000, description: '최고급 상품 C', stock: 15, category: '카테고리 1' },
  { id: 4, name: 'Product D', price: 15000, description: '스탠다드 상품 D', stock: 45, category: '카테고리 3' },
  { id: 5, name: 'Product E', price: 25000, description: '프리미엄 상품 E', stock: 20, category: '카테고리 2' },
];

// 상품 목록 조회 API
export const fetchProducts = () => {
  // 실제 API 호출을 모의(mock)하기 위해 Promise로 감싸서 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleProducts);
    }, 500); // 500ms 후 데이터 반환 (네트워크 딜레이 시뮬레이션)
  });
};
