export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export const MISSING_REQUEST_BODY: ErrorResponse = {
  statusCode: 400,
  message: "Missing request body",
};

export const MISSING_PARAMETERS: ErrorResponse = {
  statusCode: 400,
  message: "Missing parameters",
};

export const INVALID_EMAIL: ErrorResponse = {
  statusCode: 400,
  message: "Invalid email",
};

export const PASSWORD_TOO_SHORT: ErrorResponse = {
  statusCode: 400,
  message: "Password too short",
};

export const MISSING_PASSWORD: ErrorResponse = {
  statusCode: 400,
  message: "Missing password",
};

export const AUTH_FAILED: ErrorResponse = {
  statusCode: 401,
  message: "Failed authentication",
};

export const NOT_FOUND: ErrorResponse = {
  statusCode: 404,
  message: "Not found",
};

export const INTERNAL_SERVER_ERROR = (error: unknown): ErrorResponse => {
  return {
    statusCode: 500,
    message: `Internal server error: ${error}`,
  };
};
