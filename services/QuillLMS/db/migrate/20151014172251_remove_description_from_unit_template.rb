class RemoveDescriptionFromUnitTemplate < ActiveRecord::Migration
  def change
    remove_column :unit_templates, :description
  end
end
