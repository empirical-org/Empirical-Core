module ProgressReportHelper
  def is_progress_report_page?
    controller.class.parent == Teachers::ProgressReports ||
      controller.class.parent == Teachers::ProgressReports::Standards ||
      controller.class.parent == Teachers::ProgressReports::Concepts
  end

  def dont_show_premium_bar?
    current_user.premium_state == 'premium'
  end

  def tab_symbol
    case current_user.premium_state
    when 'beta'
      'BETA'
    when 'premium'
      "<i class='fa fa-star'></i>"
    when 'trial'
      'TRIAL'
    when 'locked'
      "<i class='fa fa-lock'></i>"
    end
  end

  def premium_bar
    return '' if dont_show_premium_bar?
    special_class = (current_user.premium_state == 'trial') ? 'premium-bar-extra-wide' : ''
    "<div class='premium-bar'><div class='container'><div class='#{special_class}'>#{premium_bar_content}</div></div></div>".html_safe
  end

  def premium_bar_content
    case current_user.premium_state
    when 'beta'
      val = "<div class='bar-text'>As a Quill early adopter, you have free access to progress reports until August 20th, 2015.&nbsp; #{link_to 'Learn More & Request a Quote', premium_access_path}.</div>"
    when 'trial'
      val = "<div class='bar-text'>As a Quill Premium trial user, you have access for the first #{Teacher::TRIAL_LIMIT} activities completed.</div>" \
            "#{progress_bar}   <div class='bar-text'>#{trial_activities_display_ratio} Completed</div>" \
            "<div class='bar-text'>#{link_to('Learn More & Request a Quote', premium_access_path)}.</div>"
    when 'locked'
      val = "<div class='bar-text'>Your trial has expired. Please purchase Quill Premium to unlock the progress reports. #{link_to('Learn More & Request a Quote', premium_access_path)}.</div>"
    end
    val
  end

  def progress_bar
    "<div class='premium-bar-progress-bar'><span style='#{progress_bar_width}'></span></div>"
  end

  def trial_activities_numerical_ratio
    current_user.teachers_activity_sessions_since_trial_start_date.count / Teacher::TRIAL_LIMIT
  end

  def progress_bar_width
    ratio = trial_activities_numerical_ratio
    "width: #{ratio * 100}%"
  end

  def trial_activities_display_ratio
    "#{current_user.teachers_activity_sessions_since_trial_start_date.count} / #{Teacher::TRIAL_LIMIT}"
  end
end
