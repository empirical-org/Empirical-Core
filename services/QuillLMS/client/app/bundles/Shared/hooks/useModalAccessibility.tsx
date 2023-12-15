import { useEffect, useRef } from 'react';

import { ESCAPE, TAB } from '../utils/keyNames';
import { MOUSEDOWN, KEYDOWN, } from '../utils/eventNames'

const useModalAccessibility = (handleClose) => {
  const modalRef = useRef(null);

  const trapFocus = (event) => {
    const focusableModalElements = modalRef.current.querySelectorAll('input, button, select, textarea, a[href]');
    const firstElement = focusableModalElements[0];
    const lastElement = focusableModalElements[focusableModalElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleDocumentKeyDown = (event) => {
      if (event.key === ESCAPE) {
        handleClose();
      } else if (event.key === TAB) {
        trapFocus(event);
      }
    };

    // Add event listeners
    document.addEventListener(MOUSEDOWN, handleDocumentClick);
    document.addEventListener(KEYDOWN, handleDocumentKeyDown);

    // Focus on the modal when it opens
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener(MOUSEDOWN, handleDocumentClick);
      document.removeEventListener(KEYDOWN, handleDocumentKeyDown);
    };
  }, [handleClose]);

  return { modalRef };
};

export default useModalAccessibility;
