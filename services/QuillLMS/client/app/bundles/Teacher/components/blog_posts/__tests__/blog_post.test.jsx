import * as React from 'react';
import { mount } from 'enzyme';

import { blogPosts, blogPostWithBody, author, } from './data'

import BlogPost from '../blog_post';

const props = {
  relatedPosts: blogPosts,
  blogPost: blogPostWithBody,
  author
}

describe('BlogPost component', () => {
  it('renders', () => {
    const wrapper = mount(<BlogPost {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
