# frozen_string_literal: true

module TeacherCenterHelper
  FAQ = 'FAQ'
  PREMIUM = 'Premium'
  RESEARCH = 'Research'
  COMPREHENSION = 'Reading comprehension'
  ALL = 'All'

  def teacher_center_tabs(large: true)
    premium_tab = {
      id: PREMIUM,
      name: PREMIUM,
      url: 'premium'
    }
    tabs = [
      {
        id: BlogPost::ALL_RESOURCES,
        name: ALL,
        url: 'teacher-center'
      },
      {
        id: BlogPost::USING_QUILL_FOR_READING_COMPREHENSION,
        name: COMPREHENSION,
        url: 'teacher-center/topic/using-quill-for-reading-comprehension'
      },
      {
        id: BlogPost::GETTING_STARTED,
        name: BlogPost::GETTING_STARTED,
        url: 'teacher-center/topic/getting-started'
      },
      {
        id: BlogPost::BEST_PRACTICES,
        name: BlogPost::BEST_PRACTICES,
        url: 'teacher-center/topic/best-practices'
      },
      {
        id: BlogPost::WRITING_INSTRUCTION_RESEARCH,
        name: RESEARCH,
        url: 'teacher-center/topic/writing-instruction-research'
      },
      {
        id: FAQ,
        name: FAQ,
        url: 'faq'
      }
    ]
    tabs << premium_tab if !current_user
    tabs
  end

  def student_center_tabs(large: true)
    [
     {
       id: BlogPost::ALL_RESOURCES,
       name: large ? BlogPost::ALL_RESOURCES : ALL,
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

  def explore_curriculum_tabs(large: true)
    [
      {name: large ? 'Featured Activities' : 'Featured', url: 'activities/packs'},
      {name: large ? 'AP Activities' : 'AP', url: 'ap'},
      {name: large ? 'Pre-AP Activities' : 'Pre-AP', url: 'preap'},
      {name: large ? 'SpringBoard Activities' : 'SpringBoard', url: 'springboard'},
      {name: large ? 'ELA Standards' : 'Standards', url: 'activities/standard_level/7'}
    ]
  end
end
