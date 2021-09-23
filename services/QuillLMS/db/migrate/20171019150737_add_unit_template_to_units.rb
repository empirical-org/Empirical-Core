class AddUnitTemplateToUnits < ActiveRecord::Migration[4.2]
  def change
    add_reference :units, :unit_template, index: true, foreign_key: true
  end
end
