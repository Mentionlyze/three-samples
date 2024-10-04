import { readFile, writeFile, mkdir } from "fs/promises"
import { join, resolve, dirname } from "path"
import { fileURLToPath } from "url";
import ejs from 'ejs'
import { existsSync } from "fs";
import prettier from 'prettier'

export async function createHtmlTemplate(sampleName) {

    const targetFolderPath = resolve(join(process.cwd(), 'samples', sampleName))
    try {
        const exists = existsSync(targetFolderPath)
        if (!exists) {
            await mkdir(targetFolderPath)
        }

        const __dirname = dirname(fileURLToPath(import.meta.url))
        const templatePath = resolve(join(__dirname, 'html.template.ejs'))

        const templateCode = await readFile(templatePath, { encoding: 'utf-8' });
        const code = ejs.render(templateCode.toString(), { sample: sampleName })

        const finalCode = await prettier.format(code, { parser: 'html', printWidth: 120, tabWidth: 2 })

        const targetIndexHtmlPath = `${targetFolderPath}/index.html`

        await writeFile(targetIndexHtmlPath, finalCode)
    } catch (err) {
        console.log(err)
        process.exit()
    }
}