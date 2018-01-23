import React from 'react'
import ReactTable from 'react-table'

export default React.createClass({



  columns: function() {
    return ([
      {
        Header: 'Title',
        accessor: 'title'
      }, {
        Header: 'Edit',
        accessor: 'id',
        Cell: props => <a href={`/cms/blog_posts/${props.value}/edit`}>Edit</a>
      }
    ])
  },

  render: function() {
    if (['new', 'edit'].includes(this.props.action)) {
      alert('new or edit')
    }
    return (
      <div className="cms-blog-posts">
        <ReactTable
          data={this.props.blogPosts}
          columns={this.columns()}
          showPagination={false}
          showPaginationTop={false}
          showPaginationBottom={false}
          showPageSizeOptions={false}
          defaultPageSize={this.props.blogPosts ? this.props.blogPosts.length : 0}
          />
      </div>
    )
  }

});
