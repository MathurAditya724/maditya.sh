import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import app from "../src/index";
import { createMcpServer } from "../src/mcp";

const connectClient = async () => {
  const client = new Client({ name: "test-client", version: "1.0.0" });
  const server = createMcpServer();
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();

  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);

  return client;
};

type ToolResult = Awaited<ReturnType<Client["callTool"]>>;

const hasContent = (
  result: ToolResult,
): result is ToolResult & { content: Array<{ type: string; text?: string }> } =>
  "content" in result && Array.isArray(result.content);

const text = (result: ToolResult) => {
  assert.ok(hasContent(result));

  return result.content
    .filter((content) => content.type === "text")
    .map((content) => content.text)
    .join("\n");
};

test("MCP exposes the public profile and talks", async () => {
  const client = await connectClient();

  assert.deepEqual(
    (await client.listTools()).tools.map(({ name }) => name),
    ["get_profile", "list_talks", "get_talk"],
  );
  assert.deepEqual(
    (await client.listResources()).resources.map(({ uri }) => uri),
    ["https://maditya.sh/profile", "https://maditya.sh/talks"],
  );
  const profileResource = (
    await client.readResource({ uri: "https://maditya.sh/profile" })
  ).contents[0];
  assert.ok(profileResource && "text" in profileResource);
  assert.match(profileResource.text, /I build, break/);
  assert.match(
    text(await client.callTool({ name: "get_profile" })),
    /I build, break/,
  );
  assert.match(
    text(await client.callTool({ name: "list_talks" })),
    /Cloudflare BLR Meetup/,
  );
  assert.match(
    text(
      await client.callTool({
        name: "get_talk",
        arguments: { title: "Cloudflare BLR Meetup" },
      }),
    ),
    /Building MCPs with Hono/,
  );
});

test("get_talk reports an unknown title as an MCP tool error", async () => {
  const client = await connectClient();
  const result = await client.callTool({
    name: "get_talk",
    arguments: { title: "Unknown" },
  });

  assert.equal(result.isError, true);
});

test("POST /mcp accepts an initialize request", async () => {
  const response = await app.request("/mcp", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" },
      },
    }),
  });

  assert.equal(response.status, 200);
});
