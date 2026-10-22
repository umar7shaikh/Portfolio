// Regenerates public/models/city.glb from tools/blender/city.py.
//   BLENDER="C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" npm run build:city
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const blender = process.env.BLENDER || "blender";
const tmp = mkdtempSync(join(tmpdir(), "city-"));
const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" && cmd === "npx" });

run(blender, ["-b", "--factory-startup", "-P", "tools/blender/city.py", "--", tmp, ...process.argv.slice(2)]);
const gt = (...a) => run("npx", ["-y", "@gltf-transform/cli@4", ...a]);
gt("dedup", join(tmp, "city.glb"), join(tmp, "d.glb"));
gt("weld", join(tmp, "d.glb"), join(tmp, "w.glb"));
gt("meshopt", join(tmp, "w.glb"), "public/models/city.glb");
console.log("wrote public/models/city.glb (previews, if requested, are in " + tmp + ")");
