class AddStandardIdToActivities < ActiveRecord::Migration
  def change
    add_reference :activities, :standard, foreign_key: true
  end
end
