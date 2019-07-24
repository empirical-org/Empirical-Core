class AddUnitTemplateToUnits < ActiveRecord::Migration
  def change
    add_reference :units, :unit_template, index: true, foreign_key: true
  end
end
