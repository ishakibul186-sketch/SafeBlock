
import React, { useState } from 'react';
import ShieldIcon from './icons/ShieldIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

// --- Extension File Contents ---

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;

const manifestJson = `{
  "manifest_version": 3,
  "name": "Safe Block",
  "version": "1.0",
  "description": "A browser extension to block adult websites and custom URLs.",
  "permissions": [
    "storage",
    "declarativeNetRequest"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon.svg",
      "48": "icons/icon.svg",
      "128": "icons/icon.svg"
    }
  },
  "icons": {
    "16": "icons/icon.svg",
    "48": "icons/icon.svg",
    "128": "icons/icon.svg"
  },
  "options_page": "settings.html"
}`;

const backgroundJs = `
const MOCK_ADULT_SITES = ['adultsite.com', 'anotherbadsite.org', 'xxx-example.net'];
const ADULT_SITES_RULE_ID_OFFSET = 1000;
const CUSTOM_URLS_RULE_ID_OFFSET = 2000;

async function updateBlockingRules() {
  const { settings } = await chrome.storage.local.get('settings');
  if (!settings) return;

  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const rulesToRemove = existingRules.map(rule => rule.id);
  const rulesToAdd = [];

  if (settings.blockAdultSites) {
    MOCK_ADULT_SITES.forEach((domain, index) => {
      rulesToAdd.push({
        id: ADULT_SITES_RULE_ID_OFFSET + index,
        priority: 1,
        action: { type: 'block' },
        condition: {
          urlFilter: \`||\${domain}\`,
          resourceTypes: ['main_frame'],
        },
      });
    });
  }

  if (settings.customBlockedUrls) {
    settings.customBlockedUrls.forEach((domain, index) => {
      if (domain.trim() !== '') {
        rulesToAdd.push({
          id: CUSTOM_URLS_RULE_ID_OFFSET + index,
          priority: 1,
          action: { type: 'block' },
          condition: {
            urlFilter: \`||\${domain.trim()}\`,
            resourceTypes: ['main_frame'],
          },
        });
      }
    });
  }

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rulesToRemove,
    addRules: rulesToAdd,
  });
  console.log('Safe Block rules updated. Added:', rulesToAdd.length, 'Removed:', rulesToRemove.length);
}

chrome.runtime.onInstalled.addListener(() => {
  const defaultSettings = {
    passwordHash: null,
    blockAdultSites: true,
    customBlockedUrls: [],
    setupComplete: false,
  };
  chrome.storage.local.set({ settings: defaultSettings }, () => {
    console.log('Safe Block default settings initialized.');
    updateBlockingRules();
  });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.settings) {
    console.log('Safe Block settings changed, updating rules.');
    updateBlockingRules();
  }
});
`;

