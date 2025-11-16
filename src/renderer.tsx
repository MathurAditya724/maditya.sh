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

        {/* Primary Meta Tags */}
        <title>Aditya Mathur - Software Engineer</title>
        <meta name="title" content="Aditya Mathur - Software Engineer" />
        <meta
          name="description"
          content="I build, break, and fix stuff. Interested in LLMs, MCPs, and Hono 🔥"
        />
        <meta
          name="keywords"
          content="Aditya Mathur, Software Engineer, Developer, AI, Hono, MCP, Web Development"
        />
        <meta name="author" content="Aditya Mathur" />
        <meta name="theme-color" content="#000000" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://maditya.sh/" />
        <meta property="og:title" content="Aditya Mathur - Software Engineer" />
        <meta
          property="og:description"
          content="I build, break, and fix stuff. Interested in LLMs, MCPs, and Hono 🔥"
        />
        <meta property="og:site_name" content="Aditya Mathur" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content="https://maditya.sh/" />
        <meta
          property="twitter:title"
          content="Aditya Mathur - Software Engineer"
        />
        <meta
          property="twitter:description"
          content="I build, break, and fix stuff. Interested in LLMs, MCPs, and Hono 🔥"
        />
        <meta property="twitter:creator" content="@mathuraditya7" />

        <link rel="canonical" href="https://maditya.sh/" />

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
            href="https://x.com/mathuraditya7"
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
