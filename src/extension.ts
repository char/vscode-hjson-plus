import * as vscode from "vscode";
import * as Hjson from "hjson";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "vscode-hjson-plus.convert",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor == null) return;

      const text = editor.document.getText();
      if (text == null) return;

      let json = text;
      try {
        json = JSON.stringify(
          Hjson.parse(text),
          undefined,
          editor.options.tabSize
        );
      } catch (e) {
        return;
      }

      const start = new vscode.Position(0, 0);
      const lastLine = editor.document.lineCount - 1;
      const end = new vscode.Position(
        lastLine,
        editor.document.lineAt(lastLine).text.length
      );
      const wholeDocument = new vscode.Range(start, end);

      await editor.edit((e) => {
        e.replace(wholeDocument, json);
      });

      vscode.window.showInformationMessage(
        "Converted window contents to canonical JSON."
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
