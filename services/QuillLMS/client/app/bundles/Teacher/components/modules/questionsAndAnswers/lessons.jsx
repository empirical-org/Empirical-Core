import React from 'react'

const lessons = () => [
  {
    question: 'How much time should I allot for a Quill Lesson?',
    answer: [<p>Lessons are intended to take <strong>about 20-30 minutes to complete</strong>. The length of time depends on how long you choose to spend discussing each answer. While in most cases five minutes is enough, teachers may want to facilitate a longer conversation.</p>,
      <p>To end a lesson early, press the “Start Practice Mode” button or “End Session” button in the toolbar at any time. To continue a lesson with a selected group of students, you can assign other students to start independent practice while keeping the lesson open for your group.</p>,
      <p>If you need to abbreviate your time on Quill, you can complete a lesson at any point, and wait to assign the follow up activity until another time.</p>
    ]
  },
  {
    question: 'How can I support both struggling students and advanced learners in lessons mode?',
    answer: <p>You can also use the flagging features to privately select students for extra support. If a student’s response requires intervention, you can click on the flag next to their answer, and they will show up in a list for you at the end of the lesson. At this point all other students can begin the independent practice while you work with a small group.</p>
  },
  {
    question: 'Can I skip slides?',
    answer: [<p>Yes, the slides and the step-by-step guide are a starting point to introduce these concepts to your learners. You can customize the lessons for your learners by editing all of the prompts and questions. Within each lesson, you can also skip slides by selecting a new slide from the preview section.</p>,
      <p><em>Coming soon:</em> You will soon be able to create your own Lessons using the Quill interface! Keep an eye out for updates about this release.</p>
    ]
  },
  {
    question: 'How do I project a Quill Lesson?',
    answer: [<p>After you have launched a lesson, click on the “Launch Projector” icon in the navigation bar at the top. This will open a new window with student facing slides only. In order to ensure that the projector does NOT mirror your screen or show students the teacher notes:</p>,
      <p>For PC:</p>,
      <ol>
        <li>Go to <strong>Control Panel</strong> or <strong>right-click on your desktop.</strong></li>
        <li>Choose <strong>Display Settings.</strong></li>
        <li>In the Multiple Display dropdown, select <strong>Extend Desktop to This Display.</strong></li>
      </ol>,
      <p>For Mac:</p>,
      <ol>
        <li>Go to <strong>System Preferences.</strong></li>
        <li>Go to <strong>Displays.</strong></li>
        <li>Next, select the <strong>Arrangement</strong> tab.</li>
        <li>Uncheck <strong>Mirror Displays.</strong></li>
      </ol>,
      <p>Once you have unmirrored your screen from the projector, you can move the student slide window to the projector so the class could see it. You will be able to control what the students see and the projector slide from your teacher view.</p>
    ]
  },
  {
    question: 'How can I draw & write on a Quill Lesson using my SMARTboard?',
    answer: <p>We know that every interactive projector works in different ways. If your setup does not support writing in a browser, you can download the chrome extension <a href="https://chrome.google.com/webstore/detail/web-paint/emeokgokialpjadjaoeiplmnkjoaegng?hl=en-US">Web Paint</a>, and use that to interact with a Quill lesson.</p>
  },
  {
    question: 'How many answers should I display at a time?',
    answer: <p>We suggest that you project 2-3 student responses to allow for discussion. More than four responses might not all fit on the screen, and will require scrolling on the part of the students. If you want to discuss more than four answers, try projecting 2-3 options to start. Then deselect those answers and choose another set to continue the conversation.</p>
  }
]

export default lessons
