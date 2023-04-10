import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { config } from '../config';
import { TerminalUser as TermUser } from './TerminalUser';
import ReactDOMServer from 'react-dom/server';

export const TerminalPrompt = (): JSX.Element => {
  const textRef = useRef<any>(null);
  const typerRef = useRef<any>(null);
  const cursorRef = useRef<any>(null);
  const [historyCmds, setHistoryCmds] = useState<string[]>([]);
  const [currentCmd, setCurrentCmd] = useState<string>('');

  const nl2br = (txt: string) => {
    return txt.replace(/\n/g, '');
  };

  const typeIt = (e: any): void => {
    e = e || window.event;
    const w = typerRef.current;
    const tw = textRef.current.value;
    w.innerHTML = nl2br(tw);
  };

  const moveIt = (e: any): void => {
    e = e || window.event;
    const count = textRef.current.value.length;
    const cursor = cursorRef.current;
    const keycode = e.keyCode || e.which;
    if (keycode == 37 && parseInt(cursor.style.left) >= 0 - (count - 1) * 10) {
      cursor.style.left = parseInt(cursor.style.left) - 10 + 'px';
    } else if (keycode == 39 && parseInt(cursor.style.left) + 10 <= 0) {
      cursor.style.left = parseInt(cursor.style.left) + 10 + 'px';
    }
  };

  const enterKey = (e: any): void => {
    e = e || window.event;
    const keycode = e.keyCode || e.which;
    if (keycode == 13) {
      const newHistory = [...historyCmds, textRef.current.value];
      setHistoryCmds(newHistory);
      setCurrentCmd(textRef.current.value);
      const cursor = cursorRef.current;
      cursor.style.left = '0px';
      textRef.current.value = '';
      typerRef.current.innerHTML = '';
    }
  };

  const renderNameCommand = (text: string): string => {
    const size = text.length;
    if (size > 12) return text;

    const missingSpaces = 12 - size;
    const spaces = '&nbsp;'.repeat(missingSpaces);

    return text + spaces;
  };

  const openLink = (link: string): void => {
    setTimeout(() => {
      window.open(link, '_blank');
    }, 500);
  };

  const commandResult = (cmd: string): JSX.Element => {
    switch (cmd) {
      case 'lastCmd':
        return (
          <p className="console-row">
            <TermUser />
            <span className="history-text">{currentCmd}</span>
          </p>
        );
      case 'help':
        return (
          <>
            {config.availableCommands.map((option: any, index: number) => {
              return (
                <p
                  className={clsx('console-row', {
                    'mt-3': index === 0,
                    'mb-3': index === config.availableCommands.length - 1,
                  })}
                  key={index}
                >
                  <span className="result-row">
                    <span
                      className="result-row-name"
                      dangerouslySetInnerHTML={{
                        __html: renderNameCommand(option.name),
                      }}
                    />
                    <span className="result-row-desc">
                      {option.description}
                    </span>
                  </span>
                </p>
              );
            })}
          </>
        );
      case 'about':
        return (
          <>
            {config.aboutMe.map((about: string, index: number) => {
              return (
                <p
                  className={clsx('console-row pl-7', {
                    'mt-3': index === 0,
                    'mb-3': index === config.aboutMe.length - 1,
                  })}
                >
                  <span className="console-info">{about}</span>
                </p>
              );
            })}
          </>
        );
      case 'contact':
        openLink('mailto:' + config.email);

        return (
          <>
            <p className="console-row pl-7 mt-3 mb-3">
              <span className="console-info">
                Opening mailto:&nbsp;
                <a href={'mailto:' + config.email}>{config.email}</a>.
              </span>
            </p>
          </>
        );
      case 'social':
        return (
          <>
            {config.social.map((social: any, index: number) => {
              return (
                <p
                  className={clsx('console-row', {
                    'mt-3': index === 0,
                    'mb-3': index === config.social.length - 1,
                  })}
                >
                  <span className="result-row">
                    <span
                      className="result-row-desc"
                      dangerouslySetInnerHTML={{
                        __html: renderNameCommand(social.name),
                      }}
                    />
                    <span className="result-row-desc">
                      <a href={social.url} target="_blank">
                        {social.url}
                      </a>
                    </span>
                  </span>
                </p>
              );
            })}
          </>
        );
      case 'summary':
        return (
          <>
            <div className="pl-7 mt-3 mb-3">
              <p className="console-row console-info">
                <i className="bx bx-home-alt" />
                &nbsp;SUMMARY
              </p>
              <p className="console-row console-info">-----------------</p>
              <p className="console-row console-info">
                <i className="bx bx-user" />
                &nbsp;{config.name}
              </p>
              <p className="console-row console-info">
                <i className="bx bx-code-alt" />
                &nbsp;{config.title}
              </p>
              <p className="console-row console-info">
                <i className="bx bx-code-curly" />
                &nbsp;
                <a href={config.resume_url} target="_blank">
                  Go to CV Resume
                </a>
              </p>
              <br />
              <p className="console-row console-info">
                <i className="bx bx-at" />
                &nbsp;CONTACT
              </p>
              <span className="console-row console-info">
                -----------------
              </span>
              <p className="console-row console-info">
                <i className="bx bx-envelope" />
                &nbsp;
                <a href={'mailto:' + config.email} target="_blank">
                  {config.email}
                </a>
              </p>
              {config.social.map((social: any, index: number) => {
                return (
                  <p className="console-row console-info">
                    <i className={social.icon} />
                    &nbsp;
                    <a href={social.url} target="_blank">
                      {social.url}
                    </a>
                  </p>
                );
              })}
            </div>
          </>
        );
      case 'clear':
        const historyContainer = document.getElementById('cmd-history');
        if (historyContainer) {
          historyContainer.innerHTML = '';
        }

        return <></>;
      default:
        return (
          <>
            <p className="console-row pl-7 mt-3 mb-3">
              <span className="console-info">
                Command not found. Type <span className="command">"help"</span>{' '}
                to see available commands.
              </span>
            </p>
          </>
        );
    }
  };

  const appendCmdToTerminal = (cmd: string): void => {
    const appendHtml = (element: JSX.Element): void => {
      const myNode = new DOMParser().parseFromString(
        ReactDOMServer.renderToStaticMarkup(element),
        'text/html',
      ).body.firstChild;
      if (myNode) historyContainer?.appendChild(myNode);
    };

    const historyContainer = document.getElementById('cmd-history');
    const lastCommand = commandResult('lastCmd');
    const resultCommand = commandResult(cmd);
    appendHtml(lastCommand);
    setTimeout(() => {
      if (resultCommand.props.children.length > 0) {
        resultCommand.props.children.map((child: any) => {
          appendHtml(child);
        });
      } else if (resultCommand.props.children) {
        appendHtml(resultCommand.props.children);
      } else {
        appendHtml(resultCommand.props);
      }
    }, 600);
  };

  useEffect(() => {
    const cursor = cursorRef.current;
    cursor.style.left = '0px';
    window.addEventListener('keyup', enterKey);

    return () => {
      window.removeEventListener('keyup', enterKey);
    };
  }, [historyCmds]);

  useEffect(() => {
    if (currentCmd.length > 0) {
      appendCmdToTerminal(currentCmd);
    }
  }, [currentCmd]);

  useEffect(() => {
    // This is a hack to get the input to focus on click anywhere on the page
    document.addEventListener('click', () => {
      if (textRef.current) {
        textRef.current.focus();
      }
    });
  }, []);

  return (
    <>
      <div id="cmd-history" className="text-left pl-4" />
      <div
        id="cmd"
        className="text-left pl-4"
        onClick={() => {
          textRef.current.focus();
        }}
      >
        <input
          id="cmd-input"
          type="text"
          ref={textRef}
          onKeyUp={(e) => typeIt(e)}
          onKeyDown={(e) => {
            typeIt(e);
            moveIt(e);
          }}
          onKeyPress={(e) => typeIt(e)}
          autoFocus
        />
        <div id="liner">
          <TermUser />
          <span id="typer" ref={typerRef} />
          <b id="cursor" className="cursor" ref={cursorRef}>
            █
          </b>
        </div>
      </div>
    </>
  );
};
