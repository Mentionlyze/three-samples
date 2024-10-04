import { createHtmlTemplate } from './createHtmlTemplate.js'
import { createIndexTemplate } from './createIndexTemplate.js'
import { createEntryHTMLTemplate } from './createEntryTemplate.js'

export async function createSampleFolder(sampleName) {
    try {
        await createHtmlTemplate(sampleName)
        await createIndexTemplate(sampleName)
        await createEntryHTMLTemplate()
    } catch (err) {
        console.log(err)
        process.exit()
    }
}