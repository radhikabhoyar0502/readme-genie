#!/usr/bin/env node

import { analyzeProject } from '../src/analyze.js';
import { generateReadme } from '../src/generate.js';
import path from 'path';
import fs from 'fs';

(async () => {
  try {
    // Get folder path from command line arguments
    const args = process.argv.slice(2);

    // Show help
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
📚 readme-genie - Generate professional README from your code

Usage:
  readme-genie [folder-path]

Examples:
  readme-genie                    # Analyze current directory
  readme-genie ./src/components   # Analyze specific folder
  readme-genie ../my-project      # Analyze relative path

Options:
  --help, -h    Show this help message
      `);
      process.exit(0);
    }

    const targetFolder = args[0] || '.';

    // Resolve to absolute path
    const absolutePath = path.resolve(process.cwd(), targetFolder);

    // Check if folder exists
    if (!fs.existsSync(absolutePath)) {
      console.error(`❌ Error: Folder not found: ${absolutePath}`);
      process.exit(1);
    }

    if (!fs.statSync(absolutePath).isDirectory()) {
      console.error(`❌ Error: Path is not a directory: ${absolutePath}`);
      process.exit(1);
    }

    console.log(`🔍 Analyzing folder: ${absolutePath}`);
    const result = await analyzeProject(absolutePath);

    console.log(`📊 Found ${result.components.length} components and ${result.functions.length} functions`);
    console.log('📄 Generating README...');

    generateReadme(result, absolutePath);

    console.log('✅ README.md created successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();