import { Hono } from "hono";

const router = new Hono();

router.get("/", (c) =>
  c.render(
    <p class="text-base leading-[1.7] text-gray-300">
      I build, break, and fix stuff. Interested in LLMs, MCPs, and Hono 🔥
    </p>,
  ),
);

export default router;
