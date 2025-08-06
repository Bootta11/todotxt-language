# Todo.txt VS Code Extension

A VS Code extension that provides syntax highlighting and formatting for todo.txt files.

## Features

- 🎨 **Syntax Highlighting**: Beautiful color coding for different todo.txt elements
- ✅ **Completed Tasks**: Completed tasks (`x 2024-01-15 Task`) appear in green with strikethrough
- 🎯 **Priority Support**: Priority levels `(A)`, `(B)`, etc. highlighted in red
- 📅 **Date Recognition**: ISO dates highlighted in purple
- 🏷️ **Projects & Contexts**: Projects `+project` in blue, contexts `@context` in orange
- 💡 **Auto-completion**: Smart suggestions for priorities, dates, and completion markers
- ⌨️ **Commands**: Toggle task completion and add priorities

## Installation

### Method 1: Install from VSIX (Recommended)

1. **Build the extension**:

   ```bash
   npm install -g vsce
   npm install
   npm run compile
   vsce package
   ```

2. **Install in VS Code**:
   - Open VS Code
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "Extensions: Install from VSIX"
   - Select the generated `.vsix` file

### Method 2: Development Setup

1. **Clone/create the extension folder**
2. **Create the folder structure**:

   ```
   todotxt-extension/
   ├── package.json
   ├── tsconfig.json
   ├── src/
   │   └── extension.ts
   ├── syntaxes/
   │   └── todotxt.tmLanguage.json
   ├── themes/
   │   └── todotxt-theme.json
   └── language-configuration.json
   ```

3. **Copy the provided files** into their respective locations
4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Compile TypeScript**:

   ```bash
   npm run compile
   ```

6. **Test the extension**:
   - Press `F5` in VS Code to launch Extension Development Host
   - Create a new file with `.todo.txt` extension
   - Start typing todo.txt formatted content

## Todo.txt Format Support

The extension recognizes the standard todo.txt format:

### Basic Tasks

```
Call Mom
Buy groceries
```

### Completed Tasks (Green + Strikethrough)

```
x 2024-01-15 Call Mom
x 2024-01-14 Buy groceries
```

**Note**: If strikethrough doesn't appear immediately:

1. Try reloading VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window")
2. Ensure you're using a compatible theme
3. Check that the file is recognized as todo.txt language (bottom-right corner of VS Code)

### Priority Tasks (Red + Bold)

```
(A) Important meeting
(B) Less urgent task
(C) Low priority item
```

### Projects and Contexts

```
Call Mom +family @home
Buy groceries +household @store
```

### Dates and Key-Value Pairs

```
2024-01-15 Call Mom +family due:2024-01-16
x 2024-01-14 Buy groceries +household @store
```

## Commands & Shortcuts

### Keyboard Shortcuts

- **Toggle Task Completion**: `Alt+Shift+T` (Windows/Linux) or `Cmd+Shift+T` (Mac)
  - Toggles `x YYYY-MM-DD` prefix on current line
  - Works in reverse: removes completion if already completed
- **Move Completed Tasks to done.txt**: `Alt+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac)
  - Finds all completed tasks (lines starting with `x`)
  - Moves them to configurable done file (default: `done.txt`) in the same directory
  - Creates done file if it doesn't exist
  - Removes completed tasks from current file

### Command Palette Commands

- **Add Priority**: `Ctrl+Shift+P` then search "Add Priority"
  - Shows quick-pick menu to select priority (A-F)
  - Inserts `(A)` format at cursor position

## Configuration

The extension is fully configurable through VS Code settings. Access via:

- `File > Preferences > Settings` (Windows/Linux)
- `Code > Preferences > Settings` (Mac)
- Search for "todotxt"

### Available Settings

```json
{
  "todotxt.toggleCompletionKey": "alt+shift+t",
  "todotxt.toggleCompletionKeyMac": "cmd+shift+t",
  "todotxt.moveCompletedKey": "alt+shift+d",
  "todotxt.moveCompletedKeyMac": "cmd+shift+d",
  "todotxt.doneFileName": "done.txt",
  "todotxt.autoSave": false
}
```

### Setting Descriptions

- **toggleCompletionKey**: Keyboard shortcut for Windows/Linux (default: `alt+shift+t`)
- **toggleCompletionKeyMac**: Keyboard shortcut for Mac (default: `cmd+shift+t`)
- **moveCompletedKey**: Archive shortcut for Windows/Linux (default: `alt+shift+d`)
- **moveCompletedKeyMac**: Archive shortcut for Mac (default: `cmd+shift+d`)
- **doneFileName**: Name of archive file (default: `done.txt`)
- **autoSave**: Automatically save after toggling completion (default: `false`)

### Custom Key Bindings

You can override the default shortcuts in your `keybindings.json`:

```json
[
  {
    "key": "ctrl+enter",
    "command": "todotxt.toggleCompletion",
    "when": "editorTextFocus && resourceExtname == '.todo.txt'"
  }
]
```

## Color Scheme

- ✅ **Completed tasks**: Green with strikethrough
- 🔴 **Priorities**: Red and bold
- 🔵 **Projects** (`+project`): Blue and bold
- 🟡 **Contexts** (`@context`): Orange and italic
- 🟣 **Dates**: Purple
- 🔷 **Key-value pairs**: Cyan for keys, green for values
- 💬 **Comments** (`#comment`): Gray and italic

