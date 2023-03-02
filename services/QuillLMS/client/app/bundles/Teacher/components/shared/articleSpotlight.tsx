import * as React from 'react';
import ReactMarkdown from 'react-markdown';

export const ArticleSpotlight = ({ author, blogPost }) => {

  if(!blogPost) { return }

  const { title, body, slug } = blogPost;
  const teacherCenterBaseUrl = `${process.env.DEFAULT_URL}/teacher-center`

  return(
    <div className="article-spotlight-container">
      <div className="inner-container">
        <div className="upper-section">
          <section className="header-section">
            <h3>Helpful Article</h3>
            <p>Want more guidance with your implementation of Quill? Check out these articles written by Quill&apos;s instructional coaches and curriculum team.</p>
          </section>
          <a className="quill-button contained primary fun" href={teacherCenterBaseUrl} rel="noopener noreferrer" target="_blank">Show more</a>
        </div>
        <section className="content-section">
          <h4>{title}</h4>
          <ReactMarkdown className="preview-card" source={body} />
          <section className="footer-section">
            {author && <p className="author">{`By ${author}`}</p>}
            <a className="quill-button contained primary fun" href={`${teacherCenterBaseUrl}/${slug}`} rel="noopener noreferrer" target="_blank">Read</a>
          </section>
        </section>
      </div>
    </div>
  )
}

export default ArticleSpotlight;
