# frozen_string_literal: true

module GoogleIntegration
  class CourseStudentsAggregator < ::ApplicationService
    attr_reader :iterator

    def initialize(api, course_id)
      @iterator = CourseStudentsIterator.new(api, course_id)
    end

    def run
      iterator.reduce([]) { |students_data, response| students_data + (response.students || []) }
    end
  end
end
