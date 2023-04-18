import { shallow } from 'enzyme';
import * as React from 'react';

import { Lessons } from '../../components/lessons/lessons';
import LinkListItem from '../../components/shared/linkListItem';

jest.mock('underscore', () => ({
  default: {
    keys: jest.fn(() => (['17', '18', '19']))
  }
}));

describe('Lessons Component', () => {
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
      submittingnew: false,
      data: {
        '17': {
          title: 'Activity 1',
          flag: "production"
        },
        '18': {
          title: 'Activity 2',
          flag: "production"
        },
        '19': {
          title: 'Activity 3',
          flag: "production"
        }
      }
    },
    location: {},
    match: {
      params: {}
    }
  }
  let component = shallow(<Lessons {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('should render lessons if relevant props are received', () => {
    expect(component.find(LinkListItem).length).toEqual(3);
    expect(component.find(LinkListItem).at(0).props().text).toEqual('Activity 1');
    expect(component.find(LinkListItem).at(1).props().text).toEqual('Activity 2');
    expect(component.find(LinkListItem).at(2).props().text).toEqual('Activity 3');
  });

  it('should render the LessonForm if relevant props are received', () => {
    mockProps.lessons.showLessonForm = true;
    component = shallow(<Lessons {...mockProps} />);
    expect(component.find('Connect(LessonForm)').length).toEqual(1)
  });
});
