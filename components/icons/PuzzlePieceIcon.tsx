
import React from 'react';

const PuzzlePieceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
    <path d="M6 10V8a2 2 0 0 1 2-2h2" />
  </svg>
);

export default PuzzlePieceIcon;
