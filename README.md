# Cache Clearer

A lightweight browser extension for Chrome, Edge, and other Chromium-based browsers. Quickly clear browser cache and other browsing data with one click or keyboard shortcut - perfect for web developers.

![Version](https://img.shields.io/badge/version-1.4.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## Features

- **One-click clearing** - Clear cache instantly from the extension popup
- **Keyboard shortcut** - `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
- **Flexible scope** - Clear data for current tab, all active tabs, or entire browser
- **Multiple data types** - Clear cache, cookies, local storage, session storage, IndexedDB, and service workers
- **Visual feedback** - See what was cleared, when, and how long it took
- **Auto-reload** - Optionally hard reload the page after clearing
- **Terminal-style output** - Developer-friendly status display

## Installation

### Chrome - From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the extension directory

### Microsoft Edge - From Source (Developer Mode)

1. Clone or download this repository
2. Open Edge and navigate to `edge://extensions/`
3. Enable **Developer mode** (toggle in left sidebar)
4. Click **Load unpacked**
5. Select the extension directory

### From Extension Stores

- **Chrome Web Store**: *Coming soon*
- **Microsoft Edge Add-ons**: *Coming soon*

## Usage

### Via Extension Popup

1. Click the Cache Clearer icon in your browser toolbar
2. Select which data types to clear (cache is selected by default)
3. Choose the scope:
   - **Current tab only** - Clear data for the active tab's domain
   - **All active tabs** - Clear data for all open tabs
   - **Entire browser** - Clear all browsing data
4. Click **Clear Selected Data**

### Via Keyboard Shortcut

- Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
- Clears cache for the current tab by default
- Badge notification shows the extension has cleared the cache

### Settings

- **Hard reload page after clear** - Automatically performs a hard refresh (bypasses cache)
- **Show clear details** - Display statistics about what was cleared

## Screenshots

![Extension Popup](screenshots/popup.png)
*Extension popup with data type selection and scope options*

## Permissions

The extension requires the following permissions:

- `browsingData` - To clear cache and other browsing data
- `storage` - To save user preferences and statistics
- `cookies` - To clear cookies when selected
- `tabs` - To get active tab information for scoped clearing

## Development

This extension uses plain HTML, CSS, and JavaScript with no build process required.

### File Structure

```
chrome-cache-clearer-plugin/
├── manifest.json       # Extension manifest (Manifest V3)
├── popup.html         # Extension popup UI
├── popup.js          # Popup logic and event handlers
├── background.js     # Service worker for keyboard shortcuts
├── icon16.png        # 16x16 icon
├── icon48.png        # 48x48 icon
├── icon128.png       # 128x128 icon
└── README.md         # This file
```

### Key APIs Used

- `chrome.browsingData.removeCache()` - Clears cached data
- `chrome.browsingData.removeCookies()` - Clears cookies
- `chrome.browsingData.removeLocalStorage()` - Clears local storage
- `chrome.storage.local` - Persists user preferences
- `chrome.commands` - Handles keyboard shortcuts
- `chrome.tabs` - Gets current tab information

### Testing

1. Load the extension in developer mode
2. Make changes to the source files
3. Click the refresh icon on the extension card in `chrome://extensions/`
4. Test the changes in the popup or via keyboard shortcut

## Customizing Keyboard Shortcut

### Chrome
1. Navigate to `chrome://extensions/shortcuts`
2. Find "Cache Clearer"
3. Click the pencil icon to edit the shortcut
4. Enter your preferred key combination

### Microsoft Edge
1. Navigate to `edge://extensions/shortcuts`
2. Find "Cache Clearer"
3. Click the pencil icon to edit the shortcut
4. Enter your preferred key combination

## Privacy

This extension:
- Does NOT collect any user data
- Does NOT send any information to external servers
- Only operates locally within your browser
- All settings are stored locally using Chrome's storage API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please visit:
- [GitHub Issues](https://github.com/yourusername/chrome-cache-clearer-plugin/issues)
- [Safepoint.no](https://safepoint.no)

## Changelog

### v1.4.0
- Added official Microsoft Edge support
- Updated documentation for Edge installation and usage
- Compatible with all Chromium-based browsers

### v1.3.0
- Support for multiple data types (cache, cookies, storage, etc.)
- Scope selection (current tab, all tabs, entire browser)
- Terminal-style output display
- Hard reload option

---

Made for developers who need to clear cache frequently during web development on Chrome, Edge, and other Chromium-based browsers.
