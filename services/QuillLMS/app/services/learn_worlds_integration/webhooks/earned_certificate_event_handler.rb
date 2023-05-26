# frozen_string_literal: true

module LearnWorldsIntegration
  module Webhooks
    class EarnedCertificateEventHandler < AccountCourseEventHandler
      private def event_type
        LearnWorldsAccountCourseEvent::EARNED_CERTIFICATE
      end

      private def course_external_id
        data.dig('certificate', 'course_id')
      end

      private def learn_worlds_course
        LearnWorldsCourse.find_by!(external_id: course_external_id)
      end
    end
  end
end
