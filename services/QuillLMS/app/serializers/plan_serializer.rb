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
class PlanSerializer < ActiveModel::Serializer
  attributes :display_name, :price_in_dollars, :stripe_price_id

  def price_in_dollars
    object.price / 100.0
  end
end

