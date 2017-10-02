import React from 'react';
import { shallow } from 'enzyme';

import NewTeacher from '../new_teacher';

import BasicTeacherInfo from '../basic_teacher_info';
import EducatorType from '../educator_type';
import AnalyticsWrapper from '../../../shared/analytics_wrapper'

describe('NewTeacher component', () => {

  it('should render <BasicTeacherInfo /> if stage is 1', () => {
      const wrapper = shallow(
        <NewTeacher textInputGenerator={{generate: () => null}}
                    sendNewsletter={true}
                    stage={1}
                    update={() => null}
                    signUp={() => null} />
      );
      expect(wrapper.find(BasicTeacherInfo)).toHaveLength(1);
  });

  it('should render <EducatorType /> if stage is 2', () => {
      const wrapper = shallow(
        <NewTeacher textInputGenerator={{generate: () => null}}
                    sendNewsletter={true}
                    stage={2}
                    update={() => null}
                    signUp={() => null}
                    analytics={new AnalyticsWrapper()} />
      );
      expect(wrapper.find(EducatorType)).toHaveLength(1);
  });

});
