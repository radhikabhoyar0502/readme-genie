#!/usr/bin/env node
import { program } from 'commander';
import { analyzeProject } from './src/analyze.js';
import { generateReadme } from './src/generate.js';
import path from 'path';

program
  .version('1.0.0')
  .description('Generate README.md from source code')
  .argument('[folder]', 'Folder to analyze', '.')
  .action(async (folder) => {
    const absolutePath = path.resolve(process.cwd(), folder);

    console.log(`🔍 Analyzing folder: ${absolutePath}`);
    const data = await analyzeProject(absolutePath);

    console.log(`📊 Found ${data.components.length} components and ${data.functions.length} functions`);
    console.log('📄 Generating README...');

    generateReadme(data, folder);

    console.log('✅ README.md created successfully!');
  });

program.parse(process.argv);
