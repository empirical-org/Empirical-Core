require_relative '../page'
require_relative './teachers'

module Teachers
  class ScorebookPage < Page
    def self.path(classroom)
      "#{Teachers.classroom_path(classroom)}/scorebook"
    end
  end
end
