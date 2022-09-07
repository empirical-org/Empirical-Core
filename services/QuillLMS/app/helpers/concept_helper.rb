# frozen_string_literal: true

module ConceptHelper
  def all_concept_stats(activity_session)
    return '' unless activity_session.present?

    # Generate a header for each applicable concept class (activity session has concept tag results for that class)
    concept_results = activity_session.concept_results
    concepts = activity_session.concepts
    concepts.reduce "" do |html, concept|
      html += stats_for_concept(concept, concept_results)
    end
  end

  # TODO: These stats should all be pre-calculated and cached
  private def stats_for_concept(concept, concept_results)
    correct_count = 0
    incorrect_count = 0
    concept_results.each do |result|
      next unless result.concept == concept

      if result.correct
        correct_count += 1
      else
        incorrect_count += 1
      end
    end
    "<div class='row'>" \
      "<div class='col-xs-8 col-sm-8 col-xl-8'>#{concept.name}</div>" \
      "<div class='col-xs-2 col-sm-2 col-xl-2 correct-answer'>#{correct_count}</div>" \
      "<div class='col-xs-2 col-sm-2 col-xl-2 incorrect-answer'>#{incorrect_count}</div>" \
      "</div>"
  end
end
