# Troubleshooting Guide

## 404 File Not Found Errors

If you're seeing 404 errors, here's how to diagnose and fix them:

### 1. Make sure the server is running

Check if the server is running:
```bash
lsof -ti:8000
```

If nothing is returned, start the server:
```bash
node server.js
```

### 2. Access the correct URL

Make sure you're accessing:
- ✅ `http://localhost:8000` or `http://localhost:8000/index.html`
- ❌ NOT `file:///path/to/index.html` (this won't work with components)

### 3. Check the browser console

Open your browser's developer console (F12) and check:
- What specific file is returning 404?
- Is it a component file (`components/navbar.html` or `components/footer.html`)?
- Is it an image file (`img/logo.png`, etc.)?
- Is it a CSS or JS file?

### 4. Common 404 causes

**Missing image files:**
The site references several image files that may not exist yet:
- `img/logo.png` - Header logo
- `img/cornell-logo.svg` - Footer logo
- `img/mit-logo.svg` - Footer logo  
- `img/cmu-logo.svg` - Footer logo
- `img/hero-left-1.jpg`, `img/hero-left-2.jpg`, `img/hero-right-1.jpg` - Hero images
- `img/github-avatar.png` - GitHub section avatar
- `img/partner-1.png` through `img/partner-9.png` - Partner logos

**Solution:** Add placeholder images or update the HTML to remove image references until you have the actual images.

### 5. Test component loading

Open the browser console and check if you see:
- ✅ "Component loaded successfully" messages
- ❌ "Error loading component" messages

If you see errors, the server might not be running or the paths might be incorrect.

### 6. Verify file structure

Make sure your project structure looks like this:
```
cornell-national-tutoring-observatory/
├── index.html
├── components/
│   ├── navbar.html
│   └── footer.html
├── css/
│   └── style.css
├── js/
│   ├── components.js
│   └── main.js
└── img/
    └── (image files)
```

### 7. Still having issues?

Try these steps:
1. Stop the server (Ctrl+C)
2. Restart it: `node server.js`
3. Clear your browser cache
4. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
5. Check the server terminal for error messages

