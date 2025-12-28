# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chrome/Chromium extension (Manifest V3) that clears browser cache with one click or keyboard shortcut. Designed for web developers who need to quickly clear cache during development.

## Architecture

- **manifest.json** - Extension manifest (Manifest V3), requires `browsingData` and `storage` permissions
- **popup.html** - Extension popup UI with inline CSS styling, settings toggle, and stats display
- **popup.js** - Click handler, settings management, and stats display logic
- **background.js** - Service worker that handles keyboard shortcut commands
- **icon*.png** - Extension icons (16, 48, 128px)

## Key APIs

- `chrome.browsingData.removeCache({})` - Clears all cached data
- `chrome.storage.local` - Persists user preferences and last clear info
- `chrome.commands` - Registers keyboard shortcut (Ctrl+Shift+X / Cmd+Shift+X on Mac)

## Development

Load as unpacked extension:
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory

No build process required - plain HTML/JS that runs directly in the browser.

## Features

- One-click cache clearing via popup button
- Keyboard shortcut: Ctrl+Shift+X (Cmd+Shift+X on Mac)
- Visual feedback: shows status, timestamp, and duration of last clear
- Toggle to show/hide clear details
- Badge notification when cleared via keyboard shortcut
