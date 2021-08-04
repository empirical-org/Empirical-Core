import * as React from "react";

import Footer from './footer';

export const WelcomeSlide = ({ onHandleClick }) => {

  return(
    <div className="explanation-slide-container" id="welcome-slide-container">
      <section id="information-section">
        {/* this will be replaced with user prop after offboarding branch is merged */}
        <p className="subtext">Hi, User!</p>
        <section id="header-container">
          <p id="header">Welcome to Quill Evidence</p>
        </section>
        <section id="instructions-container">
          <div className="instruction-container">
            <div className="step-number">1</div>
            <p className="step-text">Read and highlight text</p>
            <img alt="A sample article about volcanoes showing a sentence highlighted with the cursor over the highlighted sentence" className="step-image" src={`${process.env.CDN_URL}/images/comprehension/article-highlighted.svg`} />
          </div>
          <div className="instruction-container">
            <div className="step-number">2</div>
            <p className="step-text">Write sentences using what you read</p>
            <img alt="A sample question asking a student to fill in the rest of a sentence" className="step-image" src={`${process.env.CDN_URL}/images/comprehension/sentence-prompt.svg`} />
          </div>
          <div className="instruction-container">
            <div className="step-number">3</div>
            <p className="step-text">Revise based on feedback</p>
            <img alt="A sample feedback asking a student to add more detail to their sentence" className="step-image" src={`${process.env.CDN_URL}/images/comprehension/sentence-feedback.svg`} />
          </div>
        </section>
      </section>
      <Footer buttonText="Next" onHandleClick={onHandleClick} step={1} />
    </div>
  );
}

export default WelcomeSlide;
