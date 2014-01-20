class AddFieldsToActivityClassifications < ActiveRecord::Migration
  def change
    add_column :activity_classifications, :form_url, :string
    add_column :activity_classifications, :uid, :string
    add_column :activity_classifications, :module_url, :string
  end
end
