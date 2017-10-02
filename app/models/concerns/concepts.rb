module Concepts

  # This groups all concept results by question type, then groups them by concept for the reports page

  extend ActiveSupport::Concern
  def all_concept_stats(activity_session)
    return '' unless activity_session.present?
    @concepts = activity_session.concepts
    @concept_results_by_question_type = activity_session.concept_results.group_by{|c| c.question_type}.values
    organize_by_type
  end

  private

  def human_readable_question_type question_type
    # return question_type with '-' changed to space, and each word capitalized, or just return 'Results'
    question_type ? question_type.gsub('-',' ').split.map(&:capitalize).join(' ') : 'Results'
  end

  def organize_by_type
    h = Hash.new {|h,k| h[k] = [] }
    @concepts.map do |concept|
      @concept_results_by_question_type.map do |cr|
        if cr.any?
          type = human_readable_question_type(cr.first['question_type'])
          h[type].push(stats_for_concept(concept, cr))
        end
      end
    end
    h
  end

  # TODO: These stats should all be pre-calculated and cached
  def stats_for_concept(concept, concept_results)
    correct_count = 0
    incorrect_count = 0
    concept_results.each do |result|
      next unless result.concept == concept
      if result.correct?
        correct_count += 1
      else
        incorrect_count += 1
      end
    end
   {
    conceptId: concept.id,
    conceptName: concept.name,
    correctCount: correct_count,
    incorrectCount: incorrect_count
    }
  end

end
