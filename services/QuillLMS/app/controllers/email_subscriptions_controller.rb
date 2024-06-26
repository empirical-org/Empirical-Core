# frozen_string_literal: true

class EmailSubscriptionsController < ApplicationController
  before_action :set_current_subscription
  
  def current = render json: @current_subscription

  def create_or_update
    subscription = @current_subscription || EmailSubscription.initialize(user_id:, subscription_type:)    

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
        return redirect_to root_path, flash: { error: 'Subscription not found' } if @current_subscription.nil?

        @current_subscription.destroy!
        redirect_to root_path, flash: { notice: 'You have been unsubscribed from the Admin Diagnostic Growth Report' }
      end

      format.json do
        return render json: {}, status: :unauthorized if @current_subscription&.user != current_user

        @current_subscription.destroy!
        render json: {}, status: :ok
      end
    end
  end

  # This is used by the unsubscribe link in the email
  def unsubscribe
    redirect_to root_path, flash: { error: 'Subscription not found' } if @current_subscription.nil?
  end

  private def set_current_subscription
    @current_subscription = EmailSubscription.find_by(user_id:, subscripton_type:) || EmailSubscription.find_by(cancel_token:)
  end

  private def subscription_params
    params.require(:subscription)
      .permit(:frequency, :params)
  end

  private def cancel_token = params[:cancel_token]
  private def subscription_type = params[:subscription_type]
  private def user_id = current_user.id
end
