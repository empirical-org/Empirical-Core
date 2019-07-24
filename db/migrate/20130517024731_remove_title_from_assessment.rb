class RemoveTitleFromAssessment < ActiveRecord::Migration
  def up
  	remove_column :assessments, :title
  end

  def down
  	add_column :assessments, :title, :string
  end
end
