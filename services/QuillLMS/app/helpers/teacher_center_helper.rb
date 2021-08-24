module TeacherCenterHelper
  FAQ = 'FAQ'
  PREMIUM = 'Premium'
  RESEARCH = 'Research'
  COMPREHENSION = 'Reading comprehension'
  ALL = 'All'

  def teacher_center_tabs(large: true)
    is_comprehension_user = current_user && AppSetting.enabled?(name: AppSetting::COMPREHENSION, user: current_user)
    comprehension_tab = {
      id: BlogPost::USING_QUILL_FOR_READING_COMPREHENSION,
      name: COMPREHENSION,
      url: 'teacher-center/topic/using-quill-for-reading-comprehension'
    }
    premium_tab = {
      id: PREMIUM,
      name: PREMIUM,
      url: PREMIUM
    }
    tabs = [
      {
        id: BlogPost::ALL_RESOURCES,
        name: ALL,
        url: 'teacher-center'
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
    tabs.insert(1, comprehension_tab) if is_comprehension_user
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
end
