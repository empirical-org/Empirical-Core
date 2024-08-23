# frozen_string_literal: true

class EvidenceUpdateScoringWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::MIGRATION

  attr_reader :concept_results

  def perform(activity_session_id)
    @concept_results = ConceptResult.where(activity_session_id:)

    return if concept_results.empty?
    return if unscored?

    process_grouped_by_question
  end

  private def unscored? = concept_results.first.question_score.nil?
  private def updated_score(question_results) = last_attempt_correct?(question_results) ? 1.0 : 0.0

  private def process_grouped_by_question
    concept_results.group_by(&:question_number).values.each do |question_results|
      # All cases in the old scoring system that were 100s are still 100s in the updated system
      next if question_results.first.question_score == 1

      update_scores(question_results)
    end
  end

  private def update_scores(question_results)
    question_score = updated_score(question_results)

    question_results.each do |concept_result|
      next if concept_result.question_score == question_score

      concept_result.update(question_score:)
    end
  end

  private def last_attempt_correct?(question_results)
    last_attempt = question_results.map(&:attempt_number).max

    # If a student didn't need all five of their attempts, they must have gotten the question right
    return true if last_attempt < 5

    # If a student uses five attempts, they count as getting the question correct if all concept_results for the last attempt are correct, and incorrect if any concept_results are incorrect
    question_results.select { |cr| cr.attempt_number == last_attempt }
      .map(&:correct)
      .all?
  end
end
