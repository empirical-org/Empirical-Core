class AddAuthorToUnitTemplates < ActiveRecord::Migration[4.2]
  def change
    add_reference :unit_templates, :author, index: true
  end
end
