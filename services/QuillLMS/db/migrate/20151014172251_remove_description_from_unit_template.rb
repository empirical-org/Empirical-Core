class RemoveDescriptionFromUnitTemplate < ActiveRecord::Migration[4.2]
  def change
    remove_column :unit_templates, :description
  end
end
