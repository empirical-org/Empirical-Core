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
    @subscription = Subscription.create params.permit(:user_id, :expiration, :account_limit)
    render json: @subscription
  end

  def update
    @subscription.update_attributes params.permit(:id, :expiration, :account_limit)
    render json: response
  end

  def destroy
    @subscription.destroy
    render json: @subscription
  end

  private
    def set_subscription
      @subscription = Subscription.find params[:id]
    end
end