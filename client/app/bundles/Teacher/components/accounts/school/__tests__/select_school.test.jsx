import React from 'react';
import { shallow, mount } from 'enzyme';

import SelectSchool from '../select_school';

import EducatorType from '../../new/educator_type';

describe('SelectSchool component', () => {

  describe('with props.isForSignUp true', () => {

    describe('school select box', () => {
      it('should show zip code prompt as only option if props.schoolOptions is empty', () => {
        const wrapper = shallow(
          <SelectSchool isForSignUp={true}
            updateSchool={() => null}
            requestSchools={() => null}
            schoolOptions={[]} />
        );
        expect(wrapper.find('option')).toHaveLength(1);
        expect(wrapper.find('option[value="enter-zipcode"]')).toHaveLength(1);
      });

      it('should render props.schoolOptions to options', () => {
        const wrapper = shallow(
          <SelectSchool isForSignUp={true}
            updateSchool={() => null}
            requestSchools={() => null}
            schoolOptions={[
              {id: 1, text: 'One'},
              {id: 2, text: 'Two'},
              {id: 3, text: 'Three'}
            ]} />
        );
        expect(wrapper.find('option[value=1]')).toHaveLength(1);
        expect(wrapper.find('option[value=2]')).toHaveLength(1);
        expect(wrapper.find('option[value=3]')).toHaveLength(1);
      });

      it('should render selected school as initial option if props.selectedSchool.zipcode is equal to schoolOptions[0].zipcode', () => {
        const wrapper = shallow(
          <SelectSchool isForSignUp={true}
            updateSchool={() => null}
            requestSchools={() => null}
            selectedSchool={{id: 1, text: 'One', zipcode: '10025'}}
            schoolOptions={[
              {id: 1, text: 'One', zipcode: '10025'}
            ]} />
        );
        expect(wrapper.find('#select_school').at(0).props().value).toBe(1);
      });

      it('should render "Choose Your School" option if props.selectedSchool does not exist', () => {
        const wrapper = shallow(
          <SelectSchool isForSignUp={true}
            updateSchool={() => null}
            requestSchools={() => null}
            schoolOptions={[
              {id: 1, text: 'One', zipcode: '10025'}
          ]} />
        );
        expect(wrapper.find('option[value="choose"]')).toHaveLength(1);
      });
    });

    it('should display zip code prompt', () => {
      const wrapper = shallow(
        <SelectSchool isForSignUp={true}
          updateSchool={() => null}
          requestSchools={() => null}
          schoolOptions={[]} />
      );
      expect(wrapper.find('.zip').text()).toBe("Add Your School's ZIP Code");
    });

    it('should call props.requestSchools if zip input is changed and has a length of five', () => {
      let mockRequestSchools = jest.fn();
      const wrapper = mount(
        <SelectSchool isForSignUp={true}
          updateSchool={() => null}
          requestSchools={mockRequestSchools}
          schoolOptions={[]} />
      );
      wrapper.find('.zip-input').simulate('change', {target: {value: '123'}});
      expect(mockRequestSchools.mock.calls).toHaveLength(0);
      wrapper.find('.zip-input').simulate('change', {target: {value: '10025'}});
      expect(mockRequestSchools.mock.calls[0][0]).toBe('10025');
    });

    it('should call props.updateSchool on select change', () => {
      let mockUpdateSchool = jest.fn();
      const wrapper = mount(
        <SelectSchool isForSignUp={true}
          updateSchool={mockUpdateSchool}
          requestSchools={() => null}
          schoolOptions={[{id: 1, text: 'One'}]} />
      );
      wrapper.find('#select_school').simulate('change', {target: {value: '1'}});
      expect(mockUpdateSchool.mock.calls[0][0].text).toBe('One');
    });
  });

  describe('with props.isForSignUp false', () => {
    it('should render readonly school name input if props.selectedSchool.text exists', () => {
      const wrapper = shallow(
        <SelectSchool isForSignUp={false}
          selectedSchool={{id: 1, text: 'One'}}
          updateSchool={() => null}
          requestSchools={() => null}
          schoolOptions={[]} />
      );
      expect(wrapper.find('.inactive').props().defaultValue).toBe('One');
    });

    it('editschoolButton should render with "Edit" if props.selectedSchool.text exists', () => {
      const wrapper = shallow(
        <SelectSchool isForSignUp={false}
          selectedSchool={{id: 1, text: 'One'}}
          updateSchool={() => null}
          requestSchools={() => null}
          schoolOptions={[]} />
      );
      expect(wrapper.find('button[data-toggle="modal"]').text()).toBe('Edit School');
    });

    it('editschoolButton should render with "Add" if props.selectedSchool.text does not exist', () => {
      const wrapper = shallow(
        <SelectSchool isForSignUp={false}
          updateSchool={() => null}
          requestSchools={() => null}
          schoolOptions={[]} />
      );
      expect(wrapper.find('button[data-toggle="modal"]').text()).toBe('Add School');
    });

    it('modal should render <EducatorType /> component', () => {
      const wrapper = mount(
        <SelectSchool isForSignUp={false}
          updateSchool={() => null}
          requestSchools={() => null}
          schoolOptions={[]} />
      );
      expect(wrapper.find(EducatorType).exists()).toBe(true);
    });

  });
});
