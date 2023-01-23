# frozen_string_literal: true

class Cms::SubscriptionsController < Cms::CmsController
  before_action :set_subscription, only: %i[show edit update destroy]
  before_action :subscription_data, only: [:edit]

  def show
  end

  def create
    if params[:subscriber_id] && params[:subscriber_type]
      @subscriber = params[:subscriber_type].constantize.find(params[:subscriber_id])

      ActiveRecord::Base.transaction do
        @subscription = Subscription.create_and_attach_subscriber(subscription_params, @subscriber)
        Cms::SchoolSubscriptionsUpdater.run(@subscription, params[:schools])
      end
    else
      @subscription = Subscription.create!(subscription_params)
    end
    begin
      @subscription.populate_data_from_stripe_invoice
      @subscription.save
    rescue ActiveRecord::RecordInvalid, Stripe::InvalidRequestError
      # We don't actually want to do anything when this happens
    end
    render json: @subscription
  end

  def edit
    @subscription.stripe? ? redirect_to(@subscription.stripe_subscription_url) : render(:edit)
  end

  def update
    ActiveRecord::Base.transaction do
      @subscription.update(subscription_params)
      Cms::SchoolSubscriptionsUpdater.run(@subscription, params[:schools])
    end

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
    @schools = Cms::DistrictSchoolsAndSubscriptionStatus.run(@district, @subscription)
    @premium_types = @subscription.premium_types
    @subscription_payment_methods = Subscription::CMS_PAYMENT_METHODS

    return if @school.nil? || @school.alternative?

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
      :payment_amount,
      :stripe_invoice_id,
      :purchase_order_number
    ])
  end
end
