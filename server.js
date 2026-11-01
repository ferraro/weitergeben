// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2026 ferraro
import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL(".", import.meta.url));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
};
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const file = path.resolve(
        root,
        "." + (pathname === "/" ? "/index.html" : pathname),
      );
      if (!file.startsWith(root) || !mime[path.extname(file)]) {
        res.writeHead(404).end();
        return;
      }
      const data = await readFile(file);
      res
        .writeHead(200, {
          "Content-Type": mime[path.extname(file)],
          "X-Content-Type-Options": "nosniff",
        })
        .end(data);
    } catch {
      res.writeHead(404).end("Not found");
    }
  })
  .listen(Number(process.env.PORT) || 4173, "127.0.0.1", () =>
    console.log(
      `Weitergeben: http://127.0.0.1:${Number(process.env.PORT) || 4173}`,
    ),
  );
