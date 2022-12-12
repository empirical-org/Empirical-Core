# frozen_string_literal: true

class Api::V1::RuleFeedbackHistoriesController < Api::ApiController
  def by_conjunction
    raise ArgumentError unless params.include?('activity_id') && params.include?('conjunction')

    options = params.permit(:conjunction, :activity_id, :start_date, :end_date).to_h.symbolize_keys
    report = RuleFeedbackHistory.generate_report(**options)
    render json: { rule_feedback_histories: report }
  end

  def rule_detail
    raise ArgumentError unless params.include?('rule_uid') && params.include?('prompt_id')

    options = params.permit(:rule_uid, :prompt_id, :start_date, :end_date).to_h.symbolize_keys
    report = RuleFeedbackHistory.generate_rulewise_report(**options)
    render json: report
  end

  def prompt_health
    raise ArgumentError unless params.include?('activity_id')

    options = params.permit(:activity_id, :start_date, :end_date).to_h.symbolize_keys
    report = PromptFeedbackHistory.run(**options)
    render json: report
  end

  def activity_health
    raise ArgumentError unless params.include?('activity_id')

    report = ActivityFeedbackHistory.run({activity_id: params['activity_id']})
    render json: report
  end
end
