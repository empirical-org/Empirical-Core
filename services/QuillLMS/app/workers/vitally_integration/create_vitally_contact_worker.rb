# frozen_string_literal: true

module VitallyIntegration
  class CreateVitallyContactWorker
    include Sidekiq::Worker

    FALLBACK_NAME = 'Unknown School'

    def perform(sales_form_submission_id)
      sales_form_submission = SalesFormSubmission.find(sales_form_submission_id)
      school = School.find_by(name: sales_form_submission.school_name) || School.find_by(name: FALLBACK_NAME)

      VitallyRestApi.new.create_contact({
        externalId: "contact-#{sales_form_submission.id}",
        accountIds: [school.id],
        name: sales_form_submission.first_name + " " + sales_form_submission.last_name,
        email: sales_form_submission.email,
        traits: {
          phone: sales_form_submission.phone_number,
          zipcode: sales_form_submission.zipcode,
          school_premium_count_estimate: sales_form_submission.school_premium_count_estimate,
          teacher_premium_count_estimate: sales_form_submission.teacher_premium_count_estimate,
          student_premium_count_estimate: sales_form_submission.student_premium_count_estimate
        }
      })
    end
  end
end
