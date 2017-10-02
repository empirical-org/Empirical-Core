class SubscriptionsController < ApplicationController
  before_action :set_subscription, only: [:show, :update, :destroy]

  def index
    @subscriptions = Subscription.all
    render json: @subscriptions
  end

  def show
    render json: @subscription
  end

  def create
    if (['trial', 'free low-income', 'free contributor'].include? params[:account_type]) && current_user.eligible_for_trial?
      params[:expiration] = Date.today + 30
      PremiumAnalyticsWorker.perform_async(current_user.id, params[:account_type])
    end
    attributes = subscription_params
    attributes.delete(:authenticity_token)
    attributes[:user_id] ||= current_user.id
    if current_user.subscription
      @subscription = current_user.subscription
      @subscription.update attributes
    else
      @subscription = Subscription.create_or_update_with_user_join(attributes[:user_id], attributes)
    end
    render json: @subscription
  end

  def update
    attributes = subscription_params
    attributes.delete(:authenticity_token)
    @subscription.update_attributes attributes
    render json: @subscription
  end

  def destroy
    @subscription.destroy
    render json: @subscription
  end

  private
    def subscription_params
      params.require(:account_type)
      params.permit(:id, :user_id, :expiration, :account_limit, :account_type, :authenticity_token)
    end

    def set_subscription
      @subscription = Subscription.find subscription_params[:id]
    end
end
