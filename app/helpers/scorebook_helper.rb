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

  def tooltip_html(activity_or_session)
    if !activity_or_session.nil?
      activity, session = if activity_or_session.respond_to?(:activity)
        [activity_or_session.activity, activity_or_session]
      else
        [activity_or_session, nil]
      end

      # deal with nested quotes
      activity_name = activity.name.gsub /"/, '&quot;'
      activity_classification_name = activity.classification.name.gsub /"/, '%quot;'
      activity_section_name = activity.section.name.gsub /"/, '&quot;'
      activity_topic_name = activity.topic.name.gsub /"/, '%quot;'

      %Q(data-toggle="tooltip" data-placement="left" title="<h1>#{activity_name}</h1><p>#{activity_classification_name}</p><p>#{activity_section_name}: #{activity.topic.name}</p>#{session && session.percentage ? "<p>Scored #{session.percentage_as_percent}</p>" : ''}").html_safe
      
    else
      ''
    end
  end

end
