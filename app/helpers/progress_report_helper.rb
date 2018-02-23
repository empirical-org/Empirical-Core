module ProgressReportHelper
  def tab_symbol
    case current_user.premium_state
    when 'beta'
      'BETA'
    when 'paid' || 'school'
      "<i class='fa fa-star'></i>"
    when 'trial'
      'TRIAL'
    when 'locked'
      "<i class='fa fa-lock'></i>"
    end
  end


  def progress_bar
    "<div class='premium-bar-progress-bar'><span style='#{progress_bar_width}'></span></div>"
  end

  def trial_activities_numerical_ratio
    current_user.teachers_activity_sessions_since_trial_start_date.count/Teacher::TRIAL_LIMIT
  end

  def progress_bar_width
    ratio = trial_activities_numerical_ratio
    "width: #{ratio * 100}%"
  end

  def trial_activities_display_ratio
    "#{current_user.teachers_activity_sessions_since_trial_start_date.count} / #{Teacher::TRIAL_LIMIT}"
  end

end
