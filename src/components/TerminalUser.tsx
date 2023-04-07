import { config } from '../config';

export const TerminalUser = () => {
  return (
    <span>
      <span className="user-prompt-info">{config.username}@</span>
      <span className="user-prompt-host">{config.hostname}</span>
      <span className="user-prompt-info">:~$&nbsp;</span>
    </span>
  );
};
