
import React from 'react';
import ShieldIcon from './icons/ShieldIcon';

interface BlockedPageProps {
  url: string;
}

const BlockedPage: React.FC<BlockedPageProps> = ({ url }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
      <ShieldIcon className="w-24 h-24 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold text-red-800 dark:text-red-300 mb-2">Access Denied</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-4">This website has been blocked by Safe Block.</p>
      <p className="px-4 py-2 font-mono text-sm text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-900/50 rounded-md">
        {url}
      </p>
    </div>
  );
};

export default BlockedPage;
   