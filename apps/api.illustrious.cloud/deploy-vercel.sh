#!/usr/bin/env bash
bun build --compile --minify-whitespace --minify-syntax --target bun ./src/app.ts
mkdir -p dist && mv ./app ./dist/.
