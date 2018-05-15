class SubscriptionsController < ApplicationController
  before_action :set_subscription, except: [:index, :create]

  def index
    set_index_variables
    respond_to do |format|
      format.html
      format.json {render json: @subscriptions}
    end
  end

  def purchaser_name
    subscription_is_associated_with_current_user?
    render json: {name: @subscription.purchaser.name}
  end

  def show
    render json: @subscription
  end

  def create
    attributes = subscription_params
    attributes[:purchaser_id] ||= current_user.id
    attributes.delete(:authenticity_token)
    @subscription = Subscription.create_with_user_join(current_user.id, attributes)
    render json: @subscription
  end

  def update
    set_subscription
    @subscription.update!(subscription_params)
    render json: @subscription
  end

  def destroy
    @subscription.destroy
    render json: @subscription
  end

  private

  def subscription_is_associated_with_current_user?
    if !@subscription.users.include?(current_user) && !current_user == @subscription.purchaser
      auth_failed
    end
  end

  def subscription_belongs_to_purchaser?
    if current_user != @subscription.purchaser
      auth_failed
    end
  end

  def set_index_variables
    @subscriptions = current_user.subscriptions
    @premium_credits = current_user.credit_transactions
    subscription_status
    @school_subscription_types = Subscription::OFFICIAL_SCHOOL_TYPES
    @last_four = current_user&.last_four
    @trial_types = Subscription::TRIAL_TYPES
    if @subscription_status
      @user_authority_level = current_user.subscription_authority_level(@subscription_status['id'])
      # @coordinator_email = Subscription.find(@subscription_status['id'])&.coordinator&.email
    else
      @user_authority_level = nil
    end
  end

  def subscription_status
    current_subscription = current_user.subscription
    if current_subscription
      @subscription_status_obj = current_subscription
      expired = false
    else
      @subscription_status_obj = current_user.last_expired_subscription
      expired = true
    end
    @subscription_status = @subscription_status_obj
    purchaser = @subscription_status&.purchaser
    if purchaser || @subscription_status&.purchaser_email
      # we want to allow the viewer to email the contact user for school premium
      # if the contact user is in our db, then we retrieve their emaile
      # otherwise we fall back on the hardcoded contact email which was input by the sales team
      @subscription_status = @subscription_status.attributes.merge({expired: expired, purchaser_name: purchaser.name, mail_to: purchaser.email || @subscription_status.email})
    else
      @subscription_status = @subscription_status&.attributes&.merge({expired: expired})
    end

  end

  def subscription_params
    params.require(:subscription).permit( :id, :purchaser_id, :expiration, :account_type, :authenticity_token, :recurring)
  end


  def set_subscription
    @subscription = current_user.subscriptions.find(params[:id])
  end
end
