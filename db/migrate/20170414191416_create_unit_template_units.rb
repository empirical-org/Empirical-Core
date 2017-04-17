class CreateUnitTemplateUnits < ActiveRecord::Migration
  def change
    create_table :unit_template_units do |t|
      t.integer :unit_id, index: {unique: true}
      t.integer :unit_template_id, index: true
    end
  end
end
