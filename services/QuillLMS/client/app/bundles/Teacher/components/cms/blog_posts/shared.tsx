import * as moment from 'moment';
import * as React from 'react';

export const tableHeaders = [
  {
    name: 'Featured',
    attribute: 'featured',
    width: '50px',
    rowSectionClassName: 'featured-section',
    noTooltip: true
  },
  {
    name: 'Title',
    attribute: 'title',
    width: '400px',
  },
  {
    name: 'Created',
    attribute: 'createdAt',
    width: '60px',
  },
  {
    name: 'Updated',
    attribute: 'updatedAt',
    width: '60px',
  },
  {
    name: 'Rating',
    attribute: 'rating',
    width: '50px',
    rowSectionClassName: 'left-align'
  },
  {
    name: 'Views',
    attribute: 'views',
    width: '50px',
    rowSectionClassName: 'left-align'
  },
  {
    name: 'Actions',
    attribute: 'actions',
    width: '296px',
    rowSectionClassName: 'actions-section',
    noTooltip: true
  },
]

const featuredCellContent = ({ featuredOrderNumber, featuredBlogPostLimitReached, handleClickStar, draft, }) => {
  if (draft) { return 'DRAFT' }
  if (featuredBlogPostLimitReached && featuredOrderNumber === null) { return <i className="far fa-star disabled" /> }

  const star = featuredOrderNumber === null ? <i className="far fa-star" /> : <i className="fas fa-star" />
  return <button className="interactive-wrapper" onClick={handleClickStar} type="button">{star}</button>
}

export const blogPostRows = (blogPosts, handleClickStar, featuredBlogPostLimitReached) => {
  return blogPosts.map(blogPost => {
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
}

export const saveOrderButton = (orderHasChanged, saveOrder) => {
  let button = (<button className="quill-button fun contained primary focus-on-light disabled" disabled type="button">Save Order</button>)

  if (orderHasChanged) {
    button = (<button className="quill-button fun contained primary focus-on-light" onClick={saveOrder} type="button">Save Order</button>)
  }

  return button
}
