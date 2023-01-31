import React from 'react';
import moment from 'moment'

import { tableHeaders, } from './shared'

import { DataTable, } from '../../../../Shared/index'

const FeaturedBlogPosts = ({
  featuredBlogPosts,
  handleClickStar,
  updateOrder,
  saveOrder,
}) => {
  const blogPostRows = featuredBlogPosts.sort((bp1, bp2) => bp1.featured_order_number - bp2.featured_order_number).map(blogPost => {
    const { created_at, id, external_link, slug, rating, title, updated_at, read_count, } = blogPost

    const handleClick = () => handleClickStar(id)

    const blogPostRow = {
      createdAt: moment(created_at).format('MM/DD/YY'),
      updatedAt: moment(updated_at).format('MM/DD/YY'),
      id,
      rating,
      title,
      views: read_count,
      actions: (
        <React.Fragment>
          <a className="quill-button fun outlined secondary focus-on-light" href={`/cms/blog_posts/${id}/edit`}>Edit</a>
          <a className="quill-button fun outlined secondary focus-on-light" href={external_link || `/teacher-center/${slug}`}>Preview</a>
          <a className="quill-button fun outlined secondary focus-on-light" href={`/cms/blog_posts/${id}/delete`}>Delete</a>
        </React.Fragment>
      ),
      featured: (
        <button className="interactive-wrapper" onClick={handleClick} type="button">
          <i className="fas fa-star" />
        </button>
      )
    }
    return blogPostRow
  })

  return (
    <section className="featured-blog-posts">
      <div className="section-header">
        <h2>Featured</h2>
        <button className="quill-button fun contained primary focus-on-light" onClick={saveOrder} type="button">Save Order</button>
      </div>
      <div className="explanation">
        <p>Posts that display in the overview page of the teacher dashboard</p>
        <p>Drag and drop to rearrange featured posts</p>
        <p>Un-star a post to add a new featured post</p>
      </div>
      <DataTable
        headers={tableHeaders}
        isReorderable={true}
        reorderCallback={updateOrder}
        rows={blogPostRows}
      />
    </section>
  )
}

export default FeaturedBlogPosts
