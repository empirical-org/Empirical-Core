# frozen_string_literal: true

# == Schema Information
#
# Table name: plans
#
#  id             :bigint           not null, primary key
#  audience       :string           not null
#  display_name   :string           not null
#  interval       :string
#  interval_count :integer
#  name           :string           not null
#  price          :integer          default(0)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_plans_on_name  (name) UNIQUE
#
class Plan < ApplicationRecord
  AUDIENCE_TYPES = [
    DISTRICT_AUDIENCE_TYPE = 'district',
    TEACHER_AUDIENCE_TYPE = 'teacher',
    SCHOOL_AUDIENCE_TYPE = 'school'
  ].freeze

  INTERVAL_TYPES = [
    YEARLY_INTERVAL_TYPE = 'yearly',
    WEEKLY_INTERVAL_TYPE = 'weekly',
    DAILY_INTERVAL_TYPE = 'daily'
  ].freeze

  NAMES = [
    COLLEGE_BOARD_LIFETIME = 'College Board Educator Lifetime Premium',
    INVOICE_SCHOOL = 'School Paid (via invoice)',
    PREMIUM_CREDIT = 'Premium Credit',
    SCHOOL_DISTRICT = 'School District Paid',
    SCHOOL_SPONSORED = 'School Sponsored Free',
    STRIPE_SCHOOL = 'School Paid (via Stripe)',
    STRIPE_TEACHER = 'Teacher Paid',
    TEACHER_TRIAL = 'Teacher Trial',
    TEACHER_SPONSORED = 'Teacher Sponsored Free'
  ].freeze

  NAME_TO_STRIPE_PRICE_ID = {
    STRIPE_SCHOOL => STRIPE_SCHOOL_PLAN_PRICE_ID,
    STRIPE_TEACHER => STRIPE_TEACHER_PLAN_PRICE_ID
  }.freeze

  STRIPE_PRICE_ID_TO_NAME = NAME_TO_STRIPE_PRICE_ID.invert

  attr_readonly :audience, :interval, :interval_count, :name, :price

  validates :name, presence: true, uniqueness: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :audience, presence: true, inclusion: { in: AUDIENCE_TYPES }
  validates :interval, presence: true, inclusion: { in: INTERVAL_TYPES }
  validates :interval_count, numericality: { greater_than_or_equal_to: 0 }

  before_destroy { |record| raise ActiveRecord::ReadOnlyRecord }

  def self.find_stripe_plan!(stripe_price_id)
    find_by!(name: STRIPE_PRICE_ID_TO_NAME[stripe_price_id])
  end

  def self.stripe_school
    find_by(name: STRIPE_SCHOOL)
  end

  def self.stripe_teacher
    find_by(name: STRIPE_TEACHER)
  end

  def stripe_price_id
    NAME_TO_STRIPE_PRICE_ID[name]
  end

  def teacher?
    audience == TEACHER_AUDIENCE_TYPE
  end
end
