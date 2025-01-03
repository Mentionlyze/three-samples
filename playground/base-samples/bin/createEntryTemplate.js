import fg from "fast-glob";
import { readFile, writeFile } from "fs/promises";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import prettier from "prettier";

export async function createEntryHTMLTemplate() {
  try {
    const entris = fg.globSync(`samples/**/index.html`).map((v) => {
      return v.substring("samples/".length, v.length - "/index.html".length);
    });
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const templateCode = await readFile(
      resolve(join(__dirname, "entry.html.template.ejs")),
    );
    const code = ejs.render(templateCode.toString(), { samples: entris });
    const finalCode = await prettier.format(code, {
      parser: "html",
      printWidth: 120,
      tabWidth: 2,
    });
    const dir = process.cwd();
    const entryPath = resolve(join(dir, "index.html"));
    await writeFile(entryPath, finalCode);
  } catch (err) {
    console.log(err);
    process.exit();
  }
}

