import { Hono } from "hono";

const router = new Hono();

router.get("/", (c) =>
  c.render(
    <p class="text-base leading-[1.7] text-gray-300">
      I create bugs for LLMs to solve. Buidling Random Stuff. Currently working
      around Hono and MCPs.
    </p>,
  ),
);

export default router;
