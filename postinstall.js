'use strict';

const fs = require('fs');
const child_process = require('child_process');

function mkdir(path, mode) {
    return new Promise((resolve, reject) => {
        fs.stat(path, err => {
            if (!err) {
                resolve();
                return;
            }

            fs.mkdir(path, mode, err2 => {
                if (err2) {
                    reject(err2);
                    return;
                }

                resolve();
            });
        });
    });
}

function copy(src, dest) {
    return new Promise((resolve, reject) => {
        fs.stat(dest, err => {
            if (!err) {
                resolve();
                return;
            }

            let rs = fs.createReadStream(src);
            let ws = fs.createWriteStream(dest);

            rs.on('close', () => {
                resolve();
            });

            rs.on('error', err2 => {
                reject(err2);
            });

            ws.on('error', err2 => {
                reject(err2);
            });

            rs.pipe(ws);
        });
    });
}

Promise.resolve().then(() => {
    return mkdir('./recorded');
}).then(() => {
    return mkdir('./tmp');
}).then(() => {
    return mkdir('./log');
}).then(() => {
    return mkdir('./data');
}).then(() => {
    return mkdir('./usr');
}).then(() => {
    return mkdir('./usr/src');
}).then(() => {
    return mkdir('./usr/bin');
}).then(() => {
    if (process.platform === 'win32') {
        return copy('./config.win32.sample.json', './config.json');
    } else {
        return copy('./config.sample.json', './config.json');
    }
}).then(() => {
    return copy('./rules.sample.json', './rules.json');
}).then(() => {
    child_process.execFileSync(
        'winser.cmd',
        [
            '-i', '-a', '--startuptype', 'delayed',
            '--startcmd', 'node.exe init.win32.js',
            '--set', 'AppPriority ABOVE_NORMAL_PRIORITY_CLASS',
            '--set', 'Type SERVICE_WIN32_OWN_PROCESS',
            '--env', `APPDATA=${ process.env.APPDATA }`
        ],
        {
            stdio: [
                null,
                process.stdout,
                process.stderr
            ]
        }
    );
}).catch(err => {
    console.error(`Error: ${err.message}`);

    process.exitCode = 1;
});
