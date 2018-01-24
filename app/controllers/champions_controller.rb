class ChampionsController < ApplicationController
  before_action :teacher!

  def index
    @referral_link = current_user.referral_link
    @referral_count = current_user.referrals
  end
end
