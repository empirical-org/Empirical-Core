# frozen_string_literal: true

class Cms::SubscriptionsController < Cms::CmsController
  before_action :set_subscription, only: %i[show edit update destroy]
  before_action :subscription_data, only: [:edit]

  def show
  end

  def create
    logger.debug('About to check for subscriber_id and subscriber_type')
    if params[:subscriber_id] && params[:subscriber_type]
      logger.debug('about to find subscriber')
      @subscriber = params[:subscriber_type].constantize.find(params[:subscriber_id])
      logger.debug('about to enter transaction')

      ActiveRecord::Base.transaction do
        logger.debug('about to create_and_attach_subscriber')
        @subscription = Subscription.create_and_attach_subscriber(subscription_params, @subscriber)
        logger.debug('about to run Cms::SchoolSubscriptionsUpdater')
        Cms::SchoolSubscriptionsUpdater.run(@subscription, params[:schools])
      end
    else
      logger.debug('about to create! subscription')
      @subscription = Subscription.create!(subscription_params)
    end
    begin
      logger.debug('about to populate_data_from_stripe_invoice')
      @subscription.populate_data_from_stripe_invoice
      logger.debug('about to save')
      @subscription.save
    rescue ActiveRecord::RecordInvalid, Stripe::InvalidRequestError
      logger.debug('inside do nothing rescue')
      # We don't actually want to do anything when this happens
    end
    logger.debug('about to render')
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
