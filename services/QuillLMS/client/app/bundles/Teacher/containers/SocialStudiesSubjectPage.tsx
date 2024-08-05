import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import QuestionsAndAnswers from './QuestionsAndAnswers'

import PreviewCard from '../components/shared/preview_card.jsx';
import { requestGet } from '../../../modules/request';

const largeIconBaseSrc = `${process.env.CDN_URL}/images/icons/l`

const shipIconSrc = `${largeIconBaseSrc}/ship.svg`
const scrollIconSrc = `${largeIconBaseSrc}/scroll.svg`

const pageImgBaseSrc = `${process.env.CDN_URL}/images/pages/social_studies_subject_page`

const closeReadingSrc = `${pageImgBaseSrc}/close-reading.svg`
const constructingClaimsSrc = `${pageImgBaseSrc}/constructing-claims.svg`
const sentenceFundamentalsSrc = `${pageImgBaseSrc}/sentence-fundamentals.svg`
const quillPlusOERProjectLogoSrc = `${pageImgBaseSrc}/quill-plus-oer-project-logo.svg`

const GETTING_STARTED_COLLECTION_ID = 477
const INTEGRATING_QUILL_EVIDENCE_ARTICLE_ID = 666

const WORLD_HISTORY_1200_TO_PRESENT_LINK = `${window.location.pathname}/world-history-1200-to-present`.replace('//', '/')

const TeacherCenterArticleCard = ({ blogPostId, }) => {
  const [blogPost, setBlogPost] = React.useState(null);
  const [blogPostAuthor, setBlogPostAuthor] = React.useState(null);

  React.useEffect(() => {
    getBlogPost(blogPostId)
  }, [])

  function getBlogPost(id: string) {
    requestGet(`/featured_blog_post/${id}`,
      (data) => {
        if(data.blog_post) {
          const { blog_post, author } = data;
          setBlogPost(blog_post)
          setBlogPostAuthor(author)
        }
      }
    )
  }

  function renderPreviewContent({ title, slug, preview_card_content, external_link, footer_content }) {
    if (footer_content) {
      return(
        <section className="content-section">
          <h4>{title}</h4>
          <ReactMarkdown className="preview-card" source={footer_content} />
          <section className="footer-section">
            {blogPostAuthor && <p className="author">{`By ${blogPostAuthor}`}</p>}
            <a className="quill-button focus-on-light contained teal extra-small" href={`/teacher-center/${slug}`} rel="noopener noreferrer" target="_blank">Read</a>
          </section>
        </section>
      )
    }

    return(
      <PreviewCard
        color="teal"
        content={preview_card_content}
        externalLink={!!external_link}
        key={title}
        link={external_link ? external_link : `/teacher-center/${slug}`}
      />
    )
  }

  if(!blogPost) { return <span /> }

  return renderPreviewContent(blogPost)
}

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
          <button className="quill-button focus-on-light medium disabled contained" disabled={true} type="button">View activities</button>
        </div>
      </div>
    </div>
  </header>
)

const summary = (
  <section className="summary-section">
    <div className="container">
      <h2>Build Content Knowledge & Writing Skills With Reading for Evidence</h2>
      <p>Written and reviewed by social studies educators, each Quill Social Studies text highlights a moment or movement linked to course themes. Not only do these activities deepen students’ subject area learning and reinforce essential social studies content, they also provide support for:</p>
      <div className="summary-items">
        <div className="summary-item">
          <img alt="" src={closeReadingSrc} />
          <h3>Close reading</h3>
          <p>Every activity begins with a structured highlighting task as an entry point to the text. Then, students read and reread up to ten times in the process of developing their responses.</p>
        </div>
        <div className="summary-item">
          <img alt="" src={constructingClaimsSrc} />
          <h3>Constructing evidence-based claims</h3>
          <p>Students receive custom feedback developed by real teachers to help them use what they have read to craft strong sentences.</p>
        </div>
        <div className="summary-item">
          <img alt="" src={sentenceFundamentalsSrc} />
          <h3>Sentence fundamentals</h3>
          <p>Practice with conjunctions like because, but, and so provides students with a framework to combine sentences and express complex ideas effectively. Once they’ve clearly captured these ideas in their response, students receive grammar and spelling guidance too.</p>
        </div>
      </div>
    </div>
  </section>
)

const teacherQuotes = (
  <section className="teacher-quotes">
    <div className="container">
      <h2>What Are Social Studies Teachers Saying?</h2>
      <div className="quote-boxes">
        <div className="quote-box">
          <p>“With Quill giving them that instant feedback, it&#39;s like having me over their shoulder, but with everyone at the same time.”</p>
          <span>Alison B.</span>
        </div>
        <div className="quote-box">
          <p>“They&#39;re learning content that I would probably not have time to teach them. They are practicing skills that, honestly, they all need more practice on every day.”</p>
          <span>Amber L. </span>
        </div>
        <div className="quote-box">
          <p>“I think Quill has helped them understand what they&#39;re really looking for in the document or in the writing -— they are definitely annotating and highlighting better as the semester goes on.”</p>
          <span>Devin G.</span>
        </div>
      </div>
    </div>
  </section>
)

const oerProject = (
  <section className="oer-project container">
    <img alt="Quill logo plus OER Project logo" src={quillPlusOERProjectLogoSrc} />
    <p>Quill has partnered with <a href="https://www.oerproject.com/" rel="noopener noreferrer" target="_blank">OER Project</a> to curate open educational resources from their site that work well with Quill social studies content. On the course landing page, each Reading for Evidence activity includes a suggested paired OER Project leveled text (ranging from 600L to 1500L). These texts can be used to preview new content, reinforce prior knowledge, provide additional historical context, or, when used in conjunction with the Quill activity, serve as part of a text set to support extended writing practice. Whether used on their own or as part of the full OER Project curriculum, these resources are a valuable addition to any high school world history&nbsp;classroom.</p>
  </section>
)

const teacherCenterArticles = (
  <section className="teacher-center-articles">
    <div className="container">
      <h2>Learn more with these Teacher Center articles</h2>
      <div className="articles-wrapper">
        <TeacherCenterArticleCard blogPostId={GETTING_STARTED_COLLECTION_ID} />
        <TeacherCenterArticleCard blogPostId={INTEGRATING_QUILL_EVIDENCE_ARTICLE_ID} />
      </div>
    </div>
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
      {oerProject}
      <QuestionsAndAnswers questionsAndAnswersFile="socialStudies" supportLink={null} />
      {teacherCenterArticles}
      {tryItOutForYourself}
    </div>
  )
}

export default SocialStudiesSubjectPage
