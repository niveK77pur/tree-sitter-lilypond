test: generate
    tree-sitter test

parse item: generate
    #!/usr/bin/env sh
    tree-sitter parse <<EOF
        {{ if path_exists(item) == "true" { read(item) } else { item } }}
    EOF

generate:
    tree-sitter generate
