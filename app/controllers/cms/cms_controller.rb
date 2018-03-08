class Cms::CmsController < ApplicationController
  before_filter :staff!

  def get_subscription_data
    @user_premium_types = Subscription::ALL_OFFICIAL_TYPES
    @subscription_payment_methods = Subscription::PAYMENT_METHODS
    @promo_expiration_date = Subscription.promotional_dates[:expiration]
    # get the user's colleagues at the same school if user subscription, or the school if we are editing a school subscription
    @school ||= @user.school
    if @school && ['home school', 'us higher ed', 'international', 'other', 'not listed'].exclude?(@school.name)
      @schools_users = @school.users.map{|u| {id: u.id, name: u.name, email: u.email}}
    end
  end
end
