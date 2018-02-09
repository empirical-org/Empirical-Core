module SegmentIo

  class << self
    attr_accessor :configuration
  end

  class Configuration
    attr_accessor :write_key
  end

  def self.configure
    self.configuration ||= Configuration.new
    yield(configuration)
  end

  module Events
    CLICK_SIGN_UP ||= 'Click Sign Up'
    TEACHER_ACCOUNT_CREATION ||= 'Teacher created an account'
    TEACHER_SIGNED_UP_FOR_NEWSLETTER ||= 'Teacher signed up for newsletter'
    STUDENT_ACCOUNT_CREATION ||= 'Student created an account'
    TEACHERS_STUDENT_ACCOUNT_CREATION ||= "Teacher's student account created"
    STUDENT_ENTERED_INVALID_CLASSCODE ||= "Student Entered Invalid Classcode"
    TEACHER_SIGNIN ||= 'Teacher signed in'
    STUDENT_SIGNIN ||= 'Student signed in'
    TEACHERS_STUDENT_SIGNIN ||= "Teacher's student signed in"
    CLASSROOM_CREATION ||= 'Teacher created a classroom'
    ACTIVITY_COMPLETION ||= 'Student completed an activity'
    ACTIVITY_ASSIGNMENT ||= 'Teacher assigned an activity'
    USER_COMPLETED_MILESTONE ||= 'User Completed Milestone'
    ASSIGN_FEATURED_ACTIVITY_PACK ||= 'Assign Featured Activity Pack'
    BUILD_YOUR_OWN_ACTIVITY_PACK ||= 'Build Your Own Activity Pack'
    ACCESS_PROGRESS_REPORT ||= 'Teacher opened progress report'
    ASSIGN_DIAGNOSTIC ||= 'Teacher assigned the diagnostic'
    ASSIGN_RECOMMENDATIONS ||= 'Teacher assigned the recommendations'
    ERROR_500 ||= '500 Error'
    BEGAN_TRIAL ||= 'Teacher began trial'
    BEGAN_PREMIUM ||= 'Teacher began trial'
    TEACHER_DELETED_STUDENT_ACCOUNT ||= 'Teacher deleted student account'
    MYSTERY_STUDENT_DELETION ||= 'Mystery student deletion'
    ACTIVITY_SEARCH ||= 'Activity search'
    STUDENT_LOGIN_PDF_DOWNLOAD ||= 'Student login PDF download'
    COTEACHER_INVITATION ||= 'Teacher invited a coteacher'
    TRANSFER_OWNERSHIP ||= 'Teacher transferred ownership of a classroom'
  end
end
