# ✨ readme-genie

> 🧙‍♂️ Your magical assistant to generate beautifully structured, highly contextual `README.md` files — just by scanning your codebase.

[![npm version](https://img.shields.io/npm/v/readme-genie.svg)](https://www.npmjs.com/package/readme-genie)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

---

<<<<<<< Updated upstream
## 📌 What is readme-genie?

`readme-genie` is a CLI tool that **automatically generates a clean, meaningful, and personalized `README.md` file** for your JavaScript or TypeScript project — without you writing a single line of it.

This tool is built to help:

- 🧑‍💻 **Developers** who hate writing repetitive documentation  
- 🚀 **Startup teams** that need quick onboarding files  
- 🤖 **Open-source contributors** who want instantly useful `README.md` scaffolds  
- 📦 **Project maintainers** who want consistent documentation across repos

> Unlike typical generators, `readme-genie` actually **analyzes your code**, infers the **project’s flow**, detects **core logic**, and **structures your project visually**.

---

## 🎯 Key Features

✅ Automatically detects:
- 🧠 Function names and arguments  
- 🗂️ Folder structure (excluding `node_modules`, `.git`, etc.)  
- 📄 Index/entry points, config files, helpers, and utils  
- 🚫 Skips deeply nested irrelevant files or oversized folders

✅ Intelligent heuristics:
- Infers purpose of files (`api`, `utils`, `config`, `controllers`, etc.)  
- Highlights meaningful files in the project root  
- Folders with names longer than 20 characters are ignored by default for better clarity

✅ DX-first design:
- ⚡ Just run one command, get a professional-grade README  
- 💬 Generates a **custom overview and project flow** per project  
- 🧩 Injects project name directly from `package.json`  
- 📎 Adds setup and install instructions customized to your repo

---

## 🚀 Installation
=======
# 🎯 Quick Start Guide

## For Users 
>>>>>>> Stashed changes

### Install
```bash
npm install -g readme-genie
<<<<<<< Updated upstream
=======
```

### Use in Any Project
```bash
# Navigate to your project
cd my-awesome-project

# Generate README
readme-genie

# Or analyze specific folder
readme-genie ./src/components
```

### What You Get
A beautiful README.md with:
- ✅ All React components with prop tables
- ✅ All functions with descriptions
- ✅ Folder structure
- ✅ JSDoc comments preserved

---

## To Publish This Package
>>>>>>> Stashed changes

### Quick Publish
```bash
# 1. Login to npm
npm login

# 2. Publish
npm publish

# Done! ✅
```
<<<<<<< Updated upstream
## 📖 Usage

Once installed, navigate to your project directory and run:

```bash
readme-genie
```

=======

### Full Instructions
See `PUBLISHING.md` for detailed guide.

---

## Current Features

✅ **React Components**
- Function components
- Arrow function components  
- Class components
- React.FC with TypeScript
- Default exports

✅ **Props Detection**
- TypeScript interfaces
- Type aliases
- Destructured props
- Optional vs required

✅ **JSDoc Support**
- Full comment preservation
- @param extraction
- @returns extraction
- Multi-line descriptions

✅ **Smart Inference**
- Function purpose detection
- File purpose categorization
- Pattern-based naming

---

## Example Output

Your library generates READMEs like this:

### Components Section
```markdown
## 🧩 React Components

### `Button`
**File:** `src/components/Button.tsx`
**Type:** React.FC
**Description:**
```
A reusable button component with multiple variants
Supports loading states and custom icons
```

| Prop | Type | Required |
|------|------|----------|
| `variant` | `primary | secondary` | ✅ |
| `onClick` | `() => void` | ✅ |
| `loading` | `boolean` | ❌ |
```

### Functions Section
```markdown
### `utils/helpers.js`
**Purpose:** Common helper utilities

**Functions:**
- `formatDate(date)` — Formats date to readable string
- `validateEmail(email)` — Validates email format
```

---

## Next Steps

1. ✅ Test locally: `node bin/cli.js ./src`
2. ✅ Update version in package.json
3. ✅ Commit to Git
4. ✅ Publish: `npm publish`
5. ✅ Share with community!

---

## Support

Need help? Open an issue on GitHub!
https://github.com/radhikabhoyar0502/readme-genie/issues
>>>>>>> Stashed changes
