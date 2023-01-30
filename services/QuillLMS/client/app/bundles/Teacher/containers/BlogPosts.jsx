import React from 'react';
import moment from 'moment';

import CreateOrEditBlogPost from '../components/cms/blog_posts/create_or_edit_blog_post.jsx';
import BlogPostTable from '../components/cms/blog_posts/blog_post_table.jsx';
import FeaturedBlogPosts from '../components/cms/blog_posts/featured_blog_posts.tsx'
import BlogPostIndex from '../components/blog_posts/blog_post_index.jsx';
import BlogPost from '../components/blog_posts/blog_post.jsx';
import getAuthToken from '../components/modules/get_auth_token';

const FEATURED_BLOG_POST_LIMIT = 5

export default class BlogPosts extends React.Component {
  constructor(props) {
    super(props)

    this.state = { blogPosts: props.blogPosts, }
  }

  confirmDelete(e) {
    if(window.prompt('To delete this post, please type DELETE.') !== 'DELETE') {
      e.preventDefault();
    }
  }

  featuredBlogPosts = () => {
    const { blogPosts, } = this.state
    return blogPosts.filter(bp => bp.featured_order_number !== null)
  }

  saveOrder = (topic, blogPosts, ) => {
    const link = `${process.env.DEFAULT_URL}/cms/blog_posts/update_order_numbers`
    const data = new FormData();
    data.append( "blog_posts", JSON.stringify(blogPosts) );
    fetch(link, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      body: data,
      headers: {
        'X-CSRF-Token': getAuthToken()
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      alert(`Order for ${topic} blog posts has been saved.`)
    }).catch((error) => {
      // to do, use Sentry to capture error
    })
  };

  saveFeaturedOrder = () => {
    const link = `${process.env.DEFAULT_URL}/cms/blog_posts/update_featured_order_numbers`
    const data = new FormData();
    data.append( "blog_posts", JSON.stringify(this.featuredBlogPosts()) );
    fetch(link, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      body: data,
      headers: {
        'X-CSRF-Token': getAuthToken()
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      alert(`Order for featured blog posts has been saved.`)
    }).catch((error) => {
      // to do, use Sentry to capture error
    })
  };

  updateOrderNumber = (sortInfo) => this.updateOrder(sortInfo, 'order_number')

  updateFeaturedOrderNumber = (sortInfo) => this.updateOrder(sortInfo, 'featured_order_number', this.saveFeaturedOrder)

  updateOrder = (sortInfo, orderAttribute, callback) => {
    const { blogPosts, } = this.state
    const newOrder = sortInfo.map(item => item.key);
    const newOrderedBlogPosts = blogPosts.map((bp, i) => {
      const newBlogPost = bp
      const newIndex = newOrder.findIndex(key => Number(key) === Number(bp.id))
      if (newIndex !== -1) {
        newBlogPost[orderAttribute] = newIndex
      }
      return newBlogPost
    })
    this.setState({blogPosts: newOrderedBlogPosts}, () => {
      if (callback) { callback() }
    });
  };

  onClickStar = (blogPostId) => {
    const { blogPosts, } = this.state
    const blogPost = blogPosts.find(bp => bp.id === blogPostId)
    const featuredOrderNumber = blogPost.featured_order_number === null ? this.featuredBlogPosts().length : null
    const link = `${process.env.DEFAULT_URL}/cms/blog_posts/${blogPostId}`
    const data = { blog_post: { featured_order_number: featuredOrderNumber, } }
    fetch(link, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(data),
      headers: {
        'X-CSRF-Token': getAuthToken(),
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      const indexOfUpdatedBlogpost = blogPosts.findIndex(bp => bp.id === response.id)
      blogPosts[indexOfUpdatedBlogpost].featured_order_number = response.featured_order_number
      this.setState({ blogPosts, })
    }).catch((error) => {
      // to do, use Sentry to capture error
    })
  }

  renderBlogPostsByTopic = () => {
    const { topics, studentTopics, } = this.props
    const { blogPosts, } = this.state
    const allTopics = topics.concat(studentTopics)
    const tables = allTopics.map(t => {
      const filteredBlogPosts = blogPosts.filter(bp => bp.topic === t)
      if (filteredBlogPosts.length > 0) {
        return (
          <BlogPostTable
            blogPosts={filteredBlogPosts}
            featuredBlogPostLimitReached={this.featuredBlogPosts().length >= FEATURED_BLOG_POST_LIMIT}
            handleClickStar={this.onClickStar}
            saveOrder={this.saveOrder}
            topic={t}
            updateOrder={this.updateOrderNumber}
          />
        )
      }
    }
    )
    return tables
  };

  render() {
    const { action, route, } = this.props
    if (['new', 'edit'].includes(action)) {
      return <CreateOrEditBlogPost {...this.props} />;
    } else if (route === 'show') {
      return <BlogPost {...this.props} />;
    } else if (route === 'index') {
      return <BlogPostIndex {...this.props} />;
    }
    return (
      <div className="cms-blog-posts">
        <header>
          <h1>Teacher Center</h1>
          <a className="quill-button medium primary contained" href="/cms/blog_posts/new">Add a post</a>
        </header>
        <FeaturedBlogPosts
          featuredBlogPosts={this.featuredBlogPosts()}
          handleClickStar={this.onClickStar}
          updateOrder={this.updateFeaturedOrderNumber}
        />
        {this.renderBlogPostsByTopic()}
      </div>
    );
  }
};
