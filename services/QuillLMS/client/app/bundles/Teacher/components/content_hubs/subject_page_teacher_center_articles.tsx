import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import PreviewCard from '../shared/preview_card.jsx';
import { requestGet } from '../../../../modules/request';

const GETTING_STARTED_COLLECTION_ID = 477
const INTEGRATING_QUILL_EVIDENCE_ARTICLE_ID = 666

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

const SubjectPageTeacherCenterArticles = () => (
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

export default SubjectPageTeacherCenterArticles
