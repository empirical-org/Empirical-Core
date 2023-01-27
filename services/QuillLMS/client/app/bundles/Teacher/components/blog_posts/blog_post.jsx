import * as React from 'react';

import BlogPostContent from './blog_post_content'
import {
  TEACHER_CENTER_SLUG,
  BLOG_POST_TO_COLOR,
} from './blog_post_constants'

import PreviewCard from '../shared/preview_card.jsx';
import { requestPost, } from '../../../../modules/request/index'

const RATING_MESSAGES = {
  instructions: 'Was this article helpful?',
  success: 'Thanks for rating!',
  sign_up: 'Please sign up to rate.'
}

export default class BlogPost extends React.Component {
  constructor(props) {
    super(props);

    const { blogPost, displayPaywall, } = props

    this.state = {
      backLink: blogPost.topic.toLowerCase().replace(/\s/g, '_'),
      ratingMessage: displayPaywall ? '' : RATING_MESSAGES['instructions']
    }
  }

  selectRatingEmoji(rating) {
    const { blogPost, } = this.props

    requestPost(
      `${process.env.DEFAULT_URL}/rate_blog_post`,
      {
        rating: rating,
        blog_post_id: blogPost.id
      },
      (body) => {
        this.setState({ ratingMessage: RATING_MESSAGES['success'] })
      },
      (body) => {
        this.setState({ ratingMessage: RATING_MESSAGES['sign_up'] })
      }
    )
  }

  renderMostRecentPosts() {
    const { mostRecentPosts, } = this.props

    return mostRecentPosts.map(post =>
      (<PreviewCard
        color={BLOG_POST_TO_COLOR[post.topic]}
        content={post.preview_card_content}
        externalLink={!!post.external_link}
        key={post.title}
        link={post.external_link ? post.external_link : `/teacher-center/${post.slug}`}
      />)
    )
  }

  renderRatingEmoji() {
    const { ratingMessage, } = this.state

    if(ratingMessage === RATING_MESSAGES['instructions']) {
      return (
        <ul>
          <li><button className="interactive-wrapper focus-on-light" onClick={() => {this.selectRatingEmoji(0)}} type="button"><span aria-label="Sad face emoji" role="img">😞</span></button></li>
          <li><button className="interactive-wrapper focus-on-light" onClick={() => {this.selectRatingEmoji(1)}} type="button"><span aria-label="Neutral face emoji" role="img">😐</span></button></li>
          <li><button className="interactive-wrapper focus-on-light" onClick={() => {this.selectRatingEmoji(2)}} type="button"><span aria-label="Happy face emoji" role="img">😃</span></button></li>
        </ul>
      )
    }
  }

  render() {
    const { ratingMessage, } = this.state
    const { author, blogPost, displayPaywall, } = this.props

    return (
      <div id='article-container'>
        <article>
          <BlogPostContent
            author={author}
            body={blogPost.body}
            centerImages={blogPost.center_images}
            displayPaywall={displayPaywall}
            title={blogPost.title}
            updatedAt={blogPost.published_at ? blogPost.published_at : blogPost.updated_at}
          />
          <footer>
            <p>{ratingMessage}</p>
            {this.renderRatingEmoji()}
          </footer>
        </article>
        <div id='similar-posts'>
          <div id='similar-post-container'>
            <h2>
              <span>Teacher Center Articles</span>
              <a className="quill-button contained primary fun focus-on-light" href={`/${TEACHER_CENTER_SLUG}`}>Show more</a>
            </h2>
            <div id='preview-card-container'>
              {this.renderMostRecentPosts()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
