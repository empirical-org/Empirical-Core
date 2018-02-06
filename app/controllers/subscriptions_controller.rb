class SubscriptionsController < ApplicationController
  before_action :set_subscription, only: [:show, :update, :destroy]

  def index
    @subscriptions = current_user.subscriptions
    @premium_credits = current_user.credit_transactions
    respond_to do |format|
      format.html
      format.json {render json: @subscriptions}
    end
  end

  def show
    render json: @subscription
  end

  def create
    if (['Teacher Trial', 'Teacher Sponsored Free', 'Teacher Sponsored Free'].include? params[:account_type]) && current_user.eligible_for_trial?
      params[:expiration] = Date.today + 30
      PremiumAnalyticsWorker.perform_async(current_user.id, params[:account_type])
    end
    attributes = subscription_params
    attributes.delete(:authenticity_token)
    # attributes[:contact_user_id] ||= current_user.id
    @subscription = Subscription.create_with_user_join(attributes[:contact_user_id], attributes)
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
      params.permit(:id, :contact_user_id, :expiration, :account_limit, :account_type, :authenticity_token)
    end

    def set_subscription
      @subscription = Subscription.find subscription_params[:id]
    end
end
