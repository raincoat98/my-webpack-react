// Step 1: 상품 수량 검증
export const validateStep1 = (formData) => {
  const errors = {};

  if (!formData.product) {
    errors.product = '상품을 선택해주세요';
  }
  if (!formData.quantity || formData.quantity < 1) {
    errors.quantity = '수량은 최소 1개 이상이어야 합니다';
  }

  return errors;
};

// Step 2: 계정 정보 검증
export const validateStep2 = (formData) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,11}$/;

  if (!formData.name.trim()) {
    errors.name = '이름을 입력해주세요';
  }
  if (!formData.email.trim()) {
    errors.email = '이메일을 입력해주세요';
  } else if (!emailRegex.test(formData.email)) {
    errors.email = '유효한 이메일 형식이 아닙니다';
  }
  if (!formData.phone.trim()) {
    errors.phone = '휴대폰 번호를 입력해주세요';
  } else if (!phoneRegex.test(formData.phone)) {
    errors.phone = '휴대폰 번호는 10-11자리 숫자여야 합니다';
  }

  return errors;
};
