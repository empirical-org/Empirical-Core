class QuestionHealthObj

  def initialize(activity, question, question_number, tool)
    @activity = activity
    @question = question
    @question_number = question_number
    @tool = tool
  end

  def run
    health_dashboard = QuestionHealthDashboard.new(@activity.id, @question_number, @question.uid)
    data = @question.data
    {
      url: ENV['DEFAULT_URL'].to_s + "/" + @tool + "/#/admin/questions/" + @question.uid + "/responses",
      text: data["prompt"],
      flag: data["flag"],
      number_of_incorrect_sequences: data["incorrectSequences"].length,
      number_of_focus_points: data["focusPoints"].length,
      percent_common_unmatched: health_dashboard.cms_dashboard_stats["percent_common_unmatched"],
      percent_specified_algorithms: health_dashboard.cms_dashboard_stats["percent_specified_algos"],
      difficulty: health_dashboard.average_attempts_for_question,
      percent_reached_optimal: health_dashboard.percent_reached_optimal_for_question
    }
  end
end
