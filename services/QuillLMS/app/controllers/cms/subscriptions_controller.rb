# frozen_string_literal: true

class Cms::SubscriptionsController < Cms::CmsController
  before_action :set_subscription, only: %i[show edit update destroy]
  before_action :subscription_data, only: [:edit]

  def show
  end

  def create
    if params['school_or_user']
      @subscription = Subscription.create_with_school_or_user_join( params[:school_or_user_id], params[:school_or_user], subscription_params)
    else
      @subscription = Subscription.new
      @subscription.create(subscription_params)
    end
    render json: @subscription
  end

  def edit
    @subscription.stripe? ? redirect_to(@subscription.stripe_subscription_url) : render(:edit)
  end

  def update
    @subscription.update(subscription_params)
    render json: @subscription.reload
  end

  def destroy
  end

  private def set_subscription
    @subscription = Subscription.find(params[:id])
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
    ]
  )
  end
end
