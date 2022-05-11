import * as React from 'react'

const quillLessonsTeacherSrc = `${process.env.CDN_URL}/images/illustrations/quill-lessons-teacher.svg`
const headerOptions = {
  ['lessons']: <h2>Heads up, you’ve selected a Quill Lessons activity (whole class instruction)</h2>,
  ['evidence']: <h2>Heads up, you’ve selected a Quill Reading for Evidence activity</h2>
}
const bodyOptions = {
  ['lessons']: <p>Quill Lessons requires the teacher to launch and lead an interactive lesson synchronously with their students. <a href="https://support.quill.org/en/articles/1173157-getting-started-how-to-set-up-your-first-quill-lesson">Learn more about how Quill Lessons works.</a></p>,
  ['evidence']: <p>Quill Reading for Evidence activities are designed for 8th-12th grade students. The learning tool provides students with reading texts paired with evidence-based writing activities.</p>
}

const ActivityDisclaimerBanner = ({ closeBanner, showImage, activityType }) => {
  return (
    <section className="assigning-activity-disclaimer-banner">
      {showImage && <img alt="teacher at a board showing a projected Quill Lesson" src={quillLessonsTeacherSrc} />}
      <div className="text">
        {headerOptions[activityType]}
        {bodyOptions[activityType]}
      </div>
      <button className="quill-button outlined secondary medium focus-on-light" onClick={closeBanner} type="button">
        Got it
      </button>
    </section>
  )
}

export default ActivityDisclaimerBanner
