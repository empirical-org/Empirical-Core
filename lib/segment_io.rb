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
    TEACHER_ACCOUNT_CREATION = 'Teacher created an account'
    TEACHER_SIGNIN = 'Teached signed in'
    CLASSROOM_CREATION = 'Teacher created a classroom'
    ACTIVITY_COMPLETION = 'Student completed an activity'
    ACTIVITY_ASSIGNMENT = 'Teacher assigned an activity'
    STUDENT_ACCOUNT_CREATION_BY_TEACHER = 'Teacher created an account for a student'
  end
end