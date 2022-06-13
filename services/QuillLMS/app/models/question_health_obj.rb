# frozen_string_literal: true

class QuestionHealthObj
  QUESTION_TYPE_TO_URL = {
    :connect_sentence_combining => 'questions',
    :connect_sentence_fragments => 'sentence-fragments',
    :connect_fill_in_blanks => 'fill-in-the-blanks',
    :grammar => 'questions'
  }

  def initialize(activity, question, question_number, tool)
    @activity = activity
    @question = question
    @question_number = question_number
    @tool = tool
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def run
    health_dashboard = QuestionHealthDashboard.new(@activity.id, @question_number, @question.uid)
    data = @question.data
    {
      url: "#{ENV['DEFAULT_URL']&.to_s}/#{@tool}/#/admin/#{question_url}/#{@question&.uid}/responses",
      text: data["prompt"],
      flag: data["flag"],
      incorrect_sequences: data["incorrectSequences"]&.length,
      focus_points: data["focusPoints"]&.length,
      percent_common_unmatched: health_dashboard.cms_dashboard_stats["percent_common_unmatched"]&.round(2),
      percent_specified_algorithms: health_dashboard.cms_dashboard_stats["percent_specified_algos"]&.round(2),
      difficulty: health_dashboard.average_attempts_for_question&.round(2),
      percent_reached_optimal: health_dashboard.percent_reached_optimal_for_question&.round(2)
    }
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def question_url
    QUESTION_TYPE_TO_URL[@question.question_type.to_sym]
  end
end
