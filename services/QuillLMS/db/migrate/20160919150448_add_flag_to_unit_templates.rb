class AddFlagToUnitTemplates < ActiveRecord::Migration[4.2]
  def change
    add_column :unit_templates, :flag, :string
  end
end
