class AddScoredToActivityClassification < ActiveRecord::Migration
  def change
    add_column :activity_classifications, :scored, :boolean, default: true
  end
end
