import * as React from 'react';

import PreviewCard from './preview_card.jsx';

import { requestGet } from '../../../../modules/request';


interface ArticleSpotlightProps {
  backgroundColor?: string,
  blogPostId: string
}

export const ArticleSpotlight = ({ backgroundColor, blogPostId } : ArticleSpotlightProps ) => {
  const [blogPost, setBlogPost] = React.useState(null);

  React.useEffect(() => {
    getBlogPost(blogPostId)
  }, [])

  function getBlogPost(id: string) {
    requestGet(`/featured_blog_post/${id}`,
    (data) => {
        if(data.blog_post) {
          const { blog_post} = data;
          setBlogPost(blog_post)
        }
      }
    )
  }

  if(!blogPost) { return <span /> }

  const { title, slug, preview_card_content, external_link } = blogPost;
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
        <PreviewCard
          content={preview_card_content}
          externalLink={!!external_link}
          key={title}
          link={external_link ? external_link : `/teacher-center/${slug}`}
        />
      </div>
    </div>
  )
}

export default ArticleSpotlight;
