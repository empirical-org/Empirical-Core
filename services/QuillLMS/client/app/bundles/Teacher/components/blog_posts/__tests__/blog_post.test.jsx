import { mount } from 'enzyme';
import * as React from 'react';

import { author, blogPosts, blogPostWithBody } from './data';

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
