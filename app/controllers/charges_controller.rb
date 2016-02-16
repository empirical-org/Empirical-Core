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
    :description => 'Premium',
    :currency    => 'usd'
  )

  @redirect_route = premium_redirect

  respond_to  do |format|
    format.json { render :json => {route: @redirect_route}}
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
