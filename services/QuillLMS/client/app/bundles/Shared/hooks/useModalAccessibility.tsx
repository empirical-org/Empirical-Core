import { useEffect, useRef } from 'react';

import { ESCAPE, TAB } from '../utils/keyNames';
import { MOUSEDOWN, KEYDOWN, } from '../utils/eventNames'

// this hook traps keyboard focus inside of the modal, preventing keyboard users from inadvertently leaving the modal when they are trying to navigate it, which can be confusing.
// it also ensures that pressing ESCAPE or clicking outside of the modal will close it.

// it should be used inside of a modal like so:
// const { modalRef } = useModalAccessibility(handleCloseModal);
// where handleCloseModal is defined as a prop or inside the modal component,
// and then the modal element should be passed the following props:
// aria-labelledby={id of element with modal title}
// aria-modal="true"
// ref={modalRef}
// role="dialog"
// tabIndex={-1}

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
    if (modalRef.current) {
      modalRef.current.focus();
    }

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

    document.addEventListener(MOUSEDOWN, handleDocumentClick);
    document.addEventListener(KEYDOWN, handleDocumentKeyDown);

    return () => {
      document.removeEventListener(MOUSEDOWN, handleDocumentClick);
      document.removeEventListener(KEYDOWN, handleDocumentKeyDown);
    };
  }, [handleClose]);

  return { modalRef };
};

export default useModalAccessibility;
