module ConceptTagHelper
  def all_concept_class_stats(activity_session)
    return '' unless activity_session.present?
    # Generate a header for each applicable concept class (activity session has concept tag results for that class)
    concept_tag_results = activity_session.concept_tag_results
    concept_classes = ConceptTagCategory.for_concept_tag_results(concept_tag_results)
    concept_classes.reduce "" do |html, concept_class|
      html += "<h1>" + concept_class.name + "</h1>"
      html += stats_for_concept_class(concept_class, concept_tag_results)
    end
  end

  private

  # TODO: These stats should all be pre-calculated and cached
  def stats_for_concept_class(concept_class, concept_tag_results)
    case concept_class.name
      when 'Typing Speed'
        typing_speed_stats(concept_tag_results)
      when 'Grammar Concepts'
        ''
      else
        raise "Cannot display concept class named '#{concept_class.name}'"
    end
  end

  def typing_speed_stats(concept_tag_results)
    # Currently there is only 1 statistic to account for.
    # When there are multiple concept tags for Typing Speed,
    # it would be better to iterate over them to generate the list.
    average_wpm = ConceptClassStats.average_wpm(concept_tag_results)
    "<div class='row'>" +
      "<div class='col-xs-9 col-sm-10 col-xl-10'>Average words per minute</div>" +
      "<div class='col-xs-3 col-sm-2 col-xl-2'>#{average_wpm}</div>" +
    "</div>"
  end
end
