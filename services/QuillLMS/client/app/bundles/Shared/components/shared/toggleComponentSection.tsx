import * as React from 'react';

import { expandIcon } from '../..'

export const ToggleComponentSection = ({ label, components }) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  function handleToggle() {
    setIsExpanded(!isExpanded);
  }

  function renderComponents() {
    if(!isExpanded) {
      return <span />
    }
    // there is an open issue with this being flagged as a false positive: https://github.com/yannickcr/eslint-plugin-react/issues/2584
    /* eslint-disable react/jsx-no-useless-fragment */
    return(
      <React.Fragment>
        {components.map(component => (component))}
      </React.Fragment>
    );
  }

  const expandedStyle = isExpanded ? 'open' : '';
  return(
    <React.Fragment>
      <button className={`expand-component-section-button interactive-wrapper focus-on-light ${expandedStyle}`} onClick={handleToggle}>
        <img alt={expandIcon.alt} className="expand-arrow" src={expandIcon.src} />
        <p>{label}</p>
      </button>
      {renderComponents()}
    </React.Fragment>
  );
}

export default ToggleComponentSection;
