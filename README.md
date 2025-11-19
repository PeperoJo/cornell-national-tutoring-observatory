# Cornell National Tutoring Observatory

Website for the National Tutoring Observatory.

## Getting Started

### Option 1: Using npm (Recommended)

1. Make sure you have Python 3 and npm installed
2. Run the server:
   ```bash
   npm run server
   ```
   or
   ```bash
   npm start
   ```
3. Open your browser and navigate to `http://localhost:8000`

### Option 2: Using Python Directly

1. Make sure you have Python 3 installed
2. Run the server:
   ```bash
   python3 server.py
   ```
3. Open your browser and navigate to `http://localhost:8000`

### Option 3: Using Node.js Server

1. Make sure you have Node.js installed
2. Run the server:
   ```bash
   node server.js
   ```
3. Open your browser and navigate to `http://localhost:8000`

## Why a Server is Needed

The website uses reusable components (navbar and footer) that are loaded dynamically using JavaScript's `fetch()` API. This requires a web server to work properly due to browser security restrictions (CORS policy) when opening files directly from the file system.

## Project Structure

```
├── index.html          # Landing page
├── approach.html       # Approach page
├── partners.html       # Partners page
├── news.html          # News page
├── blog.html          # Blog page
├── contact.html       # Contact page
├── components/        # Reusable components
│   ├── navbar.html   # Navigation component
│   └── footer.html   # Footer component
├── css/
│   └── style.css     # Main stylesheet
├── js/
│   ├── components.js # Component loader
│   └── main.js       # Main JavaScript
├── img/              # Image assets
├── data/             # Data files
└── server.js         # Simple HTTP server
```

## Components

The navbar and footer are reusable components that can be included on any page by adding:

```html
<div id="navbar-container"></div>
<!-- Your page content -->
<div id="footer-container"></div>

<script src="js/components.js"></script>
<script src="js/main.js"></script>
```

## Notes

- Make sure to add your images to the `img/` folder
- The components will automatically load when using a web server
- If you need to view the site without a server, you can temporarily embed the components directly in each HTML file
