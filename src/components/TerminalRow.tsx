import { useEffect, useRef } from 'react';

interface TerminalRowProps {
  textLines: string[];
  typeSpeed: number;
}

export const TerminalRow = ({
  textLines,
  typeSpeed,
}: TerminalRowProps): JSX.Element => {
  const containerRef = useRef<any>(null);

  const renderRow = (textLine: string, index: number): void => {
    setTimeout(() => {
      const row = document.createElement('p');
      row.innerHTML = textLine;
      row.className = 'console-row';
      containerRef?.current?.appendChild(row);
    }, typeSpeed * index);
  };

  useEffect(() => {
    containerRef.current.innerHTML = '';
  }, []);

  return (
    <>
      {textLines.forEach((textLine: string, index: number) => {
        renderRow(textLine, index + 1);
      })}
      <div id="container-row" ref={containerRef} />
    </>
  );
};
