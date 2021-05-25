import * as React from 'react';

import { scrollToSection } from '../../helpers/collegeBoard';

const ScrollBox = ({ sections }) => {
  return(
    <div className="scrollbox-container">
      <section className="header">Scroll to</section>
      {sections.map(section => {
        const { ref, title, count }  = section;
        return(
          <button key={title} onClick={() => scrollToSection(ref)} type="button">
            <p>{title}</p>
            <p>{count}</p>
          </button>
        );
      })}
    </div>
  );
}

export default ScrollBox;
