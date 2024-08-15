import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { authorizeHeaderAPIKey } from "./lambda";
import { StockManagerServerlessStack } from "./stockmanager-serverless-stack";

interface ApiGatewayConfigProps {
  stack: StockManagerServerlessStack;
  lambdaFunctions: LambdaFunctionWithPath[];
}

interface LambdaFunction {
  function: NodejsFunction;
  method:
    | "GET"
    | "POST"
    | "DELETE"
    | "PUT"
    | "PATCH"
    | "HEAD"
    | "OPTIONS"
    | "CONNECT"
    | "TRACE";
}

interface LambdaFunctionWithPath extends LambdaFunction {
  path: string;
}

export const configureApiGateway = (props: ApiGatewayConfigProps): void => {
  const { stack, lambdaFunctions } = props;
  const restApi = new apigateway.RestApi(stack, "StockManagerApi", {
    deployOptions: {
      stageName: "v1",
    },
    restApiName: "StockManagerApi",
  });

  const authorizer = new apigateway.RequestAuthorizer(
    stack,
    "RequestAuthorizer",
    {
      handler: authorizeHeaderAPIKey(stack),
      authorizerName: "RequestAuthorizer",
      identitySources: [apigateway.IdentitySource.header("x-api-key")],
      resultsCacheTtl: cdk.Duration.seconds(0),
    },
  );

  const resourceMap: { [key: string]: apigateway.Resource } = {};

  lambdaFunctions.forEach((lambdaFunction) => {
    const { path } = lambdaFunction;
    const pathParts = path.split("/");
    let resourcePath = "";

    let resource = restApi.root;
    pathParts.forEach((part) => {
      resourcePath += `/${part}`;
      if (!resourceMap[resourcePath]) {
        resource = resource.addResource(part.startsWith("{") ? part : part);
        resourceMap[resourcePath] = resource as apigateway.Resource;
      } else {
        resource = resourceMap[resourcePath];
      }
    });

    const methodOptions: apigateway.MethodOptions = {
      authorizer: authorizer,
      authorizationType: apigateway.AuthorizationType.CUSTOM,
    };
    resource.addMethod(
      lambdaFunction.method,
      new apigateway.LambdaIntegration(lambdaFunction.function),
      methodOptions,
    );
  });
};
