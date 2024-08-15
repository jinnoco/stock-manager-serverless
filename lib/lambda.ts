import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { StockManagerServerlessStack } from "./stockmanager-serverless-stack";

export const authorizeHeaderAPIKey = (
  stack: StockManagerServerlessStack,
): NodejsFunction =>
  new NodejsFunction(stack, "AuthorizeHeaderAPIKeyHandler", {
    runtime: lambda.Runtime.NODEJS_20_X,
    timeout: cdk.Duration.seconds(300),
    handler: "handler",
    entry: "lambda/function/authorizer/apikey-authorizer.ts",
  });

const createNodejsFunction = (
  stack: StockManagerServerlessStack,
  id: string,
  entry: string,
): NodejsFunction =>
  new NodejsFunction(stack, id, {
    runtime: lambda.Runtime.NODEJS_20_X,
    timeout: cdk.Duration.seconds(300),
    handler: "handler",
    entry,
    bundling: {
      commandHooks: {
        beforeInstall(): string[] {
          return [``];
        },
        beforeBundling(): string[] {
          return [``];
        },
        afterBundling(inputDir: string, outputDir: string): string[] {
          return [
            `cp ${inputDir}/node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node ${outputDir}`,
            `cp ${inputDir}/prisma/schema.prisma ${outputDir}`,
          ];
        },
      },
    },
    environment: {
      DATABASE_URL: process.env.DATABASE_URL || "",
    },
  });

export const signup = (stack: StockManagerServerlessStack): NodejsFunction =>
  createNodejsFunction(
    stack,
    "signupHandler",
    "lambda/function/user/create.ts",
  );

export const login = (stack: StockManagerServerlessStack): NodejsFunction =>
  createNodejsFunction(stack, "loginHandler", "lambda/function/user/get.ts");

export const createStock = (
  stack: StockManagerServerlessStack,
): NodejsFunction =>
  createNodejsFunction(
    stack,
    "CreateStockHandler",
    "lambda/function/stock/create.ts",
  );

export const getStocks = (stack: StockManagerServerlessStack): NodejsFunction =>
  createNodejsFunction(
    stack,
    "GetStocksHandler",
    "lambda/function/stock/get.ts",
  );

export const updateStock = (
  stack: StockManagerServerlessStack,
): NodejsFunction =>
  createNodejsFunction(
    stack,
    "UpdateStockHandler",
    "lambda/function/stock/update.ts",
  );

export const deleteStock = (
  stack: StockManagerServerlessStack,
): NodejsFunction =>
  createNodejsFunction(
    stack,
    "DeleteStockHandler",
    "lambda/function/stock/delete.ts",
  );
