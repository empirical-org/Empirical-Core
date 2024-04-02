import * as React from 'react';

function useHideFooter() {
  React.useEffect(() => {
    const elements = document.querySelectorAll('.home-footer');

    elements.forEach((element) => {
      element.style.display = 'none';
    });

    return () => {
      // Cleanup function to remove the style when the component unmounts
      elements.forEach((element) => {
        element.style.display = ''; // Reset to the default display property
      });
    };
  }, []);
}

export default useHideFooter;
