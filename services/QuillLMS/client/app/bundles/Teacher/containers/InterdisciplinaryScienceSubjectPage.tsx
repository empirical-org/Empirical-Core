import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import QuestionsAndAnswers from './QuestionsAndAnswers'

import PreviewCard from '../components/shared/preview_card.jsx';
import { requestGet } from '../../../modules/request';
import { LARGE_ICON_BASE_SRC, EXTRA_LARGE_ICON_BASE_SRC, } from '../../Shared/index'

const aiIconSrc = `${LARGE_ICON_BASE_SRC}/ai.svg`

const pageImgBaseSrc = `${process.env.CDN_URL}/images/pages/interdisciplinary_science_subject_page`

const closeReadingSrc = `${EXTRA_LARGE_ICON_BASE_SRC}/search-document.svg`
const constructingClaimsSrc = `${EXTRA_LARGE_ICON_BASE_SRC}/research-books.svg`
const sentenceFundamentalsSrc = `${EXTRA_LARGE_ICON_BASE_SRC}/comment-document.svg`

const quillPlusAiEduLogo = `${pageImgBaseSrc}/quill_logo_plus_ai_edu_logo.svg`

const GETTING_STARTED_COLLECTION_ID = 477
const INTEGRATING_QUILL_EVIDENCE_ARTICLE_ID = 666

const BUILDING_AI_KNOWLEDGE = `${window.location.pathname}/building-ai-knowledge`.replace('//', '/')

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
      <h1>Interdisciplinary Science</h1>
      <p>Over the next few years, Quill will building out Reading for Evidence activities aligned to high school science classrooms. Our first offering, Building AI Knowledge, features activities that introduce students to how AI will impact society over the next decade. In the future, we will build offerings around biology, earth sciences, and other science topics.<br /><br />In these Reading for Evidence activities, students read science-aligned texts, use what they’ve read to draft evidence-based claims, and receive AI-powered feedback to strengthen their writing. Process and growth are key: our responsive coaching guides students to revise until their sentences are clear, logical, and grounded in specific details from the text.<br /><br />Our Interdisciplinary Science work is meant to be used in either ELA or science classrooms. These activities are not meant to replace a textbook. Our activities provide a deep-dive into some of the most fascinating ideas in science.</p>
      <div className="course-cards">
        <div className="course-card">
          <img alt="" src={aiIconSrc} />
          <div>
            <h2>Building AI Knowledge</h2>
          </div>
          <a className="quill-button focus-on-light contained medium teal" href={BUILDING_AI_KNOWLEDGE}>View activities</a>
        </div>
      </div>
    </div>
  </header>
)

const summary = (
  <section className="summary-section">
    <div className="container">
      <h2>Build Content Knowledge & Writing Skills With Reading for Evidence</h2>
      <p>Written and reviewed by educators, each Quill Interdisciplinary Science activity highlights a science concept. Not only do these activities deepen students’ subject area learning and reinforce essential science content, they also provide support for:</p>
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

const partners = (
  <section className="partners container">
    <img alt="Quill logo plus AI Edu logo" src={quillPlusAiEduLogo} />
    <p>Quill has partnered with <a href="https://www.aiedu.org/" rel="noopener noreferrer" target="_blank">aiEDU</a> to curate activities from their site that work well with Quill Building AI Knowledge activities. On the course landing page, each each Reading for Evidence activity includes a suggested paired aiEDU activity, which range from 5-minute warm-up activities to 3-4 hour student-led activities. These activities can be used to preview new content, reinforce prior knowledge, provide additional context, or, when used in conjunction with the Quill activity, serve as part of a text set to support extended writing practice. Whether used on their own or in conjunction with aiEDU activities, these resources are a valuable addition to any high school ELA or Computer Science classroom.</p>
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
        <a className="quill-button focus-on-dark outlined teal large" href="/evidence/#/play?anonymous=true&uid=442" rel="noopener noreferrer" target="_blank" >Try a sample activity</a>
        <a className="quill-button focus-on-dark outlined teal large" href={BUILDING_AI_KNOWLEDGE}>View Building AI Knowledge activities</a>
      </div>
    </div>
  </section>
)

const InterdisciplinaryScienceSubjectPage = ({}) => {
  return (
    <div className="interdisciplinary-science-subject-page subject-page">
      {overview}
      {summary}
      {partners}
      <QuestionsAndAnswers questionsAndAnswersFile="interdisciplinaryScience" supportLink={null} />
      {teacherCenterArticles}
      {tryItOutForYourself}
    </div>
  )
}

export default InterdisciplinaryScienceSubjectPage
