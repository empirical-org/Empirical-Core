# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_category_activities
#
#  id                   :integer          not null, primary key
#  order_number         :integer
#  created_at           :datetime
#  updated_at           :datetime
#  activity_category_id :integer
#  activity_id          :integer
#
# Indexes
#
#  index_act_category_acts_on_act_id_and_act_cat_id  (activity_id,activity_category_id)
#
class ActivityCategoryActivity < ApplicationRecord
  belongs_to :activity_category
  belongs_to :activity

  after_commit :clear_activity_search_cache

  validates :activity_category_id, uniqueness: { scope: :activity_id }

  def clear_activity_search_cache
    Activity.clear_activity_search_cache
  end
end
