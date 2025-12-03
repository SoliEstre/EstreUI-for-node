const { Command } = require('commander');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const { copyDir, mkdir, copyFile, updateServiceWorker } = require('../utils');

const program = new Command('init');

program
    .description('Initialize a new EstreUI project')
    .action(async () => {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Project name:',
                default: 'my-estreui-app'
            }
        ]);

        const projectPath = path.resolve(process.cwd(), answers.projectName);
        // Templates are now in the templates directory of the CLI package
        const templatesPath = path.resolve(__dirname, '../../templates');

        console.log(`Initializing project in ${projectPath}...`);

        try {
            // 1. Create project directory
            await mkdir(projectPath, { recursive: true });

            // 2. Copy Templates - SKIPPED (Redundant, using core assets)
            // if (fs.existsSync(templatesPath)) {
            //     console.log('Copying templates...');
            //     await copyDir(templatesPath, projectPath);
            // }

            // 3. Create package.json for the project
            let pkgName = answers.projectName;
            if (pkgName === '.') {
                pkgName = path.basename(process.cwd());
            }

            const packageJson = {
                name: pkgName,
                version: '1.0.0',
                description: 'EstreUI Project',
                private: true,
                scripts: {
                    dev: 'estreui dev'
                },
                "dependencies": {
                    "estreui": "^0.0.1"
                },
                "devDependencies": {
                    "create-estreui": "^1.0.0"
                }
            };
            fs.writeFileSync(
                path.join(projectPath, 'package.json'),
                JSON.stringify(packageJson, null, 4),
                'utf8'
            );
            console.log('✓ Created package.json');

            // 4. Install Dependencies
            // Skipping npm install to avoid hanging during init. Dependencies will be installed manually if needed.
            // console.log('Installing dependencies... (this may take a while)');
            // const { execSync } = require('child_process');
            // try {
            //     execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
            //     console.log('✓ Dependencies installed');
            // } catch (e) {
            //     console.error('Failed to install dependencies. Please run "npm install" manually');
            // }

            // 5. Copy Core Assets from node_modules/estreui
            // We need to copy scripts, styles, images, vectors, lotties, stockHandlePrototypes.html
            // And also copy the dependencies of estreui (jquery, etc) to scripts/lib or scripts/
            
            let corePath = path.join(projectPath, 'node_modules/estreui');
            
            if (!fs.existsSync(corePath)) {
                // Fallback to source directory of core package
                corePath = path.resolve(__dirname, '../../../EstreUI.js');
                console.log('Core package not found in node_modules, using source directory as fallback.');
            }

            if (fs.existsSync(corePath)) {
                console.log('Copying core assets from estreui package...');
                
                // 1. Copy Directories
                const dirsToCopy = ['scripts', 'styles', 'images', 'vectors', 'lotties'];
                for (const dir of dirsToCopy) {
                    const src = path.join(corePath, dir);
                    const dest = path.join(projectPath, dir);
                    if (fs.existsSync(src)) {
                        await copyDir(src, dest);
                    }
                }

                // 2. Copy Root Files (HTML, Service Worker, Manifest, Favicon)
                // We copy all .html files, plus specific non-html root files
                const coreFiles = fs.readdirSync(corePath);
                const assetsToCopy = [
                    'index.html',
                    'serviceWorker.js',
                    'webmanifest.json',
                    'favicon.ico',
                    'stockHandlePrototypes.html',
                    'customHandlePrototypes.html',
                    'instantDoc.html',
                    'fixedTop.html',
                    'fixedBottom.html',
                    'mainMenu.html',
                    'staticDoc.html',
                    'managedOverlay.html',
                    'serviceLoader.html'
                ];
                for (const asset of assetsToCopy) {
                    const src = path.join(corePath, asset);
                    const dest = path.join(projectPath, asset);
                    if (fs.existsSync(src)) {
                        const stats = fs.statSync(src);
                        if (stats.isDirectory()) {
                            await copyDir(src, dest);
                        } else {
                            await copyFile(src, dest);
                        }
                        // console.log(`✓ Copied ${asset}`);
                    }
                }
                
                // 6. Copy libraries (jquery, jcodd, etc.) from node_modules to scripts/lib/
                // These are dependencies of estreui, so they should be in project's node_modules (flattened) or nested.
                const libs = ['jquery', 'jcodd', 'doctre', 'modernism', 'alienese'];
                const scriptsLibDir = path.join(projectPath, 'scripts/lib');
                await mkdir(scriptsLibDir, { recursive: true });
                
                let indexHtmlPath = path.join(projectPath, 'index.html');
                let indexHtmlContent = fs.existsSync(indexHtmlPath) ? fs.readFileSync(indexHtmlPath, 'utf8') : '';

                for (const lib of libs) {
                    const destLibPath = path.join(scriptsLibDir, `${lib}.js`);
                    
                    // Check if already exists (skip copy)
                    if (fs.existsSync(destLibPath)) {
                        // console.log(`✓ Library ${lib} already exists in scripts/lib/`);
                    } else {
                        let libPath;
                        // Try to find in project node_modules
                        let possiblePath = path.join(projectPath, 'node_modules', lib);
                        
                        // Handle dist folders if necessary
                        if (lib === 'jquery') {
                            if (fs.existsSync(path.join(possiblePath, 'dist/jquery.js'))) {
                                libPath = path.join(possiblePath, 'dist/jquery.js');
                            }
                        } else {
                            // Others usually have main file as libname.js in root or dist
                            if (fs.existsSync(path.join(possiblePath, `${lib}.js`))) {
                                libPath = path.join(possiblePath, `${lib}.js`);
                            }
                        }
                        
                        if (libPath && fs.existsSync(libPath)) {
                            await copyFile(libPath, destLibPath);
                        } else {
                            // Fallback: Check if they are in estreui/node_modules (nested) or source scripts dir
                            possiblePath = path.join(corePath, 'node_modules', lib);
                             if (lib === 'jquery') {
                                if (fs.existsSync(path.join(possiblePath, 'dist/jquery.js'))) {
                                    libPath = path.join(possiblePath, 'dist/jquery.js');
                                }
                            } else {
                                if (fs.existsSync(path.join(possiblePath, `${lib}.js`))) {
                                    libPath = path.join(possiblePath, `${lib}.js`);
                                }
                            }
                            
                            // Fallback 2: Check source scripts dir (for jcodd, etc. in local source fallback)
                            if (!libPath || !fs.existsSync(libPath)) {
                                const sourceScriptPath = path.join(corePath, 'scripts', `${lib}.js`);
                                if (fs.existsSync(sourceScriptPath)) {
                                    libPath = sourceScriptPath;
                                }
                            }

                            if (libPath && fs.existsSync(libPath)) {
                                await copyFile(libPath, destLibPath);
                                
                                // Cleanup: If the file exists in scripts/ (e.g. copied from core), remove it to avoid duplicates
                                const redundantScriptPath = path.join(projectPath, 'scripts', `${lib}.js`);
                                if (fs.existsSync(redundantScriptPath)) {
                                    fs.unlinkSync(redundantScriptPath);
                                    // console.log(`✓ Removed redundant ${lib}.js from scripts/`);
                                }
                            } else {
                                console.warn(`Warning: Could not find library ${lib} to copy.`);
                                continue; // Skip updating index.html for this lib
                            }
                        }
                    }

                    // Update index.html to point to scripts/lib/${lib}.js
                    // Pattern 1: ./scripts/${lib}.js (Source style)
                    // Pattern 2: CDN for jquery
                    
                    const localScriptTag = `./scripts/${lib}.js`;
                    const newScriptTag = `./scripts/lib/${lib}.js`;
                    
                    if (indexHtmlContent.includes(localScriptTag)) {
                        indexHtmlContent = indexHtmlContent.replace(localScriptTag, newScriptTag);
                    } else if (lib === 'jquery') {
                        // Replace CDN with local
                        // <script defer src="https://code.jquery.com/jquery-3.7.1.js" ...></script>
                        // Regex to match jquery cdn
                        const jqueryCdnRegex = /<script[^>]*src=["']https:\/\/code\.jquery\.com\/jquery[^"']*["'][^>]*><\/script>/;
                        if (jqueryCdnRegex.test(indexHtmlContent)) {
                            indexHtmlContent = indexHtmlContent.replace(jqueryCdnRegex, `<script defer type="text/javascript" src="${newScriptTag}"></script>`);
                        }
                    }
                }
                
                if (indexHtmlContent) {
                    fs.writeFileSync(indexHtmlPath, indexHtmlContent, 'utf8');
                }

                // Update serviceWorker.js to point to scripts/lib/${lib}.js
                let serviceWorkerPath = path.join(projectPath, 'serviceWorker.js');
                let serviceWorkerContent = fs.existsSync(serviceWorkerPath) ? fs.readFileSync(serviceWorkerPath, 'utf8') : '';

                if (serviceWorkerContent) {
                    for (const lib of libs) {
                        const localScriptPath = `./scripts/${lib}.js`;
                        const newScriptPath = `./scripts/lib/${lib}.js`;
                        
                        if (serviceWorkerContent.includes(localScriptPath)) {
                            serviceWorkerContent = serviceWorkerContent.replace(localScriptPath, newScriptPath);
                        }
                    }
                    fs.writeFileSync(serviceWorkerPath, serviceWorkerContent, 'utf8');
                }

                console.log('✓ Core assets and libraries copied and configured');
                
                // 7. Copy essential root files (e.g., .htaccess, .gitignore, webmanifest.json, favicon.ico, instantDoc.html)
                const rootFiles = ['.htaccess', '.gitignore', 'webmanifest.json', 'favicon.ico', 'instantDoc.html'];
                for (const file of rootFiles) {
                    const src = path.join(corePath, file);
                    const dest = path.join(projectPath, file);
                    if (fs.existsSync(src)) {
                        await copyFile(src, dest);
                        // console.log(`✓ Copied root file ${file}`);
                    }
                }

                // 8. Update Service Worker Version
                await updateServiceWorker(projectPath, 'updateVersion');

            }

            console.log('Project initialized successfully!');
            console.log(`\ncd ${answers.projectName}\nnpm run dev`);

        } catch (error) {
            console.error('Error initializing project:', error);
        }
    });

module.exports = program;
