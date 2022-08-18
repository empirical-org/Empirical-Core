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
    return "#{base_link}#diagnostics" unless recommendations_link_is_valid

    "#{base_link}#diagnostics/#{pre_diagnostic_id}/classroom/#{classroom_id}/recommendations"
  end

  def demo_account_growth_summary_link
    return "#{base_link}#diagnostics" unless growth_summary_link_is_valid

    "#{base_link}#diagnostics/#{post_diagnostic_id}/classroom/#{classroom_id}/growth_summary"
  end

  private def base_link
    teachers_progress_reports_diagnostic_reports_path
  end

  private def starter_diagnostic_pre_test
    @starter_diagnostic_pre_test ||= Activity.find_by_id(Activity::STARTER_DIAGNOSTIC_ACTIVITY_ID)
  end

  private def pre_diagnostic_id
    starter_diagnostic_pre_test&.id
  end

  private def post_diagnostic_id
    starter_diagnostic_pre_test&.follow_up_activity_id
  end

  private def classroom_id
    @classroom_id ||= current_user&.classrooms_i_own&.find { |c| c.name == DEMO_ACCOUNT_CLASSROOM_NAME }&.id
  end

  private def recommendations_link_is_valid
    return if classroom_id.nil?
    return if starter_diagnostic_pre_test.nil?

    unit_activities = current_user&.unit_activities&.where(activity_id: pre_diagnostic_id)

    return if unit_activities.none?
    return if ClassroomUnit.find_by(unit_id: unit_activities.map(&:unit_id), classroom_id: classroom_id).nil?

    true
  end

  private def growth_summary_link_is_valid
    return if classroom_id.nil?
    return if Activity.find_by(id: post_diagnostic_id).nil?

    unit_activities = current_user&.unit_activities&.where(activity_id: post_diagnostic_id)

    return if unit_activities.none?
    return if ClassroomUnit.find_by(unit_id: unit_activities.map(&:unit_id), classroom_id: classroom_id).nil?

    true
  end

end
