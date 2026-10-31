import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { resolveConfig } from "vite";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

describe("clean MCP generation", () => {
  it("regenerates identical, strictly checkable output without bundle patches", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "iamrusiru-mcp-"));
    try {
      await writeFile(path.join(root, "package.json"), await readFile("package.json"));
      const generated = path.join(root, "supabase/functions/mcp/index.ts");
      let firstOutput = "";
      for (let pass = 0; pass < 2; pass++) {
        await rm(path.join(root, "supabase"), { recursive: true, force: true });
        await resolveConfig({
          root, configFile: false,
          plugins: [mcpPlugin({ mcpEntry: path.resolve("src/lib/mcp/index.ts") })],
        }, "build", "production");
        const output = await readFile(generated, "utf8");
        const checked = spawnSync("deno", ["check", generated], { encoding: "utf8" });
        expect(checked.status, checked.stderr).toBe(0);
        if (pass === 0) firstOutput = output;
        else expect(output).toBe(firstOutput);
      }
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }, 120_000);
});