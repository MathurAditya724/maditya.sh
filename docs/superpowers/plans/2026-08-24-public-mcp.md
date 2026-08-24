# Public MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public, read-only Streamable HTTP MCP endpoint at `/mcp` that serves the site's existing profile and talks.

**Architecture:** Centralize public profile and talk data in a module shared by the HTML routes and an official MCP SDK server. Mount a stateless `@hono/mcp` Streamable HTTP transport at the root application before the cached site router.

**Tech Stack:** TypeScript, Hono, Cloudflare Workers, `@modelcontextprotocol/sdk`, `@hono/mcp`, Zod, Node test runner via `tsx`.

**Spec:** `docs/superpowers/specs/2026-08-24-public-mcp-design.md`

## Global Constraints

- Serve only the current public bio and existing talks; do not add private data, authentication, write tools, or an external datastore.
- Use `McpServer` from `@modelcontextprotocol/sdk` and `StreamableHTTPTransport` from `@hono/mcp`.
- Keep `/mcp` outside the cached site router.
- Keep the MCP server stateless and read-only.

---

### Task 1: Centralize the public content

**Files:**
- Create: `src/content.ts`
- Modify: `src/routes/home.tsx`
- Modify: `src/routes/talks.tsx`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Test: `test/content.test.ts`

**Interfaces:**
- Produces: `PROFILE: string`, `TALKS: readonly Talk[]`, and exported `Talk` metadata used by HTML routes and the MCP server.

- [x] **Step 1: Install the TypeScript test runner and add the test script**

```bash
pnpm add -D tsx
```

Add `"test": "tsx --test"` to `package.json` scripts.

- [x] **Step 2: Write the failing content test**

```ts
import test from 'node:test'
import assert from 'node:assert/strict'
import { PROFILE, TALKS } from '../src/content'

test('public content includes the profile and talk metadata', () => {
  assert.equal(PROFILE, 'I build, break, and fix stuff. Interested in LLMs, MCPs, and Hono 🔥')
  assert.ok(TALKS.length > 0)
  assert.equal(TALKS[0]?.title, 'Cloudflare BLR Meetup')
})
```

- [x] **Step 3: Run the content test to verify it fails**

Run: `pnpm test test/content.test.ts`

Expected: FAIL because `src/content.ts` does not exist.

- [x] **Step 4: Implement the shared content module and consume it in both HTML routes**

```ts
export type Talk = {
  title: string
  date: string
  description: string
  video?: string
  slides?: string
  x?: string
}

export const PROFILE = 'I build, break, and fix stuff. Interested in LLMs, MCPs, and Hono 🔥'
export const TALKS: readonly Talk[] = [
  {
    title: 'Cloudflare BLR Meetup',
    date: 'January 2026',
    description: 'Building MCPs with Hono',
    slides: 'https://talks.maditya.sh/2026-01-10/1',
  },
  {
    title: 'Hono Conf 2025 - Japan',
    date: 'October 2025',
    description: 'Hono x MCP - A New Frontier',
    video: 'https://youtu.be/0N5d8FlgpOM?t=2043',
    slides: 'https://talks.maditya.sh/2025-10-18/1',
    x: 'https://x.com/yusukebe/status/1979432285670903956',
  },
  {
    title: 'Workers Tech Talk - Japan',
    date: 'June 2025',
    description: 'Hono x MCP x Workers - Intro to hono/mcp',
    slides: 'https://talks.maditya.sh/2025-06-03/1',
    x: 'https://x.com/MathurAditya7/status/1933106467445293292',
  },
]
```

- [x] **Step 5: Run the content test to verify it passes**

Run: `pnpm test test/content.test.ts`

Expected: PASS.

- [x] **Step 6: Commit the shared content module**

```bash
git add package.json pnpm-lock.yaml src/content.ts src/routes/home.tsx src/routes/talks.tsx test/content.test.ts
git commit -m "refactor: centralize public profile and talks"
```

### Task 2: Build and mount the public MCP server

