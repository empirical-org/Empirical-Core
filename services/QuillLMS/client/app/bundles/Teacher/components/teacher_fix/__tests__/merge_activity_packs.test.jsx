import React from 'react';
import { shallow } from 'enzyme';

import MergeActivityPacks from '../merge_activity_packs';

describe('MergeActivityPacks container', () => {
  const container = shallow(<MergeActivityPacks />);
  it('should render a MergeActivityPacks component', () => {
    expect(container.find('div')).toHaveLength(4);
  });
});
