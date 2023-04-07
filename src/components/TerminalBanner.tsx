import React from 'react';
import { TerminalRow } from './TerminalRow';

export const TerminalBanner: React.FC = () => {
  const bannerIntroText = [
    '<span class="text-white">Gerald Solano (GS) Not A Corporation. All rights reserved.</span><br/>',
    '<span class="console-info">Welcome to my interactive web terminal.</span><br/>',
    '<span class="console-info">For a list of available commands, type</span> <span class="command">\'help\'</span><span class="console-info">.</span>',
  ];

  return (
    <div className="text-left p-4">
      <TerminalRow textLines={bannerIntroText} typeSpeed={600} />
    </div>
  );
};
