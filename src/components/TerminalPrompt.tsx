import { useEffect, useRef, useState } from 'react';
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

  const commandResult = (cmd: string): JSX.Element => {
    switch (cmd) {
      case 'lastCmd':
        return (
          <p className="console-row last-cmd">
            <TermUser />
            <span className="history-text">{currentCmd}</span>
          </p>
        );
      case 'help': {
        return (
          <>
            {config.availableCommands.map((option: any, index: number) => {
              return (
                <p className="console-row" key={index}>
                  <span className="result-row">
                    {option.name}{' '}
                    <label className="desc">{option.description}</label>{' '}
                    {/* <span className="result-row-desc">
                      
                    </span> */}
                  </span>
                </p>
              );
            })}
          </>
        );
      }
      case 'about':
        return (
          <>
            <p className="console-row">
              <TermUser />
              <span className="history-text">about</span>
            </p>
            <p className="console-row">
              <span className="console-info">
                I am a software engineer and web developer with a passion for
                learning new technologies and building new things. I am
                currently working as a software engineer at{' '}
                <a
                  href="https://www.athenahealth.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Test
                </a>
                .
              </span>
            </p>
          </>
        );
      default:
        return <></>;
      // case 'contact':
      //   return (
      //     <>
      //       <p className="console-row">
      //         <TermUser />
      //         <span className="history-text">contact</span>
      //       </p>
      //       <p className="console-row">
      //         <span className="console-info">
      //           You can reach me at{' '}
      //           <a href="mailto:
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

    console.log(resultCommand.props.children);

    appendHtml(lastCommand);
    setTimeout(() => {
      resultCommand.props.children.map((child: any) => {
        appendHtml(child);
      });
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
