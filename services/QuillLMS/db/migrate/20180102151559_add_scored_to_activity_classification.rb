class AddScoredToActivityClassification < ActiveRecord::Migration[4.2]
  def change
    add_column :activity_classifications, :scored, :boolean, default: true
  end
end
