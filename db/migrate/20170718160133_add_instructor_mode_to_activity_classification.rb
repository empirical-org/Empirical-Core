class AddInstructorModeToActivityClassification < ActiveRecord::Migration
  def change
      add_column :activity_classifications, :instructor_mode, :boolean, default: false
  end
end
