module ScorebookHelper

  def percentage_color(score)
    return 'gray' unless score
    score = score.to_f / 100.0 if score > 1
    score = score.round(2)
    case score
    when 0.76..1.0
      'green'
    when 0.5..0.75
      'orange'
    when 0.0..0.49
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

  def scorebook_path(teacher)
    if teacher.has_classrooms?
      scorebook_teachers_classrooms_path
    else
      ''
    end
  end

  def alias_by_id id
    case id
    when 1
      'Quill Proofreader'
    when 2
      'Quill Grammar'
    end
  end



  def activity_planner_tooltip_html activity_hash # note: not an active record object, a hash
    activity_name = activity_hash['activity_name'].nil? ? '' : ("<h1>" + (activity_hash['activity_name'].gsub /"/, '&quot;') + "</h1>")
    activity_description = activity_hash['activity_description'].nil? ? '' : ("<p>" + (activity_hash['activity_description'].gsub /"/, '&quot;') + "</p>")

    app_name = activity_hash['activity_classification_name'].nil? ? '' : ("<p> App: " + (activity_hash['activity_classification_name'].gsub /"/, '&quot;') + "</p>")


    %Q(data-toggle="tooltip" data-html=true data-placement="left" title="#{activity_name}#{app_name}#{activity_description}").html_safe
  end

  def activity_icon_with_tooltip(activity, activity_session, include_activity_title: false)
    #activity, session = activity_and_session(activity_or_session)

    render partial: 'activity_icon_with_tooltip', locals: {
      activity: activity,
      activity_session: activity_session,
      include_activity_title: include_activity_title
    }
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
