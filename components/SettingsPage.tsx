
import React, { useState, useEffect, useMemo } from 'react';
import { Settings } from '../types';
import { getCookie, setCookie } from '../utils/cookies';
import ShieldIcon from './icons/ShieldIcon';
import LockIcon from './icons/LockIcon';
import UnlockIcon from './icons/UnlockIcon';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface SettingsPageProps {
  onSetupComplete: () => void;
  onBack: () => void;
  isInitialSetup: boolean;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onSetupComplete, onBack, isInitialSetup }) => {
  const [settings, setSettings] = useState<Settings>({
    passwordHash: null,
    blockAdultSites: true,
    customBlockedUrls: [],
    setupComplete: false,
  });
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const needsPasswordSetup = useMemo(() => !settings.passwordHash, [settings.passwordHash]);

  useEffect(() => {
    const settingsCookie = getCookie('safeBlockSettings');
    if (settingsCookie) {
      try {
        const parsedSettings = JSON.parse(settingsCookie);
        setSettings(parsedSettings);
        setIsLocked(!!parsedSettings.passwordHash);
      } catch (e) {
        console.error("Failed to parse settings cookie", e);
      }
    } else {
      setIsLocked(false); // Unlock for initial setup
    }
  }, []);

  const saveSettings = (newSettings: Settings) => {
    setCookie('safeBlockSettings', JSON.stringify(newSettings), 365);
    setSettings(newSettings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handlePasswordSet = () => {
    if (passwordInput.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    setError('');
    const newSettings = { ...settings, passwordHash: btoa(passwordInput) };
    saveSettings(newSettings);
    // Do not lock yet, let user configure other things
    setPasswordInput('');
  };

  const handleUnlock = () => {
    if (btoa(passwordInput) === settings.passwordHash) {
      setIsLocked(false);
      setError('');
      setPasswordInput('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };
  
  const handleSaveChanges = () => {
    const newSettings = { ...settings, setupComplete: true };
    saveSettings(newSettings);
    onSetupComplete();
  }

  const handleAddCustomUrl = () => {
    if (customUrlInput && !settings.customBlockedUrls.includes(customUrlInput)) {
      setSettings(prev => ({
        ...prev,
        customBlockedUrls: [...prev.customBlockedUrls, customUrlInput.trim()],
      }));
      setCustomUrlInput('');
    }
  };

  const handleDeleteCustomUrl = (urlToDelete: string) => {
    setSettings(prev => ({
      ...prev,
      customBlockedUrls: prev.customBlockedUrls.filter(url => url !== urlToDelete),
    }));
  };

  const renderContent = () => {
    if (needsPasswordSetup) {
      return (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Create a Password</h2>
            <p className="text-slate-500 mb-6">Set a password to protect your settings.</p>
            <div className="max-w-sm mx-auto">
                <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 mb-4 text-center bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 rounded-lg transition"
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button onClick={handlePasswordSet} className="w-full bg-blue-600 text-white py-3 font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2">
                <LockIcon className="w-5 h-5"/>
                <span>Set Password</span>
                </button>
            </div>
        </div>
      );
    }

    if (isLocked) {
      return (
        <div className="text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>
            <h2 className="text-2xl font-bold mb-2">Protection is Active</h2>
            <p className="text-slate-500 mb-6">Your browsing is being protected by Safe Block.</p>
            <div className="max-w-sm mx-auto">
                <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password to unlock"
                className="w-full px-4 py-3 mb-4 text-center bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 rounded-lg transition"
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button onClick={handleUnlock} className="w-full bg-slate-600 text-white py-3 font-semibold rounded-lg hover:bg-slate-700 transition flex items-center justify-center space-x-2">
                <UnlockIcon className="w-5 h-5"/>
                <span>Unlock Settings</span>
                </button>
            </div>
        </div>
      );
    }
    
    // Unlocked View
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Manage Protection</h2>
            
            <div className="space-y-6">
                {/* Adult Site Blocker */}
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg opacity-75">
                    <div className="flex items-center justify-between">
                        <label htmlFor="adult-blocker" className="font-semibold text-slate-500 dark:text-slate-300">Block Adult Websites</label>
                        <div className="relative inline-flex items-center cursor-not-allowed">
                            <div className="w-11 h-6 bg-blue-600 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-[22px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5"></div>
                             <span className="ml-3 text-xs font-medium text-slate-400">Always On</span>
                        </div>
                    </div>
                </div>

                {/* Custom Blocklist */}
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Custom Blocklist</h3>
                    <div className="flex space-x-2 mb-4">
                        <input
                        type="text"
                        value={customUrlInput}
                        onChange={e => setCustomUrlInput(e.target.value)}
                        placeholder="e.g., distractingsite.com"
                        className="flex-grow px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button onClick={handleAddCustomUrl} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center">
                            <PlusIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {settings.customBlockedUrls.map(url => (
                            <li key={url} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-md">
                                <span className="font-mono text-sm">{url}</span>
                                <button onClick={() => handleDeleteCustomUrl(url)} className="text-red-500 hover:text-red-700 p-1">
                                    <TrashIcon className="w-4 h-4"/>
                                </button>
                            </li>
                        ))}
                         {settings.customBlockedUrls.length === 0 && <p className="text-center text-sm text-slate-400 py-4">No custom sites added yet.</p>}
                    </ul>
                </div>

                <p className="text-xs text-slate-400 text-center">Your settings are saved locally in your browser's cookies. We do not collect any personal data.</p>
                <button onClick={handleSaveChanges} className="w-full bg-green-600 text-white py-3 font-semibold rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2">
                    <LockIcon className="w-5 h-5"/>
                    <span>{isInitialSetup ? 'Activate Protection' : 'Save & Lock'}</span>
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-lg mx-auto relative">
        <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl relative">
            <header className="flex items-center justify-center mb-8 text-center relative">
                <button onClick={onBack} title={isInitialSetup ? 'Back to Home/Uninstall' : 'Back to Browser'} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                    <ArrowLeftIcon className="w-6 h-6"/>
                </button>
                <div className="flex items-center space-x-3">
                    <ShieldIcon className="w-8 h-8 text-blue-500"/>
                    <h1 className="text-2xl font-bold">Safe Block Simulator</h1>
                </div>
            </header>
            <main>
                {renderContent()}
            </main>
        </div>
         {showSuccess && (
          <div className="absolute bottom-5 right-5 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-bounce">
            Settings Saved!
          </div>
        )}
      </div>
    </div>
  );
};


export default SettingsPage;
   