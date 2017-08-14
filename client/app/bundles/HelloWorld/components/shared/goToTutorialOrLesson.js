import request from 'request'

hasViewedLessonTutorial() {
  request.get(`${process.env.DEFAULT_URL}/milestones/has_viewed_lesson_tutorial`, (error, httpStatus, body) => {
    return body.completed
  })
}

export default function goToTutorialOrLesson(url) {
  if (hasViewedLessonTutorial()) {
    window.location = url
  } else {
    window.location = `${process.env.DEFAULT_URL}/tutorials/lessons?url=${encodeURIComponent(url)}`
  }
}
