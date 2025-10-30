import { Hono } from "hono";

const router = new Hono();

router.get("/", (c) => {
  return c.render(
    <p class="text-base leading-[1.7] text-gray-300">Building random stuff.</p>,
  );
});

export default router;
