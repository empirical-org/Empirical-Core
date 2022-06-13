import * as React from 'react';
import { mount } from 'enzyme';

import { SchoolAndDistrictFields }from '../../../components/salesForm/schoolAndDistrictFields';

jest.mock('fuse.js', () => ({
  default: jest.fn()
}));

describe('SchoolAndDistrictFields Component', () => {
  const mockProps = {
    errors: {},
    handleUpdateField: jest.fn(),
    schoolIsSelected: true,
    districtIsSelected: true,
    schoolNotListed: false,
    districtNotListed: false,
    selectedSchool: '',
    selectedDistrict: '',
    schools: [],
    districts: [],
    handleSchoolSearchChange: jest.fn(),
    handleDistrictSearchChange: jest.fn()
  }
  const component = mount(<SchoolAndDistrictFields {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
