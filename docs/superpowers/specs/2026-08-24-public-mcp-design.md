# Public MCP Design

## Goal

Expose the information already published on maditya.sh through a public, read-only Model Context Protocol endpoint at `/mcp`.

## Scope

The server will expose only the existing public profile sentence and the talks currently listed on the site. It will not introduce authentication, write operations, private data, dynamic external lookups, or a separate data store.

## Architecture

Public profile and talk data will live in a shared module. The HTML routes and the MCP server both consume that module, so their public information cannot drift. An MCP server constructed with `@modelcontextprotocol/sdk` will be served by `@hono/mcp`'s Streamable HTTP transport at `/mcp`.

The MCP interface will offer three read-only tools for tool-centric clients:

- `get_profile` returns the current public bio.
- `list_talks` returns all talks in reverse chronological site order.
- `get_talk` returns one talk by its exact title, or an MCP tool error when it does not exist.

It will also offer a public profile resource and a talk catalogue resource for resource-centric clients.

## Routing and Transport

`/mcp` accepts the Streamable HTTP transport's protocol methods through `app.all`. It is mounted at the application root before the existing cached HTML router. This prevents cache middleware from treating JSON-RPC traffic as a cacheable site route. The transport runs without authentication and with compatibility-oriented Accept-header handling supplied by `@hono/mcp`.

## Error Handling

Tool results are text content. `get_talk` returns `isError: true` and a clear message when the requested title is missing. Unexpected transport and protocol failures remain the SDK transport's responsibility.

## Verification

Automated tests will establish an in-memory MCP client/transport pair, confirm the advertised tools and resources, read both resources, exercise the three tools, and verify the unknown-talk error. A Hono request test will confirm the application accepts an MCP initialization POST at `/mcp`. The production bundle will be built before opening the PR.
