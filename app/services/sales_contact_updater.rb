class SalesContactUpdater

  def initialize(user_id, stage, current_user = nil, notifier = nil)
    @user_id      = user_id
    @stage        = stage
    @notifier     = notifier || SalesContactAnalyticsWorker
    @current_user = current_user
  end

  def update
    create_sales_contact
    sales_stage.update(completed_at: Time.now, user: @current_user)
    notify_cms
    true
  end

  private

  def user
    @user ||= User.find(@user_id)
  end

  def sales_stage
    @sales_stage ||= SalesStage
      .joins([{ sales_contact: :user }, :sales_stage_type])
      .where('users.id = ?', user.id)
      .where('sales_stage_types.name = ?', @stage)
      .first
  end

  def create_sales_contact
    SalesContactCreator.new(user.id).create if user.sales_contact.nil?
  end

  def notify_cms
    @notifier.perform_async(user.id, @stage.parameterize.underscore)
  end
end
