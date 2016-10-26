module Concepts

  extend ActiveSupport::Concern
  def all_concept_stats(activity_session)
    return '' unless activity_session.present?
    # Generate a header for each applicable concept class (activity session has concept tag results for that class)
    concept_results = activity_session.concept_results.partition{|c| c.metadata['questionUid']}
    # concept_results[0] is from sentence writing, [1] from story
    concepts = activity_session.concepts
    organize_by_type(concept_results, concepts)
  end

  private

  def human_readable_question_type question_type
    # return question_type with '-' changed to space, and each word capitalized, or just return 'Results'
    question_type ? question_type.gsub('-',' ').split.map(&:capitalize).join(' ') : 'Results'
  end

  def organize_by_type(concept_results, concepts)
    h = Hash.new {|h,k| h[k] = [] }
    concepts.map do |concept|
      concept_results.map do |cr|
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
