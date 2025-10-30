import { Hono } from "hono";
import { cache } from "hono/cache";
import home from "./home";
import talks from "./talks";

const router = new Hono().use(
  cache({
    cacheName: "maditya-sh",
    cacheControl: "max-age=3600",
  }),
);

router.route("/", home);
router.route("/talks", talks);

export default router;
