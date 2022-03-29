# frozen_string_literal: true

class ChargesController < ApplicationController

  def create_customer_with_card
    create_customer_and_update_user
    render json: {current_user: current_user}
  end

  def update_card
    update_card_helper
    render json: {error: @err}
  end

  def new_school_premium
    new_sub = Subscription.give_school_premium_if_charge_succeeds(current_user.school, current_user)
    if new_sub.present?
      UpdateSalesContactWorker.perform_async(current_user.id, '6.1')
    end
    render json: {new_subscription: new_sub}
  end

  private def create_customer_and_update_user
    customer_id = Stripe::Customer.create(
      :description => "premium",
      :source  => params[:source][:id],
      :email => current_user.email,
      :metadata => { name: current_user.name, school: current_user.school&.name }
    ).id
    current_user.update(stripe_customer_id: customer_id)
  end

  private def update_card_helper
    customer_id = current_user.stripe_customer_id
    customer = Stripe::Customer.retrieve(customer_id)
    new_card = customer.sources.create(source: params[:source][:id])
    customer.default_source = new_card.id
    customer.save
  end

end
