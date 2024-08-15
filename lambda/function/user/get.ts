import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import prisma from "../client/prisma-client";
import { getUser } from "../client/user-client";
import { comparePassword, encodeJWT, validateParams } from "../utils/auth-util";
import {
  INTERNAL_SERVER_ERROR,
  MISSING_PASSWORD,
  MISSING_REQUEST_BODY,
  NOT_FOUND,
} from "../utils/errors";
import * as utils from "../utils/responses";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const body = event.body;

  if (!body) {
    return utils.failedResponse(MISSING_REQUEST_BODY);
  }

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

  try {
    const { data, error } = await getUser(requestBody.email);
    if (error) {
      return utils.failedResponse(INTERNAL_SERVER_ERROR(error));
    }

    if (!(data && data.email)) {
      return utils.failedResponse(NOT_FOUND);
    }

    if (!(await comparePassword(requestBody.password, data.passwordDigest))) {
      return utils.failedResponse(MISSING_PASSWORD);
    }

    const token = encodeJWT(data.email);
    return utils.successPostResponse({
      message: "Login successfully",
      content: {
        token: token,
      },
    });
  } catch (error: any) {
    return utils.failedResponse(INTERNAL_SERVER_ERROR(error));
  } finally {
    prisma.$disconnect();
  }
};
