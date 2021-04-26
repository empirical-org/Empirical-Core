class SerializeActivityHealth
  CLASSIFICATION_TO_TOOL = {
    :connect => "connect",
    :sentence => "grammar"
  }
  MAX_SESSIONS_VIEWED = 500

  def initialize(activity)
    @activity = activity
  end

  # wht precision do we want these numbers
  def data
    {
      name: @activity.name,
      url: "#{ENV['DEFAULT_URL']}/#{tool}/#/admin/lessons/#{@activity.uid}",
      activity_categories: @activity.activity_categories.pluck(:name),
      content_partners: @activity.content_partners.pluck(:name),
      tool: tool,
      recent_assignments: recent_assignments,
      diagnostics: diagnostics,
      activity_packs: @activity.units.pluck(:name),
      avg_mins_to_complete: avg_mins_to_complete,
      avg_difficulty: average(prompt_data, :difficulty),
      avg_common_unmatched: average(prompt_data, :percent_common_unmatched),
      standard_dev_difficulty: standard_deviation(prompt_data, :difficulty),
    }
  end

  def prompt_data
    questions = @activity.data["questions"]
    return [] if !questions.present?

    @questions_arr ||= questions.each.with_index(1).map do |q, question_number|
      question = Question.find_by(uid: q["key"])
      question.present? ? QuestionHealthObj.new(@activity, question, question_number, tool).run : {}
    end
  end

  private def tool
    CLASSIFICATION_TO_TOOL[ActivityClassification.find(@activity.activity_classification_id).key.to_sym]
  end

  private def avg_mins_to_complete
    all_session_lengths = ActivitySession
      .where(activity: @activity, state: "finished")
      .last(MAX_SESSIONS_VIEWED)
      .map { |a| a.completed_at && a.started_at ? (a.completed_at - a.started_at)/60: 0 }
      .reject{ |b| b==0 }
    all_session_lengths.empty? ? nil : (all_session_lengths.reduce(:+).to_f / all_session_lengths.size).round(2)
  end

  # how do we want to calculate this?
  private def recent_assignments
    if !@activity.classroom_units.empty? && @activity.classroom_units.order(:created_at).first.created_at <= Date.today - 3.months
      @activity.classroom_units.where("classroom_units.created_at >= ?", Date.today - 3.months).count
    else
      nil
    end
  end

  private def diagnostics
    @activity.unit_templates&.map {|ut| ut.recommendations}&.map{|r| r.map{|rr| rr.activity.name}}&.reject{|n| n == ''}&.flatten
  end

  private def average(list, attribute)
    return nil if list.empty?
    (list.map {|p| p[attribute] }.sum(0.0) / list.size).round(2)
  end

  private def standard_deviation(list, attribute)
    return nil if list.empty?
    list = list.map {|p| p[attribute] }
    mean = list.sum(0.0) / list.size
    squares = list.map {|m| (m - mean) ** 2}
    Math.sqrt(squares.sum(0.0) / list.size).round(2)
  end
end
