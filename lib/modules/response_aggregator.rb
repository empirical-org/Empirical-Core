module ResponseAggregator

  def self.health_of_question(question_uid)
    total_number_of_responses = Response.where(question_uid: question_uid).count
    total_number_of_attempts = Response.where(question_uid: question_uid).sum('count')
    common_matched_attempts = Response.where(question_uid: question_uid).where('count > 4').sum('count')
    common_unmatched_attempts = Response.where(question_uid: question_uid, parent_id: nil, optimal: nil).where('count > 4').sum('count')
    return {
      total_number_of_responses: total_number_of_responses,
      total_number_of_attempts: total_number_of_attempts,
      common_matched_attempts: common_matched_attempts,
      common_unmatched_attempts: common_unmatched_attempts
    }
  end

  def self.optimality_counts_of_question(question_uid)
    human_optimal = Response.where(question_uid: question_uid, optimal: true, parent_id: nil).count
    human_suboptimal = Response.where(question_uid: question_uid, optimal: false, parent_id: nil).count
    algo_optimal = Response.where(question_uid: question_uid, optimal: true).where.not(parent_id: nil).count
    algo_suboptimal = Response.where(question_uid: question_uid, optimal: nil).where.not(parent_id: nil).count
    unmatched = Response.where(question_uid: question_uid, optimal: nil, parent_id: nil).count

    return {
      human_optimal: human_optimal,
      human_suboptimal: human_suboptimal,
      algo_optimal: algo_optimal,
      algo_suboptimal: algo_suboptimal,
      unmatched: unmatched
    }
  end

  # Human optimal = optimal:  true, parent_id: nil
  # Human suboptimal = optimal:  false, parent_id: nil
  # algo optimal = optimal:  true, parent_id: !nil
  # algo suboptimal = optimal:  nil, parent_id: !nil
  # unmatched = optimal: nil, parent_id: nil
end
