import * as React from 'react';

export function addKeyDownListener(handleKeyDown: (e: any) => void) {
  React.useEffect(() => {
    console.log('handleKeyDown', handleKeyDown)
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });
}
