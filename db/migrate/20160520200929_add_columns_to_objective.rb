class AddColumnsToObjective < ActiveRecord::Migration
  def change
    add_column :objectives, :help_info, :string
    add_column :objectives, :section, :string
    add_column :objectives, :action_url, :string
    add_column :objectives, :section_placement, :integer
    add_column :objectives, :archived, :boolean, default: false
  end
end
