import { shallow } from 'enzyme';
import React from 'react';

import MergeActivityPacks from '../merge_activity_packs';

describe('MergeActivityPacks container', () => {
  const container = shallow(<MergeActivityPacks />);
  it('should render a MergeActivityPacks component', () => {
    expect(container.find('div')).toHaveLength(4);
  });
});
