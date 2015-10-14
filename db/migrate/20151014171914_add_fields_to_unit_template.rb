class AddFieldsToUnitTemplate < ActiveRecord::Migration
  def change
    add_column :unit_templates, :problem, :text
    add_column :unit_templates, :summary, :text
    add_column :unit_templates, :teacher_review, :text
  end
end
