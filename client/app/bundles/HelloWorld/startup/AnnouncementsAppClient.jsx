import React from 'react';
import PreviewCard from '../components/shared/preview_card.jsx';

export default (props) => {
  const blogPosts = props.blogPosts ? props.blogPosts.map(article =>
    <PreviewCard content={article.preview_card_content} link={`/teacher_resources/${article.slug}`} />
  ) : null
    return <div className="announcements-page">
      <div className="header-section">
        <div className="text">
          <h1>Announcements</h1>
          <p>See what's new with Quill</p>
        </div>
        <form className='width-422' action={`${process.env.DEFAULT_URL}/teacher_resources/search`}>
        <input type='text' placeholder='Search for posts' name='query'/>
      </form>
      </div>
      <div id="preview-card-container">
        {blogPosts}
      </div>
    </div>

}
