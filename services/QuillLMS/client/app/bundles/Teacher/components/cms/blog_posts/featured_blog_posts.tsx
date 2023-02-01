import * as React from 'react';

import { tableHeaders, blogPostRows, } from './shared'

import { DataTable, } from '../../../../Shared/index'

const FeaturedBlogPosts = ({
  featuredBlogPosts,
  handleClickStar,
  updateOrder,
  saveOrder,
}) => {
  const [orderHasChanged, setOrderHasChanged] = React.useState(false)

  function handleOrderChange(sortInfo) {
    setOrderHasChanged(true)
    updateOrder(sortInfo)
  }

  const rows = blogPostRows(featuredBlogPosts.sort((bp1, bp2) => bp1.featured_order_number - bp2.featured_order_number), handleClickStar, false)

  let saveOrderButton = (<button className="quill-button fun contained primary focus-on-light disabled" disabled type="button">Save Order</button>)

  if (orderHasChanged) {
    saveOrderButton = (<button className="quill-button fun contained primary focus-on-light" onClick={saveOrder} type="button">Save Order</button>)
  }

  return (
    <section className="featured-blog-posts">
      <div className="section-header">
        <h2>Featured</h2>
        {saveOrderButton}
      </div>
      <div className="explanation">
        <p>Posts that display in the overview page of the teacher dashboard</p>
        <p>Drag and drop to rearrange featured posts</p>
        <p>Un-star a post to add a new featured post</p>
      </div>
      <DataTable
        headers={tableHeaders}
        isReorderable={true}
        reorderCallback={handleOrderChange}
        rows={rows}
      />
    </section>
  )
}

export default FeaturedBlogPosts
