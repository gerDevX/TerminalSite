import { useEffect, useRef } from 'react';
import { TerminalUser as TermUser } from './TerminalUser';

export const TerminalPrompt = (): JSX.Element => {
  const textRef = useRef<any>(null);
  const typerRef = useRef<any>(null);
  const cursorRef = useRef<any>(null);

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
      const cursor = cursorRef.current;
      cursor.style.left = '0px';
      textRef.current.value = '';
      typerRef.current.innerHTML = '';
    }
  };

  useEffect(() => {
    const cursor = cursorRef.current;
    cursor.style.left = '0px';
    textRef.current.focus();
    window.addEventListener('keyup', enterKey);
  }, []);

  return (
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
  );
};
