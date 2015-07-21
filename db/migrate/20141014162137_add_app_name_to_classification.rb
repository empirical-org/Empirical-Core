class AddAppNameToClassification < ActiveRecord::Migration
  def change

    add_column :activity_classifications, :app_name, :string

    ActivityClassification.find(1).try(:update_column,:app_name, 'grammar')
    ActivityClassification.find(2).try(:update_column, :app_name, 'grammar')

  end
end
