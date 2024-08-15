import { ErrorResponse } from "./errors";

const createSuccessResponse = async (
  json: any,
  statusCode: number,
): Promise<any> => {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  };
};

export const successResponse = async (json: any): Promise<any> => {
  return createSuccessResponse(json, 200);
};

export const successPostResponse = async (json: any): Promise<any> => {
  return createSuccessResponse(json, 201);
};

export const failedResponse = async (
  errorResponse: ErrorResponse,
): Promise<any> => {
  return {
    statusCode: errorResponse.statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: errorResponse.message,
    }),
  };
};