## File Associations

The extension automatically activates for:

- `.todo.txt` files
- `.todotxt` files

## Troubleshooting

### Strikethrough not showing?

1. **Reload window**: `Ctrl+Shift+P` → "Developer: Reload Window"
2. **Check language mode**: Bottom-right corner should show "Todo.txt"
3. **Theme compatibility**: Some themes may override strikethrough styling
4. **Manual activation**: `Ctrl+Shift+P` → "Change Language Mode" → "Todo.txt"

### Shortcuts not working?

1. **Check conflicts**: Go to `File > Preferences > Keyboard Shortcuts` and search for conflicts
2. **Customize bindings**: Override in settings or keybindings.json
3. **File context**: Shortcuts only work in todo.txt files

### Extension not activating?

1. **File extension**: Ensure file ends with `.todo.txt`, `.todotxt`, or is named `todo.txt`
2. **Reload extension**: `Ctrl+Shift+P` → "Developer: Reload Window"
3. **Check installation**: Extensions panel should show "Todo.txt Language Support" as enabled

## Development

To modify the extension:

1. Edit the grammar in `syntaxes/todotxt.tmLanguage.json` for syntax rules
2. Modify colors in `themes/todotxt-theme.json` for appearance
3. Update functionality in `src/extension.ts` for commands and features
4. Run `npm run compile` to rebuild
5. Press `F5` to test changes

## Continuous Integration & Deployment

This project uses GitHub Actions to automatically build and publish the extension on new commits to the main branch.

### Setup Required Secrets

To enable automatic publishing, you need to add the following secrets to your GitHub repository:

1. **Go to your repository settings**: `Settings` → `Secrets and variables` → `Actions`
2. **Add the following repository secrets**:

   - `OVSX_TOKEN`: Your OpenVSX registry personal access token

     - Get it from: https://open-vsx.org/user-settings/tokens
     - This publishes to the OpenVSX registry (used by VSCodium and other VS Code alternatives)

   - `VSCE_TOKEN`: Your Visual Studio Code Marketplace personal access token
     - Get it from: https://dev.azure.com/ → Personal Access Tokens
     - This publishes to the official VS Code Marketplace

### How it works

- **On main branch commits**: The extension is automatically published to both marketplaces(it requires that version inside package.json is updated)

### Manual Publishing

If you prefer to publish manually, you can use the npm scripts:

```bash
# Publish to OpenVSX Registry
npm run publish-ovsx

# Publish to VS Code Marketplace
npm run publish-vsix

# Publish to both
npm run publish
```

## Contributing

We welcome contributions! Here's how you can help:

1. **Report Issues**: Found a bug or have a feature request? [Open an issue](https://github.com/your-username/todotxt-vscode/issues)
2. **Submit Pull Requests**: Fork the repository and submit your improvements
3. **Share Feedback**: Let us know how the extension works for you

### Development Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Press `F5` in VS Code to launch Extension Development Host
4. Make changes and test in the development instance

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### What this means:

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❗ License and copyright notice must be included
- ❗ No warranty provided

## Support

- 📖 [Documentation](https://github.com/your-username/todotxt-vscode#readme)
- 🐛 [Report Issues](https://github.com/your-username/todotxt-vscode/issues)
- 💬 [Discussions](https://github.com/your-username/todotxt-vscode/discussions)

---

**Made with ❤️ for the todo.txt community**
