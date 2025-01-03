#!usr/bin/env node
import { createSampleFolder } from "./createSampleFolder.js";

const sampleName = process.argv[process.argv.length - 1];
console.log(sampleName);
createSampleFolder(sampleName);
