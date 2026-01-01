const vscode = require('vscode');
const cp = require('child_process');
const path = require('path');
function activate(context) {
    console.log('ShellLite Lightweight Extension Activated (v0.1.1)');
    context.subscriptions.push(vscode.commands.registerCommand('shelllite.hello', () => {
        vscode.window.showInformationMessage('Hello from ShellLite!');
    }));
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('shelllite');
    context.subscriptions.push(diagnosticCollection);
    function lintFile(document) {
        if (document.languageId !== 'shelllite') return;
        const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;
        if (!workspaceFolder) return;
        var cwd = path.join(context.extensionPath, '..');
        var cmd = `python`;
        var args = ['-m', 'shell_lite.cli', 'check', document.getText() ? 'stdin' : document.fileName];
        if (document.isDirty) return; 
        cp.exec(`python -m shell_lite.cli check "${document.fileName}"`, { cwd: cwd }, (err, stdout, stderr) => {
            if (err) {
                console.error('Lint Error:', stderr || err);
                return;
            }
            try {
                const errors = JSON.parse(stdout);
                const diagnostics = errors.map(e => {
                    const line = Math.max(0, e.line - 1);
                    return new vscode.Diagnostic(
                        new vscode.Range(line, 0, line, 100),
                        e.message,
                        vscode.DiagnosticSeverity.Error
                    );
                });
                diagnosticCollection.set(document.uri, diagnostics);
            } catch (e) {
                console.error('JSON Parse Error:', e);
            }
        });
    }
    vscode.workspace.onDidSaveTextDocument(lintFile);
    vscode.workspace.onDidOpenTextDocument(lintFile);
    if (vscode.window.activeTextEditor) {
        lintFile(vscode.window.activeTextEditor.document);
    }
    vscode.languages.registerDocumentFormattingEditProvider('shelllite', {
        provideDocumentFormattingEdits(document) {
            return new Promise((resolve, reject) => {
                var cwd = path.join(context.extensionPath, '..');
                if (document.isDirty) {
                    vscode.window.showWarningMessage('Please save file before formatting with ShellLite.');
                    resolve([]);
                    return;
                }
                cp.exec(`python -m shell_lite.cli fmt "${document.fileName}"`, { cwd: cwd }, (err, stdout, stderr) => {
                    if (err) {
                        vscode.window.showErrorMessage('Formatting Failed: ' + stderr);
                        resolve([]);
                        return;
                    }
                    const fs = require('fs');
                    fs.readFile(document.fileName, 'utf-8', (err, data) => {
                        if (err) resolve([]);
                        const lastLine = document.lineCount;
                        resolve([vscode.TextEdit.replace(
                            new vscode.Range(0, 0, lastLine + 1, 0),
                            data
                        )]);
                    });
                });
            });
        }
    });
    vscode.languages.registerDefinitionProvider('shelllite', {
        provideDefinition(document, position, token) {
            return new Promise((resolve) => {
                var cwd = path.join(context.extensionPath, '..');
                var cmd = `python -m shell_lite.cli resolve "${document.fileName}" ${position.line + 1} ${position.character + 1}`;
                cp.exec(cmd, { cwd: cwd }, (err, stdout, stderr) => {
                    if (err) { resolve(null); return; }
                    try {
                        const res = JSON.parse(stdout);
                        if (res.found) {
                            resolve(new vscode.Location(
                                vscode.Uri.file(res.file),
                                new vscode.Position(res.line - 1, 0)
                            ));
                        } else {
                            resolve(null);
                        }
                    } catch (e) { resolve(null); }
                });
            });
        }
    });
    vscode.languages.registerHoverProvider('shelllite', {
        provideHover(document, position, token) {
            return new Promise((resolve) => {
                var cwd = path.join(context.extensionPath, '..');
                var cmd = `python -m shell_lite.cli resolve "${document.fileName}" ${position.line + 1} ${position.character + 1}`;
                cp.exec(cmd, { cwd: cwd }, (err, stdout, stderr) => {
                    if (err) { resolve(null); return; }
                    try {
                        const res = JSON.parse(stdout);
                        if (res.found && res.hover) {
                            resolve(new vscode.Hover(new vscode.MarkdownString(res.hover)));
                        } else {
                            resolve(null);
                        }
                    } catch (e) { resolve(null); }
                });
            });
        }
    });
    var sb_item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    sb_item.text = '$(rocket) ShellLite v0.1.1';
    sb_item.tooltip = 'Lightweight ShellLite Extension';
    sb_item.show();
    context.subscriptions.push(sb_item);
}
function deactivate() { }
exports.activate = activate;
exports.deactivate = deactivate;
