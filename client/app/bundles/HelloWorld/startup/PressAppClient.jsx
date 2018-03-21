import React from 'react';
import PreviewCard from '../components/shared/preview_card.jsx';

export default (props) => {
  const blogPosts = props.blogPosts ? props.blogPosts.map(article =>
    <PreviewCard content={article.preview_card_content} link={`/teacher_resources/${article.slug}`} />
  ) : null
    return <div id="preview-card-container">
      {blogPosts}
    </div>

}
