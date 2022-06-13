import React from 'react';
import { shallow } from 'enzyme';

import ClassroomActivity from '../classroom_activity';

describe('ClassroomActivity component', () => {
  it('should not render Recommendations div if data.activityId is not diagnostic id', () => {
    delete window.location;
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/teachers/progress_reports/diagnostic_reports/'
      }
    });
    const wrapper = shallow(
      <ClassroomActivity
        data={{ activity:
            { anonymous_path: '',
              classification: {
                scorebook_icon_class: '',
              },
            },
        activityId: 412, }}
      />
    );
    expect(wrapper.find('.recommendations-button')).toHaveLength(0);
  });

  it('should not render Recommendations div if it is not on the activity analysis page', () => {
    window.location.pathname = '/teachers/classrooms/activity_planner/';
    const wrapper = shallow(
      <ClassroomActivity
        data={{ activity:
          { anonymous_path: '',
            classification: {
              scorebook_icon_class: '',
            },
          },
        activityId: 413 ,}}
      />
    );
    expect(wrapper.find('.recommendations-button')).toHaveLength(0);
  });

  it('should render the Lessons End Row div if it is not a report and it gets the lesson prop', () => {
    window.location.pathname = '/teachers/classrooms/activity_planner/lessons';
    const wrapper = shallow(
      <ClassroomActivity
        data={{ activity:
          { anonymous_path: '',
            classification: {
              scorebook_icon_class: '',
            },
          },
        }}
        lesson
        report={false}
      />
    );
    expect(wrapper.find('.lessons-end-row')).toHaveLength(1);
  });

  it('should render the Lessons End Row div if it is not a report and the activity classification is 6', () => {
    window.location.pathname = '/teachers/classrooms/activity_planner/lessons';
    const wrapper = shallow(
      <ClassroomActivity
        data={{
          activityId: 567,
          activityClassificationId: 6,
          name: 'I am a lesson',
        }}
        report={false}
      />
    );
    expect(wrapper.find('.lessons-end-row')).toHaveLength(1);
  });

  it('should not render the Lessons End Row div if it is a report', () => {
    window.location.pathname = '/teachers/classrooms/activity_planner/lessons';
    const wrapper = shallow(
      <ClassroomActivity
        data={{
          activity: { anonymous_path: '' },
          activityId: 567,
          activityClassificationId: 6,
          name: 'I am a lesson',
        }}
        lesson
        report
      />
    );
    expect(wrapper.find('.lessons-end-row')).toHaveLength(0);
  });
});
