import { mount } from 'enzyme';
import 'isomorphic-fetch';
import * as React from 'react';

import Dashboard from '../dashboard';

jest.spyOn(global.Date, 'now').mockImplementation(() =>
  new Date('2020-04-08T11:01:58.135Z').valueOf()
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

const onboardingChecklistAllChecked = onboardingChecklistAllUnchecked.map(item => {
  item.checked = true
  return item
})

describe('Dashboard container', () => {
  describe('when none of the onboarding items have been checked', () => {
    it('should render', () => {
      const wrapper = mount(
        <Dashboard
          featuredBlogPosts={featuredBlogPosts}
          onboardingChecklist={onboardingChecklistAllUnchecked}
          user={'{"name":"George Costanza","flag":"bosco"}'}
        />
      );
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when all the onboarding items have been checked', () => {
    it('should render', () => {
      const wrapper = mount(
        <Dashboard
          featuredBlogPosts={featuredBlogPosts}
          onboardingChecklist={onboardingChecklistAllChecked}
          user={'{"name":"George Costanza","flag":"bosco"}'}
        />
      );
      expect(wrapper).toMatchSnapshot()
    })
  })
});
