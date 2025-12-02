package tree_sitter_lilypond_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_lilypond "github.com/nivek77pur/tree-sitter-lilypond/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_lilypond.Language())
	if language == nil {
		t.Errorf("Error loading LilyPond grammar")
	}
}
