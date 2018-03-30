import React from 'react';
import ReactTable from 'react-table';
import CreateOrEditBlogPost from '../components/cms/blog_posts/create_or_edit_blog_post.jsx';
import BlogPostTable from '../components/cms/blog_posts/blog_post_table.jsx';
import BlogPostIndex from '../components/blog_posts/blog_post_index.jsx';
import BlogPost from '../components/blog_posts/blog_post.jsx';
import request from 'request';
import moment from 'moment';

export default class BlogPosts extends React.Component {
  constructor(props) {
    super(props)

    this.renderBlogPostsByTopic = this.renderBlogPostsByTopic.bind(this)
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
        return <BlogPostTable
          topic={t}
          blogPosts={filteredBlogPosts}
        />
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
