# frozen_string_literal: true

module GoogleIntegration
  class CourseStudentsIterator
    include Enumerable

    attr_reader :api, :course_id

    def initialize(api, course_id)
      @api = api
      @course_id = course_id
    end

    def each
      next_page_token = nil

      loop do
        response = api.list_course_students(course_id, page_token: next_page_token)
        yield response if block_given?
        next_page_token = response.next_page_token

        break if next_page_token.nil?
      end
    end
  end
end
