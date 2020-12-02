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

  module BackgroundEvents
    TEACHER_ACCOUNT_CREATION ||= 'Teacher created an account'
    TEACHER_SIGNED_UP_FOR_NEWSLETTER ||= 'Teacher signed up for newsletter'
    TEACHERS_STUDENT_ACCOUNT_CREATION ||= "Teacher's student account created"
    TEACHER_SIGNIN ||= 'Teacher signed in'
    TEACHERS_STUDENT_SIGNIN ||= "Teacher's student signed in"
    CLASSROOM_CREATION ||= 'Teacher created a classroom'
    ACTIVITY_COMPLETION ||= 'Student completed an activity'
    ACTIVITY_PACK_ASSIGNMENT ||= 'Teacher assigned an activity pack'
    ACTIVITY_ASSIGNMENT ||= 'Teacher assigned an activity'
    DIAGNOSTIC_ASSIGNMENT ||= 'Teacher assigned a diagnostic'
    ACCESS_PROGRESS_REPORT ||= 'Teacher opened progress report'
    ASSIGN_RECOMMENDATIONS ||= 'Teacher assigned a recommended activity pack'
    ASSIGN_ALL_RECOMMENDATIONS ||= 'Teacher assigned all recommended activity packs'
    ERROR_500 ||= '500 Error'
    BEGAN_PREMIUM_TRIAL ||= 'Teacher began teacher premium trial'
    BEGAN_SCHOOL_PREMIUM ||= 'Teacher began paid school premium'
    BEGAN_TEACHER_PREMIUM ||= 'Teacher began paid teacher premium'
    TEACHER_DELETED_STUDENT_ACCOUNT ||= 'Teacher deleted student account'
    MYSTERY_STUDENT_DELETION ||= 'Mystery student deletion'
    ACTIVITY_SEARCH ||= 'Activity search'
    STUDENT_LOGIN_PDF_DOWNLOAD ||= 'Student login PDF download'
    REFERRAL_INVITED ||= "A new teacher signed up from this teacher's referral link"
    REFERRAL_ACTIVATED ||= "One of this teacher's referrals is now active"
    COTEACHER_INVITATION ||= 'Teacher invited a coteacher'
    TRANSFER_OWNERSHIP ||= 'Teacher transferred ownership of a classroom'
  end

  module Events
    # New events that may overlap with those defined in a front-end React module
  end

end
