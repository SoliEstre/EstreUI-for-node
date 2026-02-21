# EstreUI

[🇰🇷 한국어](./README_KR.md)

> Modern, No-Build JavaScript UI Framework

EstreUI is a modern JavaScript UI framework that can be used immediately without a build process. It provides tools for project scaffolding and PWA development via an NPM package.

## ✨ Features

- 🚀 **No-Build**: Run immediately without a build process
- 📦 **Easy Install**: Simple project initialization via NPM
- 🔒 **PWA Support**: Built-in HTTPS local development server
- 🎨 **Complete UI Framework**: Includes components, routing, state management, etc.
- 📱 **Responsive**: Supports both mobile and desktop
- 🛠️ **CLI Tools**: Command-line tools for project management

---

## 📦 Installation

### Using NPM Create (Recommended)

```bash
npm create estreui [project-name]
```

### Global Installation

```bash
npm install -g create-estreui
estreui init [project-name]
```

---

## 🚀 Quick Start

### 1. Create a New Project

```bash
npm create estreui my-estreui-app
```

If you provide a project name, it will be set up automatically. If omitted, you will be prompted to enter it.
The following will be automatically set up:
- ✅ Copy EstreUI core files (from local or global package)
- ✅ Create `package.json`
- ✅ Install essential libraries (JCODD, Doctre, Modernism, Alienese, jQuery)
- ✅ Automatically configure `index.html`
- ✅ Create/Update `.gitignore` with `node_modules`

> **Note**: If you have `estreui` installed globally, the CLI will ask if you want to install it locally in the new project. You can choose to skip local installation and use the global package assets instead.

### 2. Run Development Server

```bash
cd my-estreui-app
estreui dev
```

You can then view your app at:
```
https://localhost:8080/
```

> **Note**: A self-signed certificate is used, so a browser security warning will appear. Click "Advanced" → "Proceed to localhost (unsafe)" to continue.

---

## 📚 CLI Commands

### `estreui init`

Initialize a new EstreUI project.

```bash
estreui init [project-name]
```

**Generated File Structure:**
```
my-estreui-app/
├── package.json
├── index.html
├── serviceWorker.js
├── webmanifest.json
├── stockHandlePrototypes.html   # Core Framework Prototypes
├── customHandlePrototypes.html  # User Custom Prototypes
├── fixedTop.html                # Top fixed section template
├── fixedBottom.html             # Bottom fixed section template
├── mainMenu.html                # Main menu template
├── managedOverlay.html          # Overlay template
├── serviceLoader.html           # Service loader template
├── staticDoc.html               # Static content template
├── instantDoc.html              # Instant content template
├── scripts/
│   ├── boot.js                  # Boot Logic
│   ├── lib/                     # Libraries managed by npm
│   │   ├── jcodd.js
│   │   ├── doctre.js
│   │   ├── modernism.js
│   │   ├── alienese.js
│   │   └── jquery.js
│   ├── estreUi.js               # EstreUI Core
│   ├── estreU0EEOZ.js           # EstreUI Utilities
│   └── main.js                  # User Code
├── styles/
│   ├── estreUi*.css             # EstreUI Styles
│   └── main.css                 # User Styles
├── images/
├── vectors/
└── ...
```

### `estreui update`

Update project assets from the latest `estreui` core package.

```bash
estreui update
```

**Features:**
- Updates `scripts/`, `styles/`, and templates from the latest installed `estreui` version.
- Respects `.estreuiignore` file to prevent overwriting custom files.
- Preserves default user-editable files (`scripts/main.js`, `styles/main.css`, etc.).

### `estreui dev`

Start the HTTPS development server.

```bash
estreui dev
```

**Options:**
- Default Port: `8080`
- HTTPS Support (for PWA testing)
- Automatic generation of self-signed certificates

### `estreui add <package>`

Add a frontend package.

```bash
estreui add lodash
```

**Automated Actions:**
1. Run `npm install <package>`
2. Copy browser-ready JS files to `scripts/lib/`
3. Automatically add `<script>` tag to `index.html`

**Examples:**
```bash
# Add Lodash
estreui add lodash

# Add Moment.js
estreui add moment

# Add Axios
estreui add axios
```

### `estreui remove <package>`

Remove an installed package.

```bash
estreui remove lodash
```

**Automated Actions:**
1. Run `npm uninstall <package>`
2. Delete files from `scripts/lib/`
3. Remove `<script>` tag from `index.html`

---

## 🎯 Included Libraries

EstreUI projects come with the following libraries:

### jQuery (v4.0.0)
Library for DOM manipulation and event handling.

### JCODD (v0.9.0)
JSON Characterized Object Data Definition - Lightweight JSON-based data format.

### Doctre (v1.1.1)
Document Object Cold Taste Refrigeration Effortlessness - HTML/JSON DOM parser and serializer.

### Modernism (v0.7.0)
JavaScript feature detection and polyfill management.

### Alienese (v0.7.0)
EstreUI JavaScript patches and utilities.

---

## 📖 Framework Usage

### Service Worker (PWA)

EstreUI supports PWA by default, including a Service Worker:

- Offline Caching
- Background Synchronization
- Push Notification Support

You can customize the `serviceWorker.js` file to change caching strategies.

### Customization

#### Styles

Modify `styles/main.css` to customize your app's styles.

#### Logic

Write your app's main logic in `scripts/main.js`.

```javascript
// scripts/main.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('EstreUI App Ready!');
    
    // App initialization code
});
```

---

## 🔧 Project Structure

```
EstreUI for node/
├── bin/
│   └── estreui.js           # CLI Entry Point
├── lib/
│   ├── commands/
│   │   ├── init.js          # init command
│   │   ├── update.js        # update command
│   │   ├── dev.js           # dev command
│   │   ├── add.js           # add command
│   │   └── remove.js        # remove command
│   └── utils.js             # Utility functions
├── templates/               # Project Templates
│   ├── scripts/
│   ├── styles/
│   ├── images/
│   └── index.html
├── package.json
└── README.md
```

---

## 📝 License

ISC License - See the `LICENSE` file for details.

---

## 🔗 Links

- **GitHub Repository & Documentation**: [EstreUI](https://github.com/SoliEstre/EstreUI.js)
- **NPM Package**: [npmjs.com/package/estreui](https://www.npmjs.com/package/estreui)

---

## ❓ FAQ

### Q: Is a build process required?
A: No! EstreUI follows the "No-Build" philosophy. It runs directly in the browser.

### Q: Can I use TypeScript?
A: Yes, you can add compilation settings yourself if you want to use TypeScript. However, EstreUI uses pure JavaScript by default.

### Q: How do I deploy to production?
A: You can deploy the project folder to any static file hosting service (GitHub Pages, Netlify, Vercel, etc.). HTTPS is required (PWA requirement).

### Q: What about browser compatibility?
A: Modern browsers (Chrome, Firefox, Safari, Edge) are supported. IE is not supported.

### Q: How do I update npm-managed libraries?
A: Run `npm update` in your project folder. Packages added via CLI are also managed as standard npm packages.
**Note:** The `estreui update` command respects a `.estreuiignore` file in the project root. Files listed there (or the default ignored files such as `scripts/boot.js`, `scripts/main.js`, `styles/main.css`, `README.md`, `README_KR.md`, and various HTML templates) will not be overwritten.


### Q: Why is there a separate scripts/lib folder?
A: `scripts/lib/` stores external libraries managed by npm. This clearly separates EstreUI core files from external dependencies and allows for efficient dependency management.

---

**Made with ❤️ by Estre Soliette**  
**Built with 🤖 Antigravity AI**
