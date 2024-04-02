# frozen_string_literal: true

module LearnWorldsIntegration
  module Webhooks
    class EnrolledFreeCourseEventHandler < AccountCourseEventHandler
      private def course_external_id
        data.dig('course', 'id')
      end

      private def course_title
        data.dig('course', 'title')
      end

      private def event_type
        LearnWorldsAccountCourseEvent::ENROLLED
      end

      private def learn_worlds_course
        LearnWorldsCourse.find_or_create_by!(external_id: course_external_id, title: course_title)
      end
    end
  end
end
