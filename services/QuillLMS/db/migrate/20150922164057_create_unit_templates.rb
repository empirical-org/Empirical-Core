class CreateUnitTemplates < ActiveRecord::Migration[4.2]
  def change
    create_table :unit_templates do |t|
      t.string :name
    end
  end
end
