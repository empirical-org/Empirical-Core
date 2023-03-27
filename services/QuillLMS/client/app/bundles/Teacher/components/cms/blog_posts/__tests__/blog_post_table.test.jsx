import { mount } from 'enzyme';
import * as React from 'react';

import { blogPosts, topics } from './data';

import BlogPostTable from '../blog_post_table';

const props = {
  blogPosts,
  handleClickStar: jest.fn(),
  updateOrder: jest.fn(),
  featuredBlogPostLimitReached: false,
  saveOrder: jest.fn(),
  topic: topics[0].name,
}

describe('BlogPostTable component', () => {
  it('renders', () => {
    const wrapper = mount(<BlogPostTable {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

})
