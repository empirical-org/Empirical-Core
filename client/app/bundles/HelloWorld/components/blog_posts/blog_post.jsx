import React from 'react';
import moment from 'moment';
import PreviewCard from '../shared/preview_card.jsx';
import ReactMarkdown from 'react-markdown';

export default class BlogPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backLink: this.props.blogPost.topic.toLowerCase().replace(/\s/g, '-')
    }
  }

  renderMostRecentPosts() {
    return this.props.mostRecentPosts.map(post =>
      <PreviewCard key={post.title} content={post.preview_card_content} link={`/teacher_resources/${post.slug}`} />
    )
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
            <ReactMarkdown source={this.props.blogPost.body} />
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
