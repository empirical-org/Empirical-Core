import React from 'react';
import { shallow } from 'enzyme';
import GoogleClassroomsList from '../GoogleClassroomsList.jsx'

const googleClasses = [{name: 'sample class', id: 1232}];

describe('the GoogleClassroomsList component', ()=>{

  it('should render', () => {
      const wrapper = shallow(
        <GoogleClassroomsList classrooms={googleClasses} />
      );
      expect(wrapper).toMatchSnapshot();
  });

  it('should render a table', () => {
      const wrapper = shallow(
        <GoogleClassroomsList classrooms={googleClasses} />
      );
      expect(wrapper.find('table').length).toBe(1);
  });

  it('should have as many table rows as there are classes', () => {
      const wrapper = shallow(
        <GoogleClassroomsList classrooms={googleClasses} />
      );
      const classCount = googleClasses.length
      expect(wrapper.find('tr').length).toBe(classCount);
  });

  it('the table row should have a classes name in the first table cell', () => {
      const wrapper = shallow(
        <GoogleClassroomsList classrooms={googleClasses} />
      );
      expect(wrapper.find('td').text()).toBe('sample class');
  });


})
