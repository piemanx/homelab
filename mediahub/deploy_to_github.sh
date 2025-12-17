#!/bin/bash

# Check if we are inside a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "Initializing new git repository..."
  git init
else
  echo "Already inside a git repository."
fi

# Add remote if not exists (and if we are at the repo root or simple check)
# We check if 'origin' exists defined
if ! git remote | grep -q origin; then
  echo "Adding remote origin..."
  git remote add origin git@github.com:piemanx/homelab.git
fi

# Stage all files in the current directory (mediahub)
echo "Staging files..."
git add .

# Commit
echo "Committing..."
git commit -m "Deploy MediaHub updates"

# Push to main
echo "Pushing to remote..."
git push -u origin main