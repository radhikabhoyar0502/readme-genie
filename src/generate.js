import fs from 'fs';
import path from 'path';

function getProjectMetadata() {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    return {
      name: pkg.name || 'Untitled Project',
      description: pkg.description || 'No description available.',
      scripts: pkg.scripts ? Object.keys(pkg.scripts) : [],
    };
  } catch {
    return {
      name: 'Untitled Project',
      description: 'No description available.',
      scripts: [],
    };
  }
}

function formatFolderStructure(dir, prefix = '', root = dir) {
  // Check if directory exists
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return 'Unable to read folder structure\n';
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const filtered = entries.filter(entry => {
    const isLongFolder = entry.isDirectory() && entry.name.length > 20;
    const isExcluded = ['node_modules', '.git', '.next', 'build', 'dist'].includes(entry.name);
    return !isExcluded && !isLongFolder;
  });

  return filtered.map(entry => {
    const fullPath = path.join(dir, entry.name);
    const line = `${prefix}├── ${entry.name}`;

    if (entry.isDirectory()) {
      const children = formatFolderStructure(fullPath, prefix + '│   ', root);
      return `${line}/
${children}`;
    } else if (dir === root || entry.name.startsWith('index.')) {
      return line;
    } else {
      return null;
    }
  }).filter(Boolean).join('');
}

function inferFilePurpose(filename) {
  const name = path.basename(filename);
  if (name.includes('util')) return 'Common helper or utility functions';
  if (name.includes('api')) return 'Handles external or internal API calls';
  if (name.includes('config')) return 'Configuration settings for the app';
  if (name.includes('index')) return 'Primary entry point of the project';
  if (name.includes('route')) return 'Application routing logic';
  if (name.includes('controller')) return 'Logic for handling user actions or backend routes';
  if (name.includes('analyze')) return 'Code analysis and parsing logic';
  if (name.includes('generate')) return 'Content generation and formatting';
  return 'General-purpose code';
}

function inferFunctionPurpose(functionName, description) {
  // If JSDoc exists, preserve the complete description
  if (description) {
    const cleanedDescription = description
      .split('\n')
      .map(l => l.trim())
      .map(l => l.replace(/^\*+\s*/, '')) // Remove leading asterisks
      .filter(l => l.trim()) // Remove empty lines
      .join(' ') // Join into single line for README
      .trim();

    if (cleanedDescription) {
      return cleanedDescription;
    }
  }

  const name = functionName.toLowerCase();

  // Helper function to format camelCase to readable text
  const formatName = (str) => {
    return str
      .replace(/([A-Z])/g, ' $1') // Add space before capitals
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' '); // Remove extra spaces
  };

  // Common patterns
  if (name.startsWith('get') || name.startsWith('fetch')) {
    const subject = formatName(functionName.replace(/^(get|fetch)/i, ''));
    return `Retrieves ${subject || 'data'}`;
  }
  if (name.startsWith('set') || name.startsWith('update')) {
    const subject = formatName(functionName.replace(/^(set|update)/i, ''));
    return `Updates ${subject || 'data'}`;
  }
  if (name.startsWith('create') || name.startsWith('add')) {
    const subject = formatName(functionName.replace(/^(create|add)/i, ''));
    return `Creates ${subject || 'new item'}`;
  }
  if (name.startsWith('delete') || name.startsWith('remove')) {
    const subject = formatName(functionName.replace(/^(delete|remove)/i, ''));
    return `Removes ${subject || 'item'}`;
  }
  if (name.startsWith('is') || name.startsWith('has') || name.startsWith('should')) {
    const subject = formatName(functionName.replace(/^(is|has|should)/i, ''));
    return `Checks if ${subject || 'condition is met'}`;
  }
  if (name.startsWith('render') || name.startsWith('draw')) {
    const subject = formatName(functionName.replace(/^(render|draw)/i, ''));
    return `Renders ${subject || 'UI element'}`;
  }
  if (name.startsWith('handle') || name.startsWith('on')) {
    const subject = formatName(functionName.replace(/^(handle|on)/i, ''));
    return `Handles ${subject || 'event'}`;
  }
  if (name.startsWith('init') || name.startsWith('setup')) {
    const subject = formatName(functionName.replace(/^(init|setup)/i, ''));
    return `Initializes ${subject || 'component'}`;
  }
  if (name.startsWith('parse') || name.startsWith('extract')) {
    const subject = formatName(functionName.replace(/^(parse|extract)/i, ''));
    return `Extracts ${subject || 'data'}`;
  }
  if (name.startsWith('format') || name.startsWith('transform')) {
    const subject = formatName(functionName.replace(/^(format|transform)/i, ''));
    return `Formats ${subject || 'data'}`;
  }
  if (name.startsWith('validate') || name.startsWith('check')) {
    const subject = formatName(functionName.replace(/^(validate|check)/i, ''));
    return `Validates ${subject || 'input'}`;
  }
  if (name.startsWith('calculate') || name.startsWith('compute')) {
    const subject = formatName(functionName.replace(/^(calculate|compute)/i, ''));
    return `Calculates ${subject || 'value'}`;
  }
  if (name.startsWith('load')) {
    const subject = formatName(functionName.replace(/^load/i, ''));
    return `Loads ${subject || 'data'}`;
  }
  if (name.startsWith('save')) {
    const subject = formatName(functionName.replace(/^save/i, ''));
    return `Saves ${subject || 'data'}`;
  }
  if (name.startsWith('find') || name.startsWith('search')) {
    const subject = formatName(functionName.replace(/^(find|search)/i, ''));
    return `Finds ${subject || 'item'}`;
  }
  if (name.startsWith('filter')) {
    const subject = formatName(functionName.replace(/^filter/i, ''));
    return `Filters ${subject || 'items'}`;
  }
  if (name.startsWith('sort')) {
    const subject = formatName(functionName.replace(/^sort/i, ''));
    return `Sorts ${subject || 'items'}`;
  }
  if (name.startsWith('map')) {
    const subject = formatName(functionName.replace(/^map/i, ''));
    return `Maps ${subject || 'items'}`;
  }
  if (name.startsWith('reduce')) {
    const subject = formatName(functionName.replace(/^reduce/i, ''));
    return `Reduces ${subject || 'items'}`;
  }
  if (name.startsWith('infer')) {
    const subject = formatName(functionName.replace(/^infer/i, ''));
    return `Infers ${subject || 'information'}`;
  }
  if (name.startsWith('analyze')) {
    const subject = formatName(functionName.replace(/^analyze/i, ''));
    return `Analyzes ${subject || 'code'}`;
  }
  if (name.startsWith('generate')) {
    const subject = formatName(functionName.replace(/^generate/i, ''));
    return `Generates ${subject || 'content'}`;
  }
  if (name.includes('helper')) return 'Helper utility function';
  if (name.includes('util')) return 'Utility function';

  return 'Function implementation';
}

