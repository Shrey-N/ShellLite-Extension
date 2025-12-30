# ShellLite VS Code Extension

This folder contains the source code for the ShellLite VS Code extension.

## Structure
- `package.json`: Extension manifest.
- `extension.shl`: Extension logic written in ShellLite.
- `extension.js`: Compiled JavaScript (generated).

## Building
To compile the extension, run the ShellLite compiler from the root or `shell_lite` folder:

```powershell
# From oka/
python -m shell_lite.src.main compile vscode_extension/extension.shl --target js
```

## Running
1. Open this folder in VS Code.
2. Press F5 to launch the Extension Development Host.
