# frozen_string_literal: true

class BonusDaysCalculator < ApplicationService
  JUNE = 6
  JULY = 7
  DECEMBER = 12

  attr_reader :user, :start

  delegate :school, to: :user

  def initialize(user, start: Date.current)
    @user = user
    @start = start
  end

  def run
    return 0 if user.nil? || school.nil? || school_has_paid_before?

    (plan_ends - start).to_i
  end

  private def plan_ends
    start.month < JULY ? start.change(month: JUNE, day: 30) : start.change(month: DECEMBER, day: 31)
  end

  private def school_has_paid_before?
    ::Subscription.school_or_user_has_ever_paid?(school)
  end
end