export function generateReadme({ functions, components }, targetFolder = '.') {
  const { name, description, scripts } = getProjectMetadata();
  const absoluteFolder = path.isAbsolute(targetFolder) ? targetFolder : path.resolve(process.cwd(), targetFolder);
  const folderName = path.basename(absoluteFolder);
  const folderStructure = formatFolderStructure(absoluteFolder);

  const fileSummary = functions.reduce((acc, fn) => {
    if (fn.file.includes('node_modules')) return acc;
    if (!acc[fn.file]) acc[fn.file] = [];
    const purpose = inferFunctionPurpose(fn.name, fn.description);
    acc[fn.file].push(`- \`${fn.name}(${fn.params})\` — ${purpose}`);
    return acc;
  }, {});

  const fileDescriptions = Object.keys(fileSummary).length > 0
    ? Object.keys(fileSummary).map(file => {
      const purpose = inferFilePurpose(file);
      return `### \`${file}\`
**Purpose:** ${purpose}

**Functions:**
${fileSummary[file].join('\n')}
`;
    }).join('\n---\n\n')
    : '*No functions detected in this folder.*';

  const componentsSection = components.length > 0 ? `
## 🧩 React Components

${components.map(c => {
    const propsTable = c.props && c.props.length > 0 ? `
| Prop | Type | Required |
|------|------|----------|
${c.props.map(p => `| \`${p.name || p}\` | \`${p.type || 'any'}\` | ${p.required ? '✅' : '❌'} |`).join('\n')}
` : '\n*No props detected*\n';

    // Preserve complete JSDoc description
    const description = c.description
      ? `\n**Description:**\n\`\`\`\n${c.description}\n\`\`\`\n`
      : '';

    return `### \`${c.name}\`
**File:** \`${c.file}\`  
**Type:** ${c.type || 'Component'}${description}
${propsTable}`;
  }).join('\n---\n\n')}` : '';

  const projectFlow = `
## 🔄 Project Flow

    1. Install dependencies with \`npm install\`.
2. Run the development server with \`${scripts.includes('start') ? 'npm start' : 'your-start-command'}\`.
3. Explore the folder structure.
4. Modify or extend your components as needed.
5. Generate your README anytime with \`npx readme-genie\`.
`;

  const readmeContent = `
# 🚀 ${name.charAt(0).toUpperCase() + name.slice(1)}

${description}

---

${projectFlow}

---

## ⚙️ Installation & Setup

\`\`\`bash
git clone <your-repo-url>
cd ${name}
npm install
npx readme-genie
\`\`\`

---

## 📁 Folder & File Structure

\`\`\`
${folderStructure}
\`\`\`

---

## 🧠 File Purposes & Detected Functions

${fileDescriptions}

${componentsSection}

---

## 🙌 Credits

Generated with ❤️ by [readme-genie]. Feel free to customize this file further to suit your unique project! Happy coding! 🤗
`;

  fs.writeFileSync('README.md', readmeContent.trim() + '');
}
