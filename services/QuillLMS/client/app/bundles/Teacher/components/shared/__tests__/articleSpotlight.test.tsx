import { shallow } from 'enzyme';
import * as React from 'react';

import ArticleSpotlight from '../articleSpotlight';

describe('ArticleSpotlight component', () => {
  it('should render', () => {
    const wrapper = shallow(<ArticleSpotlight blogPostId="17" />);
    expect(wrapper).toMatchSnapshot();
  });
});
