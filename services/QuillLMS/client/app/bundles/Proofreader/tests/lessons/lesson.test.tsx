import { shallow } from 'enzyme';
import * as React from 'react';

import { Lesson } from '../../components/lessons/lesson';

describe('Lesson Component', () => {
  const mockActivity = {
    description: "<p>Rewrite the following story by choosing the correct word.  Remember to delete the slash &quot;/&quot; and the incorrect word before clicking the submit button.</p>",
    flag: "production",
    passage: "One day, {+a-a/an|PzMesGC_8yILSHMlu5GnFA} girl was walking home from school when she saw {+an-an/a|PzMesGC_8yILSHMlu5GnFA} energetic little man jumping in and out of some bushes.",
    title: "A Little Stranger on the Road",
    underlineErrorsInProofreader: true,
    standard: null,
    standardLevel: null,
    standardCategory: null
  };
  const mockProps = {
    concepts: {
      hasreceiveddata: false,
      submittingnew: false,
      states: null,
      data: null
    },
    dispatch: jest.fn(),
    history: {},
    lessons: {
      hasreceiveddata: true,
      states: {},
      showLessonForm: false,
      data: {
        '17': mockActivity
      },
      currentActivity: mockActivity
    },
    location: {},
    match: {
      params: {
        lessonID: '17'
      }
    }
  }
  let component = shallow(<Lesson {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('should render the Lesson if relevant props are received', () => {
    expect(component.find('Connect(PlayProofreaderContainer)').props().activityUID).toEqual('17')
  });

  it('should render the LessonForm if relevant props are received', () => {
    mockProps.lessons.states['17'] = 'EDITING_LESSON';
    component = shallow(<Lesson {...mockProps} />);
    expect(component.find('Connect(LessonForm)').length).toEqual(1)
  });
});
