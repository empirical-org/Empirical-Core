import React from 'react';
import ReactTable from 'react-table';
import CreateOrEditBlogPost from '../components/cms/blog_posts/create_or_edit_blog_post.jsx';
import BlogPostIndex from '../components/blog_posts/blog_post_index.jsx';
import BlogPost from '../components/blog_posts/blog_post.jsx';
import request from 'request';
import moment from 'moment';

export default class BlogPosts extends React.Component {
  constructor(props) {
    super(props)

    this.renderBlogPostsByTopic = this.renderBlogPostsByTopic.bind(this)
  }

  columns() {
    return ([
      {
        Header: '',
        accessor: 'draft',
        width: 75,
        Cell: props => <span>{props.value ? 'DRAFT' : ''}</span>,
      },
      {
        Header: 'Title',
        accessor: 'title',
      }, {
        Header: 'Topic',
        accessor: 'topic',
      }, {
        Header: 'Created',
        accessor: 'created_at',
        width: 115,
        Cell: props => <span>{moment(props.value).format('MM-DD-YY')}</span>,
      }, {
        Header: 'Updated',
        accessor: 'updated_at',
        width: 115,
        Cell: props => <span>{moment(props.value).format('MM-DD-YY')}</span>,
      }, {
        Header: 'Rating',
        accessor: 'rating',
        width: 75
      }, {
        Header: '',
        accessor: 'id',
        sortable: false,
        width: 75,
        Cell: props => <a className="button" href={`/cms/blog_posts/${props.value}/edit`}>Edit</a>,
      }, {
        Header: '',
        accessor: 'slug',
        sortable: false,
        width: 75,
        Cell: props => <a className="button" href={`/teacher_resources/${props.value}`}>Preview</a>,
      }, {
        Header: '',
        accessor: 'id',
        sortable: false,
        width: 75,
        Cell: props => <a className="button" onClick={this.confirmDelete} href={`/cms/blog_posts/${props.value}/delete`}>Delete</a>,
      }
    ]);
  }

  confirmDelete(e) {
    if(window.prompt('To delete this post, please type DELETE.') !== 'DELETE') {
      e.preventDefault();
    }
  }

  renderBlogPostsByTopic() {
    const tables = this.props.topics.map(t => {
      const filteredBlogPosts = this.props.blogPosts.filter(bp => bp.topic === t)
      if (filteredBlogPosts.length > 0) {
        return <div>
          <h1>{t}</h1>
          <ReactTable
            data={filteredBlogPosts}
            columns={this.columns()}
            showPagination={false}
            showPaginationTop={false}
            showPaginationBottom={false}
            showPageSizeOptions={false}
            defaultPageSize={filteredBlogPosts ? filteredBlogPosts.length : 0}
          />
        </div>
      }
    }
    )
    return tables
  }

  render() {
    if (['new', 'edit'].includes(this.props.action)) {
      return <CreateOrEditBlogPost {...this.props} />;
    } else if (this.props.route === 'show') {
      return <BlogPost {...this.props} />;
    } else if (this.props.route === 'index') {
      return <BlogPostIndex {...this.props} />;
    }
    return (
      <div className="cms-blog-posts">
        <a href="/cms/blog_posts/new" className="btn button-green">New Blog Post</a>
        <br /><br />
        {this.renderBlogPostsByTopic()}
      </div>
    );
  }

};
