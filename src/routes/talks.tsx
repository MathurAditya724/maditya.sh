import { Hono } from "hono";
import { TALKS } from "../content";

const router = new Hono();

router.get("/", (c) =>
  c.render(
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
            <div class="flex gap-4 text-sm flex-wrap">
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
              {talk.x && (
                <a
                  href={talk.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-400 underline transition-colors hover:text-white"
                >
                  X Post →
                </a>
              )}
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
            </div>
          </article>
        ))}
      </div>
    </>,
  ),
);

export default router;
