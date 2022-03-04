# frozen_string_literal: true

class Cms::CmsController < ApplicationController
  before_action :staff!

  # rubocop:disable Metrics/CyclomaticComplexity
  private def subscription_data
    if !@school && !@user && @subscription.schools.any?
      # then we are here directly through edit subscriptions and we want to select
      # the subscription's school
      @school = @subscription.schools.first
    end

    @premium_types = @school  ? Subscription::OFFICIAL_SCHOOL_TYPES : Subscription::OFFICIAL_TEACHER_TYPES
    @subscription_payment_methods = Subscription::PAYMENT_METHODS.dup
    # we do not want credit card here as it should only occur automatically
    @subscription_payment_methods.delete('Credit Card')
    # get the user's colleagues at the same school if user subscription, or the school if we are editing a school subscription
    @school ||= (@user && @user.school)

    return unless @school && ['home school', 'us higher ed', 'international', 'other', 'not listed'].exclude?(@school.name)

    @schools_users = @school.users.map{|u| {id: u.id, name: u.name, email: u.email}}
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
