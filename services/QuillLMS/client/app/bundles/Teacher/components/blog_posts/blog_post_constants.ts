export const STUDENT = 'student'
export const STUDENT_CENTER = 'Student Center'
export const STUDENT_CENTER_SLUG = 'student-center'
export const TEACHER_CENTER = 'Teacher Center'
export const TEACHER_CENTER_SLUG = 'teacher-center'
export const TOPIC = 'topic'
export const ALL = 'all'
export const SEARCH = 'search'
export const TEACHER_STORIES = 'Teacher stories'
export const PRESS_RELEASES = 'Press releases'
export const GETTING_STARTED = 'Getting started'
export const WHATS_NEW = "What's new?"
export const WRITING_INSTRUCTION_RESEARCH = 'Writing instruction research'
export const IN_THE_NEWS = 'In the news'
export const SUPPORT = 'Support'
export const WEBINARS = 'Webinars'
export const VIDEO_TUTORIALS = 'Video tutorials'
export const BEST_PRACTICES = 'Best practices'
export const TEACHER_MATERIALS = 'Teacher materials'
export const USING_QUILL_FOR_READING_COMPREHENSION = "Using quill for reading comprehension"
export const CASE_STUDIES = "Case studies"
export const TWITTER_LOVE = "Twitter love"

export const STUDENT_GETTING_STARTED = 'Student getting started'
export const STUDENT_HOW_TO = 'Student how to'


const GREEN = 'green'
const PURPLE = 'purple'
const BLUE = 'blue'
const GOLD = 'gold'
const RED = 'red'
const VIOLET = 'violet'
const TEAL = 'teal'

// colors just cycle through topics linearly then repeat, but we need to store them for reference in search pages etc
export const BLOG_POST_TO_COLOR = {
  [WHATS_NEW]: GREEN,
  [USING_QUILL_FOR_READING_COMPREHENSION]: PURPLE,
  [GETTING_STARTED]: BLUE,
  [BEST_PRACTICES]: GOLD,
  [WEBINARS]: RED,
  [VIDEO_TUTORIALS]: VIOLET,
  [TEACHER_MATERIALS]: TEAL,
  [WRITING_INSTRUCTION_RESEARCH]: GREEN,
  [TEACHER_STORIES]: PURPLE,
  [PRESS_RELEASES]: BLUE,
  [IN_THE_NEWS]: GOLD,
  [CASE_STUDIES]: RED,
  [SUPPORT]: VIOLET,
  [TWITTER_LOVE]: TEAL,
  [STUDENT_GETTING_STARTED]: GREEN,
  [STUDENT_HOW_TO]: PURPLE
}
