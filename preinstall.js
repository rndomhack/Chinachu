const child_process = require('child_process');

if (process.platform === 'win32') {
    try {
        child_process.execSync('winser -r -x', {
            stdio: [
                null,
                process.stdout,
                null
            ]
        });
    } catch (e) {
        // nothing
    }
}