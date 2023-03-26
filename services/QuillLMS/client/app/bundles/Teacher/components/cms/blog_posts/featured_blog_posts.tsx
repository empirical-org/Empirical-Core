import * as React from 'react';

import { blogPostRows, saveOrderButton, tableHeaders } from './shared';

import { DataTable } from '../../../../Shared/index';

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

  return (
    <section className="featured-blog-posts">
      <div className="section-header">
        <h2>Featured</h2>
        {saveOrderButton(orderHasChanged, saveOrder)}
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
