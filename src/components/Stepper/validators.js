// Step 1: 상품 정보 검증
export const validateStep1 = (formData) => {
  const errors = {};

  if (!formData.name || !formData.name.trim()) {
    errors.name = '상품명을 입력해주세요';
  }
  if (formData.price == null || formData.price < 0) {
    errors.price = '가격을 입력해주세요';
  }
  if (formData.stock == null || formData.stock < 0) {
    errors.stock = '재고를 입력해주세요';
  }

  return errors;
};

// Step 2: 확인 단계 (검증 불필요)
export const validateStep2 = () => ({});
