import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono } from "hono";
import { createMcpServer } from "./mcp";
import { renderer } from "./renderer";
import routes from "./routes";

const app = new Hono();
const mcpServer = createMcpServer();
const mcpTransport = new StreamableHTTPTransport({
  sessionIdGenerator: undefined,
});
let mcpConnection: Promise<void> | undefined;

app.all("/mcp", async (c) => {
  mcpConnection ??= mcpServer.connect(mcpTransport);
  await mcpConnection;

  return mcpTransport.handleRequest(c);
});

app.use(renderer);

app.route("/", routes);

export default app;
