import { mount } from 'enzyme';
import * as React from 'react';

import { blogPosts, topics } from './data';

import BlogPostIndex from '../blog_post_index';

const props = {
  blogPosts,
  topics
}

describe('BlogPostIndex component', () => {
  it('renders', () => {
    const wrapper = mount(<BlogPostIndex {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

})
