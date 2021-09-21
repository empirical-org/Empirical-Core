class AddUnitTemplateCategoryReferenceToUnitTemplate < ActiveRecord::Migration[4.2]
  def change
    add_reference :unit_templates, :unit_template_category, index: true
  end
end
