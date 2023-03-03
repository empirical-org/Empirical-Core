import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { requestGet } from '../../../../modules/request';

export const ArticleSpotlight = ({ blogPostId }) => {
  const [blogPost, setBlogPost] = React.useState(null);
  const [blogPostAuthor, setBlogPostAuthor] = React.useState(null);

  React.useEffect(() => {
    getBlogPost(blogPostId)
  }, [])

  function getBlogPost(id) {
    requestGet(`/featured_blog_post/${id}`,
      (data) => {
        if(data.blog_post && data.author) {
          const { blog_post, author } = data;
          setBlogPost(blog_post)
          setBlogPostAuthor(author)
        }
      }
    )
  }

  if(!blogPost) { return <span /> }

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
            {blogPostAuthor && <p className="author">{`By ${blogPostAuthor}`}</p>}
            <a className="quill-button contained primary fun" href={`${teacherCenterBaseUrl}/${slug}`} rel="noopener noreferrer" target="_blank">Read</a>
          </section>
        </section>
      </div>
    </div>
  )
}

export default ArticleSpotlight;
