import serverless from "serverless-http";
import { createServer } from "../../server";

const app = createServer();

export const handler = serverless(app, {
  binary: false,
  request: (request: any) => {
    // Log all requests for debugging
    console.log(`[Netlify] ${request.httpMethod} ${request.path}`, {
      headers: request.headers,
      queryStringParameters: request.queryStringParameters,
      body: request.body ? "Body present" : "No body",
    });
  },
  response: (response: any) => {
    // Log responses for debugging
    console.log(`[Netlify] Response:`, {
      statusCode: response.statusCode,
      headers: response.headers,
    });
  },
});
