import { mount } from 'enzyme';
import * as React from 'react';

import ActivityFeed from '../activity_feed';

const activityFeedData = [{"id":33,"student_name":"Angie Thomas","activity_name":"Subject and Object Pronoun Agreement 1","unit_id":76,"classroom_id":1,"user_id":7,"activity_id":810,"score":"Not yet proficient","completed":"Mar 5th"},{"id":32,"student_name":"Angie Thomas","activity_name":"Capitalize Names of People and the Pronoun \"I\"","unit_id":49,"classroom_id":1,"user_id":7,"activity_id":885,"score":"Proficient","completed":"Mar 5th"},{"id":29,"student_name":"Angie Thomas","activity_name":"Capitalize Names of People 1","unit_id":49,"classroom_id":1,"user_id":7,"activity_id":804,"score":"Proficient","completed":"Mar 5th"},{"id":28,"student_name":"Angie Thomas","activity_name":"Capitalize Geographic Names 1","unit_id":49,"classroom_id":1,"user_id":7,"activity_id":802,"score":"Nearly proficient","completed":"Mar 5th"},{"id":27,"student_name":"Angie Thomas","activity_name":"Plural vs. Possessive Nouns 1","unit_id":75,"classroom_id":1,"user_id":7,"activity_id":808,"score":"Proficient","completed":"Mar 5th"},{"id":26,"student_name":"Angie Thomas","activity_name":"Capitalize Holidays and Dates 1","unit_id":49,"classroom_id":1,"user_id":7,"activity_id":801,"score":"Nearly proficient","completed":"Mar 5th"},{"id":25,"student_name":"Angie Thomas","activity_name":"Capitalize Holidays and Geographic Names","unit_id":49,"classroom_id":1,"user_id":7,"activity_id":181,"score":"Proficient","completed":"Mar 5th"},{"id":24,"student_name":"Angie Thomas","activity_name":"Starter Diagnostic","unit_id":85,"classroom_id":6,"user_id":7,"activity_id":849,"score":"Completed","completed":"Mar 4th"},{"id":23,"student_name":"Angie Thomas","activity_name":"Starter Diagnostic","unit_id":85,"classroom_id":1,"user_id":7,"activity_id":849,"score":"Completed","completed":"Mar 3rd"},{"id":3,"student_name":"Tahereh Mafi","activity_name":"Starter Diagnostic","unit_id":4,"classroom_id":1,"user_id":6,"activity_id":849,"score":"Completed","completed":"Dec 1st, 2020"},{"id":2,"student_name":"Angie Thomas","activity_name":"Starter Diagnostic","unit_id":4,"classroom_id":1,"user_id":7,"activity_id":849,"score":"Completed","completed":"Dec 1st, 2020"}]

describe('ActivityFeed component', () => {

  describe('on mobile', () => {
    it('should render when there are no activities', () => {
      const wrapper = mount(<ActivityFeed activityFeed={[]} onMobile={true} />);
      expect(wrapper).toMatchSnapshot()
    });

    it('should render when there are activities', () => {
      const wrapper = mount(<ActivityFeed activityFeed={activityFeedData} onMobile={true} />);
      expect(wrapper).toMatchSnapshot()
    });
  })

  describe('not on mobile', () => {
    it('should render when there are no activities', () => {
      const wrapper = mount(<ActivityFeed activityFeed={[]} onMobile={false} />);
      expect(wrapper).toMatchSnapshot()
    });

    it('should render when there are activities', () => {
      const wrapper = mount(<ActivityFeed activityFeed={activityFeedData} onMobile={false} />);
      expect(wrapper).toMatchSnapshot()
    });
  })

});
