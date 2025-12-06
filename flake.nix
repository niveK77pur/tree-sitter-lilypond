{
  description = "Flake for tree-sitter-lilypond";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = {nixpkgs, ...}: let
    inherit (nixpkgs) lib;
    forEachSystem = lib.genAttrs lib.systems.flakeExposed;
  in {
    devShells = forEachSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      default = pkgs.mkShell {
        name = "tree-sitter-lilypond";
        packages = [
          pkgs.gcc
          pkgs.just
          pkgs.nodejs-slim
          pkgs.prettierd
          pkgs.tree-sitter
          pkgs.typescript-language-server
          pkgs.typos
        ];
      };
    });
  };
}
