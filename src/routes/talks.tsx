import { Hono } from "hono";

const router = new Hono();

const TALKS = [
  {
    title: "Hono Conf 2025 - Japan",
    date: "October 2025",
    description: "Hono x MCP - A New Frontier",
    video: "https://youtu.be/0N5d8FlgpOM?t=2043",
  },
  {
    title: "Workers Tech Talk - Japan",
    date: "June 2025",
    description: "Hono x MCP x Workers - Intro to hono/mcp",
    slides: "https://talks.maditya.sh/2025-06-03/1",
  },
];

router.get("/", (c) => {
  return c.render(
    <>
      <h2 class="text-2xl font-semibold mb-8">Talks</h2>
      <div class="flex flex-col gap-8">
        {TALKS.map((talk) => (
          <article class="border-b border-gray-800 pb-6">
            <h3 class="text-lg font-medium mb-2 text-white">{talk.title}</h3>
            <time class="text-sm text-gray-500 mb-2 block">{talk.date}</time>
            <p class="text-gray-400 text-sm leading-relaxed mb-3">
              {talk.description}
            </p>
            <div class="flex gap-4 text-sm">
              {talk.video && (
                <a
                  href={talk.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-400 underline transition-colors hover:text-white"
                >
                  Watch Video →
                </a>
              )}
              {talk.slides && (
                <a
                  href={talk.slides}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-400 underline transition-colors hover:text-white"
                >
                  View Slides →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </>,
  );
});

export default router;
