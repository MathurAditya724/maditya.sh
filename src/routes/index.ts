import { Hono } from "hono";
import home from "./home";
import talks from "./talks";

const router = new Hono();

router.route("/", home);
router.route("/talks", talks);

export default router;
