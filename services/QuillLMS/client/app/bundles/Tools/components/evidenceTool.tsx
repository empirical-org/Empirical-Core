import * as React from 'react';

import QuestionsAndAnswers from '../../Teacher/containers/QuestionsAndAnswers';
import { onMobile } from '../../Shared';

const EVIDENCE_TIPS = [
  "Quill’s feedback bot provides custom feedback for every prompt that mirrors the feedback a teacher would provide to a student in a 1:1 context.",
  "When needed, the feedback offers extra support with mini lessons that explain key writing skills like paraphrasing or using a conjunction to join ideas."
]

export const EvidenceTool = ({ loggedInUser }) => {
  let tipIndex = 0;
  const [evidenceTip, setEvidenceTip] = React.useState<string>(EVIDENCE_TIPS[0])

  React.useEffect(() => {
    if(onMobile()) {
      setInterval(() => {
        handleSetTip();
      }, 7000);
    }
  }, [])

  function handleSetTip() {
    if(tipIndex === EVIDENCE_TIPS.length - 1) {
      tipIndex = 0;
      setEvidenceTip(EVIDENCE_TIPS[tipIndex])
    } else {
      tipIndex += 1;
      setEvidenceTip(EVIDENCE_TIPS[tipIndex])
    }
  }

  function renderBottomSection() {
    if(loggedInUser) {
      return(
        <section className="tool-sign-up">
          <h1 className='q-h1'>Get started now! Assign Quill Reading for Evidence.</h1>
          <a href='/assign/activity-library?activityClassificationFilters[]=evidence' className="q-button cta-button bg-quillgreen text-white">Assign</a>
        </section>
      );
    }
    return(
      <section className="tool-sign-up">
        <h1 className='q-h1'>Sign up to start Quill Reading for Evidence in your class today!</h1>
        <a href='/account/new' className="q-button cta-button bg-quillgreen text-white">Sign Up</a>
      </section>
    );
  }

  function renderHeaderText() {
    if(onMobile()) {
      return <p>Quill provides free writing and grammar activities for elementary, middle, and high school students.</p>
    }
    return(
      <p>Provide your students with nonfiction texts paired with AI-powered writing prompts, instead of multiple-choice questions, to enable deeper thinking. Students read a nonfiction text and build their comprehension through writing prompts, supporting a series of claims with evidence sourced from the text. Quill challenges students to write responses that are precise, logical, and based on textual evidence, with Quill coaching the student through custom, targeted feedback on each revision so that students strengthen their reading comprehension and hone their writing skills.<br/><br/> Designed for 8th-12th grade students, each activity takes 15-20 minutes to complete. Quill is developing activities for ELA, social studies, and science classrooms, with a particular focus on texts that examine 21st-century issues.</p>
    )
  }

  function renderTip() {
    return <section className="prompt-explanation mobile">{evidenceTip}</section>
  }

  return(
    <div className="tool-container evidence-tool-page">
      <section className='bg-quillteal tool-hero text-center tool-section'>
        <section className="header-and-icon-container">
          <img className="tool-page-icon lazyload" data-src='https://assets.quill.org/images/icons/tool-evidence-white.svg' />
          <h1 className="q-h1">Quill Reading for Evidence</h1>
        </section>
        <section className="description">{renderHeaderText()}</section>
      </section>

      <section className="prompt-example-container">
        <section className="inner-container">
          <img alt="A screenshot of an example Reading for Evidence prompt" id="image" src='https://assets.quill.org/images/evidence/evidence_example_prompt.svg' />
        </section>
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

      <section className="screenshot-container">
        <img src="https://assets.quill.org/images/evidence/home_page/EvidenceLandingPage_Screenshot1.png" alt="screenshot of example Reading for Evidence activity" />
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
      <QuestionsAndAnswers questionsAndAnswersFile="evidence" supportLink="https://support.quill.org/en/collections/64417-using-quill-tools" />
      <section className="tool-try-it bg-connect-teal bg-book-pattern">
        <h2 className='q-h1'>Try It Out for Yourself</h2>
        <section className="tool-ctas evidence-tool">
          <a href='/activity_sessions/anonymous?activity_id=244' target="_blank" className="q-button cta-button text-quillteal bg-white">Try a sample activity</a>
        </section>
      </section>
      {renderBottomSection()}
    </div>
  );
}

export default EvidenceTool
