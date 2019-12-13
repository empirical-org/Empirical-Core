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

  def combine(array1, array2)
    array1 + array2
  end

  def body_class
    @body_class
  end

  def body_id
    @body_id
  end

  def active_on_first(integer_active)
    "active" if integer_active == 0
  end

  def root_path
    root_url
  end

  def ordinal(number)
    ending = case number % 100
             when 11, 12, 13 then 'th'
             else
               case number % 10
               when 1 then 'st'
               when 2 then 'nd'
               when 3 then 'rd'
               else 'th'
               end
             end
    "#{number}#{ending}"
  end

  def activity_student_report_path(activity_session)
    unit_id      = activity_session&.unit&.id
    activity_id  = activity_session&.activity_id
    classroom_id = activity_session&.classroom&.id
    user_id = activity_session&.user_id

    "/teachers/progress_reports/diagnostic_reports#/" \
    "u/#{unit_id}/a/#{activity_id}/c/#{classroom_id}/student_report/" \
    "#{user_id}"
  end
end
