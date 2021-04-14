# This migration comes from comprehension (originally 20210316160648)
class AddNameToComprehensionActivities < ActiveRecord::Migration
  def change
    add_column :comprehension_activities, :name, :string
  end
end
