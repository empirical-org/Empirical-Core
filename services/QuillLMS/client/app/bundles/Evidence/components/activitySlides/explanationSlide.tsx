import * as React from "react";

import Footer from './footer';

import useFocus from '../../../Shared/hooks/useFocus';

export const ExplanationSlide = ({ slideData, onHandleClick }) => {
  const { buttonText, header, imageData, isBeta, step, subtext } = slideData;
  const { imageAlt, imageUrl } = imageData;

  const [containerRef, setContainerFocus] = useFocus()

  React.useEffect(() => {
    setContainerFocus()
  }, [slideData])

  return(
    <div className={`explanation-slide-container step-${step}`}>
      <section className="no-focus-outline" id="information-section" ref={containerRef} tabIndex={-1}>
        <p aria-hidden={true} className="good-to-know">Good to know</p>
        <section id="header-container">
          <h1>{header}</h1>
          {isBeta && <div id="beta-tag">BETA</div>}
        </section>
        <img alt={imageAlt} id="image" src={`${process.env.CDN_URL}/${imageUrl}`} />
        <p className="subtext" dangerouslySetInnerHTML={{ __html: subtext, }} />
      </section>
      <Footer buttonText={buttonText} onHandleClick={onHandleClick} step={step} />
    </div>
  );
}

export default ExplanationSlide;
