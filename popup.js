// Theme detection and application
function applyTheme() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

// Apply theme on load
applyTheme();

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

const btn = document.getElementById('clearBtn');
const status = document.getElementById('status');
const stats = document.getElementById('stats');
const showStatsCheckbox = document.getElementById('showStats');
const hardReloadCheckbox = document.getElementById('hardReload');
const clearedItemsList = document.getElementById('clearedItems');
const statsTime = document.getElementById('statsTime');
const summaryCount = document.getElementById('summaryCount');
const summaryDuration = document.getElementById('summaryDuration');
const selectAllBtn = document.getElementById('selectAll');
const deselectAllBtn = document.getElementById('deselectAll');
const terminal = document.getElementById('terminal');

// Terminal logging functions
function terminalClear() {
  terminal.innerHTML = '';
  terminal.classList.add('visible');
}

function terminalLog(message, type = '') {
  const line = document.createElement('div');
  line.className = 'line' + (type ? ' ' + type : '');
  line.textContent = message;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

// Scope radio buttons
const scopeRadios = {
  currentTab: document.getElementById('scopeCurrentTab'),
  allTabs: document.getElementById('scopeAllTabs'),
  allBrowser: document.getElementById('scopeAllBrowser')
};

// Data type checkboxes
const dataTypeCheckboxes = {
  cache: document.getElementById('typeCache'),
  cookies: document.getElementById('typeCookies'),
  localStorage: document.getElementById('typeLocalStorage'),
  sessionStorage: document.getElementById('typeSessionStorage'),
  indexedDB: document.getElementById('typeIndexedDB'),
  serviceWorkers: document.getElementById('typeServiceWorkers')
};

// Human-readable names for data types
const dataTypeNames = {
  cache: 'Cache',
  cookies: 'Cookies',
  localStorage: 'Local Storage',
  sessionStorage: 'Session Storage',
  indexedDB: 'IndexedDB',
  serviceWorkers: 'Service Workers'
};

// Load settings and last clear info on popup open
async function init() {
  const data = await chrome.storage.local.get(['showStats', 'hardReload', 'lastClear', 'dataTypes', 'scope']);

  // Load show stats preference (default: true)
  const showStatsEnabled = data.showStats !== false;
  showStatsCheckbox.checked = showStatsEnabled;
  updateStatsVisibility(showStatsEnabled);

  // Load hard reload preference (default: false)
  hardReloadCheckbox.checked = data.hardReload === true;

  // Load scope preference (default: currentTab)
  const scope = data.scope || 'currentTab';
  if (scopeRadios[scope]) {
    scopeRadios[scope].checked = true;
  }

  // Load saved data type preferences
  if (data.dataTypes) {
    for (const [type, enabled] of Object.entries(data.dataTypes)) {
      if (dataTypeCheckboxes[type]) {
        dataTypeCheckboxes[type].checked = enabled;
      }
    }
  }

  // Load last clear info
  if (data.lastClear) {
    updateStatsDisplay(data.lastClear);
  }
}

function updateStatsVisibility(visible) {
  if (visible) {
    stats.classList.add('visible');
  } else {
    stats.classList.remove('visible');
  }
}

function updateStatsDisplay(clearInfo) {
  // Update time
  const date = new Date(clearInfo.timestamp);
  statsTime.textContent = date.toLocaleTimeString();

  // Clear and rebuild the items list
  clearedItemsList.innerHTML = '';

  let clearedCount = 0;
  let skippedCount = 0;

  for (const [type, result] of Object.entries(clearInfo.items || {})) {
    const li = document.createElement('li');
    li.className = 'cleared-item';

    const icon = document.createElement('span');
    icon.className = 'cleared-item-icon';

    const name = document.createElement('span');
    name.className = 'cleared-item-name';
    name.textContent = dataTypeNames[type] || type;

    const statusSpan = document.createElement('span');
    statusSpan.className = 'cleared-item-status';

    if (result.cleared) {
      icon.textContent = '✓';
      icon.classList.add('success');
      statusSpan.textContent = 'Cleared';
      clearedCount++;
    } else if (result.skipped) {
      icon.textContent = '–';
      icon.classList.add('skipped');
      statusSpan.textContent = 'Skipped';
      skippedCount++;
    } else if (result.error) {
      icon.textContent = '✗';
      icon.style.color = '#e74c3c';
      statusSpan.textContent = 'Error';
    }

    li.appendChild(icon);
    li.appendChild(name);
    li.appendChild(statusSpan);
    clearedItemsList.appendChild(li);
  }

  // Update summary
  summaryCount.textContent = `${clearedCount} cleared, ${skippedCount} skipped`;
  summaryDuration.textContent = clearInfo.duration ? `${clearInfo.duration}ms` : '';
}

function getSelectedDataTypes() {
  const selected = {};
  for (const [type, checkbox] of Object.entries(dataTypeCheckboxes)) {
    selected[type] = checkbox.checked;
  }
  return selected;
}

function getSelectedScope() {
  for (const [scope, radio] of Object.entries(scopeRadios)) {
    if (radio.checked) {
      return scope;
    }
  }
  return 'currentTab';
}

function getOriginFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.origin;
  } catch {
    return null;
  }
}

async function getOriginsForScope(scope) {
  if (scope === 'allBrowser') {
    return null; // null means clear all
  }

  if (scope === 'currentTab') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
      const origin = getOriginFromUrl(tab.url);
      return origin ? [origin] : null;
    }
    return null;
  }

  if (scope === 'allTabs') {
    const tabs = await chrome.tabs.query({ active: true });
    const origins = new Set();
    for (const tab of tabs) {
      if (tab.url) {
        const origin = getOriginFromUrl(tab.url);
        if (origin && !origin.startsWith('chrome://') && !origin.startsWith('chrome-extension://')) {
          origins.add(origin);
        }
      }
    }
    return origins.size > 0 ? Array.from(origins) : null;
  }

  return null;
}

