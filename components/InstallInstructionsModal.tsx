
import React from 'react';
import XIcon from './icons/XIcon';
import PuzzlePieceIcon from './icons/PuzzlePieceIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface InstallInstructionsModalProps {
  onClose: () => void;
}

const InstallInstructionsModal: React.FC<InstallInstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
          <XIcon className="w-6 h-6" />
        </button>

        <header className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-full mb-4">
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">Download Complete!</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Just a few more steps to activate your real extension.</p>
        </header>

        <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <p className="text-center bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-sm">
                For your security, browsers require manual installation for extensions not from an official store.
            </p>
            <h2 className="text-lg font-semibold text-center pt-4">How to Install (for Chrome/Edge/Brave)</h2>
            <ol className="list-decimal list-inside space-y-3 pl-4">
                <li>
                    <strong>Unzip the File:</strong> Find the downloaded <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">SafeBlock-Extension.zip</code> file and unzip/extract it. You will get a folder with the same name.
                </li>
                <li>
                    <strong>Open Extensions Page:</strong> In your browser, open a new tab and go to <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">chrome://extensions</code> or <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">edge://extensions</code>.
                </li>
                <li>
                    <strong>Enable Developer Mode:</strong> Look for a "Developer mode" toggle in the top-right corner of the page and turn it ON.
                </li>
                <li>
                    <strong>Load the Extension:</strong> Click the "Load unpacked" button that appears, and select the <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">SafeBlock-Extension</code> folder you unzipped in step 1.
                </li>
            </ol>
             <p className="text-center font-semibold pt-4">
                You're all set! The <PuzzlePieceIcon className="w-5 h-5 inline-block -mt-1 mx-1 text-blue-500" /> Safe Block icon will appear in your browser toolbar.
            </p>
        </div>

        <footer className="mt-8 text-center">
          <button 
            onClick={onClose} 
            className="w-full max-w-xs mx-auto bg-blue-600 text-white py-3 font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Got It, Continue to Simulator
          </button>
        </footer>
      </div>
    </div>
  );
};

export default InstallInstructionsModal;
