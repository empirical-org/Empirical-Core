class AddUnitTemplateCategoryReferenceToUnitTemplate < ActiveRecord::Migration
  def change
    add_reference :unit_templates, :unit_template_category, index: true
  end
end
