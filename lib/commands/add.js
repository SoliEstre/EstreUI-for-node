const { Command } = require('commander');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { copyFile, mkdir, updateServiceWorker } = require('../utils');
const { promisify } = require('util');
const execAsync = promisify(exec);

const program = new Command('add');

program
    .description('Add a frontend package')
    .argument('<package>', 'Package name')
    .action(async (packageName) => {
        try {
            console.log(`Installing ${packageName}...`);
            await execAsync(`npm install ${packageName}`);

            // Find the library file
            // Strategy: Check package.json 'main' or 'browser' field, or look for dist/bundle
            const packagePath = path.join(process.cwd(), 'node_modules', packageName);
            const packageJsonPath = path.join(packagePath, 'package.json');

            if (!fs.existsSync(packageJsonPath)) {
                throw new Error(`Package ${packageName} not found in node_modules.`);
            }

            const pkg = require(packageJsonPath);
            let mainFile;
            if (typeof pkg.browser === 'string') {
                mainFile = pkg.browser;
            } else if (typeof pkg.main === 'string') {
                mainFile = pkg.main;
            } else {
                mainFile = `dist/${packageName}.js`;
            }

            // Resolve absolute path
            let srcPath = path.resolve(packagePath, mainFile);

            // Fallback search if specific file doesn't exist
            if (!fs.existsSync(srcPath)) {
                // Try common paths
                const commonPaths = [
                    `dist/${packageName}.js`,
                    `dist/${packageName}.min.js`,
                    `${packageName}.js`,
                    `lib/${packageName}.js`
                ];
                for (const p of commonPaths) {
                    const testPath = path.join(packagePath, p);
                    if (fs.existsSync(testPath)) {
                        srcPath = testPath;
                        break;
                    }
                }
            }

            if (!fs.existsSync(srcPath)) {
                console.warn(`Could not automatically find the main JS file for ${packageName}.`);
                console.warn(`Please manually copy the file to scripts/lib and add to index.html.`);
                return;
            }

            // Copy file
            const libDir = path.join(process.cwd(), 'scripts/lib');
            await mkdir(libDir, { recursive: true });
            let destFileName = path.basename(srcPath);
            
            // Rename index.js to packageName.js to avoid conflicts and ambiguity
            if (destFileName === 'index.js') {
                destFileName = `${packageName}.js`;
            }
            
            const destPath = path.join(libDir, destFileName);

            await copyFile(srcPath, destPath);
            console.log(`Copied ${destFileName} to scripts/lib/`);

            // Inject into index.html
            const indexPath = path.join(process.cwd(), 'index.html');
            if (fs.existsSync(indexPath)) {
                let content = fs.readFileSync(indexPath, 'utf8');
                const scriptTag = `<script defer type="text/javascript" src="./scripts/lib/${destFileName}"></script>`;

                if (!content.includes(scriptTag)) {
                    // Insert before the first local script or at the end of head/body
                    // Try to find a good insertion point. 
                    // EstreUI has <!-- Begin links --> or similar markers.
                    // Or before main.js
                    if (content.includes('src="./scripts/main.js"')) {
                        content = content.replace('<script defer type="text/javascript" src="./scripts/main.js"></script>', `${scriptTag}\n    <script defer type="text/javascript" src="./scripts/main.js"></script>`);
                    } else {
                        // Fallback: end of body
                        content = content.replace('</body>', `    ${scriptTag}\n</body>`);
                    }
                    fs.writeFileSync(indexPath, content);
                    console.log(`Injected script tag into index.html`);
                } else {
                    console.log(`Script tag already exists in index.html`);
                }
            }

            // Update Service Worker
            await updateServiceWorker(process.cwd(), 'addFile', `./scripts/lib/${destFileName}`);
            await updateServiceWorker(process.cwd(), 'updateVersion');

        } catch (error) {
            console.error('Error adding package:', error);
        }
    });

module.exports = program;
