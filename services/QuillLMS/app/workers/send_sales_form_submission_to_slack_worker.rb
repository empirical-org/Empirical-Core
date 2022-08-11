# frozen_string_literal: true

class SendSalesFormSubmissionToSlackWorker
  include Sidekiq::Worker
  include SlackTasks

  def perform(sales_form_submission_id)
    sales_form_submission = SalesFormSubmission.find(sales_form_submission_id)
    post_sales_form_submission(sales_form_submission)
  end
end
