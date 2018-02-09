class SubscriptionsController < ApplicationController
  before_action :set_subscription, only: [:show, :update, :destroy]

  def index
    set_index_variables
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

  def set_index_variables
    @subscriptions = current_user.subscriptions
    @premium_credits = current_user.credit_transactions
    subscription_status
    @school_subscription_types = Subscription::SCHOOL_SUBSCRIPTIONS_TYPES
    @last_four = last_four
    @trial_types = Subscription::TRIAL_TYPES
  end

  def subscription_status
    current_subscription = current_user.subscription
    if current_subscription
      @subscription_status = current_subscription
      expired = false
    else
      @subscription_status = current_user.last_expired_subscription
      expired = true
    end
    contact_user = @subscription_status.contact_user
    if contact_user || @subscription_status.contact_email
      # we want to allow the viewer to email the contact user for school premium
      # if the contact user is in our db, then we retrieve their emaile
      # otherwise we fall back on the hardcoded contact email which was input by the sales team
      @subscription_status.attributes.merge({contact_name: contact_user.name, mail_to: contact_user.email || @subscription_status.email, expired: expired})
    end
  end

  def last_four
    if current_user.stripe_customer_id.present?
      Stripe::Customer.retrieve(current_user.stripe_customer_id).sources.data.first.last4
    end
  end

  def subscription_params
    params.require(:account_type)
    params.permit(:id, :contact_user_id, :expiration, :account_limit, :account_type, :authenticity_token)
  end

  def set_subscription
    @subscription = Subscription.find subscription_params[:id]
  end
end
