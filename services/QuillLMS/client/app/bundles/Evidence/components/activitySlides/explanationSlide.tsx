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
    <div className="explanation-slide-container">
      <section className="no-focus-outline" id="information-section" ref={containerRef} tabIndex={-1}>
        <p aria-hidden={true} className="subtext">Good to know</p>
        <section id="header-container">
          <h1>{header}</h1>
          {isBeta && <div id="beta-tag">BETA</div>}
        </section>
        <img alt={imageAlt} id="image" src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/${imageUrl}`} />
        <p className="subtext">{subtext}</p>
      </section>
      <Footer buttonText={buttonText} onHandleClick={onHandleClick} step={step} />
    </div>
  );
}

export default ExplanationSlide;
