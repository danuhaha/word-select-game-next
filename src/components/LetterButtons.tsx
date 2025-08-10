import React, { useLayoutEffect, useRef, useState } from 'react';

interface LetterButtonsProps {
  jumbledWord: string[];
  selectedIndices: number[];
  setSelectedHandler: (index: number) => void;
  letterCounts: Record<string, number>;
  clearError: () => void;
  gameStarted: boolean;
  onBackspace: () => void;
}

const LetterButtons: React.FC<LetterButtonsProps> = ({ jumbledWord, selectedIndices, setSelectedHandler, clearError, gameStarted, onBackspace }) => {
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || (typeof navigator !== 'undefined' && (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 0));
  const lastSelectedIndex = selectedIndices[selectedIndices.length - 1];

  // Grid layout to ensure at least 3 items on the last row
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cols, setCols] = useState<number>(1);
  const [oneLineFit, setOneLineFit] = useState<boolean>(false);
  const sideMargin = 48; // px margin on each side when using one-line full-width layout
  const [measured, setMeasured] = useState<boolean>(false);

  const itemSize = 48; // px (h-12 w-12)
  const gap = 4; // px (gap-1)

  const computeCols = (width: number, itemCount: number) => {
    if (!width || itemCount <= 0) return 1;
    // Maximum columns that can fit
    const maxCols = Math.max(1, Math.min(itemCount, Math.floor((width + gap) / (itemSize + gap))));
    let c = maxCols;
    // Adjust columns so the last row has at least 3 items if possible
    while (c > 1) {
      const r = itemCount % c;
      if (r === 0 || r >= Math.min(3, itemCount)) break;
      c -= 1;
    }
    return c;
  };

  useLayoutEffect(() => {
    const measure = () => {
      const width = containerRef.current?.parentElement?.clientWidth || containerRef.current?.clientWidth || window.innerWidth;
      setCols(() => computeCols(width, jumbledWord.length));
      const vw = typeof window !== 'undefined' ? window.innerWidth : width;
      const total = jumbledWord.length;
      const totalWidth = total * itemSize + Math.max(0, total - 1) * gap;
      const available = Math.max(0, vw - 2 * sideMargin);
      setOneLineFit(vw >= 1024 && totalWidth <= available);
      setMeasured(true);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [jumbledWord.length]);

  return (
    <div
      ref={containerRef}
      className={`mb-4 w-full max-w-full ${!gameStarted ? 'blur-sm filter' : ''} ${!measured ? 'invisible' : ''}`}
    >
      {oneLineFit ? (
        <div className='mx-[calc(50%-50vw)] w-screen overflow-visible'>
          <div className='mx-auto flex max-w-[calc(100vw-96px)] flex-nowrap justify-center gap-1'>
            {jumbledWord.map((letter, index) => (
              <button
                key={index}
                {...(isTouchDevice
                  ? {
                      onTouchStart: (e: React.TouchEvent) => {
                        e.preventDefault();
                        if (index === lastSelectedIndex) {
                          onBackspace();
                          clearError();
                        } else if (!selectedIndices.includes(index)) {
                          setSelectedHandler(index);
                          clearError();
                        }
                      },
                    }
                  : {
                      onClick: () => {
                        if (index === lastSelectedIndex) {
                          onBackspace();
                          clearError();
                        } else if (!selectedIndices.includes(index)) {
                          setSelectedHandler(index);
                          clearError();
                        }
                      },
                    })}
                aria-label={`Буква ${letter.toUpperCase()} позиция ${index + 1}`}
                disabled={!gameStarted || (selectedIndices.includes(index) && index !== lastSelectedIndex)}
                className={`h-12 w-12 shrink-0 cursor-pointer rounded text-lg font-bold transition-all ${
                  selectedIndices.includes(index) ? 'bg-cell-selected text-celltext-selected' : 'bg-cell-deselected text-celltext-deselected'
                } ${selectedIndices.includes(index) && index !== lastSelectedIndex ? 'cursor-not-allowed' : ''}`}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      ) : (
        (() => {
          const rows = [] as { start: number; end: number }[];
          const total = jumbledWord.length;
          for (let start = 0; start < total; start += cols) {
            rows.push({ start, end: Math.min(start + cols, total) });
          }
          return (
            <div className='flex w-full flex-col items-center gap-1'>
              {rows.map(({ start, end }, rowIdx) => (
                <div
                  key={`row-${rowIdx}`}
                  className='flex justify-center gap-1'
                >
                  {jumbledWord.slice(start, end).map((letter, i) => {
                    const index = start + i;
                    return (
                      <button
                        key={index}
                        {...(isTouchDevice
                          ? {
                              onTouchStart: (e: React.TouchEvent) => {
                                e.preventDefault();
                                if (index === lastSelectedIndex) {
                                  onBackspace();
                                  clearError();
                                } else if (!selectedIndices.includes(index)) {
                                  setSelectedHandler(index);
                                  clearError();
                                }
                              },
                            }
                          : {
                              onClick: () => {
                                if (index === lastSelectedIndex) {
                                  onBackspace();
                                  clearError();
                                } else if (!selectedIndices.includes(index)) {
                                  setSelectedHandler(index);
                                  clearError();
                                }
                              },
                            })}
                        aria-label={`Буква ${letter.toUpperCase()} позиция ${index + 1}`}
                        disabled={!gameStarted || (selectedIndices.includes(index) && index !== lastSelectedIndex)}
                        className={`h-12 w-12 shrink-0 cursor-pointer rounded text-lg font-bold transition-all ${
                          selectedIndices.includes(index) ? 'bg-cell-selected text-celltext-selected' : 'bg-cell-deselected text-celltext-deselected'
                        } ${selectedIndices.includes(index) && index !== lastSelectedIndex ? 'cursor-not-allowed' : ''}`}
                      >
                        {letter.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );
};

export default LetterButtons;
