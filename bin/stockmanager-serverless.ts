import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";

import { StockManagerServerlessStack } from "../lib/stockmanager-serverless-stack";

dotenv.config();

const app = new cdk.App();
new StockManagerServerlessStack(app, "StockManagerServerlessStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
