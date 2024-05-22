# frozen_string_literal: true

module TeacherCenterHelper
  FAQ = 'FAQ'
  PREMIUM = 'Premium'
  RESEARCH = 'Research'
  FEATURED_ACTIVITIES = 'Featured Activities'
  AP_ACTIVITIES = 'AP Activities'
  PRE_AP_ACTIVITIES = 'Pre-AP Activities'
  SPRINGBOARD_ACTIVITIES = 'SpringBoard Activities'
  ELA_STANDARDS = 'ELA Standards'

  def teacher_center_tabs
    [
      {
        id: BlogPost::ALL_RESOURCES,
        name: BlogPost::ALL_RESOURCES,
        url: '/teacher-center'
      },
      {
        id: BlogPost::WHATS_NEW,
        name: BlogPost::WHATS_NEW,
        url: "/teacher-center/topic/whats-new"
      },
      {
        id: BlogPost::WRITING_FOR_LEARNING,
        name: BlogPost::WRITING_FOR_LEARNING,
        url: '/teacher-center/topic/writing-for-learning'
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
        name: BlogPost::WRITING_INSTRUCTION_RESEARCH,
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
      }
    ]
  end

  def student_center_tabs
    [
     {
       id: BlogPost::ALL_RESOURCES,
       name: BlogPost::ALL_RESOURCES,
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

  def explore_curriculum_tabs
    [
      {
        id: FEATURED_ACTIVITIES,
        name: FEATURED_ACTIVITIES,
        url: '/activities/packs'
      },
      {
        id: AP_ACTIVITIES,
        name: AP_ACTIVITIES,
        url: '/ap'
      },
      {
        id: PRE_AP_ACTIVITIES,
        name: PRE_AP_ACTIVITIES,
        url: '/preap'
      },
      {
        id: SPRINGBOARD_ACTIVITIES,
        name: SPRINGBOARD_ACTIVITIES,
        url: '/springboard'
      },
      {
        id: ELA_STANDARDS,
        name: ELA_STANDARDS,
        url: '/activities/standard_level/7'
      }
    ]
  end
end
