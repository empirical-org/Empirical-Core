class AddParentActivityClassification < ActiveRecord::Migration[4.2]
  def change
    create_table :activity_classifications do |t|
      t.string :key
    end
  end
end
