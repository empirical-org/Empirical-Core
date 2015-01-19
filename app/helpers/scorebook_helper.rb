module ScorebookHelper

  def percentage_color(score)
    return 'gray' unless score
    score = score.to_f / 100.0 if score > 1
    case score
    when 0.75..1.0
      'green'
    when 0.5..0.75
      'orange'
    when 0.0..0.5
      'red'
    else
      'gray'
    end
  end

  def icon_for_classification(classification)
    case classification.key
    when 'story'
      'flag'
    when 'practice_question_set'
      'puzzle'
    else
      ''
    end
  end

  def icon_for_classification_by_id(activity_classification_id)
    case activity_classification_id
    when 1
      'flag'
    when 2
      'puzzle'
    else
      ''
    end
  end

  def image_for_activity_classification_by_id(activity_classification_id)
    case activity_classification_id
    when 1
      'scorebook/icon-flag-gray.png'
    when 2
      'scorebook/icon-puzzle-gray.png'
    else
      ''
    end
  end

  def activity_planner_tooltip_html activity_hash # note: not an active record object, a hash
    activity_name = activity_hash['activity_name'].nil? ? '' : ("<h1>" + (activity_hash['activity_name'].gsub /"/, '&quot;') + "</h1>")
    activity_description = activity_hash['activity_description'].nil? ? '' : ("<p>" + (activity_hash['activity_description'].gsub /"/, '&quot;') + "</p>")

    app_name = activity_hash['activity_classification_name'].nil? ? '' : ("<p> App: " + (activity_hash['activity_classification_name'].gsub /"/, '&quot;') + "</p>")
    

    %Q(data-toggle="tooltip" data-html=true data-placement="left" title="#{activity_name}#{app_name}#{activity_description}").html_safe
  end

  def activity_icon_with_tooltip(activity_or_session, include_activity_title: false)
    activity, session = activity_and_session(activity_or_session)

    render partial: 'activity_icon_with_tooltip', locals: {
      activity: activity, 
      activity_session: session, 
      include_activity_title: include_activity_title
    }
  end

  def all_concept_class_stats(activity_session)
    return '' unless activity_session.present?
    # Generate a header for each applicable concept class (activity session has concept tag results for that class)
    concept_tag_results = activity_session.concept_tag_results
    # TODO Pull this into a model
    concept_classes = ConceptTagCategory.joins(:concept_tags => :concept_tag_results).where('concept_tag_results.id' => concept_tag_results).uniq
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

  # TODO: Extract into a separate helper
  def typing_speed_stats(concept_tag_results)
    average_wpm = ConceptClassStats.average_wpm(concept_tag_results)
    "<div class='row'>" +
      "<div class='col-xs-9 col-sm-10 col-xl-10'>Average words per minute</div>" +
      "<div class='col-xs-3 col-sm-2 col-xl-2'>#{average_wpm}</div>" +
    "</div>"
  end

  # Return both the activity and its session (if there is one)
  def activity_and_session(activity_or_session)
    if activity_or_session.respond_to?(:activity)
      [activity_or_session.activity, activity_or_session]
    else
      [activity_or_session, nil]
    end
  end
end
