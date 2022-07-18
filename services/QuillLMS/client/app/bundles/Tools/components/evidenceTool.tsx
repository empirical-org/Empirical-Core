import * as React from 'react';

import QuestionsAndAnswers from '../../Teacher/containers/QuestionsAndAnswers';

export const EvidenceTool = ({ loggedInUser }) => {
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

  return(
    <div className="tool-container evidence-tool-page">
      <section className='bg-quillteal tool-hero text-center tool-section'>
        <h1 className="q-h1">
          <img className="tool-page-icon lazyload" data-src='https://assets.quill.org/images/icons/tool-evidence-white.svg' />Quill Reading for Evidence
        </h1>
        <p className='description'>
          With Quill's new Reading For Evidence tool, students engage with high-interest texts by constructing sentences that synthesize evidence from the text, with Quill's feedback engine automatically grading and providing hundreds of custom, targeted feedback for each prompt designed to enable students to continually revise and improve their writing.
        </p>
        <section className="tool-ctas evidence-tool">
          <a href='/activity_sessions/anonymous?activity_id=244' target="_blank" className="q-button cta-button text-quillteal bg-white">Try a sample activity</a>
        </section>
      </section>

      <section className="prompt-example-container">
        <section className="inner-container">
          <section className="prompt-explanation first">Quill's feedback bot provides custom feedback for every prompt that mirrors the feedback a teacher would provide to a student in a 1:1 context.</section>
          <img alt="A screenshot of an example Reading for Evidence prompt" id="image" src='https://assets.quill.org/images/evidence/evidence_example_prompt.svg' />
          <section className="prompt-explanation second">When beneficial, the feedback also provides mini lessons as hints that explain key writing skills.</section>
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

      <section className="tool-carousel" id="walkthrough">
        <div id="evidenceCarousel" className="carousel slide" data-ride="carousel">
          <a className="left carousel-control" href="#evidenceCarousel" role="button" data-slide="prev">
              <i className="fas fa-chevron-left"></i>
              <span className="sr-only">Previous</span>
          </a>
          <div className="carousel-inner" role="listbox">
            <div className="item active">
              <div className="wrapper">
                <img src={`${process.env.DEFAULT_URL}/images/tools/connect/visual_overview_screenshot.png`} alt="Chania" />
              </div>
              <p>Students receive instant feedback on the quality of their writing.</p>
            </div>
            <div className="item">
              <div className="wrapper">
                <img src={`${process.env.DEFAULT_URL}/images/tools/connect/analysis_screenshot.png`} alt="Chania" />
              </div>
              <p>Teachers see reports that state exactly which errors the student made and which concepts the student mastered.</p>
            </div>
            <div className="item">
              <div className="wrapper">
                <img src={`${process.env.DEFAULT_URL}/images/tools/connect/activities_screenshot.png`} alt="Chania" />
              </div>
              <p>Teachers have access to over 200 exercises aligned with the Common Core language standards.</p>
            </div>
          </div>
          <a className="right carousel-control" href="#evidenceCarousel" role="button" data-slide="next">
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="sr-only">Next</span>
          </a>
          <ol className="carousel-indicators">
            <li data-target="#evidenceCarousel" data-slide-to="0" className="active"></li>
            <li data-target="#evidenceCarousel" data-slide-to="1"></li>
            <li data-target="#evidenceCarousel" data-slide-to="2"></li>
          </ol>
        </div>
      </section>

      <section className="evidence-feature-container">
        <section className="inner-container">
          <section id="information-section">
            <section id="header-container">
              <p id="header">Activities are not graded</p>
            </section>
            <img alt="An illustration of an A+ that is crossed out" id="image" src='/images/landing_no_grade.svg' />
            <p className="subtext">"This is a safe space to practice your writing, so it won't be graded. Your teacher will see your revisions, but there are no scores or points."</p>
          </section>
          <section id="information-section">
            <section id="header-container">
              <p id="header">We use a feedback bot</p>
            </section>
            <img alt="An illustration of a smiling robot head" id="image" src='/images/landing_feedback_bot.svg' />
            <p className="subtext">"We use artificial intelligence (AI) to help us give you feedback on your writing. You should know that AI isn't always correct."</p>
          </section>
          <section id="information-section">
            <section id="header-container">
              <p id="header">All writers revise</p>
            </section>
            <img alt="An illustration of a pencil circled with a revision" id="image" src='/images/landing_revising_pencil.svg' />
            <p className="subtext">"You'll be able to revise each sentence up to five times. We give you feedback because we want to help you write a stronger sentence."</p>
          </section>
        </section>
      </section>
      <QuestionsAndAnswers questionsAndAnswersFile="evidence" supportLink="https://support.quill.org/en/collections/64417-using-quill-tools" />
      <section className="tool-try-it bg-connect-teal bg-book-pattern">
        <h2 className='q-h1'>Try It Out for Yourself</h2>
        <a href="https://www.quill.org/evidence/#/play?uid=87" target="_blank" className="q-button cta-button bg-white text-quillteal">Preview Quill Reading for Evidence</a>
      </section>

      <section className="tool-testimonial" id="testimonial">
        <p className='quote'>"I've seen tremendous improvement in the proficiency of my students and the quality of their writing."</p>
        <h4 className="q-h4 author">
          <span>Daniel Scibienski,</span> Princeton Public Schools
        </h4>
        <a href="/activities/packs/20" className='q-button text-black'>
          <span>View My Story</span>
        </a>
      </section>
      {renderBottomSection()}
    </div>
  );
}

export default EvidenceTool
