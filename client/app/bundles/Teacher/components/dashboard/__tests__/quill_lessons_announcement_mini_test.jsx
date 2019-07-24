import React from 'react';
import { shallow } from 'enzyme';

import QuillLessonsAnnouncementMini from '../quill_lessons_announcement_mini';

describe('QuillLessonsAnnouncementMini component', () => {

  it('should render', () => {
    expect(shallow(<QuillLessonsAnnouncementMini />)).toMatchSnapshot();
  });

});
