chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'clear-cache') {
    const startTime = Date.now();

    try {
      // Get saved preferences
      const data = await chrome.storage.local.get(['dataTypes', 'hardReload']);
      const dataTypes = data.dataTypes || { cache: true }; // Default to cache only
      const shouldHardReload = data.hardReload === true;

      // Build removal options based on preferences
      const removalOptions = {};
      const clearResults = {};

      if (dataTypes.cache) {
        removalOptions.cache = true;
      }
      if (dataTypes.cookies) {
        removalOptions.cookies = true;
      }
      if (dataTypes.localStorage || dataTypes.sessionStorage) {
        removalOptions.localStorage = true;
      }
      if (dataTypes.indexedDB) {
        removalOptions.indexedDB = true;
      }
      if (dataTypes.serviceWorkers) {
        removalOptions.serviceWorkers = true;
      }

      // If nothing selected, default to cache
      if (Object.keys(removalOptions).length === 0) {
        removalOptions.cache = true;
        dataTypes.cache = true;
      }

      // Clear the data
      await chrome.browsingData.remove({}, removalOptions);

      const duration = Date.now() - startTime;

      // Record results for each type
      for (const [type, selected] of Object.entries(dataTypes)) {
        if (selected) {
          clearResults[type] = { cleared: true };
        } else {
          clearResults[type] = { skipped: true };
        }
      }

      // Store the result for the popup to display
      await chrome.storage.local.set({
        lastClear: {
          timestamp: Date.now(),
          duration: duration,
          success: true,
          items: clearResults
        }
      });

      // Hard reload if enabled
      if (shouldHardReload) {
        // Use lastFocusedWindow for keyboard shortcut context
        const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (tabs && tabs.length > 0 && tabs[0].id) {
          chrome.tabs.reload(tabs[0].id, { bypassCache: true });
        }
      }

      // Show a notification badge briefly
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#27ae60' });

      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
      }, 2000);
    } catch (error) {
      const data = await chrome.storage.local.get(['dataTypes']);
      const dataTypes = data.dataTypes || { cache: true };
      const clearResults = {};

      for (const [type, selected] of Object.entries(dataTypes)) {
        if (selected) {
          clearResults[type] = { error: error.message };
        } else {
          clearResults[type] = { skipped: true };
        }
      }

      await chrome.storage.local.set({
        lastClear: {
          timestamp: Date.now(),
          success: false,
          error: error.message,
          items: clearResults
        }
      });

      chrome.action.setBadgeText({ text: '✗' });
      chrome.action.setBadgeBackgroundColor({ color: '#e74c3c' });

      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
      }, 2000);
    }
  }
});
