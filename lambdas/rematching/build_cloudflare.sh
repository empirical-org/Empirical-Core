#!/bin/bash

# Build the project, but don't deploy to AWS.
# This is a work in progress intended to
# integrate with Cloudflare eventually.

# Step 1: Build the project with Vite
npx vite build

echo "Build completed successfully."
