# frozen_string_literal: true

class PdfSubscriptionsController < ApplicationController
  def create
    @pdf_subscription = PdfSubscription.new

    if @pdf_subscription.update(pdf_subscription_params)
      render json: @pdf_subscription, status: :created
    else
      render json: @pdf_subscription.errors, status: :unprocessable_entity
    end
  end

  private def pdf_subscription_params
    params
      .require(:pdf_subscription)
      .permit(:admin_report_filter_selection_id, :frequency)
  end
end
