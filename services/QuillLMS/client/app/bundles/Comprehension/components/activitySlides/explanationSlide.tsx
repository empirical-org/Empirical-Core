import * as React from "react";

export const ExplanationSlide = ({ slideData, onHandleClick }) => {
  const { buttonText, header, imageData, isBeta, subtext } = slideData;
  const { imageAlt, imageUrl } = imageData;

  function handleClick() {
    onHandleClick();
  }

  return(
    <div className="explanation-slide-container">
      <section id="information-section">
        <p className="subtext">Good to know</p>
        <section id="header-container">
          <p id="header">{header}</p>
          {isBeta && <div id="beta-tag">BETA</div>}
        </section>
        <img alt={imageAlt} id="image" src={`${process.env.CDN_URL}/${imageUrl}`} />
        <p className="subtext">{subtext}</p>
      </section>
      <section id="button-container">
        <button className="quill-button large secondary outlined" onClick={handleClick} type="submit">{buttonText}</button>
      </section>
    </div>
  );
}

export default ExplanationSlide;
