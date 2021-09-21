class AddSupportingInfoToActivities < ActiveRecord::Migration[4.2]
  def change
    add_column :activities, :supporting_info, :string
  end
end
