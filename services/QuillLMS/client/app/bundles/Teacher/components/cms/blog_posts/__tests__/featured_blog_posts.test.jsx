import * as React from 'react';
import { mount } from 'enzyme';

import { blogPosts, topics, } from './data'

import FeaturedBlogPosts from '../featured_blog_posts';

const props = {
  featuredBlogPosts: blogPosts,
  handleClickStar: jest.fn(),
  updateOrder: jest.fn(),
  saveOrder: jest.fn(),
}

describe('FeaturedBlogPosts component', () => {
  it('renders', () => {
    const wrapper = mount(<FeaturedBlogPosts {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

})
