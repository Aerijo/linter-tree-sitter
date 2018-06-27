const { CompositeDisposable } = require("atom");

module.exports = class Linter {
  constructor(editor, linterInterface) {

    this.editor = editor;
    this.linterInterface = linterInterface;

    this.textDisposables = new CompositeDisposable();
    this.textDisposables.add(

      editor.buffer.onDidStopChanging(event => this.lint())

    );

    this.lint(); // kick off the first lint
  }

  remove() {
    this.linterInterface.setMessages(this.filePath, []);
    this.textDisposables.dispose();
  }

  lint() {
    this.filePath = this.editor.getPath();
    if (!this.editor.alive || !this.filePath) { return; } // AFAIK the linter package itself only works with an existing path

    this.lintMessages = [];
    this.lintErrors(this.editor.languageMode.tree.rootNode);
    this.linterInterface.setMessages(this.filePath, this.lintMessages);
  }

  lintErrors(node) {
    if (node.hasError()) { // true if any children have errors
      if (node.type === "ERROR") {
        this.error(node);
      } else if (node.startIndex === node.endIndex) { // node.isMissing() doesn't appear to work
        this.missing(node);
      }

      node.children.forEach(child => this.lintErrors(child));
    }
  }

  error(node) {
    this.lintMessages.push({
      severity: "error",
      location: {
        file: this.filePath,
        position: [node.startPosition, node.endPosition]
      },
      excerpt: `Error!`
    });
  }

  missing(node) {
    this.lintMessages.push({
      severity: "warning",
      location: {
        file: this.filePath,
        position: [node.startPosition, node.endPosition]
      },
      excerpt: `Warning! Error detected and empty node (probably missing)`
    });
  }
}