async function saveDataTypePreferences() {
  const dataTypes = getSelectedDataTypes();
  await chrome.storage.local.set({ dataTypes });
}

// Save data type preferences when changed
for (const checkbox of Object.values(dataTypeCheckboxes)) {
  checkbox.addEventListener('change', saveDataTypePreferences);
}

// Save scope preference when changed
for (const radio of Object.values(scopeRadios)) {
  radio.addEventListener('change', async () => {
    await chrome.storage.local.set({ scope: getSelectedScope() });
  });
}

// Select all / Deselect all handlers
selectAllBtn.addEventListener('click', async () => {
  for (const checkbox of Object.values(dataTypeCheckboxes)) {
    checkbox.checked = true;
  }
  await saveDataTypePreferences();
});

deselectAllBtn.addEventListener('click', async () => {
  for (const checkbox of Object.values(dataTypeCheckboxes)) {
    checkbox.checked = false;
  }
  await saveDataTypePreferences();
});

// Save hard reload preference
hardReloadCheckbox.addEventListener('change', async () => {
  await chrome.storage.local.set({ hardReload: hardReloadCheckbox.checked });
});

// Save show stats preference
showStatsCheckbox.addEventListener('change', async () => {
  const enabled = showStatsCheckbox.checked;
  await chrome.storage.local.set({ showStats: enabled });
  updateStatsVisibility(enabled);
});

// Clear data button handler
btn.addEventListener('click', async () => {
  const selectedTypes = getSelectedDataTypes();
  const hasSelection = Object.values(selectedTypes).some(v => v);

  if (!hasSelection) {
    status.textContent = 'Please select at least one data type';
    status.style.color = '#e74c3c';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Clearing...';
  status.textContent = '';
  status.style.color = '#666';

  // Initialize terminal
  terminalClear();
  terminalLog('Starting cache removal...', 'info');

  const startTime = Date.now();
  const clearResults = {};
  const scope = getSelectedScope();

  try {
    // Get origins based on scope
    const origins = await getOriginsForScope(scope);

    const scopeText = scope === 'currentTab' ? 'current tab' :
                      scope === 'allTabs' ? 'all active tabs' : 'entire browser';
    terminalLog(`Scope: ${scopeText}`, 'info');

    if (origins && origins.length > 0) {
      for (const origin of origins) {
        terminalLog(`Target: ${origin}`, 'info');
      }
    }

    // Build options with origins if specified
    const options = {};
    if (origins) {
      options.origins = origins;
    }

    // Clear each data type individually for real-time feedback
    const typeToApiKey = {
      cache: 'cache',
      cookies: 'cookies',
      localStorage: 'localStorage',
      sessionStorage: 'localStorage',
      indexedDB: 'indexedDB',
      serviceWorkers: 'serviceWorkers'
    };

    for (const [type, selected] of Object.entries(selectedTypes)) {
      if (selected) {
        const apiKey = typeToApiKey[type];
        const displayName = dataTypeNames[type];

        terminalLog(`Clearing ${displayName}...`);

        try {
          await chrome.browsingData.remove(options, { [apiKey]: true });
          terminalLog(`${displayName} cleared`, 'success');
          clearResults[type] = { cleared: true };
        } catch (err) {
          terminalLog(`Failed to clear ${displayName}: ${err.message}`, 'error');
          clearResults[type] = { error: err.message };
        }
      } else {
        clearResults[type] = { skipped: true };
      }
    }

    const duration = Date.now() - startTime;
    terminalLog(`Done in ${duration}ms`, 'success');

    const clearInfo = {
      timestamp: Date.now(),
      duration: duration,
      success: true,
      items: clearResults,
      scope: scope,
      origins: origins
    };

    await chrome.storage.local.set({ lastClear: clearInfo });

    btn.textContent = 'Cleared!';
    btn.classList.add('success');

    status.textContent = `Cleared for ${scopeText}`;

    updateStatsDisplay(clearInfo);

    // Hard reload if enabled
    if (hardReloadCheckbox.checked) {
      terminalLog('Reloading page...', 'info');
      if (scope === 'currentTab') {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          await chrome.tabs.reload(tab.id, { bypassCache: true });
        }
      } else if (scope === 'allTabs') {
        const tabs = await chrome.tabs.query({ active: true });
        for (const tab of tabs) {
          if (tab.id && !tab.url?.startsWith('chrome://') && !tab.url?.startsWith('chrome-extension://')) {
            chrome.tabs.reload(tab.id, { bypassCache: true });
          }
        }
      } else {
        // For entire browser, just reload current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          await chrome.tabs.reload(tab.id, { bypassCache: true });
        }
      }
    }

    setTimeout(() => {
      btn.textContent = 'Clear Selected Data';
      btn.classList.remove('success');
      btn.disabled = false;
      status.textContent = '';
    }, 1500);
  } catch (error) {
    terminalLog(`Error: ${error.message}`, 'error');

    // Record errors
    for (const [type, selected] of Object.entries(selectedTypes)) {
      if (selected && !clearResults[type]) {
        clearResults[type] = { error: error.message };
      } else if (!selected) {
        clearResults[type] = { skipped: true };
      }
    }

    const clearInfo = {
      timestamp: Date.now(),
      success: false,
      error: error.message,
      items: clearResults
    };

    await chrome.storage.local.set({ lastClear: clearInfo });

    btn.textContent = 'Clear Selected Data';
    btn.disabled = false;
    status.textContent = 'Error: ' + error.message;
    status.style.color = '#e74c3c';

    updateStatsDisplay(clearInfo);
  }
});

// Initialize on load
init();
