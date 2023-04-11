import React from 'react';
import { config } from '../config';
import { TerminalRow } from './TerminalRow';
import default_img from '../assets/ASCII_ART_TRASNPARENT.fw.png';

export const TerminalBanner: React.FC = () => {
  const bannerIntroText = [
    `<span class="text-white">${config.author} Not A Corporation. All rights reserved.</span><br/>`,
    '<span class="console-info">Welcome to my interactive web terminal.</span><br/>',
    '<span class="console-info">For a list of available commands, type</span> <span class="command">\'help\'</span><span class="console-info">.</span>',
  ];

  return (
    <div className="text-left p-4">
      <div id="logo-main">
        <img src={default_img} alt="Logo Main" />
      </div>
      <TerminalRow textLines={bannerIntroText} typeSpeed={700} />
    </div>
  );
};
