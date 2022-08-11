import * as React from 'react';

import EvidenceWidget from './evidenceWidget';

export const EvidenceHomeSection = () => {

  return(
    <section className="bg-quillteal tool-hero evidence-explanation-section">
      <section className="inner-section">
        <div className="left-side-container">
          <div className="header-and-icon-container">
            <img alt="Reading for Evidence icon" className="tool-page-icon lazyload" data-src="https://assets.quill.org/images/icons/tool-evidence-white.svg" />
            <h1 className="q-h1">Quill Reading for Evidence</h1>
            <p className="evidence-new-tag">NEW</p>
          </div>
          <p className="description">Provide your students with nonfiction texts paired with AI-powered writing prompts, instead of multiple-choice questions, to enable deeper thinking.</p>
          <div className="divider-tab" />
          <p className="description">Students read a nonfiction text and build their comprehension through writing prompts, supporting a series of claims with evidence sourced from the text. Quill challenges students to write responses that are precise, logical, and based on textual evidence, with Quill coaching the student through custom, targeted feedback on each revision so that students strengthen their reading comprehension and hone their writing skills.</p>
          <a className="q-button bg-white text-quillteal" href={`${process.env.DEFAULT_URL}/tools/evidence`} rel="noopener noreferrer" target="_blank">Learn more about Quill Reading for Evidence</a>
        </div>
        <EvidenceWidget />
      </section>
    </section>
  )
}

export default EvidenceHomeSection;
