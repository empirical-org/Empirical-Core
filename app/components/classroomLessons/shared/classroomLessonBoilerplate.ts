import LessonSlideBoilerplates from './lessonSlideBoilerplates'

export default (lessonTitle) => {
  return {
    lesson: 1000,
    title: lessonTitle,
    questions: [LessonSlideBoilerplates['CL-LB'], LessonSlideBoilerplates['CL-EX']]
  }
}
