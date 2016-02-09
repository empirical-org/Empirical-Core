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
    params[:user_id] = current_user.id
    if params[:account_type] == 'trial' && current_user.eligible_for_trial?
      params[:expiration] = Date.today + 30
    elsif params[:account_type] == 'paid'
      params[:expiration] = Date.today + 365
    end
    @subscription = Subscription.create subscription_params
    render json: @subscription
  end

  def update
    @subscription.update_attributes subscription_params
    render json: @subscription
  end

  def destroy
    @subscription.destroy
    render json: @subscription
  end

  private
    def subscription_params
      params.require(:account_type)
      params.permit(:id, :user_id, :expiration, :account_limit, :account_type)
    end

    def set_subscription
      @subscription = Subscription.find subscription_params[:id]
    end
end
