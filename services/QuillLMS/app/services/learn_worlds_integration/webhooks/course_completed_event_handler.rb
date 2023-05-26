# frozen_string_literal: true

module LearnWorldsIntegration
  module Webhooks
    class CourseCompletedEventHandler < AccountCourseEventHandler
      private def course_external_id
        data.dig('course', 'id')
      end

      private def event_type
        LearnWorldsAccountCourseEvent::COMPLETED
      end

      private def learn_worlds_course
        LearnWorldsCourse.find_by!(external_id: course_external_id)
      end
    end
  end
end
