# frozen_string_literal: true

class PlanSerializer < ActiveModel::Serializer
  self.root = false

  attributes :display_name, :price_in_dollars, :stripe_price_id

  def price_in_dollars
    object.price / 100
  end
end

