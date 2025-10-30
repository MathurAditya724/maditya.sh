import type { PropsWithChildren } from "hono/jsx";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { Link, ViteClient } from "vite-ssr-components/hono";
import { cn } from "./utils";

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Aditya Mathur</title>
        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
      </head>
      <body class="bg-black text-white font-sans leading-relaxed p-8 sm:p-6 max-w-3xl mx-auto">
        <header class="flex justify-between items-center mb-10 sm:gap-4">
          <a href="/">
            <h1 class="text-lg font-semibold text-white transition-colors hover:text-gray-300">
              Aditya Mathur
            </h1>
          </a>
          <nav class="flex gap-6 sm:gap-5">
            <NavLink href="/talks">Talks</NavLink>
          </nav>
        </header>
        <main class="mb-12">{children}</main>
        <footer class="flex flex-col gap-2">
          <a
            href="https://twitter.com/mathuraditya724"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-500 no-underline text-sm transition-colors hover:text-white"
          >
            Twitter
          </a>
          <a
            href="https://github.com/mathuraditya724"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-500 no-underline text-sm transition-colors hover:text-white"
          >
            Github
          </a>
        </footer>
      </body>
    </html>
  );
});

function NavLink({ href, children }: PropsWithChildren<{ href: string }>) {
  const isActive = useRequestContext().req.path === href;
  return (
    <a
      href={href}
      class={cn(
        "no-underline text-sm transition-colors hover:text-white",
        isActive ? "text-white" : "text-gray-500",
      )}
    >
      {children}
    </a>
  );
}
