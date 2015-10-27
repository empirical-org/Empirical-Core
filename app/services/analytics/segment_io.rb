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
    CLICK_SIGN_UP = 'Click Sign Up'
    TEACHER_ACCOUNT_CREATION = 'Teacher created an account'
    TEACHER_SIGNED_UP_FOR_NEWSLETTER = 'Teacher signed up for newsletter'
    STUDENT_ACCOUNT_CREATION = 'Student created an account'
    TEACHERS_STUDENT_ACCOUNT_CREATION = "Teacher's student account created"
    TEACHER_SIGNIN = 'Teacher signed in'
    STUDENT_SIGNIN = 'Student signed in'
    TEACHERS_STUDENT_SIGNIN = "Teacher's student signed in"
    CLASSROOM_CREATION = 'Teacher created a classroom'
    ACTIVITY_COMPLETION = 'Student completed an activity'
    ACTIVITY_ASSIGNMENT = 'Teacher assigned an activity'
  end
end