**Files:**
- Create: `src/mcp.ts`
- Modify: `src/index.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Test: `test/mcp.test.ts`

**Interfaces:**
- Consumes: `PROFILE` and `TALKS` from `src/content.ts`.
- Produces: `createMcpServer(): McpServer` and a Streamable HTTP `/mcp` endpoint.

- [x] **Step 1: Install MCP dependencies**

```bash
pnpm add @hono/mcp @modelcontextprotocol/sdk zod
```

- [x] **Step 2: Write failing MCP server tests**

```ts
test('MCP exposes the public profile and talks', async () => {
  const client = await connectInMemory(createMcpServer())
  assert.deepEqual((await client.listTools()).tools.map(({ name }) => name), [
    'get_profile', 'list_talks', 'get_talk',
  ])
  assert.deepEqual((await client.listResources()).resources.map(({ uri }) => uri), [
    'https://maditya.sh/profile', 'https://maditya.sh/talks',
  ])
  assert.match(text(await client.readResource({ uri: 'https://maditya.sh/profile' })), /I build, break/)
  assert.match(text(await client.callTool({ name: 'get_profile' })), /I build, break/)
  assert.match(text(await client.callTool({ name: 'list_talks' })), /Cloudflare BLR Meetup/)
})

test('get_talk reports an unknown title as an MCP tool error', async () => {
  const client = await connectInMemory(createMcpServer())
  const result = await client.callTool({ name: 'get_talk', arguments: { title: 'Unknown' } })
  assert.equal(result.isError, true)
})
```

- [x] **Step 3: Run MCP tests to verify they fail**

Run: `pnpm test test/mcp.test.ts`

Expected: FAIL because `createMcpServer` does not exist.

- [x] **Step 4: Implement the MCP factory and tools/resources**

```ts
export const createMcpServer = () => {
  const server = new McpServer({ name: 'maditya.sh', version: '1.0.0' })
  server.registerTool('get_profile', { description: 'Get Aditya Mathur public profile.' }, () => text(PROFILE))
  server.registerTool('list_talks', { description: 'List Aditya Mathur public talks.' }, () => text(JSON.stringify(TALKS)))
  server.registerTool('get_talk', { inputSchema: { title: z.string() } }, ({ title }) => findTalk(title))
  return server
}
```

- [x] **Step 5: Run MCP tests to verify they pass**

Run: `pnpm test test/mcp.test.ts`

Expected: PASS.

- [x] **Step 6: Commit the MCP endpoint**

```bash
git add src/mcp.ts src/index.ts package.json pnpm-lock.yaml test/mcp.test.ts
git commit -m "feat: add public profile MCP"
```

### Task 3: Verify the worker bundle and route

**Files:**
- Modify: `README.md` only if the repository already has a README; otherwise no documentation file change.

**Interfaces:**
- Consumes: the complete Hono application at `src/index.ts`.
- Produces: verified `/mcp` route and production-ready bundle.

- [x] **Step 1: Add a Hono request test for MCP initialization**

```ts
test('POST /mcp accepts an initialize request', async () => {
  const response = await app.request('/mcp', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {
      protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'test', version: '1.0.0' },
    } }),
  })
  assert.equal(response.status, 200)
})
```

- [x] **Step 2: Run the route test to verify it fails before route mounting**

Run: `pnpm test test/mcp.test.ts`

Expected: FAIL until `/mcp` is mounted.

- [x] **Step 3: Mount `/mcp` before the cached router**

```ts
const mcpServer = createMcpServer()
const mcpTransport = new StreamableHTTPTransport()

app.all('/mcp', async (c) => {
  if (!mcpServer.isConnected()) await mcpServer.connect(mcpTransport)
  return mcpTransport.handleRequest(c)
})

app.use(renderer)
app.route('/', routes)
```

- [x] **Step 4: Run the route test to verify it passes**

Run: `pnpm test test/mcp.test.ts`

Expected: PASS.

- [x] **Step 5: Run formatting, all tests, and production build**

```bash
pnpm exec biome check .
pnpm test
pnpm build
```

Expected: all commands exit successfully.

- [x] **Step 6: Commit final verification-related changes**

```bash
git add test/mcp.test.ts README.md
git commit -m "test: cover public MCP endpoint"
```
