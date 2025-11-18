# 📦 Publishing Guide for readme-genie

This guide will help you publish readme-genie to npm so others can use it.

## Prerequisites

1. **npm account**: Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **npm CLI installed**: Comes with Node.js
3. **Git repository**: Your code should be on GitHub

## Step-by-Step Publishing

### 1. Login to npm

```bash
npm login
```

Enter your npm username, password, and email.

### 2. Verify package.json

Make sure these fields are correct:
- `name`: "readme-genie" (must be unique on npm)
- `version`: Start with "1.0.0" and increment for updates
- `description`: Clear description of what it does
- `author`: Your name
- `license`: "MIT"
- `repository`: GitHub URL
- `keywords`: Relevant keywords for discovery

### 3. Test Locally Before Publishing

```bash
# Test the CLI works
node bin/cli.js ./test-folder

# Pack to see what will be published
npm pack

# This creates readme-genie-1.0.3.tgz
# Extract and verify contents
```

### 4. Publish to npm

```bash
npm publish
```

If the name is taken, you can use a scoped package:
```bash
# Update package.json name to "@yourusername/readme-genie"
npm publish --access public
```

### 5. Verify Publication

After publishing, check:
```bash
# Search for your package
npm search readme-genie

# View package info
npm info readme-genie

# Install and test
npx readme-genie
```

## Updating Your Package

When you make changes:

1. **Update version** in package.json:
   ```json
   "version": "1.0.4"  // Patch update
   "version": "1.1.0"  // Minor update
   "version": "2.0.0"  // Major update
   ```

2. **Commit changes to Git**:
   ```bash
   git add .
   git commit -m "Version 1.0.4: Added feature X"
   git push
   ```

3. **Publish update**:
   ```bash
   npm publish
   ```

## Version Numbering (Semantic Versioning)

- **Patch** (1.0.X): Bug fixes, small tweaks
- **Minor** (1.X.0): New features, backwards compatible
- **Major** (X.0.0): Breaking changes

## npm Scripts

Add these to package.json for easier management:

```json
{
  "scripts": {
    "prepublishOnly": "npm test",
    "version": "npm run format && git add -A src",
    "postversion": "git push && git push --tags"
  }
}
```

## How Users Will Use Your Package

### Installation
```bash
# Global (recommended for CLI tools)
npm install -g readme-genie

# Or use without installing
npx readme-genie
```

### Usage
```bash
# In any project
readme-genie

# Analyze specific folder
readme-genie ./src/components
```

## Unpublishing (Use Carefully!)

You can unpublish within 72 hours:
```bash
npm unpublish readme-genie@1.0.3
```

After 72 hours, you can only deprecate:
```bash
npm deprecate readme-genie@1.0.3 "Use version 1.0.4 instead"
```

## Best Practices

1. ✅ Test thoroughly before publishing
2. ✅ Keep README.md updated
3. ✅ Use semantic versioning
4. ✅ Write a CHANGELOG.md for updates
5. ✅ Tag releases in Git
6. ✅ Respond to issues and PRs
7. ✅ Keep dependencies updated

## Troubleshooting

### "Package name already taken"
- Choose a different name, or
- Use scoped package: `@yourusername/readme-genie`

### "Permission denied"
- Run `npm login` again
- Check you're logged into the correct account

### "Version already published"
- Update version number in package.json
- You cannot republish the same version

## After Publishing

1. **Add npm badge** to README:
   ```markdown
   ![npm version](https://img.shields.io/npm/v/readme-genie.svg)
   ![npm downloads](https://img.shields.io/npm/dm/readme-genie.svg)
   ```

2. **Announce** on:
   - Twitter/X
   - Dev.to
   - Reddit r/javascript
   - LinkedIn

3. **Monitor**:
   - npm downloads: `npm info readme-genie`
   - GitHub stars
   - Issues and feedback

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Publishing npm packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

---

Good luck with your publish! 🚀
