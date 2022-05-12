# frozen_string_literal: true

module VitallyIntegration
  class CreateSalesRecordsWorker
    include Sidekiq::Worker

    FALLBACK_NAME = 'Unknown School'

    def perform(sales_form_submission_id)
      sales_form_submission = SalesFormSubmission.find(sales_form_submission_id)
      return if User.find_by(email: sales_form_submission.email, role: 'teacher').present? || SalesFormSubmission.where(email: sales_form_submission.email).count > 1

      CreateVitallyContactWorker.new.perform(sales_form_submission.id)
    end
  end
end
