
import React, { useState, useEffect, useCallback } from 'react';
import { getCookie } from '../utils/cookies';
import { Settings } from '../types';
import BlockedPage from './BlockedPage';
import ShieldIcon from './icons/ShieldIcon';
import ExtensionPopup from './ExtensionPopup';
import GlobeIcon from './icons/GlobeIcon';

const MOCK_ADULT_SITES = ['adultsite.com', 'anotherbadsite.org', 'xxx-example.net'];

interface BrowserSimulationPageProps {
  onGoToSettings: () => void;
}

const BrowserSimulationPage: React.FC<BrowserSimulationPageProps> = ({ onGoToSettings }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('welcome-page.com');
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const settingsCookie = getCookie('safeBlockSettings');
    if (settingsCookie) {
      try {
        setSettings(JSON.parse(settingsCookie));
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  const checkUrl = useCallback((url: string) => {
    if (!settings) return false;
    
    const formattedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    if (settings.blockAdultSites && MOCK_ADULT_SITES.includes(formattedUrl)) {
      return true;
    }
    if (settings.customBlockedUrls.includes(formattedUrl)) {
      return true;
    }
    return false;
  }, [settings]);

  const handleNavigate = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const urlToNavigate = urlInput.trim();
    if (!urlToNavigate) return;
    
    setCurrentUrl(urlToNavigate);
    setIsBlocked(checkUrl(urlToNavigate));
  };
  
  const renderContent = () => {
    if (isBlocked) {
      return <BlockedPage url={currentUrl} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <GlobeIcon className="w-24 h-24 text-blue-500 mb-6" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Welcome!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4">You are currently browsing:</p>
        <p className="px-4 py-2 font-mono text-sm text-blue-700 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/50 rounded-md">
          {currentUrl}
        </p>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100 dark:bg-slate-900">
        <div className="w-full max-w-4xl h-[80vh] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          {/* Browser Chrome */}
          <header className="flex-shrink-0 p-3 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <form onSubmit={handleNavigate} className="relative">
              <input 
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter a URL to visit (e.g., adultsite.com)"
                className="w-full pl-4 pr-16 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700">
                Go
              </button>
            </form>
          </header>
          {/* Content Area */}
          <main className="flex-grow p-4">
            {renderContent()}
          </main>
        </div>
      </div>
      
      {/* Extension Button */}
      <button 
        onClick={() => setIsPopupOpen(true)}
        title="Open Safe Block"
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-transform transform hover:scale-110"
      >
        <ShieldIcon className="w-8 h-8"/>
      </button>

      {isPopupOpen && (
        <ExtensionPopup 
          settings={settings} 
          onClose={() => setIsPopupOpen(false)} 
          onManageSettings={() => {
            setIsPopupOpen(false);
            onGoToSettings();
          }} 
        />
      )}
    </>
  );
};

export default BrowserSimulationPage;
   