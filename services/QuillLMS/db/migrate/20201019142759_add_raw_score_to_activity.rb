class AddRawScoreToActivity < ActiveRecord::Migration
  def change
    add_column :activities, :raw_score, :string
  end
end
