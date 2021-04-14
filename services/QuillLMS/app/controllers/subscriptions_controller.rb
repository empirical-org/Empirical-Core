class SubscriptionsController < ApplicationController
  before_action :set_subscription, except: [:index, :create]
  before_action :require_user, only: [:index]

  def index
    set_index_variables
    respond_to do |format|
      format.html
      format.json {render json: @subscriptions}
    end
  end

  def purchaser_name
    if subscription_is_associated_with_current_user?
      render json: {name: @subscription.purchaser.name}
    else
      auth_failed
    end
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

  private def subscription_is_associated_with_current_user?
    @subscription.users.include?(current_user) || current_user.id == @subscription.purchaser_id
  end

  private def subscription_belongs_to_purchaser?
    if current_user != @subscription.purchaser
      auth_failed
    end
  end

  private def set_index_variables
    @subscriptions = current_user.subscriptions
    @premium_credits = current_user.credit_transactions.map {|x| x.serializable_hash(methods: :action)}.compact
    subscription_status
    @school_subscription_types = Subscription::OFFICIAL_SCHOOL_TYPES
    @last_four = current_user&.last_four
    @trial_types = Subscription::TRIAL_TYPES
    if @subscription_status&.key?('id')
      @user_authority_level = current_user.subscription_authority_level(@subscription_status['id'])
      # @coordinator_email = Subscription.find(@subscription_status['id'])&.coordinator&.email
    else
      @user_authority_level = nil
    end
  end

  private def subscription_status
    current_subscription = current_user.subscription
    if current_subscription
      @subscription_status_obj = current_subscription
      expired = false
    else
      @subscription_status_obj = current_user.last_expired_subscription
      expired = true
    end
    attributes_for_front_end = {
      expired: expired,
      purchaser_name: @subscription_status_obj&.purchaser&.name,
      mail_to: @subscription_status_obj&.purchaser&.email || @subscription_status_obj&.purchaser_email
    }
    subscription_attributes = @subscription_status_obj&.attributes || {}
    @subscription_status = subscription_attributes.merge(attributes_for_front_end)
  end

  private def subscription_params
    params.require(:subscription).permit(:id, :purchaser_id, :expiration, :account_type, :authenticity_token, :recurring)
  end

  private def set_subscription
    @subscription = current_user&.subscriptions&.find(params[:id])
  end
end
