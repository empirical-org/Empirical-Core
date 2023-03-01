# frozen_string_literal: true

module TeacherCenterHelper
  FAQ = 'FAQ'
  PREMIUM = 'Premium'
  RESEARCH = 'Research'
  COMPREHENSION = 'Reading comprehension'
  ALL = 'All'
  FEATURED_ACTIVITIES = 'Featured Activities'
  AP_ACTIVITIES = 'AP Activities'
  PRE_AP_ACTIVITIES = 'Pre-AP Activities'
  SPRINGBOARD_ACTIVITIES = 'SpringBoard Activities'
  ELA_STANDARDS = 'ELA Standards'

  def teacher_center_tabs(large: true)
    tabs = [
      {
        id: BlogPost::ALL_RESOURCES,
        name: ALL,
        url: '/teacher-center'
      },
      {
        id: BlogPost::WHATS_NEW,
        name: BlogPost::WHATS_NEW,
        url: "/teacher-center/topic/whats-new"
      },
      {
        id: BlogPost::USING_QUILL_FOR_READING_COMPREHENSION,
        name: COMPREHENSION,
        url: '/teacher-center/topic/using-quill-for-reading-comprehension'
      },
      {
        id: BlogPost::GETTING_STARTED,
        name: BlogPost::GETTING_STARTED,
        url: '/teacher-center/topic/getting-started'
      },
      {
        id: BlogPost::BEST_PRACTICES,
        name: BlogPost::BEST_PRACTICES,
        url: '/teacher-center/topic/best-practices'
      },
      {
        id: BlogPost::WRITING_INSTRUCTION_RESEARCH,
        name: RESEARCH,
        url: '/teacher-center/topic/writing-instruction-research'
      },
      {
        id: FAQ,
        name: FAQ,
        url: '/faq'
      },
      {
        id: BlogPost::WEBINARS,
        name: BlogPost::WEBINARS,
        url: '/teacher-center/topic/webinars'
      },
      {
        id: BlogPost::TEACHER_MATERIALS,
        name: BlogPost::TEACHER_MATERIALS,
        url: '/teacher-center/topic/teacher-materials'
      },
      {
        id: BlogPost::TEACHER_STORIES,
        name: BlogPost::TEACHER_STORIES,
        url: '/teacher-center/topic/teacher-stories'
      },
    ]
    tabs
  end

  def student_center_tabs(large: true)
    [
     {
       id: BlogPost::ALL_RESOURCES,
       name: large ? BlogPost::ALL_RESOURCES : ALL,
       url: '/student-center'
     },
     {
       id: BlogPost::GETTING_STARTED,
       name: BlogPost::GETTING_STARTED,
       url: '/student-center/topic/student-getting-started'
     },
     {
       id: BlogPost::HOW_TO,
       name: BlogPost::HOW_TO,
       url: '/student-center/topic/student-how-to'
     }
   ]
  end

  def explore_curriculum_tabs(large: true)
    [
      {
        id: FEATURED_ACTIVITIES,
        name: large ? FEATURED_ACTIVITIES : 'Featured',
        url: '/activities/packs'
      },
      {
        id: AP_ACTIVITIES,
        name: large ? AP_ACTIVITIES : 'AP',
        url: '/ap'
      },
      {
        id: PRE_AP_ACTIVITIES,
        name: large ? PRE_AP_ACTIVITIES : 'Pre-AP',
        url: '/preap'
      },
      {
        id: SPRINGBOARD_ACTIVITIES,
        name: large ? SPRINGBOARD_ACTIVITIES : 'SpringBoard',
        url: '/springboard'
      },
      {
        id: ELA_STANDARDS,
        name: large ? ELA_STANDARDS : 'Standards',
        url: '/activities/standard_level/7'
      }
    ]
  end
end
