export type Talk = {
  title: string;
  date: string;
  description: string;
  video?: string;
  slides?: string;
  x?: string;
};

export const PROFILE =
  "I build, break, and fix stuff. Interested in LLMs, MCPs, and Hono 🔥";

export const TALKS: readonly Talk[] = [
  {
    title: "Cloudflare BLR Meetup",
    date: "January 2026",
    description: "Building MCPs with Hono",
    slides: "https://talks.maditya.sh/2026-01-10/1",
  },
  {
    title: "Hono Conf 2025 - Japan",
    date: "October 2025",
    description: "Hono x MCP - A New Frontier",
    video: "https://youtu.be/0N5d8FlgpOM?t=2043",
    slides: "https://talks.maditya.sh/2025-10-18/1",
    x: "https://x.com/yusukebe/status/1979432285670903956",
  },
  {
    title: "Workers Tech Talk - Japan",
    date: "June 2025",
    description: "Hono x MCP x Workers - Intro to hono/mcp",
    slides: "https://talks.maditya.sh/2025-06-03/1",
    x: "https://x.com/MathurAditya7/status/1933106467445293292",
  },
];
