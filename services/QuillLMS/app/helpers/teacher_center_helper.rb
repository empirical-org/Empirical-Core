
module TeacherCenterHelper
  FAQ = 'FAQ'
  PREMIUM = 'Premium'
  RESEARCH_SHORT = 'Research'
  ALL_SHORT = 'All'

  def teacher_center_tabs(large: true)
     [
      {
        id: BlogPost::ALL_RESOURCES,
        name: large ? BlogPost::ALL_RESOURCES : ALL_SHORT,
        url: 'teacher-center'
      },
      {
        id: BlogPost::GETTING_STARTED,
        name: BlogPost::GETTING_STARTED,
        url: 'teacher-center/topic/getting-started'
      },
      {
        id: BlogPost::TEACHER_STORIES,
        name: BlogPost::TEACHER_STORIES,
        url: 'teacher-center/topic/teacher-stories'
      },
      {
        id: BlogPost::WRITING_INSTRUCTION_RESEARCH,
        name: large ? BlogPost::WRITING_INSTRUCTION_RESEARCH : RESEARCH_SHORT,
        url: 'teacher-center/topic/writing-instruction-research'
      },
      {
        id: FAQ,
        name: FAQ,
        url: 'faq'
      },
      {
        id: PREMIUM,
        name: PREMIUM,
        url: 'premium'
      }
    ]
  end

  def student_center_tabs(large: true)
     [
      {
        id: BlogPost::ALL_RESOURCES,
        name: large ? BlogPost::ALL_RESOURCES : ALL_SHORT,
        url: 'student-center'
      },
      {
        id: BlogPost::GETTING_STARTED,
        name: BlogPost::GETTING_STARTED,
        url: 'student-center/topic/student-getting-started'
      },
      {
        id: BlogPost::HOW_TO,
        name: BlogPost::HOW_TO,
        url: 'student-center/topic/student-how-to'
      }
    ]
  end
end
