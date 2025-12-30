// ShellLite Runtime (JS)
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Builtins
const say = console.log;
const print = console.log;
const range = (n) => [...Array(n).keys()];
const int = (x) => parseInt(x);
const str = (x) => String(x);
const float = (x) => parseFloat(x);
const len = (x) => x.length;

// Utils
const _slang_download = (url) => { console.log('Download not impl in minimal JS runtime'); };

// --- User Code ---

var vscode = require('vscode');
function hello_handler() {
    var win = vscode.window;
    win.showInformationMessage('Hello from ShellLite! Written purely in .shl')
}
function activate(context) {
    console.log('ShellLite Extension Activated!');
    var commands = vscode.commands;
    var disposable = commands.registerCommand('shelllite.hello', hello_handler);
    var subs = context.subscriptions;
    subs.push(disposable)
    var win = vscode.window;
    var sb_item = win.createStatusBarItem(1, 100);
    sb_item.text = '$(rocket) ShellLite';
    sb_item.tooltip = 'This extension is powered by ShellLite';
    sb_item.command = 'shelllite.hello';
    sb_item.show()
    subs.push(sb_item)
}
function deactivate() {
    console.log('Deactivated');
}
exports.activate = activate;
exports.deactivate = deactivate;