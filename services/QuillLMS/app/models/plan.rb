# frozen_string_literal: true

# == Schema Information
#
# Table name: plans
#
#  id              :bigint           not null, primary key
#  audience        :string           not null
#  display_name    :string           not null
#  interval        :string
#  interval_count  :integer
#  name            :string           not null
#  price           :integer          default(0)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  stripe_price_id :string
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
  ]

  INTERVAL_TYPES = [
    YEARLY_INTERVAL_TYPE = 'yearly',
    WEEKLY_INTERVAL_TYPE = 'weekly',
    DAILY_INTERVAL_TYPE = 'daily'
  ]

  STRIPE_TEACHER_PLAN = 'Teacher Paid'

  attr_readonly :audience, :interval, :interval_count, :name, :price, :stripe_price_id

  validates :name, presence: true, uniqueness: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :audience, presence: true, inclusion: { in: AUDIENCE_TYPES }
  validates :interval, presence: true, inclusion: { in: INTERVAL_TYPES }
  validates :interval_count, numericality: { greater_than_or_equal_to: 0 }
  validates :stripe_price_id, allow_blank: true, stripe_uid: { prefix: :price }

  before_destroy { |record| raise ActiveRecord::ReadOnlyRecord }

  def self.stripe_teacher_plan
    find_by(name: STRIPE_TEACHER_PLAN)
  end

  def teacher?
    audience == TEACHER_AUDIENCE_TYPE
  end
end
