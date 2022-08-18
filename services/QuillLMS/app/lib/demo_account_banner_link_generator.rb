# frozen_string_literal: true

module DemoAccountBannerLinkGenerator
  extend ActiveSupport::Concern
  include ActionController::Helpers
  include QuillAuthentication

  DEMO_ACCOUNT_CLASSROOM_NAME = "Quill Classroom"

  included do
    helper_method :demo_account_recommendations_link, :demo_account_growth_summary_link
  end

  def demo_account_recommendations_link
    "#{base_link}#diagnostics/#{pre_diagnostic_id}/classroom/#{classroom_id}/recommendations"
  end

  def demo_account_growth_summary_link
    "#{base_link}#diagnostics/#{post_diagnostic_id}/classroom/#{classroom_id}/growth_summary"
  end

  private def base_link
    teachers_progress_reports_diagnostic_reports_path
  end

  private def starter_diagnostic_pre_test
    @starter_diagnostic_pre_test ||= Activity.find_by_id(Activity::STARTER_DIAGNOSTIC_ACTIVITY_ID)
  end

  private def pre_diagnostic_id
    starter_diagnostic_pre_test.id
  end

  private def post_diagnostic_id
    starter_diagnostic_pre_test.follow_up_activity_id
  end

  private def classroom_id
    @classroom_id ||= current_user&.classrooms_i_own&.find { |c| c.name == DEMO_ACCOUNT_CLASSROOM_NAME }&.id
  end
end
