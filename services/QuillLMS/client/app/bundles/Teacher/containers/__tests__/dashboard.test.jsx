import { mount } from 'enzyme';
import 'isomorphic-fetch';
import * as React from 'react';

import Dashboard from '../dashboard';

jest.spyOn(global.Date, 'now').mockImplementation(() =>
  new Date('2023-05-08T11:01:58.135Z').valueOf()
);

const featuredBlogPosts = [
  {
    external_link: "",
    slug: "getting-started-navigating-the-student-dashboard",
    id: 415,
    title: 'Navigating the student dashboard',
    topic: 'Getting started'
  },
  {
    external_link: "",
    slug: "best-practices-how-to-use-quill-when-you-dont-have-time-for-the-diagnostic",
    id: 451,
    title: "How to use Quill when you don't have time for the diagnostic",
    topic: 'Best Practices'
  },
  {
    external_link: "http://s3.amazonaws.com/quill-image-uploads/uploads/files/Using_Quill_with_Google_Classroom.mp4",
    slug: "using-quill-with-google-classroom",
    id: 411,
    title: 'Using Quill with Google Classroom',
    topic: 'Getting started'
  }
]

const onboardingChecklistAllUnchecked = [
  {
    name: "Create a class",
    checked: false,
    link: "/teachers/classrooms?modal=create-a-class"
  },
  {
    name: "Add students",
    checked: false,
    link: "/teachers/classrooms"
  },
  {
    name: "Explore our library",
    checked: false,
    link: "/assign"
  },
  {
    name: "Explore our diagnostics",
    checked: false,
    link: "/assign/diagnostic"
  }
]

const classrooms = [
  {
    name: "Quill Classroom Extremely Long So Long SUper Duper",
    id: "484134",
    code: "demo-6553451",
    student_count: "5",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2022-08-17 14:26:06.140275",
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
    created_at: "2022-04-26 15:26:05.306719",
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
    created_at: "2022-08-26 19:16:43.07067",
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
    created_at: "2022-08-26 19:16:54.839985",
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
    created_at: "2022-08-26 19:45:54.813954",
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
    created_at: "2022-08-26 19:46:05.060615",
    grade: "5",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  }
]

const onboardingChecklistAllChecked = onboardingChecklistAllUnchecked.map(item => {
  item.checked = true
  return item
})

const sharedProps = {
  classrooms,
  featuredBlogPosts,
  userId: 1
}

describe('Dashboard container', () => {
  describe('when none of the onboarding items have been checked', () => {
    it('should render', () => {
      const wrapper = mount(
        <Dashboard
          {...sharedProps}
          onboardingChecklist={onboardingChecklistAllUnchecked}
        />
      );
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when all the onboarding items have been checked', () => {
    it('should render', () => {
      const wrapper = mount(
        <Dashboard
          {...sharedProps}
          onboardingChecklist={onboardingChecklistAllChecked}
        />
      );
      expect(wrapper).toMatchSnapshot()
    })
  })
});
