# frozen_string_literal: true

class SerializeActivityHealth
  CLASSIFICATION_TO_TOOL = {
    connect: "connect",
    sentence: "grammar"
  }
  MAX_SESSIONS_VIEWED = 500
  PRODUCTION_FLAG = "production"

  def initialize(activity)
    @activity = activity
  end

  def data
    {
      name: @activity.name,
      url: "#{ENV['DEFAULT_URL']}/#{tool}/#/admin/lessons/#{@activity.uid}",
      flag: @activity.flag.to_s,
      activity_categories: @activity.activity_categories.pluck(:name).sort,
      content_partners: @activity.content_partners.pluck(:name).sort,
      tool: tool,
      recent_plays: recent_plays,
      diagnostics: diagnostics.sort,
      activity_packs: @activity.unit_templates.where(flag: PRODUCTION_FLAG).map {|ut| { id: ut.id, name: ut.name}},
      avg_mins_to_complete: avg_mins_to_complete,
      avg_difficulty: average(prompt_data, :difficulty),
      avg_common_unmatched: average(prompt_data, :percent_common_unmatched),
      standard_dev_difficulty: standard_deviation(prompt_data, :difficulty),
    }
  end

  def prompt_data
    questions = @activity.data["questions"]
    return [] if !questions.present?

    @questions_arr ||= questions.each.with_index(1).map { |q, question_number|
      question = Question.find_by(uid: q["key"])
      question.present? ? QuestionHealthObj.new(@activity, question, question_number, tool).run : nil
    }.compact
  end

  private def tool
    CLASSIFICATION_TO_TOOL[ActivityClassification.find(@activity.activity_classification_id).key.to_sym]
  end

  private def avg_mins_to_complete
    all_session_lengths = ActivitySession
      .where(activity: @activity, state: "finished")
      .last(MAX_SESSIONS_VIEWED)
      .map(&:minutes_to_complete)
      .reject{ |b| !b || b==0 }
    all_session_lengths.empty? ? nil : (all_session_lengths.sum.to_f / all_session_lengths.size).round(2)
  end

  private def recent_plays
    if !@activity.classroom_units.empty? && @activity.classroom_units.order(:created_at).first.created_at <= Date.current - 3.months
      ActivitySession.where("started_at >= ?", Date.current - 3.months).where(state: "finished", activity_id: @activity.id).count
    else
      nil
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  private def diagnostics
    @activity.unit_templates&.map {|ut| ut.recommendations}&.map{|r| r.map{|rr| rr.activity.name}}&.reject{|n| n == ''}&.flatten
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def average(list, attribute)
    return nil if list.empty?

    (list.map {|p| p[attribute] || 0}.sum(0.0) / list.size).round(2)
  end

  private def standard_deviation(list, attribute)
    return nil if list.empty?

    list = list.map {|p| p[attribute] }
    mean = list.sum(0.0) / list.size
    squares = list.map {|m| (m - mean) ** 2}
    Math.sqrt(squares.sum(0.0) / list.size).round(2)
  end
end
