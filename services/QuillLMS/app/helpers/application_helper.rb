module ApplicationHelper

  def next_page
    next_action = pages[pages.index(params[:action]) + 1] || 'home'
    url_for(controller: 'pages', action: next_action)
  end

  def pages
    %w(home
       the_peculiar_institution
       democracy_in_america
       aggregation)
  end

  def question_section
  end

  def combine(array_1, array_2)
    array_1 + array_2
  end

  def body_class
    @body_class
  end

  def body_id
    @body_id
  end

  def active_on_first(i)
    "active" if i == 0
  end

  def root_path
    root_url
  end

  def ordinal(n)
    ending = case n % 100
             when 11, 12, 13 then 'th'
             else
               case n % 10
               when 1 then 'st'
               when 2 then 'nd'
               when 3 then 'rd'
               else 'th'
               end
             end
    "#{n}#{ending}"
  end

  def activity_student_report_path(activity_session)
    unit_id      = activity_session.unit.id
    activity_id  = activity_session.activity.id
    classroom_id = activity_session.classroom.id

    "/teachers/progress_reports/diagnostic_reports#/" +
    "u/#{unit_id}/a/#{activity_id}/c/#{classroom_id}/student_report/" +
    "#{activity_session.id}"
  end
end
