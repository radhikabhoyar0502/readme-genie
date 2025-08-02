# ✨ readme-genie

> 🧙‍♂️ Your magical assistant to generate beautifully structured, highly contextual `README.md` files — just by scanning your codebase.

[![npm version](https://img.shields.io/npm/v/readme-genie.svg)](https://www.npmjs.com/package/readme-genie)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

---

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

```bash
npm install -g readme-genie

```
## 📖 Usage

Once installed, navigate to your project directory and run:

```bash
readme-genie
```

