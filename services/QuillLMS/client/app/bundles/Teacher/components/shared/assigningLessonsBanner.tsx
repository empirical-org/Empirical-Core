import * as React from 'react'

const quillLessonsTeacherSrc = `${process.env.CDN_URL}/images/illustrations/quill-lessons-teacher.svg`

const AssigningLessonsBanner = ({ closeLessonsBanner, }) => {
  return (
    <section className="assigning-lessons-banner">
      <img alt="teacher at a board showing a projected Quill Lesson" src={quillLessonsTeacherSrc} />
      <div className="text">
        <h2>Heads up, you’ve selected a Quill Lessons activity (whole class instruction)</h2>
        <p>Quill Lessons requires the teacher to launch and lead an interactive lesson synchronously with their students. <a href="https://support.quill.org/en/articles/1173157-getting-started-how-to-set-up-your-first-quill-lesson">Learn more about how Quill Lessons works.</a></p>
      </div>
      <button className="quill-button outlined secondary medium focus-on-light" onClick={closeLessonsBanner} type="button">
        Got it
      </button>
    </section>
  )
}

export default AssigningLessonsBanner
