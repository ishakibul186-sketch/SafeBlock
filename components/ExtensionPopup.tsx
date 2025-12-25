
import React from 'react';
import { Settings } from '../types';
import ShieldIcon from './icons/ShieldIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XIcon from './icons/XIcon';
import LockIcon from './icons/LockIcon';

interface ExtensionPopupProps {
  settings: Settings | null;
  onClose: () => void;
  onManageSettings: () => void;
}

const ExtensionPopup: React.FC<ExtensionPopupProps> = ({ settings, onClose, onManageSettings }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="relative w-full max-w-sm p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
          <XIcon className="w-6 h-6" />
        </button>

        <header className="flex flex-col items-center text-center mb-6">
          <ShieldIcon className="w-10 h-10 text-blue-500 mb-2" />
          <h1 className="text-xl font-bold">Safe Block Protection</h1>
        </header>

        <div className="space-y-4">
          <div className="flex items-center p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300">Protection is Active</p>
              <p className="text-sm text-green-600 dark:text-green-400">Your browsing is secure.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h2 className="font-semibold mb-2 text-sm">Custom Blocked Sites:</h2>
            {settings && settings.customBlockedUrls.length > 0 ? (
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300 max-h-32 overflow-y-auto pr-2">
                {settings.customBlockedUrls.map(url => <li key={url} className="font-mono truncate">{url}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 italic">No custom sites added.</p>
            )}
          </div>
        </div>

        <footer className="mt-6">
          <button 
            onClick={onManageSettings} 
            className="w-full bg-blue-600 text-white py-3 font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
          >
            <LockIcon className="w-5 h-5" />
            <span>Manage Settings</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ExtensionPopup;
   