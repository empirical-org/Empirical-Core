import React from 'react'

const SlideOne =() => {
  return <div className='slide lessons-slide-one'>
      <div className="media">
        <img className="illustration" src="http://localhost:45537/images/tutorials/lessons/slide_1.svg" />
        <img className="caption" src="http://localhost:45537/images/tutorials/lessons/slide_1_text.svg" />
      </div>
      <div className="text">
        <h1>Class-Wide Interactive Activities</h1>
        <p><span>Quill Lessons</span> provides a series of interactive slides that enable you to introduce new writing concepts to your students. Each slide contains a step-by-step guide to help you present each concept.</p>
      </div>
  </div>
}

const SlideTwo =() => {
  return <div className='slide lessons-slide-two'>
    <div className="media">
      <img className="illustration" src="http://localhost:45537/images/tutorials/lessons/slide_2.svg" />
      <img className="caption" src="http://localhost:45537/images/tutorials/lessons/slide_2_text.svg" />
    </div>
    <div className="text">
      <h1>Lead The Lesson</h1>
      <p>You control the pacing - all of the students see the slide you project, and you can select another slide on the left panel.</p>
    </div>
  </div>
}

const SlideThree =() => {
  return <div className='slide lessons-slide-three'>
    <div className="media">
      <img className="illustration" src="http://localhost:45537/images/tutorials/lessons/slide_3.svg" />
      <img className="caption" src="http://localhost:45537/images/tutorials/lessons/slide_3_text.svg" />
    </div>
    <div className="text">
      <h1>Discuss Student Answers</h1>
      <p> See your student answers in real-time, and facilitate a conversation by selecting both strong and weak answers to project to the class. The students can then discuss as pairs and as a class why certain sentences are stronger than others.</p>
    </div>
  </div>
}

const SlideFour =() => {
  return <div className='slide lessons-slide-four'>
    <div className="media">
      <img className="illustration" src="http://localhost:45537/images/tutorials/lessons/slide_4.svg" />
      <img className="caption" src="http://localhost:45537/images/tutorials/lessons/slide_4_text.svg" />
    </div>
    <div className="text">
      <h1>Identify Students For Small Group</h1>
      <p>When the students respond, you can click on the “flag” button to select students who would benefit from follow up small group instruction. At the end of the lesson, you can pull aside the flagged students for small group instruction.</p>
    </div>
  </div>
}

const SlideFive =() => {
  return <div className='slide lessons-slide-five'>
    <div className="media">
      <video />
    </div>
  </div>
}

const SlideSix =() => {
  return <div className='slide lessons-slide-six'>
    <div className="media">
      <img className="illustration" src="http://localhost:45537/images/tutorials/lessons/slide_6.svg" />
      <img className="caption" src="http://localhost:45537/images/tutorials/lessons/slide_6_text.svg" />
    </div>
    <div className="text">
      <h1>Navigation Bar Links</h1>
      <p>During the lesson, you will be able to flag students, open a new window to project, freeze students’ screen, exit lesson and view this guide.</p>
    </div>
  </div>
}

export default [SlideOne(), SlideTwo(), SlideThree(), SlideFour(), SlideFive(), SlideSix()]
