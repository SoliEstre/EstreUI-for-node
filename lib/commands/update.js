// lib/commands/update.js
// This command copies the latest assets from the installed `estreui` core package
// into the current project. It respects a .estreuiignore file and a default
// ignore list so user‑custom files are not overwritten.

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const utils = require('../utils');

const { Command } = require('commander');
const program = new Command('update');

program
    .description('Update project assets from the latest estreui version')
    .action(async () => {
  try {
    console.log('🔄 Updating project assets from latest estreui version...');

    // ① Resolve core package location
    let corePath = path.resolve('node_modules', 'estreui');
    
    if (!fs.existsSync(corePath)) {
        // Check global
        const globalPath = utils.getGlobalPackagePath('estreui');
        if (globalPath) {
            corePath = globalPath;
            console.log('Using global EstreUI package.');
        } else {
            // Check CLI dependencies
            try {
                const cliEstreuiPath = path.dirname(require.resolve('estreui/package.json'));
                if (cliEstreuiPath) {
                    corePath = cliEstreuiPath;
                    console.log('Using EstreUI from CLI dependencies.');
                }
            } catch (e) {
                // Fallback to source directory (dev mode)
                corePath = path.resolve(__dirname, '../../../EstreUI.js');
                console.log('Using local source fallback.');
            }
        }
    }
    console.log('📦 Core package path:', corePath);

    // ② Load ignore patterns from .estreuiignore (if present)
    const ignoreFile = path.resolve(process.cwd(), '.estreuiignore');
    const ignoreSet = new Set();
    if (fs.existsSync(ignoreFile)) {
      const ignoreContent = fs.readFileSync(ignoreFile, 'utf8');
      ignoreContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          ignoreSet.add(trimmed);
        }
      });
    }

    // ③ Default ignore list – always skip files that users commonly edit
    const defaultIgnores = [
      'scripts/main.js',   // entry point often edited
      'styles/main.css',   // user style overrides
      'webmanifest.json',
      'serviceWorker.js',
      'index.html',
      'fixedTop.html',
      'fixedBottom.html',
      'mainMenu.html',
      'instantDoc.html',
      'staticDoc.html',
      'customHandlePrototypes.html',
      'README.md',
      'README_KR.md'
    ];
    defaultIgnores.forEach(p => ignoreSet.add(p));

    // Helper: decide whether a relative path should be copied
    const shouldCopy = relPath => {
      const norm = relPath.replace(/\\/g, '/'); // unify separators
      return !ignoreSet.has(norm);
    };

    // Helper: Recursive copy that respects ignore list
    const copyRecursive = async (srcDir, destDir, relativeBase) => {
      if (!fs.existsSync(destDir)) {
        await utils.mkdir(destDir, { recursive: true });
      }
      const entries = fs.readdirSync(srcDir, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);
        // Construct relative path for ignore check (e.g. "scripts/boot.js")
        const relPath = relativeBase + '/' + entry.name;

        if (!shouldCopy(relPath)) {
          console.log(`⚠️ Skipping ${relPath} (ignored)`);
          continue;
        }

        if (entry.isDirectory()) {
          await copyRecursive(srcPath, destPath, relPath);
        } else {
          await utils.copyFile(srcPath, destPath);
        }
      }
    };

    // ④ Copy directories (scripts, styles, images, vectors, lotties)
    const dirs = ['scripts', 'styles', 'images', 'vectors', 'lotties'];
    for (const dir of dirs) {
      const src = path.join(corePath, dir);
      const dest = path.join(process.cwd(), dir);
      if (fs.existsSync(src)) {
        if (!shouldCopy(dir + '/')) { // Check if directory itself is ignored
          console.log(`⚠️ Skipping directory ${dir} (ignored)`);
          continue;
        }
        console.log(`📂 Processing ${dir}...`);
        await copyRecursive(src, dest, dir);
        console.log(`✅ Copied ${dir}`);
      }
    }

    // ⑤ Copy HTML templates at the root of the core package
    const htmlFiles = fs.readdirSync(corePath).filter(f => f.endsWith('.html'));
    htmlFiles.forEach(file => {
      if (!shouldCopy(file)) {
        console.log(`⚠️ Skipping ${file} (ignored)`);
        return;
      }
      const src = path.join(corePath, file);
      const dest = path.join(process.cwd(), file);
      utils.copyFile(src, dest);
      console.log(`✅ Copied ${file}`);
    });

    console.log('🎉 Update complete!');
  } catch (err) {
    console.error('❌ Update failed:', err);
    process.exit(1);
  }
    });
    
module.exports = program;
