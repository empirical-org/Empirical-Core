class ChargesController < ApplicationController

  def new
  end

  def create
  # Amount in cents
  @amount = 500

  customer = Stripe::Customer.create(
    :description => "testing",
    :source  => params[:source][:id]
  )

  binding.pry

  charge = Stripe::Charge.create(
    :customer    => customer.id,
    :amount      => @amount,
    :description => 'Premium',
    :currency    => 'usd'
  )
  rescue Stripe::CardError => e
    flash[:error] = e.message
    # redirect_to new_charge_path
  end


end
