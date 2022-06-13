import React from 'react'

const admin = () => [
  {
    question: 'How does the Professional Development work?',
    answer: <p>After upgrading to Quill School Premium, you’ll receive an email from our team with next steps, which include setting up your professional development session.</p>
  },
  {
    question: 'How can I arrange the Professional Development session?',
    answer: [<p>In order to set up that session, you will set up an initial 15-minute call between your PD coordinator and our School Partnerships team to discuss tailoring the session school goals and writing curriculum, which tools you’d like to highlight, and when you’d like the session to happen. You can do this by signing up at <a href="https://quill-partnerships.youcanbook.me">quill-partnerships.youcanbook.me</a>.</p>,
      <p>Teachers will be asked to set up their Quill accounts prior to the session, so they can jump right into exploring Quill!</p>
    ]
  },
  {
    question: 'What is the Professional Development session structure like?',
    answer: [
      <p>The personalized session will last 45 to 75 minutes, and will involve a review of chosen tools as they relate to the school’s focus, and (time allowing) a conversation surrounding how teachers can effectively integrate Quill into their classroom. In the session, teachers will establish a direct line of communication with the School Partnerships team.</p>
    ]
  },
  {
    question: 'How will I access the Professional Development session?',
    answer: [<p>Sessions outside of New York City will be held remotely via Zoom, and will be recorded via Zoom to provide teachers with continued access to the information. Teachers will receive a follow up email with a reminder of resources and a link to the session recording.</p>]
  },
  {
    question: 'How does Premium Reporting Work?',
    answer: [
      <p>Teachers and administrators will continue to have access to basic reporting features, including the Activity Summary, Activity Analysis and Diagnostic reports. <a href="https://support.quill.org/getting-started-for-teachers/viewing-reports/where-can-i-see-my-student-scores-and-answers">Here’s a guide</a> on standard reports.</p>,
      <p>Premium teacher reports are available to teachers within their account and administrators via a link in the Administrator Dashboard. Those reports include List Overview, Concepts and Common Core Standards reporting. You will be able to download and print each of the premium reports to share with your colleagues, administrators or parents. <a href="https://support.quill.org/quill-premium">Here’s a guide</a> on Premium Reports.</p>
    ]
  },
  {
    question: 'What resources can I use to introduce Quill to the teachers in my school?',
    answer: [<p>You can access a two-page handout to introduce teachers to Quill <a href="https://d1yxac6hjodhgc.cloudfront.net/wp-content/uploads/2015/11/Quill-Overview3.pdf">here</a>. Your teachers can use the <a href="https://www.quill.org/teacher-center">teacher resources</a> page to access in-depth guides and video overviews.</p>]
  }
]

export default admin
