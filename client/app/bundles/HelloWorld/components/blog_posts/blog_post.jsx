import React from 'react';
import PreviewCard from '../shared/preview_card.jsx';
import request from 'request';
import BlogPostContent from './blog_post_content'

const RATING_MESSAGES = {
  instructions: 'Was this article helpful?',
  success: 'Thanks for rating!',
  sign_up: 'Please sign up to rate.'
}

export default class BlogPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backLink: this.props.blogPost.topic.toLowerCase().replace(/\s/g, '_'),
      ratingMessage: this.props.displayPaywall ? '' : RATING_MESSAGES['instructions']
    }
  }

  renderMostRecentPosts() {
    return this.props.mostRecentPosts.map(post =>
      <PreviewCard key={post.title} content={post.preview_card_content} link={post.external_link ? post.external_link : `/teacher_resources/${post.slug}`} />
    )
  }

  renderRatingEmoji() {
    if(this.state.ratingMessage === RATING_MESSAGES['instructions']) {
      return (
        <ul>
          <li onClick={() => {this.selectRatingEmoji(0)}}>😞</li>
          <li onClick={() => {this.selectRatingEmoji(1)}}>😐</li>
          <li onClick={() => {this.selectRatingEmoji(2)}}>😃</li>
        </ul>
      )
    }
  }

  selectRatingEmoji(rating) {
    request.post({
      url: `${process.env.DEFAULT_URL}/rate_blog_post`,
      json: {
        authenticity_token: ReactOnRails.authenticityToken(),
        rating: rating,
        blog_post_id: this.props.blogPost.id
      }
    }, (error, httpStatus, body) => {
      if(httpStatus.statusCode === 200) {
        this.setState({ ratingMessage: RATING_MESSAGES['success'] })
      } else {
        this.setState({ ratingMessage: RATING_MESSAGES['sign_up'] })
      }
    });
  }

  render() {
    return (
      <div id='article-container'>
        <article>
          <a className='back-to-topic' href={`/teacher_resources/topic/${this.state.backLink}`}><i className='fa fa-chevron-left'></i>Back to {this.props.blogPost.topic}</a>
          <BlogPostContent
            updatedAt={this.props.blogPost.published_at ? this.props.blogPost.published_at : this.props.blogPost.updated_at}
            title={this.props.blogPost.title}
            body={this.props.blogPost.body}
            author={this.props.author}
            displayPaywall={this.props.displayPaywall}
            centerImages={this.props.blogPost.center_images}
          />
          <footer>
            <a className='back-to-topic' href={`/teacher_resources/topic/${this.state.backLink}`}><i className='fa fa-chevron-left'></i>Back to {this.props.blogPost.topic}</a>
            <p>{this.state.ratingMessage}</p>
            {this.renderRatingEmoji()}
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
