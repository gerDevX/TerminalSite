import React from 'react';
import { TerminalBanner } from '../components/TerminalBanner';
import { TerminalPrompt } from '../components/TerminalPrompt';

export const HomeConsole: React.FC = () => {
  return (
    <div className="container p-2">
      <TerminalBanner />
      <TerminalPrompt />
    </div>
  );
};
