import * as React from 'react';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';

import { ScrollSection } from '../../../../interfaces/collegeBoard';
import { handleSetActiveSection } from '../../helpers/collegeBoard';

const ScrollBox = ({ activeSection, showScrollBox, sections, setActiveSection, setIsScrollingFromClick}) => {

  function handleClick(ref: React.RefObject<HTMLDivElement>, title: string) {
    setIsScrollingFromClick(true);
    handleSetActiveSection(title, setActiveSection);
    scrollIntoView(ref.current, { behavior: 'smooth' }).then(() => {
      setIsScrollingFromClick(false);
    })
  }

  return(
    <div className={`scrollbox-container ${showScrollBox}`}>
      <section className="header">Scroll to</section>
      <section className="sections-container">
        {sections.map((section: ScrollSection) => {
          const { ref, title, count }  = section;
          const countStyle = count ? '' : 'hidden';
          const statusStyle = title === activeSection ? '' : 'inactive';
          const titleStyle = title === activeSection ? 'bolded' : '';
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
