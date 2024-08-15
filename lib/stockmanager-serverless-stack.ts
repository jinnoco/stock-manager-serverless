import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { configureApiGateway } from "./apigateway";
import {
  signup,
  login,
  createStock,
  getStocks,
  updateStock,
  deleteStock,
} from "./lambda";

export class StockManagerServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const signupFunc = signup(this);
    const loginFunc = login(this);
    const createStockFunc = createStock(this);
    const getStockFunc = getStocks(this);
    const updateStockFunc = updateStock(this);
    const deleteStockFunc = deleteStock(this);

    configureApiGateway({
      stack: this,
      lambdaFunctions: [
        { function: signupFunc, path: "sign_up", method: "POST" },
        { function: loginFunc, path: "login", method: "POST" },
        { function: createStockFunc, path: "stocks", method: "POST" },
        { function: getStockFunc, path: "stocks", method: "GET" },
        { function: updateStockFunc, path: "stocks/{id}", method: "PUT" },
        { function: deleteStockFunc, path: "stocks", method: "DELETE" },
      ],
    });
  }
}
