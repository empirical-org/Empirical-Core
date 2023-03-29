import * as React from 'react';
import ReactMarkdown from 'react-markdown'

import PreviewCard from './preview_card.jsx';

import { requestGet } from '../../../../modules/request';


interface ArticleSpotlightProps {
  backgroundColor?: string,
  blogPostId: string
}

export const ArticleSpotlight = ({ backgroundColor, blogPostId } : ArticleSpotlightProps ) => {
  const [blogPost, setBlogPost] = React.useState(null);
  const [blogPostAuthor, setBlogPostAuthor] = React.useState(null);

  React.useEffect(() => {
    getBlogPost(blogPostId)
  }, [])

  function getBlogPost(id: string) {
    requestGet(`/featured_blog_post/${id}`,
      (data) => {
        console.log("🚀 ~ file: articleSpotlight.tsx:33 ~ getBlogPost ~ data:", data)
        if(data.blog_post) {
          const { blog_post, author } = data;
          setBlogPost(blog_post)
          setBlogPostAuthor(author)
        }
      }
    )
  }

  function renderPreviewContent({ title, slug, preview_card_content, external_link, footer_content }) {
    if(footer_content) {
      return(
        <section className="content-section">
          <h4>{title}</h4>
          <ReactMarkdown className="preview-card" source={footer_content} />
          <section className="footer-section">
            {blogPostAuthor && <p className="author">{`By ${blogPostAuthor}`}</p>}
            <a className="quill-button contained primary fun" href={`${teacherCenterBaseUrl}/${slug}`} rel="noopener noreferrer" target="_blank">Read</a>
          </section>
        </section>
      )
    }
    return(
      <PreviewCard
        content={preview_card_content}
        externalLink={!!external_link}
        key={title}
        link={external_link ? external_link : `/teacher-center/${slug}`}
      />
    )
  }

  if(!blogPost) { return <span /> }

  const teacherCenterBaseUrl = `${process.env.DEFAULT_URL}/teacher-center`;
  const backgroundColorStyle = backgroundColor ? { backgroundColor: backgroundColor } : {};

  return(
    <div className="article-spotlight-container" style={backgroundColorStyle}>
      <div className="inner-container">
        <div className="upper-section">
          <section className="header-section">
            <h3>Helpful Article</h3>
            <p>Want more guidance with your implementation of Quill? Check out these articles written by Quill&apos;s instructional coaches and curriculum team.</p>
          </section>
          <a className="quill-button contained primary fun focus-on-light" href={teacherCenterBaseUrl} rel="noopener noreferrer" target="_blank">Show more</a>
        </div>
        {renderPreviewContent(blogPost)}
      </div>
    </div>
  )
}

export default ArticleSpotlight;
