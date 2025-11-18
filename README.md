# 🚀 Readme-genie

📄 Generate beautiful, intelligent READMEs automatically from your project codebase.

---


## 🔄 Project Flow

    1. Install dependencies with `npm install`.
2. Run the development server with `your-start-command`.
3. Explore the folder structure.
4. Modify or extend your components as needed.
5. Generate your README anytime with `npx readme-genie`.


---

## ⚙️ Installation & Setup

```bash
git clone <your-repo-url>
cd readme-genie
npm install
npx readme-genie
```

---

## 📁 Folder & File Structure

```
├── .gitignore├── .npmignore├── autocomplete.tsx├── bin/
├── index.js├── LICENSE├── package-lock.json├── package.json├── PUBLISHING.md├── QUICKSTART.md├── README.md├── src/
├── test-props.tsx
```

---

## 🧠 File Purposes & Detected Functions

### `src\analyze.js`
**Purpose:** Code analysis and parsing logic

**Functions:**
- `extractJSDocComment(node)` — Extracts j s doc comment
- `extractPropsFromParams(params, interfacesMap, typeAliasMap)` — Extracts props from params
- `extractTypeAnnotation(typeAnnotation)` — Extracts type annotation
- `isReactComponent(node, content)` — Checks if react component
- `analyzeProject(dir)` — Analyzes project

---

### `src\generate.js`
**Purpose:** Content generation and formatting

**Functions:**
- `getProjectMetadata()` — Retrieves project metadata
- `formatFolderStructure(dir, prefix, root)` — Formats folder structure
- `inferFilePurpose(filename)` — Infers file purpose
- `inferFunctionPurpose(functionName, description)` — Infers function purpose
- `generateReadme({...}, targetFolder)` — Generates readme



## 🧩 React Components

### `MUIAutocomplete`
**File:** `autocomplete.tsx`  
**Type:** Arrow Function Component

| Prop | Type | Required |
|------|------|----------|
| `onChange` | `any` | ❌ |
| `onInputChange` | `any` | ❌ |

---

### `TestComponent`
**File:** `test-props.tsx`  
**Type:** Arrow Function Component

| Prop | Type | Required |
|------|------|----------|
| `name` | `string` | ✅ |
| `age` | `number` | ✅ |
| `email` | `string` | ❌ |


---

## 🙌 Credits

Generated with ❤️ by [readme-genie]. Feel free to customize this file further to suit your unique project! Happy coding! 🤗