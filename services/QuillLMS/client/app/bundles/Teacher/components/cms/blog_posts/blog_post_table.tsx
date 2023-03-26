import * as React from 'react';

import { blogPostRows, saveOrderButton, tableHeaders } from './shared';

import { DataTable } from '../../../../Shared/index';

const BlogPostTable = ({
  blogPosts,
  handleClickStar,
  updateOrder,
  featuredBlogPostLimitReached,
  saveOrder,
  topic,
}) => {
  const [orderHasChanged, setOrderHasChanged] = React.useState(false)

  function orderBlogPosts() {
    return blogPosts.sort((bp1, bp2) => bp1.order_number - bp2.order_number)
  }

  function handleOrderChange(sortInfo) {
    setOrderHasChanged(true)
    updateOrder(sortInfo)
  }

  function handleSaveOrderClick() { saveOrder(topic, orderBlogPosts())}

  const rows = blogPostRows(orderBlogPosts(), handleClickStar, featuredBlogPostLimitReached)

  return (
    <section >
      <div className="section-header">
        <h2>{topic}</h2>
        {saveOrderButton(orderHasChanged, handleSaveOrderClick)}
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

export default BlogPostTable
