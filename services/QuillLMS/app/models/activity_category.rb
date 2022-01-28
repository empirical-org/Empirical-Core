# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_categories
#
#  id           :integer          not null, primary key
#  name         :string
#  order_number :integer
#  created_at   :datetime
#  updated_at   :datetime
#
class ActivityCategory < ApplicationRecord
  has_many :activity_category_activities, dependent: :destroy
  has_many :activities, through: :activity_category_activities

  after_commit :clear_activity_search_cache

  before_create :set_order_number

  def set_order_number
    return if order_number.present?

    self.order_number =  ActivityCategory.count
  end

  def clear_activity_search_cache
    Activity.clear_activity_search_cache
  end
end
