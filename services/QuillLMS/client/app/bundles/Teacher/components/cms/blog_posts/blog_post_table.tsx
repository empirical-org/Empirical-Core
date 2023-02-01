import * as React from 'react';
import * as moment from 'moment';

import { tableHeaders, blogPostRows, } from './shared'

import { DataTable, } from  '../../../../Shared/index'

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

  function handleClickSaveOrder() {
    saveOrder(topic, orderedBlogPosts())
  }

  function handleOrderChange(sortInfo) {
    setOrderHasChanged(true)
    updateOrder(sortInfo)
  }

  const rows = blogPostRows(orderBlogPosts(), handleClickStar, featuredBlogPostLimitReached)

  let saveOrderButton = (<button className="quill-button fun contained primary focus-on-light disabled" disabled type="button">Save Order</button>)

  if (orderHasChanged) {
    saveOrderButton = (<button className="quill-button fun contained primary focus-on-light" onClick={saveOrder} type="button">Save Order</button>)
  }

  return (
    <section >
      <div className="section-header">
        <h2>{topic}</h2>
        {saveOrderButton}
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
