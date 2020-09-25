import React from 'react';
import { shallow, mount } from 'enzyme';
import _ from 'underscore'

import UnitTemplate from '../unit_template';
import MarkdownParser from '../../shared/markdown_parser.jsx'

describe('UnitTemplate component', () => {

  describe('Markdown Preview', () => {
    it('should not render without activity_info in the state', () => {
      const wrapper = shallow(
        <UnitTemplate
          returnToIndex={() => null}
          unitTemplate={{}}
        />
      );
      expect(wrapper.find(MarkdownParser)).toHaveLength(0);
    });

    it('should render if there is activity_info in the state', () => {
      const wrapper = shallow(
        <UnitTemplate
          returnToIndex={() => null}
          unitTemplate={{}}
        />
      );
      wrapper.setState({model: {activity_info: 'i am the activity info'}})
      expect(wrapper.find(MarkdownParser)).toHaveLength(1);
    });

  });
});
