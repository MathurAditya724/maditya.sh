import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PROFILE, TALKS } from "./content";

const json = (value: unknown) => JSON.stringify(value, null, 2);

const text = (value: unknown) => ({
  content: [{ type: "text" as const, text: json(value) }],
});

export const createMcpServer = () => {
  const server = new McpServer({
    name: "maditya.sh",
    version: "1.0.0",
  });

  server.registerResource(
    "profile",
    "https://maditya.sh/profile",
    {
      description: "Aditya Mathur's public profile.",
      mimeType: "application/json",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: json({ profile: PROFILE }),
        },
      ],
    }),
  );

  server.registerResource(
    "talks",
    "https://maditya.sh/talks",
    {
      description: "Aditya Mathur's public talks.",
      mimeType: "application/json",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: json(TALKS),
        },
      ],
    }),
  );

  server.registerTool(
    "get_profile",
    { description: "Get Aditya Mathur's public profile." },
    () => text({ profile: PROFILE }),
  );

  server.registerTool(
    "list_talks",
    { description: "List Aditya Mathur's public talks." },
    () => text(TALKS),
  );

  server.registerTool(
    "get_talk",
    {
      description: "Get one public talk by its exact title.",
      inputSchema: {
        title: z.string().min(1).describe("The exact public talk title."),
      },
    },
    ({ title }) => {
      const talk = TALKS.find((candidate) => candidate.title === title);

      if (!talk) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No public talk exists with the title: ${title}`,
            },
          ],
          isError: true,
        };
      }

      return text(talk);
    },
  );

  return server;
};
