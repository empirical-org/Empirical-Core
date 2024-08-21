import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import QuestionsAndAnswers from './QuestionsAndAnswers'

import SubjectPageTeacherCenterArticles from '../components/content_hubs/subject_page_teacher_center_articles'
import SubjectPageSummary from '../components/content_hubs/subject_page_summary'
import { LARGE_ICON_BASE_SRC, } from '../../Shared/index'

const shipIconSrc = `${LARGE_ICON_BASE_SRC}/ship.svg`
const scrollIconSrc = `${LARGE_ICON_BASE_SRC}/scroll.svg`

const pageImgBaseSrc = `${process.env.CDN_URL}/images/pages/social_studies_subject_page`

const quillPlusOERProjectLogoSrc = `${pageImgBaseSrc}/quill-plus-oer-project-logo.svg`

const WORLD_HISTORY_1200_TO_PRESENT_LINK = `${window.location.pathname}/world-history-1200-to-present`.replace('//', '/')

const overview = (
  <header>
    <div className="container">
      <h1>Social Studies</h1>
      <p>Quill Social Studies activities allow teachers to give students the literacy instruction they need while covering core course content. In these Reading for Evidence activities, students read course-aligned texts, use what they’ve read to draft evidence-based claims, and receive AI-powered feedback to strengthen their writing. Process and growth are key: our responsive coaching guides students to revise until their sentences are clear, logical, and grounded in specific details from the text.<br /><br />Quill Social Studies is designed to supplement high school social studies courses. World History: 1200 CE-Present is available now, and World History: 1750 CE-Present will launch during the 2024-2025 school year!</p>
      <div className="course-cards">
        <div className="course-card">
          <img alt="" src={shipIconSrc} />
          <div>
            <h2>World History</h2>
            <span>1200 CE - Present</span>
          </div>
          <a className="quill-button focus-on-light contained medium teal" href={WORLD_HISTORY_1200_TO_PRESENT_LINK}>View activities</a>
        </div>
        <div className="course-card">
          <img alt="" src={scrollIconSrc} />
          <div>
            <h2>World History</h2>
            <span>1750 CE - Present</span>
          </div>
          <button className="quill-button focus-on-light medium disabled contained" disabled={true} type="button">Coming soon!</button>
        </div>
      </div>
    </div>
  </header>
)

const summary = (
  <SubjectPageSummary
    paragraphCopy="Written and reviewed by social studies educators, each Quill Social Studies text highlights a moment or movement linked to course themes. Not only do these activities deepen students’ subject area learning and reinforce essential social studies content, they also provide support for:"
  />
)

const teacherQuotes = (
  <section className="teacher-quotes">
    <div className="container">
      <h2>What Are Social Studies Teachers Saying?</h2>
      <div className="quote-boxes">
        <div className="quote-box">
          <p>“Quill has been helpful in giving them a toolkit to make arguments [and] to identify and test claims.”</p>
          <div>
            <span className="name">Rachel R.</span>
            <span>State Fine Arts High School</span>
            <span>Modern World History</span>
          </div>
        </div>
        <div className="quote-box">
          <p>“They&#39;re learning content that I would probably not have time to teach them. They are practicing skills that, honestly, they all need more practice on every day.”</p>
          <div>
            <span className="name">Amber L.</span>
            <span>Glasgow School District</span>
          </div>
        </div>
        <div className="quote-box">
          <p>“I would say that the combination of using the OER curriculum and Quill has pushed them in their reading stamina and level.”</p>
          <div>
            <span className="name">Tricia C.</span>
            <span>Latexo High School</span>
            <span>9th Grade World History</span>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const partners = (
  <section className="partners container">
    <img alt="Quill logo plus OER Project logo" src={quillPlusOERProjectLogoSrc} />
    <p>Quill has partnered with <a href="https://www.oerproject.com/World-History?WT.mc_id=00_00_2024__course-WHP_OER-QUILL_&WT.tsrc=OERQUILL" rel="noopener noreferrer" target="_blank">OER Project</a> to curate open educational resources from their site that work well with Quill social studies content. On the course landing page, each Reading for Evidence activity includes a suggested paired OER Project leveled text (ranging from 600L to 1500L). These texts can be used to preview new content, reinforce prior knowledge, provide additional historical context, or, when used in conjunction with the Quill activity, serve as part of a text set to support extended writing practice. Whether used on their own or as part of the full OER Project curriculum, these resources are a valuable addition to any high school world history&nbsp;classroom.</p>
  </section>
)

const tryItOutForYourself = (
  <section className="try-it-out">
    <div className="container">
      <h2>Try it out for yourself</h2>
      <div className="links-wrapper">
        <a className="quill-button focus-on-dark outlined teal large" href="/evidence/#/play?anonymous=true&uid=457" rel="noopener noreferrer" target="_blank" >Try a sample activity</a>
        <a className="quill-button focus-on-dark outlined teal large" href={WORLD_HISTORY_1200_TO_PRESENT_LINK}>View 1200 CE - Present activities</a>
      </div>
    </div>
  </section>
)

const SocialStudiesSubjectPage = ({}) => {
  return (
    <div className="social-studies-subject-page subject-page">
      {overview}
      {summary}
      {teacherQuotes}
      {partners}
      <QuestionsAndAnswers questionsAndAnswersFile="socialStudies" supportLink={null} />
      <SubjectPageTeacherCenterArticles />
      {tryItOutForYourself}
    </div>
  )
}

export default SocialStudiesSubjectPage