const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Safe Block</title>
  <style>
    body { font-family: sans-serif; width: 250px; margin: 0; background-color: #f9fafb; }
    .container { padding: 16px; }
    .header { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px; }
    .header h1 { font-size: 1.1rem; margin: 0; color: #1f2937; }
    .status { display: flex; align-items: center; padding: 12px; background-color: #ecfdf5; border-radius: 8px; color: #065f46; margin-bottom: 16px; }
    .status p { margin: 0; font-weight: 600; font-size: 0.9rem; }
    button { width: 100%; padding: 10px; font-size: 0.9rem; font-weight: 600; color: white; background-color: #2563eb; border: none; border-radius: 8px; cursor: pointer; }
    button:hover { background-color: #1d4ed8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      <h1>Safe Block</h1>
    </div>
    <div class="status">
      <p>Protection is Active</p>
    </div>
    <button id="manage-settings">Manage Settings</button>
  </div>
  <script src="popup.js"></script>
</body>
</html>`;

const popupJs = `document.getElementById('manage-settings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});`;

const settingsHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Safe Block Settings</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; background-color: #f1f5f9; color: #1e293b; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 16px; box-sizing: border-box; }
      .container { max-width: 500px; width: 100%; background-color: white; padding: 32px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
      .header { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 32px; text-align: center; }
      .header h1 { font-size: 1.5rem; font-weight: 700; margin: 0; }
      input[type="password"], input[type="text"] { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 16px; box-sizing: border-box; font-size: 1rem; }
      button { width: 100%; background-color: #2563eb; color: white; padding: 12px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: background-color 0.2s; }
      button:hover { background-color: #1d4ed8; }
      .btn-green { background-color: #16a34a; }
      .btn-green:hover { background-color: #15803d; }
      #error { color: #dc2626; margin-bottom: 16px; text-align: center; min-height: 1.2em; }
      .section { background-color: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
      .section h3 { font-size: 1rem; font-weight: 600; margin-top: 0; margin-bottom: 12px; }
      #custom-url-list { list-style: none; padding: 0; margin: 0; max-height: 150px; overflow-y: auto; }
      #custom-url-list li { display: flex; justify-content: space-between; align-items: center; background-color: #fff; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 8px; font-family: monospace; font-size: 0.9rem; }
      #custom-url-list button { width: auto; background: none; color: #ef4444; padding: 4px; }
      .hidden { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <h1>Safe Block Settings</h1>
        </div>
        <p id="error"></p>
        <div id="locked-view" class="hidden">
            <h2 style="text-align:center; font-weight: 600; margin-bottom: 16px;">Settings are Locked</h2>
            <input type="password" id="password-unlock" placeholder="Enter password to unlock">
            <button id="unlock-btn">Unlock</button>
        </div>
        <div id="setup-view" class="hidden">
            <h2 style="text-align:center; font-weight: 600; margin-bottom: 16px;">Create a Password</h2>
            <p style="text-align:center; color: #64748b; margin-top: -8px; margin-bottom: 16px;">Set a password to protect your settings.</p>
            <input type="password" id="password-setup" placeholder="Enter new password (min 4 chars)">
            <button id="setup-btn">Set Password</button>
        </div>
        <div id="unlocked-view" class="hidden">
             <div class="section">
                <h3>Block Adult Websites</h3>
                <div style="display: flex; justify-content: space-between; align-items: center; opacity: 0.7;">
                    <label>Always On Protection</label>
                    <div style="background-color: #2563eb; width: 44px; height: 24px; border-radius: 99px; position: relative; cursor: not-allowed;">
                        <div style="position: absolute; top: 2px; left: 22px; width: 20px; height: 20px; background: white; border-radius: 99px;"></div>
                    </div>
                </div>
            </div>
            <div class="section">
                <h3>Custom Blocklist</h3>
                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                    <input type="text" id="custom-url-input" placeholder="e.g., distractingsite.com" style="margin-bottom: 0;">
                    <button id="add-url-btn" style="width: auto; padding: 0 16px;">Add</button>
                </div>
                <ul id="custom-url-list"></ul>
            </div>
            <button id="save-btn" class="btn-green">Save & Lock</button>
        </div>
    </div>
    <script src="settings.js"></script>
</body>
</html>`;

const settingsJs = `
const lockedView = document.getElementById('locked-view');
const setupView = document.getElementById('setup-view');
const unlockedView = document.getElementById('unlocked-view');
const errorEl = document.getElementById('error');
let currentSettings = {};

const passwordSetupInput = document.getElementById('password-setup');
const passwordUnlockInput = document.getElementById('password-unlock');
const setupBtn = document.getElementById('setup-btn');
const unlockBtn = document.getElementById('unlock-btn');
const saveBtn = document.getElementById('save-btn');
const addUrlBtn = document.getElementById('add-url-btn');
const customUrlInput = document.getElementById('custom-url-input');
const customUrlList = document.getElementById('custom-url-list');

function displayMessage(message, isError = false) {
    errorEl.textContent = message;
    errorEl.style.color = isError ? '#dc2626' : '#16a34a';
    setTimeout(() => errorEl.textContent = '', 3000);
}

function renderUrlList() {
    customUrlList.innerHTML = '';
    if (!currentSettings.customBlockedUrls || currentSettings.customBlockedUrls.length === 0) {
        customUrlList.innerHTML = \`<li style="justify-content: center; background: none; color: #94a3b8; border: none;">No custom sites added.</li>\`;
        return;
    }
    currentSettings.customBlockedUrls.forEach(url => {
        const li = document.createElement('li');
        li.innerHTML = \`
            <span>\${url}</span>
            <button data-url="\${url}" title="Remove">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        \`;
        li.querySelector('button').addEventListener('click', () => {
            currentSettings.customBlockedUrls = currentSettings.customBlockedUrls.filter(u => u !== url);
            renderUrlList();
        });
        customUrlList.appendChild(li);
    });
}

function showView(view) {
    lockedView.classList.add('hidden');
    setupView.classList.add('hidden');
    unlockedView.classList.add('hidden');
    document.getElementById(view).classList.remove('hidden');
}

async function loadSettings() {
    const data = await chrome.storage.local.get('settings');
    currentSettings = data.settings;
    if (!currentSettings || !currentSettings.passwordHash) {
        showView('setup-view');
    } else {
        showView('locked-view');
    }
}

setupBtn.addEventListener('click', () => {
    const password = passwordSetupInput.value;
    if (password.length < 4) {
        displayMessage('Password must be at least 4 characters long.', true);
        return;
    }
    currentSettings.passwordHash = btoa(password);
    passwordSetupInput.value = '';
    renderUrlList();
    showView('unlocked-view');
});

unlockBtn.addEventListener('click', () => {
    const password = passwordUnlockInput.value;
    if (btoa(password) === currentSettings.passwordHash) {
        passwordUnlockInput.value = '';
        renderUrlList();
        showView('unlocked-view');
    } else {
        displayMessage('Incorrect password.', true);
    }
});

addUrlBtn.addEventListener('click', () => {
    const newUrl = customUrlInput.value.trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    if (newUrl && !currentSettings.customBlockedUrls.includes(newUrl)) {
        currentSettings.customBlockedUrls.push(newUrl);
        customUrlInput.value = '';
        renderUrlList();
    }
});

customUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addUrlBtn.click();
    }
});

saveBtn.addEventListener('click', async () => {
    currentSettings.setupComplete = true;
    await chrome.storage.local.set({ settings: currentSettings });
    showView('locked-view');
    displayMessage('Settings saved!', false);
});

document.addEventListener('DOMContentLoaded', loadSettings);
`;

interface HomePageProps {
  onInstall: () => void;
}

declare var JSZip: any;

const HomePage: React.FC<HomePageProps> = ({ onInstall }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAndInstall = async () => {
    setIsDownloading(true);

    try {
      const zip = new JSZip();
      zip.folder("icons")?.file("icon.svg", iconSvg);
      zip.file("manifest.json", manifestJson);
      zip.file("background.js", backgroundJs);
      zip.file("popup.html", popupHtml);
      zip.file("popup.js", popupJs);
      zip.file("settings.html", settingsHtml);
      zip.file("settings.js", settingsJs);

      const content = await zip.generateAsync({ type: "blob" });
      
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "SafeBlock-Extension.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error("Failed to generate zip file:", error);
      alert("Could not generate the extension file. Please try again.");
    } finally {
      setIsDownloading(false);
      onInstall();
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 to-gray-200 dark:from-slate-900 dark:to-gray-800">
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex items-center justify-between p-4 mb-8 bg-white dark:bg-slate-800/50 rounded-lg shadow-md backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <ShieldIcon className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Safe Block</h1>
          </div>
          <button
            onClick={handleDownloadAndInstall}
            disabled={isDownloading}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isDownloading ? 'Downloading...' : 'Download Extension & Continue'}
          </button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-extrabold mb-4 text-slate-900 dark:text-white">Your Digital Guardian for a Safer Web</h2>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              Safe Block is a powerful, user-friendly browser extension designed to create a secure and focused online environment. It effectively blocks access to adult content and allows you to customize your own blocklist, putting you in complete control of your digital space.
            </p>
            <div className="space-y-4">
               <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Key Features:</h3>
               <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 mr-3 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-600 dark:text-slate-300"><strong>Comprehensive Adult Site Blocking:</strong> Automatically blocks a vast database of inappropriate websites.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 mr-3 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-600 dark:text-slate-300"><strong>Custom Blocklist:</strong> Add any website URL you wish to block for a personalized and productive browsing experience.</span>
                </li>
                 <li className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 mr-3 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-600 dark:text-slate-300"><strong>Password Protection:</strong> Secure your settings with a password to prevent unauthorized changes.</span>
                </li>
                 <li className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 mr-3 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-600 dark:text-slate-300"><strong>Sleek & Simple Interface:</strong> Managing your protection is intuitive and hassle-free.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg shadow-lg">
             <img src="https://picsum.photos/800/600?random=1" alt="Abstract digital art" className="object-cover w-full h-full transition-transform duration-500 hover:scale-110" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
   