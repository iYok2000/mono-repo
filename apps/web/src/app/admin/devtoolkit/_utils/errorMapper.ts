/**
 * Error Mapper for DevToolkit Admin
 * Maps backend error codes to user-friendly Thai messages
 */

interface BackendError {
  code?: string;
  message?: string;
}

interface ErrorResponse {
  response?: {
    data?: BackendError;
  };
  message?: string;
}

/**
 * Map backend error to user-friendly message
 */
export const mapToolkitError = (error: any): string => {
  // Check if it's an axios error with response
  const backendError = error?.response?.data as BackendError | undefined;

  if (!backendError) {
    return error?.message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
  }

  const { code, message } = backendError;

  // Map specific error codes
  switch (code) {
    case "VALIDATION_ERROR":
      return mapValidationError(message || "");

    case "DUPLICATE_ENTRY":
      return "รหัสนี้มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น";

    case "NOT_FOUND":
      return "ไม่พบข้อมูลที่ต้องการแก้ไข";

    case "FOREIGN_KEY_CONSTRAINT":
      return "ไม่สามารถลบได้ เนื่องจากมีข้อมูลอื่นที่เชื่อมโยงอยู่";

    default:
      // If no specific mapping, try to extract useful info from message
      return mapGenericError(message || "เกิดข้อผิดพลาด");
  }
};

/**
 * Map validation errors to Thai messages
 */
const mapValidationError = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  // Category validation
  if (lowerMessage.includes("category") && lowerMessage.includes("not exist")) {
    return "หมวดหมู่ที่เลือกไม่ถูกต้องหรือไม่มีในระบบ กรุณาเลือกหมวดหมู่ที่มีอยู่";
  }

  if (lowerMessage.includes("category_id") && lowerMessage.includes("required")) {
    return "กรุณาเลือกหมวดหมู่";
  }

  // Title validation
  if (lowerMessage.includes("title") && lowerMessage.includes("required")) {
    return "กรุณากรอกชื่อ Toolkit";
  }

  if (lowerMessage.includes("title") && lowerMessage.includes("empty")) {
    return "ชื่อ Toolkit ต้องไม่เป็นค่าว่าง";
  }

  // Description validation
  if (lowerMessage.includes("description") && lowerMessage.includes("required")) {
    return "กรุณากรอกคำอธิบาย";
  }

  // Tags validation
  if (lowerMessage.includes("tag") && lowerMessage.includes("invalid")) {
    return "แท็กที่เลือกไม่ถูกต้อง กรุณาเลือกแท็กที่มีในระบบ";
  }

  // Generic validation
  if (lowerMessage.includes("validation")) {
    return `ข้อมูลไม่ถูกต้อง: ${message}`;
  }

  return `ข้อมูลไม่ถูกต้อง: ${message}`;
};

/**
 * Map generic errors to Thai messages
 */
const mapGenericError = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("network") || lowerMessage.includes("timeout")) {
    return "เกิดปัญหาในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
  }

  if (lowerMessage.includes("duplicate")) {
    return "ข้อมูลซ้ำ กรุณาตรวจสอบและลองใหม่อีกครั้ง";
  }

  if (lowerMessage.includes("not found") || lowerMessage.includes("404")) {
    return "ไม่พบข้อมูลที่ต้องการ";
  }

  if (lowerMessage.includes("unauthorized") || lowerMessage.includes("401")) {
    return "ไม่มีสิทธิ์ในการดำเนินการ กรุณาเข้าสู่ระบบใหม่";
  }

  if (lowerMessage.includes("forbidden") || lowerMessage.includes("403")) {
    return "ไม่มีสิทธิ์เข้าถึงข้อมูลนี้";
  }

  if (lowerMessage.includes("500") || lowerMessage.includes("internal server")) {
    return "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาติดต่อผู้ดูแลระบบ";
  }

  // Return original message if no specific mapping
  return message || "เกิดข้อผิดพลาดในการดำเนินการ";
};

/**
 * Get specific field error for form validation
 */
export const getFieldError = (error: any, field: string): string | null => {
  const backendError = error?.response?.data as BackendError | undefined;

  if (!backendError?.message) {
    return null;
  }

  const message = backendError.message.toLowerCase();

  // Check if error message mentions the specific field
  if (message.includes(field.toLowerCase())) {
    return mapToolkitError(error);
  }

  return null;
};
