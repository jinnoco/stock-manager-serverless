import { ErrorResponse } from "./errors";

export const successResponse = async (
  statusCode: number,
  message: string,
  result: any,
): Promise<any> => {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      statusCode: statusCode,
      message: message,
      result: result,
    }),
  };
};

export const failedResponse = async (
  errorResponse: ErrorResponse,
): Promise<any> => {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
    }),
  };
};
