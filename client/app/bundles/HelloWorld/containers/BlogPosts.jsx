import React from 'react'
import ReactTable from 'react-table'
import CreateOrEditBlogPost from '../components/cms/blog_posts/create_or_edit_blog_post.jsx'
import request from 'request'
import moment from 'moment'

export default React.createClass({

  columns: function() {
    return ([
      {
        Header: 'Title',
        accessor: 'title'
      }, {
        Header: 'Created',
        accessor: 'created_at',
        Cell: props => <span>{moment(props.value).format('MM-DD-YY')}</span>
      }, {
        Header: 'Updated',
        accessor: 'updated_at',
        Cell: props => <span>{moment(props.value).format('MM-DD-YY')}</span>
      }, {
        Header: 'Topic',
        accessor: 'topic'
      }, {
        Header: '',
        accessor: 'id',
        Cell: props => <a className= 'button' href={`/cms/blog_posts/${props.value}/edit`}>Edit</a>
      }, {
        Header: '',
        accessor: 'id',
        Cell: props => <a className='button' href={`/cms/blog_posts/${props.value}/delete`}>Delete</a>
      }
    ])
  },

  render: function() {
    if (['new', 'edit'].includes(this.props.action)) {
      return <CreateOrEditBlogPost {...this.props}/>
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
