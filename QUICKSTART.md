# 🎯 Quick Start Guide

## For Users (After Publishing)

### Install
```bash
npm install -g readme-genie
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

### Quick Publish
```bash
# 1. Login to npm
npm login

# 2. Publish
npm publish

# Done! ✅
```

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
