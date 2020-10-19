class AddRawScoreToActivity < ActiveRecord::Migration
  def change
    add_reference :activities, :raw_score, foreign_key: true
  end
end
