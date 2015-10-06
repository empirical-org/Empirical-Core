class AddAuthorToUnitTemplates < ActiveRecord::Migration
  def change
    add_reference :unit_templates, :author, index: true
  end
end
