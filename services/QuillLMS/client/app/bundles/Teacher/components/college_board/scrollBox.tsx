import * as React from 'react';

import { scrollToSection, handleSetActiveSection } from '../../helpers/collegeBoard';
import { ScrollSection } from '../../../../interfaces/collegeBoard';

const ScrollBox = ({ activeSection, sections, setActiveSection }) => {

  function handleClick(ref: React.RefObject<HTMLDivElement>, title: string) {
    handleSetActiveSection(title, setActiveSection);
    scrollToSection(ref);
  }

  return(
    <div className="scrollbox-container">
      <section className="header">Scroll to</section>
      <section className="sections-container">
        {sections.map((section: ScrollSection) => {
          const { ref, title, count }  = section;
          const countStyle = !count ?  'hidden' : '';
          const statusStyle = !title ?  'inactive' : '';
          const titleStyle = title === activeSection ?  'bolded' : '';
          return(
            /* eslint-disable-next-line react/jsx-no-bind */
            <button className="section-container" key={title} onClick={() => handleClick(ref, title)} type="button">
              <section className="title-container">
                <div className={`section-status ${statusStyle}`} />
                <p className={`section-title ${titleStyle}`}>{title}</p>
              </section>
              <p className={`section-count ${countStyle}`}>{count}</p>
            </button>
          );
        })}
      </section>
    </div>
  );
}

export default ScrollBox;
