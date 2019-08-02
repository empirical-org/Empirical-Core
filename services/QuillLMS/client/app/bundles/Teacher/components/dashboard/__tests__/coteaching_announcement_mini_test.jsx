import React from 'react';
import { shallow } from 'enzyme';

import CoteachingAnnouncementMini from '../coteaching_announcement_mini';

describe('CoteachingAnnouncementMini component', () => {

  it('should render', () => {
    expect(shallow(<CoteachingAnnouncementMini />)).toMatchSnapshot();
  });

});
