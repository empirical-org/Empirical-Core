import { shallow } from 'enzyme';
import React from 'react';

import SelectAClassroom from '../selectAClassroom';

const handleClassroomTabClick = () => {}

const classroomProps = [
  {
    name:"Quill Classroom",
    teacher: "Demo Teacher",
    id: "13"
  }
]

describe('SelectAClassroom component', () => {
  const wrapper = shallow(
    <SelectAClassroom
      classrooms={classroomProps}
      onClickCard={handleClassroomTabClick}
    />
  );

  it('should render SelectAClassroom', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render a join a class card', () => {
    expect(wrapper.find('.join-a-class-card')).toHaveLength(1)
  })

  it('should render the number of classroom cards as elements in the classrooms array, plus one', () => {
    expect(wrapper.find('.classroom-card')).toHaveLength(classroomProps.length + 1)
  })

})
