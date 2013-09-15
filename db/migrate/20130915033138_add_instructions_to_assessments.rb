class AddInstructionsToAssessments < ActiveRecord::Migration
  def change
    add_column :assessments, :instructions, :text
  end
end
