import React from 'react';
import moment from 'moment';

import { tableHeaders, } from './shared'

import { DataTable, } from  '../../../../Shared/index'

const featuredCellContent = ({ featuredOrderNumber, featuredBlogPostLimitReached, handleClickStar, draft, }) => {
  if (draft) { return 'DRAFT' }
  if (featuredBlogPostLimitReached && featuredOrderNumber === null) { return }

  const star = featuredOrderNumber === null ? <i className="far fa-star" /> : <i className="fas fa-star" />
  return <button className="interactive-wrapper" onClick={handleClickStar} type="button">{star}</button>
}

const BlogPostTable = ({
  blogPosts,
  handleClickStar,
  updateOrder,
  featuredBlogPostLimitReached,
  saveOrder,
  topic,
}) => {
  function orderedBlogPosts() {
    return blogPosts.sort((bp1, bp2) => bp1.order_number - bp2.order_number)
  }

  function handleClickSaveOrder() {
    saveOrder(topic, orderedBlogPosts())
  }

  const blogPostRows = orderedBlogPosts().map(blogPost => {
    const { created_at, id, external_link, slug, rating, title, updated_at, read_count, draft, featured_order_number, } = blogPost

    function onClickStar() { handleClickStar(id) }

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
      featured: featuredCellContent({ featuredOrderNumber: featured_order_number, featuredBlogPostLimitReached, handleClickStar: onClickStar, draft, })
    }
    return blogPostRow
  })

  return (
    <section >
      <div className="section-header">
        <h2>{topic}</h2>
        <button className="quill-button fun contained primary focus-on-light" onClick={handleClickSaveOrder} type="button">Save Order</button>
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

export default BlogPostTable
