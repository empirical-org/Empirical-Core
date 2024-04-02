import { mount } from 'enzyme';
import * as React from 'react';

import SnapshotFeedback from '../snapshotFeedback';

describe('SnapshotFeedback component', () => {
  const component = mount(<SnapshotFeedback />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
