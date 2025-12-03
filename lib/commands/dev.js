const { Command } = require('commander');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const program = new Command('dev');

program
    .description('Start local development server with SSL')
    .option('-p, --port <number>', 'Port number', 8080)
    .action(async (options) => {
        const port = options.port;

        // Check for mkcert certificates first (trusted)
        const mkcertCertPath = path.join(process.cwd(), 'localhost.pem');
        const mkcertKeyPath = path.join(process.cwd(), 'localhost-key.pem');

        // Fallback to self-signed certificates
        const certPath = path.join(process.cwd(), 'server.cert');
        const keyPath = path.join(process.cwd(), 'server.key');

        // Prefer mkcert certificates if available
        if (fs.existsSync(mkcertCertPath) && fs.existsSync(mkcertKeyPath)) {
            console.log('✓ Using mkcert certificates (trusted)');
            startServer(port, mkcertCertPath, mkcertKeyPath);
        }
        // Check for existing self-signed certificates
        else if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
            console.log('✓ Using existing self-signed certificate');
            startServer(port, certPath, keyPath);
        }
        // Try to auto-generate certificates
        else {
            console.log('No certificates found. Checking for mkcert...');
            
            // Check if mkcert is installed
            exec('mkcert -version', (err, stdout, stderr) => {
                if (!err) {
                    // mkcert is installed, use it to generate trusted certificates
                    console.log('✓ mkcert found! Generating trusted certificates...');
                    
                    exec('mkcert localhost 127.0.0.1 ::1', (err, stdout, stderr) => {
                        if (err) {
                            console.error('Failed to generate mkcert certificates:', err);
                            fallbackToOpenSSL();
                            return;
                        }
                        
                        // Create symlinks for the generated certificates
                        try {
                            if (fs.existsSync('localhost+2.pem') && fs.existsSync('localhost+2-key.pem')) {
                                if (!fs.existsSync(mkcertCertPath)) {
                                    fs.symlinkSync('localhost+2.pem', mkcertCertPath);
                                }
                                if (!fs.existsSync(mkcertKeyPath)) {
                                    fs.symlinkSync('localhost+2-key.pem', mkcertKeyPath);
                                }
                            }
                        } catch (e) {
                            // If symlink fails, just use the original files
                            console.log('Note: Could not create symlinks, using original certificate names');
                        }
                        
                        console.log('✨ Generated trusted SSL certificates with mkcert!');
                        
                        // Use the generated certificates
                        const finalCertPath = fs.existsSync(mkcertCertPath) ? mkcertCertPath : 'localhost+2.pem';
                        const finalKeyPath = fs.existsSync(mkcertKeyPath) ? mkcertKeyPath : 'localhost+2-key.pem';
                        
                        startServer(port, finalCertPath, finalKeyPath);
                    });
                } else {
                    // mkcert is not installed, show installation instructions
                    console.log('❌ mkcert not found.');
                    console.log('\n💡 For a trusted certificate without browser warnings, install mkcert:\n');
                    
                    const platform = process.platform;
                    if (platform === 'darwin') {
                        console.log('  # macOS');
                        console.log('  brew install mkcert');
                        console.log('  mkcert -install');
                    } else if (platform === 'win32') {
                        console.log('  # Windows');
                        console.log('  choco install mkcert');
                        console.log('  # or download from: https://github.com/FiloSottile/mkcert/releases');
                        console.log('  mkcert -install');
                    } else {
                        console.log('  # Linux');
                        console.log('  # For Arch Linux:');
                        console.log('  sudo pacman -S mkcert');
                        console.log('  # For Ubuntu/Debian:');
                        console.log('  sudo apt install mkcert');
                        console.log('  # or download from: https://github.com/FiloSottile/mkcert/releases');
                        console.log('  mkcert -install');
                    }
                    
                    console.log('\n  After installing, restart the dev server.\n');
                    
                    // Fallback to openssl
                    fallbackToOpenSSL();
                }
            });
        }
        
        function fallbackToOpenSSL() {
            console.log('Generating temporary self-signed certificate with openssl...');
            
            exec(`openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365 -subj "/CN=localhost"`, (err, stdout, stderr) => {
                if (err) {
                    console.error('❌ Failed to generate certificate using openssl.');
                    console.error('Please install mkcert or openssl, or provide server.key and server.cert manually.');
                    console.error(err);
                    return;
                }
                
                console.log('✨ Generated temporary SSL certificates (self-signed).');
                console.log('⚠️  Note: This will show a browser security warning. Click "Advanced" and "Proceed" to continue.\n');
                
                // Register cleanup to delete generated certificates on exit
                const cleanup = () => {
                    try {
                        if (fs.existsSync(certPath)) fs.unlinkSync(certPath);
                        if (fs.existsSync(keyPath)) fs.unlinkSync(keyPath);
                    } catch (e) {
                        // ignore errors during cleanup
                    }
                    process.exit();
                };

                process.on('SIGINT', cleanup);
                process.on('SIGTERM', cleanup);
                process.on('exit', cleanup);

                startServer(port, certPath, keyPath);
            });
        }
    });

function startServer(port, certPath, keyPath) {
    const options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    };

    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const server = https.createServer(options, (req, res) => {
        let filePath = '.' + req.url;
        if (filePath === './') {
            filePath = './index.html';
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code == 'ENOENT') {
                    res.writeHead(404);
                    res.end('404 Not Found');
                } else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                }
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Service-Worker-Allowed': '/' // Important for PWA
                });
                res.end(content, 'utf-8');
            }
        });
    });

    server.listen(port, () => {
        console.log(`Server running at https://localhost:${port}/`);
        console.log('Note: You might need to accept the self-signed certificate in your browser.');
        // Try to open browser
        const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
        exec(`${start} https://localhost:${port}`);
    });

    // Handle port already in use error
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`\n❌ Error: Port ${port} is already in use.\n`);
            console.log('To fix this, you can:');
            console.log(`  1. Stop the process using port ${port}:`);

            if (process.platform === 'darwin' || process.platform === 'linux') {
                console.log(`     lsof -ti:${port} | xargs kill -9`);
            } else if (process.platform === 'win32') {
                console.log(`     netstat -ano | findstr :${port}`);
                console.log(`     taskkill /PID <PID> /F`);
            }

            console.log(`  2. Or use a different port:`);
            console.log(`     estreui dev -p 3000\n`);
            process.exit(1);
        } else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });
}

module.exports = program;
