import React from 'react'
import QuestionAndAnswer from '../components/shared/QuestionAndAnswer.jsx'

export default class QuestionsAndAnswers extends React.Component {
  constructor(props) {
    super(props)
  }

  questionsAndAnswers() {
    return [
      {
        question: 'How long does a lesson last?',
        answer: [<p>Lessons are intended to take about 20-30 minutes to complete. The length of time depends on how long you choose to spend discussing each answer. We suggest that teachers spend no more than five minutes discussing a particular answer, but you may want to facilitate a longer conversation.</p>,
                <p>If you would like to end a lesson early, you can press the “Start Practice Mode” button or “End Session” button in the toolbar at any to stop the lesson. If you would like to use the lesson with a group of your students, you can assign a group of students to start independent practice while the rest of the class continues the lesson.</p>]
      },
      {
        question: 'How can I best support both struggling students and advanced learners?',
        answer: <p>Each Quill Lesson provides a follow up independent practice activity. If you feel that a group of your students are ready to advance to the independent practice, at any point during the lesson you can click on the “start practice mode” button to send those students to independent practice on Quill. You can then work with the rest of the students as a smaller group.</p>
      },
      {
        question: 'Does Quill Lessons support smart boards?',
        answer: [<p>Yes, you can use Quill Lessons with a smart board. To do so, log into Quill on the smartboard to  open up the projector view. Once you have that open, log into Quill on a computer, laptop, or tablet, and control the slides through the teacher view. You can be logged into Quill on multiple devices.</p>,
                <p>You will soon be able to use your smartphone to control the slides while you walk around the room! Smartphone support is in testing now, and it will be supported by January 2018.</p>]
      },
      {
        question: 'How can I draw & write on a Quill Lesson using my smartboard?',
        answer: <p>If your smartboard does not support writing in a browser, you can download the chrome extension <a href="https://chrome.google.com/webstore/detail/web-paint/emeokgokialpjadjaoeiplmnkjoaegng?hl=en-US">Web Paint.</a></p>
      },
      {
        question: 'Can I skip slides?',
        answer: <p>Yes, all of the slides and the step-by-step guide are optional. We have provided it as a starting point to think about how you can introduce each concept, but it’s important that you set customize it to your students. You can edit all of the prompts and questions to best suit your students, and you will soon be able to create your own Quill Lessons. Within each lesson, you can also skip slides by selecting a new slide from the preview section.</p>
      },
      {
        question: 'How long should students spend on each lesson?',
        answer: ''
      },
      {
        question: 'How do I use Quill Lessons with a projector?',
        answer: ''
      },
      {
        question: 'How many answers should I display at a time?',
        answer: <p>We suggest that you project 2-3 answers to the students so that the students can discuss these answers. We do not suggest that you show more than four at a time, as they might not all fit on the screen and it can be difficult for the students to see and read all of these answers. If you want to show more than four answers, we suggest showing the answers in groups. Project one group of answers, and once you have discussed them, deselect those answers and select another set.</p>
      }
    ]
  }

  renderQuestionsAndAnswers() {
    return this.questionsAndAnswers().map((qa, i) => <QuestionAndAnswer key={i} qa={qa}/>)
  }

  render() {
    return(
      <div id="q-and-a">
        <h1>Questions and Answers</h1>
        {this.renderQuestionsAndAnswers()}
        <a className="support-link" href="http://support.quill.org">View All Questions and Answers<i className="fa fa-arrow-right" aria-hidden="true"></i></a>
      </div>
    )
  }

}
