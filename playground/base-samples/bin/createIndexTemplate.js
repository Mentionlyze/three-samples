import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";

export async function createIndexTemplate(sample) {
  const targetFolderPath = resolve(
    join(process.cwd(), "samples", sample, "src"),
  );
  try {
    const exists = existsSync(targetFolderPath);
    if (!exists) {
      await mkdir(targetFolderPath);
    }
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const templatePath = resolve(join(__dirname, "index.template.ejs"));

    const templateCode = await readFile(templatePath, { encoding: "utf-8" });
    const code = ejs.render(templateCode.toString(), { sample });

    const targetIndexFilePath = resolve(join(targetFolderPath, "index.ts"));
    await writeFile(targetIndexFilePath, code);
  } catch (err) {
    console.log(err);
    process.exit();
  }
}

