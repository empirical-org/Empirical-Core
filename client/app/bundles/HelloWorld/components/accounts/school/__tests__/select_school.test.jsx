import React from 'react';
import { shallow, mount } from 'enzyme';

import SelectSchool from '../select_school';

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
        expect(wrapper.find('option').length).toBe(1);
        expect(wrapper.find('option[value="enter-zipcode"]').length).toBe(1);
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
        expect(wrapper.find('option[value=1]').length).toBe(1);
        expect(wrapper.find('option[value=2]').length).toBe(1);
        expect(wrapper.find('option[value=3]').length).toBe(1);
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
        expect(wrapper.find('option[value="choose"]').length).toBe(1);
      });
    });

    it('should display zip code prompt', () => {
      const wrapper = shallow(
        <SelectSchool isForSignUp={true}
          updateSchool={() => null}
          requestSchools={() => null}
          schoolOptions={[]} />
      );
      expect(wrapper.find('.form-label.zip').text()).toBe("Add Your School's ZIP Code");
    });

    it('should call props.requestSchools if zip input is changed', () => {

    });

    it('should call props.updateSchool on select change', () => {

    });
  });

  describe('with props.isForSignUp false', () => {
    it('should render school name if props.selectedSchool.text exists', () => {

    });

    it('editschoolButton should render with "Edit" if props.selectedSchool.text exists', () => {

    });

    it('editschoolButton should render with "Add" if props.selectedSchool.text does not exist', () => {

    });

    it('clicking editschoolButton should open modal', () => {

    });

    it('modal should render <EducatorType /> component', () => {

    });

    it('clicking close button should close modal', () => {

    });

    it('should render props.errors', () => {

    });
  });
});
