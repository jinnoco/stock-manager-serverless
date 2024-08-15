import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import prisma from "../client/prisma-client";
import { deleteStock, getStock } from "../client/stock-client";
import { getUser } from "../client/user-client";
import { decodeJWT } from "../utils/auth-util";
import {
  AUTH_FAILED,
  INTERNAL_SERVER_ERROR,
  MISSING_REQUEST_BODY,
  NOT_FOUND,
} from "../utils/errors";
import * as utils from "../utils/responses";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const body = event.body;
  const token = event.headers.Authorization;

  if (!body) {
    return utils.failedResponse(MISSING_REQUEST_BODY);
  }

  if (!token) {
    return utils.failedResponse(AUTH_FAILED);
  }

  try {
    const requestBody = JSON.parse(body);

    if (!requestBody || !requestBody.stock_id) {
      return utils.failedResponse(MISSING_REQUEST_BODY);
    }

    const email = decodeJWT(token);

    const userResponse = await getUser(email);
    if (userResponse.error || !userResponse?.data?.id) {
      return utils.failedResponse(AUTH_FAILED);
    }

    const stockResponse = await getStock(
      userResponse.data.id,
      requestBody.stock_id,
    );

    if (stockResponse.error) {
      throw stockResponse.error;
    }

    if (!stockResponse.data?.id) {
      return utils.failedResponse(NOT_FOUND);
    }

    const { data, error } = await deleteStock(stockResponse.data.id);

    if (error) {
      return utils.failedResponse(INTERNAL_SERVER_ERROR(error));
    }

    if (!data) {
      return utils.failedResponse(NOT_FOUND);
    }

    return utils.successResponse({
      message: "Stock deleted successfully",
      data: data,
    });
  } catch (error: any) {
    return utils.failedResponse(INTERNAL_SERVER_ERROR(error));
  } finally {
    prisma.$disconnect();
  }
};
