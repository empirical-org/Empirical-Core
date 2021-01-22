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
require 'rails_helper'

RSpec.describe ActivityCategoryActivity, type: :model do
  it { should validate_uniqueness_of(:activity_category_id).scoped_to(:activity_id) }
end
