class CreditTransactionsController < ApplicationController
  before_action :signed_in!

  def redeem_credits_for_premium
    render json: {subscription: current_user.redeem_credit}
  end


end
