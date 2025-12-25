
import React, { useState, useEffect, useCallback } from 'react';
import HomePage from './components/HomePage';
import SettingsPage from './components/SettingsPage';
import BrowserSimulationPage from './components/BrowserSimulationPage';
import { getCookie, setCookie } from './utils/cookies';

type View = 'home' | 'settings' | 'browser';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const installedCookie = getCookie('safeBlockInstalled');
    if (installedCookie !== 'true') {
      setView('home');
    } else {
      const settingsCookie = getCookie('safeBlockSettings');
      if (settingsCookie) {
        try {
          const parsedSettings = JSON.parse(settingsCookie);
          if (parsedSettings.setupComplete) {
            setView('browser');
          } else {
            setView('settings');
          }
        } catch {
          setView('settings');
        }
      } else {
        setView('settings');
      }
    }
    setIsLoading(false);
  }, []);

  const handleInstall = useCallback(() => {
    setCookie('safeBlockInstalled', 'true', 365);
    setView('settings');
  }, []);

  const handleUninstall = useCallback(() => {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    setView('home');
  }, []);
  
  const handleSetupComplete = useCallback(() => {
    setView('browser');
  }, []);
  
  const handleGoToSettings = useCallback(() => {
    setView('settings');
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderView = () => {
    switch(view) {
      case 'home':
        return <HomePage onInstall={handleInstall} />;
      case 'settings':
        const isInitialSetup = !getCookie('safeBlockSettings') || !JSON.parse(getCookie('safeBlockSettings')!).setupComplete;
        return <SettingsPage 
                  onSetupComplete={handleSetupComplete} 
                  onBack={isInitialSetup ? handleUninstall : handleSetupComplete} 
                  isInitialSetup={isInitialSetup}
                />;
      case 'browser':
        return <BrowserSimulationPage onGoToSettings={handleGoToSettings} />;
      default:
        return <HomePage onInstall={handleInstall} />;
    }
  }

  return (
    <div className="min-h-screen font-sans antialiased text-slate-800 dark:text-slate-200">
      {renderView()}
    </div>
  );
};

export default App;
   