import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import prisma from "../client/prisma-client";
import { getStocks } from "../client/stock-client";
import { getUser } from "../client/user-client";
import { decodeJWT } from "../utils/auth-util";
import { AUTH_FAILED, INTERNAL_SERVER_ERROR } from "../utils/errors";
import * as utils from "../utils/responses";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const token = event.headers.Authorization;

  if (!token) {
    return utils.failedResponse(AUTH_FAILED);
  }

  try {
    const email = decodeJWT(token);

    const userResponse = await getUser(email);
    if (userResponse.error || !userResponse?.data?.id) {
      return utils.failedResponse(AUTH_FAILED);
    }

    const { data, error } = await getStocks(userResponse.data.id);

    if (error) {
      return utils.failedResponse(INTERNAL_SERVER_ERROR(error));
    }

    return utils.successResponse(200, "Stocks retrieved successfully", {
      data: data,
    });
  } catch (error) {
    return utils.failedResponse(INTERNAL_SERVER_ERROR(error));
  } finally {
    prisma.$disconnect();
  }
};
