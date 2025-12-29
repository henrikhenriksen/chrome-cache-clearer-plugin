# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser extension for Chrome, Microsoft Edge, and other Chromium-based browsers (Manifest V3). Clears browser cache with one click or keyboard shortcut. Designed for web developers who need to quickly clear cache during development.

**Key Features:**
- Multi-data type clearing (cache, cookies, local storage, session storage, IndexedDB, service workers)
- Scoped clearing (current tab, all active tabs, or entire browser)
- Automatic theme adaptation (light/dark mode based on browser theme)
- Real-time terminal-style feedback
- Persistent settings and statistics

## Architecture

- **manifest.json** - Extension manifest (Manifest V3), requires `browsingData`, `storage`, `cookies`, and `tabs` permissions
- **popup.html** - Extension popup UI with inline CSS, Safepoint purple theme support via CSS variables, settings toggles, and stats display
- **popup.js** - Click handler, theme detection, settings management, scope handling, and stats display logic
- **background.js** - Service worker that handles keyboard shortcut commands and badge notifications
- **icon.svg** - Master SVG icon with Safepoint branding (purple checkmark logo)
- **icon*.png** - Extension icons (16, 48, 128px) generated from SVG
- **ICONS_README.md** - Icon generation instructions and branding guidelines

## Key Technologies

### Chrome Extension APIs
- `chrome.browsingData.remove()` - Clears browsing data with type and origin filtering
- `chrome.storage.local` - Persists user preferences, data type selections, and last clear info
- `chrome.commands` - Registers keyboard shortcut (Ctrl+Shift+X / Cmd+Shift+X on Mac)
- `chrome.tabs` - Queries tabs for origin-based clearing and hard reload functionality

### Theme System
- **CSS Variables** - Theme colors defined in `:root` and `.dark-theme` selectors using Safepoint purple color scheme
- **Media Query** - `window.matchMedia('(prefers-color-scheme: dark)')` detects browser theme
- **Automatic Switching** - Listens for theme changes and applies appropriate CSS class dynamically
- **Smooth Transitions** - Theme changes animated with CSS transitions
- **Branding Colors** - Purple gradient (#7c6b9e → #9987b8) from Safepoint brand identity

## Development

Load as unpacked extension:

**Chrome:**
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory

**Microsoft Edge:**
1. Navigate to `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory

No build process required - plain HTML/JS that runs directly in the browser.

## Features

### Core Functionality
- **Multi-Type Clearing** - Select from cache, cookies, local storage, session storage, IndexedDB, and service workers
- **Scoped Clearing** - Clear data for current tab only, all active tabs, or entire browser
- **One-Click Operation** - Clear button with visual feedback and success animation
- **Keyboard Shortcut** - Ctrl+Shift+X (Cmd+Shift+X on Mac) for quick access
- **Hard Reload Option** - Automatically reload affected pages after clearing

### User Interface
- **Adaptive Theme** - Automatically matches browser's light or dark theme preference
- **Terminal Output** - Real-time feedback showing clearing progress
- **Statistics Display** - Shows last clear results with timestamp and duration
- **Persistent Settings** - Remembers data type selections, scope preference, and UI preferences
- **Select All/Deselect All** - Quick toggles for data type selection
- **Badge Notification** - Visual indicator when cleared via keyboard shortcut

### Developer Experience
- **Terminal-Style Logging** - Console-like output for debugging and transparency
- **Error Handling** - Graceful handling of permission errors and edge cases
- **Origin-Based Clearing** - Precise clearing for specific domains when scoped to tabs

## Code Structure

### popup.js Organization
1. **Theme Detection** (lines 1-15) - Browser theme detection and application
2. **DOM References** (lines 17-28) - Element selectors
3. **Terminal Functions** (lines 30-40) - Logging utility functions
4. **Data Type Management** (lines 42-80) - Checkbox references and configuration
5. **Initialization** (lines 82-100) - Settings restoration on popup open
6. **Stats Display** (lines 102-160) - Result visualization
7. **Scope Handling** (lines 162-220) - Origin determination for scoped clearing
8. **Event Handlers** (lines 222-247) - Settings persistence
9. **Clear Operation** (lines 249-401) - Main clearing logic with error handling

### CSS Variables
The extension uses CSS custom properties for theming with Safepoint purple branding:
- **Light Theme** - Default values in `:root` with purple accents on white backgrounds
- **Dark Theme** - Overrides in `body.dark-theme` with deep purple backgrounds
- **Variable Categories**: background colors, text colors, borders, terminal styling, accent colors
- **Accent Colors**: `--accent-primary`, `--accent-secondary`, `--accent-light` for interactive elements

All color values use semantic naming (`--bg-primary`, `--text-secondary`, `--accent-primary`) for maintainable theme switching.

**Safepoint Color Palette:**
- Primary Dark Purple: `#362652`
- Medium Purple: `#7c6b9e`
- Light Purple: `#9987b8`
- Very Light Purple: `#a89ec0`

Buttons use a purple gradient (`#7c6b9e → #9987b8`) matching the Safepoint brand identity.

## Testing

### Manual Testing Checklist
- [ ] Load extension in Chrome and Edge
- [ ] Test each data type individually
- [ ] Test all scope options (current tab, all tabs, entire browser)
- [ ] Verify hard reload works when enabled
- [ ] Test keyboard shortcut (Ctrl+Shift+X)
- [ ] Toggle between light and dark system themes
- [ ] Verify settings persistence across popup opens
- [ ] Test with chrome:// and chrome-extension:// URLs (should handle gracefully)
- [ ] Check terminal output displays correctly
- [ ] Verify statistics update after each clear operation

### Common Edge Cases
- **No Selection** - Extension shows error message if no data types selected
- **Chrome Internal Pages** - Cannot clear data for chrome:// URLs (API restriction)
- **Permission Errors** - Gracefully handles missing permissions
- **Empty Origins** - Properly handles tabs without valid origins

## Troubleshooting

### Extension Not Clearing Cache
1. Check that cache checkbox is selected
2. Verify extension has required permissions in chrome://extensions
3. Check browser console for error messages
4. Try "Entire browser" scope if tab-specific clearing fails

### Keyboard Shortcut Not Working
1. Navigate to chrome://extensions/shortcuts
2. Verify Ctrl+Shift+X is assigned to "Clear browser cache"
3. Check for conflicts with other extensions or OS shortcuts
4. Try reassigning to a different key combination

### Theme Not Switching
1. Verify browser theme setting (chrome://settings/appearance)
2. Check that OS theme is properly configured
3. Extension respects `prefers-color-scheme` media query
4. Refresh extension popup if theme changed while open

## Best Practices

### When Modifying Code
- Maintain Manifest V3 compatibility (no eval(), inline scripts)
- Test permissions changes thoroughly
- Keep popup.js modular with clear function separation
- Use semantic CSS variable names for new theme colors
- Update version in manifest.json for releases

### Security Considerations
- Never expose user data in error messages
- Validate origin URLs before clearing
- Respect chrome:// and chrome-extension:// URL restrictions
- Keep permissions minimal (principle of least privilege)

## Future Enhancement Ideas
- Export/import settings
- Scheduled auto-clearing
- Custom keyboard shortcuts per data type
- Clear history visualization
- Whitelist/blacklist for automatic clearing
- Multi-language support
