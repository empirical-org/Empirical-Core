# frozen_string_literal: true

module GetScoreForQuestion
  extend ActiveSupport::Concern

  def get_score_for_question(concept_results)
    if !concept_results.empty? && concept_results.first.question_score
      concept_results.first.question_score * 100
    else
      concept_results.max_by { |cr| cr.attempt_number }&.correct ? 100 : 0
    end
  end

end
