import { Hono } from "hono";

const router = new Hono();

router.get("/", (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Aditya Mathur</title>
      </head>
      <body>
        <h1>Talks</h1>
      </body>
    </html>,
  );
});

export default router;
