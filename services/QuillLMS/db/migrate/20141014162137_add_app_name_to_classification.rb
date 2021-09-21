class AddAppNameToClassification < ActiveRecord::Migration[4.2]
  def change

    add_column :activity_classifications, :app_name, :string

  end
end
