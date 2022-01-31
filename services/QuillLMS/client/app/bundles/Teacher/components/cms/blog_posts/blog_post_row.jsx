import React from 'react'

const featuredCellContent = ({ featuredOrderNumber, featuredBlogPostLimitReached, handleClickStar, draft, }) => {
  if (draft) { return 'DRAFT' }
  if (featuredBlogPostLimitReached && featuredOrderNumber === null) { return }

  const star = featuredOrderNumber === null ? <i className="far fa-star" /> : <i className="fas fa-star" />
  return <button className="interactive-wrapper" onClick={handleClickStar} type="button">{star}</button>
}


const BlogPostRow = ({
  id,
  draft,
  featuredOrderNumber,
  title,
  topic,
  createdAt,
  updatedAt,
  rating,
  views,
  editLink,
  previewLink,
  deleteLink,
  onClickStar,
  featuredBlogPostLimitReached,
}) => {
  const handleClickStar = () => onClickStar(id)

  return (
    <tr className="blog-post-row">
      <td>{featuredCellContent({ featuredOrderNumber, featuredBlogPostLimitReached, handleClickStar, draft, })}</td>
      <td>{title}</td>
      <td>{topic}</td>
      <td>{createdAt}</td>
      <td>{updatedAt}</td>
      <td>{rating}</td>
      <td>{views}</td>
      <td><a className="button" href={editLink}>Edit</a></td>
      <td><a className="button" href={previewLink}>Preview</a></td>
      <td><a className="button" href={deleteLink}>Delete</a></td>
    </tr>
  )
}

export default BlogPostRow
