module Cms::UsersHelper
  def format_date(date)
    if date.nil?
      '--'
    else
      date.strftime('%b %d, %Y')
    end
  end

  def complete_sales_stage_link(stage)
    link_to(
      'Mark Complete',
      complete_sales_stage_cms_user_path(stage_number: stage.number),
      { method: :post, data: { confirm: 'Mark stage as completed?' } }
    )
  end

  def completed_by(user)
    if user.present?
      user.name
    else
      '--'
    end
  end

  def action_column(stage)
    return 'Completed' if stage.completed_at.present?

    if stage.trigger == 'user'
      complete_sales_stage_link(stage)
    else
      stage.trigger.titleize
    end
  end
end
