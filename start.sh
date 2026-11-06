#!/usr/bin/env bash
# Launches the LedgerOne website (with the mock API) on http://localhost:5173
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required. Install Node.js 18+ and try again." >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting LedgerOne at http://localhost:5173 (demo login: 9876543210 / OTP 123456)"
exec npm run dev -- "$@"
