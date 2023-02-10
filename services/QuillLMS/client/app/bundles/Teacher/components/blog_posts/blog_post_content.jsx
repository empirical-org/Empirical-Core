import * as React from 'react'
import moment from 'moment';
import ReactMarkdown from 'react-markdown';

export default class BlogPostContent extends React.Component {
  renderBodyOrPaywall() {
    const { body, displayPaywall, } = this.props
    if(displayPaywall) {
      return (
        <div id='quill-article-paywall'>
          <h2>This article is only for Premium users.</h2>
          <p>Quill Premium users have access to a slew of awesome features, including premium reports, priority support, and enhanced professional development opportunities.</p>
          <a href='/premium'>Try Quill Premium <i className='fas fa-star' /></a>
        </div>
      );
    } else {
      return <ReactMarkdown escapeHtml={false} source={body} />;
      return <ReactMarkdown escapeHtml={false} source={body.replace(/\n/g, '<br/>').replace(/><br\/>/g, '>\n').replace(/<br\/></g, '\n<')} />;
    }
  }

  renderName = () => {
    const { author, } = this.props
    return author ? <p className='author'>By {author.name}</p> : null
  };

  render() {
    const { centerImages, title, updatedAt, } = this.props
    const className = centerImages ? 'center-images' : ''
    return(
      <div className={className}>
        <header>
          <h1>{title}</h1>
          <p className='date'>{moment(updatedAt).format('MMMM Do, YYYY')}</p>
          {this.renderName()}
        </header>
        <main>
          {this.renderBodyOrPaywall()}
        </main>
      </div>
    )
  }
}
