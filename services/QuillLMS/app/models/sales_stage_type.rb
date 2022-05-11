# frozen_string_literal: true

# == Schema Information
#
# Table name: sales_stage_types
#
#  id          :integer          not null, primary key
#  description :text
#  name        :text             not null
#  order       :string           not null
#  trigger     :integer
#  created_at  :datetime
#  updated_at  :datetime
#
# Indexes
#
#  index_sales_stage_types_on_name_and_order  (name,order) UNIQUE
#
class SalesStageType < ApplicationRecord
  validates :name, uniqueness: true
  validates :order, uniqueness: true

  ORDER_TYPES = [
    TEACHER_PREMIUM = '2',
    SCHOOL_PREMIUM = '6.1'
  ]

  enum trigger: { auto: 0, user: 1 }

  def name_param
    name.parameterize.underscore
  end
end
