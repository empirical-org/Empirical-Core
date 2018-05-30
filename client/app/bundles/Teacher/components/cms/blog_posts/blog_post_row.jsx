import React from 'react'

const BlogPostRow = props => {
  return (<tr className="blog-post-row">
    <td>{props.draft}</td>
    <td>{props.title}</td>
    <td>{props.topic}</td>
    <td>{props.createdAt}</td>
    <td>{props.updatedAt}</td>
    <td>{props.rating}</td>
    <td>{props.views}</td>
    <td><a className="button" href={props.editLink}>Edit</a></td>
    <td><a className="button" href={props.previewLink}>Preview</a></td>
    <td><a className="button" href={props.deleteLink}>Delete</a></td>
  </tr>)
}

export default BlogPostRow
