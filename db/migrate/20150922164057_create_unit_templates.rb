class CreateUnitTemplates < ActiveRecord::Migration
  def change
    create_table :unit_templates do |t|
      t.string :name
    end

    create_table :unit_templates_activities, id: false do |t|
      t.belongs_to :unit_template, index: true
      t.belongs_to :activity, index: true
    end
  end
end
