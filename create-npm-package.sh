#!/usr/bin/env bash

# Package helper for Tailwind Class Grouper plugins
# - Stages clean package contents
# - Packs the ESLint plugin (repo root)
# - Packs the Prettier plugin (mnt/user-data/outputs/prettier-plugin-tailwind-group)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$ROOT/dist-packages"
PRETTIER_DIR="$ROOT/mnt/user-data/outputs/prettier-plugin-tailwind-group"
LOCAL_NPM_CACHE="$ROOT/.npm-cache"
STAGE_BASE="$ROOT/.npm-packages"
TARGET_NODE_VERSION="${TARGET_NODE_VERSION:-22.9.0}"

banner() {
  echo
  echo "============================================================"
  echo "📦 $1"
  echo "============================================================"
}

copy_if_exists() {
  local src="$1"
  local dest="$2"
  if [ -f "$src" ]; then
    cp "$src" "$dest"
  fi
}

stage_and_pack_eslint() {
  local stage_dir="$STAGE_BASE/eslint-plugin-tailwind-group"
  rm -rf "$stage_dir"
  mkdir -p "$stage_dir"

  copy_if_exists "$ROOT/package.json" "$stage_dir/"
  copy_if_exists "$ROOT/index.js" "$stage_dir/"
  copy_if_exists "$ROOT/README.md" "$stage_dir/"
  copy_if_exists "$ROOT/LICENSE" "$stage_dir/"

  banner "Packing ESLint plugin (eslint-plugin-tailwind-group)"
  pushd "$stage_dir" > /dev/null
  NPM_CONFIG_CACHE="$LOCAL_NPM_CACHE" npm pack --pack-destination "$DIST_DIR"
  popd > /dev/null
}

stage_and_pack_prettier() {
  local stage_dir="$STAGE_BASE/prettier-plugin-tailwind-group"
  rm -rf "$stage_dir"
  mkdir -p "$stage_dir"

  copy_if_exists "$PRETTIER_DIR/package.json" "$stage_dir/"
  copy_if_exists "$PRETTIER_DIR/index.js" "$stage_dir/"
  copy_if_exists "$ROOT/README.md" "$stage_dir/README.md"
  copy_if_exists "$ROOT/LICENSE" "$stage_dir/LICENSE"

  banner "Packing Prettier plugin (prettier-plugin-tailwind-group)"
  pushd "$stage_dir" > /dev/null
  NPM_CONFIG_CACHE="$LOCAL_NPM_CACHE" npm pack --pack-destination "$DIST_DIR"
  popd > /dev/null
}

main() {
  # Ensure we run on a modern Node (prefer the user's TARGET_NODE_VERSION if installed)
  CURRENT_NODE_BIN="$(command -v node || true)"
  CURRENT_NODE_VER="$("$CURRENT_NODE_BIN" -v 2>/dev/null || echo "v0.0.0")"
  CURRENT_MAJOR="$(echo "$CURRENT_NODE_VER" | sed 's/^v//' | cut -d. -f1)"

  if [ "${CURRENT_MAJOR:-0}" -lt 18 ]; then
    PREFERRED_NODE="$HOME/.nvm/versions/node/v${TARGET_NODE_VERSION}/bin"
    if [ -x "$PREFERRED_NODE/node" ]; then
      export PATH="$PREFERRED_NODE:$PATH"
      CURRENT_NODE_BIN="$PREFERRED_NODE/node"
      CURRENT_NODE_VER="$("$CURRENT_NODE_BIN" -v)"
      echo "ℹ️  Switched PATH to use $CURRENT_NODE_VER from $PREFERRED_NODE"
    else
      echo "❌ Node version too old ($CURRENT_NODE_VER). Please run with Node >= 18 (e.g., TARGET_NODE_VERSION=$TARGET_NODE_VERSION)."
      exit 1
    fi
  fi

  echo "Using node: $CURRENT_NODE_BIN ($CURRENT_NODE_VER)"
  echo "Using npm:  $(command -v npm) ($(npm -v))"

  banner "Preparing dist folder"
  rm -rf "$DIST_DIR" "$STAGE_BASE"
  mkdir -p "$DIST_DIR" "$LOCAL_NPM_CACHE"

  stage_and_pack_eslint
  stage_and_pack_prettier

  echo
  echo "✅ Done. Tarballs created in: $DIST_DIR"
  ls -1 "$DIST_DIR"
  echo
  echo "To publish:"
  echo "  cd $DIST_DIR"
  echo "  npm publish <tarball> --access public"
}

main "$@"
