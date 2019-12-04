import * as React from 'react';
import request from 'request';

import PreviewCard from '../shared/preview_card.jsx';
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
      (<PreviewCard
        content={post.preview_card_content}
        externalLink={!!post.external_link}
        key={post.title}
        link={post.external_link ? post.external_link : `/teacher-center/${post.slug}`}
      />)
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
      url: "https://quill-lms-sprint-docker.herokuapp.com/rate_blog_post",
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
          <BlogPostContent
            author={this.props.author}
            body={this.props.blogPost.body}
            centerImages={this.props.blogPost.center_images}
            displayPaywall={this.props.displayPaywall}
            title={this.props.blogPost.title}
            updatedAt={this.props.blogPost.published_at ? this.props.blogPost.published_at : this.props.blogPost.updated_at}
          />
          <footer>
            <p>{this.state.ratingMessage}</p>
            {this.renderRatingEmoji()}
          </footer>
        </article>
        <div id='similar-posts'>
          <div id='similar-post-container'>
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
