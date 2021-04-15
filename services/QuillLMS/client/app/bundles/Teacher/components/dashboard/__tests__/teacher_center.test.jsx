import React from 'react';
import { shallow } from 'enzyme';

import TeacherCenter from '../teacher_center';

const featuredBlogPosts = [
  {
    preview_card_content: "<img class='preview-card-image' src='http://s3.amazonaws.com/quill-image-uploads/uploads/files/Cover__10_.png' />\n    <div class='preview-card-body'>\n       <h3>Getting Started: Navigating the Student Dashboard</h3>\n       <p>A comprehensive overview of Quill's easy-to-navigate student dashboard.</p>\n       <span/>\n    </div>\n    <div class='preview-card-footer'>\n      <p class='author'>by Quill Staff</p>\n    </div>",
    external_link: "",
    slug: "getting-started-navigating-the-student-dashboard",
    id: 415
  },
  {
    preview_card_content: "<img class='preview-card-image' src='http://s3.amazonaws.com/quill-image-uploads/uploads/files/Cover__2_.png' />\n    <div class='preview-card-body'>\n       <h3>Best Practices: How to use Quill when you don't have time for the diagnostic</h3>\n       <p>Here are a few tips to provide quick, easy, and targeted instruction to your students without assigning a Diagnostic.</p>\n       <span/>\n    </div>\n    <div class='preview-card-footer'>\n      <p class='author'>by Maddy M.</p>\n    </div>",
    external_link: "",
    slug: "best-practices-how-to-use-quill-when-you-dont-have-time-for-the-diagnostic",
    id: 451
  },
  {
    preview_card_content: "<img class='preview-card-image' src='http://s3.amazonaws.com/quill-image-uploads/uploads/files/Cover__12_.png' />\n    <div class='preview-card-body'>\n       <h3>Using Quill with Google Classroom</h3>\n       <p>Learn how to sync your Google Classroom account with Quill and communicate assignments with your students.</p>\n       <div class='button-container'><a target='_blank' class='article-cta-primary' ",
    external_link: "http://s3.amazonaws.com/quill-image-uploads/uploads/files/Using_Quill_with_Google_Classroom.mp4",
    slug: "using-quill-with-google-classroom",
    id: 411
  }
]

describe('TeacherCenter component', () => {

  it('should render', () => {
    expect(shallow(<TeacherCenter featuredBlogPosts={featuredBlogPosts} />)).toMatchSnapshot();
  });

});
