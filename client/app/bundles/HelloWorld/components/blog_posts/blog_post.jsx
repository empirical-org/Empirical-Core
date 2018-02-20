import React from 'react';
import moment from 'moment';
import PreviewCard from '../shared/preview_card.jsx';
import ReactMarkdown from 'react-markdown';

export default class BlogPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backLink: this.props.blogPost.topic.toLowerCase().replace(/\s/g, '_')
    }
  }

  renderMostRecentPosts() {
    return this.props.mostRecentPosts.map(post =>
      <PreviewCard key={post.title} content={post.preview_card_content} link={`/teacher_resources/${post.slug}`} />
    )
  }

  renderBodyOrPaywall() {
    if(this.props.displayPaywall) {
      return (
        <div id='quill-article-paywall'>
          <h2>This article is only for Premium users.</h2>
          <p>Quill Premium users have access to a slew of awesome features, including premium reports, priority support, and enhanced professional development opportunities.</p>
          <a href='/premium'>Try Quill Premium <i className='fa fa-star'></i></a>
        </div>
      );
    } else {
      return <ReactMarkdown source={this.props.blogPost.body} />;
    }
  }

  render() {
    return (
      <div id='article-container'>
        <article>
          <a className='back-to-topic' href={`/teacher_resources/topic/${this.state.backLink}`}><i className='fa fa-chevron-left'></i>Back to {this.props.blogPost.topic}</a>
          <header>
            <h1>{this.props.blogPost.title}</h1>
            <img src={this.props.author.avatar} />
            <p className='author'>{this.props.author.name}</p>
            <p className='date'>{moment(this.props.blogPost.updated_at).format('MMMM Do, YYYY')}</p>
          </header>
          <main>
            {this.renderBodyOrPaywall()}
          </main>
          <footer>
            <a className='back-to-topic' href={`/teacher_resources/topic/${this.state.backLink}`}><i className='fa fa-chevron-left'></i>Back to {this.props.blogPost.topic}</a>
          </footer>
        </article>
        <div id='similar-posts'>
          <div id='similiar-post-container'>
            <h2>Most Recent Posts</h2>
            <div id='preview-card-container'>
              {this.renderMostRecentPosts()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
