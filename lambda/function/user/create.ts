import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import prisma from "../client/prisma-client";
import { createUser } from "../client/user-client";
import {
  encodeJWT,
  encodePasswordDigest,
  validateParams,
} from "../utils/auth-util";
import { INTERNAL_SERVER_ERROR, MISSING_REQUEST_BODY } from "../utils/errors";
import * as utils from "../utils/responses";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const body = event.body;

  if (!body) {
    return utils.failedResponse(MISSING_REQUEST_BODY);
  }
  try {
    const requestBody = JSON.parse(body);

    if (!requestBody || !requestBody.email || !requestBody.password) {
      return utils.failedResponse(MISSING_REQUEST_BODY);
    }

    const validationError = validateParams(
      requestBody.email,
      requestBody.password,
    );

    if (validationError) {
      return utils.failedResponse(validationError);
    }

    const token = encodeJWT(requestBody.email);
    const passwordDigest = await encodePasswordDigest(requestBody.password);

    const { error } = await createUser(
      requestBody.email,
      passwordDigest,
      token,
    );

    if (error) {
      throw error;
    }

    return utils.successResponse(201, "Signup successfully", { token: token });
  } catch (error: any) {
    return utils.failedResponse(INTERNAL_SERVER_ERROR(error));
  } finally {
    prisma.$disconnect();
  }
};
