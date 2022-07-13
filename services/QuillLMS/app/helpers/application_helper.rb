# frozen_string_literal: true

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

  def demo_account?
    current_user && /hello\+(.)*@quill.org/.match(current_user.email)
  end

  def staff_member?
    current_user && session[:staff_id].present?
  end

  def on_sign_up?
    current_path = request.env['PATH_INFO'] || ''

    current_path.include?('sign-up')
  end

  def user_is_trackable_teacher?
    current_user&.teacher? && !staff_member? && !demo_account? && !on_sign_up?
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

  def device
    request.user_agent =~ /Mobile/ ? 'mobile' : 'desktop'
  end
end
