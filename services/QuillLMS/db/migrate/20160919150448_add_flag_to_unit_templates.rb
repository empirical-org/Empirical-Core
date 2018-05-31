class AddFlagToUnitTemplates < ActiveRecord::Migration
  def change
    add_column :unit_templates, :flag, :string
  end
end
