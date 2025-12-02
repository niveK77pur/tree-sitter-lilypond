/**
 * @file LilyPond grammar for tree-sitter
 * @author niveK77pur <kevinbiewesch@yahoo.fr>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "lilypond",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
