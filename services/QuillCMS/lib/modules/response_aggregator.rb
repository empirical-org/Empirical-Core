module ResponseAggregator
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

  def health_of_question_obj(question_uid)
    total_number_of_responses = Response.where(question_uid: question_uid).count
    total_number_of_attempts = Response.where(question_uid: question_uid).sum('count')
    common_matched_attempts = Response.where(question_uid: question_uid).where('count > 4').sum('count')
    common_unmatched_attempts = Response.where(question_uid: question_uid, parent_id: nil, optimal: nil).where('count > 4').sum('count')
    common_unmatched_responses = Response.where(question_uid: question_uid, parent_id: nil, optimal: nil).where('count > 4').count

    {
      total_number_of_responses: total_number_of_responses,
      total_number_of_attempts: total_number_of_attempts,
      common_matched_attempts: common_matched_attempts,
      common_unmatched_attempts: common_unmatched_attempts,
      common_unmatched_responses: common_unmatched_responses
    }
  end

  def optimality_counts_of_question(question_uid)
    human_optimal = Response.where(question_uid: question_uid, optimal: true, parent_id: nil).sum('count')
    human_suboptimal = Response.where(question_uid: question_uid, optimal: false, parent_id: nil).sum('count')
    algo_optimal = Response.where(question_uid: question_uid, optimal: true).where.not(parent_id: nil).sum('count')
    algo_suboptimal = Response.where(question_uid: question_uid, optimal: nil).where.not(parent_id: nil).sum('count')
    unmatched = Response.where(question_uid: question_uid, optimal: nil, parent_id: nil).sum('count')

    {
      "Human Optimal": human_optimal,
      "Human Sub-Optimal": human_suboptimal,
      "Algorithm Optimal": algo_optimal,
      "Algorithm Sub-Optimal": algo_suboptimal,
      "Unmatched": unmatched
    }
  end

  def question_dashboard_data(question_uid)
    total_number_of_responses = Response.where(question_uid: question_uid).sum('count')
    common_unmatched = Response.where(question_uid: question_uid, parent_id: nil, optimal: nil).where('count >= 10').sum('count')
    algorithm_matched = Response.where(question_uid: question_uid, author: DASHBOARD_ALGOS).sum('count')

    {
      percent_common_unmatched: (common_unmatched.to_f / (total_number_of_responses.nonzero? || 1)) * 100,
      percent_specified_algos: (algorithm_matched.to_f / (total_number_of_responses.nonzero? || 1)) * 100
    }
  end

  # Human optimal = optimal:  true, parent_id: nil
  # Human suboptimal = optimal:  false, parent_id: nil
  # algo optimal = optimal:  true, parent_id: !nil
  # algo suboptimal = optimal:  nil, parent_id: !nil
  # unmatched = optimal: nil, parent_id: nil
end
