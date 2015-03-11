require_relative '../page'
require_relative './teachers'

module Teachers
  class ScorebookPage < Page
    attr_accessor :classroom

    def initialize(classroom)
      @classroom = classroom
    end

    def path
      "#{Teachers.classroom_path(self.classroom)}/scorebook"
    end
  end
end
