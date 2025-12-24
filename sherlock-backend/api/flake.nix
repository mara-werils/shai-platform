{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };
  outputs = {
    self,
    nixpkgs,
    ...
  }: let
    # flake-utils replacement
    supportedSystems = ["x86_64-linux"];
    overlaysFor = system: [];
    forEachSupportedSystem = f:
      nixpkgs.lib.genAttrs supportedSystems (
        system:
          f {
            pkgs = import nixpkgs {
              inherit system;
              overlays = overlaysFor system;
            };
            inherit system;
          }
      );
  in {
    devShells = forEachSupportedSystem ({
      pkgs,
      system,
    }: {
      default = with pkgs;
        mkShell {
          env = {
            LD_LIBRARY_PATH = lib.makeLibraryPath pkgs.pythonManylinuxPackages.manylinux1;
          };
          buildInputs = [
            poetry
            ruff
            python312
            stdenv.cc.cc.lib
          ];
        };
    });
  };
}
