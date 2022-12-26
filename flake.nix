{
  description = "Treesitter Grammar for Crisp";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        buildInputs = with pkgs; [
          # tree-sitter
          # tree-sitter-cli
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = buildInputs;
        };
      });
}
