# frozen_string_literal: true

class BonusDaysCalculator < ApplicationService

  attr_reader :user, :start

  delegate :school, to: :user

  def initialize(user, start: Date.current)
    @user = user
    @start = start
  end

  def run
    return 0 if user.nil? || school.nil? || school.ever_paid_for_subscription?

    (plan_ends - start).to_i
  end

  private def plan_ends
    start.month < Subscription::SUMMER_CUTOFF_MONTH ?
      start.change(month: Subscription::SUMMER_EXPIRATION_MONTH, day: Subscription::SUMMER_EXPIRATION_DAY) :
      start.change(month: Subscription::WINTER_EXPIRATION_MONTH, day: Subscription::WINTER_EXPIRATION_DAY)
  end
end

