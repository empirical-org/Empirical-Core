# frozen_string_literal: true

class PdfSubscriptionsController < ApplicationController
  def current
    @pdf_subscription =
      PdfSubscription
        .joins(:admin_report_filter_selection)
        .find_by(admin_report_filter_selections: { report:, user_id: })

    render json: @pdf_subscription
  end

  def create_or_update
    @pdf_subscription = PdfSubscription.find_or_initialize_by(admin_report_filter_selection_id:)

    return render json: {}, status: :unauthorized if @pdf_subscription.user != current_user

    if @pdf_subscription.update(pdf_subscription_params)
      render json: @pdf_subscription, status: :ok
    else
      render json: @pdf_subscription.errors, status: :unprocessable_entity
    end
  end

  # This is used in ReportSubscriptionModal when a user turns off a subscription and clicks save, and from the unsubscribe page when they confirm
  def destroy
    @pdf_subscription = PdfSubscription.find_by(id: params[:id])

    respond_to do |format|
      format.html do
        return redirect_to root_path, flash: { error: 'Subscription not found' } if @pdf_subscription.nil?

        @pdf_subscription.destroy!
        redirect_to root_path, flash: { notice: 'You have been unsubscribed from the Admin Usage Snapshot Report' }
      end

      format.json do
        return render json: {}, status: :unauthorized if @pdf_subscription&.user != current_user

        @pdf_subscription.destroy!
        render json: {}, status: :ok
      end
    end
  end

  # This is used by the unsubscribe link in the email
  def unsubscribe
    @pdf_subscription = PdfSubscription.find_by(token:)

    if @pdf_subscription.nil?
      redirect_to root_path, flash: { error: 'Subscription not found' }
    end
  end

  private def admin_report_filter_selection_id = pdf_subscription_params[:admin_report_filter_selection_id]

  private def pdf_subscription_params
    params
      .require(:pdf_subscription)
      .permit(:admin_report_filter_selection_id, :frequency)
  end

  private def report = params[:report]
  private def token = params[:token]
  private def user_id = current_user.id
end
