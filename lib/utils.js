const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function copyDir(src, dest, exclude = []) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        // Skip excluded files
        if (exclude.includes(entry.name)) {
            continue;
        }

        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath, exclude);
        } else {
            await copyFile(srcPath, destPath);
        }
    }
}

module.exports = {
    copyDir,
    copyFile,
    mkdir,
    updateServiceWorker
};

/**
 * Update serviceWorker.js version and cache list
 * @param {string} projectPath 
 * @param {string} action 'updateVersion' | 'addFile' | 'removeFile'
 * @param {string} [fileName] Relative path to file (e.g., './scripts/lib/foo.js')
 */
async function updateServiceWorker(projectPath, action, fileName) {
    const swPath = path.join(projectPath, 'serviceWorker.js');
    if (!fs.existsSync(swPath)) return;

    let content = fs.readFileSync(swPath, 'utf8');

    // 1. Update Version
    // Pattern: const INSTALLATION_VERSION_NAME = "1.0.0.RC3-r20251126m";
    const versionRegex = /(const\s+INSTALLATION_VERSION_NAME\s*=\s*")([^"]+)(")/;
    const match = content.match(versionRegex);
    if (match) {
        const currentVersion = match[2];
        // Simple version bump: append or replace timestamp
        // Format: ...-rYYYYMMDDx
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const timeStr = now.toTimeString().slice(0, 5).replace(/:/g, ''); // HHMM
        
        // Let's just replace the part after -r or append it
        let newVersion;
        if (currentVersion.includes('-r')) {
            newVersion = currentVersion.replace(/-r\d+[a-z0-9]*/, `-r${dateStr}${timeStr}`);
        } else {
            newVersion = `${currentVersion}-r${dateStr}${timeStr}`;
        }
        
        content = content.replace(versionRegex, `$1${newVersion}$3`);
        console.log(`Updated Service Worker version to: ${newVersion}`);
    }

    // 2. Add/Remove File
    if (fileName) {
        // Ensure fileName starts with ./
        if (!fileName.startsWith('./')) fileName = './' + fileName;

        // We usually add libraries to COMMON_FILES_TO_CACHE or INSTALLATION_FILE_LIST
        // Let's assume COMMON_FILES_TO_CACHE for libraries as per current structure
        // const COMMON_FILES_TO_CACHE = [ ... ];
        
        const listRegex = /(const\s+COMMON_FILES_TO_CACHE\s*=\s*\[)([\s\S]*?)(\];)/;
        const listMatch = content.match(listRegex);

        if (listMatch) {
            let listContent = listMatch[2];
            
            if (action === 'addFile') {
                if (!listContent.includes(`"${fileName}"`) && !listContent.includes(`'${fileName}'`)) {
                    // Add to the end of the list, preserving indentation
                    const lastEntry = listContent.lastIndexOf('"') > listContent.lastIndexOf("'") ? listContent.lastIndexOf('"') : listContent.lastIndexOf("'");
                    if (lastEntry !== -1) {
                        // Insert after the last entry
                        // Find the comma after the last entry
                        const commaIndex = listContent.indexOf(',', lastEntry);
                        if (commaIndex !== -1) {
                            const insertPos = commaIndex + 1;
                            listContent = listContent.slice(0, insertPos) + `\n    "${fileName}",` + listContent.slice(insertPos);
                        } else {
                            // No comma, maybe it's the only item or last item without comma
                            const insertPos = lastEntry + 1;
                            listContent = listContent.slice(0, insertPos) + `,\n    "${fileName}",` + listContent.slice(insertPos);
                        }
                    } else {
                        // Empty list
                        listContent = `\n    "${fileName}",\n`;
                    }
                    content = content.replace(listRegex, `$1${listContent}$3`);
                    console.log(`Added ${fileName} to Service Worker cache list`);
                }
            } else if (action === 'removeFile') {
                // Remove the line containing the filename
                // Escape special chars for regex
                const escapedFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const fileLineRegex = new RegExp(`\\s*["']${escapedFileName}["'],?`, 'g');
                content = content.replace(fileLineRegex, '');
                console.log(`Removed ${fileName} from Service Worker cache list`);
            }
        }
    }

    fs.writeFileSync(swPath, content, 'utf8');
}
