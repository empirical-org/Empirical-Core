class AddInstructionsToAssessments < ActiveRecord::Migration[4.2]
  def change
    add_column :assessments, :instructions, :text
  end
end
