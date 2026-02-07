// Reusable Validation Rules
export const validationRules = {
  required: (fieldName = 'ข้อมูล') => (v) => !!v || `กรุณากรอก${fieldName}`,
  email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email ไม่ถูกต้อง',
  minLength: (len) => (v) => !v || v.length >= len || `ต้องมีความยาวอย่างน้อย ${len} ตัวอักษร`,
  maxLength: (len) => (v) => !v || v.length <= len || `ต้องมีความยาวไม่เกิน ${len} ตัวอักษร`,
  phone: (v) => !v || /^[0-9]{9,10}$/.test(v) || 'เบอร์โทรศัพท์ไม่ถูกต้อง',
};

export default validationRules;
