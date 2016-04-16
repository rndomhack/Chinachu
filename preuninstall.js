const child_process = require('child_process');

if (process.platform === 'win32') {
    child_process.execSync('winser -r -x -s', {
        stdio: [
            null,
            process.stdout,
            process.stderr
        ]
    });
}