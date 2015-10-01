class CreateUnitTemplateCategories < ActiveRecord::Migration
  def change
    create_table :unit_template_categories do |t|
      t.string :name
    end
  end
end
