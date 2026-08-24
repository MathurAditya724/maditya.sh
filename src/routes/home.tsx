import { Hono } from "hono";
import { PROFILE } from "../content";

const router = new Hono();

router.get("/", (c) =>
  c.render(<p class="text-base leading-[1.7] text-gray-300">{PROFILE}</p>),
);

export default router;
