import request from 'request'

export default function goToTutorialOrLesson(url) {
  request.get(`${process.env.DEFAULT_URL}/milestones/has_viewed_lesson_tutorial`, (error, httpStatus, body) => {
    if (body.completed) {
      window.location = url
    } else {
    window.location = `${process.env.DEFAULT_URL}/tutorials/lessons?url=${encodeURIComponent(url)}`
    }
  })
}
