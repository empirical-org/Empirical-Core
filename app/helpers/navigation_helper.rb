module NavigationHelper
  def home_page?

  end

  def classes_page?

  end

  def assign_activity_page?

  end

  def my_activities_page?

  end

  def student_reports_page?

  end

  def teacher_resources_page?

  end

  def premium_page?

  end

  def premium_tab_copy
    case current_user.premium_state
    when 'trial'
      "Premium  <i class='fa fa-star'></i> #{current_user.trial_days_remaining} Days Left"
    when 'locked'
      "Premium  <i class='fa fa-star'></i> Trial Expired"
    else
      "Try Premium <i class='fa fa-star'></i>"
    end
  end
end
