# frozen_string_literal: true

class UpdateSalesContact

  def initialize(user_id, stage_number, current_user = nil, notifier = nil)
    @user_id      = user_id
    @stage_number = stage_number
    @notifier     = notifier
    @current_user = current_user
  end

  def call
    create_sales_contact

    if sales_stage.completed_at.nil? && update_sales_stage
      notify_cms
      true
    else
      false
    end
  end

  private def update_sales_stage
    sales_stage.update(completed_at: Time.current, user: @current_user)
  end

  private def user
    @user ||= User.find(@user_id)
  end

  private def sales_stage_type
    @sales_stage_type ||= SalesStageType.find_by(order: @stage_number)
  end

  private def sales_stage
    user.reload.sales_contact.stages.find_by(sales_stage_type: sales_stage_type)
  end

  private def create_sales_contact
    CreateSalesContact.new(user.id).call if user.sales_contact.nil?
  end

  private def notify_cms
    @notifier&.perform_async(user.id, sales_stage_type.name_param)
  end
end
