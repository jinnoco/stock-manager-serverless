import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import prisma from "../client/prisma-client";
import { createStock } from "../client/stock-client";
import { getUser } from "../client/user-client";
import { decodeJWT } from "../utils/auth-util";
import {
  AUTH_FAILED,
  INTERNAL_SERVER_ERROR,
  MISSING_REQUEST_BODY,
} from "../utils/errors";
import * as utils from "../utils/responses";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const token = event.headers.Authorization;
  const body = event.body;

  if (!body) {
    return utils.failedResponse(MISSING_REQUEST_BODY);
  }
  try {
    const requestBody = JSON.parse(body);

    if (!token) {
      return utils.failedResponse(AUTH_FAILED);
    }

    if (!requestBody || !requestBody.name || !requestBody.purchase_date) {
      return utils.failedResponse(MISSING_REQUEST_BODY);
    }

    const email = decodeJWT(token);

    const userResponse = await getUser(email);
    if (userResponse.error || !userResponse?.data?.id) {
      return utils.failedResponse(AUTH_FAILED);
    }

    const { data, error } = await createStock(
      requestBody.name,
      requestBody.purchase_date,
      userResponse.data.id,
      requestBody.image,
    );

    if (error) {
      return utils.failedResponse(INTERNAL_SERVER_ERROR(error));
    }

    return utils.successResponse(201, "Stock created successfully", {
      data: data,
    });
  } catch (error) {
    return utils.failedResponse(INTERNAL_SERVER_ERROR(error));
  } finally {
    prisma.$disconnect();
  }
};
