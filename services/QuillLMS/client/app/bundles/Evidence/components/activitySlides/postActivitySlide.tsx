import * as React from "react";

import { BECAUSE, BUT, SO } from '../../../Shared/index'
import { PromptInterface } from "../../../Staff/interfaces/evidenceInterfaces";

const FIRST_STRONG_EXAMPLE = 'first_strong_example';
const SECOND_STRONG_EXAMPLE = 'second_strong_example';
const conjunctions = [BECAUSE, BUT, SO];

interface PostActivitySlideProps {
  handleClick: () => void,
  prompts: PromptInterface[],
  responses: any
}

export const PostActivitySlide = ({ handleClick, prompts, responses }: PostActivitySlideProps) => {

  function getStrongExemplar(conjunction: string, property: string) {
    const prompt = prompts.filter(prompt => prompt.conjunction === conjunction)[0];
    if (!prompt) { return }
    const stemWithoutConjunction = prompt.text.replace(conjunction, '');
    const exemplar = prompt[property];
    return <p>{stemWithoutConjunction}<u>{`${conjunction} ${exemplar}`}</u></p>;
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
    const splitResponse = lastResponseText.split(conjunction);
    return <p>{splitResponse[0]}<u>{`${conjunction} ${splitResponse[1]}`}</u></p>
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

  return(
    <div className="post-activity-slide-container">
      <section id="information-section">
        <img alt="An illustration of a party popper" id="celebration-vector" src={`${process.env.CDN_URL}/images/evidence/party-celebration.svg`} />
        <p id="revision-text">You have completed the activity!</p>
        <p className="slide-sub-text" id="second-sub-text">Be proud of the work you did today, and celebrate your success! This practice will help you grow as a reader and a writer. The more you practice, the stronger your critical thinking, reading, and writing skills will be.</p>
        <section id="reminder-badge-section">
          <img alt="An illustration of an A+ that is crossed out" id="grade-badge" src={`${process.env.CDN_URL}/images/evidence/paper-check.svg`} />
          <section id="reminder-text-section">
            <p className="sub-header-text">Reminder about grades</p>
            <p className="sub-header-subtext">Your teacher will see all of your revisions, but this activity was for practice, so it isn’t graded.</p>
          </section>
        </section>
      </section>
      <section className="responses-exemplars-container">
        <section className="review-response-header-section">
          <p className="sub-header-text">Reflect on your work.</p>
          <p className="sub-header-subtext">There are many different ways to use evidence in your writing. Consider how your responses compare to the strong examples. In what ways are they similar or different? Notice the ideas, the phrasing, and the tone of voice, and think about how you could use because, but, and so in your future writing.</p>
        </section>
        {renderResponseAndExamplarsSection(BECAUSE)}
        {renderResponseAndExamplarsSection(BUT)}
        {renderResponseAndExamplarsSection(SO)}
      </section>
      <section id="button-container">
        <button className="quill-button large secondary outlined focus-on-dark" onClick={handleClick} type="button">Next</button>
      </section>
    </div>
  );
}

export default PostActivitySlide;
