import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log("Todo.txt extension is now active!");

  // Register completion provider for todo.txt files
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    "todotxt",
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ) {
        const completionItems: vscode.CompletionItem[] = [];

        // Priority completion
        const priorityCompletion = new vscode.CompletionItem(
          "Priority",
          vscode.CompletionItemKind.Snippet
        );
        priorityCompletion.insertText = new vscode.SnippetString(
          "(${1|A,B,C,D,E,F|}) "
        );
        priorityCompletion.documentation = "Add priority to task";
        completionItems.push(priorityCompletion);

        // Date completion
        const dateCompletion = new vscode.CompletionItem(
          "Date",
          vscode.CompletionItemKind.Snippet
        );
        const today = new Date().toISOString().split("T")[0];
        dateCompletion.insertText = today;
        dateCompletion.documentation = "Insert today's date";
        completionItems.push(dateCompletion);

        // Complete task
        const completeCompletion = new vscode.CompletionItem(
          "Complete Task",
          vscode.CompletionItemKind.Snippet
        );
        completeCompletion.insertText = new vscode.SnippetString(`x ${today} `);
        completeCompletion.documentation = "Mark task as completed";
        completionItems.push(completeCompletion);

        return completionItems;
      },
    },
    "(",
    "+",
    "@" // Trigger characters
  );

  // Register command to toggle task completion
  const toggleCompletion = vscode.commands.registerCommand(
    "todotxt.toggleCompletion",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const document = editor.document;
      const selection = editor.selection;
      const line = document.lineAt(selection.start.line);
      const lineText = line.text;

      let newText: string;
      const today = new Date().toISOString().split("T")[0];

      if (lineText.match(/^x\s+/)) {
        // Task is completed, remove completion
        newText = lineText.replace(/^x\s+(\d{4}-\d{2}-\d{2}\s+)?/, "");
      } else {
        // Task is not completed, add completion
        newText = `x ${today} ${lineText}`;
      }

      await editor.edit((editBuilder) => {
        editBuilder.replace(line.range, newText);
      });

      // Auto-save if enabled
      const config = vscode.workspace.getConfiguration("todotxt");
      const autoSave = config.get<boolean>("autoSave", true);
      if (autoSave) {
        await document.save();
      }
    }
  );

  // Register command to move completed tasks to done.txt
  const moveCompletedToDone = vscode.commands.registerCommand(
    "todotxt.moveCompletedToDone",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const document = editor.document;
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);

      if (!workspaceFolder) {
        vscode.window.showErrorMessage(
          "File must be in a workspace to move completed tasks"
        );
        return;
      }

      // Get configurable done file name
      const config = vscode.workspace.getConfiguration("todotxt");
      const doneFileName = config.get<string>("doneFileName", "done.txt");

      const lines = document.getText().split("\n");
      const completedTasks: string[] = [];
      const remainingTasks: string[] = [];

      // Separate completed and remaining tasks
      lines.forEach((line) => {
        if (line.trim().match(/^x\s+/)) {
          completedTasks.push(line);
        } else if (line.trim() !== "") {
          remainingTasks.push(line);
        }
      });

      if (completedTasks.length === 0) {
        vscode.window.showInformationMessage(
          "No completed tasks found to move"
        );
        return;
      }

      try {
        // Determine done file path (same directory as current file)
        const currentFileDir = path.dirname(document.uri.fsPath);
        const doneFilePath = path.join(currentFileDir, doneFileName);

        // Append completed tasks to done file
        const completedTasksText = completedTasks.join("\n") + "\n";

        if (fs.existsSync(doneFilePath)) {
          // Append to existing done file
          fs.appendFileSync(doneFilePath, completedTasksText);
        } else {
          // Create new done file
          fs.writeFileSync(doneFilePath, completedTasksText);
        }

        // Update current file with only remaining tasks
        const remainingText = remainingTasks.join("\n");
        await editor.edit((editBuilder) => {
          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
          );
          editBuilder.replace(fullRange, remainingText);
        });

        // Auto-save if enabled
        const autoSave = config.get<boolean>("autoSave", true);
        if (autoSave) {
          await document.save();
        }

        vscode.window.showInformationMessage(
          `Moved ${completedTasks.length} completed task(s) to ${doneFileName}`
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to move completed tasks: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  );

  // Register keybinding command
  const addPriority = vscode.commands.registerCommand(
    "todotxt.addPriority",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      vscode.window
        .showQuickPick(["A", "B", "C", "D", "E", "F"], {
          placeHolder: "Select priority level",
        })
        .then((priority) => {
          if (priority && editor) {
            const selection = editor.selection;
            editor.edit((editBuilder) => {
              editBuilder.insert(selection.start, `(${priority}) `);
            });
          }
        });
    }
  );

  context.subscriptions.push(
    completionProvider,
    toggleCompletion,
    moveCompletedToDone,
    addPriority
  );
}

export function deactivate() {}
