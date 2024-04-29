import * as React from 'react';

import { expandIcon } from '../../index'

const lightbulbIcon = <img alt="Lightbulb icon for helpful tips" src={`${process.env.CDN_URL}/images/pages/activity_analysis/lightbulb.svg`} />

const TipSection = ({ toggleSection, index, openStates, section, }) => {
  function handleClick() { toggleSection(index)}

  if (section.isDisabled) {
    return (
      <div className="toggle-student-report-explanation scoring-explanation is-closed">
        <span />
        <h4>{section.headerText}</h4>
      </div>
    )
  }

  if (openStates[index]) {
    return (
      <button className="toggle-student-report-explanation is-open" key={index} onClick={handleClick} type="button">
        <img alt={expandIcon.alt} src={expandIcon.src} />
        <div>
          <h4>{section.headerText}</h4>
          <div className="body">{section.body}</div>
        </div>
      </button>
    )
  }

  return (
    <button className="toggle-student-report-explanation scoring-explanation is-closed" onClick={handleClick} type="button">
      <img alt={expandIcon.alt} src={expandIcon.src} />
      <h4>{section.headerText}</h4>
    </button>
  )

}

export const HelpfulTips = ({ sections, header }) => {
  const [openStates, setOpenStates] = React.useState(sections.map(() => false));

  function toggleSection(index) {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);
  };

  return (
    <div className="helpful-tips">
      <div className="helpful-tips-header">
        {lightbulbIcon}
        {header}
      </div>
      {sections.map((section, index) => (
        <TipSection
          index={index}
          key={section.headerText}
          openStates={openStates}
          section={section}
          toggleSection={toggleSection}
        />
      ))}
    </div>
  );
};
