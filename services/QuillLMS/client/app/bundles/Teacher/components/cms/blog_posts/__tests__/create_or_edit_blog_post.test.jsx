import { mount } from 'enzyme';
import * as React from 'react';

import { author, blogPostWithBody, topics } from './data';

import CreateOrEditBlogPost, { EDIT, NEW } from '../create_or_edit_blog_post';

const editProps = {
  authors: [author],
  postToEdit: blogPostWithBody,
  action: EDIT,
  topics
}

const newProps = {
  authors: [author],
  action: NEW,
  topics
}

describe('CreateOrEditBlogPost component', () => {
  it('renders for a new blog post', () => {
    const wrapper = mount(<CreateOrEditBlogPost {...newProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders for an existing blog post', () => {
    const wrapper = mount(<CreateOrEditBlogPost {...editProps} />)
    expect(wrapper).toMatchSnapshot()
  })

})
