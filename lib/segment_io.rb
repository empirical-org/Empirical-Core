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
    STUDENT_ACCOUNT_CREATION = 'Student Account Creation'
    TEACHER_ACCOUNT_CREATION = 'Teacher Account Creation'
    CLASSROOM_CREATION = 'Classroom Creation'
    ACTIVITY_COMPLETION = 'Activity Completion'
    STUDENT_ACCOUNT_CREATION_BY_TEACHER = 'Student Account Creation by Teacher'
  end
end