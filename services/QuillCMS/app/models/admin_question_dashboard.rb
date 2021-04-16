class AdminQuestionDashboard
  DASHBOARD_ALGOS = [
    "Words Out of Order Hint",
    "Missing Word Hint",
    "Flexible Missing Word Hint",
    "Modified Word Hint",
    "Flexible Modified Word Hint",
    "Additional Word Hint",
    "Flexible Additional Word Hint",
    "Required Words Hint"
  ]

  def self.health(question_uid)
    total_number_of_responses = Response.where(question_uid: question_uid).sum('count')
    common_unmatched = Response.where(question_uid: question_uid, parent_id: nil, optimal: nil).where('count >= 10').sum('count')
    algorithm_matched = Response.where(question_uid: question_uid, author: DASHBOARD_ALGOS).sum('count')

    {
      percent_common_unmatched: total_number_of_responses.zero? ? 0 : (common_unmatched.to_f / total_number_of_responses) * 100,
      percent_specified_algos: total_number_of_responses.zero? ? 0 : (algorithm_matched.to_f / total_number_of_responses) * 100
    }
  end
end