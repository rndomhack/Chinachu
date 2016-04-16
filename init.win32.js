'use strict';

if (process.platform !== 'win32') {
    process.exit(1);
}

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

process.env.PATH += `;${path.join(__dirname, 'usr/bin')}`;

var wui = child_process.fork('./app-wui', { silent: true });
var operator = child_process.fork('./app-operator', { silent: true });

var wuiLog = fs.createWriteStream('./log/wui', { flags: 'a' });
var operatorLog = fs.createWriteStream('./log/operator', { flags: 'a' });

wui.stdout.pipe(wuiLog);
operator.stdout.pipe(operatorLog);