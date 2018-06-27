# linter-tree-sitter
Show errors in the parsing of a file when using a tree-sitter grammar in Atom.

It will use the editor's parser, so no tree-sitter dependencies are required. It will apply itself to all editors using tree-sitter grammars, keeping track of grammar changes and updating accordingly.

Linting is redone each time `TextEditor.onDidStopChanging()` calls it.

Right now, errors are given a generic `Error!` error, and missing fields are given a warning. I tried using the `.isMissing()` property of the nodes, but it didn't seem to work. Instead, it will throw a missing warning when an error is detected somewhere inside the node, and the range is zero width.
