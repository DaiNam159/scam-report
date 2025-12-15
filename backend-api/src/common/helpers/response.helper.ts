// src/common/helpers/response.helper.ts

export class ResponseHelper {
  static success(data: any = null, message = 'OK') {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(
    message: string,
    code: string | null = null,
    status: number = 400,
  ) {
    return {
      success: false,
      code,
      status,
      message,
    };
  }

  static banned(message = 'Tài khoản của bạn đã bị khóa') {
    return {
      success: false,
      code: 'USER_BANNED',
      statusCode: 403,
      message,
    };
  }

  static notFound(message = 'Không tìm thấy dữ liệu') {
    return {
      success: false,
      code: 'NOT_FOUND',
      status: 404,
      message,
    };
  }

  static unauthorized(message = 'Bạn không có quyền truy cập') {
    return {
      success: false,
      code: 'UNAUTHORIZED',
      status: 401,
      message,
    };
  }
}
