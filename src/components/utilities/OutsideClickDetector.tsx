import React, { useRef, useEffect } from 'react';

interface OutsideClickDetectorProps {
  onOutsideClick: () => void;
}

export default function OutsideClickDetector({ children, onOutsideClick } : React.PropsWithChildren<OutsideClickDetectorProps>) {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onOutsideClick();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // max width is to make the search component responsive since this is the parent container for it
  // <div style={{ maxWidth: '100%', position:'sticky', top: 0, zIndex: 3 }} ref={ref}>{children}</div>
  return <div ref={ref} style={{ position:'relative' }}>{children}</div>;
};
