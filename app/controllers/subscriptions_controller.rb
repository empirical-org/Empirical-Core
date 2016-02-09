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

    puts params
    @id = current_user.id
    @subscription = Subscription.find_by_user_id @id
    binding.pry
    params[:expiration] = Date.today + 30 if params[:account_type] == 'trial'
    if @subscription.nil?
      @subscription = Subscription.create subscription_params
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
      params.permit(:id, :expiration, :account_limit, :account_type)
    end

    def set_subscription
      @subscription = Subscription.find subscription_params[:id]
    end
end
