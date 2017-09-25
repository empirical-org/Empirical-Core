import React from 'react';
import { shallow } from 'enzyme';

import ClassroomActivity from '../classroom_activity';

describe('ClassroomActivity component', () => {

  it('should not render Recommendations div if data.activity_id is not diagnostic id', () => {
      Object.defineProperty(window.location, 'pathname', {
        writable: true,
        value: '/teachers/progress_reports/diagnostic_reports/'
      });
      const wrapper = shallow(
        <ClassroomActivity
            data={{activity:
              { anonymous_path: '',
              classification: {
                scorebook_icon_class: ''
              }
            },
            activity_id: 412}}/>
      );
      expect(wrapper.find('.recommendations-button')).toHaveLength(0);
  });

  it('should not render Recommendations div if it is not on the activity analysis page', () => {
      window.location.pathname = '/teachers/classrooms/activity_planner/'
      const wrapper = shallow(
        <ClassroomActivity
          data={{activity:
            { anonymous_path: '',
              classification: {
                scorebook_icon_class: ''
              }
            },
            activity_id: 413}}/>
      );
      expect(wrapper.find('.recommendations-button')).toHaveLength(0);
  });

  it.skip('should render Recommendations div if data.activity_id is diagnostic id and it is on the activity analysis page', () => {
    window.location.pathname = '/teachers/progress_reports/diagnostic_reports/'
    const wrapper = shallow(
      <ClassroomActivity
        data={{activity:
          { anonymous_path: '',
            classification: { scorebook_icon_class: '' }
          },
          activity_id: 413}}/>
    );
      expect(wrapper.find('.recommendations-button')).toHaveLength(1);
  });


});
