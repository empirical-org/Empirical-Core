# frozen_string_literal: true

class SubscriptionsController < ApplicationController
  before_action :set_stripe_variables, only: [:index, :school_admin_subscriptions]
  before_action :set_subscription, only: %i[purchaser_name show update destroy]
  before_action :require_user, only: [:index]

  def index
    set_index_variables

    respond_to do |format|
      format.html
      format.json {
        render json: {
          subscriptions: @subscriptions,
          premium_credits: @premium_credits,
          subscription_status: @subscription_status,
          user_authority_level: @user_authority_level,
        }
      }
    end
  end

  def school_admin_subscriptions
    @schools = current_user.administered_schools.map do |school|
      {
        id: school.id,
        name: school.name,
        subscriptions: school.subscriptions,
        subscription_status: school.subscription&.subscription_status || school.last_expired_subscription&.subscription_status
      }
    end
    @user_associated_school_id = current_user.school&.id
    
    respond_to do |format|
      format.html
      format.json {
        render json: {
          schools: @schools,
          user_associated_school_id: @user_associated_school_id,
          stripe_invoice_id: @stripe_invoice_id,
          stripe_payment_method_updated: @stripe_payment_method_updated
        }
      }
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

  def retrieve_stripe_subscription
    @subscription = current_user&.subscriptions&.find_by(stripe_invoice_id: params[:stripe_invoice_id])&.subscription_status

    render json: @subscription || { quill_retrieval_processing: true }
  end

  private def subscription_is_associated_with_current_user?
    @subscription.users.include?(current_user) || current_user.id == @subscription.purchaser_id
  end

  private def subscription_belongs_to_purchaser?
    return if current_user == @subscription.purchaser

    auth_failed
  end

  private def set_index_variables
    @subscriptions = current_user.subscriptions
    @premium_credits = current_user.credit_transactions.map {|x| x.serializable_hash(methods: :action)}.compact
    @subscription_status = current_user.subscription_status
    @school_subscription_types = Subscription::OFFICIAL_SCHOOL_TYPES
    @trial_types = Subscription::TRIAL_TYPES

    if @subscription_status&.key?('id')
      @user_authority_level = current_user.subscription_authority_level(@subscription_status['id'])
    else
      @user_authority_level = nil
    end
  end

  private def set_stripe_variables
    @stripe_invoice_id = StripeIntegration::StripeInvoiceIdFinder.run(checkout_session_id)
    @stripe_payment_method_updated = params[:stripe_payment_method_updated] == 'true'
  end

  private def checkout_session_id
    params[:checkout_session_id]
  end

  private def subscription_params
    params.require(:subscription).permit(:id, :purchaser_id, :expiration, :account_type, :authenticity_token, :recurring)
  end

  private def set_subscription
    @subscription = current_user&.subscriptions&.find(params[:id])
  end
end
