require_relative '../page'
require_relative './teachers'

module Teachers
  class ScorebookPage < Page
    attr_accessor :classroom

    def initialize(classroom)
      @classroom = classroom
    end

    def path
      "/teachers/classrooms/scorebook"
    end

    def students
      all('.student-name').map(&:text)
    end

    def visit
      page.visit path
    end
  end
end
