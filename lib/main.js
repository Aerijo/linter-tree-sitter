const { CompositeDisposable } = require("atom");

const { EditorRegistry } = require("./editor-registry.js");

module.exports = {

  activate() {
    this.disposables = new CompositeDisposable();
  },

  deactivate() {
    this.disposables.dispose();
  },

  consumeIndie(registerIndie) {
    const linter = registerIndie({
      name: 'Tree-sitter'
    });

    const editorContainer = new EditorRegistry(linter);

    this.disposables.add(linter, editorContainer);

    this.disposables.add(
      atom.workspace.observeTextEditors(editor => {
        const fileName = editor.getFileName();
        if (!fileName) {
          return;
        }
        const extensionList = atom.config.get('linter-tree-sitter.fileExtensions');
        const extensionMatching = atom.config.get('linter-tree-sitter.extensionMatching');
        const extension = (fileName.match(/.+\.([^.]+)$/) || [])[1];
        const extensionIsInList = extensionList.indexOf(extension) >= 0;
        if (extensionIsInList === (extensionMatching === 'whitelist')) {
          editorContainer.add(editor);
        }
      })
    );
  },

  config: {
    fileExtensions: {
      title: 'List of file extensions (comma separated)',
      type: 'array',
      items: {
        type: 'string'
      },
      default: []
    },
    extensionMatching: {
      title: 'Use file extension list as:',
      type: 'string',
      default: 'blacklist',
      enum: ['blacklist', 'whitelist']
    }
  }
};
