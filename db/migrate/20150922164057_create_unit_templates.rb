class CreateUnitTemplates < ActiveRecord::Migration
  def change
    create_table :unit_templates do |t|
      t.string :name
    end
  end
end
