import React from 'react';
import request from 'request';
import moment from 'moment';

import BlogPostRow from './blog_post_row.jsx';

import { SortableList, } from  '../../../../Shared/index'
import getAuthToken from '../../modules/get_auth_token';

export default class BlogPostTable extends React.Component {
  confirmDelete(e) {
    if(window.prompt('To delete this post, please type DELETE.') !== 'DELETE') {
      e.preventDefault();
    }
  }

  renderTableHeader() {
    return (
      <tr>
        <th>Featured</th>
        <th>Title</th>
        <th>Topic</th>
        <th>Created</th>
        <th>Updated</th>
        <th>Rating</th>
        <th>Views</th>
        <th />
        <th />
        <th />
      </tr>
    )
  }

  renderTableRow(blogPost, index) {
    const { handleClickStar, featuredBlogPostLimitReached, } = this.props
    const { created_at, id, draft, featured_order_number, external_link, slug, rating, title, topic, updated_at, read_count, } = blogPost
    return (
      <BlogPostRow
        createdAt={moment(created_at).format('MM-DD-YY')}
        deleteLink={`/cms/blog_posts/${id}/delete`}
        draft={draft}
        editLink={`/cms/blog_posts/${id}/edit`}
        featuredBlogPostLimitReached={featuredBlogPostLimitReached}
        featuredOrderNumber={featured_order_number}
        id={id}
        key={id}
        onClickStar={handleClickStar}
        previewLink={external_link || `/teacher-center/${slug}`}
        rating={rating}
        title={title}
        topic={topic}
        updatedAt={moment(updated_at).format('MM-DD-YY')}
        views={read_count}
      />
    )
  }

  orderedBlogPosts = () => {
    const { blogPosts, } = this.props
    return blogPosts.sort((bp1, bp2) => bp1.order_number - bp2.order_number)
  }

  handleClickSaveOrder = () => {
    const { topic, saveOrder, } = this.props
    saveOrder(topic, this.orderedBlogPosts())
  }

  render() {
    const { updateOrder, } = this.props
    const blogPostRows = this.orderedBlogPosts().map((bp, i) => this.renderTableRow(bp, i))
    return (
      <div>
        <h2>{this.props.topic} <span className="save-order" onClick={this.handleClickSaveOrder}>Save Order</span></h2>
        <div className="blog-post-table">
          <table>
            {this.renderTableHeader()}
            <SortableList data={blogPostRows} sortCallback={updateOrder} />
          </table>
        </div>
      </div>
    )
  }
};
