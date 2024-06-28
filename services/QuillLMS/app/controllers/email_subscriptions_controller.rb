# frozen_string_literal: true

class EmailSubscriptionsController < ApplicationController
  before_action :set_current_subscription, only: [:current, :create_or_update]

  def current = render json: @current_subscription

  def create_or_update
    subscription = @current_subscription || EmailSubscription.new(user_id:, subscription_type:)

    if subscription.update(subscription_params)
      render json: subscription, status: :ok
    else
      render json: subscription.errors, status: :unprocessable_entity
    end
  end

  # This is used in ReportSubscriptionModal when a user turns off a subscription and clicks save, and from the unsubscribe page when they confirm
  def destroy
    respond_to do |format|
      format.html do
        @current_subscription = email_subscription_by_id

        return redirect_to root_path, flash: { error: 'Subscription not found' } if @current_subscription.nil?

        @current_subscription.destroy!
        redirect_to root_path, flash: { notice: 'You have been unsubscribed from the Admin Diagnostic Growth Report' }
      end

      format.json do
        @current_subscription = email_subscription_by_type

        return render json: {}, status: :not_found if @current_subscription.nil?
        return render json: {}, status: :unauthorized if @current_subscription&.user != current_user

        @current_subscription.destroy!
        render json: {}, status: :ok
      end
    end
  end

  # This is used by the unsubscribe link in the email
  def unsubscribe
    @current_subscription = email_subscription_by_cancel_token

    redirect_to root_path, flash: { error: 'Subscription not found' } if @current_subscription.nil?
  end

  private def set_current_subscription
    @current_subscription = email_subscription_by_type
  end

  private def subscription_params
    params.require(:subscription)
      .permit(:frequency, :params)
  end

  private def email_subscription_by_id = EmailSubscription.find_by(id:)
  private def email_subscription_by_cancel_token = EmailSubscription.find_by(cancel_token:)
  private def email_subscription_by_type = EmailSubscription.find_by(user_id:, subscription_type:)

  # This param is set on the route
  private def cancel_token = params[:cancel_token]
  # This param is set on the route
  private def id = params[:type]
  # This param is set on the route
  private def subscription_type = params[:email_subscription_type] || params[:type]
  private def user_id = current_user.id
end
