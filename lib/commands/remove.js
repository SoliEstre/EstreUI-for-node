const { Command } = require('commander');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { updateServiceWorker } = require('../utils');
const execAsync = promisify(exec);

const program = new Command('remove');

program
    .description('Remove a frontend package')
    .argument('<package>', 'Package name')
    .action(async (packageName) => {
        try {
            console.log(`Uninstalling ${packageName}...`);
            await execAsync(`npm uninstall ${packageName}`);

            // Remove file from scripts/lib
            // We need to guess the filename again or just try to remove likely matches
            const libDir = path.join(process.cwd(), 'scripts/lib');
            if (fs.existsSync(libDir)) {
                const files = fs.readdirSync(libDir);
                for (const file of files) {
                    if (file.toLowerCase().includes(packageName.toLowerCase())) {
                        // This is risky, but simple for now. 
                        // Better approach: check if we have a record, but we don't.
                        // We'll just try to remove exact matches or <package>.js
                        if (file === `${packageName}.js` || file === `${packageName}.min.js`) {
                            fs.unlinkSync(path.join(libDir, file));
                            console.log(`Removed ${file} from scripts/lib/`);

                            // Remove from index.html
                            const indexPath = path.join(process.cwd(), 'index.html');
                            if (fs.existsSync(indexPath)) {
                                let content = fs.readFileSync(indexPath, 'utf8');
                                const scriptTagRegex = new RegExp(`<script.*src="\\./scripts/lib/${file}".*></script>\\s*`, 'g');
                                content = content.replace(scriptTagRegex, '');
                                fs.writeFileSync(indexPath, content);
                                console.log(`Removed script tag from index.html`);
                            }

                            // Update Service Worker
                            await updateServiceWorker(process.cwd(), 'removeFile', `./scripts/lib/${file}`);
                            await updateServiceWorker(process.cwd(), 'updateVersion');
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Error removing package:', error);
        }
    });

module.exports = program;
