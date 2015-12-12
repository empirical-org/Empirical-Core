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
    @subscription = Subscription.find_by user_id: subscription_params[:user_id]
    if @subscription.nil?
      @subscription = Subscription.create params.permit(:user_id, :expiration, :account_limit)
    end
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
    params.permit(:id, :user_id, :expiration, :account_limit)
  end

  def set_subscription
    @subscription = Subscription.find params[:id]
  end
end
