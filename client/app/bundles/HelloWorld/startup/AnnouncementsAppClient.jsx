import React from 'react';
import PreviewCard from '../components/shared/preview_card.jsx';

export default (props) => {
  const content = props.blogPosts.length > 0 ? props.blogPosts.map(article =>
    <PreviewCard content={article.preview_card_content} link={`/teacher_resources/${article.slug}`} />
  ) : <div style={{fontSize: '30px', display: 'flex', justifyContent: 'center', height: '60vh', alignItems: 'center', flexDirection: 'column', fontWeight: 'bold'}}>
        Coming Soon!
        <img style={{marginTop: '20px'}} src="https://assets.quill.org/images/illustrations/empty-state-premium-reports.svg"/>
      </div>

    return <div className="announcements-page">
      <div className="header-section">
        <div className="text">
          <h1>Announcements</h1>
          <p>See what's new with Quill</p>
        </div>
        <form className='width-422' action={`${process.env.DEFAULT_URL}/teacher_resources/search`}>
          <input type='text' placeholder='Search for posts' name='query'/>
          <i className="fa fa-icon fa-search"/>
        </form>
      </div>
      <div id="preview-card-container">
        {content}
      </div>
    </div>

}
