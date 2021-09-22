class CreateUnitTemplateCategories < ActiveRecord::Migration[4.2]
  def change
    create_table :unit_template_categories do |t|
      t.string :name
    end
  end
end
