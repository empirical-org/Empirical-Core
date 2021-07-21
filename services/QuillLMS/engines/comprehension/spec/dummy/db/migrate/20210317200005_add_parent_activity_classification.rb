class AddParentActivityClassification < ActiveRecord::Migration
  def change
    create_table :activity_classifications do |t|
      t.string :key
    end
  end
end
