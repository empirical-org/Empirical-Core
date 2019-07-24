class AddAppNameToClassification < ActiveRecord::Migration
  def change

    add_column :activity_classifications, :app_name, :string

  end
end
