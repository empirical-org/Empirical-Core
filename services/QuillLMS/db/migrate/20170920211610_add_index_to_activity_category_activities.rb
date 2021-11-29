# frozen_string_literal: true

class AddIndexToActivityCategoryActivities < ActiveRecord::Migration[4.2]
  def change
    add_index :activity_category_activities, [:activity_id, :activity_category_id], name: 'index_act_category_acts_on_act_id_and_act_cat_id'
  end
end
