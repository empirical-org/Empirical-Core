import { mount } from 'enzyme';
import * as React from 'react';

import BulkArchiveClassesBanner from '../bulk_archive_classes_banner';

const classes = [
  {
    name: "Quill Classroom Extremely Long So Long SUper Duper",
    id: "484134",
    code: "demo-6553451",
    student_count: "5",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2018-08-17 14:26:06.140275",
    grade: "9",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  },
  {
    name: "A New Class",
    id: "484135",
    code: "van-guitar",
    student_count: "0",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2018-04-26 15:26:05.306719",
    grade: "6",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  },
  {
    name: "2",
    id: "484137",
    code: "writer-menu",
    student_count: "0",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2018-08-26 19:16:43.07067",
    grade: "Other",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  },
  {
    name: "4",
    id: "484139",
    code: "cheese-ideal",
    student_count: "0",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2018-08-26 19:16:54.839985",
    grade: "Other",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  },
  {
    name: "13",
    id: "484148",
    code: "poetry-stitch",
    student_count: "0",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2018-08-26 19:45:54.813954",
    grade: "5",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  },
  {
    name: "15",
    id: "484150",
    code: "dogs-fruit",
    student_count: "0",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2018-08-26 19:46:05.060615",
    grade: "5",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  }
]

describe('BulkArchiveClassesBanner', () => {
  describe ('when it is not July-September', () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() =>
      new Date('2019-01-14T11:01:58.135Z').valueOf()
    );
    const wrapper = mount(<BulkArchiveClassesBanner classes={classes} onSuccess={() => {}} userId={1} />)

    it('should render null when it is not July-September', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when it is July-September', () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() =>
      new Date('2019-08-14T11:01:58.135Z').valueOf()
    );
    const wrapper = mount(<BulkArchiveClassesBanner classes={classes} onSuccess={() => {}} userId={1} />)

    it('should render null when the teacher has already closed it for this school year', () => {
      window.localStorage.setItem(`119BulkArchiveBannerClosedForUser1`, 'true')
      const wrapperWithClosedBanner = mount(<BulkArchiveClassesBanner classes={classes} onSuccess={() => {}} userId={1} />)
      expect(wrapperWithClosedBanner).toMatchSnapshot()
      window.localStorage.removeItem(`119BulkArchiveBannerClosedForUser1`)
    })

    it('should render null when no classes are older than three months', () => {
      const newClasses = classes.map(c => {
        const newC = {...c}
        newC.created_at = Date.now()
        return newC
      })
      const wrapperWithNewClasses = mount(<BulkArchiveClassesBanner classes={newClasses} onSuccess={() => {}} userId={1} />)
      expect(wrapperWithNewClasses).toMatchSnapshot()
    })

    it('should render when none of the above conditions are met', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
