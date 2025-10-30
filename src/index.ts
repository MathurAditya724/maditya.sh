import { Hono } from "hono";
import { cache } from "hono/cache";
import { renderer } from "./renderer";
import routes from "./routes";

const app = new Hono().use(
  cache({
    cacheName: "maditya-sh",
    cacheControl: "max-age=3600",
  }),
);

app.use(renderer);

app.route("/", routes);

export default app;
