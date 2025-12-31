# ShellLite for VS Code

Build file systems, web apps, and system automations in plain English. **ShellLite** is a human-readable programming language designed for automation logic.

## Features

- **Syntax Highlighting**: Full colorization for `.shl` files.
- **Code Snippets**: Write ShellLite code faster with built-in snippets.
- **Automation Ready**: First-class support for `shell_lite` automation scripts.

## Usage

1. Install the extension.
2. Open any `.shl` file.
3. Enjoy beautiful syntax highlighting!

## Example Code

```shell_lite
# Hello World in ShellLite
say "Hello World from ShellLite!"

# Simple Desktop Automation
to create_workspace
    make folder "Projects"
    make file "Projects/notes.txt"
    write "Todo list..." into "Projects/notes.txt"
    
create_workspace()
```

## Requirements

- VS Code 1.80.0 or newer.

## Extension Settings

This extension currently has no configurable settings.

## Release Notes

### 0.0.1
- Initial release of ShellLite for VS Code.
- Added basic syntax highlighting.

---

**Made by Shrey Naithani**
