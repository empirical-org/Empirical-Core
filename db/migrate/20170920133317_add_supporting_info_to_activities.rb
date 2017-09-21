class AddSupportingInfoToActivities < ActiveRecord::Migration
  def change
    add_column :activities, :supporting_info, :string
  end
end
