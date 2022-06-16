# frozen_string_literal: true

class Cms::SubscriptionsController < Cms::CmsController
  before_action :set_subscription, only: %i[show edit update destroy]
  before_action :subscription_data, only: [:edit]

  def show
  end

  def create
    if params[:subscriber_id] && params[:subscriber_type]
      @subscriber = params[:subscriber_type].constantize.find(params[:subscriber_id])
      @subscription = Subscription.create_with_subscriber_join(@subscriber, subscription_params)
      @subscription.update_selected_school_subscriptions(params[:schools])
    else
      @subscription = Subscription.create(subscription_params)
    end
    render json: @subscription
  end

  def edit
    @subscription.stripe? ? redirect_to(@subscription.stripe_subscription_url) : render(:edit)
  end

  def update
    @subscription.update(subscription_params)
    @subscription.update_selected_school_subscriptions(params[:schools])
    render json: @subscription.reload
  end

  def destroy
  end

  private def set_subscription
    @subscription = Subscription.find(params[:id])
  end

  private def subscription_data
    @district = @subscription.districts&.first
    @school = @subscription.schools&.first
    @schools = @district&.schools_and_subscription_status
    @premium_types = @subscription.premium_types
    @subscription_payment_methods = Subscription::CMS_PAYMENT_METHODS

    return unless @school&.not_alternative?

    @school_users = @school.users.select(:id, :email, :name)
  end

  private def schools_params
    params[:schools]
  end

  private def subscription_params
    params.require(:subscription).permit([
      :id,
      :expiration,
      :created_at,
      :updated_at,
      :account_type,
      :purchaser_email,
      :start_date,
      :subscription_type_id,
      :purchaser_id,
      :recurring,
      :de_activated_date,
      :payment_method,
      :payment_amount
    ])
  end
end
