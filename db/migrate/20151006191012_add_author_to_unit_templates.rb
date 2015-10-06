class AddAuthorToUnitTemplates < ActiveRecord::Migration
  def change
    add_column :unit_templates, :author, :string
  end
end
