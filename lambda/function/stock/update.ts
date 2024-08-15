import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import prisma from "../client/prisma-client";
import { updateStock } from "../client/stock-client";
import { getUser } from "../client/user-client";
import { decodeJWT } from "../utils/auth-util";
import {
  AUTH_FAILED,
  INTERNAL_SERVER_ERROR,
  MISSING_PARAMETERS,
  MISSING_REQUEST_BODY,
  NOT_FOUND,
} from "../utils/errors";
import * as utils from "../utils/responses";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const body = event.body;
  const token = event.headers.Authorization;
  const id = event.pathParameters?.id;

  if (!body) {
    return utils.failedResponse(MISSING_REQUEST_BODY);
  }

  if (!id) {
    return utils.failedResponse(MISSING_PARAMETERS);
  }

  if (!token) {
    return utils.failedResponse(AUTH_FAILED);
  }

  try {
    const requestBody = JSON.parse(body);

    const email = decodeJWT(token);

    const userResponse = await getUser(email);
    if (userResponse.error || !userResponse?.data?.id) {
      return utils.failedResponse(AUTH_FAILED);
    }

    if (!requestBody || !requestBody.name || !requestBody.purchase_date) {
      return utils.failedResponse(MISSING_REQUEST_BODY);
    }

    const { data, error } = await updateStock(
      BigInt(id),
      userResponse.data.id,
      requestBody.name,
      requestBody.purchase_date,
      requestBody.image,
    );

    if (!data) {
      return utils.failedResponse(NOT_FOUND);
    }

    if (error) {
      return utils.failedResponse(INTERNAL_SERVER_ERROR(error));
    }

    return utils.successPostResponse({
      message: "Stock updated successfully",
      data: data,
    });
  } catch (error) {
    return utils.failedResponse(INTERNAL_SERVER_ERROR(error));
  } finally {
    prisma.$disconnect();
  }
};
