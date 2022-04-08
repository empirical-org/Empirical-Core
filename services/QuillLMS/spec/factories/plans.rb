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
require 'rails_helper'

FactoryBot.define do
  factory :plan, aliases: [:teacher_paid_plan] do
    name { 'Teacher Paid' }
    display_name { 'Teacher Premium' }
    price { 9000 }
    audience { Plan::TEACHER_AUDIENCE_TYPE }
    interval { Plan::YEARLY_INTERVAL_TYPE }
    interval_count { 1 }
    stripe_price_id { "price_#{SecureRandom.hex}" }
  end
end
