class ChargesController < ApplicationController

  def new
  end

  def create
  customer = Stripe::Customer.create(
    :description => "testing",
    :source  => params[:source][:id]
  )

  charge = Stripe::Charge.create(
    :customer    => customer.id,
    :amount      => params['amount'].to_i,
    :description => 'Teacher Premium',
    :currency    => 'usd',
    :receipt_email =>  params['source']['email']
  )

  Subscription.start_premium(current_user) if charge

  respond_to  do |format|
    format.json { render :json => {route: premium_redirect}}
   end

  rescue Stripe::CardError => e
    flash[:error] = e.message
  end


  private

  def premium_redirect
    if current_user
      teachers_progress_reports_concepts_students_path
    else
      new_session_path
    end
  end









end
