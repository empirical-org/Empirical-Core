import * as React from 'react';

import QuestionsAndAnswers from '../../Teacher/containers/QuestionsAndAnswers';
import { onMobile } from '../../Shared';
import EvidenceWidget from './evidenceWidget';

export const EvidenceTool = ({ loggedInUser }) => {

  function renderBottomSection() {
    if(loggedInUser) {
      return(
        <section className="tool-sign-up">
          <h1 className='q-h1'>Get started now! Assign Quill Reading for Evidence.</h1>
          <a className="q-button cta-button bg-quillgreen text-white" href={`${process.env.DEFAULT_URL}/assign/activity-library?activityClassificationFilters[]=evidence`}>Assign</a>
        </section>
      );
    }
    return(
      <section className="tool-sign-up">
        <h1 className='q-h1'>Sign up to start Quill Reading for Evidence in your class today!</h1>
        <a className="q-button cta-button bg-quillgreen text-white" href={`${process.env.DEFAULT_URL}/account/new`}>Sign up</a>
      </section>
    );
  }

  function renderHeaderText() {
    if(onMobile()) {
      return <p>Quill provides free writing and grammar activities for elementary, middle, and high school students.</p>
    }
    return <p>Provide your students with nonfiction texts paired with AI-powered writing prompts, instead of multiple-choice questions, to enable deeper thinking. Students read a nonfiction text and build their comprehension through writing prompts, supporting a series of claims with evidence sourced from the text. Quill challenges students to write responses that are precise, logical, and based on textual evidence, with Quill coaching the student through custom, targeted feedback on each revision so that students strengthen their reading comprehension and hone their writing skills.<br /><br /> Designed for 8th-12th grade students, each activity takes 15-20 minutes to complete. Quill is developing activities for ELA, social studies, and science classrooms, with a particular focus on texts that examine 21st-century issues.</p>
  }

  function renderFirstAttemptText() {
    if(onMobile()) {
      return <p>This response uses the wrong type of evidence to demonstrate a relationship of contrast. The feedback and mini lesson explain how to use because to show a relationship of causation between two ideas.</p>
    }
    return(
      <React.Fragment>
        <p>Quill&apos;s feedback bot provides custom feedback for every response that mirrors the feedback a teacher would provide to a student in a 1:1 context. </p>
        <p>In this response, it&apos;s true that seaweed benefits cows by reducing their methane emissions, but the student has not specified *why* seaweed is beneficial. Quill asks the student to go back to the text and examine it more carefully to provide a reason why seaweed benefits cows and the environment. Students must use precise evidence in their response to be able to successfully complete it.</p>
      </React.Fragment>
    )
  }

  function renderSecondAttemptText() {
    if(onMobile()) {
      return <p>The student identified that methane is harmful to the environment but did not support their response with a key statistic from the text. Quill encourages them to be as specific as possible.</p>
    }
    return <p>The student identified that methane is harmful to the environment but did not support their response with a key statistic from the text. Quill encourages them to be as specific as possible to stregthen their response and more accurately respond to the claim.</p>
  }

  function renderThirdAttemptText() {
    if(onMobile()) {
      return <p>The student strengthened their evidence by adding a precise statistic from the text that explains how significantly seaweed impacts methane.</p>
    }
    return <p>The student strengthened their evidence by adding a precise statistic from the text that explains how significantly seaweed impacts methane. Since the key ideas are in place, Quill now provides a mini-lesson on the grammar errors in their response. Quill only provides grammar and spelling feedback once the student has written a strong response with the key ideas from the text.</p>
  }

  function renderFourthAttemptText() {
    if(onMobile()) {
      return <p>The student wrote a precise, textually-supported sentence. Quill provides additional feedback to reinforce what they learned.</p>
    }
    return <p>At this point the student has now written a precise, textually-supported sentence. Students often come into the tool writing vague or inaccurate statements, and through multiple rounds of practice, feedback, and revision, students gain the ability to utilize precise evidence in their responses.</p>
  }

  return(
    <div className="tool-container evidence-tool-page">
      <section className='bg-quillteal tool-hero text-center'>
        <section className="inner-section">
          <section className="header-and-icon-container">
            <img alt="Reading for Evidence icon" className="tool-page-icon lazyload" data-src='https://assets.quill.org/images/icons/tool-evidence-white.svg' />
            <h1 className="q-h1">Quill Reading for Evidence</h1>
            <p className="new-tag">NEW</p>
          </section>
          <section className="description">{renderHeaderText()}</section>
        </section>
      </section>
      <section className="bg-quillteal tool-hero topics-section">
        <section className="inner-section">
          <div className="topic-section">
            <p className="topic">Culture & Society Topics</p>
            <img alt="photograph of a football" src="https://assets.quill.org/images/evidence/home_page/EvidenceLandingPage_Image_Football.png" />
            <p className="activity-title">"Should Schools Have Grade Requirements for Student Athletes?"</p>
            <a className="q-button text-quillteal bg-white" href='https://www.quill.org/evidence/#/play?uid=180&skipToPrompts=true' rel="noopener noreferrer" target="_blank">View a sample activity</a>
          </div>
          <div className="topic-section">
            <p className="topic">Science Topics</p>
            <img alt="photograph of a cow" src="https://assets.quill.org/images/evidence/home_page/EvidenceLandingPage_Image_Cow.png" />
            <p className="activity-title">"How Does Eating Meat Impact Global Warming?"</p>
            <a className="q-button text-quillteal bg-white" href='https://www.quill.org/evidence/#/play?uid=176&skipToPrompts=true' rel="noopener noreferrer" target="_blank">View a sample activity</a>
          </div>
          <div className="topic-section">
            <p className="topic">Social Studies Topics</p>
            <img alt="photograph of the Statue of Liberty" src="https://assets.quill.org/images/evidence/home_page/EvidenceLandingPage_Image_StatueOfLiberty.png" />
            <p className="activity-title" id="first-title-topic">U.S. History</p>
            <p className="activity-title" id="second-title-topic">World History</p>
            <p id="under-development">Under Development, Coming 2023</p>
          </div>
        </section>
      </section>
      <section className="prompt-example-container">
        <EvidenceWidget />
      </section>
      <section id="instructions-container">
        <div className="instruction-container">
          <div className="step-number">1</div>
          <p className="step-text">Read and highlight text</p>
          <img alt="A sample article about volcanoes showing a sentence highlighted with the cursor over the highlighted sentence" className="step-image" src='https://assets.quill.org/images/evidence/article-highlighted.svg' />
        </div>
        <div className="instruction-container">
          <div className="step-number">2</div>
          <p className="step-text">Write sentences using what you read</p>
          <img alt="A sample question asking a student to fill in the rest of a sentence" className="step-image" src='https://assets.quill.org/images/evidence/sentence-prompt.svg' />
        </div>
        <div className="instruction-container">
          <div className="step-number">3</div>
          <p className="step-text">Revise based on feedback</p>
          <img alt="A sample feedback asking a student to add more detail to their sentence" className="step-image" src='https://assets.quill.org/images/evidence/sentence-feedback.svg' />
        </div>
      </section>
      <section className="prompts-walkthrough-container">
        <section className="header-section">
          <p>Example Prompt:</p>
          <p>“How Does Eating Meat Impact Global Warming?”</p>
        </section>
        <section className="attempt gray-background">
          <section className="left-side-container">
            <p><strong>1st</strong> Attempt</p>
            {renderFirstAttemptText()}
          </section>
          <section className="right-side-container">
            <img alt="screenshot of example first attempt Reading for Evidence activity prompt" id="prompt-screenshot" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_3.png" />
            <img alt="dotted line arrow" id="arrow" src="https://assets.quill.org/images/evidence/home_page/evidence_arrow.svg" />
          </section>
        </section>
        <section className="attempt">
          <section className="left-side-container">
            <p><strong>2nd</strong> Attempt</p>
            {renderSecondAttemptText()}
          </section>
          <section className="right-side-container">
            <img alt="screenshot of example first attempt Reading for Evidence activity prompt" id="prompt-screenshot" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_6.png" />
            <img alt="dotted line arrow" id="arrow" src="https://assets.quill.org/images/evidence/home_page/evidence_arrow.svg" />
          </section>
        </section>
        <section className="attempt gray-background">
          <section className="left-side-container">
            <p><strong>3rd</strong> Attempt</p>
            {renderThirdAttemptText()}
          </section>
          <section className="right-side-container">
            <img alt="screenshot of example first attempt Reading for Evidence activity prompt" id="prompt-screenshot" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_9.png" />
            <img alt="dotted line arrow" id="arrow" src="https://assets.quill.org/images/evidence/home_page/evidence_arrow.svg" />
          </section>
        </section>
        <section className="attempt">
          <section className="left-side-container">
            <p><strong>4th</strong> Attempt</p>
            {renderFourthAttemptText()}
          </section>
          <section className="right-side-container">
            <img alt="screenshot of example first attempt Reading for Evidence activity prompt" id="prompt-screenshot" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_12.png" />
          </section>
        </section>
      </section>
      <section className="screenshot-container">
        <img alt="screenshot of example Reading for Evidence activity" src="https://assets.quill.org/images/evidence/home_page/EvidenceLandingPage_Screenshot1.png" />
        <p>Students receive instant feedback on the quality of their writing.</p>
      </section>
      <section className="evidence-feature-container">
        <section className="inner-container">
          <section id="information-section">
            <section id="header-container">
              <p id="header">Activities are not graded</p>
            </section>
            <img alt="An illustration of an A+ that is crossed out" id="image" src='https://assets.quill.org/images/evidence/home_page/EvidenceLandingPage_Feature1.png' />
            <p className="subtext">"This is a safe space to practice your writing, so it won't be graded. Your teacher will see your revisions, but there are no scores or points."</p>
          </section>
          <section id="information-section">
            <section id="header-container">
              <p id="header">We use a feedback bot</p>
            </section>
            <img alt="An illustration of a smiling robot head" id="image" src='https://assets.quill.org/images/evidence/home_page/EvidenceLandingPage_Feature2.png' />
            <p className="subtext">"We use artificial intelligence (AI) to help us give you feedback on your writing. You should know that AI isn't always correct."</p>
          </section>
          <section id="information-section">
            <section id="header-container">
              <p id="header">All writers revise</p>
            </section>
            <img alt="An illustration of a pencil circled with a revision" id="image" src='https://assets.quill.org/images/evidence/home_page/EvidenceLandingPage_Feature3.png' />
            <p className="subtext">"You'll be able to revise each sentence up to five times. We give you feedback because we want to help you write a stronger sentence."</p>
          </section>
        </section>
      </section>
      <QuestionsAndAnswers questionsAndAnswersFile="evidence" supportLink="https://www.quill.org/teacher-center/quill-reading-for-evidence-resources" />
      <section className="tool-try-it bg-connect-teal bg-book-pattern">
        <h2 className='q-h1'>Try It Out for Yourself</h2>
        <section className="tool-ctas evidence-tool">
          <a className="q-button cta-button text-quillteal bg-white" href='https://www.quill.org/evidence/#/play?uid=176&skipToPrompts=true' rel="noopener noreferrer" target="_blank">Try a sample activity</a>
        </section>
      </section>
      {renderBottomSection()}
    </div>
  );
}

export default EvidenceTool
