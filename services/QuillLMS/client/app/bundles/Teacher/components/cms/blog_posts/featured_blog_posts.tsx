import React from 'react';

import { SortableList, } from '../../../../Shared/index'

const featuredBlogPost = (blogPost, handleClickStar) => {
  const handleClick = () => handleClickStar(blogPost.id)
  return (
    <div className="featured-blog-post" key={blogPost.id}>
      <div className="featured-blog-post-header">
        <p className="title">{blogPost.title}</p>
        <button className="interactive-wrapper" onClick={handleClick} type="button">
          <i className="fas fa-star" />
        </button>
      </div>
      <p>{blogPost.topic}</p>
    </div>
  )
}

const FeaturedBlogPosts = ({
  featuredBlogPosts,
  handleClickSaveOrder,
  handleClickStar,
  updateOrder
}) => {
  const sortedBlogPosts = featuredBlogPosts.sort((bp1, bp2) => bp1.featured_order_number - bp2.featured_order_number)
  const blogPostCards = sortedBlogPosts.map(bp => featuredBlogPost(bp, handleClickStar))
  return (
    <div className="featured-blog-posts">
      <h2>Featured <button className="save-order interactive-wrapper" onClick={handleClickSaveOrder} type="button">Save Order</button></h2>
      <div className="explanation">
        <p>Posts that display in the overview page of the teacher dashboard</p>
        <ul>
          <li>Drag and drop to rearrange featured posts</li>
          <li>Un-star a post to add a new featured post</li>
        </ul>
      </div>
      <SortableList axis="x" data={blogPostCards} sortCallback={updateOrder} />
    </div>
  )
}

export default FeaturedBlogPosts
