import * as React from "react";

import { FIRST_STRONG_EXAMPLE, SECOND_STRONG_EXAMPLE } from "../../../../constants/evidence";
import useFocus from '../../../Shared/hooks/useFocus';
import { BECAUSE, BUT, SO } from '../../../Shared/index';
import { PromptInterface } from "../../../Staff/interfaces/evidenceInterfaces";

const conjunctions = [BECAUSE, BUT, SO];

interface PostActivitySlideProps {
  handleClick: () => void,
  previewMode: boolean,
  prompts: PromptInterface[],
  responses: any
}

export const PostActivitySlide = ({ handleClick, previewMode, prompts, responses }: PostActivitySlideProps) => {
  const [containerRef, setContainerFocus] = useFocus()

  React.useEffect(() => {
    setContainerFocus()
  }, [])

  function getStrongExemplar(conjunction: string, property: string) {
    const prompt = prompts.filter(prompt => prompt.conjunction === conjunction)[0];
    if (!prompt) { return }
    const conjunctionRegex = new RegExp(`${conjunction}$`)
    const stemWithoutConjunction = prompt.text.replace(conjunctionRegex, '');
    const exemplar = prompt[property];
    return <p>{stemWithoutConjunction}<strong>{`${conjunction} `}</strong><br /><u>{exemplar}</u></p>;
  }

  function getResponsesForConjunction(conjunction: string) {
    const responsesKeyHash = {}
    const responsesKeys = Object.keys(responses);
    conjunctions.forEach((conjunctionString, i) => responsesKeyHash[conjunctionString] = responsesKeys[i]);
    return responses[responsesKeyHash[conjunction]];
  }

  function getResponse(conjunction: string) {
    const responses = getResponsesForConjunction(conjunction)
    if(!responses) { return }
    const lastResponseText = responses[responses.length - 1].entry;
    const conjunctionRegex = new RegExp(`\\s${conjunction}\\s`)
    const splitResponse = lastResponseText.split(conjunctionRegex);
    return <p>{splitResponse[0]}<strong>{` ${conjunction} `}</strong><br /><u>{splitResponse[1]}</u></p>
  }

  function renderResponseAndExamplarsSection(conjunction: string) {
    return(
      <section className="response-exemplars-section">
        <section className="response-section">
          <div className="response-exemplar-header">
            <p className="sub-header-text">Your response</p>
          </div>
          <section className="response-box">{getResponse(conjunction)}</section>
        </section>
        <section className="exemplars-section">
          <div className="response-exemplar-header">
            <p className="sub-header-text">Example strong responses</p>
          </div>
          <section className="exemplar-box">{getStrongExemplar(conjunction, FIRST_STRONG_EXAMPLE)}</section>
          <section className="exemplar-box">{getStrongExemplar(conjunction, SECOND_STRONG_EXAMPLE)}</section>
        </section>
      </section>
    );
  }
  let buttonClass = "quill-button-archived large secondary outlined focus-on-dark"
  if(previewMode) {
    buttonClass += " disabled"
  }

  return(
    <div className="post-activity-slide-container no-focus-outline" ref={containerRef} tabIndex={-1}>
      <section id="information-section">
        <img alt="An illustration of a party popper" id="celebration-vector" src={`${process.env.CDN_URL}/images/evidence/party-celebration.svg`} />
        <p id="revision-text">You have completed the activity!</p>
        <p className="slide-sub-text" id="second-sub-text">Be proud of the work you did today, and celebrate your success! This practice will help you grow as a reader and a writer. The more you practice, the stronger your critical thinking, reading, and writing skills will be.</p>
      </section>
      <section className="responses-exemplars-container">
        <section className="review-response-header-section">
          <p className="sub-header-text">Here are some examples of strong responses</p>
          <p className="sub-header-subtext">There are many different ways to use evidence in your writing.</p>
        </section>
        {renderResponseAndExamplarsSection(BECAUSE)}
        {renderResponseAndExamplarsSection(BUT)}
        {renderResponseAndExamplarsSection(SO)}
      </section>
      <section id="button-container">
        <button className={buttonClass} disabled={previewMode} onClick={handleClick} type="button">Next</button>
      </section>
    </div>
  );
}

export default PostActivitySlide;
