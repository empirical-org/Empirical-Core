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
  end
end