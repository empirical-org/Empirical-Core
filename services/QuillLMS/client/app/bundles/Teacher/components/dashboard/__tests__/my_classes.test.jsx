import React from 'react';
import { shallow } from 'enzyme';

import MyClasses from '../my_classes';
import ClassMini from '../class_mini'
import AddOrSyncClassroomsMini from '../add_or_sync_classrooms_mini'

jest.spyOn(global.Date, 'now').mockImplementation(() =>
  new Date('2019-08-14T11:01:58.135Z').valueOf()
);

describe('MyClasses component', () => {

  it('should render the My Classes header', () => {
    const wrapper = shallow(<MyClasses classList={[]} user={{id: 1}} />);
    expect(wrapper.find('.dashboard-header').text()).toBe('My Classes');
  });

  it('should return ClassMini components for each class in props.classList', () => {
    const wrapper = shallow(
      <MyClasses
        classList={[
          {code: 'pug'},
          {code: 'other pug'}
        ]}
        user={{id: 1}}
      />
    );
    expect(wrapper.find(ClassMini).length).toBe(2);
    expect(wrapper.find(ClassMini).at(0).props().classObj.code).toBe('pug');
    expect(wrapper.find(ClassMini).at(1).props().classObj.code).toBe('other pug');
  });

  it('should render AddOrSyncClassroomsMini component', () => {
    const wrapper = shallow(
      <MyClasses
        classList={[]}
        user={{id: 'donald-pug'}}
      />
    );
    expect(wrapper.find(AddOrSyncClassroomsMini).exists()).toBe(true);
    expect(wrapper.find(AddOrSyncClassroomsMini).props().user.id).toBe('donald-pug');
  });

});
