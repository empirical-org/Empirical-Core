import { mount } from 'enzyme';
import React from 'react';

import TeacherCenterHighlights from '../teacher_center_highlights';

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

describe('TeacherCenterHighlights component', () => {

  it('should render', () => {
    expect(mount(<TeacherCenterHighlights featuredBlogPosts={featuredBlogPosts} />)).toMatchSnapshot();
  });

});
