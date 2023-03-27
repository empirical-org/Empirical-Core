import { mount } from 'enzyme';
import * as React from 'react';

import { subjectAreas } from './data';

import SubjectAreaSection from '../subject_area_section';

describe('SubjectAreaSection component', () => {

  it('should render', () => {
    const wrapper = mount(
      <SubjectAreaSection
        selectedSubjectAreaIds={[]}
        setSelectedSubjectAreaIds={jest.fn()}
        subjectAreas={subjectAreas}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
