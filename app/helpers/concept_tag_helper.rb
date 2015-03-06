module ConceptTagHelper
  def all_concept_class_stats(activity_session)
    return '' unless activity_session.present?
    # Generate a header for each applicable concept class (activity session has concept tag results for that class)
    concept_tag_results = activity_session.concept_tag_results
    concept_classes = ConceptClass.for_concept_tag_results(concept_tag_results)
    concept_classes.reduce "" do |html, concept_class|
      html += stats_for_concept_class(concept_class, concept_tag_results)
    end
  end

  def grammar_concepts_stats(concept_tag_results)
    grammar_counts = concept_tag_results.grammar_counts
    grammar_counts.map do |grammar_count|
    "<div class='row'>" +
      "<div class='col-xs-8 col-sm-8 col-xl-8'>#{grammar_count.name}</div>" +
      "<div class='col-xs-2 col-sm-2 col-xl-2 correct-answer'>#{grammar_count.correct_result_count}</div>" +
      "<div class='col-xs-2 col-sm-2 col-xl-2 incorrect-answer'>#{grammar_count.incorrect_result_count}</div>" +
    "</div>"
    end.join('')
  end

  def typing_speed_stats(concept_tag_results)
    average_wpm = concept_tag_results.average_wpm
    "<div class='row'>" +
      "<div class='col-xs-9 col-sm-10 col-xl-10'>Average words per minute</div>" +
      "<div class='col-xs-3 col-sm-2 col-xl-2'>#{average_wpm}</div>" +
    "</div>"
  end

  private

  # TODO: These stats should all be pre-calculated and cached
  def stats_for_concept_class(concept_class, concept_tag_results)
    case concept_class.name
      when 'Typing Speed'
        concept_class_header(concept_class) + typing_speed_stats(concept_tag_results)
      when 'Grammar Concepts'
        concept_class_header(concept_class) + grammar_concepts_stats(concept_tag_results)
      else
        ''
    end
  end

  def concept_class_header(concept_class)
    "<h1 class='concept-class'>" + concept_class.name + "</h1>"
  end
end
